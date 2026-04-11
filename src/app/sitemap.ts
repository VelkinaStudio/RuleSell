import type { MetadataRoute } from "next";

import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://rulesell.vercel.app";

// Marketing and platform pages that always exist
const STATIC_PATHS = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/browse", priority: 0.9, changeFrequency: "hourly" as const },
  { path: "/browse/top", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/browse/new", priority: 0.8, changeFrequency: "hourly" as const },
  { path: "/browse/free", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/browse/paid", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/browse/trending", priority: 0.7, changeFrequency: "hourly" as const },
  { path: "/explore", priority: 0.8, changeFrequency: "hourly" as const },
  { path: "/leaderboard", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/collections", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/search", priority: 0.5, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/trust", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/affiliates", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/cli", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/login", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/legal/privacy", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/legal/terms", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/legal/cookies", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/legal/acceptable-use", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/legal/dmca", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/legal/creator-agreement", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/legal/accessibility", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/legal/transparency", priority: 0.4, changeFrequency: "monthly" as const },
];

// Non-default locales get the prefix. Default locale (en) has no prefix
// because routing.localePrefix === "as-needed".
const NON_DEFAULT_LOCALES = routing.locales.filter((l) => l !== routing.defaultLocale);

function withLocalePrefix(path: string, locale: string): string {
  if (locale === routing.defaultLocale) return path;
  return `/${locale}${path}`;
}

function languageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of routing.locales) {
    alternates[locale] = `${SITE_URL}${withLocalePrefix(path, locale)}`;
  }
  alternates["x-default"] = `${SITE_URL}${path}`;
  return alternates;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages across default locale
  for (const { path, priority, changeFrequency } of STATIC_PATHS) {
    entries.push({
      url: `${SITE_URL}${path || "/"}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    });
  }

  // Non-default locale static pages — only index a subset to avoid bloat
  const LOCALIZED_PATHS = STATIC_PATHS.filter((p) => p.priority >= 0.7);
  for (const locale of NON_DEFAULT_LOCALES) {
    for (const { path, priority, changeFrequency } of LOCALIZED_PATHS) {
      entries.push({
        url: `${SITE_URL}${withLocalePrefix(path, locale)}`,
        lastModified: now,
        changeFrequency,
        priority: Math.max(0.3, priority - 0.2),
      });
    }
  }

  // Published rulesets
  try {
    const rulesets = await db.ruleset.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });

    for (const r of rulesets) {
      entries.push({
        url: `${SITE_URL}/r/${r.slug}`,
        lastModified: r.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: languageAlternates(`/r/${r.slug}`) },
      });
    }
  } catch (err) {
    // DB failure should not break sitemap generation for static paths.
    // Log once to build output — sitemap still returns static pages.
    console.error("[sitemap] failed to fetch rulesets:", err);
  }

  return entries;
}
