import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../database.types";
import { createMockSupabaseClient } from "./mock-client";
import { getSupabaseRuntimeConfig } from "./config";

export async function createServerClient() {
  const config = getSupabaseRuntimeConfig();
  if (config.mode === "mock") {
    return createMockSupabaseClient() as unknown as ReturnType<typeof createSupabaseServerClient<Database>>;
  }

  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies; middleware refreshes the session instead.
        }
      },
    },
  });
}
