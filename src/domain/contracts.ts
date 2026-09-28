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

const structuredBlock = z.object({
  type: z.enum([
    "image", "quote", "comparison", "table", "code", "timeline", "pros_cons",
    "product_snapshot", "alternatives", "source_note", "callout",
  ]),
  payload: z.record(z.string(), z.unknown()),
});

export const articleBlockInput = z.discriminatedUnion("type", [
  proseBlock,
  headingBlock,
  referenceBlock,
  structuredBlock,
]);

export const articleRevisionInput = z.object({
  title: z.string().min(3).max(180),
  dek: z.string().max(320).nullable().optional(),
  seoTitle: z.string().max(70).nullable().optional(),
  seoDescription: z.string().max(180).nullable().optional(),
  changeNote: z.string().max(500).nullable().optional(),
  blocks: z.array(articleBlockInput).min(1),
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
export type FindingInput = z.infer<typeof findingInput>;
