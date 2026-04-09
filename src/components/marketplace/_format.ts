// Marketplace-only helpers. The price/count formatters now live in
// @/lib/utils — re-exported here so existing imports keep working while
// callers migrate. The daysSince helper is marketplace-specific (returns a
// raw integer day count, not a "X ago" string).

export { formatCount, formatPrice } from "@/lib/utils";

export function daysSince(iso: string, now: number = Date.now()): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((now - t) / 86_400_000));
}
