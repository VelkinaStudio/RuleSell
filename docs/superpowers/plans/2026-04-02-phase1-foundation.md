# Phase 1: Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the Next.js project, database schema with Prisma, NextAuth authentication (email/password + GitHub + Google OAuth), environment config, and the app shell UI (dark theme, layout, sidebar, header) so that subsequent phases can build on a working, authenticated foundation.

**Architecture:** Next.js 14 App Router with TypeScript. Prisma ORM connects to PostgreSQL (local Docker container for dev, Railway-managed for production). NextAuth.js handles all auth flows. Tailwind CSS with a dark theme. All environment-specific values from `.env` — zero code changes between environments.

**Tech Stack:** Next.js 14, TypeScript, Prisma, PostgreSQL, NextAuth.js, bcrypt, Tailwind CSS, Docker (local Postgres only)

**Phases Overview:**
- **Phase 1 (this plan):** Foundation — project, DB, auth, UI shell
- Phase 2: Core Marketplace — rulesets CRUD, search, voting, tags
- Phase 3: Payments & Storage — Lemon Squeezy, file uploads/downloads
- Phase 4: Community — reviews, discussions, follows, collections, notifications
- Phase 5: Pro & Admin — analytics, admin panel, subscriptions, cron jobs
- Phase 6: Polish & Deploy — SEO, OG images, emails, Railway deployment

---

## File Structure (Phase 1)

```
ruleset/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (dark theme, fonts)
│   │   ├── page.tsx                      # Homepage placeholder
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx            # Login page
│   │   │   ├── signup/page.tsx           # Signup page
│   │   │   ├── verify-email/page.tsx     # Email verification page
│   │   │   └── reset-password/page.tsx   # Password reset page
│   │   ├── (public)/
│   │   │   └── layout.tsx                # Public layout with sidebar + header
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                # Dashboard layout
│   │   │   └── overview/page.tsx         # Dashboard home placeholder
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts # NextAuth handler
│   │       │   ├── register/route.ts      # Email/password registration
│   │       │   ├── verify-email/route.ts  # Email verification
│   │       │   └── reset-password/route.ts # Password reset
│   │       └── health/route.ts            # Health check endpoint
│   ├── components/
│   │   ├── ui/                           # Base UI primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── toast.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx                # Top navigation bar
│   │   │   ├── sidebar.tsx               # Left sidebar (platforms + categories)
│   │   │   ├── footer.tsx                # Footer
│   │   │   └── mobile-nav.tsx            # Mobile navigation
│   │   └── auth/
│   │       ├── login-form.tsx            # Login form component
│   │       ├── signup-form.tsx           # Signup form component
│   │       ├── oauth-buttons.tsx         # GitHub + Google OAuth buttons
│   │       └── auth-guard.tsx            # Client component for protected routes
│   ├── lib/
│   │   ├── config.ts                     # Env var access + validation
│   │   ├── db.ts                         # Prisma client singleton
│   │   ├── auth.ts                       # NextAuth config
│   │   └── api/
│   │       └── response.ts              # API response helpers (envelope, pagination)
│   └── types/
│       └── index.ts                      # Shared TypeScript types
├── prisma/
│   └── schema.prisma                     # Full database schema
├── docker-compose.yml                    # Local PostgreSQL
├── .env.example                          # Documented env template
├── .env.local                            # Local dev values (gitignored)
├── tailwind.config.ts                    # Dark theme config
├── next.config.ts                        # Next.js config
├── tsconfig.json
├── package.json
└── .gitignore
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `.gitignore`, `.env.example`, `.env.local`, `docker-compose.yml`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/config.ts`

- [ ] **Step 1: Initialize Next.js project**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

When prompted, accept defaults. This creates the base project with App Router, TypeScript, Tailwind, ESLint, and `src/` directory.

- [ ] **Step 2: Verify project runs**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run dev
```

Expected: Dev server starts on `http://localhost:3000`, default Next.js page loads.

Stop the dev server after confirming.

- [ ] **Step 3: Install Phase 1 dependencies**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm install prisma @prisma/client next-auth@5 @auth/prisma-adapter bcryptjs resend
npm install -D @types/bcryptjs
```

- [ ] **Step 4: Create docker-compose.yml for local PostgreSQL**

Create `docker-compose.yml`:
```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ruleset
      POSTGRES_PASSWORD: ruleset_dev
      POSTGRES_DB: ruleset
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

- [ ] **Step 5: Create .env.example with documented variables**

Create `.env.example`:
```bash
# ===========================================
# Ruleset Platform — Environment Variables
# ===========================================
# Copy this file to .env.local for local development.
# On Railway, set these in the service's environment variables.

# Database (local: use docker-compose PostgreSQL)
DATABASE_URL="postgresql://ruleset:ruleset_dev@localhost:5432/ruleset"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="" # Generate with: openssl rand -base64 32

# OAuth — GitHub
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# OAuth — Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Lemon Squeezy (Phase 3)
LEMONSQUEEZY_API_KEY=""
LEMONSQUEEZY_WEBHOOK_SECRET=""
LEMONSQUEEZY_STORE_ID=""

# Cloudflare R2 (Phase 3)
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_URL=""

# Resend (transactional email)
RESEND_API_KEY=""
RESEND_FROM_EMAIL="noreply@ruleset.dev"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Upload limits
UPLOAD_MAX_SIZE_BYTES="52428800" # 50MB

# Commission rates (decimal, e.g. 0.15 = 15%)
STANDARD_COMMISSION_RATE="0.15"
PRO_COMMISSION_RATE="0.08"
```

- [ ] **Step 6: Create .env.local for local development**

Create `.env.local`:
```bash
DATABASE_URL="postgresql://ruleset:ruleset_dev@localhost:5432/ruleset"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-change-in-production-openssl-rand-base64-32"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY=""
RESEND_FROM_EMAIL="noreply@localhost"
STANDARD_COMMISSION_RATE="0.15"
PRO_COMMISSION_RATE="0.08"
```

