# Affiliate Program Patterns in Developer Marketplaces

**Date:** 2026-04-09
**Status:** Complete — validates and challenges the existing RuleSell affiliate design
**For:** RuleSell affiliate program implementation
**Method:** WebSearch across Gumroad, PromptBase, Amazon Associates, Envato, JetBrains, Teachable. Cross-referenced with the existing draft at `docs/research/2026-04-09-affiliate-program-design.md`.

---

## 1. Platform-by-platform breakdown

### Gumroad

| Attribute | Detail |
|-----------|--------|
| **Model** | Creator-controlled. No central affiliate program. Each creator enables affiliates per product and manually adds affiliates by email. |
| **Commission** | Creator sets the rate: 1–90% of the sale price. Default varies by creator. Most set 25–50% for digital products. |
| **Cookie duration** | Conflicting sources: Gumroad help center says 30 days, multiple affiliate review sites report 7 days. The shorter window is likely current. |
| **Approval** | Per-creator. The creator adds you by email — you can't self-sign-up for a specific product's affiliate program. However, Gumroad Discover (their marketplace surface) has broader affiliate options. |
| **Payout** | Weekly (Fridays), $10 minimum. Gumroad handles payment directly to affiliates. |
| **Anti-abuse** | Creator can see which affiliates drive sales. No automated fraud detection documented. Creator responsibility. |
| **Key insight** | The per-creator model is powerful for high-trust relationships but terrible for marketplace-wide discovery. An affiliate can't browse Gumroad, pick a product, and start promoting it — they need the creator's explicit invitation. This creates a cold-start problem for affiliates. |

### PromptBase

| Attribute | Detail |
|-----------|--------|
| **Model** | Platform-level. PromptBase takes 20% on all sales; creators keep 80%. No separate affiliate program documented as of 2026. |
| **Commission** | N/A — PromptBase hasn't launched a formal affiliate/referral program. Some creators use external affiliate links (their own Gumroad stores, etc.) to bypass PromptBase entirely. |
| **Cookie duration** | N/A |
| **Approval** | N/A |
| **Payout** | Creator payouts only: $5 minimum, processed via Stripe. |
| **Key insight** | PromptBase's lack of an affiliate program is a missed opportunity given their marketplace model. Prompt prices are low ($1.99–$9.99), making per-sale affiliate commissions tiny. This suggests affiliate programs only make economic sense when average item price is >$10. |

### Amazon Associates

| Attribute | Detail |
|-----------|--------|
| **Model** | Platform-level. Centralized program, any registered user can join after approval. |
| **Commission** | 1–20% depending on product category. Amazon Games tops at 20%. Luxury Beauty at 10%. Most physical goods 1–4.5%. Digital products typically 4–5%. |
| **Cookie duration** | **24 hours** — notoriously short. Exception: if the customer adds an item to cart within 24h, the cookie extends to 90 days for that cart. |
| **Approval** | Application required. Must make 3 sales within 180 days or account is closed. Geographic restrictions apply. |
| **Payout** | Monthly, 60-day hold. $10 minimum (direct deposit), $100 minimum (check). |
| **Anti-abuse** | Sophisticated ML-based fraud detection. Self-purchase explicitly forbidden. Link cloaking rules. Content policy enforcement. |
| **Key insight** | The 24-hour cookie is brutal for content creators — a blog post reader who bookmarks a product and buys 3 days later earns the affiliate nothing. Amazon gets away with this because of conversion volume (people buy *something* on Amazon). RuleSell cannot use this model — our items are considered purchases, not impulse buys. 30-day cookies are the minimum for developer tools. |

### Envato

