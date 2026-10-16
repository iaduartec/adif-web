import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "../app/(auth)/login/page";

describe("LoginPage", () => {
  it("offers email and password sign-in", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: "Prepara ADIF Telecomunicaciones" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeVisible();
    expect(screen.getByLabelText("Contraseña")).toBeVisible();
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeEnabled();
    expect(screen.getByText("no pertenece a ADIF")).toBeVisible();
  });
});
