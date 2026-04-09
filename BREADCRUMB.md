# BREADCRUMB

## Current Snapshot
- Project: RuleSet AI Marketplace frontend
- State: High-fidelity frontend prototype with mock data and broad route coverage
- Stack: Next.js 16, TypeScript, Tailwind v4, shadcn/ui, Framer Motion, next-intl, Zustand
- Locales: `en`, `tr`
- Theme: dark-first

## What Exists
- Marketplace-first homepage entry via redirect to the marketplace
- Auth pages
- Marketplace listing, compare, product detail, buyer dashboard, docs, and help-center pages
- Pricing, blog, affiliate, contact, settings, support lifecycle, and notifications pages
- Seller apply, seller dashboard, upload, and admin moderation pages
- Legal pages
- Cart state via Zustand
- Translation files in `messages/en.json` and `messages/tr.json`

## What Does Not Exist Yet
- Real database and backend integration
- Real auth
- Real checkout and payouts
- Real uploads and storage
- Real search engine integration
- Real reviews
- Email notifications
- Comprehensive QA coverage across all routes/locales and CI-enforced visual regression

## Current Priorities
1. Make the site marketplace-first and improve mock-data product discovery UX
2. Refine buyer, seller, and admin frontend flows before backend integration
3. Add testing and visual QA infrastructure
4. Use the market-readiness audit to sequence backend, auth, storage, and payout work instead of treating "market ready" as a vague polish goal
5. Move from mock-data frontend to production-grade platform foundations

## Risks
- The repo currently suggests product maturity that the backend does not yet support.
- Business and admin flows were implied in the UI before being fully documented.
- Existing workflow referenced missing docs, making long-term continuity fragile.
- Translation discipline exists, but the repo lacked a formal i18n architecture doc.

