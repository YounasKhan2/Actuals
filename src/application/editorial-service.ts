import { getDb } from "@/db";
import { createArticleInput, evidenceInput, articleRevisionInput } from "@/domain/contracts";
import { EditorialRepository } from "@/repositories/editorial-repository";

export class EditorialService {
  private readonly repo = new EditorialRepository(getDb());

  createArticle(input: unknown) {
    return this.repo.createArticle(createArticleInput.parse(input));
  }

  addRevision(articleId: string, input: unknown) {
    return this.repo.addRevision(articleId, articleRevisionInput.parse(input));
  }

  captureEvidence(input: unknown) {
    return this.repo.captureEvidence(evidenceInput.parse(input));
  }

  corroborateFinding(findingId: string) {
    return this.repo.corroborateFinding(findingId);
  }

  submitForReview(articleId: string) {
    return this.repo.transitionArticle(articleId, "review");
  }

  returnToDraft(articleId: string) {
    return this.repo.transitionArticle(articleId, "draft");
  }

  archiveArticle(articleId: string) {
    return this.repo.transitionArticle(articleId, "archived");
  }

  publishRevision(articleId: string, revisionId: string) {
    return this.repo.publishRevision(articleId, revisionId);
  }

  getPublishedArticle(slug: string) {
    return this.repo.getPublishedArticle(slug);
  }
}
