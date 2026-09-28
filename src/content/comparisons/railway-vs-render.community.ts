export type CommunityEvidence = {
  id: string;
  product: "railway" | "render";
  topic: "dx" | "pricing" | "production" | "support" | "migration";
  source: "reddit" | "hacker_news" | "github";
  sourceUrl: string;
  sourceDate: string;
  collectedAt: string;
  context: string;
  publicParaphrase: string;
  experienceType: "first_hand" | "opinion";
  environment: "production" | "hobby" | "evaluation" | "unknown";
  status: "retained" | "context_only";
};

export const communityEvidence: CommunityEvidence[] = [
  {
    id: "railway-reddit-github-dx-low-traffic",
    product: "railway",
    topic: "dx",
    source: "reddit",
    sourceUrl: "https://www.reddit.com/r/devops/comments/1n87gc1/anyone_using_railway_or_render_for_deploying_stuff/",
    sourceDate: "2025-09-04",
    collectedAt: "2026-09-28",
    context: "Author described three low-traffic services: a Hono backend, PostgreSQL, and a cron backup service.",
    publicParaphrase: "The author found Railway's GitHub integration smooth and its built-in logging useful.",
    experienceType: "first_hand",
    environment: "unknown",
    status: "retained",
  },
  {
    id: "railway-reddit-cost-low-traffic",
    product: "railway",
    topic: "pricing",
    source: "reddit",
    sourceUrl: "https://www.reddit.com/r/devops/comments/1n87gc1/anyone_using_railway_or_render_for_deploying_stuff/",
    sourceDate: "2025-09-04",
    collectedAt: "2026-09-28",
    context: "Same three-service, low-traffic deployment; the author reported roughly $2.90 of usage and specifically raised egress cost as a concern.",
    publicParaphrase: "Even on a small workload, the author was watching usage and egress closely and later preferred a VPS to reduce ongoing cost.",
    experienceType: "first_hand",
    environment: "unknown",
    status: "retained",
  },
  {
    id: "railway-reddit-two-year-cms",
    product: "railway",
    topic: "production",
    source: "reddit",
    sourceUrl: "https://www.reddit.com/r/webdev/comments/1muoer4/render_vs_railway_for_saas/",
    sourceDate: "2025-08-19",
    collectedAt: "2026-09-28",
    context: "Author reported using Railway for roughly two years for a database and CMS, later stating traffic around 10–15k per month.",
    publicParaphrase: "A longer-running Railway user reported no complaints for a database-and-CMS workload at roughly 10–15k monthly traffic.",
    experienceType: "first_hand",
    environment: "production",
    status: "retained",
  },
  {
    id: "railway-reddit-rails-latency",
    product: "railway",
    topic: "production",
    source: "reddit",
    sourceUrl: "https://www.reddit.com/r/rails/comments/1s51mfc/railway_vs_render_heroku_digital_ocean_fly_etc/",
    sourceDate: "2026-03-27",
    collectedAt: "2026-09-28",
    context: "Author described migrating a long-running Rails monolith from Heroku and testing the same stack on Railway, Render, and DigitalOcean.",
    publicParaphrase: "The author reported substantially higher request queuing after the Railway migration, while their Render and DigitalOcean tests were closer to the latency they had seen on Heroku.",
    experienceType: "first_hand",
    environment: "production",
    status: "retained",
  },
  {
    id: "railway-reddit-rails-support",
    product: "railway",
    topic: "support",
    source: "reddit",
    sourceUrl: "https://www.reddit.com/r/rails/comments/1s51mfc/railway_vs_render_heroku_digital_ocean_fly_etc/",
    sourceDate: "2026-03-27",
    collectedAt: "2026-09-28",
    context: "Same Rails migration report; author said they were on Railway Pro while investigating the latency issue.",
    publicParaphrase: "During that performance investigation, the author said Railway support had not helped them resolve the issue.",
    experienceType: "first_hand",
    environment: "production",
    status: "retained",
  },
  {
    id: "render-hn-heroku-migration-low-traffic",
    product: "render",
    topic: "migration",
    source: "hacker_news",
    sourceUrl: "https://news.ycombinator.com/item?id=33077118",
    sourceDate: "2022-10-05",
    collectedAt: "2026-09-28",
    context: "Author moved a low-traffic Node.js + PostgreSQL videogame backend from Heroku to Render.",
    publicParaphrase: "The author described the migration as easy, requiring mainly environment-variable changes and a database migration, and reported better responsiveness and stability afterward.",
    experienceType: "first_hand",
    environment: "production",
    status: "context_only",
  },
  {
    id: "render-hn-go-migration-docs",
    product: "render",
    topic: "migration",
    source: "hacker_news",
    sourceUrl: "https://news.ycombinator.com/item?id=33077118",
    sourceDate: "2022-10-05",
    collectedAt: "2026-09-28",
    context: "Author described moving a Go app with about 20k users/month from Heroku to Render.",
    publicParaphrase: "The author said the migration took about a week and described documentation and support as pain points around Docker/buildpack setup.",
    experienceType: "first_hand",
    environment: "production",
    status: "context_only",
  },
  {
    id: "render-hn-sharp-edges",
    product: "render",
    topic: "production",
    source: "hacker_news",
    sourceUrl: "https://news.ycombinator.com/item?id=33300653",
    sourceDate: "2022-10-22",
    collectedAt: "2026-09-28",
    context: "Author said their team had used Render for about six months after leaving Heroku.",
    publicParaphrase: "The author reported intermittent logging problems, deploys around five minutes on their paid tier, and stale UI state that sometimes required a refresh.",
    experienceType: "first_hand",
    environment: "production",
    status: "context_only",
  },
];

export const retainedCommunityEvidence = communityEvidence.filter(
  (item) => item.status === "retained",
);
