import { describe, expect, it } from "vitest";
import questions from "../content/original-practice/english-a2.json";
import { originalPracticeQuestionSchema } from "../lib/content/original-practice-schema";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";

describe("English A2 cycle 5", () => {
  it("retains the original bank and adds twenty reviewable questions with valid private answers", () => {
    const added = questions.slice(26);
    expect(questions).toHaveLength(49);
    expect(new Set(questions.map((q) => q.id)).size).toBe(49);
    expect(added).toHaveLength(23);
    for (const question of added) {
      const parsed = originalPracticeQuestionSchema.parse(question);
      expect(parsed.options.some((option) => option.key === parsed.answer)).toBe(true);
      expect(parsed.explanation.length).toBeGreaterThan(40);
      expect(toPublicPracticeQuestion(parsed)).not.toHaveProperty("answer");
      expect(toPublicPracticeQuestion(parsed)).not.toHaveProperty("explanation");
    }
    expect(["A", "B", "C", "D"].map((key) => added.filter((q) => q.answer === key).length)).toEqual([6, 6, 5, 6]);
  });

  it("offers three questions on each of four original reading scenarios", () => {
    for (const scenario of ["station", "email", "message", "cafe"]) {
      const group = questions.filter((q) => q.id.startsWith(`orig-a2-reading-${scenario}-`));
      expect(group).toHaveLength(3);
      expect(new Set(group.map((q) => q.prompt)).size).toBe(3);
    }
  });
});
