# Phase 1: Community Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform RuleSet AI from a storefront into a community platform by adding creator profiles, follow system, discussion threads, open taxonomy (tags), and a community-first homepage.

**Architecture:** All community features are client components backed by server actions that fall back to mock data when Supabase is not configured (same pattern as existing DAL). New pages use the existing layout pattern: Header + main content + Footer. New database tables extend the existing Supabase schema with a second migration file.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui, Framer Motion, Zustand (client state), Supabase (database), Clerk (auth), next-intl (i18n)

**Spec:** `docs/superpowers/specs/2026-03-28-community-platform-design.md`

---

## File Map

### New Files

| File | Responsibility |
|------|---------------|
| `supabase/migrations/00002_community_foundation.sql` | DB tables: follows, creator_profiles, discussions, discussion_replies, discussion_votes, tags, product_tags |
| `src/types/community.ts` | TypeScript types for all community entities |
| `src/lib/dal/community.ts` | DAL functions: follows, creator profiles, discussions, tags |
| `src/app/actions/community.ts` | Server actions: follow/unfollow, create discussion, reply, vote, create tag |
| `src/app/[locale]/profile/[username]/page.tsx` | Creator profile page |
| `src/app/[locale]/feed/page.tsx` | Activity feed page |
| `src/components/community/follow-button.tsx` | Follow/unfollow toggle button |
| `src/components/community/discussion-thread.tsx` | Discussion list + reply form for product pages |
| `src/components/community/discussion-card.tsx` | Single discussion preview card |
| `src/components/community/creator-card.tsx` | Creator avatar + name + follower count card |
| `src/components/community/tag-input.tsx` | Autocomplete tag input for product upload |
| `src/components/landing/trending-section.tsx` | "Trending This Week" section for homepage |
| `src/components/landing/recent-activity-section.tsx` | "Recently Active" live feed section |
| `src/components/landing/top-creators-section.tsx` | "Top Creators" section for homepage |
| `messages/en.json` | Extended with community translation keys |
| `messages/tr.json` | Extended with community translation keys |

### Modified Files

| File | Change |
|------|--------|
| `src/types/index.ts` | Add CreatorProfile, Discussion, DiscussionReply, Tag types |
| `src/app/[locale]/page.tsx` | Replace marketing sections with community-first sections |
| `src/app/[locale]/marketplace/[slug]/page.tsx` | Add Discussions tab, tag display |
| `src/components/layout/header.tsx` | Add Feed and Profile nav links for signed-in users |
| `src/app/[locale]/seller/upload/page.tsx` | Replace tag input with autocomplete tag-input component |
| `src/lib/dal/index.ts` | Re-export community DAL functions |

---

## Task 1: Database Migration — Community Tables

**Files:**
- Create: `supabase/migrations/00002_community_foundation.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- RuleSet AI — Community Foundation Tables
-- Migration 002

-- ==========================================
-- CREATOR PROFILES (extended user info)
-- ==========================================

CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(500),
  banner_url VARCHAR(500),
  website_url VARCHAR(500),
  twitter_handle VARCHAR(100),
  github_handle VARCHAR(100),
  discord_handle VARCHAR(100),
  tagline VARCHAR(300),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  product_count INTEGER NOT NULL DEFAULT 0,
  follower_count INTEGER NOT NULL DEFAULT 0,
  following_count INTEGER NOT NULL DEFAULT 0,
  total_sales INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_creator_profiles_featured ON creator_profiles (follower_count DESC) WHERE is_featured = TRUE;
CREATE INDEX idx_creator_profiles_followers ON creator_profiles (follower_count DESC);

-- ==========================================
-- FOLLOWS (polymorphic: user, product, collection)
-- ==========================================

CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('user', 'product', 'collection')),
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, target_type, target_id)
);

CREATE INDEX idx_follows_target ON follows (target_type, target_id);
CREATE INDEX idx_follows_follower ON follows (follower_id, target_type);
CREATE INDEX idx_follows_target_user ON follows (target_id) WHERE target_type = 'user';

-- ==========================================
-- DISCUSSIONS (Q&A per product)
-- ==========================================

CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  body TEXT NOT NULL,
  thread_type VARCHAR(20) NOT NULL DEFAULT 'question' CHECK (thread_type IN ('question', 'bug', 'showcase', 'feature_request', 'changelog', 'announcement')),
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  best_answer_id UUID NULL,
  reply_count INTEGER NOT NULL DEFAULT 0,
  upvote_count INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_discussions_product ON discussions (product_id, last_activity_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_discussions_author ON discussions (author_id) WHERE deleted_at IS NULL;

-- ==========================================
-- DISCUSSION REPLIES (one level of threading)
-- ==========================================

CREATE TABLE discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  parent_reply_id UUID NULL REFERENCES discussion_replies(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_best_answer BOOLEAN NOT NULL DEFAULT FALSE,
  upvote_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_discussion_replies_thread ON discussion_replies (discussion_id, created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_discussion_replies_parent ON discussion_replies (parent_reply_id) WHERE parent_reply_id IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX idx_discussion_best_answer ON discussion_replies (discussion_id) WHERE is_best_answer = TRUE AND deleted_at IS NULL;

-- ==========================================
-- DISCUSSION VOTES
-- ==========================================

CREATE TABLE discussion_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('discussion', 'reply')),
  target_id UUID NOT NULL,
  value SMALLINT NOT NULL CHECK (value IN (1, -1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX idx_discussion_votes_target ON discussion_votes (target_type, target_id);

-- ==========================================
-- TAGS (community-driven, open taxonomy)
-- ==========================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(30) DEFAULT 'platform' CHECK (category IN ('platform', 'language', 'framework', 'use_case', 'other')),
  usage_count INTEGER NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_usage ON tags (usage_count DESC) WHERE is_approved = TRUE;
CREATE INDEX idx_tags_name_trgm ON tags USING gin (name gin_trgm_ops) WHERE is_approved = TRUE;

CREATE TABLE product_tags (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX idx_product_tags_tag ON product_tags (tag_id);

-- ==========================================
-- ACTIVITY EVENTS (for feed)
-- ==========================================

CREATE TABLE activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
    'new_product', 'product_updated', 'new_discussion', 'new_reply',
    'best_answer', 'new_review', 'user_followed', 'new_showcase'
  )),
  target_type VARCHAR(30) NOT NULL,
  target_id UUID NOT NULL,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  visibility VARCHAR(10) NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_events_actor ON activity_events (actor_id, created_at DESC);
CREATE INDEX idx_activity_events_public ON activity_events (created_at DESC) WHERE visibility = 'public';

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Auto-update updated_at
CREATE TRIGGER creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER discussions_updated_at BEFORE UPDATE ON discussions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER discussion_replies_updated_at BEFORE UPDATE ON discussion_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update discussion reply_count on reply insert/delete
CREATE OR REPLACE FUNCTION update_discussion_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discussions SET reply_count = reply_count + 1, last_activity_at = NOW() WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discussions SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_discussion_reply_count
  AFTER INSERT OR DELETE ON discussion_replies
  FOR EACH ROW EXECUTE FUNCTION update_discussion_reply_count();

-- Update follower_count on creator_profiles when followed/unfollowed
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.target_type = 'user' THEN
    UPDATE creator_profiles SET follower_count = follower_count + 1 WHERE user_id = NEW.target_id;
    UPDATE creator_profiles SET following_count = following_count + 1 WHERE user_id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'user' THEN
    UPDATE creator_profiles SET follower_count = GREATEST(follower_count - 1, 0) WHERE user_id = OLD.target_id;
    UPDATE creator_profiles SET following_count = GREATEST(following_count - 1, 0) WHERE user_id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_follower_count
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follower_count();

-- Update tag usage_count on product_tags insert/delete
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tag_usage_count
  AFTER INSERT OR DELETE ON product_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- ==========================================
-- SEED: Default platform tags
-- ==========================================

INSERT INTO tags (name, slug, category, is_approved) VALUES
  ('Cursor', 'cursor', 'platform', true),
  ('Windsurf', 'windsurf', 'platform', true),
  ('Claude Code', 'claude-code', 'platform', true),
  ('VS Code', 'vs-code', 'platform', true),
  ('Codex', 'codex', 'platform', true),
  ('OpenCode', 'opencode', 'platform', true),
  ('Aider', 'aider', 'platform', true),
  ('Continue.dev', 'continue-dev', 'platform', true),
  ('N8N', 'n8n', 'platform', true),
  ('Make', 'make', 'platform', true),
  ('Zapier', 'zapier', 'platform', true),
  ('Langflow', 'langflow', 'platform', true),
  ('CrewAI', 'crewai', 'platform', true),
  ('LangGraph', 'langgraph', 'platform', true),
  ('AutoGen', 'autogen', 'platform', true),
  ('Agency Swarm', 'agency-swarm', 'platform', true),
  ('ComfyUI', 'comfyui', 'platform', true),
  ('TypeScript', 'typescript', 'language', true),
  ('Python', 'python', 'language', true),
  ('React', 'react', 'framework', true),
  ('Next.js', 'nextjs', 'framework', true),
  ('Automation', 'automation', 'use_case', true),
  ('Code Review', 'code-review', 'use_case', true),
  ('Testing', 'testing', 'use_case', true),
  ('DevOps', 'devops', 'use_case', true),
  ('Content Creation', 'content-creation', 'use_case', true),
  ('RAG', 'rag', 'use_case', true),
  ('Agents', 'agents', 'use_case', true);
```

