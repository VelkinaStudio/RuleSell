import { describe, it, expect, beforeAll } from "vitest";
import { login, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;
let bob: AuthSession;
let collectionId: string;

beforeAll(async () => {
  [alice, bob] = await Promise.all([
    login(ACCOUNTS.alice.email, ACCOUNTS.alice.password),
    login(ACCOUNTS.bob.email, ACCOUNTS.bob.password),
  ]);
});

describe("POST /api/collections", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects missing name", async () => {
    const { status } = await alice.postJSON("/api/collections", {});
    expect(status).toBe(400);
  });

  it("creates a collection", async () => {
    const { status, body } = await alice.postJSON<{ data: { id: string; name: string; slug: string } }>(
      "/api/collections",
      { name: `Test Collection ${Date.now()}`, description: "For testing", isPublic: true },
    );
    expect(status).toBe(201);
    expect(body.data.id).toBeDefined();
    expect(body.data.slug).toBeDefined();
    collectionId = body.data.id;
  });
});

describe("GET /api/collections", () => {
  it("returns user collections", async () => {
    const { status, body } = await alice.getJSON<{ data: { id: string }[] }>("/api/collections");
    expect(status).toBe(200);
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.some((c) => c.id === collectionId)).toBe(true);
  });
});

describe("PATCH /api/collections/[id]", () => {
  it("updates own collection", async () => {
    const { status, body } = await alice.patchJSON<{ data: { name: string } }>(
      `/api/collections/${collectionId}`,
      { name: "Renamed Collection" },
    );
    expect(status).toBe(200);
    expect(body.data.name).toBe("Renamed Collection");
  });

  it("rejects update by non-owner", async () => {
    const { status } = await bob.patchJSON(`/api/collections/${collectionId}`, {
      name: "Hacked",
    });
    expect(status).toBe(403);
  });
});

describe("DELETE /api/collections/[id]", () => {
  it("rejects delete by non-owner", async () => {
    const { status } = await bob.deleteJSON(`/api/collections/${collectionId}`);
    expect(status).toBe(403);
  });

  it("deletes own collection", async () => {
    const { status } = await alice.deleteJSON(`/api/collections/${collectionId}`);
    expect(status).toBe(200);
  });
});
