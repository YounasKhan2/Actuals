import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { articles, authors } from "@/db/schema";
import { articlePath } from "@/publication/routes";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getDb();
  const published = await db.select({
    slug: articles.slug, kind: articles.kind, updatedAt: articles.updatedAt,
  }).from(articles).where(eq(articles.status, "published"));

  const bylines = await db.select({ slug: authors.slug, updatedAt: authors.updatedAt }).from(authors);
  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/methodology`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    ...bylines.map((author) => ({ url: `${siteConfig.url}/authors/${author.slug}`, lastModified: author.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...published.map((article) => ({
      url: `${siteConfig.url}${articlePath(article.kind, article.slug)}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
