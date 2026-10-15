import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { activeTheoryConceptRegistry } from "../content/theory-concepts";
import { officialItems } from "../content/syllabus";
import { parseOfficialCommonSectionCatalog, validateOfficialCommonQuestionMapping } from "../lib/content/official-common-sections";
import { parseSourceManifest } from "../lib/content/source-manifest";

const readJson = (file: string) => JSON.parse(readFileSync(resolve(process.cwd(), file), "utf8")) as unknown;
const manifest = readJson("content/official-exams/manifest.json") as any[];
const commonSections = readJson("content/official-exams/common-sections.json") as any[];
const specificQuestions = readJson("content/questions.json") as Array<{ id: string }>;
const specificIds = new Set(specificQuestions.map(({ id }) => id));
const englishTopics = readJson("content/official-exams/english-topics.json") as any;
const sourceManifest = parseSourceManifest(readJson("content/source-manifest.json"));
const sources = sourceManifest.sources.map((source) => ({
  sourceId: source.sourceId,
  sourceVersion: source.sourceVersion,
  url: source.url,
  sourceType: source.sourceType,
  status: source.status,
  locatorPolicy: source.locatorPolicy,
  rightsBasis: source.rightsBasis,
}));

describe("official ADIF common-section metadata", () => {
  it("validates three section records for each of the eight Telecom forms without exposing question text", () => {
    const result = parseOfficialCommonSectionCatalog({ commonSections, englishTopics, manifest, sources });

    expect(result.commonSections).toHaveLength(24);
    expect(result.commonSections.filter((section) => section.section === "psychometric")).toHaveLength(8);
    expect(result.commonSections.filter((section) => section.section === "english")).toHaveLength(8);
    expect(result.commonSections.filter((section) => section.section === "general")).toHaveLength(8);
    expect(result.commonSections.every((section) => section.publicationStatus !== "approved_for_publication")).toBe(true);
    expect(result.commonSections.flatMap((section) => section.questionMetadata)).toHaveLength(432);
    const questionMetadata = result.commonSections.flatMap((section) => section.questionMetadata);
    expect(questionMetadata.every((item) => Object.keys(item).sort().join(",") === "id,isReserve,questionNumber")).toBe(true);
    expect(questionMetadata.every((item) => /^ADIF-\d{4}-\d{4}-(psychometric|english|general)-Q\d{2}$/.test(item.id))).toBe(true);
    expect(questionMetadata.some(({ id }) => specificIds.has(id))).toBe(false);
  });

  it("uses section-qualified metadata IDs and preserves existing official specific question IDs", () => {
    for (const section of commonSections) {
      expect(section.id).toMatch(/^ADIF-\d{4}-\d{4}-(psychometric|english|general)$/);
      expect(specificIds.has(section.id)).toBe(false);
    }
    expect(specificQuestions).toHaveLength(102);
    expect(specificQuestions.every(({ id }) => /-Q\d{2}$/.test(id))).toBe(true);
  });

  it("keeps every exam form and session isolated and rejects duplicate section/question coverage", () => {
    const mutatedSession = structuredClone(commonSections);
    mutatedSession.find((row: any) => row.examId === "ADIF-2024-1044").session = {
      date: "2024-11-24",
      location: "Valencia",
    };
    expect(() => parseOfficialCommonSectionCatalog({ commonSections: mutatedSession, englishTopics, manifest, sources }))
      .toThrow(/session/i);

    const duplicate = [...structuredClone(commonSections), structuredClone(commonSections[0])];
    expect(() => parseOfficialCommonSectionCatalog({ commonSections: duplicate, englishTopics, manifest, sources }))
      .toThrow(/duplicate|exactly three/i);

    const duplicateQuestion = structuredClone(commonSections);
    const section = duplicateQuestion[0];
    section.questionMetadata[1].questionNumber = section.questionMetadata[0].questionNumber;
    expect(() => parseOfficialCommonSectionCatalog({ commonSections: duplicateQuestion, englishTopics, manifest, sources }))
      .toThrow(/question metadata|question numbers/i);
  });

  it("requires a complete user-requested A2 topic taxonomy and active concept links where claimed", () => {
    const result = parseOfficialCommonSectionCatalog({ commonSections, englishTopics, manifest, sources });
    const topicIds = result.englishTopics.topics.map((topic: any) => topic.id);

    for (const id of [
      "there-is-are", "present-simple", "present-continuous", "past-simple", "future",
      "modal-verbs", "comparatives", "prepositions", "quantifiers", "countable-uncountable",
      "simple-conditionals", "vocabulary", "signs-notices", "short-messages", "emails",
      "everyday-situations", "shops", "hotels", "airports", "health", "reading-comprehension",
    ]) {
      expect(topicIds).toContain(id);
    }
    expect(new Set(topicIds).size).toBe(topicIds.length);
    expect(result.englishTopics.topics.every((topic: any) =>
      topic.activeConceptIds.every((id: string) => activeTheoryConceptRegistry.has(id)),
    )).toBe(true);
    expect(result.englishTopics.topics.find((topic: any) => topic.id === "past-simple")!.activeConceptIds)
      .toContain("ingles-concept-1");
  });

  it("does not let a publication status or an unverified source authorize question text", () => {
    const approvedWithoutReview = structuredClone(commonSections);
    const row = approvedWithoutReview.find((section: any) => section.section === "english");
    row.publicationStatus = "approved_for_publication";
    row.publicationReview = null;
    expect(() => parseOfficialCommonSectionCatalog({ commonSections: approvedWithoutReview, englishTopics, manifest, sources }))
      .toThrow(/publication|review/i);

    const reviewWithoutVerifiedRights = structuredClone(commonSections);
    const reviewedRow = reviewWithoutVerifiedRights.find((section: any) => section.section === "english");
    reviewedRow.publicationStatus = "approved_for_publication";
    reviewedRow.publicationReview = {
      decisionId: "test-rights-review",
      decision: "approved",
      permittedUse: "public_question_text",
      reviewedAt: "2026-10-15",
      reviewerRole: "human_editor",
      scope: { examIds: [reviewedRow.examId], sections: ["english"], content: "official_question_text" },
      evidence: {
        sourceId: reviewedRow.source.sourceId,
        sourceVersion: reviewedRow.source.sourceVersion,
        locator: "PDF p. 1",
        basis: "documented_legal_review",
      },
      rationale: "Test review only; source is unverified and carries no rights basis.",
    };
    expect(() => parseOfficialCommonSectionCatalog({ commonSections: reviewWithoutVerifiedRights, englishTopics, manifest, sources }))
      .toThrow(/rights|unresolved|publication review/i);

    const reviewWithWrongSectionScope = structuredClone(commonSections);
    const wrongScopeRow = reviewWithWrongSectionScope.find((section: any) => section.section === "english");
    wrongScopeRow.publicationStatus = "approved_for_publication";
    wrongScopeRow.publicationReview = {
      decisionId: "test-wrong-section-review",
      decision: "approved",
      permittedUse: "public_question_text",
      reviewedAt: "2026-10-15",
      reviewerRole: "human_editor",
      scope: { examIds: [wrongScopeRow.examId], sections: ["general"], content: "official_question_text" },
      evidence: {
        sourceId: wrongScopeRow.source.sourceId,
        sourceVersion: wrongScopeRow.source.sourceVersion,
        locator: "PDF p. 1",
        basis: "documented_legal_review",
      },
      rationale: "Test review only; the approved section intentionally differs.",
    };
    const reviewedRightsSources = sources.map((source) =>
      source.sourceId === wrongScopeRow.source.sourceId && source.sourceVersion === wrongScopeRow.source.sourceVersion
        ? { ...source, status: "verified" as const, locatorPolicy: "exact" as const, rightsBasis: "documented_legal_review" as const }
        : source,
    );
    expect(() => parseOfficialCommonSectionCatalog({
      commonSections: reviewWithWrongSectionScope,
      englishTopics,
      manifest,
      sources: reviewedRightsSources,
    })).toThrow(/exact section/i);

    const psychometricText = structuredClone(commonSections);
    const restricted = psychometricText.find((section: any) => section.section === "psychometric");
    restricted.questionMetadata[0].prompt = "protected";
    expect(() => parseOfficialCommonSectionCatalog({ commonSections: psychometricText, englishTopics, manifest, sources }))
      .toThrow();
  });

  it("accepts only general mappings to current common syllabus nodes", () => {
    const result = parseOfficialCommonSectionCatalog({ commonSections, englishTopics, manifest, sources });
    const validNode = officialItems.find((item) => item.scope === "common")?.children[0]?.id;
    expect(validNode).toBeTruthy();
    expect(validateOfficialCommonQuestionMapping({
      section: "general",
      syllabusNodeId: validNode,
      conceptIds: ["igualdad-concept-1"],
    }, result.englishTopics, sources)).toEqual([]);
    expect(validateOfficialCommonQuestionMapping({
      section: "general",
      syllabusNodeId: "not-a-current-common-node",
      conceptIds: ["igualdad-concept-1"],
    }, result.englishTopics, sources).join(" ")).toMatch(/syllabus/i);
    expect(validateOfficialCommonQuestionMapping({
      section: "general",
      syllabusNodeId: validNode,
      conceptIds: [],
    }, result.englishTopics, sources).join(" ")).toMatch(/conceptIds/i);
    expect(validateOfficialCommonQuestionMapping({
      section: "general",
      syllabusNodeId: validNode,
      conceptIds: ["not-an-active-concept"],
    }, result.englishTopics, sources).join(" ")).toMatch(/unknown or inactive/i);
    expect(validateOfficialCommonQuestionMapping({
      section: "general",
      syllabusNodeId: validNode,
      conceptIds: ["igualdad-concept-1", "igualdad-concept-1"],
    }, result.englishTopics, sources).join(" ")).toMatch(/duplicates/i);
  });

  it("requires English questions to use a linked stable A2 topic and its active theory concepts", () => {
    const result = parseOfficialCommonSectionCatalog({ commonSections, englishTopics, manifest, sources });
    const topicCatalog = structuredClone(result.englishTopics);
    const pastSimple = topicCatalog.topics.find((topic: any) => topic.id === "past-simple")!;
    pastSimple.reviewStatus = "reviewed";
    pastSimple.reviewEvidence = {
      sourceId: "MCER-A2",
      sourceVersion: "web-reference-candidate",
      locator: "Nivel A2, descriptor revisado en prueba unitaria",
      reviewedAt: "2026-10-15",
    };
    const testSources = sources.map((source) => source.sourceId === "MCER-A2"
      ? { ...source, status: "verified" as const, locatorPolicy: "exact" as const }
      : source);
    expect(validateOfficialCommonQuestionMapping({
      section: "english",
      topicId: "past-simple",
      conceptIds: ["ingles-concept-1"],
    }, topicCatalog, testSources)).toEqual([]);
    expect(validateOfficialCommonQuestionMapping({
      section: "english",
      topicId: "present-simple",
      conceptIds: ["ingles-concept-1"],
    }, result.englishTopics, sources).join(" ")).toMatch(/reviewed topic/i);
    expect(validateOfficialCommonQuestionMapping({
      section: "english",
      topicId: "past-simple",
      conceptIds: ["igualdad-concept-1"],
    }, topicCatalog, testSources).join(" ")).toMatch(/active concepts/i);
  });
});
