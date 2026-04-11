# Live audit 2026-04-11

Target: https://rulesell.vercel.app (fresh Vercel deploy pointing at Railway Postgres)

## Scores (Lighthouse desktop, home page)

| Category | Score |
|---|---|
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

50 audits passed, 0 failed. Performance not measured here (use performance_start_trace).

## Routes audited

| Path | Status | Notes |
|---|---|---|
| `/` | ✅ | Hero, terminal demo, tool picker, all sections render correctly (scroll-reveal content present in DOM) |
| `/browse` | ✅ | Sidebar filters (9 categories), 10 verified assets, quality sort, pagination not tested |
| `/explore` | ✅ | 6-tab community feed with real-looking items, trending sidebar |
| `/leaderboard` | ✅ | Top 100 by Quality Score, podium top 3, rank list |
| `/r/database-optimization-checklist` | ✅ | Detail page with purchase panel, tabs, breadcrumb |
| `/signup` | ❌ → ✅ | was 404, added shim redirect to `/login?mode=register` |
| `/en/pricing` | N/A | Not in code, not referenced anywhere — OK to 404 |
| `/en/community` | N/A | Not in code, community lives under `/explore` — OK to 404 |

## Console errors

Zero on every page tested.

## Network

All `api/*` routes return 200. `api/auth/session` polled repeatedly (NextAuth's normal session check). No failed XHRs.

## SEO gaps (P1 — fixing tonight)

1. No `<link rel="alternate" hreflang>` in DOM (only in Link response headers)
2. No `<link rel="canonical">`
3. No Open Graph tags (og:title, og:description, og:image)
4. No Twitter Card meta
5. No JSON-LD structured data (need Product, Organization, BreadcrumbList)
6. No `/sitemap.xml` (verified 404)
7. No `/robots.txt` (verified 404)
8. No `/llms.txt`
9. No dynamic OG image generation

## Minor UI bugs

- Cookie banner overlaps the tool logo bar on home page (mobile/tablet worse) — z-index already max, just push banner lower or add margin-bottom to hero
- "Updated 1 days ago" singular/plural bug on ruleset detail page
- Cookie banner is not dismissable without clicking (no X button) — compliance requires explicit choice, so this might be intentional

## Framer-motion whileInView artifact

`HowItWorks`, `QualityShowcase`, `TrustStrip`, `CommunityPreview`, `FinalCTA` all use `whileInView` with `initial: 'hidden'`. This means:
- Real users see sections animate in as they scroll ✅
- Full-page screenshots show empty sections ❌ (headless observer never fires)
- **Unknown risk**: Google/Twitter/Facebook crawlers with limited JS execution may see hidden content and penalize

Not fixing tonight, but documenting for follow-up. The robust fix is to keep the `initial: hidden` but set `once: true` + `amount: 0` so any intersection fires immediately, OR ship content visible and animate in via a CSS-only technique.

## Good state

- Production build: green
- Railway deployment: still live and healthy
- Vercel deployment: READY, all critical routes 200, DB reachable
- Existing seed data: 10 rulesets from back-end team's prior seed, sufficient for demo
- Component density and craft across all pages is real — not generic template output
