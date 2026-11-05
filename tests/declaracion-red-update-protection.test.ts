import { describe, expect, it } from "vitest";

import { declaracionRed2027Theory } from "../content/theories/declaracion-red-2027";

describe("DR 2027, proceso de actualización (1.5.2)", () => {
  const source = declaracionRed2027Theory.sources.find(
    (item) => item.id === "dr-adif-2027-c1-152",
  );
  const claim = declaracionRed2027Theory.concepts
    .flatMap((concept) => concept.claims)
    .find((item) => item.id === "dr-c39-1");

  it("traza la regla a un localizador exacto del adjunto oficial I–II", () => {
    expect(source?.sourceUrl).toContain("adif.es/documents/20124/55031380/");
    expect(source?.sourceId).toBe("PNI26-COMMON-04");
    expect(source?.sourceVersion).toBe("adif-live-2026-10-15");
    expect(source?.locator).toBe("Capítulo I, apartado 1.5.2, Proceso de actualización (p. 25)");
    expect(source?.excerpt).toMatch(/no deben restringir la capacidad adjudicada/);
    expect(source?.excerpt).toMatch(/circunstancias extraordinarias acreditadas/);
    expect(source?.excerpt).toMatch(/consentimiento de los adjudicatarios afectados/);
    expect(source?.excerpt).toMatch(/actuaciones eventuales necesarias para la explotación/);
    expect(source?.excerpt).toMatch(/efectos desde su publicación/);
  });

  it("explica la regla, las excepciones y la publicidad especial sin elevar el estado editorial", () => {
    expect(claim?.legalBasis).toContain("dr-adif-2027-c1-152");
    expect(claim?.text).toMatch(/no puede restringir la capacidad ya adjudicada/);
    expect(claim?.text).toMatch(/circunstancias extraordinarias debidamente acreditadas/);
    expect(claim?.text).toMatch(/consienten los adjudicatarios afectados/);
    expect(claim?.text).toMatch(/actuación eventual necesaria para la explotación/);
    expect(claim?.text).toMatch(/ponerla a disposición de cualquier candidato/);
    expect(claim?.text).toMatch(/surten efecto desde su publicación/);
    expect(claim?.review?.status).toBe("needs_review");
  });
});
