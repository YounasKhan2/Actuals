import {
  boolean,
  index,
  pgEnum,
  pgTable,
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
  "verified_fact", "vendor_claim", "user_experience", "corroborated_finding",
]);

export const experienceType = pgEnum("experience_type", ["first_hand", "second_hand", "opinion", "unknown"]);
export const environmentType = pgEnum("environment_type", ["production", "hobby", "evaluation", "unknown"]);

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

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  publisher: text("publisher"),
  type: sourceType("type").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  retrievedAt: timestamp("retrieved_at", { withTimezone: true }).defaultNow().notNull(),
  lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
}, (t) => [uniqueIndex("sources_url_uidx").on(t.url)]);

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull(),
  kind: articleKind("kind").notNull(),
  status: articleStatus("status").default("draft").notNull(),
  title: text("title").notNull(),
  dek: text("dek"),
  body: text("body"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  lastResearchedAt: timestamp("last_researched_at", { withTimezone: true }),
  factsVerifiedAt: timestamp("facts_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex("articles_slug_uidx").on(t.slug), index("articles_status_kind_idx").on(t.status, t.kind)]);

export const evidence = pgTable("evidence", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: evidenceKind("kind").notNull(),
  sourceId: uuid("source_id").references(() => sources.id, { onDelete: "restrict" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  originalExcerpt: text("original_excerpt"),
  publicParaphrase: text("public_paraphrase").notNull(),
  experienceType: experienceType("experience_type"),
  environment: environmentType("environment"),
  editorialNotes: text("editorial_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [index("evidence_product_kind_idx").on(t.productId, t.kind)]);

export const articleEvidence = pgTable("article_evidence", {
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  evidenceId: uuid("evidence_id").notNull().references(() => evidence.id, { onDelete: "cascade" }),
}, (t) => [uniqueIndex("article_evidence_uidx").on(t.articleId, t.evidenceId)]);

export const articleProducts = pgTable("article_products", {
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
}, (t) => [uniqueIndex("article_products_uidx").on(t.articleId, t.productId, t.role)]);
