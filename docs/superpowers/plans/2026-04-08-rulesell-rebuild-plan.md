# RuleSell Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild RuleSell from the existing Next 16 foundation into a frontend-complete, market-ready global marketplace for AI dev assets, matching the approved design spec.

**Architecture:** Next 16 App Router + Tailwind v4 + shadcn/ui + framer-motion + next-intl. Frontend only, mocked backend via in-memory mock server honoring the exact API contract. Additive extension of the user-provided `Ruleset` schema with `variants[]`, `qualityScore`, `badges`, `maintainerClaim`, `team`, `scanResults`.

**Tech Stack:** Next 16.1.6, React 19, TypeScript 5, Tailwind v4, shadcn/ui (Radix primitives), framer-motion 12, next-intl 4, SWR for data fetching, zod for validation, lucide-react for icons.

**Source of truth:** `docs/superpowers/specs/2026-04-08-rulesell-rebuild-design.md`

**Research:** `docs/research/2026-04-08-*.md` (7 files)

---

## Phase overview

| # | Phase | Gate |
|---|---|---|
| 0 | Strip old code + safety snapshot | Clean tree, legacy on `legacy-pre-rebuild` branch |
| 1 | Types, constants, quality score logic | `tsc --noEmit` passes, unit tests for quality score |
| 2 | Mock API server + mock data | Unit tests for pagination, filtering, sorting |
| 3 | Design tokens + motion system + extended UI primitives | Storybook-free: visual check on `/dev/tokens` page |
| 4 | Providers + shared layout (header, footer, cookie banner, age gate) | Lighthouse a11y >= 95 on blank layout |
| 5 | Landing + tool picker + marketplace grid | Visual critique pass, 15s-to-install benchmark |
| 6 | Ruleset detail + variant tabs + install block + reviews | Copy-install works, variant switching works |
| 7 | Profiles (creator, team) + leaderboard + collections | Profile renders all role marks correctly |
| 8 | Dashboard (overview, rulesets, earnings, purchases, saved, reviews, settings) | Persona switcher shows gated UI correctly |
| 9 | Publishing wizard (5-step) | Draft auto-saves, submit transitions to PENDING_REVIEW |
| 10 | Legal pages + compliance UI (DSR, report, transparency, accessibility statement) | All 15 launch gates present |
| 11 | i18n sweep EN + TR, GPC middleware, dev persona switcher | Language switch works, GPC header honored |
| 12 | Motion polish pass, Lighthouse sweep, visual critique | All pages pass a11y + performance thresholds |

---

## Ground rules (apply to every task)

- **DRY, YAGNI.** Reject speculative abstractions. Three similar lines beat a premature helper.
- **Every page handles three states**: loading (skeleton), error (inline with retry), empty (contextual CTA).
- **Auth-gated UI checks `currentUserAccess`**, not `role`.
- **Prices in cents internally**, formatted on render.
- **No Redux/Zustand/CSS-in-JS.** SWR only. Tailwind only.
- **Every interactive element has hover/focus/active/disabled/loading/error states.**
- **Reduced-motion media query honored everywhere.**
- **Commit after every task.** Small commits, imperative subject lines.
- **Type-check with `npx tsc --noEmit` before committing.**
- **Lint with `npm run lint` before committing.**
- **All copy in `messages/en.json` and `messages/tr.json`** — never hardcode user-facing strings.

---

## Phase 0 — Strip old code + safety snapshot

### Task 0.1: Snapshot legacy on a branch

**Files:**
- None

- [ ] **Step 1: Commit any WIP**

Run: `cd D:/RulesetMarketplace-master && git status`
If dirty, commit with `git add -A && git commit -m "chore: pre-rebuild snapshot"`.

- [ ] **Step 2: Create safety branch**

Run: `git branch legacy-pre-rebuild`

- [ ] **Step 3: Verify branch exists**

Run: `git branch --list legacy-pre-rebuild`
Expected: `  legacy-pre-rebuild`

### Task 0.2: Delete old routes

**Files:**
- Delete recursively: `src/app/[locale]/{marketplace,dashboard,profile,certified,collections,feed,compare,seller,affiliate,admin,pricing,blog,docs,help,legal,contact,support,settings,notifications,auth}/`

- [ ] **Step 1: Remove old route directories**

Run:
```bash
cd D:/RulesetMarketplace-master/src/app/\[locale\]
rm -rf marketplace dashboard profile certified collections feed compare seller affiliate admin pricing blog docs help legal contact support settings notifications auth
ls
```
Expected: only `layout.tsx` and `page.tsx` remain.

- [ ] **Step 2: Commit**

Run: `git add -A && git commit -m "chore: remove legacy route pages"`

### Task 0.3: Delete old components, types, constants, DAL, actions

**Files:**
- Delete: `src/components/marketplace/`, `src/components/community/`, `src/components/landing/`
- Delete: `src/types/index.ts`, `src/types/community.ts`, `src/types/database.ts`
- Delete: `src/constants/mock-data.ts`
- Delete: `src/lib/dal/`, `src/app/actions/`
- Delete: `src/lib/marketplace-discovery.ts`, `src/lib/marketplace-ranking.ts`, `src/lib/product-evaluation.ts`, `src/lib/product-taxonomy.ts`
- Delete: `src/stores/` (legacy Zustand)
- Delete: `src/emails/` (legacy templates, not used in v1)

- [ ] **Step 1: Remove legacy source files**

Run:
```bash
cd D:/RulesetMarketplace-master/src
rm -rf components/marketplace components/community components/landing
rm -f types/index.ts types/community.ts types/database.ts
rm -f constants/mock-data.ts
rm -rf lib/dal app/actions
rm -f lib/marketplace-discovery.ts lib/marketplace-ranking.ts lib/product-evaluation.ts lib/product-taxonomy.ts
rm -rf stores emails
```

- [ ] **Step 2: Remove legacy shared components**

Run:
```bash
cd D:/RulesetMarketplace-master/src/components/shared
rm -f cart-sheet.tsx shared-state-panel.tsx
```
Keep: `clerk-wrapper.tsx`, `cookie-banner.tsx` (will be replaced), `language-switcher.tsx`, `theme-toggle.tsx`.

- [ ] **Step 3: Verify tsc fails loudly (expected, not a problem)**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit 2>&1 | head -20`
Expected: many "Cannot find module" errors. That's fine — the rest of the plan fixes them.

- [ ] **Step 4: Commit**

Run: `git add -A && git commit -m "chore: strip legacy components, types, dal, actions"`

### Task 0.4: Rewrite `src/app/[locale]/layout.tsx` to a minimal shell

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Replace layout with minimal shell**

Overwrite `src/app/[locale]/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "RuleSell — Verified AI development assets",
  description:
    "The verified marketplace for rules, MCP servers, skills, agents, and workflows. Curated quality, measured performance, and real creator payouts.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "tr")) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/[locale]/page.tsx` as a placeholder**

Overwrite with:

```tsx
export default function Placeholder() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-zinc-400">RuleSell rebuild in progress.</p>
    </main>
  );
}
```

- [ ] **Step 3: Start dev server and verify**

Run: `cd D:/RulesetMarketplace-master && npm run dev` in background.
Visit: `http://localhost:3000/en`
Expected: dark background, centered placeholder text.

- [ ] **Step 4: Commit**

Run: `git add -A && git commit -m "chore: minimal locale layout + placeholder page"`

---
## Phase 1 — Types, constants, quality score logic

**Goal:** Create the full type system matching section 5 of the spec exactly, plus the quality score calculator and reputation level helper. No UI yet. Must type-check cleanly.

### Task 1.1: Write `src/types/index.ts`

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Define enums**

Include in `src/types/index.ts` the following enums verbatim from spec section 5.1 and 5.2:
- `Platform` — 9 values: CURSOR, VSCODE, OBSIDIAN, N8N, MAKE, CLAUDE, CHATGPT, GEMINI, CUSTOM
- `Type` — 6 values: RULESET, PROMPT, WORKFLOW, AGENT, BUNDLE, DATASET
- `Role` — 3 values: USER, PRO, ADMIN
- `AccessLevel` — 7 values: PUBLIC, FREE_DOWNLOAD, PURCHASED, SUBSCRIPTION_ACTIVE, SUBSCRIPTION_EXPIRED, REFUNDED, AUTHOR
- `Status` — 5 values: DRAFT, PENDING_REVIEW, PUBLISHED, UNPUBLISHED, REMOVED
- `Category` — 9 values: RULES, MCP_SERVER, SKILL, AGENT_TEAM, WORKFLOW, PROMPT, CLI, DATASET, BUNDLE
- `Environment` — all 16 from spec
- `VariantKind` — all 12 from spec
- `InstallMethod` — 4 values: copy, download, command, json_snippet
- `ReputationLevel` — NEWCOMER, MEMBER, CONTRIBUTOR, TRUSTED, EXPERT, AUTHORITY
- `CreatorMark` — VERIFIED_CREATOR, TRADER, CERTIFIED_DEV, PRO, TEAM, MAINTAINER, TOP_RATED
- `ItemBadge` — VERIFIED, MAINTAINER_VERIFIED, EDITORS_PICK, QUALITY_A, QUALITY_B, QUALITY_C, POPULAR, UPDATED, NEW, OFFICIAL, FEATURED, LICENSE

- [ ] **Step 2: Define interfaces**

Add `RulesetAuthor`, `RulesetTeam`, `MaintainerClaim`, `QualityBreakdown`, `Variant`, `Ruleset`, `User`, `Review`, `Collection`, `Team`, `Page<T>`, `ApiError` exactly as spec sections 5.3-5.7. Add `Collection { id, slug, title, description, curatedBy, rulesetIds: string[], coverAsset?: string, itemCount, followerCount }` and `Team { slug, name, description, avatar, verified, memberCount, members, rulesetCount, totalEarnings }`.

- [ ] **Step 3: Type-check**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: no errors in `src/types/index.ts`. Errors elsewhere are still expected until Phase 2.

- [ ] **Step 4: Commit**

Run: `git add src/types/index.ts && git commit -m "feat(types): full ruleset + user + review type system"`

### Task 1.2: Constants — categories, environments, reputation, badges

**Files:**
- Create: `src/constants/categories.ts`
- Create: `src/constants/environments.ts`
- Create: `src/constants/reputation.ts`
- Create: `src/constants/badges.ts`

- [ ] **Step 1: Write `categories.ts`**

Export a `CATEGORY_META` record keyed by `Category` with `label`, `slug`, `color` (hex), `accent` (Tailwind color family), `icon` (lucide-react name). Colors per spec Appendix A:

| Category | Color | Accent | Icon |
|---|---|---|---|
| RULES | #3b82f6 | blue | Ruler |
| MCP_SERVER | #10b981 | emerald | Server |
| SKILL | #f59e0b | amber | Sparkles |
| AGENT_TEAM | #8b5cf6 | violet | Users |
| WORKFLOW | #f97316 | orange | Workflow |
| PROMPT | #ec4899 | pink | MessageSquare |
| CLI | #06b6d4 | cyan | Terminal |
| DATASET | #14b8a6 | teal | Database |
| BUNDLE | #f43f5e | rose | Package |

Also export `CATEGORY_ORDER: Category[]` matching the row order above.

- [ ] **Step 2: Write `environments.ts`**

Export an `ENVIRONMENT_META` record keyed by `Environment` with `label`, `slug`, `icon`, `family` (one of: claude, editor, agent, workflow, other). Group families:
- claude: claude-code, claude-desktop
- editor: cursor, windsurf, cline, continue, zed, codex, copilot
- agent: chatgpt, gemini-cli, aider
- workflow: n8n, make
- other: obsidian, custom

- [ ] **Step 3: Write `reputation.ts`**

Export `REPUTATION_THRESHOLDS` (NEWCOMER: 0, MEMBER: 15, CONTRIBUTOR: 50, TRUSTED: 150, EXPERT: 300, AUTHORITY: 500) and `reputationLevel(points: number): ReputationLevel` function that descends through thresholds.

- [ ] **Step 4: Write `badges.ts`**

Export `ITEM_BADGE_META` and `CREATOR_MARK_META` records with `label`, `tooltip`, `icon`, `accent` (Tailwind color) per badge/mark listed in spec section 4.

- [ ] **Step 5: Commit**

Run: `git add src/constants && git commit -m "feat(constants): category, environment, reputation, badge metadata"`

### Task 1.3: Quality score calculator

**Files:**
- Create: `src/lib/quality/score.ts`
- Create: `src/lib/quality/score.test.ts`

- [ ] **Step 1: Implement `qualityScore(breakdown)`**

File: `src/lib/quality/score.ts`
- Import `QualityBreakdown` from `@/types`
- Define fallback values: tokenEfficiency 70, installSuccess 80, schemaClean 75 (used when null)
- Formula per spec section 15:
  - `0.25 * token + 0.15 * install + 0.15 * schema + 0.15 * freshness + 0.20 * reviewScore + 0.10 * security`
  - security = 100 if `securityPass`, else 0
- Clamp to [0, 100], round to int
- Export `freshnessFromDays(daysSinceUpdate: number): number` — step decay: <=7 days → 100, <=30 → 90, <=90 → 75, <=180 → 55, <=365 → 30, else 10
- Export `qualityLetter(score: number): 'A' | 'B' | 'C' | null` — A >= 85, B >= 70, C >= 50, else null

- [ ] **Step 2: Write tests**

File: `src/lib/quality/score.test.ts` using vitest.
Cover: all fields present (happy path), null fields fall back, securityPass false drops score, freshness decay monotonic, letter cutoffs, output always 0-100.

- [ ] **Step 3: Run tests**

Run: `cd D:/RulesetMarketplace-master && npx vitest run src/lib/quality`
Expected: all green. If vitest not installed: `npm install -D vitest @vitest/ui` and add a `test` script to `package.json`.

- [ ] **Step 4: Commit**

Run: `git add src/lib/quality package.json package-lock.json && git commit -m "feat(quality): score calculator with fallbacks + tests"`

### Task 1.4: Type-check gate

- [ ] **Step 1: Run tsc**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: still errors from deleted imports elsewhere, but NO errors inside `src/types`, `src/constants`, or `src/lib/quality`.

- [ ] **Step 2: Record baseline error count**

Run: `npx tsc --noEmit 2>&1 | grep -c "error TS"`
Write the number to a scratch note. Must decrease monotonically across phases 2 through 12.

---

## Phase 2 — Mock API server + mock data

**Goal:** Build the in-memory mock layer so all subsequent UI work can be done against a real-shaped API. Honors the exact pagination and error contracts from spec section 5.7. All data lives in `src/constants/mock-data.ts` and is served via `src/lib/api/mock-server.ts`.

### Task 2.1: Seed mock data

**Files:**
- Create: `src/constants/mock-data.ts`
- Create: `src/constants/mock-users.ts`
- Create: `src/constants/mock-reviews.ts`
- Create: `src/constants/mock-teams.ts`
- Create: `src/constants/mock-collections.ts`

- [ ] **Step 1: Seed 20 users**

File: `src/constants/mock-users.ts`
Export `MOCK_USERS: User[]` with:
- 5 buyers: USER role, no builderStats
- 5 builders: USER role, builderStats with publishedCount 1-3, verifiedInstallCount 5-40, canSellPaid false
- 5 sellers: USER role, builderStats with verifiedInstallCount >= 50, canSellPaid true, sellerStats with traderVerified true, stripeConnectStatus verified, totalEarnings 5000-250000 cents
- 3 certified devs: USER role, creatorMarks includes CERTIFIED_DEV, reputation 200-800
- 2 team-owning maintainers: USER role, creatorMarks includes MAINTAINER and TEAM, maintainerRepos populated with real GitHub slugs

