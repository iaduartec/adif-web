import { expect, test, type Page } from "@playwright/test";

async function configureReviews(page: Page, options: { failNext?: "uncertain" | "definitive" } = {}) {
  const response = await page.request.post("/api/test/reviews", {
    data: { action: "seed", failNext: options.failNext },
  });
  expect(response.ok()).toBe(true);
}

async function resetReviews(page: Page) {
  const response = await page.request.post("/api/test/reviews", { data: { action: "reset" } });
  expect(response.ok()).toBe(true);
}

test.describe("review session", () => {
  test.beforeEach(async ({ page }) => configureReviews(page));
  test.afterEach(async ({ page }) => resetReviews(page));

  test("reveals, rates, reports the next date, and follows the keyboard focus sequence", async ({ page }) => {
    await page.goto("/repasos");
    await expect(page.getByText("Explícalo con tus palabras")).toBeVisible();
    await expect(page.locator("[data-testid='review-answer']")).toHaveCount(0);

    const reveal = page.getByRole("button", { name: "Mostrar respuesta" });
    await reveal.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-testid='review-answer']")).toBeVisible();
    await expect(page.getByRole("button", { name: "0 · No lo recordaba" })).toBeFocused();
    await expect(page.getByRole("button", { name: /^(0|1|2|3) ·/ })).toHaveCount(4);

    await page.getByRole("button", { name: "2 · Lo recordé" }).press("Enter");
    await expect(page.getByRole("status")).toContainText("Próximo repaso:");
    await expect(page.getByRole("button", { name: "Siguiente concepto" })).toBeFocused();
    await page.getByRole("button", { name: "Siguiente concepto" }).press("Enter");
    await expect(page.getByRole("button", { name: "Mostrar respuesta" })).toBeFocused();
  });

  test("keeps the exact uncertain save available for retry", async ({ page }) => {
    await configureReviews(page, { failNext: "uncertain" });
    await page.goto("/repasos?concepts=ict-concept-1");
    await page.getByRole("button", { name: "Mostrar respuesta" }).click();
    await page.getByRole("button", { name: "1 · Me costó" }).click();
    await expect(page.locator(".review-session__error")).toContainText(/no sabemos si se guardó/i);
    await page.getByRole("button", { name: "Reintentar guardado" }).click();
    await expect(page.getByRole("button", { name: "Finalizar repaso" })).toBeFocused();
  });

  test("fits 390x844 without horizontal overflow and removes review motion", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/repasos");
    await expect(page.locator(".review-session__sticky")).toHaveCSS("position", "sticky");
    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      transitionSeconds: Number.parseFloat(
        getComputedStyle(document.querySelector(".review-session__card")!).transitionDuration,
      ),
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth);
    expect(dimensions.transitionSeconds).toBeLessThanOrEqual(0.00001);
    await page.getByRole("button", { name: "Mostrar respuesta" }).click();
    await expect(page.locator(".review-rating-button").first()).toHaveCSS("min-height", "44px");
  });
});
