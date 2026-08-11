import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";
import type { LegalReference, TheoryClaim, TheorySection } from "../content/theory-types";
import {
  checkClaim,
  extractMentionedLocators,
  extractReferenceLocators,
  validateTheoryClaims,
} from "../scripts/verify-theory-claims";
import { registerGlobalId, validateTheoryStructure, getTheoryStats } from "../scripts/verify-theory";
import {
  OFFICIAL_SOURCE_REGISTRY,
  getSourceKind,
  getSourcesByKind,
  validateOfficialSourceIdentity,
  validateTheoryReferences,
} from "../scripts/verify-theory-references";

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

  it("passes reference structural and official-source-identity validation on the real lesson theories", () => {
    expect(validateTheoryReferences(lessonTheories)).toEqual([]);
  });

  it("registers every content sourceId with a known source kind on the real lesson theories", () => {
    const unknown: string[] = [];
    for (const theory of Object.values(lessonTheories)) {
      for (const s of theory.sources ?? []) {
        if (!getSourceKind(s.sourceId)) unknown.push(`${s.sourceId} (${s.id})`);
      }
    }
    expect(unknown).toEqual([]);
  });

  it("satisfies the classification invariant on the real lesson theories", () => {
    const stats = getTheoryStats(lessonTheories);
    const classified = Object.values(stats.claimsByKind).reduce((sum, n) => sum + n, 0);
    expect(classified).toBe(stats.claimsTotal);
  });

  it("leaves no normative claim backed exclusively by syllabus-reference sources on the real lesson theories", () => {
    expect(validateTheoryClaims(lessonTheories).some((e) => e.includes("syllabus-reference sources"))).toBe(false);
  });
});

