# RuleSell — Project Handoff

**Last updated:** 2026-04-09
**Repo:** https://github.com/VelkinaStudio/RuleSell
**Local:** `D:/RulesetMarketplace-master/`

---

## ✅ v1 FRONTEND REBUILD COMPLETE — 2026-04-09

The full frontend rebuild approved on 2026-04-08 is **shipped**. Every page, state, and
launch gate is in place against the API contract Nalba provided. Backend team can
implement against these contracts; nothing else from this spec needs frontend work.

### What shipped (14 phases, 109+ commits)

| Surface | Routes | Lighthouse |
|---|---|---|
| Landing + marketplace | `/`, `/browse`, `/browse/{trending,new,top,free,paid}`, `/category/[slug]`, `/environment/[slug]`, `/search`, `/leaderboard`, `/collections`, `/collections/[slug]` | a11y 100 / bp 100 / seo 100 |
| Ruleset detail | `/r/[slug]` with variant tabs scoped to install section, copy-install, reviews, related grid | a11y 100 / bp 100 / seo 100 |
| Profiles | `/u/[username]`, `/team/[slug]` with all creator marks + reputation bar | a11y 100 / bp 100 / seo 100 |
| Dashboard | `/dashboard/{overview,rulesets,rulesets/new,rulesets/[id]/edit,earnings,purchases,saved,following,reviews,team,settings,settings/seller,settings/privacy,settings/billing}` | a11y 100 / bp 100 / seo 100 |
| Publishing wizard | 5-step wizard with localStorage drafts, SPDX license picker, paid-publish gate | included in dashboard |
| Legal + compliance | `/legal/{terms,privacy,cookies,acceptable-use,dmca,creator-agreement,accessibility,transparency}`, `/report/[targetType]/[targetId]` | a11y 100 / bp 100 / seo 100 |
| Dev | `/dev/users` (10-persona switcher, dev-only with noindex), `/dev/tokens` | a11y 100 / bp 100 (seo 60 = noindex by design) |

**i18n:** EN + TR with full translations, DE/ES/JA with English-fallback scaffolds via deep-merge.

**15 launch gates:** all present and verified — cookie banner, privacy/terms/cookies/AUP/DMCA/creator agreement pages, 18+ age gate, report button on every listing/review/profile, DSR self-serve, GPC honor middleware, accessibility statement, transparency page, SPDX license enforcement, geo-block.

**Mock data:** 60 rulesets across all 9 categories, 20 users across all 10 roles, 5 teams, 40 verified-install reviews, 8 curated collections.

### How to run

```bash
cd D:/RulesetMarketplace-master
npm install   # if not already done
npm run dev   # localhost:3000
```

No env vars required. Visit `/en` for the marketplace, `/en/dev/users` to switch personas and verify gated UI.

### Backend handoff contract

The mock API at `src/lib/api/mock-server.ts` is the contract. All routes consume it via SWR hooks in `src/hooks/use-*.ts`. Backend team implements the actual endpoints to match these signatures:

| Frontend hook | Backend endpoint to implement |
|---|---|
| `useRulesets({tab, platform, type, category, environment, price, sort, q, page})` | `GET /api/rulesets` |
| `useRuleset(slug)` | `GET /api/rulesets/by-slug/[slug]` |
| `useUser(username)` | `GET /api/users/[username]` |
| `useTeam(slug)` | `GET /api/teams/[slug]` |
| `useReviews(rulesetId)` | `GET /api/rulesets/[id]/reviews` |
| `useCollections()` / `useCollection(slug)` | `GET /api/collections` / `GET /api/collections/[slug]` |
| `useLeaderboard()` | `GET /api/leaderboard` |
| `useAnalyticsOverview()` / `useEarnings()` etc. | `GET /api/analytics/*` |

Auth: NextAuth.js. The mock session at `src/lib/auth/mock-session.ts` is shape-compatible with the real `useSession()` and `getServerSession()` — backend team replaces it with the real provider.

Pagination shape, error shape, AccessLevel/Platform/Type enums, Ruleset shape — all in `src/types/index.ts`. Honor those exactly.

### Reference docs

- **Design spec:** `docs/superpowers/specs/2026-04-08-rulesell-rebuild-design.md` (approved, source of truth)
- **Implementation plan:** `docs/superpowers/plans/2026-04-08-rulesell-rebuild-plan.md` (3094 lines, 320 checkbox steps, 13 phases)
- **Research synthesis:** `docs/research/2026-04-08-SYNTHESIS.md` (start here)
- **Research files:** `docs/research/2026-04-08-*.md` (6 deep-dives + synthesis + monitoring + citations)
- **Foundation traps:** `docs/notes/foundation-traps.md` (15 things to know before importing from `src/lib/api`, providers, hooks)
- **Compliance citations:** `docs/research/2026-04-compliance-citations.md` (DSA/GDPR/CCPA/COPPA/DMCA/OFAC article numbers for legal copy)
- **Visual gate evidence:** `tmp/phase{4,5,10,11,12}-*.png`