- [ ] **Step 2: Verify SQL syntax**

Run: `cd D:/RulesetMarketplace-master && cat supabase/migrations/00002_community_foundation.sql | head -5`
Expected: Shows the migration header without syntax errors.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/00002_community_foundation.sql
git commit -m "feat: add community foundation database tables

Tables: creator_profiles, follows, discussions, discussion_replies,
discussion_votes, tags, product_tags, activity_events.
Includes triggers for denormalized counters and 28 seed platform tags."
```

---

## Task 2: Community TypeScript Types

**Files:**
- Create: `src/types/community.ts`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Create community types**

```typescript
// src/types/community.ts

export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  websiteUrl: string | null;
  twitterHandle: string | null;
  githubHandle: string | null;
  discordHandle: string | null;
  tagline: string | null;
  isFeatured: boolean;
  productCount: number;
  followerCount: number;
  followingCount: number;
  totalSales: number;
  createdAt: string;
}

export type DiscussionType =
  | "question"
  | "bug"
  | "showcase"
  | "feature_request"
  | "changelog"
  | "announcement";

export interface Discussion {
  id: string;
  productId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  title: string;
  body: string;
  threadType: DiscussionType;
  isClosed: boolean;
  isPinned: boolean;
  bestAnswerId: string | null;
  replyCount: number;
  upvoteCount: number;
  lastActivityAt: string;
  createdAt: string;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  parentReplyId: string | null;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  body: string;
  isBestAnswer: boolean;
  upvoteCount: number;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: "platform" | "language" | "framework" | "use_case" | "other";
  usageCount: number;
  isApproved: boolean;
}

export interface ActivityEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorAvatar: string | null;
  eventType: string;
  targetType: string;
  targetId: string;
  context: Record<string, unknown>;
  createdAt: string;
}

export interface FollowState {
  isFollowing: boolean;
  followerCount: number;
}
```

- [ ] **Step 2: Re-export from index.ts**

Add to the bottom of `src/types/index.ts`:

```typescript
export type {
  CreatorProfile,
  Discussion,
  DiscussionReply,
  DiscussionType,
  Tag,
  ActivityEvent,
  FollowState,
} from "./community";
```

- [ ] **Step 3: Verify typecheck**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/types/community.ts src/types/index.ts
git commit -m "feat: add community TypeScript types

Types: CreatorProfile, Discussion, DiscussionReply, Tag,
ActivityEvent, FollowState, DiscussionType."
```

---

## Task 3: Community DAL (Data Access Layer)

**Files:**
- Create: `src/lib/dal/community.ts`
- Modify: `src/lib/dal/index.ts`

- [ ] **Step 1: Create community DAL with mock fallback**