Use deterministic fake-IDs like `user-1` through `user-20`. All `isAdultConfirmed: true`, `countryOfResidence: 'US' | 'TR' | 'DE' | 'JP'`.

- [ ] **Step 2: Seed 5 teams**

File: `src/constants/mock-teams.ts`
Export `MOCK_TEAMS: Team[]` with 5 teams: Anthropic Skills, Modelcontext Labs, Windsurf Collective, N8N Community Hub, RuleSell Official. Each with 3-8 members drawn from MOCK_USERS, `verified: true`, realistic rulesetCount and totalEarnings.

- [ ] **Step 3: Seed 60 rulesets**

File: `src/constants/mock-data.ts`
Export `MOCK_RULESETS: Ruleset[]` — 60 items spread across all 9 categories and all 6 types. Start from the legacy 35 real GitHub repos (recover via git show legacy-pre-rebuild:src/constants/mock-data.ts) and add 25 new fixtures that exercise edge cases:
- 5 multi-variant rulesets (3+ variants covering 4+ environments)
- 3 team-authored (populate `team` field)
- 3 maintainer-claimed (populate `maintainerClaim`)
- 2 subscription-priced (paid + `currentUserAccess: SUBSCRIPTION_ACTIVE` for persona demos)
- 2 bundles (linking to 3+ other ruleset IDs in `tags`)
- Rest: mix of free + paid, varied Quality Scores (20-100), varied badges, varied avgRating

All prices in cents. All timestamps ISO-8601. Quality breakdown filled so the quality score calculator produces the stored `qualityScore`. Export `MOCK_RULESETS_BY_ID: Record<string, Ruleset>` and `MOCK_RULESETS_BY_SLUG: Record<string, Ruleset>` as lookup helpers.

- [ ] **Step 4: Seed 40 reviews**

File: `src/constants/mock-reviews.ts`
Export `MOCK_REVIEWS: Review[]`. Every review has `verifiedInstall: true` (spec says certified-only). Authors are drawn from the 3 certified devs + verified team members. Rating distribution: ~70% 5-star, ~20% 4-star, ~10% 3-star or less. `environmentTested` matches the ruleset's primary variant.

- [ ] **Step 5: Seed 8 collections**

File: `src/constants/mock-collections.ts`
Export `MOCK_COLLECTIONS: Collection[]`. Themes: "MCP Starter Pack", "Cursor Power Tools", "Agent Team Builder", "N8N Automation Bundle", "Claude Code Essentials", "Security-First Workflows", "New This Month", "Editors Picks". Each links 6-12 rulesets by ID.

- [ ] **Step 6: Commit**

Run: `git add src/constants && git commit -m "feat(mock): seed 60 rulesets, 20 users, 5 teams, 40 reviews, 8 collections"`

### Task 2.2: Build mock API server

**Files:**
- Create: `src/lib/api/mock-server.ts`
- Create: `src/lib/api/types.ts`
- Create: `src/lib/api/mock-server.test.ts`

- [ ] **Step 1: Query params type**

File: `src/lib/api/types.ts`
Export `RulesetQuery` type:
```
{
  q?: string;
  platform?: Platform;
  type?: Type;
  category?: Category;
  environment?: Environment;
  price?: 'free' | 'paid';
  authorId?: string;
  tab?: 'top' | 'trending' | 'new' | 'editors';
  sort?: 'quality' | 'popular' | 'recent' | 'price_asc' | 'price_desc';
  page?: number;
  pageSize?: number;
}
```

- [ ] **Step 2: Implement listRulesets**

File: `src/lib/api/mock-server.ts`
Export `listRulesets(query: RulesetQuery): Page<Ruleset>`.
- Default pageSize 24, max 50
- Filter by each query field (case-insensitive substring for `q` across title/description/tags)
- `tab=top` sorts by qualityScore desc
- `tab=trending` sorts by purchaseCount + downloadCount / age
- `tab=new` sorts by createdAt desc
- `tab=editors` filters to badges including `EDITORS_PICK`
- `price=free` filters price 0, `price=paid` filters price > 0
- `sort` overrides tab sort when present
- Returns `Page<Ruleset>` with `pagination` populated and `hasNext`/`hasPrev` computed

- [ ] **Step 3: Implement remaining endpoints**

Export:
- `getRulesetBySlug(slug: string): Ruleset | ApiError`
- `getRulesetById(id: string): Ruleset | ApiError`
- `getUserByUsername(username: string): User | ApiError`
- `getTeamBySlug(slug: string): Team | ApiError`
- `listReviews(rulesetId: string, page?: number): Page<Review>`
- `listCollections(): Collection[]`
- `getCollectionBySlug(slug: string): Collection | ApiError`
- `getLeaderboard(limit?: number): User[]` — top N by reputation desc
- `getAnalyticsOverview(userId: string): { totalRulesets, totalInstalls, totalRevenue, last30dInstalls }`

All return values mirror spec contracts. On not-found, return `ApiError` with `code: 'NOT_FOUND'`.

- [ ] **Step 4: Write tests**

File: `src/lib/api/mock-server.test.ts`
Cases:
- Pagination: page 1 returns 24 items with hasPrev false; page 3 with pageSize 20 returns correct slice
- Filters combine: `category=MCP_SERVER&price=paid` returns only paid MCP servers
- Sort: `tab=top` returns items sorted by qualityScore desc, ties broken deterministically
- Search: `q=mcp` is case-insensitive and matches title/description/tags
- Not found: `getRulesetBySlug('does-not-exist')` returns ApiError with code NOT_FOUND

- [ ] **Step 5: Run tests**

Run: `cd D:/RulesetMarketplace-master && npx vitest run src/lib/api`
Expected: all green.

- [ ] **Step 6: Commit**

Run: `git add src/lib/api && git commit -m "feat(api): mock server with pagination, filtering, sorting + tests"`

### Task 2.3: Wire SWR fetcher

**Files:**
- Create: `src/lib/api/fetcher.ts`
- Create: `src/hooks/use-rulesets.ts`
- Create: `src/hooks/use-ruleset.ts`
- Create: `src/hooks/use-user.ts`
- Create: `src/hooks/use-collections.ts`

- [ ] **Step 1: Install SWR if missing**

Run: `cd D:/RulesetMarketplace-master && npm list swr || npm install swr@latest`

- [ ] **Step 2: Write fetcher that delegates to mock-server**

File: `src/lib/api/fetcher.ts`
Implements a `fetcher(key: string | readonly [string, Record<string, unknown>])` that parses the key and dispatches to the correct `mock-server` function. Wraps results in a microtask delay (30-80ms random) to simulate network.

- [ ] **Step 3: Write SWR hooks**

Each hook returns `{ data, error, isLoading, mutate }` and uses a stable SWR key.
- `useRulesets(query)` → list endpoint
- `useRuleset(slug)` → detail endpoint
- `useUser(username)` → user endpoint
- `useCollections()` / `useCollection(slug)`
- `useLeaderboard(limit)`
- `useAnalyticsOverview()`

- [ ] **Step 4: Commit**

Run: `git add src/lib/api src/hooks package.json package-lock.json && git commit -m "feat(hooks): SWR wrappers over mock server"`

### Task 2.4: Gate — type-check + tests

- [ ] **Step 1: Full tsc**

Run: `npx tsc --noEmit`
Expected: count must be lower than the Phase 1 baseline.

- [ ] **Step 2: Full vitest**

Run: `npx vitest run`
Expected: all green.

---

## Phase 3 — Design tokens, motion system, extended UI primitives

**Goal:** Lock the visual system (colors, type scale, spacing, radii, shadows, motion) and extend shadcn primitives. Everything downstream consumes these tokens. A `/dev/tokens` preview page lets us visually sanity-check the system in isolation.

### Task 3.1: Tailwind v4 token layer

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Define CSS custom properties**

In `src/styles/tokens.css`, declare CSS variables under `:root` (and `[data-theme=light]` if we later add a light theme — v1 is dark-first):
- Surface: `--bg` #09090b, `--bg-surface` #18181b, `--bg-raised` #27272a, `--bg-elevated` #3f3f46
- Text: `--fg` #fafafa, `--fg-muted` #a1a1aa, `--fg-subtle` #71717a
- Border: `--border` #27272a, `--border-strong` #3f3f46
- Brand accent: `--brand` #ffd166, `--brand-fg` #18181b
- Category accents (9 vars): `--cat-rules`, `--cat-mcp`, `--cat-skill`, `--cat-agent`, `--cat-workflow`, `--cat-prompt`, `--cat-cli`, `--cat-dataset`, `--cat-bundle`
- Status: `--success` #22c55e, `--warning` #f59e0b, `--danger` #ef4444, `--info` #3b82f6
- Radii: `--radius-sm` 6px, `--radius-md` 10px, `--radius-lg` 14px, `--radius-xl` 20px
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow-brand`
- Motion: `--duration-fast` 150ms, `--duration-base` 240ms, `--duration-slow` 400ms, `--ease-out` cubic-bezier(0.16, 1, 0.3, 1), `--ease-spring` cubic-bezier(0.34, 1.56, 0.64, 1)

- [ ] **Step 2: Import tokens in `globals.css`**

Prepend `@import "../styles/tokens.css";` and add a `@layer base` block that applies `--bg` and `--fg` to `html, body` and the reduced-motion media query that sets all `--duration-*` to `0.01ms`.

- [ ] **Step 3: Tailwind v4 theme config**

In `globals.css`, use Tailwind v4 `@theme` block to map tokens to utility classes:
```
@theme {
  --color-bg: var(--bg);
  --color-surface: var(--bg-surface);
  --color-brand: var(--brand);
  ...
}
```

- [ ] **Step 4: Commit**

Run: `git add src/app/globals.css src/styles && git commit -m "feat(tokens): Tailwind v4 token layer with category accents + motion vars"`

### Task 3.2: Motion system

**Files:**
- Create: `src/lib/motion/variants.ts`
- Create: `src/lib/motion/transitions.ts`
- Create: `src/components/motion/fade-in.tsx`
- Create: `src/components/motion/scroll-reveal.tsx`
- Create: `src/components/motion/stagger.tsx`

- [ ] **Step 1: Framer-motion install check**

Run: `npm list framer-motion || npm install framer-motion@latest`

- [ ] **Step 2: Shared transitions**

File: `src/lib/motion/transitions.ts`
Export named transitions:
- `softOut`: duration 0.24, ease `[0.16, 1, 0.3, 1]`
- `spring`: type spring, stiffness 320, damping 26
- `snap`: duration 0.12, ease linear
- `pageFade`: duration 0.3, ease softOut

- [ ] **Step 3: Reusable variants**

File: `src/lib/motion/variants.ts`
Export:
- `fadeInUp` — initial `{ opacity: 0, y: 12 }`, animate `{ opacity: 1, y: 0 }`
- `fadeIn` — opacity only
- `cardHover` — whileHover `{ y: -2 }` with shadow class swap
- `pressBounce` — whileTap `{ scale: 0.96 }`, spring transition
- `pillBounce` — whileTap `{ scale: 1.08 }`, spring
- `staggerContainer` — staggerChildren 0.05, delayChildren 0.1

- [ ] **Step 4: FadeIn component**

File: `src/components/motion/fade-in.tsx`
Client component `FadeIn` that wraps children in `motion.div` with `fadeInUp` variant, `viewport={{ once: true, amount: 0.3 }}`, and honors reduced-motion by skipping animation when `prefers-reduced-motion` is set.

- [ ] **Step 5: ScrollReveal + Stagger**

`ScrollReveal` — same as FadeIn but triggers on inView.
`Stagger` — wraps children in `motion.div` with `staggerContainer` and maps children to `motion.div` children with `fadeInUp`.

- [ ] **Step 6: Commit**

Run: `git add src/lib/motion src/components/motion package.json package-lock.json && git commit -m "feat(motion): transitions, variants, FadeIn / ScrollReveal / Stagger"`

### Task 3.3: Extended UI primitives

**Files:**
- Verify existing shadcn primitives cover Button, Input, Card, Badge, Dialog, Tabs, Select, Checkbox, RadioGroup, Switch, Tooltip, DropdownMenu, Avatar, Skeleton, Separator, Command (cmdk), Sheet, Toast (Sonner)
- Create missing ones with `npx shadcn@latest add <name>` as needed
- Create: `src/components/ui/quality-bar.tsx`
- Create: `src/components/ui/badge-stack.tsx`
- Create: `src/components/ui/copy-button.tsx`
- Create: `src/components/ui/empty-state.tsx`
- Create: `src/components/ui/error-state.tsx`
- Create: `src/components/ui/loading-skeleton.tsx`
- Create: `src/components/ui/category-chip.tsx`
- Create: `src/components/ui/reputation-badge.tsx`

- [ ] **Step 1: Audit existing shadcn components**

Run: `ls src/components/ui`
Confirm the list above. For any missing, run `npx shadcn@latest add <name>` one by one.

- [ ] **Step 2: QualityBar**

`QualityBar` props: `score: number`, `label?: string`, `compact?: boolean`. Renders a horizontal bar with gradient fill from red to amber to green based on score. Animates from 0 to value on mount using framer-motion. A-grade (>=85) gets the brand amber-gold accent.

- [ ] **Step 3: BadgeStack**

`BadgeStack` props: `badges: ItemBadge[]`, `limit?: number`. Renders stackable badges with tooltips from `ITEM_BADGE_META`. Staggers in on mount.

- [ ] **Step 4: CopyButton**

`CopyButton` props: `text: string`, `label?: string`. Clicking copies to clipboard, morphs icon from Copy to Check, triggers a tiny confetti burst (canvas-confetti or CSS sparkles — prefer CSS for footprint). Accessible: aria-live announces "Copied".

- [ ] **Step 5: EmptyState, ErrorState, LoadingSkeleton**

- `EmptyState` — `icon`, `title`, `description`, optional `action` (Button). Small illustrated mascot slot (SVG inline).
- `ErrorState` — `title`, `message`, `retry?: () => void`. Uses ApiError shape.
- `LoadingSkeleton` variants: `card`, `list-row`, `hero`, `detail`.

- [ ] **Step 6: CategoryChip**

`CategoryChip` props: `category: Category`, `active?: boolean`, `onClick?`. Uses `CATEGORY_META[category]` for color and icon. Active state uses category accent as border and background tint.

- [ ] **Step 7: ReputationBadge**

`ReputationBadge` props: `level: ReputationLevel`, `points: number`. Renders level label + point count with color tied to level.

- [ ] **Step 8: Commit**

Run: `git add src/components/ui && git commit -m "feat(ui): QualityBar, BadgeStack, CopyButton, EmptyState, ErrorState, LoadingSkeleton, CategoryChip, ReputationBadge"`

### Task 3.4: `/dev/tokens` preview page

**Files:**
- Create: `src/app/[locale]/dev/tokens/page.tsx`

- [ ] **Step 1: Build a visual inventory page**

Shows:
- Surface colors as swatches with labels
- Text tokens with contrast ratios annotated
- Category accents as chips
- Type scale (display, h1-h6, body, small)
- Radii (rounded boxes)
- Shadows
- Motion demos (click buttons to trigger fadeInUp, pressBounce, pillBounce)
- All extended UI primitives in isolation

- [ ] **Step 2: Visual check in browser**

Run: `npm run dev` in background.
Visit: `http://localhost:3000/en/dev/tokens`
Screenshot via Chrome DevTools MCP. Critique: does every token feel deliberate, does motion feel soft not jittery, does the brand amber stand out without clashing with category accents. Iterate until it passes the swap test.

