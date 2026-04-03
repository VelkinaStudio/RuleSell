# Phase 4: Community — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the community engagement layer — reviews (with verified purchase), follows, saved items/wishlist, notifications, collections, and discussions — so users can interact with creators and content beyond browsing and purchasing.

**Architecture:** Server-side data fetching with Next.js 16 App Router. Reviews require verified purchase check. Follows and saved items are toggle endpoints. Notifications are created server-side when events occur and queried with unread count. Discussions support 2-level nested replies. All endpoints use existing auth and response envelope helpers.

**Tech Stack:** Next.js 16.2.2, TypeScript, Prisma 7, PostgreSQL, NextAuth v5 beta.30, Tailwind CSS 4, React 19

**Important — Next.js 16 breaking change:** All `params` and `searchParams` are `Promise` types and must be awaited.

**Phases Overview:**
- Phase 1 (done): Foundation
- Phase 2 (done): Core Marketplace
- Phase 3 (done): Payments & Storage
- **Phase 4 (this plan): Community — reviews, follows, saved, notifications, collections, discussions**
- Phase 5: Pro & Admin
- Phase 6: Polish & Deploy

---

## File Structure (Phase 4)

```
src/
├── lib/
│   ├── notifications.ts                        # Notification creation helper
│   └── reviews/
│       └── queries.ts                          # Review query helpers
├── app/
│   ├── api/
│   │   ├── rulesets/[id]/reviews/route.ts      # GET list, POST create
│   │   ├── reviews/[id]/route.ts               # PATCH edit, DELETE
│   │   ├── follow/route.ts                     # POST toggle follow
│   │   ├── saved/route.ts                      # GET list, POST toggle
│   │   ├── notifications/
│   │   │   ├── route.ts                        # GET list with unread count
│   │   │   └── read/route.ts                   # PATCH mark read
│   │   ├── collections/
│   │   │   ├── route.ts                        # GET list, POST create
│   │   │   └── [id]/
│   │   │       ├── route.ts                    # PATCH update, DELETE
│   │   │       └── items/route.ts              # POST add, DELETE remove
│   │   └── discussions/
│   │       ├── route.ts                        # GET list, POST create
│   │       └── [id]/
│   │           └── replies/route.ts            # POST reply
│   ├── (public)/
│   │   └── discussions/
│   │       └── page.tsx                        # Discussions forum page
│   └── dashboard/
│       ├── saved/page.tsx                      # Saved items / wishlist
│       ├── collections/
│       │   ├── page.tsx                        # My collections
│       │   └── new/page.tsx                    # Create collection
│       └── notifications/page.tsx              # Notifications center
├── components/
│   ├── reviews/
│   │   ├── review-list.tsx                     # Server component: review list
│   │   ├── review-form.tsx                     # Client: write/edit review
│   │   └── star-rating.tsx                     # Star display + input
│   ├── social/
│   │   ├── follow-button.tsx                   # Toggle follow
│   │   └── save-button.tsx                     # Toggle save/wishlist
│   └── notifications/
│       └── notification-bell.tsx               # Header bell with unread count
```

---

### Task 1: Review Query Helpers + Notification Helper

**Files:**
- Create: `src/lib/reviews/queries.ts`
- Create: `src/lib/notifications.ts`

- [ ] **Step 1: Create review query helpers**

Create `src/lib/reviews/queries.ts`:
```typescript
import { db } from "@/lib/db";

export async function getReviewsForRuleset(rulesetId: string, cursor?: string, pageSize = 10) {
  const reviews = await db.review.findMany({
    where: { rulesetId },
    orderBy: { createdAt: "desc" },
    take: pageSize + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
    },
  });

  const hasNext = reviews.length > pageSize;
  if (hasNext) reviews.pop();

  return {
    reviews,
    nextCursor: hasNext && reviews.length > 0 ? reviews[reviews.length - 1].id : undefined,
  };
}

export async function recalculateAvgRating(rulesetId: string) {
  const result = await db.review.aggregate({
    where: { rulesetId, refunded: false },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await db.ruleset.update({
    where: { id: rulesetId },
    data: {
      avgRating: result._avg.rating || 0,
      ratingCount: result._count.rating,
    },
  });
}
```

- [ ] **Step 2: Create notification helper**

