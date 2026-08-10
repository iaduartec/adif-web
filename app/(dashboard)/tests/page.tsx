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
        <header className="course-index__header mb-6">
          <nav aria-label="Migas de pan" className="course-breadcrumb">
            <Link href="/tests">Preguntas oficiales</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Práctica activa</span>
          </nav>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Práctica de preguntas oficiales</h1>
            <Link
              className="ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper"
              href={`/tests?${backParams.toString()}`}
            >
              Finalizar sesión
            </Link>
          </div>
          {filtered.length > PRACTICE_QUESTION_LIMIT && (
            <p className="p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 text-sm mb-4">
              Practicando {PRACTICE_QUESTION_LIMIT} de las {filtered.length} preguntas que coinciden con los filtros aplicados.
            </p>
          )}
        </header>

        {practiceQuestions.length === 0 ? (
          <p className="py-8 text-center text-gray-500" role="status">No hay preguntas que coincidan con estos filtros.</p>
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
      <header className="course-index__header mb-8">
        <p className="course-eyebrow">Banco oficial</p>
        <h1>Preguntas oficiales</h1>
        <p>Consulta y practica con los enunciados y opciones publicados por ADIF.</p>
      </header>

      <form className="mb-8 p-6 bg-white border border-rail grid gap-4 md:grid-cols-4 items-end" method="GET" action="/tests">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2" htmlFor="filter-year">Año</label>
          <select className="w-full border border-rail p-2 bg-transparent text-ink" defaultValue={selectedYear ?? "all"} id="filter-year" name="year">
            <option value="all">Todos los años</option>
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2" htmlFor="filter-exam">Modelo</label>
          <select className="w-full border border-rail p-2 bg-transparent text-ink" defaultValue={selectedExam ?? "all"} id="filter-exam" name="exam">
            <option value="all">Todos los modelos</option>
            {exams.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2" htmlFor="filter-section">Sección</label>
          <select className="w-full border border-rail p-2 bg-transparent text-ink" defaultValue={selectedSection ?? "all"} id="filter-section" name="section">
            <option value="all">Todas las secciones</option>
            {sections.map((section) => <option key={section} value={section}>{section}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2" htmlFor="filter-status">Estado</label>
          <select className="w-full border border-rail p-2 bg-transparent text-ink" defaultValue={statusFilter} id="filter-status" name="status">
            <option value="all">Todas las preguntas</option>
            <option value="failed">Erradas (último intento fallido)</option>
            <option value="favorites">Favoritas</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2" htmlFor="filter-query">Búsqueda</label>
          <input className="w-full border border-rail p-2 bg-transparent text-ink" defaultValue={searchQuery} id="filter-query" name="query" placeholder="Buscar en preguntas oficiales..." type="text" />
        </div>
        <div className="flex gap-2">
          <button className="ui-button flex-1 font-bold cursor-pointer" type="submit">Filtrar</button>
          <Link className="ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper flex-1 text-center font-bold" href="/tests">Limpiar</Link>
        </div>
      </form>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-rail pb-4">
        <p className="text-sm text-gray-600">Coinciden <strong>{totalItems}</strong> preguntas oficiales.</p>
        {totalItems > 0 && (
          <Link className="ui-button px-6 font-bold" href={buildUrl({ practice: "true", page: "1" })}>
            Iniciar práctica ({Math.min(totalItems, PRACTICE_QUESTION_LIMIT)} preguntas)
          </Link>
        )}
      </div>

      {paginatedQuestions.length === 0 ? (
        <div className="py-12 text-center text-gray-500 border border-dashed border-rail" role="status">No hay preguntas que coincidan con los filtros aplicados.</div>
      ) : (
        <div className="grid gap-6">
          {paginatedQuestions.map((question) => {
            const isFavorite = favoriteIds.has(question.id);
            const isFailed = failedIds.has(question.id);
            return (
              <article className={`p-6 border border-rail bg-white flex justify-between gap-4 transition-colors ${isFailed ? "border-l-4 border-l-red-500" : ""}`} key={question.id}>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-sm text-accent-strong">{question.id}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{question.sectionLabel}</span>
                    {isFailed && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded font-semibold">Pendiente de corregir</span>}
                  </div>
                  <h2 className="text-lg font-medium text-ink mb-4">{question.prompt}</h2>
                  <div className="grid md:grid-cols-2 gap-2 pl-4 border-l border-rail mb-4">
                    {question.options.map((option) => <div className="text-sm text-gray-700" key={option.key}><strong>{option.key}.</strong> {option.text}</div>)}
                  </div>
                  <OfficialSource source={question.source} />
                </div>
                <div className="flex-shrink-0"><FavoriteButton initialIsFavorite={isFavorite} questionId={question.id} /></div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Navegación de páginas" className="flex items-center justify-between mt-8 border-t border-rail pt-4">
          <Link className={`ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`} href={buildUrl({ page: String(currentPage - 1) })}>Anterior</Link>
          <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
          <Link className={`ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`} href={buildUrl({ page: String(currentPage + 1) })}>Siguiente</Link>
        </nav>
      )}
    </div>
  );
}
