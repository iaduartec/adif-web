import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getMockStore, MOCK_USER } from "./mock-store";
import { getSupabaseRuntimeConfig } from "./config";

type SessionUser = { id: string } | null;

export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: SessionUser;
  onboardingComplete: boolean;
}> {
  const config = getSupabaseRuntimeConfig();
  let response = NextResponse.next({ request });

  if (config.mode === "mock") {
    const goal = getMockStore().studyGoals.find((row) => row.user_id === MOCK_USER.id);
    return { response, user: MOCK_USER, onboardingComplete: Boolean(goal?.onboarding_completed_at) };
  }

  const supabase = createSupabaseServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { response, user, onboardingComplete: false };

  const { data: goal, error } = await supabase
    .from("study_goals")
    .select("onboarding_completed_at")
    .eq("user_id", user.id)
    .maybeSingle();

  return { response, user, onboardingComplete: error ? true : Boolean(goal?.onboarding_completed_at) };
}
