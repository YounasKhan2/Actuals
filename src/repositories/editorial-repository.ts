import { and, asc, count, desc, eq, ilike, inArray, max, or, sql } from "drizzle-orm";
import type { ActualsDb } from "@/db";
import {
  articleBlocks, articleRevisions, articles, authors, evidence, evidenceProducts, evidenceThemes,
  findingEvidence, findings, sources, vendorFacts,
} from "@/db/schema";
import { assertArticleTransition } from "@/domain/article-lifecycle";
import type { CreateArticleInput, EvidenceInput } from "@/domain/contracts";
import { assertCanCorroborateFinding, prepareEvidence, preparePublish } from "@/domain/editorial-service";

export class EditorialRepository {
  constructor(private readonly db: ActualsDb) {}

  async createArticle(input: CreateArticleInput) {
    return this.db.transaction(async (tx) => {
      const [article] = await tx.insert(articles).values({
        slug: input.slug, kind: input.kind, authorId: input.authorId ?? null, status: "draft",
      }).returning();
      const [revision] = await tx.insert(articleRevisions).values({
        articleId: article.id, revisionNumber: 1, title: input.revision.title,
        dek: input.revision.dek ?? null, seoTitle: input.revision.seoTitle ?? null,
        seoDescription: input.revision.seoDescription ?? null, changeNote: input.revision.changeNote ?? null,
        lastResearchedAt: input.revision.lastResearchedAt ?? null, factsVerifiedAt: input.revision.factsVerifiedAt ?? null,
      }).returning();
      if (input.revision.blocks.length) {
        await tx.insert(articleBlocks).values(input.revision.blocks.map((block, position) => ({
          revisionId: revision.id, position, type: block.type, payload: block.payload,
        })));
      }
      return { article, revision };
    });
  }

  async addRevision(articleId: string, input: CreateArticleInput["revision"]) {
    return this.db.transaction(async (tx) => {
      await tx.execute(sql`select id from articles where id = ${articleId} for update`);
      const [row] = await tx.select({ value: max(articleRevisions.revisionNumber) })
        .from(articleRevisions).where(eq(articleRevisions.articleId, articleId));
      const revisionNumber = (row?.value ?? 0) + 1;
      const [revision] = await tx.insert(articleRevisions).values({
        articleId, revisionNumber, title: input.title, dek: input.dek ?? null,
        seoTitle: input.seoTitle ?? null, seoDescription: input.seoDescription ?? null,
        changeNote: input.changeNote ?? null,
        lastResearchedAt: input.lastResearchedAt ?? null,
        factsVerifiedAt: input.factsVerifiedAt ?? null,
      }).returning();
      if (input.blocks.length) {
        await tx.insert(articleBlocks).values(input.blocks.map((block, position) => ({
          revisionId: revision.id, position, type: block.type, payload: block.payload,
        })));
      }
      return revision;
    });
  }

  async captureEvidence(input: EvidenceInput) {
    const prepared = prepareEvidence(input);
    return this.db.transaction(async (tx) => {
      const [item] = await tx.insert(evidence).values(prepared.evidence).returning();
      await tx.insert(evidenceProducts).values(prepared.productIds.map((productId) => ({ evidenceId: item.id, productId })));
      if (prepared.themes.length) {
        await tx.insert(evidenceThemes).values(prepared.themes.map((theme) => ({ evidenceId: item.id, theme })));
      }
      return item;
    });
  }

  async corroborateFinding(findingId: string) {
    return this.db.transaction(async (tx) => {
      const rows = await tx.select({
        evidenceId: evidence.id, sourceId: evidence.sourceId, status: evidence.status,
        relationship: findingEvidence.relationship,
      }).from(findingEvidence)
        .innerJoin(evidence, eq(evidence.id, findingEvidence.evidenceId))
        .where(eq(findingEvidence.findingId, findingId));

      assertCanCorroborateFinding(rows);
      const [finding] = await tx.update(findings).set({ status: "corroborated", updatedAt: new Date() })
        .where(eq(findings.id, findingId)).returning();
      if (!finding) throw new Error("Finding not found");
      return finding;
    });
  }

