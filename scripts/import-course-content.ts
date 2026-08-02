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

  const question = {
    id,
    module: requiredValue(row, "module", rowNumber),
    prompt: requiredValue(row, "stem", rowNumber),
    options: (["A", "B", "C", "D"] as const).map((key) => ({
      key,
      text: requiredValue(row, key, rowNumber),
    })),
    answer: requiredValue(row, "answer", rowNumber),
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

async function main() {
  const csv = await readFile(sourcePath, "utf8");
  const rows = parse(csv, {
    bom: true,
    columns: true,
    relax_column_count: false,
    skip_empty_lines: true,
    trim: false,
  }) as CsvRow[];

  if (rows.length !== 4_500) {
    throw new Error(`Expected 4,500 CSV rows, received ${rows.length}.`);
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

  await Promise.all([
    writeFile(questionsTarget, `${JSON.stringify(parsedQuestions, null, 2)}\n`, "utf8"),
    writeFile(simulationsTarget, `${JSON.stringify(parsedSimulations, null, 2)}\n`, "utf8"),
  ]);

  console.log(`Imported ${parsedQuestions.length} questions and ${parsedSimulations.length} simulations.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
