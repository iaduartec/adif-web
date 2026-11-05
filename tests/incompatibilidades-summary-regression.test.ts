import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { incompatibilidadesSummary } from "../content/summaries/incompatibilidades";

const boeText = JSON.parse(
  readFileSync(resolve(process.cwd(), "content/full-texts/incompatibilidades.json"), "utf8"),
) as string;
const normalizedBoeText = boeText.replace(/\s+/g, " ");

describe("resumen de incompatibilidades cotejado con el BOE local", () => {
  it("distingue segundo puesto público, compatibilidad privada y actividades exceptuadas", () => {
    expect(normalizedBoeText).toContain("no podrá compatibilizar sus actividades con el desempeño");
    expect(normalizedBoeText).toContain("requerirá el previo reconocimiento de compatibilidad");
    expect(normalizedBoeText).toContain("Quedan exceptuadas del régimen de incompatibilidades");

    expect(incompatibilidadesSummary.keyFacts[0]).toMatch(/segundo puesto o actividad públicos/i);
    expect(incompatibilidadesSummary.keyFacts[2]).toMatch(/actividades privadas.*reconocimiento previo/i);
    expect(incompatibilidadesSummary.keyFacts[2]).toMatch(/excepciones del art\. 19/i);
    expect(incompatibilidadesSummary.overview).not.toMatch(/prohibición general.*actividad.*privad/i);
    expect(incompatibilidadesSummary.keyFacts[2]).not.toMatch(/cualquier segunda actividad/i);
  });

  it("no convierte la regla de cargos en contratistas en prohibición de cualquier servicio", () => {
    expect(normalizedBoeText).toContain("El desempeño, por sí o por persona interpuesta, de cargos de todo orden");
    const privateSection = incompatibilidadesSummary.sections.find(
      (section) => section.title === "Compatibilidad en el Sector Privado",
    )!;

    expect(privateSection.points.join(" ")).toMatch(/artículo 12\.1\.c.*desempeñar cargos/i);
    expect(privateSection.points.join(" ")).not.toMatch(/prohíbe.*prestar servicios.*contratistas/i);
  });
});
