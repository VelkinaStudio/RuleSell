# 2026-04-11 — Autonomous Run Plan (5h)

Owner: Claude (autonomous). Approved by: Nalba (direct instruction in chat, 2026-04-11 ~03:20 local). Wake time: ~08:30 local.

## Context on entry

- **Railway deployment is live and healthy.** `https://rulesell-production.up.railway.app` responds 200, health endpoint returns ok, most recent deploy succeeded at 02:42 today. All env vars are set on Railway including real OAuth, LemonSqueezy, and NextAuth secrets.
- **Repo is clean** on `master`, synced with `origin`, last commit is `6aa0927 docs: update HANDOFF.md with complete current state`.
- **Build is green**: `npx prisma generate && npx next build` completes with exit code 0. Prisma client generated at `src/generated/prisma`. Full route tree compiles.
- **Frontend overhaul from earlier today is done.** 8-phase plan executed across 3 commits, 142 files, +11,900 lines. Branding, landing, affiliate, community, github integration, admin dashboard, mobile nav, and polish all shipped.

## Goal

Keep Railway running untouched as the fallback backend, layer Vercel in front as the new primary frontend, and use the remaining time to raise the project from "deployed" to "market-ready": SEO, seed content, launch materials, and permanent Claude Code knowledge capture via new engines and agents.

## Guardrails (hard rules)

1. **DO NOT break the Railway deployment.** No destructive Railway actions — no service deletion, no Postgres drop, no env var removal. Only add/update.
2. **DO NOT commit secrets.** OAuth client secrets, LemonSqueezy keys, NextAuth secret, DATABASE_URL — none of these go into git-tracked files. They're already on Railway; I read them from there and pipe to Vercel CLI.
3. **Vercel as frontend, Railway Postgres as the database.** Next.js is fullstack so the entire app deploys to Vercel. Railway's `RuleSell` service stays running as fallback. Railway's `Postgres` service remains the single source of truth — Vercel reaches it via the public proxy hostname, not the internal one.
4. **Small, focused, buildable commits.** No force-push. No mass refactors. Every commit leaves the app in a working state.
5. **Evidence before claims.** Before writing "done" in any file, run the verification flow: hit the URL, read the response, capture a screenshot, paste the log line.
6. **Clean up after myself.** Stale files get deleted. No draft or intermediate files left behind.

## Phases

### Phase A — Vercel infrastructure (target 60 min)

- A1. Install Vercel CLI via `npm i -g vercel`.
- A2. Attempt `vercel login`. If non-interactive blocks, document a one-liner for Nalba and skip ahead — Railway is already live so this is not blocking anything.
- A3. `vercel link` to create a new project from the current directory, scoped to whichever team Nalba's account belongs to.
- A4. Set the minimum env set on Vercel (production scope):
  - `DATABASE_URL` — Railway Postgres public proxy URL
  - `NEXTAUTH_SECRET` — reuse the value from Railway, via piped `vercel env add`
  - `NEXTAUTH_URL` — placeholder preview URL first, flip to prod domain after cutover
  - `NEXT_PUBLIC_APP_URL` — same
  - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `LEMONSQUEEZY_*` — pulled from Railway via `railway variables`
  - Skip Cloudflare R2 / Resend / Upstash — empty strings are OK for first deploy, app falls back to mock mode
- A5. `vercel --prebuilt=false` preview deploy, capture URL.
- A6. Verification loop (browser → API → DB → response) on the preview URL.

### Phase B — Live audit (target 45 min)

Run Chrome DevTools MCP against the Railway URL (not the new preview) for the audit. Railway is the known-stable baseline.

- B1. Navigate to `/en`, `/en/browse`, `/en/about`, `/en/trust`, `/en/legal/privacy`, `/en/signup`, `/en/explore`, `/en/dashboard`, `/en/affiliates`.
- B2. Capture: console errors, failed network requests, Largest Contentful Paint target element, total bytes, any 404s.
- B3. Lighthouse audit on `/en` and `/en/browse`. Target: a11y ≥ 95, perf ≥ 80, SEO ≥ 95.
- B4. Produce a triage list in `docs/notes/2026-04-11-live-audit.md` with severity tags.
- B5. Fix all P0 issues inline. P1 goes to morning brief.

### Phase C — SEO pass (target 60 min)

Currently missing (based on file scan): sitemap.xml, robots.txt, llms.txt, per-page canonical URLs, JSON-LD for Product/Organization/BreadcrumbList, dynamic OG images via next/og.

- C1. `src/app/sitemap.ts` — generate from ruleset list + static pages, include lastModified
- C2. `src/app/robots.ts` — allow all, sitemap link, block /api
- C3. `src/app/llms.txt/route.ts` — plain text map of the key product pages and API endpoints, formatted per the llms.txt spec
- C4. `generateMetadata` on ruleset detail pages, creator pages, category pages with title template, description, OG image, canonical
- C5. JSON-LD helpers in `src/lib/seo/json-ld.ts` — `makeProductSchema`, `makeOrganizationSchema`, `makeBreadcrumbSchema`. Render inline in the relevant Server Components
- C6. OG image route via `next/og` for rulesets — dynamic, themed, branded
- C7. Commit. Verify in DevTools — inspect the rendered HTML for JSON-LD and meta tags