  async transitionArticle(articleId: string, to: "draft" | "review" | "archived") {
    return this.db.transaction(async (tx) => {
      const [article] = await tx.select().from(articles).where(eq(articles.id, articleId)).limit(1);
      if (!article) throw new Error("Article not found");
      assertArticleTransition(article.status, to);

      if (to === "review") {
        const [latest] = await tx.select().from(articleRevisions)
          .where(eq(articleRevisions.articleId, articleId))
          .orderBy(desc(articleRevisions.revisionNumber)).limit(1);
        if (!latest) throw new Error("Cannot review an article without a revision");
        const [blockCount] = await tx.select({ value: count() }).from(articleBlocks)
          .where(eq(articleBlocks.revisionId, latest.id));
        if (blockCount.value < 1) throw new Error("Cannot review an empty revision");
        await this.assertValidResearchReferences(tx, latest.id);
      }

      const [updated] = await tx.update(articles).set({ status: to, updatedAt: new Date() })
        .where(eq(articles.id, articleId)).returning();
      return updated;
    });
  }

  private async assertValidResearchReferences(tx: Pick<ActualsDb, "select">, revisionId: string) {
    const blocks = await tx.select().from(articleBlocks).where(eq(articleBlocks.revisionId, revisionId));
    const ids = (type: string) => blocks.filter((block) => block.type === type).map((block) => {
      const payload = block.payload as Record<string, unknown>;
      return typeof payload.id === "string" ? payload.id : "";
    }).filter(Boolean);

    const evidenceIds = ids("evidence");
    if (evidenceIds.length) {
      const valid = await tx.select({ id: evidence.id }).from(evidence)
        .where(and(inArray(evidence.id, evidenceIds), eq(evidence.status, "retained")));
      if (new Set(valid.map((item) => item.id)).size !== new Set(evidenceIds).size) {
        throw new Error("Article contains evidence that is missing or not retained");
      }
    }

    const findingIds = ids("finding");
    if (findingIds.length) {
      const valid = await tx.select({ id: findings.id }).from(findings)
        .where(and(inArray(findings.id, findingIds), eq(findings.status, "corroborated")));
      if (new Set(valid.map((item) => item.id)).size !== new Set(findingIds).size) {
        throw new Error("Article contains findings that are missing or not corroborated");
      }
    }

    const factIds = ids("verified_fact");
    if (factIds.length) {
      const valid = await tx.select({ id: vendorFacts.id }).from(vendorFacts)
        .where(and(inArray(vendorFacts.id, factIds), sql`${vendorFacts.supersededAt} is null`));
      if (new Set(valid.map((item) => item.id)).size !== new Set(factIds).size) {
        throw new Error("Article contains facts that are missing or superseded");
      }
    }
  }

  async publishRevision(articleId: string, revisionId: string) {
    return this.db.transaction(async (tx) => {
      const [article] = await tx.select().from(articles).where(eq(articles.id, articleId)).limit(1);
      if (!article) throw new Error("Article not found");
      const [revision] = await tx.select().from(articleRevisions)
        .where(and(eq(articleRevisions.id, revisionId), eq(articleRevisions.articleId, articleId))).limit(1);
      if (!revision) throw new Error("Revision does not belong to this article");
      const [blockCount] = await tx.select({ value: count() }).from(articleBlocks)
        .where(eq(articleBlocks.revisionId, revisionId));
      if (blockCount.value < 1) throw new Error("Cannot publish an empty revision");
      await this.assertValidResearchReferences(tx, revisionId);

      const publication = preparePublish(article.status, {
        id: revision.id, articleId: revision.articleId, revisionNumber: revision.revisionNumber, title: revision.title,
      });
      const [updated] = await tx.update(articles).set({ ...publication, updatedAt: new Date() })
        .where(eq(articles.id, articleId)).returning();
      return updated;
    });
  }

