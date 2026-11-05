import { test, expect } from "@playwright/test";

test.describe("ADIF Telecomunicaciones Study Flow", () => {
  test("keeps withheld official prompts gated while the official exam and statistics flows remain usable", async ({ page }) => {
    // 1. Dashboard initialization
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toContainText("Hola, Usuario");
    await expect(page.getByRole("heading", { name: "Estado de preparación" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sesión de hoy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recursos complementarios" })).toBeVisible();

    // 2. Lesson completion
    await page.goto("/curso");
    await page.click("text=Igualdad y no discriminación");
    await expect(page).toHaveURL("/curso/igualdad");
    await page.click("text=Marcar como completada");
    await expect(page.locator("p.course-status:has-text('Lección completada')")).toBeVisible();

    // Go back to course list and check completed status
    await page.goto("/curso");
    await expect(page.locator("text=100%")).toBeVisible();

    // 3. The retained official question bank must not expose prompts or a practice session.
    await page.goto("/tests");
    await expect(page.locator(".empty-state[role='alert']")).toContainText("102 preguntas oficiales tienen los enunciados retenidos");
    await expect(page.getByText("Práctica no disponible")).toBeVisible();
    await expect(page.locator("input[type='radio']")).toHaveCount(0);
    await expect(page.locator(".official-question-card--withheld")).toHaveCount(25);

    // 4. The error notebook remains available and does not reveal held prompt text.
    await page.goto("/errores");
    await expect(page.locator("h1")).toContainText("Cuaderno de errores");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByText(/Los intentos de preguntas que no están disponibles para práctica siguen guardados/)).toBeVisible();
    await expect(page.locator(".official-question-card h2")).toHaveCount(0);

    // 5. Favorite a question in the question bank list
    await page.goto("/tests");
    const heldQuestionFavorite = page.getByRole("button", { name: "Favorito no disponible para pregunta retenida" }).first();
    await expect(heldQuestionFavorite).toBeDisabled();

    // 6. Historical official forms remain unavailable; original simulations have their own route.
    await page.goto("/simulacros");
    await expect(page.locator("h1")).toContainText("Exámenes oficiales");
    await expect(page.locator("article.simulation-card")).toHaveCount(8);
    await expect(page.locator("article.simulation-card", { hasText: "18 preguntas declaradas" })).toHaveCount(8);
    await expect(page.getByRole("link", { name: "Abrir examen" })).toHaveCount(0);
    await expect(page.locator("article.simulation-card").filter({ hasText: "Pendiente de verificación" })).toHaveCount(8);
    await expect(page.getByRole("link", { name: "Ver simulacros originales" })).toBeVisible();

    // 7. Verify study statistics
    await page.goto("/estadisticas");
    await expect(page.locator("h1")).toContainText("Estadísticas de estudio");
    await expect(page.locator("h2:has-text('Precisión por sección oficial')")).toBeVisible();
    await expect(page.locator("table").first()).toBeVisible();
  });
});
