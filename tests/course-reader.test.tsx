import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { saveLessonProgress, saveNote } = vi.hoisted(() => ({ saveLessonProgress: vi.fn(), saveNote: vi.fn() }));

vi.mock("../app/actions/lesson", () => ({ saveLessonProgress, saveNote }));

import { LessonNotes } from "../components/course/lesson-notes";
import { LessonReader } from "../components/course/lesson-reader";
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
        <OriginLabel origin="verification_pending" />
      </>,
    );

    expect(screen.getByText("Referencia oficial")).toBeVisible();
    expect(screen.getByText("Explicación didáctica original")).toBeVisible();
    expect(screen.getByText("Pendiente de cotejo 2026")).toBeVisible();
    expect(container.querySelectorAll("[data-origin-label]")).toHaveLength(3);
  });

  it("saves the entered note for the lesson and confirms only after success", async () => {
    saveNote.mockResolvedValue({ ok: true });
    render(<LessonNotes slug="igualdad" initialBody="" />);

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
    render(<LessonReader lesson={getLesson("igualdad")!} progress={10} questions={[]} />);

    fireEvent.click(screen.getByRole("button", { name: "Marcar como completada" }));

    await waitFor(() => expect(saveLessonProgress).toHaveBeenCalledWith("igualdad", 100));
    expect(await screen.findByText("Curso · 100% completado")).toBeVisible();
    expect(screen.getByRole("button", { name: "Lección completada" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Lección completada");
  });

  it("keeps completion retryable and reports the server error when saving fails", async () => {
    saveLessonProgress.mockRejectedValue(new Error("No se ha podido guardar el progreso."));
    render(<LessonReader lesson={getLesson("igualdad")!} progress={10} questions={[]} />);

    fireEvent.click(screen.getByRole("button", { name: "Marcar como completada" }));

    await waitFor(() => expect(saveLessonProgress).toHaveBeenCalledWith("igualdad", 100));
    expect(await screen.findByRole("status")).toHaveTextContent("No se ha podido guardar el progreso.");
    expect(screen.getByText("Curso · 10% completado")).toBeVisible();
    expect(screen.getByRole("button", { name: "Marcar como completada" })).toBeEnabled();
  });

  it("allows switching to the integrated official text tab when clicking the consult button", () => {
    render(<LessonReader lesson={getLesson("igualdad")!} progress={0} questions={[]} />);

    fireEvent.click(screen.getByRole("button", { name: "Teoría y Práctica" }));

    // Initially we see the study guide explanation
    expect(screen.getByText("Explicación y Enfoque Didáctico")).toBeVisible();

    // Click on the button to check official text
    const buttons = screen.getAllByRole("button", { name: /Consultar temario original/i });
    fireEvent.click(buttons[0]);

    // Now the active tab should switch to Official Text
    expect(screen.getByRole("button", { name: /Temario Original/i })).toBeVisible();
    expect(screen.getByPlaceholderText(/Buscar artículos/i)).toBeVisible();
  });
});
