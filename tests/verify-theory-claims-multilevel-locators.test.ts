import { describe, expect, it } from "vitest";
import { extractMentionedLocators, checkClaim } from "../scripts/verify-theory-claims";
import type { TheoryClaim } from "../content/lesson-theory";

const claim: TheoryClaim = {
  id: "multi-level-locator",
  text: "El anexo III, apartado 4.5.3.i, permite construir un RITU.",
  kind: "normative",
  legalBasis: ["source"],
};

describe("multilevel article and subsection locator validation", () => {
  it("extracts the full numeric depth, including before a Roman-numeral suffix", () => {
    expect(extractMentionedLocators(claim.text)).toEqual(["4.5.3"]);
  });

  it("accepts the matching 4.5.3 source locator", () => {
    const errors = checkClaim("test", "claims[0]", claim, new Map([
      ["source", { sourceTitle: "Real Decreto", locator: "Anexo III, apartado 4.5.3" } as never],
    ]));
    expect(errors.filter((error) => error.includes("do not cover"))).toEqual([]);
  });

  it("rejects a different subsection even when its parent section matches", () => {
    const errors = checkClaim("test", "claims[0]", claim, new Map([
      ["source", { sourceTitle: "Real Decreto", locator: "Anexo III, apartado 4.5.4" } as never],
    ]));
    expect(errors.some((error) => error.includes("4.5.3") && error.includes("do not cover"))).toBe(true);
  });

  it("rejects a parent-only 4.5 locator for a claim about 4.5.3", () => {
    const errors = checkClaim("test", "claims[0]", claim, new Map([
      ["source", { sourceTitle: "Real Decreto", locator: "Anexo III, apartado 4.5" } as never],
    ]));
    expect(errors.some((error) => error.includes("4.5.3") && error.includes("do not cover"))).toBe(true);
  });
});
