import { redirect } from "next/navigation";
import { OnboardingForm } from "../../components/onboarding/onboarding-form";
import { getSafeRedirectPath } from "../../lib/auth/redirect";
import { createServerClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Fonboarding");

  const [{ data: goal }, params] = await Promise.all([
    supabase
      .from("study_goals")
      .select("weekly_target_minutes, preferred_days, session_minutes, exam_date, onboarding_completed_at")
      .eq("user_id", user.id)
      .maybeSingle(),
    searchParams,
  ]);
  const completed = Boolean(goal?.onboarding_completed_at);
  const next = getSafeRedirectPath(params.next ?? null);

  return (
    <main className="onboarding-page">
      <section className="onboarding-panel" aria-labelledby="onboarding-title">
        <p className="page-kicker">Plan personal de estudio</p>
        <h1 id="onboarding-title">{completed ? "Ajusta tu preparación" : "Configura tu preparación"}</h1>
        <p className="onboarding-intro">
          Cuéntanos cómo quieres estudiar. Podrás cambiar estas preferencias cuando lo necesites.
        </p>
        <OnboardingForm
          initialValues={{
            weeklyTargetMinutes: String(goal?.weekly_target_minutes ?? 120),
            preferredDays: (goal?.preferred_days ?? []).map(String),
            sessionMinutes: String(goal?.session_minutes ?? 30),
            examDate: goal?.exam_date ?? "",
            diagnostic: false,
          }}
          next={next}
        />
      </section>
    </main>
  );
}
