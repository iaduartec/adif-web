import { describe, expect, it } from "vitest";

import {
  getOrphanCourseModules,
  getSyllabusCoverage,
  officialItems,
  syllabusInventoryMeta,
  supplementalItems,
  type SyllabusItem,
} from "../content/syllabus";
import { sourceManifest } from "../lib/content/source-manifest";
import { validateSyllabusCoverage } from "../scripts/verify-syllabus-coverage";

function copyOfficialItems(): SyllabusItem[] {
  return JSON.parse(JSON.stringify(officialItems)) as SyllabusItem[];
}

describe("official PNI26/01 syllabus coverage", () => {
  it("contains exactly six common and three 26/12PO-specific official parents", () => {
    expect(officialItems).toHaveLength(9);
    expect(officialItems.filter((item) => item.scope === "common")).toHaveLength(6);
    expect(officialItems.filter((item) => item.scope === "specific-26-12po")).toHaveLength(3);
    expect(new Set(officialItems.map((item) => item.id)).size).toBe(9);
  });

  it("records the exact PRL and EBEP cut and does not expand it with adjacent laws", () => {
    const prl = officialItems.find((item) => item.sourceId === "PNI26-COMMON-02");
    expect(prl?.children.map((child) => child.title)).toEqual([
      "Exposición de motivos",
      "Capítulo I (artículos 1–4)",
      "Capítulo III (artículos 14–29)",
      "Capítulo V (artículos 33–40)",
    ]);
    expect(prl?.children.flatMap((child) => child.materialSourceIds)).not.toContain("RD 773/1997");

    const ebep = officialItems.find((item) => item.sourceId === "PNI26-COMMON-05");
    expect(ebep?.children).toHaveLength(1);
    expect(ebep?.children[0]?.sourceLocator).toContain("artículos 52–54");
  });

  it("limits the Declaration on the Network to chapters I and II", () => {
    const declaration = officialItems.find((item) => item.sourceId === "PNI26-COMMON-04");
    expect(declaration?.children.map((child) => child.title)).toEqual([
      "Capítulo I. Información general",
      "Capítulo II. Infraestructura",
    ]);
    expect(declaration?.rationale).toContain("31/07/2026");
    expect(declaration?.rationale).toContain("27/02/2026");
  });

  it("keeps previously identified adjacent topics outside the official denominator", () => {
    const supplementalIds = new Set(supplementalItems.map((item) => item.id));
    expect(supplementalIds).toContain("syllabus-constitucion");
    expect(supplementalIds).toContain("syllabus-epi");
    expect(supplementalIds).toContain("syllabus-en-50121");
    expect(supplementalIds).toContain("syllabus-psicometria");
    expect(supplementalIds).toContain("syllabus-ingles-a2");
    expect(getSyllabusCoverage().officialItemsTotal).toBe(9);
    expect(syllabusInventoryMeta.extractedItems).toBe(9);
  });

  it("pins each official parent and child to a verified source version and exact locator", () => {
    const refs = officialItems.flatMap((parent) => [
      { sourceId: parent.sourceId, sourceVersion: parent.sourceVersion, locator: parent.sourceLocator },
      ...parent.children.map((child) => ({
        sourceId: child.sourceId,
        sourceVersion: child.sourceVersion,
        locator: child.sourceLocator,
      })),
    ]);
    for (const ref of refs) {
      expect(ref.locator.trim()).not.toBe("");
      expect(
        sourceManifest.sources.find(
          (source) =>
            source.sourceId === ref.sourceId &&
            source.sourceVersion === ref.sourceVersion &&
            source.status === "verified",
        ),
      ).toBeDefined();
    }
  });

  it("keeps precise locators for the ICT Annex IV and all five RCF chapters", () => {
    const ict = officialItems.find((item) => item.sourceId === "PNI26-12PO-SPECIFIC-01");
    const annexIv = ict?.children.find((child) => child.id === "ict-anexo-iv");
    expect(annexIv?.sourceLocator).toContain("PDF p. 2 (índice) y p. 84");
    expect(annexIv?.sourceLocator).toContain("secciones 1–3");

    const rcf = officialItems.find((item) => item.sourceId === "PNI26-12PO-SPECIFIC-03");
    expect(rcf?.children).toHaveLength(5);
    for (const chapter of rcf?.children ?? []) {
      expect(chapter.sourceLocator).toContain("PDF p. 1 (índice)");
      expect(chapter.sourceLocator).toContain("capítulo");
    }
  });

  it("rejects duplicate IDs and missing official parents", () => {
    const duplicated = copyOfficialItems();
    duplicated[1]!.id = duplicated[0]!.id;
    expect(validateSyllabusCoverage(duplicated).some((error) => error.includes("Duplicate syllabus ID"))).toBe(true);

    const missingParent = copyOfficialItems().slice(1);
    expect(validateSyllabusCoverage(missingParent).some((error) => error.includes("missing official syllabus item"))).toBe(true);
  });

  it("rejects unknown material sources, missing modules and unverified source versions", () => {
    const invalid = copyOfficialItems();
    const child = invalid[0]!.children[0] as { materialSourceIds: string[]; linkedModules: string[]; sourceVersion: string };
    child.materialSourceIds = ["UNKNOWN-MATERIAL-SOURCE"];
    child.linkedModules = ["missing-module"];
    child.sourceVersion = "unverified-version";
    const errors = validateSyllabusCoverage(invalid);
    expect(errors.some((error) => error.includes("unknown material source"))).toBe(true);
    expect(errors.some((error) => error.includes("links to missing module"))).toBe(true);
    expect(errors.some((error) => error.includes("unknown source version"))).toBe(true);
  });

  it("rejects invalid status and missing exact locators", () => {
    const invalid = copyOfficialItems();
    const child = invalid[0]!.children[0] as { status: string; sourceLocator: string };
    child.status = "approved";
    child.sourceLocator = "  ";
    const errors = validateSyllabusCoverage(invalid);
    expect(errors.some((error) => error.includes("invalid status"))).toBe(true);
    expect(errors.some((error) => error.includes("exact sourceLocator"))).toBe(true);
  });

  it("keeps the inspected official inventory complete and validates without errors", () => {
    expect(syllabusInventoryMeta.sourceComplete).toBe(true);
    expect(syllabusInventoryMeta.unresolvedItems).toBe(0);
    expect(validateSyllabusCoverage(officialItems)).toEqual([]);
  });

  it("reports orphan course modules separately from official scope", () => {
    expect(getOrphanCourseModules([])).toContain("igualdad");
  });
});
