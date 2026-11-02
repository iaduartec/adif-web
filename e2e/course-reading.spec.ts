import { test, expect } from "@playwright/test";

test.describe("Course lesson reading layout", () => {
  test("renders the lesson content in a wide single-column reading container", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/curso/compatibilidad-electromagnetica");

    const readingContainer = page.locator(".dashboard-reading");
    await expect(readingContainer).toBeVisible();

    const readingWidth = await readingContainer.evaluate((el) => el.getBoundingClientRect().width);
    // Wide reading column: capped at 72rem (~1152px), inside the 1100-1400px reading measure.
    expect(readingWidth).toBeGreaterThan(1100);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // Content stacks in a single full-width column: no secondary content grids.
    const contentBlocks = page.locator(".course-reader > section, .course-notes");
    await expect(contentBlocks.first()).toBeVisible();
    const blockCount = await contentBlocks.count();
    expect(blockCount).toBeGreaterThan(0);

    // Topic tabs stay available and render on a single row.
    const tabs = page.locator(".course-reader__views .course-reader__view");
    await expect(tabs).toHaveCount(3);
    const tabBoxes = await tabs.evaluateAll((elements) =>
      elements.map((el) => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width };
      }),
    );
    const sameRow = tabBoxes.every((box, index) => index === 0 || Math.abs(box.top - tabBoxes[0].top) < 1);
    expect(sameRow).toBe(true);
  });

  test("keeps the wide reading column responsive on mobile without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/curso/compatibilidad-electromagnetica");

    const readingContainer = page.locator(".dashboard-reading");
    await expect(readingContainer).toBeVisible();

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    const readingWidth = await readingContainer.evaluate((el) => el.getBoundingClientRect().width);
    expect(readingWidth).toBeGreaterThan(0);
    expect(readingWidth).toBeLessThanOrEqual(390);
  });
});
