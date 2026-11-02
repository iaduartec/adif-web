import { describe, expect, it } from "vitest";

import { flashcards } from "../content/flashcards";
import { lessonSummaries } from "../content/lesson-summaries";
import { lessonTheories } from "../content/lesson-theory";
import { officialItems } from "../content/syllabus";
import { sourceManifest } from "../lib/content/source-manifest";

const sourceVersion = "consolidated-page-2026-11-02";
const sourceUrl = "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292";
const articles = [1, 2, 3, 4] as const;

describe("PRL chapter I study unit", () => {
  it("teaches articles 1–4 with reviewed claims pinned to the current verified BOE capture", () => {
    const theory = lessonTheories["prevencion-riesgos-laborales"];
    const currentSource = sourceManifest.sources.find((source) =>
      source.sourceId === "Ley 31/1995" && source.sourceVersion === sourceVersion,
    );

    expect(currentSource).toMatchObject({
      sourceType: "primary",
      status: "verified",
      downloadedAt: "2026-11-02",
      verifiedAt: "2026-11-02",
      hashTarget: "downloaded-page",
      url: sourceUrl,
    });
    expect(currentSource?.sha256).toMatch(/^[a-f0-9]{64}$/);

    for (const article of articles) {
      const referenceId = `lprl-31-1995-art${article}`;
      const concept = theory.concepts.find((item) => item.id === `prl-concept-${14 + article}`);
      expect(concept, `missing concept for article ${article}`).toBeDefined();
      expect(concept?.claims.length).toBeGreaterThan(0);

      const reference = theory.sources.find((item) => item.id === referenceId);
      expect(reference).toMatchObject({
        sourceId: "Ley 31/1995",
        sourceVersion,
        verifiedAt: "2026-11-02",
        sourceUrl,
      });
      expect(reference?.locator).toMatch(new RegExp(`^Artículo ${article}(?:\\b|;)`));
      expect(concept?.claims.every((claim) => claim.legalBasis.includes(referenceId))).toBe(true);
      expect(concept?.claims.every((claim) => claim.review?.status === "reviewed")).toBe(true);
      expect(concept?.claims.every((claim) => claim.review?.reviewedAt === "2026-11-02")).toBe(true);

      const takeaway = theory.reviewTakeaways.find((claim) => claim.id === `prl-chapter-i-takeaway-art${article}`);
      expect(takeaway?.legalBasis).toContain(referenceId);
      expect(takeaway?.review?.status).toBe("reviewed");
      expect(flashcards.some((card) =>
        card.module === "G2 PRL" && new RegExp(`art(?:í|i)culo\\s+${article}`, "i").test(card.front),
      )).toBe(true);
    }
  });

  it("includes a concise four-article recall summary and a practical example", () => {
    const summary = lessonSummaries["prevencion-riesgos-laborales"];
    const theory = lessonTheories["prevencion-riesgos-laborales"];

    for (const article of articles) {
      expect(summary.keyFacts.some((fact) => new RegExp(`art(?:í|i)culo\\s+${article}`, "i").test(fact))).toBe(true);
    }
    expect(theory.examples.some((example) => example.id === "prl-capitulo-i-example-1")).toBe(true);
  });

  it("keeps chapter I partial while the current ADIF attachment remains inaccessible", () => {
    const parent = officialItems.find((item) => item.sourceId === "PNI26-COMMON-02");
    const chapter = parent?.children.find((item) => item.id === "prl-capitulo-i");

    expect(chapter).toMatchObject({
      status: "partial",
      materialSourceIds: ["Ley 31/1995"],
      linkedModules: ["prevencion-riesgos-laborales"],
    });
    expect(chapter?.rationale).toMatch(/403|current.*attachment|adjunto.*actual/i);
  });
});
