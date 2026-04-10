# Data Contracts — Frontend ↔ Backend

All TypeScript interfaces are defined in `src/types/index.ts`. This document maps the frontend's data expectations to API endpoint contracts.

## Existing Contracts (Already Implemented)

These endpoints exist in `src/app/api/` and are working:

### Rulesets
```
GET  /api/rulesets?page=&pageSize=&category=&platform=&type=&environment=&price=&sort=&q=&tab=
     → Page<Ruleset>

GET  /api/rulesets/by-slug/[slug]
     → Ruleset | ApiError

GET  /api/rulesets/[id]
     → Ruleset | ApiError

POST /api/rulesets
     → Ruleset (requires auth, role >= Builder)

PATCH /api/rulesets/[id]
     → Ruleset (requires auth, owner or admin)

DELETE /api/rulesets/[id]
     → { success: true } (soft delete to ARCHIVED)
```

### Reviews
```
GET  /api/rulesets/[id]/reviews?page=&sort=
     → Page<Review>

POST /api/rulesets/[id]/reviews
     → Review (requires auth + verified purchase)

GET  /api/reviews/mine
     → Review[]
```

### Users & Auth
```
POST /api/auth/register
     → { success: true } (sends verification email)

GET  /api/users/[username]
     → User | ApiError

PATCH /api/settings/profile
     → User (requires auth)
```

### Purchases
```
POST /api/checkout
     → { checkoutUrl: string } (LemonSqueezy redirect)

GET  /api/purchases?page=
     → Page<Purchase>

GET  /api/purchases/status?rulesetId=
     → { hasAccess: boolean, accessLevel: AccessLevel }
```

### Social
```
POST /api/follow
     → { following: boolean }

GET  /api/following
     → User[]

POST /api/saved
     → { saved: boolean }

GET  /api/saved
     → Ruleset[]

POST /api/votes
     → { voted: boolean, newCount: number }
```

### Discussions
```
GET  /api/discussions?rulesetId=&page=
     → Page<Discussion>

POST /api/discussions
     → Discussion (requires auth)

GET  /api/discussions/[id]/replies
     → DiscussionReply[]

POST /api/discussions/[id]/replies
     → DiscussionReply (requires auth)
```

### Collections
```
GET  /api/collections
     → Collection[]

GET  /api/collections/[id]
     → Collection (with rulesets populated)

POST /api/collections
     → Collection (requires auth)
```

### Admin
```
GET  /api/admin/stats
     → AdminStats (requires admin)

GET  /api/admin/users?page=&search=&role=
     → Page<User> (requires admin)

PUT  /api/admin/users/[id]
     → User (requires admin, role/status changes)

GET  /api/admin/rulesets?status=
     → Page<Ruleset> (requires admin)

PUT  /api/admin/rulesets/[id]
     → Ruleset (requires admin, approve/reject/flag)

GET  /api/admin/reports?status=
     → Page<AdminReport> (requires admin)

PUT  /api/admin/reports/[id]
     → AdminReport (requires admin, resolve/dismiss)
```

---

## New Contracts (Frontend Mocked, Backend Needed)

### Affiliate System

See `docs/backend-handoff/affiliates.md` for full specification.

**New Prisma Models:**
- `AffiliateLink` — userId, rulesetId?, code (unique), createdAt
- `AffiliateClick` — linkId, referrer, country, createdAt, converted
- `AffiliateConversion` — linkId, purchaseId, saleAmount, commission, status (pending/confirmed/paid), timestamps
- `AffiliatePayout` — userId, amount, conversions, period, status, paidAt

**New Endpoints:**
```
POST /api/affiliates/links         → AffiliateLink
GET  /api/affiliates/links         → AffiliateLink[]
DELETE /api/affiliates/links/[id]  → { success: true }
GET  /api/affiliates/stats         → AffiliateStats
GET  /api/affiliates/conversions?page=&status= → Page<AffiliateConversion>
GET  /api/affiliates/payouts       → AffiliatePayout[]
GET  /api/affiliates/earnings?period=30|60|90 → { daily: { date: string, clicks: number, conversions: number, earnings: number }[] }
```

### Community Extensions

See `docs/backend-handoff/community.md` for full specification.

**New Prisma Models:**
- `Poll` — title, description, authorId, endsAt, isActive
- `PollOption` — pollId, text, voteCount
- `PollVote` — pollId, optionId, userId (unique per poll)
- `QAQuestion` — title, body, authorId, tags[], acceptedAnswerId?, voteCount, viewCount
- `QAAnswer` — questionId, body, authorId, voteCount, isAccepted
- `FeatureRequest` — title, description, authorId, voteCount, status, claimedById?, linkedRulesetId?

**New Endpoints:**
```
POST /api/polls              → Poll
GET  /api/polls?active=      → Poll[]
POST /api/polls/[id]/vote    → { success: true, option: PollOption }
POST /api/qa                 → QAQuestion
GET  /api/qa?filter=all|answered|unanswered&sort=hot|new|top → Page<QAQuestion>
GET  /api/qa/[id]            → QAQuestion (with answers)
POST /api/qa/[id]/answers    → QAAnswer
PUT  /api/qa/answers/[id]/accept → QAAnswer (requires question author)
POST /api/requests           → FeatureRequest
GET  /api/requests?status=&sort= → Page<FeatureRequest>
POST /api/requests/[id]/vote → { voted: boolean, newCount: number }
POST /api/requests/[id]/claim → FeatureRequest (requires Builder+ role)
```

### GitHub Integration

See `docs/backend-handoff/github.md` for full specification.

**New Prisma Models:**
- `MaintainerClaim` — rulesetId, userId, repoFullName, status, timestamps
- `GitHubSync` — rulesetId, repoFullName, lastSyncAt, status, pendingChanges

**New Endpoints:**
```
GET  /api/github/repos              → GitHubRepo[] (requires GitHub OAuth)
GET  /api/github/repos/[owner]/[repo]/tree → GitHubTreeEntry[]
GET  /api/github/repos/[owner]/[repo]/readme → { content: string }
POST /api/github/claims             → MaintainerClaim
GET  /api/github/claims/[rulesetId] → MaintainerClaim | null
POST /api/github/sync/[rulesetId]   → GitHubSyncStatus
```

### Admin Extensions

See `docs/backend-handoff/admin.md` for full specification.

**New Prisma Models:**
- `FeatureFlag` — name, description, enabled, updatedAt
- `AdminAuditLog` — action, targetType, targetId, adminId, reason, createdAt

**New Endpoints:**
```
GET  /api/admin/revenue     → RevenueDataPoint[] (monthly series)
GET  /api/admin/scanning    → AdminScanResult[]
GET  /api/admin/flags       → FeatureFlag[]
PUT  /api/admin/flags/[id]  → FeatureFlag (toggle enabled)
```

---

## Pagination Shape

All paginated endpoints use:
```typescript
interface Page<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

## Error Shape

All error responses use:
```typescript
interface ApiError {
  error: {
    code: string;      // "NOT_FOUND" | "UNAUTHORIZED" | "FORBIDDEN" | "VALIDATION_ERROR" | "INTERNAL_ERROR"
    message: string;
  };
}
```

## Authentication

All authenticated endpoints require `Authorization: Bearer <session-token>` via NextAuth. The session includes `user.id`, `user.role`, and `user.sellerStatus`.
