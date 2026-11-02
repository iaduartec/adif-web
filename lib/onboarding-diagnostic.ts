import {
  originalPracticePublicQuestionSchema,
  type OriginalPracticeQuestionDto,
} from "./content/original-practice-public-dto";

export const ORIGINAL_DIAGNOSTIC_QUESTION_COUNT = 15;

const diagnosticDomainOrder: readonly OriginalPracticeQuestionDto["domain"][] = [
  "general-knowledge",
  "psychometric",
  "english-a2",
  "telecom",
];

/** Selects eligible, answer-free original questions evenly across the four practice domains. */
export function selectBalancedOriginalDiagnosticQuestions(
  questions: readonly OriginalPracticeQuestionDto[],
  limit = ORIGINAL_DIAGNOSTIC_QUESTION_COUNT,
): OriginalPracticeQuestionDto[] {
  if (!Number.isSafeInteger(limit) || limit <= 0) return [];

  const buckets = new Map<OriginalPracticeQuestionDto["domain"], OriginalPracticeQuestionDto[]>(
    diagnosticDomainOrder.map((domain) => [domain, []]),
  );
  const seenIds = new Set<string>();

  for (const input of questions) {
    const parsed = originalPracticePublicQuestionSchema.safeParse(input);
    if (!parsed.success || seenIds.has(parsed.data.id)) continue;
    seenIds.add(parsed.data.id);
    buckets.get(parsed.data.domain)?.push(parsed.data);
  }

  const selected: OriginalPracticeQuestionDto[] = [];
  const indexes = new Map(diagnosticDomainOrder.map((domain) => [domain, 0]));
  while (selected.length < limit) {
    let addedThisRound = false;
    for (const domain of diagnosticDomainOrder) {
      const bucket = buckets.get(domain)!;
      const index = indexes.get(domain)!;
      const question = bucket[index];
      if (!question) continue;

      selected.push(question);
      indexes.set(domain, index + 1);
      addedThisRound = true;
      if (selected.length === limit) break;
    }
    if (!addedThisRound) break;
  }

  return selected;
}