Create `src/lib/notifications.ts`:
```typescript
import { db } from "@/lib/db";
import type { NotificationType } from "@/generated/prisma/client";

export async function createNotification(
  userId: string,
  type: NotificationType,
  data: Record<string, unknown>,
) {
  // Check if user wants this notification type (in-app)
  const pref = await db.notificationPreference.findUnique({
    where: { userId_type: { userId, type } },
  });

  // Default to enabled if no preference set
  if (pref && !pref.inAppEnabled) return null;

  return db.notification.create({
    data: { userId, type, data },
  });
}

export async function getUnreadCount(userId: string) {
  return db.notification.count({
    where: { userId, read: false },
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/reviews/ src/lib/notifications.ts
git commit -m "feat: add review query helpers and notification creation utility"
```

---

### Task 2: Reviews API

**Files:**
- Create: `src/app/api/rulesets/[id]/reviews/route.ts`
- Create: `src/app/api/reviews/[id]/route.ts`

- [ ] **Step 1: Create reviews list + create endpoint**

Create `src/app/api/rulesets/[id]/reviews/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { getReviewsForRuleset, recalculateAvgRating } from "@/lib/reviews/queries";
import { createNotification } from "@/lib/notifications";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const result = await getReviewsForRuleset(id, cursor);
    return success(result);
  } catch {
    return errors.internal();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rulesetId } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) return errors.validation("Rating must be 1-5");
    if (!comment || comment.trim().length < 1) return errors.validation("Comment is required");

    // Check for existing review
    const existing = await db.review.findFirst({
      where: { userId: session.user.id, rulesetId },
    });
    if (existing) return errors.conflict("You already reviewed this ruleset");

    // Check for verified purchase
    const purchase = await db.purchase.findFirst({
      where: { buyerId: session.user.id, rulesetId, status: "COMPLETED" },
    });

    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { authorId: true, title: true },
    });
    if (!ruleset) return errors.notFound("Ruleset not found");

    // Cannot review own ruleset
    if (ruleset.authorId === session.user.id) return errors.validation("Cannot review your own ruleset");

    const review = await db.review.create({
      data: {
        userId: session.user.id,
        rulesetId,
        rating,
        comment: comment.trim(),
        isVerifiedPurchase: !!purchase,
      },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });

    await recalculateAvgRating(rulesetId);

    // Notify ruleset author
    await createNotification(ruleset.authorId, "NEW_REVIEW", {
      reviewId: review.id,
      rulesetId,
      rulesetTitle: ruleset.title,
      reviewerName: session.user.name,
      rating,
    });

    return success(review, 201);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Create review edit + delete endpoint**

Create `src/app/api/reviews/[id]/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { recalculateAvgRating } from "@/lib/reviews/queries";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const review = await db.review.findUnique({ where: { id } });
    if (!review) return errors.notFound("Review not found");
    if (review.userId !== session.user.id) return errors.forbidden("Only the review author can edit");

    const body = await req.json();
    const { rating, comment } = body;

    const updated = await db.review.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment: comment.trim() }),
      },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });

    if (rating !== undefined) {
      await recalculateAvgRating(review.rulesetId);
    }

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

    const review = await db.review.findUnique({ where: { id } });
    if (!review) return errors.notFound("Review not found");

    // Only review author or admin can delete
    const isAdmin = session.user.role === "ADMIN";
    if (review.userId !== session.user.id && !isAdmin) {
      return errors.forbidden("Only the review author or admin can delete");
    }

    await db.review.delete({ where: { id } });
    await recalculateAvgRating(review.rulesetId);

    return success({ message: "Review deleted" });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/api/rulesets/[id]/reviews/" "src/app/api/reviews/"
git commit -m "feat: add reviews API (list, create with verified purchase, edit, delete)"
```

---

### Task 3: Follow + Saved Items APIs

**Files:**
- Create: `src/app/api/follow/route.ts`
- Create: `src/app/api/saved/route.ts`

- [ ] **Step 1: Create follow toggle endpoint**

Create `src/app/api/follow/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { createNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { userId } = body;

    if (!userId) return errors.validation("userId is required");
    if (userId === session.user.id) return errors.validation("Cannot follow yourself");

    const targetUser = await db.user.findUnique({ where: { id: userId }, select: { id: true, name: true } });
    if (!targetUser) return errors.notFound("User not found");

    const existing = await db.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
    });

    if (existing) {
      await db.follow.delete({
        where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
      });
      return success({ following: false });
    }

    await db.follow.create({
      data: { followerId: session.user.id, followingId: userId },
    });

    await createNotification(userId, "NEW_FOLLOWER", {
      followerId: session.user.id,
      followerName: session.user.name,
      followerUsername: session.user.username,
    });

    return success({ following: true });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Create saved items endpoint**

