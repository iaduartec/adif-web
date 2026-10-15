import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { z } from "zod";

import questionsJson from "../content/questions.json";
import examManifestJson from "../content/official-exams/manifest.json";
import {
  validateHistoricalQuestionMappings,
  validateStoredHistoricalQuestionValidity,
} from "../lib/content/official-question-validity";
import { officialQuestionsSchema } from "../lib/content/schema";

const transcriptionSchema = z.object({
  examId: z.string().regex(/^ADIF-\d{4}-\d{4}$/),
  questions: z.array(z.object({
    number: z.number().int().positive(),
    conceptIds: z.array(z.string().trim().min(1)).min(1),
  }).passthrough()),
}).passthrough();

const transcriptionDirectory = resolve(process.cwd(), "content/official-exams/transcriptions");
const transcriptionResults = readdirSync(transcriptionDirectory)
  .filter((file) => /^\d{4}-\d{4}\.json$/.test(file))
  .map((file) => ({
    file,
    parsed: transcriptionSchema.safeParse(JSON.parse(readFileSync(resolve(transcriptionDirectory, file), "utf8"))),
  }));
const transcriptionErrors = transcriptionResults.flatMap(({ file, parsed: transcription }) =>
  transcription.success ? [] : [`${file} is not a valid historic transcription: ${transcription.error.issues.map((issue) => issue.message).join("; ")}`],
);
const transcriptions = transcriptionResults.flatMap(({ parsed: transcription }) =>
  transcription.success ? [transcription.data] : [],
);
type ManifestForm = {
  id: string;
  transcriptionStatus: "complete" | "partial" | "metadata_only";
  expectedQuestionNumbers: number[];
  transcribedQuestionNumbers: number[];
};
const manifestForms = examManifestJson as ManifestForm[];

const parsed = officialQuestionsSchema.safeParse(questionsJson);
if (!parsed.success) {
  console.error([...transcriptionErrors, ...parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`)].join("\n"));
  process.exitCode = 1;
} else {
  const errors = [...transcriptionErrors, ...validateHistoricalQuestionMappings(parsed.data)];
  const transcriptionById = new Map(transcriptions.map((transcription) => [transcription.examId, transcription]));
  const expectedQuestionIds = new Set<string>();

  for (const form of manifestForms) {
    const transcription = transcriptionById.get(form.id);
    if (form.transcriptionStatus === "metadata_only") {
      if (transcription) errors.push(`${form.id} is metadata-only but has a question transcription.`);
      if (form.transcribedQuestionNumbers.length) errors.push(`${form.id} is metadata-only but declares accepted question numbers.`);
      continue;
    }
    if (!transcription) {
      errors.push(`${form.id} has an accepted transcription status but no transcription file.`);
      continue;
    }
    const actualNumbers = transcription.questions.map((row) => row.number);
    const actualNumbersSorted = [...actualNumbers].sort((left, right) => left - right);
    const expectedNumbersSorted = [...form.transcribedQuestionNumbers].sort((left, right) => left - right);
    if (new Set(actualNumbers).size !== actualNumbers.length) errors.push(`${form.id} transcription contains duplicate question numbers.`);
    if (JSON.stringify(actualNumbersSorted) !== JSON.stringify(expectedNumbersSorted)) {
      errors.push(`${form.id} transcription question numbers do not match its exact accepted transcription manifest.`);
    }
    for (const number of form.transcribedQuestionNumbers) {
      expectedQuestionIds.add(`${form.id}-Q${String(number).padStart(2, "0")}`);
    }
  }

  for (const examId of transcriptionById.keys()) {
    if (!manifestForms.some((form) => form.id === examId && form.transcriptionStatus !== "metadata_only")) {
      errors.push(`${examId} has a transcription without an eligible form manifest entry.`);
    }
  }

  const actualQuestionIds = new Set(parsed.data.map((question) => question.id));
  const questionById = new Map(parsed.data.map((question) => [question.id, question]));
  for (const id of expectedQuestionIds) {
    if (!actualQuestionIds.has(id)) errors.push(`${id} is in the reviewed transcription set but missing from the question dataset.`);
  }
  for (const id of actualQuestionIds) {
    if (!expectedQuestionIds.has(id)) errors.push(`${id} is in the question dataset but absent from the accepted transcription rows.`);
  }

  for (const form of manifestForms) {
    const transcription = transcriptionById.get(form.id);
    if (!transcription) continue;
    for (const row of transcription.questions) {
      if (!form.transcribedQuestionNumbers.includes(row.number)) continue;
      const questionId = `${form.id}-Q${String(row.number).padStart(2, "0")}`;
      const question = questionById.get(questionId);
      if (question && JSON.stringify([...question.conceptIds].sort()) !== JSON.stringify([...row.conceptIds].sort())) {
        errors.push(`${questionId} concept mapping differs from its accepted transcription row.`);
      }
    }
  }

  for (const question of parsed.data) {
    errors.push(...validateStoredHistoricalQuestionValidity(question));
  }

  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`Validated ${parsed.data.length} historic question mappings, evidence classifications and exact transcription IDs.`);
  }
}
