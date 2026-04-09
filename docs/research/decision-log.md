# Decision Log

## 2026-03-10
### Decision
Add a repo-local skill pack for discovery polish, ops/trust, i18n QA, and launch architecture instead of continuing to rely only on generic cross-project skills.

### Why
The repo now has enough product shape, route coverage, and market-specific constraints that future sessions were wasting time rediscovering the same buyer, seller, admin, i18n, and launch-readiness context. Generic frontend guidance was no longer enough.

### Consequences
- The repo now carries project-specific skills under `skills/` so future work can start from marketplace-aware playbooks.
- AGENTS guidance now points to those skills directly, which should reduce repeated audit time and keep future edits more consistent.
- Launch-readiness, trust, discovery, and QA work can now be routed more precisely than "do some frontend polish."

## 2026-03-10
### Decision
Add locale parity validation to the default QA path and CI instead of treating English/Turkish drift as a manual review task.

### Why
The product already ships two locales and relies heavily on route-specific copy, but the repo had no repeatable check for missing keys, shape mismatches, or placeholder drift. That is an avoidable release risk, especially as more surfaces get polished.

### Consequences
- The repo now has `npm run qa:i18n`, backed by a project-local locale parity script.
- CI now blocks on locale parity before `next build`.
- Future copy work should fail fast when a locale falls behind instead of leaking incomplete translations into QA.

## 2026-03-07
### Decision
Add tracked visual baselines and keyboard-path smoke coverage on top of the browser and accessibility runners instead of stopping QA at route presence and axe scans.

### Why
The frontend now depends on layout density, tabbed operational surfaces, and motion-heavy product pages feeling stable across iterations. Smoke tests and axe catches functional and semantic regressions, but they do not tell us when a high-value route drifts visually or when tab navigation quietly falls back to mouse-only assumptions.

### Consequences
- The repo now has `npm run qa:visual:update` and `npm run qa:visual`, with tracked baselines under `docs/qa/baselines/en/` and diff artifacts under `output/playwright/`.
- Browser smoke now proves keyboard tab navigation on support and notifications instead of only click activation.
- The next QA step should expand baseline coverage to more routes and locales, then decide how much of this should be enforced in CI versus kept as a heavier local gate.

## 2026-03-07
### Decision
Add a repo-local accessibility smoke runner and fix the real control, landmark, and heading issues it finds instead of treating accessibility as a later manual polish pass.

### Why
The browser smoke pass was already proving route and interaction health, but it was still possible for icon-only controls, unnamed inputs, invalid landmark nesting, and brittle keyboard flow to ship unnoticed. Those regressions are small individually, but they make a developer-facing marketplace feel less trustworthy and less production-shaped.

### Consequences
- The repo now has a repeatable `npm run qa:a11y` command built on Playwright and axe against localhost or any `BASE_URL`.
- Accessibility fixes landed on real surfaces, including affiliate referral controls, cookie-banner dismissal, footer social links, marketplace filter/sort controls, settings toggles/selects, and footer heading structure.
- The next QA expansion should focus on wider visual regression and deeper keyboard-path review, not re-litigating whether accessibility belongs in the local workflow.

## 2026-03-06
### Decision
Raise the default agent quality bar to portfolio-grade, Dribbble-tier UI and motion work instead of accepting generic polished SaaS output.

### Why
The repo already emphasized distinctiveness, but the previous instruction layer still left too much room for safe, interchangeable visual choices. A stronger default is needed if future model output should consistently bias toward excellent typography, motion, hierarchy, and visual direction.

### Consequences
- Future design-heavy work should start by defining a visual thesis instead of immediately assembling components.
- 2D and 3D motion are now explicitly encouraged where they improve storytelling or comprehension, but must keep reduced-motion and performance constraints.
- Repo docs and user-level Codex instructions now carry a clearer creative standard across sessions.

## 2026-03-06
### Decision
Treat Obsidian, Pencil, and Paper as optional creative workflow tools rather than hidden implementation dependencies.

### Why
They can materially improve research, ideation, design-to-code, and motion exploration, but they are machine-local tools with setup variability. The repo should benefit from them without depending on them.

### Consequences
- Obsidian is framed as the research and creative-memory layer.
- Pencil and Paper are approved for agent-connected design exploration when locally configured.
- Durable decisions, tokens, and implementation details must still return to repo docs and code.

## 2026-03-06
### Decision
Adopt a doc-driven Windsurf operating system with global skills and repo-local product docs.