Create `src/app/api/saved/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, list, errors, paginationFromCursor } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 20;

    const items = await db.savedItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { userId_rulesetId: { userId: session.user.id, rulesetId: cursor } }, skip: 1 } : {}),
      include: {
        ruleset: {
          select: {
            id: true, title: true, slug: true, description: true,
            price: true, platform: true, type: true, avgRating: true,
            author: { select: { name: true, username: true } },
            _count: { select: { votes: true } },
          },
        },
      },
    });

    const hasNext = items.length > pageSize;
    if (hasNext) items.pop();
    const nextCursor = hasNext && items.length > 0 ? items[items.length - 1].rulesetId : undefined;
    const total = await db.savedItem.count({ where: { userId: session.user.id } });

    return list(items, paginationFromCursor(total, pageSize, nextCursor));
  } catch {
    return errors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId } = body;

    if (!rulesetId) return errors.validation("rulesetId is required");

    const ruleset = await db.ruleset.findUnique({ where: { id: rulesetId }, select: { id: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");

    const existing = await db.savedItem.findUnique({
      where: { userId_rulesetId: { userId: session.user.id, rulesetId } },
    });

    if (existing) {
      await db.savedItem.delete({
        where: { userId_rulesetId: { userId: session.user.id, rulesetId } },
      });
      return success({ saved: false });
    }

    await db.savedItem.create({
      data: { userId: session.user.id, rulesetId },
    });

    return success({ saved: true });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/follow/ src/app/api/saved/
git commit -m "feat: add follow toggle and saved items (wishlist) API"
```

---

### Task 4: Notifications + Collections APIs

**Files:**
- Create: `src/app/api/notifications/route.ts`
- Create: `src/app/api/notifications/read/route.ts`
- Create: `src/app/api/collections/route.ts`
- Create: `src/app/api/collections/[id]/route.ts`
- Create: `src/app/api/collections/[id]/items/route.ts`

- [ ] **Step 1: Create notifications list endpoint**

Create `src/app/api/notifications/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 20;

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: pageSize + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      db.notification.count({ where: { userId: session.user.id, read: false } }),
    ]);

    const hasNext = notifications.length > pageSize;
    if (hasNext) notifications.pop();

    return success({
      notifications,
      unreadCount,
      nextCursor: hasNext && notifications.length > 0 ? notifications[notifications.length - 1].id : undefined,
    });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Create mark-read endpoint**

Create `src/app/api/notifications/read/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { ids } = body;

    if (ids && Array.isArray(ids)) {
      await db.notification.updateMany({
        where: { id: { in: ids }, userId: session.user.id },
        data: { read: true },
      });
    } else {
      // Mark all as read
      await db.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true },
      });
    }

    return success({ message: "Marked as read" });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 3: Create collections CRUD endpoint**

Create `src/app/api/collections/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { slugify } from "@/lib/slugify";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const collections = await db.collection.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { items: true } } },
    });

    return success(collections);
  } catch {
    return errors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { name, description, isPublic } = body;

    if (!name) return errors.validation("Name is required");

    let slug = slugify(name);
    const existing = await db.collection.findUnique({
      where: { userId_slug: { userId: session.user.id, slug } },
    });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const collection = await db.collection.create({
      data: {
        userId: session.user.id,
        name,
        slug,
        description: description || null,
        isPublic: isPublic !== false,
      },
    });

    return success(collection, 201);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 4: Create collection detail + items endpoints**

Create `src/app/api/collections/[id]/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const collection = await db.collection.findUnique({ where: { id } });
    if (!collection) return errors.notFound("Collection not found");
    if (collection.userId !== session.user.id) return errors.forbidden("Not your collection");

    const body = await req.json();
    const { name, description, isPublic } = body;

    const updated = await db.collection.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic }),
      },
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

    const collection = await db.collection.findUnique({ where: { id } });
    if (!collection) return errors.notFound("Collection not found");
    if (collection.userId !== session.user.id) return errors.forbidden("Not your collection");

    await db.collection.delete({ where: { id } });
    return success({ message: "Collection deleted" });
  } catch {
    return errors.internal();
  }
}
```

Create `src/app/api/collections/[id]/items/route.ts`:
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

    const collection = await db.collection.findUnique({ where: { id } });
    if (!collection) return errors.notFound("Collection not found");
    if (collection.userId !== session.user.id) return errors.forbidden("Not your collection");

    const body = await req.json();
    const { rulesetId } = body;
    if (!rulesetId) return errors.validation("rulesetId is required");

    const ruleset = await db.ruleset.findUnique({ where: { id: rulesetId }, select: { id: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");

    const count = await db.collectionItem.count({ where: { collectionId: id } });

    await db.collectionItem.create({
      data: { collectionId: id, rulesetId, position: count },
    });

    return success({ added: true });
  } catch {
    return errors.internal();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const collection = await db.collection.findUnique({ where: { id } });
    if (!collection) return errors.notFound("Collection not found");
    if (collection.userId !== session.user.id) return errors.forbidden("Not your collection");

    const rulesetId = req.nextUrl.searchParams.get("rulesetId");
    if (!rulesetId) return errors.validation("rulesetId is required");

    await db.collectionItem.delete({
      where: { collectionId_rulesetId: { collectionId: id, rulesetId } },
    });

    return success({ removed: true });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/notifications/ src/app/api/collections/
git commit -m "feat: add notifications (list, mark-read) and collections CRUD API"
```

