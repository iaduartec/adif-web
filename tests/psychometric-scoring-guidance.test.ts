import { describe, expect, it } from "vitest";
import { lessonTheories } from "../content/lesson-theory";

describe("psychometric scoring guidance", () => {
  it("does not assert unverified penalties or a universal guessing strategy", () => {
    const theory = lessonTheories.psicometria;
    const claim = theory.concepts.find((item) => item.id === "psico-concept-6")?.claims[0]?.text;
    const takeaway = theory.reviewTakeaways.find((item) => item.id === "psico-takeaway-1")?.text;
    expect(claim).toMatch(/reglas.*confirmad/i);
    expect(claim).not.toMatch(/azar empeora/i);
    expect(takeaway).not.toMatch(/estrategia óptima|omitiendo aquellas/i);
  });
});
