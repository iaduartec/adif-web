import { beforeEach, describe, expect, it, vi } from "vitest";

const { createUser, createSupabaseAdminClient } = vi.hoisted(() => {
  const createUser = vi.fn();

  return {
    createUser,
    createSupabaseAdminClient: vi.fn<() => unknown>(() => ({ auth: { admin: { createUser } } })),
  };
});

vi.mock("../lib/supabase/admin", () => ({ createSupabaseAdminClient }));

import { registerUser } from "../app/(auth)/login/actions";

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createSupabaseAdminClient.mockReturnValue({ auth: { admin: { createUser } } });
    createUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
  });

  it("creates an email-confirmed account", async () => {
    const result = await registerUser("alumno@example.com", "secreto123");

    expect(createUser).toHaveBeenCalledWith({
      email: "alumno@example.com",
      password: "secreto123",
      email_confirm: true,
    });
    expect(result).toEqual({ ok: true });
  });

  it("accepts an existing account so the client can fall through to sign-in", async () => {
    createUser.mockResolvedValue({
      data: { user: null },
      error: { code: "email_exists", message: "User already registered" },
    });

    await expect(registerUser("alumno@example.com", "secreto123")).resolves.toEqual({ ok: true });
  });

  it("returns the provider message for other failures", async () => {
    createUser.mockResolvedValue({
      data: { user: null },
      error: { code: "weak_password", message: "Password is too weak" },
    });

    await expect(registerUser("alumno@example.com", "123")).resolves.toEqual({
      ok: false,
      error: "Password is too weak",
    });
  });

  it("short-circuits in mock mode without calling the provider", async () => {
    createSupabaseAdminClient.mockReturnValueOnce(null);

    await expect(registerUser("alumno@example.com", "secreto123")).resolves.toEqual({ ok: true });
    expect(createUser).not.toHaveBeenCalled();
  });
});
