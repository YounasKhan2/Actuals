import { StudioQueryService } from "@/application/studio-query-service";
import { createSourceAction } from "../actions";

export default async function SourcesPage() {
  const sources = await new StudioQueryService().listSources();
  return <><header className="studio-header"><p className="eyebrow">Research corpus</p><h1>Sources</h1><p>Canonical provenance records. Re-adding the same URL updates its verification metadata instead of duplicating it.</p></header>
    <form className="studio-form" action={createSourceAction}>
      <input name="url" type="url" placeholder="Source URL" required />
      <input name="publisher" placeholder="Publisher" />
      <select name="type" defaultValue="official_docs">{["official_docs","pricing","changelog","status","repository","reddit","hacker_news","github_issue","github_discussion","forum","review_site","other"].map(x=><option key={x}>{x}</option>)}</select>
      <input name="publishedAt" type="date" aria-label="Published date" />
      <button>Add / verify source</button>
    </form>
    <div className="studio-list">{sources.map(source=><article key={source.id}><div><strong>{source.publisher ?? "Unknown publisher"}</strong><p>{source.url}</p></div><div><span>{source.type}</span><small>retrieved {source.retrievedAt.toISOString().slice(0,10)}</small></div></article>)}</div>
  </>;
}
