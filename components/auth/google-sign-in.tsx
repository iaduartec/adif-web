"use client";

import { useState } from "react";
import { getSafeRedirectPath } from "../../lib/auth/redirect";
import { createBrowserClient, getSupabaseOAuthAuthorizeUrl } from "../../lib/supabase/browser";
import { Button } from "../ui/button";

const unavailableMessage =
  process.env.NODE_ENV === "production"
    ? "El acceso no está disponible ahora mismo. Inténtalo más tarde."
    : "Falta configurar Supabase. Añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.";

function getInitialError() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("error") === "oauth_cancelled"
    ? "No se ha completado el acceso con Google. Puedes intentarlo de nuevo."
    : null;
}

function hasUsableOAuthRedirectUrl(url: unknown, expectedAuthorizeUrl: string | null) {
  if (typeof url !== "string") {
    return false;
  }

  try {
    const redirectUrl = new URL(url);

    if (!expectedAuthorizeUrl) {
      return (
        (redirectUrl.protocol === "https:" || redirectUrl.protocol === "http:") &&
        redirectUrl.origin === window.location.origin &&
        redirectUrl.pathname === "/auth/callback" &&
        !redirectUrl.username &&
        !redirectUrl.password
      );
    }

    const expectedUrl = new URL(expectedAuthorizeUrl);

    return (
      (redirectUrl.protocol === "https:" || redirectUrl.protocol === "http:") &&
      redirectUrl.protocol === expectedUrl.protocol &&
      redirectUrl.origin === expectedUrl.origin &&
      redirectUrl.pathname === expectedUrl.pathname &&
      !redirectUrl.username &&
      !redirectUrl.password
    );
  } catch {
    return false;
  }
}

type GoogleSignInProps = {
  onOAuthRedirect?: (url: string) => void;
};

export function GoogleSignIn({ onOAuthRedirect = (url) => window.location.assign(url) }: GoogleSignInProps) {
  const [error, setError] = useState<string | null>(getInitialError);

  async function handleSignIn() {
    setError(null);

    try {
      const supabase = createBrowserClient();
      const expectedAuthorizeUrl = getSupabaseOAuthAuthorizeUrl();
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      const next = getSafeRedirectPath(new URLSearchParams(window.location.search).get("next"));

      if (next) {
        callbackUrl.searchParams.set("next", next);
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl.toString(), skipBrowserRedirect: true },
      });

      if (error) {
        throw error;
      }

      if (!hasUsableOAuthRedirectUrl(data?.url, expectedAuthorizeUrl)) {
        throw new Error("OAuth did not return a usable redirect URL.");
      }

      onOAuthRedirect(data.url);
    } catch (error) {
      setError(
        error instanceof Error && error.message === "Supabase public configuration is unavailable."
          ? unavailableMessage
          : "No hemos podido iniciar sesión con Google. Inténtalo de nuevo.",
      );
    }
  }

  return (
    <div>
      <Button onClick={handleSignIn}>Continuar con Google</Button>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
