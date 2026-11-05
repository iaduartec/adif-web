import { describe, expect, it } from "vitest";

import { psicometriaTheory } from "../content/theories/psicometria";

describe("psychometric visual reasoning lesson", () => {
  it("teaches a repeatable matrix check and verifies the missing tone by row and column", () => {
    const matrix = psicometriaTheory.concepts.find(({ id }) => id === "psico-topic-matrices");
    const rule = matrix?.claims.find(({ id }) => id === "psico-topic-matrices-rule")?.text;
    const example = psicometriaTheory.examples.find(({ id }) => id === "psico-ex-2");
    const application = example?.application[0]?.text;

    expect(rule).toContain("compara filas y columnas");
    expect(rule).toContain("una sola característica cada vez");
    expect(example?.situation).toContain("gris–blanco–gris");
    expect(application).toContain("falta gris");
    expect(application).toContain("tercera columna");
  });
});
