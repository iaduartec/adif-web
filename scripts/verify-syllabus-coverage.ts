import { pathToFileURL } from "node:url";

import {
  getSyllabusCoverage,
  officialItems,
  syllabusInventoryMeta,
  syllabusItems,
  type SyllabusInventoryMeta,
  type SyllabusItem,
  type SyllabusNode,
  type SyllabusStatus,
} from "../content/syllabus";
import { lessons } from "../content/lessons";
import { SYLLABUS_SOURCES } from "../content/syllabus-sources";
import { lessonTheories } from "../content/lesson-theory";
import { sourceManifest, validateSourceReference } from "../lib/content/source-manifest";
import { OFFICIAL_SOURCE_REGISTRY } from "./verify-theory-references";

const VALID_STATUSES: readonly SyllabusStatus[] = ["covered", "partial", "missing", "reference-only", "unresolved"];

function sourceVersionErrors(sourceId: string, sourceVersion: string, location: string): string[] {
  const source = sourceManifest.sources.find(
    (entry) => entry.sourceId === sourceId && entry.sourceVersion === sourceVersion,
  );
  if (!source) return [`${location} uses unknown source version '${sourceId}' / '${sourceVersion}'`];
  if (source.status !== "verified") {
    return [`${location} uses source version '${sourceId}' / '${sourceVersion}' with status '${source.status}'`];
  }
  return [];
}

function validateNode(node: SyllabusNode, location: string, seen: Map<string, string>): string[] {
  const errors: string[] = [];
  const previous = seen.get(node.id);
  if (previous) errors.push(`Duplicate syllabus ID '${node.id}' at ${location}; first seen at ${previous}`);
  else seen.set(node.id, location);

  if (!node.title.trim() || !node.sourceId.trim() || !node.sourceVersion.trim() || !node.sourceLocator.trim()) {
    errors.push(`${location} must have title, sourceId, sourceVersion and an exact sourceLocator`);
  }
  errors.push(...sourceVersionErrors(node.sourceId, node.sourceVersion, location));
  if (!VALID_STATUSES.includes(node.status)) errors.push(`${location} has invalid status '${node.status}'`);

  for (const sourceId of node.materialSourceIds) {
    if (!OFFICIAL_SOURCE_REGISTRY[sourceId]) errors.push(`${location} uses unknown material source '${sourceId}'`);
    if (sourceId === node.sourceId) errors.push(`${location} repeats its sourceId as material source '${sourceId}'`);
  }
  for (const moduleSlug of node.linkedModules) {
    if (!lessonSlugs.has(moduleSlug) || !lessonTheories[moduleSlug]) {
      errors.push(`${location} links to missing module '${moduleSlug}'`);
    }
  }

  const conceptCount = node.linkedModules.reduce(
    (total, moduleSlug) => total + (lessonTheories[moduleSlug]?.concepts.length ?? 0),
    0,
  );
  if ((node.status === "covered" || node.status === "partial") && (conceptCount === 0 || node.materialSourceIds.length === 0)) {
    errors.push(`${location} is ${node.status} but has no linked theory and material source`);
  }
  if (node.status === "missing" && (node.linkedModules.length > 0 || node.materialSourceIds.length > 0)) {
    errors.push(`${location} is missing but declares linked theory or material sources`);
  }
  if (node.status === "reference-only" && node.materialSourceIds.length > 0) {
    errors.push(`${location} is reference-only but declares material sources`);
  }
  return errors;
}

const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));

export function validateSyllabusCoverage(
  items: readonly SyllabusItem[] = syllabusItems,
  meta: SyllabusInventoryMeta = syllabusInventoryMeta,
  official: readonly SyllabusItem[] = officialItems,
): string[] {
  const errors: string[] = [];
  const seen = new Map<string, string>();
  let unresolvedCount = 0;

  for (const [index, item] of items.entries()) {
    const location = `officialItems[${index}]`;
    const previous = seen.get(item.id);
    if (previous) errors.push(`Duplicate syllabus ID '${item.id}' at ${location}; first seen at ${previous}`);
    else seen.set(item.id, location);

    if (!item.title.trim() || !item.scopeSourceId.trim() || !item.scopeSourceVersion.trim() || !item.scopeLocator.trim()) {
      errors.push(`${location} must have title, scopeSourceId, scopeSourceVersion and an exact scopeLocator`);
    }
    const scopeSource = SYLLABUS_SOURCES[item.scopeSourceId];
    if (!scopeSource) {
      errors.push(`${location} uses unknown syllabus source '${item.scopeSourceId}'`);
    } else if (!scopeSource.manifestSourceId || !scopeSource.sourceVersion) {
      errors.push(`${location} syllabus source '${item.scopeSourceId}' has no versioned manifest identity`);
    } else {
      errors.push(
        ...validateSourceReference(
          {
            sourceId: scopeSource.manifestSourceId,
            sourceVersion: item.scopeSourceVersion,
            sourceUrl: scopeSource.url,
          },
          sourceManifest,
        ).map((error) => `${location} ${error}`),
      );
    }
    errors.push(...sourceVersionErrors(item.sourceId, item.sourceVersion, location));
    if (!item.sourceLocator.trim()) errors.push(`${location} must have an exact sourceLocator`);
    if (item.children.length === 0) errors.push(`${location} has no official scope children`);

    for (const [childIndex, child] of item.children.entries()) {
      const childLocation = `${location}.children[${childIndex}]`;
      errors.push(...validateNode(child, childLocation, seen));
      if (child.status === "unresolved") unresolvedCount += 1;
    }
  }

  if (meta.unresolvedItems !== unresolvedCount) {
    errors.push(`metadata unresolvedItems does not match unresolved official child count`);
  }
  if (meta.sourceComplete && meta.extractedItems !== official.length) {
    errors.push(`sourceComplete inventory extractedItems does not equal official parent count`);
  }
  if (meta.sourceComplete) {
    const mappedIds = new Set(items.map((item) => item.id));
    for (const officialItem of official) {
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
  const errors = validateSyllabusCoverage();
  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }
  const metrics = getSyllabusCoverage();
  console.log(
    `Syllabus scope OK: official parents ${metrics.officialItemsTotal}; mapped ${metrics.mapped}; ` +
      `fully covered ${metrics.covered}; partial ${metrics.partial}; missing ${metrics.missing}; ` +
      `unresolved ${metrics.unresolved}; full-coverage ${metrics.coveragePercent}%`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) run();
