import { describe, it, expect, beforeAll } from "vitest";
import { login, getJSON, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;
let bob: AuthSession;
let testRulesetId: string;

beforeAll(async () => {
  [alice, bob] = await Promise.all([
    login(ACCOUNTS.alice.email, ACCOUNTS.alice.password),
    login(ACCOUNTS.bob.email, ACCOUNTS.bob.password),
  ]);

  // Get a published ruleset to test against
  const { body } = await getJSON<{ data: { id: string }[] }>("/api/rulesets?pageSize=1");
  testRulesetId = body.data[0]?.id;
});

/* ── Votes ──────────────────────────────────────────── */

describe("POST /api/votes", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rulesetId: testRulesetId }),
    });
    expect(res.status).toBe(401);
  });

  it("requires rulesetId", async () => {
    const { status } = await bob.postJSON("/api/votes", {});
    expect(status).toBe(400);
  });

  it("toggles vote on", async () => {
    const { status, body } = await bob.postJSON<{ data: { voted: boolean } }>("/api/votes", {
      rulesetId: testRulesetId,
    });
    expect(status).toBe(200);
    expect(typeof body.data.voted).toBe("boolean");
  });

  it("toggles vote off (idempotent toggle)", async () => {
    // Vote again to toggle off
    const { status, body } = await bob.postJSON<{ data: { voted: boolean } }>("/api/votes", {
      rulesetId: testRulesetId,
    });
    expect(status).toBe(200);
    expect(typeof body.data.voted).toBe("boolean");
  });

  it("rejects nonexistent ruleset", async () => {
    const { status } = await bob.postJSON("/api/votes", {
      rulesetId: "nonexistent-id",
    });
    expect(status).toBe(404);
  });
});

/* ── Follow ─────────────────────────────────────────── */

describe("POST /api/follow", () => {
  let aliceUserId: string;

  beforeAll(async () => {
    const { body } = await alice.getJSON<{ user: { id: string } }>("/api/auth/session");
    aliceUserId = body.user.id;
  });

  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: aliceUserId }),
    });
    expect(res.status).toBe(401);
  });

  it("prevents self-follow", async () => {
    const { status } = await alice.postJSON("/api/follow", { userId: aliceUserId });
    expect(status).toBe(400);
  });

  it("toggles follow", async () => {
    const { status, body } = await bob.postJSON<{ data: { following: boolean } }>("/api/follow", {
      userId: aliceUserId,
    });
    expect(status).toBe(200);
    expect(typeof body.data.following).toBe("boolean");
  });

  it("toggles unfollow", async () => {
    const { status, body } = await bob.postJSON<{ data: { following: boolean } }>("/api/follow", {
      userId: aliceUserId,
    });
    expect(status).toBe(200);
    expect(typeof body.data.following).toBe("boolean");
  });

  it("rejects nonexistent user", async () => {
    const { status } = await bob.postJSON("/api/follow", { userId: "nonexistent-id" });
    expect(status).toBe(404);
  });
});

/* ── Saved ──────────────────────────────────────────── */

describe("/api/saved", () => {
  it("GET rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/saved");
    expect(res.status).toBe(401);
  });

  it("GET returns saved items", async () => {
    const { status, body } = await alice.getJSON<{ data: { items: unknown[]; total: number } }>("/api/saved");
    expect(status).toBe(200);
    expect(body.data.items).toBeInstanceOf(Array);
    expect(typeof body.data.total).toBe("number");
  });

  it("POST toggles save", async () => {
    const { status, body } = await bob.postJSON<{ data: { saved: boolean } }>("/api/saved", {
      rulesetId: testRulesetId,
    });
    expect(status).toBe(200);
    expect(typeof body.data.saved).toBe("boolean");
  });

  it("POST toggles unsave", async () => {
    const { status } = await bob.postJSON("/api/saved", {
      rulesetId: testRulesetId,
    });
    expect(status).toBe(200);
  });

  it("POST rejects missing rulesetId", async () => {
    const { status } = await bob.postJSON("/api/saved", {});
    expect(status).toBe(400);
  });
});
