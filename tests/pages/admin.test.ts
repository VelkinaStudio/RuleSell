import { describe, it, expect, beforeAll } from "vitest";
import { login, fetchPage, ACCOUNTS, type AuthSession } from "../helpers";

let admin: AuthSession;

beforeAll(async () => {
  admin = await login(ACCOUNTS.admin.email, ACCOUNTS.admin.password);
});

/*
 * Admin pages were removed during the frontend merge (no pages exist under
 * [locale]/admin). The middleware still redirects unauthenticated users to
 * /login, so we just verify the routes return 404 for an authenticated admin.
 */
const adminPages = [
  "/admin",
  "/admin/users",
  "/admin/rulesets",
  "/admin/reports",
];

describe("Admin pages (removed — expect 404)", () => {
  for (const page of adminPages) {
    it(`GET ${page} — 404`, async () => {
      const { status } = await fetchPage(page, admin.cookies);
      expect(status).toBe(404);
    });
  }
});

describe("Admin pages (unauthenticated — redirects to login)", () => {
  for (const page of adminPages) {
    it(`GET ${page} — redirects`, async () => {
      const { status } = await fetchPage(page);
      expect([302, 307]).toContain(status);
    });
  }
});
