import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  parseConvocationRecord,
  parseSourceManifest,
  validateSourceReference,
} from "../lib/content/source-manifest";

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), "utf8"));
}

const manifest = parseSourceManifest(readJson("content/source-manifest.json"));
const convocation = parseConvocationRecord(
  readJson("content/convocation/PNI26-01.json"),
  manifest,
);

describe("versioned official source manifest", () => {
  it("contains six common and three 26/12PO official sources", () => {
    expect(
      new Set(
        manifest.sources
          .filter((source) => source.scope === "common" && source.sourceId.startsWith("PNI26-COMMON-"))
          .map((source) => source.sourceId),
      ).size,
    ).toBe(6);
    expect(
      new Set(
        manifest.sources
          .filter((source) => source.scope === "specific-26-12po" && source.sourceId.startsWith("PNI26-12PO-SPECIFIC-"))
          .map((source) => source.sourceId),
      ).size,
    ).toBe(3);
  });

  it("preserves old ADIF snapshots and records the nine reviewed live PDFs", () => {
    const syllabusIds = [
      "PNI26-COMMON-01",
      "PNI26-COMMON-02",
      "PNI26-COMMON-03",
      "PNI26-COMMON-04",
      "PNI26-COMMON-05",
      "PNI26-COMMON-06",
      "PNI26-12PO-SPECIFIC-01",
      "PNI26-12PO-SPECIFIC-02",
      "PNI26-12PO-SPECIFIC-03",
    ];

    for (const sourceId of syllabusIds) {
      const versions = manifest.sources.filter((source) => source.sourceId === sourceId);
      expect(versions.some((source) => source.hashTarget === "local-snapshot")).toBe(true);
      expect(
        versions.some(
          (source) =>
            source.status === "verified" &&
            source.hashTarget === "downloaded-file" &&
            source.sourceVersion === "adif-live-2026-10-15",
        ),
      ).toBe(true);
    }
  });

  it("records the current 2027 network declaration PDF independently of the older PNI attachment", () => {
    expect(
      manifest.sources.find(
        (source) => source.sourceId === "DR 2027 Libro 2027" && source.status === "verified",
      ),
    ).toMatchObject({
      sourceVersion: "edition-2027-2026-07-31",
      scope: "common",
      hashTarget: "downloaded-file",
    });
  });

  it("classifies the ADIF-linked CEM article as secondary material", () => {
    expect(
      manifest.sources.find(
        (source) => source.sourceId === "PNI26-12PO-SPECIFIC-02" && source.sourceVersion === "adif-live-2026-10-15",
      ),
    ).toMatchObject({
      sourceType: "secondary",
      authority: "B",
      purpose: expect.stringContaining("no se deben tratar sus afirmaciones técnicas como normativa de ADIF"),
    });
  });

  it("stores authority, consulted locator, and a reasoned confidence for every source", () => {
    for (const source of manifest.sources) {
      expect(source.organization.trim()).not.toBe("");
      expect(source.consultedLocator.trim()).not.toBe("");
      expect(source.editorialConfidence.reason.trim()).not.toBe("");
    }
  });

  it("rejects a verified source version without a SHA-256 hash", () => {
    const source = manifest.sources.find((entry) => entry.status === "verified");
    expect(source).toBeDefined();
    const invalid = {
      schemaVersion: manifest.schemaVersion,
      sources: manifest.sources.map((entry) =>
        entry.sourceId === source?.sourceId && entry.sourceVersion === source.sourceVersion
          ? { ...entry, sha256: null }
          : entry,
      ),
    };

    expect(() => parseSourceManifest(invalid)).toThrow(/sha.?256/i);
  });

  it("rejects duplicate source versions", () => {
    const first = manifest.sources[0];
    expect(first).toBeDefined();
    expect(() =>
      parseSourceManifest({
        schemaVersion: manifest.schemaVersion,
        generatedAt: manifest.generatedAt,
        sources: [...manifest.sources, first],
      }),
    ).toThrow(/duplicate/i);
  });

  it("resolves a theory reference to exactly one manifest version", () => {
    expect(
      validateSourceReference({
        sourceId: "Ley 31/1995",
        sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      }),
    ).toEqual([]);
    expect(
      validateSourceReference({
        sourceId: "Ley 31/1995",
        sourceVersion: "unknown-version",
        sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      }).join(" "),
    ).toMatch(/version/i);
    expect(
      validateSourceReference({
        sourceId: "not-in-manifest",
        sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      }).join(" "),
    ).toMatch(/manifest/i);
    expect(
      validateSourceReference({
        sourceId: "Ley 31/1995",
        sourceVersion: "",
        sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      }).join(" "),
    ).toMatch(/version/i);
  });

  it("keeps a superseded primary capture while resolving legacy references to the current version", () => {
    const ley53Versions = manifest.sources.filter((source) => source.sourceId === "Ley 53/1984");
    expect(ley53Versions.map((source) => source.status).sort()).toEqual(["superseded", "verified"]);
    expect(
      validateSourceReference({
        sourceId: "Ley 53/1984",
        sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      }),
    ).toEqual([]);
    expect(
      validateSourceReference({
        sourceId: "Ley 53/1984",
        sourceVersion: "consolidated-page-2026-10-15-earlier-capture",
        sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      }),
    ).toEqual([]);
  });

  it("records the latest official notice without promoting provisional facts", () => {
    expect(convocation.asOf).toBe("2026-10-14");
    expect(convocation.facts.examDate).toMatchObject({
      value: "2026-12-12",
      status: "provisional",
    });
    expect(convocation.facts.sites).toMatchObject({
      value: ["Barcelona", "León", "Madrid", "Sevilla"],
      status: "announced",
    });
    expect(convocation.facts.positionsByProfile["26/12PO"]).toMatchObject({
      value: 57,
      status: "unverified",
      evidence: null,
    });
  });

  it("rejects a call fact promoted to confirmed without verified primary evidence", () => {
    const raw = readJson("content/convocation/PNI26-01.json") as Record<string, unknown>;
    const facts = raw.facts as Record<string, unknown>;
    const positions = facts.positionsByProfile as Record<string, Record<string, unknown>>;

    const invalid = {
      ...raw,
      facts: {
        ...facts,
        positionsByProfile: {
          ...positions,
          "26/12PO": { ...positions["26/12PO"], status: "confirmed" },
        },
      },
    };

    expect(() => parseConvocationRecord(invalid, manifest)).toThrow(/evidence|verified/i);
  });

  it("rejects confirmed call facts backed by a non-ADIF primary source", () => {
    const notice = manifest.sources.find((source) => source.sourceId === "ADIF PNI26/01");
    expect(notice).toBeDefined();
    const otherPrimaryCallSource = {
      ...notice!,
      sourceId: "Other agency call notice",
      sourceVersion: "2026-current",
      organization: "Example Agency",
      url: "https://example.com/call-notice",
      status: "verified",
      downloadedAt: "2026-10-14",
      verifiedAt: "2026-10-14",
      sha256: "a".repeat(64),
      hashTarget: "downloaded-page",
    };
    const manifestWithOtherPrimary = parseSourceManifest({
      ...manifest,
      sources: [...manifest.sources, otherPrimaryCallSource],
    });
    const raw = readJson("content/convocation/PNI26-01.json") as Record<string, unknown>;
    const facts = raw.facts as Record<string, unknown>;
    const positions = facts.positionsByProfile as Record<string, Record<string, unknown>>;

    const invalid = {
      ...raw,
      facts: {
        ...facts,
        positionsByProfile: {
          ...positions,
          "26/12PO": {
            ...positions["26/12PO"],
            status: "confirmed",
            evidence: {
              sourceId: "Other agency call notice",
              sourceVersion: "2026-current",
              locator: "Call notice → profile allocation",
            },
          },
        },
      },
    };

    expect(() => parseConvocationRecord(invalid, manifestWithOtherPrimary)).toThrow(/ADIF/i);
  });
});
