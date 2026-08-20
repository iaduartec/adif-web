import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { recordRecallReview } = vi.hoisted(() => ({ recordRecallReview: vi.fn() }));
vi.mock("../app/actions/reviews", () => ({ recordRecallReview }));

import { ReviewSession } from "../components/reviews/review-session";

const concepts = [
  {
    id: "concept-a",
    title: "Concepto A",
    lessonSlug: "lesson-a",
    claims: ["Primera afirmación auditada.", "Segunda afirmación auditada."],
    dueOn: "2026-08-10",
    status: "at_risk" as const,
  },
  {
    id: "concept-b",
    title: "Concepto B",
    lessonSlug: "lesson-b",
    claims: ["Respuesta B auditada."],
    dueOn: "2026-08-11",
    status: "review" as const,
  },
];

describe("review session", () => {
  beforeEach(() => {
    recordRecallReview.mockReset().mockResolvedValue({
      kind: "saved",
      dueOn: "2026-08-18",
      status: "review",
    });
    vi.stubGlobal("crypto", { randomUUID: vi.fn(() => "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f") });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("keeps audited claims hidden until reveal and exposes the exact theory anchor", () => {
    render(<ReviewSession concepts={concepts} />);

    expect(screen.getByRole("heading", { name: "Concepto A" })).toBeVisible();
    expect(screen.getByText("Explícalo con tus palabras")).toBeVisible();
    expect(screen.queryByText("Primera afirmación auditada.")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Consultar la teoría de Concepto A" })).toHaveAttribute(
      "href",
      "/curso/lesson-a?view=theory#concept-concept-a",
    );

    fireEvent.click(screen.getByRole("button", { name: "Mostrar respuesta" }));
    expect(screen.getByText("Primera afirmación auditada.")).toBeVisible();
    expect(screen.getByText("Segunda afirmación auditada.")).toBeVisible();
  });

  it("offers four ratings, shows persisted next-review feedback, and advances", async () => {
    render(<ReviewSession concepts={concepts} />);
    fireEvent.click(screen.getByRole("button", { name: "Mostrar respuesta" }));

    expect(screen.getAllByRole("button", { name: /^(0|1|2|3) ·/ })).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "2 · Lo recordé" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Próximo repaso: 2026-08-18");
    expect(screen.getByRole("status")).toHaveTextContent("En revisión");
    expect(recordRecallReview).toHaveBeenCalledWith(
      "concept-a",
      2,
      "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f",
    );
    fireEvent.click(screen.getByRole("button", { name: "Siguiente concepto" }));
    expect(screen.getByRole("heading", { name: "Concepto B" })).toBeVisible();
  });

  it("moves keyboard focus from reveal to ratings to next and then the following reveal", async () => {
    render(<ReviewSession concepts={concepts} />);
    const reveal = screen.getByRole("button", { name: "Mostrar respuesta" });
    reveal.focus();
    fireEvent.keyDown(reveal, { key: "Enter" });
    fireEvent.click(reveal);
    await waitFor(() => expect(screen.getByRole("button", { name: "0 · No lo recordaba" })).toHaveFocus());

    fireEvent.click(screen.getByRole("button", { name: "3 · Lo dominaba" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Siguiente concepto" })).toHaveFocus());
    fireEvent.click(screen.getByRole("button", { name: "Siguiente concepto" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Mostrar respuesta" })).toHaveFocus());
  });

  it("retains the exact uncertain payload for an accessible retry", async () => {
    recordRecallReview
      .mockResolvedValueOnce({ kind: "retryable" })
      .mockResolvedValueOnce({ kind: "saved", dueOn: "2026-08-13", status: "learning" });
    render(<ReviewSession concepts={concepts} />);
    fireEvent.click(screen.getByRole("button", { name: "Mostrar respuesta" }));
    fireEvent.click(screen.getByRole("button", { name: "1 · Me costó" }));

    const retry = await screen.findByRole("button", { name: "Reintentar guardado" });
    expect(screen.getByRole("alert")).toHaveTextContent(/no sabemos si se guardó/i);
    fireEvent.click(retry);
    await screen.findByRole("button", { name: "Siguiente concepto" });

    expect(recordRecallReview).toHaveBeenCalledTimes(2);
    expect(recordRecallReview.mock.calls[1]).toEqual(recordRecallReview.mock.calls[0]);
  });

  it("returns to the four ratings after a definitive validation rejection", async () => {
    recordRecallReview.mockResolvedValueOnce({ kind: "rejected" });
    render(<ReviewSession concepts={concepts} />);
    fireEvent.click(screen.getByRole("button", { name: "Mostrar respuesta" }));
    fireEvent.click(screen.getByRole("button", { name: "2 · Lo recordé" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/no se ha guardado/i);
    expect(screen.queryByRole("button", { name: "Reintentar guardado" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^(0|1|2|3) ·/ })).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "0 · No lo recordaba" }));
    expect(recordRecallReview).toHaveBeenCalledTimes(2);
  });
});
