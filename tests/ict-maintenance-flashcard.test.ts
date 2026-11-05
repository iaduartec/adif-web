import { describe, expect, it } from "vitest";
import { flashcards } from "../content/flashcards";

describe("ficha de mantenimiento de ICT", () => {
  it("distingue las responsabilidades y no inventa inspecciones periódicas", () => {
    const card = flashcards.find(({ id }) => id === "ict-fc-21");

    expect(card).toBeDefined();
    expect(card?.back).toContain("operador");
    expect(card?.back).toContain("art. 5.1");
    expect(card?.back).toContain("punto de terminación de red");
    expect(card?.back).toContain("propiedad del edificio");
    expect(card?.back).toContain("PAU");
    expect(card?.back).toContain("Ley de Propiedad Horizontal");
    expect(card?.back).toContain("Ley de Arrendamientos Urbanos");
    expect(card?.back).toContain("arrendatario");
    expect(card?.back).toContain("orientativo");
    expect(card?.back).toContain("no impone por sí mismo inspecciones periódicas");
  });
});