### Why
The project already had broad UI coverage but lacked durable planning, architecture, design, i18n, and QA documentation.

### Consequences
- Future work should start from docs, not only chat context.
- Product, design, and architecture changes become traceable.
- Continuation workflows become more reliable.

## 2026-03-06
### Decision
Keep marketing and product surfaces intentionally separate.

### Why
The landing surface should optimize impression and differentiation, while the app surface should optimize clarity, trust, and task completion.

### Consequences
Design system and motion choices should support both modes without collapsing into a single generic style.

## 2026-03-06
### Decision
Adopt a marketplace-first frontend direction and defer backend development until later.

### Why
This approach allows us to focus on delivering a functional and user-friendly marketplace experience, while also giving us time to plan and develop a robust backend infrastructure.

### Consequences
- The frontend will be developed with a placeholder backend, which will be replaced later with a fully functional backend.
- This approach may lead to some technical debt, but it will allow us to deliver a working marketplace sooner.

## 2026-03-06
### Decision
Add a dedicated buyer dashboard route instead of treating `settings` as the buyer account surface.

### Why
Settings handles account preferences, but it does not communicate post-purchase value, owned assets, download expectations, or buyer trust cues. A separate buyer dashboard better matches the marketplace-first product direction.

### Consequences
- The frontend now distinguishes buyer ownership flows from generic account settings.
- Future backend integration has a clearer target for purchases, downloads, receipts, and access state.
- Settings can remain focused on profile, billing preferences, and account controls.

## 2026-03-06
### Decision
Add a dedicated admin moderation route instead of leaving governance, trust, and verification flows implicit.

### Why
The marketplace now has stronger buyer and seller surfaces, but trust still depends on visible moderation, seller verification, and escalation handling. A dedicated admin surface makes governance concrete instead of assumed.

### Consequences
- The frontend now distinguishes admin/operator review work from seller and buyer dashboards.
- Future backend moderation, disputes, refunds, and policy enforcement have a clearer UI target.
- Marketplace trust cues are supported by a visible governance layer rather than only marketing language.

## 2026-03-06
### Decision
Add a dedicated support lifecycle route instead of leaving refunds and disputes split between legal copy and scattered product UI.

### Why
The marketplace already exposed reviews, buyer ownership, and admin moderation, but buyers still lacked a coherent post-purchase path for refund requests, access issues, and escalation. A support surface makes the trust lifecycle visible.

### Consequences
- Refund, access, and trust complaints now have a shared frontend destination.
- The localized refund policy now aligns with a practical case-management surface instead of existing as isolated legal text.
- Future backend support tooling has a clearer target for case states, ownership, and evidence flow.

## 2026-03-06
### Decision
Add a dedicated notifications and activity history route instead of relying on settings-only notification preferences.

### Why
Preference toggles do not give users operational awareness. The marketplace now has buyer, seller, support, and admin surfaces, so events across those flows need a visible feed and history layer.

### Consequences
- Notification delivery preferences remain in settings, while event visibility now has its own destination.
- Future backend eventing has a clearer UI target for read state, grouping, timelines, and cross-surface linking.
- Marketplace operations feel more coherent because important changes are visible outside isolated dashboards.

## 2026-03-06
### Decision
Standardize explicit empty states across the major buyer, seller, admin, support, and notifications surfaces instead of relying on populated mock data to imply readiness.

### Why
The marketplace prototype had enough route coverage to feel broad, but several core surfaces still silently collapsed when arrays were empty. That made the frontend appear more complete than it really was and hid how degraded states should behave before backend data flows exist.

### Consequences
- Buyer dashboard, seller dashboard, admin moderation, support, and notifications routes now communicate clearly when there is nothing to show.
- Localized empty-state copy exists in both English and Turkish, keeping degraded-state UX aligned with the rest of the product.
- The next logical frontend pass is to unify loading, error, and success states into shared components instead of repeating route-level patterns.

## 2026-03-06
### Decision
Extract the repeated empty-state markup into a reusable shared-state panel instead of leaving the first standardization pass as route-by-route duplication.

### Why
The first pass made degraded states visible, but it still repeated the same dashed-panel structure and optional CTA behavior across multiple routes. That would slow down future loading, error, and success work and make visual drift more likely.

### Consequences
- Major empty states now share a common UI primitive in `src/components/shared/shared-state-panel.tsx`.
- Empty-state presentation can evolve in one place without patching every route individually.
- The next shared-state milestone should add loading, error, and success variants rather than creating more one-off route markup.

