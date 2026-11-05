import { expect, it } from "vitest";
import { cemTheory } from "../content/theories/compatibilidad-electromagnetica";

it("distinguishes ADIF's assignment from the independently published REE article", () => {
  const source = cemTheory.sources.find((item) => item.id === "cem-ree-2015")!;
  const assignment = cemTheory.introduction.find((item) => item.id === "cem-intro-4")!;

  expect(source.sourceUrl).toContain("adif.es/documents/");
  expect(source.locator).toMatch(/mayo de 2015.*80–86/);
  expect(source.excerpt).toContain("https://www.redeweb.com/ficheros/articulos/cemdal_870487183.pdf");
  expect(source.excerpt).toMatch(/no demuestra identidad binaria/i);
  expect(source.excerpt).toMatch(/secundario e histórico/i);
  expect(assignment.text).toMatch(/publicación editorial independiente/i);
  expect(assignment.text).toContain("https://www.redeweb.com/ficheros/articulos/cemdal_870487183.pdf");
  expect(assignment.text).toMatch(/no acredita identidad binaria/i);
  expect(assignment.legalBasis).toEqual(["cem-ree-2015"]);
  expect(assignment.review?.status).toBe("needs_review");

  const concepts = new Map(cemTheory.concepts.map((concept) => [concept.id, concept]));
  const converterSwitching = concepts.get("cem-concept-20")!.claims.find((claim) => claim.id === "cem-c20-1")!;
  const converterTiming = concepts.get("cem-concept-20")!.claims.find((claim) => claim.id === "cem-c20-2")!;
  const filters = concepts.get("cem-concept-24")!.claims.find((claim) => claim.id === "cem-c24-1")!;
  const railwayStandards = concepts.get("cem-concept-26")!.claims.find((claim) => claim.id === "cem-c26-2")!;
  const takeaway = cemTheory.reviewTakeaways.find((item) => item.id === "cem-takeaway-4")!;

  expect(converterSwitching.text).toMatch(/interpretación del contexto.*formulación del artículo.*ambigua/i);
  expect(converterTiming.text).toMatch(/cambio entre sistemas de alimentación.*nanosegundos/i);
  expect(converterTiming.text).toMatch(/no demuestra.*conmutación de los convertidores/i);
  expect(filters.text).toMatch(/no como obligación legal ni regla universal/i);
  expect(railwayStandards.text).toMatch(/descripción histórica.*edición ni los requisitos vigentes/i);
  expect(takeaway.text).toMatch(/publicación editorial independiente/i);
  expect(takeaway.text).toMatch(/no acredita identidad binaria/i);
});
