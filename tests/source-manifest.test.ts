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
    expect(manifest.sources.filter((source) => source.scope === "common")).toHaveLength(6);
    expect(manifest.sources.filter((source) => source.scope === "specific-26-12po")).toHaveLength(3);
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
});
