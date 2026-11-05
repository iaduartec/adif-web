import { describe, expect, it } from "vitest";
import { selectBalancedOriginalQuestions } from "../lib/content/original-simulation-selection";

const questions = [
  { id: "a1", topicId: "a" }, { id: "a2", topicId: "a" }, { id: "a3", topicId: "a" },
  { id: "b1", topicId: "b" }, { id: "b2", topicId: "b" }, { id: "b3", topicId: "b" },
  { id: "c1", topicId: "c" }, { id: "c2", topicId: "c" }, { id: "c3", topicId: "c" },
];

describe("balanced original exam composition", () => {
  it("selects no repeated IDs and balances topics without replacing questions", () => {
    const selected = selectBalancedOriginalQuestions(questions, 5, "cycle16-test-seed");
    const topicCounts = selected.reduce<Record<string, number>>((counts, question) => {
      counts[question.topicId] = (counts[question.topicId] ?? 0) + 1;
      return counts;
    }, {});

    expect(selected).toHaveLength(5);
    expect(new Set(selected.map(({ id }) => id)).size).toBe(5);
    expect(Math.max(...Object.values(topicCounts)) - Math.min(...Object.values(topicCounts))).toBeLessThanOrEqual(1);
  });

  it("keeps a seeded selection and order reproducible for tests", () => {
    expect(selectBalancedOriginalQuestions(questions, 6, "same-seed"))
      .toEqual(selectBalancedOriginalQuestions(questions, 6, "same-seed"));
  });

  it("caps the selection to unique questions actually available", () => {
    const withDuplicate = [...questions, questions[0]!];
    const selected = selectBalancedOriginalQuestions(withDuplicate, 99, "bounded");

    expect(selected).toHaveLength(questions.length);
    expect(new Set(selected.map(({ id }) => id)).size).toBe(selected.length);
  });
});
