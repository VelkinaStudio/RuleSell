# Backend Handoff — RuleSell

This directory contains API specifications and data contracts for features built on the frontend with mock data. The backend team should implement these endpoints to replace the mock layer.

## Feature Docs

| Feature | Doc | Frontend Status | Backend Exists? |
|---------|-----|----------------|-----------------|
| **Affiliate Program** | [affiliates.md](affiliates.md) | Complete (mock data) | No — new feature |
| **Community Hub** | [community.md](community.md) | Complete (mock data) | Partial — Discussions exist, Polls/Q&A/Requests are new |
| **GitHub Integration** | [github.md](github.md) | Complete (mock data) | No — new feature (NextAuth GitHub provider exists) |
| **Admin Dashboard** | [admin.md](admin.md) | Complete (mock data) | Partial — basic admin endpoints exist |

## How to Use

Each doc contains:
1. **API endpoints** — method, path, request/response TypeScript interfaces
2. **New Prisma models** needed — field definitions, relations
3. **Mock data shapes** — the exact data structures the frontend expects (in `src/constants/mock-*.ts`)

The frontend consumes data through SWR hooks in `src/hooks/use-*.ts`. Each hook calls a fetcher that hits the API. The mock layer intercepts before the API call — to go live, remove the mock intercept and the real API will be called.

## Existing Backend

The following endpoints already exist and are working:
- Auth: NextAuth v5 (GitHub + Google + email/password)
- Rulesets: CRUD, filtering, pagination, versions
- Reviews: CRUD with verified purchase check
- Purchases: LemonSqueezy integration
- Users: profiles, following
- Discussions: threads, replies
- Collections: CRUD
- Reports: basic create/list
- Uploads: S3 presigned URLs
- Admin: basic stats, user management

See `src/app/api/` for the full list of existing endpoints.

## Data Contracts

All TypeScript interfaces are defined in `src/types/index.ts`. The frontend and backend must share these exact shapes. Do not change field names or types without coordinating with frontend.
