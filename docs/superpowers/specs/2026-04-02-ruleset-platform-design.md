# Ruleset Platform — Design Spec

**Date:** 2026-04-02
**Status:** Approved
**Deployment:** Railway (web + Postgres + cron) with external services (Cloudflare R2, Lemon Squeezy, Resend)

---

## 1. Overview

Ruleset is a production-ready community marketplace for buying, selling, and sharing AI rulesets and AI-related content. It combines GitHub's community model (upvotes, following, profiles, discussions, versioning) with Hugging Face's content-sharing approach into a marketplace for AI configuration content.

**Core principles:**
- No login required to browse, search, and read preview content
- Free accounts can publish and sell — no paywall on creation
- Pro adds full analytics + lower platform commission rate. No ad system in v1
- All environment-specific config via env vars — zero code changes between local and production

---

## 2. Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14+ (App Router), TypeScript |
| Database | PostgreSQL (Railway-managed), Prisma ORM |
| Auth | NextAuth.js — email/password + GitHub OAuth + Google OAuth |
| Payments | Lemon Squeezy — checkout, marketplace payouts, Pro subscriptions |
| Storage | Cloudflare R2 (S3-compatible) — file bundles |
| Search | PostgreSQL tsvector (generated column + GIN index) + pg_trgm |
| Email | Resend — transactional email (verification, receipts, notifications) |
| Styling | Tailwind CSS — dark theme |
| Deployment | Railway (Next.js web service + PostgreSQL + cron jobs) |

**External services (not on Railway):**
- Cloudflare R2 — object storage
- Lemon Squeezy — payments & subscriptions
- Resend — transactional email

---

## 3. Project Structure

```
ruleset/
├── src/
│   ├── app/                  # Next.js App Router pages & API routes
│   │   ├── (public)/         # Public routes (no auth required)
│   │   ├── (auth)/           # Login, signup, verify, reset
│   │   ├── dashboard/        # Authenticated seller/buyer dashboard
│   │   ├── admin/            # Admin panel
│   │   └── api/              # API route handlers
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Business logic, utils, config
│   │   ├── api/              # API helpers (response envelope, pagination)
│   │   ├── auth/             # Auth utilities
│   │   ├── db/               # Database queries
│   │   ├── email/            # Email templates and sending
│   │   ├── payments/         # Lemon Squeezy integration
│   │   ├── search/           # Search utilities
│   │   └── storage/          # S3/R2 operations
│   ├── server/               # Server-only code
│   └── types/                # TypeScript types
├── prisma/                   # Schema & migrations
├── public/                   # Static assets
├── .env.example              # Documented env template
└── ...config files
```

---

## 4. Content Access State Matrix

These 7 states govern what a user sees on every ruleset detail page, download endpoint, and API response. Every content-rendering component and API handler must resolve to one of these states.

| State | Who | Content Visible | Action Button | Notes |
|-------|-----|----------------|---------------|-------|
| **PUBLIC** | Not logged in | previewContent only (~10 lines) | "Sign in to download" (free) or "Sign in to buy" (paid) | No login required to view preview |
| **FREE_DOWNLOAD** | Logged in, free ruleset, not yet downloaded | previewContent only | "Get" (free download) | Login required to access full content |
| **PURCHASED** | Logged in, has valid Purchase | Full content + files | "Download" | Presigned URL via /api/downloads |
| **SUBSCRIPTION_ACTIVE** | Logged in, active subscription access | Full content + files | "Download" | Same download flow as PURCHASED |
| **SUBSCRIPTION_EXPIRED** | Logged in, subscription lapsed | previewContent only | "Renew subscription" | Access revoked, can re-subscribe |
| **REFUNDED** | Logged in, purchase was refunded | previewContent only | "Buy" (can repurchase) | Access revoked on refund |
| **AUTHOR** | Logged in, is the ruleset creator | Full content always | "Edit" | Version history tab + analytics tab visible |

