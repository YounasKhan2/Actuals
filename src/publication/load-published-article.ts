import { cache } from "react";
import { EditorialService } from "@/application/editorial-service";

export const loadPublishedArticle = cache(async (slug: string, expectedKind: string) => {
  const result = await new EditorialService().getPublishedArticle(slug);
  if (!result || result.article.kind !== expectedKind) return null;
  return result;
});
