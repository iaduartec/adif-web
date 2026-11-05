import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { igualdadSummary } from "../content/summaries/igualdad";

const boeText = readFileSync(
  resolve(process.cwd(), "pdf/txt/1. Ley Orgánica 3_2007, de 22 de marzo, para la igualdad efectiva de mujeres y hombres.txt"),
  "utf8",
).replace(/\s+/g, " ");

describe("resumen de planes de igualdad, art. 45 LO 3/2007", () => {
  it("incluye los tres supuestos de obligación que contiene el texto oficial local", () => {
    const article45Start = boeText.lastIndexOf("Artículo 45.");
    const article45 = boeText.slice(article45Start, boeText.indexOf("Artículo 46.", article45Start));
    const keyFact = igualdadSummary.keyFacts.find((fact) => fact.startsWith("Planes de igualdad (Art. 45)"))!;

    expect(article45).toContain("empresas de cincuenta o más trabajadores");
    expect(article45).toContain("cuando así se establezca en el convenio colectivo que sea aplicable");
    expect(article45).toContain("en un procedimiento sancionador la sustitución de las sanciones accesorias");
    expect(keyFact).toMatch(/cincuenta o más trabajadores/i);
    expect(keyFact).toMatch(/convenio colectivo aplicable/i);
    expect(keyFact).toMatch(/procedimiento sancionador.*sustituir las sanciones accesorias/i);
  });
});
