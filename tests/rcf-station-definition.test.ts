import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";

describe("RCF definition of station", () => {
  const theory = lessonTheories["rcf-libro-1"];
  const stationSource = theory.sources.find((source) => source.id === "rd664-2015-1-1-1-3");
  const stationClaim = theory.concepts
    .find((concept) => concept.id === "rcf-concept-3")
    ?.claims.find((claim) => claim.id === "rcf-c3-1");

  it("matches the full station definition and its exception in the BOE source excerpt", () => {
    expect(stationSource?.locator).toContain("1.1.1.3");
    expect(stationSource?.excerpt).toMatch(/instalación de vías y sus aparatos asociados/);
    expect(stationSource?.excerpt).toMatch(/PB, PBA, PCA, PAET y las Bifurcaciones/);
    expect(stationSource?.excerpt).toMatch(/Cambiadores de Ancho y las Bases de Mantenimiento/);
    expect(stationSource?.excerpt).toMatch(/cuando no estén integrados dentro de otra estación/);
    expect(stationSource?.excerpt).not.toContain("...");
  });

  it("teaches every included facility and the integration exception in accessible language", () => {
    expect(stationClaim?.legalBasis).toContain("rd664-2015-1-1-1-3");
    expect(stationClaim?.text).toMatch(/puestos de bloqueo \(PB\)/);
    expect(stationClaim?.text).toMatch(/puestos de banalización \(PBA\)/);
    expect(stationClaim?.text).toMatch(/puestos de cantonamiento \(PCA\)/);
    expect(stationClaim?.text).toMatch(/puestos de adelantamiento y estacionamiento de trenes \(PAET\)/);
    expect(stationClaim?.text).toMatch(/bifurcaciones/i);
    expect(stationClaim?.text).toMatch(/cambiadores de ancho y las bases de mantenimiento/);
    expect(stationClaim?.text).toMatch(/solo cuando no están integrados dentro de otra estación/);
  });
});
