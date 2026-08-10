import Link from "next/link";
import { redirect } from "next/navigation";
import { ProgressSummary } from "../../components/dashboard/progress-summary";
import { StudyPlan } from "../../components/dashboard/study-plan";
import { listLessons, listOfficialQuestions, listOfficialExams } from "../../lib/content/repository";
import { calculateMetrics, recommendNextSession } from "../../lib/progress/metrics";
import { createServerClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    { data: questionAttempts },
    { data: lessonProgress },
    { data: goalRow },
    { data: questionAttemptsThisWeek },
    { data: simulationAttemptsThisWeek },
  ] = await Promise.all([
    supabase
      .from("question_attempts")
      .select("question_id, is_correct, created_at")
      .eq("user_id", user.id),
    supabase
      .from("lesson_progress")
      .select("lesson_id, percent, completed, last_activity_at")
      .eq("user_id", user.id),
    supabase
      .from("study_goals")
      .select("weekly_target_minutes")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("question_attempts")
      .select("elapsed_ms")
      .eq("user_id", user.id)
      .gte("created_at", oneWeekAgo.toISOString()),
    supabase
      .from("simulation_attempts")
      .select("elapsed_ms")
      .eq("user_id", user.id)
      .gte("created_at", oneWeekAgo.toISOString()),
  ]);

  const totalMsThisWeek =
    (questionAttemptsThisWeek ?? []).reduce((acc, a) => acc + (a.elapsed_ms ?? 0), 0) +
    (simulationAttemptsThisWeek ?? []).reduce((acc, a) => acc + (a.elapsed_ms ?? 0), 0);

  const elapsedMinutesThisWeek = totalMsThisWeek / 60000;
  const weeklyTargetMinutes = goalRow?.weekly_target_minutes ?? 120;

  // Retrieve lessons list and questions list
  const lessons = listLessons();
  const questions = listOfficialQuestions();
  const simulations = listOfficialExams();

  // Metrics calculation
  const metrics = calculateMetrics(
    questionAttempts ?? [],
    lessonProgress ?? [],
    questions,
    new Date(),
  );

  // Lesson status tracking for recommendations
  const lessonStatus = lessons.map((l) => {
    const progress = (lessonProgress ?? []).find((p) => p.lesson_id === l.slug);
    return {
      slug: l.slug,
      title: l.title,
      percent: progress?.percent ?? 0,
      completed: progress?.completed ?? false,
    };
  });

  const recommendation = recommendNextSession(lessonStatus, metrics.weakestModule, simulations);

  const completedLessonsCount = lessonStatus.filter((l) => l.completed).length;

  return (
    <div className="dashboard-wide home-page">
      <header className="page-header">
        <p className="page-kicker">Plataforma de estudio</p>
        <h1>Hola{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(" ")[0]}` : ""}. Bienvenido de nuevo</h1>
        <p>
          Prepara tu oposición para Oficial de Telecomunicaciones de Entrada ADIF 2026. Sigue tu plan diario para consolidar el temario.
        </p>
      </header>

      <ProgressSummary
        metrics={metrics}
        totalLessonsCount={lessons.length}
        completedLessonsCount={completedLessonsCount}
      />

      <StudyPlan
        recommendation={recommendation}
        weeklyTargetMinutes={weeklyTargetMinutes}
        elapsedMinutesThisWeek={elapsedMinutesThisWeek}
      />

      <section aria-labelledby="official-resources-title" className="resource-links">
        <h2 id="official-resources-title">Recursos oficiales</h2>
        <div className="resource-links__list">
          <Link href="/curso" className="resource-link">
            <span>
              <strong>Temario oficial</strong>
              <small>Accede al contenido completo del temario oficial con explicaciones detalladas y notas.</small>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/tests" className="resource-link">
            <span>
              <strong>Preguntas oficiales</strong>
              <small>Practica con preguntas oficiales y consulta su documento de origen en ADIF.</small>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/simulacros" className="resource-link">
            <span>
              <strong>Exámenes oficiales</strong>
              <small>Practica con modelos históricos oficiales, cada uno con su duración y preguntas publicadas.</small>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
