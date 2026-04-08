import { test, expect } from "@playwright/test";

test.describe("Search page", () => {
  test("renders search page with results", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByRole("heading", { name: "Browse Rulesets" })).toBeVisible();
    await expect(page.getByText("results")).toBeVisible();
  });

  test("shows filter sidebar labels", async ({ page }) => {
    await page.goto("/search");
    const aside = page.locator("aside");
    await expect(aside.getByText("Sort")).toBeVisible();
    await expect(aside.getByText("Platform")).toBeVisible();
    await expect(aside.getByText("Type")).toBeVisible();
  });

  test("sort filter changes URL", async ({ page }) => {
    await page.goto("/search");
    const aside = page.locator("aside");
    await aside.getByRole("button", { name: "Trending" }).click();
    await expect(page).toHaveURL(/sort=trending/);
  });

  test("platform filter changes URL", async ({ page }) => {
    await page.goto("/search");
    const aside = page.locator("aside");
    await aside.getByRole("button", { name: "CURSOR" }).click();
    await expect(page).toHaveURL(/platform=CURSOR/);
  });

  test("type filter changes URL", async ({ page }) => {
    await page.goto("/search");
    const aside = page.locator("aside");
    await aside.getByRole("button", { name: "WORKFLOW" }).click();
    await expect(page).toHaveURL(/type=WORKFLOW/);
  });

  test("ruleset cards are clickable", async ({ page }) => {
    await page.goto("/search");
    const firstCard = page.locator('a[href^="/r/"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/r\//);
    }
  });
});
