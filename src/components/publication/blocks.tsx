type Block = { id: string; type: string; payload: unknown };

function record(payload: unknown): Record<string, unknown> {
  return payload && typeof payload === "object" && !Array.isArray(payload) ? payload as Record<string, unknown> : {};
}
function text(value: unknown) { return typeof value === "string" ? value : ""; }

export function PublicationBlocks({ blocks }: { blocks: Block[] }) {
  return <div className="publication-blocks">{blocks.map((block) => {
    const data = record(block.payload);
    if (block.type === "prose") return <p className="publication-prose" key={block.id}>{text(data.markdown)}</p>;
    if (block.type === "heading") return <h2 id={text(data.anchor)} key={block.id}>{text(data.text)}</h2>;
    if (block.type === "quote") return <blockquote key={block.id}>{text(data.text ?? data.content)}</blockquote>;
    if (block.type === "code") return <pre key={block.id}><code>{text(data.code ?? data.content)}</code></pre>;
    if (["verified_fact","evidence","finding"].includes(block.type)) return <aside className="publication-reference" key={block.id} data-reference-id={text(data.id)}><span>{block.type.replaceAll("_"," ")}</span><p>Referenced research item</p></aside>;
    return <section className={`publication-structured publication-${block.type}`} key={block.id}><span>{block.type.replaceAll("_"," ")}</span><p>{text(data.content)}</p></section>;
  })}</div>;
}
