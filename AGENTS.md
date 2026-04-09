<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# RuleSet AI Marketplace Agent Guide

## Product Context
- This repo is the frontend for a marketplace focused on AI developer assets such as rule sets, skills, MCP servers, workflows, prompts, agent configs, and bundles.
- The current implementation is primarily a polished frontend and mock-data experience.
- Major unfinished areas include backend integration, payments, uploads, search, buyer dashboard, reviews, email, admin moderation, SEO, performance, and testing.

## Core Stack
- Next.js 16 App Router
- TypeScript
- TailwindCSS v4
- shadcn/ui
- Framer Motion
- next-intl with `en` and `tr`
- Zustand for cart state

## Working Rules
- Read `BREADCRUMB.md` before continuing meaningful work.
- Read the relevant docs in `docs/` before changing architecture, product scope, design direction, i18n structure, or QA standards.
- Read `docs/design/creative-quality-bar.md` before major visual work and `docs/architecture/creative-tooling-workflow.md` before changing creative-tooling workflows.
- Keep business, architecture, design, i18n, and QA decisions in docs instead of hiding them in chat.
- Update `BREADCRUMB.md` at the end of each meaningful session.
- Add user-facing copy to both `messages/en.json` and `messages/tr.json`.
- Keep all locale-routed pages inside `src/app/[locale]/`.
- Keep dark theme as default unless the product direction explicitly changes.
- Preserve the separation between expressive marketing surfaces and cleaner product surfaces.

## Product and UX Expectations
- Challenge weak product assumptions instead of defaulting to agreement.
- For new features, think through buyer, seller, admin, operator, and support implications.
- Cover loading, empty, error, success, validation, permission, and zero-result states.
- Keep UI distinctive and polished without drifting into generic AI SaaS aesthetics.
- Use motion deliberately and keep reduced-motion and performance constraints in mind.

## Creative Quality Bar
- The default target is outstanding, portfolio-grade, Dribbble-tier execution grounded in production constraints.
- Every substantial UI pass should define a visual thesis: typography, palette, surfaces, composition, motion, trust cues, and responsive behavior.
- Avoid interchangeable startup layouts, default font stacks, and shallow glassmorphism unless the existing system explicitly calls for them.
- Prefer one memorable visual idea per route over many weak decorative touches.
- Use 3D, shaders, illustration, or ambitious 2D motion only when they improve storytelling, comprehension, or product differentiation.
- Keep expressive marketing surfaces and cleaner product surfaces intentionally distinct.

## Creative Tooling Expectations
- Obsidian is approved for research capture, moodboards, creative briefs, and durable design context outside the repo.
- Pencil and Paper are approved exploration tools when a task benefits from agent-editable canvases or design-to-code loops.
- External design tools are working surfaces, not the source of truth. Durable decisions, tokens, and implementation details must come back into `docs/` and the codebase.
- Do not claim an MCP or external tool integration is live unless it has actually been configured in the current environment.

## Documentation Map
- `docs/product/` for product direction, roles, flows, and roadmap
- `docs/research/` for source logging and decisions
- `docs/architecture/` for technical direction
- `docs/design/` for design system and motion rules
- `docs/i18n/` for locale strategy
- `docs/qa/` for quality gates and testing expectations

## Project Skills
- `ruleset-marketplace-discovery-polish`: Use for marketplace, compare, buyer-guide/help, shell, and product-detail discovery polish work. File: `skills/ruleset-marketplace-discovery-polish/SKILL.md`
- `ruleset-marketplace-ops-trust`: Use for buyer dashboard, seller surfaces, admin moderation, support, notifications, and trust or policy UX. File: `skills/ruleset-marketplace-ops-trust/SKILL.md`
- `ruleset-marketplace-i18n-qa`: Use for locale copy changes, parity checks, and release-grade frontend validation. File: `skills/ruleset-marketplace-i18n-qa/SKILL.md`
- `ruleset-marketplace-launch-architecture`: Use for moving the frontend prototype toward a launch-ready product and backend shape. File: `skills/ruleset-marketplace-launch-architecture/SKILL.md`
