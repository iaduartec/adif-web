import { describe, expect, it } from "vitest";
import practice from "../content/original-practice/general-knowledge.json";
import { flashcards } from "../content/flashcards";
import { ictTheory } from "../content/theories/ict-rd-346-2011";
import { estatutoAdifTheory } from "../content/theories/estatuto-adif";
import { cemTheory } from "../content/theories/compatibilidad-electromagnetica";
import { codigoConductaTheory } from "../content/theories/codigo-conducta";
import telecomPractice from "../content/original-practice/telecom.json";

describe("regresiones académicas cotejadas contra BOE", () => {
  it("mantiene la excepción del art. 3.2 del Estatuto en teoría y tarjeta", () => {
    const claim = estatutoAdifTheory.concepts.find((item) => item.id === "estatuto-concept-103")!.claims.find((item) => item.id === "estatuto-c103-3")!;
    expect(claim.text).toMatch(/salvo los inherentes a su propia actividad/i);
    expect(claim.legalBasis).toContain("rd2395-2004-art3-2");
    expect(flashcards.find((item) => item.id === "estatuto-fc-5")!.back).toMatch(/salvo el inherente a su propia actividad/i);
  });

  it("distingue COFDM de QPSK y cita el apartado aplicable", () => {
    const claim = ictTheory.concepts.find((item) => item.id === "ict-concept-45")!.claims[0]!;
    expect(claim.text).toContain("47–70 dBμV para COFDM-TV");
    expect(claim.text).toContain("47–77 dBμV para QPSK-TV");
    expect(claim.legalBasis).toContain("rd346-2011-anex1-niveles");
    expect(flashcards.find((item) => item.id === "ict-fc-14")!.back).toContain("47–70 dBμV para COFDM-TV");
  });

  it("conserva la excepción para canalización interior y no universaliza la ITE", () => {
    const separation = ictTheory.concepts.find((item) => item.id === "ict-concept-52")!.claims[0]!;
    expect(separation.text).toMatch(/interior de usuario.*30 mm.*ambos casos/i);
    expect(separation.legalBasis).toContain("rd346-2011-anex3-separacion");
    const inspection = ictTheory.concepts.find((item) => item.id === "ict-concept-49")!.claims[0]!;
    expect(inspection.text).toMatch(/no debe tomarse.*plazo universal vigente/i);
    expect(inspection.review?.status).toBe("needs_review");
  });

  it("no atribuye la enumeración del art. 52 a la reforma de 2023 ni le añade una sanción", () => {
    const six = practice.find((item) => item.id === "orig-gen-conducta-006")!;
    const eight = practice.find((item) => item.id === "orig-gen-conducta-008")!;
    expect(`${six.prompt} ${six.explanation}`).not.toMatch(/Ley 4\/2023/);
    expect(six.options.find((option) => option.key === six.answer)?.text).toMatch(/quince/i);
    expect(eight.options.find((option) => option.key === eight.answer)?.text).toMatch(/informan la interpretación y aplicación/i);
    expect(eight.explanation).toMatch(/no establece por sí mismo.*sanción/i);
  });

  it("explica la aplicación del Código al personal laboral sin convertir sus principios en sanciones", () => {
    const scope = codigoConductaTheory.concepts.find((item) => item.id === "conducta-concept-7")!.claims[0]!;
    const discipline = codigoConductaTheory.concepts.find((item) => item.id === "conducta-concept-6")!.claims.find((item) => item.id === "conducta-c6-2")!;
    expect(scope.text).toMatch(/personal laboral.*aplicables los deberes y principios del Código/i);
    expect(scope.legalBasis).toEqual(expect.arrayContaining(["rdleg-5-2015-art2", "rdleg-5-2015-art7", "rd2395-2004-art27-contexto"]));
    expect(discipline.text).toMatch(/artículo 52 no tipifica por sí mismo una falta ni determina una sanción/i);
    expect(discipline.legalBasis).toContain("rdleg-5-2015-art93-94");
  });

  it("atribuye las obligaciones del fabricante CEM a los arts. 7 y 17", () => {
    const claim = cemTheory.concepts.find((item) => item.id === "cem-concept-15")!.claims[0]!;
    const locators = claim.legalBasis.map((id) => cemTheory.sources.find((source) => source.id === id)?.locator);
    expect(locators).toEqual(expect.arrayContaining(["Artículo 7", "Artículo 17"]));
    expect(locators).not.toContain("Artículo 5");
  });

  it("does not present historical CEM article claims as current universal requirements", () => {
    const takeaways = new Map(cemTheory.reviewTakeaways.map((item) => [item.id, item]));
    expect(takeaways.get("cem-takeaway-4")!.text).toMatch(/no como valores generales ni datos vigentes/i);
    expect(takeaways.get("cem-takeaway-5")!.review?.status).toBe("needs_review");
    expect(takeaways.get("cem-takeaway-5")!.text).toMatch(/edición aplicable/i);
    expect(takeaways.get("cem-takeaway-6")!.text).not.toMatch(/no es retroactiva|autorización de funcionamiento/i);
    expect(takeaways.get("cem-takeaway-7")!.text).toMatch(/no son una lista universal de obligaciones/i);
  });

  it("keeps CEM scope, directive publication date, and railway examples conditional", () => {
    const oldDirective = cemTheory.concepts.find((item) => item.id === "cem-concept-25")!.claims.find((item) => item.id === "cem-c25-1")!;
    const scope = cemTheory.concepts.find((item) => item.id === "cem-concept-26")!.claims.find((item) => item.id === "cem-c26-1")!;
    const intro = cemTheory.introduction.find((item) => item.id === "cem-intro-1")!;
    const stalledAcceptance = cemTheory.examples.find((item) => item.id === "cem-ex-2")!.application[0]!;
    expect(oldDirective.legalBasis).toContain("dir-2004-108-ce");
    expect(oldDirective.text).toMatch(/15 de diciembre de 2004.*publicó.*31 de diciembre de 2004/i);
    expect(oldDirective.text).not.toMatch(/todos los ferrocarriles/i);
    expect(scope.text).toMatch(/equipos comprendidos en su ámbito/i);
    expect(intro.text).toMatch(/La inmunidad es un concepto distinto/i);
    expect(stalledAcceptance.text).not.toMatch(/es necesario.*antes de su aceptación/i);
    expect(cemTheory.examples.find((item) => item.id === "cem-ex-3")!.application[0]!.text).not.toMatch(/exigen/i);
    expect(cemTheory.examples.find((item) => item.id === "cem-ex-4")!.application[0]!.text).toMatch(/edición y aplicabilidad deben comprobarse/i);
  });

  it("ubica la pregunta de invalidación de marcha en el capítulo 5", () => {
    const question = telecomPractice.find((item) => item.id === "orig-tel-rcf-023")!;
    expect(question.topicId).toBe("rcf-capitulo-5");
    expect(question.syllabusNodeId).toBe("rcf-capitulo-5");
    expect(question.sourceLocator).toContain("Capítulo 5, 1.5.1.9");
    expect(question.options.find((option) => option.key === question.answer)?.text).toContain("cuando proceda");
  });
});
