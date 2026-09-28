import { describe, expect, it } from "vitest";
import { assertCan, can } from "./authorization";

describe("Studio authorization", () => {
  it("lets researchers work on research and drafts only", () => {
    expect(can("researcher", "research:write")).toBe(true);
    expect(can("researcher", "article:write")).toBe(true);
    expect(can("researcher", "article:review")).toBe(false);
    expect(can("researcher", "article:publish")).toBe(false);
  });

  it("lets editors review and publish but not manage Studio", () => {
    expect(can("editor", "article:publish")).toBe(true);
    expect(can("editor", "studio:manage")).toBe(false);
  });

  it("reserves Studio management for owners", () => {
    expect(can("owner", "studio:manage")).toBe(true);
    expect(() => assertCan("researcher", "article:publish")).toThrow(/cannot perform/);
  });
});
