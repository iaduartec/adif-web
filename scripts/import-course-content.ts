import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

import {
  type Question,
  type Simulation,
  questionSchema,
  questionsSchema,
  simulationsSchema,
} from "../lib/content/schema";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const sourcePath = "C:\\Users\\kiri_\\Documents\\Codex\\2026-08-02\\referenced-chatgpt-conversation-this-is-an\\outputs\\Curso_ADIF_Telecom_2026\\02_Banco_4500_preguntas_comentadas.csv";
const questionsTarget = path.join(repositoryRoot, "content", "questions.json");
const simulationsTarget = path.join(repositoryRoot, "content", "simulations.json");
const expectedHeaders = ["id", "module", "stem", "A", "B", "C", "D", "answer", "comment", "source"];

type CsvRow = Record<(typeof expectedHeaders)[number], string>;

function requiredValue(row: CsvRow, key: keyof CsvRow, rowNumber: number): string {
  const value = row[key]?.trim();
  if (!value) {
    throw new Error(`Row ${rowNumber}: ${key} is required.`);
  }
  return value;
}

function toQuestion(row: CsvRow, rowNumber: number): Question {
  const id = requiredValue(row, "id", rowNumber);
  const expectedId = `Q${String(rowNumber).padStart(4, "0")}`;
  if (id !== expectedId) {
    throw new Error(`Row ${rowNumber}: expected stable ID ${expectedId}, received ${id}.`);
  }

  const answer = requiredValue(row, "answer", rowNumber);
  if (!(["A", "B", "C", "D"] as const).includes(answer as "A" | "B" | "C" | "D")) {
    throw new Error(`Row ${rowNumber}: answer must be one of A, B, C, or D.`);
  }

  const question = {
    id,
    module: requiredValue(row, "module", rowNumber),
    prompt: requiredValue(row, "stem", rowNumber),
    options: (["A", "B", "C", "D"] as const).map((key) => ({
      key,
      text: requiredValue(row, key, rowNumber),
    })),
    answer,
    explanation: requiredValue(row, "comment", rowNumber),
    sourceNote: requiredValue(row, "source", rowNumber),
    origin: "original_explanation" as const,
  };

  const parsedQuestion = questionSchema.safeParse(question);
  if (!parsedQuestion.success) {
    throw new Error(`Row ${rowNumber}: ${parsedQuestion.error.issues.map((issue) => issue.message).join(" ")}`);
  }

  return parsedQuestion.data;
}

function createSimulations(questions: readonly Question[]): Simulation[] {
  const questionIdsByModule = new Map<string, string[]>();
  for (const question of questions) {
    const ids = questionIdsByModule.get(question.module) ?? [];
    ids.push(question.id);
    questionIdsByModule.set(question.module, ids);
  }

  const moduleNames = [...questionIdsByModule.keys()].sort((left, right) => left.localeCompare(right));
  if (!moduleNames.length) throw new Error("Cannot create simulations without questions.");

  const cursors = new Map(moduleNames.map((moduleName) => [moduleName, 0]));
  return Array.from({ length: 30 }, (_, simulationIndex) => {
    const questionIds = Array.from({ length: 60 }, (_, position) => {
      const moduleName = moduleNames[position % moduleNames.length];
      const ids = questionIdsByModule.get(moduleName)!;
      const cursor = cursors.get(moduleName)!;
      cursors.set(moduleName, cursor + 1);
      return ids[cursor % ids.length];
    });

    return {
      id: `SIM-${String(simulationIndex + 1).padStart(2, "0")}`,
      title: `Simulacro ${String(simulationIndex + 1).padStart(2, "0")}`,
      questionIds,
      origin: "original_explanation",
    };
  });
}

export type ParseCourseCsvOptions = {
  expectedQuestionCount?: number;
};

export type ImportedCourseContent = {
  questions: Question[];
  simulations: Simulation[];
};

export function parseCourseCsv(
  csv: string,
  { expectedQuestionCount = 4_500 }: ParseCourseCsvOptions = {},
): ImportedCourseContent {
  let rows: CsvRow[];
  try {
    rows = parse(csv, {
      bom: true,
      columns: true,
      relax_column_count: false,
      skip_empty_lines: true,
      trim: false,
    }) as CsvRow[];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Malformed CSV: ${message}`);
  }

  if (rows.length !== expectedQuestionCount) {
    throw new Error(`Expected ${expectedQuestionCount.toLocaleString("en-US")} CSV rows, received ${rows.length}.`);
  }

  const seenIds = new Set<string>();
  for (const [index, row] of rows.entries()) {
    const id = requiredValue(row, "id", index + 1);
    if (seenIds.has(id)) {
      throw new Error(`CSV contains duplicate question IDs: ${id}.`);
    }
    seenIds.add(id);
  }

  const questions = rows.map((row, index) => toQuestion(row, index + 1));
  const uniqueIds = new Set(questions.map((question) => question.id));
  if (uniqueIds.size !== questions.length) {
    throw new Error("CSV contains duplicate question IDs.");
  }

  const simulations = createSimulations(questions);
  const parsedQuestions = questionsSchema.parse(questions);
  const parsedSimulations = simulationsSchema.parse(simulations);
  const questionIds = new Set(parsedQuestions.map((question) => question.id));

  for (const simulation of parsedSimulations) {
    if (new Set(simulation.questionIds).size !== 60) {
      throw new Error(`${simulation.id} contains duplicate question IDs.`);
    }
    if (simulation.questionIds.some((id) => !questionIds.has(id))) {
      throw new Error(`${simulation.id} references a missing question ID.`);
    }
  }

  return { questions: parsedQuestions, simulations: parsedSimulations };
}

export async function importCourseContent() {
  const csv = await readFile(sourcePath, "utf8");
  const { questions, simulations } = parseCourseCsv(csv);

  await Promise.all([
    writeFile(questionsTarget, `${JSON.stringify(questions, null, 2)}\n`, "utf8"),
    writeFile(simulationsTarget, `${JSON.stringify(simulations, null, 2)}\n`, "utf8"),
  ]);

  return { questions, simulations };
}

const executedAsScript = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (executedAsScript) {
  importCourseContent()
    .then(({ questions, simulations }) => {
      console.log(`Imported ${questions.length} questions and ${simulations.length} simulations.`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
