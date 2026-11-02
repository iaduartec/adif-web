import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { createMockSupabaseClient } from "./mock-client";
import { getSupabaseRuntimeConfig } from "./config";

export function createBrowserClient() {
  const config = getSupabaseRuntimeConfig();
  if (config.mode === "mock") {
    return createMockSupabaseClient();
  }

  return createSupabaseBrowserClient(config.url, config.anonKey);
}

export function getSupabaseOAuthAuthorizeUrl() {
  const config = getSupabaseRuntimeConfig();

  if (config.mode === "mock") {
    return null;
  }

  return new URL("/auth/v1/authorize", config.url).toString();
}
