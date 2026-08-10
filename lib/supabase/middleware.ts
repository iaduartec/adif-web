import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { MOCK_USER } from "./mock-store";
import { getSupabaseRuntimeConfig } from "./config";

type SessionUser = { id: string } | null;

export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: SessionUser;
}> {
  const config = getSupabaseRuntimeConfig();
  let response = NextResponse.next({ request });

  if (config.mode === "mock") {
    return { response, user: MOCK_USER };
  }

  const supabase = createSupabaseServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
