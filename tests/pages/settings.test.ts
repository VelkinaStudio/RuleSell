import { describe, it, expect, beforeAll } from "vitest";
import { login, fetchPage, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

/*
 * Settings moved from /settings/* to /dashboard/settings/* during the
 * frontend merge. /settings/notifications was removed entirely.
 */
const settingsPages = [
  "/dashboard/settings",
  "/dashboard/settings/billing",
  "/dashboard/settings/privacy",
  "/dashboard/settings/seller",
];

describe("Settings pages (authenticated)", () => {
  for (const page of settingsPages) {
    it(`GET ${page} — 200`, async () => {
      const { status } = await fetchPage(page, alice.cookies);
      expect(status).toBe(200);
    });
  }
});

describe("Settings pages (unauthenticated)", () => {
  it("redirects to login", async () => {
    const { status } = await fetchPage("/dashboard/settings");
    expect([302, 307]).toContain(status);
  });
});
