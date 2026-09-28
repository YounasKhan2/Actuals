import { StudioQueryService } from "@/application/studio-query-service";
import { captureEvidenceAction, rejectEvidenceAction, retainEvidenceAction } from "../actions";

export default async function EvidencePage() {
  const query = new StudioQueryService();
  const [items, sources, products] = await Promise.all([query.listEvidence(), query.listSources(), query.listProducts()]);
  return <><header className="studio-header"><p className="eyebrow">Research review</p><h1>Evidence</h1><p>Capture candidate evidence with provenance and context, then explicitly retain or reject it.</p></header>
    <form className="studio-form studio-form-evidence" action={captureEvidenceAction}>
      <select name="kind" defaultValue="user_experience"><option value="verified_fact">verified_fact</option><option value="vendor_claim">vendor_claim</option><option value="user_experience">user_experience</option></select>
      <select name="sourceId" required defaultValue=""><option value="" disabled>Source</option>{sources.map(x=><option value={x.id} key={x.id}>{x.publisher ?? x.url}</option>)}</select>
      <select name="productId" required defaultValue=""><option value="" disabled>Product</option>{products.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select>
      <input name="themes" placeholder="themes, comma, separated" />
      <textarea name="publicParaphrase" placeholder="Public paraphrase" required />
      <textarea name="sourceContext" placeholder="Workload / source context" />
      <select name="experienceType" defaultValue="unknown"><option>first_hand</option><option>second_hand</option><option>opinion</option><option>unknown</option></select>
      <select name="environment" defaultValue="unknown"><option>production</option><option>hobby</option><option>evaluation</option><option>unknown</option></select>
      <button>Capture candidate</button>
    </form>
    <div className="studio-list">{items.map(item=><article key={item.id}><div><strong>{item.kind}</strong><p>{item.publicParaphrase}</p></div><div><span>{item.status}</span><small>{item.collectedAt.toISOString().slice(0,10)}</small>{item.status==="candidate"?<div className="studio-row-actions"><form action={retainEvidenceAction}><input type="hidden" name="evidenceId" value={item.id}/><button>Retain</button></form><form action={rejectEvidenceAction}><input type="hidden" name="evidenceId" value={item.id}/><button>Reject</button></form></div>:null}</div></article>)}</div>
  </>;
}
