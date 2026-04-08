import { test, expect } from "@playwright/test";
import { login, ACCOUNTS } from "./helpers";

test.describe("Header navigation (logged out)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("logo links to homepage", async ({ page }) => {
    const header = page.locator("header");
    await header.getByRole("link", { name: "Ruleset" }).click();
    await expect(page).toHaveURL("/");
  });

  test("Browse link navigates to search", async ({ page }) => {
    const header = page.locator("header");
    await header.getByRole("link", { name: "Browse" }).click();
    await expect(page).toHaveURL(/\/search/);
  });

  test("Trending link navigates to trending", async ({ page }) => {
    const header = page.locator("header");
    await header.getByRole("link", { name: "Trending" }).click();
    await expect(page).toHaveURL(/\/trending/);
  });
});

test.describe("Header navigation (logged in)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ACCOUNTS.alice.email, ACCOUNTS.alice.password);
  });

  test("shows Publish button", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Publish" })).toBeVisible();
  });

  test("Publish navigates to new ruleset form", async ({ page }) => {
    await page.getByRole("link", { name: "Publish" }).click();
    await expect(page).toHaveURL(/\/dashboard\/rulesets\/new/);
  });

  test("avatar links to dashboard", async ({ page }) => {
    const avatar = page.locator('a[href="/dashboard/overview"]');
    await expect(avatar).toBeVisible();
    await avatar.click();
    await expect(page).toHaveURL(/\/dashboard\/overview/);
  });
});

test.describe("Header search", () => {
  test("search input submits and navigates", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder("Search prompts, rules, workflows...");
    await searchInput.fill("cursor");
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=cursor/);
  });
});
