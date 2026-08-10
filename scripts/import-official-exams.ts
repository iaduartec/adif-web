import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import {
  officialExamSchema,
  officialExamsSchema,
  officialQuestionSchema,
  officialQuestionsSchema,
  type OfficialExam,
  type OfficialQuestion,
} from "../lib/content/schema";

const optionKeys = ["A", "B", "C", "D"] as const;
const questionNumbers = z.number().int().min(1).max(99);

const manifestEntrySchema = z
  .object({
    id: z.string().regex(/^ADIF-\d{4}-\d{4}$/),
    year: z.number().int().min(2000).max(2100),
    call: z.string().regex(/^PNI\d{2}\/\d{2}$/),
    profileCode: z.string().regex(/^\d{2}\/\d{2}PO$/),
    profileName: z.string().trim().min(1),
    examCode: z.string().regex(/^\d{4}$/),
    documentUrl: z
      .url()
      .refine((url) => new URL(url).hostname === "www.adif.es", {
        message: "Official sources must be hosted on www.adif.es.",
      }),
    durationMinutes: z.number().int().positive(),
    expectedQuestionNumbers: z.array(questionNumbers).min(1),
    completeness: z.enum(["complete", "specific_part"]),
    scoring: z
      .object({
        correct: z.number().finite(),
        incorrect: z.number().finite(),
        omitted: z.number().finite(),
      })
      .strict(),
  })
  .strict()
  .superRefine((entry, context) => {
    if (entry.id !== `ADIF-${entry.year}-${entry.examCode}`) {
      context.addIssue({
        code: "custom",
        path: ["id"],
        message: "The manifest exam ID must match its year and exam code.",
      });
    }

    if (new Set(entry.expectedQuestionNumbers).size !== entry.expectedQuestionNumbers.length) {
      context.addIssue({
        code: "custom",
        path: ["expectedQuestionNumbers"],
        message: "Expected question numbers must not contain duplicates.",
      });
    }
  });

const transcriptionQuestionSchema = z
  .object({
    number: questionNumbers,
    section: z.enum(["general", "english", "specific"]),
    sectionLabel: z.string().trim().min(1),
    isReserve: z.boolean(),
    bookletPage: z.number().int().positive(),
    answerKeyPage: z.number().int().positive(),
    verifiedAt: z.iso.date(),
    prompt: z.string().trim().min(1),
    options: z.array(z.object({ key: z.enum(optionKeys), text: z.string().trim().min(1) }).strict()),
    answer: z.enum(optionKeys),
  })
  .strict();

const importerInputSchema = z
  .object({
    manifest: z.array(manifestEntrySchema).min(1),
    transcriptions: z
      .array(
        z
          .object({
            examId: z.string().regex(/^ADIF-\d{4}-\d{4}$/),
            questions: z.array(transcriptionQuestionSchema),
          })
          .strict(),
      )
      .min(1),
    retiredSyntheticDistractors: z.array(z.string().trim().min(1)).optional(),
  })
  .strict();

type ManifestEntry = z.infer<typeof manifestEntrySchema>;
type ImporterInput = z.infer<typeof importerInputSchema>;

export type ImportReport = {
  manifestExamCount: number;
  acceptedExamCount: number;
  acceptedQuestionCount: number;
  acceptedQuestionCounts: Record<string, number>;
  modelResults: Record<string, { accepted: number; rejected: number }>;
};

export type ImportedOfficialExamContent = {
  questions: OfficialQuestion[];
  exams: OfficialExam[];
  report: ImportReport;
};

export function contentFingerprint(question: {
  prompt: string;
  options: readonly { key: string; text: string }[];
  answer: string;
}): string {
  const payload = [
    question.prompt,
    ...question.options.map((option) => option.text),
    question.answer,
  ].join("\n");
  return `sha256:${createHash("sha256").update(payload, "utf8").digest("hex")}`;
}

function importError(message: string): never {
  throw new Error(`Official exam import rejected: ${message}`);
}

function orderedOptions(options: ImporterInput["transcriptions"][number]["questions"][number]["options"]) {
  if (options.length !== optionKeys.length) {
    importError("Every official question must provide exactly four options.");
  }

  const optionsByKey = new Map(options.map((option) => [option.key, option]));
  if (optionsByKey.size !== optionKeys.length || optionKeys.some((key) => !optionsByKey.has(key))) {
    importError("Every official question must provide one option for each key from A through D.");
  }

  return optionKeys.map((key) => optionsByKey.get(key)!);
}

function parseInput(input: unknown): ImporterInput {
  const parsed = importerInputSchema.safeParse(input);
  if (!parsed.success) {
    importError(parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" "));
  }
  return parsed.data;
}

