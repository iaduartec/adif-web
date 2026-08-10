import Link from "next/link";
import type { Recommendation } from "../../lib/progress/metrics";

export function StudyPlan({
  recommendation,
  weeklyTargetMinutes,
  elapsedMinutesThisWeek,
}: {
  recommendation: Recommendation;
  weeklyTargetMinutes: number;
  elapsedMinutesThisWeek: number;
}) {
  const percentGoal = weeklyTargetMinutes > 0
    ? Math.min(100, Math.round((elapsedMinutesThisWeek / weeklyTargetMinutes) * 100))
    : 0;

  return (
    <section aria-labelledby="study-plan-title" className="study-plan">
      <div className="study-plan__recommendation">
        <p className="metadata-label">Plan de hoy</p>
        <h2 id="study-plan-title">Siguiente acción recomendada</h2>
        <h3>{recommendation.title}</h3>
        <p>{recommendation.description}</p>
        <Link className="ui-button study-plan__primary-action" href={recommendation.href}>
          {recommendation.type === "lesson"
            ? "Ir a la lección"
            : recommendation.type === "practice"
              ? "Empezar práctica"
              : "Ir al examen"}
        </Link>
      </div>

      <div className="study-plan__goal">
        <div>
          <p className="metadata-label">Objetivo semanal</p>
          <h3>Tiempo de práctica activa</h3>
          <p>
            <strong>{weeklyTargetMinutes} minutos</strong> de práctica y exámenes oficiales.
          </p>
        </div>
        <div
          aria-label={`${percentGoal}% del objetivo semanal completado`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percentGoal}
          className="study-progress"
          role="progressbar"
        >
          <span style={{ width: `${percentGoal}%` }} />
        </div>
        <p className="study-plan__progress-copy">
          {Math.round(elapsedMinutesThisWeek)} min completados · {percentGoal}%
        </p>
        <Link className="text-link" href="/tests">Practicar preguntas oficiales</Link>
      </div>
    </section>
  );
}
