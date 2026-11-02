import type { OriginalPracticeDomain } from "../content/original-practice-schema";
import type { ReadinessQuestionAttempt } from "../adaptive/readiness";

export type OriginalProgress = {
  domain: OriginalPracticeDomain;
  totalQuestions: number;
  attemptedQuestions: number;
  attempts: number;
  correct: number;
  elapsedMs: number;
  latestAt: string | null;
};

/** Statistics describe saved practice attempts, not syllabus mastery or examination results. */
export function calculateOriginalProgress(
  questions: readonly { id: string; domain: OriginalPracticeDomain }[],
  attempts: readonly ReadinessQuestionAttempt[],
): OriginalProgress[] {
  const byQuestion = new Map(questions.map((question) => [question.id, question.domain]));
  const byDomain = new Map<OriginalPracticeDomain, OriginalProgress>();
  const attempted = new Map<OriginalPracticeDomain, Set<string>>();
  for (const question of questions) {
    const summary = byDomain.get(question.domain) ?? {
      domain: question.domain, totalQuestions: 0, attemptedQuestions: 0,
      attempts: 0, correct: 0, elapsedMs: 0, latestAt: null,
    };
    summary.totalQuestions++;
    byDomain.set(question.domain, summary);
  }
  for (const attempt of attempts) {
    if (attempt.mode !== "practice") continue;
    const domain = byQuestion.get(attempt.questionId);
    if (!domain) continue;
    const summary = byDomain.get(domain)!;
    const distinct = attempted.get(domain) ?? new Set<string>();
    distinct.add(attempt.questionId);
    attempted.set(domain, distinct);
    summary.attemptedQuestions = distinct.size;
    summary.attempts++;
    if (attempt.isCorrect) summary.correct++;
    summary.elapsedMs += attempt.elapsedMs;
    if (!summary.latestAt || Date.parse(attempt.createdAt) > Date.parse(summary.latestAt)) {
      summary.latestAt = attempt.createdAt;
    }
  }
  return [...byDomain.values()];
}
