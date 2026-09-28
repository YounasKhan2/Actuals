import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { articles, evidence, findings, products, sources } from "@/db/schema";

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
      articles: articleCount.value,
      drafts: draftCount.value,
      sources: sourceCount.value,
      evidence: evidenceCount.value,
      candidateEvidence: candidateCount.value,
      findings: findingCount.value,
      products: productCount.value,
    };
  }
}