**Resolution order:** Check AUTHOR first (always wins), then PURCHASED/SUBSCRIPTION_ACTIVE, then REFUNDED/SUBSCRIPTION_EXPIRED, then FREE_DOWNLOAD (if price=0 and logged in), then PUBLIC.

---

## 5. Post-Purchase Polling Flow

This flow spans frontend, API, and webhook handler. It must work reliably because failed purchase confirmation = support tickets.

```
1. User clicks "Buy" → Lemon Squeezy checkout opens (overlay or redirect)
2. User completes payment in Lemon Squeezy
3. Lemon Squeezy sends webhook → POST /api/webhooks/lemonsqueezy
   - Verify HMAC signature using raw body (NOT parsed JSON)
   - Create/update Purchase record: status = COMPLETED
   - Record platformFee based on seller's role (standard vs Pro rate)
   - Send receipt email via Resend
4. Meanwhile: Lemon Squeezy checkout closes → redirect buyer to /r/[slug]?purchase=success
5. Frontend detects ?purchase=success query param:
   - Start polling GET /api/purchases/status?rulesetId=[id] every 2 seconds
   - Max 30 seconds (15 attempts)
6. When Purchase confirmed (status: COMPLETED):
   - Swap UI state to PURCHASED without full page reload
   - Show success toast: "Purchase confirmed — your ruleset is ready"
   - Show "Download" button
7. If polling times out after 30s:
   - Show: "Payment processing... check /dashboard/purchases in a moment"
   - Purchase will appear when webhook eventually processes
```

**Webhook route critical note:** Next.js App Router requires reading the raw body for HMAC verification:
```typescript
// /api/webhooks/lemonsqueezy/route.ts
const rawBody = await req.text() // NOT req.json()
// Verify HMAC with rawBody before parsing
```

---

## 6. Data Model

### User
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| email | String | Unique |
| passwordHash | String? | Nullable for OAuth-only users |
| name | String | Display name |
| username | String | Unique, URL-safe |
| avatar | String? | URL |
| bio | String? | |
| role | Enum: USER, PRO, ADMIN | Default: USER |
| sellerStatus | Enum: NONE, PENDING, ACTIVE, SUSPENDED | Default: NONE |
| lemonsqueezyCustomerId | String? | For Lemon Squeezy seller payouts |
| totalEarnings | Float | Cached, default 0 |
| reputation | Int | Cached, default 0 |
| emailVerified | DateTime? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Account (NextAuth standard)
OAuth accounts linked to User — GitHub, Google.

### Ruleset
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| title | String | |
| slug | String | Unique, unique index |
| description | String | |
| previewContent | String | First ~10 lines, always public |
| type | Enum: RULESET, PROMPT, WORKFLOW, AGENT, BUNDLE, DATASET | |
| platform | Enum: CURSOR, VSCODE, OBSIDIAN, N8N, MAKE, GEMINI, CLAUDE, CHATGPT, OTHER | Extensible |
| category | String | |
| price | Float | 0 = free |
| currency | String | Default: USD |
| authorId | String | FK → User |
| downloadCount | Int | Cached |
| viewCount | Int | Cached |
| purchaseCount | Int | Cached |
| avgRating | Float | Cached |
| ratingCount | Int | Cached |
| trendingScore | Float | Cached, recalculated by cron |
| status | Enum: DRAFT, PUBLISHED, ARCHIVED, FLAGGED | |
| searchVector | tsvector | Generated column, GIN indexed |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### RulesetVersion
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| rulesetId | String | FK → Ruleset |
| version | String | Semver (e.g. "1.4.2") |
| fullContent | String | Complete content (only visible to author) |
| changelog | String? | |
| createdAt | DateTime | |

