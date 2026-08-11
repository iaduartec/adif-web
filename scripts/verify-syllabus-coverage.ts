import { pathToFileURL } from "node:url";

import { syllabusItems, getSyllabusCoverage, type SyllabusItem } from "../content/syllabus";
import { lessonTheories } from "../content/lesson-theory";
import { lessons } from "../content/lessons";
import { getSourceKind, OFFICIAL_SOURCE_REGISTRY } from "./verify-theory-references";

const VALID_STATUSES = ["covered", "partial", "missing", "reference-only"] as const;

export function validateSyllabusCoverage(items: readonly SyllabusItem[]): string[] {
  const errors: string[] = [];
  const seen = new Map<string, number>();
  const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));

  for (const [index, item] of items.entries()) {
    const location = `syllabusItems[${index}]`;
    if (seen.has(item.id)) {
      errors.push(`Duplicate syllabus ID '${item.id}' at ${location}; first seen at ${seen.get(item.id)}`);
    } else {
      seen.set(item.id, index);
    }
    if (!VALID_STATUSES.includes(item.status)) {
      errors.push(`${location} has invalid status '${item.status}'`);
    }
    if (!item.title.trim() || !item.officialSourceId.trim() || !item.officialLocator.trim()) {
      errors.push(`${location} must have title, officialSourceId and officialLocator`);
    }
    if (!OFFICIAL_SOURCE_REGISTRY[item.officialSourceId]) {
      errors.push(`${location} uses unknown official source '${item.officialSourceId}'`);
    }
    for (const moduleSlug of item.linkedModules) {
      if (!lessonSlugs.has(moduleSlug) || !lessonTheories[moduleSlug]) {
        errors.push(`${location} links to missing module '${moduleSlug}'`);
      }
    }
    const conceptCount = item.linkedModules.reduce(
      (total, moduleSlug) => total + (lessonTheories[moduleSlug]?.concepts.length ?? 0),
      0,
    );
    if (item.status === "covered" && conceptCount === 0) {
      errors.push(`${location} is covered but links to zero concepts`);
    }
    if (item.status === "missing" && item.linkedModules.length > 0) {
      errors.push(`${location} is missing but declares linked modules`);
    }
    if (item.status === "reference-only" && getSourceKind(item.officialSourceId) !== "syllabus-reference") {
      errors.push(`${location} is reference-only but its source is not a syllabus-reference`);
    }
  }

  const metrics = getSyllabusCoverage(items);
  const statusTotal = metrics.covered + metrics.partial + metrics.missing + metrics.referenceOnly;
  if (statusTotal !== metrics.syllabusItemsTotal) {
    errors.push(`Coverage status counts (${statusTotal}) do not equal total (${metrics.syllabusItemsTotal})`);
  }
  const expectedPercent =
    metrics.syllabusItemsTotal === 0
      ? 0
      : Number(((metrics.covered / metrics.syllabusItemsTotal) * 100).toFixed(2));
  if (metrics.coveragePercent !== expectedPercent) {
    errors.push(`coveragePercent is not derived from covered / total (${metrics.coveragePercent} !== ${expectedPercent})`);
  }
  return errors;
}

export function run(): void {
  const errors = validateSyllabusCoverage(syllabusItems);
  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }
  const metrics = getSyllabusCoverage(syllabusItems);
  console.log(
    `Syllabus coverage OK: ${metrics.syllabusItemsTotal} items; ` +
      `covered ${metrics.covered}; partial ${metrics.partial}; ` +
      `missing ${metrics.missing}; reference-only ${metrics.referenceOnly}; ` +
      `coverage ${metrics.coveragePercent}%`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  run();
}
