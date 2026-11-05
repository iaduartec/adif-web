import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";

describe("Cycle Igualdad LO 3/2007 P1 coverage", () => {
  const theory = lessonTheories.igualdad!;
  const sources = new Map(theory.sources.map((source) => [source.id, source]));
  const claims = theory.concepts.flatMap((concept) => concept.claims);

  it("covers the previously omitted articles with directly linked BOE sources", () => {
    for (const article of ["2", "4", "5", "10", "12"]) {
      const sourceId = `lo3-2007-art${article}`;
      expect(sources.get(sourceId)?.locator).toBe(`Artículo ${article}`);
      expect(sources.get(sourceId)?.sourceUrl).toBe(
        "https://www.boe.es/buscar/act.php?id=BOE-A-2007-6115",
      );
      expect(claims.some((claim) => claim.legalBasis.includes(sourceId))).toBe(true);
    }
  });

  it("preserves the narrow professional-requirement exception in article 5", () => {
    const exception = claims.find((claim) => claim.id === "igualdad-c14-3")?.text ?? "";
    expect(exception).toMatch(/requisito profesional esencial y determinante/i);
    expect(exception).toMatch(/objetivo es legítimo/i);
    expect(exception).toMatch(/requisito proporcionado/i);
  });

  it("preserves the post-relationship remedy and sole standing of the harassed person", () => {
    const remedy = claims.find((claim) => claim.id === "igualdad-c8-3")?.text ?? "";
    const standing = claims.find((claim) => claim.id === "igualdad-c8-4")?.text ?? "";
    expect(remedy).toMatch(/después de terminada la relación/i);
    expect(remedy).toMatch(/interés legítimo/i);
    expect(standing).toMatch(/única legitimada/i);
  });
});
