import Link from "next/link";
import { EditorialService } from "@/application/editorial-service";
import { articlePath } from "@/publication/routes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = await new EditorialService().listPublishedArticles(12);
  return (
    <main className="shell publication-home">
      <section className="publication-home-hero">
        <p className="eyebrow">Independent technology research</p>
        <h1>What software is actually like to use.</h1>
        <p>Actuals researches official facts, product claims, and traceable user experiences so technology decisions are not based on marketing pages alone.</p>
      </section>
      <section className="publication-index">
        <div className="publication-index-head"><p className="eyebrow">Latest research</p><span>{articles.length} published</span></div>
        {articles.length ? articles.map((article) => (
          <Link className="publication-index-row" href={articlePath(article.kind, article.slug)} key={article.id}>
            <span>{article.kind}</span>
            <div><strong>{article.title}</strong>{article.dek ? <p>{article.dek}</p> : null}</div>
            <time>{article.publishedAt?.toISOString().slice(0,10)}</time>
          </Link>
        )) : <div className="publication-empty"><strong>Research is being prepared.</strong><p>Published work will appear here after it completes Actuals' research, review, and publication workflow.</p></div>}
      </section>
    </main>
  );
}
