# RuleSell Rebuild — Market-Ready Global Marketplace (Design Spec)

**Date:** 2026-04-08
**Status:** Approved for implementation
**Supersedes:** `2026-03-28-community-platform-design.md`
**Research:** `docs/research/2026-04-08-*.md` (6 files, 1900+ lines) + `2026-04-08-SYNTHESIS.md`

---

## 0. Purpose

Rebuild RuleSell from the existing Next 16 foundation into a **global, market-ready, frontend-complete** marketplace for AI development assets — rules, MCP servers, skills, agent teams, workflows, prompts, CLIs, datasets, bundles. This spec covers frontend + mock backend data only; real backend wiring is out of scope and will be executed by the backend team against the API contracts specified here.

## 1. Product thesis

> The dev-tool AI asset space is structurally unmonetized. Every major directory (mcp.so 19K, glama 21K, skills.sh 91K, cursor.directory 63K, smithery 3K, claudemarketplaces 2.4K) is free-only on both sides. Creators earn zero. Quality is unmeasured — "top-starred MCPs are consistently the worst performers on token efficiency" (HN). The postmark-mcp incident (Sept 2025) proved the trust layer is missing. Scale has become an anti-feature: 91K skills is worse than 500 curated skills because discovery collapses and agents degrade. We fill the gap with **(1) real creator payouts at 85/15 split, (2) per-environment variant packaging, (3) measured quality scoring with verified installs**, wrapped in compliance-by-design for global launch.

## 2. Constraints

- **Frontend only.** Mock all data. No backend wiring. No new env vars required to run.
- **Honor the user's provided API contract exactly.** Field names, enum values, pagination shape, error shape, currentUserAccess enum.
- **Next 16 App Router + Tailwind v4 + shadcn/ui + framer-motion + next-intl.** Keep the existing foundation.
- **No Redux/Zustand/CSS-in-JS.** SWR or TanStack Query for data (SWR chosen — smaller footprint, simpler mental model, works offline via localStorage for mock data).
- **Auth via NextAuth.js hook shape** (`useSession()` with the specified user object). Mock locally.
- **WCAG 2.2 AA from day 1.**
- **18+ age gate at signup.** Sidesteps COPPA/GDPR-K.
- **i18n via next-intl, EN + TR at launch**, DE/ES/JA structured as empty dictionaries ready for translation.

## 3. Actor model (10 roles)

| Role | Capabilities | Gating |
|---|---|---|
| Visitor | Browse, search, copy install commands, install free items | None |
| User | + save, follow, vote, comment, purchase | Email verify + 18+ |
| Pro | + private collections, install history, early access, advanced filters | $8/mo, UI present but paywall dormant at launch |
| Builder | + publish FREE items only | User + verified email |
| Seller (Trader) | + publish PAID items, receive payouts | Builder + 50 verified installs on a free item + Stripe Connect Express + DSA Art 30 trader KYC |
| Certified Dev | + write verified-install reviews, earn 2-3% reviewer cut on badged items | 200+ rep OR peer-vouched by 3 Certified Devs OR staff-approved |
| Team | Multi-seat org, shared publishing, shared earnings split | Any Seller creates an org |
| Verified Team | + Certified Dev privileges at team level | Staff review |
| Maintainer | Claim listings tied to verified GitHub repos, add paid extensions, set fork policy | Verified GitHub OAuth + repo ownership |
| Admin | Everything | Platform staff |

## 4. Trust system

**Item badges** (shown on cards and detail pages, stackable):

| Badge | Earned how |
|---|---|
| `Verified` | Staff review + malware scan + install test — required for paid items |
| `Maintainer Verified` | Claimed by the original OSS author via GitHub OAuth |
| `Editor's Pick` | Monthly staff curation |
| `Quality A/B/C` | Measured: token efficiency, schema cleanliness, install success, freshness, review score, security pass |
| `Popular` | 500+ verified installs in 30d |
| `Updated` | Last update <90d |
| `New` | Created <14d |
| `Official` | First-party RuleSell item |
| `Featured` | Paid placement — clearly labeled as sponsored |
| `License` | SPDX badge — MIT, Apache-2.0, GPL-3.0, CC-BY-NC, Commercial, etc. |

