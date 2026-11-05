import { describe, expect, it } from "vitest";
import questions from "../content/original-practice/general-knowledge.json";
import { originalPracticeQuestionSchema } from "../lib/content/original-practice-schema";

describe("incompatibility practice citations", () => {
  it.each([
    ["orig-gen-incompat-002", "Artículo 4.1", "incomp-concept-3"],
    ["orig-gen-incompat-003", "Artículo 11", "incomp-concept-8"],
    ["orig-gen-incompat-004", "Artículo 14", "incomp-concept-11"],
    ["orig-gen-incompat-007", "Artículo 19", "incomp-concept-15"],
  ])("maps %s to the concept supported by %s", (id, locator, concept) => {
    const question = questions.find((item) => item.id === id);
    expect(question).toMatchObject({ sourceLocator: locator, conceptIds: [concept] });
    expect(originalPracticeQuestionSchema.safeParse(question).success).toBe(true);
  });
});
