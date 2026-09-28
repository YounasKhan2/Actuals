import type { Metadata } from "next";
import { CommunityEvidenceSection } from "@/components/research/community-evidence";
import { VerifiedFacts } from "@/components/research/verified-facts";
import { comparisonResearch } from "@/content/comparisons/railway-vs-render";
import { retainedCommunityEvidence } from "@/content/comparisons/railway-vs-render.community";
import { siteConfig } from "@/lib/site";

const title = "Railway vs Render";
const description = "Railway and Render compared using current official facts and traceable user experiences.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/compare/railway-vs-render" },
  openGraph: { type: "article", title, description },
};

export default function RailwayVsRenderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Organization", name: "Actuals" },
    publisher: { "@type": "Organization", name: "Actuals" },
    mainEntityOfPage: `${siteConfig.url}/compare/railway-vs-render`,
    dateModified: comparisonResearch.researchedAt,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="comparison shell">
        <header className="comparison-hero">
          <p className="eyebrow">Developer platforms · Comparison</p>
          <h1>Railway <span>vs</span> Render</h1>
          <p className="lede">
            Two developer platforms with different billing structures and operational trade-offs.
            Actuals keeps documented facts separate from individual user experiences and later synthesis.
          </p>
          <div className="research-meta">
            <span>Last researched {comparisonResearch.researchedAt}</span>
            <span>{comparisonResearch.facts.length} verified facts</span>
            <span>{retainedCommunityEvidence.length} retained first-pass experiences</span>
          </div>
        </header>

        <section className="quick-compare" aria-labelledby="quick-compare">
          <div className="section-heading">
            <p className="eyebrow">At a glance</p>
            <h2 id="quick-compare">The documented baseline.</h2>
          </div>
          <div className="compare-table" role="table" aria-label="Railway and Render documented baseline">
            <div className="compare-row compare-head" role="row">
              <span role="columnheader">Question</span><strong role="columnheader">Railway</strong><strong role="columnheader">Render</strong>
            </div>
            <div className="compare-row" role="row">
              <span role="cell">Entry workspace plan</span><span role="cell">$5/mo Hobby, applied toward usage</span><span role="cell">$0/mo Hobby + compute</span>
            </div>
            <div className="compare-row" role="row">
              <span role="cell">Team / production plan</span><span role="cell">$20/mo Pro, applied toward usage</span><span role="cell">$25/mo Pro + compute</span>
            </div>
            <div className="compare-row" role="row">
              <span role="cell">Documented regions</span><span role="cell">4</span><span role="cell">5</span>
            </div>
          </div>
        </section>

        <VerifiedFacts facts={comparisonResearch.facts} />
        <CommunityEvidenceSection evidence={retainedCommunityEvidence} />

        <section className="research-pending">
          <p className="eyebrow">Corroborated findings</p>
          <h2>Not enough evidence yet.</h2>
          <p>
            Actuals will not turn this first evidence slice into a winner or broad consensus.
            Findings are added only when multiple independent, sufficiently contextual sources support the same pattern,
            with disagreement preserved.
          </p>
        </section>
      </article>
    </main>
  );
}
