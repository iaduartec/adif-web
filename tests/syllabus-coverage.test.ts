import { describe, expect, it } from "vitest";

import {
  getOrphanCourseModules,
  getSyllabusCoverage,
  syllabusInventoryMeta,
  syllabusItems,
  type SyllabusInventoryMeta,
  type SyllabusItem,
} from "../content/syllabus";
import { validateSyllabusCoverage } from "../scripts/verify-syllabus-coverage";

const sourceCompleteMeta: SyllabusInventoryMeta = {
  sourceComplete: true,
  sourceDocumentId: "fixture-annex",
  sourceTitle: "Fixture annex",
  sourceUrl: "https://example.test/annex",
  extractedItems: 3,
  unresolvedItems: 0,
};

const fixtureItem = (id: string, status: SyllabusItem["status"] = "covered"): SyllabusItem => ({
  id,
  title: id,
  syllabusSourceId: "pni26-01",
  syllabusLocator: "Página oficial PNI26/01, bases adjuntas",
  syllabusQuote: "según se especifica en las Bases de la Convocatoria adjuntas",
  materialSourceIds: status === "reference-only" || status === "unresolved" ? [] : ["CE"],
  status,
  linkedModules: status === "missing" ? [] : ["igualdad"],
  rationale: "Fixture",
});

describe("official syllabus coverage map", () => {
  it("keeps the real inventory explicitly provisional", () => {
    expect(syllabusInventoryMeta.sourceComplete).toBe(false);
    expect(getSyllabusCoverage().coveragePercent).toBeNull();
    expect(getSyllabusCoverage().identifiedCoveragePercent).toBe(64.71);
    expect(getSyllabusCoverage().unresolved).toBe(17);
  });

  it("separates the syllabus source from material sources", () => {
    const equality = syllabusItems.find((item) => item.id === "syllabus-igualdad");
    expect(equality?.syllabusSourceId).toBe("pni26-01");
    expect(equality?.materialSourceIds).toContain("LO 3/2007");
    expect(equality?.syllabusSourceId).not.toBe("LO 3/2007");
  });

  it("allows unresolved and keeps reference-only material-free", () => {
    expect(validateSyllabusCoverage(syllabusItems)).toEqual([]);
    const reference = syllabusItems.find((item) => item.id === "syllabus-en-50121");
    expect(reference?.identifiedStatus).toBe("reference-only");
    expect(reference?.materialSourceIds).toEqual([]);
    expect(
      validateSyllabusCoverage([fixtureItem("ref", "reference-only")], {
        ...syllabusInventoryMeta,
        unresolvedItems: 0,
      }),
    ).toEqual([]);
  });

  it("rejects a syllabus source that is actually a material source", () => {
    const invalid = { ...fixtureItem("invalid"), syllabusSourceId: "LO 3/2007" };
    expect(validateSyllabusCoverage([invalid]).some((error) => error.includes("syllabus source"))).toBe(true);
  });

  it("fails when sourceComplete inventory omits an official item", () => {
    const errors = validateSyllabusCoverage(
      [fixtureItem("A"), fixtureItem("B")],
      sourceCompleteMeta,
      [fixtureItem("A"), fixtureItem("B"), fixtureItem("C")],
    );
    expect(errors.some((error) => error.includes("missing official syllabus item 'C'"))).toBe(true);
  });

  it("rejects covered items without material content and missing items with links", () => {
    const coveredWithoutContent = { ...fixtureItem("covered"), materialSourceIds: [], linkedModules: [] };
    const missingWithLink = { ...fixtureItem("missing", "missing"), linkedModules: ["igualdad"] };
    const errors = validateSyllabusCoverage([coveredWithoutContent, missingWithLink]);
    expect(errors.some((error) => error.includes("covered but has no linked content"))).toBe(true);
    expect(errors.some((error) => error.includes("missing but declares linked modules"))).toBe(true);
  });

  it("reports duplicate IDs, invalid modules and invalid material sources", () => {
    const invalid = { ...fixtureItem("duplicate"), linkedModules: ["does-not-exist"], materialSourceIds: ["unknown"] };
    const errors = validateSyllabusCoverage([invalid, invalid]);
    expect(errors.some((error) => error.includes("Duplicate syllabus ID"))).toBe(true);
    expect(errors.some((error) => error.includes("missing module"))).toBe(true);
    expect(errors.some((error) => error.includes("unknown material source"))).toBe(true);
  });

  it("reports orphan course modules separately", () => {
    expect(getOrphanCourseModules([])).toContain("igualdad");
  });

  it("calculates official coverage only for an exhaustive fixture", () => {
    const metrics = getSyllabusCoverage(
      [fixtureItem("A"), fixtureItem("B"), fixtureItem("C")],
      sourceCompleteMeta,
    );
    expect(metrics.officialItemsTotal).toBe(3);
    expect(metrics.coveragePercent).toBe(100);
  });
});
