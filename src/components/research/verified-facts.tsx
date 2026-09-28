import type { VerifiedFact } from "@/content/comparisons/railway-vs-render";

export function VerifiedFacts({ facts }: { facts: VerifiedFact[] }) {
  return (
    <section className="comparison-section" aria-labelledby="verified-facts">
      <div className="section-heading">
        <p className="eyebrow">Verified facts</p>
        <h2 id="verified-facts">Start with what the products document.</h2>
        <p>These facts come from first-party documentation and pricing pages. They are not community opinions or Actuals verdicts.</p>
      </div>
      <div className="fact-grid">
        {facts.map((fact) => (
          <article className="fact" key={fact.id}>
            <div className="fact-meta">
              <span>{fact.product}</span>
              <span>{fact.topic}</span>
            </div>
            <p>{fact.statement}</p>
            <a href={fact.sourceUrl} target="_blank" rel="noreferrer">
              {fact.sourceLabel} ↗
            </a>
            <small>Verified {fact.verifiedAt}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
