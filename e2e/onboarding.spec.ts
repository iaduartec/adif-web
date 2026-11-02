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

  test("starts and submits the balanced original-only fifteen-question diagnostic after saving", async ({ page }) => {
    await setOnboarding(page, false);
    await page.goto("/onboarding");

    await page.getByRole("checkbox", { name: "Lunes" }).check();
    await page.getByRole("checkbox", { name: "Quiero hacer un diagnóstico inicial" }).check();
    await page.getByRole("button", { name: "Guardar preparación" }).click();

    await expect(page).toHaveURL("/diagnostico");
    await expect(page.getByRole("heading", { level: 1, name: "Diagnóstico inicial" })).toBeVisible();
    await expect(page.getByText(/diagnóstico formativo de preguntas originales, no equivalente a un examen oficial/i)).toBeVisible();

    const diagnostic = page.getByRole("region", { name: "Diagnóstico inicial" });
    await expect(diagnostic.getByText(/Pregunta 1 de 15/)).toBeVisible();
    await expect(diagnostic.getByRole("button", { name: "Comenzar bloque" })).toHaveCount(0);
    await expect(diagnostic.getByText(/Respuesta correcta|La respuesta [A-D] es correcta/)).toHaveCount(0);

    for (let question = 0; question < 15; question += 1) {
      await diagnostic.getByRole("radio").first().check();
      if (question < 14) {
        await diagnostic.getByRole("button", { name: "Siguiente pregunta" }).click();
      } else {
        await diagnostic.getByRole("button", { name: "Entregar práctica y corregir" }).click();
      }
    }

    await expect(diagnostic.getByLabel("Corrección del bloque")).toBeVisible();
    await expect(diagnostic.getByRole("status")).toContainText("Has terminado esta práctica original.");
  });
});