**Creator marks** (on avatars and profiles):

| Mark | Earned how |
|---|---|
| Reputation level | Newcomer → Member → Contributor → Trusted → Expert → Authority |
| `Verified Creator` ring | Email + domain + 2FA |
| `Trader` badge | DSA Art 30 KYC complete — required for paid sellers |
| `Certified Dev` ring | Earned reviewer status |
| `Pro` ring | Active Pro subscription |
| `Team` mark | Member of a verified team |
| `Maintainer` mark | Owns at least one verified GitHub project |
| `Top Rated` | 4.5+ rating across 20+ items |

**Quality Score** — 0-100, the default marketplace sort. Measured from:
- Token efficiency (MCP servers — actual measured token count)
- Install success rate (CLI telemetry — v2 for real data, v1 shows mock values)
- Schema cleanliness / JSON validation
- Freshness (days since last update)
- Weighted review score (reviewer reputation)
- Security scan pass (VirusTotal + Semgrep + sandbox)

## 5. Data model

The existing user-provided API contract is **the source of truth**. We extend it minimally only where the research requires new fields. All extensions are additive; none break the contract.

### 5.1 Core enums (honor the contract exactly)

```ts
// From user's required contract
export type Platform =
  | 'CURSOR' | 'VSCODE' | 'OBSIDIAN' | 'N8N' | 'MAKE'
  | 'CLAUDE' | 'CHATGPT' | 'GEMINI' | 'CUSTOM';

export type Type =
  | 'RULESET' | 'PROMPT' | 'WORKFLOW' | 'AGENT' | 'BUNDLE' | 'DATASET';

export type Role = 'USER' | 'PRO' | 'ADMIN';

export type AccessLevel =
  | 'PUBLIC' | 'FREE_DOWNLOAD' | 'PURCHASED'
  | 'SUBSCRIPTION_ACTIVE' | 'SUBSCRIPTION_EXPIRED'
  | 'REFUNDED' | 'AUTHOR';

export type Status = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'REMOVED';
```

### 5.2 Extensions (research-required, additive)

```ts
// Categories drive URLs and taxonomy. Primary + secondary.
export type Category =
  | 'RULES' | 'MCP_SERVER' | 'SKILL' | 'AGENT_TEAM' | 'WORKFLOW'
  | 'PROMPT' | 'CLI' | 'DATASET' | 'BUNDLE';

// Specific target client for a variant — finer than Platform.
export type Environment =
  | 'claude-code' | 'claude-desktop' | 'cursor' | 'windsurf' | 'cline'
  | 'continue' | 'zed' | 'codex' | 'chatgpt' | 'gemini-cli' | 'aider'
  | 'copilot' | 'n8n' | 'make' | 'obsidian' | 'custom';

// Render hint for the variant payload.
export type VariantKind =
  | 'mcp_json' | 'claude_skill' | 'cursor_rule' | 'system_prompt'
  | 'n8n_workflow' | 'make_blueprint' | 'crewai_agent' | 'langgraph_agent'
  | 'bash_install' | 'npm_install' | 'docker_compose' | 'raw_file';

export type InstallMethod = 'copy' | 'download' | 'command' | 'json_snippet';
```

### 5.3 Variant

```ts
export interface Variant {
  id: string;
  environments: Environment[];   // one variant can cover multiple clients
  kind: VariantKind;
  label: string;                  // "Claude Code · Cursor · Windsurf"
  version: string;                // independent semver
  install: {
    method: InstallMethod;
    content: string;              // the actual code/config blob
    targetPath?: string;          // "~/.cursor/mcp.json" — rendered as paste target
    language?: string;            // syntax highlight hint
  };
  instructions?: string;          // markdown
  requirements?: { key: string; constraint: string }[];
  isPrimary?: boolean;
  qualityScore?: number;          // 0-100, measured per-variant
  lastTestedAt?: string;          // ISO timestamp
}
```

### 5.4 Ruleset (the primary entity)

