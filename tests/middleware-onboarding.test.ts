import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createSupabaseServerClient, goalRead } = vi.hoisted(() => ({
  createSupabaseServerClient: vi.fn(),
  goalRead: { current: { data: null, error: new Error("read failed") } as any },
}));

vi.mock("@supabase/ssr", () => ({ createServerClient: createSupabaseServerClient }));
vi.mock("../lib/supabase/config", () => ({
  getSupabaseRuntimeConfig: () => ({ mode: "supabase", url: "https://example.com", anonKey: "key" }),
}));

import { updateSession } from "../lib/supabase/middleware";

describe("middleware onboarding read", () => {
  beforeEach(() => {
    createSupabaseServerClient.mockReturnValue({
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })) },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn(async () => goalRead.current),
      })),
    });
  });

  it("fails available instead of locking an authenticated user into onboarding when the goal read errors", async () => {
    const result = await updateSession(new NextRequest("https://example.com/curso"));

    expect(result.user).toEqual({ id: "user-1" });
    expect(result.onboardingComplete).toBe(true);
  });
});