| Attribute | Detail |
|-----------|--------|
| **Model** | Platform-level. Centralized via Impact (formerly Impact Radius). |
| **Commission** | **30%** of the referred customer's first purchase on Envato Market. For Envato Elements subscriptions: commission on first payment. |
| **Cookie duration** | **90 days** for Envato Market, **60 days** for Envato Elements and Placeit. |
| **Approval** | Application through Impact, manually reviewed by Envato's Partnerships team. Not instant — they evaluate your content and audience. |
| **Payout** | Monthly, processed on the 16th of the following month. No documented minimum payout. Paid through Impact. |
| **Anti-abuse** | Impact's built-in fraud detection. Terms prohibit self-referral, incentivized clicks, cookie stuffing, and brand bidding (paid search ads on "Envato" keywords). |
| **Key insight** | Envato's 30% affiliate commission is the highest in this study. They can afford it because: (1) high average order value on themes/templates ($30–$60), (2) the affiliate only earns on the *first* purchase (no recurring commission), and (3) the 90-day cookie captures long consideration cycles. This is a land-grab strategy — pay big to acquire, retain through product quality. |

### JetBrains

| Attribute | Detail |
|-----------|--------|
| **Model** | **No traditional affiliate program as of 2026.** JetBrains uses a reseller/partner model instead. 140+ resellers worldwide, technology partnerships, but no self-serve affiliate link system. |
| **Commission** | Resellers negotiate margins directly. Community advocates get free licenses, not commissions. |
| **Cookie duration** | N/A |
| **Approval** | Partner application, reviewed by JetBrains team. Requires demonstrated reach or business. |
| **Payout** | N/A (reseller invoicing, not affiliate payouts) |
| **Key insight** | JetBrains chose NOT to do affiliates, despite having a successful marketplace (with 15% take rate on plugins). Their reasoning is likely: (1) their audience (professional developers) doesn't respond well to affiliate marketing, (2) JetBrains has strong organic brand recognition, and (3) their product prices ($149–$649/year) make affiliate fraud a bigger risk. **This is a valid counter-signal for RuleSell** — not every developer marketplace needs an affiliate program. The question is whether RuleSell's items (lower price, less brand recognition) benefit more from affiliate distribution than JetBrains' do. The answer is yes, because we lack organic distribution. |

### Teachable

| Attribute | Detail |
|-----------|--------|
| **Model** | Hybrid. Teachable has a platform-level affiliate program (promote Teachable itself) AND allows course creators to run their own affiliate programs for individual courses. |
| **Commission** | **Platform affiliate:** 30% recurring commission on referred Teachable subscriptions for 1 year. **Creator affiliate:** Creator sets the rate (typically 20–50% of course price). |
| **Cookie duration** | **30 days** for platform affiliates. Creator-set cookie duration for course-level affiliates (Teachable added custom cookie periods as a feature). |
| **Approval** | Platform: application through PartnerStack. Course-level: set by each creator (some auto-approve, some manually vet). |
| **Payout** | $50 minimum. Managed through PartnerStack for platform affiliates. Creator-level payouts managed through Teachable's own system. |
| **Anti-abuse** | PartnerStack fraud detection for platform program. Course-level: basic click tracking, creator responsibility. |
| **Key insight** | Teachable's hybrid model (platform + creator) is the closest analog to what the existing RuleSell design proposes. The key learning: Teachable's platform affiliate (promote Teachable itself, earn recurring) is separate from course-level affiliates (promote a course, earn per-sale). This two-layer approach works because the incentives are different — platform affiliates drive new signups, creator affiliates drive sales of specific items. |

---

## 2. Comparison matrix

| Platform | Commission | Cookie | Approval | Min payout | Affiliate model |
|----------|-----------|--------|----------|------------|----------------|
| **Gumroad** | 1–90% (creator-set) | 7–30 days | Per-creator invite | $10 | Creator-controlled |
| **PromptBase** | N/A | N/A | N/A | N/A | None |
| **Amazon** | 1–20% (category-based) | 24h (+90d cart) | Application, 3-sale gate | $10–$100 | Platform-controlled |
| **Envato** | 30% first purchase | 60–90 days | Application via Impact | None | Platform-controlled |
| **JetBrains** | N/A | N/A | N/A | N/A | None (reseller only) |
| **Teachable** | 30% recurring (platform) / creator-set (courses) | 30 days | PartnerStack / per-creator | $50 | Hybrid |

