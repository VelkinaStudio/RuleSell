import { test, expect } from "@playwright/test";
import { login, ACCOUNTS } from "./helpers";

test.describe("Login flow", () => {
  test("shows login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("alice@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid email or password")).toBeVisible({ timeout: 10000 });
  });

  test("logs in successfully and shows Publish button", async ({ page }) => {
    await login(page, ACCOUNTS.alice.email, ACCOUNTS.alice.password);
    await expect(page.getByRole("link", { name: "Publish" })).toBeVisible({ timeout: 10000 });
  });

  test("Forgot password link navigates to reset page", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await expect(page).toHaveURL(/\/reset-password/);
  });

  test("Sign up link on login page navigates to signup", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/signup/);
  });
});

test.describe("Signup page", () => {
  test("shows signup form fields", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByPlaceholder("Jane Smith")).toBeVisible();
    await expect(page.getByPlaceholder("janesmith")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("At least 8 characters")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  });

  test("Sign in link on signup page navigates to login", async ({ page }) => {
    await page.goto("/signup");
    const form = page.locator("form").locator("..");
    await form.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
