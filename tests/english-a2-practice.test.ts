import { describe, expect, it } from "vitest";
import catalog from "../content/official-exams/english-topics.json";
import { lessonTheories } from "../content/lesson-theory";
import { englishTopicCatalogSchema } from "../lib/content/schema";
import { originalPracticeQuestionSchema } from "../lib/content/original-practice-schema";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";

const stableIds = [
  "there-is-are", "present-simple", "present-continuous", "past-simple", "future",
  "modal-verbs", "comparatives", "prepositions", "quantifiers", "countable-uncountable",
  "simple-conditionals", "vocabulary", "signs-notices", "short-messages", "emails",
  "everyday-situations", "shops", "hotels", "airports", "health", "reading-comprehension",
  "railway-vocabulary",
];

const original = {
  id: "orig-a2-contract-fixture", origin: "original", domain: "english-a2",
  topicId: "past-simple", topic: "Un título que puede cambiar", skill: "GRAMMAR",
  prompt: "Yesterday, Lena ___ a small blue cup.",
  options: [{ key: "A", text: "bought" }, { key: "B", text: "buy" }, { key: "C", text: "buying" }, { key: "D", text: "buys" }],
  answer: "A", explanation: "Yesterday sitúa la acción terminada en pasado: bought.",
  difficulty: 1, tags: [], conceptIds: ["ingles-concept-1"], status: "reviewed", reviewedAt: "2026-10-16",
};

describe("shared A2 curriculum and original practice", () => {
  it("preserves all persisted topic IDs independently of display titles", () => {
    expect(catalog.topics.map((topic) => topic.id)).toEqual(stableIds);
    const renamed = structuredClone(catalog);
    renamed.topics[3]!.title = "Pasado simple: nuevo título";
    expect(englishTopicCatalogSchema.parse(renamed).topics[3]!.id).toBe("past-simple");
    expect(originalPracticeQuestionSchema.parse(original).topicId).toBe("past-simple");
  });

  it("rejects duplicate, empty, malformed and removed stable topic IDs", () => {
    for (const id of ["", "Past Simple", "past.simple", "renamed-past-simple", "present-simple"]) {
      const changed = structuredClone(catalog);
      changed.topics[3]!.id = id;
      expect(englishTopicCatalogSchema.safeParse(changed).success).toBe(false);
    }
    for (const overrides of [{ title: "" }, { area: "TIME" }]) {
      const changed = structuredClone(catalog);
      Object.assign(changed.topics[0]!, overrides);
      expect(englishTopicCatalogSchema.safeParse(changed).success).toBe(false);
    }
  });

  it("rejects renaming the persisted supplementary railway topic as well", () => {
    const changed = structuredClone(catalog);
    changed.topics.find(({ id }) => id === "railway-vocabulary")!.id = "renamed-railway-vocabulary";
    expect(englishTopicCatalogSchema.safeParse(changed).success).toBe(false);
  });

  it("links every curriculum topic to its own active English teaching concept", () => {
    const englishConcepts = new Set(lessonTheories["ingles-a2"]!.concepts.map(({ id }) => id));
    for (const topic of catalog.topics) {
      expect(topic.mappingStatus).toBe("linked_to_active_theory");
      expect(topic.activeConceptIds.length).toBeGreaterThan(0);
      expect(topic.activeConceptIds.every((id) => englishConcepts.has(id))).toBe(true);
    }
  });

  it("covers every topic and five skills with at least 18 eligible original items", () => {
    const questions = listOriginalPracticeQuestions({ domain: "english-a2", status: "reviewed" });
    expect(questions.length).toBeGreaterThanOrEqual(18);
    expect([...new Set(questions.map(({ topicId }) => topicId))].sort()).toEqual([...stableIds].sort());
    expect([...new Set(questions.map(({ skill }) => skill))].sort()).toEqual(["CONTEXT", "GRAMMAR", "READING", "SIGN", "VOCABULARY"]);
    for (const question of questions) {
      const topic = catalog.topics.find(({ id }) => id === question.topicId)!;
      expect(question.conceptIds.length).toBeGreaterThan(0);
      expect(question.conceptIds.every((id) => topic.activeConceptIds.includes(id))).toBe(true);
      expect(question.explanation.length).toBeGreaterThan(20);
      expect(toPublicPracticeQuestion(question)?.origin).toBe("original");
      expect(toPublicPracticeQuestion(question)).not.toHaveProperty("answer");
      expect(toPublicPracticeQuestion(question)).not.toHaveProperty("explanation");
    }
  });

  it("rejects unknown topics, knowledge categories and attempt causes in question metadata", () => {
    for (const overrides of [
      { topicId: "missing-topic" }, { topicId: "CARELESSNESS" }, { skill: "UNKNOWN" },
      { skill: "TIME" }, { errorCategory: "UNKNOWN" }, { errorCategory: "READING" },
      { errorCategory: "CARELESSNESS" }, { errorCategory: "TIME" },
      { conceptIds: ["rcf-concept-1"] }, { conceptIds: ["ingles-concept-2"] },
    ]) {
      expect(originalPracticeQuestionSchema.safeParse({ ...original, ...overrides }).success).toBe(false);
    }
    expect(originalPracticeQuestionSchema.safeParse({ ...original, errorCategory: "GRAMMAR" }).success).toBe(true);
  });
});
