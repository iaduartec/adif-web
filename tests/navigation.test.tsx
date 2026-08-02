import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardNavigation } from "../components/shell/dashboard-navigation";
import { MobileNavigation } from "../components/shell/mobile-navigation";
import { Sidebar } from "../components/shell/sidebar";
import { UserMenu } from "../components/shell/user-menu";

const { signOut, usePathname } = vi.hoisted(() => ({ signOut: vi.fn(), usePathname: vi.fn() }));

vi.mock("next/navigation", () => ({ usePathname }));
vi.mock("../lib/supabase/browser", () => ({ createBrowserClient: () => ({ auth: { signOut } }) }));

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
  afterEach(cleanup);

  beforeEach(() => {
    signOut.mockReset();
    usePathname.mockReset();
  });

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

  it("identifies Curso rather than Inicio when the current route is /curso", () => {
    usePathname.mockReturnValue("/curso");
    render(<><DashboardNavigation placement="sidebar" /><DashboardNavigation placement="mobile" /></>);
    fireEvent.click(screen.getByRole("button", { name: "Abrir navegación" }));

    const courseLinks = screen.getAllByRole("link", { name: "Curso" });
    const homeLinks = screen.getAllByRole("link", { name: "Inicio" });

    expect(courseLinks).toHaveLength(2);
    courseLinks.forEach((link) => expect(link).toHaveAttribute("aria-current", "page"));
    homeLinks.forEach((link) => expect(link).not.toHaveAttribute("aria-current"));
  });

  it("keeps an accessible account-menu trigger name on mobile", () => {
    render(<UserMenu profile={{ email: "ana@example.com", name: "Ana López" }} />);

    expect(screen.getByRole("button", { name: "Abrir menú de cuenta" })).toBeInTheDocument();
  });

  it("shows a retryable error instead of navigating away when sign-out fails", async () => {
    signOut.mockResolvedValue({ error: { message: "No se pudo cerrar la sesión" } });
    render(<UserMenu profile={{ email: "ana@example.com", name: "Ana López" }} />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú de cuenta" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Cerrar sesión" }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("No se pudo cerrar la sesión"));
    expect(screen.getByRole("menuitem", { name: "Cerrar sesión" })).toBeEnabled();
  });
});