```ts
export interface RulesetAuthor {
  username: string;
  avatar: string | null;
  reputation: number;
  creatorMarks: CreatorMark[];
  level: ReputationLevel;
}

export interface RulesetTeam {
  slug: string;
  name: string;
  avatar: string | null;
  verified: boolean;
}

export interface MaintainerClaim {
  githubRepo: string;               // "anthropics/skills"
  claimedAt: string;
  verified: boolean;
}

export interface QualityBreakdown {
  tokenEfficiency: number | null;   // null if not measurable for this type
  installSuccess: number | null;
  schemaClean: number | null;
  freshness: number;
  reviewScore: number;
  securityPass: boolean;
}

export interface Ruleset {
  // Contract fields (exact names, do not rename)
  id: string;
  slug: string;
  title: string;
  description: string;
  previewContent: string;
  platform: Platform;
  type: Type;
  category: Category;               // this IS the primary category; there is no separate primaryCategory field. The contract's `category` field is reused as the primary.
  tags: string[];
  price: number;                    // cents
  currency: string;                 // ISO-4217
  downloadCount: number;
  purchaseCount: number;
  viewCount: number;
  avgRating: number;
  ratingCount: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
  author: RulesetAuthor;
  currentUserVoted: boolean;
  currentUserSaved: boolean;
  currentUserAccess: AccessLevel;

  // Additive extensions
  secondaryCategories: Category[];  // max 2
  variants: Variant[];
  defaultVariantId: string;
  version: string;                  // product-level semver
  license: string;                  // SPDX identifier
  qualityScore: number;             // 0-100
  qualityBreakdown: QualityBreakdown;
  badges: ItemBadge[];
  team?: RulesetTeam;
  maintainerClaim?: MaintainerClaim;
  scanResults?: {
    virusTotalPass: boolean;
    semgrepPass: boolean;
    sandboxPass: boolean;
    scannedAt: string;
  };
}
```

### 5.5 User

```ts
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  role: Role;                       // USER | PRO | ADMIN
  reputation: number;
  level: ReputationLevel;
  creatorMarks: CreatorMark[];
  joinedAt: string;
  isAdultConfirmed: boolean;        // 18+ gate
  countryOfResidence: string;       // ISO-3166, for tax + sanctions
  preferredEnvironments: Environment[];  // from tool picker
  builderStats?: {
    publishedCount: number;
    verifiedInstallCount: number;
    canSellPaid: boolean;            // true after 50 verified installs
  };
  sellerStats?: {
    traderVerified: boolean;
    stripeConnectStatus: 'none' | 'pending' | 'verified';
    totalEarnings: number;            // cents
  };
  maintainerRepos?: string[];       // GitHub slugs
}
```

### 5.6 Review

```ts
export interface Review {
  id: string;
  rulesetId: string;
  author: RulesetAuthor;
  rating: number;                   // 1-5
  title: string;
  body: string;                     // markdown
  verifiedInstall: boolean;         // only verified-install reviews are allowed
  environmentTested: Environment;
  helpfulCount: number;
  currentUserMarkedHelpful: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 5.7 Pagination and error shapes (exact to contract)

```ts
export interface Page<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor?: string;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

## 6. Information architecture (routes)

All routes are under `src/app/[locale]/` to preserve next-intl.

### 6.1 Public routes

| Route | Data source | Purpose |
|---|---|---|
| `/` | GET `/api/rulesets?tab=top&page=1` + onboarding check | Landing + marketplace fused. If user has no `preferredEnvironments` → shows funnel strip above grid. |
| `/browse` | GET `/api/rulesets?platform=&type=&category=&page=` | Full marketplace with sidebar filters |
| `/browse/trending` | GET `/api/rulesets?tab=trending` | Trending shelf |
| `/browse/new` | GET `/api/rulesets?tab=new` | Recently published |
| `/browse/top` | GET `/api/rulesets?tab=top` | Top by Quality Score |
| `/browse/free` | GET `/api/rulesets?price=free` | Free-only filter |
| `/browse/paid` | GET `/api/rulesets?price=paid` | Paid-only filter |
| `/category/[slug]` | GET `/api/rulesets?category=` | Category browse |
| `/environment/[slug]` | GET `/api/rulesets?environment=` | Environment-specific shelf |
| `/collections` | GET `/api/collections` | Curated collections grid |
| `/collections/[slug]` | GET `/api/collections/[slug]` | Single collection |
| `/search` | GET `/api/rulesets?q=&platform=&type=&price=&sort=` | Search with URL-synced state |
| `/r/[slug]` | GET `/api/rulesets/by-slug/[slug]` | Ruleset detail — hero + variant tabs + reviews |
| `/u/[username]` | GET `/api/users/[username]` | Creator profile |
| `/team/[slug]` | GET `/api/teams/[slug]` | Team profile |
| `/leaderboard` | GET `/api/leaderboard` | Top 100 by Quality Score — mcpmarket copy |

