import { getDb } from "@/db";
import { findingInput, productInput, sourceInput, vendorFactInput } from "@/domain/contracts";
import { ResearchRepository } from "@/repositories/research-repository";

export class ResearchService {
  private readonly repo = new ResearchRepository(getDb());

  upsertSource(input: unknown) {
    return this.repo.upsertSource(sourceInput.parse(input));
  }

  createProduct(input: unknown) {
    return this.repo.createProduct(productInput.parse(input));
  }

  createVendorFact(input: unknown) {
    return this.repo.createVendorFact(vendorFactInput.parse(input));
  }

  retainEvidence(evidenceId: string) {
    return this.repo.setEvidenceStatus(evidenceId, "retained");
  }

  rejectEvidence(evidenceId: string) {
    return this.repo.setEvidenceStatus(evidenceId, "rejected");
  }

  supersedeEvidence(evidenceId: string) {
    return this.repo.setEvidenceStatus(evidenceId, "superseded");
  }

  createFinding(input: unknown) {
    return this.repo.createFinding(findingInput.parse(input));
  }
}
