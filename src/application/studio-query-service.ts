import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { articleBlocks, articleRevisions, articles, evidence, findings, products, sources, vendorFacts } from "@/db/schema";

export class StudioQueryService {
  private readonly db = getDb();

  async overview() {
    const [[articleCount], [draftCount], [sourceCount], [evidenceCount], [candidateCount], [findingCount], [productCount]] =
      await Promise.all([
        this.db.select({ value: count() }).from(articles),
        this.db.select({ value: count() }).from(articles).where(eq(articles.status, "draft")),
        this.db.select({ value: count() }).from(sources),
        this.db.select({ value: count() }).from(evidence),
        this.db.select({ value: count() }).from(evidence).where(eq(evidence.status, "candidate")),
        this.db.select({ value: count() }).from(findings),
        this.db.select({ value: count() }).from(products),
      ]);
    return {
      articles: articleCount.value, drafts: draftCount.value, sources: sourceCount.value,
      evidence: evidenceCount.value, candidateEvidence: candidateCount.value,
      findings: findingCount.value, products: productCount.value,
    };
  }

  listSources() {
    return this.db.select().from(sources).orderBy(desc(sources.retrievedAt)).limit(100);
  }

  listProducts() {
    return this.db.select().from(products).orderBy(products.name).limit(100);
  }

  listEvidence() {
    return this.db.select().from(evidence).orderBy(desc(evidence.collectedAt)).limit(100);
  }

  listFindings() {
    return this.db.select().from(findings).orderBy(desc(findings.updatedAt)).limit(100);
  }

  listArticles() {
    return this.db.select().from(articles).orderBy(desc(articles.updatedAt)).limit(100);
  }

  listRecentRevisions() {
    return this.db.select().from(articleRevisions)
      .orderBy(desc(articleRevisions.createdAt))
      .limit(100);
  }

  listSeoRevisions() {
    return this.db.select({
      articleId: articles.id,
      slug: articles.slug,
      kind: articles.kind,
      status: articles.status,
      revisionNumber: articleRevisions.revisionNumber,
      title: articleRevisions.title,
      seoTitle: articleRevisions.seoTitle,
      seoDescription: articleRevisions.seoDescription,
    }).from(articleRevisions)
      .innerJoin(articles, eq(articles.id, articleRevisions.articleId))
      .orderBy(desc(articleRevisions.createdAt))
      .limit(100);
  }

  async articleWorkspace(articleId: string) {
    const [article] = await this.db.select().from(articles).where(eq(articles.id, articleId)).limit(1);
    if (!article) return null;
    const revisions = await this.db.select().from(articleRevisions)
      .where(eq(articleRevisions.articleId, articleId)).orderBy(desc(articleRevisions.revisionNumber));
    const latest = revisions[0];
    const blocks = latest ? await this.db.select().from(articleBlocks)
      .where(eq(articleBlocks.revisionId, latest.id)).orderBy(articleBlocks.position) : [];
    const [evidenceOptions, findingOptions, factOptions] = await Promise.all([
      this.db.select({ id: evidence.id, label: evidence.publicParaphrase, status: evidence.status }).from(evidence)
        .where(eq(evidence.status, "retained")).orderBy(desc(evidence.updatedAt)).limit(100),
      this.db.select({ id: findings.id, label: findings.title, status: findings.status }).from(findings)
        .where(eq(findings.status, "corroborated")).orderBy(desc(findings.updatedAt)).limit(100),
      this.db.select({ id: vendorFacts.id, key: vendorFacts.key, value: vendorFacts.value, verifiedAt: vendorFacts.verifiedAt }).from(vendorFacts)
        .orderBy(desc(vendorFacts.verifiedAt)).limit(100),
    ]);
    return { article, revisions, latest, blocks, researchOptions: { evidence: evidenceOptions, findings: findingOptions, facts: factOptions } };
  }
}
