import { describe, it, expect, beforeAll } from "vitest";
import { login, getJSON, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;
let bob: AuthSession;
let discussionId: string;

beforeAll(async () => {
  [alice, bob] = await Promise.all([
    login(ACCOUNTS.alice.email, ACCOUNTS.alice.password),
    login(ACCOUNTS.bob.email, ACCOUNTS.bob.password),
  ]);
});

describe("GET /api/discussions", () => {
  it("lists discussions (public)", async () => {
    const { status, body } = await getJSON<{ data: { discussions: unknown[] } }>("/api/discussions");
    expect(status).toBe(200);
    expect(body.data.discussions).toBeInstanceOf(Array);
  });
});

describe("POST /api/discussions", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", bodyText: "Body", category: "general" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects missing fields", async () => {
    const { status } = await alice.postJSON("/api/discussions", { title: "Test" });
    expect(status).toBe(400);
  });

  it("creates a discussion", async () => {
    const { status, body } = await alice.postJSON<{ data: { id: string; title: string } }>(
      "/api/discussions",
      {
        title: `Test Discussion ${Date.now()}`,
        bodyText: "This is a test discussion for integration testing.",
        category: "general",
      },
    );
    expect(status).toBe(201);
    expect(body.data.id).toBeDefined();
    discussionId = body.data.id;
  });
});

describe("POST /api/discussions/[id]/replies", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch(`http://localhost:3000/api/discussions/${discussionId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bodyText: "Test reply" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects missing body", async () => {
    const { status } = await bob.postJSON(`/api/discussions/${discussionId}/replies`, {});
    expect(status).toBe(400);
  });

  it("creates a reply", async () => {
    const { status, body } = await bob.postJSON<{ data: { id: string; body: string } }>(
      `/api/discussions/${discussionId}/replies`,
      { bodyText: "This is a test reply." },
    );
    expect(status).toBe(201);
    expect(body.data.body).toBe("This is a test reply.");
  });

  it("rejects nonexistent discussion", async () => {
    const { status } = await bob.postJSON("/api/discussions/nonexistent-id/replies", {
      bodyText: "Test",
    });
    expect(status).toBe(404);
  });
});