---

### Task 5: Discussions API

**Files:**
- Create: `src/app/api/discussions/route.ts`
- Create: `src/app/api/discussions/[id]/replies/route.ts`

- [ ] **Step 1: Create discussions list + create endpoint**

Create `src/app/api/discussions/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const category = sp.get("category") || undefined;
    const cursor = sp.get("cursor") || undefined;
    const pageSize = 20;

    const where = category ? { category } : {};

    const discussions = await db.discussion.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { replies: true } },
      },
    });

    const hasNext = discussions.length > pageSize;
    if (hasNext) discussions.pop();

    return success({
      discussions,
      nextCursor: hasNext && discussions.length > 0 ? discussions[discussions.length - 1].id : undefined,
    });
  } catch {
    return errors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { title, bodyText, category, rulesetId } = body;

    if (!title || !bodyText || !category) {
      return errors.validation("title, body, and category are required");
    }

    let slug = slugify(title);
    const existing = await db.discussion.findUnique({
      where: { category_slug: { category, slug } },
    });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const discussion = await db.discussion.create({
      data: {
        title,
        slug,
        body: bodyText,
        category,
        authorId: session.user.id,
        rulesetId: rulesetId || null,
      },
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });

    return success(discussion, 201);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Create discussion replies endpoint**

Create `src/app/api/discussions/[id]/replies/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: discussionId } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { bodyText, parentReplyId } = body;

    if (!bodyText) return errors.validation("Body is required");

    const discussion = await db.discussion.findUnique({
      where: { id: discussionId },
      select: { id: true, authorId: true, title: true },
    });
    if (!discussion) return errors.notFound("Discussion not found");

    // Max 2 levels deep
    if (parentReplyId) {
      const parent = await db.discussionReply.findUnique({
        where: { id: parentReplyId },
        select: { parentReplyId: true },
      });
      if (parent?.parentReplyId) {
        return errors.validation("Maximum reply depth is 2 levels");
      }
    }

    const reply = await db.discussionReply.create({
      data: {
        discussionId,
        authorId: session.user.id,
        body: bodyText,
        parentReplyId: parentReplyId || null,
      },
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });

    // Notify discussion author
    if (discussion.authorId !== session.user.id) {
      await createNotification(discussion.authorId, "DISCUSSION_REPLY", {
        discussionId,
        discussionTitle: discussion.title,
        replierName: session.user.name,
      });
    }

    return success(reply, 201);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/discussions/
git commit -m "feat: add discussions API (list, create, reply with 2-level nesting)"
```

---

### Task 6: UI Components (Reviews, Follow, Save, Notifications)

**Files:**
- Create: `src/components/reviews/star-rating.tsx`
- Create: `src/components/reviews/review-form.tsx`
- Create: `src/components/reviews/review-list.tsx`
- Create: `src/components/social/follow-button.tsx`
- Create: `src/components/social/save-button.tsx`
- Create: `src/components/notifications/notification-bell.tsx`

- [ ] **Step 1: Create StarRating component**

Create `src/components/reviews/star-rating.tsx`:
```tsx
"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const sizeClass = size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className={`inline-flex gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform ${
            star <= value ? "text-yellow-400" : "text-text-tertiary"
          }`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create ReviewForm component**

Create `src/components/reviews/review-form.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/reviews/star-rating";
import { toast } from "@/components/ui/toast";

