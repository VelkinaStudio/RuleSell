# Trust & Creator Economics for Mixed Free/Paid Developer Marketplaces

**Date:** 2026-04-08
**For:** RuleSell (AI dev asset marketplace)
**Scope:** How successful marketplaces coexist free OSS and paid premium, build trust, handle revenue share, prevent abuse, and avoid free cannibalizing paid.

---

## 1. Marketplace-by-marketplace evidence

### GitHub Marketplace (Apps + Actions)
- **Structure:** Actions are free-only, anyone can publish. Apps can be free or paid, but paid is restricted to verified publishers (orgs only, 2FA, domain verified).
- **Paid eligibility gate:** 100 installs (GitHub App) or 200 users (OAuth) before you can charge.
- **Trust signals:** Verified creator badge, install count, publisher org, last updated.
- **Separation, not competition:** Actions (free tooling) and Apps (paid services) live in separate surfaces. This is the cleanest "no cannibalization" model because the two product types don't overlap.
- **Revenue share:** GitHub takes ~25% on paid apps (historically) — verified through publisher agreements.

### VS Code Marketplace
- **Structure:** Overwhelmingly free (~99%). No native billing — paid extensions bolt on their own license servers.
- **How paid survives:** GitLens, Wallaby.js, Tabnine all follow the same playbook: ship a free tier that's genuinely useful, gate the "pro" features (commit graph, AI, team features) behind subscription, verify licenses at runtime from their own servers.
- **Trust signals:** Install count, weekly downloads, star rating (user-contributed), "Verified Publisher" badge tied to domain verification, last updated, open-source link.
- **Revenue share:** 0% — Microsoft takes nothing. Every extension publisher handles their own payments.
- **Key lesson:** You don't need platform-level paid billing to have paid products. You need a free-usable core that creates pull toward pro.

### Figma Community
- **Structure:** Mostly free templates, plugins, widgets. Paid is gated — Figma closed new paid-creator approvals in 2024 due to quality and trust concerns.
- **Revenue share:** Figma takes ~15% (creators keep 85%). Figma handles tax, refunds, fraud, delivery.
- **Trust signals:** Duplicate count, like count, verified creator badge, "Staff Pick," categories.
- **Sort:** Free and paid are mixed in discovery, but paid items are clearly badged with price chips. No explicit paid-push.
- **Creator Fund:** Separate grants program pays creators who publish free resources — a direct admission that "good free stuff" is worth paying for.

### Notion Templates
- **Structure:** Two ecosystems. Official Notion gallery (curated, free, first-party "duplicate" button). Gumroad (paid, third-party, messy discovery).
- **User journey:** Users treat the official gallery as the trusted source for free and casually browse Gumroad when they want premium. The ecosystems barely overlap in discovery.
- **Lesson:** First-party curation beats third-party paid marketplace for free goods. Paid thrives in the gap between "what Notion curates" and "what niche power users need."

### n8n
- **Structure:** n8n itself is source-available. Thousands of community workflow templates, all free. n8n's monetization is the hosted product (n8n Cloud, $20/mo+), not templates.
- **Balance:** The free template library drives adoption of the paid infrastructure. Templates are the top of the funnel.
- **Lesson:** If your core product is a platform, free content is marketing and paid content is irrelevant. But that only works when you have a recurring platform to sell.

### Hugging Face
- **Structure:** 500K+ free models with explicit license badges (Apache, MIT, OpenRAIL-M, custom). Paid is Inference Endpoints ($0.03/hr+), not models themselves.
- **Trust signals:** License badge (critical — "commercial use OK"), download count, likes, model card, last updated, gated models (auth required for sensitive ones).
- **OpenRAIL matters:** It's an AI-specific license category that lets creators say "open but no harmful use." This is the closest analog to what RuleSell needs for rules/configs.
- **Lesson:** License-as-badge is a huge trust signal when the asset type has IP ambiguity.

