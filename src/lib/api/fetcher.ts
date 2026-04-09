import {
  rulesets,
  reviews,
  users,
  collections,
  tags,
  analytics,
  apiClientList,
} from "@/lib/api-client";

// Mock fallbacks for endpoints not yet built
import {
  getAnalyticsOverview,
  getLeaderboard,
  getTeamBySlug,
  isApiError,
} from "./mock-server";
import type { RulesetQuery } from "./types";

export type SWRKey =
  | readonly ["rulesets", RulesetQuery]
  | readonly ["ruleset-by-slug", string]
  | readonly ["ruleset-by-id", string]
  | readonly ["user", string]
  | readonly ["team", string]
  | readonly ["reviews", { rulesetId: string; page?: number; pageSize?: number }]
  | readonly ["collections"]
  | readonly ["collection", string]
  | readonly ["leaderboard", number?]
  | readonly ["analytics-overview", string];

function unwrapMock<T>(value: T) {
  if (isApiError(value)) {
    const err = new Error(value.error.message) as Error & { code?: string };
    err.code = value.error.code;
    throw err;
  }
  return value;
}

function mockDelay<T>(value: T): Promise<T> {
  const ms = 30 + Math.floor(Math.random() * 50);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetcher<T>(key: SWRKey): Promise<T> {
  switch (key[0]) {
    case "rulesets": {
      const q = key[1];
      const result = await rulesets.list({
        page: q.page,
        pageSize: q.pageSize,
        sort: q.tab === "trending" ? "trending" : q.tab === "new" ? "new" : q.sort as "trending" | "new" | "top" | "popular" | undefined,
        platform: q.platform,
        type: q.type,
        category: q.category,
        q: q.q,
      });
      return result as unknown as T;
    }
    case "ruleset-by-slug":
      return rulesets.get(key[1]) as unknown as Promise<T>;
    case "ruleset-by-id":
      return rulesets.getById(key[1]) as unknown as Promise<T>;
    case "user":
      return users.getProfile(key[1]) as unknown as Promise<T>;
    case "team":
      // TODO: endpoint not yet built — using mock
      return mockDelay(unwrapMock(getTeamBySlug(key[1])) as unknown as T);
    case "reviews": {
      const { rulesetId, page, pageSize } = key[1];
      const result = await reviews.list(rulesetId, { page, pageSize });
      return result as unknown as T;
    }
    case "collections":
      return collections.list() as unknown as Promise<T>;
    case "collection":
      return collections.get(key[1]) as unknown as Promise<T>;
    case "leaderboard":
      // TODO: endpoint not yet built — using mock
      return mockDelay(getLeaderboard(key[1]) as unknown as T);
    case "analytics-overview":
      // TODO: endpoint not yet built — using mock (ours doesn't take userId param)
      return mockDelay(getAnalyticsOverview(key[1]) as unknown as T);
    default: {
      const exhaustive: never = key;
      throw new Error(`Unhandled SWR key: ${JSON.stringify(exhaustive)}`);
    }
  }
}
