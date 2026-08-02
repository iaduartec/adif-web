import questionsJson from "../../content/questions.json";
import simulationsJson from "../../content/simulations.json";
import { lessons } from "../../content/lessons";
import {
  type ContentOrigin,
  type Lesson,
  type Question,
  type Simulation,
  lessonsSchema,
  questionsSchema,
  simulationsSchema,
} from "./schema";

export type QuestionFilter = {
  module?: string;
  query?: string;
  ids?: readonly string[];
  origin?: ContentOrigin;
};

export type ContentRepositoryInput = {
  lessons: unknown;
  questions: unknown;
  simulations: unknown;
};

export function createContentRepository({
  lessons: lessonInput,
  questions: questionInput,
  simulations: simulationInput,
}: ContentRepositoryInput) {
  const lessonList = lessonsSchema.parse(lessonInput);
  const questionList = questionsSchema.parse(questionInput);
  const simulationList = simulationsSchema.parse(simulationInput);
  const questionById = new Map(questionList.map((question) => [question.id, question]));
  const lessonBySlug = new Map(lessonList.map((lesson) => [lesson.slug, lesson]));
  const simulationById = new Map(simulationList.map((simulation) => [simulation.id, simulation]));

  for (const simulation of simulationList) {
    for (const questionId of simulation.questionIds) {
      if (!questionById.has(questionId)) {
        throw new Error(`${simulation.id} references a missing question ID: ${questionId}.`);
      }
    }
  }

  return {
    getLesson(slug: string): Lesson | undefined {
      return lessonBySlug.get(slug);
    },
    listLessons(): readonly Lesson[] {
      return lessonList;
    },
    getQuestion(id: string): Question | undefined {
      return questionById.get(id);
    },
    listQuestions(filter?: QuestionFilter): Question[] {
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
    },
    getSimulation(id: string): Simulation | undefined {
      return simulationById.get(id);
    },
  };
}

const repository = createContentRepository({
  lessons,
  questions: questionsJson,
  simulations: simulationsJson,
});

export function getLesson(slug: string): Lesson | undefined {
  return repository.getLesson(slug);
}

export function listLessons(): readonly Lesson[] {
  return repository.listLessons();
}

export function getQuestion(id: string): Question | undefined {
  return repository.getQuestion(id);
}

export function listQuestions(filter?: QuestionFilter): Question[] {
  return repository.listQuestions(filter);
}

export function getSimulation(id: string): Simulation | undefined {
  return repository.getSimulation(id);
}
