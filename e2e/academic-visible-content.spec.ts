import { expect, test } from "@playwright/test";

test("los once módulos enlazados permiten abrir su teoría", async ({ page }) => {
  const slugs = ["igualdad", "prevencion-riesgos-laborales", "estatuto-adif", "codigo-conducta", "incompatibilidades", "ict-rd-346-2011", "compatibilidad-electromagnetica", "rcf-libro-1", "declaracion-red-2027", "psicometria", "ingles-a2"];
  await page.goto("/curso");
  for (const slug of slugs) {
    await expect(page.locator(`a[href="/curso/${slug}"]`)).toBeVisible();
    await page.goto(`/curso/${slug}?view=theory`);
    await expect(page.getByRole("heading", { name: "Teoría y Supuestos de Examen" })).toBeVisible();
    await expect(page.locator(".course-concept").first()).toBeVisible();
    await page.goto("/curso");
  }
});

for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
  test(`muestra las aclaraciones normativas al estudiante (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/curso/incompatibilidades?view=theory");
    await expect(page.getByText(/ningún cargo, profesión o actividad, pública o privada/)).toBeVisible();
    await page.goto("/curso/rcf-libro-1?view=theory");
    await expect(page.getByText(/Los cambiadores de ancho y las bases de mantenimiento cuentan como estación/)).toBeVisible();
    await page.goto("/curso/prevencion-riesgos-laborales?view=theory");
    await expect(page.getByText(/El acceso de terceros a los datos médicos personales se limita/)).toBeVisible();
    await page.goto("/curso/ict-rd-346-2011?view=theory");
    await expect(page.locator("#concept-ict-concept-62").getByText(/El RITU-A puede instalarse en edificios/)).toBeVisible();
    await page.goto("/fichas");
    await page.getByRole("button", { name: "E4 Incompatibilidades" }).click();
    await expect(page.getByText(/Qué límite general establece el artículo 1.3/)).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
