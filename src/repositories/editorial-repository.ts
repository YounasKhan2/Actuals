import { and, asc, eq, max, sql } from "drizzle-orm";
import type { ActualsDb } from "@/db";
import {
  articleBlocks, articleEvidence, articleFindings, articleRevisions, articles,
  evidence, evidenceProducts, evidenceThemes, findingEvidence, findings, sources,
} from "@/db/schema";
import type { CreateArticleInput, EvidenceInput } from "@/domain/contracts";
import { assertCanCorroborateFinding, prepareEvidence, preparePublish } from "@/domain/editorial-service";

export class EditorialRepository {
  constructor(private readonly db: ActualsDb) {}

  async createArticle(input: CreateArticleInput) {
    return this.db.transaction(async (tx) => {
      const [article] = await tx.insert(articles).values({
        slug: input.slug, kind: input.kind, status: "draft",
      }).returning();
      const [revision] = await tx.insert(articleRevisions).values({
        articleId: article.id, revisionNumber: 1, title: input.revision.title,
        dek: input.revision.dek ?? null, seoTitle: input.revision.seoTitle ?? null,
        seoDescription: input.revision.seoDescription ?? null, changeNote: input.revision.changeNote ?? null,
      }).returning();
      await tx.insert(articleBlocks).values(input.revision.blocks.map((block, position) => ({
        revisionId: revision.id, position, type: block.type, payload: block.payload,
      })));
      return { article, revision };
    });
  }

  async addRevision(articleId: string, input: CreateArticleInput["revision"]) {
    return this.db.transaction(async (tx) => {
      const [row] = await tx.select({ value: max(articleRevisions.revisionNumber) })
        .from(articleRevisions).where(eq(articleRevisions.articleId, articleId));
      const revisionNumber = (row?.value ?? 0) + 1;
      const [revision] = await tx.insert(articleRevisions).values({
        articleId, revisionNumber, title: input.title, dek: input.dek ?? null,
        seoTitle: input.seoTitle ?? null, seoDescription: input.seoDescription ?? null,
        changeNote: input.changeNote ?? null,
      }).returning();
      await tx.insert(articleBlocks).values(input.blocks.map((block, position) => ({
        revisionId: revision.id, position, type: block.type, payload: block.payload,
      })));
      return revision;
    });
  }

  async captureEvidence(input: EvidenceInput) {
    const prepared = prepareEvidence(input);
    return this.db.transaction(async (tx) => {
      const [item] = await tx.insert(evidence).values(prepared.evidence).returning();
      await tx.insert(evidenceProducts).values(prepared.productIds.map((productId) => ({ evidenceId: item.id, productId })));
      if (prepared.themes.length) await tx.insert(evidenceThemes).values(prepared.themes.map((theme) => ({ evidenceId: item.id, theme })));
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

      const normalized = rows.map((row) => ({
        ...row,
        relationship: row.relationship as "supports" | "contradicts" | "context",
      }));
      assertCanCorroborateFinding(normalized);
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
      const { assertArticleTransition } = await import("@/domain/article-lifecycle");
      assertArticleTransition(article.status, to);
      const [updated] = await tx.update(articles).set({ status: to, updatedAt: new Date() })
        .where(eq(articles.id, articleId)).returning();
      return updated;
    });
  }

  async publishRevision(articleId: string, revisionId: string) {
    return this.db.transaction(async (tx) => {
      const [article] = await tx.select().from(articles).where(eq(articles.id, articleId)).limit(1);
      if (!article) throw new Error("Article not found");
      const [revision] = await tx.select().from(articleRevisions)
        .where(and(eq(articleRevisions.id, revisionId), eq(articleRevisions.articleId, articleId))).limit(1);
      if (!revision) throw new Error("Revision does not belong to this article");
      const publication = preparePublish(article.status, {
        id: revision.id, articleId: revision.articleId, revisionNumber: revision.revisionNumber, title: revision.title,
      });
      const [updated] = await tx.update(articles).set({ ...publication, updatedAt: new Date() })
        .where(eq(articles.id, articleId)).returning();
      return updated;
    });
  }

  async getPublishedArticle(slug: string) {
    const [article] = await this.db.select().from(articles)
      .where(and(eq(articles.slug, slug), eq(articles.status, "published"))).limit(1);
    if (!article?.publishedRevisionId) return null;
    const [revision] = await this.db.select().from(articleRevisions)
      .where(eq(articleRevisions.id, article.publishedRevisionId)).limit(1);
    if (!revision) return null;
    const blocks = await this.db.select().from(articleBlocks)
      .where(eq(articleBlocks.revisionId, revision.id)).orderBy(asc(articleBlocks.position));
    return { article, revision, blocks };
  }
}
