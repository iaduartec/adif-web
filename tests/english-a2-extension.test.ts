import { expect, it } from "vitest";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";

it("makes the new A2 practice available without revealing answers", () => {
  const ids = ["orig-a2-present-simple-002", "orig-a2-past-simple-002", "orig-a2-signs-notices-002", "orig-a2-reading-comprehension-002"];
  const questions = listOriginalPracticeQuestions({ domain: "english-a2", status: "reviewed", ids });
  expect(questions.map((q) => q.id).sort()).toEqual(ids.sort());
  for (const question of questions) {
    expect(question.explanation.length).toBeGreaterThan(40);
    expect(toPublicPracticeQuestion(question)).not.toHaveProperty("answer");
    expect(toPublicPracticeQuestion(question)).not.toHaveProperty("explanation");
  }
});
