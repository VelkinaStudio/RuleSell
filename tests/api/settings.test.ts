import { describe, it, expect, beforeAll } from "vitest";
import { login, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

describe("GET /api/settings/profile", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/settings/profile");
    expect(res.status).toBe(401);
  });

  it("returns profile data", async () => {
    const { status, body } = await alice.getJSON<{
      data: { name: string; username: string; email: string };
    }>("/api/settings/profile");
    expect(status).toBe(200);
    expect(body.data.email).toBe(ACCOUNTS.alice.email);
  });
});

describe("PATCH /api/settings/profile", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Name" }),
    });
    expect(res.status).toBe(401);
  });

  it("updates name", async () => {
    const { status, body } = await alice.patchJSON<{ data: { name: string } }>(
      "/api/settings/profile",
      { name: "Alice Updated" },
    );
    expect(status).toBe(200);
    expect(body.data.name).toBe("Alice Updated");

    // Restore original
    await alice.patchJSON("/api/settings/profile", { name: "Alice Johnson" });
  });

  it("rejects invalid username", async () => {
    const { status } = await alice.patchJSON("/api/settings/profile", {
      username: "a",
    });
    expect(status).toBe(400);
  });
});
