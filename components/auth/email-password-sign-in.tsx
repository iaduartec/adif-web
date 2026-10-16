"use client";

import { type FormEvent, useState } from "react";
import { getSafeRedirectPath } from "../../lib/auth/redirect";
import { createBrowserClient } from "../../lib/supabase/browser";
import { SUPABASE_CONFIG_ERROR } from "../../lib/supabase/config";
import { Button } from "../ui/button";

const unavailableMessage =
  process.env.NODE_ENV === "production"
    ? "El acceso no está disponible ahora mismo. Inténtalo más tarde."
    : "Falta configurar Supabase. Añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";

type Mode = "signin" | "signup";

type EmailPasswordSignInProps = {
  onAuthenticated?: (path: string) => void;
};

export function EmailPasswordSignIn({
  onAuthenticated = (path) => window.location.assign(path),
}: EmailPasswordSignInProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function switchMode() {
    setMode((current) => (current === "signin" ? "signup" : "signin"));
    setError(null);
    setNotice(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setPending(true);

    try {
      const supabase = createBrowserClient();
      const next =
        getSafeRedirectPath(new URLSearchParams(window.location.search).get("next")) ?? "/";

      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: new URL("/auth/callback", window.location.origin).toString(),
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (!data.session) {
          setNotice("Te enviamos un correo para confirmar tu cuenta. Revisá tu correo para activarla.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          throw signInError;
        }
      }

      onAuthenticated(next);
    } catch (caught) {
      if (caught instanceof Error && caught.message === SUPABASE_CONFIG_ERROR) {
        setError(unavailableMessage);
      } else {
        setError(
          mode === "signup"
            ? "No hemos podido crear la cuenta. Revisá los datos e inténtalo de nuevo."
            : "No hemos podido iniciar sesión. Revisá el correo y la contraseña.",
        );
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="auth-email">Correo electrónico</label>
        <input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="auth-password">Contraseña</label>
        <input
          id="auth-password"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Un momento…" : mode === "signup" ? "Crear cuenta" : "Iniciar sesión"}
      </Button>

      <button type="button" className="auth-form__switch" onClick={switchMode}>
        {mode === "signin" ? "¿No tenés cuenta? Creá una" : "¿Ya tenés cuenta? Iniciá sesión"}
      </button>

      {error ? (
        <p className="auth-form__message" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="auth-form__message" role="status">
          {notice}
        </p>
      ) : null}
    </form>
  );
}
