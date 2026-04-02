# Phase 2: Core Marketplace — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the core marketplace layer — rulesets CRUD, full-text search with filters, voting, tags, and all public-facing pages — so that rulesets are discoverable, votable, searchable, and taggable.

**Architecture:** Server-side data fetching with Next.js 16 App Router (async params/searchParams). Prisma queries wrapped in reusable helper functions. Content access state resolver determines what each user can see. Search uses PostgreSQL tsvector + pg_trgm (already set up in Phase 1 migrations). All API endpoints use the response envelope helpers from Phase 1.

**Tech Stack:** Next.js 16.2.2, TypeScript, Prisma 7, PostgreSQL (tsvector, pg_trgm), NextAuth v5 beta.30, Tailwind CSS 4, React 19

**Important — Next.js 16 breaking change:** All `params` and `searchParams` are `Promise` types and must be awaited. Route handlers receive `{ params }: { params: Promise<{ id: string }> }`.

**Phases Overview:**
- Phase 1 (done): Foundation — project, DB, auth, UI shell
- **Phase 2 (this plan): Core Marketplace — rulesets CRUD, search, voting, tags, public pages**
- Phase 3: Payments & Storage — Lemon Squeezy, file uploads/downloads
- Phase 4: Community — reviews, discussions, follows, collections, notifications
- Phase 5: Pro & Admin — analytics, admin panel, subscriptions, cron jobs
- Phase 6: Polish & Deploy — SEO, OG images, emails, Railway deployment

---

## File Structure (Phase 2)

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                           # Homepage (update with real data)
│   │   ├── r/[slug]/page.tsx                  # Ruleset detail
│   │   ├── u/[username]/page.tsx              # Creator profile
│   │   ├── search/page.tsx                    # Search + filters
│   │   ├── trending/page.tsx                  # Trending page
│   │   └── tags/[tag]/page.tsx                # Tag landing page
│   ├── dashboard/
│   │   └── rulesets/
│   │       ├── page.tsx                       # My rulesets list
│   │       ├── new/page.tsx                   # Publish new
│   │       └── [id]/
│   │           └── edit/page.tsx              # Edit ruleset
│   └── api/
│       ├── rulesets/
│       │   ├── route.ts                       # GET list/search, POST create
│       │   ├── [id]/
│       │   │   ├── route.ts                   # GET detail, PATCH update, DELETE soft-delete
│       │   │   └── versions/route.ts          # POST new version
│       │   └── by-slug/[slug]/route.ts        # GET by slug (public)
│       ├── votes/route.ts                     # POST toggle vote
│       └── tags/
│           ├── route.ts                       # GET all tags
│           ├── search/route.ts                # GET autocomplete
│           └── [tag]/rulesets/route.ts         # GET rulesets for tag
├── components/
│   ├── rulesets/
│   │   ├── ruleset-card.tsx                   # Card for listings
│   │   ├── ruleset-form.tsx                   # Create/edit form
│   │   ├── vote-button.tsx                    # Optimistic vote toggle
│   │   └── tag-input.tsx                      # Tag autocomplete
│   ├── search/
│   │   └── search-filters.tsx                 # URL-synced filter controls
│   └── ui/
│       └── pagination.tsx                     # Cursor + offset pagination
├── lib/
│   ├── rulesets/
│   │   ├── queries.ts                         # Reusable Prisma queries
│   │   └── access.ts                          # Content access state resolver
│   └── slugify.ts                             # Slug generation utility
```

---

### Task 1: Utility Functions + Shared Types

**Files:**
- Create: `src/lib/slugify.ts`
- Create: `src/lib/rulesets/access.ts`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Create slug utility**

Create `src/lib/slugify.ts`:
```typescript
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

- [ ] **Step 2: Create content access state resolver**

Create `src/lib/rulesets/access.ts`:
```typescript
import { db } from "@/lib/db";

export type AccessState =
  | "AUTHOR"
  | "PURCHASED"
  | "SUBSCRIPTION_ACTIVE"
  | "SUBSCRIPTION_EXPIRED"
  | "REFUNDED"
  | "FREE_DOWNLOAD"
  | "PUBLIC";

export async function resolveAccessState(
  rulesetId: string,
  rulesetAuthorId: string,
  rulesetPrice: number,
  userId?: string,
): Promise<AccessState> {
  // Not logged in
  if (!userId) return "PUBLIC";

  // Author always gets full access
  if (userId === rulesetAuthorId) return "AUTHOR";

  // Check for purchase
  const purchase = await db.purchase.findFirst({
    where: { buyerId: userId, rulesetId },
    orderBy: { createdAt: "desc" },
  });

  if (purchase) {
    if (purchase.status === "REFUNDED") return "REFUNDED";
    if (purchase.status === "COMPLETED") {
      if (purchase.accessType === "SUBSCRIPTION") {
        if (purchase.accessExpiresAt && purchase.accessExpiresAt < new Date()) {
          return "SUBSCRIPTION_EXPIRED";
        }
        return "SUBSCRIPTION_ACTIVE";
      }
      return "PURCHASED";
    }
  }

  // Free ruleset + logged in
  if (rulesetPrice === 0) return "FREE_DOWNLOAD";

  return "PUBLIC";
}

export function canViewFullContent(state: AccessState): boolean {
  return ["AUTHOR", "PURCHASED", "SUBSCRIPTION_ACTIVE", "FREE_DOWNLOAD"].includes(state);
}
```

- [ ] **Step 3: Add Phase 2 types to shared types**

