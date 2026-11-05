import { expect, test, type Page } from "@playwright/test";

async function setOnboarding(page: Page, completed: boolean) {
  const response = await page.request.post("/api/test/onboarding", { data: { completed } });
  expect(response.ok()).toBe(true);
}

test.describe("onboarding", () => {
  test.afterEach(async ({ page }) => {
    await setOnboarding(page, true);
  });

  test("requires and completes onboarding when the diagnostic is skipped", async ({ page }) => {
    await setOnboarding(page, false);
    await page.goto("/curso");

    await expect(page).toHaveURL(/\/onboarding\?next=%2Fcurso$/);
    await page.getByRole("spinbutton", { name: "Objetivo semanal (minutos)" }).fill("180");
    await page.getByRole("checkbox", { name: "Lunes" }).check();
    await page.getByRole("radio", { name: "30 minutos" }).check();
    await page.getByRole("button", { name: "Guardar preparación" }).click();

    await expect(page).toHaveURL("/curso");
  });

  test("explains when the official diagnostic has fewer than fifteen eligible questions", async ({ page }) => {
    await setOnboarding(page, false);
    await page.goto("/onboarding");

    await page.getByRole("checkbox", { name: "Lunes" }).check();
    await page.getByRole("checkbox", { name: "Quiero hacer un diagnóstico inicial" }).check();
    await page.getByRole("button", { name: "Guardar preparación" }).click();

    await expect(page).toHaveURL("/onboarding");
    await expect(page.locator(".onboarding-form__status").getByRole("alert")).toHaveText(/Tu preparación se guardó, pero no se inició el diagnóstico: se necesitan 15 preguntas oficiales elegibles y ahora hay 0/i);

    await page.getByRole("checkbox", { name: "Quiero hacer un diagnóstico inicial" }).uncheck();
    await page.getByRole("button", { name: "Guardar preparación" }).click();
    await expect(page).toHaveURL("/");
  });
});
