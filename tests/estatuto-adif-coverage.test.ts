import { describe, expect, it } from "vitest";

import { estatutoAdifOutline } from "../content/estatuto-adif-outline";
import { officialTexts } from "../content/official-texts";
import { estatutoAdifTheory } from "../content/theories/estatuto-adif";

describe("cobertura del Estatuto de ADIF", () => {
  it("mantiene las 44 disposiciones articuladas y las disposiciones del curso", () => {
    expect(estatutoAdifOutline).toHaveLength(55);
    expect(new Set(estatutoAdifOutline.map((item) => item.number)).size).toBe(55);
    expect(new Set(estatutoAdifOutline.map((item) => item.locator)).size).toBe(55);

    const articleNumbers = estatutoAdifOutline
      .filter((item) => /^Artículo \d+$/.test(item.number))
      .map((item) => Number(item.number.replace("Artículo ", "")));
    expect(articleNumbers).toEqual(Array.from({ length: 44 }, (_, index) => index + 1));
  });

  it("publica el mismo inventario en texto oficial y teoría", () => {
    const official = officialTexts["estatuto-adif"];
    expect(official.articles.map((article) => article.number)).toEqual(
      estatutoAdifOutline.map((item) => item.number),
    );
    expect(official.articles.find((article) => article.number === "Artículo 13")?.title).toBe(
      "Contratación",
    );
    expect(official.articles.find((article) => article.number === "Artículo 14")?.title).toBe(
      "Órganos de gobierno",
    );
    // Fuente adicional: la excepción de transporte tiene localizador propio 3.2.
    expect(estatutoAdifTheory.sources).toHaveLength(58);
    expect(estatutoAdifTheory.sources.find((source) => source.id === "rd2395-2004-art3-2")?.locator).toBe("Artículo 3.2");
    expect(estatutoAdifTheory.concepts).toHaveLength(62);
  });

  it("defines which control, circulation, and safety functions cannot be entrusted to third parties", () => {
    const claim = estatutoAdifTheory.concepts
      .flatMap((concept) => concept.claims)
      .find((item) => item.id.endsWith("-2") && item.legalBasis.includes("rd2395-2004-art11"));

    expect(claim?.text).toMatch(/eficacia del sistema y su plena fiabilidad/i);
  });

  it("distinguishes Council delegation limits from the President's urgent substitute power", () => {
    const claims = estatutoAdifTheory.concepts.flatMap((concept) => concept.claims);
    const delegation = claims.find((claim) => claim.id === "estatuto-c105-4");
    const urgency = claims.find((claim) => claim.id === "estatuto-c105-5");

    expect(delegation?.legalBasis).toContain("rd2395-2004-art17");
    expect(delegation?.text).toMatch(/a\), b\), d\), e\), f\), g\), i\), l\), m\), o\), p\) y r\)/);
    expect(delegation?.text).toMatch(/solo puede delegar en el Presidente y las Comisiones Delegadas/i);
    expect(delegation?.text).toMatch(/restantes órganos internos/i);
    expect(delegation?.text).toMatch(/declaración contemplada en la letra n\) no es delegable/i);
    expect(urgency?.legalBasis).toContain("rd2395-2004-art24");
    expect(urgency?.text).toMatch(/urgente necesidad/i);
    expect(urgency?.text).toMatch(/primera reunión ordinaria posterior/i);
    expect(urgency?.text).toMatch(/ratifique/i);
  });
});
