import englishA2Json from "../../content/original-practice/english-a2.json";
import generalKnowledgeJson from "../../content/original-practice/general-knowledge.json";
import psychometricJson from "../../content/original-practice/psychometric.json";
import telecomJson from "../../content/original-practice/telecom.json";
import {
  type OriginalPracticeDomain,
  type OriginalPracticeQuestion,
  type OriginalPracticeStatus,
  originalPracticeQuestionsSchema,
} from "./original-practice-schema";

export type OriginalPracticeFilter = {
  domain?: OriginalPracticeDomain;
  topicId?: string;
  topic?: string;
  query?: string;
  status?: OriginalPracticeStatus;
  ids?: readonly string[];
};

export type OriginalPracticeRepositoryInput = {
  englishA2: unknown;
  generalKnowledge: unknown;
  psychometric: unknown;
  telecom: unknown;
};

const datasetDomains = [
  ["englishA2", "english-a2"],
  ["generalKnowledge", "general-knowledge"],
  ["psychometric", "psychometric"],
  ["telecom", "telecom"],
] as const;

function cloneQuestion(question: OriginalPracticeQuestion): OriginalPracticeQuestion {
  return structuredClone(question);
}

export function createOriginalPracticeRepository(input: OriginalPracticeRepositoryInput) {
  const allQuestions: OriginalPracticeQuestion[] = [];

  for (const [datasetKey, expectedDomain] of datasetDomains) {
    const dataset = originalPracticeQuestionsSchema.parse(input[datasetKey]);
    for (const question of dataset) {
      if (question.domain !== expectedDomain) {
        throw new Error(
          `Original practice dataset '${datasetKey}' contains '${question.domain}' instead of '${expectedDomain}'.`,
        );
      }
      allQuestions.push(question);
    }
  }

  const validatedQuestions = originalPracticeQuestionsSchema.parse(allQuestions);
  const questionById = new Map(validatedQuestions.map((question) => [question.id, question]));

  function matches(question: OriginalPracticeQuestion, filter: OriginalPracticeFilter): boolean {
    if (filter.domain && question.domain !== filter.domain) return false;
    if (filter.status && question.status !== filter.status) return false;
    if (filter.ids && !new Set(filter.ids).has(question.id)) return false;
    if (filter.topicId && !question.topicId.toLocaleLowerCase().includes(filter.topicId.trim().toLocaleLowerCase())) {
      return false;
    }
    if (filter.topic && !question.topic.toLocaleLowerCase().includes(filter.topic.trim().toLocaleLowerCase())) {
      return false;
    }
    if (filter.query) {
      const query = filter.query.trim().toLocaleLowerCase();
      const searchable = [
        question.id,
        question.domain,
        question.topicId,
        question.topic,
        question.skill,
        question.prompt,
        ...question.tags,
      ];
      if (!searchable.some((value) => value.toLocaleLowerCase().includes(query))) return false;
    }
    return true;
  }

  return {
    listOriginalPracticeQuestions(filter?: OriginalPracticeFilter): readonly OriginalPracticeQuestion[] {
      const selected = filter
        ? validatedQuestions.filter((question) => matches(question, filter))
        : validatedQuestions;
      return selected.map(cloneQuestion);
    },

    getOriginalPracticeQuestion(id: string): OriginalPracticeQuestion | undefined {
      const question = questionById.get(id);
      return question ? cloneQuestion(question) : undefined;
    },
  };
}

const repository = createOriginalPracticeRepository({
  englishA2: englishA2Json,
  generalKnowledge: generalKnowledgeJson,
  psychometric: psychometricJson,
  telecom: telecomJson,
});

export function listOriginalPracticeQuestions(
  filter?: OriginalPracticeFilter,
): readonly OriginalPracticeQuestion[] {
  return repository.listOriginalPracticeQuestions(filter);
}

export function getOriginalPracticeQuestion(id: string): OriginalPracticeQuestion | undefined {
  return repository.getOriginalPracticeQuestion(id);
}
