import { type NextRequest, NextResponse } from "next/server";
import { resolveProtectedRoute } from "./lib/auth/redirect";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const redirect = resolveProtectedRoute(user, requestedPath);

  return redirect ? NextResponse.redirect(new URL(redirect, request.url)) : response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