function validateManifest(entries: readonly ManifestEntry[]) {
  const ids = new Set<string>();
  for (const entry of entries) {
    if (ids.has(entry.id)) importError(`Duplicate manifest exam ID: ${entry.id}.`);
    ids.add(entry.id);
  }
}

export function parseOfficialExamTranscriptions(input: unknown): ImportedOfficialExamContent {
  const { manifest, transcriptions, retiredSyntheticDistractors = [] } = parseInput(input);
  validateManifest(manifest);

  const transcriptionByExamId = new Map<string, ImporterInput["transcriptions"][number]>();
  for (const transcription of transcriptions) {
    if (transcriptionByExamId.has(transcription.examId)) {
      importError(`Duplicate transcription for ${transcription.examId}.`);
    }
    transcriptionByExamId.set(transcription.examId, transcription);
  }

  const manifestIds = new Set(manifest.map((entry) => entry.id));
  for (const transcription of transcriptions) {
    if (!manifestIds.has(transcription.examId)) {
      importError(`Transcription ${transcription.examId} does not appear in the official manifest.`);
    }
  }

  const retiredDistractors = new Set(retiredSyntheticDistractors);
  const questions: OfficialQuestion[] = [];
  const exams: OfficialExam[] = [];
  const acceptedQuestionCounts: Record<string, number> = {};
  const modelResults: ImportReport["modelResults"] = {};

  for (const entry of manifest) {
    const transcription = transcriptionByExamId.get(entry.id);
    if (!transcription) importError(`Missing reviewed transcription for ${entry.id}.`);

    const seenNumbers = new Set<number>();
    const expectedNumbers = new Set(entry.expectedQuestionNumbers);
    let rejectedCount = 0;
    const examQuestions: OfficialQuestion[] = [];
    for (const transcribedQuestion of transcription.questions) {
      if (seenNumbers.has(transcribedQuestion.number)) {
        importError(`Duplicate question number for ${entry.year}-${entry.examCode}: ${transcribedQuestion.number}.`);
      }
      seenNumbers.add(transcribedQuestion.number);

      if (!expectedNumbers.has(transcribedQuestion.number)) {
        rejectedCount++;
        continue;
      }

      const options = orderedOptions(transcribedQuestion.options);
      const wording = [transcribedQuestion.prompt, ...options.map((option) => option.text)];
      if (wording.some((text) => retiredDistractors.has(text))) {
        importError(`Question ${entry.id}-Q${String(transcribedQuestion.number).padStart(2, "0")} matches a retired synthetic distractor.`);
      }

      const fingerprint = contentFingerprint({
        prompt: transcribedQuestion.prompt,
        options,
        answer: transcribedQuestion.answer,
      });
      const officialQuestion = officialQuestionSchema.safeParse({
        id: `${entry.id}-Q${String(transcribedQuestion.number).padStart(2, "0")}`,
        sectionLabel: transcribedQuestion.sectionLabel,
        prompt: transcribedQuestion.prompt,
        options,
        answer: transcribedQuestion.answer,
        origin: "official_reference",
        source: {
          kind: "official_adif_exam",
          year: entry.year,
          call: entry.call,
          profileCode: entry.profileCode,
          profileName: entry.profileName,
          examCode: entry.examCode,
          questionNumber: transcribedQuestion.number,
          section: transcribedQuestion.section,
          isReserve: transcribedQuestion.isReserve,
          documentUrl: entry.documentUrl,
          bookletPage: transcribedQuestion.bookletPage,
          answerKeyPage: transcribedQuestion.answerKeyPage,
          verifiedAt: transcribedQuestion.verifiedAt,
          fingerprint,
        },
      });

      if (!officialQuestion.success) {
        importError(officialQuestion.error.issues.map((issue) => issue.message).join(" "));
      }
      examQuestions.push(officialQuestion.data);
    }

    const missingQuestionNumbers = entry.expectedQuestionNumbers.filter((number) => !seenNumbers.has(number));
    if (entry.completeness === "complete" && missingQuestionNumbers.length) {
      importError(`Complete exam ${entry.id} is missing expected question numbers: ${missingQuestionNumbers.join(", ")}.`);
    }
    if (!examQuestions.length) importError(`Reviewed transcription ${entry.id} contains no questions.`);

    const officialExam = officialExamSchema.safeParse({
      id: entry.id,
      title: `Examen oficial ADIF ${entry.year} ${entry.examCode}`,
      source: examQuestions[0].source,
      questionIds: examQuestions.map((question) => question.id),
      durationMinutes: entry.durationMinutes,
      completeness: entry.completeness,
      scoring: entry.scoring,
    });
    if (!officialExam.success) {
      importError(officialExam.error.issues.map((issue) => issue.message).join(" "));
    }

    questions.push(...examQuestions);
    exams.push(officialExam.data);
    acceptedQuestionCounts[entry.id] = examQuestions.length;
    modelResults[entry.id] = { accepted: examQuestions.length, rejected: rejectedCount };
  }

  return {
    questions: officialQuestionsSchema.parse(questions),
    exams: officialExamsSchema.parse(exams),
    report: {
      manifestExamCount: manifest.length,
      acceptedExamCount: exams.length,
      acceptedQuestionCount: questions.length,
      acceptedQuestionCounts,
      modelResults,
    },
  };
}

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const officialExamsDirectory = path.join(repositoryRoot, "content", "official-exams");
const manifestPath = path.join(officialExamsDirectory, "manifest.json");
const transcriptionsDirectory = path.join(officialExamsDirectory, "transcriptions");
const importReportPath = path.join(officialExamsDirectory, "import-report.json");
const questionsTarget = path.join(repositoryRoot, "content", "questions.json");
const examsTarget = path.join(repositoryRoot, "content", "exams.json");

