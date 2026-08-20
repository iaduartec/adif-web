import { test, expect } from "@playwright/test";

test.describe("ADIF Telecomunicaciones Study Flow", () => {
  test("runs the full practice, error notebook, simulation, and statistics workflow", async ({ page }) => {
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

    // 3. Answer a question incorrectly to feed the Error Notebook
    await page.goto("/tests");
    await page.click("a:has-text('Iniciar práctica')");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".practice-session h2")).toHaveCount(1);
    const activeQuestionName = await page.locator("input[type='radio']").first().getAttribute("name");
    const activeQuestionId = activeQuestionName?.replace("question-", "");
    expect(activeQuestionId).toBeTruthy();
    // Select option A, which is incorrect for the first active official question.
    await page.locator("label").filter({ hasText: /^A\./ }).click();
    await page.click("text=Comprobar respuesta");
    await expect(page.locator("text=Respuesta incorrecta")).toBeVisible();
    await expect(page.getByRole("complementary", { name: "Procedencia oficial" })).toContainText("Pregunta oficial ADIF");

    // 4. Verify the Error Notebook
    await page.goto("/errores");
    await expect(page.locator("h1")).toContainText("Cuaderno de errores");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".official-question-card h2")).toHaveCount(1);
    await expect(page.locator(".official-question-card h3")).toHaveCount(0);
    await expect(page.getByText(activeQuestionId ?? "", { exact: true })).toBeVisible();
    await expect(page.locator("text=Tu última respuesta: A")).toBeVisible();

    // 5. Favorite a question in the question bank list
    await page.goto("/tests");
    const favButton = page.locator("button.favorite-btn").first();
    await favButton.click();
    await expect(favButton).toHaveClass(/favorite-btn--active/);

    // 6. Complete a timed simulation
    await page.goto("/simulacros");
    await expect(page.locator("h1")).toContainText("Exámenes oficiales");
    await expect(page.locator("article.simulation-card")).toHaveCount(6);
    await expect(page.locator("article.simulation-card", { hasText: "15 preguntas" })).toHaveCount(2);
    await expect(page.locator("article.simulation-card", { hasText: "18 preguntas" })).toHaveCount(4);
    await page.getByRole("link", { name: "Abrir examen" }).first().click();
    await page.getByRole("button", { name: "Comenzar examen" }).click();

    // Answer two questions
    await page.locator("label").filter({ hasText: /^A\./ }).click();
    await page.click("text=Siguiente");
    await page.locator("label").filter({ hasText: /^B\./ }).click();

    // Submit simulation and verify accessible modal focus management.
    const submitTrigger = page.getByRole("button", { name: "Entregar examen" });
    await submitTrigger.click();
    const submitDialog = page.getByRole("dialog", { name: "Confirmar entrega" });
    await expect(submitDialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Seguir revisando" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(submitDialog).toBeHidden();
    await expect(submitTrigger).toBeFocused();

    await submitTrigger.click();
    await page.getByRole("button", { name: "Confirmar entrega" }).click();

    // Verify simulation results page (exact text from SimulationResults component)
    await expect(page.locator("h2:has-text('Resultado del examen')")).toBeVisible();
    await expect(page.locator(".simulation-results__card--score")).toBeVisible();
    await expect(page.locator(".simulation-results__card--correct")).toBeVisible();

    // 7. Verify study statistics
    await page.goto("/estadisticas");
    await expect(page.locator("h1")).toContainText("Estadísticas de estudio");
    await expect(page.locator("h2:has-text('Precisión por sección oficial')")).toBeVisible();
    await expect(page.locator("table").first()).toBeVisible();
  });
});
