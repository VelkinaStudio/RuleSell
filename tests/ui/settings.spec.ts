import { test, expect } from "@playwright/test";
import { login, ACCOUNTS } from "./helpers";

test.describe("Settings pages", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ACCOUNTS.alice.email, ACCOUNTS.alice.password);
  });

  test("billing page renders", async ({ page }) => {
    await page.goto("/settings/billing");
    await expect(page.locator("body")).toContainText(/billing|subscription|plan/i);
  });

  test("notifications settings page renders", async ({ page }) => {
    await page.goto("/settings/notifications");
    await expect(page.locator("body")).toContainText(/notification/i);
  });
});
