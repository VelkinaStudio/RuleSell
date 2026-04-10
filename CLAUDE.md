# RuleSell — Project Rules

## What This Is
Marketplace for AI dev assets: rules, MCP servers, skills, agents, workflows, prompts, CLIs, datasets, bundles. Next.js 16 App Router + Tailwind v4 + shadcn/ui + Framer Motion + next-intl (EN+TR) + SWR.

## Backend — DO NOT TOUCH
Real backend exists: Prisma 7 + PostgreSQL, NextAuth v5 (GitHub + Google + email), LemonSqueezy payments. Files under `src/app/api/`, `prisma/`, `src/lib/auth.ts` are off-limits. New frontend features use mock data via `src/constants/mock-*.ts` and hooks.

## Stack
- Next.js 16.2.2 App Router, React 19, TypeScript 5
- Tailwind v4, shadcn/ui (new-york style), Framer Motion 12
- next-intl 4 (EN + TR, DE/ES/JA scaffold)
- SWR for client data fetching
- Lucide-react icons, Zod validation
- Dark-mode first, brand amber #FFD166

## Working Rules
- All pages under `src/app/[locale]/` with route groups: `(public)`, `(dashboard)`, `(legal)`
- User-facing copy in BOTH `messages/en.json` AND `messages/tr.json`
- Components: `"use client"`, lucide icons, `cn()` utility, `useTranslations()`, `useReducedMotion()`
- Motion: use variants from `src/lib/motion/variants.ts`, respect `prefers-reduced-motion`
- States: every data-dependent section needs loading (skeleton), error (retry), empty (illustration)
- Accessibility: WCAG 2.2 AA, Lighthouse a11y ≥ 95, 44x44px touch targets on mobile
- Design: read `docs/design/` before visual work. Use humane-design-engine for design tasks.

## Design Tokens
All in `src/styles/tokens.css`. Surfaces: `--bg`, `--bg-surface`, `--bg-raised`, `--bg-elevated`. Text: `--fg`, `--fg-muted`, `--fg-subtle`, `--fg-dim`. Brand: `--brand` (#FFD166). Category accents: `--cat-rules` through `--cat-bundle`.

## Mock Data Pattern
Constants in `src/constants/mock-*.ts` → consumed by hooks in `src/hooks/use-*.ts` → used in page components. Follow this pattern for all new features.

## Documentation
- `docs/product/` — vision, personas, roadmap
- `docs/design/` — design system, motion, typography
- `docs/architecture/` — system overview, frontend arch
- `docs/backend-handoff/` — API specs for backend team
- `docs/research/` — market research, decisions

## Key Decisions
- 10-role actor model (Visitor → Admin)
- 85/15 revenue split (90/10 first 6 months)
- Quality Score as default sort (not star ratings)
- 9 categories with accent colors
- 16 environments (Claude Code, Cursor, etc.)
- 15 compliance launch gates (GDPR, DSA, WCAG)