- [ ] **Step 3: Commit**

Run: `git add src/app/\[locale\]/dev && git commit -m "feat(dev): tokens preview page for visual sanity checks"`

### Task 3.5: Phase gate

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit`
Expected: error count strictly less than Phase 2 baseline.

- [ ] **Step 2: Lighthouse on /dev/tokens**

Run Chrome DevTools MCP Lighthouse audit on `/en/dev/tokens`.
Expected: Accessibility >= 95, Performance >= 90.

---

## Phase 4 — Providers, shared layout, cookie banner, age gate

**Goal:** Establish the outer chrome of every page — providers (theme, SWR, next-intl, mock auth), header, footer, cookie banner, and the 18+ age-gate flow. All pages from Phase 5 onward slot into this shell.

### Task 4.1: Providers

**Files:**
- Create: `src/components/providers/providers.tsx`
- Create: `src/components/providers/swr-provider.tsx`
- Create: `src/components/providers/auth-provider.tsx`
- Create: `src/components/providers/theme-provider.tsx`
- Create: `src/lib/auth/mock-session.ts`
- Create: `src/hooks/use-session.ts`

- [ ] **Step 1: Mock NextAuth-shaped session**

File: `src/lib/auth/mock-session.ts`
Export:
- `type Session = { user: User | null; expires: string }`
- `getMockSession(persona: 'visitor' | 'user' | 'pro' | 'builder' | 'seller' | 'certified' | 'maintainer' | 'admin'): Session`
- Seeds the session from the matching user in `MOCK_USERS`. `visitor` returns `{ user: null, expires: ... }`.
- Persists persona selection to `localStorage` under `rulesell:dev-persona`.

- [ ] **Step 2: useSession hook**

File: `src/hooks/use-session.ts`
Export `useSession(): { data: Session; status: 'authenticated' | 'unauthenticated' | 'loading' }` that matches the NextAuth.js shape. Reads persona from localStorage (client) and returns the mocked session.

- [ ] **Step 3: Providers component**

File: `src/components/providers/providers.tsx`
Composes:
- `SWRProvider` with global config: `revalidateOnFocus: false`, `dedupingInterval: 5000`, `fetcher` from `@/lib/api/fetcher`
- `ThemeProvider` (next-themes in dark-only mode for v1 — light mode deferred)
- `AuthProvider` — wraps `useSession` state via React context
- `Toaster` from sonner
- `TooltipProvider` from Radix

- [ ] **Step 4: Wire providers into root layout**

Modify: `src/app/[locale]/layout.tsx`
Wrap `<NextIntlClientProvider>` contents with `<Providers>`. Keep the minimal shell otherwise.

- [ ] **Step 5: Commit**

Run: `git add src/components/providers src/lib/auth src/hooks/use-session.ts src/app/\[locale\]/layout.tsx && git commit -m "feat(providers): SWR, theme, mock auth session, toaster"`

### Task 4.2: Header

**Files:**
- Create: `src/components/shared/header.tsx`
- Create: `src/components/shared/search-bar.tsx`
- Create: `src/components/shared/nav-menu.tsx`
- Create: `src/components/shared/user-menu.tsx`
- Modify: `src/components/shared/language-switcher.tsx` (keep, polish)

- [ ] **Step 1: Header layout**

Sticky top. Left: `RuleSell` wordmark (brand amber for the R, rest white). Center: primary nav — `Browse`, `Collections`, `Leaderboard`, `Sell`. Right: `SearchBar` (expandable on click), `LanguageSwitcher`, `UserMenu` or `Sign in` button.

Height 64px. Backdrop blur when scrolled. Border-bottom subtle. Sticky.

- [ ] **Step 2: SearchBar**

Expands from icon to full input on click (cmdk-style). Hitting Enter routes to `/search?q=...`. Keyboard shortcut `/` focuses it globally (via shared keydown listener).

- [ ] **Step 3: NavMenu**

`Browse` is a dropdown with: All, Trending, New, Top, Free, Paid, then a divider, then category links from `CATEGORY_ORDER`. Uses shadcn `DropdownMenu`.

- [ ] **Step 4: UserMenu**

Avatar + dropdown. Signed in: Dashboard, Profile, Saved, Settings, Sign out. Signed out: `Sign in` button (primary brand amber).

- [ ] **Step 5: Commit**

Run: `git add src/components/shared && git commit -m "feat(header): sticky nav with search, category dropdown, user menu"`

### Task 4.3: Footer

**Files:**
- Create: `src/components/shared/footer.tsx`

- [ ] **Step 1: Four-column footer**

Columns:
1. **Product** — Browse, Collections, Leaderboard, MCP, Rules, Skills
2. **Creators** — Sell, Creator Agreement, Quality Guidelines, Docs
3. **Company** — About, Blog, Changelog, Contact
4. **Legal** — Terms, Privacy, Cookies, Acceptable Use, DMCA, Accessibility, Transparency

Bottom row: copyright, language switcher, `Sec-GPC` respect statement, sanction geo-block statement.

- [ ] **Step 2: Commit**

Run: `git add src/components/shared/footer.tsx && git commit -m "feat(footer): 4-column with legal row + GPC statement"`

### Task 4.4: Cookie banner (DSA/GDPR compliant)

**Files:**
- Create: `src/components/compliance/cookie-banner.tsx`
- Create: `src/hooks/use-cookie-consent.ts`

- [ ] **Step 1: Consent state**

`use-cookie-consent` reads and writes `localStorage` key `rulesell:consent` with shape `{ essential: true, analytics: boolean, ads: boolean, personalization: boolean, timestamp: string, version: '1.0' }`.

- [ ] **Step 2: Banner UI**

Equal-weight buttons (same size, same color): `Accept all`, `Reject all`, `Customize`. Appears at bottom-center of viewport, dismissable with visible `X`. Does NOT block the page. Honors `Sec-GPC: 1` (if present, pre-fills all non-essential to false and shows minimized bar).

- [ ] **Step 3: Customize dialog**

Shadcn Dialog with 4 toggles (essential locked on). Save closes dialog and persists consent. Logs a `consent_event` to a mock list in localStorage (for transparency page).

- [ ] **Step 4: Mount in root layout**

Modify: `src/app/[locale]/layout.tsx`
Add `<CookieBanner />` inside Providers, above footer.

- [ ] **Step 5: Commit**

Run: `git add src/components/compliance src/hooks/use-cookie-consent.ts src/app/\[locale\]/layout.tsx && git commit -m "feat(compliance): cookie banner with GPC support and customize dialog"`

### Task 4.5: Age gate

**Files:**
- Create: `src/components/compliance/age-gate.tsx`
- Create: `src/lib/compliance/sanctions.ts`

- [ ] **Step 1: Sanctions list**

File: `src/lib/compliance/sanctions.ts`
Export `SANCTIONED_COUNTRIES: string[]` = ISO codes for Cuba (CU), Iran (IR), North Korea (KP), Syria (SY), Crimea (RU-CR placeholder), DNR, LNR. Export `isSanctioned(countryCode: string): boolean`.

- [ ] **Step 2: AgeGate component**

Dialog shown on `/signup` only. Fields: date of birth (date input), country (select). Validates:
- Age >= 18 (throw if not)
- Country not in `SANCTIONED_COUNTRIES` (throw if is)
On success sets `isAdultConfirmed` and `countryOfResidence` on the mock user.

- [ ] **Step 3: Commit**

Run: `git add src/components/compliance/age-gate.tsx src/lib/compliance && git commit -m "feat(compliance): 18+ age gate with sanctioned-country block"`

### Task 4.6: Mount header + footer in shell

**Files:**
- Create: `src/app/[locale]/(public)/layout.tsx`

- [ ] **Step 1: Public layout**

Wraps children with `<Header />`, `<main>`, `<Footer />`. Used by all public routes from Phase 5 onward.

- [ ] **Step 2: Commit**

Run: `git add src/app/\[locale\]/\(public\) && git commit -m "feat(layout): public route group layout with header + footer"`

### Task 4.7: Phase gate

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit`
Expected: error count strictly less than Phase 3 baseline.

- [ ] **Step 2: Lighthouse sweep**

Visit `/en` (placeholder) in dev server. Run Chrome DevTools MCP Lighthouse audit.
Expected: Accessibility >= 95.

- [ ] **Step 3: Keyboard sweep**

Tab through header, footer, cookie banner. Every element must have a visible focus ring. Skip links from top jump to `#main`.

---

## Phase 5 — Landing + tool picker + marketplace grid

**Goal:** Build the fused landing/marketplace page at `/` and the full `/browse` sibling. The landing page must get a user from arrival to first install candidate in under 15 seconds.

### Task 5.1: Tool picker + preferredEnvironments

**Files:**
- Create: `src/components/marketplace/tool-picker.tsx`
- Create: `src/hooks/use-preferred-environments.ts`

- [ ] **Step 1: usePreferredEnvironments hook**

Reads/writes `Environment[]` to localStorage under `rulesell:preferred-envs` (for guests) or to `user.preferredEnvironments` (when authenticated — via mock session update). Exposes `toggle(env)`, `clear()`, `set(envs)`.

- [ ] **Step 2: ToolPicker component**

Horizontal pill strip. Each pill shows environment icon + label, clickable to toggle. Active state: filled with brand amber, brand-fg text. Keyboard-navigable with arrow keys. Click triggers `pillBounce` variant from Phase 3.

Includes a `Skip` / `See all` pill at the end.

Shows 8 primary environments on first render (claude-code, cursor, windsurf, cline, codex, chatgpt, gemini-cli, n8n). `See all` expands to all 16.

- [ ] **Step 3: Commit**

Run: `git add src/components/marketplace/tool-picker.tsx src/hooks/use-preferred-environments.ts && git commit -m "feat(marketplace): tool picker with preferred-environments persistence"`

### Task 5.2: RulesetCard

**Files:**
- Create: `src/components/marketplace/ruleset-card.tsx`

- [ ] **Step 1: Card layout**

Compact dense card (npm-style, not SaaS-style):
- Left: category icon in category accent color, 44px square with rounded-md background
- Center: title (bold), byline (`@author`, team mark if present), description (2-line clamp), tag row
- Right: `QualityBar` (compact), price (`Free` or `$19`), install count
- Badges stack on top-right corner
- Hover: `cardHover` variant + subtle glow in category color

- [ ] **Step 2: Install-ready state**

Cards badge the primary variant environment. If user has `preferredEnvironments` and the card has a matching variant, show a small green dot and "Works with your tools" label.

- [ ] **Step 3: Commit**

Run: `git add src/components/marketplace/ruleset-card.tsx && git commit -m "feat(marketplace): RulesetCard with category accent, badges, install-ready hint"`

### Task 5.3: Shelf (numbered section)

**Files:**
- Create: `src/components/marketplace/shelf.tsx`

- [ ] **Step 1: Shelf layout**

Per spec section 8.1, each section is prefixed with `01 /`, `02 /`, etc. Uses a large display number in muted color on the left, section title on the right, then a horizontally-scrolling row of cards below. "See all →" link to a filtered `/browse` view.

- [ ] **Step 2: Props**

`Shelf { index: string; title: string; description?: string; rulesets: Ruleset[]; href: string }`. Renders `Stagger` wrapping cards for entrance animation.

- [ ] **Step 3: Commit**

Run: `git add src/components/marketplace/shelf.tsx && git commit -m "feat(marketplace): numbered Shelf section component"`

### Task 5.4: Landing page `/`

**Files:**
- Create: `src/app/[locale]/(public)/page.tsx`
- Modify existing `src/app/[locale]/page.tsx` to redirect or replace

- [ ] **Step 1: Hero section**

Headline: "Stop writing rulesets from scratch." Subhead: "Verified assets for AI-assisted development." Search bar (expanded, prominent). ToolPicker strip below. Reduced motion friendly.

- [ ] **Step 2: Shelves**

Fetch via SWR:
- Shelf 01 — "TOP FOR YOU" — `useRulesets({ tab: 'top', environment: primaryPreferred })` or default to `{ tab: 'top' }` for guests
- Shelf 02 — "EDITORS PICKS" — `useRulesets({ tab: 'editors' })`
- Shelf 03 — "NEW THIS WEEK" — `useRulesets({ tab: 'new' })`
- Shelf 04 — "COLLECTIONS" — `useCollections()` (different card type, larger tiles)

Each shelf shows 8 items with horizontal scroll.

- [ ] **Step 3: Loading + error + empty states**

- Loading — skeleton shelves (4 of them)
- Error — inline error block with retry
- Empty — never happens for seeded data, but handle gracefully

- [ ] **Step 4: 15-second benchmark**

In the dev tools Performance tab, measure time from page start to first card render. Target: card visible within 1.5s on local, 3s on simulated slow 3G. Install flow reachable (one click to detail, one click to copy) within 15s total.

- [ ] **Step 5: Visual critique**

Render → Chrome DevTools MCP screenshot → run interface-design:critique skill → iterate. No default-looking output.

- [ ] **Step 6: Commit**

Run: `git add src/app/\[locale\]/\(public\)/page.tsx src/app/\[locale\]/page.tsx && git commit -m "feat(landing): fused landing + marketplace with tool picker and shelves"`

### Task 5.5: `/browse` — full marketplace with filters

**Files:**
- Create: `src/app/[locale]/(public)/browse/page.tsx`
- Create: `src/components/marketplace/filter-sidebar.tsx`
- Create: `src/components/marketplace/tab-bar.tsx`
- Create: `src/components/marketplace/sort-select.tsx`

- [ ] **Step 1: FilterSidebar**

Sticky left column (hidden on mobile, sheet drawer instead). Filters:
- Platform (checkboxes — all 9)
- Type (checkboxes — all 6)
- Category (checkboxes — all 9, with CategoryChip visual)
- Environment (checkboxes — grouped by family)
- Price (radio — Any / Free / Paid)
- License (multi — MIT, Apache-2.0, GPL-3.0, CC-BY-NC, Commercial)
- Quality score minimum (slider 0-100)

State syncs to URL via `useSearchParams`.

- [ ] **Step 2: TabBar**

Top tabs: All / Trending / New / Top / Editors. Active tab colored brand amber, others muted.

- [ ] **Step 3: SortSelect**

Dropdown: Quality Score (default), Most Popular, Most Recent, Price Low to High, Price High to Low.

- [ ] **Step 4: Grid layout**

3-column grid on desktop (4 on wide), 2 on tablet, 1 on mobile. Uses RulesetCard. Paginate via `page` query param, show pagination controls at bottom. Empty state if filters produce 0 results: "Try clearing filters" button.

- [ ] **Step 5: Commit**

Run: `git add src/components/marketplace src/app/\[locale\]/\(public\)/browse && git commit -m "feat(browse): full marketplace with filters, tabs, sort, URL-synced state"`

