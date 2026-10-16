import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoriteButton } from "../../../components/practice/favorite-button";
import { OfficialSource } from "../../../components/practice/official-source";
import { QuestionSession, type PracticeQuestion } from "../../../components/practice/question-session";
import { listOfficialQuestionRecords, listOfficialQuestions } from "../../../lib/content/repository";
import {
  toPublicOfficialQuestion,
  toPublicOfficialQuestionStatus,
  type PublicOfficialQuestion,
} from "../../../lib/content/public-dto";
import type { OfficialQuestion } from "../../../lib/content/schema";
import { displayModuleName } from "../../../lib/progress/metrics";
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
  diagnostic?: string;
  questions?: string | string[];
};

type PlannedQuestionSelection =
  | { kind: "absent" }
  | { kind: "invalid" }
  | { kind: "valid"; ids: string[] };

const validityStatuses: readonly OfficialQuestion["validity"][] = [
  "current",
  "changed",
  "out_of_scope",
  "pending_review",
];

function getStatusFilter(value: string | undefined): string {
  if (value === "failed" || value === "favorites" || value === "all") return value;
  return validityStatuses.includes(value as OfficialQuestion["validity"]) ? value! : "all";
}

function parsePlannedQuestionSelection(value: SearchParams["questions"]): PlannedQuestionSelection {
  if (value === undefined) return { kind: "absent" };
  if (typeof value !== "string") return { kind: "invalid" };

  const ids = value.split(",");
  if (
    (ids.length !== 5 && ids.length !== 10)
    || ids.some((id) => id.length === 0)
    || new Set(ids).size !== ids.length
  ) return { kind: "invalid" };

  return { kind: "valid", ids };
}

