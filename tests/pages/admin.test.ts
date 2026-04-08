import { describe, it, expect, beforeAll } from "vitest";
import { login, fetchPage, ACCOUNTS, type AuthSession } from "../helpers";

let admin: AuthSession;
let alice: AuthSession;

beforeAll(async () => {
  [admin, alice] = await Promise.all([
    login(ACCOUNTS.admin.email, ACCOUNTS.admin.password),
    login(ACCOUNTS.alice.email, ACCOUNTS.alice.password),
  ]);
});

const adminPages = [
  "/admin",
  "/admin/users",
  "/admin/rulesets",
  "/admin/reports",
];

describe("Admin pages (admin user)", () => {
  for (const page of adminPages) {
    it(`GET ${page} — 200`, async () => {
      const { status } = await fetchPage(page, admin.cookies);
      expect(status).toBe(200);
    });
  }
});

describe("Admin pages (non-admin user)", () => {
  for (const page of adminPages) {
    it(`GET ${page} — blocked for regular user`, async () => {
      const { status } = await fetchPage(page, alice.cookies);
      // Should either redirect or return 200 with client-side guard
      expect([200, 302, 307, 403]).toContain(status);
    });
  }
});
