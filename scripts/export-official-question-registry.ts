import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import examManifestJson from "../content/official-exams/manifest.json";
import commonSectionsJson from "../content/official-exams/common-sections.json";
import englishTopics from "../content/official-exams/english-topics.json";
import examsJson from "../content/exams.json";
import questionsJson from "../content/questions.json";
import { activeTheoryConceptRegistry } from "../content/theory-concepts";
import { isOfficialQuestionPracticeEligible } from "../lib/content/official-publication";
import type { OfficialExam, OfficialQuestion } from "../lib/content/schema";
import { officialExamsSchema, officialQuestionsSchema } from "../lib/content/schema";
import { officialExamManifestSchema, type OfficialExamManifestEntry } from "../lib/content/official-exam-manifest";
import { parseOfficialCommonSectionCatalog } from "../lib/content/official-common-sections";
import { sourceManifest } from "../lib/content/source-manifest";

export type OfficialQuestionRegistryRow = {
  questionId: string;
  correctAnswer: "A" | "B" | "C" | "D";
  conceptIds: string[];
  simulationId: string;
  isReserve: boolean;
};

export type OfficialSimulationAllowlistRow = {
  simulationId: string;
  expectedQuestionCount: number;
};

export function buildOfficialQuestionRegistryRows(
  questions: readonly OfficialQuestion[],
  isEligible: (question: OfficialQuestion) => boolean = isOfficialQuestionPracticeEligible,
): OfficialQuestionRegistryRow[] {
  const rows: OfficialQuestionRegistryRow[] = [];
  const seenIds = new Set<string>();
  for (const question of questions) {
    if (
      !isEligible(question) ||
      question.publicationStatus !== "approved_for_publication" ||
      question.validity !== "current" ||
      question.currentness !== "current" ||
      question.effectiveAnswer === null ||
      question.conceptIds.length === 0 ||
      question.conceptIds.some((conceptId) => !activeTheoryConceptRegistry.has(conceptId))
    ) continue;

    if (seenIds.has(question.id)) throw new Error(`Duplicate official registry question ID: ${question.id}.`);
    seenIds.add(question.id);
    const formId = `ADIF-${question.source.year}-${question.source.examCode}`;
    const sectionMatches = question.source.section === "specific"
      ? question.id.startsWith(`${formId}-Q`)
      : question.id.startsWith(`${formId}-${question.source.section}-Q`);
    if (!sectionMatches) throw new Error(`${question.id} does not use the stable ID for its official section.`);

    rows.push({
      questionId: question.id,
      correctAnswer: question.effectiveAnswer,
      conceptIds: [...question.conceptIds],
      simulationId: question.source.section === "specific"
        ? formId
        : `practice:official-common:${question.source.section}`,
      isReserve: question.source.isReserve,
    });
  }
  return rows.sort((left, right) => left.questionId.localeCompare(right.questionId));
}

export function getOfficialSimulationAllowlist(
  forms: readonly OfficialExamManifestEntry[],
  exams: readonly OfficialExam[],
): OfficialSimulationAllowlistRow[] {
  const examById = new Map<string, OfficialExam>();
  for (const exam of exams) {
    if (examById.has(exam.id)) throw new Error(`Duplicate official exam record ${exam.id}.`);
    examById.set(exam.id, exam);
  }
  const formIds = new Set<string>();
  for (const form of forms) {
    if (formIds.has(form.id)) throw new Error(`Duplicate official simulation form ${form.id}.`);
    formIds.add(form.id);
  }
  for (const exam of exams) {
    if (!formIds.has(exam.id)) throw new Error(`Official exam ${exam.id} is absent from the transcription manifest.`);
  }
  return forms.map((form) => {
    const expectedQuestionIds = form.transcribedQuestionNumbers.map((number) =>
      `${form.id}-Q${String(number).padStart(2, "0")}`,
    );
    const exam = examById.get(form.id);
    if (expectedQuestionIds.length === 0) {
      if (exam?.questionIds.length) {
        throw new Error(`${form.id} has questions although the transcription manifest declares none.`);
      }
    } else if (!exam) {
      throw new Error(`Official exam ${form.id} is missing despite questions declared by the transcription manifest.`);
    } else {
      const actual = exam.questionIds;
      const expected = new Set(expectedQuestionIds);
      if (
        actual.length !== expectedQuestionIds.length ||
        new Set(actual).size !== actual.length ||
        actual.some((questionId) => !expected.has(questionId))
      ) {
        throw new Error(`${form.id} question IDs do not exactly match the accepted transcription manifest.`);
      }
    }
    return { simulationId: form.id, expectedQuestionCount: expectedQuestionIds.length };
  });
}

