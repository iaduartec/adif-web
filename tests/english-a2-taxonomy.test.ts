import { describe, expect, it } from "vitest";
import catalog from "../content/official-exams/english-topics.json";
import {
  englishCurriculumSchema, getEnglishCurriculum, englishKnowledgeErrorSchema,
  englishAttemptCauseSchema, englishErrorClassificationSchema, englishAttemptCauseOptions,
  summarizeEnglishErrors,
} from "../lib/content/english-a2-curriculum";
import { originalPracticePublicQuestionSchema } from "../lib/content/original-practice-public-dto";

describe("A2 knowledge and attempt error contracts", () => {
  it("keeps the five knowledge errors separate from the two user-reported causes", () => {
    for (const value of ["GRAMMAR", "VOCABULARY", "READING", "SIGN", "CONTEXT"]) {
      expect(englishKnowledgeErrorSchema.parse(value)).toBe(value);
      expect(englishAttemptCauseSchema.safeParse(value).success).toBe(false);
    }
    for (const value of ["CARELESSNESS", "TIME"]) {
      expect(englishAttemptCauseSchema.parse(value)).toBe(value);
      expect(englishKnowledgeErrorSchema.safeParse(value).success).toBe(false);
    }
    expect(englishAttemptCauseOptions.map(({ value }) => value)).toEqual(["CARELESSNESS", "TIME"]);
    expect(englishKnowledgeErrorSchema.safeParse("OTHER").success).toBe(false);
    expect(englishAttemptCauseSchema.safeParse("OTHER").success).toBe(false);
  });

  it.each([
    { topicId: "quantifiers", knowledgeError: "GRAMMAR", attemptCause: "CARELESSNESS" },
    { topicId: "vocabulary", knowledgeError: "VOCABULARY", attemptCause: "TIME" },
    { topicId: "reading-comprehension", knowledgeError: "READING" },
  ])("round-trips knowledge and optional cause without losing data: $topicId", (input) => {
    expect(englishErrorClassificationSchema.parse(JSON.parse(JSON.stringify(input)))).toEqual(input);
  });

  it("rejects unknown topics, mixed-up cause fields, unknown errors and internal metadata", () => {
    const valid = { topicId: "simple-conditionals", knowledgeError: "GRAMMAR" };
    for (const overrides of [
      { topicId: "TIME" }, { topicId: "missing" }, { knowledgeError: "CARELESSNESS" },
      { knowledgeError: "UNKNOWN" }, { attemptCause: "GRAMMAR" }, { attemptCause: "UNKNOWN" },
      { official: true }, { reviewerId: "private" },
    ]) expect(englishErrorClassificationSchema.safeParse({ ...valid, ...overrides }).success).toBe(false);
  });

  it("counts repeated conditional errors by stable topic independently from time and carelessness", () => {
    expect(summarizeEnglishErrors([
      { topicId: "simple-conditionals", knowledgeError: "GRAMMAR", attemptCause: "TIME" },
      { topicId: "simple-conditionals", knowledgeError: "GRAMMAR", attemptCause: "CARELESSNESS" },
      { topicId: "vocabulary", knowledgeError: "VOCABULARY" },
    ])).toEqual({
      byTopic: { "simple-conditionals": 2, vocabulary: 1 },
      byKnowledgeError: { GRAMMAR: 2, VOCABULARY: 1 },
      byAttemptCause: { TIME: 1, CARELESSNESS: 1 },
    });
  });

  it("uses defensive copies and rejects curriculum links to non-English concepts", () => {
    const topics = getEnglishCurriculum();
    topics.topics[0]!.title = "Consumer mutation";
    expect(getEnglishCurriculum().topics[0]!.title).toBe("There is / There are");
    const changed = structuredClone(catalog);
    changed.topics[0]!.activeConceptIds = ["rcf-concept-1"];
    changed.topics[0]!.mappingStatus = "linked_to_active_theory";
    expect(englishCurriculumSchema.safeParse(changed).success).toBe(false);
  });

  it("rejects an orphan topic in the active original-practice curriculum", () => {
    const changed = structuredClone(catalog);
    changed.topics[0]!.activeConceptIds = [];
    changed.topics[0]!.mappingStatus = "taxonomy_only";
    expect(englishCurriculumSchema.safeParse(changed).success).toBe(false);
  });

  it("rejects unknown topics and cause-as-skill manipulation in the public DTO", () => {
    const dto = { id: "orig-dto-probe", origin: "original", domain: "english-a2", topicId: "past-simple",
      topic: "Pasado", skill: "GRAMMAR", prompt: "An original DTO fixture.", difficulty: 1, tags: [],
      options: ["A", "B", "C", "D"].map((key) => ({ key, text: `Choice ${key}` })) };
    expect(originalPracticePublicQuestionSchema.safeParse(dto).success).toBe(true);
    expect(originalPracticePublicQuestionSchema.safeParse({ ...dto, skill: "TIME" }).success).toBe(false);
    expect(originalPracticePublicQuestionSchema.safeParse({ ...dto, topicId: "unknown" }).success).toBe(false);
  });
});