### 6.2 Auth routes

| Route | Purpose |
|---|---|
| `/signin` | NextAuth sign-in (mocked) |
| `/signup` | Email + username + 18+ age gate |
| `/onboarding` | Tool picker (skippable, post-signup) — writes `preferredEnvironments` |

### 6.3 Dashboard routes (auth required)

| Route | Data source | Purpose |
|---|---|---|
| `/dashboard` | redirect to overview | — |
| `/dashboard/overview` | GET `/api/analytics/overview` | Stats cards + recent activity |
| `/dashboard/rulesets` | GET `/api/rulesets?authorId=me` | Creator's items (builder + seller) |
| `/dashboard/rulesets/new` | — | Publishing wizard |
| `/dashboard/rulesets/[id]/edit` | GET `/api/rulesets/[id]` | Edit item |
| `/dashboard/rulesets/[id]/analytics` | GET `/api/analytics/ruleset/[id]` | Per-item analytics |
| `/dashboard/earnings` | GET `/api/analytics/earnings` | Earnings chart + payout history |
| `/dashboard/purchases` | GET `/api/purchases` | Purchased items list |
| `/dashboard/saved` | GET `/api/saved` | Saved items |
| `/dashboard/following` | GET `/api/following` | Followed creators |
| `/dashboard/reviews` | GET `/api/reviews?authorId=me` | Reviews written |
| `/dashboard/team` | GET `/api/team/me` | Team management (v1 = profile view only, v2 = seat mgmt) |
| `/dashboard/settings` | GET `/api/users/me` | Profile, env prefs, notifications |
| `/dashboard/settings/seller` | GET `/api/seller/status` | Trader KYC + Stripe Connect + upgrade to Seller |
| `/dashboard/settings/privacy` | GET `/api/users/me/privacy` | DSR (export, delete), GPC, cookie prefs |
| `/dashboard/settings/billing` | — | Pro subscription (UI teaser, paywall dormant) |

### 6.4 Legal + compliance routes

| Route | Purpose |
|---|---|
| `/legal/terms` | Terms of Service |
| `/legal/privacy` | Privacy Policy |
| `/legal/cookies` | Cookie Policy |
| `/legal/acceptable-use` | Acceptable Use Policy |
| `/legal/dmca` | DMCA Policy + takedown form |
| `/legal/creator-agreement` | Creator Agreement |
| `/legal/accessibility` | Accessibility statement (WCAG 2.2 AA) |
| `/legal/transparency` | DSA Art 15 annual report + Art 24(2) monthly EU counter |
| `/report/[targetType]/[targetId]` | DSA Art 16 notice-and-action form |

### 6.5 Helper routes (agent-native)

| Route | Purpose |
|---|---|
| `/llms.txt` | Agent-readable site map |
| `/llms-full.txt` | Agent-readable full catalog |
| `/r/index.json` | Registry index |
| `/r/[slug].json` | Per-ruleset install JSON |
| `/api/mcp` | MCP server endpoint (4 tools: search, get, list, install) |

## 7. Component architecture

