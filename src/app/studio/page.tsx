import { StudioQueryService } from "@/application/studio-query-service";

export default async function StudioOverviewPage() {
  const stats = await new StudioQueryService().overview();
  const rows = [
    ["Articles", stats.articles],
    ["Drafts", stats.drafts],
    ["Products", stats.products],
    ["Sources", stats.sources],
    ["Evidence", stats.evidence],
    ["Evidence awaiting review", stats.candidateEvidence],
    ["Findings", stats.findings],
  ] as const;

  return (
    <>
      <header className="studio-header">
        <p className="eyebrow">System overview</p>
        <h1>Editorial workspace</h1>
        <p>Live counts from the Actuals research and publication database. No seeded article metrics.</p>
      </header>
      <section className="studio-stat-table" aria-label="Actuals content system counts">
        {rows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </section>
      <section className="studio-next">
        <p className="eyebrow">Workflow</p>
        <h2>Source → evidence → finding → revision → review → publish.</h2>
        <p>The Studio will expose this workflow without allowing the UI to bypass domain and authorization rules.</p>
      </section>
    </>
  );
}
