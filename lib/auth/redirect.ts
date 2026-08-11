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

  return next;
}
