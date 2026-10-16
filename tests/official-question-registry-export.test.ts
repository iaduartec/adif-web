import { describe, expect, it } from "vitest";

import exams from "../content/exams.json";
import questions from "../content/questions.json";
import forms from "../content/official-exams/manifest.json";
import { officialQuestionsSchema } from "../lib/content/schema";
import {
  buildOfficialQuestionRegistryRows,
  generateOfficialQuestionRegistryMigration,
} from "../scripts/export-official-question-registry";

describe("official private answer registry export", () => {
  const parsedQuestions = officialQuestionsSchema.parse(questions);

  it("exports no historical answer keys while every real record remains uncleared", () => {
    const rows = buildOfficialQuestionRegistryRows(parsedQuestions);

    expect(rows).toEqual([]);
    expect(generateOfficialQuestionRegistryMigration(rows, forms, exams)).toContain("'[]'::jsonb");
  });

  it("serializes allowlist fields into the PostgreSQL recordset columns", () => {
    const sql = generateOfficialQuestionRegistryMigration([], forms, exams);
    const recordsets = [...sql.matchAll(
      /jsonb_to_recordset\('(.+?)'::jsonb\) as (?:current|row)\(simulation_id text, expected_question_count integer\)/g,
    )];

    expect(recordsets).toHaveLength(2);
    for (const recordset of recordsets) {
      expect(JSON.parse(recordset[1]!)).toEqual([
        { simulation_id: "ADIF-2023-1433", expected_question_count: 15 },
        { simulation_id: "ADIF-2023-4101", expected_question_count: 15 },
        { simulation_id: "ADIF-2024-1044", expected_question_count: 0 },
        { simulation_id: "ADIF-2024-2442", expected_question_count: 0 },
        { simulation_id: "ADIF-2024-3403", expected_question_count: 18 },
        { simulation_id: "ADIF-2024-3413", expected_question_count: 18 },
        { simulation_id: "ADIF-2025-1131", expected_question_count: 18 },
        { simulation_id: "ADIF-2025-4104", expected_question_count: 18 },
      ]);
    }
  });

  it("pins official form simulation eligibility to the accepted transcription manifest", () => {
    const form = forms.find((candidate) => candidate.id === "ADIF-2025-1131")!;
    const exam = exams.find((candidate) => candidate.id === form.id)!;
    const truncatedExam = {
      ...exam,
      questionIds: exam.questionIds.slice(0, -1),
    };

    expect(() => generateOfficialQuestionRegistryMigration([], forms, [
      ...exams.filter((candidate) => candidate.id !== form.id),
      truncatedExam,
    ])).toThrow(/transcription manifest/i);
    expect(() => generateOfficialQuestionRegistryMigration([], forms, [
      ...exams.filter((candidate) => candidate.id !== form.id),
      { ...exam, questionIds: [...exam.questionIds, exam.questionIds[0]!] },
    ])).toThrow(/transcription manifest/i);
    expect(() => generateOfficialQuestionRegistryMigration([], forms, exams.filter((candidate) => candidate.id !== form.id)))
      .toThrow(/ADIF-2025-1131 is missing/i);
  });

  it("keeps only current, published, active-mapped questions under their official form IDs", () => {
    const base = parsedQuestions.find((question) => question.id === "ADIF-2025-1131-Q01")!;
    const eligible = {
      ...base,
      validity: "current" as const,
      currentness: "current" as const,
      publicationStatus: "approved_for_publication" as const,
      effectiveAnswer: "A" as const,
    };
    const changed = {
      ...eligible,
      id: "ADIF-2025-1131-Q02",
      validity: "changed" as const,
      source: { ...eligible.source, questionNumber: 2 },
    };
    const unpublished = {
      ...eligible,
      id: "ADIF-2025-1131-Q03",
      publicationStatus: "link_only" as const,
      source: { ...eligible.source, questionNumber: 3 },
    };
    const unmapped = {
      ...eligible,
      id: "ADIF-2025-1131-Q04",
      conceptIds: [],
      source: { ...eligible.source, questionNumber: 4 },
    };

    const rows = buildOfficialQuestionRegistryRows(
      [eligible, changed, unpublished, unmapped],
      () => true,
    );

    expect(rows).toEqual([{
      questionId: "ADIF-2025-1131-Q01",
      correctAnswer: "A",
      conceptIds: ["ict-concept-24"],
      simulationId: "ADIF-2025-1131",
      isReserve: false,
    }]);
    const sql = generateOfficialQuestionRegistryMigration(rows, forms, exams);
    expect(sql).toContain("ADIF-2025-1131-Q01");
    expect(sql).toContain("ADIF-2024-1044");
    expect(sql).toContain("practice:official-common:");
    expect(sql).not.toContain(base.prompt);
    expect(sql).toMatch(/before insert on public\.simulation_attempts/i);
  });

  it("rejects answer rows that drift from the manifest form, question IDs, or section bucket", () => {
    const base = parsedQuestions.find((question) => question.id === "ADIF-2025-1131-Q01")!;
    const [eligible] = buildOfficialQuestionRegistryRows([{
      ...base,
      validity: "current",
      currentness: "current",
      publicationStatus: "approved_for_publication",
      effectiveAnswer: "A",
    }], () => true);
    expect(eligible).toBeDefined();

    expect(() => generateOfficialQuestionRegistryMigration([
      { ...eligible!, questionId: "ADIF-2025-1131-Q99" },
    ], forms, exams)).toThrow(/not a member of the registered official form/i);
    expect(() => generateOfficialQuestionRegistryMigration([
      { ...eligible!, simulationId: "ADIF-2025-4104" },
    ], forms, exams)).toThrow(/mismatched official simulation ID/i);
    expect(() => generateOfficialQuestionRegistryMigration([
      { ...eligible!, simulationId: "practice:official-common:english" },
    ], forms, exams)).toThrow(/mismatched official simulation ID/i);

    expect(() => generateOfficialQuestionRegistryMigration([{
      ...eligible!,
      questionId: "ADIF-2025-1131-english-Q01",
      simulationId: "practice:official-common:general",
    }], forms, exams)).toThrow(/must use its english practice bucket/i);
  });

  it("keeps a cleared English key in the one-question practice bucket", () => {
    const sql = generateOfficialQuestionRegistryMigration([{
      questionId: "ADIF-2025-1131-english-Q19",
      correctAnswer: "B",
      conceptIds: ["ingles-concept-1"],
      simulationId: "practice:official-common:english",
      isReserve: false,
    }], forms, exams);

    expect(sql).toContain('"exam":"practice:official-common:english"');
    expect(sql).toContain('"id":"ADIF-2025-1131-english-Q19"');
  });

  it("checks common-section question numbers and reserve status against the official catalog", () => {
    const commonRow = {
      questionId: "ADIF-2025-1131-english-Q19",
      correctAnswer: "B" as const,
      conceptIds: ["ingles-concept-1"],
      simulationId: "practice:official-common:english",
      isReserve: false,
    };

    expect(() => generateOfficialQuestionRegistryMigration([{
      ...commonRow,
      questionId: "ADIF-2025-1131-english-Q99",
    }], forms, exams)).toThrow(/not listed in the official common section/i);
    expect(() => generateOfficialQuestionRegistryMigration([{
      ...commonRow,
      questionId: "ADIF-2025-1131-english-Q34",
    }], forms, exams)).toThrow(/reserve status.*does not match/i);
    expect(() => generateOfficialQuestionRegistryMigration([{
      ...commonRow,
      simulationId: "practice:official-common:general",
    }], forms, exams)).toThrow(/must use its english practice bucket/i);

    const reserveSql = generateOfficialQuestionRegistryMigration([{
      ...commonRow,
      questionId: "ADIF-2025-1131-english-Q34",
      isReserve: true,
    }], forms, exams);
    expect(reserveSql).toContain('"id":"ADIF-2025-1131-english-Q34"');
  });
});
