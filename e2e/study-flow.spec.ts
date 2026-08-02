import { test, expect } from "@playwright/test";

test.describe("ADIF Telecomunicaciones Study Flow", () => {
  test("runs the full practice, error notebook, simulation, and statistics workflow", async ({ page }) => {
    // 1. Dashboard initialization
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toContainText("Bienvenido de nuevo");
    await expect(page.locator("text=Temario Completado")).toBeVisible();

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
    // Select option A (incorrect — correct answer for Q0001 is D)
    await page.locator("label").filter({ hasText: /^A\./ }).click();
    await page.click("text=Comprobar respuesta");
    await expect(page.locator("text=Respuesta incorrecta")).toBeVisible();

    // 4. Verify the Error Notebook
    await page.goto("/errores");
    await expect(page.locator("h1")).toContainText("Cuaderno de Errores");
    await expect(page.locator("text=Q0001")).toBeVisible();
    await expect(page.locator("text=Tu última respuesta: A")).toBeVisible();

    // 5. Favorite a question in the question bank list
    await page.goto("/tests");
    const favButton = page.locator("button.favorite-btn").first();
    await favButton.click();
    await expect(favButton).toHaveClass(/favorite-btn--active/);

    // 6. Complete a timed simulation
    await page.goto("/simulacros");
    await expect(page.locator("h1")).toContainText("Simulacros de Examen");
    await page.click("text=Simulacro 01");
    await page.click("text=Comenzar simulacro");

    // Answer two questions
    await page.locator("label").filter({ hasText: /^A\./ }).click();
    await page.click("text=Siguiente");
    await page.locator("label").filter({ hasText: /^B\./ }).click();

    // Submit simulation
    await page.click("text=Entregar simulacro");
    await page.click("text=Confirmar entrega");

    // Verify simulation results page (exact text from SimulationResults component)
    await expect(page.locator("h2:has-text('Resultado del simulacro')")).toBeVisible();
    await expect(page.locator(".simulation-results__card--score")).toBeVisible();
    await expect(page.locator(".simulation-results__card--correct")).toBeVisible();

    // 7. Verify study statistics
    await page.goto("/estadisticas");
    await expect(page.locator("h1")).toContainText("Estadísticas de Estudio");
    // The "Precisión por Temas" table is the primary visible table
    await expect(page.locator("h2:has-text('Precisión por Temas')")).toBeVisible();
    await expect(page.locator("table").first()).toBeVisible();
  });
});