  async listPublishedArticles(limit = 12) {
    return this.db.select({
      id: articles.id,
      slug: articles.slug,
      kind: articles.kind,
      publishedAt: articles.publishedAt,
      title: articleRevisions.title,
      dek: articleRevisions.dek,
    }).from(articles)
      .innerJoin(articleRevisions, eq(articleRevisions.id, articles.publishedRevisionId))
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async getAuthorPublication(slug: string) {
    const [author] = await this.db.select().from(authors).where(eq(authors.slug, slug)).limit(1);
    if (!author) return null;
    const items = await this.db.select({
      id: articles.id, slug: articles.slug, kind: articles.kind, publishedAt: articles.publishedAt,
      title: articleRevisions.title, dek: articleRevisions.dek,
    }).from(articles).innerJoin(articleRevisions, eq(articleRevisions.id, articles.publishedRevisionId))
      .where(and(eq(articles.status, "published"), eq(articles.authorId, author.id)))
      .orderBy(desc(articles.publishedAt));
    return { author, articles: items };
  }

  async searchPublishedArticles(query: string, limit = 20) {
    const term = `%${query.trim()}%`;
    if (!query.trim()) return [];
    return this.db.select({
      id: articles.id, slug: articles.slug, kind: articles.kind, publishedAt: articles.publishedAt,
      title: articleRevisions.title, dek: articleRevisions.dek,
    }).from(articles)
      .innerJoin(articleRevisions, eq(articleRevisions.id, articles.publishedRevisionId))
      .where(and(eq(articles.status, "published"), or(ilike(articleRevisions.title, term), ilike(articleRevisions.dek, term))))
      .orderBy(desc(articles.publishedAt)).limit(limit);
  }

  async getPublishedArticle(slug: string) {
    const [article] = await this.db.select().from(articles)
      .where(and(eq(articles.slug, slug), eq(articles.status, "published"))).limit(1);
    if (!article?.publishedRevisionId) return null;
    const [revision] = await this.db.select().from(articleRevisions)
      .where(eq(articleRevisions.id, article.publishedRevisionId)).limit(1);
    if (!revision) return null;
    const [author] = article.authorId ? await this.db.select().from(authors).where(eq(authors.id, article.authorId)).limit(1) : [];
    const blocks = await this.db.select().from(articleBlocks)
      .where(eq(articleBlocks.revisionId, revision.id)).orderBy(asc(articleBlocks.position));

    const referenceIds = (type: string) => blocks
      .filter((block) => block.type === type)
      .map((block) => {
        const payload = block.payload as Record<string, unknown>;
        return typeof payload?.id === "string" ? payload.id : null;
      })
      .filter((id): id is string => Boolean(id));

    const evidenceIds = referenceIds("evidence");
    const findingIds = referenceIds("finding");
    const factIds = referenceIds("verified_fact");
    const [evidenceRefs, findingRefs, factRefs] = await Promise.all([
      evidenceIds.length ? this.db.select().from(evidence).where(inArray(evidence.id, evidenceIds)) : Promise.resolve([]),
      findingIds.length ? this.db.select().from(findings).where(inArray(findings.id, findingIds)) : Promise.resolve([]),
      factIds.length ? this.db.select().from(vendorFacts).where(inArray(vendorFacts.id, factIds)) : Promise.resolve([]),
    ]);
    const sourceIds = [...new Set([...evidenceRefs.map((item) => item.sourceId), ...factRefs.map((item) => item.sourceId)])];
    const sourceRefs = sourceIds.length ? await this.db.select().from(sources).where(inArray(sources.id, sourceIds)) : [];
    const sourceMap = Object.fromEntries(sourceRefs.map((item) => [item.id, item]));

    return {
      article, revision, blocks, author: author ?? null,
      references: {
        evidence: Object.fromEntries(evidenceRefs.map((item) => [item.id, { ...item, source: sourceMap[item.sourceId] ?? null }])),
        finding: Object.fromEntries(findingRefs.map((item) => [item.id, item])),
        verified_fact: Object.fromEntries(factRefs.map((item) => [item.id, { ...item, source: sourceMap[item.sourceId] ?? null }])),
      },
    };
  }
}
