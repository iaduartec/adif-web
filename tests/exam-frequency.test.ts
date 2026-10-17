import { describe, expect, it } from "vitest";

import {
  frequencyLevel,
  frequencyLevelLabels,
  getConceptFrequency,
  getExamFrequency,
} from "../lib/content/exam-frequency";

describe("exam frequency from the official bank", () => {
  it("counts the whole official bank and the convocatorias it came from", () => {
    const report = getExamFrequency();

    expect(report.totalQuestions).toBe(102);
    expect(report.calls).toHaveLength(3);
    expect(report.calls.map((entry) => entry.call)).toEqual(["PNI23/01", "PNI24/01", "PNI25/01"]);
    expect(report.calls.map((entry) => entry.year)).toEqual([2023, 2024, 2025]);
  });

  it("orders calls ascending by year so the breakdown reads chronologically", () => {
    const calls = getExamFrequency().calls;
    const years = calls.map((entry) => entry.year);

    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it("reports the bank section, because the common scope has no transcription", () => {
    expect(getExamFrequency().sectionLabel).toBe("Conocimiento Específico");
  });

  it("measures the most repeated concept with its per-call breakdown", () => {
    const frequency = getConceptFrequency("ict-concept-16");

    expect(frequency).not.toBeNull();
    expect(frequency?.questionCount).toBe(6);
    expect(frequency?.calls.reduce((total, entry) => total + entry.questionCount, 0)).toBe(6);
    expect(frequency?.calls.every((entry) => entry.questionCount > 0)).toBe(true);
  });

  it("returns null for a concept that never appeared, not a zero", () => {
    expect(getConceptFrequency("concept-that-does-not-exist")).toBeNull();
  });

  it("maps every counted question onto a syllabus node", () => {
    const report = getExamFrequency();
    const total = Object.values(report.bySyllabusNode).reduce((sum, count) => sum + count, 0);

    expect(total).toBe(report.totalQuestions);
    expect(report.distinctSyllabusNodes).toBeGreaterThan(0);
  });

  it("keeps the concept tally consistent with the node tally", () => {
    const report = getExamFrequency();
    const conceptTotal = Object.values(report.byConcept).reduce((sum, entry) => sum + entry.questionCount, 0);

    // The bank assigns exactly one concept per question today, but the report
    // must stay honest if that changes: concept tally can only exceed the node
    // tally, never fall short of the questions that carry a node.
    expect(conceptTotal).toBeGreaterThanOrEqual(report.totalQuestions);
  });
});

describe("frequency level buckets", () => {
  it("buckets a measured count into presentation levels", () => {
    expect(frequencyLevel(0)).toBe("none");
    expect(frequencyLevel(1)).toBe("low");
    expect(frequencyLevel(2)).toBe("medium");
    expect(frequencyLevel(3)).toBe("medium");
    expect(frequencyLevel(4)).toBe("high");
    expect(frequencyLevel(99)).toBe("high");
  });

  it("labels every level for display", () => {
    for (const level of ["none", "low", "medium", "high"] as const) {
      expect(frequencyLevelLabels[level]).toBeTruthy();
    }
  });
});

describe("scope honesty", () => {
  it("does not attribute exam history to any common-syllabus concept", () => {
    // The official bank is 100% "Conocimiento Específico". A common-syllabus
    // concept id must therefore resolve to null so the UI can say "no data"
    // instead of implying the topic never appeared in an exam.
    for (const conceptId of ["estatuto-concept-1", "igualdad-concept-1", "prl-concept-1"]) {
      expect(getConceptFrequency(conceptId)).toBeNull();
    }
  });

  it("only counts concepts that actually exist in the bank", () => {
    const report = getExamFrequency();
    const prefixes = new Set(Object.keys(report.byConcept).map((id) => id.split("-")[0]));

    expect([...prefixes].sort()).toEqual(["cem", "ict", "rcf"]);
  });
});