### npm / Cargo
- **Structure:** Zero native paid packages. Every attempt (PremiumJS, Web Monetization, etc.) has failed.
- **Why it failed:** (1) The package is downloadable, so pirating is trivial. (2) The dev ergonomic of `npm install` is sacred — friction kills it. (3) Social norm: the JS/Rust ecosystems treat "paid package" as betrayal.
- **Lesson for RuleSell:** Rules/configs aren't runtime dependencies. They're more like templates/assets. Don't fight the npm norm — you aren't npm. But learn from it: friction and piratability are mortal enemies of paid.

### JetBrains Marketplace
- **Revenue share:** **15% flat** (capped at 25% in the developer agreement). Payouts at $200 minimum, guaranteed year-end payout even below.
- **Trader verification:** Required as of May 2025 for anyone selling (EU compliance). Must be selling 6+ months with $500+ gross to qualify for "verified vendor" badge.
- **Trust signals:** Download count, rating, verified vendor badge, compatibility matrix, last updated, JetBrains staff picks.
- **License enforcement:** JetBrains provides a licensing SDK that plugins integrate, so piracy is real but non-trivial.
- **Lesson:** 15% is the reasonable-vendor benchmark in developer tooling. JetBrains proved you can run a healthy paid plugin market inside a developer tool.

### Unity Asset Store
- **Revenue share:** **30%** (creator keeps 70%).
- **Refund:** 14 days, only if not downloaded. Automated refund system.
- **Reviews:** 5-star, only downloaders can review, 4-rating minimum before average shows. Publisher dashboard for managing reviews.
- **Quality gate:** Manual review by Unity team against submission guidelines. Professional polish required.
- **Lesson:** Strict submission review is the single biggest trust signal on UAS.

### Unreal Marketplace
- **Revenue share:** **12%** (creator keeps 88%) — the most creator-friendly benchmark in digital creative markets.
- **Refund:** 10 days, seller responsible to fix issues first. Epic mediates.
- **Lesson:** Epic uses 88/12 as a weapon against Unity's 70/30. This is a positioning choice, not a math one.

### Shopify Theme Store
- **Revenue share:** Shopify takes **15%** on paid themes.
- **Quality gate:** Heavy manual review. Themes must pass performance, code quality, accessibility, security audits.
- **Free vs paid coexistence:** A handful of official free themes + 100+ paid premium themes up to $400. Free themes are Shopify-built first-party (safe default), paid themes are partner-built (specialized).
- **Lesson:** First-party free + third-party paid is a clean split. Free serves "get started," paid serves "level up."

### WordPress.org Plugins
- **Structure:** Free directory of 60K+ plugins, many with paid "pro" upgrades sold off-site.
- **Pattern:** "Freemium core" dominates. Free plugin drives installs, pro version sells on creator's own site (Freemius, EDD, etc.).
- **Conversion rates:** 1-2% average, up to ~5% for the best freemium products.
- **Lesson:** Free-to-paid conversion is a narrow funnel. You need enormous free reach to make paid work.

---

## 2. Review fraud & anti-abuse

### Amazon
- Blocks ~250M suspected fake reviews/year using ML on reviewer behavior, account networks, timing, purchase verification.
- Uses NLP (CNN, RNN, transformer models) on review text for authenticity.
- Requires verified purchase for highest-weight reviews.

### Steam
- Only verified owners can review.
- Histograms show rating-over-time so reviewers can spot short spikes.
- Since 2019, Valve's "off-topic review bomb" detector flags and excludes bomb periods from displayed scores.

### GitHub (star farming)
- 2024 saw a 100x surge in fake stars. Research detects them via: accounts created same-day as star, cluster patterns (N users starring M repos in short window), short-lived accounts, no other activity.
- GitHub removes fake stars retroactively. Fake star repos are disproportionately malware/phishing.