### FileBundle
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| rulesetVersionId | String | FK → RulesetVersion |
| storageKey | String | Opaque key: `rulesets/{rulesetId}/{versionId}/{uuid}-{sanitizedFilename}` |
| filename | String | Original filename |
| sizeBytes | Int | |
| mimeType | String | |
| format | Enum: CURSORRULES, MARKDOWN, JSON, YAML, TOML, ZIP, JAVASCRIPT, PYTHON, TEXT | |
| installInstructions | String? | |

### Tag
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| name | String | Unique, lowercase normalized |
| usageCount | Int | Cached |

### RulesetTag (join table)
| Field | Type |
|-------|------|
| rulesetId | String |
| tagId | String |

### Vote
| Field | Type | Notes |
|-------|------|-------|
| userId | String | Composite PK with rulesetId |
| rulesetId | String | |
| createdAt | DateTime | |

### Review
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | FK → User |
| rulesetId | String | FK → Ruleset |
| rating | Int | 1-5 |
| comment | String | |
| isVerifiedPurchase | Boolean | |
| refunded | Boolean | Default false — excluded from avgRating if true |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Purchase
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| buyerId | String | FK → User |
| rulesetId | String | FK → Ruleset |
| amount | Float | |
| platformFee | Float | |
| lemonsqueezyOrderId | String | |
| accessType | Enum: LIFETIME, SUBSCRIPTION | |
| accessExpiresAt | DateTime? | Nullable for lifetime |
| status | Enum: PENDING, COMPLETED, REFUNDED | |
| refundedAt | DateTime? | |
| createdAt | DateTime | |

### Follow
| Field | Type |
|-------|------|
| followerId | String | Composite PK with followingId |
| followingId | String |
| createdAt | DateTime |

### Collection
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | FK → User |
| name | String | |
| slug | String | |
| description | String? | |
| isPublic | Boolean | Default true |
| createdAt | DateTime | |

### CollectionItem
| Field | Type |
|-------|------|
| collectionId | String |
| rulesetId | String |
| position | Int |

### SavedItem (wishlist)
| Field | Type |
|-------|------|
| userId | String |
| rulesetId | String |
| createdAt | DateTime |

### RulesetBundle
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| title | String | |
| slug | String | Unique |
| description | String | |
| authorId | String | FK → User |
| price | Float | |
| createdAt | DateTime | |

### BundleItem
| Field | Type |
|-------|------|
| bundleId | String |
| rulesetId | String |

### Discussion
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| title | String | |
| slug | String | |
| body | String | Markdown, sanitized |
| authorId | String | FK → User |
| rulesetId | String? | Nullable — can be general |
| category | String | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### DiscussionReply
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| discussionId | String | FK → Discussion |
| parentReplyId | String? | Nullable — max 2 levels (reply to discussion or reply to reply) |
| authorId | String | FK → User |
| body | String | Markdown, sanitized |
| createdAt | DateTime | |

### Notification
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | FK → User |
| type | Enum: NEW_FOLLOWER, NEW_REVIEW, REVIEW_REPLY, SALE_MADE, RULESET_UPDATED, DISCUSSION_REPLY, PAYOUT_COMPLETE, ADMIN_ANNOUNCEMENT | |
| data | Json | Type-specific payload |
| read | Boolean | Default false |
| emailSent | Boolean | Default false |
| createdAt | DateTime | |

### NotificationPreference
| Field | Type | Notes |
|-------|------|-------|
| userId | String | FK → User |
| type | Enum (same as Notification.type) | |
| emailEnabled | Boolean | Default true |
| inAppEnabled | Boolean | Default true |

### RulesetEvent (for trending)
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| rulesetId | String | FK → Ruleset |
| type | Enum: VIEW, VOTE, DOWNLOAD, PURCHASE | |
| createdAt | DateTime | Indexed for 7-day window queries |

### Payout
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | FK → User (seller) |
| amount | Float | |
| status | Enum: PENDING, PROCESSING, COMPLETED, FAILED | |
| lemonsqueezyPayoutId | String? | |
| createdAt | DateTime | |
| completedAt | DateTime? | |