- [ ] **Step 7: Create environment config module**

Create `src/lib/config.ts`:
```typescript
function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const config = {
  database: {
    url: required("DATABASE_URL"),
  },
  auth: {
    url: required("NEXTAUTH_URL"),
    secret: required("NEXTAUTH_SECRET"),
    github: {
      clientId: optional("GITHUB_CLIENT_ID", ""),
      clientSecret: optional("GITHUB_CLIENT_SECRET", ""),
    },
    google: {
      clientId: optional("GOOGLE_CLIENT_ID", ""),
      clientSecret: optional("GOOGLE_CLIENT_SECRET", ""),
    },
  },
  email: {
    apiKey: optional("RESEND_API_KEY", ""),
    fromEmail: optional("RESEND_FROM_EMAIL", "noreply@ruleset.dev"),
  },
  app: {
    url: optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  },
  upload: {
    maxSizeBytes: parseInt(optional("UPLOAD_MAX_SIZE_BYTES", "52428800"), 10),
  },
  commission: {
    standard: parseFloat(optional("STANDARD_COMMISSION_RATE", "0.15")),
    pro: parseFloat(optional("PRO_COMMISSION_RATE", "0.08")),
  },
} as const;
```

- [ ] **Step 8: Update .gitignore**

Append to `.gitignore`:
```
# Environment
.env.local
.env.production
.env*.local

# Database
prisma/*.db
```

- [ ] **Step 9: Commit project scaffolding**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git init
git add .
git commit -m "feat: scaffold Next.js project with TypeScript, Tailwind, env config"
```

---

### Task 2: Database Schema (Prisma)

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/db.ts`

