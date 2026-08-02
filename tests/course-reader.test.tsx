import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { saveNote } = vi.hoisted(() => ({ saveNote: vi.fn() }));

vi.mock("../app/actions/lesson", () => ({ saveNote }));

import { LessonNotes } from "../components/course/lesson-notes";
import { OriginLabel } from "../components/course/origin-label";

describe("course reader provenance and notes", () => {
  afterEach(cleanup);

  beforeEach(() => {
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
});