### Report
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| reporterId | String | FK → User |
| rulesetId | String | FK → Ruleset |
| reason | Enum: SPAM, MALWARE, COPYRIGHT, INAPPROPRIATE, OTHER | |
| details | String? | |
| status | Enum: PENDING, REVIEWED, RESOLVED, DISMISSED | |
| resolvedBy | String? | FK → User (admin) |
| createdAt | DateTime | |
| resolvedAt | DateTime? | |

---

## 7. Routes

### Public (no login required)
| Route | Purpose |
|-------|---------|
| `/` | Marketplace home — hero, tabs, sidebar filters |
| `/r/[slug]` | Ruleset detail |
| `/u/[username]` | Creator profile |
| `/u/[username]/collections` | Creator's public collections |
| `/trending` | Trending page |
| `/search` | Search + filters (URL param driven) |
| `/tags/[tag]` | Tag landing page |
| `/collections` | Browse public collections |
| `/collections/[id]/[slug]` | Collection detail |
| `/discussions` | Forum home |
| `/discussions/[category]` | Category feed |
| `/discussions/[id]/[slug]` | Thread |
| `/bundles/[slug]` | Bundle detail |
| `/docs` | Platform docs |
| `/docs/[...slug]` | Doc sub-pages + wiki |
| `/about` | About page |
| `/pricing` | Pro plan |
| `/sellers` | Seller landing page |
| `/changelog` | Platform updates |
| `/blog` | Blog (optional) |
| `/login` | Sign in |
| `/signup` | Create account |
| `/verify-email` | Email verification |
| `/reset-password` | Password reset |

### Authenticated (free account)
| Route | Purpose |
|-------|---------|
| `/dashboard/overview` | Home with summary cards |
| `/dashboard/rulesets` | My rulesets list |
| `/dashboard/rulesets/new` | Publish new |
| `/dashboard/rulesets/[id]/edit` | Edit ruleset |
| `/dashboard/rulesets/[id]/versions` | Version management (author only) |
| `/dashboard/rulesets/[id]/reviews` | Manage reviews |
| `/dashboard/rulesets/[id]/analytics` | Basic stats |
| `/dashboard/bundles` | My bundles |
| `/dashboard/bundles/new` | Create bundle |
| `/dashboard/bundles/[id]/edit` | Edit bundle |
| `/dashboard/earnings` | Revenue + payout history |
| `/dashboard/purchases` | Bought rulesets |
| `/dashboard/saved` | Wishlist |
| `/dashboard/collections` | My collections |
| `/dashboard/collections/new` | Create collection |
| `/dashboard/collections/[id]/edit` | Edit collection |
| `/discussions/new` | Create thread |
| `/settings` | Profile + preferences |
| `/settings/account` | Email, password, OAuth |
| `/settings/notifications` | Notification preferences |
| `/settings/billing` | Pro subscription management |

### Pro
| Route | Purpose |
|-------|---------|
| `/dashboard/analytics` | Full seller analytics |

### Admin
| Route | Purpose |
|-------|---------|
| `/admin` | Overview |
| `/admin/users` | User management |
| `/admin/rulesets` | Content moderation queue |
| `/admin/reports` | Flagged content |
| `/admin/payouts` | Payout management |
| `/admin/settings` | Platform config |

---

## 8. API Endpoints

### Response Envelopes

**Paginated list response:**
```typescript
{
  data: T[],
  pagination: {
    total: number,
    page: number,        // offset-based (dashboard tables)
    pageSize: number,
    hasNext: boolean,
    hasPrev: boolean,
    nextCursor?: string  // cursor-based (feeds, infinite scroll)
  }
}
```

**Single resource response:**
```typescript
{
  data: T
}
```

**Error response:**
```typescript
{
  error: {
    code: string,       // e.g. "VALIDATION_ERROR"
    message: string,    // Human-readable
    details?: object    // Field-level errors etc.
  }
}
```