### Task 5.6: Phase gate

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit`
Expected: error count strictly less than Phase 4 baseline.

- [ ] **Step 2: Visual critique on landing and browse**

Screenshot both pages. Run through: swap test, squint test, signature test. Iterate if anything feels generic.

- [ ] **Step 3: Lighthouse sweep**

Run Chrome DevTools MCP Lighthouse on `/en` and `/en/browse`. Accessibility >= 95, Performance >= 85 (grid-heavy pages can be a bit lower).

- [ ] **Step 4: 15-second benchmark**

From page load to clicking into a card and seeing the detail page: under 15 seconds. If slower, identify the bottleneck (image loading, font block, bundle size).

---

## Phase 6 — Ruleset detail + variant tabs + install block + reviews

**Goal:** Build the ruleset detail page at `/r/[slug]` per spec section 8.2. Variant tabs are scoped to the install block only; hero, description, reviews, related are variant-agnostic. The copy-install flow must feel instant and reliable.

### Task 6.1: Detail hero

**Files:**
- Create: `src/app/[locale]/(public)/r/[slug]/page.tsx`
- Create: `src/components/ruleset/detail-hero.tsx`
- Create: `src/components/ruleset/detail-sidebar.tsx`

- [ ] **Step 1: Hero layout**

Two-column on desktop (8/4), stacks on mobile. Left:
- Breadcrumb `Browse / Category / slug`
- Category icon (large, 64px, category accent) + title (display size) + byline (`@author` with CreatorMarks, team if present)
- 1-2 sentence description
- Stats row: rating (stars + count), downloads, Quality Score chip, freshness (days since update), license badge
- Action row: `Save`, `Follow`, `Fork`, `Report` as subtle outline buttons

Right (sidebar):
- Price block: free shows "Free" in green, paid shows price in brand amber
- Primary CTA: `Install` (jumps to install section) or `Purchase` (mock checkout dialog)
- BadgeStack (vertical)
- `Maintainer Verified` callout if present

- [ ] **Step 2: Fetch by slug**

`useRuleset(slug)` — handles loading (skeleton hero), error (ErrorState with retry), not-found (404 page via `notFound()`).

- [ ] **Step 3: Commit**

Run: `git add src/app/\[locale\]/\(public\)/r src/components/ruleset/detail-hero.tsx src/components/ruleset/detail-sidebar.tsx && git commit -m "feat(detail): ruleset hero with breadcrumb, stats, action row, sidebar"`

### Task 6.2: Install block with variant tabs

**Files:**
- Create: `src/components/ruleset/install-block.tsx`
- Create: `src/components/ruleset/variant-tabs.tsx`
- Create: `src/components/ruleset/code-preview.tsx`

- [ ] **Step 1: VariantTabs**

Tabs scoped to the install block only. Each tab is an environment label (`Claude Code`, `Cursor`, `Windsurf`, etc.) driven by `ruleset.variants`. Default to `defaultVariantId` or the first variant that matches the user's `preferredEnvironments`. Uses shadcn Tabs. Tab switch uses `softOut` transition and animates the code block in with a soft slide.

- [ ] **Step 2: CodePreview**

Syntax-highlighted code block (Shiki or prism — prefer Shiki for Tailwind v4 compatibility). Dark theme matching our token palette. Max-height with internal scroll. Line numbers optional per variant kind.

Above the code: `Target: ~/.claude/mcp_servers.json` (monospace, muted) shown when `variant.install.targetPath` is present.

Below the code: `CopyButton` (primary), `Download` (outline) if method is download, `Open in CLI` (outline) that shows a tooltip "Requires the RuleSell CLI" on click.

- [ ] **Step 3: Instructions markdown**

Render `variant.instructions` as markdown below the install buttons. Use `react-markdown` with a sanitizer. Headings, lists, code fences all styled against design tokens.

- [ ] **Step 4: Requirements list**

If `variant.requirements` present, render a small table: key | constraint. Example: `node | >= 18`, `claude-code | >= 0.6.0`.

- [ ] **Step 5: Commit**

Run: `git add src/components/ruleset/install-block.tsx src/components/ruleset/variant-tabs.tsx src/components/ruleset/code-preview.tsx && git commit -m "feat(detail): install block with variant tabs, code preview, copy flow"`

### Task 6.3: About + quality breakdown + license

**Files:**
- Create: `src/components/ruleset/about-section.tsx`
- Create: `src/components/ruleset/quality-breakdown.tsx`
- Create: `src/components/ruleset/license-callout.tsx`

- [ ] **Step 1: AboutSection**

Renders `ruleset.description` as markdown (long-form). Full width below install block.

- [ ] **Step 2: QualityBreakdown**

6 `QualityBar` rows: Token Efficiency, Install Success, Schema Clean, Freshness, Reviews, Security Pass (checkmark or X, not a bar). Null signals show a muted "Not applicable for this type" hint.

- [ ] **Step 3: LicenseCallout**

Shows SPDX identifier with icon, description ("Commercial use allowed" / "Non-commercial only" / "Attribution required"). Warning style if non-commercial and `price > 0`. Links to the SPDX canonical page in a new tab (no real fetch in v1, just href).

- [ ] **Step 4: Commit**

Run: `git add src/components/ruleset/about-section.tsx src/components/ruleset/quality-breakdown.tsx src/components/ruleset/license-callout.tsx && git commit -m "feat(detail): about, quality breakdown, license callout"`

### Task 6.4: Reviews + ReviewForm

**Files:**
- Create: `src/components/ruleset/review-list.tsx`
- Create: `src/components/ruleset/review-form.tsx`
- Create: `src/components/ruleset/review-card.tsx`

- [ ] **Step 1: ReviewList**

Fetch via `useReviews(rulesetId)`. Shows reviews sorted by `helpfulCount` desc then `createdAt` desc. Empty state: "No verified reviews yet. Only Certified Devs can write reviews after installing." (never "no reviews" with a fake 5-star).

- [ ] **Step 2: ReviewCard**

Avatar with CreatorMarks ring, username, reputation level, 5-star rating, environment tested (badge), title, body (markdown), helpful counter, helpful button, report button.

- [ ] **Step 3: ReviewForm**

Shown only when:
- User is Certified Dev or Verified Team member (checked via session user creator marks)
- User has `currentUserAccess` in `['PURCHASED', 'FREE_DOWNLOAD', 'SUBSCRIPTION_ACTIVE']`

Form fields: rating (1-5 stars), title, body (markdown textarea), environment tested (select from the item's variants). Submit → mock mutation that adds to localStorage and revalidates SWR.

When not eligible, show a muted hint: "Reviews are restricted to verified installers and Certified Devs. Learn more about certification."

- [ ] **Step 4: Commit**

Run: `git add src/components/ruleset/review-list.tsx src/components/ruleset/review-form.tsx src/components/ruleset/review-card.tsx && git commit -m "feat(detail): review list, form, card with certified-only gating"`

### Task 6.5: Related grid

**Files:**
- Create: `src/components/ruleset/related-grid.tsx`

- [ ] **Step 1: RelatedGrid**

Fetches 6 rulesets via `useRulesets({ category, environment })` — first try matching both the current category and the user's preferred environments; fall back to category only. Shows as `RulesetCard` grid. Title: "Compatible with your tools".

- [ ] **Step 2: Commit**

Run: `git add src/components/ruleset/related-grid.tsx && git commit -m "feat(detail): related grid with environment-aware fallback"`

### Task 6.6: 404 / not-found for ruleset

**Files:**
- Create: `src/app/[locale]/(public)/r/[slug]/not-found.tsx`

- [ ] **Step 1: Contextual 404**

Shows an EmptyState with message "We couldn't find that ruleset. It may have been unpublished or moved." Action: "Browse marketplace" button.

- [ ] **Step 2: Commit**

Run: `git add src/app/\[locale\]/\(public\)/r/\[slug\]/not-found.tsx && git commit -m "feat(detail): contextual 404 for missing rulesets"`

### Task 6.7: Phase gate

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit`
Expected: error count strictly less than Phase 5 baseline.

- [ ] **Step 2: Copy-install sanity check**

Navigate to a multi-variant ruleset. Switch tabs, confirm code updates and target path updates. Click copy, confirm the confetti burst triggers and the clipboard contains the variant content.

- [ ] **Step 3: Visual critique**

Screenshot hero + install block + reviews. Run swap test. Iterate until distinctly RuleSell.

- [ ] **Step 4: Lighthouse**

Run on a detail page. Accessibility >= 95.

---

## Phase 7 — Profiles (creator, team) + leaderboard + collections detail

**Goal:** Build the social surface that gives creators and teams a home, plus the leaderboard and collections detail. Every profile must render creator marks correctly, and every empty/error/loading state must be contextual.

### Task 7.1: Creator profile hero + ruleset grid

**Files:**
- Create: `src/app/[locale]/(public)/u/[username]/page.tsx`
- Create: `src/components/creator/profile-hero.tsx`
- Create: `src/components/creator/creator-marks.tsx`
- Create: `src/components/creator/reputation-bar.tsx`
- Create: `src/components/creator/follow-button.tsx`
- Create: `src/hooks/use-creator.ts`

- [ ] **Step 1: useCreator hook**

Create `src/hooks/use-creator.ts`:

```ts
'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';
import type { User } from '@/types';

export function useCreator(username: string) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    username ? `/api/users/${username}` : null,
    fetcher,
  );
  return { creator: data, error, isLoading, mutate };
}
```

- [ ] **Step 2: CreatorMarks component**

Create `src/components/creator/creator-marks.tsx`. Renders colored rings around an avatar based on `creatorMarks: CreatorMark[]`:

```tsx
import { cn } from '@/lib/utils';
import type { CreatorMark } from '@/types';

const ringClass: Record<CreatorMark, string> = {
  VERIFIED_CREATOR: 'ring-2 ring-emerald-500',
  TRADER: 'ring-2 ring-amber-500',
  CERTIFIED_DEV: 'ring-2 ring-violet-500',
  PRO: 'ring-2 ring-cyan-500',
  TEAM: 'ring-2 ring-rose-500',
  MAINTAINER: 'ring-2 ring-blue-500',
  TOP_RATED: 'ring-2 ring-pink-500',
};

export function CreatorMarks({
  marks,
  children,
  className,
}: {
  marks: CreatorMark[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative inline-block rounded-full ring-offset-2 ring-offset-zinc-950',
        marks.map((m) => ringClass[m]).join(' '),
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: ReputationBar component**

Create `src/components/creator/reputation-bar.tsx`. Thin horizontal gauge: level label ("Expert"), progress to next level, reputation number. Uses `repLevelFromScore` from `@/lib/quality/levels.ts`. Animated fill on mount via framer-motion, honors reduced-motion.

- [ ] **Step 4: FollowButton**

Create `src/components/creator/follow-button.tsx`. Toggle state via mock mutation through `useFollowing` hook (localStorage-backed). States: "Follow" (default), "Following ✓" (followed), "Unfollow" (hover-on-followed). Optimistic update, revalidates SWR.

- [ ] **Step 5: ProfileHero**

Create `src/components/creator/profile-hero.tsx`. Layout:
- Left: 96px avatar wrapped in `CreatorMarks`
- Middle: display name, `@username`, bio, join date, `ReputationBar`
- Right: `FollowButton`, "Message" (disabled tooltip in v1), "Report"
- Below: stats row — Published, Downloads, Avg Rating, Total Earnings (hidden unless viewing own profile)
- Uses `useTranslations('profile')` for all labels.

- [ ] **Step 6: Creator page**

Create `src/app/[locale]/(public)/u/[username]/page.tsx`:

```tsx
'use client';
import { use } from 'react';
import { useCreator } from '@/hooks/use-creator';
import { useRulesets } from '@/hooks/use-rulesets';
import { ProfileHero } from '@/components/creator/profile-hero';
import { RulesetCard } from '@/components/marketplace/ruleset-card';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { useTranslations } from 'next-intl';

