import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "../app/(dashboard)/page";
import ErrorNotebookPage from "../app/(dashboard)/errores/page";
import TestsPage from "../app/(dashboard)/tests/page";
import { DashboardNavigation } from "../components/shell/dashboard-navigation";
import { MobileNavigation } from "../components/shell/mobile-navigation";
import { Sidebar } from "../components/shell/sidebar";
import { UserMenu } from "../components/shell/user-menu";
import { listLessons, listOfficialQuestions } from "../lib/content/repository";

const { createServerClient, serverRows, signOut, usePathname } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  serverRows: { current: {} as Record<string, unknown[]> },
  signOut: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: vi.fn(), usePathname }));
vi.mock("../lib/supabase/browser", () => ({ createBrowserClient: () => ({ auth: { signOut } }) }));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));

const requiredDestinations = [
  ["Inicio", "/"],
  ["Curso", "/curso"],
  ["Preguntas oficiales", "/tests"],
  ["Exámenes oficiales", "/simulacros"],
  ["Psicotécnicos", "/psicotecnicos"],
  ["Inglés A2", "/ingles-a2"],
  ["Fichas", "/fichas"],
  ["Cuaderno de errores", "/errores"],
  ["Estadísticas", "/estadisticas"],
] as const;

describe("authenticated navigation", () => {
  afterEach(cleanup);

  beforeEach(() => {
    signOut.mockReset();
    usePathname.mockReset();
    createServerClient.mockReset();
    serverRows.current = {};
    createServerClient.mockImplementation(async () => {
      const createQuery = (rows: unknown[]) => {
        const query = {
          select: vi.fn(),
          eq: vi.fn(),
          gte: vi.fn(),
          order: vi.fn(),
          maybeSingle: vi.fn(async () => ({ data: rows[0] ?? null })),
          then: (resolve: (value: { data: unknown[] }) => unknown) =>
            Promise.resolve({ data: rows }).then(resolve),
        };
        query.select.mockReturnValue(query);
        query.eq.mockReturnValue(query);
        query.gte.mockReturnValue(query);
        query.order.mockReturnValue(query);
        return query;
      };

      return {
        auth: {
          getUser: vi.fn(async () => ({
            data: {
              user: {
                email: "ana@example.com",
                id: "user-1",
                user_metadata: { full_name: "Ana López" },
              },
            },
          })),
        },
        from: vi.fn((table: string) => createQuery(
          serverRows.current[table] ?? (table === "study_goals" ? [{ weekly_target_minutes: 120 }] : []),
        )),
      };
    });
  });

  it("presents one primary recommendation and an official-content summary without emoji headings", async () => {
    render(await DashboardPage());

    expect(screen.getAllByRole("region", { name: "Siguiente acción recomendada" })).toHaveLength(1);
    expect(screen.getByText("Lecciones completadas")).toBeInTheDocument();
    expect(screen.getByText("Preguntas oficiales intentadas")).toBeInTheDocument();
    expect(screen.getByText("Precisión global")).toBeInTheDocument();
    expect(screen.getByText("Sección oficial prioritaria")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recursos oficiales" })).toBeInTheDocument();

    const headingText = screen.getAllByRole("heading").map((heading) => heading.textContent).join(" ");
    expect(headingText).not.toMatch(/[🔥📖📝⏱️]/u);
  });

  it("starts the five authorized dashboard queries without serial waterfalls", async () => {
    const startedTables: string[] = [];
    let releaseQueries = () => {};
    const queryGate = new Promise<void>((resolve) => {
      releaseQueries = resolve;
    });

    createServerClient.mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: { id: "user-1", user_metadata: {} } },
        })),
      },
      from: vi.fn((table: string) => {
        startedTables.push(table);
        const result = queryGate.then(() => ({
          data: table === "study_goals" ? { weekly_target_minutes: 120 } : [],
        }));
        const query = {
          select: vi.fn(),
          eq: vi.fn(),
          gte: vi.fn(),
          maybeSingle: vi.fn(() => result),
          then: result.then.bind(result),
        };
        query.select.mockReturnValue(query);
        query.eq.mockReturnValue(query);
        query.gte.mockReturnValue(query);
        return query;
      }),
    });

    const pagePromise = DashboardPage();
    let startError: unknown;
    try {
      await waitFor(() => {
        expect(startedTables).toEqual([
          "question_attempts",
          "lesson_progress",
          "study_goals",
          "question_attempts",
          "simulation_attempts",
        ]);
      }, { timeout: 150 });
    } catch (error) {
      startError = error;
    } finally {
      releaseQueries();
    }
    await pagePromise;
    if (startError) throw startError;
  });

  it("links the weakest official section with a Spanish label and a server-side section filter", async () => {
    const question = listOfficialQuestions()[0]!;
    serverRows.current = {
      lesson_progress: listLessons().map((lesson) => ({
        lesson_id: lesson.slug,
        percent: 100,
        completed: true,
        last_activity_at: "2026-08-10T08:00:00.000Z",
      })),
      question_attempts: [{
        question_id: question.id,
        is_correct: false,
        created_at: "2026-08-10T09:00:00.000Z",
      }],
    };

    render(await DashboardPage());

    expect(screen.getByRole("heading", { name: "Practicar Conocimiento específico" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Empezar práctica" })).toHaveAttribute(
      "href",
      "/tests?section=specific&practice=true",
    );
    expect(screen.queryByText("specific", { exact: true })).not.toBeInTheDocument();
  });

  it("keeps official filter keys internal and presents Spanish section labels", async () => {
    const { container } = render(await TestsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("option", { name: "Conocimiento específico" })).toHaveValue("specific");
    expect(screen.queryByRole("option", { name: "specific" })).not.toBeInTheDocument();
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector(".official-question-card h2")).not.toBeNull();
  });

  it("uses level-two question headings in the populated error notebook", async () => {
    const question = listOfficialQuestions()[0]!;
    serverRows.current = {
      question_attempts: [{
        question_id: question.id,
        selected_answer: "A",
        is_correct: false,
        created_at: "2026-08-10T09:00:00.000Z",
      }],
    };

    const { container } = render(await ErrorNotebookPage());

    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector(".official-question-card h2")).toHaveTextContent(question.prompt);
    expect(container.querySelector(".official-question-card h3")).toBeNull();
  });

  it("exposes every study destination and identifies the current page", () => {
    render(<Sidebar currentPath="/tests" />);

    for (const [label, href] of requiredDestinations) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    }

    expect(screen.getByRole("link", { name: "Preguntas oficiales" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });

  it("opens the mobile navigation from a labelled trigger and returns focus after Escape", () => {
    render(<MobileNavigation currentPath="/curso" />);

    const trigger = screen.getByRole("button", { name: "Abrir navegación" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: "Navegación principal" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cerrar navegación" })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("dialog", { name: "Navegación principal" }), { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Navegación principal" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("identifies Curso rather than Inicio when the current route is /curso", () => {
    usePathname.mockReturnValue("/curso");
    render(<><DashboardNavigation placement="sidebar" /><DashboardNavigation placement="mobile" /></>);
    fireEvent.click(screen.getByRole("button", { name: "Abrir navegación" }));

    const courseLinks = screen.getAllByRole("link", { name: "Curso" });
    const homeLinks = screen.getAllByRole("link", { name: "Inicio" });

    expect(courseLinks).toHaveLength(2);
    courseLinks.forEach((link) => expect(link).toHaveAttribute("aria-current", "page"));
    homeLinks.forEach((link) => expect(link).not.toHaveAttribute("aria-current"));
  });

  it("keeps an accessible account-menu trigger name on mobile", () => {
    render(<UserMenu profile={{ email: "ana@example.com", name: "Ana López" }} />);

    expect(screen.getByRole("button", { name: "Abrir menú de cuenta" })).toBeInTheDocument();
  });

  it("replaces a failed decorative avatar with accessible account initials", () => {
    render(<UserMenu profile={{ avatarUrl: "https://example.com/broken.jpg", email: "ana@example.com", name: "Ana López" }} />);

    fireEvent.error(screen.getByAltText(""));

    expect(screen.getByRole("img", { name: "Iniciales de Ana López: AL" })).toHaveTextContent("AL");
  });

  it("shows a retryable error instead of navigating away when sign-out fails", async () => {
    signOut.mockResolvedValue({ error: { message: "No se pudo cerrar la sesión" } });
    render(<UserMenu profile={{ email: "ana@example.com", name: "Ana López" }} />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú de cuenta" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Cerrar sesión" }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("No se pudo cerrar la sesión"));
    expect(screen.getByRole("menuitem", { name: "Cerrar sesión" })).toBeEnabled();
  });
});