interface ReviewFormProps {
  rulesetId: string;
}

export function ReviewForm({ rulesetId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { toast("Please select a rating", "warning"); return; }

    setLoading(true);
    const res = await fetch(`/api/rulesets/${rulesetId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    setLoading(false);
    if (res.ok) {
      toast("Review submitted", "success");
      setRating(0);
      setComment("");
      router.refresh();
    } else {
      const err = await res.json();
      toast(err.error?.message || "Failed to submit review", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        rows={3}
        required
        className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors"
      />
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Create ReviewList component**

Create `src/components/reviews/review-list.tsx`:
```tsx
import { StarRating } from "@/components/reviews/star-rating";
import { Badge } from "@/components/ui/badge";

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user: { username: string; name: string };
}

export function ReviewList({ reviews }: { reviews: ReviewData[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-text-tertiary">No reviews yet</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <StarRating value={r.rating} readonly size="sm" />
            {r.isVerifiedPurchase && <Badge variant="green">Verified Purchase</Badge>}
          </div>
          <p className="text-sm text-text-secondary whitespace-pre-wrap mb-2">{r.comment}</p>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span>{r.user.name}</span>
            <span>&middot;</span>
            <span>{new Date(r.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create FollowButton component**

Create `src/components/social/follow-button.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface FollowButtonProps {
  userId: string;
  initialFollowing: boolean;
}

export function FollowButton({ userId, initialFollowing }: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (!session?.user) { router.push("/login"); return; }

    setLoading(true);
    const prev = following;
    setFollowing(!following);

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        setFollowing(prev);
        toast("Failed to update follow", "error");
      }
    } catch {
      setFollowing(prev);
      toast("Failed to update follow", "error");
    }
    setLoading(false);
  }

  return (
    <Button
      onClick={handleFollow}
      variant={following ? "outline" : "primary"}
      size="sm"
      disabled={loading}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
```

- [ ] **Step 5: Create SaveButton component**

Create `src/components/social/save-button.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

interface SaveButtonProps {
  rulesetId: string;
  initialSaved: boolean;
}

export function SaveButton({ rulesetId, initialSaved }: SaveButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);

  async function handleSave() {
    if (!session?.user) { router.push("/login"); return; }

    const prev = saved;
    setSaved(!saved);

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rulesetId }),
      });

      if (!res.ok) {
        setSaved(prev);
        toast("Failed to update", "error");
      }
    } catch {
      setSaved(prev);
      toast("Failed to update", "error");
    }
  }

  return (
    <button
      onClick={handleSave}
      className={`text-sm transition-colors ${saved ? "text-accent-green" : "text-text-tertiary hover:text-text-secondary"}`}
      title={saved ? "Remove from saved" : "Save for later"}
    >
      <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 6: Create NotificationBell component**

Create `src/components/notifications/notification-bell.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function NotificationBell() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user) return;

    async function fetchCount() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.data.unreadCount);
        }
      } catch {
        // Silent fail
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session?.user) return null;

  return (
    <Link href="/dashboard/notifications" className="relative text-text-tertiary hover:text-text-primary transition-colors">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/reviews/ src/components/social/ src/components/notifications/
git commit -m "feat: add review, follow, save, and notification UI components"
```

---

### Task 7: Dashboard Pages (Saved, Collections, Notifications)

**Files:**
- Create: `src/app/dashboard/saved/page.tsx`
- Create: `src/app/dashboard/collections/page.tsx`
- Create: `src/app/dashboard/notifications/page.tsx`

- [ ] **Step 1: Create saved items page**

Create `src/app/dashboard/saved/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import { formatCardData } from "@/lib/rulesets/queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Saved — Ruleset" };

export default async function DashboardSavedPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const savedItems = await db.savedItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      ruleset: {
        include: {
          author: { select: { id: true, username: true, name: true, avatar: true } },
          tags: { select: { tag: { select: { name: true } } } },
          _count: { select: { votes: true } },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Saved Rulesets</h1>

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedItems.map((item) => (
            <RulesetCard key={item.rulesetId} ruleset={formatCardData(item.ruleset, session.user!.id)} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-text-tertiary">
          <p className="mb-4">No saved rulesets yet</p>
          <Link href="/search" className="text-accent-green hover:underline">
            Browse the marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create collections page**

Create `src/app/dashboard/collections/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Collections — Ruleset" };

export default async function DashboardCollectionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const collections = await db.collection.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">My Collections</h1>
        <Link href="/dashboard/collections/new">
          <Button size="sm">New Collection</Button>
        </Link>
      </div>

      {collections.length > 0 ? (
        <div className="space-y-2">
          {collections.map((c) => (
            <div key={c.id} className="card p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-text-primary">{c.name}</span>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                  <Badge variant={c.isPublic ? "green" : "default"}>
                    {c.isPublic ? "Public" : "Private"}
                  </Badge>
                  <span>{c._count.items} items</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-text-tertiary">
          <p className="mb-4">No collections yet</p>
          <Link href="/dashboard/collections/new">
            <Button>Create your first collection</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create notifications page**

Create `src/app/dashboard/notifications/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications — Ruleset" };

const TYPE_LABELS: Record<string, string> = {
  NEW_FOLLOWER: "New Follower",
  NEW_REVIEW: "New Review",
  REVIEW_REPLY: "Review Reply",
  SALE_MADE: "Sale Made",
  RULESET_UPDATED: "Ruleset Updated",
  DISCUSSION_REPLY: "Discussion Reply",
  PAYOUT_COMPLETE: "Payout Complete",
  ADMIN_ANNOUNCEMENT: "Announcement",
};

export default async function DashboardNotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Mark all as read
  await db.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Notifications</h1>

      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((n) => {
            const data = n.data as Record<string, string>;
            return (
              <div
                key={n.id}
                className={`card p-4 ${!n.read ? "border-l-2 border-l-accent-green" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-accent-green uppercase tracking-wider">
                      {TYPE_LABELS[n.type] || n.type}
                    </span>
                    <p className="text-sm text-text-secondary mt-1">
                      {data.followerName && `${data.followerName} started following you`}
                      {data.reviewerName && `${data.reviewerName} reviewed "${data.rulesetTitle}"`}
                      {data.replierName && `${data.replierName} replied to "${data.discussionTitle}"`}
                      {!data.followerName && !data.reviewerName && !data.replierName && JSON.stringify(data)}
                    </p>
                  </div>
                  <span className="text-xs text-text-tertiary whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-8 text-center text-text-tertiary">
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/saved/ src/app/dashboard/collections/ src/app/dashboard/notifications/
git commit -m "feat: add dashboard saved, collections, and notifications pages"
```

---

### Task 8: Integrate Reviews into Ruleset Detail Page

**Files:**
- Modify: `src/app/(public)/r/[slug]/page.tsx`

- [ ] **Step 1: Add reviews section to ruleset detail page**

Add imports and a reviews section at the bottom of the ruleset detail page, after the versions section. Import `ReviewList`, `ReviewForm`, and `getReviewsForRuleset`. Add a reviews section that shows the form (for authenticated non-authors) and the review list.

- [ ] **Step 2: Add FollowButton to creator profile page**

Update `src/app/(public)/u/[username]/page.tsx` to include a FollowButton.

- [ ] **Step 3: Add SaveButton to RulesetCard**

- [ ] **Step 4: Commit**

```bash
git add "src/app/(public)/r/[slug]/page.tsx" "src/app/(public)/u/[username]/page.tsx" src/components/rulesets/ruleset-card.tsx
git commit -m "feat: integrate reviews, follow button, and save button into pages"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Run full build**
- [ ] **Step 2: Run linter**
- [ ] **Step 3: Verify all new routes**
- [ ] **Step 4: Commit any fixes**

---

## Phase 4 Complete Checklist

After all tasks:
- [x] Review query helpers + avg rating recalculation
- [x] Notification creation helper
- [x] Reviews API (list, create with verified purchase check, edit, delete)
- [x] Follow toggle API with notifications
- [x] Saved items API (list, toggle)
- [x] Notifications API (list with unread count, mark read)
- [x] Collections CRUD API (create, update, delete, add/remove items)
- [x] Discussions API (list, create, reply with 2-level nesting)
- [x] StarRating, ReviewForm, ReviewList components
- [x] FollowButton, SaveButton, NotificationBell components
- [x] Dashboard saved, collections, notifications pages
- [x] Reviews integrated into ruleset detail page
- [x] Follow button on creator profile
- [x] Clean build with no errors

**Next:** Phase 5 — Pro & Admin (analytics, admin panel, subscriptions, cron jobs)
