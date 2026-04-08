import { describe, it, expect } from "vitest";
import { canViewFullContent, type AccessState } from "@/lib/rulesets/access";

describe("canViewFullContent", () => {
  const allowed: AccessState[] = ["AUTHOR", "PURCHASED", "SUBSCRIPTION_ACTIVE", "FREE_DOWNLOAD"];
  const denied: AccessState[] = ["PUBLIC", "REFUNDED", "SUBSCRIPTION_EXPIRED"];

  for (const state of allowed) {
    it(`allows ${state}`, () => {
      expect(canViewFullContent(state)).toBe(true);
    });
  }

  for (const state of denied) {
    it(`denies ${state}`, () => {
      expect(canViewFullContent(state)).toBe(false);
    });
  }
});
