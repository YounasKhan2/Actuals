"use client";

import { useMemo, useState } from "react";

type BlockDraft = { key: string; type: string; value: string };
type ReferenceOption = { id: string; label: string };
type ResearchOptions = { evidence: ReferenceOption[]; findings: ReferenceOption[]; facts: ReferenceOption[] };
const types = ["prose","heading","quote","code","callout","verified_fact","evidence","finding","comparison","table","timeline","pros_cons","product_snapshot","alternatives","source_note","image"] as const;

function lines(value: string) { return value.split("\n").map(x=>x.trim()).filter(Boolean); }
function payload(block: BlockDraft): Record<string, unknown> {
  const value = block.value.trim();
  if (block.type === "prose") return { markdown: value };
  if (block.type === "heading") return { level: 2, text: value, anchor: value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "section" };
  if (["verified_fact","evidence","finding"].includes(block.type)) return { id: value };
  if (block.type === "quote") { const [text,...rest]=lines(value); return { text, ...(rest.length?{attribution:rest.join(" ")}:{}) }; }
  if (block.type === "code") return { code: block.value, language: "text" };
  if (block.type === "callout") { const [title,...body]=lines(value); return { title, body: body.join("\n") || title }; }
  if (block.type === "source_note") return { body: value };
  if (block.type === "image") { const [src,alt,...caption]=lines(value); return { src, alt, ...(caption.length?{caption:caption.join(" ")}:{}) }; }
  if (block.type === "pros_cons") {
    const pros:string[]=[]; const cons:string[]=[]; let target=pros;
    for (const line of lines(value)) { if (/^cons:?$/i.test(line)) { target=cons; continue; } if (/^pros:?$/i.test(line)) { target=pros; continue; } target.push(line.replace(/^[-+]\s*/,"")); }
    return { pros, cons };
  }
  if (block.type === "table") { const rows=lines(value).map(line=>line.split("|").map(x=>x.trim())); return { headers: rows[0] ?? [], rows: rows.slice(1) }; }
  if (block.type === "timeline") return { items: lines(value).map(line=>{const [label,...detail]=line.split("|");return {label:label.trim(),detail:detail.join("|").trim()};}) };
  if (block.type === "comparison") {
    const rows=lines(value); const [left,right]=String(rows.shift() ?? "").split("|").map(x=>x.trim());
    return { left, right, rows: rows.map(line=>{const [criterion,l,r]=line.split("|").map(x=>x.trim());return {criterion,left:l??"",right:r??""};}) };
  }
  if (block.type === "product_snapshot") { const [name,summary,url]=lines(value); return { name, summary, ...(url?{url}:{}) }; }
  if (block.type === "alternatives") return { items: lines(value).map(line=>{const [name,note,url]=line.split("|").map(x=>x.trim());return {name,note,...(url?{url}:{})};}) };
  return {};
}

function initialValue(type:string,p:Record<string,unknown>) {
  if (typeof p.id==="string") return p.id; if(typeof p.markdown==="string") return p.markdown; if(typeof p.code==="string") return p.code;
  if(type==="quote") return [p.text,p.attribution].filter(Boolean).join("\n");
  if(type==="callout") return [p.title,p.body].filter(Boolean).join("\n");
  if(type==="source_note") return String(p.body??"");
  if(type==="image") return [p.src,p.alt,p.caption].filter(Boolean).join("\n");
  if(type==="pros_cons") return ["Pros:",...((p.pros as string[])??[]),"Cons:",...((p.cons as string[])??[])].join("\n");
  if(type==="table") return [((p.headers as string[])??[]).join(" | "),...((p.rows as string[][])??[]).map(r=>r.join(" | "))].join("\n");
  if(type==="timeline") return ((p.items as Array<{label:string;detail:string}>)??[]).map(x=>`${x.label} | ${x.detail}`).join("\n");
  if(type==="comparison") return [`${p.left??""} | ${p.right??""}`,...((p.rows as Array<{criterion:string;left:string;right:string}>)??[]).map(x=>`${x.criterion} | ${x.left} | ${x.right}`)].join("\n");
  if(type==="product_snapshot") return [p.name,p.summary,p.url].filter(Boolean).join("\n");
  if(type==="alternatives") return ((p.items as Array<{name:string;note:string;url?:string}>)??[]).map(x=>[x.name,x.note,x.url].filter(Boolean).join(" | ")).join("\n");
  return typeof p.text==="string"?p.text:"";
}
function initialDrafts(initialBlocks:Array<{id:string;type:string;payload:unknown}>):BlockDraft[]{return initialBlocks.map(block=>({key:block.id,type:block.type,value:initialValue(block.type,block.payload as Record<string,unknown>)}));}
function hint(type:string){
  const hints:Record<string,string>={comparison:"First line: Product A | Product B. Then: Criterion | A value | B value",table:"Header A | Header B, then one row per line",timeline:"Date/label | Detail, one event per line",pros_cons:"Pros:\nFast\nSimple\nCons:\nExpensive",product_snapshot:"Product name\nShort summary\nhttps://optional-url",alternatives:"Name | Why it matters | https://optional-url",image:"https://image-url\nAccessible alt text\nOptional caption",quote:"Quote text\nOptional attribution",callout:"Optional title\nCallout body",source_note:"Editorial source/method note"};
  return hints[type]??"Block content";
}

export function BlockComposer({initialBlocks=[],researchOptions}:{initialBlocks?:Array<{id:string;type:string;payload:unknown}>;researchOptions:ResearchOptions}) {
  const [blocks,setBlocks]=useState<BlockDraft[]>(()=>initialDrafts(initialBlocks));
  const serialized=useMemo(()=>JSON.stringify(blocks.filter(b=>b.value.trim()).map(b=>({type:b.type,payload:payload(b)}))),[blocks]);
  const add=(type:string)=>setBlocks(current=>[...current,{key:crypto.randomUUID(),type,value:""}]);
  const update=(key:string,value:string)=>setBlocks(current=>current.map(x=>x.key===key?{...x,value}:x));
  const move=(index:number,delta:number)=>setBlocks(current=>{const next=[...current],target=index+delta;if(target<0||target>=next.length)return current;[next[index],next[target]]=[next[target],next[index]];return next;});
  const options=(type:string)=>type==="evidence"?researchOptions.evidence:type==="finding"?researchOptions.findings:type==="verified_fact"?researchOptions.facts:[];

  return <div className="block-composer"><input type="hidden" name="blocksJson" value={serialized}/>
    <div className="block-toolbar">{types.map(type=><button type="button" key={type} onClick={()=>add(type)}>+ {type.replaceAll("_"," ")}</button>)}</div>
    <div className="block-stack">{blocks.map((block,index)=>{const refs=options(block.type);const isRef=["verified_fact","evidence","finding"].includes(block.type);return <div className="block-draft" key={block.key}>
      <div className="block-draft-head"><strong>{block.type.replaceAll("_"," ")}</strong><span><button type="button" onClick={()=>move(index,-1)}>↑</button><button type="button" onClick={()=>move(index,1)}>↓</button><button type="button" onClick={()=>setBlocks(current=>current.filter(x=>x.key!==block.key))}>×</button></span></div>
      {isRef?<select value={block.value} onChange={e=>update(block.key,e.target.value)}><option value="">Select {block.type.replaceAll("_"," ")}</option>{refs.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select>:<textarea value={block.value} onChange={e=>update(block.key,e.target.value)} placeholder={hint(block.type)}/>}
    </div>})}</div>
    {!blocks.length?<p className="studio-muted">No blocks yet. Add only the structures this article actually needs.</p>:null}
  </div>;
}
