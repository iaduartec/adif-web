import { expect, test } from "@playwright/test";

test("responde, corrige, guarda y recupera un fallo original", async ({ page }, testInfo) => {
  await page.goto("/ingles-a2");
  const session = page.getByRole("region", { name: "Práctica de inglés A2" });
  await expect(session).toBeVisible();
  await session.getByLabel("Cantidad de preguntas").fill("1");
  await session.getByRole("button", { name: "Comenzar bloque" }).click();
  await expect(session.getByText("Pregunta 1 de 1", { exact: false })).toBeVisible();
  await expect(session.getByText("Respuesta incorrecta", { exact: false })).toHaveCount(0);
  await session.getByRole("radio").first().check();
  await session.getByRole("button", { name: "Comprobar respuesta" }).click();
  await expect(session.getByText("Respuesta incorrecta", { exact: false })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("correccion.png"), fullPage: true });

  await page.goto("/errores");
  await expect(page.getByRole("heading", { name: "Repetir errores de preguntas originales" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Repetir errores de preguntas originales" })).toBeVisible();
  await expect(page.getByText("Un acierto no demuestra dominio duradero.")).toBeVisible();

  await page.goto("/estadisticas");
  const progress = testInfo.project.name === "mobile"
    ? page.getByRole("list", { name: "Progreso móvil por materia de preguntas originales" })
    : page.getByRole("table", { name: "Progreso por materia de preguntas originales" });
  const englishProgress = testInfo.project.name === "mobile"
    ? progress.getByRole("listitem").filter({ hasText: "Inglés A2" })
    : progress.getByRole("row", { name: /Inglés A2/ });
  await expect(englishProgress).toContainText("1 de 22 revisadas");
  await progress.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("estadisticas.png") });
});

test("practica las otras tres materias y permite cambiar una respuesta", async ({ page }) => {
  const areas = [
    { path: "/psicotecnicos", name: "Práctica original por aptitud" },
    { path: "/curso/igualdad?view=theory", name: "Práctica original de conocimientos generales" },
    { path: "/curso/ict-rd-346-2011?view=theory", name: "Práctica original de telecomunicaciones" },
  ];
  for (const area of areas) {
    await page.goto(area.path);
    const session = page.getByRole("region", { name: area.name });
    await expect(session).toBeVisible();
    await session.getByLabel("Cantidad de preguntas").fill("1");
    await session.getByRole("radio", { name: /Práctica/ }).check();
    await session.getByRole("button", { name: "Comenzar bloque" }).click();
    const choices = session.getByRole("radio");
    await choices.nth(0).check();
    await choices.nth(1).check();
    await expect(choices.nth(1)).toBeChecked();
    await expect(session.getByLabel("Corrección del bloque")).toHaveCount(0);
    await session.getByRole("button", { name: "Entregar práctica y corregir" }).click();
    await expect(session.getByLabel("Corrección del bloque")).toBeVisible();
  }
});
