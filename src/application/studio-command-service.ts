import { assertCan, type StudioRole } from "@/domain/authorization";
import { EditorialService } from "./editorial-service";
import { ResearchService } from "./research-service";

export type StudioActor = { userId: string; email: string; role: StudioRole };

export class StudioCommandService {
  private readonly editorial = new EditorialService();
  private readonly research = new ResearchService();

  createArticle(actor: StudioActor, input: unknown) {
    assertCan(actor.role, "article:write");
    return this.editorial.createArticle(input);
  }

  addRevision(actor: StudioActor, articleId: string, input: unknown) {
    assertCan(actor.role, "article:write");
    return this.editorial.addRevision(articleId, input);
  }

  submitForReview(actor: StudioActor, articleId: string) {
    assertCan(actor.role, "article:review");
    return this.editorial.submitForReview(articleId);
  }

  returnToDraft(actor: StudioActor, articleId: string) {
    assertCan(actor.role, "article:review");
    return this.editorial.returnToDraft(articleId);
  }

  publishRevision(actor: StudioActor, articleId: string, revisionId: string) {
    assertCan(actor.role, "article:publish");
    return this.editorial.publishRevision(articleId, revisionId);
  }

  archiveArticle(actor: StudioActor, articleId: string) {
    assertCan(actor.role, "article:review");
    return this.editorial.archiveArticle(articleId);
  }

  upsertSource(actor: StudioActor, input: unknown) {
    assertCan(actor.role, "research:write");
    return this.research.upsertSource(input);
  }

  createAuthor(actor: StudioActor, input: unknown) {
    assertCan(actor.role, "studio:manage");
    return this.research.createAuthor(input);
  }

  createProduct(actor: StudioActor, input: unknown) {
    assertCan(actor.role, "research:write");
    return this.research.createProduct(input);
  }

  createVendorFact(actor: StudioActor, input: unknown) {
    assertCan(actor.role, "research:write");
    return this.research.createVendorFact(input);
  }

  captureEvidence(actor: StudioActor, input: unknown) {
    assertCan(actor.role, "research:write");
    return this.editorial.captureEvidence(input);
  }

  retainEvidence(actor: StudioActor, evidenceId: string) {
    assertCan(actor.role, "research:write");
    return this.research.retainEvidence(evidenceId);
  }

  rejectEvidence(actor: StudioActor, evidenceId: string) {
    assertCan(actor.role, "research:write");
    return this.research.rejectEvidence(evidenceId);
  }

  createFinding(actor: StudioActor, input: unknown) {
    assertCan(actor.role, "research:write");
    return this.research.createFinding(input);
  }

  corroborateFinding(actor: StudioActor, findingId: string) {
    assertCan(actor.role, "article:review");
    return this.editorial.corroborateFinding(findingId);
  }
}
