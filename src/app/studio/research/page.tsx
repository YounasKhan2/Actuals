import { StudioQueryService } from "@/application/studio-query-service";
import { corroborateFindingAction, createFindingAction } from "../actions";

export default async function ResearchPage() {
  const query = new StudioQueryService();
  const [findings, evidence] = await Promise.all([query.listFindings(), query.listEvidence()]);
  const retained = evidence.filter((item) => item.status === "retained");
  return <><header className="studio-header"><p className="eyebrow">Synthesis</p><h1>Research</h1><p>Build editorial findings from retained evidence. Corroboration is a separate review action and requires independent supporting sources.</p></header>
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