- [ ] **Step 1: Initialize Prisma**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npx prisma init --datasource-provider postgresql
```

This creates `prisma/schema.prisma` and updates `.env` (we use `.env.local` instead).

- [ ] **Step 2: Write the full Prisma schema**

Replace `prisma/schema.prisma` with:
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearchPostgres"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ──────────────────────────────────────────

enum UserRole {
  USER
  PRO
  ADMIN
}

enum SellerStatus {
  NONE
  PENDING
  ACTIVE
  SUSPENDED
}

enum RulesetType {
  RULESET
  PROMPT
  WORKFLOW
  AGENT
  BUNDLE
  DATASET
}

enum Platform {
  CURSOR
  VSCODE
  OBSIDIAN
  N8N
  MAKE
  GEMINI
  CLAUDE
  CHATGPT
  OTHER
}

enum RulesetStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  FLAGGED
}

enum FileBundleFormat {
  CURSORRULES
  MARKDOWN
  JSON
  YAML
  TOML
  ZIP
  JAVASCRIPT
  PYTHON
  TEXT
}

enum AccessType {
  LIFETIME
  SUBSCRIPTION
}

enum PurchaseStatus {
  PENDING
  COMPLETED
  REFUNDED
}

enum EventType {
  VIEW
  VOTE
  DOWNLOAD
  PURCHASE
}

enum NotificationType {
  NEW_FOLLOWER
  NEW_REVIEW
  REVIEW_REPLY
  SALE_MADE
  RULESET_UPDATED
  DISCUSSION_REPLY
  PAYOUT_COMPLETE
  ADMIN_ANNOUNCEMENT
}

enum ReportReason {
  SPAM
  MALWARE
  COPYRIGHT
  INAPPROPRIATE
  OTHER
}

enum ReportStatus {
  PENDING
  REVIEWED
  RESOLVED
  DISMISSED
}

enum PayoutStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

// ─── Auth (NextAuth) ────────────────────────────────

model User {
  id                    String       @id @default(cuid())
  email                 String       @unique
  passwordHash          String?
  name                  String
  username              String       @unique
  avatar                String?
  bio                   String?
  role                  UserRole     @default(USER)
  sellerStatus          SellerStatus @default(NONE)
  lemonsqueezyCustomerId String?
  totalEarnings         Float        @default(0)
  reputation            Int          @default(0)
  emailVerified         DateTime?
  emailVerifyToken      String?
  resetPasswordToken    String?
  resetPasswordExpires  DateTime?
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  accounts              Account[]
  sessions              Session[]
  rulesets              Ruleset[]
  votes                 Vote[]
  reviews               Review[]
  purchases             Purchase[]
  collections           Collection[]
  savedItems            SavedItem[]
  discussions           Discussion[]
  discussionReplies     DiscussionReply[]
  notifications         Notification[]
  notificationPrefs     NotificationPreference[]
  reports               Report[]
  payouts               Payout[]
  rulesetBundles        RulesetBundle[]
  followers             Follow[]     @relation("following")
  following             Follow[]     @relation("follower")

  @@index([username])
  @@index([email])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Rulesets ───────────────────────────────────────

model Ruleset {
  id             String        @id @default(cuid())
  title          String
  slug           String        @unique
  description    String        @db.Text
  previewContent String        @db.Text
  type           RulesetType
  platform       Platform
  category       String
  price          Float         @default(0)
  currency       String        @default("USD")
  authorId       String
  downloadCount  Int           @default(0)
  viewCount      Int           @default(0)
  purchaseCount  Int           @default(0)
  avgRating      Float         @default(0)
  ratingCount    Int           @default(0)
  trendingScore  Float         @default(0)
  status         RulesetStatus @default(DRAFT)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  author         User              @relation(fields: [authorId], references: [id])
  versions       RulesetVersion[]
  tags           RulesetTag[]
  votes          Vote[]
  reviews        Review[]
  purchases      Purchase[]
  events         RulesetEvent[]
  collectionItems CollectionItem[]
  savedBy        SavedItem[]
  bundleItems    BundleItem[]
  discussions    Discussion[]
  reports        Report[]

  @@index([slug])
  @@index([authorId])
  @@index([status])
  @@index([trendingScore(sort: Desc)])
  @@index([createdAt(sort: Desc)])
  @@index([platform])
  @@index([type])
  @@index([category])
}

model RulesetVersion {
  id          String   @id @default(cuid())
  rulesetId   String
  version     String
  fullContent String   @db.Text
  changelog   String?  @db.Text
  createdAt   DateTime @default(now())

  ruleset     Ruleset      @relation(fields: [rulesetId], references: [id], onDelete: Cascade)
  fileBundles FileBundle[]

  @@index([rulesetId])
}

model FileBundle {
  id                  String           @id @default(cuid())
  rulesetVersionId    String
  storageKey          String
  filename            String
  sizeBytes           Int
  mimeType            String
  format              FileBundleFormat
  installInstructions String?          @db.Text

  rulesetVersion RulesetVersion @relation(fields: [rulesetVersionId], references: [id], onDelete: Cascade)

  @@index([rulesetVersionId])
}

// ─── Tags ───────────────────────────────────────────

model Tag {
  id         String       @id @default(cuid())
  name       String       @unique
  usageCount Int          @default(0)
  rulesets   RulesetTag[]

  @@index([name])
  @@index([usageCount(sort: Desc)])
}

model RulesetTag {
  rulesetId String
  tagId     String

  ruleset Ruleset @relation(fields: [rulesetId], references: [id], onDelete: Cascade)
  tag     Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([rulesetId, tagId])
}

// ─── Engagement ─────────────────────────────────────

model Vote {
  userId    String
  rulesetId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  ruleset Ruleset @relation(fields: [rulesetId], references: [id], onDelete: Cascade)

  @@id([userId, rulesetId])
}

model Review {
  id                 String   @id @default(cuid())
  userId             String
  rulesetId          String
  rating             Int
  comment            String   @db.Text
  isVerifiedPurchase Boolean  @default(false)
  refunded           Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  ruleset Ruleset @relation(fields: [rulesetId], references: [id], onDelete: Cascade)

  @@index([rulesetId])
  @@index([userId])
}

model Follow {
  followerId  String
  followingId String
  createdAt   DateTime @default(now())

  follower  User @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  following User @relation("following", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
}

// ─── Purchases & Payments ───────────────────────────

model Purchase {
  id                   String         @id @default(cuid())
  buyerId              String
  rulesetId            String
  amount               Float
  platformFee          Float
  lemonsqueezyOrderId  String
  accessType           AccessType
  accessExpiresAt      DateTime?
  status               PurchaseStatus @default(PENDING)
  refundedAt           DateTime?
  createdAt            DateTime       @default(now())

  buyer   User    @relation(fields: [buyerId], references: [id])
  ruleset Ruleset @relation(fields: [rulesetId], references: [id])

  @@index([buyerId])
  @@index([rulesetId])
  @@index([lemonsqueezyOrderId])
}

model Payout {
  id                   String       @id @default(cuid())
  userId               String
  amount               Float
  status               PayoutStatus @default(PENDING)
  lemonsqueezyPayoutId String?
  createdAt            DateTime     @default(now())
  completedAt          DateTime?

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
}

// ─── Collections & Saved ────────────────────────────

model Collection {
  id          String   @id @default(cuid())
  userId      String
  name        String
  slug        String
  description String?  @db.Text
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())

  user  User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CollectionItem[]

  @@index([userId])
}

model CollectionItem {
  collectionId String
  rulesetId    String
  position     Int

  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  ruleset    Ruleset    @relation(fields: [rulesetId], references: [id], onDelete: Cascade)

  @@id([collectionId, rulesetId])
}

model SavedItem {
  userId    String
  rulesetId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  ruleset Ruleset @relation(fields: [rulesetId], references: [id], onDelete: Cascade)

  @@id([userId, rulesetId])
}

// ─── Bundles ────────────────────────────────────────

model RulesetBundle {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   @db.Text
  authorId    String
  price       Float
  createdAt   DateTime @default(now())

  author User         @relation(fields: [authorId], references: [id])
  items  BundleItem[]

  @@index([authorId])
}

model BundleItem {
  bundleId  String
  rulesetId String

  bundle  RulesetBundle @relation(fields: [bundleId], references: [id], onDelete: Cascade)
  ruleset Ruleset       @relation(fields: [rulesetId], references: [id], onDelete: Cascade)

  @@id([bundleId, rulesetId])
}

// ─── Discussions ────────────────────────────────────

model Discussion {
  id        String   @id @default(cuid())
  title     String
  slug      String
  body      String   @db.Text
  authorId  String
  rulesetId String?
  category  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author  User              @relation(fields: [authorId], references: [id], onDelete: Cascade)
  ruleset Ruleset?          @relation(fields: [rulesetId], references: [id])
  replies DiscussionReply[]

  @@index([category])
  @@index([authorId])
}

model DiscussionReply {
  id            String   @id @default(cuid())
  discussionId  String
  parentReplyId String?
  authorId      String
  body          String   @db.Text
  createdAt     DateTime @default(now())

  discussion  Discussion       @relation(fields: [discussionId], references: [id], onDelete: Cascade)
  parentReply DiscussionReply?  @relation("ReplyToReply", fields: [parentReplyId], references: [id])
  childReplies DiscussionReply[] @relation("ReplyToReply")
  author      User             @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([discussionId])
  @@index([parentReplyId])
}

// ─── Notifications ──────────────────────────────────

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  data      Json
  read      Boolean          @default(false)
  emailSent Boolean          @default(false)
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, read])
  @@index([createdAt(sort: Desc)])
}

model NotificationPreference {
  userId       String
  type         NotificationType
  emailEnabled Boolean @default(true)
  inAppEnabled Boolean @default(true)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, type])
}

// ─── Events & Reports ───────────────────────────────

model RulesetEvent {
  id        String    @id @default(cuid())
  rulesetId String
  type      EventType
  createdAt DateTime  @default(now())

  ruleset Ruleset @relation(fields: [rulesetId], references: [id], onDelete: Cascade)

  @@index([rulesetId, createdAt])
  @@index([createdAt])
}

model Report {
  id         String       @id @default(cuid())
  reporterId String
  rulesetId  String
  reason     ReportReason
  details    String?      @db.Text
  status     ReportStatus @default(PENDING)
  resolvedBy String?
  createdAt  DateTime     @default(now())
  resolvedAt DateTime?

  reporter User    @relation(fields: [reporterId], references: [id])
  ruleset  Ruleset @relation(fields: [rulesetId], references: [id])

  @@index([status])
  @@index([rulesetId])
}
```