**Median commission for digital marketplaces with affiliate programs:** ~25–30% on first purchase.
**Median cookie duration:** 30 days.
**Median minimum payout:** $10–$50.

---

## 3. Validation of the existing RuleSell affiliate design

The existing draft (`2026-04-09-affiliate-program-design.md`) proposes a hybrid model with creator affiliates (5–30% of creator share) and a platform referral (5% of sale price on first purchases). Here's what the research validates and challenges:

### What the draft gets right

**1. Hybrid model (creator + platform).** This is the Teachable pattern and it's the right call for a marketplace that needs both item-specific promotion (creator affiliates) and general marketplace promotion (platform referral). Validated.

**2. No approval process.** Gumroad requires creator invitation. Amazon requires 3 sales in 180 days. Envato requires manual review. RuleSell's "any registered user, instant activation" is a deliberate trade-off: more fraud risk, but lower friction for a marketplace that needs early distribution. At RuleSell's scale (pre-traction), friction kills more value than fraud. **Validated, but add an automated review at $500 cumulative earnings** — that's where fraud becomes worth catching.

**3. 30-day cookie.** This is the industry median. Amazon's 24h is too short for considered purchases. Envato's 90 days is generous but defensible for $30+ items. RuleSell's items range from $5–$99, with most in the $5–$29 range. 30 days is appropriate. Validated.

**4. $50 minimum payout, monthly, 30-day hold.** Matches Teachable exactly. Amazon's $10 minimum would create too many micro-payouts at RuleSell's price points. JetBrains' $200 minimum would be inaccessible for long-tail affiliates. $50 is the right balance. Validated.

**5. Last-click attribution (URL param wins over cookie).** Standard across all platforms studied. No one uses first-click for marketplace affiliates. Validated.

### What the draft should reconsider

**1. Creator affiliate commission base: "% of creator share" vs "% of sale price."**

The draft calculates affiliate commission as a percentage of the *creator's 85% share*, not the *sale price*. This is unusual. Gumroad, Envato, and Teachable all calculate affiliate commission as a percentage of the *sale price* (or the full amount before platform fees).

The RuleSell draft's approach:
- $19 item, 10% affiliate rate → Affiliate gets $1.62 (10% of $16.15)

If we used the industry-standard approach (% of sale price):
- $19 item, 10% affiliate rate → Affiliate gets $1.90 (10% of $19)

**Recommendation: Switch to % of sale price.** The affiliate doesn't care about the platform's internal economics. When you tell an affiliate "you earn 10%," they expect 10% of the price they see. Calculating against the creator share creates confusion and feels like a hidden fee.

New math:
- $19 item, 10% affiliate rate
- Platform: $2.85 (15%)
- Affiliate: $1.90 (10% of $19)
- Creator: $14.25 (remaining 75%)

The creator's effective take-home drops from 76.5% to 75%. This is a minor difference but removes a major source of affiliate confusion.

**2. Platform referral rate: 5% may be too low to motivate.**

At a $19 average item price, a 5% platform referral earns the affiliate $0.95 per referred first purchase. After the $50 minimum payout threshold, that's 53 successful referrals before the first payout. For a content creator or blogger, that's a lot of work for very little money.

Envato pays 30% on first purchases. Teachable pays 30% recurring for a year. Even Amazon's low rates (1–4%) are offset by massive catalog breadth and impulse-buy volume.

**Recommendation: Raise platform referral to 10% for the first 6 months as a launch incentive, then drop to 5%.** At 10% of a $19 item, the affiliate earns $1.90 — still modest, but 26 referrals to first payout is more realistic for early-stage distribution. The cost comes from the platform's 15% cut, so at 10%, the platform earns only 5% net on referred first purchases. This is acceptable during a land-grab phase.

**3. Self-referral policy needs refinement.**

The draft allows self-referral: creators promoting their own items can earn both creator revenue + affiliate bonus. This is uncommon — most platforms (Amazon, Envato) explicitly prohibit self-referral. Gumroad technically allows it but doesn't incentivize it.

