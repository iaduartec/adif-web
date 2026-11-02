import { expect, test } from "@playwright/test";

test.describe("Mobile study flow (390x844)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps answer options withheld from the question listing", async ({ page }) => {
    await page.goto("/tests");

    await expect(page.getByRole("heading", { name: "Preguntas oficiales" })).toBeVisible();
    await expect(page.locator(".official-question-options:visible")).toHaveCount(0);
    await expect(page.locator(".official-question-options-note:visible")).toHaveCount(0);
    await expect(page.getByRole("radio")).toHaveCount(0);
  });

  test("shows usable answer controls in active original PRL practice", async ({ page }) => {
    await page.goto("/curso/prevencion-riesgos-laborales");
    await page.getByRole("link", { name: "Iniciar práctica" }).click();

    const practice = page.getByRole("region", { name: "Práctica original de conocimientos generales" });
    await expect(practice).toBeVisible();
    await practice.getByLabel("Cantidad de preguntas").fill("1");
    await practice.getByRole("button", { name: "Comenzar bloque" }).click();

    const options = practice.locator("label.practice-option");
    const radios = practice.getByRole("radio");
    await expect(options).toHaveCount(4);
    await expect(radios).toHaveCount(4);
    for (let index = 0; index < 4; index += 1) {
      await expect(radios.nth(index)).toBeVisible();
      const label = options.nth(index);
      const dimensions = await label.boundingBox();
      expect(dimensions?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect(await label.locator("input[type='radio']").count()).toBe(1);
    }

    await radios.nth(0).focus();
    await page.keyboard.press("ArrowDown");
    await expect(radios.nth(1)).toBeChecked();

    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  });
});
