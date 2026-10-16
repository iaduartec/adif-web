import { z } from "zod";
import { officialItems } from "../../content/syllabus";
import { getEnglishCurriculum } from "../content/english-a2-curriculum";

const inputSchema = z.object({
  completedSyllabusNodeIds: z.array(z.string()).default([]),
  completedEnglishTopicIds: z.array(z.string()).default([]),
}).strict();

function completedProgress(ids: readonly string[], completedIds: readonly string[]) {
  const completedSet = new Set(completedIds);
  const completed = ids.filter((id) => completedSet.has(id)).length;
  return { completed, total: ids.length, percent: ids.length ? Number((100 * completed / ids.length).toFixed(2)) : 0 };
}

/** Learner study progress, separate from source coverage or exam readiness. */
export function calculateCurriculumProgress(input: unknown) {
  const parsed = inputSchema.parse(input);
  return {
    officialSyllabus: completedProgress(
      officialItems.flatMap(({ children }) => children.map(({ id }) => id)),
      parsed.completedSyllabusNodeIds,
    ),
    englishA2: completedProgress(
      getEnglishCurriculum().topics.map(({ id }) => id),
      parsed.completedEnglishTopicIds,
    ),
  };
}