```typescript
// src/lib/dal/community.ts

import { createClient } from "@supabase/supabase-js";
import type {
  CreatorProfile,
  Discussion,
  DiscussionReply,
  Tag,
  ActivityEvent,
} from "@/types/community";
import { MOCK_PRODUCTS } from "@/constants/mock-data";
import { isBackendConfigured } from "./config";

function getDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ============================================================
// MOCK DATA for community features
// ============================================================

const MOCK_CREATORS: CreatorProfile[] = [
  {
    id: "cp-1", userId: "a0000000-0000-0000-0000-000000000002",
    displayName: "Alex Chen", bio: "Full-stack developer specializing in AI-powered workflows and IDE configurations.",
    avatarUrl: null, bannerUrl: null, websiteUrl: "https://alexchen.dev",
    twitterHandle: "alexchendev", githubHandle: "alexchen", discordHandle: null,
    tagline: "Building the future of AI development", isFeatured: true,
    productCount: 2, followerCount: 1247, followingCount: 89, totalSales: 4947, createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cp-2", userId: "a0000000-0000-0000-0000-000000000006",
    displayName: "Emma Wilson", bio: "Enterprise software architect. Building tools for large-scale development teams.",
    avatarUrl: null, bannerUrl: null, websiteUrl: "https://emmawilson.tech",
    twitterHandle: "emmawilsontech", githubHandle: "emmawilson", discordHandle: null,
    tagline: "Enterprise AI at scale", isFeatured: true,
    productCount: 1, followerCount: 2340, followingCount: 156, totalSales: 4123, createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cp-3", userId: "a0000000-0000-0000-0000-000000000004",
    displayName: "Marco Rossi", bio: "Automation expert with 10+ years in workflow design. N8N certified.",
    avatarUrl: null, bannerUrl: null, websiteUrl: "https://marcorossi.io",
    twitterHandle: null, githubHandle: "marcorossi", discordHandle: "marco#1234",
    tagline: "Automate everything", isFeatured: false,
    productCount: 1, followerCount: 1890, followingCount: 234, totalSales: 3456, createdAt: "2026-01-01T00:00:00Z",
  },
];

const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: "d-1", productId: "1", authorId: "u1", authorName: "John Developer", authorAvatar: null,
    title: "Does this work with Windsurf 2.0?", body: "I just updated to Windsurf 2.0 and some of the rules seem to conflict with the new linter. Has anyone else experienced this?",
    threadType: "question", isClosed: false, isPinned: false, bestAnswerId: null,
    replyCount: 3, upvoteCount: 12, lastActivityAt: "2026-03-27T14:00:00Z", createdAt: "2026-03-25T10:00:00Z",
  },
  {
    id: "d-2", productId: "1", authorId: "u2", authorName: "Lisa Tech", authorAvatar: null,
    title: "My team setup with these rules", body: "We've been using these rules across a team of 12 developers for the past month. Here's how we configured them for our monorepo...",
    threadType: "showcase", isClosed: false, isPinned: false, bestAnswerId: null,
    replyCount: 8, upvoteCount: 24, lastActivityAt: "2026-03-28T09:00:00Z", createdAt: "2026-03-20T08:00:00Z",
  },
  {
    id: "d-3", productId: "3", authorId: "u3", authorName: "Mike Automation", authorAvatar: null,
    title: "RAG pipeline memory leak on large datasets", body: "When processing datasets over 10GB, the RAG pipeline workflow seems to consume memory indefinitely. Steps to reproduce...",
    threadType: "bug", isClosed: false, isPinned: false, bestAnswerId: null,
    replyCount: 5, upvoteCount: 8, lastActivityAt: "2026-03-26T16:00:00Z", createdAt: "2026-03-24T12:00:00Z",
  },
];

const MOCK_TAGS: Tag[] = [
  { id: "t-1", name: "Cursor", slug: "cursor", description: null, category: "platform", usageCount: 45, isApproved: true },
  { id: "t-2", name: "Windsurf", slug: "windsurf", description: null, category: "platform", usageCount: 38, isApproved: true },
  { id: "t-3", name: "Claude Code", slug: "claude-code", description: null, category: "platform", usageCount: 32, isApproved: true },
  { id: "t-4", name: "N8N", slug: "n8n", description: null, category: "platform", usageCount: 28, isApproved: true },
  { id: "t-5", name: "TypeScript", slug: "typescript", description: null, category: "language", usageCount: 67, isApproved: true },
  { id: "t-6", name: "React", slug: "react", description: null, category: "framework", usageCount: 52, isApproved: true },
  { id: "t-7", name: "Automation", slug: "automation", description: null, category: "use_case", usageCount: 41, isApproved: true },
  { id: "t-8", name: "CrewAI", slug: "crewai", description: null, category: "platform", usageCount: 19, isApproved: true },
];

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: "ae-1", actorId: "s1", actorName: "Alex Chen", actorAvatar: null,
    eventType: "new_product", targetType: "product", targetId: "1",
    context: { productTitle: "Ultimate Windsurf Rules v3", productCategory: "RULESET" },
    createdAt: "2026-03-27T10:00:00Z",
  },
  {
    id: "ae-2", actorId: "s5", actorName: "Emma Wilson", actorAvatar: null,
    eventType: "new_review", targetType: "product", targetId: "5",
    context: { productTitle: "Cursor Rules Enterprise Pack", rating: 5 },
    createdAt: "2026-03-27T08:00:00Z",
  },
  {
    id: "ae-3", actorId: "s3", actorName: "Marco Rossi", actorAvatar: null,
    eventType: "new_discussion", targetType: "product", targetId: "3",
    context: { productTitle: "N8N AI Automation Suite", discussionTitle: "RAG pipeline memory leak" },
    createdAt: "2026-03-26T16:00:00Z",
  },
  {
    id: "ae-4", actorId: "u2", actorName: "Lisa Tech", actorAvatar: null,
    eventType: "new_showcase", targetType: "product", targetId: "1",
    context: { productTitle: "Ultimate Windsurf Rules v3", showcaseTitle: "My team setup with these rules" },
    createdAt: "2026-03-26T12:00:00Z",
  },
];

// ============================================================
// CREATOR PROFILES
// ============================================================

export async function getCreatorProfile(userId: string): Promise<CreatorProfile | null> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("creator_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (!data) return null;
    return mapDbCreatorProfile(data);
  }
  return MOCK_CREATORS.find((c) => c.userId === userId) ?? null;
}

export async function getCreatorByDisplayName(name: string): Promise<CreatorProfile | null> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("creator_profiles")
      .select("*")
      .ilike("display_name", name)
      .single();
    if (!data) return null;
    return mapDbCreatorProfile(data);
  }
  return MOCK_CREATORS.find((c) => c.displayName.toLowerCase() === name.toLowerCase()) ?? null;
}

export async function getTopCreators(limit = 5): Promise<CreatorProfile[]> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("creator_profiles")
      .select("*")
      .order("follower_count", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapDbCreatorProfile);
  }
  return MOCK_CREATORS.slice(0, limit);
}

export async function getFeaturedCreators(limit = 5): Promise<CreatorProfile[]> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("creator_profiles")
      .select("*")
      .eq("is_featured", true)
      .order("follower_count", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapDbCreatorProfile);
  }
  return MOCK_CREATORS.filter((c) => c.isFeatured).slice(0, limit);
}

// ============================================================
// DISCUSSIONS
// ============================================================

export async function getProductDiscussions(productId: string): Promise<Discussion[]> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("discussions")
      .select("*, users(name, avatar_url)")
      .eq("product_id", productId)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("last_activity_at", { ascending: false });
    return (data ?? []).map(mapDbDiscussion);
  }
  return MOCK_DISCUSSIONS.filter((d) => d.productId === productId);
}

export async function getDiscussionWithReplies(discussionId: string): Promise<{
  discussion: Discussion | null;
  replies: DiscussionReply[];
}> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data: disc } = await db
      .from("discussions")
      .select("*, users(name, avatar_url)")
      .eq("id", discussionId)
      .single();
    const { data: replies } = await db
      .from("discussion_replies")
      .select("*, users(name, avatar_url)")
      .eq("discussion_id", discussionId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
    return {
      discussion: disc ? mapDbDiscussion(disc) : null,
      replies: (replies ?? []).map(mapDbReply),
    };
  }
  const discussion = MOCK_DISCUSSIONS.find((d) => d.id === discussionId) ?? null;
  return { discussion, replies: [] };
}

export async function getActiveDiscussions(limit = 5): Promise<Discussion[]> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("discussions")
      .select("*, users(name, avatar_url)")
      .is("deleted_at", null)
      .order("last_activity_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapDbDiscussion);
  }
  return MOCK_DISCUSSIONS.slice(0, limit);
}

// ============================================================
// TAGS
// ============================================================

export async function searchTags(query: string, limit = 10): Promise<Tag[]> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("tags")
      .select("*")
      .eq("is_approved", true)
      .ilike("name", `%${query}%`)
      .order("usage_count", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapDbTag);
  }
  return MOCK_TAGS.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, limit);
}

export async function getPopularTags(limit = 20): Promise<Tag[]> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("tags")
      .select("*")
      .eq("is_approved", true)
      .order("usage_count", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapDbTag);
  }
  return MOCK_TAGS.slice(0, limit);
}

// ============================================================
// ACTIVITY FEED
// ============================================================

export async function getPublicFeed(limit = 20): Promise<ActivityEvent[]> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("activity_events")
      .select("*, users(name, avatar_url)")
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapDbActivityEvent);
  }
  return MOCK_ACTIVITY.slice(0, limit);
}

export async function getUserFeed(userId: string, limit = 20): Promise<ActivityEvent[]> {
  if (isBackendConfigured()) {
    const db = getDb();
    // Get followed user IDs
    const { data: follows } = await db
      .from("follows")
      .select("target_id")
      .eq("follower_id", userId)
      .eq("target_type", "user");
    const followedIds = (follows ?? []).map((f) => f.target_id);
    if (followedIds.length === 0) return getPublicFeed(limit);

    const { data } = await db
      .from("activity_events")
      .select("*, users(name, avatar_url)")
      .in("actor_id", followedIds)
      .in("visibility", ["public", "followers"])
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapDbActivityEvent);
  }
  return MOCK_ACTIVITY.slice(0, limit);
}

// ============================================================
// FOLLOWS
// ============================================================

export async function getFollowState(
  followerId: string,
  targetType: "user" | "product" | "collection",
  targetId: string
): Promise<{ isFollowing: boolean }> {
  if (isBackendConfigured()) {
    const db = getDb();
    const { data } = await db
      .from("follows")
      .select("id")
      .eq("follower_id", followerId)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .single();
    return { isFollowing: !!data };
  }
  return { isFollowing: false };
}

// ============================================================
// MAPPERS
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbCreatorProfile(row: any): CreatorProfile {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name ?? "Unknown",
    bio: row.bio,
    avatarUrl: row.avatar_url,
    bannerUrl: row.banner_url,
    websiteUrl: row.website_url,
    twitterHandle: row.twitter_handle,
    githubHandle: row.github_handle,
    discordHandle: row.discord_handle,
    tagline: row.tagline,
    isFeatured: row.is_featured ?? false,
    productCount: row.product_count ?? 0,
    followerCount: row.follower_count ?? 0,
    followingCount: row.following_count ?? 0,
    totalSales: row.total_sales ?? 0,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbDiscussion(row: any): Discussion {
  return {
    id: row.id,
    productId: row.product_id,
    authorId: row.author_id,
    authorName: row.users?.name ?? "Anonymous",
    authorAvatar: row.users?.avatar_url ?? null,
    title: row.title,
    body: row.body,
    threadType: row.thread_type,
    isClosed: row.is_closed ?? false,
    isPinned: row.is_pinned ?? false,
    bestAnswerId: row.best_answer_id,
    replyCount: row.reply_count ?? 0,
    upvoteCount: row.upvote_count ?? 0,
    lastActivityAt: row.last_activity_at,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbReply(row: any): DiscussionReply {
  return {
    id: row.id,
    discussionId: row.discussion_id,
    parentReplyId: row.parent_reply_id,
    authorId: row.author_id,
    authorName: row.users?.name ?? "Anonymous",
    authorAvatar: row.users?.avatar_url ?? null,
    body: row.body,
    isBestAnswer: row.is_best_answer ?? false,
    upvoteCount: row.upvote_count ?? 0,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbTag(row: any): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    category: row.category ?? "other",
    usageCount: row.usage_count ?? 0,
    isApproved: row.is_approved ?? true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbActivityEvent(row: any): ActivityEvent {
  return {
    id: row.id,
    actorId: row.actor_id,
    actorName: row.users?.name ?? "Unknown",
    actorAvatar: row.users?.avatar_url ?? null,
    eventType: row.event_type,
    targetType: row.target_type,
    targetId: row.target_id,
    context: row.context ?? {},
    createdAt: row.created_at,
  };
}
```

