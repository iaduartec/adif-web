import { pathToFileURL } from "node:url";

import {
  getSyllabusCoverage,
  syllabusInventoryMeta,
  syllabusItems,
  type SyllabusInventoryMeta,
  type SyllabusItem,
} from "../content/syllabus";
import { lessons } from "../content/lessons";
import { SYLLABUS_SOURCES } from "../content/syllabus-sources";
import { lessonTheories } from "../content/lesson-theory";
import { OFFICIAL_SOURCE_REGISTRY } from "./verify-theory-references";

const VALID_STATUSES = ["covered", "partial", "missing", "reference-only", "unresolved"] as const;

export function validateSyllabusCoverage(
  items: readonly SyllabusItem[],
  meta: SyllabusInventoryMeta = syllabusInventoryMeta,
  officialItems: readonly SyllabusItem[] = [],
): string[] {
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
    if (!VALID_STATUSES.includes(item.status)) errors.push(`${location} has invalid status '${item.status}'`);
    if (!item.title.trim() || !item.syllabusSourceId.trim() || !item.syllabusLocator.trim()) {
      errors.push(`${location} must have title, syllabusSourceId and syllabusLocator`);
    }
    if (!SYLLABUS_SOURCES[item.syllabusSourceId]) {
      errors.push(`${location} uses unknown syllabus source '${item.syllabusSourceId}'`);
    }
    if (OFFICIAL_SOURCE_REGISTRY[item.syllabusSourceId]) {
      errors.push(`${location} uses a material source ID as syllabus source '${item.syllabusSourceId}'`);
    }
    for (const sourceId of item.materialSourceIds) {
      if (!OFFICIAL_SOURCE_REGISTRY[sourceId]) errors.push(`${location} uses unknown material source '${sourceId}'`);
      if (sourceId === item.syllabusSourceId) errors.push(`${location} reuses syllabus source as material source '${sourceId}'`);
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
    if (item.status === "covered" && (conceptCount === 0 || item.materialSourceIds.length === 0)) {
      errors.push(`${location} is covered but has no linked content or material source`);
    }
    if (item.status === "partial" && (conceptCount === 0 || item.materialSourceIds.length === 0)) {
      errors.push(`${location} is partial but has no linked content or material source`);
    }
    if (item.status === "missing" && item.linkedModules.length > 0) {
      errors.push(`${location} is missing but declares linked modules`);
    }
    if (item.status === "reference-only" && item.materialSourceIds.length > 0) {
      errors.push(`${location} is reference-only but declares material sources`);
    }
  }

  if (meta.unresolvedItems !== items.filter((item) => item.status === "unresolved").length) {
    errors.push(`metadata unresolvedItems does not match unresolved item count`);
  }
  if (meta.sourceComplete && meta.extractedItems !== officialItems.length) {
    errors.push(`sourceComplete inventory extractedItems does not equal official item count`);
  }
  if (meta.sourceComplete) {
    const mappedIds = new Set(items.map((item) => item.id));
    for (const officialItem of officialItems) {
      if (!mappedIds.has(officialItem.id)) errors.push(`missing official syllabus item '${officialItem.id}'`);
    }
  }

  const metrics = getSyllabusCoverage(items, meta);
  if (!meta.sourceComplete && metrics.coveragePercent !== null) {
    errors.push(`coveragePercent must be null when the official source is incomplete`);
  }
  if (meta.sourceComplete && metrics.coveragePercent === null) {
    errors.push(`coveragePercent cannot be null when the official source is complete`);
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
  const metrics = getSyllabusCoverage();
  console.log(
    `Syllabus scope OK: identified ${metrics.identifiedItemsTotal}; ` +
      `unresolved ${metrics.unresolved}; ` +
      `official coverage ${metrics.coveragePercent === null ? "unavailable" : `${metrics.coveragePercent}%`}; ` +
      `identified coverage ${metrics.identifiedCoveragePercent ?? "unavailable"}%`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) run();
