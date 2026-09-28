export type VerifiedFact = {
  id: string;
  product: "railway" | "render";
  topic: "pricing" | "regions" | "operations";
  statement: string;
  sourceUrl: string;
  sourceLabel: string;
  verifiedAt: string;
};

export const verifiedFacts: VerifiedFact[] = [
  {
    id: "railway-hobby-price",
    product: "railway",
    topic: "pricing",
    statement: "Railway Hobby is $5/month and the subscription amount is applied toward resource usage.",
    sourceUrl: "https://docs.railway.com/pricing/plans",
    sourceLabel: "Railway Docs — Pricing Plans",
    verifiedAt: "2026-09-28",
  },
  {
    id: "railway-pro-price",
    product: "railway",
    topic: "pricing",
    statement: "Railway Pro is $20/month and the subscription amount is applied toward resource usage.",
    sourceUrl: "https://docs.railway.com/pricing",
    sourceLabel: "Railway Docs — Pricing",
    verifiedAt: "2026-09-28",
  },
  {
    id: "railway-regions",
    product: "railway",
    topic: "regions",
    statement: "Railway documents four selectable deployment regions: California, Virginia, Amsterdam, and Singapore.",
    sourceUrl: "https://docs.railway.com/deployments/regions",
    sourceLabel: "Railway Docs — Regions",
    verifiedAt: "2026-09-28",
  },
  {
    id: "render-hobby-price",
    product: "render",
    topic: "pricing",
    statement: "Render Hobby has no workspace subscription fee; compute and other metered usage are billed separately.",
    sourceUrl: "https://render.com/pricing",
    sourceLabel: "Render — Pricing",
    verifiedAt: "2026-09-28",
  },
  {
    id: "render-pro-price",
    product: "render",
    topic: "pricing",
    statement: "Render Pro is a $25/month flat workspace subscription, plus compute and metered usage.",
    sourceUrl: "https://render.com/pricing",
    sourceLabel: "Render — Pricing",
    verifiedAt: "2026-09-28",
  },
  {
    id: "render-regions",
    product: "render",
    topic: "regions",
    statement: "Render documents five service regions: Oregon, Ohio, Virginia, Frankfurt, and Singapore.",
    sourceUrl: "https://render.com/docs/regions",
    sourceLabel: "Render Docs — Regions",
    verifiedAt: "2026-09-28",
  },
  {
    id: "render-region-change",
    product: "render",
    topic: "operations",
    statement: "Render does not currently support changing the region of an existing service or database in place; its docs direct users to create a new resource and migrate.",
    sourceUrl: "https://render.com/docs/regions",
    sourceLabel: "Render Docs — Regions",
    verifiedAt: "2026-09-28",
  },
];

export const comparisonResearch = {
  slug: "railway-vs-render",
  title: "Railway vs Render",
  researchedAt: "2026-09-28",
  products: [
    { id: "railway" as const, name: "Railway" },
    { id: "render" as const, name: "Render" },
  ],
  facts: verifiedFacts,
};
