import type { CommunityEvidence } from "@/content/comparisons/railway-vs-render.community";

export function CommunityEvidenceSection({ evidence }: { evidence: CommunityEvidence[] }) {
  return (
    <section className="comparison-section" aria-labelledby="community-evidence">
      <div className="section-heading">
        <p className="eyebrow">User experiences</p>
        <h2 id="community-evidence">Reports with workload context, not a popularity vote.</h2>
        <p>
          Each item is a traceable report from its original author. A report can reveal a useful
          failure mode or workflow, but one report does not establish platform-wide behavior.
        </p>
      </div>
      <div className="experience-list">
        {evidence.map((item) => (
          <article className="experience" key={item.id}>
            <div className="experience-meta">
              <strong>{item.product}</strong>
              <span>{item.topic}</span>
              <span>{item.environment}</span>
              <span>{item.sourceDate}</span>
            </div>
            <p className="experience-copy">{item.publicParaphrase}</p>
            <p className="experience-context">{item.context}</p>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer">
              Open original {item.source === "reddit" ? "Reddit thread" : item.source === "hacker_news" ? "Hacker News discussion" : "GitHub source"} ↗
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
