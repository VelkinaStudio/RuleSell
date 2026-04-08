import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("trims whitespace", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! @World#")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("hello---world")).toBe("hello-world");
  });

  it("replaces underscores with hyphens", () => {
    expect(slugify("hello_world_test")).toBe("hello-world-test");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("-hello-world-")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles all-special-char input", () => {
    expect(slugify("!@#$%")).toBe("");
  });

  it("handles mixed spaces and underscores", () => {
    expect(slugify("My Cool_Rule Set")).toBe("my-cool-rule-set");
  });

  it("handles unicode by stripping non-word chars", () => {
    expect(slugify("café résumé")).toBe("caf-rsum");
  });
});
