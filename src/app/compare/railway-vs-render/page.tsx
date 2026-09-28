import type { Metadata } from "next";
import { VerifiedFacts } from "@/components/research/verified-facts";
import { comparisonResearch } from "@/content/comparisons/railway-vs-render";
import { siteConfig } from "@/lib/site";

const title = "Railway vs Render";
const description = "Railway and Render compared using current official facts and, as research is completed, traceable user experiences.";

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

  const railwayFacts = comparisonResearch.facts.filter((fact) => fact.product === "railway");
  const renderFacts = comparisonResearch.facts.filter((fact) => fact.product === "render");

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="comparison shell">
        <header className="comparison-hero">
          <p className="eyebrow">Developer platforms · Comparison</p>
          <h1>Railway <span>vs</span> Render</h1>
          <p className="lede">
            Two developer platforms with different billing structures and operational trade-offs.
            Actuals separates documented facts from vendor claims and user experiences.
          </p>
          <div className="research-meta">
            <span>Last researched {comparisonResearch.researchedAt}</span>
            <span>{comparisonResearch.facts.length} verified facts in the current corpus</span>
            <span>User-experience research: in progress</span>
          </div>
        </header>

        <section className="quick-compare" aria-labelledby="quick-compare">
          <div className="section-heading">
            <p className="eyebrow">At a glance</p>
            <h2 id="quick-compare">The documented baseline.</h2>
          </div>
          <div className="compare-table" role="table" aria-label="Railway and Render documented baseline">
            <div className="compare-row compare-head" role="row">
              <span role="columnheader">Question</span>
              <strong role="columnheader">Railway</strong>
              <strong role="columnheader">Render</strong>
            </div>
            <div className="compare-row" role="row">
              <span role="cell">Entry workspace plan</span>
              <span role="cell">$5/mo Hobby, applied toward usage</span>
              <span role="cell">$0/mo Hobby + compute</span>
            </div>
            <div className="compare-row" role="row">
              <span role="cell">Team / production plan</span>
              <span role="cell">$20/mo Pro, applied toward usage</span>
              <span role="cell">$25/mo Pro + compute</span>
            </div>
            <div className="compare-row" role="row">
              <span role="cell">Documented regions</span>
              <span role="cell">4</span>
              <span role="cell">5</span>
            </div>
          </div>
        </section>

        <VerifiedFacts facts={[...railwayFacts, ...renderFacts]} />

        <section className="research-pending">
          <p className="eyebrow">Community evidence</p>
          <h2>No invented consensus.</h2>
          <p>
            User-experience findings will appear here only after traceable sources are collected,
            classified by context, and reviewed for repeated patterns and disagreement.
          </p>
        </section>
      </article>
    </main>
  );
}
