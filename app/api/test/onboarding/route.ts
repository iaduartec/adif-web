import { NextResponse } from "next/server";
import { getSupabaseRuntimeConfig } from "../../../../lib/supabase/config";
import { getMockStore, MOCK_USER } from "../../../../lib/supabase/mock-store";

export async function POST(request: Request) {
  if (
    getSupabaseRuntimeConfig().mode !== "mock"
    || process.env.NODE_ENV === "production"
    || process.env.VERCEL_ENV === "production"
  ) return new NextResponse(null, { status: 404 });

  const body = await request.json().catch(() => ({})) as { completed?: unknown };
  const goal = getMockStore().studyGoals.find((row) => row.user_id === MOCK_USER.id);
  if (!goal) return NextResponse.json({ error: "Missing mock study goal" }, { status: 404 });

  goal.onboarding_completed_at = body.completed === true ? new Date().toISOString() : null;
  return NextResponse.json({ onboardingCompleted: Boolean(goal.onboarding_completed_at) });
}
