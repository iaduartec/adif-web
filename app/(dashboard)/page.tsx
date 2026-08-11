import { redirect } from "next/navigation";
import { AdaptiveDashboard } from "../../components/dashboard/adaptive-dashboard";
import { AnalyticsUnavailable } from "../../components/dashboard/analytics-unavailable";
import { assembleDailyPlanInput } from "../../lib/adaptive/daily-plan-server";
import { buildDailyPlan } from "../../lib/adaptive/daily-plan";
import { calculateReadiness } from "../../lib/adaptive/readiness";
import { assembleReadinessInput, ReadinessUnavailableError } from "../../lib/adaptive/readiness-server";
import { madridDayKey } from "../../lib/adaptive/review-schedule";
import { createServerClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

function shiftDay(dayKey: string, days: number) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days, 12)).toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const today = madridDayKey(now);
  const readinessInputPromise = assembleReadinessInput(supabase, user.id, now);
  let readinessInput;
  let dailyPlanInput;
  let goalResult;
  try {
    [readinessInput, dailyPlanInput, goalResult] = await Promise.all([
      readinessInputPromise,
      assembleDailyPlanInput(today, {
        supabase,
        userId: user.id,
        readinessInput: readinessInputPromise,
      }),
      supabase.from("study_goals")
        .select("weekly_target_minutes")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);
  } catch (error) {
    if (error instanceof ReadinessUnavailableError) {
      return <AnalyticsUnavailable retryHref="/" />;
    }
    throw error;
  }
  if (goalResult.error) throw new Error("No se ha podido cargar el objetivo semanal.");

  const snapshot = calculateReadiness(readinessInput);
  const plan = buildDailyPlan(dailyPlanInput);
  const activeQuestionIds = new Set(readinessInput.questions.map((question) => question.id));
  const activeSimulationIds = new Set(readinessInput.simulations.map((simulation) => simulation.id));
  const weekFrom = shiftDay(today, -6);
  const elapsedMsThisWeek = readinessInput.questionAttempts
    .filter((attempt) => (
      attempt.mode !== "simulation"
      && activeQuestionIds.has(attempt.questionId)
      && madridDayKey(attempt.createdAt) >= weekFrom
      && madridDayKey(attempt.createdAt) <= today
    ))
    .reduce((total, attempt) => total + attempt.elapsedMs, 0)
    + readinessInput.simulationAttempts
      .filter((attempt) => (
        activeSimulationIds.has(attempt.simulationId)
        && madridDayKey(attempt.createdAt) >= weekFrom
        && madridDayKey(attempt.createdAt) <= today
      ))
      .reduce((total, attempt) => total + attempt.elapsedMs, 0);

  const plannedSimulation = plan.tasks.find((task) => task.kind === "simulation");
  const attemptCount = new Map<string, number>();
  for (const attempt of readinessInput.simulationAttempts) {
    if (activeSimulationIds.has(attempt.simulationId)) {
      attemptCount.set(attempt.simulationId, (attemptCount.get(attempt.simulationId) ?? 0) + 1);
    }
  }
  const fallbackSimulation = [...readinessInput.simulations].sort((left, right) => (
    (attemptCount.get(left.id) ?? 0) - (attemptCount.get(right.id) ?? 0)
    || left.id.localeCompare(right.id)
  ))[0];
  const nextSimulation = plannedSimulation
    ? readinessInput.simulations.find((simulation) => simulation.id === plannedSimulation.examId) ?? null
    : fallbackSimulation ?? null;

  return (
    <AdaptiveDashboard
      elapsedMinutesThisWeek={elapsedMsThisWeek / 60_000}
      nextSimulation={nextSimulation}
      plan={plan}
      snapshot={snapshot}
      userName={user.user_metadata?.full_name?.split(" ")[0]}
      weeklyTargetMinutes={goalResult.data?.weekly_target_minutes ?? 120}
    />
  );
}
