import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateSession } = vi.hoisted(() => ({ updateSession: vi.fn() }));

vi.mock("../lib/supabase/middleware", () => ({ updateSession }));

import { config, proxy } from "../proxy";

describe("proxy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preserves refreshed session cookies when redirecting an anonymous visitor to login", async () => {
    const refreshedResponse = NextResponse.next();
    refreshedResponse.cookies.set("sb-access-token", "refreshed-token", { httpOnly: true });
    updateSession.mockResolvedValue({ response: refreshedResponse, user: null });

    const response = await proxy(new NextRequest("http://localhost/curso"));

    expect(response.headers.get("location")).toBe("http://localhost/login?next=%2Fcurso");
    expect(response.headers.get("set-cookie")).toContain("sb-access-token=refreshed-token");
  });

  it("bypasses the Supabase session refresh for the public login route", async () => {
    updateSession.mockRejectedValue(new Error("Supabase should not be called for /login"));

    const response = await proxy(new NextRequest("http://localhost/login?next=%2Fcurso"));

    expect(response.status).toBe(200);
    expect(updateSession).not.toHaveBeenCalled();
  });

  it("continues through Supabase session handling for the OAuth callback", async () => {
    const refreshedResponse = NextResponse.next();
    updateSession.mockResolvedValue({ response: refreshedResponse, user: null });

    const response = await proxy(new NextRequest("http://localhost/auth/callback?code=oauth-code"));

    expect(response).toBe(refreshedResponse);
    expect(updateSession).toHaveBeenCalledTimes(1);
  });

  it("keeps Next internals and every file extension outside the auth matcher", () => {
    const matcher = new RegExp(`^${config.matcher[0]}$`);

    expect(matcher.test("/_next/static/chunks/app.js")).toBe(false);
    expect(matcher.test("/fonts/rail.woff2")).toBe(false);
    expect(matcher.test("/materials/temario.pdf")).toBe(false);
    expect(matcher.test("/robots.txt")).toBe(false);
    expect(matcher.test("/images/logo.avif")).toBe(false);
    expect(matcher.test("/styles/app.css")).toBe(false);
    expect(matcher.test("/curso")).toBe(true);
  });
});
