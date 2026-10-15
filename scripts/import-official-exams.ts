import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import {
  officialCorrectionSetsSchema,
  officialExamSchema,
  officialExamsSchema,
  officialQuestionSchema,
  type OfficialExam,
  type OfficialCorrectionSet,
  type OfficialQuestion,
  type PublicationStatus,
} from "../lib/content/schema";
import { officialExamManifestEntrySchema, type OfficialExamManifestEntry } from "../lib/content/official-exam-manifest";
import {
  applyOfficialCorrections,
  validateOfficialCorrectionSets,
  type CorrectionExamRecord,
  type CorrectionSourceRecord,
} from "../lib/content/official-corrections";
import { parseSourceManifest } from "../lib/content/source-manifest";

const optionKeys = ["A", "B", "C", "D"] as const;
const questionNumbers = z.number().int().min(1).max(99);

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
    conceptIds: z.array(z.string().trim().min(1)).min(1),
    options: z.array(z.object({ key: z.enum(optionKeys), text: z.string().trim().min(1) }).strict()),
    answer: z.enum(optionKeys),
  })
  .strict();

const importerInputSchema = z
  .object({
    manifest: z.array(officialExamManifestEntrySchema).min(1),
    transcriptions: z
      .array(
        z
          .object({
            examId: z.string().regex(/^ADIF-\d{4}-\d{4}$/),
            questions: z.array(transcriptionQuestionSchema),
          })
          .strict(),
      )
      .min(0),
    correctionSets: officialCorrectionSetsSchema,
    sourceRegistry: z.array(
      z.object({
        sourceId: z.string().trim().min(1),
        sourceVersion: z.string().trim().min(1),
        url: z.url(),
        sourceType: z.enum(["primary", "secondary", "didactic"]),
        status: z.enum(["verified", "needs_check", "superseded", "unavailable"]),
        locatorPolicy: z.enum(["document-level", "section", "exact"]),
        rightsBasis: z.enum(["explicit_license", "written_permission", "documented_legal_review"]).optional(),
      }).strict(),
    ),
    retiredSyntheticDistractors: z.array(z.string().trim().min(1)).optional(),
  })
  .strict();

type ManifestEntry = OfficialExamManifestEntry;
type ImporterInput = z.infer<typeof importerInputSchema>;

export type ImportedOfficialQuestion = OfficialQuestion & {
  correctionSource: OfficialQuestion["correctionSource"];
  replacementQuestionNumber: number | null;
  provenance: {
    booklet: { sourceId: string; sourceVersion: string; sourceUrl: string; locator: string };
    initialAnswerKey: { sourceId: string; sourceVersion: string; sourceUrl: string; locator: string };
    finalAnswerKey: { sourceId: string; sourceVersion: string; sourceUrl: string; locator: string };
    tribunalResolution: OfficialCorrectionSet["resolutionSource"];
  };
};

export type ImportReport = {
  manifestExamCount: number;
  acceptedExamCount: number;
  acceptedQuestionCount: number;
  acceptedQuestionCounts: Record<string, number>;
  modelResults: Record<string, { accepted: number; rejected: number }>;
};