Append to `src/types/index.ts`:
```typescript
export interface RulesetCardData {
  id: string;
  title: string;
  slug: string;
  description: string;
  previewContent: string;
  type: string;
  platform: string;
  category: string;
  price: number;
  currency: string;
  downloadCount: number;
  viewCount: number;
  avgRating: number;
  ratingCount: number;
  trendingScore: number;
  status: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
  };
  tags: string[];
  voteCount: number;
  hasVoted: boolean;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/slugify.ts src/lib/rulesets/ src/types/index.ts
git commit -m "feat: add slug utility, content access resolver, and Phase 2 types"
```

---

### Task 2: Rulesets Query Helpers

**Files:**
- Create: `src/lib/rulesets/queries.ts`

- [ ] **Step 1: Create reusable ruleset query functions**

Create `src/lib/rulesets/queries.ts`:
```typescript
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

const CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  previewContent: true,
  type: true,
  platform: true,
  category: true,
  price: true,
  currency: true,
  downloadCount: true,
  viewCount: true,
  avgRating: true,
  ratingCount: true,
  trendingScore: true,
  status: true,
  createdAt: true,
  authorId: true,
  author: {
    select: { id: true, username: true, name: true, avatar: true },
  },
  tags: {
    select: { tag: { select: { name: true } } },
  },
  _count: { select: { votes: true } },
} satisfies Prisma.RulesetSelect;

export type RulesetCardRow = Prisma.RulesetGetPayload<{ select: typeof CARD_SELECT }>;

export function formatCardData(row: RulesetCardRow, userId?: string, votedIds?: Set<string>) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    previewContent: row.previewContent,
    type: row.type,
    platform: row.platform,
    category: row.category,
    price: row.price,
    currency: row.currency,
    downloadCount: row.downloadCount,
    viewCount: row.viewCount,
    avgRating: row.avgRating,
    ratingCount: row.ratingCount,
    trendingScore: row.trendingScore,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    author: row.author,
    tags: row.tags.map((t) => t.tag.name),
    voteCount: row._count.votes,
    hasVoted: votedIds ? votedIds.has(row.id) : false,
  };
}

export interface ListRulesetsOptions {
  status?: string;
  platform?: string;
  type?: string;
  category?: string;
  authorId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tagNames?: string[];
  sort?: "newest" | "trending" | "most_voted" | "most_downloaded";
  cursor?: string;
  pageSize?: number;
}

export async function listRulesets(opts: ListRulesetsOptions, userId?: string) {
  const pageSize = opts.pageSize || 20;

  const where: Prisma.RulesetWhereInput = {
    status: (opts.status as Prisma.EnumRulesetStatusFilter["equals"]) || "PUBLISHED",
  };

  if (opts.platform) where.platform = opts.platform as Prisma.EnumPlatformFilter["equals"];
  if (opts.type) where.type = opts.type as Prisma.EnumRulesetTypeFilter["equals"];
  if (opts.category) where.category = opts.category;
  if (opts.authorId) where.authorId = opts.authorId;
  if (opts.minPrice !== undefined || opts.maxPrice !== undefined) {
    where.price = {};
    if (opts.minPrice !== undefined) where.price.gte = opts.minPrice;
    if (opts.maxPrice !== undefined) where.price.lte = opts.maxPrice;
  }
  if (opts.minRating !== undefined) {
    where.avgRating = { gte: opts.minRating };
  }
  if (opts.tagNames && opts.tagNames.length > 0) {
    where.tags = { some: { tag: { name: { in: opts.tagNames } } } };
  }

  const orderBy: Prisma.RulesetOrderByWithRelationInput =
    opts.sort === "trending" ? { trendingScore: "desc" }
    : opts.sort === "most_voted" ? { votes: { _count: "desc" } }
    : opts.sort === "most_downloaded" ? { downloadCount: "desc" }
    : { createdAt: "desc" };

  const cursorClause = opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {};

  const [rows, total] = await Promise.all([
    db.ruleset.findMany({
      where,
      select: CARD_SELECT,
      orderBy,
      take: pageSize + 1,
      ...cursorClause,
    }),
    db.ruleset.count({ where }),
  ]);

  const hasNext = rows.length > pageSize;
  if (hasNext) rows.pop();

  // Batch-load user's votes
  let votedIds = new Set<string>();
  if (userId && rows.length > 0) {
    const votes = await db.vote.findMany({
      where: { userId, rulesetId: { in: rows.map((r) => r.id) } },
      select: { rulesetId: true },
    });
    votedIds = new Set(votes.map((v) => v.rulesetId));
  }

  const data = rows.map((r) => formatCardData(r, userId, votedIds));
  const nextCursor = hasNext && rows.length > 0 ? rows[rows.length - 1].id : undefined;

  return { data, total, nextCursor };
}

export async function getRulesetBySlug(slug: string) {
  return db.ruleset.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, username: true, name: true, avatar: true, bio: true } },
      tags: { select: { tag: { select: { id: true, name: true } } } },
      versions: { orderBy: { createdAt: "desc" }, take: 5 },
      _count: { select: { votes: true, reviews: true } },
    },
  });
}

export async function getRulesetById(id: string) {
  return db.ruleset.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, name: true, avatar: true } },
      tags: { select: { tag: { select: { id: true, name: true } } } },
      versions: { orderBy: { createdAt: "desc" } },
      _count: { select: { votes: true, reviews: true } },
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/rulesets/queries.ts
git commit -m "feat: add reusable ruleset query helpers with filtering and pagination"
```

---

### Task 3: Rulesets CRUD API Endpoints

**Files:**
- Create: `src/app/api/rulesets/route.ts`
- Create: `src/app/api/rulesets/[id]/route.ts`
- Create: `src/app/api/rulesets/by-slug/[slug]/route.ts`
- Create: `src/app/api/rulesets/[id]/versions/route.ts`

- [ ] **Step 1: Create list + create endpoint**

