import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoriteButton } from "../../../components/practice/favorite-button";
import { QuestionSession } from "../../../components/practice/question-session";
import { listQuestions } from "../../../lib/content/repository";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const MODULES = [
  "G1 Igualdad",
  "G2 PRL",
  "G3 Estatuto ADIF",
  "E1 ICT RD 346/2011",
  "E2 Compatibilidad electromagnetica",
  "E3 RCF Libro 1",
  "P Psicotecnicos",
  "I Ingles A2",
];

export default async function TestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    module?: string;
    query?: string;
    status?: string;
    page?: string;
    practice?: string;
  }>;
}) {
  const params = await searchParams;
  const selectedModule = params.module || "all";
  const searchQuery = params.query || "";
  const statusFilter = params.status || "all";
  const currentPage = parseInt(params.page || "1", 10) || 1;
  const isPractice = params.practice === "true";

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch favorites
  const { data: favRows } = await supabase
    .from("favorites")
    .select("item_id")
    .eq("user_id", user.id)
    .eq("item_type", "question");
  const favoriteIds = new Set((favRows ?? []).map((r) => r.item_id));

  // Fetch attempts to determine failed ones (latest attempt is incorrect)
  const { data: attemptRows } = await supabase
    .from("question_attempts")
    .select("question_id, is_correct, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const latestAttempts = new Map<string, boolean>();
  for (const attempt of attemptRows ?? []) {
    latestAttempts.set(attempt.question_id, attempt.is_correct);
  }
  const failedIds = new Set<string>();
  for (const [qId, isCorrect] of latestAttempts.entries()) {
    if (!isCorrect) {
      failedIds.add(qId);
    }
  }

  // Filter the full bank of questions
  const allQuestions = listQuestions();
  let filtered = allQuestions;

  if (selectedModule !== "all") {
    filtered = filtered.filter((q) => q.module === selectedModule);
  }

  if (searchQuery) {
    const norm = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (q) =>
        q.prompt.toLowerCase().includes(norm) ||
        q.explanation.toLowerCase().includes(norm) ||
        q.sourceNote.toLowerCase().includes(norm) ||
        q.options.some((o) => o.text.toLowerCase().includes(norm)),
    );
  }

  if (statusFilter === "failed") {
    filtered = filtered.filter((q) => failedIds.has(q.id));
  } else if (statusFilter === "favorites") {
    filtered = filtered.filter((q) => favoriteIds.has(q.id));
  }

  if (isPractice) {
    // Limit practice to a subset of 50 questions maximum to avoid huge client-side payload
    const practiceQuestions = filtered.slice(0, 50);

    const backParams = new URLSearchParams();
    if (params.module) backParams.set("module", params.module);
    if (params.query) backParams.set("query", params.query);
    if (params.status) backParams.set("status", params.status);

    return (
      <div className="dashboard-wide practice-page">
        <header className="course-index__header mb-6">
          <nav aria-label="Migas de pan" className="course-breadcrumb">
            <Link href="/tests">Banco de preguntas</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Práctica activa</span>
          </nav>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Sesión de Práctica</h1>
            <Link
              className="ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper"
              href={`/tests?${backParams.toString()}`}
            >
              Finalizar sesión
            </Link>
          </div>
          {filtered.length > 50 && (
            <p className="p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 text-sm mb-4">
              Practicando 50 de las {filtered.length} preguntas que coinciden con los filtros aplicados.
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

  // Paginated list mode
  const totalItems = filtered.length;
  const pageSize = 25;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedQuestions = filtered.slice(startIndex, startIndex + pageSize);

  const buildUrl = (updates: Record<string, string | null>) => {
    const urlParams = new URLSearchParams();
    if (selectedModule !== "all") urlParams.set("module", selectedModule);
    if (searchQuery) urlParams.set("query", searchQuery);
    if (statusFilter !== "all") urlParams.set("status", statusFilter);
    urlParams.set("page", String(currentPage));

    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, value);
      }
    }
    return `/tests?${urlParams.toString()}`;
  };

  return (
    <div className="dashboard-wide tests-page">
      <header className="course-index__header mb-8">
        <p className="course-eyebrow">Banco de Preguntas</p>
        <h1>Práctica de Tests</h1>
        <p>
          Pon a prueba tus conocimientos sobre el temario de ADIF Oficial de Telecomunicaciones 2026.
        </p>
      </header>

      {/* Filters Form */}
      <form className="mb-8 p-6 bg-white border border-rail grid gap-4 md:grid-cols-4 items-end" method="GET" action="/tests">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2" htmlFor="filter-module">
            Módulo
          </label>
          <select
            className="w-full border border-rail p-2 bg-transparent text-ink"
            id="filter-module"
            name="module"
            defaultValue={selectedModule}
          >
            <option value="all">Todos los temas</option>
            {MODULES.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2" htmlFor="filter-status">
            Estado
          </label>
          <select
            className="w-full border border-rail p-2 bg-transparent text-ink"
            id="filter-status"
            name="status"
            defaultValue={statusFilter}
          >
            <option value="all">Todas las preguntas</option>
            <option value="failed">Erradas (último intento fallido)</option>
            <option value="favorites">Favoritas</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2" htmlFor="filter-query">
            Búsqueda
          </label>
          <input
            className="w-full border border-rail p-2 bg-transparent text-ink"
            id="filter-query"
            name="query"
            placeholder="Buscar texto..."
            defaultValue={searchQuery}
            type="text"
          />
        </div>

        <div className="flex gap-2">
          <button className="ui-button flex-1 font-bold cursor-pointer" type="submit">
            Filtrar
          </button>
          <Link
            className="ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper flex-1 text-center font-bold"
            href="/tests"
          >
            Limpiar
          </Link>
        </div>
      </form>

      {/* Action / Count Area */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-rail pb-4">
        <div>
          <p className="text-sm text-gray-600">
            Coinciden <strong>{totalItems}</strong> preguntas de 4.500.
          </p>
        </div>
        {totalItems > 0 && (
          <Link
            className="ui-button px-6 font-bold"
            href={buildUrl({ practice: "true", page: "1" })}
          >
            Iniciar práctica ({Math.min(totalItems, 50)} preguntas)
          </Link>
        )}
      </div>

      {/* Questions list */}
      {paginatedQuestions.length === 0 ? (
        <div className="py-12 text-center text-gray-500 border border-dashed border-rail" role="status">
          No hay preguntas que coincidan con los filtros aplicados.
        </div>
      ) : (
        <div className="grid gap-6">
          {paginatedQuestions.map((q) => {
            const isFav = favoriteIds.has(q.id);
            const isFailed = failedIds.has(q.id);
            return (
              <div
                className={`p-6 border border-rail bg-white flex justify-between gap-4 transition-colors ${
                  isFailed ? "border-l-4 border-l-red-500" : ""
                }`}
                key={q.id}
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-sm text-accent-strong">{q.id}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {q.module}
                    </span>
                    {isFailed && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded font-semibold">
                        Pendiente de corregir
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-ink mb-4">{q.prompt}</h3>
                  <div className="grid md:grid-cols-2 gap-2 pl-4 border-l border-rail mb-4">
                    {q.options.map((opt) => (
                      <div className="text-sm text-gray-700" key={opt.key}>
                        <strong>{opt.key}.</strong> {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <FavoriteButton initialIsFavorite={isFav} questionId={q.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Navegación de páginas" className="flex items-center justify-between mt-8 border-t border-rail pt-4">
          <Link
            className={`ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper ${
              currentPage <= 1 ? "pointer-events-none opacity-50" : ""
            }`}
            href={buildUrl({ page: String(currentPage - 1) })}
          >
            Anterior
          </Link>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <Link
            className={`ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper ${
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }`}
            href={buildUrl({ page: String(currentPage + 1) })}
          >
            Siguiente
          </Link>
        </nav>
      )}
    </div>
  );
}
