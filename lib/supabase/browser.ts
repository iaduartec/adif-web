import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { createMockSupabaseClient } from "./mock-client";

export function createBrowserClient() {
  if (
    process.env.PLAYWRIGHT_TEST === "true" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return createMockSupabaseClient();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createSupabaseBrowserClient(url, anonKey);
}
