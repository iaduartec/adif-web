import { describe, expect, it } from "vitest";
import { rcfLibro1Theory } from "../content/theories/rcf-libro-1";

describe("RCF cap. 3 content", () => {
  it("includes source for distribution of documents", () => {
    const source = rcfLibro1Theory.sources.find((s) => s.id === "rd664-2015-1-3-1-1");
    expect(source?.locator).toMatch(/1\.3\.1\.1/);
    expect(source?.excerpt).toMatch(/publicidad y difusión/i);
    expect(source?.excerpt).toMatch(/acusar recibo/i);
  });

  it("includes source for service tools", () => {
    const source = rcfLibro1Theory.sources.find((s) => s.id === "rd664-2015-1-3-1-2");
    expect(source?.locator).toMatch(/1\.3\.1\.2/);
    expect(source?.excerpt).toMatch(/útiles de servicio/i);
  });

  it("teaches distribution obligations", () => {
    const concept = rcfLibro1Theory.concepts.find((c) => c.id === "rcf-cap3-distribucion-documentos");
    expect(concept).toBeDefined();
    const texts = concept!.claims.map((cl) => cl.text).join(" ");
    expect(texts).toMatch(/publicidad y difusión/i);
    expect(texts).toMatch(/actualización y distribución/i);
    expect(texts).toMatch(/acusar recibo/i);
  });

  it("teaches service tools", () => {
    const concept = rcfLibro1Theory.concepts.find((c) => c.id === "rcf-cap3-utiles-servicio");
    expect(concept).toBeDefined();
    expect(concept!.claims[0].text).toMatch(/útiles de servicio/i);
  });
});
