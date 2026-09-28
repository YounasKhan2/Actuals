export const allowedArticleTransitions = {
  draft: ["review", "archived"],
  review: ["draft", "published", "archived"],
  published: ["draft", "archived"],
  archived: ["draft"],
} as const;

export type ArticleStatus = keyof typeof allowedArticleTransitions;

export function canTransitionArticle(from: ArticleStatus, to: ArticleStatus): boolean {
  return (allowedArticleTransitions[from] as readonly string[]).includes(to);
}

export function assertArticleTransition(from: ArticleStatus, to: ArticleStatus): void {
  if (!canTransitionArticle(from, to)) {
    throw new Error(`Invalid article transition: ${from} -> ${to}`);
  }
}