function sqlJson(value: unknown): string {
  return `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
}

export function generateOfficialQuestionRegistryMigration(
  rows: readonly OfficialQuestionRegistryRow[],
  formsInput: unknown,
  examsInput: unknown,
  commonSectionsInput: unknown = commonSectionsJson,
): string {
  const forms = officialExamManifestSchema.parse(formsInput);
  const exams = officialExamsSchema.parse(examsInput);
  const allowedFormIds = new Set(forms.map((form) => form.id));
  const formById = new Map(forms.map((form) => [form.id, form]));
  const duplicateForms = new Set<string>();
  for (const form of forms) {
    if (duplicateForms.has(form.id)) throw new Error(`Duplicate official simulation form ${form.id}.`);
    duplicateForms.add(form.id);
  }
  const allowlist = getOfficialSimulationAllowlist(forms, exams);
  const commonCatalog = parseOfficialCommonSectionCatalog({
    commonSections: commonSectionsInput,
    englishTopics,
    manifest: forms,
    sources: sourceManifest.sources.map((source) => ({
      sourceId: source.sourceId,
      sourceVersion: source.sourceVersion,
      url: source.url,
      sourceType: source.sourceType,
      status: source.status,
      locatorPolicy: source.locatorPolicy,
      rightsBasis: source.rightsBasis,
    })),
  });
  const examById = new Map(exams.map((exam) => [exam.id, exam]));
  const seenQuestionIds = new Set<string>();
  const rowIdPattern = /^(ADIF-202[345]-[0-9]{4})-(?:(general|english)-)?Q[0-9]{2}$/;
  for (const row of rows) {
    if (seenQuestionIds.has(row.questionId)) throw new Error(`Duplicate official registry question ID: ${row.questionId}.`);
    seenQuestionIds.add(row.questionId);
    if (!(row.correctAnswer === "A" || row.correctAnswer === "B" || row.correctAnswer === "C" || row.correctAnswer === "D")) {
      throw new Error(`${row.questionId} has an invalid answer key.`);
    }
    if (!row.conceptIds.length || row.conceptIds.some((id) => !activeTheoryConceptRegistry.has(id))) {
      throw new Error(`${row.questionId} has no fully active concept mapping.`);
    }

    const idMatch = row.questionId.match(rowIdPattern);
    if (!idMatch) throw new Error(`${row.questionId} does not use a supported official question ID.`);
    const formId = idMatch[1]!;
    const section = idMatch[2];
    if (section) {
      const expectedBucket = `practice:official-common:${section}`;
      if (row.simulationId !== expectedBucket) {
        throw new Error(`${row.questionId} must use its ${section} practice bucket.`);
      }
      if (!formById.get(formId)?.commonSectionIds?.includes(`${formId}-${section}`)) {
        throw new Error(`${row.questionId} has no matching ${section} section in the official form manifest.`);
      }
      const questionNumber = Number(row.questionId.slice(-2));
      const sectionMetadata = commonCatalog.commonSections.find((entry) => entry.id === `${formId}-${section}`);
      const questionMetadata = sectionMetadata?.questionMetadata.find((entry) => entry.questionNumber === questionNumber);
      if (!questionMetadata) {
        throw new Error(`${row.questionId} is not listed in the official common section.`);
      }
      if (questionMetadata.isReserve !== row.isReserve) {
        throw new Error(`${row.questionId} reserve status does not match the official common-section catalog.`);
      }
      continue;
    }

    if (!allowedFormIds.has(row.simulationId) || row.simulationId !== formId) {
      throw new Error(`Unlisted or mismatched official simulation ID: ${row.simulationId}.`);
    }
    if (!examById.get(formId)?.questionIds.includes(row.questionId)) {
      throw new Error(`${row.questionId} is not a member of the registered official form ${formId}.`);
    }
    const questionNumber = Number(row.questionId.slice(-2));
    const form = formById.get(formId)!;
    if (!form.transcribedQuestionNumbers.includes(questionNumber)) {
      throw new Error(`${row.questionId} is not in the accepted transcription manifest.`);
    }
    if (row.isReserve !== form.reserveQuestionNumbers.includes(questionNumber)) {
      throw new Error(`${row.questionId} reserve status does not match the official form manifest.`);
    }
  }

  const questionSeed = rows.map((row) => ({
    id: row.questionId,
    answer: row.correctAnswer,
    concepts: row.conceptIds,
    exam: row.simulationId,
  }));
  const allowlistSeed = allowlist.map(({ simulationId, expectedQuestionCount }) => ({
    simulation_id: simulationId,
    expected_question_count: expectedQuestionCount,
  }));
  const sql = `-- Generated by scripts/export-official-question-registry.ts.
-- Only currently eligible, rights-cleared, current-syllabus official records may activate answer keys.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.official_simulation_allowlist (
  simulation_id text primary key check (simulation_id ~ '^ADIF-202[345]-[0-9]{4}$'),
  expected_question_count integer not null check (expected_question_count >= 0)
);
revoke all on table private.official_simulation_allowlist from public, anon, authenticated;

delete from private.official_simulation_allowlist existing
where not exists (
  select 1
  from jsonb_to_recordset(${sqlJson(allowlistSeed)}) as current(simulation_id text, expected_question_count integer)
  where current.simulation_id = existing.simulation_id
);

insert into private.official_simulation_allowlist (simulation_id, expected_question_count)
select row.simulation_id, row.expected_question_count
from jsonb_to_recordset(${sqlJson(allowlistSeed)}) as row(simulation_id text, expected_question_count integer)
on conflict (simulation_id) do update
set expected_question_count = excluded.expected_question_count;

-- Common-section practice buckets are not official form-specific exam IDs.
update private.learning_questions
set active = false
where question_id ~ '^ADIF-202[345]-[0-9]{4}-(general-|english-)?Q[0-9]{2}$';

insert into private.learning_questions (question_id, correct_answer, concept_ids, simulation_id, active)
select row.id, row.answer, row.concepts, row.exam, true
from jsonb_to_recordset(${sqlJson(questionSeed)}) as row(id text, answer text, concepts text[], exam text)
on conflict (question_id) do update
set correct_answer = excluded.correct_answer,
    concept_ids = excluded.concept_ids,
    simulation_id = excluded.simulation_id,
    active = true;

create or replace function private.enforce_official_simulation_allowlist()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_expected_count integer;
  v_registered_count integer;
  v_active_count integer;
  v_eligible_count integer;
begin
  if new.simulation_id like 'practice:official-common:%' then
    raise exception 'Common-section practice buckets cannot start an official form-specific attempt.' using errcode = '23514';
  end if;

  select expected_question_count into v_expected_count
  from private.official_simulation_allowlist
  where simulation_id = new.simulation_id;
  if not found or v_expected_count = 0 then
    raise exception 'The requested ID is not an available official form.' using errcode = '23514';
  end if;

  select count(*), count(*) filter (where question.active), count(active_question.question_id)
  into v_registered_count, v_active_count, v_eligible_count
  from private.learning_questions question
  left join private.active_learning_questions active_question
    on active_question.question_id = question.question_id
  where question.simulation_id = new.simulation_id;

  if v_registered_count <> v_expected_count
    or v_active_count <> v_expected_count
    or v_eligible_count <> v_expected_count then
    raise exception 'Official form is not ready: every registered question and concept must be active.' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function private.enforce_official_simulation_allowlist() from public, anon, authenticated;

drop trigger if exists simulation_attempts_official_allowlist on public.simulation_attempts;
create trigger simulation_attempts_official_allowlist
before insert on public.simulation_attempts
for each row execute function private.enforce_official_simulation_allowlist();
`;
  return sql;
}

export function main(): void {
  const questions = officialQuestionsSchema.parse(questionsJson);
  const exams = officialExamsSchema.parse(examsJson);
  const forms = officialExamManifestSchema.parse(examManifestJson);
  const rows = buildOfficialQuestionRegistryRows(questions);
  const migration = generateOfficialQuestionRegistryMigration(rows, forms, exams);
  const outputPath = new URL("../supabase/migrations/202610150003_official_question_registry.sql", import.meta.url);
  writeFileSync(outputPath, migration);
  process.stdout.write(`Wrote ${rows.length} eligible answer rows for ${forms.length} official forms to ${fileURLToPath(outputPath)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}
