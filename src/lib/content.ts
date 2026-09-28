export const articleKinds = [
  "comparison",
  "review",
  "overview",
  "alternatives",
  "guide",
  "explainer",
  "analysis",
] as const;

export type ArticleKind = (typeof articleKinds)[number];

export const evidenceKinds = [
  "verified_fact",
  "vendor_claim",
  "user_experience",
  "corroborated_finding",
] as const;

export type EvidenceKind = (typeof evidenceKinds)[number];
