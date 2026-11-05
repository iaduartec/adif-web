import { expect, test, type Page } from "@playwright/test";

async function tabUntil(page: Page, accessibleText: string) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const active = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? "");
    if (active === accessibleText) return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`No se alcanzó «${accessibleText}» con Tab.`);
}

test("recorre el simulacro con teclado y mantiene el foco en el enunciado", async ({ page }) => {
  await page.goto("/simulacros/original/psychometric");
  await page.getByLabel("Número de preguntas").fill("3");
  await page.getByRole("button", { name: "Iniciar simulacro original" }).click();

  const heading = page.getByRole("heading", { level: 3 });
  await expect(heading).toBeFocused();

  await expect(page.getByRole("radio").first()).toBeEnabled();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("radio").first()).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("radio").first()).toBeChecked();

  await tabUntil(page, "Siguiente pregunta");
  await page.keyboard.press("Enter");
  await expect(heading).toBeFocused();

  await tabUntil(page, "Anterior");
  await page.keyboard.press("Enter");
  await expect(heading).toBeFocused();
  await expect(page.getByRole("radio").first()).toBeChecked();
});

test("mantiene el reloj fuera de las regiones vivas y lo anuncia solo en umbrales", async ({ page }) => {
  await page.goto("/simulacros/original/telecom");
  await page.getByLabel("Número de preguntas").fill("2");
  await page.getByLabel("Tiempo límite orientativo en minutos (opcional)").fill("30");
  await page.getByRole("button", { name: "Iniciar simulacro original" }).click();

  const timer = page.getByRole("timer");
  await expect(timer).toBeVisible();
  await expect(timer).toHaveAttribute("aria-live", "off");
  await expect(timer).toHaveText(/^Tiempo restante: 29:5\d$/);

  const announcement = page.getByTestId("simulation-timer-announcement");
  await expect(announcement).toHaveAttribute("aria-live", "polite");
  await expect(announcement).toBeEmpty();
});

test("se reflowa a 320 px sin desplazamiento horizontal durante el simulacro", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/simulacros/original/general-knowledge");
  await page.getByLabel("Número de preguntas").fill("3");
  await page.getByRole("button", { name: "Iniciar simulacro original" }).click();

  await expect(page.getByRole("heading", { level: 3 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const navigation = page.getByRole("navigation", { name: "Navegación del simulacro" });
  for (let index = 0; index < 3; index += 1) {
    const box = await navigation.getByRole("button").nth(index).boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }

  await page.getByRole("radio").first().check();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
