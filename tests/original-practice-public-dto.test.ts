import { describe, expect, it } from "vitest";

import questionsJson from "../content/questions.json";
import { officialItems } from "../content/syllabus";
import { officialQuestionsSchema } from "../lib/content/schema";
import { sourceManifest } from "../lib/content/source-manifest";
import {
  originalPracticePublicQuestionSchema,
  toPublicPracticeQuestion,
} from "../lib/content/original-practice-public-dto";

const reviewedOriginal = {
  id: "orig-a2-reviewed-synthetic-001",
  domain: "english-a2",
  topicId: "past-simple",
  topic: "Past Simple",
  skill: "GRAMMAR",
  prompt: "A newly authored synthetic sentence with one correct answer.",
  options: [
    { key: "A", text: "She walk to work yesterday." },
    { key: "B", text: "She walked to work yesterday." },
    { key: "C", text: "She walking to work yesterday." },
    { key: "D", text: "She walks to work yesterday." },
  ],
  answer: "B",
  explanation: "The past simple form of this regular verb ends in -ed.",
  difficulty: 1,
  tags: ["synthetic", "past-simple"],
  conceptIds: ["ingles-concept-1"],
  status: "reviewed",
  reviewedAt: "2026-10-16",
  origin: "original",
} as const;

describe("original practice public DTO", () => {
  it("maps an explicit answer-free shape with an unambiguous original discriminator", () => {
    const dto = toPublicPracticeQuestion({ ...reviewedOriginal, errorCategory: "GRAMMAR" });

    expect(dto).not.toBeNull();
    expect(dto?.origin).toBe("original");
    expect(Object.keys(dto ?? {}).sort()).toEqual([
      "difficulty",
      "domain",
      "id",
      "options",
      "origin",
      "prompt",
      "skill",
      "tags",
      "topic",
      "topicId",
    ]);
    expect(dto).not.toHaveProperty("answer");
    expect(dto).not.toHaveProperty("explanation");
  });

  it("does not expose internal editorial, learning, answer or publication-gate fields", () => {
    const internal = {
      ...reviewedOriginal,
      errorCategory: "GRAMMAR",
      sha256: "a".repeat(64),
      confidence: "high",
      official: false,
      tribunal: null,
      publicationEvidence: null,
      fingerprint: "internal-fingerprint",
    };
    const dto = toPublicPracticeQuestion(internal);

    expect(dto).toBeNull();
  });

  it("only returns reviewed records that pass runtime schema validation", () => {
    expect(toPublicPracticeQuestion({ ...reviewedOriginal, status: "draft" })).toBeNull();
    expect(toPublicPracticeQuestion({ ...reviewedOriginal, origin: "official_reference" })).toBeNull();
    expect(toPublicPracticeQuestion({ ...reviewedOriginal, official: true })).toBeNull();
    expect(toPublicPracticeQuestion({ ...reviewedOriginal, answer: "E" })).toBeNull();
  });

  it("does not publish a reviewed original that duplicates official question content", () => {
    const officialQuestion = officialQuestionsSchema.parse(questionsJson)[0]!;
    const dto = toPublicPracticeQuestion({
      ...reviewedOriginal,
      prompt: officialQuestion.prompt,
      options: officialQuestion.options,
      answer: officialQuestion.answer,
    });

    expect(dto).toBeNull();
  });

  it("does not publish an official question copied with option letters reassigned", () => {
    const officialQuestion = officialQuestionsSchema.parse(questionsJson)[0]!;
    const keys = ["A", "B", "C", "D"] as const;
    const relabeledOptions = officialQuestion.options.map((option, index) => ({
      key: keys[(index + 1) % keys.length]!,
      text: option.text,
    }));
    const correctOptionText = officialQuestion.options.find((option) => option.key === officialQuestion.answer)!.text;
    const relabeledAnswer = relabeledOptions.find((option) => option.text === correctOptionText)!.key;

    expect(toPublicPracticeQuestion({
      ...reviewedOriginal,
      prompt: officialQuestion.prompt,
      options: relabeledOptions,
      answer: relabeledAnswer,
    })).toBeNull();
  });

  it("keeps an original grounded in the same ADIF booklet URL used by an official item", () => {
    const officialQuestion = officialQuestionsSchema.parse(questionsJson)[0]!;
    const booklet = sourceManifest.sources.find((source) =>
      source.url === officialQuestion.source.documentUrl && source.sourceType === "primary",
    );
    expect(booklet).toBeDefined();

    const dto = toPublicPracticeQuestion({
      ...reviewedOriginal,
      sourceId: booklet!.sourceId,
      sourceVersion: booklet!.sourceVersion,
      sourceLocator: "Referencia de prueba al material fuente ADIF.",
    });

    expect(dto?.origin).toBe("original");
    expect(dto?.answerGrounding?.url).toBe(officialQuestion.source.documentUrl);
    expect(Object.keys(dto?.answerGrounding ?? {}).sort()).toEqual([
      "locator",
      "organization",
      "sourceId",
      "sourceVersion",
      "title",
      "url",
    ]);
    expect(dto?.answerGrounding).not.toHaveProperty("sha256");
  });

  it("keeps an original when it shares an official question's syllabus node and normative source", () => {
    const officialQuestion = officialQuestionsSchema.parse(questionsJson).find((question) =>
      question.syllabusNodeId === "rcf-capitulo-1",
    );
    const rcfParent = officialItems.find((item) =>
      item.scope === "specific-26-12po" && item.children.some((node) => node.id === "rcf-capitulo-1"),
    );
    const rcfNode = rcfParent?.children.find((node) => node.id === "rcf-capitulo-1");
    expect(officialQuestion).toBeDefined();
    expect(rcfNode?.materialSourceIds).toContain("RD 664/2015");

    const dto = toPublicPracticeQuestion({
      ...reviewedOriginal,
      id: "orig-rcf-shared-node-synthetic-001",
      domain: "telecom",
      topicId: rcfNode!.id,
      syllabusNodeId: rcfNode!.id,
      topic: rcfNode!.title,
      conceptIds: ["rcf-concept-1"],
      sourceId: "RD 664/2015",
      sourceVersion: "consolidated-page-2026-10-15",
      sourceLocator: "Capítulo 1, 1.1.1.1 Objeto del Reglamento",
    });

    expect(dto?.origin).toBe("original");
    expect(dto?.answerGrounding?.sourceId).toBe("RD 664/2015");
  });

  it("keeps origin original for a primary ADIF source with a verified document hash", () => {
    const hashedAdifSource = sourceManifest.sources.find((source) =>
      source.sourceType === "primary" && source.authority === "A" &&
      source.status === "verified" && source.sha256 !== null && source.organization.includes("(ADIF)"),
    );
    expect(hashedAdifSource?.sha256).toMatch(/^[a-f0-9]{64}$/);

    const dto = toPublicPracticeQuestion({
      ...reviewedOriginal,
      sourceId: hashedAdifSource!.sourceId,
      sourceVersion: hashedAdifSource!.sourceVersion,
      sourceLocator: "Localizador sintético, sin atribuir el enunciado a ADIF.",
    });

    expect(dto?.origin).toBe("original");
    expect(dto?.answerGrounding?.sourceId).toBe(hashedAdifSource!.sourceId);
    expect(dto?.answerGrounding).not.toHaveProperty("sha256");
  });

  it("does not let a consumer add official metadata or change the original discriminator", () => {
    const dto = toPublicPracticeQuestion(reviewedOriginal);
    expect(dto).not.toBeNull();

    expect(originalPracticePublicQuestionSchema.safeParse({ ...dto, official: true }).success).toBe(false);
    expect(originalPracticePublicQuestionSchema.safeParse({ ...dto, origin: "official_reference" }).success).toBe(false);
    expect(originalPracticePublicQuestionSchema.safeParse(dto).success).toBe(true);
  });
});