**Error codes:** VALIDATION_ERROR (400), UNAUTHORIZED (401), FORBIDDEN (403), NOT_FOUND (404), CONFLICT (409), RATE_LIMITED (429), INTERNAL_ERROR (500).

### Auth
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/auth/[...nextauth]` | NextAuth handlers |
| POST | `/api/auth/register` | Email/password signup |
| POST | `/api/auth/verify-email` | Email verification |
| POST | `/api/auth/reset-password` | Password reset |

### Rulesets
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/rulesets` | List/search (paginated, filterable). Cursor pagination |
| GET | `/api/rulesets/[id]` | Detail by ID (internal/dashboard) |
| GET | `/api/rulesets/by-slug/[slug]` | Detail by slug (public pages) |
| POST | `/api/rulesets` | Create (auth required) |
| PATCH | `/api/rulesets/[id]` | Update (author only) |
| DELETE | `/api/rulesets/[id]` | Soft delete (author only) |
| POST | `/api/rulesets/[id]/versions` | Create new version (author only) |

### Votes
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/votes` | Toggle vote `{ rulesetId }` |

**Optimistic vote rollback:**
- Success → no change (already showing correct state)
- 401 (not logged in) → revert count, redirect to /login
- 409 (already voted) → revert count, set button to already-voted state
- 500 (server error) → revert count, show toast "Vote failed, try again"

### Reviews
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/rulesets/[id]/reviews` | List reviews (paginated) |
| POST | `/api/rulesets/[id]/reviews` | Create review (verified purchase only) |
| PATCH | `/api/reviews/[id]` | Edit review (author of review only) |
| DELETE | `/api/reviews/[id]` | Delete review (review author or admin) |
| POST | `/api/reviews/[id]/reply` | Author reply to review |

Sellers cannot delete reviews on their own listings. Only the review author and admins can delete.

### Uploads
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/uploads/presign` | Get presigned PUT URL (Content-Length-Range: 1 byte to 50MB) |
| POST | `/api/uploads/confirm` | Verify upload (HeadObject) + create FileBundle |

### Downloads
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/downloads/[rulesetId]` | `?versionId=` optional. Verify purchase → presigned GET URL (15min) → 302 redirect |

**Download behavior:**
- No versionId → latest published version
- With versionId → specific version (verify buyer has access to ruleset)
- Author gets all versions, buyers get latest only

### Purchases
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/purchases/status` | `?rulesetId=` — returns `{ status: COMPLETED | PENDING | NOT_FOUND }`. Used by post-purchase polling |

### Discussions
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/discussions` | List (paginated by category). Cursor pagination |
| POST | `/api/discussions` | Create thread |
| POST | `/api/discussions/[id]/replies` | Reply (max 2 levels deep) |

### Users
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/users/[username]` | Public profile |
| POST | `/api/follow` | Toggle follow `{ userId }` |

### Collections
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/collections` | List user's collections |
| POST | `/api/collections` | Create collection |
| PATCH | `/api/collections/[id]` | Update collection |
| DELETE | `/api/collections/[id]` | Delete collection |
| POST | `/api/collections/[id]/items` | Add item `{ rulesetId }` |
| DELETE | `/api/collections/[id]/items/[rulesetId]` | Remove item |
| PATCH | `/api/collections/[id]/items/order` | Reorder `{ orderedIds: [] }` |

### Saved Items (Wishlist)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/saved` | List saved items (paginated) |
| POST | `/api/saved` | Toggle save `{ rulesetId }` |

### Tags
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/tags` | List all tags (with usageCount, sorted) |
| GET | `/api/tags/[tag]/rulesets` | Rulesets for a tag (paginated) |
| GET | `/api/tags/search` | `?q=` — autocomplete for tag input (prevents fragmentation) |

### Notifications
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/notifications` | List (paginated, unread count). Cursor pagination |
| PATCH | `/api/notifications/read` | Mark read (single or bulk) |

