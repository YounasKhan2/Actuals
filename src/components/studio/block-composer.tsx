"use client";

import { useMemo, useState } from "react";

type BlockDraft = { key: string; type: string; value: string };

const types = ["prose","heading","quote","code","callout","verified_fact","evidence","finding","comparison","table","timeline","pros_cons","product_snapshot","alternatives","source_note","image"] as const;

function payload(block: BlockDraft) {
  if (block.type === "prose") return { markdown: block.value };
  if (block.type === "heading") return { level: 2, text: block.value, anchor: block.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section" };
  if (["verified_fact","evidence","finding"].includes(block.type)) return { id: block.value };
  if (block.type === "quote") return { text: block.value };
  if (block.type === "code") return { code: block.value, language: "text" };
  return { content: block.value };
}

export function BlockComposer() {
  const [blocks, setBlocks] = useState<BlockDraft[]>([]);
  const serialized = useMemo(() => JSON.stringify(blocks.filter(b => b.value.trim()).map(b => ({ type: b.type, payload: payload(b) }))), [blocks]);

  function add(type: string) {
    setBlocks(current => [...current, { key: crypto.randomUUID(), type, value: "" }]);
  }

  function move(index: number, delta: number) {
    setBlocks(current => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return <div className="block-composer">
    <input type="hidden" name="blocksJson" value={serialized} />
    <div className="block-toolbar">{types.map(type => <button type="button" key={type} onClick={() => add(type)}>+ {type.replaceAll("_"," ")}</button>)}</div>
    <div className="block-stack">{blocks.map((block,index) => <div className="block-draft" key={block.key}>
      <div className="block-draft-head"><strong>{block.type.replaceAll("_"," ")}</strong><span><button type="button" onClick={() => move(index,-1)}>↑</button><button type="button" onClick={() => move(index,1)}>↓</button><button type="button" onClick={() => setBlocks(current => current.filter(x => x.key !== block.key))}>×</button></span></div>
      <textarea value={block.value} onChange={event => setBlocks(current => current.map(x => x.key===block.key?{...x,value:event.target.value}:x))} placeholder={["verified_fact","evidence","finding"].includes(block.type) ? "Referenced UUID" : "Block content"} />
    </div>)}</div>
    {!blocks.length ? <p className="studio-muted">No blocks in the next revision yet. Add only the structures this article actually needs.</p> : null}
  </div>;
}
