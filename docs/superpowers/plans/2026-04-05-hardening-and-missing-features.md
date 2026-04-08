# Hardening & Missing Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close security gaps (proxy/route protection, input validation, rate limiting) and add missing pages (/creators, profile edit, bundle create form) so the app is ready for real users.

**Architecture:** Six independent workstreams: (1) proxy.ts for route protection, (2) Zod validation on all write endpoints, (3) rate limiting on auth/write endpoints, (4) /creators browse page, (5) profile settings page, (6) bundle create form. Each is self-contained and can be done in any order.

**Tech Stack:** Next.js 16 (proxy.ts, not middleware.ts), Zod, NextAuth JWT cookies, Prisma.

---

## File Structure

```
src/
├── proxy.ts                              # NEW — route protection (Next.js 16 convention)
├── lib/
│   ├── validations/
│   │   ├── auth.ts                       # NEW — Zod schemas for register/login
│   │   ├── rulesets.ts                   # NEW — Zod schemas for ruleset CRUD
│   │   ├── engagement.ts                 # NEW — Zod schemas for votes, follows, saved, reports
│   │   ├── collections.ts               # NEW — Zod schemas for collections
│   │   └── discussions.ts               # NEW — Zod schemas for discussions/replies
│   └── rate-limit.ts                     # NEW — in-memory rate limiter
├── app/
│   ├── (public)/creators/page.tsx        # NEW — creators browse page
│   ├── settings/
│   │   ├── profile/page.tsx              # NEW — profile edit page
│   │   └── layout.tsx                    # MODIFY — add profile link to settings nav
│   └── dashboard/bundles/new/page.tsx    # NEW — bundle create form
└── components/
    └── settings/profile-form.tsx         # NEW — profile edit form component
```

---

### Task 1: Route protection with proxy.ts

**Files:**
- Create: `src/proxy.ts`
- Test: `tests/api/proxy.test.ts`

Next.js 16 uses `proxy.ts` (not `middleware.ts`). The function is named `proxy`, exported from the project root or `src/`. We use NextAuth's JWT session cookie to check auth state without hitting the database.

- [ ] **Step 1: Create proxy.ts with route protection**

```ts
// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/settings"];
const adminPrefixes = ["/admin"];
const authPages = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // NextAuth JWT session cookie (set by next-auth with JWT strategy)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isAuthenticated = !!sessionToken;

  // Protected routes: redirect to login if not authenticated
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes: redirect to login if not authenticated
  // (Role check still happens server-side; this is an optimistic guard)
  const isAdmin = adminPrefixes.some((p) => pathname.startsWith(p));
  if (isAdmin && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Auth pages: redirect to dashboard if already authenticated
  const isAuthPage = authPages.includes(pathname);
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

- [ ] **Step 2: Write tests for proxy behavior**

```ts
// tests/api/proxy.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { login, fetchPage, ACCOUNTS, BASE_URL } from "../helpers";

