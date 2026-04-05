import { describe, it, expect, beforeAll } from "vitest";
import { login, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

describe("POST /api/bundles", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/bundles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects missing fields", async () => {
    const { status } = await alice.postJSON("/api/bundles", { title: "Test" });
    expect(status).toBe(400);
  });

  it("rejects fewer than 2 rulesets", async () => {
    const { status } = await alice.postJSON("/api/bundles", {
      title: "Test Bundle",
      description: "A test",
      price: 10,
      rulesetIds: ["one-id"],
    });
    expect(status).toBe(400);
  });
});
