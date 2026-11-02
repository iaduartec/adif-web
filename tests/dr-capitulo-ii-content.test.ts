import { describe, expect, it } from "vitest";
import { declaracionRed2027Theory } from "../content/theories/declaracion-red-2027";

describe("DR cap. II content", () => {
  it("includes source for cap. II", () => {
    const source = declaracionRed2027Theory.sources.find((s) => s.id === "dr-adif-2027-cap2");
    expect(source?.locator).toMatch(/Capítulo II/);
    expect(source?.excerpt).toMatch(/infraestructura ferroviaria/i);
  });
  it("teaches infrastructure composition", () => {
    const concept = declaracionRed2027Theory.concepts.find((c) => c.id === "dr-cap2-infraestructura-ferroviaria");
    expect(concept).toBeDefined();
    expect(concept!.claims[0].text).toMatch(/Ley del Sector Ferroviario/i);
  });
  it("teaches three track gauges", () => {
    const concept = declaracionRed2027Theory.concepts.find((c) => c.id === "dr-cap2-red-gestionada-adif");
    expect(concept).toBeDefined();
    expect(concept!.claims[0].text).toMatch(/tres anchos/i);
  });
});
