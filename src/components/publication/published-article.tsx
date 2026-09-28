import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationBlocks } from "@/components/publication/blocks";
import { loadPublishedArticle } from "@/publication/load-published-article";

export async function publishedMetadata(slug: string, kind: string): Promise<Metadata> {
  const result = await loadPublishedArticle(slug, kind);
  if (!result) return {};
  return {
    title: result.revision.seoTitle ?? result.revision.title,
    description: result.revision.seoDescription ?? result.revision.dek ?? undefined,
  };
}

export async function PublishedArticle({ slug, kind }: { slug: string; kind: string }) {
  const result = await loadPublishedArticle(slug, kind);
  if (!result) notFound();
  return <main className="publication shell"><article>
    <header className="publication-header">
      <p className="eyebrow">{result.article.kind}</p>
      <h1>{result.revision.title}</h1>
      {result.revision.dek ? <p>{result.revision.dek}</p> : null}
      <div className="publication-meta">
        <span>Revision {result.revision.revisionNumber}</span>
        {result.revision.lastResearchedAt ? <span>Researched {result.revision.lastResearchedAt.toISOString().slice(0,10)}</span> : null}
        {result.revision.factsVerifiedAt ? <span>Facts verified {result.revision.factsVerifiedAt.toISOString().slice(0,10)}</span> : null}
      </div>
    </header>
    <PublicationBlocks blocks={result.blocks} />
  </article></main>;
}