- [ ] **Step 3: Create Prisma client singleton**

Create `src/lib/db.ts`:
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

- [ ] **Step 4: Start local PostgreSQL and run migration**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
docker compose up -d
npx prisma migrate dev --name init
```

Expected: PostgreSQL starts, migration creates all tables. Output includes "Your database is now in sync with your schema."

- [ ] **Step 5: Verify Prisma client generates correctly**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npx prisma generate
```

Expected: "Generated Prisma Client" — no errors.

- [ ] **Step 6: Create SQL migration for tsvector and pg_trgm**

Create `prisma/migrations/manual_search_setup.sql`:
```sql
-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add tsvector column to Ruleset (not managed by Prisma)
ALTER TABLE "Ruleset" ADD COLUMN IF NOT EXISTS "searchVector" tsvector;

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS ruleset_search_idx ON "Ruleset" USING GIN("searchVector");

-- Create trigram indexes for fuzzy matching
CREATE INDEX IF NOT EXISTS ruleset_title_trgm_idx ON "Ruleset" USING GIN("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS ruleset_description_trgm_idx ON "Ruleset" USING GIN("description" gin_trgm_ops);

-- Trigger function to update searchVector on insert/update
CREATE OR REPLACE FUNCTION update_ruleset_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW."searchVector" := to_tsvector('english',
    coalesce(NEW."title", '') || ' ' ||
    coalesce(NEW."description", '') || ' ' ||
    coalesce(NEW."previewContent", '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on Ruleset table
DROP TRIGGER IF EXISTS ruleset_search_vector_trigger ON "Ruleset";
CREATE TRIGGER ruleset_search_vector_trigger
  BEFORE INSERT OR UPDATE OF "title", "description", "previewContent"
  ON "Ruleset"
  FOR EACH ROW
  EXECUTE FUNCTION update_ruleset_search_vector();
```

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npx prisma db execute --file prisma/migrations/manual_search_setup.sql
```

Expected: SQL executes without errors.

- [ ] **Step 7: Commit database schema**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add prisma/ src/lib/db.ts
git commit -m "feat: add full Prisma schema with all models, tsvector search setup"
```

---

### Task 3: API Response Helpers

**Files:**
- Create: `src/lib/api/response.ts`, `src/types/index.ts`

- [ ] **Step 1: Create shared TypeScript types**

Create `src/types/index.ts`:
```typescript
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}
```

- [ ] **Step 2: Create API response helpers**

Create `src/lib/api/response.ts`:
```typescript
import { NextResponse } from "next/server";
import type {
  ApiSuccessResponse,
  ApiListResponse,
  ApiErrorResponse,
  PaginationMeta,
} from "@/types";

export function success<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ data }, { status });
}

export function list<T>(
  data: T[],
  pagination: PaginationMeta,
): NextResponse<ApiListResponse<T>> {
  return NextResponse.json({ data, pagination });
}

export function error(
  code: string,
  message: string,
  status: number,
  details?: Record<string, unknown>,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { error: { code, message, ...(details && { details }) } },
    { status },
  );
}

export const errors = {
  validation: (message: string, details?: Record<string, unknown>) =>
    error("VALIDATION_ERROR", message, 400, details),
  unauthorized: (message = "Authentication required") =>
    error("UNAUTHORIZED", message, 401),
  forbidden: (message = "Insufficient permissions") =>
    error("FORBIDDEN", message, 403),
  notFound: (message = "Resource not found") =>
    error("NOT_FOUND", message, 404),
  conflict: (message: string) =>
    error("CONFLICT", message, 409),
  rateLimited: (message = "Too many requests") =>
    error("RATE_LIMITED", message, 429),
  internal: (message = "Internal server error") =>
    error("INTERNAL_ERROR", message, 500),
};

export function paginationFromOffset(
  total: number,
  page: number,
  pageSize: number,
): PaginationMeta {
  return {
    total,
    page,
    pageSize,
    hasNext: page * pageSize < total,
    hasPrev: page > 1,
  };
}

export function paginationFromCursor(
  total: number,
  pageSize: number,
  nextCursor?: string,
): PaginationMeta {
  return {
    total,
    page: 0,
    pageSize,
    hasNext: !!nextCursor,
    hasPrev: false,
    nextCursor,
  };
}
```

- [ ] **Step 3: Create health check endpoint to verify API helpers work**

Create `src/app/api/health/route.ts`:
```typescript
import { success } from "@/lib/api/response";

export async function GET() {
  return success({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
```

- [ ] **Step 4: Test the health endpoint**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run dev &
sleep 3
curl -s http://localhost:3000/api/health | npx json
kill %1
```

Expected:
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2026-04-02T..."
  }
}
```

- [ ] **Step 5: Commit API response helpers**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add src/lib/api/ src/types/ src/app/api/health/
git commit -m "feat: add API response envelope helpers and health endpoint"
```

---

### Task 4: NextAuth Configuration

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create NextAuth configuration**

Create `src/lib/auth.ts`:
```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
        };
      },
    }),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            username: true,
            role: true,
            sellerStatus: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.role = dbUser.role;
          token.sellerStatus = dbUser.sellerStatus;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.sellerStatus = token.sellerStatus as string;
      }
      return session;
    },
  },
});
```

- [ ] **Step 2: Create NextAuth type extensions**

Create `src/types/next-auth.d.ts`:
```typescript
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      sellerStatus: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
    sellerStatus: string;
  }
}
```

- [ ] **Step 3: Create NextAuth route handler**

Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 4: Commit NextAuth configuration**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add src/lib/auth.ts src/types/next-auth.d.ts src/app/api/auth/
git commit -m "feat: configure NextAuth with credentials + OAuth providers"
```