Create `src/app/api/rulesets/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, list, errors } from "@/lib/api/response";
import { paginationFromCursor } from "@/lib/api/response";
import { listRulesets } from "@/lib/rulesets/queries";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const sp = req.nextUrl.searchParams;

    const result = await listRulesets(
      {
        platform: sp.get("platform") || undefined,
        type: sp.get("type") || undefined,
        category: sp.get("category") || undefined,
        minPrice: sp.has("minPrice") ? Number(sp.get("minPrice")) : undefined,
        maxPrice: sp.has("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
        minRating: sp.has("minRating") ? Number(sp.get("minRating")) : undefined,
        tagNames: sp.get("tags") ? sp.get("tags")!.split(",") : undefined,
        sort: (sp.get("sort") as "newest" | "trending" | "most_voted" | "most_downloaded") || "newest",
        cursor: sp.get("cursor") || undefined,
        pageSize: sp.has("pageSize") ? Number(sp.get("pageSize")) : 20,
      },
      session?.user?.id,
    );

    return list(result.data, paginationFromCursor(result.total, 20, result.nextCursor));
  } catch {
    return errors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { title, description, previewContent, type, platform, category, price, content, tags } = body;

    if (!title || !description || !previewContent || !type || !platform || !category) {
      return errors.validation("Missing required fields");
    }

    let slug = slugify(title);
    const existing = await db.ruleset.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const ruleset = await db.ruleset.create({
      data: {
        title,
        slug,
        description,
        previewContent,
        type,
        platform,
        category,
        price: price || 0,
        authorId: session.user.id,
        status: "DRAFT",
        versions: content
          ? { create: { version: "1.0.0", fullContent: content } }
          : undefined,
      },
      select: { id: true, slug: true, title: true, status: true },
    });

    // Handle tags
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags as string[]) {
        const normalized = tagName.toLowerCase().trim();
        if (!normalized) continue;
        const tag = await db.tag.upsert({
          where: { name: normalized },
          create: { name: normalized, usageCount: 1 },
          update: { usageCount: { increment: 1 } },
        });
        await db.rulesetTag.create({
          data: { rulesetId: ruleset.id, tagId: tag.id },
        });
      }
    }

    return success(ruleset, 201);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Create detail / update / delete endpoint**

Create `src/app/api/rulesets/[id]/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { getRulesetById } from "@/lib/rulesets/queries";
import { resolveAccessState, canViewFullContent } from "@/lib/rulesets/access";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    const ruleset = await getRulesetById(id);

    if (!ruleset) return errors.notFound("Ruleset not found");

    const accessState = await resolveAccessState(
      ruleset.id,
      ruleset.authorId,
      ruleset.price,
      session?.user?.id,
    );

    const showFull = canViewFullContent(accessState);

    return success({
      ...ruleset,
      accessState,
      versions: showFull ? ruleset.versions : [],
      createdAt: ruleset.createdAt.toISOString(),
      updatedAt: ruleset.updatedAt.toISOString(),
    });
  } catch {
    return errors.internal();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const ruleset = await db.ruleset.findUnique({ where: { id }, select: { authorId: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can edit");

    const body = await req.json();
    const { title, description, previewContent, type, platform, category, price, status } = body;

    const updated = await db.ruleset.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(previewContent !== undefined && { previewContent }),
        ...(type !== undefined && { type }),
        ...(platform !== undefined && { platform }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price }),
        ...(status !== undefined && { status }),
      },
      select: { id: true, slug: true, title: true, status: true, updatedAt: true },
    });

    return success(updated);
  } catch {
    return errors.internal();
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const ruleset = await db.ruleset.findUnique({ where: { id }, select: { authorId: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can delete");

    await db.ruleset.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return success({ message: "Ruleset archived" });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 3: Create by-slug endpoint**

Create `src/app/api/rulesets/by-slug/[slug]/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { success, errors } from "@/lib/api/response";
import { getRulesetBySlug } from "@/lib/rulesets/queries";
import { resolveAccessState, canViewFullContent } from "@/lib/rulesets/access";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const session = await auth();
    const ruleset = await getRulesetBySlug(slug);

    if (!ruleset || ruleset.status === "ARCHIVED") {
      return errors.notFound("Ruleset not found");
    }

    const accessState = await resolveAccessState(
      ruleset.id,
      ruleset.authorId,
      ruleset.price,
      session?.user?.id,
    );

    const showFull = canViewFullContent(accessState);

    // Check if user has voted
    let hasVoted = false;
    if (session?.user) {
      const vote = await (await import("@/lib/db")).db.vote.findUnique({
        where: { userId_rulesetId: { userId: session.user.id, rulesetId: ruleset.id } },
      });
      hasVoted = !!vote;
    }

    return success({
      ...ruleset,
      accessState,
      hasVoted,
      voteCount: ruleset._count.votes,
      reviewCount: ruleset._count.reviews,
      versions: showFull ? ruleset.versions : [],
      tags: ruleset.tags.map((t) => t.tag),
      createdAt: ruleset.createdAt.toISOString(),
      updatedAt: ruleset.updatedAt.toISOString(),
    });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 4: Create version endpoint**

Create `src/app/api/rulesets/[id]/versions/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const ruleset = await db.ruleset.findUnique({ where: { id }, select: { authorId: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can add versions");

    const body = await req.json();
    const { version, fullContent, changelog } = body;

    if (!version || !fullContent) {
      return errors.validation("version and fullContent are required");
    }

    const existing = await db.rulesetVersion.findUnique({
      where: { rulesetId_version: { rulesetId: id, version } },
    });
    if (existing) return errors.conflict("Version already exists");

    const created = await db.rulesetVersion.create({
      data: { rulesetId: id, version, fullContent, changelog },
      select: { id: true, version: true, createdAt: true },
    });

    return success(created, 201);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/rulesets/
git commit -m "feat: add rulesets CRUD API (list, create, detail, update, delete, versions)"
```

---

### Task 4: Votes + Tags API Endpoints

**Files:**
- Create: `src/app/api/votes/route.ts`
- Create: `src/app/api/tags/route.ts`
- Create: `src/app/api/tags/search/route.ts`
- Create: `src/app/api/tags/[tag]/rulesets/route.ts`

- [ ] **Step 1: Create vote toggle endpoint**

Create `src/app/api/votes/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId } = body;

    if (!rulesetId) return errors.validation("rulesetId is required");

    const ruleset = await db.ruleset.findUnique({ where: { id: rulesetId }, select: { id: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");

    const existing = await db.vote.findUnique({
      where: { userId_rulesetId: { userId: session.user.id, rulesetId } },
    });

    if (existing) {
      await db.vote.delete({
        where: { userId_rulesetId: { userId: session.user.id, rulesetId } },
      });
      return success({ voted: false });
    }

    await db.vote.create({
      data: { userId: session.user.id, rulesetId },
    });

    // Log event for trending
    await db.rulesetEvent.create({
      data: { rulesetId, type: "VOTE" },
    });

    return success({ voted: true });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Create tags list endpoint**

Create `src/app/api/tags/route.ts`:
```typescript
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET() {
  try {
    const tags = await db.tag.findMany({
      orderBy: { usageCount: "desc" },
      take: 100,
      select: { id: true, name: true, usageCount: true },
    });
    return success(tags);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 3: Create tag autocomplete endpoint**

Create `src/app/api/tags/search/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q || q.length < 1) return success([]);

    const tags = await db.tag.findMany({
      where: { name: { startsWith: q.toLowerCase() } },
      orderBy: { usageCount: "desc" },
      take: 10,
      select: { id: true, name: true, usageCount: true },
    });

    return success(tags);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 4: Create rulesets-by-tag endpoint**

Create `src/app/api/tags/[tag]/rulesets/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { list, errors } from "@/lib/api/response";
import { paginationFromCursor } from "@/lib/api/response";
import { listRulesets } from "@/lib/rulesets/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tag: string }> },
) {
  try {
    const { tag } = await params;
    const session = await auth();
    const sp = req.nextUrl.searchParams;

    const result = await listRulesets(
      {
        tagNames: [decodeURIComponent(tag)],
        sort: (sp.get("sort") as "newest" | "trending" | "most_voted" | "most_downloaded") || "newest",
        cursor: sp.get("cursor") || undefined,
        pageSize: 20,
      },
      session?.user?.id,
    );

    return list(result.data, paginationFromCursor(result.total, 20, result.nextCursor));
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/votes/ src/app/api/tags/
git commit -m "feat: add vote toggle and tags API (list, autocomplete, by-tag)"
```

---

### Task 5: UI Components — RulesetCard, VoteButton, Pagination

**Files:**
- Create: `src/components/rulesets/ruleset-card.tsx`
- Create: `src/components/rulesets/vote-button.tsx`
- Create: `src/components/ui/pagination.tsx`

- [ ] **Step 1: Create RulesetCard component**

Create `src/components/rulesets/ruleset-card.tsx`:
```tsx
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { RulesetCardData } from "@/types";

export function RulesetCard({ ruleset }: { ruleset: RulesetCardData }) {
  return (
    <div className="card-hover p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link href={`/r/${ruleset.slug}`} className="block">
            <h3 className="text-sm font-semibold text-text-primary truncate hover:text-accent-green transition-colors">
              {ruleset.title}
            </h3>
          </Link>
          <Link href={`/u/${ruleset.author.username}`} className="text-xs text-text-tertiary hover:text-text-secondary">
            {ruleset.author.name}
          </Link>
        </div>
        <span className="text-sm font-semibold text-accent-green whitespace-nowrap">
          {ruleset.price === 0 ? "Free" : `$${ruleset.price.toFixed(2)}`}
        </span>
      </div>

      <p className="text-xs text-text-secondary line-clamp-2">{ruleset.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="default">{ruleset.platform}</Badge>
        <Badge variant="default">{ruleset.type}</Badge>
        {ruleset.tags.slice(0, 2).map((tag) => (
          <Link key={tag} href={`/tags/${tag}`}>
            <Badge variant="purple">{tag}</Badge>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-text-tertiary">
        <span>{ruleset.voteCount} votes</span>
        <span>{ruleset.downloadCount} downloads</span>
        {ruleset.avgRating > 0 && (
          <span>
            {"★".repeat(Math.round(ruleset.avgRating))} {ruleset.avgRating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create VoteButton component**

Create `src/components/rulesets/vote-button.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

interface VoteButtonProps {
  rulesetId: string;
  initialVoted: boolean;
  initialCount: number;
}

export function VoteButton({ rulesetId, initialVoted, initialCount }: VoteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);

  async function handleVote() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Optimistic update
    const prevVoted = voted;
    const prevCount = count;
    setVoted(!voted);
    setCount(voted ? count - 1 : count + 1);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rulesetId }),
      });

      if (!res.ok) {
        // Rollback
        setVoted(prevVoted);
        setCount(prevCount);
        if (res.status === 401) {
          router.push("/login");
        } else {
          toast("Vote failed, try again", "error");
        }
      }
    } catch {
      setVoted(prevVoted);
      setCount(prevCount);
      toast("Vote failed, try again", "error");
    }
  }

  return (
    <button
      onClick={handleVote}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
        border transition-colors
        ${voted
          ? "border-accent-green/30 bg-accent-green-subtle text-accent-green"
          : "border-border-secondary text-text-secondary hover:border-border-hover hover:text-text-primary"
        }
      `}
    >
      <svg className="w-4 h-4" fill={voted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
      {count}
    </button>
  );
}
```

- [ ] **Step 3: Create Pagination component**

Create `src/components/ui/pagination.tsx`:
```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

export function CursorPagination({ hasNext, nextCursor }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function loadMore() {
    if (!nextCursor) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("cursor", nextCursor);
    router.push(`?${params.toString()}`);
  }

  if (!hasNext) return null;

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={loadMore}
        className="px-6 py-2 text-sm font-medium text-text-secondary border border-border-secondary rounded-md hover:border-border-hover hover:text-text-primary transition-colors"
      >
        Load more
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/rulesets/ src/components/ui/pagination.tsx
git commit -m "feat: add RulesetCard, VoteButton (optimistic), and CursorPagination"
```

---

### Task 6: Search Filters + Tag Input Components

**Files:**
- Create: `src/components/search/search-filters.tsx`
- Create: `src/components/rulesets/tag-input.tsx`

- [ ] **Step 1: Create SearchFilters component**

Create `src/components/search/search-filters.tsx`:
```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PLATFORMS = ["CURSOR", "VSCODE", "OBSIDIAN", "N8N", "MAKE", "GEMINI", "CLAUDE", "CHATGPT", "OTHER"];
const TYPES = ["RULESET", "PROMPT", "WORKFLOW", "AGENT", "BUNDLE", "DATASET"];
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "trending", label: "Trending" },
  { value: "most_voted", label: "Most Voted" },
  { value: "most_downloaded", label: "Most Downloaded" },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("cursor");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const currentPlatform = searchParams.get("platform");
  const currentType = searchParams.get("type");
  const currentSort = searchParams.get("sort") || "newest";

  return (
    <div className="space-y-4">
      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Sort</label>
        <div className="space-y-1">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter("sort", s.value)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentSort === s.value
                  ? "text-accent-green bg-accent-green-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Platform</label>
        <div className="space-y-1">
          <button
            onClick={() => setFilter("platform", null)}
            className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
              !currentPlatform ? "text-accent-green bg-accent-green-subtle" : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
            }`}
          >
            All
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setFilter("platform", p)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentPlatform === p
                  ? "text-accent-green bg-accent-green-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Type</label>
        <div className="space-y-1">
          <button
            onClick={() => setFilter("type", null)}
            className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
              !currentType ? "text-accent-green bg-accent-green-subtle" : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
            }`}
          >
            All
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter("type", t)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentType === t
                  ? "text-accent-green bg-accent-green-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {(currentPlatform || currentType || searchParams.has("tags")) && (
        <button
          onClick={() => router.push(window.location.pathname)}
          className="text-xs text-status-error hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create TagInput component**

Create `src/components/rulesets/tag-input.tsx`:
```tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
}

