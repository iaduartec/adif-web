import { describe, expect, it } from "vitest";

import { flashcards } from "../content/flashcards";
import { lessonSummaries } from "../content/lesson-summaries";
import { lessonTheories } from "../content/lesson-theory";
import { officialItems } from "../content/syllabus";
import { questionContentFingerprint } from "../lib/content/question-content-fingerprint";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";
import questionsJson from "../content/questions.json";
import { officialQuestionsSchema } from "../lib/content/schema";
import { sourceManifest } from "../lib/content/source-manifest";

const sourceVersion = "consolidated-page-2026-11-02";
const sourceUrl = "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292";
const articles = [1, 2, 3, 4] as const;

describe("PRL chapter I study unit", () => {
  it("teaches articles 1–4 with reviewed claims pinned to the current verified BOE capture", () => {
    const theory = lessonTheories["prevencion-riesgos-laborales"];
    const currentSource = sourceManifest.sources.find((source) =>
      source.sourceId === "Ley 31/1995" && source.sourceVersion === sourceVersion,
    );

    expect(currentSource).toMatchObject({
      sourceType: "primary",
      status: "verified",
      downloadedAt: "2026-11-02",
      verifiedAt: "2026-11-02",
      hashTarget: "downloaded-page",
      url: sourceUrl,
    });
    expect(currentSource?.sha256).toMatch(/^[a-f0-9]{64}$/);

    for (const article of articles) {
      const referenceId = `lprl-31-1995-art${article}`;
      const concept = theory.concepts.find((item) => item.id === `prl-concept-${14 + article}`);
      expect(concept, `missing concept for article ${article}`).toBeDefined();
      expect(concept?.claims.length).toBeGreaterThan(0);

      const reference = theory.sources.find((item) => item.id === referenceId);
      expect(reference).toMatchObject({
        sourceId: "Ley 31/1995",
        sourceVersion,
        verifiedAt: "2026-11-02",
        sourceUrl,
      });
      expect(reference?.locator).toMatch(new RegExp(`^Artículo ${article}(?:\\b|;)`));
      expect(concept?.claims.every((claim) => claim.legalBasis.includes(referenceId))).toBe(true);
      expect(concept?.claims.every((claim) => claim.review?.status === "reviewed")).toBe(true);
      expect(concept?.claims.every((claim) => claim.review?.reviewedAt === "2026-11-02")).toBe(true);

      const takeaway = theory.reviewTakeaways.find((claim) => claim.id === `prl-chapter-i-takeaway-art${article}`);
      expect(takeaway?.legalBasis).toContain(referenceId);
      expect(takeaway?.review?.status).toBe("reviewed");
      expect(flashcards.some((card) =>
        card.module === "G2 PRL" && new RegExp(`art(?:í|i)culo\\s+${article}`, "i").test(card.front),
      )).toBe(true);
    }
  });

  it("includes a concise four-article recall summary and a practical example", () => {
    const summary = lessonSummaries["prevencion-riesgos-laborales"];
    const theory = lessonTheories["prevencion-riesgos-laborales"];

    for (const article of articles) {
      expect(summary.keyFacts.some((fact) => new RegExp(`art(?:í|i)culo\\s+${article}`, "i").test(fact))).toBe(true);
    }
    expect(theory.examples.some((example) => example.id === "prl-capitulo-i-example-1")).toBe(true);
  });

  it("keeps chapter I partial while the current ADIF attachment remains inaccessible", () => {
    const parent = officialItems.find((item) => item.sourceId === "PNI26-COMMON-02");
    const chapter = parent?.children.find((item) => item.id === "prl-capitulo-i");

    expect(chapter).toMatchObject({
      status: "partial",
      materialSourceIds: ["Ley 31/1995"],
      linkedModules: ["prevencion-riesgos-laborales"],
    });
    expect(chapter?.rationale).toMatch(/403|current.*attachment|adjunto.*actual/i);
  });

  it("provides original, source-grounded practice for all four chapter-I concepts and cognitive demands", () => {
    const chapterQuestions = listOriginalPracticeQuestions({
      domain: "general-knowledge",
      topicId: "prl-capitulo-i",
      status: "reviewed",
    });
    const expectedConceptIds = articles.map((article) => `prl-concept-${14 + article}`);
    const cognitiveTags = ["recall", "discrimination", "application"];
    const officialQuestions = officialQuestionsSchema.parse(questionsJson);
    const officialFingerprints = new Set(officialQuestions.map((question) => question.source.fingerprint));

    for (const conceptId of expectedConceptIds) {
      expect(
        chapterQuestions.filter((question) => question.conceptIds.includes(conceptId)).length,
        conceptId,
      ).toBeGreaterThanOrEqual(2);
    }
    for (const article of articles) {
      expect(chapterQuestions.some((question) =>
        question.sourceLocator?.startsWith(`Artículo ${article}`),
      ), `article ${article}`).toBe(true);
    }
    for (const tag of cognitiveTags) {
      expect(chapterQuestions.some((question) => question.tags.includes(tag)), tag).toBe(true);
    }

    for (const question of chapterQuestions) {
      expect(question.origin, question.id).toBe("original");
      expect(question.sourceId, question.id).toBe("Ley 31/1995");
      expect(question.sourceVersion, question.id).toBe(sourceVersion);
      expect(question.options, question.id).toHaveLength(4);
      expect(new Set(question.options.map((option) => option.text)).size, question.id).toBe(4);
      expect(question.conceptIds.length, question.id).toBeGreaterThan(0);
      expect(question.tags, question.id).toContain("original-comun");
      expect(question.tags, question.id).toContain("prl");
      expect(question.explanation, question.id).toMatch(new RegExp(`La respuesta ${question.answer} es correcta`, "i"));
      for (const option of ["A", "B", "C", "D"]) {
        expect(question.explanation, `${question.id}/${option}`).toMatch(new RegExp(`(?:^|\\s)${option}:`, "m"));
      }

      expect(officialFingerprints.has(questionContentFingerprint(question)), question.id).toBe(false);
      const publicDto = toPublicPracticeQuestion(question);
      expect(publicDto, question.id).not.toBeNull();
      expect(publicDto, question.id).not.toHaveProperty("answer");
      expect(publicDto, question.id).not.toHaveProperty("explanation");
    }
  });
});
