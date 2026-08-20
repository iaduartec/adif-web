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
    expect(estatutoAdifTheory.sources).toHaveLength(57);
    expect(estatutoAdifTheory.concepts).toHaveLength(56);
  });
});
