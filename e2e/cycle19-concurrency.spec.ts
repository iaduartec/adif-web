import { expect, test } from "@playwright/test";

async function startAttempt(page: import("@playwright/test").Page) {
  await page.goto("/simulacros/original/telecom");
  await page.getByLabel("Número de preguntas").fill("3");
  await page.getByRole("button", { name: "Iniciar simulacro original" }).click();
  await expect(page.getByRole("heading", { level: 3 })).toBeVisible();
}

async function openCopiedTab(page: import("@playwright/test").Page) {
  const popupPromise = page.waitForEvent("popup");
  await page.evaluate(() => window.open(location.href, "_blank"));
  return popupPromise;
}

test("el propietario puede responder y entregar el intento; una copia queda en solo lectura", async ({ page }) => {
  await startAttempt(page);
  await page.getByRole("radio").first().check();

  const copy = await openCopiedTab(page);
  await expect(copy.getByText("Este intento está abierto en otra pestaña")).toBeVisible();
  await expect(copy.getByRole("radio")).toHaveCount(0);
  await expect(copy.getByRole("button", { name: "Entregar simulacro" })).toHaveCount(0);
  await expect(copy.getByRole("link", { name: "Volver a simulacros" })).toBeVisible();
  await expect(copy.getByRole("button", { name: "Iniciar un nuevo intento" })).toBeVisible();

  const returningCopy = await openCopiedTab(page);
  await expect(returningCopy.getByText("Este intento está abierto en otra pestaña")).toBeVisible();
  await returningCopy.getByRole("link", { name: "Volver a simulacros" }).click();
  await expect(returningCopy).toHaveURL(/\/simulacros(?:\/original)?\/?(?:\?|$)/);

  copy.on("dialog", (dialog) => dialog.accept());
  await copy.getByRole("button", { name: "Iniciar un nuevo intento" }).click();
  await expect(copy.getByRole("button", { name: "Iniciar simulacro original" })).toBeVisible();

  let deliveryCalls = 0;
  page.on("request", (request) => {
    if (request.headers()["next-action"]) deliveryCalls += 1;
  });
  await page.getByRole("button", { name: "Entregar simulacro" }).click();
  await expect(page.getByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
  expect(deliveryCalls).toBe(1);
});

test("al cerrar el propietario se libera el intento para la copia que vuelve a cargar", async ({ page }) => {
  await startAttempt(page);
  await page.getByRole("radio").nth(1).check();

  const copy = await openCopiedTab(page);
  await expect(copy.getByText("Este intento está abierto en otra pestaña")).toBeVisible();
  await page.getByRole("radio").first().check();
  await page.close();

  // Reload asks Web Locks for the same attempt after the previous owner has closed.
  await copy.reload();
  await expect(copy.getByText("Este intento está abierto en otra pestaña")).toHaveCount(0);
  await expect(copy.getByRole("radio").nth(1)).toBeEnabled();
  await expect(copy.getByRole("radio").nth(1)).toBeChecked();
  await expect(copy.getByRole("status")).toContainText("no incluye cambios posteriores realizados en otra pestaña");
  await copy.getByRole("button", { name: "Entregar simulacro" }).click();
  await expect(copy.getByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
});

test("una copia anterior no entrega tras cerrar el propietario que ya entregó", async ({ page }) => {
  await startAttempt(page);
  await page.getByRole("radio").first().check();
  const copy = await openCopiedTab(page);
  await expect(copy.getByText("Este intento está abierto en otra pestaña")).toBeVisible();
  await page.getByRole("button", { name: "Entregar simulacro" }).click();
  await expect(page.getByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
  await page.close();
  await copy.reload();
  await expect(copy.getByText("Este intento está abierto en otra pestaña")).toBeVisible();
  await expect(copy.getByRole("button", { name: "Entregar simulacro" })).toHaveCount(0);
  await expect(copy.getByRole("button", { name: "Iniciar un nuevo intento" })).toBeVisible();
});

test("sin Web Locks muestra el aviso y trata el rechazo como confirmación desconocida", async ({ page }) => {
  await page.context().addInitScript(() => {
    Object.defineProperty(navigator, "locks", { configurable: true, value: undefined });
  });
  await startAttempt(page);
  await expect(page.getByText("No se pudo coordinar este intento entre pestañas")).toBeVisible();
  await page.getByRole("radio").first().check();

  const copy = await openCopiedTab(page);
  await expect(copy.getByText("No se pudo coordinar este intento entre pestañas")).toBeVisible();
  await copy.getByRole("radio").nth(1).check();

  await page.getByRole("button", { name: "Entregar simulacro" }).click();
  await expect(page.getByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
  await copy.getByRole("button", { name: "Entregar simulacro" }).click();
  await expect(copy.getByText(/No sabemos si la entrega se completó/i)).toBeVisible();
  await expect(copy.getByRole("heading", { name: "Resultados del simulacro original" })).toHaveCount(0);
});

test("sin Web Locks dos pestañas pueden iniciar entregas simultáneas", async ({ page }) => {
  await page.context().addInitScript(() => {
    Object.defineProperty(navigator, "locks", { configurable: true, value: undefined });
  });
  await startAttempt(page);
  await page.getByRole("radio").first().check();
  const copy = await openCopiedTab(page);
  await expect(copy.getByText("No se pudo coordinar este intento entre pestañas")).toBeVisible();
  await copy.getByRole("radio").nth(1).check();

  let actionCalls = 0;
  let completedRequests = 0;
  let releaseBarrier!: () => void;
  const bothRequestsArrived = new Promise<void>((resolve) => { releaseBarrier = resolve; });
  await page.context().route("**/*", async (route) => {
    if (!route.request().headers()["next-action"]) {
      await route.continue();
      return;
    }
    actionCalls += 1;
    if (actionCalls === 2) releaseBarrier();
    await bothRequestsArrived;
    const response = await route.fetch();
    await route.fulfill({ response });
    completedRequests += 1;
  });

  await Promise.all([
    page.getByRole("button", { name: "Entregar simulacro" }).click(),
    copy.getByRole("button", { name: "Entregar simulacro" }).click(),
  ]);
  await expect.poll(() => actionCalls).toBe(2);
  await expect.poll(() => completedRequests).toBe(2);
  const terminalOutcome = (target: import("@playwright/test").Page) => target.getByRole("heading", { name: "Resultados del simulacro original" }).count()
    .then(async (results) => results + await target.getByRole("status").filter({ hasText: /No sabemos si la entrega se completó|No se ha podido confirmar|puede haberse entregado desde otra pestaña/ }).count());
  await expect.poll(() => terminalOutcome(page)).toBeGreaterThan(0);
  await expect.poll(() => terminalOutcome(copy)).toBeGreaterThan(0);
  await expect(page.getByText("Este intento está abierto en otra pestaña")).toHaveCount(0);
  await expect(copy.getByText("Este intento está abierto en otra pestaña")).toHaveCount(0);
  // Requests reached the server concurrently; this test does not claim a real database outcome.
});

test("si se pierde la confirmación, la recarga no reenvía automáticamente", async ({ page }) => {
  await startAttempt(page);
  await page.getByRole("radio").first().check();

  let actionCalls = 0;
  let fetchedStatus = 0;
  await page.route("**/*", async (route) => {
    if (!route.request().headers()["next-action"]) {
      await route.continue();
      return;
    }
    actionCalls += 1;
    const response = await route.fetch();
    fetchedStatus = response.status();
    await route.abort();
  });

  await page.getByRole("button", { name: "Entregar simulacro" }).click();
  const unknownStatus = page.getByRole("status").filter({ hasText: "No sabemos si la entrega se completó" });
  await expect(unknownStatus).toBeVisible();
  expect(actionCalls).toBe(1);
  expect(fetchedStatus).toBeGreaterThan(0);

  await page.reload();
  await expect(unknownStatus).toBeVisible();
  expect(actionCalls).toBe(1);
});