## 2026-03-06
### Decision
Expand the shared-state panel into real loading and success variants on localized async routes instead of limiting the abstraction to empty states.

### Why
The component system would stay theoretical if it only handled empty collections. Settings save feedback and seller upload submission already model async behavior in the frontend prototype, so they provide a credible place to prove shared-state variants without inventing fake backend conditions.

### Consequences
- `SharedStatePanel` now supports `empty`, `loading`, `success`, and `error` visual modes, even though this pass only adopted loading and success on live routes.
- Settings and seller upload now communicate in-progress and completed states with the same reusable primitive instead of inline one-off feedback.
- The next logical step is to introduce explicit error-state adoption on routes with async actions, validation boundaries, or mocked failure paths.

## 2026-03-06
### Decision
Adopt shared error-state panels only on already-localized async flows instead of forcing the pattern onto routes that still need broader copy cleanup.

### Why
Settings, seller upload, and forgot-password already behave like meaningful async frontend flows, so they can support believable mocked failures without inventing backend architecture. Contact and seller application still contain enough hardcoded copy that broadening error-state adoption there would mix state-system work with a separate localization cleanup pass.

### Consequences
- Shared error states now exist on settings save, seller upload draft/publish submission, and forgot-password recovery.
- Retry behavior is supported through the shared-state panel without forcing every error path to be link-based.
- The next UI cleanup pass should focus on localizing the remaining auth/contact/seller application forms before expanding shared-state usage further.

## 2026-03-06
### Decision
Localize the remaining form-heavy auth, contact, and seller application routes before extending the shared-state system into them.

### Why
Those routes were still leaking hardcoded English across hero copy, placeholders, validation, and success feedback. Reusing shared state components more broadly before fixing the locale boundary would have created a half-localized experience and made future UI cleanup harder to reason about.

### Consequences
- Sign-in, sign-up, forgot-password, contact, and seller application now pull user-facing copy from locale files instead of JSX literals.
- English and Turkish message catalogs now cover auth validation, auth visual sections, contact cards/form states, and seller application content.
- The next clean frontend pass is to decide where shared loading/error/success panels should replace the remaining route-specific success and error surfaces on these newly localized flows.

## 2026-03-06
### Decision
Extend `SharedStatePanel` into the localized `contact` and `seller/apply` flows using mocked loading, success, and inline retryable error states.

### Why
Once those routes were localized, their route-specific success cards became unnecessary duplication beside settings, forgot-password, and seller upload. They also had credible frontend-only async behavior already, so adding a lightweight mocked error trigger keeps the state system consistent without implying real backend submission infrastructure.

### Consequences
- Contact and seller application now share the same async-state presentation pattern as the other localized frontend flows.
- Error handling stays inline on the form instead of taking over the full route, which keeps correction and retry UX tighter.
- Future state-system work can focus on other async routes instead of revisiting these two forms for consistency.

## 2026-03-06
### Decision
Extend `SharedStatePanel` into the remaining mocked auth submission routes: `auth/signin` and `auth/signup`.

### Why
After localization cleanup and the contact/seller application pass, sign-in and sign-up were the last form-heavy mocked auth submissions still using route-specific loading buttons without the same success and retryable error treatment. Their UX already modeled async submission credibly enough to reuse the shared state pattern without inventing backend capabilities.

### Consequences
- Sign-in and sign-up now align with forgot-password, contact, seller apply, settings, and seller upload on shared async-state presentation.
- The auth surface is more internally consistent across loading, success, and failure moments.
- The next reusable-feedback question is smaller-scope interactions like clipboard or inline confirmations, which likely need a lighter primitive than `SharedStatePanel`.

## 2026-03-06
### Decision
Formalize the settings page under its own translation namespace instead of leaving account copy partially hardcoded.

### Why
The rest of the marketplace had already moved toward localized, route-specific copy, but settings still mixed nav translations with hardcoded English UI. That weakened consistency and made the account surface lag behind buyer, seller, support, and admin routes.

### Consequences
- Settings now follows the same i18n structure as other core routes.
- Profile, notifications, security, billing, and appearance copy are easier to evolve without scattering strings in JSX.
- Future account-state improvements can build on a cleaner localization foundation.

## 2026-03-06
### Decision
Make platform-first browsing a core part of the marketplace page instead of relying only on category filters.

### Why
The product direction already emphasized marketplace density and a skills.sh-like focus on real toolchains, but the primary discovery surface still treated compatibility as secondary metadata. Buyers need to start from the editor, model, or automation stack they already use.

