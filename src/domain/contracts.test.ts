import { describe, expect, it } from "vitest";
import { articleBlockInput } from "./contracts";

describe("typed editorial block contracts", () => {
  it("accepts a valid comparison matrix", () => {
    expect(articleBlockInput.parse({ type:"comparison", payload:{ left:"Railway", right:"Render", rows:[{ criterion:"Pricing model", left:"Usage-based", right:"Plan compute" }] } }).type).toBe("comparison");
  });
  it("rejects a comparison without rows", () => {
    expect(() => articleBlockInput.parse({ type:"comparison", payload:{ left:"A", right:"B", rows:[] } })).toThrow();
  });
  it("requires both pros and cons", () => {
    expect(() => articleBlockInput.parse({ type:"pros_cons", payload:{ pros:["Fast"], cons:[] } })).toThrow();
  });
  it("requires accessible image alt text", () => {
    expect(() => articleBlockInput.parse({ type:"image", payload:{ src:"https://example.com/image.png", alt:"" } })).toThrow();
  });
  it("accepts retained research references only as UUID-shaped block references", () => {
    expect(() => articleBlockInput.parse({ type:"evidence", payload:{ id:"not-an-id" } })).toThrow();
    expect(articleBlockInput.parse({ type:"evidence", payload:{ id:"00000000-0000-4000-8000-000000000000" } }).type).toBe("evidence");
  });
});
