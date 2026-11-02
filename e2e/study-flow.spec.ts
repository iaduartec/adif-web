import { expect, test } from "@playwright/test";

test("studies PRL, practices from the lesson, receives correction and finds the saved error", async ({ page }) => {
  await page.goto("/curso/prevencion-riesgos-laborales");

  const startPractice = page.getByRole("link", { name: "Iniciar práctica" });
  await expect(startPractice).toBeVisible();
  await startPractice.click();

  await expect(page).toHaveURL(/\/curso\/prevencion-riesgos-laborales\?view=theory#course-practice-questions$/);
  const practice = page.getByRole("region", { name: "Práctica original de conocimientos generales" });
  await expect(practice).toBeVisible();
  await expect(practice.getByText("Preguntas originales; no constituyen una simulación oficial de ADIF.")).toBeVisible();

  await practice.getByLabel("Cantidad de preguntas").fill("1");
  await practice.getByRole("button", { name: "Comenzar bloque" }).click();
  await expect(practice.getByText("Pregunta 1 de 1", { exact: false })).toBeVisible();
  await expect(practice.getByText(/Respuesta correcta|La respuesta [A-D] es correcta/)).toHaveCount(0);
  await expect(practice.getByRole("link", { name: /Ley 31\/1995 · Artículo 1/ })).toBeVisible();

  // The first authored item is keyed B; selecting A deliberately creates an error.
  await practice.getByRole("radio", { name: /A\./ }).check();
  await practice.getByRole("button", { name: "Comprobar respuesta" }).click();
  await expect(practice.getByText(/Respuesta incorrecta\. Respuesta correcta: B\./)).toBeVisible();
  await expect(practice.getByText(/A: Incorrecta/)).toBeVisible();
  await expect(practice.getByText(/B: Correcta/)).toBeVisible();
  await expect(practice.getByText(/C: Incorrecta/)).toBeVisible();
  await expect(practice.getByText(/D: Incorrecta/)).toBeVisible();

  await page.goto("/errores");
  await expect(page.getByRole("heading", { name: "Cuaderno de errores" })).toBeVisible();
  const savedPractice = page.getByRole("region", { name: "Repaso de errores originales" });
  await expect(savedPractice).toBeVisible();
  await savedPractice.getByRole("button", { name: "Comenzar bloque" }).click();
  await expect(savedPractice.getByText("Pregunta 1 de 1", { exact: false })).toBeVisible();
  await expect(savedPractice.getByText(/Según el artículo 1 de la Ley 31\/1995/)).toBeVisible();
});
