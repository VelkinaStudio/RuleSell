import { describe, expect, it } from "vitest";

import {
  getAnalyticsOverview,
  getCollectionBySlug,
  getLeaderboard,
  getRulesetBySlug,
  getTeamBySlug,
  getUserByUsername,
  isApiError,
  listRulesets,
} from "./mock-server";

describe("listRulesets", () => {
  it("returns a paginated page with default size 24", () => {
    const page = listRulesets({});
    expect(page.data.length).toBeLessThanOrEqual(24);
    expect(page.pagination.page).toBe(1);
    expect(page.pagination.pageSize).toBe(24);
    expect(page.pagination.hasPrev).toBe(false);
    expect(page.pagination.total).toBe(60);
    expect(page.pagination.hasNext).toBe(true);
  });

  it("respects custom page and pageSize", () => {
    const page = listRulesets({ page: 3, pageSize: 20 });
    expect(page.pagination.page).toBe(3);
    expect(page.pagination.pageSize).toBe(20);
    // Page 3 of 20 in a 60-item set returns the last 20.
    expect(page.data.length).toBe(20);
    expect(page.pagination.hasNext).toBe(false);
    expect(page.pagination.hasPrev).toBe(true);
  });

  it("filters combine: paid MCP servers", () => {
    const page = listRulesets({ category: "MCP_SERVER", price: "paid", pageSize: 50 });
    for (const r of page.data) {
      const isMcp =
        r.category === "MCP_SERVER" || r.secondaryCategories.includes("MCP_SERVER");
      expect(isMcp).toBe(true);
      expect(r.price).toBeGreaterThan(0);
    }
  });

  it("tab=top sorts by qualityScore descending", () => {
    const page = listRulesets({ tab: "top", pageSize: 10 });
    for (let i = 1; i < page.data.length; i++) {
      expect(page.data[i - 1].qualityScore).toBeGreaterThanOrEqual(
        page.data[i].qualityScore,
      );
    }
  });

  it("tab=editors filters to editor's pick badge", () => {
    const page = listRulesets({ tab: "editors", pageSize: 50 });
    for (const r of page.data) {
      expect(r.badges).toContain("EDITORS_PICK");
    }
  });

  it("search is case-insensitive across title, description, tags", () => {
    const upper = listRulesets({ q: "MCP", pageSize: 50 });
    const lower = listRulesets({ q: "mcp", pageSize: 50 });
    expect(upper.pagination.total).toBe(lower.pagination.total);
    expect(upper.pagination.total).toBeGreaterThan(0);
  });

  it("environment filter restricts to variants supporting that env", () => {
    const page = listRulesets({ environment: "windsurf", pageSize: 50 });
    for (const r of page.data) {
      const supported = r.variants.some((v) => v.environments.includes("windsurf"));
      expect(supported).toBe(true);
    }
  });

  it("explicit sort overrides tab sort", () => {
    const page = listRulesets({ tab: "top", sort: "price_desc", pageSize: 60 });
    for (let i = 1; i < page.data.length; i++) {
      expect(page.data[i - 1].price).toBeGreaterThanOrEqual(page.data[i].price);
    }
  });
});

describe("entity lookups", () => {
  it("getRulesetBySlug returns the ruleset", () => {
    const r = getRulesetBySlug("awesome-cursorrules");
    expect(isApiError(r)).toBe(false);
    if (!isApiError(r)) {
      expect(r.title).toBe("Awesome CursorRules");
    }
  });

  it("getRulesetBySlug returns NOT_FOUND for unknown slug", () => {
    const r = getRulesetBySlug("does-not-exist");
    expect(isApiError(r)).toBe(true);
    if (isApiError(r)) {
      expect(r.error.code).toBe("NOT_FOUND");
    }
  });

  it("getUserByUsername works for seeded users", () => {
    const u = getUserByUsername("claire-dubois");
    expect(isApiError(u)).toBe(false);
  });

  it("getTeamBySlug works for seeded teams", () => {
    const t = getTeamBySlug("anthropic-skills");
    expect(isApiError(t)).toBe(false);
  });

  it("getCollectionBySlug returns NOT_FOUND for unknown slug", () => {
    const c = getCollectionBySlug("nope");
    expect(isApiError(c)).toBe(true);
  });
});

describe("leaderboard", () => {
  it("returns users sorted by reputation desc", () => {
    const board = getLeaderboard(10);
    for (let i = 1; i < board.length; i++) {
      expect(board[i - 1].reputation).toBeGreaterThanOrEqual(board[i].reputation);
    }
  });
});

describe("getAnalyticsOverview", () => {
  it("returns the empty shape for unknown users", () => {
    const o = getAnalyticsOverview("user-does-not-exist");
    expect(o.totalRulesets).toBe(0);
    expect(o.totalInstalls).toBe(0);
    expect(o.totalRevenue).toBe(0);
    expect(o.last30dInstalls).toBe(0);
    expect(o.last30dRevenue).toBe(0);
    expect(o.recentInstalls).toEqual([]);
    expect(o.recentRevenue).toEqual([]);
  });

  it("returns 30 trend points for a known seller", () => {
    // user-11 = helena-costa, a seller with totalEarnings > 0
    const o = getAnalyticsOverview("user-11");
    expect(o.recentInstalls.length).toBe(30);
    expect(o.recentRevenue.length).toBe(30);
  });

  it("trend points are oldest -> newest and ISO date strings", () => {
    const o = getAnalyticsOverview("user-11");
    for (let i = 0; i < o.recentInstalls.length; i++) {
      expect(o.recentInstalls[i].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(o.recentRevenue[i].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(o.recentInstalls[i].date).toBe(o.recentRevenue[i].date);
    }
    for (let i = 1; i < o.recentInstalls.length; i++) {
      expect(o.recentInstalls[i].date > o.recentInstalls[i - 1].date).toBe(true);
    }
  });

  it("trend points are non-negative", () => {
    const o = getAnalyticsOverview("user-11");
    for (const p of o.recentInstalls) expect(p.count).toBeGreaterThanOrEqual(0);
    for (const p of o.recentRevenue) expect(p.amount).toBeGreaterThanOrEqual(0);
  });

  it("last30d totals match the sum of the trend series", () => {
    const o = getAnalyticsOverview("user-11");
    const installSum = o.recentInstalls.reduce((s, p) => s + p.count, 0);
    const revenueSum = o.recentRevenue.reduce((s, p) => s + p.amount, 0);
    expect(o.last30dInstalls).toBe(installSum);
    expect(o.last30dRevenue).toBe(revenueSum);
  });

  it("is deterministic — repeated calls return the same data", () => {
    const a = getAnalyticsOverview("user-11");
    const b = getAnalyticsOverview("user-11");
    expect(a).toEqual(b);
  });

  it("different users get deterministic series shapes", () => {
    const a1 = getAnalyticsOverview("user-11");
    const a2 = getAnalyticsOverview("user-11");
    // Same user, same output (deterministic)
    expect(a1.recentInstalls).toEqual(a2.recentInstalls);
  });

  it("buyers (no builderStats) get a zero series, not undefined", () => {
    // user-1 = alex-rivera, a buyer with no rulesets and no earnings
    const o = getAnalyticsOverview("user-1");
    expect(o.totalRulesets).toBe(0);
    expect(o.recentInstalls.length).toBe(30);
    expect(o.recentRevenue.length).toBe(30);
    expect(o.recentInstalls.every((p) => p.count === 0)).toBe(true);
    expect(o.recentRevenue.every((p) => p.amount === 0)).toBe(true);
  });
});