### Reports
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/reports` | `{ rulesetId, reason: SPAM|MALWARE|COPYRIGHT|INAPPROPRIATE|OTHER, details? }`. Rate limited: 5/day per user |

### Analytics
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/analytics/overview` | Total earnings, sales, downloads, followers. Auth required |
| GET | `/api/analytics/rulesets/[id]` | Views, downloads, purchases, revenue. `?period=7d|30d|90d|1y`. Pro only |
| GET | `/api/analytics/audience` | Top platforms, categories, geographic breakdown. Pro only |

### Admin
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/admin/rulesets` | Moderation queue (flagged content) |
| PATCH | `/api/admin/rulesets/[id]` | Approve / reject / archive |
| GET | `/api/admin/users` | User list with filters |
| PATCH | `/api/admin/users/[id]` | Ban / unban / change role |
| GET | `/api/admin/reports` | Flagged content queue |
| PATCH | `/api/admin/reports/[id]` | Resolve report |
| GET | `/api/admin/stats` | Platform-wide metrics |

All admin endpoints require `role: ADMIN` — return 403 for everyone else.

### Webhooks
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/webhooks/lemonsqueezy` | Payment events. HMAC signature verified. **Exempt from all rate limiting.** Raw body access required |

### OG Images
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/og/[slug]` | Dynamic OG image generation |

### Rate Limits

| Endpoint Group | Limit | Notes |
|----------------|-------|-------|
| Auth (login, register, reset) | 5 req/min per IP | |
| Search | 30 req/min per IP (unauth), 60/min (auth) | |
| Uploads | 10 req/hour per user | |
| Votes/follows/saves | 30 req/min per user | |
| Reports | 5 req/day per user | |
| General API | 100 req/min per user | |
| Webhooks (`/api/webhooks/*`) | **No rate limit** | HMAC signature verification only |

---

## 9. Trending Algorithm

**Formula:**
```
score = (votes_7d × 3 + purchases_7d × 5 + downloads_7d × 2 + views_7d × 0.1) × decay_factor

decay_factor = 1 / (1 + hours_since_last_event × 0.01)
```

- Events older than 7 days are excluded entirely (7-day window on RulesetEvent)
- Decay is based on recency of activity, not ruleset publish date
- A 3-month-old ruleset with a fresh activity spike ranks normally

**Execution:**
- Cron job runs every 15 minutes on Railway
- Recalculates `trendingScore` on every Ruleset that has events in the last 7 days
- Score cached directly on the Ruleset row for fast reads
- "Trending" tab queries `ORDER BY trendingScore DESC`

---

## 10. Search

**Full-text search:**
- `searchVector` is a generated tsvector column on Ruleset, updated by trigger on INSERT/UPDATE:
  ```sql
  searchVector = to_tsvector('english',
    coalesce(title, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce(previewContent, '')
  )
  ```
- Tags joined and appended separately (from Tag relation)
- GIN index on searchVector: `CREATE INDEX ruleset_search_idx ON "Ruleset" USING GIN(searchVector)`

**Fuzzy matching:**
- `pg_trgm` extension for typo-tolerant matching
- Trigram index on title and description

**Result highlighting:**
- `ts_headline` for highlighted search result snippets

**Filters (URL param driven):**
- platform, category, type, price range (free/paid/min-max), minimum rating, tags
- Sort: relevance, newest, most voted, most downloaded
- Filters displayed as removable chips, "Clear all" button
- Synced to URL params for shareable search URLs

**Empty state:**
- Show trending rulesets + "No results for X, try these popular ones"

---

## 11. File Storage & Upload

### Upload Flow
1. Author submits from dashboard → API validates auth
2. Server validates: extension whitelist, MIME type match, size ≤ 50MB
3. Server generates presigned PUT URL with Content-Length-Range condition (1 byte → 50MB, enforced at S3 level)
4. Presigned URL uses opaque key: `rulesets/{rulesetId}/{versionId}/{uuid}-{sanitizedFilename}`
5. Client uploads directly to S3/R2 (never proxy through server)
6. Client notifies server of completion
7. Server calls HeadObject to verify file actually exists at the storage key
8. If ZIP: streaming validation before creating FileBundle (see below)
9. Server creates FileBundle record

### Download Flow
```
GET /api/downloads/[rulesetId]?versionId=[optional]
→ verify session + Purchase (not REFUNDED/EXPIRED) or free access or AUTHOR
→ resolve versionId (param or latest published)
→ generate presigned GET URL (15min TTL)
→ 302 redirect (never return URL directly — prevents sharing)
```

### ZIP Validation (streaming, before FileBundle creation)
- Max 100 entries
- Max 200MB uncompressed (zip bomb prevention)
- No absolute paths
- No path traversal (`../../`)
- No symlinks
- Allowed extensions inside ZIP: same whitelist as top-level
- No executables inside (.exe, .sh, .bat, .ps1, .dll)
- Max 3 levels nesting depth
- Use streaming ZIP reader — never fully extract to disk

### Allowed Formats
`.cursorrules`, `.md`, `.json`, `.yaml`, `.yml`, `.txt`, `.zip`, `.toml`, `.js`, `.py`

`.js` and `.py` served as plain text downloads only — never executed server-side. `.xml` excluded (XXE risk, no legitimate use case).

### Storage Cleanup
S3/R2 lifecycle rule: delete objects in `rulesets/` prefix older than 24h with no corresponding FileBundle entry.

### CDN
Cloudflare R2 has free egress. Cloudflare CDN in front for edge caching, DDoS protection, geographic distribution. If migrating to AWS S3 later, use CloudFront signed URLs instead of S3 presigned URLs.

---

## 12. Auth & Security

### Authentication
- NextAuth.js with Credentials provider (email/password) + GitHub + Google OAuth
- Password hashing via bcrypt
- Email verification required before publishing/selling
- Password reset via time-limited token + email (Resend)

### Authorization Layers
| Level | Access |
|-------|--------|
| Public | Browse, search, read previewContent, view profiles |
| Authenticated | Download free content, purchase, vote, follow, comment, publish, sell |
| Pro | Full analytics, lower commission |
| Admin | Moderation, user management, payout management, platform config |

### Security Measures
- CSRF protection (NextAuth built-in)
- Rate limiting on API routes (see rate limit table)
- Input sanitization — all user content sanitized
- Webhook signature verification (HMAC, raw body)
- Row-level authorization — users can only edit/delete their own content
- Sensitive env vars never exposed to client
- File upload validation — whitelist, size limits, Content-Length-Range on presigned URLs
- Signed URLs for downloads (time-limited, per-purchase)

### Markdown Rendering Security
- Library: unified/remark + rehype-sanitize
- Allowed HTML: **none** (sanitize all raw HTML in markdown)
- Code blocks: shiki for syntax highlighting
- Allowed elements: headings, bold, italic, inline code, code blocks, links, lists, blockquotes
- Blocked: raw HTML, iframes, script, style tags
- Links: all external links get `rel="noopener noreferrer nofollow"`
- Images: blocked in discussions (prevents image hotlinking/tracking)

---

## 13. Notifications

### Types
| Type | Recipient | Trigger |
|------|-----------|---------|
| NEW_FOLLOWER | User | Someone follows them |
| NEW_REVIEW | Ruleset author | Review posted on their ruleset |
| REVIEW_REPLY | Review author | Author replies to their review |
| SALE_MADE | Seller | Someone purchases their ruleset |
| RULESET_UPDATED | Buyer | A ruleset they own gets a new version |
| DISCUSSION_REPLY | Thread/reply author | Reply to their discussion or reply |
| PAYOUT_COMPLETE | Seller | Payout processed |
| ADMIN_ANNOUNCEMENT | All users | Platform-wide announcement |

### Delivery
- In-app: bell icon with unread count, notification dropdown
- Email: sent via Resend, per-type opt-in/out in `/settings/notifications`
- Each type independently toggleable for email delivery (NotificationPreference table)
- `emailSent` flag on Notification prevents duplicate emails

---

## 14. Marketplace Features

### Voting
- Upvote only (no downvote), one per user per ruleset, requires login
- Optimistic UI with rollback on error (see API section for all 4 cases)

### Following Feed
- "Following" tab shows rulesets from followed creators
- Max 1 ruleset shown per author per day (prevents feed flooding)
- Cold start (following nobody): "Follow creators to see their latest work here" + suggested creators from trending authors

### Collections
- User-created lists of rulesets with custom ordering (position field)
- Public or private visibility
- Browsable at `/collections` and `/u/[username]/collections`

### Bundles
- Author-created packages of multiple rulesets at a bundled price
- Separate from collections (bundles are purchasable, collections are curated lists)

### Discussions
- Categories for organization
- Max 2 levels deep (thread → replies, no nested replies on replies)
- Markdown + code block syntax highlighting (shiki)
- Can be linked to a ruleset or standalone
- sanitized markdown (see Security section)

---

## 15. Payments & Monetization

### Model
- Platform commission on every sale (percentage of sale price)
- Standard commission rate for free users
- Reduced commission rate for Pro users
- Pro subscription managed via Lemon Squeezy

### Purchase Types
- **Lifetime access** — one-time payment, permanent access
- **Subscription access** — recurring, access revoked on expiration

### Refund Flow
1. Refund initiated via Lemon Squeezy (within 30-day window)
2. Webhook updates Purchase: `refundedAt` set, status → REFUNDED
3. Access revoked — content returns to purchase-gated state
4. Buyer's review stays but marked as refunded, excluded from avgRating calculation
5. Seller's Payout adjusted — refunded amount deducted from next payout

### Pro Plan
- Full analytics dashboard (views, conversions, revenue trends, audience)
- Lower platform commission rate
- No ad system in v1
- Managed via Lemon Squeezy subscription
- Billing managed at `/settings/billing`

---

## 16. Background Jobs (Railway Cron)

| Job | Schedule | Purpose |
|-----|----------|---------|
| Trending score recalculation | Every 15 minutes | Recalculate `trendingScore` on Rulesets with events in last 7 days |
| Orphaned upload cleanup | Daily | Delete S3 objects with no FileBundle reference older than 24h (or handled by R2 lifecycle rule) |
| Subscription reconciliation | Daily | Check Lemon Squeezy for expired/cancelled subscriptions. Catches missed webhooks. Updates user role and Purchase status |

All three jobs run as Railway cron services.

---

## 17. Environment Configuration

All environment-specific values come from `.env` files locally and Railway env vars in production. **Zero code changes between environments.**

### Required Environment Variables
```
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_STORE_ID=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=
UPLOAD_MAX_SIZE_BYTES=52428800

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000

# Pro
PRO_COMMISSION_RATE=
STANDARD_COMMISSION_RATE=
```

A `.env.example` file documents all variables with descriptions and safe defaults for local development.

---

## 18. Deployment (Railway)

### Services on Railway
- **Web service:** Next.js application
- **PostgreSQL:** Railway-managed database
- **Cron service 1:** Trending recalculation (every 15 min)
- **Cron service 2:** Subscription reconciliation + orphan cleanup (daily)

### External Services
- **Cloudflare R2:** Object storage for file bundles
- **Lemon Squeezy:** Payments, subscriptions, payouts
- **Resend:** Transactional email

### Deployment Notes
- Railway auto-deploys from GitHub on push to main
- Environment variables configured in Railway dashboard per environment
- PostgreSQL connection string provided by Railway as `DATABASE_URL`
- Prisma migrations run as part of the build/deploy step
