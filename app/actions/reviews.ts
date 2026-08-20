"use server";

import { activeTheoryConceptRegistry } from "../../content/theory-concepts";
import type { MasteryStatus, ReviewRating } from "../../lib/adaptive/review-schedule";
import { createServerClient } from "../../lib/supabase/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DEFINITIVE_VALIDATION_CODES = new Set(["22P02", "23514", "P0002"]);

export type RecallReviewResult =
  | { kind: "saved"; dueOn: string | null; status: MasteryStatus }
  | { kind: "retryable" }
  | { kind: "rejected" }
  | { kind: "unauthenticated" };

export async function recordRecallReview(
  conceptId: string,
  rating: ReviewRating,
  clientEventId: string,
): Promise<RecallReviewResult> {
  if (
    typeof conceptId !== "string"
    || !activeTheoryConceptRegistry.has(conceptId)
    || !Number.isInteger(rating)
    || rating < 0
    || rating > 3
    || typeof clientEventId !== "string"
    || !UUID_PATTERN.test(clientEventId)
  ) return { kind: "rejected" };

  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { kind: "unauthenticated" };

  const { error } = await supabase.rpc("record_recall_review", {
    p_client_event_id: clientEventId,
    p_concept_id: conceptId,
    p_rating: rating,
  });
  if (error) {
    return DEFINITIVE_VALIDATION_CODES.has(error.code ?? "")
      ? { kind: "rejected" }
      : { kind: "retryable" };
  }

  const { data: mastery, error: masteryError } = await supabase
    .from("concept_mastery")
    .select("due_on,status")
    .eq("user_id", user.id)
    .eq("concept_id", conceptId)
    .maybeSingle();
  if (masteryError || !mastery) return { kind: "retryable" };

  return {
    kind: "saved",
    dueOn: mastery.due_on,
    status: mastery.status,
  };
}
