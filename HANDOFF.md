# RuleSell — Project Handoff

**Last updated:** 2026-04-11 (late night, after autonomous run)
**Repo:** https://github.com/VelkinaStudio/RuleSell
**Local:** `D:/RulesetMarketplace-master/`
**Live (Vercel — primary):** https://rulesell.vercel.app
**Live (Railway — fallback):** https://rulesell-production.up.railway.app

---

## Current State: Frontend complete, Vercel live, SEO shipped, signup works

### Tonight's autonomous run summary

6 commits on top of the 2026-04-11 earlier overhaul. Live site has been
verified end-to-end (visitor → signup → sign in → authenticated dashboard).

| What | Status |
|---|---|
| Railway deployment | ✅ Green, untouched, fallback is safe |
| Vercel deployment | ✅ Live at rulesell.vercel.app, pointing at Railway Postgres |
| SEO infrastructure | ✅ Shipped — sitemap.xml, robots.txt, llms.txt, dynamic OG image, JSON-LD |
| Full metadata (OG, Twitter, canonical, hreflang) | ✅ Shipped |
| /signup real page with age gate + terms | ✅ Shipped and tested end-to-end |
| Logo consistent across header / login / signup / footer | ✅ Shipped via new `<Brand />` component |
| Auth flow | ✅ Working — register → auto-verify (when Resend absent) → sign in |
| 10 Official rulesets (JSON + seed script) | ✅ Committed; seed script needs to run on prod |
| Launch plan (target list, copy, metrics) | ✅ Committed in `docs/marketing/launch-plan.md` |
| Three blog posts | ✅ Committed in `docs/marketing/blog/` (need a blog route to publish) |

### What's live right now

**https://rulesell.vercel.app** — Vercel is the primary frontend, pointed at
Railway Postgres via the public TCP proxy. Full prod env vars set. Lighthouse
100/100/100 on accessibility, best practices, SEO.

**https://rulesell-production.up.railway.app** — Railway is still running as
the fallback. Don't touch it. Its deploy from earlier today (02:42) is healthy.

### Architecture

- **Stack:** Next.js 16.2.2, React 19, TypeScript 5, Tailwind v4, shadcn/ui, Framer Motion 12
- **Backend:** Prisma 7 + PostgreSQL (Railway), NextAuth v5, LemonSqueezy (MoR) → Stripe Connect (planned migration)
- **i18n:** next-intl (EN + TR full, DE/ES/JA structured empty)
- **Design:** Dark-mode first, brand amber #FFD166, unified Brand component
- **Data:** Real Prisma DB with seed data from earlier session (10 rulesets already published)
- **Split:** Vercel runs Next.js (frontend + all API routes), Railway runs Postgres only. The Railway `RuleSell` service is still running as the fallback but not being actively used.

### How to run locally

```bash
cd D:/RulesetMarketplace-master
npm install
npx prisma generate
npm run dev   # localhost:3000 (or 3777, depending on config)
```

Required env in `.env.local` (can `vercel env pull` to get them):
- `DATABASE_URL` — Railway public proxy or local Postgres
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- OAuth secrets (GitHub + Google), LemonSqueezy keys — optional for dev, mock mode works without them

### How to deploy

**Vercel (primary):**
```bash
cd D:/RulesetMarketplace-master
vercel deploy --prod --yes
```

Project: `nalbants2001-8729s-projects/rulesell`. Already linked via `.vercel/project.json`.

**Railway (fallback, leave alone unless you know what you're doing):**
```bash
git push origin master  # Railway auto-deploys on push
```

Project: `RuleSell` (id `d2ca851f-4894-4184-85d3-e8a95e99a0a9`).

### What's left

#### Business (Nalba's actions)

- **Update GitHub OAuth callback URLs** to include `https://rulesell.vercel.app/api/auth/callback/github`. Currently set only for the Railway URL. This is why GitHub sign-in works on Railway but may fail on Vercel until updated.
- **Update Google OAuth callback URLs** to include `https://rulesell.vercel.app/api/auth/callback/google` for the same reason.
- **Decide on a real domain**. For now vercel.app is fine, but launch needs a real domain (rulesell.dev, rulesell.app, rulesell.io — pick one).
- **UK company registration** (for Stripe account and legal presence).
- **Stripe account** once company is set up.
- **30 creator outreach messages** — list skeleton is in `docs/marketing/launch-plan.md`, need the specific handles filled in and messages sent.
- **Publish the 3 blog posts** — need a blog route (see Engineering below) or publish on an external platform (Substack, Medium, dev.to).

#### Engineering (Baha's actions)

- **Run the seed script against Railway Postgres** to load the 10 Official rulesets:
  ```bash
  DATABASE_URL=<railway-public-url> npx tsx scripts/seed-official-rulesets.ts
  ```
  Dry run first: `DRY_RUN=1 npx tsx scripts/seed-official-rulesets.ts`.
- **Configure Resend** to unblock email verification. Without it, new registrations are auto-verified (see `src/app/api/auth/register/route.ts`). This is safe but not ideal long-term.
- **Build a `/blog` route** or integrate an MDX reader so the three blog posts in `docs/marketing/blog/` can be published on the actual site.
- **Stripe migration** (as described in the existing `docs/backend-handoff/stripe-migration.md`). Current payments stack is LemonSqueezy; spec calls for Stripe Connect Express for multi-party.
- **Real search engine integration** (current search is a Postgres ILIKE, works but not great at scale).
- **Wire Vercel Analytics or Plausible** for real metrics.

### Backend handoff docs

All at `docs/backend-handoff/`:

| Doc | Topic |
|-----|------|
| `stripe-migration.md` | Replace LemonSqueezy with Stripe + Stripe Connect Express for UK company |
| `affiliates.md` | New API endpoints + Prisma models for affiliate tracking |
| `community.md` | Extend discussions, add polls/Q&A/feature requests |
| `github.md` | GitHub OAuth + repo API + maintainer claims |
| `admin.md` | Extend admin API for revenue, scanning, feature flags |
| `data-contracts.md` | Complete TypeScript interface → API endpoint mapping |

### Known issues

- **Framer-motion whileInView artifact**: Sections below the fold (HowItWorks, QualityShowcase, TrustStrip, CommunityPreview, FinalCTA) use `whileInView` with `initial="hidden"`. Real users scrolling see them animate in; crawlers and fullPage screenshot tools see them empty. Low risk for humans, some risk for social media previews. Not blocking.
- **Font loading**: Layout loads Space Grotesk via external Google Fonts link. Should migrate to `next/font` for zero-CLS.
- **No `/blog` route yet**: three blog posts are committed as `.md` under `docs/marketing/blog/` but have no publication surface.

---

## Session history

This handoff succeeds earlier sessions. For the evolution, see git log.

- `2026-04-11` morning: Comprehensive overhaul by 4 parallel agents (142 files, +11,900 lines)
- `2026-04-11` night (autonomous run): Vercel deployment, SEO infra, signup flow, logo unification, seed content, marketing materials
