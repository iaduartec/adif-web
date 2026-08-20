import { NextResponse } from "next/server";
import { activeTheoryConceptRegistry } from "../../../../content/theory-concepts";
import { madridDayKey } from "../../../../lib/adaptive/review-schedule";
import { getSupabaseRuntimeConfig } from "../../../../lib/supabase/config";
import { getMockStore, MOCK_USER } from "../../../../lib/supabase/mock-store";

function unavailable() {
  return new NextResponse(null, { status: 404 });
}

export async function POST(request: Request) {
  if (
    getSupabaseRuntimeConfig().mode !== "mock"
    || process.env.NODE_ENV === "production"
    || process.env.VERCEL_ENV === "production"
  ) return unavailable();

  const body = await request.json().catch(() => ({})) as {
    action?: unknown;
    failNext?: unknown;
  };
  const store = getMockStore();
  store.conceptMastery = [];
  store.reviewEvents = [];
  store.reviewRpcFailure = null;

  if (body.action === "reset") {
    return NextResponse.json({ reset: true });
  }
  if (body.action !== "seed") return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const ids = ["ict-concept-1", "ict-concept-2"];
  if (ids.some((id) => !activeTheoryConceptRegistry.has(id))) {
    return NextResponse.json({ error: "Missing active review fixture" }, { status: 500 });
  }
  const now = new Date().toISOString();
  const today = madridDayKey(now);
  store.conceptMastery = ids.map((conceptId, index) => ({
    user_id: MOCK_USER.id,
    concept_id: conceptId,
    status: index === 0 ? "review" : "at_risk",
    repetitions: 1,
    ease_factor: 2.5,
    interval_days: 3,
    due_on: index === 0 ? today : null,
    last_reviewed_at: now,
    last_evidence_at: now,
    correct_evidence: 1,
    incorrect_evidence: 0,
    created_at: now,
    updated_at: now,
  }));
  if (body.failNext === "uncertain" || body.failNext === "definitive") {
    store.reviewRpcFailure = body.failNext;
  }

  return NextResponse.json({ conceptIds: ids });
}
