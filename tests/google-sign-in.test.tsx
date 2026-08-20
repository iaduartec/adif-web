import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GoogleSignIn } from "../components/auth/google-sign-in";

const { createBrowserClient, getSupabaseOAuthAuthorizeUrl, signInWithOAuth } = vi.hoisted(() => {
  const signInWithOAuth = vi.fn();

  return {
    signInWithOAuth,
    createBrowserClient: vi.fn(() => ({ auth: { signInWithOAuth } })),
    getSupabaseOAuthAuthorizeUrl: vi.fn<() => string | null>(
      () => "https://example.supabase.co/auth/v1/authorize",
    ),
  };
});

vi.mock("../lib/supabase/browser", () => ({ createBrowserClient, getSupabaseOAuthAuthorizeUrl }));

describe("GoogleSignIn", () => {
  const onOAuthRedirect = vi.fn();

  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    signInWithOAuth.mockResolvedValue({
      data: { url: "https://example.supabase.co/auth/v1/authorize" },
      error: null,
    });
    window.history.replaceState({}, "", "/");
  });

  function renderGoogleSignIn() {
    return render(<GoogleSignIn onOAuthRedirect={onOAuthRedirect} />);
  }

  it("starts the Google OAuth flow and returns to the callback route", async () => {
    renderGoogleSignIn();

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    await waitFor(() => {
      expect(signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });
      expect(onOAuthRedirect).toHaveBeenCalledWith("https://example.supabase.co/auth/v1/authorize");
    });
  });

  it("preserves the requested protected route through the OAuth callback", async () => {
    window.history.replaceState({}, "", "/login?next=%2Fcurso");
    renderGoogleSignIn();

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    await waitFor(() => {
      expect(signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=%2Fcurso`,
          skipBrowserRedirect: true,
        },
      });
    });
  });

  it("shows an inline error when Google OAuth cannot start", async () => {
    signInWithOAuth.mockResolvedValue({ error: new Error("cancelled") });
    renderGoogleSignIn();

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No hemos podido iniciar sesión con Google. Inténtalo de nuevo.",
    );
    expect(onOAuthRedirect).not.toHaveBeenCalled();
  });

  it("shows an inline error when OAuth does not return a usable redirect URL", async () => {
    signInWithOAuth.mockResolvedValue({ data: { url: "not-a-url" }, error: null });
    renderGoogleSignIn();

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No hemos podido iniciar sesión con Google. Inténtalo de nuevo.",
    );
    expect(onOAuthRedirect).not.toHaveBeenCalled();
  });

  it("rejects an OAuth URL from another HTTPS origin without navigating", async () => {
    signInWithOAuth.mockResolvedValue({ data: { url: "https://attacker.example/auth/v1/authorize" }, error: null });
    renderGoogleSignIn();

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No hemos podido iniciar sesión con Google. Inténtalo de nuevo.",
    );
    expect(onOAuthRedirect).not.toHaveBeenCalled();
  });

  it("allows the local mock callback URL when no Supabase auth origin is configured", async () => {
    getSupabaseOAuthAuthorizeUrl.mockReturnValue(null);
    signInWithOAuth.mockResolvedValue({ data: { url: `${window.location.origin}/auth/callback` }, error: null });
    renderGoogleSignIn();

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    await waitFor(() => {
      expect(onOAuthRedirect).toHaveBeenCalledWith(`${window.location.origin}/auth/callback`);
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("explains an OAuth cancellation after returning to login", async () => {
    window.history.replaceState({}, "", "/login?error=oauth_cancelled");
    renderGoogleSignIn();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se ha completado el acceso con Google. Puedes intentarlo de nuevo.",
    );
  });
});
