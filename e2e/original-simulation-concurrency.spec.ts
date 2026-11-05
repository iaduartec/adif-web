import { expect, test } from "@playwright/test";

test("sin Web Locks una copia informa que no se puede confirmar la entrega", async ({ page, context }) => {
  await context.addInitScript(() => Object.defineProperty(navigator, "locks", { value: undefined, configurable: true }));
  await page.goto("/simulacros/original/telecom");
  await page.getByLabel("Número de preguntas").fill("3");
  await page.getByRole("button", { name: "Iniciar simulacro original" }).click();
  await page.getByRole("radio").first().check();

  const popupPromise = page.waitForEvent("popup");
  await page.evaluate(() => window.open(location.href, "_blank"));
  const copy = await popupPromise;
  await expect(copy.getByText(/Se recuperó el simulacro en esta pestaña/)).toBeVisible();
  await copy.getByRole("radio").nth(1).check();

  let firstCalls = 0;
  let copyCalls = 0;
  page.on("request", (request) => { if (request.headers()["next-action"]) firstCalls++; });
  copy.on("request", (request) => { if (request.headers()["next-action"]) copyCalls++; });
  await page.getByRole("button", { name: "Entregar simulacro" }).click();
  await expect(page.getByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
  await copy.getByRole("button", { name: "Entregar simulacro" }).click();
  await expect(copy.getByText(/No sabemos si la entrega se completó/)).toBeVisible();
  await expect(copy.getByRole("button", { name: "Iniciar un nuevo intento" })).toBeVisible();
  await expect(copy.getByRole("link", { name: "Volver a simulacros" })).toBeVisible();
  expect(firstCalls).toBe(1);
  expect(copyCalls).toBe(1);
  await expect(copy.getByRole("heading", { name: "Resultados del simulacro original" })).toHaveCount(0);
});

test("un borrador de otro ámbito no se recupera en la pestaña", async ({ page }) => {
  await page.goto("/simulacros/original/general-knowledge");
  await page.getByLabel("Número de preguntas").fill("3");
  await page.getByRole("button", { name: "Iniciar simulacro original" }).click();
  await page.getByRole("radio").first().check();
  await page.evaluate(() => {
    const key = Object.keys(sessionStorage).find((value) => value.startsWith("adif360:original-simulation:v2:general-knowledge:"))!;
    const saved = sessionStorage.getItem(key)!;
    sessionStorage.removeItem(key);
    sessionStorage.setItem(key.replace(/[a-f0-9]{24}$/, "000000000000000000000000"), saved);
  });
  await page.reload();
  await expect(page.getByRole("button", { name: "Iniciar simulacro original" })).toBeVisible();
  await expect(page.getByText(/Se recuperó el simulacro en esta pestaña/)).toHaveCount(0);
});
