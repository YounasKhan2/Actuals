import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const articleKind = pgEnum("article_kind", [
  "comparison", "review", "overview", "alternatives", "guide", "explainer", "analysis",
]);
export const articleStatus = pgEnum("article_status", ["draft", "review", "published", "archived"]);
export const sourceType = pgEnum("source_type", [
  "official_docs", "pricing", "changelog", "status", "repository",
  "reddit", "hacker_news", "github_issue", "github_discussion", "forum", "review_site", "other",
]);
export const evidenceKind = pgEnum("evidence_kind", [
  "verified_fact", "vendor_claim", "user_experience",
]);
export const evidenceStatus = pgEnum("evidence_status", ["candidate", "retained", "rejected", "superseded"]);
export const findingStatus = pgEnum("finding_status", ["draft", "corroborated", "contested", "superseded"]);
export const experienceType = pgEnum("experience_type", ["first_hand", "second_hand", "opinion", "unknown"]);
export const environmentType = pgEnum("environment_type", ["production", "hobby", "evaluation", "unknown"]);
export const blockType = pgEnum("block_type", [
  "prose", "heading", "image", "quote", "verified_fact", "evidence", "finding",
  "comparison", "table", "code", "timeline", "pros_cons", "product_snapshot",
  "alternatives", "source_note", "callout",
]);
export const productRelationshipType = pgEnum("product_relationship_type", [
  "alternative", "competitor", "integrates_with", "built_on", "successor",
]);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
}, (t) => [uniqueIndex("categories_slug_uidx").on(t.slug)]);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  websiteUrl: text("website_url"),
  description: text("description"),
  isOpenSource: boolean("is_open_source").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex("products_slug_uidx").on(t.slug)]);

export const productCategories = pgTable("product_categories", {
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.productId, t.categoryId] })]);

export const productRelationships = pgTable("product_relationships", {
  fromProductId: uuid("from_product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  toProductId: uuid("to_product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  type: productRelationshipType("type").notNull(),
  note: text("note"),
}, (t) => [primaryKey({ columns: [t.fromProductId, t.toProductId, t.type] })]);

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  publisher: text("publisher"),
  type: sourceType("type").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  retrievedAt: timestamp("retrieved_at", { withTimezone: true }).defaultNow().notNull(),
  lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
}, (t) => [uniqueIndex("sources_url_uidx").on(t.url)]);

export const evidence = pgTable("evidence", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: evidenceKind("kind").notNull(),
  status: evidenceStatus("status").default("candidate").notNull(),
  sourceId: uuid("source_id").notNull().references(() => sources.id, { onDelete: "restrict" }),
  originalExcerpt: text("original_excerpt"),
  publicParaphrase: text("public_paraphrase").notNull(),
  sourceContext: text("source_context"),
  experienceType: experienceType("experience_type"),
  environment: environmentType("environment"),
  editorialNotes: text("editorial_notes"),
  sourceDate: timestamp("source_date", { withTimezone: true }),
  collectedAt: timestamp("collected_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [index("evidence_kind_status_idx").on(t.kind, t.status)]);

export const evidenceProducts = pgTable("evidence_products", {
  evidenceId: uuid("evidence_id").notNull().references(() => evidence.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  relevance: text("relevance"),
}, (t) => [primaryKey({ columns: [t.evidenceId, t.productId] })]);

export const evidenceThemes = pgTable("evidence_themes", {
  evidenceId: uuid("evidence_id").notNull().references(() => evidence.id, { onDelete: "cascade" }),
  theme: text("theme").notNull(),
}, (t) => [primaryKey({ columns: [t.evidenceId, t.theme] })]);

export const findings = pgTable("findings", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: findingStatus("status").default("draft").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  editorialNotes: text("editorial_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const findingEvidence = pgTable("finding_evidence", {
  findingId: uuid("finding_id").notNull().references(() => findings.id, { onDelete: "cascade" }),
  evidenceId: uuid("evidence_id").notNull().references(() => evidence.id, { onDelete: "restrict" }),
  relationship: text("relationship").notNull(),
}, (t) => [primaryKey({ columns: [t.findingId, t.evidenceId] })]);

export const vendorFacts = pgTable("vendor_facts", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  sourceId: uuid("source_id").notNull().references(() => sources.id, { onDelete: "restrict" }),
  verifiedAt: timestamp("verified_at", { withTimezone: true }).notNull(),
  validFrom: timestamp("valid_from", { withTimezone: true }),
  supersededAt: timestamp("superseded_at", { withTimezone: true }),
}, (t) => [index("vendor_facts_product_key_idx").on(t.productId, t.key)]);

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull(),
  kind: articleKind("kind").notNull(),
  status: articleStatus("status").default("draft").notNull(),
  publishedRevisionId: uuid("published_revision_id"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex("articles_slug_uidx").on(t.slug), index("articles_status_kind_idx").on(t.status, t.kind)]);

export const articleRevisions = pgTable("article_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  revisionNumber: integer("revision_number").notNull(),
  title: text("title").notNull(),
  dek: text("dek"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  changeNote: text("change_note"),
  lastResearchedAt: timestamp("last_researched_at", { withTimezone: true }),
  factsVerifiedAt: timestamp("facts_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex("article_revision_number_uidx").on(t.articleId, t.revisionNumber)]);

export const articleBlocks = pgTable("article_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  revisionId: uuid("revision_id").notNull().references(() => articleRevisions.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  type: blockType("type").notNull(),
  payload: jsonb("payload").notNull(),
}, (t) => [uniqueIndex("article_blocks_position_uidx").on(t.revisionId, t.position)]);

export const articleProducts = pgTable("article_products", {
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
}, (t) => [primaryKey({ columns: [t.articleId, t.productId, t.role] })]);

export const articleEvidence = pgTable("article_evidence", {
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  evidenceId: uuid("evidence_id").notNull().references(() => evidence.id, { onDelete: "restrict" }),
}, (t) => [primaryKey({ columns: [t.articleId, t.evidenceId] })]);

export const articleFindings = pgTable("article_findings", {
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  findingId: uuid("finding_id").notNull().references(() => findings.id, { onDelete: "restrict" }),
}, (t) => [primaryKey({ columns: [t.articleId, t.findingId] })]);
