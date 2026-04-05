import { describe, it, expect, beforeAll } from "vitest";
import { login, fetchPage, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

const dashboardPages = [
  "/dashboard/overview",
  "/dashboard/rulesets",
  "/dashboard/rulesets/new",
  "/dashboard/bundles",
  "/dashboard/earnings",
  "/dashboard/purchases",
  "/dashboard/saved",
  "/dashboard/collections",
  "/dashboard/notifications",
  "/dashboard/analytics",
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
    // Proxy redirects unauthenticated users to /login with 307
    const { status } = await fetchPage("/dashboard/overview");
    expect(status).toBe(307);
  });
});
