import { expect, it } from "vitest";
import { ictTheory } from "../content/theories/ict-rd-346-2011";
import officialText from "../content/full-texts/ict-rd-346-2011.json";

it("includes the unbounded single-family exception in the RITU claim and cites Annex III 4.5.3", () => {
  const claim = ictTheory.concepts
    .find((concept) => concept.id === "ict-concept-8")!
    .claims.find((item) => item.id === "ict-c8-1")!;
  const source = ictTheory.sources.find(
    (item) => item.id === "rd346-2011-anex2-infrastructure",
  )!;

  expect(claim.text).toMatch(/hasta tres alturas y planta baja.*máximo de 16 PAU/i);
  expect(claim.text).toMatch(/conjuntos de viviendas unifamiliares sin límite de PAU/i);
  expect(claim.legalBasis).toContain(source.id);
  expect(source.locator).toContain("Anexo III, apartados 4.5.1–4.5.4");
  expect(source.excerpt).toMatch(/viviendas unifamiliares sin límite de PAU/i);

  const normalizedOfficialText = officialText.replace(/\s+/g, " ");
  expect(normalizedOfficialText).toContain(
    "se establece la posibilidad de construir un único recinto de instalaciones de telecomunicación (RITU), que acumule la funcionalidad de los dos descritos anteriormente (RITI y RITS)",
  );
  expect(normalizedOfficialText).toContain(
    "Para el caso de edificios o conjuntos inmobiliarios de hasta tres alturas y planta baja y un máximo de dieciséis PAU, y para conjuntos de viviendas unifamiliares (sin limitación en el n.º de PAU)",
  );
  expect(claim.text).toMatch(/construir un recinto único/i);
});
