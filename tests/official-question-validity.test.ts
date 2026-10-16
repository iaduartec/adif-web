import { describe, expect, it } from "vitest";

import questionRecords from "../content/questions.json";
import {
  classifyHistoricalQuestion,
  validateHistoricalQuestionMappings,
  validateStoredHistoricalQuestionValidity,
} from "../lib/content/official-question-validity";
import { officialQuestionsSchema } from "../lib/content/schema";
import { officialItems } from "../content/syllabus";
import { sourceManifest } from "../lib/content/source-manifest";

describe("historical Telecom question validity mapping", () => {
  it("maps every preserved question to one official 26/12PO node and keeps unverified forms pending", () => {
    const mapped = questionRecords.map((question) =>
      classifyHistoricalQuestion(question, {
        sourceStatus: "needs_check",
        tribunalVerified: false,
        syllabusScopeVerified: false,
        currentness: "unknown",
      }),
    );
    const officialNodeIds = new Set(officialItems
      .filter((item) => item.scope === "specific-26-12po")
      .flatMap((item) => [item.id, ...item.children.map((child) => child.id)]));

    expect(mapped).toHaveLength(102);
    expect(mapped.every((question) => question.syllabusNodeId && officialNodeIds.has(question.syllabusNodeId))).toBe(true);
    expect(mapped.every((question) => question.validity === "pending_review")).toBe(true);
    expect(mapped.every((question) => question.validityReason.trim().length > 0)).toBe(true);
    expect(validateHistoricalQuestionMappings(questionRecords)).toEqual([]);
  });

  it("reports missing or ambiguous concept mappings instead of guessing from question wording", () => {
    const errors = validateHistoricalQuestionMappings([
      { id: "ADIF-2025-1131-Q01", conceptIds: ["missing-concept"] },
      { id: "ADIF-2025-1131-Q02", conceptIds: ["ict-concept-15", "rcf-concept-7"] },
    ]);

    expect(errors.join("\n")).toMatch(/missing-concept.*mapping/i);
    expect(errors.join("\n")).toMatch(/ADIF-2025-1131-Q02.*ambiguous/i);
  });

  it("maps RCF Chapter 5 concepts to the matching 2026 syllabus chapter", () => {
    const chapterFiveQuestions = questionRecords.filter((question) =>
      question.conceptIds.some((conceptId) => ["rcf-concept-10", "rcf-concept-12", "rcf-concept-13"].includes(conceptId)),
    );

    expect(chapterFiveQuestions.map((question) => question.id)).toEqual([
      "ADIF-2023-1433-Q07",
      "ADIF-2023-4101-Q09",
      "ADIF-2024-3403-Q17",
      "ADIF-2024-3413-Q17",
      "ADIF-2025-1131-Q18",
      "ADIF-2025-4104-Q18",
    ]);
    expect(chapterFiveQuestions.every((question) => question.syllabusNodeId === "rcf-capitulo-5")).toBe(true);
    expect(chapterFiveQuestions.every((question) =>
      classifyHistoricalQuestion(question, {
        sourceStatus: "needs_check",
        tribunalVerified: false,
        syllabusScopeVerified: false,
        currentness: "unknown",
      }).syllabusNodeId === "rcf-capitulo-5",
    )).toBe(true);
  });

  it("rejects a stored concept mapping that differs from its accepted transcription row", () => {
    const questions = officialQuestionsSchema.parse(questionRecords);
    const alteredQuestion = { ...questions[0]!, conceptIds: ["rcf-concept-7"] };

    expect(validateStoredHistoricalQuestionValidity({
      ...alteredQuestion,
      syllabusNodeId: alteredQuestion.syllabusNodeId ?? "",
    }))
      .toContain(`${alteredQuestion.id} concept mapping differs from its accepted transcription row.`);
  });

  it("promotes current, changed or out-of-scope only with verified source and tribunal evidence", () => {
    const baseQuestion = questionRecords[0]!;
    const currentRcfSource = sourceManifest.sources.find((source) =>
      source.sourceId === "RD 664/2015" && source.status === "verified",
    )!;
    const sourceState = {
      sourceStatus: "verified" as const,
      tribunalVerified: true,
      syllabusScopeVerified: true,
      currentnessEvidence: {
        sourceId: currentRcfSource.sourceId,
        sourceVersion: currentRcfSource.sourceVersion,
        sourceUrl: currentRcfSource.url,
        locator: "Libro Primero, Capítulo 1, §1.1.1.3",
        reviewedAt: "2026-10-15",
      },
    };

    expect(classifyHistoricalQuestion(baseQuestion, { ...sourceState, currentness: "current" }).validity).toBe("current");
    expect(classifyHistoricalQuestion(baseQuestion, { ...sourceState, currentness: "changed" }).validity).toBe("changed");
    expect(classifyHistoricalQuestion(baseQuestion, { ...sourceState, currentness: "out_of_scope" }).validity).toBe("out_of_scope");
    const currentnessReviewedButHistoricSourceUnresolved = classifyHistoricalQuestion(baseQuestion, {
      ...sourceState,
      sourceStatus: "needs_check",
      currentness: "current",
    });
    expect(currentnessReviewedButHistoricSourceUnresolved.validity).toBe("pending_review");
    expect(currentnessReviewedButHistoricSourceUnresolved.currentness).toBe("current");
    expect(currentnessReviewedButHistoricSourceUnresolved.validityEvidence).toEqual(sourceState.currentnessEvidence);
    expect(classifyHistoricalQuestion(baseQuestion, { ...sourceState, tribunalVerified: false, currentness: "current" }).validity).toBe("pending_review");
    expect(classifyHistoricalQuestion(baseQuestion, { ...sourceState, syllabusScopeVerified: false, currentness: "current" }).validity).toBe("pending_review");
    expect(classifyHistoricalQuestion(baseQuestion, {
      sourceStatus: "verified",
      tribunalVerified: true,
      syllabusScopeVerified: true,
      currentness: "current",
    }).validity).toBe("pending_review");
    expect(classifyHistoricalQuestion(baseQuestion, {
      ...sourceState,
      currentnessEvidence: { ...sourceState.currentnessEvidence, sourceVersion: "old-version" },
      currentness: "current",
    }).validity).toBe("pending_review");
  });
});
