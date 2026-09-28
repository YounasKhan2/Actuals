"use client";

import { useMemo, useState } from "react";

type BlockDraft = { key: string; type: string; value: string };
type ReferenceOption = { id: string; label: string };
type ResearchOptions = {
  evidence: ReferenceOption[];
  findings: ReferenceOption[];
  facts: ReferenceOption[];
};

const types = ["prose","heading","quote","code","callout","verified_fact","evidence","finding","comparison","table","timeline","pros_cons","product_snapshot","alternatives","source_note","image"] as const;

function payload(block: BlockDraft) {
  if (block.type === "prose") return { markdown: block.value };
  if (block.type === "heading") return { level: 2, text: block.value, anchor: block.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section" };
  if (["verified_fact","evidence","finding"].includes(block.type)) return { id: block.value };
  if (block.type === "quote") return { text: block.value };
  if (block.type === "code") return { code: block.value, language: "text" };
  return { content: block.value };
}

function initialDrafts(initialBlocks: Array<{ id: string; type: string; payload: unknown }>): BlockDraft[] {
  return initialBlocks.map((block) => {
    const p = block.payload as Record<string, unknown>;
    const value = typeof p.id === "string" ? p.id :
      typeof p.markdown === "string" ? p.markdown :
      typeof p.text === "string" ? p.text :
      typeof p.code === "string" ? p.code :
      typeof p.content === "string" ? p.content : "";
    return { key: block.id, type: block.type, value };
  });
}

export function BlockComposer({ initialBlocks = [], researchOptions }: {
  initialBlocks?: Array<{ id: string; type: string; payload: unknown }>;
  researchOptions: ResearchOptions;
}) {
  const [blocks, setBlocks] = useState<BlockDraft[]>(() => initialDrafts(initialBlocks));
  const serialized = useMemo(() => JSON.stringify(blocks.filter(b => b.value.trim()).map(b => ({ type: b.type, payload: payload(b) }))), [blocks]);

  function add(type: string) { setBlocks(current => [...current, { key: crypto.randomUUID(), type, value: "" }]); }
  function update(key: string, value: string) { setBlocks(current => current.map(x => x.key === key ? { ...x, value } : x)); }
  function move(index: number, delta: number) {
    setBlocks(current => {
      const next = [...current]; const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]]; return next;
    });
  }
  function options(type: string) {
    if (type === "evidence") return researchOptions.evidence;
    if (type === "finding") return researchOptions.findings;
    if (type === "verified_fact") return researchOptions.facts;
    return [];
  }

  return <div className="block-composer">
    <input type="hidden" name="blocksJson" value={serialized} />
    <div className="block-toolbar">{types.map(type => <button type="button" key={type} onClick={() => add(type)}>+ {type.replaceAll("_"," ")}</button>)}</div>
    <div className="block-stack">{blocks.map((block,index) => {
      const refs = options(block.type);
      return <div className="block-draft" key={block.key}>
        <div className="block-draft-head"><strong>{block.type.replaceAll("_"," ")}</strong><span><button type="button" onClick={() => move(index,-1)}>↑</button><button type="button" onClick={() => move(index,1)}>↓</button><button type="button" onClick={() => setBlocks(current => current.filter(x => x.key !== block.key))}>×</button></span></div>
        {refs.length || ["verified_fact","evidence","finding"].includes(block.type)
          ? <select value={block.value} onChange={event => update(block.key,event.target.value)}>
              <option value="">Select {block.type.replaceAll("_"," ")}</option>
              {refs.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          : <textarea value={block.value} onChange={event => update(block.key,event.target.value)} placeholder="Block content" />}
      </div>;
    })}</div>
    {!blocks.length ? <p className="studio-muted">No blocks yet. Add only the structures this article actually needs.</p> : null}
  </div>;
}
