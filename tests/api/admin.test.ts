import { describe, it, expect, beforeAll } from "vitest";
import { login, ACCOUNTS, type AuthSession } from "../helpers";

let admin: AuthSession;
let alice: AuthSession;

beforeAll(async () => {
  [admin, alice] = await Promise.all([
    login(ACCOUNTS.admin.email, ACCOUNTS.admin.password),
    login(ACCOUNTS.alice.email, ACCOUNTS.alice.password),
  ]);
});

/* ── Stats ──────────────────────────────────────────── */

describe("GET /api/admin/stats", () => {
  it("rejects non-admin", async () => {
    const { status } = await alice.getJSON("/api/admin/stats");
    expect(status).toBe(403);
  });

  it("returns platform stats", async () => {
    const { status, body } = await admin.getJSON<{
      data: {
        users: number;
        publishedRulesets: number;
        totalPurchases: number;
        totalRevenue: number;
        pendingReports: number;
      };
    }>("/api/admin/stats");
    expect(status).toBe(200);
    expect(typeof body.data.users).toBe("number");
    expect(typeof body.data.publishedRulesets).toBe("number");
    expect(typeof body.data.totalRevenue).toBe("number");
  });
});

/* ── Admin Users ────────────────────────────────────── */

describe("GET /api/admin/users", () => {
  it("rejects non-admin", async () => {
    const { status } = await alice.getJSON("/api/admin/users");
    expect(status).toBe(403);
  });

  it("lists users", async () => {
    const { status, body } = await admin.getJSON<{ data: { users: { id: string; email: string }[] } }>(
      "/api/admin/users",
    );
    expect(status).toBe(200);
    expect(body.data.users).toBeInstanceOf(Array);
    expect(body.data.users.length).toBeGreaterThan(0);
  });

  it("filters by role", async () => {
    const { status, body } = await admin.getJSON<{ data: { users: { role: string }[] } }>(
      "/api/admin/users?role=ADMIN",
    );
    expect(status).toBe(200);
    for (const u of body.data.users) {
      expect(u.role).toBe("ADMIN");
    }
  });

  it("searches by query", async () => {
    const { status, body } = await admin.getJSON<{ data: { users: unknown[] } }>(
      "/api/admin/users?q=alice",
    );
    expect(status).toBe(200);
    expect(body.data.users.length).toBeGreaterThan(0);
  });
});

/* ── Admin Rulesets ─────────────────────────────────── */

describe("GET /api/admin/rulesets", () => {
  it("rejects non-admin", async () => {
    const { status } = await alice.getJSON("/api/admin/rulesets");
    expect(status).toBe(403);
  });

  it("lists rulesets by status", async () => {
    const { status, body } = await admin.getJSON<{ data: { rulesets: unknown[] } }>(
      "/api/admin/rulesets?status=PUBLISHED",
    );
    expect(status).toBe(200);
    expect(body.data.rulesets).toBeInstanceOf(Array);
  });
});

/* ── Admin Reports ──────────────────────────────────── */

describe("GET /api/admin/reports", () => {
  it("rejects non-admin", async () => {
    const { status } = await alice.getJSON("/api/admin/reports");
    expect(status).toBe(403);
  });

  it("lists reports", async () => {
    const { status, body } = await admin.getJSON<{ data: { reports: unknown[] } }>(
      "/api/admin/reports",
    );
    expect(status).toBe(200);
    expect(body.data.reports).toBeInstanceOf(Array);
  });
});
