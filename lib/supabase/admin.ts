import { createClient } from "@supabase/supabase-js";
import { getSupabaseRuntimeConfig } from "./config";

const SERVICE_ROLE_ERROR = "SUPABASE_SERVICE_ROLE_KEY is not configured.";

/**
 * Server-only Supabase client authenticated with the service role key.
 * Returns null in mock/Playwright mode, where there is no remote backend.
 */
export function createSupabaseAdminClient() {
  const config = getSupabaseRuntimeConfig();

  if (config.mode === "mock") {
    return null;
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(SERVICE_ROLE_ERROR);
  }

  return createClient(config.url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