describe("official source identity", () => {
  function sectionWithSource(sourceUrl: string): Record<string, TheorySection> {
    return {
      m: {
        introduction: [],
        concepts: [],
        examples: [],
        reviewTakeaways: [],
        sources: [{ id: "s1", sourceId: "Ley 38/2015", sourceTitle: "Ley 38/2015, de 29 de septiembre, del sector ferroviario", sourceUrl, locator: "Artículo 32" }],
      },
    };
  }

  it("registers the canonical BOE URL for Ley 38/2015 as legislation", () => {
    expect(OFFICIAL_SOURCE_REGISTRY["Ley 38/2015"].canonicalUrl).toBe(
      "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440",
    );
    expect(OFFICIAL_SOURCE_REGISTRY["Ley 38/2015"].kind).toBe("legislation");
    expect(OFFICIAL_SOURCE_REGISTRY["Ley 38/2015"].canonicalTitle).toBe(
      "Ley 38/2015, de 29 de septiembre, del sector ferroviario",
    );
  });

  it("registers the canonical BOE URL for Directiva 2014/30/UE as legislation", () => {
    expect(OFFICIAL_SOURCE_REGISTRY["Directiva 2014/30/UE"].canonicalUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623",
    );
    expect(OFFICIAL_SOURCE_REGISTRY["Directiva 2014/30/UE"].kind).toBe("legislation");
  });

  it("registers exam-syllabus sources as syllabus-reference, not legal sources", () => {
    expect(getSourceKind("EN 50121")).toBe("syllabus-reference");
    expect(getSourceKind("MET-PSI-01")).toBe("syllabus-reference");
    expect(getSourceKind("DR 2027")).toBe("official-document");
    expect(getSourceKind("MCER-A2")).toBe("official-document");
    expect(getSourceKind("TREBEP")).toBe("legislation");
  });

  it("rejects a wrong BOE document ID for the same sourceId", () => {
    const errors = validateOfficialSourceIdentity(
      sectionWithSource("https://www.boe.es/buscar/act.php?id=BOE-A-2015-10446"),
    );
    expect(errors.some((e) => e.includes("does not match the official source identity"))).toBe(true);
  });

  it("rejects a correct URL with a non-canonical sourceTitle", () => {
    const theories: Record<string, TheorySection> = {
      m: {
        introduction: [],
        concepts: [],
        examples: [],
        reviewTakeaways: [],
        sources: [{
          id: "s1",
          sourceId: "Ley 38/2015",
          sourceTitle: "Ley del Sector Ferroviario",
          sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440",
          locator: "Artículo 32",
        }],
      },
    };
    const errors = validateOfficialSourceIdentity(theories);
    expect(errors.some((e) => e.includes("sourceTitle does not match the official source identity"))).toBe(true);
  });

  it("accepts the exact canonical URL and title", () => {
    const errors = validateOfficialSourceIdentity(
      sectionWithSource("https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440"),
    );
    expect(errors).toEqual([]);
  });

  it("accepts a title that differs only by controlled normalization (double space, trailing period)", () => {
    const theories: Record<string, TheorySection> = {
      m: {
        introduction: [],
        concepts: [],
        examples: [],
        reviewTakeaways: [],
        sources: [{
          id: "s1",
          sourceId: "Ley 38/2015",
          sourceTitle: "Ley 38/2015,  de 29 de septiembre, del sector ferroviario.",
          sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440",
          locator: "Artículo 32",
        }],
      },
    };
    expect(validateOfficialSourceIdentity(theories)).toEqual([]);
  });

  it("rejects a paraphrased title even when the URL is correct", () => {
    const theories: Record<string, TheorySection> = {
      m: {
        introduction: [],
        concepts: [],
        examples: [],
        reviewTakeaways: [],
        sources: [{
          id: "s1",
          sourceId: "TREBEP",
          sourceTitle: "Estatuto Básico del Empleado Público",
          sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
          locator: "Artículo 52",
        }],
      },
    };
    expect(
      validateOfficialSourceIdentity(theories).some((e) => e.includes("sourceTitle does not match")),
    ).toBe(true);
  });

  it("rejects a sourceId missing from the registry", () => {
    const theories: Record<string, TheorySection> = {
      m: {
        introduction: [],
        concepts: [],
        examples: [],
        reviewTakeaways: [],
        sources: [{ id: "s1", sourceId: "Ley Inexistente", sourceTitle: "x", sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2000-1", locator: "Artículo 1" }],
      },
    };
    expect(validateOfficialSourceIdentity(theories).some((e) => e.includes("has no entry"))).toBe(true);
  });
});

describe("theory stats", () => {
  it("computes modules, concepts, examples, sources and claims per kind across modules", () => {
    const a: TheorySection = {
      ...emptyTheory,
      introduction: [claim({ id: "a1", text: "A.", kind: "normative", legalBasis: [] })],
      sources: [source("a-ref", "CE", "Artículo 14", "Constitución Española")],
    };
    const b: TheorySection = {
      ...emptyTheory,
      concepts: [
        { id: "b-con", title: "T", claims: [
          claim({ id: "b1", text: "B.", kind: "didactic", legalBasis: [] }),
          claim({ id: "b2", text: "C.", kind: "example", legalBasis: [] }),
        ] },
      ],
      sources: [
        source("b-ref1", "LO 3/2007", "Artículo 1", "Ley Orgánica"),
        source("b-ref2", "TREBEP", "Artículo 14", "Estatuto"),
      ],
    };
    expect(getTheoryStats({ a, b })).toEqual({
      modules: 2,
      concepts: 1,
      examples: 0,
      sources: 3,
      claimsTotal: 3,
      claimsByKind: { normative: 1, interpretative: 0, didactic: 1, example: 1 },
    });
  });

  it("counts concepts, examples and every kind from a full-module fixture", () => {
    const fixture: TheorySection = {
      ...emptyTheory,
      introduction: [
        claim({ id: "n1", text: "Norma.", kind: "normative", legalBasis: [] }),
      ],
      concepts: [
        { id: "c1", title: "C1", claims: [
          claim({ id: "i1", text: "Interp.", kind: "interpretative", legalBasis: [] }),
        ] },
        { id: "c2", title: "C2", claims: [
          claim({ id: "d1", text: "Did.", kind: "didactic", legalBasis: [] }),
        ] },
      ],
      examples: [
        { id: "e1", situation: "S", application: [
          claim({ id: "x1", text: "Ej.", kind: "example", legalBasis: [] }),
        ] },
      ],
      sources: [
        source("s1", "CE", "Artículo 14", "Constitución Española"),
        source("s2", "LO 3/2007", "Artículo 1", "Ley Orgánica"),
        source("s3", "TREBEP", "Artículo 52", "Estatuto"),
        source("s4", "Ley 31/1995", "Artículo 14", "LPRL"),
      ],
    };
    const stats = getTheoryStats({ m: fixture });
    expect(stats).toEqual({
      modules: 1,
      concepts: 2,
      examples: 1,
      sources: 4,
      claimsTotal: 4,
      claimsByKind: { normative: 1, interpretative: 1, didactic: 1, example: 1 },
    });
    const classified = Object.values(stats.claimsByKind).reduce((sum, n) => sum + n, 0);
    expect(classified).toBe(stats.claimsTotal);
  });

  it("throws a controlled exception on an unknown claim kind", () => {
    const unknownKind: TheorySection = {
      ...emptyTheory,
      introduction: [{ id: "bad", text: "X.", kind: "weird", legalBasis: [] } as unknown as TheoryClaim],
    };
    expect(() => getTheoryStats({ m: unknownKind })).toThrow(/Unknown claim kind 'weird'/);
  });

  it("satisfies the classification invariant on a full-module fixture", () => {
    const fixture: TheorySection = {
      ...emptyTheory,
      introduction: [
        claim({ id: "n1", text: "Norma.", kind: "normative", legalBasis: [] }),
      ],
      concepts: [
        { id: "c1", title: "C1", claims: [
          claim({ id: "i1", text: "Interp.", kind: "interpretative", legalBasis: [] }),
        ] },
        { id: "c2", title: "C2", claims: [
          claim({ id: "d1", text: "Did.", kind: "didactic", legalBasis: [] }),
        ] },
      ],
      sources: [
        source("s1", "CE", "Artículo 14", "Constitución Española"),
        source("s2", "LO 3/2007", "Artículo 1", "Ley Orgánica"),
      ],
    };
    const stats = getTheoryStats({ m: fixture });
    const classified = Object.values(stats.claimsByKind).reduce((sum, n) => sum + n, 0);
    expect(classified).toBe(stats.claimsTotal);
    expect(classified).toBe(3);
  });
});

describe("syllabus-reference backing rule", () => {
  const ceSource = source("ce-ref", "CE", "Artículo 14", "Constitución Española");
  const enSource = source(
    "en50121-ref",
    "EN 50121",
    "Parte 1",
    "Norma armonizada europea de compatibilidad electromagnética en aplicaciones ferroviarias",
  );

  it("accepts a normative claim backed by a legislation source", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({ id: "norm-leg", text: "El artículo 14 consagra la igualdad.", legalBasis: ["ce-ref"] }),
      mapOf(ceSource),
    );
    expect(errors).toEqual([]);
  });

  it("rejects a normative claim backed exclusively by a syllabus-reference source", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({
        id: "norm-syll",
        text: "La norma armonizada impone los límites de emisión.",
        legalBasis: ["en50121-ref"],
      }),
      mapOf(enSource),
    );
    expect(errors.some((e) => e.includes("backed exclusively by syllabus-reference sources"))).toBe(true);
  });

  it("accepts a didactic claim backed by a syllabus-reference source", () => {
    const errors = checkClaim(
      "m",
      "introduction[0]",
      claim({
        id: "did-syll",
        text: "Conviene repasar la familia de normas EN 50121 para el examen.",
        kind: "didactic",
        legalBasis: ["en50121-ref"],
      }),
      mapOf(enSource),
    );
    expect(errors).toEqual([]);
  });
});

describe("registry stats", () => {
  it("counts registered sources by kind consistently with the registry size", () => {
    const counts = getSourcesByKind();
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(Object.keys(OFFICIAL_SOURCE_REGISTRY).length);
    expect(counts.legislation).toBeGreaterThanOrEqual(13);
    expect(counts["official-document"]).toBeGreaterThanOrEqual(2);
    expect(counts["syllabus-reference"]).toBeGreaterThanOrEqual(2);
  });
});
