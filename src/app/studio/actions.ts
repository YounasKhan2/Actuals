"use server";

import { revalidatePath } from "next/cache";
import { StudioCommandService } from "@/application/studio-command-service";
import { requireStudioActor } from "@/lib/studio-session";

const commands = new StudioCommandService();

export async function createSourceAction(form: FormData) {
  const actor = await requireStudioActor();
  const publishedAt = String(form.get("publishedAt") ?? "").trim();
  await commands.upsertSource(actor, {
    url: String(form.get("url") ?? ""),
    publisher: String(form.get("publisher") ?? "") || null,
    type: String(form.get("type") ?? "other"),
    ...(publishedAt ? { publishedAt } : {}),
    lastVerifiedAt: new Date(),
  });
  revalidatePath("/studio/sources");
}

export async function createProductAction(form: FormData) {
  const actor = await requireStudioActor();
  await commands.createProduct(actor, {
    slug: String(form.get("slug") ?? ""),
    name: String(form.get("name") ?? ""),
    websiteUrl: String(form.get("websiteUrl") ?? "") || null,
    description: String(form.get("description") ?? "") || null,
    isOpenSource: form.get("isOpenSource") === "on",
  });
  revalidatePath("/studio/products");
}

export async function captureEvidenceAction(form: FormData) {
  const actor = await requireStudioActor();
  const kind = String(form.get("kind") ?? "user_experience");
  await commands.captureEvidence(actor, {
    kind,
    sourceId: String(form.get("sourceId") ?? ""),
    productIds: [String(form.get("productId") ?? "")],
    publicParaphrase: String(form.get("publicParaphrase") ?? ""),
    sourceContext: String(form.get("sourceContext") ?? "") || null,
    themes: String(form.get("themes") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    ...(kind === "user_experience" ? {
      experienceType: String(form.get("experienceType") ?? "unknown"),
      environment: String(form.get("environment") ?? "unknown"),
    } : {}),
  });
  revalidatePath("/studio/evidence");
}

export async function retainEvidenceAction(form: FormData) {
  const actor = await requireStudioActor();
  await commands.retainEvidence(actor, String(form.get("evidenceId") ?? ""));
  revalidatePath("/studio/evidence");
}

export async function rejectEvidenceAction(form: FormData) {
  const actor = await requireStudioActor();
  await commands.rejectEvidence(actor, String(form.get("evidenceId") ?? ""));
  revalidatePath("/studio/evidence");
}

export async function createArticleAction(form: FormData) {
  const actor = await requireStudioActor();
  await commands.createArticle(actor, {
    slug: String(form.get("slug") ?? ""),
    kind: String(form.get("kind") ?? "overview"),
    revision: {
      title: String(form.get("title") ?? ""),
      dek: String(form.get("dek") ?? "") || null,
      blocks: [],
    },
  });
  revalidatePath("/studio/articles");
}

export async function addRevisionAction(form: FormData) {
  const actor = await requireStudioActor();
  const articleId = String(form.get("articleId") ?? "");
  const markdown = String(form.get("markdown") ?? "").trim();
  await commands.addRevision(actor, articleId, {
    title: String(form.get("title") ?? ""),
    dek: String(form.get("dek") ?? "") || null,
    changeNote: String(form.get("changeNote") ?? "") || null,
    blocks: markdown ? [{ type: "prose", payload: { markdown } }] : [],
  });
  revalidatePath(`/studio/articles/${articleId}`);
}

export async function submitArticleAction(form: FormData) {
  const actor = await requireStudioActor();
  const articleId = String(form.get("articleId") ?? "");
  await commands.submitForReview(actor, articleId);
  revalidatePath(`/studio/articles/${articleId}`);
}

export async function publishArticleAction(form: FormData) {
  const actor = await requireStudioActor();
  const articleId = String(form.get("articleId") ?? "");
  await commands.publishRevision(actor, articleId, String(form.get("revisionId") ?? ""));
  revalidatePath(`/studio/articles/${articleId}`);
}

export async function createFindingAction(form: FormData) {
  const actor = await requireStudioActor();
  const supports = form.getAll("supportingEvidenceId").map(String);
  const contradicts = form.getAll("contradictingEvidenceId").map(String);
  await commands.createFinding(actor, {
    title: String(form.get("title") ?? ""),
    summary: String(form.get("summary") ?? ""),
    editorialNotes: String(form.get("editorialNotes") ?? "") || null,
    evidence: [
      ...supports.map((evidenceId) => ({ evidenceId, relationship: "supports" })),
      ...contradicts.map((evidenceId) => ({ evidenceId, relationship: "contradicts" })),
    ],
  });
  revalidatePath("/studio/research");
}

export async function corroborateFindingAction(form: FormData) {
  const actor = await requireStudioActor();
  await commands.corroborateFinding(actor, String(form.get("findingId") ?? ""));
  revalidatePath("/studio/research");
}
