import type { QualityBreakdown } from "@/types";

// Fallback values applied when a signal does not apply to this asset type
// (for example, PROMPTs cannot be measured for token efficiency).
const FALLBACK_TOKEN_EFFICIENCY = 70;
const FALLBACK_INSTALL_SUCCESS = 80;
const FALLBACK_SCHEMA_CLEAN = 75;

const WEIGHTS = {
  token: 0.25,
  install: 0.15,
  schema: 0.15,
  freshness: 0.15,
  review: 0.2,
  security: 0.1,
} as const;

/**
 * Clamp a value to [0, 100] and round to an integer.
 */
function clampScore(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Compute a 0-100 quality score from the weighted breakdown.
 *
 * Null signals fall back to the type-neutral averages above so that every
 * asset type produces a meaningful score. Security pass contributes 100 or 0.
 * Spec §15 is the source of truth for the formula.
 */
export function qualityScore(breakdown: QualityBreakdown): number {
  const token = breakdown.tokenEfficiency ?? FALLBACK_TOKEN_EFFICIENCY;
  const install = breakdown.installSuccess ?? FALLBACK_INSTALL_SUCCESS;
  const schema = breakdown.schemaClean ?? FALLBACK_SCHEMA_CLEAN;
  const security = breakdown.securityPass ? 100 : 0;

  const raw =
    WEIGHTS.token * token +
    WEIGHTS.install * install +
    WEIGHTS.schema * schema +
    WEIGHTS.freshness * breakdown.freshness +
    WEIGHTS.review * breakdown.reviewScore +
    WEIGHTS.security * security;

  return clampScore(raw);
}

/**
 * Step decay: fresher items get higher freshness scores.
 */
export function freshnessFromDays(daysSinceUpdate: number): number {
  if (daysSinceUpdate <= 7) return 100;
  if (daysSinceUpdate <= 30) return 90;
  if (daysSinceUpdate <= 90) return 75;
  if (daysSinceUpdate <= 180) return 55;
  if (daysSinceUpdate <= 365) return 30;
  return 10;
}

/**
 * Map a numeric score to a letter grade. Returns null below 50.
 */
export function qualityLetter(score: number): "A" | "B" | "C" | null {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return null;
}