function collectStrings(value: unknown, output: string[]) {
  if (typeof value === "string" && value.trim()) output.push(value.trim());
}

async function readRetiredSyntheticDistractors(): Promise<string[]> {
  const fingerprints = new Set<string>();
  try {
    const previousReport = JSON.parse(await readFile(importReportPath, "utf8")) as {
      retiredSyntheticDistractorFingerprints?: unknown;
    };
    if (Array.isArray(previousReport.retiredSyntheticDistractorFingerprints)) {
      for (const fingerprint of previousReport.retiredSyntheticDistractorFingerprints) {
        if (typeof fingerprint === "string") fingerprints.add(fingerprint);
      }
    }
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }

  try {
    const existingQuestions = JSON.parse(await readFile(questionsTarget, "utf8")) as unknown;
    if (Array.isArray(existingQuestions)) {
      for (const existingQuestion of existingQuestions) {
        if (
          existingQuestion &&
          typeof existingQuestion === "object" &&
          "origin" in existingQuestion &&
          existingQuestion.origin === "original_explanation"
        ) {
          const record = existingQuestion as { prompt?: unknown; options?: unknown };
          const strings: string[] = [];
          collectStrings(record.prompt, strings);
          if (Array.isArray(record.options)) {
            for (const option of record.options) {
              if (option && typeof option === "object") collectStrings((option as { text?: unknown }).text, strings);
            }
          }
          for (const text of strings) fingerprints.add(contentFingerprint({ prompt: text, options: [], answer: "" }));
        }
      }
    }
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }

  return [...fingerprints].sort();
}

function toFingerprint(text: string): string {
  return contentFingerprint({ prompt: text, options: [], answer: "" });
}

export async function importOfficialExamContent(): Promise<ImportedOfficialExamContent> {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as unknown;
  const transcriptionFiles = (await readdir(transcriptionsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
  const transcriptions = await Promise.all(
    transcriptionFiles.map(async (fileName) => JSON.parse(await readFile(path.join(transcriptionsDirectory, fileName), "utf8")) as unknown),
  );
  const retiredSyntheticDistractorFingerprints = await readRetiredSyntheticDistractors();
  const retiredSyntheticDistractors = new Set(retiredSyntheticDistractorFingerprints);

  // The parser accepts literal wording so tests and callers can inspect it; the command retains only hashes.
  const result = parseOfficialExamTranscriptions({ manifest, transcriptions });
  for (const question of result.questions) {
    if (
      [question.prompt, ...question.options.map((option) => option.text)].some((text) =>
        retiredSyntheticDistractors.has(toFingerprint(text)),
      )
    ) {
      importError(`Question ${question.id} matches a retired synthetic distractor.`);
    }
  }

  await Promise.all([
    writeFile(questionsTarget, `${JSON.stringify(result.questions, null, 2)}\n`, "utf8"),
    writeFile(examsTarget, `${JSON.stringify(result.exams, null, 2)}\n`, "utf8"),
    writeFile(
      importReportPath,
      `${JSON.stringify({ ...result.report, retiredSyntheticDistractorFingerprints }, null, 2)}\n`,
      "utf8",
    ),
  ]);

  return result;
}

const executedAsScript = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (executedAsScript) {
  importOfficialExamContent()
    .then(({ report }) => {
      console.log(`Imported ${report.acceptedQuestionCount} official questions from ${report.acceptedExamCount} exams.`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
