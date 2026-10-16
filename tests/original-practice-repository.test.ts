import { describe, expect, it } from "vitest";

import questionsJson from "../content/questions.json";
import { officialItems } from "../content/syllabus";
import { createOriginalPracticeRepository } from "../lib/content/original-practice-repository";
import { officialQuestionsSchema } from "../lib/content/schema";

const baseQuestion = {
  id: "orig-a2-there-is-001",
  domain: "english-a2",
  topicId: "there-is-are",
  topic: "There is / There are",
  skill: "GRAMMAR",
  prompt: "Synthetic practice prompt authored for this repository test.",
  options: [
    { key: "A", text: "Option A" },
    { key: "B", text: "Option B" },
    { key: "C", text: "Option C" },
    { key: "D", text: "Option D" },
  ],
  answer: "B",
  explanation: "Option B agrees with the singular noun in the synthetic example.",
  difficulty: 1,
  tags: ["synthetic"],
  conceptIds: [],
  status: "draft",
  origin: "original",
} as const;

function firstSyllabusNode(scope: "common" | "specific-26-12po") {
  const node = officialItems.find((item) => item.scope === scope)?.children[0];
  if (!node) throw new Error("No syllabus node in scope " + scope + ".");
  return node;
}

function normativeQuestion(
  domain: "general-knowledge" | "telecom",
  scope: "common" | "specific-26-12po",
  id: string,
) {
  const node = firstSyllabusNode(scope);
  return {
    ...baseQuestion,
    id,
    domain,
    topicId: node.id,
    syllabusNodeId: node.id,
    topic: node.title,
    prompt: `Normative synthetic ${domain} source-grounded example for this repository test.`,
  };
}

function repositoryInputs(overrides: Record<string, unknown[]> = {}) {
  return {
    englishA2: [baseQuestion],
    generalKnowledge: [normativeQuestion("general-knowledge", "common", "orig-general-001")],
    psychometric: [{
      ...baseQuestion,
      id: "orig-psych-numerical-001",
      domain: "psychometric",
      topicId: "numerical",
      topic: "Aptitud numérica",
      skill: "numerical",
      prompt: "A distinct synthetic numerical reasoning item for this repository test.",
    }],
    telecom: [normativeQuestion("telecom", "specific-26-12po", "orig-telecom-001")],
    ...overrides,
  };
}

