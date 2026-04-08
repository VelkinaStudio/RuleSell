import { test, expect } from "@playwright/test";
import { login, ACCOUNTS } from "./helpers";

test.describe("Ruleset detail page", () => {
  test("navigating from search to detail shows title", async ({ page }) => {
    await page.goto("/search");
    const firstCard = page.locator('a[href^="/r/"]').first();
    if (!(await firstCard.isVisible())) {
      test.skip();
      return;
    }

    const title = await firstCard.locator("h3").textContent();
    await firstCard.click();
    await expect(page).toHaveURL(/\/r\//);

    if (title) {
      await expect(page.locator("main")).toContainText(title);
    }
  });

  test("detail page shows price or free badge", async ({ page }) => {
    await page.goto("/search");
    const firstCard = page.locator('a[href^="/r/"]').first();
    if (!(await firstCard.isVisible())) {
      test.skip();
      return;
    }
    await firstCard.click();
    await expect(page).toHaveURL(/\/r\//);

    // Should show either a price ($) or "Free"
    const main = page.locator("main");
    const hasFree = await main.getByText("Free").isVisible().catch(() => false);
    const hasPrice = await main.getByText("$").first().isVisible().catch(() => false);
    expect(hasFree || hasPrice).toBe(true);
  });

  test("detail page shows platform and type badges", async ({ page }) => {
    await page.goto("/search");
    const firstCard = page.locator('a[href^="/r/"]').first();
    if (!(await firstCard.isVisible())) {
      test.skip();
      return;
    }
    await firstCard.click();
    await expect(page).toHaveURL(/\/r\//);

    // Should show at least one badge-like element with platform or type
    const main = page.locator("main");
    const text = await main.textContent();
    const hasPlatformOrType = /CURSOR|VSCODE|N8N|CLAUDE|CHATGPT|RULESET|PROMPT|WORKFLOW|AGENT/i.test(text || "");
    expect(hasPlatformOrType).toBe(true);
  });
});
