import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";
import questions from "../content/original-practice/general-knowledge.json";
import { flashcards } from "../content/flashcards";

describe("Cycle 8A PRL fire-test gaps", () => {
  const theory = lessonTheories["prevencion-riesgos-laborales"]!;
  const claims = theory.concepts.flatMap((concept) => concept.claims);
  const prlQuestions = questions.filter((question) => question.skill === "PRL");

  it("makes clear that prevention organization does not discharge employer responsibility", () => {
    const claim = claims.find((item) => item.id === "prl-c15-1");
    expect(claim?.text).toMatch(/no exime|no exonera/i);
    expect(claim?.legalBasis).toContain("lprl-31-1995-art14");
  });

  it("describes prevention services and when own or external services are needed", () => {
    const claim = claims.find((item) => item.id === "prl-c15-2");
    expect(claim?.text).toMatch(/trabajadores designados/i);
    expect(claim?.text).toMatch(/propio|ajeno/i);
    expect(claim?.text).toMatch(/insuficiente/i);
  });

  it("distinguishes information through representatives from direct information about each person's specific risks", () => {
    const claim = claims.find((item) => item.id === "prl-c16-1");
    expect(claim?.text).toMatch(/a través de.*representantes/i);
    expect(claim?.text).toMatch(/directamente.*riesgos específicos/i);
  });

  it("lists the advance consultation subjects from article 33", () => {
    const claim = claims.find((item) => item.id === "prl-c16-2");
    expect(claim?.text).toMatch(/planificación y organización/i);
    expect(claim?.text).toMatch(/emergencias/i);
    expect(claim?.text).toMatch(/servicio de prevención/i);
  });

  it("states designation and the staffing thresholds for Prevention Delegates", () => {
    const claim = claims.find((item) => item.id === "prl-c13-3");
    expect(claim?.text).toMatch(/por y entre.*representantes/i);
    expect(claim?.text).toMatch(/50 a 100.*dos/i);
  });

  it("adds original practice grounded in the missing PRL provisions", () => {
    const ids = ["orig-gen-prl-015", "orig-gen-prl-016", "orig-gen-prl-017", "orig-gen-prl-018"];
    expect(ids.every((id) => prlQuestions.some((question) => question.id === id))).toBe(true);
  });

  it("adds useful recall cards for the gaps exposed by the fire test", () => {
    const ids = ["prl-fc-1", "prl-fc-2", "prl-fc-3", "prl-fc-4", "prl-fc-5"];
    expect(ids.every((id) => flashcards.some((card) => card.id === id))).toBe(true);
  });
});
