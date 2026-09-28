import Link from "next/link";
import { EditorialService } from "@/application/editorial-service";
import { articlePath } from "@/publication/routes";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = q.trim() ? await new EditorialService().searchPublishedArticles(q) : [];
  return <main className="shell publication-directory">
    <header><p className="eyebrow">Research index</p><h1>Search Actuals</h1><form action="/search"><input name="q" defaultValue={q} placeholder="Search comparisons, reviews, guides…" autoFocus/><button>Search</button></form></header>
    <section className="publication-index">
      <div className="publication-index-head"><p className="eyebrow">{q ? `Results for “${q}”` : "Search published research"}</p><span>{results.length} found</span></div>
      {results.map(article=><Link className="publication-index-row" href={articlePath(article.kind,article.slug)} key={article.id}><span>{article.kind}</span><div><strong>{article.title}</strong>{article.dek?<p>{article.dek}</p>:null}</div><time>{article.publishedAt?.toISOString().slice(0,10)}</time></Link>)}
      {q && !results.length?<div className="publication-empty"><strong>No published research matched.</strong><p>Try a product name, category, or technology.</p></div>:null}
    </section>
  </main>;
}