export type ImportedOfficialExamContent = {
  questions: ImportedOfficialQuestion[];
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

function requireVerifiedPrimarySource(
  sourceRegistry: CorrectionSourceRecord[],
  reference: { sourceId: string; sourceVersion: string },
  expectedUrl: string,
  role: string,
): CorrectionSourceRecord {
  const source = sourceRegistry.find(
    (candidate) =>
      candidate.sourceId === reference.sourceId &&
      candidate.sourceVersion === reference.sourceVersion &&
      candidate.url === expectedUrl,
  );
  if (
    !source ||
    source.sourceType !== "primary" ||
    source.status !== "verified" ||
    source.locatorPolicy !== "exact"
  ) {
    importError(`${role} must resolve to an exact, verified primary source version and URL.`);
  }
  return source;
}

function validateCorrectionEvidence(input: ImporterInput): Map<string, OfficialCorrectionSet> {
  const examRecords: CorrectionExamRecord[] = input.manifest.map((entry) => ({
    id: entry.id,
    year: entry.year,
    call: entry.call,
    profileCode: entry.profileCode,
    questionNumbers: entry.expectedQuestionNumbers,
    reserveQuestionNumbers: entry.reserveQuestionNumbers,
  }));
  const errors = validateOfficialCorrectionSets(
    input.correctionSets,
    examRecords,
    input.sourceRegistry,
  );
  if (errors.length) importError(`Correction evidence validation failed: ${errors.join("; ")}`);

  const parsedSets = officialCorrectionSetsSchema.parse(input.correctionSets);
  const setByExamId = new Map<string, OfficialCorrectionSet>();
  for (const set of parsedSets) {
    if (set.reconciliationStatus === "pending") {
      importError(`${set.year}: tribunal reconciliation is pending and cannot authorize answer import.`);
    }
    for (const examId of set.examIds) {
      if (setByExamId.has(examId)) importError(`Exam ${examId} is covered by multiple correction sets.`);
      setByExamId.set(examId, set);
    }
  }

  for (const entry of input.manifest) {
    const set = setByExamId.get(entry.id);
    if (!set) importError(`No tribunal correction set covers ${entry.id}.`);
    requireVerifiedPrimarySource(
      input.sourceRegistry,
      { sourceId: entry.documentSourceId, sourceVersion: entry.documentSourceVersion },
      entry.documentUrl,
      `${entry.id} booklet`,
    );
    const initialKeySource = input.sourceRegistry.find(
      (source) =>
        source.sourceId === entry.initialAnswerKeySourceId &&
        source.sourceVersion === entry.initialAnswerKeySourceVersion,
    );
    if (!initialKeySource) importError(`${entry.id} initial answer-key source version is unresolved.`);
    requireVerifiedPrimarySource(
      input.sourceRegistry,
      { sourceId: entry.initialAnswerKeySourceId, sourceVersion: entry.initialAnswerKeySourceVersion },
      initialKeySource.url,
      `${entry.id} initial answer key`,
    );
    const finalKeySource = input.sourceRegistry.find(
      (source) =>
        source.sourceId === entry.finalAnswerKeySourceId &&
        source.sourceVersion === entry.finalAnswerKeySourceVersion,
    );
    if (!finalKeySource) importError(`${entry.id} final answer-key source version is unresolved.`);
    requireVerifiedPrimarySource(
      input.sourceRegistry,
      { sourceId: entry.finalAnswerKeySourceId, sourceVersion: entry.finalAnswerKeySourceVersion },
      finalKeySource.url,
      `${entry.id} final answer key`,
    );
  }

  const manifestExamIds = new Set(input.manifest.map((entry) => entry.id));
  for (const examId of setByExamId.keys()) {
    if (!manifestExamIds.has(examId)) importError(`Correction data references an unlisted form ${examId}.`);
  }
  return setByExamId;
}

export function parseOfficialExamTranscriptions(input: unknown): ImportedOfficialExamContent {
  const {
    manifest,
    transcriptions,
    correctionSets,
    sourceRegistry,
    retiredSyntheticDistractors = [],
  } = parseInput(input);
  validateManifest(manifest);
  const correctionSetByExamId = validateCorrectionEvidence({
    manifest,
    transcriptions,
    correctionSets,
    sourceRegistry,
    retiredSyntheticDistractors,
  });

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
  const questions: ImportedOfficialQuestion[] = [];
  const exams: OfficialExam[] = [];
  const acceptedQuestionCounts: Record<string, number> = {};
  const modelResults: ImportReport["modelResults"] = {};

  for (const entry of manifest) {
    const transcription = transcriptionByExamId.get(entry.id);
    if (!transcription && entry.transcriptionStatus !== "metadata_only") {
      importError(`Missing reviewed transcription for ${entry.id}.`);
    }
    if (entry.transcriptionStatus === "metadata_only") {
      if (transcription) importError(`Metadata-only form ${entry.id} must not contain transcribed question text.`);
      acceptedQuestionCounts[entry.id] = 0;
      modelResults[entry.id] = { accepted: 0, rejected: 0 };
      continue;
    }
    if (!transcription) importError(`Missing reviewed transcription for ${entry.id}.`);
    const correctionSet = correctionSetByExamId.get(entry.id);
    if (!correctionSet) importError(`Missing correction set for ${entry.id}.`);

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
      const declaredReserve = entry.reserveQuestionNumbers.includes(transcribedQuestion.number);
      if (transcribedQuestion.isReserve !== declaredReserve) {
        importError(
          `${entry.id} question ${transcribedQuestion.number} reserve metadata does not match the form manifest.`,
        );
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
      if (transcribedQuestion.answerKeyPage !== entry.initialAnswerKeyPage) {
        importError(`${entry.id} question ${transcribedQuestion.number} cites an unexpected initial answer-key page.`);
      }
      const corrected = applyOfficialCorrections(
        {
          examId: entry.id,
          questionNumber: transcribedQuestion.number,
          answer: transcribedQuestion.answer,
        },
        correctionSet.corrections,
      );
      const provenance = {
        booklet: {
          sourceId: entry.documentSourceId,
          sourceVersion: entry.documentSourceVersion,
          sourceUrl: entry.documentUrl,
          locator: `PDF p. ${transcribedQuestion.bookletPage}`,
        },
        initialAnswerKey: {
          sourceId: entry.initialAnswerKeySourceId,
          sourceVersion: entry.initialAnswerKeySourceVersion,
          sourceUrl: sourceRegistry.find((source) =>
            source.sourceId === entry.initialAnswerKeySourceId &&
            source.sourceVersion === entry.initialAnswerKeySourceVersion,
          )!.url,
          locator: `PDF p. ${transcribedQuestion.answerKeyPage}`,
        },
        finalAnswerKey: {
          sourceId: entry.finalAnswerKeySourceId,
          sourceVersion: entry.finalAnswerKeySourceVersion,
          sourceUrl: sourceRegistry.find((source) =>
            source.sourceId === entry.finalAnswerKeySourceId &&
            source.sourceVersion === entry.finalAnswerKeySourceVersion,
          )!.url,
          locator: `PDF p. ${entry.finalAnswerKeyPage}`,
        },
        tribunalResolution: correctionSet.resolutionSource,
      };
      const officialQuestion = officialQuestionSchema.safeParse({
        id: `${entry.id}-Q${String(transcribedQuestion.number).padStart(2, "0")}`,
        sectionLabel: transcribedQuestion.sectionLabel,
        prompt: transcribedQuestion.prompt,
        conceptIds: transcribedQuestion.conceptIds,
        options,
        answer: corrected.effectiveAnswer ?? corrected.initialAnswer,
        initialAnswer: corrected.initialAnswer,
        effectiveAnswer: corrected.effectiveAnswer,
        correctionSource: corrected.correctionSource,
        replacementQuestionNumber: corrected.replacementQuestionNumber,
        validity: "pending_review",
        publicationStatus: correctionSet.publicationStatus,
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
      questions.push({
        ...officialQuestion.data,
        provenance,
      });
    }

    const missingQuestionNumbers = entry.expectedQuestionNumbers.filter((number) => !seenNumbers.has(number));
    if (entry.transcriptionStatus === "complete" && missingQuestionNumbers.length) {
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

    exams.push(officialExam.data);
    acceptedQuestionCounts[entry.id] = examQuestions.length;
    modelResults[entry.id] = { accepted: examQuestions.length, rejected: rejectedCount };
  }

  return {
    questions,
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
const correctionDirectory = path.join(officialExamsDirectory, "corrections");
const transcriptionsDirectory = path.join(officialExamsDirectory, "transcriptions");
const sourceManifestPath = path.join(repositoryRoot, "content", "source-manifest.json");
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
  const correctionFiles = (await readdir(correctionDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
  const correctionSets = await Promise.all(
    correctionFiles.map(async (fileName) => JSON.parse(await readFile(path.join(correctionDirectory, fileName), "utf8")) as unknown),
  );
  const sourceManifest = parseSourceManifest(
    JSON.parse(await readFile(sourceManifestPath, "utf8")) as unknown,
  );
  const sourceRegistry: CorrectionSourceRecord[] = sourceManifest.sources.map((source) => ({
    sourceId: source.sourceId,
    sourceVersion: source.sourceVersion,
    url: source.url,
    sourceType: source.sourceType,
    status: source.status,
    locatorPolicy: source.locatorPolicy,
    rightsBasis: source.rightsBasis,
  }));
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
  const result = parseOfficialExamTranscriptions({
    manifest,
    transcriptions,
    correctionSets,
    sourceRegistry,
  });
  for (const question of result.questions) {
    if (
      [question.prompt, ...question.options.map((option) => option.text)].some((text) =>
        retiredSyntheticDistractors.has(toFingerprint(text)),
      )
    ) {
      importError(`Question ${question.id} matches a retired synthetic distractor.`);
    }
  }

  const blockedQuestions = result.questions.filter(
    (question) =>
      question.publicationStatus !== "approved_for_publication" ||
      question.validity !== "current" ||
      question.effectiveAnswer === null,
  );
  if (blockedQuestions.length > 0) {
    importError(
      `Refusing to write official prompt/options/keys while ${blockedQuestions.length} question(s) lack verified current-syllabus and public-text approval.`,
    );
  }

  const publishableQuestions = result.questions.map((question) => {
    const { provenance: _provenance, ...record } = question;
    return officialQuestionSchema.parse(record);
  });
  const publishableQuestionIds = new Set(publishableQuestions.map((question) => question.id));
  const publishableExams = result.exams.filter((exam) =>
    exam.questionIds.every((questionId) => publishableQuestionIds.has(questionId)),
  );

  await Promise.all([
    writeFile(questionsTarget, `${JSON.stringify(publishableQuestions, null, 2)}\n`, "utf8"),
    writeFile(examsTarget, `${JSON.stringify(publishableExams, null, 2)}\n`, "utf8"),
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
