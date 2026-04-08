import { describe, it, expect } from "vitest";
import { getJSON } from "../helpers";

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const { status, body } = await getJSON<{ data: { status: string } }>("/api/health");
    expect(status).toBe(200);
    expect(body.data.status).toBe("ok");
  });
});
