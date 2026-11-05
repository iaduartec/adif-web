import { describe, expect, it } from "vitest";

import { psicometriaTheory } from "../content/theories/psicometria";

describe("psychometric spatial rotation method", () => {
  it("teaches an anchor-based rotation check and keeps the example explicitly textual", () => {
    const spatial = psicometriaTheory.concepts.find(({ id }) => id === "psico-topic-spatial");
    const method = spatial?.claims.find(({ id }) => id === "psico-topic-spatial-rotation-method")?.text;
    const example = psicometriaTheory.examples.find(({ id }) => id === "psico-ex-spatial-rotation");
    const solution = example?.application[0]?.text;

    expect(method).toContain("fija primero una marca asimétrica");
    expect(method).toContain("una rotación conserva el orden");
    expect(method).toContain("un segundo rasgo");
    expect(example?.situation).toContain("sin figura dibujada");
    expect(solution).toContain("esquina superior izquierda pasa a la superior derecha");
    expect(solution).toContain("franja horizontal queda vertical");
    expect(solution).toContain("reflexión");
  });
});
