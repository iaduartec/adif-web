export const SUPABASE_CONFIG_ERROR =
  "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o NEXT_PUBLIC_SUPABASE_ANON_KEY) antes de desplegar la aplicación.";

export type SupabaseRuntimeConfig =
  | { mode: "mock" }
  | { mode: "supabase"; url: string; anonKey: string };

export function getSupabaseRuntimeConfig(): SupabaseRuntimeConfig {
  if (process.env.PLAYWRIGHT_TEST === "true") {
    return { mode: "mock" };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Supabase now recommends publishable keys (`sb_publishable_...`). Keep
  // accepting the legacy anon key so existing deployments can migrate safely.
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(SUPABASE_CONFIG_ERROR);
  }

  return { mode: "supabase", url, anonKey };
}