```
src/
├── app/
│   └── [locale]/
│       ├── (public)/              → landing, browse, detail, search, profiles
│       ├── (auth)/                → signin, signup, onboarding
│       ├── (dashboard)/           → all dashboard routes, shared layout
│       ├── (legal)/               → legal pages, shared minimal layout
│       └── layout.tsx             → root: providers, header, footer, cookie banner
├── components/
│   ├── ui/                        → shadcn primitives (Button, Input, Card, Badge, Dialog, Tabs, ...)
│   ├── marketplace/               → RulesetCard, FilterSidebar, TabBar, ToolPicker, CategoryChips, QualityBar, Leaderboard
│   ├── ruleset/                   → DetailHero, VariantTabs, InstallBlock, ReviewList, ReviewForm, RelatedGrid, CodePreview, BadgeStack
│   ├── dashboard/                 → StatsCard, EarningsChart, RulesetTable, PublishWizard, KycForm, PayoutHistory
│   ├── creator/                   → ProfileHero, RulesetGrid, FollowButton, ReputationBar, CreatorMarks
│   ├── team/                      → TeamHero, TeamRulesetGrid
│   ├── compliance/                → CookieBanner, ReportDialog, DsrExportDialog, DeletionDialog, AgeGate, LicenseWarning
│   ├── shared/                    → Header, Footer, MobileNav, Sidebar, SearchBar, EmptyState, ErrorState, LoadingSkeleton
│   └── motion/                    → MotionProviders, FadeIn, ScrollReveal, MicroInteractions
├── lib/
│   ├── api/                       → client (SWR fetcher), endpoints, types
│   ├── auth/                      → NextAuth mock, useSession hook wrapper
│   ├── i18n/                      → next-intl config
│   ├── mock/                      → mock data generators, fixtures
│   ├── quality/                   → quality score calculator, level calculator
│   └── utils.ts                   → cn, formatters
├── hooks/
│   ├── use-rulesets.ts            → SWR wrapper for lists
│   ├── use-ruleset.ts             → SWR wrapper for detail
│   ├── use-user.ts
│   ├── use-environment.ts         → preferredEnvironments state (localStorage for guests, server for users)
│   ├── use-saved.ts
│   └── use-cookie-consent.ts
├── types/
│   └── index.ts                   → everything from §5
└── constants/
    └── mock-data.ts               → seeded mock rulesets, users, reviews, teams
```

## 8. Key UI patterns