describe("Proxy route protection", () => {
  it("redirects /dashboard/overview to /login when not authenticated", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/overview`, { redirect: "manual" });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("redirects /settings/billing to /login when not authenticated", async () => {
    const res = await fetch(`${BASE_URL}/settings/billing`, { redirect: "manual" });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("redirects /admin to /login when not authenticated", async () => {
    const res = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("allows authenticated access to /dashboard/overview", async () => {
    const session = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
    const { status } = await fetchPage("/dashboard/overview", session.cookies);
    expect(status).toBe(200);
  });

  it("allows public access to /search", async () => {
    const res = await fetch(`${BASE_URL}/search`, { redirect: "manual" });
    expect([200, 307]).toContain(res.status);
    if (res.status === 307) {
      expect(res.headers.get("location")).not.toContain("/login");
    }
  });

  it("redirects /login to /dashboard when already authenticated", async () => {
    const session = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
    const res = await session.fetch("/login");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/dashboard");
  });

  it("includes callbackUrl when redirecting to login", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/analytics`, { redirect: "manual" });
    const location = res.headers.get("location") || "";
    expect(location).toContain("callbackUrl");
    expect(location).toContain("analytics");
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run tests/api/proxy.test.ts`
Expected: All pass

- [ ] **Step 4: Commit**

```bash
git add src/proxy.ts tests/api/proxy.test.ts
git commit -m "feat: add proxy.ts route protection for dashboard, admin, settings"
```

---

### Task 2: Install Zod and create validation schemas

**Files:**
- Create: `src/lib/validations/auth.ts`
- Create: `src/lib/validations/rulesets.ts`
- Create: `src/lib/validations/engagement.ts`
- Create: `src/lib/validations/collections.ts`
- Create: `src/lib/validations/discussions.ts`
- Test: `tests/unit/validations.test.ts`

- [ ] **Step 1: Install Zod**

```bash
npm install zod
```

- [ ] **Step 2: Create auth validation schemas**

```ts
// src/lib/validations/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
```

- [ ] **Step 3: Create ruleset validation schemas**

```ts
// src/lib/validations/rulesets.ts
import { z } from "zod";

const rulesetTypes = ["RULESET", "PROMPT", "WORKFLOW", "AGENT", "BUNDLE", "DATASET"] as const;
const platforms = ["CURSOR", "VSCODE", "OBSIDIAN", "N8N", "MAKE", "GEMINI", "CLAUDE", "CHATGPT", "OTHER"] as const;

export const createRulesetSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  previewContent: z.string().min(1, "Preview content is required"),
  type: z.enum(rulesetTypes),
  platform: z.enum(platforms),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0).default(0),
  content: z.string().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const updateRulesetSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  previewContent: z.string().min(1).optional(),
  type: z.enum(rulesetTypes).optional(),
  platform: z.enum(platforms).optional(),
  category: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export type CreateRulesetInput = z.infer<typeof createRulesetSchema>;
export type UpdateRulesetInput = z.infer<typeof updateRulesetSchema>;
```

- [ ] **Step 4: Create engagement validation schemas**

```ts
// src/lib/validations/engagement.ts
import { z } from "zod";

export const voteSchema = z.object({
  rulesetId: z.string().min(1, "rulesetId is required"),
});

export const followSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const saveSchema = z.object({
  rulesetId: z.string().min(1, "rulesetId is required"),
});

export const reportSchema = z.object({
  rulesetId: z.string().min(1, "rulesetId is required"),
  reason: z.enum(["SPAM", "MALWARE", "COPYRIGHT", "INAPPROPRIATE", "OTHER"]),
  details: z.string().max(1000).optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, "Comment is required").max(2000),
});
```

- [ ] **Step 5: Create collections validation schemas**

```ts
// src/lib/validations/collections.ts
import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
});
```

- [ ] **Step 6: Create discussions validation schemas**

```ts
// src/lib/validations/discussions.ts
import { z } from "zod";

export const createDiscussionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  bodyText: z.string().min(1, "Body is required").max(5000),
  category: z.string().min(1, "Category is required"),
  rulesetId: z.string().optional(),
});

export const createReplySchema = z.object({
  bodyText: z.string().min(1, "Body is required").max(5000),
  parentReplyId: z.string().optional(),
});
```

- [ ] **Step 7: Write unit tests for validation schemas**

```ts
// tests/unit/validations.test.ts
import { describe, it, expect } from "vitest";
import { registerSchema } from "@/lib/validations/auth";
import { createRulesetSchema } from "@/lib/validations/rulesets";
import { voteSchema, reportSchema, reviewSchema } from "@/lib/validations/engagement";
import { createCollectionSchema } from "@/lib/validations/collections";
import { createDiscussionSchema, createReplySchema } from "@/lib/validations/discussions";

describe("registerSchema", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      username: "testuser",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      password: "password123",
      name: "Test",
      username: "testuser",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "short",
      name: "Test",
      username: "testuser",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid username characters", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      name: "Test",
      username: "user name!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects username too short", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      name: "Test",
      username: "ab",
    });
    expect(result.success).toBe(false);
  });
});

