import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";

const theory = lessonTheories["rcf-libro-1"];

describe("RCF Libro Primero, Capítulo 4 communication methodology", () => {
  it("cites the official provisions for safety communication methods and telegram records", () => {
    for (const section of ["1.4.1.2", "1.4.1.3"]) {
      const source = theory.sources.find((candidate) =>
        new RegExp(`${section.replaceAll(".", "\\.")}(?!\\d)`).test(candidate.locator),
      );
      expect(source, section).toBeDefined();
      expect(source?.sourceId).toBe("RD 664/2015");
      expect(source?.sourceUrl).toBe("https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042");
    }
  });

  it("teaches who defines the SGS methodology, telegram-book model, users, and optional specific form", () => {
    const claim = theory.concepts
      .find((concept) => concept.id === "rcf-concept-6")
      ?.claims.find((candidate) => candidate.id === "rcf-c6-4");

    expect(claim).toBeDefined();
    expect(claim?.legalBasis).toEqual([
      "rd664-2015-1-4-1-2",
      "rd664-2015-1-4-1-3",
    ]);
    expect(claim?.text).toMatch(/AI y EF.*respectivos SGS/i);
    expect(claim?.text).toMatch(/ETI OPE/i);
    expect(claim?.text).toMatch(/Libro de Telefonemas/i);
    expect(claim?.text).toMatch(/Encargados de Trabajos/i);
    expect(claim?.text).toMatch(/modelo específico, de uso exclusivo por los Responsables de Circulación/i);
    expect(claim?.text).toMatch(/bloqueo o rebase de señales/i);
    expect(claim?.text).toMatch(/estado de los cantones/i);
  });
});
