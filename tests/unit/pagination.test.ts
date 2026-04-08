import { describe, it, expect } from "vitest";
import { paginationFromOffset, paginationFromCursor } from "@/lib/api/response";

describe("paginationFromOffset", () => {
  it("returns correct values for first page", () => {
    const result = paginationFromOffset(50, 1, 10);
    expect(result).toEqual({
      total: 50,
      page: 1,
      pageSize: 10,
      hasNext: true,
      hasPrev: false,
    });
  });

  it("returns correct values for middle page", () => {
    const result = paginationFromOffset(50, 3, 10);
    expect(result).toEqual({
      total: 50,
      page: 3,
      pageSize: 10,
      hasNext: true,
      hasPrev: true,
    });
  });

  it("returns correct values for last page", () => {
    const result = paginationFromOffset(50, 5, 10);
    expect(result).toEqual({
      total: 50,
      page: 5,
      pageSize: 10,
      hasNext: false,
      hasPrev: true,
    });
  });

  it("handles single page of results", () => {
    const result = paginationFromOffset(5, 1, 10);
    expect(result).toEqual({
      total: 5,
      page: 1,
      pageSize: 10,
      hasNext: false,
      hasPrev: false,
    });
  });

  it("throws on page < 1", () => {
    expect(() => paginationFromOffset(50, 0, 10)).toThrow("page must be >= 1");
  });

  it("handles exact page boundary", () => {
    const result = paginationFromOffset(20, 2, 10);
    expect(result.hasNext).toBe(false);
  });
});

describe("paginationFromCursor", () => {
  it("returns hasNext when nextCursor present", () => {
    const result = paginationFromCursor(50, 20, "abc123");
    expect(result.hasNext).toBe(true);
    expect(result.nextCursor).toBe("abc123");
  });

  it("returns hasPrev when prevCursor present", () => {
    const result = paginationFromCursor(50, 20, undefined, "def456");
    expect(result.hasPrev).toBe(true);
    expect(result.prevCursor).toBe("def456");
  });

  it("returns no next/prev when no cursors", () => {
    const result = paginationFromCursor(5, 20);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });
});
