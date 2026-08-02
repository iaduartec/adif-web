import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MobileNavigation } from "../components/shell/mobile-navigation";
import { Sidebar } from "../components/shell/sidebar";

const requiredDestinations = [
  ["Inicio", "/"],
  ["Curso", "/curso"],
  ["Tests", "/tests"],
  ["Simulacros", "/simulacros"],
  ["Psicotécnicos", "/psicotecnicos"],
  ["Inglés A2", "/ingles-a2"],
  ["Fichas", "/fichas"],
  ["Cuaderno de errores", "/errores"],
  ["Estadísticas", "/estadisticas"],
] as const;

describe("authenticated navigation", () => {
  it("exposes every study destination and identifies the current page", () => {
    render(<Sidebar currentPath="/tests" />);

    for (const [label, href] of requiredDestinations) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    }

    expect(screen.getByRole("link", { name: "Tests" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });

  it("opens the mobile navigation from a labelled trigger and returns focus after Escape", () => {
    render(<MobileNavigation currentPath="/curso" />);

    const trigger = screen.getByRole("button", { name: "Abrir navegación" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: "Navegación principal" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cerrar navegación" })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("dialog", { name: "Navegación principal" }), { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Navegación principal" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
