import { StudioQueryService } from "@/application/studio-query-service";
import { corroborateFindingAction, createFindingAction, createVendorFactAction } from "../actions";

export default async function ResearchPage() {
  const query = new StudioQueryService();
  const [findings, evidence, products, sources, facts] = await Promise.all([
    query.listFindings(), query.listEvidence(), query.listProducts(), query.listSources(), query.listVendorFacts(),
  ]);
  const retained = evidence.filter((item) => item.status === "retained");
  return <><header className="studio-header"><p className="eyebrow">Synthesis</p><h1>Research</h1><p>Build editorial findings from retained evidence. Corroboration is a separate review action and requires independent supporting sources.</p></header>
    <section className="studio-next"><p className="eyebrow">Verified facts</p><h2>Capture an official fact</h2><p>Normalize a current vendor fact from an official source so articles can cite it without copying values into prose.</p></section>
    <form className="studio-form studio-editor" action={createVendorFactAction}>
      <select name="productId" required defaultValue=""><option value="" disabled>Product</option>{products.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select name="sourceId" required defaultValue=""><option value="" disabled>Official source</option>{sources.filter(item=>["official_docs","pricing","changelog","status","repository"].includes(item.type)).map(item=><option key={item.id} value={item.id}>{item.publisher ?? item.type} · {item.url}</option>)}</select>
      <input name="key" placeholder="Fact key — e.g. starter_price" required />
      <input name="value" placeholder="Value — e.g. $5/month" required />
      <label className="studio-field"><span>Verified at</span><input type="date" name="verifiedAt" required /></label>
      <label className="studio-field"><span>Valid from (optional)</span><input type="date" name="validFrom" /></label>
      <button>Create verified fact</button>
    </form>
    <div className="studio-list">{facts.map(fact=><article key={fact.id}><div><strong>{fact.key}</strong><p>{String(fact.value)}</p></div><div><span>verified {fact.verifiedAt.toISOString().slice(0,10)}</span>{fact.supersededAt?<span>superseded</span>:<span>current</span>}</div></article>)}</div>
    <form className="studio-form studio-editor" action={createFindingAction}>
      <input name="title" placeholder="Finding title" required />
      <textarea name="summary" placeholder="Careful synthesis — do not overgeneralize the evidence" required />
      <textarea name="editorialNotes" placeholder="Internal notes" />
      <label>Supporting evidence<select name="supportingEvidenceId" multiple size={Math.min(8, Math.max(3, retained.length))}>{retained.map(item=><option key={item.id} value={item.id}>{item.kind}: {item.publicParaphrase.slice(0,90)}</option>)}</select></label>
      <label>Contradicting evidence<select name="contradictingEvidenceId" multiple size={Math.min(6, Math.max(3, retained.length))}>{retained.map(item=><option key={item.id} value={item.id}>{item.kind}: {item.publicParaphrase.slice(0,90)}</option>)}</select></label>
      <button>Create draft finding</button>
    </form>
    <div className="studio-list">{findings.map(finding=><article key={finding.id}><div><strong>{finding.title}</strong><p>{finding.summary}</p></div><div><span>{finding.status}</span>{finding.status==="draft"?<form action={corroborateFindingAction}><input type="hidden" name="findingId" value={finding.id}/><button>Check corroboration</button></form>:null}</div></article>)}</div>
  </>;
}
