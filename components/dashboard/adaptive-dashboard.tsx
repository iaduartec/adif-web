import Link from "next/link";
import type { DailyPlan, DailyTask } from "../../lib/adaptive/daily-plan";
import type { ReadinessSnapshot } from "../../lib/adaptive/readiness";

type NextSimulation = { id: string; title: string; durationMinutes: number };

function formatRate(value: number | null) {
  return value === null ? "Sin datos" : `${value}%`;
}

function taskDestination(task: DailyTask, snapshot: ReadinessSnapshot) {
  switch (task.kind) {
    case "review": {
      const lessonId = snapshot.concepts.find((concept) => concept.conceptId === task.conceptId)?.lessonId;
      return {
        href: lessonId ? `/curso/${lessonId}` : "/curso",
        label: `Revisar ${task.title}`,
      };
    }
    case "lesson": return { href: `/curso/${task.lessonId}`, label: `Continuar ${task.title}` };
    case "practice": {
      const params = new URLSearchParams({
        practice: "true",
        questions: task.questionIds.join(","),
      });
      return {
        href: `/tests?${params.toString()}`,
        label: `Practicar ${task.questionCount} preguntas`,
      };
    }
    case "simulation": return { href: `/simulacros/${task.examId}`, label: `Abrir ${task.title}` };
  }
}

