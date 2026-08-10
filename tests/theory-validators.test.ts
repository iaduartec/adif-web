import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";
import type { LegalReference, TheoryClaim, TheorySection } from "../content/theory-types";
import {
  checkClaim,
  extractMentionedLocators,
  extractReferenceLocators,
  validateTheoryClaims,
} from "../scripts/verify-theory-claims";
import { registerGlobalId, validateTheoryStructure } from "../scripts/verify-theory";

function source(
  id: string,
  sourceId: string,
  locator: string,
  sourceTitle = "Fuente jurídica",
): LegalReference {
  return {
    id,
    sourceId,
    sourceTitle,
    sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229",
    locator,
  };
}

function claim(overrides: Partial<TheoryClaim> & Pick<TheoryClaim, "id" | "text">): TheoryClaim {
  return { kind: "normative", legalBasis: [], ...overrides };
}

function mapOf(...sources: LegalReference[]): Map<string, LegalReference> {
  return new Map(sources.map((s) => [s.id, s]));
}

const emptyTheory: TheorySection = {
  introduction: [],
  concepts: [],
  examples: [],
  reviewTakeaways: [],
  sources: [],
};

describe("locator token extraction", () => {
  it("normalizes Artículo/Art./apartado mentions to exact numeric tokens", () => {
    expect(extractMentionedLocators("El artículo 81.1 de la Constitución determina...")).toEqual(["81.1"]);
    expect(extractMentionedLocators("Véase art. 6.2")).toEqual(["6.2"]);
    expect(extractMentionedLocators("apartado 5.1")).toEqual(["5.1"]);
    expect(extractMentionedLocators("art 45")).toEqual(["45"]);
    expect(extractMentionedLocators("no hay citas aquí")).toEqual([]);
  });

  it("extracts exact numeric tokens from reference locators", () => {
    expect(extractReferenceLocators("Artículo 81.1")).toEqual(["81.1"]);
    expect(extractReferenceLocators("Artículo 6.2")).toEqual(["6.2"]);
    expect(extractReferenceLocators("Artículo 14")).toEqual(["14"]);
    expect(extractReferenceLocators("Capítulo I")).toEqual([]);
  });
});

describe("locator coherence", () => {
  const ce81 = source("ce-art81", "CE", "Artículo 81.1", "Constitución Española");
  const ce45 = source("ce-art45", "CE", "Artículo 45", "Constitución Española");
  const ce11 = source("ce-art11", "CE", "Artículo 11", "Constitución Española");
  const ce92 = source("ce-art9-2", "CE", "Artículo 9.2", "Constitución Española");
  const ce62 = source("ce-art6-2", "CE", "Artículo 6.2", "Constitución Española");

  it("rejects Art. 8 against the locator Artículo 81.1", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({ id: "loc-8", text: "El artículo 8 regula la materia.", legalBasis: ["ce-art81"] }),
      mapOf(ce81),
    );
    expect(errors.some((e) => e.includes("article/apartado 8"))).toBe(true);
  });

  it("rejects Art. 4 against the locator Artículo 45", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({ id: "loc-4", text: "El artículo 4 regula la materia.", legalBasis: ["ce-art45"] }),
      mapOf(ce45),
    );
    expect(errors.some((e) => e.includes("article/apartado 4"))).toBe(true);
  });

  it("rejects Art. 1 against the locator Artículo 11", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({ id: "loc-1", text: "El artículo 1 regula la materia.", legalBasis: ["ce-art11"] }),
      mapOf(ce11),
    );
    expect(errors.some((e) => e.includes("article/apartado 1"))).toBe(true);
  });

  it("rejects Art. 9 against the locator Artículo 9.2 (no implicit parent/child semantics)", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({ id: "loc-9", text: "El artículo 9 regula la materia.", legalBasis: ["ce-art9-2"] }),
      mapOf(ce92),
    );
    expect(errors.some((e) => e.includes("article/apartado 9"))).toBe(true);
  });

  it("accepts Art. 6.2 against the locator Artículo 6.2", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({ id: "loc-62", text: "El artículo 6.2 regula la materia.", legalBasis: ["ce-art6-2"] }),
      mapOf(ce62),
    );
    expect(errors).toEqual([]);
  });

  it("accepts Art. 81.1 against the locator Artículo 81.1", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({ id: "loc-811", text: "El artículo 81.1 regula la materia.", legalBasis: ["ce-art81"] }),
      mapOf(ce81),
    );
    expect(errors).toEqual([]);
  });
});

