import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const configError = /Supabase.*NEXT_PUBLIC_SUPABASE_URL.*NEXT_PUBLIC_SUPABASE_ANON_KEY/i;

describe.sequential("Supabase configuration boundary", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("PLAYWRIGHT_TEST", "false");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    delete (globalThis as typeof globalThis & { __mock_supabase_store__?: unknown })
      .__mock_supabase_store__;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (globalThis as typeof globalThis & { __mock_supabase_store__?: unknown })
      .__mock_supabase_store__;
  });

  it("fails closed in the browser when deployment credentials are missing", async () => {
    const { createBrowserClient } = await import("../lib/supabase/browser");

    expect(createBrowserClient).toThrow(configError);
  });

  it("fails closed on the server when deployment credentials are missing", async () => {
    const { createServerClient } = await import("../lib/supabase/server");

    await expect(createServerClient()).rejects.toThrow(configError);
  });

  it("fails closed in middleware when deployment credentials are missing", async () => {
    const { updateSession } = await import("../lib/supabase/middleware");

    await expect(updateSession(new NextRequest("https://example.com/"))).rejects.toThrow(configError);
  });

  it("does not initialize the shared Playwright store merely by importing production clients", async () => {
    await import("../lib/supabase/browser");
    await import("../lib/supabase/server");

    expect(
      (globalThis as typeof globalThis & { __mock_supabase_store__?: unknown })
        .__mock_supabase_store__,
    ).toBeUndefined();
  });

  it("allows the in-memory identity only when the explicit Playwright flag is true", async () => {
    vi.stubEnv("PLAYWRIGHT_TEST", "true");
    vi.resetModules();
    const { createServerClient } = await import("../lib/supabase/server");

    const client = await createServerClient();
    await expect(client.auth.getUser()).resolves.toMatchObject({
      data: { user: { id: "test-user-id" } },
    });
  });
});
