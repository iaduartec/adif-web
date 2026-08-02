import questionsJson from "../../content/questions.json";
import simulationsJson from "../../content/simulations.json";
import { lessons } from "../../content/lessons";
import {
  type ContentOrigin,
  type Lesson,
  type Question,
  type Simulation,
  questionsSchema,
  simulationsSchema,
} from "./schema";

export type QuestionFilter = {
  module?: string;
  query?: string;
  ids?: readonly string[];
  origin?: ContentOrigin;
};

const questionList = questionsSchema.parse(questionsJson);
const simulationList = simulationsSchema.parse(simulationsJson);
const questionById = new Map(questionList.map((question) => [question.id, question]));
const lessonBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));
const simulationById = new Map(simulationList.map((simulation) => [simulation.id, simulation]));

export function getLesson(slug: string): Lesson | undefined {
  return lessonBySlug.get(slug);
}

export function listLessons(): readonly Lesson[] {
  return lessons;
}

export function getQuestion(id: string): Question | undefined {
  return questionById.get(id);
}

export function listQuestions(filter?: QuestionFilter): Question[] {
  if (!filter) {
    return [...questionList];
  }

  const query = filter.query?.trim().toLocaleLowerCase();
  const allowedIds = filter.ids ? new Set(filter.ids) : undefined;

  return questionList.filter((question) => {
    if (filter.module && question.module !== filter.module) return false;
    if (filter.origin && question.origin !== filter.origin) return false;
    if (allowedIds && !allowedIds.has(question.id)) return false;
    if (!query) return true;

    return [
      question.prompt,
      question.explanation,
      question.sourceNote,
      ...question.options.map((option) => option.text),
    ].some((value) => value.toLocaleLowerCase().includes(query));
  });
}

export function getSimulation(id: string): Simulation | undefined {
  return simulationById.get(id);
}
