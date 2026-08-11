"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "../../lib/supabase/browser";

export type UserProfile = { avatarUrl?: string; email?: string; name?: string };

function initials(name?: string, email?: string) {
  return (name?.trim() || email?.trim() || "Usuario")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase())
    .join("");
}

export function UserMenu({ profile }: { profile: UserProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const name = profile.name?.trim() || profile.email?.split("@")[0] || "Usuario";
  const accountInitials = initials(profile.name, profile.email);
  const showAvatar = profile.avatarUrl && failedAvatarUrl !== profile.avatarUrl;

  useEffect(() => {
    const avatar = avatarRef.current;
    if (profile.avatarUrl && avatar?.complete && avatar.naturalWidth === 0) {
      setFailedAvatarUrl(profile.avatarUrl);
    }
  }, [profile.avatarUrl]);

  async function signOut() {
    setIsSigningOut(true);
    setSignOutError(null);
    try {
      const { error } = await createBrowserClient().auth.signOut();
      if (error) {
        setSignOutError(error.message || "No se pudo cerrar la sesión. Inténtalo de nuevo.");
        return;
      }
      window.location.assign("/login");
    } catch {
      setSignOutError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="user-menu">
      <button className="user-menu-trigger" type="button" aria-label="Abrir menú de cuenta" aria-expanded={isOpen} aria-haspopup="menu" onClick={() => setIsOpen((open) => !open)}>
        {showAvatar ? (
          // Google profile image hosts are user-controlled and cannot be allowlisted at build time.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="user-avatar" src={profile.avatarUrl} alt="" onError={() => setFailedAvatarUrl(profile.avatarUrl ?? null)} ref={avatarRef} />
        ) : (
          <span
            aria-label={`Iniciales de ${name}: ${accountInitials}`}
            className="user-avatar user-avatar-fallback"
            role="img"
          >
            {accountInitials}
          </span>
        )}
        <span className="user-menu-label">{name}</span>
      </button>
      {isOpen ? (
        <div className="user-menu-popover" role="menu">
          <p className="user-menu-name">{name}</p>
          {profile.email ? <p className="user-menu-email">{profile.email}</p> : null}
          <Link className="user-menu-profile" href="/onboarding" role="menuitem">Editar preparación</Link>
          {signOutError ? <p className="user-menu-error" role="alert">{signOutError}</p> : null}
          <button className="user-menu-sign-out" type="button" role="menuitem" disabled={isSigningOut} onClick={() => void signOut()}>
            {isSigningOut ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
