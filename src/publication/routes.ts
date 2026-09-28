export const articleRoutePrefix = {
  comparison: "/compare",
  review: "/reviews",
  overview: "/products",
  alternatives: "/alternatives",
  guide: "/guides",
  explainer: "/explainers",
  analysis: "/analysis",
} as const;

export function articlePath(kind: keyof typeof articleRoutePrefix, slug: string) {
  return `${articleRoutePrefix[kind]}/${slug}`;
}
