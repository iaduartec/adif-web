import { expect, it } from "vitest";
import { getOriginalPracticeQuestion } from "../lib/content/original-practice-repository";
import { lessonTheories } from "../content/lesson-theory";

it("locates ICT infrastructure items in the correct annex and avoids unsupported absolutes", () => {
  for (const id of ["orig-tel-ict-004", "orig-tel-ict-005", "orig-tel-ict-006-v2"]) {
    const question = getOriginalPracticeQuestion(id)!;
    expect(question.syllabusNodeId).toBe("ict-anexo-iii");
    expect(question.sourceLocator).toContain("Anexo III");
  }
  const question = getOriginalPracticeQuestion("orig-tel-ict-006-v2")!;
  expect(getOriginalPracticeQuestion("orig-tel-ict-006")?.status).toBe("draft");
  expect(question.explanation).toMatch(/fundamentalmente vertical/i);
  expect(question.explanation).not.toMatch(/ninguna circunstancia|dominio privado/i);
  const text = lessonTheories["ict-rd-346-2011"].concepts.find((concept) => concept.id === "ict-concept-9")!.claims[0].text;
  expect(text).not.toMatch(/ninguna circunstancia/i);
  expect(getOriginalPracticeQuestion("orig-tel-ict-001")!.explanation).not.toMatch(/nueva planta o rehabilitación integral/i);
  const earthing = getOriginalPracticeQuestion("orig-tel-ict-017-v2")!;
  expect(getOriginalPracticeQuestion("orig-tel-ict-017")?.status).toBe("draft");
  expect(earthing.syllabusNodeId).toBe("ict-anexo-iii");
  expect(earthing.sourceLocator).toBe("Anexo III, apartado 7.1");
  expect(earthing.prompt).toMatch(/no modular/i);
});
