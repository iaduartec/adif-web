import { expect, it } from "vitest";
import { lessonTheories } from "../content/lesson-theory";

it("covers the Annex III RITU and RITU-A eligibility conditions and design constraints", () => {
  const theory = lessonTheories["ict-rd-346-2011"]!;
  const concept = theory.concepts.find((item) => item.id === "ict-concept-62")!;
  const ritu = concept.claims.find((item) => item.id === "ict-c62-1")!;
  const rituA = concept.claims.find((item) => item.id === "ict-c62-2")!;
  const dimensions = concept.claims.find((item) => item.id === "ict-c62-3")!;

  expect(ritu.text).toMatch(/hasta tres alturas y planta baja.*16 PAU/i);
  expect(ritu.text).toMatch(/viviendas unifamiliares sin límite de PAU/i);
  expect(rituA.text).toMatch(/más de tres alturas y planta baja.*16 PAU/i);
  expect(rituA.text).toMatch(/17 y 30 PAU sin límite de alturas/i);
  expect(rituA.text).toMatch(/anchura accesible doble/i);
  expect(rituA.text).toMatch(/mantener las demás dimensiones/i);
  expect(rituA.text).toMatch(/donde se ubicaría cualquiera de ellos/i);
  expect(ritu.legalBasis).toContain("rd346-2011-anex2-infrastructure");
  expect(rituA.legalBasis).toContain("rd346-2011-anex2-infrastructure");
  expect(rituA.legalBasis).toContain("rd346-2011-anex3-ritu-options");
  expect(dimensions.text).toMatch(/2\.000 × 2\.000 × 500 mm/);
  expect(dimensions.text).toMatch(/17–20 PAU[\s\S]*21–30 PAU/);
  expect(dimensions.text).toMatch(/modificar anchura y altura[\s\S]*superficie accesible y la profundidad mínima/i);
  expect(dimensions.legalBasis).toContain("rd346-2011-anex3-rit-dimensions");

  const dimensionsSource = theory.sources.find((source) => source.id === "rd346-2011-anex3-rit-dimensions")!;
  expect(dimensionsSource.locator).toBe("Anexo III, apartado 5.5.1");
  expect(dimensionsSource.excerpt).toMatch(/edificios con planta baja y más de tres alturas/i);

  const optionsSource = theory.sources.find((source) => source.id === "rd346-2011-anex3-ritu-options")!;
  expect(optionsSource.locator).toBe("Anexo III, apartado 4.5.3");
  const edgeCase = theory.examples.find((item) => item.id === "ict-ex-1")!;
  expect(edgeCase.situation).toMatch(/cuatro alturas más planta baja.*8 PAU/i);
  expect(edgeCase.application[0].text).toMatch(/2\.000 × 2\.000 × 500 mm/);
  expect(edgeCase.application[0].legalBasis).toContain("rd346-2011-anex3-rit-dimensions");
  expect(edgeCase.application[0].legalBasis).toContain("rd346-2011-anex3-ritu-options");

  const example = theory.examples.find((item) => item.id === "ict-ex-7")!;
  expect(example.application).toHaveLength(2);
  expect(example.application[0].text).toMatch(/16 PAU.*17 y 30 PAU/i);
  expect(example.application[1].text).toMatch(/unifamiliares.*sin límite de PAU/i);
});
