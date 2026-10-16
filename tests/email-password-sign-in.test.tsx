import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmailPasswordSignIn } from "../components/auth/email-password-sign-in";
import { SUPABASE_CONFIG_ERROR } from "../lib/supabase/config";

const { createBrowserClient, signInWithPassword, signUp } = vi.hoisted(() => {
  const signInWithPassword = vi.fn();
  const signUp = vi.fn();

  return {
    signInWithPassword,
    signUp,
    createBrowserClient: vi.fn(() => ({ auth: { signInWithPassword, signUp } })),
  };
});

vi.mock("../lib/supabase/browser", () => ({ createBrowserClient }));

describe("EmailPasswordSignIn", () => {
  const onAuthenticated = vi.fn();

  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    signInWithPassword.mockResolvedValue({ data: { session: { access_token: "token" } }, error: null });
    signUp.mockResolvedValue({ data: { session: { access_token: "token" } }, error: null });
    window.history.replaceState({}, "", "/login");
  });

  function renderForm() {
    return render(<EmailPasswordSignIn onAuthenticated={onAuthenticated} />);
  }

  function fillCredentials() {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "alumno@example.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "secreto123" } });
  }

  it("signs in with email and password and returns to the requested route", async () => {
    window.history.replaceState({}, "", "/login?next=%2Fcurso");
    renderForm();

    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: "alumno@example.com",
        password: "secreto123",
      });
      expect(onAuthenticated).toHaveBeenCalledWith("/curso");
    });
  });

  it("falls back to the dashboard when no safe next route is present", async () => {
    renderForm();

    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    await waitFor(() => {
      expect(onAuthenticated).toHaveBeenCalledWith("/");
    });
  });

  it("creates an account and continues when a session is returned", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: "¿No tenés cuenta? Creá una" }));
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        email: "alumno@example.com",
        password: "secreto123",
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      expect(onAuthenticated).toHaveBeenCalledWith("/");
    });
  });

  it("asks the user to confirm the email when sign-up returns no session", async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: null });
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: "¿No tenés cuenta? Creá una" }));
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Te enviamos un correo para confirmar");
    expect(onAuthenticated).not.toHaveBeenCalled();
  });

  it("shows an inline error when the credentials are rejected", async () => {
    signInWithPassword.mockResolvedValue({ error: new Error("Invalid login credentials") });
    renderForm();

    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No hemos podido iniciar sesión. Revisá el correo y la contraseña.",
    );
    expect(onAuthenticated).not.toHaveBeenCalled();
  });

  it("explains that access is unavailable when Supabase is not configured", async () => {
    signInWithPassword.mockRejectedValue(new Error(SUPABASE_CONFIG_ERROR));
    renderForm();

    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Falta configurar Supabase");
    expect(onAuthenticated).not.toHaveBeenCalled();
  });

  it("toggles between sign-in and sign-up", () => {
    renderForm();

    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "¿No tenés cuenta? Creá una" }));
    expect(screen.getByRole("button", { name: "Crear cuenta" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "¿Ya tenés cuenta? Iniciá sesión" }));
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeInTheDocument();
  });
});
