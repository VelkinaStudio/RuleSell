import { describe, it, expect } from "vitest";
import { registerSchema } from "@/lib/validations/auth";
import { createRulesetSchema } from "@/lib/validations/rulesets";
import {
  voteSchema,
  reportSchema,
  reviewSchema,
} from "@/lib/validations/engagement";
import { createCollectionSchema } from "@/lib/validations/collections";
import {
  createDiscussionSchema,
  createReplySchema,
} from "@/lib/validations/discussions";

describe("registerSchema", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      username: "testuser",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      password: "password123",
      name: "Test",
      username: "testuser",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "short",
      name: "Test",
      username: "testuser",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid username characters", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      name: "Test",
      username: "user name!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects username too short", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      name: "Test",
      username: "ab",
    });
    expect(result.success).toBe(false);
  });
});

describe("createRulesetSchema", () => {
  it("accepts valid input", () => {
    const result = createRulesetSchema.safeParse({
      title: "My Ruleset",
      description: "A great ruleset",
      previewContent: "Preview here",
      type: "RULESET",
      platform: "CURSOR",
      category: "development",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid platform", () => {
    const result = createRulesetSchema.safeParse({
      title: "My Ruleset",
      description: "A great ruleset",
      previewContent: "Preview",
      type: "RULESET",
      platform: "INVALID",
      category: "development",
    });
    expect(result.success).toBe(false);
  });

  it("defaults price to 0", () => {
    const result = createRulesetSchema.safeParse({
      title: "My Ruleset",
      description: "A great ruleset",
      previewContent: "Preview",
      type: "RULESET",
      platform: "CURSOR",
      category: "dev",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.price).toBe(0);
  });
});

describe("reviewSchema", () => {
  it("accepts valid rating 1-5", () => {
    expect(
      reviewSchema.safeParse({ rating: 1, comment: "OK" }).success,
    ).toBe(true);
    expect(
      reviewSchema.safeParse({ rating: 5, comment: "Great" }).success,
    ).toBe(true);
  });

  it("rejects rating out of range", () => {
    expect(
      reviewSchema.safeParse({ rating: 0, comment: "Bad" }).success,
    ).toBe(false);
    expect(
      reviewSchema.safeParse({ rating: 6, comment: "Too good" }).success,
    ).toBe(false);
  });
});

describe("reportSchema", () => {
  it("rejects invalid reason", () => {
    const result = reportSchema.safeParse({
      rulesetId: "abc",
      reason: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid reason", () => {
    const result = reportSchema.safeParse({
      rulesetId: "abc",
      reason: "SPAM",
    });
    expect(result.success).toBe(true);
  });
});

describe("createCollectionSchema", () => {
  it("defaults isPublic to true", () => {
    const result = createCollectionSchema.safeParse({ name: "My Collection" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isPublic).toBe(true);
  });
});

describe("createDiscussionSchema", () => {
  it("accepts valid input", () => {
    const result = createDiscussionSchema.safeParse({
      title: "Test",
      bodyText: "Body content",
      category: "general",
    });
    expect(result.success).toBe(true);
  });
});

describe("createReplySchema", () => {
  it("rejects empty body", () => {
    const result = createReplySchema.safeParse({ bodyText: "" });
    expect(result.success).toBe(false);
  });
});
