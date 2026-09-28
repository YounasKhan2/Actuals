import { eq } from "drizzle-orm";
import type { ActualsDb } from "@/db";
import { evidence, findingEvidence, findings, products, sources, vendorFacts } from "@/db/schema";
import type { FindingInput, ProductInput, SourceInput, VendorFactInput } from "@/domain/contracts";

export class ResearchRepository {
  constructor(private readonly db: ActualsDb) {}

  async upsertSource(input: SourceInput) {
    const [row] = await this.db.insert(sources).values({
      url: input.url,
      publisher: input.publisher ?? null,
      type: input.type,
      publishedAt: input.publishedAt ?? null,
      lastVerifiedAt: input.lastVerifiedAt ?? null,
    }).onConflictDoUpdate({
      target: sources.url,
      set: {
        publisher: input.publisher ?? null,
        type: input.type,
        publishedAt: input.publishedAt ?? null,
        lastVerifiedAt: input.lastVerifiedAt ?? null,
        retrievedAt: new Date(),
      },
    }).returning();
    return row;
  }

  async createProduct(input: ProductInput) {
    const [row] = await this.db.insert(products).values(input).returning();
    return row;
  }

  async createVendorFact(input: VendorFactInput) {
    const [row] = await this.db.insert(vendorFacts).values({
      productId: input.productId,
      key: input.key,
      value: input.value,
      sourceId: input.sourceId,
      verifiedAt: input.verifiedAt,
      validFrom: input.validFrom ?? null,
    }).returning();
    return row;
  }

  async setEvidenceStatus(evidenceId: string, status: "retained" | "rejected" | "superseded") {
    const [current] = await this.db.select().from(evidence).where(eq(evidence.id, evidenceId)).limit(1);
    if (!current) throw new Error("Evidence not found");
    if (current.status === "superseded") throw new Error("Superseded evidence is immutable");
    if (current.status === "rejected" && status === "retained") throw new Error("Rejected evidence must be re-reviewed before retention");
    const [updated] = await this.db.update(evidence).set({ status, updatedAt: new Date() })
      .where(eq(evidence.id, evidenceId)).returning();
    return updated;
  }

  async createFinding(input: FindingInput) {
    return this.db.transaction(async (tx) => {
      const ids = [...new Set(input.evidence.map((item) => item.evidenceId))];
      const found = await Promise.all(ids.map(async (id) => {
        const [row] = await tx.select({ id: evidence.id }).from(evidence).where(eq(evidence.id, id)).limit(1);
        return row;
      }));
      if (found.some((item) => !item)) throw new Error("Finding references unknown evidence");

      const [finding] = await tx.insert(findings).values({
        title: input.title,
        summary: input.summary,
        editorialNotes: input.editorialNotes ?? null,
        status: "draft",
      }).returning();

      await tx.insert(findingEvidence).values(input.evidence.map((item) => ({
        findingId: finding.id,
        evidenceId: item.evidenceId,
        relationship: item.relationship,
      })));
      return finding;
    });
  }
}