- [ ] **Step 2: Update DAL barrel export**

Add to `src/lib/dal/index.ts`:

```typescript
export {
  getCreatorProfile,
  getCreatorByDisplayName,
  getTopCreators,
  getFeaturedCreators,
  getProductDiscussions,
  getDiscussionWithReplies,
  getActiveDiscussions,
  searchTags,
  getPopularTags,
  getPublicFeed,
  getUserFeed,
  getFollowState,
} from "./community";
```

- [ ] **Step 3: Verify typecheck**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/dal/community.ts src/lib/dal/index.ts
git commit -m "feat: add community DAL with mock fallback

Functions for: creator profiles, discussions, tags, activity feed,
follow state. All fall back to mock data when Supabase not configured."
```

---

## Task 4: Community Server Actions

**Files:**
- Create: `src/app/actions/community.ts`

- [ ] **Step 1: Create server actions**

```typescript
// src/app/actions/community.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { isBackendConfigured } from "@/lib/dal/config";

function getDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getClerkUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

async function getDbUser(clerkId: string) {
  const db = getDb();
  const { data } = await db.from("users").select("id").eq("clerk_id", clerkId).single();
  return data;
}

// ============================================================
// FOLLOW / UNFOLLOW
// ============================================================

export async function toggleFollow(
  targetType: "user" | "product" | "collection",
  targetId: string
): Promise<{ success: boolean; isFollowing: boolean; error?: string }> {
  if (!isBackendConfigured()) {
    return { success: true, isFollowing: true };
  }

  const clerkId = await getClerkUserId();
  if (!clerkId) return { success: false, isFollowing: false, error: "Not authenticated" };

  const user = await getDbUser(clerkId);
  if (!user) return { success: false, isFollowing: false, error: "User not found" };

  if (targetType === "user" && targetId === user.id) {
    return { success: false, isFollowing: false, error: "Cannot follow yourself" };
  }

  const db = getDb();
  const { data: existing } = await db
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();

  if (existing) {
    await db.from("follows").delete().eq("id", existing.id);
    return { success: true, isFollowing: false };
  }

  const { error } = await db.from("follows").insert({
    follower_id: user.id,
    target_type: targetType,
    target_id: targetId,
  });

  if (error) return { success: false, isFollowing: false, error: error.message };

  // Create activity event
  if (targetType === "user") {
    await db.from("activity_events").insert({
      actor_id: user.id,
      event_type: "user_followed",
      target_type: "user",
      target_id: targetId,
      context: {},
      visibility: "followers",
    });
  }

  return { success: true, isFollowing: true };
}

// ============================================================
// CREATE DISCUSSION
// ============================================================

