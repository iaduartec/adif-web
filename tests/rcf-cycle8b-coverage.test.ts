import { describe, expect, it } from "vitest";
import { lessonTheories } from "../content/lesson-theory";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";

describe("RCF Libro Primero coverage for Cycle 8B", () => {
  const theory = lessonTheories["rcf-libro-1"];

  it("teaches shared safety responsibility and how the SGS operationalizes it", () => {
    const claims = theory.concepts.flatMap((concept) => concept.claims);
    expect(claims.some((claim) => /responsabilidad.*AI.*EF|AI.*EF.*responsabilidad/i.test(claim.text))).toBe(true);
    expect(claims.some((claim) => /cooperar.*control de riesgos|SGS.*procedimientos/i.test(claim.text))).toBe(true);
  });

  it("covers service handover and preferred communication methods with their conditions", () => {
    const claims = theory.concepts.flatMap((concept) => concept.claims);
    expect(claims.some((claim) => /personal saliente.*documentación.*útiles.*información/i.test(claim.text))).toBe(true);
    expect(claims.some((claim) => /preferentemente.*radiotelefonía/i.test(claim.text))).toBe(true);
    expect(claims.some((claim) => /tren parado/i.test(claim.text))).toBe(true);
  });

  it("includes original practice on shared responsibility and communication comprehension", () => {
    const questions = listOriginalPracticeQuestions({ domain: "telecom" }).filter((question) => ["orig-tel-rcf-024", "orig-tel-rcf-025", "orig-tel-rcf-026"].includes(question.id));
    expect(questions).toHaveLength(3);
    expect(questions.map((question) => question.answer).sort()).toEqual(["A", "B", "C"]);
    expect(questions.every((question) => question.conceptIds.length > 0 && /1\.1\.1\.1|1\.4\.1\.1/.test(question.sourceLocator ?? ""))).toBe(true);
  });
});
