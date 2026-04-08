import { describe, it, expect } from "vitest";
import { getJSON } from "../helpers";

describe("GET /api/tags", () => {
  it("returns tags list", async () => {
    const { status, body } = await getJSON<{ data: { id: string; name: string; usageCount: number }[] }>(
      "/api/tags",
    );
    expect(status).toBe(200);
    expect(body.data).toBeInstanceOf(Array);
    if (body.data.length > 0) {
      expect(body.data[0]).toHaveProperty("name");
      expect(body.data[0]).toHaveProperty("usageCount");
    }
  });
});

describe("GET /api/tags/search", () => {
  it("searches tags", async () => {
    const { status, body } = await getJSON<{ data: unknown[] }>("/api/tags/search?q=test");
    expect(status).toBe(200);
    expect(body.data).toBeInstanceOf(Array);
  });
});
