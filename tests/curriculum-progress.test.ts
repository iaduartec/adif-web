import { describe, expect, it } from "vitest";
import { getSyllabusCoverage, officialItems } from "../content/syllabus";
import catalog from "../content/official-exams/english-topics.json";
import { calculateCurriculumProgress } from "../lib/progress/curriculum";

const officialIds = officialItems.flatMap(({ children }) => children.map(({ id }) => id));
const englishIds = catalog.topics.map(({ id }) => id);

describe("official syllabus and A2 learner progress separation", () => {
  it("reports 100% official study progress when all official nodes and no English topics are completed", () => {
    const result = calculateCurriculumProgress({ completedSyllabusNodeIds: officialIds, completedEnglishTopicIds: [] });
    expect(result.officialSyllabus.percent).toBe(100);
    expect(result.officialSyllabus.total).toBe(28);
    expect(result.englishA2.percent).toBe(0);
  });
  it("reports 0% official study progress when all English topics and no official nodes are completed", () => {
    const before = getSyllabusCoverage();
    const result = calculateCurriculumProgress({ completedSyllabusNodeIds: [], completedEnglishTopicIds: englishIds });
    expect(result.officialSyllabus.percent).toBe(0);
    expect(result.officialSyllabus.total).toBe(28);
    expect(result.englishA2).toEqual({ completed: 22, total: 22, percent: 100 });
    expect(getSyllabusCoverage()).toEqual(before);
    expect(officialIds).not.toContain("past-simple");
  });
  it("ignores duplicates, obsolete IDs and cross-domain completion data", () => {
    const result = calculateCurriculumProgress({
      completedSyllabusNodeIds: [...englishIds, "unknown"],
      completedEnglishTopicIds: ["past-simple", "past-simple", ...officialIds, "unknown"],
    });
    expect(result.officialSyllabus.completed).toBe(0);
    expect(result.englishA2.completed).toBe(1);
  });
});
