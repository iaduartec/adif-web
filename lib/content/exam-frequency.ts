/**
 * Measured exam recurrence derived from the official ADIF question bank.
 *
 * The bank in `content/questions.json` is transcribed from real ADIF exam
 * booklets and tribunal correction sheets. Every record carries the convocatoria
 * it came from, so recurrence here is a measured count — never an estimate or an
 * editorial judgement.
 *
 * IMPORTANT: that bank covers only the specific syllabus scope ("Conocimiento
 * Específico"). No official questions are transcribed for the six common
 * documents, so `totalQuestions === 0` is a real, expected state and callers must
 * surface it as "no historical data" rather than as a zero score.
 */

import officialQuestions from "../../content/questions.json";

export type OfficialQuestionRecord = {
  id: string;
  sectionLabel: string;
  conceptIds: string[];
  syllabusNodeId?: string;
  source: { year: number; call: string; section?: string };
};

export type CallFrequency = {
  call: string;
  year: number;
  questionCount: number;
};

export type ConceptExamFrequency = {
  conceptId: string;
  /** Number of official questions whose `conceptIds` include this concept. */
  questionCount: number;
  /** Per-convocatoria breakdown, ascending by year then call. */
  calls: CallFrequency[];
};

export type ExamFrequencyReport = {
  /** Official questions backing the whole report. */
  totalQuestions: number;
  /** Distinct convocatorias represented, ascending by year then call. */
  calls: CallFrequency[];
  /** Distinct syllabus nodes touched by at least one official question. */
  distinctSyllabusNodes: number;
  /** Section label — the current bank only ever contains one. */
  sectionLabel: string;
  byConcept: Record<string, ConceptExamFrequency>;
  bySyllabusNode: Record<string, number>;
};

const questionRecords = officialQuestions as unknown as OfficialQuestionRecord[];

function ascendingByYearThenCall(a: CallFrequency, b: CallFrequency): number {
  if (a.year !== b.year) return a.year - b.year;
  return a.call.localeCompare(b.call);
}

/** Collapse a flat list of `{call, year}` hits into an ordered per-call count. */
function toCallFrequencies(
  hits: ReadonlyArray<{ call: string; year: number }>,
): CallFrequency[] {
  const grouped = new Map<string, CallFrequency>();

  for (const hit of hits) {
    const key = `${hit.year}::${hit.call}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.questionCount += 1;
    } else {
      grouped.set(key, { call: hit.call, year: hit.year, questionCount: 1 });
    }
  }

  return [...grouped.values()].sort(ascendingByYearThenCall);
}

let cachedReport: ExamFrequencyReport | null = null;

/**
 * Build the recurrence report from the official bank.
 *
 * Memoized: the underlying JSON is a build-time import, so the report is
 * deterministic for a given content revision.
 */
export function getExamFrequency(): ExamFrequencyReport {
  if (cachedReport) return cachedReport;

  const conceptHits = new Map<string, { call: string; year: number }[]>();
  const nodeCounts = new Map<string, number>();
  const callHits: { call: string; year: number }[] = [];
  const sectionLabels = new Set<string>();

  for (const question of questionRecords) {
    sectionLabels.add(question.sectionLabel);
    callHits.push({ call: question.source.call, year: question.source.year });

    for (const conceptId of question.conceptIds) {
      const hits = conceptHits.get(conceptId);
      if (hits) {
        hits.push({ call: question.source.call, year: question.source.year });
      } else {
        conceptHits.set(conceptId, [{ call: question.source.call, year: question.source.year }]);
      }
    }

    if (question.syllabusNodeId) {
      nodeCounts.set(
        question.syllabusNodeId,
        (nodeCounts.get(question.syllabusNodeId) ?? 0) + 1,
      );
    }
  }

  const byConcept: Record<string, ConceptExamFrequency> = {};
  for (const [conceptId, hits] of conceptHits) {
    byConcept[conceptId] = {
      conceptId,
      questionCount: hits.length,
      calls: toCallFrequencies(hits),
    };
  }

  cachedReport = {
    totalQuestions: questionRecords.length,
    calls: toCallFrequencies(callHits),
    distinctSyllabusNodes: nodeCounts.size,
    sectionLabel: [...sectionLabels].sort()[0] ?? "",
    byConcept,
    bySyllabusNode: Object.fromEntries(nodeCounts),
  };

  return cachedReport;
}

/** Recurrence for a single concept, or `null` when the concept never appeared. */
export function getConceptFrequency(conceptId: string): ConceptExamFrequency | null {
  return getExamFrequency().byConcept[conceptId] ?? null;
}

export type ExamFrequencyLevel = "none" | "low" | "medium" | "high";

/**
 * Bucket a measured count for visual emphasis.
 *
 * The thresholds are editorial presentation cues over a real count, not a
 * probability. Three calls are in the bank today, so "high" means the concept
 * appeared in more than one convocatoria.
 */
export function frequencyLevel(questionCount: number): ExamFrequencyLevel {
  if (questionCount <= 0) return "none";
  if (questionCount === 1) return "low";
  if (questionCount <= 3) return "medium";
  return "high";
}

export const frequencyLevelLabels: Record<ExamFrequencyLevel, string> = {
  none: "Sin registro",
  low: "Puntuales",
  medium: "Recurrentes",
  high: "Muy recurrentes",
};
