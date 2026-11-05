import { describe, expect, it } from "vitest";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";

const telecom = listOriginalPracticeQuestions({ domain: "telecom" });
const general = listOriginalPracticeQuestions({ domain: "general-knowledge" });
const psychometric = listOriginalPracticeQuestions({ domain: "psychometric" });

describe("Cycle 16 original-question quality corrections", () => {
  it("uses the exact ICT and RCF answer locators for the audited prompts", () => {
    expect(telecom.find(({ id }) => id === "orig-tel-rcf-029")?.sourceLocator)
      .toContain("1.5.1.3");
    expect(telecom.find(({ id }) => id === "orig-tel-ict-018")?.sourceLocator)
      .toBe("Anexo II, apartado 7.3");
    expect(telecom.find(({ id }) => id === "orig-tel-ict-025")?.sourceLocator)
      .toBe("Anexo II, apartado 7.2.3");
  });

  it("keeps the incompatibilities skill label consistent across the bank", () => {
    const question = general.find(({ id }) => id === "orig-gen-incompat-008");
    expect(question?.skill).toBe("INCOMPATIBILIDADES");
  });

  it("labels the psychometric prompts by the reasoning they actually test", () => {
    for (const [id, topicId] of [
      ["orig-psico-matrices-001", "calculation"],
      ["orig-psico-matrices-002", "sequences"],
      ["orig-psico-memory-001", "attention"],
      ["orig-psico-memory-002", "attention"],
    ]) {
      const question = psychometric.find((item) => item.id === id);
      expect(question, id).toMatchObject({ topicId, skill: topicId, conceptIds: [`psico-topic-${topicId}`] });
    }
    expect(psychometric.filter(({ topicId }) => topicId === "matrices").every(({ figure }) => Boolean(figure))).toBe(true);
    expect(psychometric.some(({ topicId }) => topicId === "memory")).toBe(false);
  });

  it("separates spatial figures, domino sequences, and true matrix questions in the result taxonomy", () => {
    for (const id of ["orig-psico-visual-cube-fold-001", "orig-psico-visual-cube-fold-002", "orig-psico-visual-cube-rotation-001"]) {
      expect(psychometric.find((question) => question.id === id)?.topicId).toBe("spatial");
    }
    for (const id of ["orig-psico-visual-domino-001", "orig-psico-visual-domino-002"]) {
      expect(psychometric.find((question) => question.id === id)?.topicId).toBe("sequences");
    }
    for (const question of psychometric.filter(({ topicId }) => topicId === "matrices")) {
      expect(question.id).toMatch(/visual-matrix/);
    }
  });

  it("uses a logical premise and distractors that do not overlap with the answer", () => {
    const question = psychometric.find(({ id }) => id === "orig-psico-logic-001")!;
    expect(question.prompt).toContain("Hay operadores de mantenimiento");
    expect(question.options.map(({ text }) => text)).toContain("Cada operador de mantenimiento realizó el curso de seguridad.");
    expect(question.options.map(({ text }) => text)).not.toContain("Solo algunos operadores lo realizaron.");
  });
});
