"use server";

import { redirect } from "next/navigation";
import { getSafeRedirectPath } from "../../lib/auth/redirect";
import { initialOnboardingFormState, type OnboardingFormState } from "../../lib/onboarding-form-state";
import { parseOnboardingInput, selectBalancedDiagnosticQuestionIds } from "../../lib/onboarding";
import { listOfficialQuestions } from "../../lib/content/repository";
import { createServerClient } from "../../lib/supabase/server";

function formValues(formData: FormData): OnboardingFormState["values"] {
  return {
    weeklyTargetMinutes: String(formData.get("weekly_target_minutes") ?? ""),
    preferredDays: formData.getAll("preferred_days").map(String),
    sessionMinutes: String(formData.get("session_minutes") ?? ""),
    examDate: String(formData.get("exam_date") ?? ""),
    diagnostic: formData.get("diagnostic") === "true",
  };
}

export async function saveOnboarding(
  next: string | null,
  _previous: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const values = formValues(formData);
  const parsed = parseOnboardingInput(formData);
  if (!parsed.data) return { errors: parsed.errors, values };

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Fonboarding");

  const { data: existingGoal } = await supabase
    .from("study_goals")
    .select("onboarding_completed_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("study_goals").upsert({
    user_id: user.id,
    weekly_target_minutes: parsed.data.weeklyTargetMinutes,
    preferred_days: parsed.data.preferredDays,
    session_minutes: parsed.data.sessionMinutes,
    exam_date: parsed.data.examDate,
    onboarding_completed_at: existingGoal?.onboarding_completed_at ?? new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (error) {
    return {
      errors: { form: "No se ha podido guardar tu preparación. Inténtalo de nuevo." },
      values,
    };
  }

  if (parsed.data.diagnostic) {
    const ids = selectBalancedDiagnosticQuestionIds(listOfficialQuestions());
    redirect(`/tests?practice=true&diagnostic=${encodeURIComponent(ids.join(","))}`);
  }

  redirect(getSafeRedirectPath(next) ?? "/");
}
