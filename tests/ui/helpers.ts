import { type Page, expect } from "@playwright/test";

/**
 * Log in via the UI login form.
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Wait for redirect to homepage or dashboard
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
}

export const ACCOUNTS = {
  alice: { email: "alice@example.com", password: "password123" },
  bob: { email: "bob@example.com", password: "password123" },
  admin: { email: "admin@ruleset.ai", password: "password123" },
} as const;