function getSelectedYear(value: string | undefined): number | undefined {
  if (!value || value === "all") return undefined;
  const year = Number.parseInt(value, 10);
  return Number.isInteger(year) ? year : undefined;
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
  const statusFilter = getStatusFilter(params.status);
  const validityFilter = validityStatuses.includes(statusFilter as OfficialQuestion["validity"])
    ? statusFilter as OfficialQuestion["validity"]
    : undefined;
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const isPractice = params.practice === "true";
  const diagnosticIds = new Set((params.diagnostic ?? "").split(",").filter(Boolean));

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const plannedSelection = parsePlannedQuestionSelection(params.questions);

  const [{ data: favRows }, { data: attemptRows }] = await Promise.all([
    supabase
      .from("favorites")
      .select("item_id")
      .eq("user_id", user.id)
      .eq("item_type", "question"),
    supabase
      .from("question_attempts")
      .select("question_id, is_correct, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);
  const favoriteIds = new Set((favRows ?? []).map((row) => row.item_id));

  const latestAttempts = new Map<string, boolean>();
  for (const attempt of attemptRows ?? []) {
    latestAttempts.set(attempt.question_id, attempt.is_correct);
  }
  const failedIds = new Set(
    [...latestAttempts].filter(([, isCorrect]) => !isCorrect).map(([questionId]) => questionId),
  );

  const activeQuestions = listOfficialQuestions();
  const allQuestionRecords = listOfficialQuestionRecords();
  const withheldQuestionCount = allQuestionRecords.length - activeQuestions.length;
  const activeQuestionById = new Map(activeQuestions.map((question) => [question.id, question]));
  const plannedQuestionsAreValid = plannedSelection.kind === "absent" || (
    plannedSelection.kind === "valid"
    && plannedSelection.ids.every((questionId) => activeQuestionById.has(questionId))
  );
  const years = [...new Set(allQuestionRecords.map((question) => question.source.year))].sort((a, b) => b - a);
  const exams = [...new Set(allQuestionRecords.map((question) => question.source.examCode))].sort();
  const sections = [...new Set(allQuestionRecords.map((question) => question.source.section))];
  const questionFilter = {
    year: selectedYear,
    examCode: selectedExam,
    section: selectedSection,
    validity: validityFilter,
    query: searchQuery,
  };
  let filtered = listOfficialQuestions(questionFilter);
  let filteredRecords = listOfficialQuestionRecords(questionFilter);

  // The metadata query deliberately never searches withheld prompts/options.
  // Merge in active matches from the practice-gated query so authorized text
  // remains searchable without creating a hidden-text search side channel.
  const recordsById = new Map(filteredRecords.map((question) => [question.id, question]));
  for (const question of filtered) recordsById.set(question.id, question);
  filteredRecords = [...recordsById.values()];

  if (statusFilter === "failed") {
    filtered = filtered.filter((question) => failedIds.has(question.id));
    filteredRecords = filteredRecords.filter((question) => failedIds.has(question.id));
  } else if (statusFilter === "favorites") {
    filtered = filtered.filter((question) => favoriteIds.has(question.id));
    filteredRecords = filteredRecords.filter((question) => favoriteIds.has(question.id));
  }
  if (diagnosticIds.size > 0) {
    filtered = filtered.filter((question) => diagnosticIds.has(question.id));
    filteredRecords = filteredRecords.filter((question) => diagnosticIds.has(question.id));
  }
  if (plannedSelection.kind === "valid" && plannedQuestionsAreValid) {
    filtered = plannedSelection.ids.map((questionId) => activeQuestionById.get(questionId)!);
    filteredRecords = filtered;
  }

  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const currentPage = Math.min(requestedPage, totalPages);

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
    if (!plannedQuestionsAreValid) {
      return (
        <div className="dashboard-wide practice-page">
          <section aria-labelledby="invalid-practice-title" className="empty-state" role="alert">
            <p className="page-kicker">Práctica dirigida</p>
            <h1 id="invalid-practice-title">No se puede iniciar esta práctica</h1>
            <p>
              {withheldQuestionCount > 0
                ? `La selección no puede abrirse: ${withheldQuestionCount} preguntas oficiales siguen retenidas mientras verificamos las fuentes y los derechos de uso.`
                : "La selección planificada ya no coincide con el banco oficial activo."}
            </p>
            <Link className="ui-button" href="/tests">Volver a preguntas oficiales</Link>
          </section>
        </div>
      );
    }
    const practiceQuestions = filtered
      .slice(0, PRACTICE_QUESTION_LIMIT)
      .map((question) => toPublicOfficialQuestion(question))
      .filter((question): question is PublicOfficialQuestion => question !== null);
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
          {withheldQuestionCount > 0 && practiceQuestions.length > 0 && (
            <p className="empty-state" role="status">
              {withheldQuestionCount} pregunta{withheldQuestionCount === 1 ? " oficial sigue retenida" : "s oficiales siguen retenidas"} mientras verificamos las fuentes y los derechos de uso.
            </p>
          )}
          {filtered.length > PRACTICE_QUESTION_LIMIT && (
            <p className="practice-limit-note">
              Practicando {PRACTICE_QUESTION_LIMIT} de las {filtered.length} preguntas que coinciden con los filtros aplicados.
            </p>
          )}
        </header>

        {practiceQuestions.length === 0 ? (
          <p className="empty-state" role="status">
            {withheldQuestionCount > 0
              ? `No hay preguntas oficiales disponibles para esta sesión: ${withheldQuestionCount} enunciados siguen retenidos mientras verificamos las fuentes y los derechos de uso.`
              : "No hay preguntas que coincidan con estos filtros."}
          </p>
        ) : (
          <QuestionSession questions={practiceQuestions} />
        )}
      </div>
    );
  }

  const paginatedQuestions = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="dashboard-wide tests-page">
      <header className="page-header">
        <p className="page-kicker">Banco oficial</p>
        <h1>Preguntas oficiales</h1>
        <p>Practica con preguntas de procedencia oficial cuando sus fuentes y permisos de uso estén verificados.</p>
      </header>

      {withheldQuestionCount > 0 && (
        <div className="empty-state" role="alert">
          {withheldQuestionCount} pregunta{withheldQuestionCount === 1 ? " oficial tiene el enunciado retenido" : "s oficiales tienen los enunciados retenidos"} mientras verificamos las fuentes y los derechos de uso.
          Se conservan las referencias y el historial de estudio.
        </div>
      )}

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
            {sections.map((section) => (
              <option key={section} value={section}>{displayModuleName(section)}</option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-status">Estado</label>
          <select className="filter-control" defaultValue={statusFilter} id="filter-status" name="status">
            <option value="all">Todas las preguntas</option>
            <option value="current">Vigencia revisada: actual</option>
            <option value="changed">Contenido cambiado</option>
            <option value="out_of_scope">Fuera del temario 2026</option>
            <option value="pending_review">Pendiente de revisión</option>
            <option value="failed">Erradas (último intento fallido)</option>
            <option value="favorites">Favoritas</option>
          </select>
        </div>
        <div className="filter-field filter-field--query">
          <label htmlFor="filter-query">Búsqueda</label>
          <input className="filter-control" defaultValue={searchQuery} id="filter-query" name="query" placeholder="Buscar año, modelo, perfil o texto disponible..." type="text" />
        </div>
        <div className="filter-actions">
          <button className="ui-button" type="submit">Filtrar</button>
          <Link className="ui-button ui-button--secondary" href="/tests">Limpiar</Link>
        </div>
      </form>

      <div className="metadata-row question-index-summary">
        <p>Coinciden <strong>{totalItems}</strong> preguntas oficiales.</p>
        {filtered.length > 0 ? (
          <Link className="ui-button" href={buildUrl({ practice: "true", page: "1" })}>
            Iniciar práctica ({Math.min(filtered.length, PRACTICE_QUESTION_LIMIT)} preguntas)
          </Link>
        ) : <span aria-disabled="true" className="ui-button ui-button--secondary">Práctica no disponible</span>}
      </div>

      {paginatedQuestions.length === 0 ? (
        <div className="empty-state" role="status">
          {withheldQuestionCount > 0 && activeQuestions.length === 0
            ? "El banco oficial está temporalmente retenido mientras se verifican sus fuentes y derechos de uso."
            : "No hay preguntas que coincidan con los filtros aplicados."}
        </div>
      ) : (
        <div className="official-question-list">
          {paginatedQuestions.map((question) => {
            const isFavorite = favoriteIds.has(question.id);
            const isFailed = failedIds.has(question.id);
            const practiceRecord = activeQuestionById.get(question.id);
            const publicPracticeQuestion = practiceRecord ? toPublicOfficialQuestion(practiceRecord) : null;
            if (!publicPracticeQuestion) {
              const metadata = toPublicOfficialQuestionStatus(question);
              return (
                <article className={`official-question-card official-question-card--withheld ${isFailed ? "official-question-card--failed" : ""}`} key={question.id}>
                  <div className="official-question-card__content">
                    <div className="metadata-row">
                      <strong>OFICIAL ADIF {metadata.source.year}</strong>
                      <span className="status-tag">{metadata.id}</span>
                      <span className="status-tag">{metadata.sectionLabel}</span>
                      <span className="status-tag status-tag--danger">{metadata.publicationStatus === "restricted" ? "Contenido restringido" : "Enunciado retenido"}</span>
                      {isFailed && <span className="status-tag status-tag--danger">Intento previo incorrecto</span>}
                    </div>
                    <p>El texto de esta pregunta no está disponible mientras se verifican las fuentes, la vigencia y los derechos de uso.</p>
                    <OfficialSource source={metadata.source} questionStatus={metadata} />
                  </div>
                  <div className="flex-shrink-0"><FavoriteButton initialIsFavorite={isFavorite} questionId={question.id} /></div>
                </article>
              );
            }
            return (
              <article className={`official-question-card ${isFailed ? "official-question-card--failed" : ""}`} key={question.id}>
                <div className="official-question-card__content">
                  <div className="metadata-row">
                    <strong>OFICIAL ADIF {publicPracticeQuestion.source.year}</strong>
                    <span className="status-tag">{publicPracticeQuestion.id}</span>
                    <span className="status-tag">{question.sectionLabel}</span>
                    {isFailed && <span className="status-tag status-tag--danger">Pendiente de corregir</span>}
                  </div>
                  <h2>{publicPracticeQuestion.prompt}</h2>
                  <p className="official-question-options-note">Las opciones están disponibles al iniciar la práctica.</p>
                  <OfficialSource source={publicPracticeQuestion.source} questionStatus={publicPracticeQuestion} />
                </div>
                <div className="flex-shrink-0"><FavoriteButton initialIsFavorite={isFavorite} questionId={question.id} /></div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Navegación de páginas" className="pagination">
          {currentPage > 1 ? (
            <Link className="ui-button ui-button--secondary" href={buildUrl({ page: String(currentPage - 1) })}>Anterior</Link>
          ) : (
            <span aria-disabled="true" className="ui-button ui-button--secondary">Anterior</span>
          )}
          <span>Página {currentPage} de {totalPages}</span>
          {currentPage < totalPages ? (
            <Link className="ui-button ui-button--secondary" href={buildUrl({ page: String(currentPage + 1) })}>Siguiente</Link>
          ) : (
            <span aria-disabled="true" className="ui-button ui-button--secondary">Siguiente</span>
          )}
        </nav>
      )}
    </div>
  );
}
