# Affiliate System — Backend Handoff

All frontend components are built and wired to mock data. Replace the mock constants and hooks with real API calls when implementing these endpoints.

## API Endpoints

### POST /api/affiliates/links
Create a new affiliate referral link.

**Request:**
```typescript
{
  rulesetId: string | null; // null = general referral link
}
```

**Response:**
```typescript
{
  data: AffiliateLink;
}
```

**Logic:**
- Generate a unique `code` (e.g., `REF-<slug>-<random>`)
- Build full `url` with `?ref=<code>` param
- Associate with the authenticated user

---

### GET /api/affiliates/links
List the authenticated user's affiliate links.

**Response:**
```typescript
{
  data: AffiliateLink[];
}
```

**Notes:**
- Return all links for the current user, ordered by `createdAt` desc
- Include aggregated `clicks`, `conversions`, `earnings` per link

---

### DELETE /api/affiliates/links/[id]
Delete an affiliate link.

**Response:**
```typescript
{ success: true }
```

**Notes:**
- Soft-delete recommended (preserve analytics history)
- Only the link owner can delete

---

### GET /api/affiliates/stats
Aggregated stats for the authenticated user.

**Response:**
```typescript
{
  data: AffiliateStats;
}
```

```typescript
interface AffiliateStats {
  totalEarnings: number;      // cents
  pendingEarnings: number;    // cents (pending + confirmed, not yet paid)
  paidEarnings: number;       // cents
  thisMonthEarnings: number;  // cents
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;     // percentage (0-100)
  currentTier: AffiliateTier;
  nextTier: AffiliateTier | null;
  earningsToNextTier: number; // cents
}

interface AffiliateTier {
  name: string;       // "Starter" | "Growth" | "Partner"
  rate: number;       // 0.10 | 0.15 | 0.20
  threshold: number;  // total earnings in dollars to reach this tier
}
```

**Tier logic:**
| Tier    | Rate | Threshold (total earnings) |
|---------|------|---------------------------|
| Starter | 10%  | $0                        |
| Growth  | 15%  | $500                      |
| Partner | 20%  | $2,000                    |

---

### GET /api/affiliates/conversions?page=&status=
Paginated list of conversions.

**Query params:**
- `page` (default: 1)
- `pageSize` (default: 10)
- `status` — `pending` | `confirmed` | `paid` | omit for all

**Response:**
```typescript
{
  data: AffiliateConversion[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

```typescript
interface AffiliateConversion {
  id: string;
  linkId: string;
  purchaseId: string;
  rulesetTitle: string;
  rulesetSlug: string;
  buyerUsername: string;
  saleAmount: number;     // cents
  commission: number;     // cents
  status: "pending" | "confirmed" | "paid";
  createdAt: string;      // ISO
  confirmedAt: string | null;
  paidAt: string | null;
}
```

**Status flow:**
1. `pending` — created on purchase, held for 30-day refund window
2. `confirmed` — after 30 days with no refund
3. `paid` — included in a monthly payout

---

### GET /api/affiliates/payouts
Payout history for the authenticated user.

**Response:**
```typescript
{
  data: AffiliatePayout[];
}
```

```typescript
interface AffiliatePayout {
  id: string;
  amount: number;      // cents
  conversions: number; // count of conversions in this payout
  period: string;      // "2026-03" format
  status: "pending" | "processing" | "paid";
  paidAt: string | null;
}
```

---

### GET /api/affiliates/earnings?period=30|60|90
Daily click/conversion data for charts.

**Response:**
```typescript
{
  data: DailyClickPoint[];
}
```

```typescript
interface DailyClickPoint {
  date: string;       // "2026-03-15"
  clicks: number;
  conversions: number;
}
```

---

## Prisma Schema Additions (suggested)

```prisma
model AffiliateLink {
  id         String   @id @default(cuid())
  userId     String
  rulesetId  String?
  code       String   @unique
  deletedAt  DateTime?
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
  ruleset    Ruleset? @relation(fields: [rulesetId], references: [id])
  clicks     AffiliateClick[]
  conversions AffiliateConversion[]
}

model AffiliateClick {
  id        String   @id @default(cuid())
  linkId    String
  referrer  String?
  country   String?
  converted Boolean  @default(false)
  createdAt DateTime @default(now())
  link      AffiliateLink @relation(fields: [linkId], references: [id])
}

model AffiliateConversion {
  id          String   @id @default(cuid())
  linkId      String
  purchaseId  String   @unique
  commission  Int      // cents
  status      String   @default("pending") // pending, confirmed, paid
  confirmedAt DateTime?
  paidAt      DateTime?
  payoutId    String?
  createdAt   DateTime @default(now())
  link        AffiliateLink @relation(fields: [linkId], references: [id])
  purchase    Purchase @relation(fields: [purchaseId], references: [id])
  payout      AffiliatePayout? @relation(fields: [payoutId], references: [id])
}

model AffiliatePayout {
  id          String   @id @default(cuid())
  userId      String
  amount      Int      // cents
  period      String   // "2026-03"
  status      String   @default("pending")
  paidAt      DateTime?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  conversions AffiliateConversion[]
}
```

## Click Tracking

On any page load with `?ref=<code>` in the URL:
1. Look up the `AffiliateLink` by `code`
2. Set a cookie: `rs_ref=<code>; max-age=2592000; path=/; secure; httponly`
3. Record an `AffiliateClick` row (deduplicate by IP+link per hour)

On purchase completion:
1. Check for `rs_ref` cookie
2. If present, create an `AffiliateConversion` with status `pending`
3. Commission = `saleAmount * tierRate` (based on the affiliate's current tier)

## Monthly Payout Job (cron)

1. Find all `confirmed` conversions not yet in a payout
2. Group by userId
3. Sum commissions per user
4. If sum >= $50 (5000 cents), create an `AffiliatePayout` and link conversions
5. Process via Stripe Connect transfer
6. Update payout status to `paid` and set `paidAt`

## Confirmation Job (cron, daily)

1. Find all `pending` conversions where `createdAt < now() - 30 days`
2. Check the linked purchase has not been refunded
3. Update status to `confirmed`, set `confirmedAt`
