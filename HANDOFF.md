# RuleSell — Project Handoff

**Last updated:** 2026-04-11
**Repo:** https://github.com/VelkinaStudio/RuleSell
**Local:** `D:/RulesetMarketplace-master/`

---

## Current State: Comprehensive Overhaul In Progress

### What's Done (2026-04-11)

**Phase 0: Cleanup** — COMPLETE
- Deleted: `.windsurf/`, `.remember/`, `tmp/`, stale 2026-03-28 docs, `BREADCRUMB.md`, `AGENTS.md`
- Created proper `CLAUDE.md` with project rules
- Updated `.gitignore` for stale tool artifacts

**Phase 1: Branding** — COMPLETE
- Logo: `public/logos/rulesell-mark.svg` (quality gauge mark), `rulesell-full.svg` (wordmark), `favicon.svg`
- 15 tool SVG icons in `public/icons/tools/` (claude-code, cursor, windsurf, vscode, cline, zed, codex, chatgpt, gemini-cli, n8n, make, obsidian, aider, copilot, continue)
- New components: `src/components/ui/tool-icon.tsx`, `src/components/ui/quality-grid.tsx`
- Header updated with logo mark
- Favicon linked in layout

### What's Next

**Phase 2: Landing Page Redesign** — NOT STARTED
- Hero terminal animation, tool logo bar, honest copy, mobile-first
- See plan at `~/.claude/plans/abstract-churning-crayon.md`

**Phases 3-6: PARALLEL BUILD** — NOT STARTED
- Phase 3: Affiliate Program (full dashboard, link generator, tiers, mock data)
- Phase 4: Community Hub (polls, Q&A, request board, enhanced discussions)
- Phase 5: GitHub Integration UI (repo picker, maintainer claims, sync)
- Phase 6: Admin Dashboard (8 pages, moderation, reports, revenue, flags)

**Phase 7: Visual Polish & Mobile** — NOT STARTED
**Phase 8: Assets & Backend Handoff** — NOT STARTED

### How to Run

```bash
cd D:/RulesetMarketplace-master
npm install
npx prisma generate
npm run dev   # localhost:3000
```

Note: Browse/dashboard pages need a real PostgreSQL database connected. Landing page, about, trust, affiliates, explore, legal pages work without DB.

### Backend — DO NOT TOUCH
Real backend exists at `src/app/api/`, `prisma/schema.prisma`, `src/lib/auth.ts`. All new frontend features use mock data via `src/constants/mock-*.ts`. Backend handoff docs will be at `docs/backend-handoff/` when Phases 3-6 complete.

### Plan Reference
Full implementation plan: `~/.claude/plans/abstract-churning-crayon.md`
Design spec: `docs/superpowers/specs/2026-04-08-rulesell-rebuild-design.md`
Research: `docs/research/2026-04-08-SYNTHESIS.md`
