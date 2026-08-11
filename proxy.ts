import { type NextRequest, NextResponse } from "next/server";
import { resolveProtectedRoute } from "./lib/auth/redirect";
import { updateSession } from "./lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { response, user, onboardingComplete } = await updateSession(request);
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const redirect = resolveProtectedRoute(user, requestedPath, onboardingComplete);

  if (!redirect) {
    return response;
  }

  const redirectResponse = NextResponse.redirect(new URL(redirect, request.url));
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));

  return redirectResponse;
}

export const config = {
  matcher: ["/((?!_next/|.*\\.[^/]+$).*)"],
};
