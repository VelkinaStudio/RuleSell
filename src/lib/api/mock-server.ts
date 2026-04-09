import type {
  ApiError,
  Collection,
  Page,
  Review,
  Ruleset,
  Team,
  User,
} from "@/types";

import {
  MOCK_RULESETS,
  MOCK_RULESETS_BY_ID,
  MOCK_RULESETS_BY_SLUG,
} from "@/constants/mock-data";
import { MOCK_USERS, MOCK_USERS_BY_USERNAME } from "@/constants/mock-users";
import { MOCK_TEAMS_BY_SLUG } from "@/constants/mock-teams";
import {
  MOCK_REVIEWS_BY_RULESET,
} from "@/constants/mock-reviews";
import {
  MOCK_COLLECTIONS,
  MOCK_COLLECTIONS_BY_SLUG,
} from "@/constants/mock-collections";

import type { RulesetQuery, RulesetSort, RulesetTab } from "./types";

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 50;
const REFERENCE_TIME = new Date("2026-04-08T12:00:00Z").getTime();

function notFound(message: string): ApiError {
  return { error: { code: "NOT_FOUND", message } };
}

export function isApiError<T>(value: T | ApiError): value is ApiError {
  return typeof value === "object" && value !== null && "error" in value;
}

function trendingScore(r: Ruleset): number {
  const ageDays =
    Math.max(1, (REFERENCE_TIME - new Date(r.createdAt).getTime()) / 86_400_000);
  return (r.purchaseCount * 10 + r.downloadCount) / ageDays;
}

function compareForTab(tab: RulesetTab | undefined, a: Ruleset, b: Ruleset): number {
  switch (tab) {
    case "trending":
      return trendingScore(b) - trendingScore(a);
    case "new":
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    case "top":
    default:
      return b.qualityScore - a.qualityScore;
  }
}

function compareForSort(sort: RulesetSort | undefined, a: Ruleset, b: Ruleset): number | null {
  switch (sort) {
    case "quality":
      return b.qualityScore - a.qualityScore;
    case "popular":
      return b.downloadCount + b.purchaseCount - (a.downloadCount + a.purchaseCount);
    case "recent":
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    case "price_asc":
      return a.price - b.price;
    case "price_desc":
      return b.price - a.price;
    default:
      return null;
  }
}

export function listRulesets(query: RulesetQuery = {}): Page<Ruleset> {
  const pageSize = Math.min(
    Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );
  const page = Math.max(1, query.page ?? 1);

  let items = [...MOCK_RULESETS];

  // Filter by author (matches the seller's user.id since the legacy contract
  // does not expose author.id; we look up by author.username -> user.id).
  if (query.authorId) {
    items = items.filter((r) => {
      const user = MOCK_USERS_BY_USERNAME[r.author.username];
      return user?.id === query.authorId;
    });
  }

  if (query.platform) {
    items = items.filter((r) => r.platform === query.platform);
  }

  if (query.type) {
    items = items.filter((r) => r.type === query.type);
  }

  if (query.category) {
    items = items.filter(
      (r) =>
        r.category === query.category ||
        r.secondaryCategories.includes(query.category!),
    );
  }

  if (query.environment) {
    items = items.filter((r) =>
      r.variants.some((v) => v.environments.includes(query.environment!)),
    );
  }

  if (query.price === "free") {
    items = items.filter((r) => r.price === 0);
  } else if (query.price === "paid") {
    items = items.filter((r) => r.price > 0);
  }

  if (query.tab === "editors") {
    items = items.filter((r) => r.badges.includes("EDITORS_PICK"));
  }

  if (query.q) {
    const needle = query.q.toLowerCase();
    items = items.filter(
      (r) =>
        r.title.toLowerCase().includes(needle) ||
        r.description.toLowerCase().includes(needle) ||
        r.tags.some((t) => t.toLowerCase().includes(needle)),
    );
  }

  // Sort: explicit sort overrides tab sort.
  const explicit = query.sort ? compareForSort.bind(null, query.sort) : null;
  items.sort((a, b) => {
    if (explicit) {
      const cmp = explicit(a, b);
      if (cmp !== null && cmp !== 0) return cmp;
    } else {
      const cmp = compareForTab(query.tab, a, b);
      if (cmp !== 0) return cmp;
    }
    // Deterministic tiebreaker on id so paginated results are stable.
    return a.id.localeCompare(b.id);
  });

  const total = items.length;
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  const hasNext = start + pageSize < total;
  const hasPrev = page > 1;

  return {
    data,
    pagination: {
      total,
      page,
      pageSize,
      hasNext,
      hasPrev,
    },
  };
}

export function getRulesetBySlug(slug: string): Ruleset | ApiError {
  const r = MOCK_RULESETS_BY_SLUG[slug];
  return r ?? notFound(`Ruleset with slug "${slug}" was not found.`);
}

export function getRulesetById(id: string): Ruleset | ApiError {
  const r = MOCK_RULESETS_BY_ID[id];
  return r ?? notFound(`Ruleset with id "${id}" was not found.`);
}

export function getUserByUsername(username: string): User | ApiError {
  const u = MOCK_USERS_BY_USERNAME[username];
  return u ?? notFound(`User "${username}" was not found.`);
}

export function getTeamBySlug(slug: string): Team | ApiError {
  const t = MOCK_TEAMS_BY_SLUG[slug];
  return t ?? notFound(`Team "${slug}" was not found.`);
}