### Small-marketplace playbook (what RuleSell can actually do at launch)
1. **Verified purchase / use requirement** for reviews (only people who installed/downloaded can review).
2. **Rate-limit everything** — one review per item per account, per day limits on stars.
3. **Cluster detection** — cheap heuristic: flag if N accounts, created within M days, interact with the same item or creator.
4. **Histogram over time** — show rating-over-time on the item page (Steam-style). Makes bombs self-evident.
5. **Weight reviews by account age and history** — a 2-year-old account with 40 reviews beats a 2-day-old account with 1.
6. **Manual moderation queue** for top-N items and any item that spikes.
7. **Don't show star counts below a floor** (e.g., hide average until 5+ reviews) — Unity-style.

---

## 3. Revenue share — 2026 benchmarks

| Platform | Take rate | Notes |
|---|---|---|
| Apple App Store | 15-30% | 15% under $1M, 30% above |
| Google Play | 15-30% | Same structure |
| Steam | 30% | 25% at $10M, 20% at $50M |
| Unity Asset Store | 30% | Flat |
| Unreal Marketplace | 12% | Epic positioning vs Unity |
| VS Code Marketplace | 0% | Publishers self-host billing |
| JetBrains Marketplace | **15%** | Flat, capped at 25% in agreement |
| Figma Community | **15%** | Creators keep 85%, Figma handles tax/refund |
| Shopify Theme Store | **15%** | Flat, heavy review gate |
| GitHub Marketplace (apps) | ~25% | Verified publishers only |
| Substack | 10% + Stripe | Effective ~13-16% |
| Patreon | 5-12% + Stripe | Tiered by plan |
| Gumroad (direct) | 10% + $0.50 | MoR since 2025 |
| Gumroad (via Discover) | 30% | Marketplace fee |
| Lemon Squeezy | 5% + 50c | MoR, $15 per chargeback |

**Appropriate for RuleSell bootstrapping in 2026:** **15%.**

Reasoning:
- 15% is the credible "we're a serious marketplace that handles infra" number. JetBrains, Figma, Shopify all converge here. It signals professional intent.
- 10% is bargain-basement and signals "we're a Gumroad-alike" — wrong positioning for a curated marketplace with review/trust infrastructure.
- 30% is what giants charge because they have distribution. You don't. 30% is a wall creators will not climb.
- 20% is the most-defensible "middle" but creators will still benchmark you against Figma/JetBrains and feel cheated.
- **Launch at 15%. Keep the door open to 10% for an "early creator" cohort for first 6 months as a land-grab.**

