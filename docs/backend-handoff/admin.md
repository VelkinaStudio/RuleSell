# Admin Dashboard — Backend Handoff

All admin pages currently run on mock data via `src/constants/mock-admin.ts` and local-state hooks under `src/hooks/use-admin-*.ts`. This document specifies the API contracts needed to replace mocks with real data.

## Existing endpoints (verify shape matches)

### GET /api/admin/stats
Returns platform-wide statistics.
```ts
interface AdminStats {
  totalUsers: number;
  totalRulesets: number;
  totalRevenue: number;       // cents
  activeCreators: number;
  pendingReviews: number;
  openReports: number;
  monthlyGrowth: { users: number; rulesets: number; revenue: number }; // percentages
}
```

### GET /api/admin/users
Paginated user list with search and role filter.
- Query: `?page=1&pageSize=10&search=&role=ALL|USER|PRO|ADMIN`
- Response: `Page<User>` (standard pagination wrapper)

### PUT /api/admin/users/[id]
Update user role or seller status.
```ts
// Body
{ role?: "USER" | "PRO" | "ADMIN"; suspended?: boolean }
// Response
{ data: User }
```

### GET /api/admin/reports
Reports list with status filter.
- Query: `?status=all|pending|resolved|dismissed`
- Response: `AdminReport[]`

### PUT /api/admin/reports/[id]
Resolve or dismiss a report.
```ts
// Body
{ action: "resolve" | "dismiss"; moderatorNote: string }
// Response
{ data: AdminReport }
```

## Endpoints needing expansion

### GET /api/admin/rulesets?status=PENDING
Moderation queue — rulesets pending review.
```ts
interface PendingRuleset {
  id: string;
  slug: string;
  title: string;
  category: string;
  authorUsername: string;
  previewContent: string;
  submittedAt: string;
}
```
Response: `PendingRuleset[]`

### PUT /api/admin/rulesets/[id]
Approve or reject a pending ruleset.
```ts
// Body
{ action: "approve" | "reject"; reason?: string }
// Response
{ data: { id: string; status: string } }
```

## New endpoints

### GET /api/admin/revenue
Monthly revenue time series.
```ts
interface RevenueDataPoint {
  month: string;            // "2026-04"
  platformRevenue: number;  // cents
  sellerPayouts: number;    // cents
  refunds: number;          // cents
}
```
Response: `RevenueDataPoint[]`

### GET /api/admin/scanning
Scan results for rulesets.
```ts
interface AdminScanResult {
  rulesetId: string;
  rulesetTitle: string;
  rulesetSlug: string;
  virusTotal: "pass" | "fail" | "pending";
  semgrep: "pass" | "fail" | "warning" | "pending";
  sandbox: "pass" | "fail" | "pending";
  scannedAt: string;
}
```
Response: `AdminScanResult[]`

### GET /api/admin/flags
List all feature flags.
```ts
interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  updatedAt: string;
}
```
Response: `FeatureFlag[]`

### PUT /api/admin/flags/[id]
Toggle a feature flag.
```ts
// Body
{ enabled: boolean }
// Response
{ data: FeatureFlag }
```

## New Prisma models needed

```prisma
model FeatureFlag {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  enabled     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AdminAuditLog {
  id              String   @id @default(cuid())
  action          String   // "approve_ruleset", "reject_ruleset", "change_role", etc.
  targetType      String   // "ruleset", "user", "report", "flag"
  targetId        String
  moderatorId     String
  moderator       User     @relation(fields: [moderatorId], references: [id])
  reason          String?
  metadata        Json?
  createdAt       DateTime @default(now())
}
```

## Auth requirements
All admin endpoints must verify `session.user.role === "ADMIN"` server-side. The frontend already gates on role client-side via `AdminRoleGate` component, but server-side checks are mandatory for security.