export function listReviews(
  rulesetId: string,
  page = 1,
  pageSize = 10,
): Page<Review> {
  const all = MOCK_REVIEWS_BY_RULESET[rulesetId] ?? [];
  const start = (page - 1) * pageSize;
  const data = all.slice(start, start + pageSize);
  return {
    data,
    pagination: {
      total: all.length,
      page,
      pageSize,
      hasNext: start + pageSize < all.length,
      hasPrev: page > 1,
    },
  };
}

export function listCollections(): Collection[] {
  return MOCK_COLLECTIONS;
}

export function getCollectionBySlug(slug: string): Collection | ApiError {
  const c = MOCK_COLLECTIONS_BY_SLUG[slug];
  return c ?? notFound(`Collection "${slug}" was not found.`);
}

export function getLeaderboard(limit = 100): User[] {
  return [...MOCK_USERS]
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, limit);
}

export interface AnalyticsTrendPoint {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface AnalyticsRevenuePoint {
  date: string; // YYYY-MM-DD
  amount: number; // cents
}

export interface AnalyticsOverview {
  totalRulesets: number;
  totalInstalls: number;
  totalRevenue: number; // cents
  last30dInstalls: number;
  last30dRevenue: number; // cents
  recentInstalls: AnalyticsTrendPoint[]; // 30 days, oldest → newest
  recentRevenue: AnalyticsRevenuePoint[]; // 30 days, oldest → newest
}

// Reference "today" for the mock layer. The trend series spans the 30 days
// ending on this date. Keeping it fixed makes the dashboard deterministic
// across renders and across CI runs.
const ANALYTICS_TODAY = new Date("2026-04-08T12:00:00Z");

/**
 * Tiny seeded RNG (mulberry32) — deterministic per (userId, day) so chart
 * data does not jitter across renders. Using the seed pattern instead of a
 * full PRNG library because we only need ~60 numbers.
 */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function next() {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function hashString(s: string): number {
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Build a 30-day series of plausible-looking data anchored on the supplied
 * total. Applies a gentle upward trend, weekly seasonality (weekends ~25%
 * lower), and a small per-day jitter. Result is non-negative and the sum
 * approximates `monthlyTotal` so a "Last 30 days" sum matches the bar chart.
 */
function buildTrendSeries(monthlyTotal: number, seed: number): number[] {
  if (monthlyTotal <= 0) return Array.from({ length: 30 }, () => 0);
  const rng = mulberry32(seed);
  // Weekly seasonality multipliers — Mon..Sun, 1.0 baseline
  const weekday = [1.05, 1.1, 1.1, 1.1, 1.0, 0.7, 0.75];
  // Gentle linear trend across the 30 days: oldest = 0.85x, newest = 1.15x
  const series: number[] = [];
  let runningWeights = 0;
  const weights: number[] = [];
  for (let i = 0; i < 30; i++) {
    const day = new Date(ANALYTICS_TODAY);
    day.setUTCDate(day.getUTCDate() - (29 - i));
    const dow = (day.getUTCDay() + 6) % 7; // Mon=0..Sun=6
    const trend = 0.85 + (i / 29) * 0.3;
    const jitter = 0.85 + rng() * 0.3;
    const w = weekday[dow] * trend * jitter;
    weights.push(w);
    runningWeights += w;
  }
  for (const w of weights) {
    series.push(Math.max(0, Math.round((w / runningWeights) * monthlyTotal)));
  }
  return series;
}

function buildRecentInstalls(monthlyTotal: number, seed: number): AnalyticsTrendPoint[] {
  const counts = buildTrendSeries(monthlyTotal, seed);
  return counts.map((count, i) => {
    const day = new Date(ANALYTICS_TODAY);
    day.setUTCDate(day.getUTCDate() - (29 - i));
    return { date: isoDay(day), count };
  });
}

function buildRecentRevenue(monthlyTotal: number, seed: number): AnalyticsRevenuePoint[] {
  const amounts = buildTrendSeries(monthlyTotal, seed ^ 0x5eeded);
  return amounts.map((amount, i) => {
    const day = new Date(ANALYTICS_TODAY);
    day.setUTCDate(day.getUTCDate() - (29 - i));
    return { date: isoDay(day), amount };
  });
}

function emptyOverview(): AnalyticsOverview {
  return {
    totalRulesets: 0,
    totalInstalls: 0,
    totalRevenue: 0,
    last30dInstalls: 0,
    last30dRevenue: 0,
    recentInstalls: [],
    recentRevenue: [],
  };
}

export function getAnalyticsOverview(userId: string): AnalyticsOverview {
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return emptyOverview();

  const owned = MOCK_RULESETS.filter((r) => r.author.username === user.username);
  const totalInstalls = owned.reduce(
    (sum, r) => sum + r.downloadCount + r.purchaseCount,
    0,
  );
  const totalRevenue = user.sellerStats?.totalEarnings ?? 0;

  // The "last 30 days" approximates the most recent slice of activity. We
  // pick a fraction of total installs that scales with how new the seller
  // is, with a floor so even mature sellers see meaningful recent activity.
  const monthlyInstalls = Math.round(totalInstalls * 0.08);
  const monthlyRevenue = Math.round(totalRevenue * 0.12);

  const seed = hashString(user.id);
  const recentInstalls = buildRecentInstalls(monthlyInstalls, seed);
  const recentRevenue = buildRecentRevenue(monthlyRevenue, seed);

  return {
    totalRulesets: owned.length,
    totalInstalls,
    totalRevenue,
    last30dInstalls: recentInstalls.reduce((s, p) => s + p.count, 0),
    last30dRevenue: recentRevenue.reduce((s, p) => s + p.amount, 0),
    recentInstalls,
    recentRevenue,
  };
}
