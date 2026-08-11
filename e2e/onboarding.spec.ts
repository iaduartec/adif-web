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

  test("starts the balanced fifteen-question diagnostic after saving", async ({ page }) => {
    await setOnboarding(page, false);
    await page.goto("/onboarding");

    await page.getByRole("checkbox", { name: "Lunes" }).check();
    await page.getByRole("checkbox", { name: "Quiero hacer un diagnóstico inicial" }).check();
    await page.getByRole("button", { name: "Guardar preparación" }).click();

    await expect(page).toHaveURL(/\/tests\?practice=true&diagnostic=/);
    await expect(page.getByText("Pregunta 1 de 15")).toBeVisible();
  });
});
