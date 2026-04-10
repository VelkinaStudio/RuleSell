# RuleSell — Project Handoff

**Last updated:** 2026-04-11
**Repo:** https://github.com/VelkinaStudio/RuleSell
**Local:** `D:/RulesetMarketplace-master/`

---

## Current State: Comprehensive Frontend Complete

### What shipped (2026-04-11 overhaul)

**142 files changed, +11,900 lines. Zero build errors. 286 static pages.**

| Feature | Status | Files |
|---------|--------|-------|
| **Branding** | Complete | Logo (gauge mark), 15 tool SVGs, favicon, ToolIcon + QualityGrid components |
| **Landing page** | Redesigned | Hero terminal demo, tool logo bar, honest copy, quality grid background |
| **Affiliate program** | Complete (mock) | 10 components, 5-tab dashboard, tiered commissions, link generator |
| **Community hub** | Complete (mock) | 6-tab explore (Feed/Discussions/Polls/Q&A/Showcases/Requests), 14 components |
| **GitHub integration** | Complete (mock) | Repo picker, maintainer claims, sync indicator, publish wizard integration |
| **Admin dashboard** | Complete (mock) | 8 pages (overview/users/moderation/reports/revenue/scanning/flags), role-gated |
| **Mobile** | Bottom nav, responsive layouts | MobileBottomNav, 44px touch targets, 375px tested |
| **KYC/Seller onboarding** | Enhanced | Region-aware compliance (EU/UK/US), Stripe Connect redirect |
| **Connected accounts** | New | GitHub/Google/email with verification status in Settings |
| **Assets** | Complete | 9 category illustrations, 4 empty state SVGs, generated avatar component |

### How to run

```bash
cd D:/RulesetMarketplace-master
npm install
npx prisma generate
npm run dev   # localhost:3000
```

Note: Pages that fetch from the real API (browse, dashboard) need PostgreSQL connected. Landing, about, trust, affiliates (public), explore, legal pages work without DB.

### Backend handoff

**All docs at `docs/backend-handoff/`:**

| Doc | What Baha needs to do |
|-----|----------------------|
| `stripe-migration.md` | Replace LemonSqueezy with Stripe + Stripe Connect Express for UK company |
| `affiliates.md` | New API endpoints + Prisma models for affiliate tracking |
| `community.md` | Extend discussions, add polls/Q&A/feature requests |
| `github.md` | GitHub OAuth + repo API + maintainer claims |
| `admin.md` | Extend admin API for revenue, scanning, feature flags |
| `data-contracts.md` | Complete TypeScript interface → API endpoint mapping |
| `README.md` | Index of all handoff docs |

### What's left

**Frontend (quick):**
- Visual polish pass on new pages (take screenshots, critique, fix)
- Sitemap.xml generation
- llms.txt at domain root
- Dead i18n key cleanup (old socialProof numbers)

**Backend (Baha):**
- Stripe migration (biggest item — payments, payouts, Connect)
- Real search engine integration
- Email templates (Resend configured, templates needed)
- Wire mock features to real APIs (affiliates, community, GitHub, admin)

**Business (Nalba):**
- UK company registration
- Stripe account setup
- Domain purchase + DNS
- Content seeding (first marketplace products)
- Hosting setup (Vercel or Railway)

### Architecture

- **Stack:** Next.js 16.2.2, React 19, TypeScript 5, Tailwind v4, shadcn/ui, Framer Motion 12
- **Backend:** Prisma 7 + PostgreSQL, NextAuth v5, LemonSqueezy → Stripe (migration pending)
- **i18n:** next-intl (EN + TR, DE/ES/JA scaffold)
- **Design:** Dark-mode first, brand amber #FFD166, quality gauge mark logo
- **Data layer:** Mock data in `src/constants/mock-*.ts` → SWR hooks → components

### Key files

- `CLAUDE.md` — project rules for AI agents
- `src/types/index.ts` — 664 lines, all data types
- `src/styles/tokens.css` — design tokens
- `docs/backend-handoff/` — everything Baha needs
