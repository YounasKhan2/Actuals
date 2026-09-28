import Image from "next/image";
type Block = { id: string; type: string; payload: unknown };
type ReferenceMap = Record<string, Record<string, unknown>>;
type References = { evidence: ReferenceMap; finding: ReferenceMap; verified_fact: ReferenceMap };
function record(payload: unknown):Record<string,unknown>{return payload&&typeof payload==="object"&&!Array.isArray(payload)?payload as Record<string,unknown>:{};}
function text(value:unknown){return typeof value==="string"?value:"";}
function strings(value:unknown){return Array.isArray(value)?value.filter((x):x is string=>typeof x==="string"):[];}
function SourceReceipt({item}:{item:Record<string,unknown>}){const source=record(item.source),url=text(source.url);if(!url)return null;return <a className="publication-source" href={url} target="_blank" rel="noreferrer">Source · {text(source.publisher)||text(source.type).replaceAll("_"," ")}</a>;}

export function PublicationBlocks({blocks,references}:{blocks:Block[];references:References}){
 return <div className="publication-blocks">{blocks.map(block=>{const data=record(block.payload);
  if(block.type==="prose")return <p className="publication-prose" key={block.id}>{text(data.markdown)}</p>;
  if(block.type==="heading")return <h2 id={text(data.anchor)} key={block.id}>{text(data.text)}</h2>;
  if(block.type==="quote")return <blockquote key={block.id}><p>{text(data.text)}</p>{text(data.attribution)?<cite>{text(data.attribution)}</cite>:null}</blockquote>;
  if(block.type==="code")return <pre key={block.id}><code>{text(data.code)}</code></pre>;
  if(block.type==="callout")return <aside className="publication-callout" key={block.id}>{text(data.title)?<strong>{text(data.title)}</strong>:null}<p>{text(data.body)}</p></aside>;
  if(block.type==="source_note")return <aside className="publication-source-note" key={block.id}><span>Source note</span><p>{text(data.body)}</p></aside>;
  if(block.type==="image")return <figure key={block.id}><Image className="publication-image" src={text(data.src)} alt={text(data.alt)} width={1200} height={675} sizes="(max-width: 760px) 100vw, 760px" unoptimized/>{text(data.caption)?<figcaption>{text(data.caption)}</figcaption>:null}</figure>;
  if(block.type==="pros_cons")return <section className="publication-pros-cons" key={block.id}><div><span>Pros</span><ul>{strings(data.pros).map((x,i)=><li key={i}>{x}</li>)}</ul></div><div><span>Cons</span><ul>{strings(data.cons).map((x,i)=><li key={i}>{x}</li>)}</ul></div></section>;
  if(block.type==="table"){const headers=strings(data.headers),rows=Array.isArray(data.rows)?data.rows:[];return <div className="publication-table-wrap" key={block.id}><table><thead><tr>{headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{strings(row).map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;}
  if(block.type==="timeline"){const items=Array.isArray(data.items)?data.items:[];return <ol className="publication-timeline" key={block.id}>{items.map((raw,i)=>{const x=record(raw);return <li key={i}><strong>{text(x.label)}</strong><p>{text(x.detail)}</p></li>})}</ol>;}
  if(block.type==="comparison"){const rows=Array.isArray(data.rows)?data.rows:[];return <div className="publication-table-wrap" key={block.id}><table><thead><tr><th>Criterion</th><th>{text(data.left)}</th><th>{text(data.right)}</th></tr></thead><tbody>{rows.map((raw,i)=>{const x=record(raw);return <tr key={i}><th>{text(x.criterion)}</th><td>{text(x.left)}</td><td>{text(x.right)}</td></tr>})}</tbody></table></div>;}
  if(block.type==="product_snapshot")return <section className="publication-snapshot" key={block.id}><span>Product snapshot</span><h3>{text(data.name)}</h3><p>{text(data.summary)}</p>{text(data.url)?<a href={text(data.url)} target="_blank" rel="noreferrer">Official website ↗</a>:null}</section>;
  if(block.type==="alternatives"){const items=Array.isArray(data.items)?data.items:[];return <section className="publication-alternatives" key={block.id}><span>Alternatives</span>{items.map((raw,i)=>{const x=record(raw);return <article key={i}><strong>{text(x.name)}</strong><p>{text(x.note)}</p>{text(x.url)?<a href={text(x.url)} target="_blank" rel="noreferrer">Visit ↗</a>:null}</article>})}</section>;}
  if(block.type==="evidence"){const item=references.evidence[text(data.id)];return item?<aside className="publication-reference" key={block.id}><span>User / source evidence</span><p>{text(item.publicParaphrase)}</p><SourceReceipt item={item}/></aside>:null;}
  if(block.type==="finding"){const item=references.finding[text(data.id)];return item?<aside className="publication-reference" key={block.id}><span>Corroborated finding</span><p>{text(item.summary)}</p></aside>:null;}
  if(block.type==="verified_fact"){const item=references.verified_fact[text(data.id)];return item?<aside className="publication-reference" key={block.id}><span>Verified fact · {text(item.key)}</span><p>{text(item.value)||JSON.stringify(item.value)}</p><SourceReceipt item={item}/></aside>:null;}
  return null;
 })}</div>;
}
