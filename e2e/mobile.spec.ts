import { test, expect } from "@playwright/test";

test.describe("Mobile viewport verification (390x844)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("verifies layout compatibility and responsive reading bounds", async ({ page }) => {
    await page.goto("/");

    // 1. Check no horizontal scrollbar/overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // 2. Open mobile sidebar/navigation trigger
    const menuButton = page.locator("button.mobile-navigation-trigger");
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Verify drawer/sheet overlay is visible
      await expect(page.locator(".mobile-navigation-dialog")).toBeVisible();
    }

    // 3. Verify readable measure limits on lesson page
    await page.goto("/curso/igualdad");
    const readingContainer = page.locator(".dashboard-reading");
    await expect(readingContainer).toBeVisible();

    const maxWidth = await readingContainer.evaluate((el) => {
      return window.getComputedStyle(el).maxWidth;
    });
    // Max width computes to a pixel value representing 72ch (typically around 640px)
    const numericWidth = parseFloat(maxWidth);
    expect(numericWidth).toBeGreaterThanOrEqual(500);
    expect(numericWidth).toBeLessThanOrEqual(700);
  });
});