export function AdaptiveDashboard({
  elapsedMinutesThisWeek,
  nextSimulation,
  plan,
  snapshot,
  userName,
  weeklyTargetMinutes,
}: {
  elapsedMinutesThisWeek: number;
  nextSimulation: NextSimulation | null;
  plan: DailyPlan;
  snapshot: ReadinessSnapshot;
  userName?: string;
  weeklyTargetMinutes: number;
}) {
  const obstacle = snapshot.mainObstacle;
  const overdueReviews = snapshot.concepts.filter((concept) => (
    concept.dueOn !== null && concept.dueOn < plan.date
  ));
  const atRiskLessonIds = new Set(
    snapshot.concepts
      .filter((concept) => concept.status === "at_risk" || (concept.dueOn !== null && concept.dueOn < plan.date))
      .map((concept) => concept.lessonId),
  );
  const atRiskLessons = snapshot.lessons
    .filter((lesson) => (
      atRiskLessonIds.has(lesson.lessonId)
      || lesson.domainPercentage < 50
      || (lesson.recentPercentage !== null && lesson.recentPercentage < 60)
    ))
    .sort((left, right) => (
      left.domainPercentage - right.domainPercentage
      || (left.recentPercentage ?? 101) - (right.recentPercentage ?? 101)
      || left.lessonTitle.localeCompare(right.lessonTitle, "es")
    ))
    .slice(0, 4);
  const weeklyPercent = weeklyTargetMinutes > 0
    ? Math.min(100, Math.round((elapsedMinutesThisWeek / weeklyTargetMinutes) * 100))
    : 0;
  const latestScore = snapshot.simulationScores[0];

  return (
    <div className="dashboard-wide home-page adaptive-dashboard">
      <header className="page-header">
        <p className="page-kicker">Preparación adaptativa</p>
        <h1>{userName ? `Hola, ${userName}` : "Tu preparación"}</h1>
        <p>Prioriza el trabajo de hoy con evidencia de preguntas, repasos y simulacros oficiales.</p>
      </header>

      <section aria-labelledby="readiness-title" className={`readiness-hero readiness-hero--${snapshot.level}`}>
        <div>
          <p className="metadata-label">Situación actual</p>
          <h2 id="readiness-title">Estado de preparación</h2>
          <p className="readiness-hero__level">{snapshot.label}</p>
          {obstacle ? (
            <p className="readiness-hero__obstacle">
              <strong>Principal obstáculo: {obstacle.label}.</strong> {obstacle.explanation}
            </p>
          ) : (
            <p className="readiness-hero__obstacle">Los seis criterios medidos están en objetivo.</p>
          )}
        </div>
        <dl className="readiness-metrics">
          <div><dt>Cobertura</dt><dd>{snapshot.coverage.percentage}%</dd></div>
          <div><dt>Dominio vigente</dt><dd>{snapshot.currentDomain.percentage}%</dd></div>
          <div><dt>Retención diferida</dt><dd>{formatRate(snapshot.deferredRetention.percentage)}</dd></div>
          <div><dt>Ritmo reciente</dt><dd>{formatRate(snapshot.speed.percentage)}</dd></div>
        </dl>
      </section>

      <section aria-labelledby="today-session-title" className="dashboard-section daily-session">
        <div className="dashboard-section__heading">
          <div>
            <p className="metadata-label">{plan.allocatedMinutes} de {plan.availableMinutes} min asignados</p>
            <h2 id="today-session-title">Sesión de hoy</h2>
          </div>
          {plan.unusedMinutes > 0 && <p>{plan.unusedMinutes} min disponibles para ampliar la sesión.</p>}
        </div>
        {plan.tasks.length > 0 ? (
          <ol className="dashboard-task-list">
            {plan.tasks.map((task) => {
              const destination = taskDestination(task, snapshot);
              return (
                <li key={task.key}>
                  <span><strong>{task.title}</strong><small>{task.estimatedMinutes} min · {task.kind}</small></span>
                  <Link className="text-link" href={destination.href}>{destination.label}</Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="empty-state">
            <p className="empty-state__title">No hay tareas asignadas hoy</p>
            <p>Ajusta tu disponibilidad para generar una sesión con contenido activo.</p>
          </div>
        )}
      </section>

      <section aria-labelledby="overdue-title" className="dashboard-section">
        <div className="dashboard-section__heading">
          <div><p className="metadata-label">Prioridad temporal</p><h2 id="overdue-title">Repasos vencidos</h2></div>
        </div>
        {overdueReviews.length > 0 ? (
          <ul className="dashboard-compact-list">
            {overdueReviews.map((review) => (
              <li key={review.conceptId}>
                <span><strong>{review.conceptTitle}</strong><small>Vencido desde {review.dueOn}</small></span>
                <Link className="text-link" href={`/curso/${review.lessonId}`}>Revisar {review.conceptTitle}</Link>
              </li>
            ))}
          </ul>
        ) : <p className="empty-state">No tienes repasos vencidos dentro del contenido activo.</p>}
      </section>

      <section aria-labelledby="risk-title" className="dashboard-section">
        <div className="dashboard-section__heading">
          <div><p className="metadata-label">Conceptos y lecciones</p><h2 id="risk-title">Lecciones en riesgo</h2></div>
        </div>
        {atRiskLessons.length > 0 ? (
          <ul className="dashboard-compact-list">
            {atRiskLessons.map((lesson) => (
              <li key={lesson.lessonId}>
                <span>
                  <strong>{lesson.lessonTitle}</strong>
                  <small>{lesson.currentConcepts}/{lesson.conceptCount} conceptos vigentes · precisión reciente {formatRate(lesson.recentPercentage)}</small>
                </span>
                <Link className="text-link" href={`/curso/${lesson.lessonId}`}>Abrir lección</Link>
              </li>
            ))}
          </ul>
        ) : <p className="empty-state">No hay lecciones activas señaladas para refuerzo.</p>}
      </section>

      <section aria-labelledby="next-simulation-title" className="dashboard-section next-simulation">
        <div>
          <p className="metadata-label">Referencia oficial</p>
          <h2 id="next-simulation-title">Próximo simulacro</h2>
          {nextSimulation ? (
            <>
              <h3>{nextSimulation.title}</h3>
              <p>{nextSimulation.durationMinutes} minutos según la duración publicada del modelo.</p>
              <Link className="ui-button" href={`/simulacros/${nextSimulation.id}`}>Abrir {nextSimulation.title}</Link>
            </>
          ) : <p>No hay un modelo oficial activo disponible en este momento.</p>}
        </div>
        <dl>
          <div><dt>Últimos 30 días</dt><dd>{snapshot.recentSimulations} simulacros</dd></div>
          <div><dt>Última puntuación neta normalizada</dt><dd>{latestScore ? `${latestScore.normalizedPercentage}%` : "Sin intentos"}</dd></div>
        </dl>
      </section>

      <section aria-labelledby="weekly-summary-title" className="dashboard-section">
        <div className="dashboard-section__heading">
          <div><p className="metadata-label">Actividad</p><h2 id="weekly-summary-title">Resumen semanal</h2></div>
        </div>
        <dl className="weekly-summary-grid">
          <div><dt>Racha actual</dt><dd>{snapshot.streak} {snapshot.streak === 1 ? "día" : "días"}</dd></div>
          <div><dt>Práctica activa</dt><dd>{Math.round(elapsedMinutesThisWeek)} min</dd></div>
          <div><dt>Objetivo semanal</dt><dd>{weeklyPercent}%</dd></div>
          <div><dt>Precisión reciente</dt><dd>{formatRate(snapshot.accuracy.recent.percentage)}</dd></div>
        </dl>
        <div
          aria-label={`${weeklyPercent}% del objetivo semanal completado`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={weeklyPercent}
          className="study-progress"
          role="progressbar"
        ><span style={{ width: `${weeklyPercent}%` }} /></div>
      </section>

      <section aria-labelledby="resources-title" className="resource-links dashboard-section">
        <h2 id="resources-title">Recursos complementarios</h2>
        <div className="resource-links__list">
          <Link href="/curso" className="resource-link"><span><strong>Temario activo</strong><small>Consulta lecciones y conceptos auditados.</small></span><span aria-hidden="true">→</span></Link>
          <Link href="/tests" className="resource-link"><span><strong>Preguntas oficiales</strong><small>Amplía cobertura y precisión con preguntas publicadas.</small></span><span aria-hidden="true">→</span></Link>
          <Link href="/estadisticas" className="resource-link"><span><strong>Estadísticas detalladas</strong><small>Revisa métricas por concepto y por lección.</small></span><span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
