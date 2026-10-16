import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import questionsJson from "../content/questions.json";
import PsicotecnicosPage from "../app/(dashboard)/psicotecnicos/page";
import { PsychometricPractice } from "../components/practice/psychometric-practice";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { toPublicPracticeQuestion, originalPracticePublicQuestionSchema } from "../lib/content/original-practice-public-dto";
import { originalPracticeQuestionSchema } from "../lib/content/original-practice-schema";
import { officialQuestionsSchema } from "../lib/content/schema";
import { sourceManifest } from "../lib/content/source-manifest";
import {
  psychometricAptitudes,
  originalPsychometricTopicIds,
  psychometricModes,
  psychometricModeSchema,
  selectPsychometricQuestions,
} from "../lib/content/psychometric-curriculum";

vi.mock("../lib/supabase/server", () => ({
  createServerClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "psico-student" } } }) } }),
}));

afterEach(cleanup);

const aptitudeIds = [...originalPsychometricTopicIds].sort();

const options = [
  { key: "A", text: "Opción A" },
  { key: "B", text: "Opción B" },
  { key: "C", text: "Opción C" },
  { key: "D", text: "Opción D" },
] as const;

const reviewedFixture = {
  id: "orig-psico-fixture-001",
  origin: "original",
  domain: "psychometric",
  topicId: "series",
  topic: "Series numéricas",
  skill: "series",
  prompt: "Completa la serie sintética creada para esta prueba: 2, 4, 6, 8, ___.",
  options,
  answer: "A",
  explanation: "Es una progresión aritmética de razón dos; el término siguiente es diez.",
  difficulty: 1,
  tags: ["synthetic-fixture"],
  conceptIds: ["psico-topic-series"],
  status: "reviewed",
  reviewedAt: "2026-10-16",
} as const;

