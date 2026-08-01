import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "../app/(auth)/login/page";

describe("LoginPage", () => {
  it("offers the ADIF Telecomunicaciones Google sign-in", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: "Prepara ADIF Telecomunicaciones" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continuar con Google" }),
    ).toBeEnabled();
    expect(screen.getByText("no pertenece a ADIF")).toBeVisible();
  });
});
