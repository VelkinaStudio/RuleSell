import { describe, it, expect, beforeAll } from "vitest";
import { login, getJSON, ACCOUNTS, type AuthSession } from "../helpers";

let bob: AuthSession;
let testRulesetId: string;

beforeAll(async () => {
  bob = await login(ACCOUNTS.bob.email, ACCOUNTS.bob.password);
  const { body } = await getJSON<{ data: { id: string }[] }>("/api/rulesets?pageSize=1");
  testRulesetId = body.data[0]?.id;
});

describe("POST /api/reports", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rulesetId: testRulesetId, reason: "SPAM" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects missing fields", async () => {
    const { status } = await bob.postJSON("/api/reports", { rulesetId: testRulesetId });
    expect(status).toBe(400);
  });

  it("rejects invalid reason", async () => {
    const { status } = await bob.postJSON("/api/reports", {
      rulesetId: testRulesetId,
      reason: "INVALID_REASON",
    });
    expect(status).toBe(400);
  });

  it("creates a report or hits daily rate limit", async () => {
    const { status, body } = await bob.postJSON<{ data: { id: string; reason: string } }>(
      "/api/reports",
      {
        rulesetId: testRulesetId,
        reason: "SPAM",
        details: "Test report from integration test",
      },
    );
    // 201 = created, 429 = daily rate limit (5/day) from accumulated test runs
    expect([201, 429]).toContain(status);
    if (status === 201) {
      expect(body.data.reason).toBe("SPAM");
    }
  });
});
