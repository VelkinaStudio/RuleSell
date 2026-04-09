import { describe, expect, it } from "vitest";

import type { QualityBreakdown } from "@/types";
import { freshnessFromDays, qualityLetter, qualityScore } from "./score";

function breakdown(overrides: Partial<QualityBreakdown> = {}): QualityBreakdown {
  return {
    tokenEfficiency: 80,
    installSuccess: 90,
    schemaClean: 85,
    freshness: 95,
    reviewScore: 88,
    securityPass: true,
    ...overrides,
  };
}

describe("qualityScore", () => {
  it("happy path: weights each signal and returns an integer in [0,100]", () => {
    const score = qualityScore(breakdown());
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(Number.isInteger(score)).toBe(true);
    // 0.25*80 + 0.15*90 + 0.15*85 + 0.15*95 + 0.20*88 + 0.10*100 = 88.1 → 88
    expect(score).toBe(88);
  });

  it("falls back to type-neutral averages when signals are null", () => {
    const score = qualityScore(
      breakdown({ tokenEfficiency: null, installSuccess: null, schemaClean: null }),
    );
    // 0.25*70 + 0.15*80 + 0.15*75 + 0.15*95 + 0.20*88 + 0.10*100 = 82.6 → 83
    expect(score).toBe(83);
  });

  it("drops the score when security does not pass", () => {
    const passing = qualityScore(breakdown());
    const failing = qualityScore(breakdown({ securityPass: false }));
    expect(failing).toBeLessThan(passing);
    // Security weight is 0.10 of 100
    expect(passing - failing).toBe(10);
  });

  it("clamps to the [0,100] range", () => {
    const highEverything = qualityScore(
      breakdown({
        tokenEfficiency: 200,
        installSuccess: 200,
        schemaClean: 200,
        freshness: 200,
        reviewScore: 200,
      }),
    );
    expect(highEverything).toBe(100);

    const lowEverything = qualityScore({
      tokenEfficiency: 0,
      installSuccess: 0,
      schemaClean: 0,
      freshness: 0,
      reviewScore: 0,
      securityPass: false,
    });
    expect(lowEverything).toBe(0);
  });
});

describe("freshnessFromDays", () => {
  it("follows a monotonic step decay", () => {
    expect(freshnessFromDays(0)).toBe(100);
    expect(freshnessFromDays(7)).toBe(100);
    expect(freshnessFromDays(8)).toBe(90);
    expect(freshnessFromDays(30)).toBe(90);
    expect(freshnessFromDays(31)).toBe(75);
    expect(freshnessFromDays(90)).toBe(75);
    expect(freshnessFromDays(91)).toBe(55);
    expect(freshnessFromDays(180)).toBe(55);
    expect(freshnessFromDays(181)).toBe(30);
    expect(freshnessFromDays(365)).toBe(30);
    expect(freshnessFromDays(366)).toBe(10);
    expect(freshnessFromDays(10_000)).toBe(10);
  });

  it("never increases as days increase", () => {
    const samples = [0, 1, 7, 8, 30, 31, 90, 91, 180, 181, 365, 366, 1000];
    let prev = Infinity;
    for (const d of samples) {
      const v = freshnessFromDays(d);
      expect(v).toBeLessThanOrEqual(prev);
      prev = v;
    }
  });
});

describe("qualityLetter", () => {
  it("maps cutoffs correctly", () => {
    expect(qualityLetter(100)).toBe("A");
    expect(qualityLetter(85)).toBe("A");
    expect(qualityLetter(84)).toBe("B");
    expect(qualityLetter(70)).toBe("B");
    expect(qualityLetter(69)).toBe("C");
    expect(qualityLetter(50)).toBe("C");
    expect(qualityLetter(49)).toBeNull();
    expect(qualityLetter(0)).toBeNull();
  });
});
