import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero section", async ({ page }) => {
    await expect(page.getByText("Buy proven AI assets.")).toBeVisible();
    await expect(page.getByText("Deploy in minutes.")).toBeVisible();
  });

  test("shows header nav links", async ({ page }) => {
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Browse" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Trending" })).toBeVisible();
  });

  test("shows marketplace stats", async ({ page }) => {
    const hero = page.locator("section").first();
    await expect(hero.getByText("Products")).toBeVisible();
    await expect(hero.getByText("Downloads")).toBeVisible();
  });

  test("shows category section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Browse by Category" })).toBeVisible();
  });

  test("shows how it works section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "How It Works" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "For Buyers" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "For Creators" })).toBeVisible();
  });

  test("shows trust strip", async ({ page }) => {
    await expect(page.getByText("Secure Checkout", { exact: true })).toBeVisible();
    await expect(page.getByText("Instant Access", { exact: true })).toBeVisible();
  });

  test("Browse Marketplace button navigates to search", async ({ page }) => {
    await page.getByRole("link", { name: "Browse Marketplace" }).click();
    await expect(page).toHaveURL(/\/search/);
  });

  test("shows sign in and start selling when logged out", async ({ page }) => {
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Start Selling" })).toBeVisible();
  });
});