### Consequences
- Marketplace discovery now includes toolchain summaries, platform filters, and platform-fit cues on product cards.
- Compatibility is visible earlier in browsing, not only on the product detail page.
- Shared category and platform metadata now live in reusable frontend helpers instead of scattered page-level maps.

## 2026-03-06
### Decision
Adopt a minimal delivery workflow built around local Vercel CLI scripts, GitHub Actions CI, GitHub CLI push steps, and documented Vercel MCP setup.

### Why
The frontend had become broad enough to validate and demo, but the repo still lacked an explicit path for push, CI, preview deploys, and agent-aware Vercel access. Adding those pieces now improves operability without pretending the backend already exists.

### Consequences
- The repo now has a documented push and deploy path instead of relying on ad hoc terminal steps.
- Vercel is available through repo-local npm scripts, which is safer than assuming a global install.
- CI now catches lint and production build failures on GitHub before a deploy step is introduced.
- GitHub MCP remains intentionally undocumented as a default repo config because host support and auth shape are less predictable than Vercel's remote endpoint.

## 2026-03-06
### Decision
Shift the marketplace toward a calmer developer-evaluation flow instead of adding more marketing density.

### Why
The app already had broad route coverage, but the core marketplace still behaved more like a polished listing gallery than a place where technical buyers narrow, compare, and validate tools quickly. Real developer buyers care more about toolchain fit, setup effort, preview depth, update freshness, and direct comparison than they do about extra homepage flourish.

### Consequences
- The shell now prioritizes utilitarian navigation with compare, docs, and help alongside faster search access.
- The marketplace page now consolidates discovery into one filter rail with toolchain, asset-type, and quick evaluation filters instead of repeating large category/platform promo blocks.
- Product cards and detail pages now surface setup, preview, freshness, and compare actions earlier.
- Dedicated `compare`, `docs`, and `help` routes now cover the previously missing shortlist, buyer-guide, and help-center surfaces.
- Browser validation now includes a real compare-state hydration path so persisted shortlist UX is less likely to regress silently.

## 2026-03-06
### Decision
Add a repo-local Playwright smoke runner for the highest-value developer-market flows instead of leaving browser QA as an ad hoc terminal routine.

### Why
The recent marketplace, compare, docs, help, and product-detail changes are tightly connected, and the last manual browser pass already found real regressions in compare hydration and duplicate rendering. Those flows are now important enough to deserve a repeatable smoke command, but not a full end-to-end test harness yet.

### Consequences
- The repo now has a lightweight `npm run qa:browser` command that validates shortlist, compare, docs/help, and product-fit flows against a live app URL.
- Browser artifacts are produced consistently in `output/playwright/`, which makes regression review easier during frontend-only work.
- QA coverage is still intentionally narrow; broader accessibility, visual regression, and route expansion should happen after the next critical user journeys stabilize.

## 2026-03-06
### Decision
Expand the browser smoke pass around real async and conversion moments instead of only static route visibility.

### Why
Marketplace quality now depends on more than route existence. Buyers need compare and cart to work, sellers need draft feedback to be believable, auth needs retryable states to stay smooth, and the mobile shell needs to remain navigable. Those are the places where polished mock data can still feel broken if interaction coverage stays too shallow.

### Consequences
- `npm run qa:browser` now checks desktop and mobile flows, including sign-in retry behavior, seller draft save, buy-now cart opening, and mobile help navigation.
- The QA pass now runs in reduced-motion mode by default, which makes animation-heavy regressions less likely to hide interaction issues.
- Small accessibility fixes landed alongside the QA expansion, including explicit labels for the mobile menu trigger and auth password-visibility controls.

## 2026-03-06
### Decision
Extend browser QA into the operational routes before treating the frontend prototype as broadly demo-ready.

### Why
Marketplace, auth, and seller entry flows were already covered, but operational trust still depended on buyer dashboard, support, admin moderation, and notifications behaving coherently. Those surfaces are central to the marketplace story, and tab-heavy routes are exactly where hydration and interaction regressions can stay hidden if QA stops at simple page loads.

### Consequences
- `npm run qa:browser` now validates dashboard, support, admin, and notifications in addition to the earlier buyer/auth/seller shell paths.
- The smoke runner now explicitly proves tab activation on the operational routes instead of assuming first-click interactivity.
- Route polish landed alongside QA expansion, including locale-aware notification dates and removal of a corrupted dashboard separator string.
