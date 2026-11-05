import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  crossCheckTraceability,
  sourceTraceability,
  sourceTraceabilitySchema,
  type ArtifactIntegrityEntry,
  type SourceTraceability,
} from "../lib/content/source-traceability";
import { sourceManifest } from "../lib/content/source-manifest";
import traceabilityJson from "../content/source-traceability.json";
import observationsJson from "../content/source-observations/latest.json";

const ledger: SourceTraceability = sourceTraceability;

type PendingEntry = Extract<ArtifactIntegrityEntry, { artifactIntegrity: "pending" }>;
type ConfirmedEntry = Extract<ArtifactIntegrityEntry, { artifactIntegrity: "confirmed" }>;

const pendingEntries = ledger.artifactIntegrity.filter(
  (entry): entry is PendingEntry => entry.artifactIntegrity === "pending",
);
const confirmedEntries = ledger.artifactIntegrity.filter(
  (entry): entry is ConfirmedEntry => entry.artifactIntegrity === "confirmed",
);

const observations = (
  observationsJson as {
    observations: Array<{ sourceId: string; sourceVersion: string; sha256?: string }>;
  }
).observations;

const identity = (sourceId: string, sourceVersion: string) => `${sourceId}\u0000${sourceVersion}`;

describe("source traceability ledger", () => {
  it("parses under a strict schema and resolves every recorded identity against the manifest", () => {
    expect(() => sourceTraceabilitySchema.parse(traceabilityJson)).not.toThrow();
    expect(crossCheckTraceability()).toEqual([]);
  });

  it("marks exactly the 11 discrepant BOE pages as pending WITHOUT downgrading academic status", () => {
    expect(pendingEntries).toHaveLength(11);
    expect(pendingEntries.every((entry) => entry.sourceVersion === "consolidated-page-2026-10-15")).toBe(true);
    expect(pendingEntries.every((entry) => entry.hashTarget === "downloaded-page")).toBe(true);
    expect(pendingEntries.every((entry) => entry.academicStatusAction === "unchanged")).toBe(true);
    expect(pendingEntries.every((entry) => entry.academicStatus === "verified")).toBe(true);
    expect(pendingEntries.every((entry) => entry.manifestSha256 !== entry.observedSha256)).toBe(true);

    for (const entry of pendingEntries) {
      const source = sourceManifest.sources.find(
        (item) => identity(item.sourceId, item.sourceVersion) === identity(entry.sourceId, entry.sourceVersion),
      );
      expect(source?.status, `${entry.sourceId} must stay academically verified`).toBe("verified");
      expect(source?.sha256).toBe(entry.manifestSha256);
    }
  });

  it("preserves the 9 adif-live classifications whose hashes agree", () => {
    const adifLive = confirmedEntries.filter((entry) => entry.sourceVersion === "adif-live-2026-10-15");
    expect(adifLive).toHaveLength(9);
    expect(adifLive.every((entry) => entry.academicStatus === "verified")).toBe(true);
    expect(adifLive.every((entry) => entry.academicStatusAction === "unchanged")).toBe(true);
    for (const entry of adifLive) {
      const source = sourceManifest.sources.find(
        (item) => identity(item.sourceId, item.sourceVersion) === identity(entry.sourceId, entry.sourceVersion),
      );
      expect(source?.status).toBe("verified");
      expect(source?.sha256).toBe(entry.sha256);
    }
  });

  it("has a record for every comparable manifest/observation pair, and no invented ones", () => {
    const comparable = observations
      .filter((observation) => observation.sha256)
      .map((observation) => identity(observation.sourceId, observation.sourceVersion))
      .filter((key) =>
        sourceManifest.sources.some((source) => identity(source.sourceId, source.sourceVersion) === key && source.sha256),
      );
    const recorded = new Set(ledger.artifactIntegrity.map((entry) => identity(entry.sourceId, entry.sourceVersion)));
    expect(comparable.length).toBeGreaterThan(0);
    expect(comparable.filter((key) => !recorded.has(key))).toEqual([]);
    expect(recorded.size).toBe(ledger.artifactIntegrity.length);
  });

  it("records literalness separately from artifact integrity", () => {
    const trebep = pendingEntries.find(
      (entry) => entry.sourceId === "TREBEP" && entry.sourceVersion === "consolidated-page-2026-10-15",
    );
    expect(trebep?.literalness).toBe("reverified");
    expect(trebep?.literalnessEvidence).toContain("53.12");
    expect(trebep?.recheck?.deterministicFetches).toBe(3);

    const otherPending = pendingEntries.filter((entry) => entry.sourceId !== "TREBEP");
    expect(otherPending).toHaveLength(10);
    expect(otherPending.every((entry) => entry.literalness === "not_rechecked")).toBe(true);
    expect(otherPending.every((entry) => !entry.literalnessEvidence && !entry.recheck)).toBe(true);
  });
});

