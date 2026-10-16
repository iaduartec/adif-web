"use server";

import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

export type RegisterUserResult = { ok: true } | { ok: false; error: string };

/**
 * Creates an email/password account pre-confirmed by the server.
 *
 * The project may have "Confirm email" enabled and no SMTP configured, so the
 * client-side `signUp` flow would stall waiting for a message that never
 * arrives. Creating the user through the admin API with `email_confirm: true`
 * keeps registration usable without an email provider.
 */
export async function registerUser(email: string, password: string): Promise<RegisterUserResult> {
  const admin = createSupabaseAdminClient();

  // Mock/Playwright mode has no remote auth backend.
  if (!admin) {
    return { ok: true };
  }

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    // A retried sign-up for an existing account should fall through to sign-in.
    if (error.code === "email_exists" || /already registered/i.test(error.message)) {
      return { ok: true };
    }

    return { ok: false, error: error.message };
  }

  return { ok: true };
}