### Team that built this

5 parallel agents on a `rulesell-rebuild` team with shared task list:
- **planner (Opus)** — wrote the implementation plan (Phases 7-12 specifically; Phases 0-6 were drafted in a parallel terminal session before consolidation)
- **builder-core (Opus)** — Phases 0-4: strip + types + mock API + design tokens + providers + foundation
- **builder-market (Opus)** — Phases 5-7: marketplace + detail + variants + profiles + leaderboard + collections
- **builder-dash (Opus)** — Phases 8-9: dashboard + publishing wizard
- **builder-compliance (Opus)** — Phases 10-11: legal pages + 15 launch gates + i18n sweep + persona switcher
- **researcher (Explore)** — continuous monitoring, compliance citations
- **team-lead (me)** — coordination, visual gates, cross-builder fixes (i18n routing, useSyncExternalStore infinite loop, breadcrumb list semantics, formatPrice helper)

**Key incidents resolved during the build:**
- Stacked i18n routing bug at Phase 4 gate (middleware at wrong location, matcher pattern wrong, missing setRequestLocale) — fixed in `c3ce3e4` and `a47f3a8`
- React 19 useSyncExternalStore infinite loop in usePreferredEnvironments at Phase 5 gate — fixed in `fbf4642`
- Worktree-sharing post-mortem (parallel agents shared a single git index, causing two phantom-commit incidents) — see `docs/notes/foundation-traps.md` and the team-lead post-mortem in commit messages

---

## LEGACY STATE (pre-rebuild, for reference only)

## What Is This

RuleSell is an npm-style package registry for AI development configurations. Developers discover, install, and rate cursor rules, MCP servers, N8N workflows, Claude Code configs, system prompts, agent frameworks, and more.

**Core philosophy:** The CLI is the product, the website is the documentation. Community trust comes from certified developers who actually test packages — not fake reviews or influencer endorsements.

---

## Current State

### Working (Frontend)
- **Marketplace** = homepage. 35 real GitHub repos as products.
- **Search + category filters** with color-coded icons per category
- **Product detail** with install command (copy-to-clipboard), 1-5 star rating, code preview tab, certified-only reviews
- **CLI tool** at `packages/rulesell-cli/` — `npx rulesell install/search/list/info`
- **Agent-native:** `/llms.txt`, `/api/mcp` (4 tools), `/r/*.json` registry, JSON-LD on product pages
- **Community features:** creator profiles (`/profile/[username]`), collections (`/collections`), certified devs (`/certified`), activity feed (`/feed`), discussions on products, showcases, fork system
- **Auth scaffolding:** Clerk integration with conditional loading (works without env vars)

### Working (Backend Infrastructure — needs env vars to activate)
- **46 database tables** across 5 Supabase migrations (`supabase/migrations/`)
- **Clerk auth** — webhook sync, role-based helpers, conditional ClerkProvider
- **Stripe Connect** — checkout session creation, webhook handler, payout logic
- **Cloudflare R2** — file upload + presigned download
- **Meilisearch** — search index config ready
- **Resend** — 3 React Email templates (purchase, sale, product status)
- **Data Access Layer** (`src/lib/dal/`) — all queries fall back to mock data when Supabase not configured
- **Server Actions** (`src/app/actions/`) — products, reviews, seller, wishlist, community, trust, collections, forks

