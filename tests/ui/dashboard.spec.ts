import { test, expect } from "@playwright/test";
import { login, ACCOUNTS } from "./helpers";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ACCOUNTS.alice.email, ACCOUNTS.alice.password);
  });

  test("overview page renders", async ({ page }) => {
    await page.goto("/dashboard/overview");
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });

  test("sidebar navigation works", async ({ page }) => {
    await page.goto("/dashboard/overview");
    const sidebar = page.locator("aside");
    await sidebar.getByRole("link", { name: "My Rulesets" }).click();
    await expect(page).toHaveURL(/\/dashboard\/rulesets/);
  });

  test("rulesets page renders", async ({ page }) => {
    await page.goto("/dashboard/rulesets");
    await expect(page.getByRole("heading", { name: /rulesets/i })).toBeVisible();
  });

  test("new ruleset page renders form", async ({ page }) => {
    await page.goto("/dashboard/rulesets/new");
    // Should contain a form or heading related to creating
    await expect(page.locator("main")).toContainText(/create|new|publish|title/i);
  });

  test("purchases page renders", async ({ page }) => {
    await page.goto("/dashboard/purchases");
    await expect(page.getByRole("heading", { name: /purchases/i })).toBeVisible();
  });

  test("saved page renders", async ({ page }) => {
    await page.goto("/dashboard/saved");
    await expect(page.getByRole("heading", { name: /saved/i })).toBeVisible();
  });

  test("collections page renders", async ({ page }) => {
    await page.goto("/dashboard/collections");
    await expect(page.getByRole("heading", { name: /collections/i })).toBeVisible();
  });

  test("notifications page renders", async ({ page }) => {
    await page.goto("/dashboard/notifications");
    await expect(page.getByRole("heading", { name: /notification/i })).toBeVisible();
  });

  test("bundles page renders", async ({ page }) => {
    await page.goto("/dashboard/bundles");
    await expect(page.getByRole("heading", { name: /bundles/i })).toBeVisible();
  });

  test("earnings page renders with summary cards", async ({ page }) => {
    await page.goto("/dashboard/earnings");
    await expect(page.getByRole("heading", { name: /earnings/i })).toBeVisible();
    await expect(page.getByText("Total Earned")).toBeVisible();
    await expect(page.getByText("Paid Out")).toBeVisible();
    await expect(page.getByText("Pending")).toBeVisible();
  });

  test("analytics page renders", async ({ page }) => {
    await page.goto("/dashboard/analytics");
    await expect(page.getByRole("heading", { name: /analytics/i })).toBeVisible();
  });
});
