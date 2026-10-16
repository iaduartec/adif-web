import { describe, expect, it } from "vitest";

import type { TheorySection } from "../content/theory-types";
import { sourceManifest } from "../lib/content/source-manifest";
import { validateTheoryClaims } from "../scripts/verify-theory-claims";

const primaryCe = sourceManifest.sources.find((source) => source.sourceId === "CE" && source.status === "verified")!;
const secondaryCem = sourceManifest.sources.find(
  (source) => source.sourceId === "PNI26-12PO-SPECIFIC-02" && source.status === "verified",
)!;

function section(options: {
  sourceId?: string;
  sourceVersion?: string;
  sourceUrl?: string;
  locator?: string;
  verifiedAt?: string;
  review?: unknown;
} = {}): Record<string, TheorySection> {
  const linkedVersion = sourceManifest.sources.find(
    (entry) => entry.sourceId === (options.sourceId ?? "CE") && entry.sourceVersion === (options.sourceVersion ?? primaryCe.sourceVersion),
  );
  const source = {
    id: "citation-1",
    sourceId: options.sourceId ?? "CE",
    sourceVersion: options.sourceVersion ?? primaryCe.sourceVersion,
    sourceTitle: "Constitución Española",
    sourceUrl: options.sourceUrl ?? primaryCe.url,
    locator: options.locator ?? "Artículo 14",
    verifiedAt: options.verifiedAt ?? linkedVersion?.verifiedAt ?? undefined,
  };
  const claim: Record<string, unknown> = {
    id: "claim-1",
    text: "El artículo 14 establece el principio de igualdad.",
    kind: "normative",
    legalBasis: ["citation-1"],
  };
  if (options.review !== undefined) claim.review = options.review;
  return {
    test: {
      introduction: [claim],
      concepts: [],
      examples: [],
      reviewTakeaways: [],
      sources: [source],
    } as unknown as TheorySection,
  };
}

const reviewedHighConfidence = {
  status: "reviewed",
  confidence: { level: "high", reason: "Contrastado con el texto consolidado vigente del BOE." },
  reviewedAt: "2026-10-15",
};

describe("claim provenance validation", () => {
  it("rejects a normative citation without a manifest source version", () => {
    const theories = section({ sourceVersion: "" });
    expect(validateTheoryClaims(theories).some((error) => error.includes("sourceVersion"))).toBe(true);
  });

  it("rejects an unknown source version", () => {
    const theories = section({ sourceVersion: "unknown-version" });
    expect(validateTheoryClaims(theories).some((error) => error.includes("sourceVersion"))).toBe(true);
  });

  it("rejects a normative citation without a precise locator", () => {
    const theories = section({ locator: " " });
    expect(validateTheoryClaims(theories).some((error) => error.includes("locator"))).toBe(true);
  });

  it("requires an explicit editorial confidence and reason for every claim", () => {
    expect(validateTheoryClaims(section()).some((error) => error.includes("confidence"))).toBe(true);
    expect(
      validateTheoryClaims(section({ review: { status: "needs_review", confidence: { level: "medium", reason: " " } } }))
        .some((error) => error.includes("reason")),
    ).toBe(true);
    expect(
      validateTheoryClaims(section({ review: { status: "needs_review", confidence: { level: "certain", reason: "Prueba." } } }))
        .some((error) => error.includes("invalid confidence level")),
    ).toBe(true);
  });

  it("rejects a normative claim supported only by a secondary CEM article", () => {
    const theories = section({
      sourceId: secondaryCem.sourceId,
      sourceVersion: secondaryCem.sourceVersion,
      sourceUrl: secondaryCem.url,
      locator: "p. 4, apartado 2",
      review: { status: "needs_review", confidence: { level: "low", reason: "Cita pendiente de cotejo." } },
    });
    expect(validateTheoryClaims(theories).some((error) => error.includes("primary"))).toBe(true);
  });

  it("does not permit a low-confidence claim to be marked reviewed", () => {
    const theories = section({
      review: { status: "reviewed", confidence: { level: "low", reason: "Sin verificación independiente." }, reviewedAt: "2026-10-15" },
    });
    expect(validateTheoryClaims(theories).some((error) => error.includes("high confidence"))).toBe(true);
  });

  it("rejects a reviewed claim when its source version is not verified", () => {
    const candidate = sourceManifest.sources.find((source) => source.sourceId === "DR 2027")!;
    const theories = section({
      sourceId: candidate.sourceId,
      sourceVersion: candidate.sourceVersion,
      sourceUrl: candidate.url,
      locator: "Capítulo I, apartado 1",
      review: reviewedHighConfidence,
    });
    expect(validateTheoryClaims(theories).some((error) => error.includes("verified primary"))).toBe(true);
  });

  it("rejects an impossible reviewedAt calendar date", () => {
    const theories = section({
      review: { ...reviewedHighConfidence, reviewedAt: "2026-99-99" },
    });
    expect(validateTheoryClaims(theories).some((error) => error.includes("valid reviewedAt date"))).toBe(true);
  });

  it("rejects verifiedAt metadata that disagrees with the linked manifest version", () => {
    const theories = section({ verifiedAt: "1900-01-01", review: reviewedHighConfidence });
    expect(validateTheoryClaims(theories).some((error) => error.includes("verifiedAt does not match"))).toBe(true);
  });

  it("accepts a high-confidence reviewed claim with a current primary citation", () => {
    const theories = section({ review: reviewedHighConfidence });
    expect(validateTheoryClaims(theories)).toEqual([]);
  });
});
