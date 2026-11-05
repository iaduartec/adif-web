import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FlashcardDeck } from "../components/cards/flashcard-deck";
import { flashcards } from "../content/flashcards";

vi.mock("../app/actions/favorites", () => ({ toggleFavoriteFlashcard: vi.fn() }));

describe("flashcard module filter", () => {
  it("permite estudiar un módulo presente aunque no figure en la lista fija", () => {
    render(<FlashcardDeck cards={[
      { id: "a", module: "G1 Igualdad", front: "Pregunta igualdad", back: "Respuesta igualdad" },
      { id: "b", module: "E4 Incompatibilidades", front: "Pregunta incompatibilidades", back: "Respuesta incompatibilidades" },
    ]} favoriteIds={new Set()} />);
    fireEvent.click(screen.getByRole("button", { name: "E4 Incompatibilidades" }));
    expect(screen.getByText("Pregunta incompatibilidades")).toBeVisible();
    expect(screen.queryByText("Pregunta igualdad")).not.toBeInTheDocument();
  });

  it("agrupa todas las fichas de la Declaración sobre la Red bajo un solo módulo", () => {
    const declaration = flashcards.filter((card) => /declaracion sobre la red/i.test(card.module));
    expect(declaration.length).toBeGreaterThan(16);
    expect(new Set(declaration.map((card) => card.module)).size).toBe(1);
  });
});
