import { describe, it, expect, beforeAll } from "vitest";
import { login, fetchPage, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

/*
 * Dashboard pages now live under src/app/[locale]/(dashboard)/dashboard/*.
 * With localePrefix: "as-needed" the /en prefix is optional for the default
 * locale, so bare paths like /dashboard/overview still resolve.
 *
 * Removed pages (no page.tsx): bundles, collections, notifications, analytics.
 */
const dashboardPages = [
  "/dashboard/overview",
  "/dashboard/rulesets",
  "/dashboard/rulesets/new",
  "/dashboard/earnings",
  "/dashboard/purchases",
  "/dashboard/saved",
];

describe("Dashboard pages (authenticated)", () => {
  for (const page of dashboardPages) {
    it(`GET ${page} — 200`, async () => {
      const { status } = await fetchPage(page, alice.cookies);
      expect(status).toBe(200);
    });
  }
});

describe("Dashboard pages (unauthenticated)", () => {
  it("redirects to login", async () => {
    // Proxy middleware redirects unauthenticated users to /login
    const { status } = await fetchPage("/dashboard/overview");
    expect([302, 307]).toContain(status);
  });
});
