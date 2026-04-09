# QA Strategy

## Current Gap
The repo now has smoke, accessibility, and baseline-backed visual QA, but coverage is still selective and not enforced in CI beyond build validation.

## Current Automation
- `npm run qa:i18n` compares `messages/en.json` and `messages/tr.json` for missing keys, leaf-shape mismatches, and placeholder drift.
- `npm run qa:browser` runs a repo-local Playwright smoke pass against the active app URL.
- `npm run qa:a11y` runs a repo-local Playwright + axe accessibility pass against the active app URL.
- `npm run qa:visual:update` refreshes tracked visual baselines in `docs/qa/baselines/<locale>/`.
- `npm run qa:visual` compares fresh screenshots against those tracked baselines and writes diff artifacts to `output/playwright/`.
- Default target is `http://127.0.0.1:3000`; override with `BASE_URL`.
- Both QA runners use reduced-motion mode to keep interaction checks less animation-dependent.
- Current smoke coverage checks:
  - marketplace shortlist and compare persistence
  - product-detail fit tab and buy-now cart opening
  - compare, docs, help, dashboard, support, admin, and notifications routes
  - sign-in error, retry, success, and password-visibility behavior
  - seller upload draft-save feedback
  - mobile menu navigation into the help route
- Current accessibility coverage checks:
  - affiliate referral controls and footer icon-link naming
  - settings profile, notifications, and appearance controls
  - seller apply, contact, support, admin, and notifications tab surfaces
  - marketplace cookie-banner, filter, sort, and mobile-menu accessibility
- Current visual baseline coverage checks:
  - desktop marketplace browsing
  - desktop compare matrix
  - desktop product fit tab
  - desktop dashboard
  - desktop support refunds state
  - mobile marketplace menu overlay
- Current keyboard-path coverage checks:
  - support tab navigation via keyboard arrows
  - notifications tab navigation via keyboard arrows
- Artifacts are written to `output/playwright/`.

## Required QA Areas
- route-level smoke coverage
- component interaction coverage
- translation completeness checks
- accessibility checks
- responsive review
- visual regression for high-value screens

## Recommended Stack
- ESLint for static checks
- Playwright for E2E and screenshot-based checks
- manual visual QA for motion and landing-page polish

## Priority Order
1. smoke tests for critical routes
2. accessibility and reduced-motion review
3. baseline-backed visual checks for the most important buyer/seller/admin routes
4. broader route expansion, locale coverage, and CI hookup once the main flows stabilize
