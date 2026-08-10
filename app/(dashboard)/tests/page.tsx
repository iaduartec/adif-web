import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoriteButton } from "../../../components/practice/favorite-button";
import { OfficialSource } from "../../../components/practice/official-source";
import { QuestionSession, type PracticeQuestion } from "../../../components/practice/question-session";
import { listOfficialQuestions } from "../../../lib/content/repository";
import type { OfficialQuestion } from "../../../lib/content/schema";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
const PRACTICE_QUESTION_LIMIT = 50;

type SearchParams = {
  year?: string;
  exam?: string;
  section?: OfficialQuestion["source"]["section"] | "all";
  status?: string;
  query?: string;
  page?: string;
  practice?: string;
};

function getSelectedYear(value: string | undefined): number | undefined {
  if (!value || value === "all") return undefined;
  const year = Number.parseInt(value, 10);
  return Number.isInteger(year) ? year : undefined;
}

function toPracticeQuestion({ answer: _answer, ...question }: OfficialQuestion): PracticeQuestion {
  return question;
}

export default async function TestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const selectedYear = getSelectedYear(params.year);
  const selectedExam = params.exam && params.exam !== "all" ? params.exam : undefined;
  const selectedSection = params.section && params.section !== "all" ? params.section : undefined;
  const searchQuery = params.query?.trim() ?? "";
  const statusFilter = params.status ?? "all";
  const currentPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const isPractice = params.practice === "true";

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: favRows } = await supabase
    .from("favorites")
    .select("item_id")
    .eq("user_id", user.id)
    .eq("item_type", "question");
  const favoriteIds = new Set((favRows ?? []).map((row) => row.item_id));

  const { data: attemptRows } = await supabase
    .from("question_attempts")
    .select("question_id, is_correct, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const latestAttempts = new Map<string, boolean>();
  for (const attempt of attemptRows ?? []) {
    latestAttempts.set(attempt.question_id, attempt.is_correct);
  }
  const failedIds = new Set(
    [...latestAttempts].filter(([, isCorrect]) => !isCorrect).map(([questionId]) => questionId),
  );

  const activeQuestions = listOfficialQuestions();
  const years = [...new Set(activeQuestions.map((question) => question.source.year))].sort((a, b) => b - a);
  const exams = [...new Set(activeQuestions.map((question) => question.source.examCode))].sort();
  const sections = [...new Set(activeQuestions.map((question) => question.source.section))];

  let filtered = listOfficialQuestions({
    year: selectedYear,
    examCode: selectedExam,
    section: selectedSection,
    query: searchQuery,
  });

  if (statusFilter === "failed") {
    filtered = filtered.filter((question) => failedIds.has(question.id));
  } else if (statusFilter === "favorites") {
    filtered = filtered.filter((question) => favoriteIds.has(question.id));
  }

  const buildUrl = (updates: Record<string, string | null>) => {
    const urlParams = new URLSearchParams();
    if (selectedYear) urlParams.set("year", String(selectedYear));
    if (selectedExam) urlParams.set("exam", selectedExam);
    if (selectedSection) urlParams.set("section", selectedSection);
    if (statusFilter !== "all") urlParams.set("status", statusFilter);
    if (searchQuery) urlParams.set("query", searchQuery);
    urlParams.set("page", String(currentPage));

    for (const [key, value] of Object.entries(updates)) {
      if (value === null) urlParams.delete(key);
      else urlParams.set(key, value);
    }
    return `/tests?${urlParams.toString()}`;
  };

  if (isPractice) {
    const practiceQuestions = filtered.slice(0, PRACTICE_QUESTION_LIMIT).map(toPracticeQuestion);
    const backParams = new URLSearchParams(buildUrl({ practice: null }).split("?")[1]);

    return (
      <div className="dashboard-wide practice-page">
        <header className="page-header">
          <nav aria-label="Migas de pan" className="course-breadcrumb">
            <Link href="/tests">Preguntas oficiales</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Práctica activa</span>
          </nav>
          <div className="practice-header-row">
            <h1>Práctica de preguntas oficiales</h1>
            <Link
              className="ui-button ui-button--secondary"
              href={`/tests?${backParams.toString()}`}
            >
              Finalizar sesión
            </Link>
          </div>
          {filtered.length > PRACTICE_QUESTION_LIMIT && (
            <p className="practice-limit-note">
              Practicando {PRACTICE_QUESTION_LIMIT} de las {filtered.length} preguntas que coinciden con los filtros aplicados.
            </p>
          )}
        </header>

        {practiceQuestions.length === 0 ? (
          <p className="empty-state" role="status">No hay preguntas que coincidan con estos filtros.</p>
        ) : (
          <QuestionSession questions={practiceQuestions} />
        )}
      </div>
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const paginatedQuestions = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="dashboard-wide tests-page">
      <header className="page-header">
        <p className="page-kicker">Banco oficial</p>
        <h1>Preguntas oficiales</h1>
        <p>Consulta y practica con los enunciados y opciones publicados por ADIF.</p>
      </header>

      <form className="filter-panel" method="GET" action="/tests">
        <div className="filter-field">
          <label htmlFor="filter-year">Año</label>
          <select className="filter-control" defaultValue={selectedYear ?? "all"} id="filter-year" name="year">
            <option value="all">Todos los años</option>
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-exam">Modelo</label>
          <select className="filter-control" defaultValue={selectedExam ?? "all"} id="filter-exam" name="exam">
            <option value="all">Todos los modelos</option>
            {exams.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-section">Sección</label>
          <select className="filter-control" defaultValue={selectedSection ?? "all"} id="filter-section" name="section">
            <option value="all">Todas las secciones</option>
            {sections.map((section) => <option key={section} value={section}>{section}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-status">Estado</label>
          <select className="filter-control" defaultValue={statusFilter} id="filter-status" name="status">
            <option value="all">Todas las preguntas</option>
            <option value="failed">Erradas (último intento fallido)</option>
            <option value="favorites">Favoritas</option>
          </select>
        </div>
        <div className="filter-field filter-field--query">
          <label htmlFor="filter-query">Búsqueda</label>
          <input className="filter-control" defaultValue={searchQuery} id="filter-query" name="query" placeholder="Buscar en preguntas oficiales..." type="text" />
        </div>
        <div className="filter-actions">
          <button className="ui-button" type="submit">Filtrar</button>
          <Link className="ui-button ui-button--secondary" href="/tests">Limpiar</Link>
        </div>
      </form>

      <div className="metadata-row question-index-summary">
        <p>Coinciden <strong>{totalItems}</strong> preguntas oficiales.</p>
        {totalItems > 0 && (
          <Link className="ui-button" href={buildUrl({ practice: "true", page: "1" })}>
            Iniciar práctica ({Math.min(totalItems, PRACTICE_QUESTION_LIMIT)} preguntas)
          </Link>
        )}
      </div>

      {paginatedQuestions.length === 0 ? (
        <div className="empty-state" role="status">No hay preguntas que coincidan con los filtros aplicados.</div>
      ) : (
        <div className="official-question-list">
          {paginatedQuestions.map((question) => {
            const isFavorite = favoriteIds.has(question.id);
            const isFailed = failedIds.has(question.id);
            return (
              <article className={`official-question-card ${isFailed ? "official-question-card--failed" : ""}`} key={question.id}>
                <div className="official-question-card__content">
                  <div className="metadata-row">
                    <strong>{question.id}</strong>
                    <span className="status-tag">{question.sectionLabel}</span>
                    {isFailed && <span className="status-tag status-tag--danger">Pendiente de corregir</span>}
                  </div>
                  <h2>{question.prompt}</h2>
                  <div className="official-question-options">
                    {question.options.map((option) => <div key={option.key}><strong>{option.key}.</strong> {option.text}</div>)}
                  </div>
                  <p className="official-question-options-note">Las opciones están disponibles al iniciar la práctica.</p>
                  <OfficialSource source={question.source} />
                </div>
                <div className="flex-shrink-0"><FavoriteButton initialIsFavorite={isFavorite} questionId={question.id} /></div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Navegación de páginas" className="pagination">
          <Link aria-disabled={currentPage <= 1} className="ui-button ui-button--secondary" href={buildUrl({ page: String(currentPage - 1) })}>Anterior</Link>
          <span>Página {currentPage} de {totalPages}</span>
          <Link aria-disabled={currentPage >= totalPages} className="ui-button ui-button--secondary" href={buildUrl({ page: String(currentPage + 1) })}>Siguiente</Link>
        </nav>
      )}
    </div>
  );
}