export function TagInput({ value, onChange, max = 5 }: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (input.length < 1) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/tags/search?q=${encodeURIComponent(input)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.data.filter((t: { name: string }) => !value.includes(t.name)));
      }
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [input, value]);

  function addTag(name: string) {
    const normalized = name.toLowerCase().trim();
    if (!normalized || value.includes(normalized) || value.length >= max) return;
    onChange([...value, normalized]);
    setInput("");
    setShowSuggestions(false);
  }

  function removeTag(name: string) {
    onChange(value.filter((t) => t !== name));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-secondary">Tags</label>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-accent-purple-subtle text-accent-purple border border-accent-purple/30 rounded">
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-white">×</button>
          </span>
        ))}
      </div>
      {value.length < max && (
        <div className="relative">
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Add tags..."
            className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-bg-elevated border border-border-primary rounded-md shadow-lg z-10">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onMouseDown={() => addTag(s.name)}
                  className="block w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-text-tertiary">{value.length}/{max} tags</p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/search/ src/components/rulesets/tag-input.tsx
git commit -m "feat: add SearchFilters (URL-synced) and TagInput (autocomplete)"
```

---

### Task 7: Public Pages — Homepage, Search, Trending, Tag

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Create: `src/app/(public)/search/page.tsx`
- Create: `src/app/(public)/trending/page.tsx`
- Create: `src/app/(public)/tags/[tag]/page.tsx`

- [ ] **Step 1: Update homepage with real data**

Replace `src/app/(public)/page.tsx`:
```tsx
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";

export default async function HomePage() {
  const session = await auth();
  const { data: rulesets } = await listRulesets(
    { sort: "newest", pageSize: 12 },
    session?.user?.id,
  );

  const stats = await db.user.count();

  return (
    <div className="p-6">
      {/* Hero */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-accent-green uppercase tracking-widest mb-4">
          AI Configuration Marketplace
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-4 font-mono">
          The stack behind<br />the best AI builders.
        </h1>
        <p className="text-text-secondary text-lg max-w-lg mb-6">
          Buy, sell, and share system prompts, Cursor rules, n8n workflows, and agent blueprints.
        </p>
        <div className="flex items-center gap-3 mb-4">
          <a href="/search" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-green text-text-inverse font-semibold rounded-md hover:bg-accent-green-hover transition-colors">
            Browse Rulesets &rarr;
          </a>
          <a href="/signup" className="inline-flex items-center px-5 py-2.5 border border-accent-green text-accent-green font-semibold rounded-md hover:bg-accent-green-subtle transition-colors">
            Start Selling Free
          </a>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-tertiary">
          <span>{rulesets.length} rulesets</span>
          <span>&middot;</span>
          <span>{stats} creators</span>
        </div>
      </div>

      {/* Trust bar */}
      <div className="flex items-center gap-6 text-xs text-text-tertiary uppercase tracking-wider border-y border-border-primary py-3 mb-6">
        <span>Secure Checkout</span>
        <span>30-Day Refunds</span>
        <span>Verified Creators</span>
        <span>Instant Delivery</span>
      </div>

      {/* Rulesets grid */}
      {rulesets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rulesets.map((r) => (
            <RulesetCard key={r.id} ruleset={r} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-tertiary">
          <p className="text-lg mb-2">No rulesets yet</p>
          <p className="text-sm">Be the first to publish a ruleset!</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create search page**

Create `src/app/(public)/search/page.tsx`:
```tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import { SearchFilters } from "@/components/search/search-filters";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search — Ruleset" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const session = await auth();

  const q = typeof sp.q === "string" ? sp.q : undefined;
  const platform = typeof sp.platform === "string" ? sp.platform : undefined;
  const type = typeof sp.type === "string" ? sp.type : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const sort = (typeof sp.sort === "string" ? sp.sort : "newest") as "newest" | "trending" | "most_voted" | "most_downloaded";
  const cursor = typeof sp.cursor === "string" ? sp.cursor : undefined;
  const tags = typeof sp.tags === "string" ? sp.tags.split(",") : undefined;

  const { data: rulesets, total, nextCursor } = await listRulesets(
    { platform, type, category, tagNames: tags, sort, cursor, pageSize: 20 },
    session?.user?.id,
  );

  return (
    <div className="flex">
      {/* Sidebar filters */}
      <aside className="hidden lg:block w-56 border-r border-border-primary p-4">
        <Suspense>
          <SearchFilters />
        </Suspense>
      </aside>

      {/* Results */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-text-primary">
            {q ? `Results for "${q}"` : "Browse Rulesets"}
          </h1>
          <span className="text-sm text-text-tertiary">{total} results</span>
        </div>

        {rulesets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rulesets.map((r) => (
              <RulesetCard key={r.id} ruleset={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-tertiary">
            <p className="text-lg mb-2">No results found</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}

        {nextCursor && (
          <div className="flex justify-center py-6">
            <a
              href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([, v]) => typeof v === "string") as [string, string][]), cursor: nextCursor }).toString()}`}
              className="px-6 py-2 text-sm font-medium text-text-secondary border border-border-secondary rounded-md hover:border-border-hover hover:text-text-primary transition-colors"
            >
              Load more
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create trending page**

Create `src/app/(public)/trending/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trending — Ruleset" };

export default async function TrendingPage() {
  const session = await auth();
  const { data: rulesets } = await listRulesets(
    { sort: "trending", pageSize: 30 },
    session?.user?.id,
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-2">Trending</h1>
      <p className="text-text-tertiary text-sm mb-6">Most popular rulesets this week</p>

      {rulesets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rulesets.map((r) => (
            <RulesetCard key={r.id} ruleset={r} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-tertiary">
          <p className="text-lg mb-2">Nothing trending yet</p>
          <p className="text-sm">Be the first to publish and get voted!</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create tag landing page**

Create `src/app/(public)/tags/[tag]/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return { title: `${decoded} — Ruleset` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const session = await auth();

  const tagRecord = await db.tag.findUnique({ where: { name: decoded } });
  if (!tagRecord) notFound();

  const { data: rulesets } = await listRulesets(
    { tagNames: [decoded], sort: "newest", pageSize: 30 },
    session?.user?.id,
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-1">#{decoded}</h1>
      <p className="text-text-tertiary text-sm mb-6">{tagRecord.usageCount} rulesets</p>

      {rulesets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rulesets.map((r) => (
            <RulesetCard key={r.id} ruleset={r} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-tertiary">
          <p>No rulesets with this tag yet</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add "src/app/(public)/"
git commit -m "feat: add homepage, search, trending, and tag landing pages"
```

---

### Task 8: Ruleset Detail Page + Creator Profile

**Files:**
- Create: `src/app/(public)/r/[slug]/page.tsx`
- Create: `src/app/(public)/u/[username]/page.tsx`

- [ ] **Step 1: Create ruleset detail page**

Create `src/app/(public)/r/[slug]/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRulesetBySlug } from "@/lib/rulesets/queries";
import { resolveAccessState, canViewFullContent } from "@/lib/rulesets/access";
import { VoteButton } from "@/components/rulesets/vote-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ruleset = await getRulesetBySlug(slug);
  if (!ruleset) return { title: "Not Found — Ruleset" };
  return {
    title: `${ruleset.title} — Ruleset`,
    description: ruleset.description,
  };
}

export default async function RulesetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const ruleset = await getRulesetBySlug(slug);

  if (!ruleset || ruleset.status === "ARCHIVED") notFound();

  const accessState = await resolveAccessState(
    ruleset.id, ruleset.authorId, ruleset.price, session?.user?.id,
  );
  const showFull = canViewFullContent(accessState);

  let hasVoted = false;
  if (session?.user) {
    const vote = await db.vote.findUnique({
      where: { userId_rulesetId: { userId: session.user.id, rulesetId: ruleset.id } },
    });
    hasVoted = !!vote;
  }

  // Log view event
  await db.rulesetEvent.create({ data: { rulesetId: ruleset.id, type: "VIEW" } });
  await db.ruleset.update({ where: { id: ruleset.id }, data: { viewCount: { increment: 1 } } });

  const latestVersion = ruleset.versions[0];

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">{ruleset.title}</h1>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link href={`/u/${ruleset.author.username}`} className="hover:text-accent-green">
              {ruleset.author.name}
            </Link>
            <span>&middot;</span>
            <span>{new Date(ruleset.createdAt).toLocaleDateString()}</span>
            {latestVersion && (
              <>
                <span>&middot;</span>
                <span>v{latestVersion.version}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <VoteButton
            rulesetId={ruleset.id}
            initialVoted={hasVoted}
            initialCount={ruleset._count.votes}
          />
          {accessState === "AUTHOR" && (
            <Link href={`/dashboard/rulesets/${ruleset.id}/edit`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <Badge variant="green">{ruleset.platform}</Badge>
        <Badge variant="default">{ruleset.type}</Badge>
        <Badge variant="default">{ruleset.category}</Badge>
        {ruleset.tags.map((t) => (
          <Link key={t.tag.id} href={`/tags/${t.tag.name}`}>
            <Badge variant="purple">{t.tag.name}</Badge>
          </Link>
        ))}
        <span className="text-sm font-semibold text-accent-green ml-auto">
          {ruleset.price === 0 ? "Free" : `$${ruleset.price.toFixed(2)}`}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-text-tertiary mb-6 pb-6 border-b border-border-primary">
        <span>{ruleset.downloadCount} downloads</span>
        <span>{ruleset.viewCount} views</span>
        <span>{ruleset._count.reviews} reviews</span>
        {ruleset.avgRating > 0 && <span>★ {ruleset.avgRating.toFixed(1)}</span>}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">About</h2>
        <p className="text-text-secondary whitespace-pre-wrap">{ruleset.description}</p>
      </div>

      {/* Content */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {showFull ? "Content" : "Preview"}
        </h2>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-4 font-mono text-sm text-text-secondary overflow-x-auto whitespace-pre-wrap">
          {showFull && latestVersion
            ? latestVersion.fullContent
            : ruleset.previewContent}
        </div>
        {!showFull && (
          <div className="mt-4 text-center">
            {accessState === "PUBLIC" ? (
              <Link href="/login">
                <Button>{ruleset.price > 0 ? "Sign in to buy" : "Sign in to download"}</Button>
              </Link>
            ) : accessState === "FREE_DOWNLOAD" ? (
              <Button>Get (Free)</Button>
            ) : (
              <Button>Buy ${ruleset.price.toFixed(2)}</Button>
            )}
          </div>
        )}
      </div>

      {/* Version history (author only) */}
      {accessState === "AUTHOR" && ruleset.versions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">Versions</h2>
          <div className="space-y-2">
            {ruleset.versions.map((v) => (
              <div key={v.id} className="card p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-text-primary">v{v.version}</span>
                  {v.changelog && (
                    <p className="text-xs text-text-tertiary mt-0.5">{v.changelog}</p>
                  )}
                </div>
                <span className="text-xs text-text-tertiary">
                  {new Date(v.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create creator profile page**

Create `src/app/(public)/u/[username]/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await db.user.findUnique({ where: { username }, select: { name: true } });
  if (!user) return { title: "Not Found — Ruleset" };
  return { title: `${user.name} — Ruleset` };
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
      bio: true,
      createdAt: true,
      _count: { select: { followers: true, following: true, rulesets: true } },
    },
  });

  if (!user) notFound();

  const { data: rulesets } = await listRulesets(
    { authorId: user.id, sort: "newest", pageSize: 20 },
    session?.user?.id,
  );

  return (
    <div className="p-6 max-w-4xl">
      {/* Profile header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-accent-purple flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            user.name[0]?.toUpperCase() || "U"
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{user.name}</h1>
          <p className="text-sm text-text-tertiary">@{user.username}</p>
          {user.bio && <p className="text-sm text-text-secondary mt-2">{user.bio}</p>}
          <div className="flex items-center gap-4 text-sm text-text-tertiary mt-2">
            <span>{user._count.rulesets} rulesets</span>
            <span>{user._count.followers} followers</span>
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Rulesets */}
      <h2 className="text-lg font-semibold text-text-primary mb-4">Published Rulesets</h2>
      {rulesets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rulesets.map((r) => (
            <RulesetCard key={r.id} ruleset={r} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-tertiary">
          <p>No published rulesets yet</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/r/" "src/app/(public)/u/"
git commit -m "feat: add ruleset detail page and creator profile page"
```

---

### Task 9: Dashboard — Rulesets Management

**Files:**
- Create: `src/app/dashboard/rulesets/page.tsx`
- Create: `src/app/dashboard/rulesets/new/page.tsx`
- Create: `src/app/dashboard/rulesets/[id]/edit/page.tsx`
- Create: `src/components/rulesets/ruleset-form.tsx`

- [ ] **Step 1: Create RulesetForm component**

Create `src/components/rulesets/ruleset-form.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/rulesets/tag-input";
import { toast } from "@/components/ui/toast";

const PLATFORMS = ["CURSOR", "VSCODE", "OBSIDIAN", "N8N", "MAKE", "GEMINI", "CLAUDE", "CHATGPT", "OTHER"];
const TYPES = ["RULESET", "PROMPT", "WORKFLOW", "AGENT", "BUNDLE", "DATASET"];

interface RulesetFormProps {
  initial?: {
    id: string;
    title: string;
    description: string;
    previewContent: string;
    type: string;
    platform: string;
    category: string;
    price: number;
    status: string;
    tags: string[];
  };
}

export function RulesetForm({ initial }: RulesetFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [previewContent, setPreviewContent] = useState(initial?.previewContent || "");
  const [content, setContent] = useState("");
  const [type, setType] = useState(initial?.type || "RULESET");
  const [platform, setPlatform] = useState(initial?.platform || "CURSOR");
  const [category, setCategory] = useState(initial?.category || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "0");
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [status, setStatus] = useState(initial?.status || "DRAFT");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      title, description, previewContent, type, platform, category,
      price: parseFloat(price) || 0, tags,
      ...(isEdit ? { status } : { content }),
    };

    const res = await fetch(
      isEdit ? `/api/rulesets/${initial.id}` : "/api/rulesets",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      toast(isEdit ? "Ruleset updated" : "Ruleset created", "success");
      router.push(`/r/${data.data.slug}`);
      router.refresh();
    } else {
      const err = await res.json();
      toast(err.error?.message || "Something went wrong", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Preview Content (public snippet)</label>
        <textarea
          value={previewContent}
          onChange={(e) => setPreviewContent(e.target.value)}
          rows={4}
          required
          placeholder="First ~10 lines shown publicly..."
          className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors font-mono"
        />
      </div>

      {!isEdit && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Full Content (v1.0.0)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Full ruleset content..."
            className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors font-mono"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary focus:outline-none focus:border-accent-green transition-colors">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary focus:outline-none focus:border-accent-green transition-colors">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., architecture, security" required />

      <Input label="Price (USD)" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />

      <TagInput value={tags} onChange={setTags} />

      {isEdit && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary focus:outline-none focus:border-accent-green transition-colors">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Ruleset" : "Create Ruleset"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Create dashboard rulesets list page**

Create `src/app/dashboard/rulesets/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Rulesets — Ruleset" };

export default async function DashboardRulesetsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rulesets = await db.ruleset.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      price: true,
      downloadCount: true,
      viewCount: true,
      createdAt: true,
      _count: { select: { votes: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">My Rulesets</h1>
        <Link href="/dashboard/rulesets/new">
          <Button size="sm">New Ruleset</Button>
        </Link>
      </div>

      {rulesets.length > 0 ? (
        <div className="space-y-2">
          {rulesets.map((r) => (
            <div key={r.id} className="card p-4 flex items-center justify-between">
              <div>
                <Link href={`/r/${r.slug}`} className="text-sm font-medium text-text-primary hover:text-accent-green">
                  {r.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                  <Badge variant={r.status === "PUBLISHED" ? "green" : r.status === "DRAFT" ? "default" : "error"}>
                    {r.status}
                  </Badge>
                  <span>{r.price === 0 ? "Free" : `$${r.price.toFixed(2)}`}</span>
                  <span>{r._count.votes} votes</span>
                  <span>{r.downloadCount} downloads</span>
                  <span>{r.viewCount} views</span>
                </div>
              </div>
              <Link href={`/dashboard/rulesets/${r.id}/edit`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-text-tertiary">
          <p className="mb-4">You haven&apos;t published any rulesets yet</p>
          <Link href="/dashboard/rulesets/new">
            <Button>Create your first ruleset</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create new ruleset page**

Create `src/app/dashboard/rulesets/new/page.tsx`:
```tsx
import { RulesetForm } from "@/components/rulesets/ruleset-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Ruleset — Ruleset" };

export default function NewRulesetPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Publish New Ruleset</h1>
      <RulesetForm />
    </div>
  );
}
```

- [ ] **Step 4: Create edit ruleset page**

Create `src/app/dashboard/rulesets/[id]/edit/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RulesetForm } from "@/components/rulesets/ruleset-form";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Ruleset — Ruleset" };

export default async function EditRulesetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const ruleset = await db.ruleset.findUnique({
    where: { id },
    include: { tags: { select: { tag: { select: { name: true } } } } },
  });

  if (!ruleset) notFound();
  if (ruleset.authorId !== session.user.id) redirect("/dashboard/rulesets");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Edit Ruleset</h1>
      <RulesetForm
        initial={{
          id: ruleset.id,
          title: ruleset.title,
          description: ruleset.description,
          previewContent: ruleset.previewContent,
          type: ruleset.type,
          platform: ruleset.platform,
          category: ruleset.category,
          price: ruleset.price,
          status: ruleset.status,
          tags: ruleset.tags.map((t) => t.tag.name),
        }}
      />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/rulesets/ruleset-form.tsx src/app/dashboard/rulesets/
git commit -m "feat: add dashboard rulesets management (list, create, edit)"
```

---

### Task 10: Final Verification

- [ ] **Step 1: Run full build**

```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run build
```

Expected: Build succeeds with no TypeScript errors. Fix any errors that appear.

- [ ] **Step 2: Run linter**

```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run lint
```

Expected: No errors. Fix any that appear.

- [ ] **Step 3: Verify all routes compile**

Expected routes in build output:
```
○ /
○ /dashboard/overview
○ /dashboard/rulesets
○ /dashboard/rulesets/new
○ /login
○ /reset-password
○ /signup
○ /trending
○ /verify-email
ƒ /api/auth/[...nextauth]
ƒ /api/auth/register
ƒ /api/auth/reset-password
ƒ /api/auth/verify-email
ƒ /api/health
ƒ /api/rulesets
ƒ /api/rulesets/[id]
ƒ /api/rulesets/[id]/versions
ƒ /api/rulesets/by-slug/[slug]
ƒ /api/tags
ƒ /api/tags/[tag]/rulesets
ƒ /api/tags/search
ƒ /api/votes
ƒ /dashboard/rulesets/[id]/edit
ƒ /r/[slug]
ƒ /search
ƒ /tags/[tag]
ƒ /u/[username]
```

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues from Phase 2 final verification"
```

---

## Phase 2 Complete Checklist

After all tasks, you should have:
- [x] Slug utility and content access state resolver
- [x] Reusable Prisma query helpers with filtering, sorting, cursor pagination
- [x] Rulesets CRUD API (list, create, detail, update, soft-delete, by-slug, versions)
- [x] Vote toggle API with trending event logging
- [x] Tags API (list, autocomplete, rulesets-by-tag)
- [x] RulesetCard, VoteButton (optimistic), CursorPagination components
- [x] SearchFilters (URL-synced) and TagInput (autocomplete) components
- [x] Homepage with real data from database
- [x] Search page with sidebar filters
- [x] Trending page
- [x] Tag landing page
- [x] Ruleset detail page with content access state rendering
- [x] Creator profile page
- [x] Dashboard rulesets list, create, and edit pages
- [x] RulesetForm with tag input, platform/type selectors
- [x] Clean build with no errors

**Next:** Phase 3 — Payments & Storage (Lemon Squeezy, file uploads/downloads via Cloudflare R2)