export default function CreatorPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { creator, error, isLoading } = useCreator(username);
  const { rulesets } = useRulesets({ authorUsername: username });
  const t = useTranslations('profile');

  if (isLoading) return <LoadingSkeleton variant="profile" />;
  if (error || !creator) return <ErrorState message={t('notFound')} />;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <ProfileHero creator={creator} />
      <h2 className="mt-12 text-xl font-semibold text-zinc-100">
        {t('publishedItems', { count: rulesets?.length ?? 0 })}
      </h2>
      {rulesets && rulesets.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rulesets.map((r) => (
            <RulesetCard key={r.id} ruleset={r} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('empty.title')}
          description={t('empty.description')}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 7: Commit**

Run: `git add src/app/[locale]/\(public\)/u src/components/creator src/hooks/use-creator.ts && git commit -m "feat(profile): creator hero, marks, reputation, ruleset grid"`

### Task 7.2: Team profile page

**Files:**
- Create: `src/app/[locale]/(public)/team/[slug]/page.tsx`
- Create: `src/components/team/team-hero.tsx`
- Create: `src/components/team/team-member-list.tsx`
- Create: `src/hooks/use-team.ts`

- [ ] **Step 1: useTeam hook**

```ts
'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';
import type { Team } from '@/types';

export function useTeam(slug: string) {
  const { data, error, isLoading } = useSWR<Team>(
    slug ? `/api/teams/${slug}` : null,
    fetcher,
  );
  return { team: data, error, isLoading };
}
```

- [ ] **Step 2: TeamHero**

Create `src/components/team/team-hero.tsx`. Mirrors ProfileHero but keyed on team:
- Team avatar with `verified` checkmark overlay if `team.verified` is true
- Team name, slug, tagline
- Stats: member count, ruleset count, total earnings (own-team only)
- "Follow team" button (reuses `FollowButton` with `target="team"`)

- [ ] **Step 3: TeamMemberList**

Horizontal scroll of member avatars wrapped in `CreatorMarks`, each linking to `/u/[username]`. Shows max 10 inline; overflow shows "+N more" link to a member drawer.

- [ ] **Step 4: Team page**

Create `src/app/[locale]/(public)/team/[slug]/page.tsx`. Mirrors CreatorPage layout: hero, member list, team ruleset grid, empty state "This team has not published anything yet."

- [ ] **Step 5: Commit**

Run: `git add src/app/[locale]/team src/components/team src/hooks/use-team.ts && git commit -m "feat(team): team profile hero, member list, ruleset grid"`

### Task 7.3: Leaderboard page

**Files:**
- Create: `src/app/[locale]/(public)/leaderboard/page.tsx`
- Create: `src/components/marketplace/leaderboard-row.tsx`
- Create: `src/hooks/use-leaderboard.ts`

- [ ] **Step 1: useLeaderboard hook**

```ts
'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';
import type { Ruleset } from '@/types';

export function useLeaderboard() {
  const { data, error, isLoading } = useSWR<Ruleset[]>(
    '/api/leaderboard',
    fetcher,
  );
  return { leaders: data, error, isLoading };
}
```

- [ ] **Step 2: LeaderboardRow**

Create `src/components/marketplace/leaderboard-row.tsx`. Table-style row:
- Rank number (1-100) with gold/silver/bronze text styling for top 3
- Ruleset icon + title + primary category chip
- Author avatar wrapped in `CreatorMarks` + `@username`
- Quality score as inline gauge
- Downloads count
- Full row is a Link to `/r/[slug]`. Hover: `bg-zinc-900`, 2px translate from right.

- [ ] **Step 3: Leaderboard page**

Header: "Top 100 by Quality Score" + explainer "Quality Score is measured — not voted. Learn how to score high." Above the list: filter tabs All / RULES / MCP_SERVER / SKILL / AGENT_TEAM / WORKFLOW. Uses `useLeaderboard` + client-side category filter. Renders 100 `LeaderboardRow` items.

- [ ] **Step 4: Commit**

Run: `git add src/app/[locale]/leaderboard src/components/marketplace/leaderboard-row.tsx src/hooks/use-leaderboard.ts && git commit -m "feat(leaderboard): top 100 by quality score with category tabs"`

### Task 7.4: Collections detail page

**Files:**
- Create: `src/app/[locale]/(public)/collections/[slug]/page.tsx`
- Create: `src/components/collections/collection-hero.tsx`
- Create: `src/hooks/use-collection.ts`

- [ ] **Step 1: useCollection hook**

```ts
'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';
import type { Collection, Ruleset } from '@/types';

export function useCollection(slug: string) {
  const { data, error, isLoading } = useSWR<{
    collection: Collection;
    rulesets: Ruleset[];
  }>(slug ? `/api/collections/${slug}` : null, fetcher);
  return {
    collection: data?.collection,
    rulesets: data?.rulesets,
    error,
    isLoading,
  };
}
```

- [ ] **Step 2: CollectionHero**

Large banner with `coverAsset` as background (fallback: gradient from the primary category color to zinc-950). Title, description, curator avatar + "Curated by @curator", item count, follower count, "Follow collection" button.

- [ ] **Step 3: Collection page**

Renders CollectionHero + `RulesetCard` grid of the collection rulesets. Collections with zero items are filtered at the mock server level; empty state not expected. Loading: skeleton hero + grid.

- [ ] **Step 4: Commit**

Run: `git add src/app/[locale]/collections src/components/collections src/hooks/use-collection.ts && git commit -m "feat(collections): curated collection detail with hero and grid"`

### Task 7.5: Phase gate

- [ ] **Step 1: Type-check**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: zero new errors.

- [ ] **Step 2: Render check**

Dev server running. Visit each in order:
- `/en/u/alice-mcp` — creator hero with marks, reputation, published items
- `/en/team/anthropic-core` — team hero, member list, published items
- `/en/leaderboard` — 100 rows ranked by quality, category tabs work
- `/en/collections/frontend-essentials` — collection hero + grid

- [ ] **Step 3: Visual critique**

Screenshot each page. Run swap test. Confirm creator marks visible and distinct, reputation bar present, leaderboard top 3 styled differently from the rest.

- [ ] **Step 4: Lighthouse**

Run on leaderboard page (densest). Accessibility >= 95, performance >= 90.

---
## Phase 8 — Dashboard (overview, rulesets, earnings, purchases, saved, reviews, team, settings)

**Goal:** Build the authenticated dashboard across every route in spec 6.3. The dashboard has its own shared layout with a sidebar and breadcrumb. Personas are switched via `/dev/users`; each renders appropriate gates based on `role`, `builderStats`, `sellerStats`.

### Task 8.1: Dashboard shared layout + sidebar

**Files:**
- Create: `src/app/[locale]/(dashboard)/layout.tsx`
- Create: `src/components/dashboard/dashboard-sidebar.tsx`
- Create: `src/components/dashboard/dashboard-breadcrumb.tsx`

- [ ] **Step 1: Sidebar structure**

Create `src/components/dashboard/dashboard-sidebar.tsx`:

```tsx
'use client';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  ShoppingBag,
  Bookmark,
  Users,
  Star,
  UsersRound,
  Settings,
} from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations('dashboard.nav');
  const { user } = useUser();
  const isSeller = user?.sellerStats?.traderVerified;

  const items = [
    { href: '/dashboard/overview', label: t('overview'), icon: LayoutDashboard },
    { href: '/dashboard/rulesets', label: t('rulesets'), icon: Package },
    ...(isSeller
      ? [{ href: '/dashboard/earnings', label: t('earnings'), icon: DollarSign }]
      : []),
    { href: '/dashboard/purchases', label: t('purchases'), icon: ShoppingBag },
    { href: '/dashboard/saved', label: t('saved'), icon: Bookmark },
    { href: '/dashboard/following', label: t('following'), icon: Users },
    { href: '/dashboard/reviews', label: t('reviews'), icon: Star },
    { href: '/dashboard/team', label: t('team'), icon: UsersRound },
    { href: '/dashboard/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-64 border-r border-zinc-800 bg-zinc-950">
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                active
                  ? 'bg-zinc-900 text-amber-300'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Dashboard layout**

Create `src/app/[locale]/(dashboard)/layout.tsx`:

```tsx
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardBreadcrumb } from '@/components/dashboard/dashboard-breadcrumb';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardBreadcrumb />
        <main className="px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Breadcrumb**

Create `src/components/dashboard/dashboard-breadcrumb.tsx`. Reads `usePathname`, splits on `/`, renders clickable trail: Dashboard > Rulesets > New. Uses translations.

- [ ] **Step 4: Commit**

Run: `git add src/app/[locale]/\(dashboard\)/layout.tsx src/components/dashboard/dashboard-sidebar.tsx src/components/dashboard/dashboard-breadcrumb.tsx && git commit -m "feat(dashboard): shared layout with sidebar and breadcrumb"`

### Task 8.2: Overview page (`/dashboard/overview`)

**Files:**
- Create: `src/app/[locale]/(dashboard)/dashboard/overview/page.tsx`
- Create: `src/components/dashboard/stats-card.tsx`
- Create: `src/components/dashboard/activity-feed.tsx`
- Create: `src/hooks/use-overview.ts`

- [ ] **Step 1: StatsCard**

Create `src/components/dashboard/stats-card.tsx`:

```tsx
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StatsCardProps {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  accent?: string;
}

export function StatsCard({ label, value, delta, icon: Icon, accent = 'text-amber-300' }: StatsCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">{label}</span>
        <Icon className={cn('h-4 w-4', accent)} />
      </div>
      <div className="mt-2 text-2xl font-semibold text-zinc-100 tabular-nums">
        {value}
      </div>
      {delta !== undefined && (
        <div className={cn('mt-1 flex items-center gap-1 text-xs', positive ? 'text-emerald-400' : 'text-rose-400')}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta).toFixed(1)}% vs last 30d
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: ActivityFeed**

Create `src/components/dashboard/activity-feed.tsx`. List of events: "Your ruleset X got 12 new installs", "Review posted on Y", "Z purchased your bundle". Each row: dot in category color, text, relative timestamp, link target. Shows 10 most recent.

- [ ] **Step 3: useOverview hook**

```ts
'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';

export interface OverviewData {
  installs30d: number;
  installsDelta: number;
  revenue30d: number;
  revenueDelta: number;
  avgRating: number;
  publishedCount: number;
  activity: Array<{
    id: string;
    kind: 'install' | 'review' | 'purchase' | 'follow';
    text: string;
    href: string;
    at: string;
  }>;
}

export function useOverview() {
  const { data, error, isLoading } = useSWR<OverviewData>(
    '/api/analytics/overview',
    fetcher,
  );
  return { overview: data, error, isLoading };
}
```

- [ ] **Step 4: Overview page**

Create `src/app/[locale]/(dashboard)/dashboard/overview/page.tsx`:

```tsx
'use client';
import { useOverview } from '@/hooks/use-overview';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { Download, DollarSign, Star, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function OverviewPage() {
  const { overview, error, isLoading } = useOverview();
  const t = useTranslations('dashboard.overview');

  if (isLoading) return <LoadingSkeleton variant="dashboard-overview" />;
  if (error || !overview) return <ErrorState />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-zinc-100">{t('title')}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label={t('installs30d')}
          value={overview.installs30d.toLocaleString()}
          delta={overview.installsDelta}
          icon={Download}
        />
        <StatsCard
          label={t('revenue30d')}
          value={formatPrice(overview.revenue30d, 'USD')}
          delta={overview.revenueDelta}
          icon={DollarSign}
          accent="text-emerald-400"
        />
        <StatsCard
          label={t('avgRating')}
          value={overview.avgRating.toFixed(1)}
          icon={Star}
          accent="text-amber-300"
        />
        <StatsCard
          label={t('publishedCount')}
          value={String(overview.publishedCount)}
          icon={Package}
          accent="text-blue-400"
        />
      </div>
      <ActivityFeed items={overview.activity} />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

Run: `git add src/app/[locale]/\(dashboard\)/dashboard/overview src/components/dashboard/stats-card.tsx src/components/dashboard/activity-feed.tsx src/hooks/use-overview.ts && git commit -m "feat(dashboard): overview page with stats cards and activity feed"`

### Task 8.3: Rulesets table page (`/dashboard/rulesets`)

**Files:**
- Create: `src/app/[locale]/(dashboard)/dashboard/rulesets/page.tsx`
- Create: `src/components/dashboard/ruleset-table.tsx`
- Create: `src/components/dashboard/ruleset-row.tsx`

- [ ] **Step 1: RulesetTable**

Create `src/components/dashboard/ruleset-table.tsx`. Tabs: All / Published / Draft / Pending Review / Unpublished. Table headers: Title, Status, Quality Score, Installs, Revenue, Updated, Actions. Empty state (contextual, from spec 8.3):

> "You haven't published anything yet. Builders publish free items; Sellers unlock paid items after 50 verified installs."

With primary CTA "Publish your first ruleset" linking to `/dashboard/rulesets/new`.

- [ ] **Step 2: RulesetRow**

Create `src/components/dashboard/ruleset-row.tsx`. Row columns:
- Title cell: icon (category color) + title + slug in muted text
- Status chip: DRAFT (zinc-700), PENDING_REVIEW (amber-500), PUBLISHED (emerald-500), UNPUBLISHED (zinc-500), REMOVED (rose-500)
- Quality score: inline gauge (reuse QualityBar)
- Installs: tabular-nums number
- Revenue: formatted in seller currency, dash if not paid
- Updated: relative timestamp
- Actions: kebab menu (dropdown) → View, Edit, Analytics, Unpublish, Delete

Bulk actions above table: checkbox column selects rows, toolbar "Publish selected", "Unpublish selected", "Delete selected".

- [ ] **Step 3: Rulesets page**

Fetches via `useRulesets({ authorId: 'me', status: activeTab })`. Shows `RulesetTable`. Top-right CTA "New Ruleset" (amber, primary).

- [ ] **Step 4: Commit**

Run: `git add src/app/[locale]/\(dashboard\)/dashboard/rulesets src/components/dashboard/ruleset-table.tsx src/components/dashboard/ruleset-row.tsx && git commit -m "feat(dashboard): rulesets table with status tabs and bulk actions"`

### Task 8.4: Earnings page (`/dashboard/earnings`)

**Files:**
- Create: `src/app/[locale]/(dashboard)/dashboard/earnings/page.tsx`
- Create: `src/components/dashboard/earnings-chart.tsx`
- Create: `src/components/dashboard/payout-history.tsx`
- Create: `src/hooks/use-earnings.ts`

- [ ] **Step 1: useEarnings hook**

```ts
'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';

export interface EarningsData {
  lifetimeRevenue: number;
  pendingPayout: number;
  nextPayoutAt: string;
  timeseries: Array<{ date: string; revenue: number; installs: number }>;
  payouts: Array<{
    id: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed';
    paidAt: string | null;
    periodStart: string;
    periodEnd: string;
  }>;
}

export function useEarnings() {
  const { data, error, isLoading } = useSWR<EarningsData>(
    '/api/analytics/earnings',
    fetcher,
  );
  return { earnings: data, error, isLoading };
}
```

- [ ] **Step 2: EarningsChart**

Create `src/components/dashboard/earnings-chart.tsx`. Use `recharts` (already in package.json) to render a 90-day area chart of revenue with faint install overlay. Amber-gold fill for revenue, cyan for installs. Animated on mount. Empty state: "Earnings will appear after your first sale."

- [ ] **Step 3: PayoutHistory**

Table of payouts: period, amount, status, paid at. Status chips: pending (amber), paid (emerald), failed (rose). Minimum payout indicator at top: "Next payout: $42 of $50 minimum" with a thin progress bar.

- [ ] **Step 4: Earnings page**

Stats row at top: Lifetime Revenue / Pending Payout / Next Payout Date. Then `EarningsChart`, then `PayoutHistory`. Gated: only visible if `user.sellerStats.traderVerified === true`. Otherwise shows a prompt card: "Become a Seller to unlock earnings — requires 50 verified installs and Trader KYC."

- [ ] **Step 5: Commit**

Run: `git add src/app/[locale]/\(dashboard\)/dashboard/earnings src/components/dashboard/earnings-chart.tsx src/components/dashboard/payout-history.tsx src/hooks/use-earnings.ts && git commit -m "feat(dashboard): earnings page with chart and payout history"`

### Task 8.5: Purchases, saved, following, reviews pages

**Files:**
- Create: `src/app/[locale]/(dashboard)/dashboard/purchases/page.tsx`
- Create: `src/app/[locale]/(dashboard)/dashboard/saved/page.tsx`
- Create: `src/app/[locale]/(dashboard)/dashboard/following/page.tsx`
- Create: `src/app/[locale]/(dashboard)/dashboard/reviews/page.tsx`
- Create: `src/hooks/use-purchases.ts`
- Create: `src/hooks/use-saved.ts`
- Create: `src/hooks/use-following.ts`
- Create: `src/hooks/use-my-reviews.ts`

- [ ] **Step 1: Hooks (shared pattern)**

Each hook fetches a mock endpoint with SWR. Pattern:

```ts
'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';
import type { Ruleset } from '@/types';

export function usePurchases() {
  const { data, error, isLoading, mutate } = useSWR<Ruleset[]>(
    '/api/purchases',
    fetcher,
  );
  return { purchases: data, error, isLoading, mutate };
}
```

Same shape for `useSaved` (`/api/saved`), `useFollowing` (`/api/following` — returns `User[]`), `useMyReviews` (`/api/reviews?authorId=me` — returns `Review[]`).

- [ ] **Step 2: Purchases page**

Lists purchased rulesets as `RulesetCard` grid. Each card shows `currentUserAccess: 'PURCHASED'` badge + "Open install" button that links to the `/r/[slug]#install` anchor. Empty state: "You have not purchased anything yet. Browse paid items →" linking to `/browse/paid`.

- [ ] **Step 3: Saved page**

Lists saved rulesets as grid. Each card shows a "Remove" button (toggles `currentUserSaved`). Empty state: "Bookmark items as you browse to find them here."

- [ ] **Step 4: Following page**

Lists followed creators as compact cards: avatar with CreatorMarks, name, reputation level, "Unfollow" button, "Latest:" last published item link. Empty state: "Follow creators to see their new releases here."

- [ ] **Step 5: My reviews page**

Lists reviews the user authored as ReviewCard variants (with "Edit" and "Delete" actions instead of "Helpful"). Empty state: "You have not written any reviews. Only Certified Devs can write reviews after installing."

- [ ] **Step 6: Commit**

Run: `git add src/app/[locale]/\(dashboard\)/dashboard/purchases src/app/[locale]/\(dashboard\)/dashboard/saved src/app/[locale]/\(dashboard\)/dashboard/following src/app/[locale]/\(dashboard\)/dashboard/reviews src/hooks/use-purchases.ts src/hooks/use-saved.ts src/hooks/use-following.ts src/hooks/use-my-reviews.ts && git commit -m "feat(dashboard): purchases, saved, following, reviews pages"`

### Task 8.6: Team management page (`/dashboard/team`)

**Files:**
- Create: `src/app/[locale]/(dashboard)/dashboard/team/page.tsx`

- [ ] **Step 1: Team page**

v1 behavior: show the user's team as read-only view (team hero + member list + ruleset grid, reusing Phase 7 components). If user has no team: contextual empty state "Teams are multi-seat publishers with shared earnings. Team creation is coming in v2. Contact us →".

- [ ] **Step 2: Commit**

Run: `git add src/app/[locale]/\(dashboard\)/dashboard/team && git commit -m "feat(dashboard): team management read-only v1"`

### Task 8.7: Settings pages (`/dashboard/settings*`)

**Files:**
- Create: `src/app/[locale]/(dashboard)/dashboard/settings/page.tsx`
- Create: `src/app/[locale]/(dashboard)/dashboard/settings/seller/page.tsx`
- Create: `src/app/[locale]/(dashboard)/dashboard/settings/privacy/page.tsx`
- Create: `src/app/[locale]/(dashboard)/dashboard/settings/billing/page.tsx`
- Create: `src/components/dashboard/settings-tabs.tsx`
- Create: `src/components/dashboard/kyc-form.tsx`

- [ ] **Step 1: SettingsTabs**

Horizontal tab bar: Profile / Seller / Privacy / Billing. Active tab drives current page (client-side routing via Link). Visible on all settings pages at top.

- [ ] **Step 2: Settings profile page**

Form fields: avatar upload (mock), display name, username (read-only), bio, preferred environments (chips multi-select — reuses ToolPicker), notification prefs checkboxes. Uses shadcn Form primitives. Mock submit writes to localStorage and shows a success toast.

- [ ] **Step 3: Seller settings page (`/dashboard/settings/seller`)**

Conditional content based on `user.builderStats.canSellPaid` and `user.sellerStats.stripeConnectStatus`:
- Stage 1 (Builder, <50 installs): locked card "Publish free items to unlock seller features. {publishedCount}/50 verified installs."
- Stage 2 (50+ installs, no KYC): `KycForm` — legal name, address, bank account (last 4), business reg number. Mock submit transitions to Stage 3.
- Stage 3 (KYC pending): "Verification in progress. Usually 1-2 business days."
- Stage 4 (verified): "You are a verified seller" + Stripe Connect status card + "Disconnect Stripe".

- [ ] **Step 4: KycForm**

Form with zod-backed validation for legal name, address (country, line1, city, postal), bank (IBAN or routing+account, last 4 only), reg number. Disclaimer: "Required by DSA Art. 30 for any trader selling to EU consumers." Submit is mocked.

- [ ] **Step 5: Privacy settings page**

Three sections:
1. Cookie preferences — reuses CookieBanner controls (granular toggles: analytics, marketing, functional).
2. Data rights — three buttons: "Export my data" → opens DsrExportDialog; "Delete my account" → opens DeletionDialog; "Correct my data" → opens a form.
3. GPC status — shows "Global Privacy Control: Honored" if header detected, else "Not detected" with a link to enable in browser.

- [ ] **Step 6: Billing settings page**

v1 placeholder: shows Pro tier teaser card "$8/mo — Private collections, install history, early access" with a "Notify me at launch" button (writes to localStorage mock). No actual billing in v1.

- [ ] **Step 7: Commit**

Run: `git add src/app/[locale]/\(dashboard\)/dashboard/settings src/components/dashboard/settings-tabs.tsx src/components/dashboard/kyc-form.tsx && git commit -m "feat(dashboard): settings tabs — profile, seller, privacy, billing"`

### Task 8.8: Phase gate

- [ ] **Step 1: Type-check**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: Persona switch render check**

Visit `/dev/users`, switch between Visitor, User, Builder, Seller, Certified Dev, Team Owner, Admin. For each persona, visit `/dashboard/overview` and confirm:
- Sidebar items match persona (Earnings only shows for Seller)
- Settings → Seller gated stage matches persona
- Rulesets table empty states reflect persona

- [ ] **Step 3: Lighthouse**

Run on `/dashboard/overview` and `/dashboard/rulesets`. Accessibility >= 95.

---
## Phase 9 — Publishing wizard (5-step)

**Goal:** Build the 5-step publishing wizard at `/dashboard/rulesets/new` and the edit flow at `/dashboard/rulesets/[id]/edit`. Draft auto-saves to localStorage. Submit transitions to `PENDING_REVIEW`. License picker enforces SPDX and warns on incompatibilities.

### Task 9.1: Wizard shell + step navigation

**Files:**
- Create: `src/app/[locale]/(dashboard)/dashboard/rulesets/new/page.tsx`
- Create: `src/app/[locale]/(dashboard)/dashboard/rulesets/[id]/edit/page.tsx`
- Create: `src/components/dashboard/publish-wizard.tsx`
- Create: `src/components/dashboard/wizard-steps.tsx`
- Create: `src/hooks/use-wizard-draft.ts`

- [ ] **Step 1: useWizardDraft hook**

Create `src/hooks/use-wizard-draft.ts`. Stores partial `Ruleset` in localStorage keyed by `draft:ruleset:<id or new>`. Debounced save every 500ms. Returns `{ draft, update, clear, save }`.

```ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Ruleset } from '@/types';

export type WizardDraft = Partial<Ruleset> & { currentStep?: number };

export function useWizardDraft(id: string = 'new') {
  const key = `draft:ruleset:${id}`;
  const [draft, setDraft] = useState<WizardDraft>(() => {
    if (typeof window === 'undefined') return {};
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  });

  useEffect(() => {
    const h = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(draft));
      }
    }, 500);
    return () => clearTimeout(h);
  }, [draft, key]);

  const update = useCallback((patch: WizardDraft) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const clear = useCallback(() => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    setDraft({});
  }, [key]);

  return { draft, update, clear };
}
```

- [ ] **Step 2: WizardSteps component**

Create `src/components/dashboard/wizard-steps.tsx`. Horizontal stepper with 5 steps. Each step has a circle (filled if complete, outline if current, muted if future), a label, and connecting lines. Steps:
1. Type & Category
2. Content
3. Variants
4. Compatibility & License
5. Pricing

Clickable to jump back to earlier steps (not forward). Accessible via `aria-current="step"`.

- [ ] **Step 3: PublishWizard shell**

Create `src/components/dashboard/publish-wizard.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { useWizardDraft } from '@/hooks/use-wizard-draft';
import { WizardSteps } from './wizard-steps';
import { WizardStepType } from './wizard-step-type';
import { WizardStepContent } from './wizard-step-content';
import { WizardStepVariants } from './wizard-step-variants';
import { WizardStepLicense } from './wizard-step-license';
import { WizardStepPricing } from './wizard-step-pricing';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function PublishWizard({ id = 'new' }: { id?: string }) {
  const { draft, update, clear } = useWizardDraft(id);
  const [step, setStep] = useState<number>(draft.currentStep ?? 1);
  const router = useRouter();
  const t = useTranslations('publish');

  const next = () => {
    const newStep = Math.min(5, step + 1);
    setStep(newStep);
    update({ currentStep: newStep });
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    // Mock API call
    await fetch('/api/rulesets', {
      method: 'POST',
      body: JSON.stringify({ ...draft, status: 'PENDING_REVIEW' }),
    });
    clear();
    router.push('/dashboard/rulesets?submitted=1');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <WizardSteps currentStep={step} onJump={setStep} />
      <div className="mt-10 rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        {step === 1 && <WizardStepType draft={draft} onChange={update} />}
        {step === 2 && <WizardStepContent draft={draft} onChange={update} />}
        {step === 3 && <WizardStepVariants draft={draft} onChange={update} />}
        {step === 4 && <WizardStepLicense draft={draft} onChange={update} />}
        {step === 5 && <WizardStepPricing draft={draft} onChange={update} />}
      </div>
      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={prev} disabled={step === 1}>
          {t('back')}
        </Button>
        {step < 5 ? (
          <Button onClick={next}>{t('next')}</Button>
        ) : (
          <Button onClick={submit} className="bg-amber-400 text-zinc-950 hover:bg-amber-300">
            {t('submitForReview')}
          </Button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: New + edit pages**

New page: `src/app/[locale]/(dashboard)/dashboard/rulesets/new/page.tsx` renders `<PublishWizard />`.
Edit page: `src/app/[locale]/(dashboard)/dashboard/rulesets/[id]/edit/page.tsx` renders `<PublishWizard id={id} />` seeded from the fetched ruleset.

- [ ] **Step 5: Commit**

Run: `git add src/app/[locale]/\(dashboard\)/dashboard/rulesets src/components/dashboard/publish-wizard.tsx src/components/dashboard/wizard-steps.tsx src/hooks/use-wizard-draft.ts && git commit -m "feat(publish): wizard shell with 5 steps and localStorage draft"`

### Task 9.2: Step 1 — Type & Category

**Files:**
- Create: `src/components/dashboard/wizard-step-type.tsx`

- [ ] **Step 1: Form**

Fields:
- `type`: radio group (RULESET / PROMPT / WORKFLOW / AGENT / BUNDLE / DATASET) — uses shadcn `RadioGroup` with a visual description per option
- `category`: grid of 9 category tiles (primary category), each shown with its accent color from Appendix A
- `secondaryCategories`: multi-select chips, max 2, disabled if already at 2
- `platform`: single-select (CURSOR / VSCODE / CLAUDE / ...) — the contract's `platform` field

All via controlled `draft` state → `onChange`. Validation: cannot advance to step 2 unless `type`, `category`, `platform` are set.

- [ ] **Step 2: Commit**

Run: `git add src/components/dashboard/wizard-step-type.tsx && git commit -m "feat(publish): wizard step 1 — type and category"`

### Task 9.3: Step 2 — Content

**Files:**
- Create: `src/components/dashboard/wizard-step-content.tsx`

- [ ] **Step 1: Form**

Fields:
- `title`: text input, max 80 chars
- `description`: textarea, max 400 chars (short description)
- `previewContent`: textarea with monospace font, max 500 chars (preview snippet shown on cards)
- `tags`: chip input, max 8 tags, each 2-24 chars
- `longDescription`: markdown editor (textarea + client-side preview toggle) for the full description
- Screenshot upload: 3-slot drag-drop (mock — writes data URLs to localStorage)

Validation: title and description required. Cannot advance without them. Shows character counter live.

- [ ] **Step 2: Commit**

Run: `git add src/components/dashboard/wizard-step-content.tsx && git commit -m "feat(publish): wizard step 2 — content"`

### Task 9.4: Step 3 — Variants

**Files:**
- Create: `src/components/dashboard/wizard-step-variants.tsx`
- Create: `src/components/dashboard/variant-editor.tsx`

- [ ] **Step 1: VariantEditor**

Create `src/components/dashboard/variant-editor.tsx`. Panel to edit a single `Variant`:
- Label (text)
- Environments: multi-select chips from `ENVIRONMENTS` constant
- Kind: select from `VariantKind`
- Install method: select (copy / download / command / json_snippet)
- Content: large monospace textarea with syntax highlighting hint
- Target path: text input (e.g. `~/.cursor/mcp.json`)
- Instructions: markdown textarea
- Requirements: add/remove list of `{ key, constraint }` rows
- Is primary: toggle (only one variant can be primary at a time)

- [ ] **Step 2: WizardStepVariants**

List of current variants shown as collapsible panels. "Add variant" button appends a new blank `Variant` to `draft.variants`. At least 1 variant required to advance. Primary variant must be set.

Validation: each variant must have label, at least one environment, kind, install method, and non-empty content. Show inline errors per variant.

- [ ] **Step 3: Commit**

Run: `git add src/components/dashboard/wizard-step-variants.tsx src/components/dashboard/variant-editor.tsx && git commit -m "feat(publish): wizard step 3 — variants"`

### Task 9.5: Step 4 — Compatibility & License

**Files:**
- Create: `src/components/dashboard/wizard-step-license.tsx`
- Create: `src/constants/licenses.ts`

- [ ] **Step 1: SPDX constants**

Create `src/constants/licenses.ts` with the common SPDX licenses we support:

```ts
export interface LicenseOption {
  spdx: string;
  name: string;
  commercial: boolean;
  attribution: boolean;
  shareAlike: boolean;
  summary: string;
}

export const LICENSES: LicenseOption[] = [
  { spdx: 'MIT', name: 'MIT License', commercial: true, attribution: true, shareAlike: false, summary: 'Permissive, commercial use allowed, requires attribution.' },
  { spdx: 'Apache-2.0', name: 'Apache License 2.0', commercial: true, attribution: true, shareAlike: false, summary: 'Permissive + patent grant.' },
  { spdx: 'GPL-3.0', name: 'GNU GPL v3', commercial: true, attribution: true, shareAlike: true, summary: 'Copyleft — derivatives must be GPL.' },
  { spdx: 'AGPL-3.0', name: 'GNU AGPL v3', commercial: true, attribution: true, shareAlike: true, summary: 'Copyleft + network use clause.' },
  { spdx: 'CC-BY-4.0', name: 'Creative Commons Attribution 4.0', commercial: true, attribution: true, shareAlike: false, summary: 'Commercial OK with attribution.' },
  { spdx: 'CC-BY-NC-4.0', name: 'CC Attribution-NonCommercial 4.0', commercial: false, attribution: true, shareAlike: false, summary: 'No commercial use.' },
  { spdx: 'CC0-1.0', name: 'CC0 1.0 Universal', commercial: true, attribution: false, shareAlike: false, summary: 'Public domain dedication.' },
  { spdx: 'Commercial', name: 'Commercial (RuleSell)', commercial: true, attribution: false, shareAlike: false, summary: 'RuleSell Creator Agreement governs use.' },
];
```

- [ ] **Step 2: WizardStepLicense**

Form:
- License picker: radio list of `LICENSES`, each showing name, SPDX, summary, and commercial/non-commercial chip
- Compatibility matrix: grid showing which environments are officially supported (read-only from variants) with a "confirm compatibility" checkbox
- Requirements list: "Node 18+", "Python 3.11+", "Docker", etc. — add/remove rows

Warning banner: if user has set a non-commercial license AND intends to charge on step 5, show `LicenseWarning` component from Phase 10: "Non-commercial licenses cannot be sold paid. Change the license or set price to Free."

- [ ] **Step 3: Commit**

Run: `git add src/components/dashboard/wizard-step-license.tsx src/constants/licenses.ts && git commit -m "feat(publish): wizard step 4 — compatibility and SPDX license picker"`

### Task 9.6: Step 5 — Pricing

**Files:**
- Create: `src/components/dashboard/wizard-step-pricing.tsx`

- [ ] **Step 1: Form**

Fields:
- `price`: free / paid radio toggle
- If paid: price input in dollars (stored as cents internally — convert on blur), currency select (default USD)
- Subscription toggle: if on, shows monthly/yearly pricing inputs
- Team pricing: optional — shows "3x single for 10 seats", "6x for unlimited" preset buttons that fill inputs
- Platform cut display: read-only card showing "RuleSell takes 15% (5% for your first 6 months as a land-grab discount). You net ${calculated}/sale."

Paid radio disabled if:
- User is not a Seller (`user.sellerStats.traderVerified !== true`) — shows tooltip "Become a Seller to sell paid items"
- License is non-commercial — shows `LicenseWarning`

- [ ] **Step 2: Submit**

On "Submit for review" click, POST to mock `/api/rulesets` with `status: 'PENDING_REVIEW'`, then clear draft and redirect to `/dashboard/rulesets?submitted=1`. Rulesets table shows a success toast on `?submitted=1`.

- [ ] **Step 3: Commit**

Run: `git add src/components/dashboard/wizard-step-pricing.tsx && git commit -m "feat(publish): wizard step 5 — pricing with seller gate and license check"`

### Task 9.7: Phase gate

- [ ] **Step 1: Type-check**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: End-to-end wizard walkthrough**

With a Seller persona active, visit `/dashboard/rulesets/new`. Fill out all 5 steps with realistic data. Refresh the page at step 3 — confirm draft persists and reopens at step 3. Submit at step 5 — confirm toast on `/dashboard/rulesets`, new row shows with PENDING_REVIEW status.

With a Builder persona (not Seller), confirm step 5 shows the paid radio disabled with a tooltip and can only submit as Free.

- [ ] **Step 3: License warning check**

Select CC-BY-NC-4.0 at step 4, set paid price at step 5. Confirm `LicenseWarning` shows and "Submit" is disabled until either license or price changes.

- [ ] **Step 4: Lighthouse**

Run on the wizard. Accessibility >= 95.

---
## Phase 10 — Legal pages + compliance UI

**Goal:** Ship all 15 launch gates from spec section 12. Every legal page, every compliance dialog, the GPC middleware, and the license warning component. All copy goes into `messages/en.json` (and Turkish in Phase 11).

### Task 10.1: Legal page shared layout

**Files:**
- Create: `src/app/[locale]/(legal)/layout.tsx`
- Create: `src/components/legal/legal-nav.tsx`
- Create: `src/components/legal/legal-article.tsx`

- [ ] **Step 1: Legal layout**

Shared layout for all `/legal/*` routes. Sidebar nav on the left with links to all legal pages. Main area is a constrained prose column (`max-w-3xl`) with consistent typography: `prose prose-invert prose-zinc`.

- [ ] **Step 2: LegalNav component**

Sidebar: Terms / Privacy / Cookies / Acceptable Use / DMCA / Creator Agreement / Accessibility / Transparency. Active highlight on the current route. Last updated indicator at the top: "Last updated: 2026-04-08".

- [ ] **Step 3: LegalArticle component**

Wrapper with a header (title + last updated) and the markdown body. Props: `title`, `lastUpdated`, `children`. Includes a sticky "Back to top" link for long pages.

- [ ] **Step 4: Commit**

Run: `git add src/app/[locale]/\(legal\)/layout.tsx src/components/legal && git commit -m "feat(legal): shared layout, nav, article wrapper"`

### Task 10.2: Core legal pages

**Files:**
- Create: `src/app/[locale]/(legal)/legal/terms/page.tsx`
- Create: `src/app/[locale]/(legal)/legal/privacy/page.tsx`
- Create: `src/app/[locale]/(legal)/legal/cookies/page.tsx`
- Create: `src/app/[locale]/(legal)/legal/acceptable-use/page.tsx`
- Create: `src/app/[locale]/(legal)/legal/dmca/page.tsx`
- Create: `src/app/[locale]/(legal)/legal/creator-agreement/page.tsx`

- [ ] **Step 1: Terms of Service**

Sections: acceptance, eligibility (18+), account registration, prohibited content, termination, disclaimers, limitation of liability, governing law, changes to terms. All copy in `messages/en.json` under `legal.terms.*`. Links out to Privacy and Acceptable Use.

- [ ] **Step 2: Privacy Policy**

GDPR/CCPA compliant sections: data collected, purposes, lawful basis, retention, third parties (hosting, payments, analytics), international transfers, your rights (access/delete/portability/rectification/objection), DPO contact, children (18+ only), changes. Link to DSR flow at `/dashboard/settings/privacy`.

- [ ] **Step 3: Cookie Policy**

Table of cookies by category: Strictly Necessary / Functional / Analytics / Marketing. Each row: name, purpose, duration, provider. Link to cookie preferences at `/dashboard/settings/privacy`. Link to GPC info.

- [ ] **Step 4: Acceptable Use Policy**

Prohibited content categories: malware, infringing IP, hate speech, CSAM, spam, illegal services, sanctioned jurisdictions, credentials/tokens in shipped content. Consequences: warning, unpublish, account termination, legal referral.

- [ ] **Step 5: DMCA Policy**

Designated agent info (registered with US Copyright Office). Notice-and-takedown form at `/report/copyright/dmca` (Phase 10.4). Counter-notice procedure. Repeat infringer policy.

- [ ] **Step 6: Creator Agreement**

Royalty terms: 15% platform cut (10% for first 6 months). Refund policy: 14-day window if not installed. Payout minimum: $50, 30-day hold. Chargeback handling. License grant: non-exclusive for marketplace distribution. Termination rights on both sides.

- [ ] **Step 7: Commit**

Run: `git add src/app/[locale]/\(legal\)/legal && git commit -m "feat(legal): terms, privacy, cookies, acceptable use, DMCA, creator agreement"`

### Task 10.3: Accessibility + Transparency pages

**Files:**
- Create: `src/app/[locale]/(legal)/legal/accessibility/page.tsx`
- Create: `src/app/[locale]/(legal)/legal/transparency/page.tsx`

- [ ] **Step 1: Accessibility statement**

Sections: conformance target (WCAG 2.2 AA), how we test (Lighthouse CI + manual keyboard + screen reader), known issues (honest list), how to report (email + form), alternative formats.

- [ ] **Step 2: Transparency report page**

DSA Art. 15 sections: monthly active EU recipients counter (mock number), content moderation decisions (buckets: removed / demoted / warned / restored), notices received (by category), appeals resolved, automated vs human decisions, orders from authorities, complaints handling stats. Shown as a dashboard-style card grid.

Below that: a downloadable link to the annual report (PDF stub).

- [ ] **Step 3: Commit**

Run: `git add src/app/[locale]/\(legal\)/legal/accessibility src/app/[locale]/\(legal\)/legal/transparency && git commit -m "feat(legal): accessibility statement + DSA transparency report"`

### Task 10.4: Report dialog + report form routes

**Files:**
- Create: `src/components/compliance/report-dialog.tsx`
- Create: `src/app/[locale]/(public)/report/[targetType]/[targetId]/page.tsx`

- [ ] **Step 1: ReportDialog component**

Modal triggered from a "Report" button on rulesets, reviews, profiles. Form fields:
- Category: radio (Illegal content, IP infringement, Malware, Hate speech, Sexual content, Harassment, Privacy violation, Other)
- Description: textarea (min 20 chars)
- Contact email: optional, pre-filled if logged in
- Declaration: checkbox "I declare the information is accurate and I am acting in good faith" (required)

Submit → mock POST to `/api/moderation/notices` → toast "Report submitted. Our team will review within 72 hours (DSA Art. 16)." Reference number shown.

- [ ] **Step 2: Standalone report page**

For deep-linked reports: `/report/ruleset/123` opens the full-page version of the dialog with the target metadata already loaded at the top. Same form, same submit flow.

- [ ] **Step 3: Commit**

Run: `git add src/components/compliance/report-dialog.tsx src/app/[locale]/\(public\)/report && git commit -m "feat(compliance): DSA Art. 16 report dialog and standalone route"`

### Task 10.5: DSR dialogs (export, delete, correct)

**Files:**
- Create: `src/components/compliance/dsr-export-dialog.tsx`
- Create: `src/components/compliance/deletion-dialog.tsx`
- Create: `src/components/compliance/correction-dialog.tsx`

- [ ] **Step 1: DsrExportDialog**

Modal: "Export my data". Checkbox list of categories (profile, rulesets, reviews, purchases, activity, consent history). Submit → mock 2s delay → shows a download link for `user-data-export.json` (built client-side from localStorage + mock user). Logs the request to `dsr_requests` mock collection.

- [ ] **Step 2: DeletionDialog**

Modal: "Delete my account". Warning card: "This is irreversible. Your rulesets will be marked REMOVED, your reviews will be kept but anonymized, your payouts will be frozen." Require typing the username to confirm. 30-day cooling-off period notice. Submit → mock → "Request received. Your account will be deleted on {date + 30}. Sign out."

- [ ] **Step 3: CorrectionDialog**

Modal: "Correct my data". Simple form listing user fields with edit icons — display name, email, country. Submit → mock update via local useUser mutate.

- [ ] **Step 4: Commit**

Run: `git add src/components/compliance/dsr-export-dialog.tsx src/components/compliance/deletion-dialog.tsx src/components/compliance/correction-dialog.tsx && git commit -m "feat(compliance): DSR export, deletion, correction dialogs"`

### Task 10.6: License warning component

**Files:**
- Create: `src/components/compliance/license-warning.tsx`

- [ ] **Step 1: LicenseWarning**

Shared component used on ruleset detail, publishing wizard step 4/5, and purchase checkout. Props: `license: string`, `intent: 'view' | 'purchase' | 'publish_paid'`. Logic:
- If license is non-commercial and intent is `publish_paid` → show red warning "Non-commercial licenses cannot be sold paid"
- If license is GPL and intent is `purchase` → amber warning "GPL license — derivatives must be open source"
- If license is AGPL → amber warning "AGPL license — network use triggers disclosure obligations"
- If license is CC0 → muted green "Public domain — no restrictions"
- Otherwise → small neutral chip with the SPDX identifier and a link to the canonical SPDX page

Uses Lucide icons (ShieldAlert, ShieldCheck, Info). Animated on mount.

- [ ] **Step 2: Commit**

Run: `git add src/components/compliance/license-warning.tsx && git commit -m "feat(compliance): license warning component with SPDX logic"`

### Task 10.7: GPC middleware rewrite

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Rewrite middleware**

Combine next-intl locale middleware with GPC header detection:

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  // Global Privacy Control — honor as opt-out of sale/sharing
  const gpc = req.headers.get('sec-gpc');
  if (gpc === '1') {
    res.cookies.set('gpc_honored', '1', {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    });
    res.headers.set('x-gpc-honored', '1');
  }

  // Sanctioned country geo-block hint (real decision at signup form)
  const country = req.headers.get('x-vercel-ip-country') ?? '';
  const sanctioned = ['CU', 'IR', 'KP', 'SY'];
  if (sanctioned.includes(country)) {
    res.cookies.set('geo_restricted', '1', {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    });
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\..*).*)'],
};
```

- [ ] **Step 2: Commit**

Run: `git add src/middleware.ts && git commit -m "feat(compliance): GPC header honor + sanctioned geo hint in middleware"`

### Task 10.8: Wire up report buttons + DSR in privacy settings

**Files:**
- Modify: `src/components/ruleset/detail-hero.tsx`
- Modify: `src/components/ruleset/review-card.tsx`
- Modify: `src/components/creator/profile-hero.tsx`
- Modify: `src/app/[locale]/(dashboard)/dashboard/settings/privacy/page.tsx`

- [ ] **Step 1: Report button wiring**

Each of the three components gets a "Report" button that opens `ReportDialog` with the right `targetType` and `targetId`.

- [ ] **Step 2: DSR wiring in privacy settings**

Privacy settings page mounts the three DSR dialogs behind "Export my data", "Delete my account", "Correct my data" buttons.

- [ ] **Step 3: Commit**

Run: `git add src/components/ruleset/detail-hero.tsx src/components/ruleset/review-card.tsx src/components/creator/profile-hero.tsx src/app/[locale]/\(dashboard\)/dashboard/settings/privacy/page.tsx && git commit -m "feat(compliance): wire report buttons and DSR dialogs"`

### Task 10.9: Phase gate — 15 launch gates checklist

- [ ] **Step 1: Type-check**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: 15 launch gates render check**

Walk the list from spec section 12 and confirm each is present in UI:
1. Cookie banner — visible on first visit at `/`
2. Privacy Policy — `/legal/privacy` renders
3. Terms of Service — `/legal/terms` renders
4. Cookie Policy — `/legal/cookies` renders
5. Acceptable Use — `/legal/acceptable-use` renders
6. DMCA Policy — `/legal/dmca` renders
7. Creator Agreement — `/legal/creator-agreement` renders
8. 18+ age gate — `/signup` form requires DOB
9. Report button — appears on ruleset detail, review card, profile hero
10. DSR export + delete — present in privacy settings
11. GPC honor — `curl -H "sec-gpc: 1" http://localhost:3000/en` sets `gpc_honored` cookie
12. Accessibility statement — `/legal/accessibility` renders
13. Transparency page — `/legal/transparency` renders
14. License declaration — publishing wizard step 4 requires SPDX pick
15. Geo-block — signup form rejects sanctioned countries

- [ ] **Step 3: Lighthouse**

Run on `/legal/transparency` (largest legal page). Accessibility >= 95.

---
## Phase 11 — i18n sweep EN + TR, dev persona switcher, empty stubs for DE/ES/JA

**Goal:** Every user-facing string lives in `messages/<locale>.json`. Turkish is fully translated. German, Spanish, Japanese have empty scaffolds ready for translators. The dev persona switcher at `/dev/users` is wired up so reviewers can verify role gating.

### Task 11.1: Audit all hardcoded strings and route through useTranslations

**Files:**
- Modify: every `.tsx` file under `src/components/**` and `src/app/[locale]/**`

- [ ] **Step 1: Grep for hardcoded strings**

Run: `grep -rn "className=" src/components | grep -E ">[A-Z][a-z]" | head -50`
This surfaces JSX text that looks like English. Make a list of components to fix.

Also run:
```bash
grep -rnE "placeholder=\"[A-Z]|aria-label=\"[A-Z]" src/components src/app | head -50
```

- [ ] **Step 2: Move strings into messages/en.json**

Group keys by feature: `landing.*`, `browse.*`, `detail.*`, `dashboard.*`, `publish.*`, `profile.*`, `team.*`, `legal.*`, `compliance.*`, `common.*`, `errors.*`, `empty.*`, `forms.*`, `nav.*`, `footer.*`.

Each component that has copy uses:
```tsx
import { useTranslations } from 'next-intl';
const t = useTranslations('<namespace>');
```

- [ ] **Step 3: Commit intermediate progress**

After each feature namespace is moved: commit with `git commit -m "i18n(<namespace>): move hardcoded copy into messages/en.json"`

### Task 11.2: Build messages/tr.json (Turkish translation)

**Files:**
- Create: `messages/tr.json`

- [ ] **Step 1: Copy en.json as the key schema**

Run: `cp messages/en.json messages/tr.json`

- [ ] **Step 2: Translate each string to Turkish**

Translate by namespace, preserving the exact key hierarchy. Example keys:
- `landing.hero.title`: "Herkese açık yapay zeka geliştirme varlıkları"
- `landing.hero.searchPlaceholder`: "2.847 doğrulanmış öğe arayın..."
- `nav.browse`: "Keşfet"
- `nav.publish`: "Yayınla"
- `nav.signIn`: "Giriş yap"
- `common.loading`: "Yükleniyor..."
- `common.error`: "Bir hata oluştu"
- `common.retry`: "Tekrar dene"
- `errors.notFound`: "Bulunamadı"
- `empty.rulesets.title`: "Henüz bir şey yok"
- `empty.rulesets.description`: "Tarayıcıda bir öğe kaydedin; burada görünecek."

Use native-speaker phrasing — not literal translation. The spec's copy philosophy ("stop writing rulesets from scratch") translates as "Sıfırdan kural yazmayı bırakın." Let the personality survive.

- [ ] **Step 3: Verify key parity**

Run (from repo root):
```bash
node -e "const en=require('./messages/en.json'),tr=require('./messages/tr.json');const walk=(o,p='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'?walk(v,p+k+'.'):[p+k]);const ek=walk(en),tk=walk(tr);const miss=ek.filter(k=>!tk.includes(k));console.log('Missing in tr:',miss);"
```
Expected: empty array.

- [ ] **Step 4: Commit**

Run: `git add messages/tr.json && git commit -m "i18n(tr): full Turkish translation"`

### Task 11.3: Empty scaffolds for DE, ES, JA

**Files:**
- Create: `messages/de.json`
- Create: `messages/es.json`
- Create: `messages/ja.json`

- [ ] **Step 1: Generate skeletons**

Each file copies the English structure but with empty string values, so next-intl reports missing keys as empty rather than crashing. Script:

```bash
node -e "const fs=require('fs');const en=require('./messages/en.json');const empty=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,typeof v==='object'?empty(v):'']));for(const loc of ['de','es','ja']){fs.writeFileSync('./messages/'+loc+'.json',JSON.stringify(empty(en),null,2));}"
```

- [ ] **Step 2: Update routing**

Modify `src/i18n/routing.ts` to include all 5 locales but keep EN as default with `localeDetection: false`:

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'tr', 'de', 'es', 'ja'],
  defaultLocale: 'en',
  localeDetection: false,
});
```

- [ ] **Step 3: Fallback to en for empty strings**

Update `src/i18n/request.ts` to pass `onError` that silently falls back to English for missing keys. Next-intl supports `getMessageFallback` and `onError` options.

- [ ] **Step 4: Commit**

Run: `git add messages/de.json messages/es.json messages/ja.json src/i18n && git commit -m "i18n: empty scaffolds for de/es/ja with fallback to en"`

### Task 11.4: Dev persona switcher at `/dev/users`

**Files:**
- Create: `src/app/[locale]/dev/users/page.tsx`
- Create: `src/components/dev/persona-switcher.tsx`
- Modify: `src/hooks/use-user.ts` (read persona from localStorage)

- [ ] **Step 1: PersonaSwitcher**

Create `src/components/dev/persona-switcher.tsx`:

```tsx
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type Persona =
  | 'visitor'
  | 'user'
  | 'builder'
  | 'seller'
  | 'certified-dev'
  | 'team-owner'
  | 'admin';

export const PERSONAS: { id: Persona; label: string; description: string }[] = [
  { id: 'visitor', label: 'Visitor', description: 'No auth. Browse only.' },
  { id: 'user', label: 'User', description: 'Verified 18+. Can save, follow, vote.' },
  { id: 'builder', label: 'Builder', description: 'Verified email. Can publish free items.' },
  { id: 'seller', label: 'Seller', description: 'Trader KYC + Stripe Connect. Can publish paid items.' },
  { id: 'certified-dev', label: 'Certified Dev', description: '200+ reputation. Can write verified reviews.' },
  { id: 'team-owner', label: 'Team Owner', description: 'Team admin with multi-seat publishing.' },
  { id: 'admin', label: 'Admin', description: 'Platform staff. See everything.' },
];

export function PersonaSwitcher() {
  const [persona, setPersona] = useState<Persona>('visitor');

  useEffect(() => {
    const stored = window.localStorage.getItem('dev:persona') as Persona;
    if (stored) setPersona(stored);
  }, []);

  const apply = (id: Persona) => {
    window.localStorage.setItem('dev:persona', id);
    setPersona(id);
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {PERSONAS.map((p) => (
        <button
          key={p.id}
          onClick={() => apply(p.id)}
          className={cn(
            'rounded-lg border p-5 text-left transition',
            persona === p.id
              ? 'border-amber-400 bg-amber-400/10'
              : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-100">{p.label}</span>
            {persona === p.id && <span className="text-xs text-amber-300">ACTIVE</span>}
          </div>
          <p className="mt-1 text-xs text-zinc-400">{p.description}</p>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Persona page**

Create `src/app/[locale]/dev/users/page.tsx`:

```tsx
import { PersonaSwitcher } from '@/components/dev/persona-switcher';

export default function DevUsersPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-100">Dev: Persona Switcher</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Switch between role fixtures to verify gating. Only available in development.
      </p>
      <div className="mt-8">
        <PersonaSwitcher />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Wire `useUser` to read persona**

Modify `src/hooks/use-user.ts` so that when `window.localStorage.getItem('dev:persona')` is set, it returns the fixture user for that persona from `src/constants/mock-data.ts`:

```ts
'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';
import { getPersonaUser } from '@/lib/mock/personas';
import type { User } from '@/types';

export function useUser() {
  const persona =
    typeof window !== 'undefined'
      ? (window.localStorage.getItem('dev:persona') as string | null)
      : null;

  const { data, error, isLoading, mutate } = useSWR<User | null>(
    persona ? `persona:${persona}` : '/api/users/me',
    () =>
      persona
        ? Promise.resolve(getPersonaUser(persona))
        : fetcher('/api/users/me'),
  );
  return { user: data, error, isLoading, mutate };
}
```

- [ ] **Step 4: persona-to-user mapping**

Create `src/lib/mock/personas.ts` that returns the correct mock user fixture per persona (null for 'visitor'). Each persona maps to a specific seeded user so gating checks are consistent across pages.

- [ ] **Step 5: Guard `/dev/users` in production**

In the page, if `process.env.NODE_ENV === 'production'`, render `notFound()`.

- [ ] **Step 6: Commit**

Run: `git add src/app/[locale]/dev src/components/dev src/hooks/use-user.ts src/lib/mock/personas.ts && git commit -m "feat(dev): persona switcher at /dev/users with localStorage-backed useUser"`

### Task 11.5: Phase gate

- [ ] **Step 1: Type-check**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: Language switch check**

Visit `/en` — everything in English. Visit `/tr` — everything in Turkish. Visit `/de` — English fallback (empty scaffold), no crashes.

- [ ] **Step 3: Grep check for stray hardcoded strings**

Run: `grep -rnE ">[A-Z][a-z][a-zA-Z ]{5,}<" src/components src/app | grep -v messages | grep -v mock-data | head -30`
Expected: empty or a very short list of genuinely non-user-facing strings (class names, test ids, etc.).

- [ ] **Step 4: Persona switch render check**

Visit `/dev/users`, switch between all 7 personas, for each navigate to `/dashboard/overview`, `/dashboard/earnings`, `/dashboard/settings/seller` and confirm gates apply correctly.

- [ ] **Step 5: Lighthouse**

Run on `/tr` landing page. Accessibility >= 95, confirms translations do not break contrast or layout.

---
## Phase 12 — Motion polish, Lighthouse sweep, visual critique

**Goal:** Final pass. Every page feels distinctly RuleSell — category-colored, cute but minimal, motion purposeful. Every page scores Lighthouse accessibility >= 95 and performance >= 90. Every surface passes the swap test.

### Task 12.1: Motion polish pass — cards, tabs, confetti, badges

**Files:**
- Modify: `src/components/marketplace/ruleset-card.tsx`
- Modify: `src/components/ruleset/variant-tabs.tsx`
- Modify: `src/components/ruleset/install-block.tsx`
- Modify: `src/components/ruleset/quality-bar.tsx`
- Modify: `src/components/ruleset/badge-stack.tsx`

- [ ] **Step 1: Card hover lift**

Add framer-motion `whileHover` to `RulesetCard`:
- Translate: `y: -2`
- Box shadow: `0 0 0 1px {categoryColor}, 0 10px 30px -10px {categoryColor}/30`
- Duration: `0.18s ease-out`
- Honors `prefers-reduced-motion` via `useReducedMotion()` — disables the lift if true.

- [ ] **Step 2: Variant tab color accent**

Make the active variant tab underline animate from previous to next tab via `layoutId` on a motion.div underline element. Color matches the primary category color.

- [ ] **Step 3: Copy button confetti**

Create `src/components/motion/confetti-burst.tsx` that fires ~12 small dots from the click coordinate outward and fades over 600ms. Used on the InstallBlock copy button. Honors reduced motion — just shows checkmark if true.

- [ ] **Step 4: Quality bar animated fill**

Quality bars on the detail page animate from 0 to value when they scroll into view (IntersectionObserver), 0.6s cubic-bezier easing, staggered 60ms apart. Reduced motion: immediate value.

- [ ] **Step 5: Badge stack stagger**

On card appear, badges fade+slide in one after another with a 40ms stagger. Reduced motion: opacity only.

- [ ] **Step 6: Commit**

Run: `git add src/components/marketplace/ruleset-card.tsx src/components/ruleset src/components/motion/confetti-burst.tsx && git commit -m "motion: card hover, variant tab underline, confetti, quality bars, badge stagger"`

### Task 12.2: Scroll reveal pass on landing + shelves

**Files:**
- Modify: `src/app/[locale]/(public)/page.tsx`
- Modify: `src/components/marketplace/numbered-section.tsx`
- Create: `src/components/motion/scroll-reveal.tsx`

- [ ] **Step 1: ScrollReveal primitive**

Wrapper that fades+slides its children on enter-view:

```tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';

export function ScrollReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Wrap landing shelves**

Each `NumberedSection` on the landing page is wrapped in `ScrollReveal` with delay `index * 0.08`. The hero is NOT wrapped (always visible, no reveal).

- [ ] **Step 3: Commit**

Run: `git add src/app/[locale]/\(public\)/page.tsx src/components/marketplace/numbered-section.tsx src/components/motion/scroll-reveal.tsx && git commit -m "motion: scroll reveal on landing shelves"`

### Task 12.3: Empty state mascots

**Files:**
- Create: `src/components/shared/empty-mascot.tsx`
- Modify: every page that renders an `EmptyState`

- [ ] **Step 1: EmptyMascot component**

Inline SVG of a small cute illustration — a "paper scroll with eyes" character that embodies the RuleSell metaphor (rulesets = scrolls, verified = calm expression). 5 variants:
- `default` — neutral
- `search` — holding a magnifying glass
- `error` — knocked over
- `success` — cheering
- `building` — holding tools

Each is a ~120px inline SVG. Subtle bob animation (2s loop). Reduced motion: static.

- [ ] **Step 2: Wire into EmptyState**

Update `src/components/shared/empty-state.tsx` to accept an optional `mascot` prop (default `'default'`) and render `EmptyMascot` above the text. Keep the contextual CTA.

- [ ] **Step 3: Commit**

Run: `git add src/components/shared/empty-mascot.tsx src/components/shared/empty-state.tsx && git commit -m "motion: cute mascot illustrations for empty states"`

### Task 12.4: Lighthouse sweep — every major route

**Files:**
- None (verification only)

- [ ] **Step 1: Start dev server in prod mode**

Run: `cd D:/RulesetMarketplace-master && npm run build && npm run start` (background).

- [ ] **Step 2: Run Lighthouse via Chrome DevTools MCP**

For each route below, use `mcp__chrome-devtools__lighthouse_audit` and record accessibility + performance scores. Target >= 95 a11y, >= 90 perf. Routes to audit:

- `/en` — landing
- `/en/browse`
- `/en/browse/top`
- `/en/search?q=mcp`
- `/en/category/mcp_server`
- `/en/environment/claude-code`
- `/en/r/anthropic-brave-search`
- `/en/u/alice-mcp`
- `/en/team/anthropic-core`
- `/en/leaderboard`
- `/en/collections/frontend-essentials`
- `/en/dashboard/overview`
- `/en/dashboard/rulesets`
- `/en/dashboard/rulesets/new`
- `/en/dashboard/settings`
- `/en/legal/transparency`

- [ ] **Step 3: Fix failures**

For each route scoring below the thresholds, identify the root cause via the Lighthouse report and fix. Common fixes:
- Missing alt text → add to Image components
- Insufficient contrast → tweak the zinc scale in `globals.css` tokens
- Missing landmarks → add `<main>`, `<nav>`, `<header>`, `<footer>`
- Large LCP → add `priority` to hero images, preload critical fonts
- Unused CSS → rely on Tailwind v4 JIT (should be automatic)

- [ ] **Step 4: Re-run and confirm**

Re-audit each fixed route. Commit scores to `docs/lighthouse-baseline.md` as a table.

- [ ] **Step 5: Commit**

Run: `git add docs/lighthouse-baseline.md && git commit -m "perf: lighthouse baseline across 16 routes, all >= 95 a11y / 90 perf"`

### Task 12.5: Visual critique — swap test every signature surface

**Files:**
- None (verification only, may drive tweaks)

- [ ] **Step 1: Screenshot each signature surface**

Via `mcp__chrome-devtools__take_screenshot`, capture:
- Landing hero + tool picker strip
- Landing shelf row (top for you)
- Browse grid with filters
- Ruleset detail hero + install block
- Leaderboard top 10 rows
- Dashboard overview with stats cards
- Empty state (navigate to `/en/dashboard/saved` on a fresh persona)

- [ ] **Step 2: Swap test**

For each screenshot, apply the test: can this be swapped for a stock shadcn + Tailwind template without anyone noticing? If yes, identify what defaulted. Look for:
- Is the `#FFD166` amber-gold accent visible as a signature?
- Are category colors consistent across card borders, install tab accents, and badges?
- Does the numbered 01/02/03 section treatment appear on shelves?
- Is the creator mark ring visible and distinct from generic badges?
- Does the tool picker look like a RuleSell original?

- [ ] **Step 3: Fix defaults**

For each identified default, adjust. Examples:
- Add a 1px border in category color on hovered cards
- Make the numbered section number use a large display font (`font-display text-6xl text-zinc-700`)
- Use the amber accent on active tab underline, not blue
- Use a custom badge shape (pill with a notch) rather than plain rounded-full

- [ ] **Step 4: Commit tweaks**

Run: `git add src && git commit -m "polish: visual tweaks from swap test — accent, numbers, badges"`

### Task 12.6: Reduced-motion + keyboard + screen-reader sweep

**Files:**
- None (verification only)

- [ ] **Step 1: Reduced motion**

Enable `prefers-reduced-motion: reduce` in browser devtools. Visit landing, browse, detail, dashboard. Confirm:
- No scroll reveals (content appears immediately)
- No card hover lift
- No quality bar fill animation (static value)
- No confetti burst (checkmark swap only)
- Mascots static

- [ ] **Step 2: Keyboard navigation sweep**

From the landing page, use only Tab/Shift+Tab/Enter/Space/Arrow keys to:
- Skip nav → main content
- Focus tool picker pills, toggle them
- Navigate to a ruleset card, open detail
- Switch variant tabs with arrow keys
- Copy install content with Enter on copy button
- Open a dashboard page, navigate sidebar with arrow keys

Every interactive element must have a visible focus ring using the amber-300 accent.

- [ ] **Step 3: Screen reader sweep**

Turn on NVDA (Windows) or VoiceOver (Mac) and walk the landing page. Confirm:
- Page title announced
- Hero heading level 1 announced
- Tool picker announced as a group with selected state
- Shelves announced as landmarks
- Cards announced with title + category + rating
- Install block copy button announces state change ("Copied")

- [ ] **Step 4: Aria-live regions**

Confirm aria-live regions are wired for:
- Form errors (`aria-live="polite"`)
- Toast notifications (`aria-live="polite"` or `"assertive"` for errors)
- Loading spinners on data fetches (`aria-busy`)
- Search result count updates on landing grid as tool picker toggles (`aria-live="polite"`)

- [ ] **Step 5: Commit remediations**

Run: `git add src && git commit -m "a11y: keyboard focus rings, aria-live wiring, reduced motion sweep"`

### Task 12.7: Final gate

- [ ] **Step 1: Type-check clean**

Run: `cd D:/RulesetMarketplace-master && npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: Lint clean**

Run: `npm run lint`
Expected: zero errors.

- [ ] **Step 3: Unit tests pass**

Run: `npm test`
Expected: all tests passing (quality score, mock server, pagination, sorting).

- [ ] **Step 4: Success criteria checklist (spec section 19)**

- [ ] Landing page loads <2s, first asset visible <15s
- [ ] Every page handles loading / error / empty
- [ ] All 15 compliance gates present
- [ ] Lighthouse a11y >= 95 on every audited route
- [ ] Zero TS errors
- [ ] Zero ESLint errors
- [ ] Mock data serves all routes
- [ ] Persona switcher at `/dev/users` cycles all 7 personas
- [ ] Swap test passed on every signature surface
- [ ] Motion feels distinctively RuleSell

- [ ] **Step 5: Tag release**

Run: `git tag -a v1.0-frontend-complete -m "RuleSell rebuild — frontend complete, market-ready mock"`

- [ ] **Step 6: Update HANDOFF.md**

Append a section to `HANDOFF.md` summarizing what shipped, what personas are available, and what the backend team needs to implement against the mock API contracts to go live.

- [ ] **Step 7: Commit + push**

Run: `git add HANDOFF.md && git commit -m "docs: handoff notes for v1.0-frontend-complete"`

---

## Implementation done