### Phase D — New engines and agents (target 60 min)

The RuleSell product sells Claude Code knowledge. The Claude Code domain changes fast (skills, plugins, hooks, MCP, Codex, etc.). Without a captured, mandatory knowledge base, both the product and the author will drift. Create three new engines following the humane-design-engine pattern.

- D1. `~/.claude/plugins/local/claude-code-marketplace-engine/` with `SKILL.md`, `references/`, `scripts/`. Must include: real extension points (plugins/skills/hooks/commands/agents/MCP/settings), quality heuristics for rulesets (token efficiency, schema correctness, install test, security scan), anti-patterns list, reference catalog of top community skills
- D2. `~/.claude/plugins/local/digital-marketplace-engine/` — creator funnel stages, trust ladder, chargeback math, tax shorthand (VAT MOSS for EU, Paddle/LemonSqueezy MoR split), pricing psychology
- D3. `~/.claude/plugins/local/rulesell-launch-engine/` — product-specific playbook: first 10 listings, first 100 creators, content calendar, cold DM templates, HN/Reddit launch plan, metrics to track in the first 30 days
- D4. One new agent at `~/.claude/agents/claude-code-researcher.md` — opus model, can deeply research one specific Claude Code topic and return a publishable ruleset
- D5. Prune stale engine files if any conflict

### Phase E — Content and marketing pipeline (target 75 min)

- E1. Seed 10 first-party "Official" rulesets, real and useful. Stored as files in `docs/content/official-rulesets/` with a seed script at `scripts/seed-official-rulesets.ts` that can load them into the DB when Baha wires the publish flow. Examples: plugin.json schema guide, hook event reference, skill frontmatter guide, slash command conventions, agent creation checklist, MCP server starter, plugin validator template, cache-aware loop pattern, multi-agent orchestration template, CLAUDE.md best practices
- E2. Three launch blog posts at `src/content/blog/` (MDX):
  - "What RuleSell is and why we built it"
  - "How to publish your first Claude Code skill"
  - "Claude Code anti-patterns we reject"
  - Wire them to a simple /blog route if one doesn't exist, or draft standalone for Phase F decision
- E3. Landing page final polish — real install CLI demo (actual npm/git clone text animating), hero copy A/B options in comments
- E4. Go-to-market brief at `docs/marketing/launch-plan.md` — target list (ranked), cold DM templates, HN "Show HN" post text, Reddit r/ClaudeAI post text, Twitter/X thread, launch-day runbook (hour by hour), metrics board

### Phase F — Organization and self-improvement (target 30 min)

- F1. Clean up `D:/RulesetMarketplace-master` — remove any stale files surfaced by the audit
- F2. Clean up `~/.claude/projects/D--RulesetMarketplace-master/memory/` — archive old session files, keep current session + index
- F3. Clean up `~/.claude/` — remove any dangling motion-pipeline references mentioned as DELETED in MEMORY.md
- F4. Update `HANDOFF.md` with new state, new URLs, new outstanding items
- F5. Update global memory index with new engines
- F6. Reflect: look at the skills I wish I'd had today, note them in `~/.claude/evolution-log.json`

### Phase G — Morning brief (target 15 min)

Single `MORNING_BRIEF.md` at repo root. Sections:
- Live URLs (Vercel preview, Vercel prod if applicable, Railway fallback)
- What shipped tonight (one paragraph per phase)
- What needs your decision (domain, Stripe account, UK company, LemonSqueezy migration order)
- What's still broken and how much it'll cost to fix
- Links to every new doc, engine, and agent
- One "first action when you sit down" recommendation

## Timebox

Target: 5 hours total. If I'm running long on a phase, I cut scope and move on — morning brief lists the cut items.

## What I am not doing

- Registering the UK company (Nalba's job)
- Buying a domain (Nalba's job)
- Signing up for a Stripe account (Nalba's job)
- Migrating LemonSqueezy → Stripe (this is Baha's job per the existing handoff doc, and the live payment flow is LS)
- Wiring real search backend (Baha)
- Setting up Resend templates (Baha)
- Touching the Prisma schema beyond what SEO + seed scripts require
- Running expensive browser automation on third-party sites

## Success criteria

- Railway still green at end of run (zero regressions on the current URL)
- Vercel preview URL live and pointed at Railway Postgres, OR documented blocker (e.g., interactive login requirement)
- SEO infrastructure committed and verified via view-source inspection
- Three new engines present in `~/.claude/plugins/local/` with real content
- Ten seed rulesets present and reviewed
- `MORNING_BRIEF.md` tight enough that Nalba can act on it in 5 minutes
