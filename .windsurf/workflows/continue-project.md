---
description: Continue working on the RuleSet AI Marketplace project from where the last session left off
---

# Continue RuleSet AI Marketplace Project

## Pre-flight Checks

1. Read `BREADCRUMB.md` at the project root to understand the current state
2. Read `BUSINESS_PLAN.md` for business context and feature requirements
3. Read `TECHNICAL_ARCHITECTURE.md` for technical decisions and stack info
4. Check the current TODO status in the most recent session log in BREADCRUMB.md

## Development Server

// turbo
1. Start the dev server if not already running:
```bash
npm run dev -- -p 3000
```
Working directory: `D:\Ruleset Ai\ruleset-ai`

## Current Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui
- **i18n**: next-intl (EN/TR) — messages in `/messages/en.json` and `/messages/tr.json`
- **State**: Zustand (cart store in `src/stores/cart-store.ts`)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes (dark default)

## Project Structure

- `src/app/[locale]/` — All pages (locale-routed)
- `src/components/` — Reusable components (layout, landing, marketplace, shared, ui)
- `src/constants/mock-data.ts` — Mock products, reviews, blog posts
- `src/types/index.ts` — TypeScript type definitions
- `src/stores/` — Zustand stores
- `src/i18n/` — i18n configuration (routing, request, navigation)
- `messages/` — Translation JSON files

## Key Pages Implemented

| Page | Route | Status |
|------|-------|--------|
| Landing | `/[locale]` | ✅ Complete |
| Sign In | `/[locale]/auth/signin` | ✅ Complete |
| Sign Up | `/[locale]/auth/signup` | ✅ Complete |
| Forgot Password | `/[locale]/auth/forgot-password` | ✅ Complete |
| Marketplace | `/[locale]/marketplace` | ✅ Complete |
| Product Detail | `/[locale]/marketplace/[slug]` | ✅ Complete |
| Pricing | `/[locale]/pricing` | ✅ Complete |
| Blog | `/[locale]/blog` | ✅ Complete |
| Affiliate | `/[locale]/affiliate` | ✅ Complete |
| Contact | `/[locale]/contact` | ✅ Complete |
| Settings | `/[locale]/settings` | ✅ Complete |
| Seller Apply | `/[locale]/seller/apply` | ✅ Complete |
| Seller Dashboard | `/[locale]/seller/dashboard` | ✅ Complete |
| Product Upload | `/[locale]/seller/upload` | ✅ Complete |
| Terms | `/[locale]/legal/terms` | ✅ Complete |
| Privacy | `/[locale]/legal/privacy` | ✅ Complete |
| Cookie Policy | `/[locale]/legal/cookies` | ✅ Complete |
| Refund Policy | `/[locale]/legal/refund` | ✅ Complete |
| DMCA | `/[locale]/legal/dmca` | ✅ Complete |

## Remaining Work (Priority Order)

1. **Backend Integration** — Connect to Supabase/Postgres, implement real auth with NextAuth
2. **Stripe Integration** — Real checkout flow, seller payouts via Stripe Connect
3. **File Upload** — Real file upload to Supabase Storage/S3
4. **Search** — Implement Meilisearch for full-text search
5. **User Dashboard** — Buyer dashboard with purchase history
6. **Review System** — Real review submission and display
7. **Email Notifications** — Transactional emails via Resend
8. **Admin Panel** — Product moderation, user management
9. **SEO** — Dynamic metadata, sitemap, robots.txt
10. **Performance** — Image optimization, lazy loading, bundle analysis
11. **Testing** — Unit tests, E2E tests with Playwright

## Important Rules

- Always update `BREADCRUMB.md` at the end of each session
- Add new translations to BOTH `en.json` and `tr.json`
- Follow the existing component patterns (use shadcn/ui, Framer Motion)
- Keep dark theme as default
- All new pages must be inside `src/app/[locale]/`
