/**
 * Centralized query-key factory for SWR / TanStack Query.
 *
 * Every cacheable resource exposes a stable array key. Keys are composed
 * hierarchically so that invalidating a parent key (e.g. `keys.rulesets.all`)
 * also invalidates anything nested under it (e.g. `keys.rulesets.detail(slug)`).
 *
 * Usage:
 *   useSWR(keys.rulesets.detail(slug), () => rulesets.get(slug))
 *   mutate(keys.rulesets.all)   // invalidate all ruleset queries
 */

import type { RulesetListParams } from "./api-client";

export const keys = {
  /* ── Rulesets ─────────────────────────────────────── */
  rulesets: {
    all: ["rulesets"] as const,
    list: (filters: RulesetListParams = {}) =>
      ["rulesets", "list", filters] as const,
    detail: (slug: string) => ["rulesets", "detail", slug] as const,
    byId: (id: string) => ["rulesets", "byId", id] as const,
    byTag: (tag: string, filters: RulesetListParams = {}) =>
      ["rulesets", "byTag", tag, filters] as const,
  },

  /* ── Users / profiles ─────────────────────────────── */
  users: {
    all: ["users"] as const,
    profile: (username: string) => ["users", "profile", username] as const,
    ownProfile: ["users", "ownProfile"] as const,
  },

  /* ── Engagement ───────────────────────────────────── */
  votes: {
    all: ["votes"] as const,
    byRuleset: (id: string) => ["votes", "byRuleset", id] as const,
  },

  reviews: {
    all: ["reviews"] as const,
    byRuleset: (id: string) => ["reviews", "byRuleset", id] as const,
  },

  /* ── Notifications ────────────────────────────────── */
  notifications: {
    all: ["notifications"] as const,
    list: ["notifications", "list"] as const,
  },

  /* ── Saved / collections ──────────────────────────── */
  saved: {
    all: ["saved"] as const,
    list: ["saved", "list"] as const,
  },

  collections: {
    all: ["collections"] as const,
    list: ["collections", "list"] as const,
    detail: (id: string) => ["collections", "detail", id] as const,
  },

  /* ── Tags ─────────────────────────────────────────── */
  tags: {
    all: ["tags"] as const,
    list: ["tags", "list"] as const,
    search: (q: string) => ["tags", "search", q] as const,
  },

  /* ── Analytics ────────────────────────────────────── */
  analytics: {
    all: ["analytics"] as const,
    overview: ["analytics", "overview"] as const,
    ruleset: (id: string, period?: string) =>
      ["analytics", "ruleset", id, period ?? "all"] as const,
    audience: ["analytics", "audience"] as const,
  },

  /* ── Purchases / downloads ────────────────────────── */
  purchases: {
    all: ["purchases"] as const,
    status: (rulesetId: string) =>
      ["purchases", "status", rulesetId] as const,
  },

  /* ── Discussions ──────────────────────────────────── */
  discussions: {
    all: ["discussions"] as const,
    list: (rulesetId?: string) =>
      ["discussions", "list", rulesetId ?? "global"] as const,
    replies: (id: string) => ["discussions", "replies", id] as const,
  },
} as const;

export type QueryKey = readonly unknown[];