## Recent Progress
- Added a repo-local project skill pack under `skills/` for discovery polish, ops/trust, i18n QA, and launch architecture, then linked those skills from `AGENTS.md` so future sessions can route work from marketplace-specific playbooks instead of generic frontend habits.
- Wrote `docs/product/market-readiness-audit.md` to make the current product truth explicit: the app is frontend-demo ready, but still blocked on auth, data, storage, checkout, payouts, search, reviews, and operational tooling before it can be called market ready.
- Added a repo-local locale parity checker at `skills/ruleset-marketplace-i18n-qa/scripts/check-message-parity.mjs`, exposed it as `npm run qa:i18n`, and moved it into the default CI path so English/Turkish drift now fails fast.
- Fixed real locale drift that the new QA gate found by restoring the missing Turkish affiliate-program keys instead of leaving parity as a best-effort review task.
- Polished the shared shell, marketplace discovery route, product cards, and product detail sidebar around a stronger dark-first product language, more explicit buyer-decision paths, and above-the-fold trust and fit cues.
- Added a baseline-backed visual regression runner with tracked screenshots under `docs/qa/baselines/en`, so key marketplace, compare, product-fit, dashboard, support, and mobile-menu surfaces can now be compared instead of only re-screenshoted.
- Expanded the browser smoke runner to prove keyboard tab navigation on support and notifications, making those operational routes less mouse-dependent in QA coverage.
- Added a repo-local Playwright + axe accessibility runner so less-traveled routes can be checked for control naming, landmark structure, and keyboard reachability instead of relying on visual smoke tests alone.
- Fixed real accessibility issues found by that pass, including affiliate referral input/button labeling, cookie-banner dismissal naming and landmarking, marketplace sort/filter control accessibility, settings toggle/select labeling, and footer social-link/heading structure.
- Added a global Codex creative instruction layer at `C:\Users\nalba\.codex\AGENTS.md` so future sessions push harder on design quality, motion discipline, and non-generic UI output by default.
- Expanded the repo-local agent and workflow guidance with a portfolio-grade creative quality bar and an optional external-tool workflow around Obsidian, Pencil, and Paper.
- Added durable docs for the new visual standard and creative-tooling boundaries, then grounded the tooling choices in official source logging and decision records.
- Expanded the repo-local Playwright smoke runner into the operational routes so dashboard, support, admin, and notifications now get real browser coverage instead of route-exists checks.
- Hardened the browser runner around client-side hydration races in compare and tabbed routes so QA is less brittle on Next.js client surfaces.
- Cleaned a corrupted dashboard platform separator and made notification dates locale-aware on the notifications surface.
- Expanded the repo-local Playwright smoke runner beyond route presence so it now validates buy-now cart behavior, sign-in retry/success states, seller draft-save feedback, and a mobile menu-to-help path under reduced motion.
- Fixed accessibility gaps found during that pass by adding explicit labels to the mobile navigation trigger and auth password-visibility controls.
- Added a repo-local Playwright smoke runner plus npm scripts so marketplace shortlist, compare, docs/help, and product-fit flows can be revalidated on localhost or preview URLs without rebuilding the browser workflow from scratch.
- Reworked the marketplace into a calmer developer-first browsing flow with a unified filter rail, quick evaluation filters, compare-aware actions, and less repeated promo density.
- Added dedicated `compare`, `docs`, and `help` routes so shortlist comparison, buyer guidance, and support discovery no longer rely on dead links or implicit product assumptions.
- Tightened the product detail page around developer fit and setup evaluation, replaced the fake wishlist action with a real compare flow, and made buy-now/share behavior more credible.
- Updated the shell navigation and footer to prioritize valid utility routes instead of dead company/status placeholders.
- Ran browser QA on localhost across marketplace, compare, docs, and product-detail flows, captured fresh screenshots, and fixed a compare-state hydration mismatch plus duplicate-key bug found during that pass.
- Installed project dependencies so the earlier missing React/Next/JSX module noise is replaced by real validation output.
- Fixed the remaining route-level build/lint issues across marketplace, auth, contact, seller apply, upload, settings, and shared components.
- Deepened the marketplace page with reusable category/platform discovery helpers, platform-first browsing cards, localized platform filters, and localized card trust/relevance cues.
- Localized the shared cart sheet and cleaned up shell-level language/theme controls so core marketplace UX is less inconsistent.
- Added repo-local Vercel CLI scripts, a GitHub Actions CI workflow, and documented GitHub/Vercel/MCP delivery steps.
- Installed global Windsurf rules, skills, workflows, Playwright MCP, and transcript archiving hook.
- Added the project-level documentation operating system.
- Established repo-local product, architecture, design, i18n, and QA docs.
- Repositioned the product direction toward a marketplace-first entry experience.
- Redirected the root homepage into the marketplace and made navigation more marketplace-centric.
- Rebuilt the marketplace page into a stronger discovery-led product home with category entry points, featured listings, and localized marketplace copy.
- Upgraded the product detail page with stronger trust signals, compatibility framing, seller snapshot metrics, and better buyer evaluation structure.
- Upgraded the seller upload and seller dashboard surfaces with stronger listing-readiness UX, localized seller copy, and mock-data-driven marketplace metrics.
- Added a dedicated buyer dashboard route with mock purchased-library, wishlist, and recommendation UX to strengthen the post-purchase frontend story.
- Added a dedicated admin moderation route with mock listing review, seller verification, trust-and-safety triage, and policy checklist UX.
- Added a dedicated support lifecycle route plus localized refund policy copy to model refund requests, access issues, review follow-ups, and dispute escalation states.
- Added a dedicated notifications and activity history route so buyer, seller, support, and admin events have a shared operational visibility surface.
- Localized the settings/account surface so profile, notifications, security, billing, and appearance copy now follow the same i18n structure as the rest of the app.
- Standardized explicit empty states across buyer dashboard, seller dashboard, admin moderation, support, and notifications surfaces so major routes degrade cleanly without assuming populated mock data.
- Extracted a reusable shared-state panel component and migrated the major empty states onto it so shared-state UX is less duplicated across the app.
- Expanded the shared-state panel to support loading and success variants, then applied it to localized async flows like settings save feedback and seller upload submission states.
- Extended shared-state adoption into explicit error variants on localized async flows, including settings save failures, seller upload draft/publish failures, and forgot-password recovery issues.
- Localized the remaining form-heavy auth, contact, and seller application routes so visuals, placeholders, validation copy, and success states no longer fall back to hardcoded English.
- Extended `SharedStatePanel` adoption into the localized `contact` and `seller/apply` flows so both routes now model loading, success, and inline retryable error states with locale-backed copy.
- Extended `SharedStatePanel` adoption into the localized `auth/signin` and `auth/signup` flows so the remaining mocked auth submissions now follow the same loading, success, and inline retryable error pattern.
- Audited the current frontend surfaces and mock data to prepare an investor/influencer-style Sora ad concept grounded in implemented marketplace, buyer, seller, admin, and localization evidence without overstating backend readiness.
- Prepared a six-clip Sora batch prompt set and validated it in dry-run mode for a 24-second investor-style ad, but live generation is still blocked until `OPENAI_API_KEY` is available in the runtime.
- Submitted the Sora batch after local API setup, recovered from two initial moderation blocks with safer abstract intro prompts, and exported a 24.6-second rough-cut ad to `tmp/sora/renders/ruleset-marketplace-investor-ad-roughcut.mp4`.
- Generated a one-page repo-summary PDF at `output/pdf/ruleset-ai-app-summary.pdf` and visually validated the rendered page at `tmp/pdfs/ruleset-ai-app-summary-page-1.png`.
- Backend work remains intentionally deferred until the frontend product shape is stronger.

## Next Recommended Actions
- Start the first real platform pass from the new audit: BFF-backed auth and roles, durable catalog models, and secure asset delivery before broader growth or pricing work.
- Expand QA beyond parity and build by running browser, accessibility, and visual checks against the refreshed marketplace shell once a local app server is up.
- Use the new repo-local skills as the default entry point for discovery, ops/trust, i18n, and launch-architecture tasks so future sessions stop repeating basic repo analysis.
- If you want live agent-connected design canvases, manually set up Paper MCP in the Codex app and test Pencil on a backed-up Codex config before relying on either in real work.
- Start using the new creative-quality docs as the default brief for any major landing page, marketing, or marketplace redesign pass.
- Keep frontend work focused on deeper discovery, trust cues, browsing quality, and remaining hardcoded surfaces.
- Expand the new accessibility runner into wider keyboard-path, dialog, and form-validation coverage across the rest of the app.
- Expand visual baselines into more routes and the Turkish locale, then decide whether selected visual checks should become part of CI.
- Defer backend implementation until the marketplace-first frontend shape is strong enough.
- After that, improve affiliate and other remaining hardcoded marketing/product surfaces, and expand seller listing management before backend work.
- Use the new delivery workflow for GitHub pushes and Vercel previews instead of ad hoc commands.
- Keep `docs/research/decision-log.md` updated when major choices are made.
- Keep this file current after each substantial session.
