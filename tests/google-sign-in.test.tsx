import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GoogleSignIn } from "../components/auth/google-sign-in";

const { createBrowserClient, signInWithOAuth } = vi.hoisted(() => {
  const signInWithOAuth = vi.fn();

  return {
    signInWithOAuth,
    createBrowserClient: vi.fn(() => ({ auth: { signInWithOAuth } })),
  };
});

vi.mock("../lib/supabase/browser", () => ({ createBrowserClient }));

describe("GoogleSignIn", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    signInWithOAuth.mockResolvedValue({ error: null });
    window.history.replaceState({}, "", "/");
  });

  it("starts the Google OAuth flow and returns to the callback route", async () => {
    render(<GoogleSignIn />);

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    await waitFor(() => {
      expect(signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    });
  });

  it("preserves the requested protected route through the OAuth callback", async () => {
    window.history.replaceState({}, "", "/login?next=%2Fcurso");
    render(<GoogleSignIn />);

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    await waitFor(() => {
      expect(signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=%2Fcurso` },
      });
    });
  });

  it("shows an inline error when Google OAuth cannot start", async () => {
    signInWithOAuth.mockResolvedValue({ error: new Error("cancelled") });
    render(<GoogleSignIn />);

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No hemos podido iniciar sesión con Google. Inténtalo de nuevo.",
    );
  });
});
