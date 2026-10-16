type AuthUser = { id: string } | null;

const publicAuthRoutes = new Set(["/login", "/auth/callback"]);

export function resolveProtectedRoute(
  user: AuthUser,
  pathname: string,
  onboardingComplete = true,
): string | null {
  const route = pathname.split("?")[0];
  if (publicAuthRoutes.has(route)) {
    return null;
  }

  if (user && !onboardingComplete && route !== "/onboarding" && route !== "/api/test/onboarding") {
    return `/onboarding?next=${encodeURIComponent(pathname)}`;
  }

  if (user) return null;

  return `/login?next=${encodeURIComponent(pathname)}`;
}

export function getSafeRedirectPath(next: string | null): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return null;
  }

  // WHATWG URL parsing strips C0 control characters and DEL, so a value like
  // "/\t/attacker.example" would otherwise resolve to a protocol-relative,
  // off-origin destination. Reject them before they reach the redirect.
  if (/[\u0000-\u001f\u007f]/.test(next)) {
    return null;
  }

  return next;
}
