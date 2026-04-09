# Frontend API Contract

Every endpoint the RuleSell frontend calls. Backend team: implement these.

All endpoints return JSON. Errors use the standard shape:
```json
{ "error": { "code": "string", "message": "string", "details": {} } }
```

Auth: cookie-based sessions via NextAuth.js. Endpoints marked (auth) require a valid session.

---

## Rulesets

### GET /api/rulesets
List rulesets with pagination and filtering.

| Param | Type | Notes |
|---|---|---|
| tab | top, trending, new, editors | Optional. Preset filter. |
| platform | Platform enum | Optional |
| type | Type enum | Optional |
| category | Category enum | Optional |
| environment | string | Optional. e.g. "claude-code" |
| price | free, paid | Optional |
| sort | quality, installs, newest, rating | Default: quality |
| q | string | Search query |
| page | number | Default: 1 |
| pageSize | number | Default: 20, max: 50 |

**Response:** `Page<Ruleset>`
**Auth:** No

### GET /api/rulesets/by-slug/:slug
Get a single ruleset by URL slug.
**Response:** `Ruleset`
**Auth:** No

### GET /api/rulesets/:id
Get a single ruleset by ID.
**Response:** `Ruleset`
**Auth:** No

### POST /api/rulesets
Create a new ruleset (draft or published).
**Body:** `CreateRulesetInput`
**Response:** `Ruleset`
**Auth:** Yes (Builder or Seller)

### PATCH /api/rulesets/:id
Update an existing ruleset.
**Body:** `UpdateRulesetInput` (partial)
**Response:** `Ruleset`
**Auth:** Yes (owner or admin)

### DELETE /api/rulesets/:id
Delete a ruleset.
**Response:** 204 No Content
**Auth:** Yes (owner or admin)

---

## Votes

### POST /api/rulesets/:id/vote
Toggle vote on a ruleset. Idempotent toggle.
**Response:** `{ voted: boolean }`
**Auth:** Yes

---

## Saves

### POST /api/rulesets/:id/save
Toggle save on a ruleset.
**Response:** `{ saved: boolean }`
**Auth:** Yes

### GET /api/saved
List saved rulesets for the current user.
**Response:** `Page<Ruleset>`
**Auth:** Yes

---

## Reviews

### GET /api/rulesets/:id/reviews
List reviews for a ruleset.
**Params:** page, pageSize
**Response:** `Page<Review>`
**Auth:** No

### POST /api/rulesets/:id/reviews
Create a review. Gated to verified installers + Certified Devs.
**Body:** `CreateReviewInput`
**Response:** `Review`
**Auth:** Yes (verified install required)

---

## Users

### GET /api/users/:username
Get a public user profile.
**Response:** `User`
**Auth:** No
**Status:** NOT YET BUILT. Profile pages use SSR mock data.

### GET /api/users/me
Get the current authenticated user.
**Response:** `User`
**Auth:** Yes

### PATCH /api/users/me
Update current user profile.
**Body:** `UpdateUserInput`
**Response:** `User`
**Auth:** Yes

---

## Teams

### GET /api/teams/:slug
Get a team profile.
**Response:** `Team`
**Auth:** No

---

## Collections

### GET /api/collections
List all curated collections.
**Response:** `Collection[]`
**Auth:** No

### GET /api/collections/:slug
Get a single collection with its items.
**Response:** `Collection`
**Auth:** No

---

## Analytics

### GET /api/analytics/overview
Seller dashboard overview stats.
**Response:** `AnalyticsOverview`
**Auth:** Yes (Seller)

### GET /api/analytics/earnings
Seller earnings data.
**Params:** period (optional, e.g. "30d", "90d", "1y")
**Response:** `EarningsData`
**Auth:** Yes (Seller)

### GET /api/analytics/ruleset/:id
Per-item analytics.
**Response:** `RulesetAnalytics`
**Auth:** Yes (owner)

---

## Purchases

### GET /api/purchases
List purchases for the current user.
**Response:** `Page<Purchase>`
**Auth:** Yes

### GET /api/purchases/:id/status
Get purchase status (for polling during checkout).
**Response:** `PurchaseStatus`
**Auth:** Yes

### POST /api/checkout
Create a checkout session for a paid ruleset.
**Body:** `{ rulesetId: string }`
**Response:** `Purchase`
**Auth:** Yes

---

## Notifications

### GET /api/notifications
List notifications for the current user.
**Response:** `Notification[]`
**Auth:** Yes

### PATCH /api/notifications/:id
Mark a notification as read.
**Body:** `{ read: true }`
**Response:** 204
**Auth:** Yes

### POST /api/notifications/mark-all-read
Mark all notifications as read.
**Response:** 204
**Auth:** Yes

---

## Discussions

### GET /api/rulesets/:id/discussions
List discussions for a ruleset.
**Params:** category, sort (recent/active/unanswered), page, pageSize
**Response:** `Page<Discussion>`
**Auth:** No

### POST /api/rulesets/:id/discussions
Create a discussion thread. Gated to 15+ reputation.
**Body:** `CreateDiscussionInput`
**Response:** `Discussion`
**Auth:** Yes (15+ rep)

### POST /api/discussions/:id/replies
Reply to a discussion thread.
**Body:** `CreateReplyInput`
**Response:** `DiscussionReply`
**Auth:** Yes

---

## Leaderboard

### GET /api/leaderboard
Top rulesets by quality score.
**Params:** page, pageSize
**Response:** `Page<Ruleset>`
**Auth:** No

---

## Affiliates

### GET /api/affiliates/stats
Affiliate dashboard stats for the current user.
**Response:** `AffiliateStats`
**Auth:** Yes

### GET /api/affiliates/link/:slug
Get a referral link for a specific ruleset.
**Response:** `{ url: string }`
**Auth:** Yes

---

## Known Gaps

1. **GET /api/users/:username** — not yet built. Frontend falls back to mock data.
2. **Discussions backend** — not yet built. Frontend uses mock constants.
3. **Notifications backend** — not yet built. Frontend uses mock constants.
4. **Affiliate tracking** — not yet built. Frontend shows mock zeros.
5. **Purchase/checkout flow** — not yet built. Frontend shows mock states.
6. **File upload for publishing** — not yet specified. Frontend wizard collects data but doesn't upload.