Minimum payout: **$50** (JetBrains uses $200 but that's with annual guaranteed payout; $50 makes you accessible to long-tail creators).
Payout cadence: **monthly**, 30-day hold for chargebacks.

---

## 4. Recommendations for RuleSell

### 4.1 Trust system (item + creator, separate badges, both visible)

**Item-level badges:**
- `Verified` — item was manually reviewed by RuleSell staff (quality, safety, accuracy). Earned by submission review. Required for paid listings.
- `Popular` — auto-earned by install/use count threshold (e.g., 500+ installs in 30 days).
- `Editor's Pick` — manual, staff-curated, rotates monthly.
- `Official` — first-party content published by RuleSell itself (like Shopify's own free themes).
- `Updated` — green dot if updated in last 90 days.
- License badge — "Commercial OK," "Non-commercial," "OpenRAIL-style" — copied from HF.

**Creator-level marks:**
- `Verified Creator` — email + domain verified, 2FA on.
- `Trader` — EU-compliant trader verification, required to sell paid (JetBrains pattern).
- `Team` — multi-seat creator account, shows team members.
- `Maintainer` — linked to an OSS project with >N GitHub stars, pulled automatically.
- `Top Rated` — maintained 4.5+ star avg across 20+ items.

Keep item and creator badges **separate and stacked** on the listing. Don't fuse them. Users trust the item and the creator for different reasons.

### 4.2 Creator tiers (progression system)

1. **User** — can browse, install, review.
2. **Builder** — published 1+ free items. Unlocks creator profile page.
3. **Seller** — passed trader verification and published 1+ paid item. Unlocks payouts, analytics, pricing tools.
4. **Certified** — submitted item passed manual quality review. Unlocks Verified badge.
5. **Team** — multi-seat organization account.
6. **Maintainer** — OSS project-linked, for upstream maintainers who publish rules for their own libraries.

Users progress naturally. Certified is the one worth paying staff time on.

### 4.3 Refund policy
- **14 days, one refund per item per account, no-questions-asked if not "used" (defined: opened in the workspace / installed).**
- After 14 days, discretionary and seller-mediated (Unreal pattern).
- Chargebacks eat seller revenue plus a $5 admin fee.
- Subscription items (rule packs with monthly updates): pro-rated refund for current billing period, cancel anytime.

### 4.4 Anti-abuse at launch
1. Verified purchase/install required to review.
2. Account age + history weighted into review display.
3. Rating histogram on item page, Steam-style.
4. Cluster detection heuristic on reviews AND on installs (flag clusters).
5. Hide average rating until 5+ reviews.
6. Manual moderation queue for: new items from unverified creators, sudden rating spikes, flagged reviews.
7. Report button with 24h SLA at launch.
8. Rate limit: 1 review per item, 5 reviews per account per day, 10 stars per account per day.

### 4.5 Free vs paid coexistence

Do all of these:
- **Mix in discovery by default.** Sort by relevance, not by price. Paid and free compete on quality.
- **Let users filter** to "free only" or "paid only" as a tab, not the default.
- **Differentiate visually but not hierarchically.** Price chip on paid cards. No boost, no demotion.
- **Separate "what's popular" from "what's top paid."** Two carousels on homepage.
- **First-party free items.** Ship a baseline set of official free rule packs yourself (Shopify theme pattern). These set the quality floor and the "you can trust us" tone.
- **Official OSS mirror.** Mirror popular OSS rule projects into the marketplace with the maintainer's blessing, badged as `Maintainer`. This stops the "I'll just go to GitHub" drain.

### 4.6 Pricing recommendations
- **Flat one-time:** $5-29 for single rule files/small configs.
- **Flat one-time:** $29-99 for curated packs/frameworks.
- **Subscription:** $3-9/month for continuously-updated rule packs (these are the best paid products — they have a reason to be recurring).
- **Team pricing:** 3x single for 10 seats, 6x for unlimited.
- **Freemium core:** allow "free tier + paid advanced bundle" on the same listing.
- **No sub $5 items** — destroys signal and increases refund-to-revenue ratio.

### 4.7 Top 3 ways to prevent "free OSS eats paid"

1. **Sell what OSS structurally cannot:** curation, maintenance guarantees, support SLAs, update subscriptions, certified quality, team features. A free OSS rule file is a point-in-time artifact; a $5/mo curated "always-current Next.js rules pack maintained by a specialist" is a service. Same applies to "Team pack" with enterprise guarantees.

2. **First-party free floor + creator-made paid ceiling.** Make sure the best free items are yours (official first-party), so creators aren't competing against random high-quality OSS — they're competing against an official baseline. This is the Shopify theme model and it works.

3. **Bundle, curate, and version-lock.** A paid item should be a bundle that does something a single OSS file can't: covers multiple frameworks, comes with examples, includes a changelog, has a versioning contract. Paid = "I did the integration work for you." OSS = "here's a file."

---

## Sources
- GitHub docs (marketplace, verified publishers, pricing plans)
- VS Code marketplace docs; GitLens / Wallaby / Tabnine pricing pages
- Figma help center (selling Community resources)
- n8n pricing page; community template libraries
- Hugging Face pricing, licenses, OpenRAIL blog
- JetBrains marketplace revenue docs (15% flat, $200 payout)
- Unity refund policy, publisher agreement
- Epic UE marketplace 88/12 announcement and refund policy
- Shopify theme store docs (15% commission)
- Freemius blog (WordPress freemium patterns, conversion rates)
- arxiv/CMU research on fake GitHub stars (2024-2025)
- Steam review bombing detection (Valve 2019 policy)
- Ruul / Veloxthemes / UserJot comparison of Gumroad, Lemon Squeezy, Stripe fees