---

### Task 5: Registration API Endpoint

**Files:**
- Create: `src/app/api/auth/register/route.ts`

- [ ] **Step 1: Create registration endpoint**

Create `src/app/api/auth/register/route.ts`:
```typescript
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, username } = body;

    if (!email || !password || !name || !username) {
      return errors.validation("All fields are required", {
        fields: ["email", "password", "name", "username"],
      });
    }

    if (password.length < 8) {
      return errors.validation("Password must be at least 8 characters");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return errors.validation(
        "Username can only contain letters, numbers, hyphens, and underscores",
      );
    }

    if (username.length < 3 || username.length > 30) {
      return errors.validation("Username must be between 3 and 30 characters");
    }

    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return errors.conflict("An account with this email already exists");
    }

    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername) {
      return errors.conflict("This username is already taken");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name,
        username: username.toLowerCase(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return success(user, 201);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Test registration endpoint**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run dev &
sleep 3
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","username":"testuser"}' | npx json
kill %1
```

Expected:
```json
{
  "data": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "username": "testuser",
    "role": "USER",
    "createdAt": "..."
  }
}
```

- [ ] **Step 3: Test duplicate email rejection**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run dev &
sleep 3
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User 2","username":"testuser2"}' | npx json
kill %1
```

Expected:
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "An account with this email already exists"
  }
}
```

