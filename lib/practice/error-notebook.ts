import type { PracticeQuestion } from "../../components/practice/question-session";

export interface QuestionAttempt {
  question_id: string;
  is_correct: boolean;
  created_at: string;
}

export function deriveErrorNotebook<T extends PracticeQuestion>(
  questions: readonly T[],
  attempts: readonly QuestionAttempt[]
): T[] {
  const latestAttempts = new Map<string, QuestionAttempt>();

  for (const attempt of attempts) {
    const existing = latestAttempts.get(attempt.question_id);
    if (!existing || new Date(attempt.created_at) > new Date(existing.created_at)) {
      latestAttempts.set(attempt.question_id, attempt);
    }
  }

  return questions.filter((question) => {
    const latest = latestAttempts.get(question.id);
    return latest !== undefined && !latest.is_correct;
  });
}
