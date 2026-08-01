import { NextResponse } from "next/server";
import { getSafeRedirectPath } from "../../../lib/auth/redirect";
import { createServerClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeRedirectPath(requestUrl.searchParams.get("next")) ?? "/";

  if (code) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
    } catch {
      // Authentication errors are intentionally not exposed through the callback URL.
    }
  }

  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
