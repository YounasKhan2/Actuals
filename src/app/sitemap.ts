import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { articlePath } from "@/publication/routes";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = await getDb().select({
    slug: articles.slug, kind: articles.kind, updatedAt: articles.updatedAt,
  }).from(articles).where(eq(articles.status, "published"));

  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    ...published.map((article) => ({
      url: `${siteConfig.url}${articlePath(article.kind, article.slug)}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
