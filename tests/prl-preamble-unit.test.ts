import { describe, expect, it } from "vitest";
import { lessonTheories } from "../content/lesson-theory";
import { officialItems } from "../content/syllabus";

describe("PRL exposición de motivos", () => {
  it("links a study concept to the BOE preamble rather than treating it as an article", () => {
    const theory = lessonTheories["prevencion-riesgos-laborales"];
    const source = theory.sources.find((item) => item.id === "lprl-exposicion");
    const concept = theory.concepts.find((item) => item.id === "prl-exposicion-fundamentos");
    expect(source?.locator).toMatch(/exposición de motivos/i);
    expect(source?.sourceId).toBe("Ley 31/1995");
    expect(concept?.claims.some((claim) => claim.legalBasis.includes("lprl-exposicion"))).toBe(true);
  });
  it("links the preamble for study while retaining partial status when the ADIF attachment is unverified", () => {
    const node = officialItems.flatMap((item) => item.children).find((item) => item.id === "prl-exposicion-motivos");
    expect(node?.linkedModules).toContain("prevencion-riesgos-laborales");
    expect(node?.status).toBe("partial");
  });
});

it("distinguishes representative information from direct information on specific risks", () => {
  const claim = lessonTheories["prevencion-riesgos-laborales"].concepts.find((item) => item.id === "prl-concept-5")?.claims[0];
  expect(claim?.text).toMatch(/representantes/i);
  expect(claim?.text).toMatch(/directamente.*riesgos específicos/i);
});

it("preserves the condition for leaving the workplace under article 21.2", () => {
  const claim = lessonTheories["prevencion-riesgos-laborales"].concepts.find((item) => item.id === "prl-concept-8")?.claims[0];
  expect(claim?.text).toMatch(/abandonar el lugar de trabajo,? en caso necesario/i);
});

it("provides a recall summary of the preamble and its eight sections", async () => {
  const { prevencionRiesgosLaboralesSummary } = await import("../content/summaries/prevencion-riesgos-laborales");
  const section = prevencionRiesgosLaboralesSummary.sections.find((item) => /exposición de motivos/i.test(item.title));
  expect(section?.points.join(" ")).toMatch(/1 y 2/);
  expect(section?.points.join(" ")).toMatch(/7 y 8/);
  expect(section?.points.join(" ")).toMatch(/no sustituye/i);
});

it("offers source-linked original retrieval with feedback on each option", async () => {
  const { listOriginalPracticeQuestions } = await import("../lib/content/original-practice-repository");
  const questions = listOriginalPracticeQuestions({ domain: "general-knowledge", topicId: "prl-exposicion-motivos", status: "reviewed" });
  expect(questions.length).toBeGreaterThanOrEqual(2);
  for (const question of questions) {
    expect(question.origin).toBe("original");
    expect(question.sourceLocator).toBe(question.id === "orig-gen-prl-expo-001" ? "Exposición de motivos, apartado 1" : "Exposición de motivos, apartados 1 a 8");
    for (const key of ["A", "B", "C", "D"]) expect(question.explanation).toMatch(new RegExp(`${key}\\)`));
  }
});

it("uses plausible partial-foundation alternatives for preamble recall", async () => {
  const { getOriginalPracticeQuestion } = await import("../lib/content/original-practice-repository");
  const question = getOriginalPracticeQuestion("orig-gen-prl-expo-001");
  expect(question?.options.filter((option) => /constitucional|europeo|oit/i.test(option.text)).length).toBe(4);
});

it("uses non-absolute alternatives when testing how to consult the preamble", async () => {
  const { getOriginalPracticeQuestion } = await import("../lib/content/original-practice-repository");
  const question = getOriginalPracticeQuestion("orig-gen-prl-expo-002");
  expect(question?.options.every((option) => !/cualquier artículo|todos los reglamentos|automáticamente/i.test(option.text))).toBe(true);
});

it("does not describe all preventive principles as a strict legal hierarchy", () => {
  const claim = lessonTheories["prevencion-riesgos-laborales"].concepts.find((item) => item.id === "prl-concept-2")?.claims[0];
  expect(claim?.text).not.toMatch(/orden jerárquico establecido por ley/i);
});
