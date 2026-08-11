import { describe, expect, it } from "vitest";

import {
  getSyllabusCoverage,
  syllabusItems,
  type SyllabusItem,
} from "../content/syllabus";
import { validateSyllabusCoverage } from "../scripts/verify-syllabus-coverage";

describe("official syllabus coverage map", () => {
  it("exposes unique items with valid statuses and official source IDs", () => {
    expect(syllabusItems.length).toBeGreaterThan(0);
    expect(new Set(syllabusItems.map((item) => item.id)).size).toBe(syllabusItems.length);
    for (const item of syllabusItems) {
      expect(["covered", "partial", "missing", "reference-only"]).toContain(item.status);
      expect(item.officialSourceId.trim()).not.toBe("");
      expect(item.officialLocator.trim()).not.toBe("");
      expect(item.title.trim()).not.toBe("");
    }
  });

  it("derives item status metrics without counting claims", () => {
    const metrics = getSyllabusCoverage(syllabusItems);
    expect(metrics.syllabusItemsTotal).toBe(syllabusItems.length);
    expect(metrics.covered + metrics.partial + metrics.missing + metrics.referenceOnly).toBe(
      metrics.syllabusItemsTotal,
    );
    expect(metrics.coveragePercent).toBe(
      Number(((metrics.covered / metrics.syllabusItemsTotal) * 100).toFixed(2)),
    );
  });

  it("keeps the item contract extensible for verifier fixtures", () => {
    const fixture: SyllabusItem = {
      id: "fixture",
      title: "Fixture",
      officialSourceId: "PNI26/01",
      officialLocator: "Bases, perfil 25/10PO",
      status: "missing",
      linkedModules: [],
      rationale: "Fixture de validación.",
    };
    expect(getSyllabusCoverage([fixture]).missing).toBe(1);
  });

  it("accepts the real inventory", () => {
    expect(validateSyllabusCoverage(syllabusItems)).toEqual([]);
  });

  it("rejects duplicate IDs and contradictory missing links", () => {
    const invalid: SyllabusItem[] = [
      { ...syllabusItems[0], status: "missing", linkedModules: ["igualdad"] },
      { ...syllabusItems[0] },
    ];
    const errors = validateSyllabusCoverage(invalid);
    expect(errors.some((error) => error.includes("Duplicate syllabus ID"))).toBe(true);
    expect(errors.some((error) => error.includes("missing but declares linked modules"))).toBe(true);
  });

  it("rejects covered items with no module content", () => {
    const invalid: SyllabusItem = {
      ...syllabusItems[0],
      status: "covered",
      linkedModules: [],
    };
    expect(validateSyllabusCoverage([invalid]).some((error) => error.includes("zero concepts"))).toBe(true);
  });
});
