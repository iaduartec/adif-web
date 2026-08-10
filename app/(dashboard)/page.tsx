import Link from "next/link";
import { redirect } from "next/navigation";
import { ProgressSummary } from "../../components/dashboard/progress-summary";
import { StudyPlan } from "../../components/dashboard/study-plan";
import { listLessons, listQuestions, listSimulations } from "../../lib/content/repository";
import { calculateMetrics, recommendNextSession } from "../../lib/progress/metrics";
import { createServerClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch attempts, progress, goals
  const { data: questionAttempts } = await supabase
    .from("question_attempts")
    .select("question_id, is_correct, created_at")
    .eq("user_id", user.id);

  const { data: lessonProgress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, percent, completed, last_activity_at")
    .eq("user_id", user.id);

  const { data: goalRow } = await supabase
    .from("study_goals")
    .select("weekly_target_minutes")
    .eq("user_id", user.id)
    .maybeSingle();

  // Calculate study elapsed time this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: questionAttemptsThisWeek } = await supabase
    .from("question_attempts")
    .select("elapsed_ms")
    .eq("user_id", user.id)
    .gte("created_at", oneWeekAgo.toISOString());

  const { data: simulationAttemptsThisWeek } = await supabase
    .from("simulation_attempts")
    .select("elapsed_ms")
    .eq("user_id", user.id)
    .gte("created_at", oneWeekAgo.toISOString());

  const totalMsThisWeek =
    (questionAttemptsThisWeek ?? []).reduce((acc, a) => acc + (a.elapsed_ms ?? 0), 0) +
    (simulationAttemptsThisWeek ?? []).reduce((acc, a) => acc + (a.elapsed_ms ?? 0), 0);

  const elapsedMinutesThisWeek = totalMsThisWeek / 60000;
  const weeklyTargetMinutes = goalRow?.weekly_target_minutes ?? 120;

  // Retrieve lessons list and questions list
  const lessons = listLessons();
  const questions = listQuestions();
  const simulations = listSimulations();

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
      <header className="course-index__header mb-8">
        <p className="course-eyebrow">Plataforma de Estudio</p>
        <h1>Hola{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(" ")[0]}` : ""}. Bienvenido de nuevo</h1>
        <p>
          Prepara tu oposición para Oficial de Telecomunicaciones de Entrada ADIF 2026. Sigue tu plan diario para consolidar el temario.
        </p>
      </header>

      {/* Progress Cards Overview */}
      <ProgressSummary
        metrics={metrics}
        totalLessonsCount={lessons.length}
        completedLessonsCount={completedLessonsCount}
      />

      {/* Recommended Next Action & Goal Track */}
      <StudyPlan
        recommendation={recommendation}
        weeklyTargetMinutes={weeklyTargetMinutes}
        elapsedMinutesThisWeek={elapsedMinutesThisWeek}
      />

      {/* Shortcuts grid */}
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        <Link href="/curso" className="simulation-card">
          <div className="simulation-card__header">
            <h3 className="simulation-card__title">📖 Temario Oficial</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Accede al contenido completo del temario oficial con explicaciones detalladas y notas.
          </p>
        </Link>
        <Link href="/tests" className="simulation-card">
          <div className="simulation-card__header">
            <h3 className="simulation-card__title">📝 Banco de Preguntas</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Práctica libre de preguntas comentadas del banco completo de la oposición.
          </p>
        </Link>
        <Link href="/simulacros" className="simulation-card">
          <div className="simulation-card__header">
            <h3 className="simulation-card__title">⏱️ Simulacros de Examen</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Ponte a prueba con simulacros cronometrados de 60 preguntas y corrección real.
          </p>
        </Link>
      </div>
    </div>
  );
}
