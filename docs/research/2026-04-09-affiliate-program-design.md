# RuleSell Affiliate Program Design

**Date:** 2026-04-09
**Status:** Ready for implementation

---

## Model: Hybrid (Creator + Platform)

### How it works

**Creator affiliates:** Any creator can enable affiliates on their paid items. They set the affiliate commission (5-30% of the sale price, default 10%). The platform's 15% cut is taken first, then the affiliate % comes from the creator's 85%.

Example: $19 item, 10% affiliate rate
- Platform: $2.85 (15%)
- Affiliate: $1.62 (10% of $16.15 creator share)
- Creator: $14.54 (remaining)

**Platform affiliates:** RuleSell offers a flat 5% referral bonus on any first purchase by a referred user, paid from the platform's 15% cut. This applies to ALL items, not just ones with creator-enabled affiliates. Encourages general marketplace promotion.

### Who can be an affiliate

- Any registered user. No approval process. Instant activation.
- Self-referral is allowed for creators promoting their own items (they get both creator revenue + affiliate bonus).
- The affiliate dashboard shows: clicks, conversions, earnings, payout history.

### Link format

```
rulesell.dev/r/[slug]?ref=[username]
```

Tracked via:
1. URL parameter on first click
2. `rulesell_ref` cookie set on click (30-day duration)
3. Server-side attribution at purchase time
4. If cookie AND URL param exist, URL param wins (last-click attribution)

### Cookie duration

**30 days.** Industry standard for digital products. Gumroad uses 30d, Amazon uses 24h (too short), Envato uses 90d (too generous for our scale).

### Payout structure

- Same as creator payouts: $50 minimum, monthly, 30-day hold for chargebacks
- Paid through Stripe Connect Express (same system as seller payouts)
- Affiliate earnings show in the dashboard alongside any creator earnings

### Commission rates

| Scenario | Rate | Who pays |
|---|---|---|
| Creator-enabled affiliate (default) | 10% of creator share | Creator |
| Creator-enabled affiliate (custom) | 5-30% of creator share | Creator |
| Platform referral (any first purchase) | 5% of sale price | Platform (from 15% cut) |
| Free item referral | $0 (tracked for analytics, no payout) | — |

### Influencer incentives

The pitch to influencers:
- "Share your link. If someone buys through it, you earn 10%. No approval needed."
- "You can promote any item on the marketplace. If the creator enabled affiliates, you get their rate. If not, you still get 5% platform referral on first purchases."
- "Cookie lasts 30 days. If they click your link today and buy next week, you still get credit."

### What the influencer sees (UI)

**Dashboard → Affiliates tab:**
- Your referral link (copy button)
- Per-item affiliate links (on every item detail page, "Share & Earn" button)
- Clicks (total, per item, per day chart)
- Conversions (total, per item)
- Earnings (total, pending, paid)
- Payout history

**On every item detail page:**
- Small "Share & Earn" link near the install button
- Click → reveals a "Copy your referral link" input with the ?ref= parameter
- If item has creator-enabled affiliates, show the rate: "Earn 10% on referrals"
- If not, show: "Earn 5% platform referral on first purchases"

### Implementation (frontend mock)

- `/affiliates` page — explains the program, how to join, commission structure
- `/dashboard/affiliates` — the affiliate dashboard with mock click/conversion/earnings data
- "Share & Earn" button on item detail pages
- `?ref=` param tracking in the mock (stores to localStorage, shows attribution in mock purchase flow)

---

## Anti-abuse

- Click fraud: rate-limit cookie creation per IP (max 10 unique ref cookies per IP per day)
- Self-buying: allowed for creator self-referral, but flagged if the same user both refers AND purchases (visible to admin)
- Cookie stuffing: only set cookie on genuine page visit (no 1x1 pixel), require JS execution
- Revenue share manipulation: platform rate (5%) is non-negotiable, creator rate has a floor (5%) and cap (30%)
