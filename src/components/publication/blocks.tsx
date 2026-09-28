type Block = { id: string; type: string; payload: unknown };
type ReferenceMap = Record<string, Record<string, unknown>>;
type References = { evidence: ReferenceMap; finding: ReferenceMap; verified_fact: ReferenceMap };

function record(payload: unknown): Record<string, unknown> {
  return payload && typeof payload === "object" && !Array.isArray(payload) ? payload as Record<string, unknown> : {};
}
function text(value: unknown) { return typeof value === "string" ? value : ""; }
function SourceReceipt({ item }: { item: Record<string, unknown> }) {
  const source = record(item.source);
  const url = text(source.url);
  if (!url) return null;
  return <a className="publication-source" href={url} target="_blank" rel="noreferrer">
    Source · {text(source.publisher) || text(source.type).replaceAll("_", " ")}
  </a>;
}

export function PublicationBlocks({ blocks, references }: { blocks: Block[]; references: References }) {
  return <div className="publication-blocks">{blocks.map((block) => {
    const data = record(block.payload);
    if (block.type === "prose") return <p className="publication-prose" key={block.id}>{text(data.markdown)}</p>;
    if (block.type === "heading") return <h2 id={text(data.anchor)} key={block.id}>{text(data.text)}</h2>;
    if (block.type === "quote") return <blockquote key={block.id}>{text(data.text ?? data.content)}</blockquote>;
    if (block.type === "code") return <pre key={block.id}><code>{text(data.code ?? data.content)}</code></pre>;
    if (block.type === "evidence") {
      const item = references.evidence[text(data.id)];
      return item ? <aside className="publication-reference" key={block.id}><span>User / source evidence</span><p>{text(item.publicParaphrase)}</p><SourceReceipt item={item} /></aside> : null;
    }
    if (block.type === "finding") {
      const item = references.finding[text(data.id)];
      return item ? <aside className="publication-reference" key={block.id}><span>Corroborated finding</span><p>{text(item.summary)}</p></aside> : null;
    }
    if (block.type === "verified_fact") {
      const item = references.verified_fact[text(data.id)];
      return item ? <aside className="publication-reference" key={block.id}><span>Verified fact · {text(item.key)}</span><p>{text(item.value) || JSON.stringify(item.value)}</p><SourceReceipt item={item} /></aside> : null;
    }
    return <section className={`publication-structured publication-${block.type}`} key={block.id}><span>{block.type.replaceAll("_"," ")}</span><p>{text(data.content)}</p></section>;
  })}</div>;
}
