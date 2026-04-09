import { describe, it, expect } from "vitest";
import { fetchPage } from "../helpers";

describe("Public pages", () => {
  it("GET / — homepage", async () => {
    const { status } = await fetchPage("/");
    // localePrefix: "as-needed" serves default locale without prefix
    expect(status).toBe(200);
  });

  it("GET /en — redirects to / (strip default locale prefix)", async () => {
    const { status } = await fetchPage("/en");
    // next-intl strips the default locale prefix and redirects
    expect([200, 307, 308]).toContain(status);
  });

  it("GET /search", async () => {
    const { status } = await fetchPage("/search");
    expect(status).toBe(200);
  });

  it("GET /browse/trending — redirects to /browse?tab=trending", async () => {
    const { status } = await fetchPage("/browse/trending");
    expect([200, 307, 308]).toContain(status);
  });

  it("GET /browse", async () => {
    const { status } = await fetchPage("/browse");
    expect(status).toBe(200);
  });
});