describe("auxiliary ADIF-Alta Velocidad material", () => {
  it("records provenance of both files without versioning them", () => {
    expect(ledger.auxiliaryArtifacts).toHaveLength(2);
    expect(ledger.auxiliaryArtifacts.every((artifact) => artifact.versioned === false)).toBe(true);
    expect(ledger.auxiliaryArtifacts.every((artifact) => artifact.notVersionedReason.length > 0)).toBe(true);
    const pdf = ledger.auxiliaryArtifacts.find((artifact) => artifact.role === "auxiliary-corroboration");
    expect(pdf?.entity).toBe("ADIF-Alta Velocidad");
    expect(pdf?.edition).toBe("V.0 (ED 12/12/2025)");
    expect(pdf?.pageCount).toBe(457);
    expect(pdf?.supersedes).toEqual([]);
  });

  it("excludes both paths from the repository and keeps any local copy byte-identical", () => {
    const ignored = readFileSync(resolve(process.cwd(), ".gitignore"), "utf8");
    for (const artifact of ledger.auxiliaryArtifacts) {
      expect(ignored).toContain(artifact.path);
      // A fresh clone has neither file: provenance must still validate.
      const localPath = resolve(process.cwd(), artifact.path);
      if (existsSync(localPath)) {
        const bytes = readFileSync(localPath);
        expect(createHash("sha256").update(bytes).digest("hex")).toBe(artifact.sha256);
        expect(bytes.byteLength).toBe(artifact.sizeBytes);
      }
    }
  });

  it("keeps the ADIF V.0 ED 27/02/2026 identity pending and not superseded by the AV document", () => {
    expect(ledger.pendingSourceIdentities).toHaveLength(1);
    const adif = ledger.pendingSourceIdentities[0];
    expect(adif.entity).toBe("ADIF");
    expect(adif.edition).toBe("V.0 (ED 27/02/2026)");
    expect(adif.state).toBe("pending");
    expect(adif.notSupersededBy).toEqual(["dr-adif-av-2027-libro-pdf"]);
    const manifestEntry = sourceManifest.sources.find((source) => source.sourceVersion === adif.manifestVersion);
    expect(manifestEntry?.status).toBe(adif.manifestStatus);
    expect(manifestEntry?.sha256).toBe(adif.sha256);
  });
});

describe("ERTMS reconciliation", () => {
  it("records the 0,4 km gap as pending with no invented cause", () => {
    const discrepancy = ledger.openDiscrepancies.find((item) => item.id === "ertms-2027-national-total-gap");
    expect(discrepancy).toBeDefined();
    expect(discrepancy?.state).toBe("pending");
    expect(discrepancy?.causeDemonstrated).toBe(false);
    expect(discrepancy?.cause).toBeNull();
    expect(discrepancy?.notDemonstrated.length).toBeGreaterThan(0);
  });

  it("records the two different computation dates and rejects the rounding explanation", () => {
    const discrepancy = ledger.openDiscrepancies.find((item) => item.id === "ertms-2027-national-total-gap");
    const facts = JSON.stringify(discrepancy?.demonstratedFacts);
    expect(facts).toContain("1ª versión trimestral 2026");
    expect(facts).toContain("1 de enero 2026");
    expect(facts).toContain("4ª versión trimestral 2025");
    expect(facts).toContain("1 de octubre 2025");
    expect(JSON.stringify(discrepancy?.excludedExplanations)).toContain("Redondeo decimal");

    const status = readFileSync(resolve(process.cwd(), "ESTADO_DE_EJECUCION.md"), "utf8");
    expect(status).not.toMatch(/0,4 km[^.\n]*por redondeo/i);
    expect(status).toContain("pendiente");
  });
});

describe("observations fixture", () => {
  it("matches the observed hashes recorded for all 11 pending artifacts", () => {
    const index = new Map(observations.map((item) => [identity(item.sourceId, item.sourceVersion), item]));
    for (const entry of pendingEntries) {
      expect(index.get(identity(entry.sourceId, entry.sourceVersion))?.sha256).toBe(entry.observedSha256);
    }
  });
});