describe("original practice repository", () => {
  it("reads four domain-separated original datasets in deterministic order", () => {
    const repository = createOriginalPracticeRepository(repositoryInputs());

    expect(repository.listOriginalPracticeQuestions().map((question) => question.domain)).toEqual([
      "english-a2",
      "general-knowledge",
      "psychometric",
      "telecom",
    ]);
    expect(repository.listOriginalPracticeQuestions().every((question) => question.origin === "original")).toBe(true);
  });

  it("filters by domain and case-insensitive topic IDs and display labels", () => {
    const repository = createOriginalPracticeRepository(repositoryInputs());

    expect(repository.listOriginalPracticeQuestions({ domain: "english-a2" })).toHaveLength(1);
    expect(repository.listOriginalPracticeQuestions({ topicId: "THERE-IS-ARE" }).map(({ id }) => id)).toEqual([
      "orig-a2-there-is-001",
    ]);
    expect(repository.listOriginalPracticeQuestions({ topic: "THERE IS" }).map(({ id }) => id)).toEqual([
      "orig-a2-there-is-001",
    ]);
    expect(repository.listOriginalPracticeQuestions({ query: "SYNTHETIC" })).toHaveLength(4);
  });

  it("does not add official questions or records to the original repository", () => {
    const repository = createOriginalPracticeRepository(repositoryInputs());

    expect(repository.getOriginalPracticeQuestion("24-05PO-3403-SPECIFIC-Q1")).toBeUndefined();
    expect(repository.listOriginalPracticeQuestions({ ids: ["24-05PO-3403-SPECIFIC-Q1"] })).toEqual([]);
  });

  it("keeps an original question original when it shares a syllabus node with an official question", () => {
    const officialQuestion = officialQuestionsSchema.parse(questionsJson).find((question) => question.syllabusNodeId);
    expect(officialQuestion?.syllabusNodeId).toBeDefined();

    const original = {
      ...baseQuestion,
      id: "orig-shared-syllabus-node-001",
      domain: "telecom",
      topicId: officialQuestion!.syllabusNodeId!,
      syllabusNodeId: officialQuestion!.syllabusNodeId!,
      topic: "Syllabus node shared with an official historical item",
      prompt: "An original, independently authored question using a shared syllabus node.",
    };
    const repository = createOriginalPracticeRepository(repositoryInputs({ telecom: [original] }));

    expect(repository.getOriginalPracticeQuestion(original.id)?.origin).toBe("original");
    expect(repository.getOriginalPracticeQuestion(officialQuestion!.id)).toBeUndefined();
  });

  it("returns undefined for missing original IDs", () => {
    const repository = createOriginalPracticeRepository(repositoryInputs());

    expect(repository.getOriginalPracticeQuestion("orig-does-not-exist")).toBeUndefined();
  });

  it("validates inputs at the repository boundary and rejects official indicators", () => {
    const invalidOriginal = { ...baseQuestion, official: true };

    expect(() => createOriginalPracticeRepository(repositoryInputs({ englishA2: [invalidOriginal] }))).toThrow();
    expect(() => createOriginalPracticeRepository(repositoryInputs({
      englishA2: [{ ...baseQuestion, domain: "psychometric" }],
    }))).toThrow();
  });

  it("rejects duplicate original IDs across the separated domain datasets", () => {
    expect(() => createOriginalPracticeRepository(repositoryInputs({
      psychometric: [{ ...baseQuestion, domain: "psychometric", topicId: "numerical", topic: "Aptitud numérica", skill: "numerical", id: baseQuestion.id }],
    }))).toThrow(/duplicate/i);
  });

  it("rejects original records whose content fingerprint matches an official ADIF question", () => {
    const officialQuestion = officialQuestionsSchema.parse(questionsJson).find((question) =>
      question.syllabusNodeId && question.source.section === "specific",
    );
    expect(officialQuestion).toBeDefined();

    const copiedQuestion = {
      ...normativeQuestion("telecom", "specific-26-12po", "orig-copied-official-content-001"),
      syllabusNodeId: officialQuestion!.syllabusNodeId,
      topicId: officialQuestion!.syllabusNodeId,
      prompt: officialQuestion!.prompt,
      options: officialQuestion!.options,
      answer: officialQuestion!.answer,
    };

    expect(() => createOriginalPracticeRepository(repositoryInputs({ telecom: [copiedQuestion] })))
      .toThrow(/matches an official ADIF question/i);
  });

  it("rejects copied official prompts and options even if an original record changes the keyed answer", () => {
    const officialQuestion = officialQuestionsSchema.parse(questionsJson).find((question) =>
      question.syllabusNodeId && question.source.section === "specific",
    );
    expect(officialQuestion).toBeDefined();
    const changedAnswer = officialQuestion!.answer === "A" ? "B" : "A";
    const copiedQuestion = {
      ...normativeQuestion("telecom", "specific-26-12po", "orig-copied-official-content-answer-change-001"),
      syllabusNodeId: officialQuestion!.syllabusNodeId,
      topicId: officialQuestion!.syllabusNodeId,
      prompt: officialQuestion!.prompt,
      options: [...officialQuestion!.options].reverse(),
      answer: changedAnswer,
    };

    expect(() => createOriginalPracticeRepository(repositoryInputs({ telecom: [copiedQuestion] })))
      .toThrow(/matches an official ADIF question/i);
  });

  it("returns deterministic defensive copies without mutating repository inputs", () => {
    const inputs = repositoryInputs();
    const initialPrompt = inputs.englishA2[0]!.prompt;
    const repository = createOriginalPracticeRepository(inputs);

    const firstResult = repository.listOriginalPracticeQuestions();
    (firstResult[0] as { prompt: string }).prompt = "Mutated by a consumer.";

    expect(inputs.englishA2[0]!.prompt).toBe(initialPrompt);
    expect(repository.getOriginalPracticeQuestion(baseQuestion.id)?.prompt).toBe(initialPrompt);
    expect(repository.listOriginalPracticeQuestions().map(({ id }) => id)).toEqual(
      repository.listOriginalPracticeQuestions().map(({ id }) => id),
    );
  });
});
