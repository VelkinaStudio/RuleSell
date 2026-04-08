import { describe, it, expect, beforeAll } from "vitest";
import { login, fetchPage, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

const settingsPages = [
  "/settings/billing",
  "/settings/notifications",
];

describe("Settings pages (authenticated)", () => {
  for (const page of settingsPages) {
    it(`GET ${page} — 200`, async () => {
      const { status } = await fetchPage(page, alice.cookies);
      expect(status).toBe(200);
    });
  }
});
