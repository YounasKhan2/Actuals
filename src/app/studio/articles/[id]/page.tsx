import { notFound } from "next/navigation";
import { StudioQueryService } from "@/application/studio-query-service";
import { BlockComposer } from "@/components/studio/block-composer";
import { addRevisionAction, publishArticleAction, submitArticleAction } from "../../actions";

export default async function ArticleWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspace = await new StudioQueryService().articleWorkspace(id);
  if (!workspace) notFound();
  const { article, revisions, latest, blocks, researchOptions } = workspace;
  const composerOptions = {
    evidence: researchOptions.evidence.map((item) => ({ id: item.id, label: item.label })),
    findings: researchOptions.findings.map((item) => ({ id: item.id, label: item.label })),
    facts: researchOptions.facts.map((item) => ({ id: item.id, label: `${item.key}: ${JSON.stringify(item.value)}` })),
  };
  return <><header className="studio-header"><p className="eyebrow">{article.kind} · {article.status}</p><h1>{latest?.title ?? article.slug}</h1><p>{latest?.dek ?? "No deck yet."}</p></header>
    <div className="studio-workspace-meta"><span>{revisions.length} revision{revisions.length===1?"":"s"}</span><span>{blocks.length} block{blocks.length===1?"":"s"} in latest</span><span>{article.publishedRevisionId ? "published revision pinned" : "not published"}</span></div>
    <form className="studio-form studio-editor" action={addRevisionAction}>
      <input type="hidden" name="articleId" value={article.id} />
      <input name="title" defaultValue={latest?.title ?? ""} placeholder="Title" required />
      <input name="dek" defaultValue={latest?.dek ?? ""} placeholder="Deck" />
      <input name="seoTitle" defaultValue={latest?.seoTitle ?? ""} placeholder="SEO title (max 70)" />
      <input name="seoDescription" defaultValue={latest?.seoDescription ?? ""} placeholder="SEO description (max 180)" />
      <label className="studio-field"><span>Last researched</span><input type="date" name="lastResearchedAt" defaultValue={latest?.lastResearchedAt?.toISOString().slice(0,10) ?? ""} /></label>
      <label className="studio-field"><span>Facts verified</span><input type="date" name="factsVerifiedAt" defaultValue={latest?.factsVerifiedAt?.toISOString().slice(0,10) ?? ""} /></label>
      <BlockComposer initialBlocks={blocks} researchOptions={composerOptions} />
      <input name="changeNote" placeholder="What changed in this revision?" />
      <button>Create new revision</button>
    </form>
    <section className="studio-workflow-actions">
      {article.status==="draft"?<form action={submitArticleAction}><input type="hidden" name="articleId" value={article.id}/><button>Submit for review</button></form>:null}
      {article.status==="review"&&latest?<form action={publishArticleAction}><input type="hidden" name="articleId" value={article.id}/><input type="hidden" name="revisionId" value={latest.id}/><button>Publish revision {latest.revisionNumber}</button></form>:null}
    </section>
    <section className="studio-next"><p className="eyebrow">Revision history</p>{revisions.map(r=><div className="studio-revision" key={r.id}><strong>v{r.revisionNumber} · {r.title}</strong><span>{r.createdAt.toISOString()}</span><p>{r.changeNote ?? "No change note"}</p></div>)}</section>
  </>;
}
