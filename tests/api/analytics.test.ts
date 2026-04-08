import { describe, it, expect, beforeAll } from "vitest";
import { login, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

describe("GET /api/analytics/overview", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/analytics/overview");
    expect(res.status).toBe(401);
  });

  it("returns overview stats", async () => {
    const { status, body } = await alice.getJSON<{
      data: {
        totalEarnings: number;
        totalSales: number;
        totalDownloads: number;
        followerCount: number;
        rulesetCount: number;
      };
    }>("/api/analytics/overview");
    expect(status).toBe(200);
    expect(typeof body.data.totalEarnings).toBe("number");
    expect(typeof body.data.totalSales).toBe("number");
    expect(typeof body.data.rulesetCount).toBe("number");
  });
});
