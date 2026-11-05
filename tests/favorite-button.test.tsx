import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FavoriteButton } from "../components/practice/favorite-button";

afterEach(cleanup);

describe("FavoriteButton", () => {
  it("does not offer a favorite action for a withheld official question", () => {
    render(<FavoriteButton disabled initialIsFavorite={false} questionId="ADIF-2023-1433-Q01" />);
    expect(screen.getByRole("button", { name: "Favorito no disponible para pregunta retenida" })).toBeDisabled();
  });
});
