/**
 * Thin fetch wrapper for calling the internal `/api/*` routes from the
 * browser. Every function unwraps the standard `{ data: T }` envelope and
 * throws `ApiError` on non-2xx responses.
 *
 * Usage:
 *   const list = await rulesets.list({ page: 1, pageSize: 20 });
 *   await votes.toggle(ruleset.id);
 *   try { await rulesets.create(input); }
 *   catch (e) { if (e instanceof ApiError && e.code === "VALIDATION_ERROR") {...} }
 *
 * Notes:
 *   - Do NOT use this for NextAuth endpoints (/api/auth/[...nextauth]).
 *     Use `signIn`, `signOut`, `useSession` from `next-auth/react` instead.
 *   - The API layer is the source of truth for shapes. Request bodies are
 *     typed from `src/lib/validations/*`. Response shapes are `RulesetCardData`
 *     or `unknown` for endpoints that don't expose a dedicated type today.
 */

import type {
  ApiSuccessResponse,
  ApiListResponse,
  ApiErrorResponse,
  ApiErrorDetail,
  PaginationMeta,
  RulesetCardData,
} from "@/types";

import type { RegisterInput } from "@/lib/validations/auth";
import type { CreateRulesetInput, UpdateRulesetInput } from "@/lib/validations/rulesets";
import type { UpdateProfileInput } from "@/lib/validations/settings";
import type { CreateBundleInput } from "@/lib/validations/bundles";

/* ─────────────────────────────────────────────────────────────
 * Error class
 * ───────────────────────────────────────────────────────────── */

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(detail: ApiErrorDetail, status: number) {
    super(detail.message);
    this.name = "ApiError";
    this.code = detail.code;
    this.status = status;
    this.details = detail.details;
  }

  /** True when a request failed because the user is not authenticated. */
  get isUnauthorized(): boolean {
    return this.code === "UNAUTHORIZED" || this.status === 401;
  }

  /** True when the user is authenticated but lacks permission. */
  get isForbidden(): boolean {
    return this.code === "FORBIDDEN" || this.status === 403;
  }

  /** True when the target resource does not exist. */
  get isNotFound(): boolean {
    return this.code === "NOT_FOUND" || this.status === 404;
  }

  /** True when the request was blocked by rate limiting. */
  get isRateLimited(): boolean {
    return this.code === "RATE_LIMITED" || this.status === 429;
  }
}

/* ─────────────────────────────────────────────────────────────
 * Base apiClient
 * ───────────────────────────────────────────────────────────── */

export type QueryParam = string | number | boolean | undefined | null;

export interface ApiClientOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Readonly<Record<string, QueryParam>>;
}

/**
 * Base fetch wrapper. Returns the unwrapped `data` field on success,
 * throws `ApiError` otherwise. Use this for endpoints without a dedicated
 * helper; prefer the typed helpers below for known resources.
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { body, query, headers, ...rest } = options;

  let url = endpoint.startsWith("http") ? endpoint : endpoint;
  if (query) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      qs.append(k, String(v));
    }
    const qstr = qs.toString();
    if (qstr) url += (url.includes("?") ? "&" : "?") + qstr;
  }

  const init: RequestInit = {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    if (!res.ok) {
      throw new ApiError(
        { code: "INTERNAL_ERROR", message: res.statusText || "Request failed" },
        res.status,
      );
    }
    return undefined as T;
  }

  if (!res.ok) {
    const err = (payload as ApiErrorResponse)?.error;
    throw new ApiError(
      err ?? { code: "INTERNAL_ERROR", message: "Request failed" },
      res.status,
    );
  }

  // Success envelope: { data: T } or { data: T[], pagination: ... }
  return (payload as ApiSuccessResponse<T>).data;
}

/**
 * Variant of `apiClient` that preserves the `pagination` envelope for
 * list endpoints.
 */
export async function apiClientList<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<{ data: T[]; pagination: PaginationMeta }> {
  const { body, query, headers, ...rest } = options;

  let url = endpoint;
  if (query) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      qs.append(k, String(v));
    }
    const qstr = qs.toString();
    if (qstr) url += (url.includes("?") ? "&" : "?") + qstr;
  }

  const init: RequestInit = {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    throw new ApiError(
      { code: "INTERNAL_ERROR", message: res.statusText || "Request failed" },
      res.status,
    );
  }

  if (!res.ok) {
    const err = (payload as ApiErrorResponse)?.error;
    throw new ApiError(
      err ?? { code: "INTERNAL_ERROR", message: "Request failed" },
      res.status,
    );
  }

  const typed = payload as ApiListResponse<T>;
  return { data: typed.data, pagination: typed.pagination };
}

/* ─────────────────────────────────────────────────────────────
 * Typed endpoint helpers
 * ───────────────────────────────────────────────────────────── */

export interface RulesetListParams {
  page?: number;
  pageSize?: number;
  sort?: "new" | "trending" | "top" | "popular";
  platform?: string;
  type?: string;
  category?: string;
  q?: string;
  authorId?: string;
  tag?: string;
}