describe("original psychometric practice", () => {
  it("covers every aptitude with at least 18 reviewed eligible original items", () => {
    const questions = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" });

    expect(questions.length).toBeGreaterThanOrEqual(18);
    expect([...new Set(questions.map(({ topicId }) => topicId))].sort()).toEqual(aptitudeIds);
    expect([...new Set(questions.map(({ skill }) => skill))].sort()).toEqual(aptitudeIds);

    for (const question of questions) {
      const aptitude = psychometricAptitudes.find(({ id }) => id === question.topicId)!;
      expect(aptitude, question.id).toBeDefined();
      expect(question.skill, question.id).toBe(question.topicId);
      expect(question.conceptIds.length, question.id).toBeGreaterThan(0);
      expect(question.conceptIds.every((id) => aptitude.activeConceptIds.includes(id)), question.id).toBe(true);
      expect(question.explanation.length, question.id).toBeGreaterThan(20);
      expect(question.reviewedAt, question.id).toBeTruthy();
      expect(question.origin, question.id).toBe("original");

      const dto = toPublicPracticeQuestion(question);
      expect(dto?.origin, question.id).toBe("original");
      expect(dto, question.id).not.toHaveProperty("answer");
      expect(dto, question.id).not.toHaveProperty("explanation");
      expect(Object.keys(dto ?? {}).sort(), question.id).toEqual([
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
    }
  });

  it("rejects unknown aptitudes, mismatched skills, cross-aptitude concepts and official claims", () => {
    const accepted = originalPracticeQuestionSchema.safeParse(reviewedFixture);
    expect(accepted.success).toBe(true);

    for (const overrides of [
      { topicId: "not-an-aptitude" },
      { topicId: "CARELESSNESS" },
      { skill: "nope" },
      { skill: "logic" },
      { skill: "GRAMMAR" },
      { topic: "Aptitud verbal" },
      { topic: "Aptitud equivocada" },
      { conceptIds: ["psico-topic-logic"] },
      { conceptIds: ["ingles-topic-there-is-are"] },
      { conceptIds: ["concept-not-in-active-theory"] },
      { errorCategory: "CARELESSNESS" },
      { syllabusNodeId: "rcf-capitulo-1" },
    ]) {
      expect(
        originalPracticeQuestionSchema.safeParse({ ...reviewedFixture, ...overrides }).success,
        JSON.stringify(overrides),
      ).toBe(false);
    }

    expect(originalPracticeQuestionSchema.safeParse({
      ...reviewedFixture,
      status: "reviewed",
      reviewedAt: undefined,
    }).success).toBe(false);

    expect(originalPracticeQuestionSchema.safeParse({
      ...reviewedFixture,
      status: "draft",
      reviewedAt: undefined,
      conceptIds: [],
    }).success).toBe(true);
  });

  it("never grounds an original psychometric answer in a normative ADIF source", () => {
    const officialQuestion = officialQuestionsSchema.parse(questionsJson)[0]!;
    const booklet = sourceManifest.sources.find((source) =>
      source.url === officialQuestion.source.documentUrl && source.sourceType === "primary",
    );
    expect(booklet).toBeDefined();

    const reviewedWithSource = {
      ...reviewedFixture,
      sourceId: booklet!.sourceId,
      sourceVersion: booklet!.sourceVersion,
      sourceLocator: "Localizador de prueba: una fuente ADIF no acredita la respuesta de una aptitud.",
    };

    expect(originalPracticeQuestionSchema.safeParse(reviewedWithSource).success).toBe(false);
    expect(toPublicPracticeQuestion(reviewedWithSource)).toBeNull();
  });

  it("keeps the public psychometric DTO closed to wrong labels and official grounding", () => {
    const dto = {
      id: "orig-psico-dto-001",
      origin: "original",
      domain: "psychometric",
      topicId: "series",
      topic: "Series numéricas",
      skill: "series",
      prompt: "Completa la serie sintética: 1, 2, 3, ___.",
      options,
      difficulty: 1,
      tags: ["synthetic-dto"],
    };

    expect(originalPracticePublicQuestionSchema.safeParse(dto).success).toBe(true);
    expect(originalPracticePublicQuestionSchema.safeParse({ ...dto, topic: "Aptitud verbal" }).success).toBe(false);
    expect(originalPracticePublicQuestionSchema.safeParse({ ...dto, skill: "logic" }).success).toBe(false);
    expect(originalPracticePublicQuestionSchema.safeParse({
      ...dto,
      answerGrounding: {
        sourceId: "ADIF-BOOKLET",
        sourceVersion: "2026",
        title: "Cuadernillo",
        organization: "ADIF",
        url: "https://www.adif.es/",
        locator: "Localizador sintético",
      },
    }).success).toBe(false);
  });

  it("changes timing, not answer provenance, when a mode is selected", () => {
    const questions = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" });
    const ids = questions.map(({ id }) => id);
    expect(ids.length).toBeGreaterThanOrEqual(18);

    expect(psychometricModes.map(({ value }) => value).sort()).toEqual(["simulation", "timed", "training"]);

    for (const mode of psychometricModes) {
      expect(psychometricModeSchema.safeParse(mode.value).success).toBe(true);
      expect(selectPsychometricQuestions(questions, mode.value).map(({ id }) => id)).toEqual(ids);
    }

    expect(psychometricModes.find(({ value }) => value === "training")!.secondsPerQuestion).toBeNull();
    expect(psychometricModes.find(({ value }) => value === "timed")!.secondsPerQuestion).toBeGreaterThan(0);
    expect(psychometricModes.find(({ value }) => value === "simulation")!.secondsPerQuestion).toBeGreaterThan(0);
    expect(() => selectPsychometricQuestions(questions, "not-a-mode")).toThrow();
  });

  it("keeps the rendered questions identical when the practice mode changes", () => {
    const questions = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" })
      .map((question) => toPublicPracticeQuestion(question))
      .filter((question) => question !== null);
    const prompts = questions.map(({ prompt }) => prompt);
    expect(prompts.length).toBeGreaterThanOrEqual(18);

    render(createElement(PsychometricPractice, { questions }));
    for (const prompt of prompts) expect(screen.getByText(prompt)).toBeInTheDocument();

    for (const mode of psychometricModes) {
      fireEvent.click(screen.getByRole("radio", { name: new RegExp(mode.label) }));
      for (const prompt of prompts) expect(screen.getByText(prompt)).toBeInTheDocument();
    }
  });

  it("exposes only sanitized original records from the page", async () => {
    const page = await PsicotecnicosPage();
    const html = renderToStaticMarkup(page);
    render(page);

    const questions = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" });
    expect(screen.getByRole("heading", { name: /Práctica original/i })).toBeVisible();
    for (const mode of psychometricModes) {
      expect(screen.getByText(mode.label)).toBeVisible();
    }
    for (const question of questions) {
      expect(screen.getByText(question.prompt)).toBeInTheDocument();
      expect(html).not.toContain(question.explanation);
    }
    expect(html).not.toContain('"answer":');
    expect(html).not.toContain('"explanation":');
    expect(html).not.toContain('"reviewedAt":');
    expect(html).not.toContain('"conceptIds":');
    expect(html).not.toContain('"sourceId":');
    expect(screen.getByText(/no hay preguntas oficiales públicas disponibles/i)).toBeVisible();
  });
});
