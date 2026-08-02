import Link from "next/link";
import type { Recommendation } from "../../lib/progress/metrics";
import { Button } from "../ui/button";

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
    <section aria-labelledby="study-plan-title" className="mb-8 p-6 border border-rail bg-white">
      <h2 id="study-plan-title" className="text-xl font-bold mb-4">Tu Plan de Estudio Personalizado</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommendation card */}
        <div className="flex flex-col justify-between p-4 border border-rail bg-paper">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-strong">
              Siguiente Acción Recomendada
            </span>
            {recommendation.type === "lesson" ? (
              <>
                <h3 className="text-lg font-bold mt-2 mb-1">Continuar leyendo el temario</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tienes temas pendientes. Te recomendamos continuar leyendo la lección.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mt-2 mb-1">Practicar preguntas</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Has leído todos los temas. Te recomendamos practicar preguntas del módulo{" "}
                  <strong>{recommendation.id === "random" ? "General" : recommendation.id}</strong>.
                </p>
              </>
            )}
          </div>
          <div>
            {recommendation.type === "lesson" ? (
              <Link href={`/curso/${recommendation.id}`} passHref legacyBehavior>
                <a className="ui-button inline-block text-center">Ir a la Lección</a>
              </Link>
            ) : (
              <Link
                href={`/tests?module=${recommendation.id === "random" ? "" : encodeURIComponent(recommendation.id)}&start=true`}
                passHref
                legacyBehavior
              >
                <a className="ui-button inline-block text-center">Empezar Práctica</a>
              </Link>
            )}
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="p-4 border border-rail bg-paper flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Objetivo Semanal de Estudio
            </span>
            <h3 className="text-lg font-bold mt-2 mb-1">Tiempo de práctica activa</h3>
            <p className="text-sm text-gray-600 mb-4">
              Meta: <strong>{weeklyTargetMinutes} minutos</strong> de práctica/simulacros semanales.
            </p>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2" role="progressbar" aria-valuenow={percentGoal} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="bg-accent h-full transition-all duration-300"
                style={{ width: `${percentGoal}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Progreso: {Math.round(elapsedMinutesThisWeek)} mins completados ({percentGoal}%)
            </p>
          </div>
          <div className="mt-4">
            <Link href="/tests" passHref legacyBehavior>
              <a className="text-sm font-bold text-accent hover:underline">Practicar más preguntas →</a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
