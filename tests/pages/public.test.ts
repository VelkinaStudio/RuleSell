import { describe, it, expect } from "vitest";
import { fetchPage, BASE_URL } from "../helpers";

describe("Public pages", () => {
  it("GET / — homepage", async () => {
    const { status } = await fetchPage("/");
    expect(status).toBe(200);
  });

  it("GET /login", async () => {
    const { status } = await fetchPage("/login");
    expect(status).toBe(200);
  });

  it("GET /signup", async () => {
    const { status } = await fetchPage("/signup");
    expect(status).toBe(200);
  });

  it("GET /search", async () => {
    const { status } = await fetchPage("/search");
    expect(status).toBe(200);
  });

  it("GET /trending", async () => {
    const { status } = await fetchPage("/trending");
    expect(status).toBe(200);
  });

  it("GET /reset-password", async () => {
    const { status } = await fetchPage("/reset-password");
    expect(status).toBe(200);
  });

  it("GET /verify-email", async () => {
    const { status } = await fetchPage("/verify-email");
    expect(status).toBe(200);
  });

  it("GET /creators", async () => {
    const { status } = await fetchPage("/creators");
    expect(status).toBe(200);
  });
});
