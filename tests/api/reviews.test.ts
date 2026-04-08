import { describe, it, expect, beforeAll } from "vitest";
import { login, getJSON, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;
let bob: AuthSession;
let aliceRulesetId: string;
let aliceId: string;

beforeAll(async () => {
  [alice, bob] = await Promise.all([
    login(ACCOUNTS.alice.email, ACCOUNTS.alice.password),
    login(ACCOUNTS.bob.email, ACCOUNTS.bob.password),
  ]);

  const aliceSession = await alice.getJSON<{ user: { id: string } }>("/api/auth/session");
  aliceId = aliceSession.body.user.id;

  // Create a fresh ruleset by alice so we can test reviews against it
  const { body: created } = await alice.postJSON<{ data: { id: string } }>("/api/rulesets", {
    title: `Review Test Ruleset ${Date.now()}`,
    description: "For review testing",
    previewContent: "Preview",
    type: "RULESET",
    platform: "CURSOR",
    category: "development",
    price: 0,
  });
  aliceRulesetId = created.data.id;

  // Publish it so reviews are possible
  await alice.patchJSON(`/api/rulesets/${aliceRulesetId}`, { status: "PUBLISHED" });
});

describe("GET /api/rulesets/[id]/reviews", () => {
  it("returns reviews for a ruleset", async () => {
    const { status, body } = await getJSON<{ data: unknown }>(`/api/rulesets/${aliceRulesetId}/reviews`);
    expect(status).toBe(200);
    expect(body.data).toBeDefined();
  });
});

describe("POST /api/rulesets/[id]/reviews", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch(`http://localhost:3000/api/rulesets/${aliceRulesetId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: 5, comment: "Great!" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects invalid rating", async () => {
    const { status } = await bob.postJSON(`/api/rulesets/${aliceRulesetId}/reviews`, {
      rating: 6,
      comment: "Invalid rating",
    });
    expect(status).toBe(400);
  });

  it("rejects missing comment", async () => {
    const { status } = await bob.postJSON(`/api/rulesets/${aliceRulesetId}/reviews`, {
      rating: 5,
    });
    expect(status).toBe(400);
  });

  it("prevents author from reviewing own ruleset", async () => {
    const { status } = await alice.postJSON(`/api/rulesets/${aliceRulesetId}/reviews`, {
      rating: 5,
      comment: "Self review",
    });
    expect(status).toBe(400);
  });
});
