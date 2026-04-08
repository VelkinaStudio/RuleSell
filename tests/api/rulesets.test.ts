import { describe, it, expect, beforeAll } from "vitest";
import { login, getJSON, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;
let bob: AuthSession;
let createdRulesetId: string;

beforeAll(async () => {
  [alice, bob] = await Promise.all([
    login(ACCOUNTS.alice.email, ACCOUNTS.alice.password),
    login(ACCOUNTS.bob.email, ACCOUNTS.bob.password),
  ]);
});

describe("GET /api/rulesets", () => {
  it("lists rulesets (public)", async () => {
    const { status, body } = await getJSON<{ data: unknown[]; pagination: { total: number } }>("/api/rulesets");
    expect(status).toBe(200);
    expect(body.data).toBeInstanceOf(Array);
    expect(body.pagination.total).toBeGreaterThanOrEqual(0);
  });

  it("filters by platform", async () => {
    const { status, body } = await getJSON<{ data: { platform: string }[] }>("/api/rulesets?platform=CURSOR");
    expect(status).toBe(200);
    for (const r of body.data) {
      expect(r.platform).toBe("CURSOR");
    }
  });

  it("filters by sort", async () => {
    const { status } = await getJSON("/api/rulesets?sort=trending");
    expect(status).toBe(200);
  });
});

describe("POST /api/rulesets", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/rulesets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects missing fields", async () => {
    const { status, body } = await alice.postJSON<{ error: { code: string } }>("/api/rulesets", {
      title: "Test Ruleset",
    });
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("creates a ruleset with valid data", async () => {
    const { status, body } = await alice.postJSON<{ data: { id: string; slug: string; title: string } }>("/api/rulesets", {
      title: `Test Ruleset ${Date.now()}`,
      description: "A test ruleset for integration testing",
      previewContent: "Preview content here",
      type: "RULESET",
      platform: "CURSOR",
      category: "development",
      price: 0,
      content: "Full content for version 1",
      tags: ["test", "integration"],
    });
    expect(status).toBe(201);
    expect(body.data.id).toBeDefined();
    expect(body.data.slug).toBeDefined();
    createdRulesetId = body.data.id;
  });
});

describe("GET /api/rulesets/[id]", () => {
  it("returns a ruleset by id", async () => {
    const { status, body } = await alice.getJSON<{ data: { id: string; title: string; accessState: string } }>(
      `/api/rulesets/${createdRulesetId}`,
    );
    expect(status).toBe(200);
    expect(body.data.id).toBe(createdRulesetId);
    expect(body.data.accessState).toBe("AUTHOR");
  });

  it("returns 404 for nonexistent id", async () => {
    const { status } = await getJSON("/api/rulesets/nonexistent-id-123");
    expect(status).toBe(404);
  });
});

describe("PATCH /api/rulesets/[id]", () => {
  it("updates own ruleset", async () => {
    const { status, body } = await alice.patchJSON<{ data: { title: string } }>(
      `/api/rulesets/${createdRulesetId}`,
      { title: "Updated Test Ruleset" },
    );
    expect(status).toBe(200);
    expect(body.data.title).toBe("Updated Test Ruleset");
  });

  it("rejects update by non-author", async () => {
    const { status } = await bob.patchJSON(`/api/rulesets/${createdRulesetId}`, {
      title: "Hacked Title",
    });
    expect(status).toBe(403);
  });
});

describe("DELETE /api/rulesets/[id]", () => {
  it("rejects delete by non-author", async () => {
    const { status } = await bob.deleteJSON(`/api/rulesets/${createdRulesetId}`);
    expect(status).toBe(403);
  });

  it("archives own ruleset", async () => {
    const { status, body } = await alice.deleteJSON<{ data: { message: string } }>(
      `/api/rulesets/${createdRulesetId}`,
    );
    expect(status).toBe(200);
    expect(body.data.message).toBe("Ruleset archived");
  });
});