describe("instrument coherence", () => {
  const ce14 = source("ce-art14", "CE", "Artículo 14", "Constitución Española");
  const ce81 = source("ce-art81", "CE", "Artículo 81.1", "Constitución Española");
  const lo1 = source("lo3-2007-art1", "LO 3/2007", "Artículo 1", "Ley Orgánica para la igualdad efectiva");

  it("rejects a claim naming LO 3/2007 backed only by a CE source", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({
        id: "instr-1",
        text: "La LO 3/2007 desarrolla el principio constitucional de igualdad.",
        legalBasis: ["ce-art14"],
      }),
      mapOf(ce14),
    );
    expect(errors.some((e) => e.includes("mentions 'LO 3/2007'"))).toBe(true);
  });

  it("does NOT exempt other instruments when a CE source is present (no global CE exception)", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({ id: "instr-2", text: "La LO 3/2007 es una ley orgánica.", legalBasis: ["ce-art81"] }),
      mapOf(ce81),
    );
    expect(errors.some((e) => e.includes("mentions 'LO 3/2007'"))).toBe(true);
  });

  it("requires EACH instrument named in the text to be covered", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({
        id: "instr-3",
        text: "La LO 3/2007 desarrolla el principio de igualdad previsto en la Constitución.",
        legalBasis: ["lo3-2007-art1"],
      }),
      mapOf(lo1),
    );
    expect(errors.some((e) => e.includes("mentions 'Constitución'"))).toBe(true);
  });

  it("accepts a claim naming CE + LO 3/2007 when both instruments are referenced", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({
        id: "instr-4",
        text: "La LO 3/2007 desarrolla el principio de igualdad previsto en la Constitución.",
        legalBasis: ["lo3-2007-art1", "ce-art14"],
      }),
      mapOf(lo1, ce14),
    );
    expect(errors).toEqual([]);
  });
});

describe("global ID uniqueness", () => {
  it("rejects duplicate source IDs across different modules", () => {
    const a: TheorySection = {
      ...emptyTheory,
      sources: [source("shared-ref", "CE", "Artículo 14", "Constitución Española")],
    };
    const b: TheorySection = {
      ...emptyTheory,
      sources: [source("shared-ref", "LO 3/2007", "Artículo 1", "Ley Orgánica")],
    };
    const errors = validateTheoryStructure({ a, b });
    expect(errors.some((e) => e.includes("Duplicate global ID 'shared-ref'"))).toBe(true);
  });

  it("rejects duplicate claim IDs across different modules", () => {
    const a: TheorySection = {
      ...emptyTheory,
      introduction: [claim({ id: "same-claim", text: "Afirmación A.", kind: "didactic", legalBasis: [] })],
    };
    const b: TheorySection = {
      ...emptyTheory,
      introduction: [claim({ id: "same-claim", text: "Afirmación B.", kind: "didactic", legalBasis: [] })],
    };
    const errors = validateTheoryStructure({ a, b });
    expect(errors.some((e) => e.includes("Duplicate global ID 'same-claim'"))).toBe(true);
  });

  it("shares one namespace across claim, concept, example and source IDs", () => {
    const globalIds = new Map<string, string>();
    expect(registerGlobalId(globalIds, "x", "a")).toBeNull();
    expect(registerGlobalId(globalIds, "x", "b")).toBe(
      "Duplicate global ID 'x' found at 'a' and 'b'",
    );
  });

  it("accepts unique IDs across modules", () => {
    const a: TheorySection = {
      ...emptyTheory,
      sources: [source("a-ref", "CE", "Artículo 14", "Constitución Española")],
    };
    const b: TheorySection = {
      ...emptyTheory,
      sources: [source("b-ref", "LO 3/2007", "Artículo 1", "Ley Orgánica")],
    };
    expect(validateTheoryStructure({ a, b })).toEqual([]);
  });
});

describe("didactic claims", () => {
  it("accepts a purely pedagogical didactic claim with an empty legalBasis", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({
        id: "did-1",
        text: "Para preparar la oposición conviene repasar los esquemas con antelación.",
        kind: "didactic",
        legalBasis: [],
      }),
      new Map(),
    );
    expect(errors).toEqual([]);
  });

  it("flags a didactic claim that hides a clear legal obligation", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({
        id: "did-2",
        text: "Las empresas están obligadas a elaborar un plan de igualdad.",
        kind: "didactic",
        legalBasis: [],
      }),
      new Map(),
    );
    expect(errors.some((e) => e.includes("legal obligation/right"))).toBe(true);
  });
});

describe("jurisprudence", () => {
  it("flags a claim citing the Tribunal Constitucional without a specific ruling", () => {
    const ce14 = source("ce-art14", "CE", "Artículo 14", "Constitución Española");
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({
        id: "jur-1",
        text: "El Tribunal Constitucional ha declarado la importancia del principio de igualdad.",
        legalBasis: ["ce-art14"],
      }),
      mapOf(ce14),
    );
    expect(errors.some((e) => e.includes("jurisprudence"))).toBe(true);
  });

  it("accepts a jurisprudential claim backed by a concrete ruling source", () => {
    const stc = source("stc-76-1983", "STC 76/1983", "FJ 4", "Sentencia del Tribunal Constitucional 76/1983");
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({
        id: "jur-2",
        text: "El Tribunal Constitucional ha declarado la importancia del principio de igualdad.",
        legalBasis: ["stc-76-1983"],
      }),
      mapOf(stc),
    );
    expect(errors).toEqual([]);
  });
});

describe("whole content guardrails", () => {
  it("passes instrument/locator/jurisprudence validation on the real lesson theories", () => {
    expect(validateTheoryClaims(lessonTheories)).toEqual([]);
  });

  it("keeps claim/concept/example/source IDs globally unique on the real lesson theories", () => {
    expect(validateTheoryStructure(lessonTheories)).toEqual([]);
  });
});
