import { z } from "zod";

export const articleKinds = [
  "comparison", "review", "overview", "alternatives", "guide", "explainer", "analysis",
] as const;

export const blockTypes = [
  "prose", "heading", "image", "quote", "verified_fact", "evidence", "finding",
  "comparison", "table", "code", "timeline", "pros_cons", "product_snapshot",
  "alternatives", "source_note", "callout",
] as const;

const proseBlock = z.object({
  type: z.literal("prose"),
  payload: z.object({ markdown: z.string().min(1) }),
});

const headingBlock = z.object({
  type: z.literal("heading"),
  payload: z.object({
    level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
    text: z.string().min(1),
    anchor: z.string().min(1),
  }),
});

const referenceBlock = z.object({
  type: z.enum(["verified_fact", "evidence", "finding"]),
  payload: z.object({ id: z.string().uuid() }),
});

const quoteBlock = z.object({ type: z.literal("quote"), payload: z.object({ text: z.string().min(1), attribution: z.string().max(200).optional() }) });
const codeBlock = z.object({ type: z.literal("code"), payload: z.object({ code: z.string().min(1), language: z.string().max(40).default("text") }) });
const calloutBlock = z.object({ type: z.literal("callout"), payload: z.object({ title: z.string().max(160).optional(), body: z.string().min(1) }) });
const sourceNoteBlock = z.object({ type: z.literal("source_note"), payload: z.object({ body: z.string().min(1) }) });
const imageBlock = z.object({ type: z.literal("image"), payload: z.object({ src: z.string().url(), alt: z.string().min(1).max(240), caption: z.string().max(500).optional() }) });
const prosConsBlock = z.object({ type: z.literal("pros_cons"), payload: z.object({ pros: z.array(z.string().min(1)).min(1), cons: z.array(z.string().min(1)).min(1) }) });
const tableBlock = z.object({ type: z.literal("table"), payload: z.object({ headers: z.array(z.string().min(1)).min(2), rows: z.array(z.array(z.string())).min(1) }) });
const timelineBlock = z.object({ type: z.literal("timeline"), payload: z.object({ items: z.array(z.object({ label: z.string().min(1), detail: z.string().min(1) })).min(1) }) });
const comparisonBlock = z.object({ type: z.literal("comparison"), payload: z.object({ left: z.string().min(1), right: z.string().min(1), rows: z.array(z.object({ criterion: z.string().min(1), left: z.string(), right: z.string() })).min(1) }) });
const productSnapshotBlock = z.object({ type: z.literal("product_snapshot"), payload: z.object({ name: z.string().min(1), summary: z.string().min(1), url: z.string().url().optional() }) });
const alternativesBlock = z.object({ type: z.literal("alternatives"), payload: z.object({ items: z.array(z.object({ name: z.string().min(1), note: z.string().min(1), url: z.string().url().optional() })).min(1) }) });

export const articleBlockInput = z.discriminatedUnion("type", [
  proseBlock,
  headingBlock,
  referenceBlock,
  quoteBlock,
  codeBlock,
  calloutBlock,
  sourceNoteBlock,
  imageBlock,
  prosConsBlock,
  tableBlock,
  timelineBlock,
  comparisonBlock,
  productSnapshotBlock,
  alternativesBlock,
]);

export const articleRevisionInput = z.object({
  title: z.string().min(3).max(180),
  dek: z.string().max(320).nullable().optional(),
  seoTitle: z.string().max(70).nullable().optional(),
  seoDescription: z.string().max(180).nullable().optional(),
  changeNote: z.string().max(500).nullable().optional(),
  lastResearchedAt: z.coerce.date().nullable().optional(),
  factsVerifiedAt: z.coerce.date().nullable().optional(),
  blocks: z.array(articleBlockInput).default([]),
});

export const createArticleInput = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.enum(articleKinds),
  revision: articleRevisionInput,
});

export const evidenceInput = z.object({
  kind: z.enum(["verified_fact", "vendor_claim", "user_experience"]),
  sourceId: z.string().uuid(),
  publicParaphrase: z.string().min(1),
  originalExcerpt: z.string().nullable().optional(),
  sourceContext: z.string().nullable().optional(),
  experienceType: z.enum(["first_hand", "second_hand", "opinion", "unknown"]).nullable().optional(),
  environment: z.enum(["production", "hobby", "evaluation", "unknown"]).nullable().optional(),
  productIds: z.array(z.string().uuid()).min(1),
  themes: z.array(z.string().min(1)).default([]),
});

export type CreateArticleInput = z.infer<typeof createArticleInput>;
export type ArticleBlockInput = z.infer<typeof articleBlockInput>;
export type EvidenceInput = z.infer<typeof evidenceInput>;

export const sourceInput = z.object({
  url: z.string().url(),
  publisher: z.string().min(1).max(160).nullable().optional(),
  type: z.enum(["official_docs","pricing","changelog","status","repository","reddit","hacker_news","github_issue","github_discussion","forum","review_site","other"]),
  publishedAt: z.coerce.date().nullable().optional(),
  lastVerifiedAt: z.coerce.date().nullable().optional(),
});

export const productInput = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1).max(120),
  websiteUrl: z.string().url().nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  isOpenSource: z.boolean().default(false),
});

export const findingInput = z.object({
  title: z.string().min(3).max(180),
  summary: z.string().min(3).max(2000),
  editorialNotes: z.string().max(4000).nullable().optional(),
  evidence: z.array(z.object({
    evidenceId: z.string().uuid(),
    relationship: z.enum(["supports","contradicts","context"]),
  })).min(1),
});

export type SourceInput = z.infer<typeof sourceInput>;
export type ProductInput = z.infer<typeof productInput>;
export const vendorFactInput = z.object({
  productId: z.string().uuid(),
  key: z.string().min(1).max(160),
  value: z.string().min(1).max(2000),
  sourceId: z.string().uuid(),
  verifiedAt: z.coerce.date(),
  validFrom: z.coerce.date().nullable().optional(),
});

export type FindingInput = z.infer<typeof findingInput>;
export type VendorFactInput = z.infer<typeof vendorFactInput>;
