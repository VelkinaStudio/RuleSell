import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests within limit", () => {
    const key = `test-${Date.now()}`;
    const result = rateLimit(key, 3, 60000);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests over limit", () => {
    const key = `test-block-${Date.now()}`;
    rateLimit(key, 2, 60000);
    rateLimit(key, 2, 60000);
    const result = rateLimit(key, 2, 60000);
    expect(result.ok).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("returns resetAt timestamp", () => {
    const key = `test-reset-${Date.now()}`;
    const result = rateLimit(key, 5, 60000);
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });
});
