import { describe, it, expect, beforeAll } from "vitest";
import { login, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

describe("GET /api/notifications", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/notifications");
    expect(res.status).toBe(401);
  });

  it("returns notifications", async () => {
    const { status, body } = await alice.getJSON<{
      data: { notifications: unknown[]; unreadCount: number };
    }>("/api/notifications");
    expect(status).toBe(200);
    expect(body.data.notifications).toBeInstanceOf(Array);
    expect(typeof body.data.unreadCount).toBe("number");
  });
});

describe("PATCH /api/notifications/read", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/notifications/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(401);
  });

  it("marks all as read", async () => {
    const { status, body } = await alice.patchJSON<{ data: { message: string } }>(
      "/api/notifications/read",
      {},
    );
    expect(status).toBe(200);
    expect(body.data.message).toBe("Marked as read");
  });
});
