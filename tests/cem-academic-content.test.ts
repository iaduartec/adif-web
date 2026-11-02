import { describe, expect, it } from "vitest";
import { cemTheory } from "../content/theories/compatibilidad-electromagnetica";

describe("CEM legal definitions and scope", () => {
  it("distinguishes the directive's definitions of compatibility and immunity", () => {
    const compatibility = cemTheory.sources.find((source) => source.id === "dir-cem-definition");
    const immunity = cemTheory.sources.find((source) => source.id === "dir-immunity-definition");
    expect(compatibility?.locator).toMatch(/3.*4/);
    expect(immunity?.locator).toMatch(/3.*6/);
    expect(compatibility?.excerpt).not.toMatch(/sin sufrir.*degradaci[oó]n/i);
    expect(immunity?.excerpt).toMatch(/degradaci[oó]n/i);
  });

  it("does not teach that the directive applies to every electronic device", () => {
    const claims = cemTheory.concepts.flatMap((concept) => concept.claims.map((claim) => claim.text));
    expect(claims.join(" ")).not.toMatch(/aplicable a todos los equipos electr[oó]nicos/i);
  });

  it("teaches a cited exclusion from the directive", () => {
    const source = cemTheory.sources.find((item) => item.id === "dir-cem-scope");
    const scope = cemTheory.concepts.find((concept) => concept.id === "cem-scope");
    expect(source?.locator).toMatch(/2.*2.*a/i);
    expect(scope?.claims.some((claim) => /radioel[eé]ctricos/i.test(claim.text) && claim.legalBasis.includes("dir-cem-scope"))).toBe(true);
  });
});

it("does not teach the repealed CEM transposition in the recall card", async () => {
  const { flashcards } = await import("../content/flashcards");
  const card = flashcards.find((item) => item.id === "F0014");
  expect(card?.back).toContain("186/2016");
  expect(card?.back).not.toContain("1580/2006");
  expect(card?.back).not.toMatch(/acredita/i);
});

it("does not present an unverified measurement distance as a universal rule", () => {
  const measurement = cemTheory.concepts.find((concept) => concept.id === "cem-concept-5");
  expect(measurement?.claims.map((claim) => claim.text).join(" ")).not.toMatch(/10 metros.*cuasi-pico/i);
  expect(measurement?.claims.map((claim) => claim.text).join(" ")).toMatch(/pendiente.*verific/i);
});

it("does not describe the original directive publication as a consolidated text", async () => {
  const { sourceManifest } = await import("../lib/content/source-manifest");
  const source = sourceManifest.sources.find((item) => item.sourceId === "Directiva 2014/30/UE");
  expect(source?.consultedLocator).toMatch(/texto original/i);
  expect(source?.consultedLocator).not.toMatch(/página consolidada/i);
});

it("does not insert the essential-requirement qualification into the legal immunity definition", () => {
  const immunity = cemTheory.sources.find((source) => source.id === "dir-immunity-definition");
  const claim = cemTheory.concepts.find((concept) => concept.id === "cem-immunity")?.claims[0];
  expect(immunity?.excerpt).not.toMatch(/degradaci[oó]n inaceptable/i);
  expect(claim?.text).not.toMatch(/degradaci[oó]n inaceptable/i);
});