describe("createRulesetSchema", () => {
  it("accepts valid input", () => {
    const result = createRulesetSchema.safeParse({
      title: "My Ruleset",
      description: "A great ruleset",
      previewContent: "Preview here",
      type: "RULESET",
      platform: "CURSOR",
      category: "development",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid platform", () => {
    const result = createRulesetSchema.safeParse({
      title: "My Ruleset",
      description: "A great ruleset",
      previewContent: "Preview",
      type: "RULESET",
      platform: "INVALID",
      category: "development",
    });
    expect(result.success).toBe(false);
  });

  it("defaults price to 0", () => {
    const result = createRulesetSchema.safeParse({
      title: "My Ruleset",
      description: "A great ruleset",
      previewContent: "Preview",
      type: "RULESET",
      platform: "CURSOR",
      category: "dev",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.price).toBe(0);
  });
});

describe("reviewSchema", () => {
  it("accepts valid rating 1-5", () => {
    expect(reviewSchema.safeParse({ rating: 1, comment: "OK" }).success).toBe(true);
    expect(reviewSchema.safeParse({ rating: 5, comment: "Great" }).success).toBe(true);
  });

  it("rejects rating out of range", () => {
    expect(reviewSchema.safeParse({ rating: 0, comment: "Bad" }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: 6, comment: "Too good" }).success).toBe(false);
  });
});

describe("reportSchema", () => {
  it("rejects invalid reason", () => {
    const result = reportSchema.safeParse({ rulesetId: "abc", reason: "INVALID" });
    expect(result.success).toBe(false);
  });

  it("accepts valid reason", () => {
    const result = reportSchema.safeParse({ rulesetId: "abc", reason: "SPAM" });
    expect(result.success).toBe(true);
  });
});

describe("createCollectionSchema", () => {
  it("defaults isPublic to true", () => {
    const result = createCollectionSchema.safeParse({ name: "My Collection" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isPublic).toBe(true);
  });
});

describe("createDiscussionSchema", () => {
  it("accepts valid input", () => {
    const result = createDiscussionSchema.safeParse({
      title: "Test",
      bodyText: "Body content",
      category: "general",
    });
    expect(result.success).toBe(true);
  });
});

describe("createReplySchema", () => {
  it("rejects empty body", () => {
    const result = createReplySchema.safeParse({ bodyText: "" });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 8: Run tests**

Run: `npx vitest run tests/unit/validations.test.ts`
Expected: All pass

- [ ] **Step 9: Commit**

```bash
git add src/lib/validations/ tests/unit/validations.test.ts package.json package-lock.json
git commit -m "feat: add Zod validation schemas for all API endpoints"
```

---

### Task 3: Apply Zod schemas to API routes

**Files:**
- Modify: `src/app/api/auth/register/route.ts`
- Modify: `src/app/api/rulesets/route.ts` (POST)
- Modify: `src/app/api/rulesets/[id]/route.ts` (PATCH)
- Modify: `src/app/api/votes/route.ts`
- Modify: `src/app/api/follow/route.ts`
- Modify: `src/app/api/saved/route.ts` (POST)
- Modify: `src/app/api/reports/route.ts`
- Modify: `src/app/api/rulesets/[id]/reviews/route.ts` (POST)
- Modify: `src/app/api/collections/route.ts` (POST)
- Modify: `src/app/api/collections/[id]/route.ts` (PATCH)
- Modify: `src/app/api/discussions/route.ts` (POST)
- Modify: `src/app/api/discussions/[id]/replies/route.ts` (POST)

For each route, the change is the same pattern — replace manual `if (!field)` checks with:

```ts
const parsed = schema.safeParse(body);
if (!parsed.success) {
  return errors.validation("Validation failed", {
    issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
  });
}
const { field1, field2 } = parsed.data;
```

- [ ] **Step 1: Update register route**

In `src/app/api/auth/register/route.ts`, replace lines 9-29 (manual validation) with:

```ts
import { registerSchema } from "@/lib/validations/auth";

// ... inside POST handler, replace manual checks with:
const parsed = registerSchema.safeParse(body);
if (!parsed.success) {
  return errors.validation("Validation failed", {
    issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
  });
}
const { email, password, name, username } = parsed.data;
```

- [ ] **Step 2: Update rulesets POST route**

In `src/app/api/rulesets/route.ts`, replace lines 42-46 (manual field check) with:

```ts
import { createRulesetSchema } from "@/lib/validations/rulesets";

// Inside POST:
const parsed = createRulesetSchema.safeParse(body);
if (!parsed.success) {
  return errors.validation("Validation failed", {
    issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
  });
}
const { title, description, previewContent, type, platform, category, price, content, tags } = parsed.data;
```

- [ ] **Step 3: Update rulesets PATCH route**

In `src/app/api/rulesets/[id]/route.ts` PATCH handler, add:

```ts
import { updateRulesetSchema } from "@/lib/validations/rulesets";

// Inside PATCH, after ownership check:
const parsed = updateRulesetSchema.safeParse(body);
if (!parsed.success) {
  return errors.validation("Validation failed", {
    issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
  });
}
const { title, description, previewContent, type, platform, category, price, status } = parsed.data;
```

- [ ] **Step 4: Update engagement routes (votes, follow, saved, reports)**

Apply `voteSchema` to `src/app/api/votes/route.ts`, `followSchema` to `src/app/api/follow/route.ts`, `saveSchema` to `src/app/api/saved/route.ts` POST, `reportSchema` to `src/app/api/reports/route.ts`. Each follows the same `safeParse` pattern.

- [ ] **Step 5: Update reviews POST route**

Apply `reviewSchema` to `src/app/api/rulesets/[id]/reviews/route.ts` POST.

- [ ] **Step 6: Update collections routes**

Apply `createCollectionSchema` to `src/app/api/collections/route.ts` POST, `updateCollectionSchema` to `src/app/api/collections/[id]/route.ts` PATCH.

- [ ] **Step 7: Update discussions routes**

Apply `createDiscussionSchema` to `src/app/api/discussions/route.ts` POST, `createReplySchema` to `src/app/api/discussions/[id]/replies/route.ts` POST.

- [ ] **Step 8: Run existing API tests to verify nothing broke**

Run: `npx vitest run tests/api`
Expected: All 75 tests pass (validation behavior unchanged, just stricter)

- [ ] **Step 9: Commit**

```bash
git add src/app/api/
git commit -m "refactor: replace manual validation with Zod schemas across all API routes"
```

---

### Task 4: Rate limiting

**Files:**
- Create: `src/lib/rate-limit.ts`
- Modify: `src/app/api/auth/register/route.ts`
- Modify: `src/app/api/rulesets/route.ts` (POST)
- Modify: `src/app/api/votes/route.ts`
- Modify: `src/app/api/follow/route.ts`
- Modify: `src/app/api/discussions/route.ts` (POST)
- Test: `tests/unit/rate-limit.test.ts`

- [ ] **Step 1: Create rate limiter**

```ts
// src/lib/rate-limit.ts

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  entry.count++;
  if (entry.count > limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
```

- [ ] **Step 2: Write rate limit unit tests**

```ts
// tests/unit/rate-limit.test.ts
import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests within limit", () => {
    const key = `test-${Date.now()}`;
    const result = rateLimit(key, 3, 60000);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests over limit", () => {
    const key = `test-block-${Date.now()}`;
    rateLimit(key, 2, 60000);
    rateLimit(key, 2, 60000);
    const result = rateLimit(key, 2, 60000);
    expect(result.ok).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("returns resetAt timestamp", () => {
    const key = `test-reset-${Date.now()}`;
    const result = rateLimit(key, 5, 60000);
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run tests/unit/rate-limit.test.ts`
Expected: All pass

- [ ] **Step 4: Apply rate limiting to auth register**

In `src/app/api/auth/register/route.ts`, add before validation:

```ts
import { rateLimit } from "@/lib/rate-limit";

// Inside POST, at the top:
const ip = req.headers.get("x-forwarded-for") || "unknown";
const rl = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000); // 5 per 15min
if (!rl.ok) return errors.rateLimited("Too many registration attempts");
```

- [ ] **Step 5: Apply rate limiting to rulesets POST, votes, follow, discussions POST**

Same pattern for each — rate limit by user ID (from session) to prevent abuse:

```ts
const rl = rateLimit(`votes:${session.user.id}`, 30, 60 * 1000); // 30 per minute
if (!rl.ok) return errors.rateLimited();
```

Limits:
- `POST /api/rulesets`: 10 per hour per user
- `POST /api/votes`: 30 per minute per user
- `POST /api/follow`: 20 per minute per user
- `POST /api/discussions`: 5 per minute per user

- [ ] **Step 6: Run full API test suite**

Run: `npx vitest run tests/api`
Expected: All pass (rate limits are generous enough not to trip during tests)

- [ ] **Step 7: Commit**

```bash
git add src/lib/rate-limit.ts tests/unit/rate-limit.test.ts src/app/api/
git commit -m "feat: add rate limiting to auth, write, and engagement endpoints"
```

---

### Task 5: Creators browse page

**Files:**
- Create: `src/app/(public)/creators/page.tsx`
- Test: `tests/pages/public.test.ts` (add one test)
- Test: `tests/ui/homepage.spec.ts` (verify nav link works)

- [ ] **Step 1: Create creators page**

```tsx
// src/app/(public)/creators/page.tsx
import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Creators — Ruleset" };

export default async function CreatorsPage() {
  const creators = await db.user.findMany({
    where: {
      rulesets: { some: { status: "PUBLISHED" } },
    },
    orderBy: { totalEarnings: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          rulesets: { where: { status: "PUBLISHED" } },
          followers: true,
        },
      },
    },
  });

  return (
    <div className="container-page section-gap">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Creators</h1>
        <p className="text-sm text-text-tertiary">
          Discover the builders behind the best AI assets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creators.map((creator) => (
          <Link
            key={creator.id}
            href={`/u/${creator.username}`}
            className="card-hover p-5 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-purple/20 border border-border-primary flex items-center justify-center text-lg font-bold text-text-secondary shrink-0">
              {creator.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-text-primary truncate">
                  {creator.name}
                </span>
                {creator.role === "PRO" && <Badge variant="green">Pro</Badge>}
              </div>
              <p className="text-xs text-text-tertiary mb-2">@{creator.username}</p>
              {creator.bio && (
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                  {creator.bio}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-text-tertiary">
                <span>{creator._count.rulesets} products</span>
                <span>{creator._count.followers} followers</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {creators.length === 0 && (
        <div className="card py-16 text-center text-text-tertiary">
          <p>No creators yet. Be the first to publish!</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add test for creators page**

In `tests/pages/public.test.ts`, add:

```ts
it("GET /creators", async () => {
  const { status } = await fetchPage("/creators");
  expect(status).toBe(200);
});
```

- [ ] **Step 3: Run test**

Run: `npx vitest run tests/pages/public.test.ts`
Expected: All pass including new test

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/creators/page.tsx tests/pages/public.test.ts
git commit -m "feat: add /creators browse page"
```

---

### Task 6: Profile settings page

**Files:**
- Create: `src/app/settings/profile/page.tsx`
- Create: `src/components/settings/profile-form.tsx`
- Create: `src/app/api/settings/profile/route.ts`
- Create: `src/lib/validations/settings.ts`
- Modify: `src/app/settings/layout.tsx`
- Test: `tests/api/settings.test.ts`

- [ ] **Step 1: Read the settings layout to understand the nav structure**

Read: `src/app/settings/layout.tsx`

- [ ] **Step 2: Create profile validation schema**

```ts
// src/lib/validations/settings.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
    .optional(),
  bio: z.string().max(500).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
```

- [ ] **Step 3: Create profile API route**

```ts
// src/app/api/settings/profile/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { updateProfileSchema } from "@/lib/validations/settings";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, username: true, email: true, bio: true, avatar: true },
    });

    return success(user);
  } catch {
    return errors.internal();
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }

    const { name, username, bio } = parsed.data;

    // Check username uniqueness if changing
    if (username && username.toLowerCase() !== session.user.username) {
      const existing = await db.user.findUnique({
        where: { username: username.toLowerCase() },
      });
      if (existing) return errors.conflict("Username is already taken");
    }

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(username !== undefined && { username: username.toLowerCase() }),
        ...(bio !== undefined && { bio }),
      },
      select: { id: true, name: true, username: true, bio: true },
    });

    return success(updated);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 4: Create profile form component**

```tsx
// src/components/settings/profile-form.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileData {
  name: string;
  username: string;
  email: string;
  bio: string | null;
}

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, bio: bio || undefined }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error?.message || "Update failed");
    } else {
      setMessage("Profile updated");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {error && (
        <div className="p-3 text-sm text-status-error border border-status-error/30 bg-status-error/10 rounded-md">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 text-sm text-accent-green border border-accent-green/30 bg-accent-green-subtle rounded-md">
          {message}
        </div>
      )}

      <Input label="Email" value={profile.email} disabled />
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        minLength={3}
        maxLength={30}
      />
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-green/40 focus:outline-none transition-colors resize-none"
          placeholder="Tell people about yourself..."
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 5: Create profile settings page**

```tsx
// src/app/settings/profile/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/settings/profile-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile Settings — Ruleset" };

export default async function ProfileSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, username: true, email: true, bio: true },
  });

  if (!profile) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
```

- [ ] **Step 6: Add profile link to settings layout nav**

Read `src/app/settings/layout.tsx` and add `{ href: "/settings/profile", label: "Profile" }` as the first item in the settings nav.

- [ ] **Step 7: Write API tests for profile endpoint**

```ts
// tests/api/settings.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { login, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

describe("GET /api/settings/profile", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/settings/profile");
    expect(res.status).toBe(401);
  });

  it("returns profile data", async () => {
    const { status, body } = await alice.getJSON<{
      data: { name: string; username: string; email: string };
    }>("/api/settings/profile");
    expect(status).toBe(200);
    expect(body.data.email).toBe(ACCOUNTS.alice.email);
  });
});

describe("PATCH /api/settings/profile", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Name" }),
    });
    expect(res.status).toBe(401);
  });

  it("updates name", async () => {
    const { status, body } = await alice.patchJSON<{ data: { name: string } }>(
      "/api/settings/profile",
      { name: "Alice Updated" },
    );
    expect(status).toBe(200);
    expect(body.data.name).toBe("Alice Updated");

    // Restore original
    await alice.patchJSON("/api/settings/profile", { name: "Alice Johnson" });
  });

  it("rejects invalid username", async () => {
    const { status } = await alice.patchJSON("/api/settings/profile", {
      username: "a",
    });
    expect(status).toBe(400);
  });
});
```

- [ ] **Step 8: Run tests**

Run: `npx vitest run tests/api/settings.test.ts`
Expected: All pass

- [ ] **Step 9: Commit**

```bash
git add src/lib/validations/settings.ts src/app/api/settings/ src/app/settings/profile/ src/components/settings/ src/app/settings/layout.tsx tests/api/settings.test.ts
git commit -m "feat: add profile settings page with edit form and API"
```

---

### Task 7: Bundle create form

**Files:**
- Create: `src/app/dashboard/bundles/new/page.tsx`
- Create: `src/app/api/bundles/route.ts`
- Create: `src/lib/validations/bundles.ts`
- Test: `tests/api/bundles.test.ts`

- [ ] **Step 1: Create bundle validation schema**

```ts
// src/lib/validations/bundles.ts
import { z } from "zod";

export const createBundleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  price: z.number().min(0, "Price must be positive"),
  rulesetIds: z.array(z.string()).min(2, "A bundle must contain at least 2 items"),
});

export type CreateBundleInput = z.infer<typeof createBundleSchema>;
```

- [ ] **Step 2: Create bundles API route**

```ts
// src/app/api/bundles/route.ts
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { slugify } from "@/lib/slugify";
import { createBundleSchema } from "@/lib/validations/bundles";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const parsed = createBundleSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }

    const { title, description, price, rulesetIds } = parsed.data;

    // Verify all rulesets exist and belong to the user
    const rulesets = await db.ruleset.findMany({
      where: { id: { in: rulesetIds }, authorId: session.user.id },
      select: { id: true },
    });

    if (rulesets.length !== rulesetIds.length) {
      return errors.validation("Some rulesets not found or not owned by you");
    }

    let slug = slugify(title);
    const existing = await db.rulesetBundle.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const bundle = await db.rulesetBundle.create({
      data: {
        title,
        slug,
        description,
        price,
        authorId: session.user.id,
        items: {
          create: rulesetIds.map((rulesetId) => ({ rulesetId })),
        },
      },
      include: { _count: { select: { items: true } } },
    });

    return success(bundle, 201);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 3: Create bundle new page (form)**

```tsx
// src/app/dashboard/bundles/new/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BundleForm } from "./bundle-form";

export const metadata: Metadata = { title: "Create Bundle — Ruleset" };

export default async function NewBundlePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rulesets = await db.ruleset.findMany({
    where: { authorId: session.user.id, status: { in: ["PUBLISHED", "DRAFT"] } },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, price: true, status: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Create Bundle</h1>
      <BundleForm rulesets={rulesets} />
    </div>
  );
}
```

- [ ] **Step 4: Create bundle form component**

```tsx
// src/app/dashboard/bundles/new/bundle-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Ruleset {
  id: string;
  title: string;
  price: number;
  status: string;
}

export function BundleForm({ rulesets }: { rulesets: Ruleset[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleRuleset(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/bundles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        price: parseFloat(price) || 0,
        rulesetIds: Array.from(selectedIds),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error?.message || "Failed to create bundle");
    } else {
      router.push("/dashboard/bundles");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {error && (
        <div className="p-3 text-sm text-status-error border border-status-error/30 bg-status-error/10 rounded-md">
          {error}
        </div>
      )}

      <Input
        label="Bundle Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Ultimate Cursor Rules Pack"
        required
      />

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-green/40 focus:outline-none transition-colors resize-none"
          placeholder="What makes this bundle valuable?"
        />
      </div>

      <Input
        label="Price ($)"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="19.99"
        min="0"
        step="0.01"
        required
      />

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Select Rulesets ({selectedIds.size} selected, min 2)
        </label>
        {rulesets.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {rulesets.map((r) => (
              <label
                key={r.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedIds.has(r.id)
                    ? "border-accent-green/40 bg-accent-green-subtle"
                    : "border-border-primary hover:border-border-hover"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(r.id)}
                  onChange={() => toggleRuleset(r.id)}
                  className="accent-accent-green"
                />
                <span className="text-sm text-text-primary flex-1 truncate">{r.title}</span>
                <span className="text-xs text-text-tertiary">
                  {r.price === 0 ? "Free" : `$${r.price.toFixed(2)}`}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-tertiary">
            You need to create some rulesets first before bundling them.
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading || selectedIds.size < 2}>
        {loading ? "Creating..." : "Create Bundle"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 5: Update bundles page "New Bundle" button to link**

In `src/app/dashboard/bundles/page.tsx`, change the `<Button size="sm">New Bundle</Button>` to:

```tsx
import Link from "next/link";
// ...
<Link href="/dashboard/bundles/new">
  <Button size="sm">New Bundle</Button>
</Link>
```

- [ ] **Step 6: Write API tests**

```ts
// tests/api/bundles.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { login, ACCOUNTS, type AuthSession } from "../helpers";

let alice: AuthSession;

beforeAll(async () => {
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

describe("POST /api/bundles", () => {
  it("rejects unauthenticated", async () => {
    const res = await fetch("http://localhost:3000/api/bundles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects missing fields", async () => {
    const { status } = await alice.postJSON("/api/bundles", { title: "Test" });
    expect(status).toBe(400);
  });

  it("rejects fewer than 2 rulesets", async () => {
    const { status } = await alice.postJSON("/api/bundles", {
      title: "Test Bundle",
      description: "A test",
      price: 10,
      rulesetIds: ["one-id"],
    });
    expect(status).toBe(400);
  });
});
```

- [ ] **Step 7: Run tests**

Run: `npx vitest run tests/api/bundles.test.ts`
Expected: All pass

- [ ] **Step 8: Commit**

```bash
git add src/lib/validations/bundles.ts src/app/api/bundles/ src/app/dashboard/bundles/ tests/api/bundles.test.ts
git commit -m "feat: add bundle creation form, API, and validation"
```

---

### Task 8: Final — run full test suite

- [ ] **Step 1: Run all Vitest tests**

Run: `npx vitest run`
Expected: All pass (unit + API + page smoke)

- [ ] **Step 2: Run all Playwright UI tests**

Run: `npx playwright test`
Expected: All pass

- [ ] **Step 3: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: ensure full test suite passes after hardening"
```
