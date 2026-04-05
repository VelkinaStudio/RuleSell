import { describe, it, expect, beforeAll } from "vitest";
import { login, fetchPage, ACCOUNTS, BASE_URL } from "../helpers";
import type { AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

describe("Proxy route protection", () => {
  it("redirects /dashboard/overview to /login when not authenticated", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/overview`, { redirect: "manual" });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("redirects /settings/billing to /login when not authenticated", async () => {
    const res = await fetch(`${BASE_URL}/settings/billing`, { redirect: "manual" });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("redirects /admin to /login when not authenticated", async () => {
    const res = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("allows authenticated access to /dashboard/overview", async () => {
    const { status } = await fetchPage("/dashboard/overview", alice.cookies);
    expect(status).toBe(200);
  });

  it("allows public access to /search", async () => {
    const res = await fetch(`${BASE_URL}/search`, { redirect: "manual" });
    expect(res.status).toBe(200);
  });

  it("redirects /login to /dashboard when already authenticated", async () => {
    const res = await alice.fetch("/login");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/dashboard");
  });

  it("includes callbackUrl when redirecting to login", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/analytics`, { redirect: "manual" });
    const location = res.headers.get("location") || "";
    expect(location).toContain("callbackUrl");
    expect(location).toContain("analytics");
  });
});
