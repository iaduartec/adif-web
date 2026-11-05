import { describe, expect, it } from "vitest";

import { declaracionRed2027Theory } from "../content/theories/declaracion-red-2027";

const source = (declaracionRed2027Theory.sources ?? []).find((item) => item.id === "dr-adif-2027-cap2-canon");
const rendered = JSON.stringify(declaracionRed2027Theory).toLowerCase();

/**
 * The preserved DR 2027 (V.0, ED 27/02/2026) contains no "canon de reserva de
 * capacidad" and no "canon de utilización". The chapter only says that the
 * tariffs are set by the infrastructure manager through a Reglamento approved by
 * its Consejo de Administración, published in the BOE and reproduced in the DR.
 */
describe("DR 2027 capacity charges", () => {
  it("does not attribute to the DR a charge taxonomy the document does not contain", () => {
    expect(rendered).not.toContain("canon de reserva");
    expect(rendered).not.toContain("canon de utilización");
  });

  it("describes the mechanism the DR actually states", () => {
    expect(source?.excerpt).toContain("Reglamento adoptado por su Consejo de Administración");
    expect(source?.excerpt).toContain("publicado en el Boletín Oficial del Estado");
    expect(source?.excerpt).toContain("sus valores se incluirán en la Declaración sobre la Red");
  });
});

/**
 * ADIF and ADIF-Alta Velocidad publish two separate Declaraciones sobre la Red
 * for 2027. The syllabus points at the ADIF one (chapters I and II), so the
 * theory must keep saying that ADIF-Alta Velocidad entrusts the management of
 * capacity, control, circulation and safety systems to ADIF, rather than
 * treating the two networks as a single one.
 */
describe("ADIF vs ADIF-Alta Velocidad", () => {
  it("keeps the entrustment between the two infrastructure managers explicit", () => {
    expect(rendered).toContain("adif-alta velocidad ha encomendado a adif");
  });

  it("attributes the electrified network to ADIF, not to the whole group", () => {
    expect(rendered).toContain("la red titularidad de adif cuenta con 6.761,6 km");
  });
});
