import { test, expect } from "@playwright/test";

test.describe("Mobile viewport verification (390x844)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("verifies layout compatibility and responsive reading bounds", async ({ page }) => {
    await page.goto("/");

    // 1. Check no horizontal scrollbar/overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // 2. Open mobile sidebar/navigation trigger
    const menuButton = page.locator("button.mobile-navigation-trigger");
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Verify drawer/sheet overlay is visible
      const navigationDialog = page.getByRole("dialog", { name: "Navegación principal" });
      await expect(navigationDialog).toBeVisible();
      await expect(navigationDialog.getByRole("link", { name: "Exámenes oficiales", exact: true })).toBeVisible();
    }

    // 3. Keep the official-question bank concise on mobile.
    await page.goto("/tests");
    await expect(page.getByRole("heading", { name: "Preguntas oficiales" })).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("div.empty-state[role='alert']")).toContainText("102 preguntas oficiales tienen los enunciados retenidos");
    await expect(page.locator(".official-question-card--withheld")).toHaveCount(25);
    await expect(page.getByText("Práctica no disponible")).toBeVisible();
    await expect(page.locator("input[type='radio']")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Favorito no disponible para pregunta retenida" }).first()).toBeDisabled();
    await expect(page.locator(".official-question-options:visible")).toHaveCount(0);

    const compactControls = page.locator(".filter-panel input, .filter-panel select, .filter-panel button, .filter-panel a");
    const compactControlCount = await compactControls.count();
    for (let index = 0; index < compactControlCount; index += 1) {
      const box = await compactControls.nth(index).boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }

    const favoriteBox = await page.locator("button.favorite-btn").first().boundingBox();
    expect(favoriteBox?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(favoriteBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    if (process.env.TASK7_FIX1_TESTS_SCREENSHOT) {
      await page.screenshot({ path: process.env.TASK7_FIX1_TESTS_SCREENSHOT, fullPage: true });
    }

    await page.goto("/simulacros");
    await expect(page.getByRole("link", { name: "Abrir examen" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Ver simulacros originales" })).toBeVisible();
    await page.getByRole("link", { name: "Ver simulacros originales" }).click();
    await page.getByRole("link", { name: "Elegir y comenzar" }).first().click();
    await page.getByRole("button", { name: "Iniciar simulacro original" }).click();
    const simulationQuestionBox = await page.getByRole("navigation", { name: "Navegación del simulacro" }).getByRole("button").first().boundingBox();
    expect(simulationQuestionBox?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(simulationQuestionBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    if (process.env.TASK7_FIX1_SIMULATION_SCREENSHOT) {
      await page.screenshot({ path: process.env.TASK7_FIX1_SIMULATION_SCREENSHOT, fullPage: true });
    }

    await page.goto("/tests?section=specific&practice=true");
    await expect(page).toHaveURL(/\/tests\?section=specific&practice=true$/);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("status")).toContainText("102 enunciados siguen retenidos");
    await expect(page.locator(".practice-session h2")).toHaveCount(0);
    await expect(page.locator("input[type='radio']")).toHaveCount(0);
    await expect(page.getByText("specific", { exact: true })).toHaveCount(0);
    if (process.env.TASK7_FIX1_FILTER_SCREENSHOT) {
      await page.screenshot({ path: process.env.TASK7_FIX1_FILTER_SCREENSHOT, fullPage: true });
    }

    // 4. Verify wide single-column reading layout on lesson pages
    await page.goto("/curso/igualdad");
    const readingContainer = page.locator(".dashboard-reading");
    await expect(readingContainer).toBeVisible();

    const lessonHasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(lessonHasHorizontalScroll).toBe(false);

    const readingWidth = await readingContainer.evaluate((el) => el.getBoundingClientRect().width);
    expect(readingWidth).toBeGreaterThan(0);
    // On mobile the reading column must fill the panel without a forced narrow measure.
    expect(readingWidth).toBeLessThanOrEqual(390);
  });
});