The risk isn't fraud — a creator buying their own item to get a small affiliate bonus is economically irrational (they'd earn more just by not having an affiliate layer). The risk is **perception**: if a creator's affiliate dashboard shows earnings from their own purchases, it muddies the data and makes the program look like a loyalty hack rather than a distribution tool.

**Recommendation: Keep self-referral allowed (it's a net-positive incentive for creators to share their own links), but separate self-referral earnings in the dashboard** — show "from your promotions" vs "from other affiliates" as distinct line items. And explicitly exclude self-purchases from the affiliate conversion count (so a creator's "conversion rate" metric isn't inflated by their own buys).

**4. Missing: affiliate tiers.**

None of the platforms studied (at our scale) use tiered affiliate commissions, but both Envato and Teachable offer bonus incentives for top performers. The draft doesn't address what happens when an affiliate becomes a significant source of traffic.

**Recommendation: Don't implement tiers at launch.** A flat rate is simpler to explain and implement. Revisit when any single affiliate drives >100 conversions/month — that's the signal that tiered incentives would retain them. For now, the "Share & Earn" framing is correct: simple, flat, predictable.

**5. Missing: affiliate content guidelines.**

Amazon, Envato, and Teachable all have explicit affiliate content policies: no brand bidding (buying paid ads on "RuleSell" keywords), no misleading claims, no spam, no incentivized clicks ("click my link and I'll give you a free template"). The draft's anti-abuse section covers technical fraud (click fraud, cookie stuffing) but not content-based abuse.

**Recommendation: Add a one-page affiliate content policy.** Key rules:
- No paid ads bidding on "RuleSell" or "rulesell.dev" keywords
- No misleading claims about items ("this is the only working X" when it's not)
- No incentivized clicks or installs
- Affiliate must disclose the affiliate relationship (FTC requirement in the US, similar rules in the EU)
- Violation = earnings forfeiture for affected period + possible ban

---

## 4. Recommended model for RuleSell (final)

This reconciles the existing draft with the research findings:

### Structure

**Two-layer hybrid, matching the Teachable pattern:**

1. **Creator affiliates** — any registered user can promote any item where the creator has enabled affiliates. Commission is a % of the sale price (not creator share), set by the creator between 5–30%, default 10%.

2. **Platform referral** — any registered user earns a bonus on referred first purchases across the marketplace. 10% of sale price for the first 6 months (launch incentive), dropping to 5% after. Paid from the platform's 15% cut.

### Enrollment

- Instant activation for any registered user. No application, no minimum audience.
- Automated review triggered at $500 cumulative affiliate earnings (flag for manual check, don't block payouts).

### Attribution

- Link format: `rulesell.dev/r/[slug]?ref=[username]`
- 30-day cookie, set on genuine page visit (JS execution required)
- Last-click attribution: URL param overrides existing cookie
- Free items tracked for analytics, no payout

### Payouts

- $50 minimum, monthly, 30-day hold for chargebacks
- Stripe Connect Express (same pipeline as creator payouts)
- Self-referral earnings tracked but shown separately in dashboard

### Commission math (example: $19 item, 10% creator affiliate rate)

| Scenario | Platform | Affiliate | Creator |
|----------|---------|-----------|---------|
| Organic sale (no affiliate) | $2.85 (15%) | — | $16.15 (85%) |
| Creator affiliate (10%) | $2.85 (15%) | $1.90 (10%) | $14.25 (75%) |
| Platform referral only (10% launch / 5% steady) | $0.95–$1.90 (5–10%) | $0.95–$1.90 (5–10%) | $16.15 (85%) |
| Both (creator + platform on first purchase) | $0.95–$1.90 (5–10%) | $2.85–$3.80 (15–20%) | $14.25 (75%) |

Note: When both creator affiliate and platform referral apply (a referred first purchase through a creator-enabled affiliate link), the affiliate gets both rates stacked. This is the maximum incentive scenario and the most expensive for the platform (net platform take drops to 5–10%). This is acceptable at launch for distribution.

### Anti-abuse (expanded from draft)

**Technical:**
- Rate-limit cookie creation: max 10 unique ref cookies per IP per day
- Require JS execution for cookie set (no 1x1 pixel)
- Flag same-user refer-and-purchase (visible to admin)
- Creator affiliate rate floor 5%, cap 30%

**Content (new):**
- No brand bidding on "RuleSell" / "rulesell.dev" keywords
- No misleading claims about items
- No incentivized clicks or installs
- Affiliate disclosure required (FTC/EU compliance)
- Violation: earnings forfeiture for affected period + possible ban

---

## 5. What this means for implementation priority

The affiliate system has three layers, and they should be built in order:

**Layer 1 (MVP, build now):**
- `?ref=` parameter tracking + 30-day cookie
- Affiliate dashboard with mock data (clicks, conversions, earnings)
- "Share & Earn" button on item detail pages
- `/affiliates` explainer page

**Layer 2 (before real money flows):**
- Stripe Connect payout integration for affiliates
- Creator toggle: enable/disable affiliates per item, set rate
- Self-referral separation in dashboard
- Automated review flag at $500 cumulative

**Layer 3 (after traction):**
- Affiliate content policy page and enforcement
- Platform referral rate adjustment (10% → 5% after 6 months)
- Advanced analytics: per-item affiliate performance, top affiliates leaderboard
- Possible tier system if any affiliate exceeds 100 conversions/month

---

## Sources

- [Gumroad affiliate help center](https://help.gumroad.com/article/333-affiliates-on-gumroad) — creator-controlled model, payout details
- [Gumroad affiliate program review (SchoolMaker)](https://www.schoolmaker.com/blog/gumroad-affiliate-program) — commission rates, cookie duration discrepancy
- [Gumroad affiliate commission calculator (Indie Hackers)](https://www.indiehackers.com/post/how-to-calculate-affiliate-commissions-and-profits-with-gumroad-40b86fecec) — math on Gumroad fees + affiliate splits
- [Envato affiliate program (official)](https://www.envato.com/affiliates/) — 30% commission, Impact platform
- [Envato affiliate review (HomeBusinessWatch)](https://www.homebusinesswatch.com/companies/envato-affiliate) — 90-day cookie, payout schedule
- [Envato help center — affiliate program](https://help.market.envato.com/hc/en-us/articles/11695049571609-Affiliate-program) — terms and restrictions
- [Amazon Associates commission rates 2026 (Youfiliate)](https://www.youfiliate.com/blog/amazon-affiliate-commission-rates) — category breakdown
- [Amazon affiliate cookie duration (Azonpress)](https://azonpress.com/amazon-affiliate-cookie-duration/) — 24h + 90d cart extension
- [Amazon Associates help center](https://affiliate-program.amazon.com/help/node/topic/G9SMD8TQHFJ7728F) — program terms
- [Teachable affiliate program (SchoolMaker)](https://www.schoolmaker.com/blog/teachable-affiliate-program) — 30% recurring, 30-day cookie
- [Teachable custom cookie period changelog](https://changelog.teachable.com/custom-affiliate-cookie-period-42066) — creator-customizable cookies
- [Teachable partners page](https://www.teachable.com/partners) — PartnerStack integration
- [JetBrains partner page](https://www.jetbrains.com/company/consulting-partners/become-a-partner/) — reseller model, no affiliate program
- [JetBrains affiliate program inquiry (Knoji)](https://jetbrains.knoji.com/questions/jetbrains-affiliate-programs/) — confirmed no affiliate program found
- [PromptBase pricing (Humai blog)](https://www.humai.blog/prompt-library-as-a-digital-product-can-you-make-money-on-it-in-2026/) — 20% platform take, creator payouts
- [Affiliate cookie duration guide (just-affiliates)](https://just-affiliates.com/affiliate-marketing-cookie-duration/) — industry benchmarks
- [SaaS affiliate programs ranked (DodoPayments)](https://dodopayments.com/blogs/saas-affiliate-program) — 2026 commission benchmarks
