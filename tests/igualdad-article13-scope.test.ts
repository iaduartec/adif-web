import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";

describe("tutela probatoria de la LO 3/2007, artículo 13", () => {
  const theory = lessonTheories.igualdad!;
  const claims = theory.concepts.flatMap((concept) => concept.claims);

  it("makes clear that the burden-shifting rule does not apply to criminal proceedings", () => {
    const claim = claims.find((item) => item.id === "igualdad-c8-1");
    expect(claim?.legalBasis).toContain("lo3-2007-art13");
    expect(claim?.text).toMatch(/probar la ausencia de discriminación/i);
    expect(claim?.text).toMatch(/no se aplica a los procesos penales/i);
    expect(claim?.review?.status).toBe("needs_review");
    expect(claim?.review?.confidence.reason).toMatch(/cotejó con los apartados 1 y 2 del artículo 13/i);
  });

  it("explains that the court's public-body report is discretionary and party-requested", () => {
    const claim = claims.find((item) => item.id === "igualdad-c8-5");
    expect(claim?.text).toMatch(/a instancia de parte/i);
    expect(claim?.text).toMatch(/puede recabar informe/i);
    expect(claim?.text).toMatch(/útil y pertinente/i);
    expect(claim?.text).toMatch(/no es una actuación automática/i);
  });

  it("contrasts the social employment proceeding with the express criminal-process exception", () => {
    const example = theory.examples.find((item) => item.id === "igualdad-ex-5");
    expect(example?.application[0]?.text).toMatch(/proceso social/i);
    expect(example?.application[1]?.text).toMatch(/proceso penal/i);
    expect(example?.application[1]?.text).toMatch(/excluye expresamente/i);
  });
});
