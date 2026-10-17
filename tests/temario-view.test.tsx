import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TemarioView } from "../components/temario/temario-view";
import { officialItems } from "../content/syllabus";

describe("TemarioView", () => {
  afterEach(cleanup);

  it("renders every official document exactly once", () => {
    render(<TemarioView />);

    expect(screen.getAllByRole("article")).toHaveLength(officialItems.length);

    for (const item of officialItems) {
      const article = document.querySelector(`[data-syllabus-item="${item.id}"]`);
      expect(article, `missing document ${item.id}`).not.toBeNull();
      expect(article?.textContent).toContain(item.title);
    }
  });

  it("groups documents under both official scopes", () => {
    render(<TemarioView />);

    expect(screen.getByRole("heading", { name: "Conocimiento Común" })).toBeVisible();
    expect(screen.getByRole("heading", { name: /Conocimiento Específico/ })).toBeVisible();

    const common = document.querySelectorAll('[data-scope="common"]');
    const specific = document.querySelectorAll('[data-scope="specific-26-12po"]');

    expect(common).toHaveLength(officialItems.filter((item) => item.scope === "common").length);
    expect(specific).toHaveLength(
      officialItems.filter((item) => item.scope === "specific-26-12po").length,
    );
  });

  it("lays out as a single full-width column, never as card columns", () => {
    const { container } = render(<TemarioView />);

    // The brief asks for full-screen reading rather than the two-up card grids
    // used elsewhere in the course reader.
    expect(container.querySelector(".md\\:grid-cols-2")).toBeNull();
    expect(container.querySelectorAll("[data-syllabus-item]")).toHaveLength(officialItems.length);
  });

  it("states that the common scope has no transcribed exam history", () => {
    render(<TemarioView />);

    const notice = screen.getByText(/no hay histórico de preguntas oficiales transcritas/i);
    expect(notice).toBeVisible();
    // Must not read as "never asked".
    expect(notice.textContent).toMatch(/no se interpreta como/i);
  });

  it("states the measured basis for the specific scope", () => {
    render(<TemarioView />);

    const notice = screen.getByText(/basada en las/i);
    expect(notice).toBeVisible();
    expect(notice.textContent).toMatch(/preguntas oficiales transcritas/i);
    expect(notice.textContent).toMatch(/PNI23\/01/);
    expect(notice.textContent).toMatch(/no una predicción/i);
  });

  it("marks recurrence on the concepts that actually appeared in exams", () => {
    render(<TemarioView />);

    const badges = document.querySelectorAll("[data-frequency-level]");
    expect(badges.length).toBeGreaterThan(0);

    // ict-concept-16 is the most repeated concept in the official bank.
    const top = document.querySelector('[data-concept-id="ict-concept-16"]');
    expect(top).not.toBeNull();
    expect(top?.getAttribute("data-frequency-level")).toBe("high");
    expect(top?.textContent).toMatch(/6 veces/);
  });

  it("shows a coverage status badge for every syllabus unit", () => {
    const { container } = render(<TemarioView />);

    const statusBadges = container.querySelectorAll("[data-node-status]");
    const totalUnits = officialItems.reduce((sum, item) => sum + item.children.length, 0);

    expect(statusBadges).toHaveLength(totalUnits);
  });

  it("links each document to its official PDF and to its study module", () => {
    render(<TemarioView />);

    const sourceLinks = screen.getAllByRole("link", { name: /Fuente oficial/ });
    expect(sourceLinks.length).toBeGreaterThan(0);
    for (const link of sourceLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
    }

    const moduleLinks = screen.getAllByRole("link", { name: /módulo de estudio completo/ });
    expect(moduleLinks.length).toBeGreaterThan(0);
    for (const link of moduleLinks) {
      expect(link.getAttribute("href")).toMatch(/^\/curso\/.+view=theory$/);
    }
  });

  it("offers a jump index covering every document", () => {
    render(<TemarioView />);

    const nav = screen.getByRole("navigation", { name: "Índice del temario" });
    const links = within(nav).getAllByRole("link");

    expect(links).toHaveLength(officialItems.length);
    for (const link of links) {
      expect(link.getAttribute("href")).toMatch(/^#doc-syllabus-/);
    }
  });

  it("exposes the document and unit counts in the header", () => {
    render(<TemarioView />);

    const totalUnits = officialItems.reduce((sum, item) => sum + item.children.length, 0);
    const header = screen.getByRole("heading", { name: "Temario oficial completo" }).closest("header");

    expect(header?.textContent).toContain(String(officialItems.length));
    expect(header?.textContent).toContain(String(totalUnits));
  });

  it("still renders CEM in full even though its syllabus nodes link no module", () => {
    // The CEM nodes legitimately carry no `linkedModules` in the manifest, but a
    // curated study module exists for it. Without the explicit fallback the whole
    // document would silently lose its summary, concepts and module link.
    render(<TemarioView />);

    const cem = document.querySelector('[data-syllabus-item="syllabus-compatibilidad-electromagnetica"]');
    expect(cem, "CEM document missing").not.toBeNull();
    expect(cem?.textContent).toContain("Conceptos clave");
    expect(cem?.querySelector('[data-concept-id="cem-concept-1"]')).not.toBeNull();
    expect(cem?.querySelector('a[href="/curso/compatibilidad-electromagnetica?view=theory"]')).not.toBeNull();
  });
});
