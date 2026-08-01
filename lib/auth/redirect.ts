type AuthUser = { id: string } | null;

const publicAuthRoutes = new Set(["/login", "/auth/callback"]);

export function resolveProtectedRoute(user: AuthUser, pathname: string): string | null {
  if (user || publicAuthRoutes.has(pathname.split("?")[0])) {
    return null;
  }

  return `/login?next=${encodeURIComponent(pathname)}`;
}

export function getSafeRedirectPath(next: string | null): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return null;
  }

  return next;
}
