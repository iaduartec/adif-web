import { expect, test } from "@playwright/test";

const simulations = [
  { domain: "telecom", title: "Conocimientos específicos", bankCount: 134, examCount: 4 },
  { domain: "general-knowledge", title: "Conocimientos generales", bankCount: 80, examCount: 4 },
  { domain: "english-a2", title: "Inglés A2", bankCount: 49, examCount: 49 },
  { domain: "psychometric", title: "Psicotécnicos", bankCount: 39, examCount: 39 },
] as const;

for (const simulation of simulations) {
  test(`recorre el simulacro original completo de ${simulation.title}`, async ({ page }, testInfo) => {
    await page.goto("/simulacros/original");
    const card = page.locator("article.simulation-card", { hasText: simulation.title });
    await expect(card).toContainText(`${simulation.bankCount} preguntas originales revisadas disponibles`);
    await card.getByRole("link", { name: "Elegir y comenzar" }).click();

    await expect(page.getByRole("heading", { name: `Simulacro original: ${simulation.title}` })).toBeVisible();
    await expect(page.getByText(`${simulation.bankCount} preguntas originales revisadas disponibles`, { exact: false })).toBeVisible();
    await expect(page.getByLabel("Número de preguntas")).toHaveValue(String(simulation.bankCount));
    if (simulation.examCount < simulation.bankCount) {
      await page.getByLabel("Número de preguntas").fill(String(simulation.examCount));
    }
    await page.getByLabel("Tiempo límite orientativo en minutos (opcional)").fill("30");
    await page.getByRole("button", { name: "Iniciar simulacro original" }).click();

    await expect(page.getByText(/^Tiempo restante: 2[0-9]:[0-5][0-9]$/)).toBeVisible();
    await expect(page.getByText(`Pregunta 1 de ${simulation.examCount}`, { exact: false })).toBeVisible();
    const navigation = page.getByRole("navigation", { name: "Navegación del simulacro" });
    await expect(navigation.getByRole("button")).toHaveCount(simulation.examCount);
    await expect(page.getByText(/Respuesta correcta|Explicación/)).toHaveCount(0);

    for (let index = 0; index < simulation.examCount; index += 1) {
      if (index > 0) await navigation.getByRole("button", { name: `Pregunta ${index + 1}, en blanco` }).click();
      if (index !== 2) await page.getByRole("radio").first().check();
    }
    await navigation.getByRole("button", { name: "Pregunta 1, respondida" }).click();
    await page.getByRole("radio").nth(1).check();
    await page.getByRole("button", { name: "Entregar simulacro" }).click();

    const results = page.getByRole("region", { name: "Corrección del bloque" });
    await expect(results.getByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
    await expect(results).toContainText(`1 blanco de ${simulation.examCount}`);
    await expect(results.getByText("Resultado por materia")).toBeVisible();
    await expect(results.getByText("no es una nota oficial")).toBeVisible();
    await expect(results.locator(".border-t.border-rail.pt-3")).toHaveCount(simulation.examCount);
    if (simulation.domain === "english-a2") await expect(results).toContainText("Nora works from 8 to 12. She has lunch at home");
    if (simulation.domain === "psychometric") await expect(results.locator("img[alt]")).toHaveCount(52);
    await results.getByRole("heading", { name: "Resultados del simulacro original" }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`${simulation.domain}-escritorio.png`) });

    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await results.getByRole("heading", { name: "Resultados del simulacro original" }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`${simulation.domain}-movil.png`) });
  });

  test(`recupera sin cambiar respuestas, orden ni tiempo el simulacro de ${simulation.title}`, async ({ page }) => {
    let deliveryActions = 0;
    page.on("request", (request) => { if (request.headers()["next-action"]) deliveryActions += 1; });
    page.on("dialog", (dialog) => dialog.accept());
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/simulacros/original/${simulation.domain}`);
    await page.getByLabel("Número de preguntas").fill("3");
    await page.getByLabel("Tiempo límite orientativo en minutos (opcional)").fill("2");
    await page.getByRole("button", { name: "Iniciar simulacro original" }).click();

    const navigation = page.getByRole("navigation", { name: "Navegación del simulacro" });
    const firstPrompt = await page.getByRole("heading", { level: 3 }).textContent();
    await page.getByRole("radio").first().check();
    await navigation.getByRole("button", { name: "Pregunta 2, en blanco" }).click();
    const secondPrompt = await page.getByRole("heading", { level: 3 }).textContent();
    await page.getByRole("radio").nth(1).check();
    await navigation.getByRole("button", { name: "Pregunta 3, en blanco" }).click();
    const thirdPrompt = await page.getByRole("heading", { level: 3 }).textContent();
    const beforeReload = await page.getByText(/^Tiempo restante:/).textContent();
    await navigation.getByRole("button", { name: "Pregunta 1, respondida" }).click();
    await page.getByRole("radio").nth(1).check();
    const preDeliveryDraft = await page.evaluate((domain) => {
      const key = Object.keys(sessionStorage).find((candidate) => candidate.startsWith(`adif360:original-simulation:v2:${domain}:`));
      return key ? sessionStorage.getItem(key) : null;
    }, simulation.domain);
    expect(preDeliveryDraft).not.toBeNull();
    expect(preDeliveryDraft).not.toMatch(/correctAnswer|explanation|answerKey/i);
    const draftData = JSON.parse(preDeliveryDraft!) as { questionIds: string[]; answers: Record<string, string>; deadlineAt: number };
    expect(draftData.questionIds).toHaveLength(3);
    expect(Object.keys(draftData.answers)).toHaveLength(2);
    expect(draftData.deadlineAt).toBeGreaterThan(Date.now());
    await page.reload();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await expect(page.getByText(/Se recuperó el simulacro en esta pestaña/)).toBeVisible();
    await expect(page.getByRole("heading", { level: 3 })).toHaveText(firstPrompt!);
    await expect(page.getByRole("radio").nth(1)).toBeChecked();
    await expect(page.getByText(/^Tiempo restante:/)).not.toHaveText(beforeReload!);
    const recoveredNavigation = page.getByRole("navigation", { name: "Navegación del simulacro" });
    await expect(recoveredNavigation.getByRole("button", { name: "Pregunta 1, respondida" })).toBeVisible();
    await recoveredNavigation.getByRole("button", { name: "Pregunta 2, respondida" }).click();
    await expect(page.getByRole("heading", { level: 3 })).toHaveText(secondPrompt!);
    await expect(page.getByRole("radio").nth(1)).toBeChecked();
    await recoveredNavigation.getByRole("button", { name: "Pregunta 3, en blanco" }).click();
    await expect(page.getByRole("heading", { level: 3 })).toHaveText(thirdPrompt!);
    await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Entregar simulacro" }).click();
    const results = page.getByRole("region", { name: "Corrección del bloque" });
    await expect(results).toBeVisible();
    await expect(results).toContainText("1 blanco de 3");
    await expect(results.locator(".border-t.border-rail.pt-3")).toHaveCount(3);
    await expect.poll(() => deliveryActions).toBe(1);
    const delivered = await page.evaluate((domain) => {
      const key = Object.keys(sessionStorage).find((candidate) => candidate.startsWith(`adif360:original-simulation:v2:${domain}:`));
      return key ? sessionStorage.getItem(key) : null;
    }, simulation.domain);
    expect(delivered).toContain('"deliveryState":"delivered"');
    await page.reload();
    await expect(page.getByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
    await expect(page.getByText(/simulacro ya entregado en esta pestaña/)).toBeVisible();
    expect(deliveryActions).toBe(1);
    await page.getByRole("button", { name: "Nuevo simulacro" }).click();
    await expect(page.getByRole("button", { name: "Iniciar simulacro original" })).toBeVisible();
    const completedDrafts = await page.evaluate((domain) => Object.keys(sessionStorage)
      .filter((key) => key.startsWith(`adif360:original-simulation:v2:${domain}:`)), simulation.domain);
    expect(completedDrafts).toHaveLength(0);
  });
}

test("un borrador corrupto se descarta con un reinicio claro", async ({ page }) => {
  await page.addInitScript(() => {
    const read = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      if (key.startsWith("adif360:original-simulation:v2:telecom:")) return "{";
      return read.call(this, key);
    };
  });
  await page.goto("/simulacros/original/telecom");
  await expect(page.getByRole("status")).toContainText(/borrador local estaba dañado/);
  await expect(page.getByRole("button", { name: "Iniciar simulacro original" })).toBeVisible();
});

test("el examen continúa si el navegador bloquea sessionStorage", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError"); };
  });
  await page.goto("/simulacros/original/general-knowledge");
  await page.getByLabel("Número de preguntas").fill("3");
  await page.getByRole("button", { name: "Iniciar simulacro original" }).click();
  await expect(page.getByRole("status")).toContainText(/No se pudo guardar la recuperación local|almacenamiento de esta pestaña no está disponible/);
  await expect(page.getByRole("heading", { level: 3 })).toBeVisible();
  await page.getByRole("radio").first().check();
  await expect(page.getByRole("radio").first()).toBeChecked();
});

test("recuperar un simulacro cuyo deadline venció lo entrega sin reiniciar el tiempo", async ({ page }) => {
  await page.goto("/simulacros/original/telecom");
  await page.getByLabel("Número de preguntas").fill("3");
  await page.getByLabel("Tiempo límite orientativo en minutos (opcional)").fill("1");
  await page.getByRole("button", { name: "Iniciar simulacro original" }).click();
  await page.evaluate(() => {
    const key = Object.keys(sessionStorage).find((candidate) => candidate.startsWith("adif360:original-simulation:v2:telecom:"))!;
    const draft = JSON.parse(sessionStorage.getItem(key)!);
    draft.deadlineAt = Date.now() - 1;
    sessionStorage.setItem(key, JSON.stringify(draft));
  });
  await page.reload();
  const results = page.getByRole("region", { name: "Corrección del bloque" });
  await expect(results).toBeVisible();
  await expect(results).toContainText("3 blancos de 3");
  await expect(results).toHaveCount(1);
});