- [ ] **Step 4: Commit registration endpoint**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add src/app/api/auth/register/
git commit -m "feat: add email/password registration endpoint"
```

---

### Task 6: Email Verification & Password Reset Endpoints

**Files:**
- Create: `src/lib/email.ts`, `src/app/api/auth/verify-email/route.ts`, `src/app/api/auth/reset-password/route.ts`

- [ ] **Step 1: Create email sending utility**

Create `src/lib/email.ts`:
```typescript
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@ruleset.dev";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;

  if (!resend) {
    console.log(`[DEV] Verification email for ${email}: ${verifyUrl}`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Verify your Ruleset account",
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  if (!resend) {
    console.log(`[DEV] Password reset email for ${email}: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Reset your Ruleset password",
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
}
```

- [ ] **Step 2: Update registration to send verification email**

Edit `src/app/api/auth/register/route.ts` — add verification token generation and email sending after user creation.

Add import at top:
```typescript
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";
```

Add after `db.user.create(...)` and before `return success(...)`:
```typescript
    const verifyToken = crypto.randomBytes(32).toString("hex");
    await db.user.update({
      where: { id: user.id },
      data: { emailVerifyToken: verifyToken },
    });
    await sendVerificationEmail(email, verifyToken);
```

- [ ] **Step 3: Create email verification endpoint**

Create `src/app/api/auth/verify-email/route.ts`:
```typescript
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return errors.validation("Verification token is required");
    }

    const user = await db.user.findFirst({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      return errors.notFound("Invalid or expired verification token");
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerifyToken: null,
      },
    });

    return success({ message: "Email verified successfully" });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 4: Create password reset request endpoint**

Create `src/app/api/auth/reset-password/route.ts`:
```typescript
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, token, newPassword } = body;

    // Step 1: Request password reset (email only)
    if (email && !token) {
      const user = await db.user.findUnique({ where: { email } });

      // Always return success to prevent email enumeration
      if (!user) {
        return success({ message: "If an account exists, a reset email has been sent" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: expires,
        },
      });

      await sendPasswordResetEmail(email, resetToken);

      return success({ message: "If an account exists, a reset email has been sent" });
    }

    // Step 2: Reset password with token
    if (token && newPassword) {
      if (newPassword.length < 8) {
        return errors.validation("Password must be at least 8 characters");
      }

      const user = await db.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { gt: new Date() },
        },
      });

      if (!user) {
        return errors.notFound("Invalid or expired reset token");
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);

      await db.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

      return success({ message: "Password reset successfully" });
    }

    return errors.validation("Provide email to request reset, or token + newPassword to complete reset");
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 5: Commit email verification and password reset**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add src/lib/email.ts src/app/api/auth/verify-email/ src/app/api/auth/reset-password/ src/app/api/auth/register/
git commit -m "feat: add email verification, password reset, and Resend email utility"
```

---

### Task 7: Tailwind Dark Theme Configuration

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Configure Tailwind with dark theme colors**

Replace `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0a",
          secondary: "#111111",
          tertiary: "#1a1a1a",
          elevated: "#222222",
        },
        border: {
          primary: "#2a2a2a",
          secondary: "#333333",
          hover: "#444444",
        },
        text: {
          primary: "#e5e5e5",
          secondary: "#999999",
          tertiary: "#666666",
          inverse: "#0a0a0a",
        },
        accent: {
          green: "#00d672",
          "green-hover": "#00b861",
          "green-subtle": "rgba(0, 214, 114, 0.1)",
          purple: "#8b5cf6",
          "purple-hover": "#7c3aed",
          "purple-subtle": "rgba(139, 92, 246, 0.1)",
        },
        status: {
          success: "#00d672",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Set up global CSS with dark theme defaults**

Replace `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    color-scheme: dark;
  }

  body {
    @apply bg-bg-primary text-text-primary antialiased;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    @apply w-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-bg-primary;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-border-secondary rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-border-hover;
  }

  /* Selection */
  ::selection {
    @apply bg-accent-green/20 text-text-primary;
  }
}

@layer components {
  .badge {
    @apply inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border;
  }

  .badge-green {
    @apply badge border-accent-green/30 bg-accent-green-subtle text-accent-green;
  }

  .badge-purple {
    @apply badge border-accent-purple/30 bg-accent-purple-subtle text-accent-purple;
  }

  .card {
    @apply bg-bg-secondary border border-border-primary rounded-lg;
  }

  .card-hover {
    @apply card hover:border-border-hover transition-colors;
  }
}
```

- [ ] **Step 3: Commit dark theme configuration**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: configure Tailwind dark theme matching Ruleset design"
```

---

### Task 8: Base UI Components

**Files:**
- Create: `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/toast.tsx`

- [ ] **Step 1: Create Button component**

Create `src/components/ui/button.tsx`:
```tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-green text-text-inverse hover:bg-accent-green-hover font-semibold",
  secondary:
    "bg-accent-purple text-white hover:bg-accent-purple-hover font-semibold",
  outline:
    "border border-border-secondary text-text-primary hover:border-border-hover bg-transparent",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary bg-transparent",
  danger: "bg-status-error text-white hover:bg-red-600 font-semibold",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center rounded-md
          transition-colors duration-150 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
```

- [ ] **Step 2: Create Input component**

Create `src/components/ui/input.tsx`:
```tsx
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 rounded-md text-sm
            bg-bg-tertiary border border-border-primary
            text-text-primary placeholder-text-tertiary
            focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green/30
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            ${error ? "border-status-error focus:border-status-error focus:ring-status-error/30" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-status-error">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
```

- [ ] **Step 3: Create Badge component**

Create `src/components/ui/badge.tsx`:
```tsx
type BadgeVariant = "green" | "purple" | "default" | "warning" | "error";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "border-accent-green/30 bg-accent-green-subtle text-accent-green",
  purple: "border-accent-purple/30 bg-accent-purple-subtle text-accent-purple",
  default: "border-border-secondary bg-bg-tertiary text-text-secondary",
  warning: "border-status-warning/30 bg-status-warning/10 text-status-warning",
  error: "border-status-error/30 bg-status-error/10 text-status-error",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-xs font-medium
        rounded border uppercase tracking-wider
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Create Toast component**

Create `src/components/ui/toast.tsx`:
```tsx
"use client";

import { useEffect, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const typeStyles: Record<ToastType, string> = {
  success: "border-status-success/30 bg-status-success/10 text-status-success",
  error: "border-status-error/30 bg-status-error/10 text-status-error",
  info: "border-status-info/30 bg-status-info/10 text-status-info",
  warning: "border-status-warning/30 bg-status-warning/10 text-status-warning",
};

let addToastFn: ((message: string, type: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = "info") {
  addToastFn?.(message, type);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              px-4 py-3 rounded-lg border text-sm font-medium
              animate-in slide-in-from-right
              ${typeStyles[t.type]}
            `}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 5: Commit base UI components**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add src/components/ui/
git commit -m "feat: add base UI components (Button, Input, Badge, Toast)"
```

---

### Task 9: App Shell — Header, Sidebar, Footer

**Files:**
- Create: `src/components/layout/header.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/footer.tsx`, `src/components/layout/mobile-nav.tsx`

- [ ] **Step 1: Create Header component**

Create `src/components/layout/header.tsx`:
```tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Marketplace", active: true },
  { href: "/trending", label: "Trending" },
  { href: "/docs", label: "Docs" },
  { href: "/discussions", label: "Community" },
];

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border-primary bg-bg-primary/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1.5 font-semibold text-lg">
            Ruleset
            <span className="w-2 h-2 rounded-full bg-accent-green" />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  link.active
                    ? "text-accent-green font-medium"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {session ? (
            <>
              {/* Notifications */}
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Publish */}
              <Link href="/dashboard/rulesets/new">
                <Button variant="outline" size="sm">
                  Publish
                </Button>
              </Link>

              {/* Avatar */}
              <Link href="/dashboard/overview" className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center text-sm font-medium text-white">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create Sidebar component**

Create `src/components/layout/sidebar.tsx`:
```tsx
"use client";

import Link from "next/link";

const platforms = [
  { label: "Cursor Rules", href: "/?platform=CURSOR", icon: "cursor" },
  { label: "AI Agents", href: "/?platform=CLAUDE", icon: "agent" },
  { label: "n8n Workflows", href: "/?platform=N8N", icon: "workflow" },
];

const categories = [
  { label: "Architecture", count: 0, href: "/?category=architecture" },
  { label: "Data Ops", count: 0, href: "/?category=data-ops" },
  { label: "Security", count: 0, href: "/?category=security" },
  { label: "UI/UX", count: 0, href: "/?category=ui-ux" },
];

function PlatformIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    cursor: "M4 4l7 2-2 7-5-9z",
    agent: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z",
    workflow: "M4 6h16M4 12h16M4 18h16",
  };
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[type] || icons.cursor} />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-border-primary p-4 gap-6">
      {/* Platforms */}
      <div>
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
          Platforms
        </h3>
        <nav className="space-y-1">
          {platforms.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
            >
              <PlatformIcon type={p.icon} />
              {p.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
          Categories
        </h3>
        <nav className="space-y-1">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-center justify-between px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
            >
              <span>{c.label}</span>
              <span className="text-xs text-text-tertiary">{c.count}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Spacer + Bottom */}
      <div className="mt-auto space-y-2">
        <Link href="/pricing">
          <button className="w-full py-2 text-sm font-medium text-accent-green border border-accent-green/30 rounded-md hover:bg-accent-green-subtle transition-colors">
            Upgrade to Pro
          </button>
        </Link>
        <nav className="space-y-1">
          <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
            Settings
          </Link>
          <Link href="/docs" className="flex items-center gap-2 px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
            Support
          </Link>
        </nav>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Create Footer component**

Create `src/components/layout/footer.tsx`:
```tsx
import Link from "next/link";

const footerLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "API", href: "/docs/api" },
  { label: "Status", href: "/status" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-primary py-6 px-4">
      <div className="flex flex-col items-center gap-3">
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-text-tertiary hover:text-text-secondary uppercase tracking-wider transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-text-tertiary font-mono">
          &copy; {new Date().getFullYear()} Ruleset AI. Technical authority guaranteed.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create Mobile Navigation**

Create `src/components/layout/mobile-nav.tsx`:
```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Marketplace" },
  { href: "/trending", label: "Trending" },
  { href: "/docs", label: "Docs" },
  { href: "/discussions", label: "Community" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-secondary hover:text-text-primary"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-bg-secondary border-b border-border-primary p-4 z-50">
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit layout components**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add src/components/layout/
git commit -m "feat: add app shell layout (Header, Sidebar, Footer, MobileNav)"
```

---

### Task 10: Root Layout & Public Layout Integration

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/(public)/layout.tsx`, `src/app/providers.tsx`

- [ ] **Step 1: Create session provider wrapper**

Create `src/app/providers.tsx`:
```tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
```

- [ ] **Step 2: Update root layout**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ruleset — AI Configuration Marketplace",
  description:
    "Buy, sell, and share system prompts, Cursor rules, n8n workflows, and agent blueprints. The stack behind the best AI builders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans min-h-screen bg-bg-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create public layout with header + sidebar + footer**

Create `src/app/(public)/layout.tsx`:
```tsx
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Move homepage into public route group**

Move `src/app/page.tsx` to `src/app/(public)/page.tsx` and replace content:
```tsx
export default function HomePage() {
  return (
    <div className="p-6">
      {/* Hero */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-accent-green uppercase tracking-widest mb-4">
          AI Configuration Marketplace
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-4 font-mono">
          The stack behind<br />the best AI builders.
        </h1>
        <p className="text-text-secondary text-lg max-w-lg mb-6">
          Buy, sell, and share system prompts, Cursor rules, n8n workflows, and agent blueprints.
        </p>
        <div className="flex items-center gap-3 mb-4">
          <a
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-green text-text-inverse font-semibold rounded-md hover:bg-accent-green-hover transition-colors"
          >
            Browse Rulesets &rarr;
          </a>
          <a
            href="/sellers"
            className="inline-flex items-center px-5 py-2.5 border border-accent-green text-accent-green font-semibold rounded-md hover:bg-accent-green-subtle transition-colors"
          >
            Start Selling Free
          </a>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-tertiary">
          <span>0 rulesets</span>
          <span>&middot;</span>
          <span>0 creators</span>
          <span>&middot;</span>
          <span>$0 paid to sellers</span>
        </div>
      </div>

      {/* Trust bar */}
      <div className="flex items-center gap-6 text-xs text-text-tertiary uppercase tracking-wider border-y border-border-primary py-3 mb-6">
        <span>Secure Checkout</span>
        <span>30-Day Refunds</span>
        <span>Verified Creators</span>
        <span>Instant Delivery</span>
      </div>

      {/* Tabs placeholder */}
      <div className="flex items-center gap-6 mb-6">
        {["Top", "New", "Trending", "Curated", "Following"].map((tab) => (
          <button
            key={tab}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              tab === "Top"
                ? "text-text-primary border-text-primary"
                : "text-text-tertiary border-transparent hover:text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="text-center py-16 text-text-tertiary">
        <p className="text-lg mb-2">No rulesets yet</p>
        <p className="text-sm">Be the first to publish a ruleset!</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify the app renders correctly**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run dev
```

Open `http://localhost:3000` in browser. Expected: dark themed page with header (Ruleset logo + nav), sidebar (platforms + categories), hero section, tab bar, and footer. Stop dev server after confirming.

- [ ] **Step 6: Commit root and public layout**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add src/app/
git commit -m "feat: integrate root layout with providers, public layout with shell"
```

---

### Task 11: Auth Pages (Login, Signup, Verify, Reset)

**Files:**
- Create: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`, `src/app/(auth)/verify-email/page.tsx`, `src/app/(auth)/reset-password/page.tsx`
- Create: `src/components/auth/login-form.tsx`, `src/components/auth/signup-form.tsx`, `src/components/auth/oauth-buttons.tsx`

- [ ] **Step 1: Create OAuth buttons component**

Create `src/components/auth/oauth-buttons.tsx`:
```tsx
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function OAuthButtons() {
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="md"
        className="w-full"
        onClick={() => signIn("github", { callbackUrl: "/" })}
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        size="md"
        className="w-full"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Create Login form component**

Create `src/components/auth/login-form.tsx`:
```tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <OAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-primary" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-bg-primary px-2 text-text-tertiary uppercase">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-status-error border border-status-error/30 bg-status-error/10 rounded-md">
            {error}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <div className="flex justify-end">
          <Link href="/reset-password" className="text-sm text-accent-green hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-text-tertiary">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-accent-green hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Create Signup form component**

Create `src/components/auth/signup-form.tsx`:
```tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error?.message || "Registration failed");
      setLoading(false);
      return;
    }

    // Auto sign in after registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created but sign in failed. Try logging in.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <OAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-primary" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-bg-primary px-2 text-text-tertiary uppercase">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-status-error border border-status-error/30 bg-status-error/10 rounded-md">
            {error}
          </div>
        )}
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          required
        />
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="janesmith"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-text-tertiary">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-green hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Create auth page shells**

Create `src/app/(auth)/login/page.tsx`:
```tsx
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export const metadata = { title: "Sign in — Ruleset" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-xl mb-2">
            Ruleset
            <span className="w-2 h-2 rounded-full bg-accent-green" />
          </Link>
          <h1 className="text-lg font-medium text-text-primary">Sign in to your account</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
```

Create `src/app/(auth)/signup/page.tsx`:
```tsx
import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export const metadata = { title: "Create account — Ruleset" };

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-xl mb-2">
            Ruleset
            <span className="w-2 h-2 rounded-full bg-accent-green" />
          </Link>
          <h1 className="text-lg font-medium text-text-primary">Create your account</h1>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
```

Create `src/app/(auth)/verify-email/page.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        setStatus(res.ok ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-xl">
          Ruleset
          <span className="w-2 h-2 rounded-full bg-accent-green" />
        </Link>

        {status === "loading" && <p className="text-text-secondary">Verifying your email...</p>}

        {status === "success" && (
          <>
            <h1 className="text-lg font-medium text-status-success">Email verified!</h1>
            <p className="text-text-secondary text-sm">Your email has been verified. You can now sign in.</p>
            <Link href="/login">
              <Button>Sign in</Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-lg font-medium text-status-error">Verification failed</h1>
            <p className="text-text-secondary text-sm">Invalid or expired token. Please try again.</p>
            <Link href="/login">
              <Button variant="outline">Back to sign in</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
```

Create `src/app/(auth)/reset-password/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "reset" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? "sent" : "error");
    if (!res.ok) setErrorMsg("Something went wrong. Please try again.");
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (res.ok) {
      setStatus("reset");
    } else {
      const data = await res.json();
      setErrorMsg(data.error?.message || "Reset failed");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-xl mb-2">
            Ruleset
            <span className="w-2 h-2 rounded-full bg-accent-green" />
          </Link>
          <h1 className="text-lg font-medium text-text-primary">
            {token ? "Set new password" : "Reset password"}
          </h1>
        </div>

        {status === "sent" && (
          <div className="p-3 text-sm text-status-success border border-status-success/30 bg-status-success/10 rounded-md text-center">
            If an account exists with that email, a reset link has been sent.
          </div>
        )}

        {status === "reset" && (
          <div className="text-center space-y-3">
            <p className="text-status-success">Password reset successfully!</p>
            <Link href="/login">
              <Button>Sign in</Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="p-3 text-sm text-status-error border border-status-error/30 bg-status-error/10 rounded-md">
            {errorMsg}
          </div>
        )}

        {!token && status !== "sent" && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}

        {token && status !== "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-text-tertiary">
          <Link href="/login" className="text-accent-green hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit auth pages**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add src/app/\(auth\)/ src/components/auth/
git commit -m "feat: add auth pages (login, signup, verify email, reset password)"
```

---

### Task 12: Dashboard Layout & Overview Page

**Files:**
- Create: `src/app/dashboard/layout.tsx`, `src/app/dashboard/overview/page.tsx`
- Create: `src/components/auth/auth-guard.tsx`

- [ ] **Step 1: Create auth guard component**

Create `src/components/auth/auth-guard.tsx`:
```tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Create dashboard layout**

Create `src/app/dashboard/layout.tsx`:
```tsx
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { AuthGuard } from "@/components/auth/auth-guard";

const dashboardNav = [
  { href: "/dashboard/overview", label: "Overview" },
  { href: "/dashboard/rulesets", label: "My Rulesets" },
  { href: "/dashboard/bundles", label: "Bundles" },
  { href: "/dashboard/earnings", label: "Earnings" },
  { href: "/dashboard/purchases", label: "Purchases" },
  { href: "/dashboard/saved", label: "Saved" },
  { href: "/dashboard/collections", label: "Collections" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          {/* Dashboard sidebar */}
          <aside className="hidden lg:flex flex-col w-56 border-r border-border-primary p-4">
            <nav className="space-y-1">
              {dashboardNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-border-primary">
              <Link
                href="/settings"
                className="block px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Settings
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
```

- [ ] **Step 3: Create dashboard overview page**

Create `src/app/dashboard/overview/page.tsx`:
```tsx
export const metadata = { title: "Dashboard — Ruleset" };

export default function DashboardOverviewPage() {
  const stats = [
    { label: "Published Rulesets", value: "0" },
    { label: "Total Downloads", value: "0" },
    { label: "Total Earnings", value: "$0.00" },
    { label: "Followers", value: "0" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-sm text-text-tertiary mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-text-primary mb-4">Recent Activity</h2>
        <p className="text-text-tertiary text-sm">No recent activity. Publish your first ruleset to get started.</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify dashboard loads with auth redirect**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run dev
```

Open `http://localhost:3000/dashboard/overview` — expected: redirects to `/login` since not authenticated. Stop dev server.

- [ ] **Step 5: Commit dashboard layout and overview**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add src/app/dashboard/ src/components/auth/auth-guard.tsx
git commit -m "feat: add dashboard layout with auth guard and overview page"
```

---

### Task 13: Final Verification

- [ ] **Step 1: Run full build to verify everything compiles**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run build
```

Expected: Build succeeds with no TypeScript errors, no missing modules. Fix any errors that appear.

- [ ] **Step 2: Run linter**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run lint
```

Expected: No errors. Fix any that appear.

- [ ] **Step 3: Start dev server and verify all routes**

Run:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run dev
```

Verify in browser:
- `http://localhost:3000` — Homepage with dark theme, header, sidebar, hero, tabs
- `http://localhost:3000/login` — Login page with OAuth + email/password form
- `http://localhost:3000/signup` — Signup page with OAuth + registration form
- `http://localhost:3000/reset-password` — Password reset request form
- `http://localhost:3000/dashboard/overview` — Redirects to `/login`
- `http://localhost:3000/api/health` — Returns JSON `{ data: { status: "ok" } }`

Stop dev server after verifying.

- [ ] **Step 4: Commit any final fixes**

If any fixes were needed during verification:
```bash
cd /mnt/hdd/Jobs/Website/Ruleset
git add -A
git commit -m "fix: resolve build issues from Phase 1 final verification"
```

---

## Phase 1 Complete Checklist

After all tasks, you should have:
- [x] Next.js 14 project with TypeScript, Tailwind, App Router
- [x] Docker Compose for local PostgreSQL
- [x] Full Prisma schema with all models from the spec
- [x] tsvector + pg_trgm search infrastructure (SQL migration)
- [x] Environment config module (all values from .env)
- [x] API response envelope helpers (success, list, error, pagination)
- [x] NextAuth with email/password + GitHub + Google OAuth
- [x] Registration, email verification, password reset endpoints
- [x] Email utility (Resend in production, console log in dev)
- [x] Dark theme Tailwind config matching the design
- [x] Base UI components (Button, Input, Badge, Toast)
- [x] App shell (Header, Sidebar, Footer, MobileNav)
- [x] Public layout + Homepage placeholder
- [x] Auth pages (Login, Signup, Verify Email, Reset Password)
- [x] Dashboard layout with auth guard + Overview page
- [x] Health check endpoint
- [x] Clean build with no errors

**Next:** Phase 2 — Core Marketplace (Rulesets CRUD, search, voting, tags, public pages)