### NOT Working Yet
- **Real auth** — needs `CLERK_SECRET_KEY` + `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in Vercel env
- **Real database** — needs `NEXT_PUBLIC_SUPABASE_URL` + keys
- **Real payments** — needs Stripe keys
- **Real file storage** — needs R2 keys
- **CLI doesn't actually clone repos yet** — shows install instructions but doesn't execute
- **Remaining 25 products** need enriched descriptions (only top 10 have multi-paragraph + preview content)

---

## Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Next.js 16.1.6 (App Router) | Working |
| Language | TypeScript 5 | Working |
| Styling | Tailwind CSS v4 + shadcn/ui | Working |
| Animation | Framer Motion | Working |
| Auth | Clerk v7 | Scaffold only (needs keys) |
| Database | Supabase (PostgreSQL) | Schema ready (needs keys) |
| Payments | Stripe Connect Express | Routes ready (needs keys) |
| File Storage | Cloudflare R2 | Client ready (needs keys) |
| Search | Meilisearch Cloud | Config ready (needs keys) |
| Email | Resend + React Email | Templates ready (needs keys) |
| Analytics | PostHog | Not started |
| Hosting | Vercel | Deployed |
| i18n | next-intl (EN + TR) | Working |

---

## Key Files

### Core Pages
| File | What it does |
|------|-------------|
| `src/app/[locale]/page.tsx` | Redirects to `/marketplace` |
| `src/app/[locale]/marketplace/page.tsx` | Main marketplace — search, filter, sort, product list |
| `src/app/[locale]/marketplace/[slug]/page.tsx` | Product detail — install cmd, rating, preview, reviews |
| `src/app/[locale]/dashboard/page.tsx` | User dashboard — clean empty states |
| `src/app/[locale]/certified/page.tsx` | Certified developers directory |
| `src/app/[locale]/collections/page.tsx` | Browse collections |
| `src/app/[locale]/feed/page.tsx` | Activity feed |
| `src/app/[locale]/profile/[username]/page.tsx` | Creator profile |

### Components
| File | What it does |
|------|-------------|
| `src/components/marketplace/product-card.tsx` | npm-style list item with category-colored icon |
| `src/components/layout/header.tsx` | Compact header — RuleSell branding, 3 nav links |
| `src/components/layout/footer.tsx` | Single-row footer |
| `src/components/shared/clerk-wrapper.tsx` | Conditional Clerk components (no crash without keys) |
| `src/components/community/` | 12 community components (follow, discuss, badge, collection, showcase, fork) |

### Data
| File | What it does |
|------|-------------|
| `src/constants/mock-data.ts` | 35 real products, 2 reviews, 3 blog posts |
| `src/lib/dal/` | Data access layer — products, reviews, blog, community, trust, collections, forks |
| `src/app/actions/` | Server actions — products, reviews, seller, wishlist, community, trust, collections, forks |
| `src/types/index.ts` + `community.ts` + `database.ts` | All TypeScript types |

### Backend
| File | What it does |
|------|-------------|
| `src/app/api/mcp/route.ts` | MCP server endpoint (4 tools: search, get, list, install) |
| `src/app/api/checkout/route.ts` | Stripe Checkout Session creation |
| `src/app/api/webhooks/clerk/route.ts` | Clerk user sync webhook |
| `src/app/api/webhooks/stripe/route.ts` | Stripe payment webhook |
| `src/app/api/download/[orderItemId]/route.ts` | Secure file download |
| `src/lib/supabase.ts` | Supabase client (browser + service) |
| `src/lib/stripe.ts` | Stripe client |
| `src/lib/r2.ts` | R2 upload + presigned download |
| `src/lib/auth.ts` | getCurrentUser, requireAuth, requireSeller, requireAdmin |
| `src/lib/email.ts` | Resend wrapper with mock fallback |

### Agent-Native
| File | What it does |
|------|-------------|
| `public/llms.txt` | Site map for AI agents |
| `public/llms-full.txt` | Full product catalog for agents |
| `public/r/index.json` | Product registry index |
| `public/r/schema.json` | Registry JSON schema |
| `public/r/*.json` | Per-product install instructions (10 products) |
| `packages/rulesell-cli/` | CLI tool (`npx rulesell`) |

### Database
| File | What it does |
|------|-------------|
| `supabase/migrations/00001_initial_schema.sql` | Users, products, orders, reviews, notifications (20 tables) |
| `supabase/migrations/00002_community_foundation.sql` | Follows, discussions, tags, activity events (8 tables) |
| `supabase/migrations/00003_trust_layer.sql` | Certifications, badges, reputation (8 tables) |
| `supabase/migrations/00004_collections_showcases.sql` | Collections, showcases (4 tables) |
| `supabase/migrations/00005_fork_system.sql` | Fork requests, product forks, revenue shares (3 tables) |
| `supabase/seed.sql` | Seed data (11 users, 7 sellers, 8 products) — OUTDATED, needs update to match 35 products |

---

## Product Catalog (35 Products)

### By Category
| Category | Count | Examples |
|----------|-------|---------|
| RULESET | 7 | awesome-cursorrules (38.7K), RIPER-5, Devin-style, Java Enterprise, Godot |
| MCP | 11 | Official Anthropic (82K), Playwright (29K), GitHub (28K), Kubernetes, Terraform, Supabase, DBHub |
| WORKFLOW | 5 | Awesome N8N (20K), N8N Free Templates, ComfyUI, ComfyUI-to-Python, N8N Mega (5K+) |
| PROMPT | 3 | awesome-chatgpt-prompts (154K), System Prompts AI Tools (133K), Prompt Engineering Guide |
| SKILL | 4 | Claude Code System Prompts, N8N Skills, Trail of Bits Security, Hooks Mastery |
| AGENT_CONFIG | 4 | CrewAI Examples, Agency Swarm, Continuous Claude v3, Meridian |
| BUNDLE | 1 | Full Stack AI Dev Toolkit ($49 — only paid item) |

### Enriched (with multi-paragraph descriptions + preview content)
IDs 1-10: Awesome CursorRules, Devin-Style, RIPER-5, AI Prompts Multi-Tool, Agentic CursorRules, Official MCP Servers, Playwright MCP, GitHub MCP, Figma Context MCP, Awesome N8N Templates

### Need Enrichment
IDs 11-35: remaining 25 products have one-paragraph descriptions and no preview content

---

## Business Model

| Stream | Model | Status |
|--------|-------|--------|
| Commission | 15% on paid sales (tiered: 12% Silver, 10% Gold) | Backend ready |
| Reviewer cut | 2-3% from platform's 15% to certified reviewers | Designed, not built |
| Sponsored placements | CPM auction ($5 min) | Designed, not built |
| Featured listing | $15 one-time | Designed, not built |
| Pro subscription | $12/mo (deferred until 1K+ users) | Not built |

**Free forever:** Browsing, search, install, free product listings, discussions, collections, following.

---

## Community & Trust Design

### Certified Developer System
- **3 paths:** Manual approval → Reputation earned (200+ pts) → Peer nominated (3 certified devs vouch)
- **Privileges:** Badge products (Verified Working / Quality Reviewed / Recommended), earn 2-3% of badged product sales
- **Target:** 2-5% of active users

### Rating System
- **1-5 star rating** on product pages (anyone can rate)
- **Written reviews** restricted to certified developers and verified teams only
- **No anonymous noise** — every review carries the reviewer's name and reputation

### Reputation Points
| Action | Points |
|--------|--------|
| Give review | +5 |
| Helpful answer | +3 |
| Best answer | +10 |
| Product gets badge | +15 |
| Collection gets 10 followers | +8 |

**Levels:** Newcomer (0) → Member (15) → Contributor (50) → Trusted (150) → Expert (300) → Authority (500)

---

## Priority TODO

### Must-do before soft launch
1. Verify Vercel deployment works (middleware fixed, should be fine now)
2. Add Clerk env vars → real auth
3. Get 3-5 developer friends to test and give feedback

### Should-do soon
4. Make `npx rulesell install` actually clone/download repos
5. Enrich remaining 25 product descriptions
6. Add Supabase → persistent data
7. Connect real search (Meilisearch)

### Can wait
8. Stripe Connect for premium bundles
9. Email notifications
10. Automated quality scoring
11. Mobile responsiveness polish
12. Turkish locale updates for new community components

---

## Design Specs & Plans

| Document | Path |
|----------|------|
| Community platform spec | `docs/superpowers/specs/2026-03-28-community-platform-design.md` |
| Phase 1 implementation plan | `docs/superpowers/plans/2026-03-28-phase1-community-foundation.md` |
| Market-ready blueprint | `~/.claude/plans/transient-frolicking-graham.md` |
| UX research | `~/docs/research/developer-marketplace-ux-patterns-2026.md` |
| Marketplace survival research | `~/docs/research/developer-marketplace-survival-growth-2026.md` |
| Agent-native research | `~/docs/research/agent-native-website-patterns-2026.md` |
| Community mechanics research | `~/docs/research/community-driven-platform-mechanics-2026.md` |
| AI marketplace economics | `~/docs/research/ai-developer-tools-marketplace-economics-2026.md` |

---

## Key Decisions Made

1. **npm-style over SaaS-style** — list layout, install command hero, information density over whitespace
2. **CLI-first** — the tool works in the terminal, the website documents it
3. **Real repos over fake products** — 35 verified GitHub repos, not made-up listings
4. **Honest empty states** — "No certified reviews yet" instead of fake 5-star reviews
5. **Community trust over platform certification** — "community says this works" via certified devs
6. **No landing page** — homepage IS the marketplace, zero friction to browse
7. **Certified-only reviews** — restrict written reviews to vetted developers, not anonymous accounts
8. **Permission-based forking** — creators control who forks, with revenue share terms
9. **Agent-native from day 1** — llms.txt, MCP endpoint, JSON registry, CLI
10. **Free products welcome** — open source builds the ecosystem, paid bundles monetize later
