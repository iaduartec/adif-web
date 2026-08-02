"use client";

import { useState } from "react";
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
  const name = profile.name?.trim() || profile.email?.split("@")[0] || "Usuario";

  async function signOut() {
    setIsSigningOut(true);
    try {
      await createBrowserClient().auth.signOut();
      window.location.assign("/login");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="user-menu">
      <button className="user-menu-trigger" type="button" aria-expanded={isOpen} aria-haspopup="menu" onClick={() => setIsOpen((open) => !open)}>
        {profile.avatarUrl ? (
          // Google profile image hosts are user-controlled and cannot be allowlisted at build time.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="user-avatar" src={profile.avatarUrl} alt="" />
        ) : <span className="user-avatar user-avatar-fallback" aria-hidden="true">{initials(profile.name, profile.email)}</span>}
        <span className="user-menu-label">{name}</span>
      </button>
      {isOpen ? (
        <div className="user-menu-popover" role="menu">
          <p className="user-menu-name">{name}</p>
          {profile.email ? <p className="user-menu-email">{profile.email}</p> : null}
          <button className="user-menu-sign-out" type="button" role="menuitem" disabled={isSigningOut} onClick={() => void signOut()}>
            {isSigningOut ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