export async function createDiscussion(input: {
  productId: string;
  title: string;
  body: string;
  threadType: string;
}): Promise<{ success: boolean; discussionId?: string; error?: string }> {
  if (!isBackendConfigured()) {
    return { success: true, discussionId: `mock-disc-${Date.now()}` };
  }

  const clerkId = await getClerkUserId();
  if (!clerkId) return { success: false, error: "Not authenticated" };

  const user = await getDbUser(clerkId);
  if (!user) return { success: false, error: "User not found" };

  if (input.title.length < 5 || input.title.length > 300) {
    return { success: false, error: "Title must be 5-300 characters" };
  }
  if (input.body.length < 10) {
    return { success: false, error: "Body must be at least 10 characters" };
  }

  const db = getDb();
  const { data, error } = await db
    .from("discussions")
    .insert({
      product_id: input.productId,
      author_id: user.id,
      title: input.title,
      body: input.body,
      thread_type: input.threadType,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  // Activity event
  const { data: product } = await db
    .from("products")
    .select("title")
    .eq("id", input.productId)
    .single();

  await db.from("activity_events").insert({
    actor_id: user.id,
    event_type: "new_discussion",
    target_type: "product",
    target_id: input.productId,
    context: {
      productTitle: product?.title ?? "",
      discussionTitle: input.title,
      threadType: input.threadType,
    },
  });

  return { success: true, discussionId: data.id };
}

// ============================================================
// REPLY TO DISCUSSION
// ============================================================

export async function replyToDiscussion(input: {
  discussionId: string;
  body: string;
  parentReplyId?: string;
}): Promise<{ success: boolean; replyId?: string; error?: string }> {
  if (!isBackendConfigured()) {
    return { success: true, replyId: `mock-reply-${Date.now()}` };
  }

  const clerkId = await getClerkUserId();
  if (!clerkId) return { success: false, error: "Not authenticated" };

  const user = await getDbUser(clerkId);
  if (!user) return { success: false, error: "User not found" };

  if (input.body.length < 5) {
    return { success: false, error: "Reply must be at least 5 characters" };
  }

  const db = getDb();
  const { data, error } = await db
    .from("discussion_replies")
    .insert({
      discussion_id: input.discussionId,
      parent_reply_id: input.parentReplyId ?? null,
      author_id: user.id,
      body: input.body,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, replyId: data.id };
}

// ============================================================
// VOTE ON DISCUSSION / REPLY
// ============================================================

export async function voteDiscussion(
  targetType: "discussion" | "reply",
  targetId: string,
  value: 1 | -1
): Promise<{ success: boolean; error?: string }> {
  if (!isBackendConfigured()) {
    return { success: true };
  }

  const clerkId = await getClerkUserId();
  if (!clerkId) return { success: false, error: "Not authenticated" };

  const user = await getDbUser(clerkId);
  if (!user) return { success: false, error: "User not found" };

  const db = getDb();

  // Check existing vote
  const { data: existing } = await db
    .from("discussion_votes")
    .select("id, value")
    .eq("user_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();

  if (existing) {
    if (existing.value === value) {
      // Remove vote (toggle off)
      await db.from("discussion_votes").delete().eq("id", existing.id);
    } else {
      // Change vote direction
      await db.from("discussion_votes").update({ value }).eq("id", existing.id);
    }
  } else {
    await db.from("discussion_votes").insert({
      user_id: user.id,
      target_type: targetType,
      target_id: targetId,
      value,
    });
  }

  // Recount upvotes
  const { count } = await db
    .from("discussion_votes")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("value", 1);

  const table = targetType === "discussion" ? "discussions" : "discussion_replies";
  await db.from(table).update({ upvote_count: count ?? 0 }).eq("id", targetId);

  return { success: true };
}

// ============================================================
// UPDATE CREATOR PROFILE
// ============================================================

export async function updateCreatorProfile(input: {
  bio?: string;
  tagline?: string;
  websiteUrl?: string;
  twitterHandle?: string;
  githubHandle?: string;
  discordHandle?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isBackendConfigured()) {
    return { success: true };
  }

  const clerkId = await getClerkUserId();
  if (!clerkId) return { success: false, error: "Not authenticated" };

  const user = await getDbUser(clerkId);
  if (!user) return { success: false, error: "User not found" };

  const db = getDb();

  // Upsert creator profile
  const { data: existing } = await db
    .from("creator_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const updates: Record<string, unknown> = {};
  if (input.bio !== undefined) updates.bio = input.bio;
  if (input.tagline !== undefined) updates.tagline = input.tagline;
  if (input.websiteUrl !== undefined) updates.website_url = input.websiteUrl;
  if (input.twitterHandle !== undefined) updates.twitter_handle = input.twitterHandle;
  if (input.githubHandle !== undefined) updates.github_handle = input.githubHandle;
  if (input.discordHandle !== undefined) updates.discord_handle = input.discordHandle;

  if (existing) {
    await db.from("creator_profiles").update(updates).eq("id", existing.id);
  } else {
    await db.from("creator_profiles").insert({
      user_id: user.id,
      ...updates,
    });
  }

  return { success: true };
}
```

- [ ] **Step 2: Verify typecheck**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/actions/community.ts
git commit -m "feat: add community server actions

Actions: toggleFollow, createDiscussion, replyToDiscussion,
voteDiscussion, updateCreatorProfile. All mock-safe."
```

---

## Task 5: Follow Button Component

**Files:**
- Create: `src/components/community/follow-button.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/community/follow-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { toggleFollow } from "@/app/actions/community";
import { toast } from "sonner";

interface FollowButtonProps {
  targetType: "user" | "product" | "collection";
  targetId: string;
  initialFollowing?: boolean;
  size?: "sm" | "default";
  className?: string;
}

export function FollowButton({
  targetType,
  targetId,
  initialFollowing = false,
  size = "sm",
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const result = await toggleFollow(targetType, targetId);
    setIsLoading(false);

    if (result.success) {
      setIsFollowing(result.isFollowing);
      toast.success(result.isFollowing ? "Following" : "Unfollowed");
    } else {
      toast.error(result.error || "Failed to update follow");
    }
  };

  return (
    <Button
      variant={isFollowing ? "secondary" : "default"}
      size={size}
      className={className}
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isFollowing ? (
        <>
          <UserCheck className="mr-1.5 h-3.5 w-3.5" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          Follow
        </>
      )}
    </Button>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/community/follow-button.tsx
git commit -m "feat: add FollowButton component with toggle + toast"
```

---

## Task 6: Discussion Thread Component

**Files:**
- Create: `src/components/community/discussion-card.tsx`
- Create: `src/components/community/discussion-thread.tsx`

- [ ] **Step 1: Create discussion card**

```tsx
// src/components/community/discussion-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ArrowUp, CheckCircle2, Bug, Lightbulb, Megaphone, FileText, Sparkles } from "lucide-react";
import type { Discussion, DiscussionType } from "@/types/community";

const typeConfig: Record<DiscussionType, { label: string; icon: typeof MessageSquare; color: string }> = {
  question: { label: "Question", icon: MessageSquare, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  bug: { label: "Bug", icon: Bug, color: "bg-red-500/10 text-red-400 border-red-500/20" },
  showcase: { label: "Showcase", icon: Sparkles, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  feature_request: { label: "Feature", icon: Lightbulb, color: "bg-green-500/10 text-green-400 border-green-500/20" },
  changelog: { label: "Changelog", icon: FileText, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  announcement: { label: "Announcement", icon: Megaphone, color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
};

interface DiscussionCardProps {
  discussion: Discussion;
  onClick?: () => void;
}

export function DiscussionCard({ discussion, onClick }: DiscussionCardProps) {
  const config = typeConfig[discussion.threadType];
  const TypeIcon = config.icon;
  const timeAgo = getTimeAgo(discussion.lastActivityAt);

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-border/50 bg-muted/20 p-4 text-left transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {discussion.authorName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-[10px] ${config.color}`}>
              <TypeIcon className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
            {discussion.bestAnswerId && (
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Answered
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm font-medium leading-tight line-clamp-1">
            {discussion.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {discussion.body}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{discussion.authorName}</span>
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" /> {discussion.upvoteCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {discussion.replyCount}
            </span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
```

- [ ] **Step 2: Create discussion thread (list + form)**

```tsx
// src/components/community/discussion-thread.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import { DiscussionCard } from "./discussion-card";
import { createDiscussion } from "@/app/actions/community";
import { toast } from "sonner";
import type { Discussion } from "@/types/community";

interface DiscussionThreadProps {
  productId: string;
  discussions: Discussion[];
}

export function DiscussionThread({ productId, discussions }: DiscussionThreadProps) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [threadType, setThreadType] = useState("question");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createDiscussion({
      productId,
      title,
      body,
      threadType,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Discussion created");
      setShowForm(false);
      setTitle("");
      setBody("");
      setThreadType("question");
    } else {
      toast.error(result.error || "Failed to create discussion");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {discussions.length} discussion{discussions.length !== 1 ? "s" : ""}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setShowForm(!showForm)}
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          New Discussion
        </Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="disc-title" className="text-xs">Title</Label>
                <Input
                  id="disc-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your question or topic?"
                  className="mt-1"
                  required
                  minLength={5}
                  maxLength={300}
                />
              </div>
              <div className="w-36">
                <Label className="text-xs">Type</Label>
                <Select value={threadType} onValueChange={setThreadType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="showcase">Showcase</SelectItem>
                    <SelectItem value="feature_request">Feature Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="disc-body" className="text-xs">Details</Label>
              <textarea
                id="disc-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Provide context, steps to reproduce, or describe your setup..."
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                required
                minLength={10}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Post Discussion
              </Button>
            </div>
          </form>
        </Card>
      )}

      {discussions.length > 0 ? (
        <div className="space-y-2">
          {discussions.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
          <MessageSquarePlus className="mx-auto h-8 w-8 text-muted-foreground/30" />
          <p className="mt-2 text-sm text-muted-foreground">No discussions yet</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Be the first to start a conversation</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify typecheck**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/community/discussion-card.tsx src/components/community/discussion-thread.tsx
git commit -m "feat: add DiscussionCard and DiscussionThread components

Q&A-style discussion UI with thread types (question, bug, showcase,
feature request), new discussion form, and empty state."
```

---

## Task 7: Creator Card Component

**Files:**
- Create: `src/components/community/creator-card.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/community/creator-card.tsx
"use client";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Package, TrendingUp } from "lucide-react";
import { FollowButton } from "./follow-button";
import type { CreatorProfile } from "@/types/community";

interface CreatorCardProps {
  creator: CreatorProfile;
  showFollowButton?: boolean;
}

export function CreatorCard({ creator, showFollowButton = true }: CreatorCardProps) {
  const profileUrl = `/profile/${encodeURIComponent(creator.displayName.toLowerCase().replace(/\s+/g, "-"))}`;

  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
      <div className="flex items-start gap-3">
        <Link href={profileUrl}>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-bold">
              {creator.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={profileUrl} className="text-sm font-semibold hover:underline truncate">
              {creator.displayName}
            </Link>
            {creator.isFeatured && (
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20">
                Featured
              </Badge>
            )}
          </div>
          {creator.tagline && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {creator.tagline}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {creator.followerCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {creator.productCount}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {creator.totalSales.toLocaleString()} sales
            </span>
          </div>
        </div>
        {showFollowButton && (
          <FollowButton targetType="user" targetId={creator.userId} size="sm" />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck and commit**

```bash
npx tsc --noEmit
git add src/components/community/creator-card.tsx
git commit -m "feat: add CreatorCard component with avatar, stats, follow"
```

---

## Task 8: Community Landing Sections

**Files:**
- Create: `src/components/landing/trending-section.tsx`
- Create: `src/components/landing/recent-activity-section.tsx`
- Create: `src/components/landing/top-creators-section.tsx`

- [ ] **Step 1: Create trending section**

```tsx
// src/components/landing/trending-section.tsx
"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/marketplace/product-card";
import { TrendingUp } from "lucide-react";
import { MOCK_PRODUCTS } from "@/constants/mock-data";

export function TrendingSection() {
  // Products sorted by downloads (trending proxy)
  const trending = [...MOCK_PRODUCTS]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 4);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Trending This Week</h2>
        </motion.div>
        <p className="mt-2 text-sm text-muted-foreground">
          Most downloaded and discussed AI configurations
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create recent activity section**

```tsx
// src/components/landing/recent-activity-section.tsx
"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Package, Star, MessageSquare, Sparkles,
} from "lucide-react";

const MOCK_ACTIVITY_ITEMS = [
  { actor: "Alex Chen", action: "published", target: "Cursor Rules v4", type: "new_product", icon: Package, time: "2h ago" },
  { actor: "Emma Wilson", action: "recommended", target: "MCP Server Pro", type: "badge", icon: Star, time: "4h ago" },
  { actor: "Marco Rossi", action: "started a discussion on", target: "N8N Automation Suite", type: "discussion", icon: MessageSquare, time: "5h ago" },
  { actor: "Lisa Tech", action: "shared how they use", target: "Windsurf Rules v3", type: "showcase", icon: Sparkles, time: "6h ago" },
  { actor: "Priya Sharma", action: "published", target: "React Mastery Skills", type: "new_product", icon: Package, time: "8h ago" },
];

export function RecentActivitySection() {
  return (
    <section className="border-t border-border/40 bg-muted/10 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold">Community Activity</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            See what developers are building and sharing
          </p>
        </motion.div>

        <div className="mt-8 space-y-3">
          {MOCK_ACTIVITY_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-lg border border-border/30 bg-background/50 px-4 py-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {item.actor.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{item.actor}</span>
                    {" "}{item.action}{" "}
                    <span className="font-medium text-primary">{item.target}</span>
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  <Icon className="mr-1 h-3 w-3" />
                  {item.time}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create top creators section**

```tsx
// src/components/landing/top-creators-section.tsx
"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CreatorCard } from "@/components/community/creator-card";
import { Users, ArrowRight } from "lucide-react";
import type { CreatorProfile } from "@/types/community";

const MOCK_TOP_CREATORS: CreatorProfile[] = [
  {
    id: "cp-1", userId: "s1", displayName: "Alex Chen",
    bio: "Full-stack developer specializing in AI-powered workflows.",
    avatarUrl: null, bannerUrl: null, websiteUrl: "https://alexchen.dev",
    twitterHandle: "alexchendev", githubHandle: "alexchen", discordHandle: null,
    tagline: "Building the future of AI development", isFeatured: true,
    productCount: 2, followerCount: 1247, followingCount: 89, totalSales: 4947,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cp-2", userId: "s5", displayName: "Emma Wilson",
    bio: "Enterprise software architect building tools for large teams.",
    avatarUrl: null, bannerUrl: null, websiteUrl: "https://emmawilson.tech",
    twitterHandle: "emmawilsontech", githubHandle: "emmawilson", discordHandle: null,
    tagline: "Enterprise AI at scale", isFeatured: true,
    productCount: 1, followerCount: 2340, followingCount: 156, totalSales: 4123,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cp-3", userId: "s3", displayName: "Marco Rossi",
    bio: "Automation expert with 10+ years in workflow design.",
    avatarUrl: null, bannerUrl: null, websiteUrl: "https://marcorossi.io",
    twitterHandle: null, githubHandle: "marcorossi", discordHandle: null,
    tagline: "Automate everything", isFeatured: false,
    productCount: 1, followerCount: 1890, followingCount: 234, totalSales: 3456,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

export function TopCreatorsSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Top Creators</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              The developers powering the AI configuration ecosystem
            </p>
          </div>
          <Link href="/marketplace" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-1.5">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TOP_CREATORS.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CreatorCard creator={creator} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify typecheck and commit**

```bash
npx tsc --noEmit
git add src/components/landing/trending-section.tsx src/components/landing/recent-activity-section.tsx src/components/landing/top-creators-section.tsx
git commit -m "feat: add community landing sections

TrendingSection, RecentActivitySection, TopCreatorsSection
for community-first homepage."
```

---

## Task 9: Redesign Homepage to Community-First

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Read current page**

Run: `Read src/app/[locale]/page.tsx` to confirm current imports and structure.

- [ ] **Step 2: Replace homepage with community-first layout**

Replace the full content of `src/app/[locale]/page.tsx` with:

```tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { TrendingSection } from "@/components/landing/trending-section";
import { RecentActivitySection } from "@/components/landing/recent-activity-section";
import { TopCreatorsSection } from "@/components/landing/top-creators-section";
import { CategoriesSection } from "@/components/landing/categories-section";
import { FeaturedSection } from "@/components/landing/featured-section";
import { CTASection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrendingSection />
        <RecentActivitySection />
        <CategoriesSection />
        <TopCreatorsSection />
        <FeaturedSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
```

This removes StatsSection (hardcoded numbers), TestimonialsSection (fake), HowItWorksSection (marketing) and replaces them with community-driven sections (trending, activity, creators).

- [ ] **Step 3: Verify typecheck and build**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit && npx next build`
Expected: No errors, all routes compile.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: redesign homepage to community-first layout

Replace marketing sections (stats, testimonials, how-it-works) with
community sections (trending, activity feed, top creators). Keep
hero, categories, featured, and CTA."
```

---

## Task 10: Add Discussions Tab to Product Detail Page

**Files:**
- Modify: `src/app/[locale]/marketplace/[slug]/page.tsx`

- [ ] **Step 1: Read current page structure**

Run: `Read src/app/[locale]/marketplace/[slug]/page.tsx` to find the Tabs section and understand the current tab structure (Description, Preview, Reviews).

- [ ] **Step 2: Add imports**

Add these imports to the top of the file (after existing imports):

```tsx
import { DiscussionThread } from "@/components/community/discussion-thread";
import { FollowButton } from "@/components/community/follow-button";
```

Add to the mock data section (after MOCK_REVIEWS filtering):

```tsx
const MOCK_DISCUSSIONS_FOR_PRODUCT: Discussion[] = product ? [
  {
    id: "d-1", productId: product.id, authorId: "u1", authorName: "John Developer", authorAvatar: null,
    title: "Does this work with the latest version?", body: "Just updated and some things seem different...",
    threadType: "question" as const, isClosed: false, isPinned: false, bestAnswerId: null,
    replyCount: 3, upvoteCount: 12, lastActivityAt: "2026-03-27T14:00:00Z", createdAt: "2026-03-25T10:00:00Z",
  },
  {
    id: "d-2", productId: product.id, authorId: "u2", authorName: "Lisa Tech", authorAvatar: null,
    title: "My team setup with this product", body: "We've been using this across a team of 12 developers...",
    threadType: "showcase" as const, isClosed: false, isPinned: false, bestAnswerId: null,
    replyCount: 8, upvoteCount: 24, lastActivityAt: "2026-03-28T09:00:00Z", createdAt: "2026-03-20T08:00:00Z",
  },
] : [];
```

Also add the import for Discussion type at the top:
```tsx
import type { Discussion } from "@/types/community";
```

- [ ] **Step 3: Add Discussions tab to the TabsList and TabsContent**

Find the existing `<TabsList>` and add a 4th tab trigger after "Reviews":

```tsx
<TabsTrigger value="discussions" className="gap-1.5">
  <MessageSquare className="h-3.5 w-3.5" />
  Discussions ({MOCK_DISCUSSIONS_FOR_PRODUCT.length})
</TabsTrigger>
```

Add the corresponding TabsContent after the Reviews TabsContent:

```tsx
<TabsContent value="discussions" className="mt-6">
  <DiscussionThread
    productId={product.id}
    discussions={MOCK_DISCUSSIONS_FOR_PRODUCT}
  />
</TabsContent>
```

- [ ] **Step 4: Add Follow button next to seller info in sidebar**

Find the seller card section in the sidebar and add a FollowButton below the seller name:

```tsx
<FollowButton targetType="user" targetId={product.sellerId} size="sm" />
```

- [ ] **Step 5: Verify typecheck**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add "src/app/[locale]/marketplace/[slug]/page.tsx"
git commit -m "feat: add Discussions tab and Follow button to product detail

Products now show a Discussions tab with Q&A-style threads and a
Follow button on the seller card in the sidebar."
```

---

## Task 11: Update Header Navigation for Community

**Files:**
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Read current header**

Run: `Read src/components/layout/header.tsx` to find the navLinks array and auth section.

- [ ] **Step 2: Add Feed link for signed-in users**

Find the `<Show when="signed-in">` section in the desktop nav. Add a Feed link before the Dashboard link:

```tsx
<Link href="/feed">
  <Button variant="ghost" size="sm">
    Feed
  </Button>
</Link>
```

Do the same in the mobile menu's `<Show when="signed-in">` section.

- [ ] **Step 3: Verify typecheck and commit**

```bash
npx tsc --noEmit
git add src/components/layout/header.tsx
git commit -m "feat: add Feed link to header for signed-in users"
```

---

## Task 12: Create Feed Page

**Files:**
- Create: `src/app/[locale]/feed/page.tsx`

- [ ] **Step 1: Create the feed page**

```tsx
// src/app/[locale]/feed/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import {
  Package, Star, MessageSquare, Sparkles, Rss, Users,
} from "lucide-react";

const MOCK_FEED = [
  { id: "1", actor: "Alex Chen", actorInitial: "A", action: "published a new product", target: "Cursor Rules v4", targetSlug: "cursor-rules-v4", type: "new_product", time: "2 hours ago" },
  { id: "2", actor: "Emma Wilson", actorInitial: "E", action: "recommended", target: "MCP Server Collection Pro", targetSlug: "mcp-server-collection-pro", type: "badge", time: "4 hours ago" },
  { id: "3", actor: "Marco Rossi", actorInitial: "M", action: "started a discussion on", target: "N8N AI Automation Suite", targetSlug: "n8n-ai-automation-suite", type: "discussion", time: "5 hours ago" },
  { id: "4", actor: "Lisa Tech", actorInitial: "L", action: "shared how they use", target: "Ultimate Windsurf Rules v3", targetSlug: "ultimate-windsurf-rules-v3", type: "showcase", time: "6 hours ago" },
  { id: "5", actor: "Priya Sharma", actorInitial: "P", action: "published a new product", target: "Windsurf Skills: React Mastery", targetSlug: "windsurf-skills-react-mastery", type: "new_product", time: "8 hours ago" },
  { id: "6", actor: "Yuki Tanaka", actorInitial: "Y", action: "verified", target: "Cursor Rules Enterprise Pack", targetSlug: "cursor-rules-enterprise-pack", type: "badge", time: "12 hours ago" },
  { id: "7", actor: "Dev Studios", actorInitial: "D", action: "updated", target: "AI Agent Starter Kit", targetSlug: "ai-agent-starter-kit", type: "update", time: "1 day ago" },
];

const iconMap: Record<string, typeof Package> = {
  new_product: Package,
  badge: Star,
  discussion: MessageSquare,
  showcase: Sparkles,
  update: Package,
};

export default function FeedPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/10">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <Rss className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">Your Feed</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Activity from creators and products you follow
            </p>
          </motion.div>

          <div className="mt-8 space-y-3">
            {MOCK_FEED.map((item, i) => {
              const Icon = iconMap[item.type] ?? Package;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="flex items-center gap-3 p-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {item.actorInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{item.actor}</span>
                        {" "}{item.action}{" "}
                        <Link
                          href={`/marketplace/${item.targetSlug}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {item.target}
                        </Link>
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px] gap-1">
                      <Icon className="h-3 w-3" />
                      {item.time}
                    </Badge>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg border border-dashed border-border/50 p-8 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground/30" />
            <p className="mt-2 text-sm text-muted-foreground">
              Follow more creators to see their activity here
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck and commit**

```bash
npx tsc --noEmit
git add src/app/[locale]/feed/page.tsx
git commit -m "feat: add activity feed page

Chronological feed showing activity from followed creators
with mock data. Links to product pages."
```

---

## Task 13: Create Creator Profile Page

**Files:**
- Create: `src/app/[locale]/profile/[username]/page.tsx`

- [ ] **Step 1: Create the profile page**

```tsx
// src/app/[locale]/profile/[username]/page.tsx
"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProductCard } from "@/components/marketplace/product-card";
import { FollowButton } from "@/components/community/follow-button";
import { MOCK_PRODUCTS } from "@/constants/mock-data";
import {
  Users, Package, TrendingUp, Globe, Github, Twitter,
  MapPin, Calendar, ExternalLink,
} from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ username: string; locale: string }>;
}

// Mock: map URL slug back to seller
const MOCK_PROFILES = [
  { slug: "alex-chen", sellerId: "s1", name: "Alex Chen", bio: "Full-stack developer specializing in AI-powered workflows and IDE configurations. Creator of Ultimate Windsurf Rules and Full Stack AI Dev Bundle.", tagline: "Building the future of AI development", website: "https://alexchen.dev", github: "alexchen", twitter: "alexchendev", location: "San Francisco, CA", followers: 1247, following: 89, sales: 4947, joined: "January 2026" },
  { slug: "emma-wilson", sellerId: "s5", name: "Emma Wilson", bio: "Enterprise software architect. Building tools for large-scale development teams. Cursor Rules Enterprise Pack creator.", tagline: "Enterprise AI at scale", website: "https://emmawilson.tech", github: "emmawilson", twitter: "emmawilsontech", location: "London, UK", followers: 2340, following: 156, sales: 4123, joined: "January 2026" },
  { slug: "marco-rossi", sellerId: "s3", name: "Marco Rossi", bio: "Automation expert with 10+ years in workflow design. N8N certified. Creator of the top-selling N8N AI Automation Suite.", tagline: "Automate everything", website: "https://marcorossi.io", github: "marcorossi", twitter: null, location: "Milan, Italy", followers: 1890, following: 234, sales: 3456, joined: "January 2026" },
];

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params);
  const profile = MOCK_PROFILES.find((p) => p.slug === username);

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Creator Not Found</h1>
            <p className="mt-2 text-muted-foreground">This profile doesn&apos;t exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const products = MOCK_PRODUCTS.filter((p) => p.sellerId === profile.sellerId);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-purple-600/20 sm:h-48" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl font-bold">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Verified Seller
                </Badge>
              </div>
              {profile.tagline && (
                <p className="mt-1 text-sm text-muted-foreground">{profile.tagline}</p>
              )}
            </div>
            <FollowButton targetType="user" targetId={profile.sellerId} />
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <strong className="text-foreground">{profile.followers.toLocaleString()}</strong> followers
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <strong className="text-foreground">{profile.following}</strong> following
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              <strong className="text-foreground">{products.length}</strong> products
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              <strong className="text-foreground">{profile.sales.toLocaleString()}</strong> sales
            </span>
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Joined {profile.joined}
            </span>
          </div>

          {/* Links */}
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Globe className="h-3.5 w-3.5" /> Website
                </Button>
              </a>
            )}
            {profile.github && (
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </Button>
              </a>
            )}
            {profile.twitter && (
              <a href={`https://x.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Twitter className="h-3.5 w-3.5" /> X
                </Button>
              </a>
            )}
          </div>

          {/* Bio + Products */}
          <Tabs defaultValue="products" className="mt-8">
            <TabsList>
              <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
              {products.length === 0 && (
                <div className="rounded-lg border border-dashed border-border/50 p-12 text-center">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground/30" />
                  <p className="mt-2 text-sm text-muted-foreground">No products yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card className="p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {profile.bio}
                </p>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="h-16" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck and commit**

```bash
npx tsc --noEmit
git add "src/app/[locale]/profile/[username]/page.tsx"
git commit -m "feat: add creator profile page

Profile with banner, avatar, stats, social links, follow button,
products tab, and about tab. Mock data for 3 creators."
```

---

## Task 14: Final Verification and Push

**Files:** None new — verification only.

- [ ] **Step 1: Full typecheck**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Full production build**

Run: `cd D:/RulesetMarketplace-master && npx next build`
Expected: All routes compile, including new routes: /feed, /profile/[username]

- [ ] **Step 3: Lint check**

Run: `cd D:/RulesetMarketplace-master && npx eslint src/ --max-warnings=100`
Expected: 0 errors (warnings OK).

- [ ] **Step 4: Push to remote**

```bash
git push origin master
```

Expected: All commits pushed to VelkinaStudio/RuleSell.

---

## Summary: What Phase 1 Delivers

After all 14 tasks:
- **Creator profiles** at `/profile/[username]` with follow, stats, products
- **Activity feed** at `/feed` with chronological event stream
- **Discussion threads** on every product detail page (Q&A, bug, showcase, feature request types)
- **Follow system** (follow creators, products) with toggle button
- **Open taxonomy** — 28 seed platform tags, community-driven additions
- **Community-first homepage** — trending products, activity feed, top creators replace marketing sections
- **Database schema** — 7 new tables with triggers for denormalized counters
- **DAL + server actions** — all mock-safe, ready for Supabase connection

**Next phase:** Phase 2 — Trust Layer (certified developers, product badges, reputation system)