### 8.1 Landing (/)

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo RuleSell]     Browse ▾  Sell  Docs       [Sign in] 🌐│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   Stop writing rulesets from scratch.                        │
│   Verified assets for AI-assisted development.               │
│                                                               │
│   [ 🔍 Search 2,847 verified assets... ]                     │
│                                                               │
│   What do you use?                                            │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│   │CC   │ │Cursor│ │Wind │ │Cline│ │Codex│ │n8n  │ │Skip→│  │
│   └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  01 / TOP FOR YOU                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                   │
│  │Card│ │Card│ │Card│ │Card│ │Card│ │Card│                   │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                   │
│                                                               │
│  02 / EDITOR'S PICKS                                          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                   │
│                                                               │
│  03 / NEW THIS WEEK                                           │
│  ...                                                          │
│                                                               │
│  04 / COLLECTIONS                                             │
│  (curated bundles, larger tiles)                              │
└─────────────────────────────────────────────────────────────┘
```

Claudemarketplaces' numbered section treatment (01/02/03) is the visual signature. Tool picker is a persistent strip, not a modal. Multi-select, stored in `localStorage` for guests.

### 8.2 Ruleset detail (/r/[slug])

```
┌─────────────────────────────────────────────────────────────┐
│ ← Browse / MCP Server / server-slug                          │
├─────────────────────────────────────────────────────────────┤
│  [icon] Title                    [Badges: Verified Quality-A]│
│          by @author · @team                                  │
│          Description (1-2 sentences)                         │
│                                                               │
│          ⭐4.8 (142)  ↓12.4K  ⚡ 98 QS  🔄 5d  MIT           │
│                                                               │
│          [ Save ] [ Follow ] [ Fork ] [ Report ]             │
│                                                               │
│                                      [Price: Free | $19]     │
│                                      [Install ⬇]             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  INSTALL                                                      │
│  [Claude Code] [Cursor] [Windsurf] [Cline] [Manual]          │
│                                                               │
│  Target: ~/.claude/mcp_servers.json                          │
│  ┌─────────────────────────────────────────────────────┐     │
│  │ {                                                    │     │
│  │   "mcpServers": { ... }                              │     │
│  │ }                                                    │     │
│  └─────────────────────────────────────────────────────┘     │
│  [📋 Copy]  [npm command] [Open in CLI]                      │
│                                                               │
│  Instructions (markdown)                                      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  ABOUT                                                        │
│  Full description (markdown)                                  │
│  Quality breakdown: [Token ██████░ 85]                       │
│                     [Schema ███████ 100]                     │
│                     [Freshness ███████ 95]                   │
│                     [Reviews ██████░ 82]                     │
│                     [Security ✓ Passed]                      │
│                                                               │
│  License: MIT · SPDX identifier                              │
│  ⚠️ Commercial use allowed                                    │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  REVIEWS (verified-install only)                              │
│  [Write a review] (if you've installed it)                   │
│  ┌──────────────────────────────────────────────┐            │
│  │ ⭐⭐⭐⭐⭐ @certified-dev on Claude Code      │            │
│  │ "..."                                         │            │
│  └──────────────────────────────────────────────┘            │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  RELATED (compatible with your tools)                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                                 │
└─────────────────────────────────────────────────────────────┘
```

**Variant tabs are scoped to the Install section only.** Hero, description, reviews, and related are variant-agnostic. This is Smithery's proven pattern.

### 8.3 Dashboard (e.g. /dashboard/rulesets)

Standard table layout with:
- Tabs: All / Published / Draft / Pending Review / Unpublished
- Row: title, status, quality score, installs, revenue (if paid), last updated, actions
- Bulk actions: publish, unpublish, delete
- Top-right: [+ New Ruleset] CTA
- Empty state: contextual ("You haven't published anything yet. Builders publish free items; Sellers unlock paid items after 50 verified installs.")

### 8.4 Publishing wizard (/dashboard/rulesets/new)

5-step wizard:
1. **Type & Category** — Type (RULESET/PROMPT/…) + primary Category + up to 2 secondary
2. **Content** — Title, description, preview, tags, full markdown description, screenshots
3. **Variants** — Add variants one per environment. Each: label, environments multi-select, kind, install method, content paste, target path
4. **Compatibility & License** — SPDX license picker, compatibility matrix confirmation, requirements list
5. **Pricing** — Free or Paid (disabled until 50 verified installs + Seller KYC). Price, subscription toggle, team pricing

Draft auto-saves to mock localStorage. Publish → `PENDING_REVIEW` → mocked approval.

### 8.5 Cookie banner, report dialog, DSR dialogs

Non-intrusive but visible. Equal-weight buttons. Logged to mock `consent_events` for the mock layer.

## 9. States (mandatory for every page)

Every page MUST handle:
- **Loading** — skeleton cards (not spinners). Matches the grid layout.
- **Error** — inline error block with retry button. Uses `ApiError.error.message`.
- **Empty** — contextual message + CTA. Never "No results."
- **Auth-gated** — check `currentUserAccess`, not `role`, for item-level gating.

## 10. Motion and polish

Per user brief: *creative, minimalist, little cute animations, feedback in all areas*.

- **Page transitions** — framer-motion `AnimatePresence` with a soft fade+slide.
- **Card hover** — subtle lift (2px translate + shadow glow in the category color).
- **Tool picker click** — pill scale bounce (1.0 → 1.08 → 1.0) + subtle haptic-feel.
- **Copy button** — checkmark morph + confetti burst on copy (micro, not gaudy).
- **Install flow** — variant tab switch as a soft slide with color accent.
- **Quality score bar** — animate from 0 to value on scroll reveal.
- **Badge stack** — stagger in on card appearance.
- **Scroll reveals** — fade+slide for section entries on scroll.
- **Empty states** — small illustrated mascot (cute, not generic).

Motion tokens defined centrally in `lib/motion.ts`. Reduced-motion media query honored everywhere.

## 11. Mock data strategy

- **Seed 60 rulesets** across all categories and types — port the existing 35 real GitHub repos + add 25 new fixtures that exercise edge cases (multi-variant, team-authored, Maintainer-claimed, subscription-priced, bundled).
- **Seed 20 users**: 5 buyers, 5 builders, 5 sellers, 3 certified devs, 2 team-owning maintainers.
- **Seed 5 teams**.
- **Seed 40 reviews** (verified install only).
- **Seed 8 curated collections**.
- **Fixed Quality scores** pre-computed for v1. Real measurement in v2.
- **All data lives in `src/constants/mock-data.ts`** and is served through a `src/lib/api/mock-server.ts` that mimics the real API contract (pagination shape, error shape).
- **Session user is mocked via NextAuth** with a toggle in a dev-only `/dev/users` page to switch between personas (Visitor / User / Builder / Seller / Certified Dev / Team Owner / Admin).

## 12. Compliance checklist (baked into UI)

All 15 launch gates. Each is a component or page that must exist.

| Gate | Implementation |
|---|---|
| Cookie banner | `components/compliance/CookieBanner.tsx` — equal-weight Accept/Reject/Customize, writes to localStorage `consent_events` |
| Privacy Policy | `/legal/privacy` |
| Terms of Service | `/legal/terms` |
| Cookie Policy | `/legal/cookies` |
| Acceptable Use | `/legal/acceptable-use` |
| DMCA Policy | `/legal/dmca` |
| Creator Agreement | `/legal/creator-agreement` |
| 18+ age gate | `signup` form requires date of birth; under-18 blocked |
| Report button | `components/compliance/ReportDialog.tsx` — appears on every listing, review, profile via a context menu |
| DSR export + delete | `/dashboard/settings/privacy` — "Export my data" + "Delete my account" self-serve |
| GPC header honor | `middleware.ts` reads `Sec-GPC: 1` and applies opt-out |
| Accessibility statement | `/legal/accessibility` |
| Transparency page | `/legal/transparency` — DSA Art 15 report placeholder + Art 24(2) monthly counter |
| License declaration required | Publishing wizard enforces SPDX picker; incompatibility warnings shown on non-commercial-license paid attempts |
| Geo-block sanctioned countries | `signup` form blocks Cuba, Iran, NK, Syria, Crimea/DNR/LNR |

**WCAG 2.2 AA** is enforced via:
- Color contrast tokens — design system passes 4.5:1 text / 3:1 UI
- Keyboard navigation — visible focus rings, tab order, skip links
- Screen reader labels — every interactive element
- aria-live regions for form errors, loading states, confirmations
- Lighthouse run in CI (via Chrome DevTools MCP during iteration)

## 13. i18n

- **Launch locales**: EN (default), TR
- **Structured but empty**: DE, ES, JA
- All copy lives in `messages/<locale>.json`
- URL prefix strategy: `/en/browse`, `/tr/browse` — EN is default with `localeDetection: false` for clean URLs on the default locale

## 14. Delete list (stripping the old codebase)

**Delete:**
- `src/app/[locale]/marketplace/`, `dashboard/`, `profile/`, `certified/`, `collections/`, `feed/`, `compare/`, `seller/`, `affiliate/`, `admin/`, `pricing/`, `blog/`, `docs/`, `help/`, `legal/`, `contact/`, `support/`, `settings/`, `notifications/`, `auth/` (all page files and their subdirectories)
- `src/components/marketplace/*`, `src/components/community/*`, `src/components/landing/*`
- `src/types/index.ts`, `src/types/community.ts`, `src/types/database.ts`
- `src/constants/mock-data.ts`
- `src/lib/dal/*`
- `src/app/actions/*`
- `src/lib/marketplace-discovery.ts`, `marketplace-ranking.ts`, `product-evaluation.ts`, `product-taxonomy.ts`
- `supabase/` migrations (they'll be regenerated by backend team against new schema)

**Keep:**
- `src/app/[locale]/layout.tsx` (rewrite but keep location)
- `src/components/ui/*` (shadcn primitives)
- `src/components/providers/*` (theme, next-intl)
- `src/components/shared/clerk-wrapper.tsx` (conditional auth)
- `src/lib/utils.ts`
- `src/lib/auth.ts` (rewrite as NextAuth mock)
- `src/lib/supabase.ts`, `stripe.ts`, `r2.ts`, `email.ts` (keep as-is, not wired in v1)
- `src/i18n/*`
- `messages/*`
- `middleware.ts` (rewrite for locale + GPC header)
- `next.config.ts`, `tailwind.config` implicit via Tailwind v4, `postcss.config.mjs`
- `public/*` except product images (regenerate)
- `packages/rulesell-cli/` (keep, not touched in v1)
- `supabase/` keeping the folder existence for backend team but marking v1 schema in the spec

## 15. Quality score algorithm (v1 frozen values)

For v1, quality scores are pre-computed fixtures:

```
qualityScore = round(
  0.25 * tokenEfficiency      // null → 0.25 * 70
  + 0.15 * installSuccess     // null → 0.15 * 80
  + 0.15 * schemaClean         // null → 0.15 * 75
  + 0.15 * freshness           // days since update → decay curve
  + 0.20 * reviewScore         // weighted by reviewer rep
  + 0.10 * securityPass        // 100 if pass, 0 if fail
)
```

Fallbacks let every type (PROMPT, RULESET, etc.) still get a score even when some signals don't apply.

## 16. Out of scope (v2 explicitly)

- Real authentication (NextAuth mock only)
- Real payments (Paddle/LS + Stripe Connect)
- Real file storage
- Real content scanning (VirusTotal / Semgrep / sandbox)
- Real email sending
- Admin moderation queue UI
- Full Pro tier payment flow (UI teaser only)
- Team seat management (team profile view only)
- Subscription billing management UI (placeholder)
- Enterprise/internal team catalog (hinted in footer, deferred)
- Real MCP endpoint responses (stubbed)

## 17. Testing and verification

- Chrome DevTools MCP — render → screenshot → critique → iterate loop after each phase
- Lighthouse audit per page at 95+ accessibility, 90+ performance
- Manual keyboard navigation sweep for WCAG
- Contrast check via the design tokens, not per-component

## 18. Delivery phases (inform the plan, not the spec)

Phase breakdown belongs to the plan doc, but the spec sets expectations:
1. Strip old code + foundation setup
2. Types, mock data, API mock layer
3. Design tokens, ui primitives extension, motion system
4. Shared layout (header, footer, cookie banner, providers)
5. Landing + marketplace grid + tool picker + filters
6. Ruleset detail + variant tabs + install blocks + reviews
7. Creator profile + team profile + leaderboard + collections
8. Dashboard (overview, rulesets, earnings, purchases, saved, settings)
9. Publishing wizard
10. Legal pages + compliance UI
11. i18n sweep for EN + TR
12. Motion pass + visual polish + Lighthouse/a11y verification

## 19. Success criteria

- Landing page loads in <2s, first asset visible in <15s
- Every page has loading, error, empty states
- All 15 compliance gates present and functional (mocked)
- Lighthouse accessibility ≥ 95 on all pages
- Zero TypeScript errors
- Zero ESLint errors
- Mock data serves all documented routes
- Developer can switch personas via `/dev/users` and see correct `currentUserAccess` gating
- Visual critique passes "swap test" (cannot be swapped for a generic template)
- Motion design feels distinctively RuleSell (category-colored, cute but minimal)

---

## Appendix A — Color palette and tokens (directional)

**Dark mode first** (dev tool convention). Category accents map consistently across cards, badges, and install tabs:

- RULES — `blue-500` (#3b82f6)
- MCP_SERVER — `emerald-500` (#10b981)
- SKILL — `amber-500` (#f59e0b)
- AGENT_TEAM — `violet-500` (#8b5cf6)
- WORKFLOW — `orange-500` (#f97316)
- PROMPT — `pink-500` (#ec4899)
- CLI — `cyan-500` (#06b6d4)
- DATASET — `teal-500` (#14b8a6)
- BUNDLE — `rose-500` (#f43f5e)

Accent for the brand: a warm, distinctive signature color — **`#FFD166`** (amber-gold) for CTAs and key interactive elements, ensuring it's not competing with category colors.

Surface tokens: `bg-zinc-950` base, `bg-zinc-900` surface, `bg-zinc-800` raised, `border-zinc-800` dividers, `text-zinc-100` body, `text-zinc-400` muted.

## Appendix B — Key research citations

- `docs/research/2026-04-08-SYNTHESIS.md` — full synthesis
- `docs/research/2026-04-08-competitor-teardown.md` — 19 marketplace teardown
- `docs/research/2026-04-08-global-compliance-landscape.md` — 14 regulatory domains
- `docs/research/2026-04-08-multi-environment-versioning.md` — data model justification
- `docs/research/2026-04-08-onboarding-funnel-patterns.md` — landing + funnel justification
- `docs/research/2026-04-08-trust-and-creator-economics.md` — pricing + trust justification
- `docs/research/2026-04-08-user-demand-signals.md` — direct user quotes

---

**Spec status: ready for plan.**
