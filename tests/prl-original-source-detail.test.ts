import { expect, it } from "vitest";
import { getOriginalPracticeQuestion } from "../lib/content/original-practice-repository";

it("preserves the legal qualification when explaining a worker's right to leave", () => {
  const question = getOriginalPracticeQuestion("orig-gen-prl-004")!;
  const answer = question.options.find((option) => option.key === question.answer)!;
  expect(answer.text).toMatch(/en caso necesario/i);
  expect(question.explanation).toMatch(/en caso necesario/i);
});
