export const siteConfig = {
  name: "Actuals",
  description:
    "Technology research beyond the marketing page: comparisons, reviews, guides, and open-source alternatives grounded in sources.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
