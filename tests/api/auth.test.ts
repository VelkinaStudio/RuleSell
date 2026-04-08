import { describe, it, expect, beforeAll } from "vitest";
import { login, ACCOUNTS, BASE_URL } from "../helpers";

describe("Authentication", () => {
  it("logs in with valid credentials", async () => {
    const session = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
    const { status, body } = await session.getJSON<{ user: { email: string } }>("/api/auth/session");
    expect(status).toBe(200);
    expect(body.user.email).toBe(ACCOUNTS.alice.email);
  });

  it("rejects invalid credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/csrf`);
    const { csrfToken } = (await res.json()) as { csrfToken: string };
    const cookies = res.headers.getSetCookie?.().join("; ") || "";

    const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
      body: new URLSearchParams({
        email: "alice@example.com",
        password: "wrong-password",
        csrfToken,
      }),
      redirect: "manual",
    });

    // NextAuth redirects to error page on failure
    const location = loginRes.headers.get("location") || "";
    expect(location).toContain("error");
  });

  it("session endpoint returns no user when unauthenticated", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/session`);
    const body = await res.json() as Record<string, unknown>;
    // Unauthenticated session has no user email
    expect((body?.user as any)?.email).toBeUndefined();
  });

  it("different users get correct roles", async () => {
    const admin = await login(ACCOUNTS.admin.email, ACCOUNTS.admin.password);
    const { body } = await admin.getJSON<{ user: { role: string } }>("/api/auth/session");
    expect(body.user.role).toBe("ADMIN");
  });
});
