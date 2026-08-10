import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { saveLessonProgress, saveNote } = vi.hoisted(() => ({ saveLessonProgress: vi.fn(), saveNote: vi.fn() }));

vi.mock("../app/actions/lesson", () => ({ saveLessonProgress, saveNote }));

import { CourseNotes } from "../components/course/course-notes";
import { CourseTheoryReader } from "../components/course/course-theory-reader";
import { OriginLabel } from "../components/course/origin-label";
import { getLesson } from "../lib/content/repository";

describe("course reader provenance and notes", () => {
  afterEach(cleanup);

  beforeEach(() => {
    saveLessonProgress.mockReset();
    saveNote.mockReset();
  });

  it("makes the source status legible without relying on colour", () => {
    const { container } = render(
      <>
        <OriginLabel origin="official_reference" />
        <OriginLabel origin="original_explanation" />
      </>,
    );

    expect(screen.getByText("Referencia oficial")).toBeVisible();
    expect(screen.getByText("Explicación didáctica original")).toBeVisible();
    expect(container.querySelectorAll("[data-origin-label]")).toHaveLength(2);
  });

  it("saves the entered note for the lesson and confirms only after success", async () => {
    saveNote.mockResolvedValue({ ok: true });
    render(<CourseNotes slug="igualdad" initialBody="" />);

    const input = screen.getByRole("textbox", { name: "Tus notas" });
    fireEvent.change(input, { target: { value: "Repasar la discriminación indirecta." } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar nota" }));

    await waitFor(() => {
      expect(saveNote).toHaveBeenCalledWith("igualdad", "Repasar la discriminación indirecta.");
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Nota guardada");
  });

  it("updates the visible progress and disables completion after the server save succeeds", async () => {
    saveLessonProgress.mockResolvedValue({ ok: true });
    render(await CourseTheoryReader({ lesson: getLesson("igualdad")!, progress: 10 }));

    fireEvent.click(screen.getByRole("button", { name: "Marcar como completada" }));

    await waitFor(() => expect(saveLessonProgress).toHaveBeenCalledWith("igualdad", 100));
    expect(await screen.findByText("Curso · 100% completado")).toBeVisible();
    expect(screen.getByRole("button", { name: "Lección completada" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Lección completada");
  });

  it("keeps completion retryable and reports the server error when saving fails", async () => {
    saveLessonProgress.mockRejectedValue(new Error("No se ha podido guardar el progreso."));
    render(await CourseTheoryReader({ lesson: getLesson("igualdad")!, progress: 10 }));

    fireEvent.click(screen.getByRole("button", { name: "Marcar como completada" }));

    await waitFor(() => expect(saveLessonProgress).toHaveBeenCalledWith("igualdad", 100));
    expect(await screen.findByRole("status")).toHaveTextContent("No se ha podido guardar el progreso.");
    expect(screen.getByText("Curso · 10% completado")).toBeVisible();
    expect(screen.getByRole("button", { name: "Marcar como completada" })).toBeEnabled();
  });

  it("uses server links to select the integrated official text without a client-side corpus", async () => {
    render(await CourseTheoryReader({ lesson: getLesson("igualdad")!, progress: 0, view: "theory" }));

    expect(screen.getByText("Explicación y Enfoque Didáctico")).toBeVisible();
    const links = screen.getAllByRole("link", { name: /Consultar temario original/i });
    expect(links[0]).toHaveAttribute("href", "/curso/igualdad?view=official");
  });

  it("preserves practical examples, review takeaways, and exam-error guidance in the server theory view", async () => {
    render(await CourseTheoryReader({ lesson: getLesson("igualdad")!, progress: 0, view: "theory" }));

    expect(screen.getByRole("heading", { name: "Supuestos Prácticos Tipo Test" })).toBeVisible();
    expect(screen.getByText(/un puesto operativo se establece una prueba de esfuerzo físico/i)).toBeVisible();
    expect(screen.getByRole("heading", { name: "Reglas Nemotécnicas y Tips" })).toBeVisible();
    expect(screen.getByText(/no admite justificación ordinaria/i)).toBeVisible();
    expect(screen.getByRole("heading", { name: "Errores frecuentes en examen" })).toBeVisible();
  });

  it("labels claims in study language without exposing internal ids or kind names", async () => {
    const { container } = render(await CourseTheoryReader({ lesson: getLesson("igualdad")!, progress: 0, view: "theory" }));

    expect(container.querySelectorAll("[data-claim-kind]").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /^Norma · /i }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Explicación").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Consejo de examen").length).toBeGreaterThan(0);
    expect(screen.queryByText("normative")).toBeNull();
    expect(screen.queryByText("interpretative")).toBeNull();
    expect(screen.queryByText("didactic")).toBeNull();
    expect(screen.queryByText(/lo3-2007-art6-2/)).toBeNull();
    expect(screen.getAllByRole("link", { name: /LO 3\/2007 · Artículo 6\.2/i }).length).toBeGreaterThan(0);
  });
});
