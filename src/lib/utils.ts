import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price stored in CENTS into a localized currency string.
 * Zero is rendered as "Free" — never "$0".
 *
 * @param cents - integer price in minor units (cents, kuruş, etc.)
 * @param currency - ISO-4217 code, defaults to USD
 * @param locale - BCP-47 locale tag, defaults to en-US (callers in
 *   server components should pass the active locale; client components
 *   reading useLocale() should pass that)
 *
 * Examples:
 *   formatPrice(0)          → "Free"
 *   formatPrice(1900)       → "$19"
 *   formatPrice(1999, "EUR", "tr-TR") → "€20" (rounded, no decimals)
 */
export function formatPrice(
  cents: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  if (cents === 0) return "Free";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/**
 * Format a large integer (downloads, installs, etc.) with K/M suffixes.
 *
 * Examples:
 *   formatCount(42)      → "42"
 *   formatCount(1500)    → "1.5K"
 *   formatCount(2300000) → "2.3M"
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/**
 * Format a relative-time string for "X ago" displays.
 * Returns the largest relevant unit only.
 *
 * Examples:
 *   formatRelative("2026-04-08T10:00:00Z", new Date("2026-04-09T10:00:00Z"))
 *   → "1 day ago"
 */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMs = now.getTime() - then;
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  const yr = Math.floor(day / 365);
  return `${yr}y ago`;
}