export const rulesets = {
  list(params: RulesetListParams = {}) {
    return apiClientList<RulesetCardData>("/api/rulesets", { query: { ...params } });
  },
  /** Fetch a single ruleset by slug. Server returns the full detail payload. */
  get(slug: string) {
    return apiClient<RulesetCardData & { content?: string }>(
      `/api/rulesets/by-slug/${encodeURIComponent(slug)}`,
    );
  },
  getById(id: string) {
    return apiClient<RulesetCardData & { content?: string }>(
      `/api/rulesets/${encodeURIComponent(id)}`,
    );
  },
  create(data: CreateRulesetInput) {
    return apiClient<RulesetCardData>("/api/rulesets", {
      method: "POST",
      body: data,
    });
  },
  update(id: string, data: UpdateRulesetInput) {
    return apiClient<RulesetCardData>(`/api/rulesets/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: data,
    });
  },
  remove(id: string) {
    return apiClient<{ id: string }>(`/api/rulesets/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};

export const votes = {
  toggle(rulesetId: string) {
    return apiClient<{ voted: boolean; voteCount: number }>("/api/votes", {
      method: "POST",
      body: { rulesetId },
    });
  },
};

export interface ReviewCreateInput {
  rating: number;
  comment: string;
}

export interface PublicProfile {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  reputation: number;
  role: "USER" | "PRO" | "ADMIN";
  createdAt: string;
  stats: {
    rulesetCount: number;
    totalDownloads: number;
    totalSales: number;
    followerCount: number;
    followingCount: number;
    avgRating: number;
  };
  isFollowing: boolean;
}

export const reviews = {
  list(rulesetId: string, params: { page?: number; pageSize?: number } = {}) {
    return apiClientList<unknown>(
      `/api/rulesets/${encodeURIComponent(rulesetId)}/reviews`,
      { query: { ...params } },
    );
  },
  create(rulesetId: string, data: ReviewCreateInput) {
    return apiClient<unknown>(
      `/api/rulesets/${encodeURIComponent(rulesetId)}/reviews`,
      { method: "POST", body: data },
    );
  },
  remove(reviewId: string) {
    return apiClient<{ id: string }>(`/api/reviews/${encodeURIComponent(reviewId)}`, {
      method: "DELETE",
    });
  },
};

export const users = {
  /**
   * Public profile lookup by username. Returns a typed profile payload
   * with aggregate stats and a viewer-scoped `isFollowing` flag.
   * Never exposes email or any private field.
   * See `docs/frontend-api-contract.md` → "GET /api/users/:username".
   */
  getProfile(username: string) {
    return apiClient<PublicProfile>(
      `/api/users/${encodeURIComponent(username)}`,
    );
  },
  /** Current user's editable profile (server reads session internally). */
  getOwnProfile() {
    return apiClient<unknown>("/api/settings/profile");
  },
  updateOwnProfile(data: UpdateProfileInput) {
    return apiClient<unknown>("/api/settings/profile", {
      method: "PATCH",
      body: data,
    });
  },
};

export interface CollectionCreateInput {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export const collections = {
  list() {
    return apiClientList<unknown>("/api/collections");
  },
  get(id: string) {
    return apiClient<unknown>(`/api/collections/${encodeURIComponent(id)}`);
  },
  create(data: CollectionCreateInput) {
    return apiClient<unknown>("/api/collections", {
      method: "POST",
      body: data,
    });
  },
  update(id: string, data: Partial<CollectionCreateInput>) {
    return apiClient<unknown>(`/api/collections/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: data,
    });
  },
  remove(id: string) {
    return apiClient<{ id: string }>(`/api/collections/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  addItem(collectionId: string, rulesetId: string) {
    return apiClient<unknown>(
      `/api/collections/${encodeURIComponent(collectionId)}/items`,
      { method: "POST", body: { rulesetId } },
    );
  },
  removeItem(collectionId: string, rulesetId: string) {
    return apiClient<unknown>(
      `/api/collections/${encodeURIComponent(collectionId)}/items`,
      { method: "DELETE", body: { rulesetId } },
    );
  },
};

export const saved = {
  list() {
    return apiClientList<RulesetCardData>("/api/saved");
  },
  toggle(rulesetId: string) {
    return apiClient<{ saved: boolean }>("/api/saved", {
      method: "POST",
      body: { rulesetId },
    });
  },
};

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actorId?: string | null;
  rulesetId?: string | null;
}

export const notifications = {
  list() {
    return apiClient<{ notifications: NotificationItem[]; unreadCount: number }>(
      "/api/notifications",
    );
  },
  /** Mark specific notifications as read. Omit `ids` to mark all as read. */
  markRead(ids?: string[]) {
    return apiClient<{ message: string }>("/api/notifications/read", {
      method: "PATCH",
      body: ids ? { ids } : {},
    });
  },
};

export interface TagSummary {
  id: string;
  name: string;
  count?: number;
}

export const tags = {
  list() {
    return apiClient<TagSummary[]>("/api/tags");
  },
  search(q: string) {
    return apiClient<TagSummary[]>("/api/tags/search", { query: { q } });
  },
  rulesetsByTag(tag: string, params: { page?: number; pageSize?: number } = {}) {
    return apiClientList<RulesetCardData>(
      `/api/tags/${encodeURIComponent(tag)}/rulesets`,
      { query: { ...params } },
    );
  },
};

export interface AnalyticsOverview {
  totalDownloads: number;
  totalRevenue: number;
  totalViews: number;
  totalFollowers: number;
  rulesets: Array<{
    id: string;
    title: string;
    downloadCount: number;
    viewCount: number;
    revenue: number;
  }>;
}

export const analytics = {
  overview() {
    return apiClient<AnalyticsOverview>("/api/analytics/overview");
  },
  ruleset(id: string, period?: "7d" | "30d" | "90d" | "all") {
    return apiClient<unknown>(
      `/api/analytics/rulesets/${encodeURIComponent(id)}`,
      { query: { period } },
    );
  },
  audience() {
    return apiClient<unknown>("/api/analytics/audience");
  },
};

export const downloads = {
  /**
   * Returns the URL the browser should navigate to in order to trigger a
   * download. The backend route issues a presigned URL or 302 redirect;
   * this helper does not fetch it directly because most browsers need a
   * full-page navigation for file downloads.
   */
  getUrl(rulesetId: string, versionId?: string): string {
    const qs = versionId ? `?versionId=${encodeURIComponent(versionId)}` : "";
    return `/api/downloads/${encodeURIComponent(rulesetId)}${qs}`;
  },
  /** Programmatic fetch variant for when a raw response is needed. */
  get(rulesetId: string, versionId?: string) {
    return apiClient<{ url: string }>(
      `/api/downloads/${encodeURIComponent(rulesetId)}`,
      { query: { versionId } },
    );
  },
};

export type PurchaseStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "NONE";

export const purchases = {
  status(rulesetId: string) {
    return apiClient<{ status: PurchaseStatus; purchaseId?: string }>(
      "/api/purchases/status",
      { query: { rulesetId } },
    );
  },
  checkout(rulesetId: string) {
    return apiClient<{ url: string }>("/api/checkout", {
      method: "POST",
      body: { rulesetId },
    });
  },
};

export const uploads = {
  presign(input: { rulesetId: string; filename: string; mimeType: string; size: number }) {
    return apiClient<{
      url: string;
      key: string;
      mimeType: string;
      maxSize: number;
    }>("/api/uploads/presign", { method: "POST", body: input });
  },
  confirm(input: { rulesetId: string; key: string; version?: string }) {
    return apiClient<{ version: { id: string; version: string } }>(
      "/api/uploads/confirm",
      { method: "POST", body: input },
    );
  },
};

export const engagement = {
  follow(userId: string) {
    return apiClient<{ following: boolean }>("/api/follow", {
      method: "POST",
      body: { userId },
    });
  },
  report(input: {
    rulesetId: string;
    reason: "SPAM" | "MALWARE" | "COPYRIGHT" | "INAPPROPRIATE" | "OTHER";
    details?: string;
  }) {
    return apiClient<{ id: string }>("/api/reports", {
      method: "POST",
      body: input,
    });
  },
};

export const discussions = {
  list(params: { page?: number; pageSize?: number; rulesetId?: string } = {}) {
    return apiClientList<unknown>("/api/discussions", { query: { ...params } });
  },
  create(input: { title: string; bodyText: string; category: string; rulesetId?: string }) {
    return apiClient<unknown>("/api/discussions", { method: "POST", body: input });
  },
  replies(id: string, params: { page?: number; pageSize?: number } = {}) {
    return apiClientList<unknown>(
      `/api/discussions/${encodeURIComponent(id)}/replies`,
      { query: { ...params } },
    );
  },
  reply(id: string, input: { bodyText: string; parentReplyId?: string }) {
    return apiClient<unknown>(
      `/api/discussions/${encodeURIComponent(id)}/replies`,
      { method: "POST", body: input },
    );
  },
};

export const bundles = {
  create(data: CreateBundleInput) {
    return apiClient<{ id: string; slug: string }>("/api/bundles", {
      method: "POST",
      body: data,
    });
  },
};

export const auth = {
  register(data: RegisterInput) {
    return apiClient<{ id: string }>("/api/auth/register", {
      method: "POST",
      body: data,
    });
  },
  requestPasswordReset(email: string) {
    return apiClient<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: { email },
    });
  },
  confirmPasswordReset(token: string, newPassword: string) {
    return apiClient<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: { token, newPassword },
    });
  },
  verifyEmail(token: string) {
    return apiClient<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: { token },
    });
  },
};
