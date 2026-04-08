import { test, expect } from "@playwright/test";
import { login, ACCOUNTS } from "./helpers";

test.describe("Admin dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ACCOUNTS.admin.email, ACCOUNTS.admin.password);
  });

  test("admin home page renders", async ({ page }) => {
    await page.goto("/admin");
    // Should show admin dashboard content
    await expect(page.locator("body")).toContainText(/admin|dashboard|users|rulesets/i);
  });

  test("users management page renders", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("body")).toContainText(/users/i);
  });

  test("rulesets moderation page renders", async ({ page }) => {
    await page.goto("/admin/rulesets");
    await expect(page.locator("body")).toContainText(/rulesets/i);
  });

  test("reports page renders", async ({ page }) => {
    await page.goto("/admin/reports");
    await expect(page.locator("body")).toContainText(/reports/i);
  });
});
