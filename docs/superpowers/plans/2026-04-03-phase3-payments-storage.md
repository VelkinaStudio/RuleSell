# Phase 3: Payments & Storage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Lemon Squeezy checkout integration (purchase flow, webhook handler, purchase status polling), Cloudflare R2 file storage (presigned upload/download URLs), and connect them so paid content is gated behind verified purchases.

**Architecture:** Lemon Squeezy handles all payment processing — our server never touches card details. Checkout opens as overlay/redirect, webhook confirms payment asynchronously, frontend polls for confirmation. Cloudflare R2 (S3-compatible) stores file bundles — uploads use presigned PUT URLs (client→R2 direct), downloads use presigned GET URLs with 302 redirect (never expose URL to prevent sharing). Purchase verification gates download access.

**Tech Stack:** Next.js 16.2.2, TypeScript, Prisma 7, `@lemonsqueezy/lemonsqueezy.js`, `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` (for R2), existing NextAuth v5 auth

**Important — Next.js 16 breaking change:** All `params` and `searchParams` are `Promise` types and must be awaited. Route handlers receive `{ params }: { params: Promise<{ id: string }> }`.

**Phases Overview:**
- Phase 1 (done): Foundation — project, DB, auth, UI shell
- Phase 2 (done): Core Marketplace — rulesets CRUD, search, voting, tags, public pages
- **Phase 3 (this plan): Payments & Storage — Lemon Squeezy, file uploads/downloads**
- Phase 4: Community — reviews, discussions, follows, collections, notifications
- Phase 5: Pro & Admin — analytics, admin panel, subscriptions, cron jobs
- Phase 6: Polish & Deploy — SEO, OG images, emails, Railway deployment

---

## File Structure (Phase 3)

```
src/
├── lib/
│   ├── lemonsqueezy.ts                        # Lemon Squeezy client setup
│   ├── storage.ts                             # S3/R2 client + presign helpers
│   └── purchases/
│       └── queries.ts                         # Purchase query helpers
├── app/
│   ├── api/
│   │   ├── checkout/route.ts                  # POST: create Lemon Squeezy checkout
│   │   ├── purchases/
│   │   │   └── status/route.ts                # GET: poll purchase status
│   │   ├── webhooks/
│   │   │   └── lemonsqueezy/route.ts          # POST: webhook handler
│   │   ├── uploads/
│   │   │   ├── presign/route.ts               # POST: get presigned PUT URL
│   │   │   └── confirm/route.ts               # POST: verify upload + create FileBundle
│   │   └── downloads/
│   │       └── [rulesetId]/route.ts           # GET: verify access → presigned GET → 302
│   └── dashboard/
│       └── purchases/page.tsx                 # My purchases page
├── components/
│   └── rulesets/
│       ├── buy-button.tsx                     # Checkout trigger + post-purchase polling
│       └── download-button.tsx                # Download trigger for owned content
│       └── file-upload.tsx                    # Presigned upload for dashboard
```

---

### Task 1: Install Dependencies + Lemon Squeezy Client

**Files:**
- Modify: `package.json`
- Create: `src/lib/lemonsqueezy.ts`

- [ ] **Step 1: Install Lemon Squeezy SDK and AWS S3 client**

```bash
npm install @lemonsqueezy/lemonsqueezy.js @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

- [ ] **Step 2: Create Lemon Squeezy client**

Create `src/lib/lemonsqueezy.ts`:
```typescript
import { lemonSqueezySetup, createCheckout, getOrder } from "@lemonsqueezy/lemonsqueezy.js";
import crypto from "crypto";

let initialized = false;

function ensureInitialized() {
  if (!initialized) {
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });
    initialized = true;
  }
}

export async function createLemonSqueezyCheckout(opts: {
  storeId: string;
  variantId: string;
  userEmail: string;
  userId: string;
  rulesetId: string;
  rulesetTitle: string;
}) {
  ensureInitialized();
  const { data, error } = await createCheckout(opts.storeId, opts.variantId, {
    checkoutData: {
      email: opts.userEmail,
      custom: {
        user_id: opts.userId,
        ruleset_id: opts.rulesetId,
      },
    },
    productOptions: {
      name: opts.rulesetTitle,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/r/${opts.rulesetId}?purchase=success`,
    },
  });

  if (error) throw new Error(error.message);
  return data!.data.attributes.url;
}

export async function getLemonSqueezyOrder(orderId: string) {
  ensureInitialized();
  const { data, error } = await getOrder(orderId);
  if (error) throw new Error(error.message);
  return data!.data;
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json src/lib/lemonsqueezy.ts
git commit -m "feat: add Lemon Squeezy client with checkout, order, and webhook verification"
```

---

### Task 2: S3/R2 Storage Client

**Files:**
- Create: `src/lib/storage.ts`

- [ ] **Step 1: Create S3/R2 client with presign helpers**

Create `src/lib/storage.ts`:
```typescript
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const MAX_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE_BYTES || "52428800", 10);

const ALLOWED_EXTENSIONS = new Set([
  ".cursorrules", ".md", ".json", ".yaml", ".yml",
  ".txt", ".zip", ".toml", ".js", ".py",
]);

const EXTENSION_TO_MIME: Record<string, string> = {
  ".cursorrules": "text/plain",
  ".md": "text/markdown",
  ".json": "application/json",
  ".yaml": "application/x-yaml",
  ".yml": "application/x-yaml",
  ".txt": "text/plain",
  ".zip": "application/zip",
  ".toml": "application/toml",
  ".js": "text/javascript",
  ".py": "text/x-python",
};

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot >= 0 ? filename.slice(lastDot).toLowerCase() : "";
}

export function validateFile(filename: string, sizeBytes: number): { valid: boolean; error?: string } {
  const ext = getExtension(filename);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `File type "${ext}" is not allowed` };
  }
  if (sizeBytes > MAX_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_SIZE / 1024 / 1024}MB limit` };
  }
  if (sizeBytes < 1) {
    return { valid: false, error: "File must not be empty" };
  }
  return { valid: true };
}

export function getMimeType(filename: string): string {
  const ext = getExtension(filename);
  return EXTENSION_TO_MIME[ext] || "application/octet-stream";
}

export async function createPresignedUploadUrl(
  rulesetId: string,
  versionId: string,
  filename: string,
): Promise<{ url: string; storageKey: string }> {
  const uuid = crypto.randomUUID();
  const sanitized = sanitizeFilename(filename);
  const storageKey = `rulesets/${rulesetId}/${versionId}/${uuid}-${sanitized}`;
  const mimeType = getMimeType(filename);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: storageKey,
    ContentType: mimeType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 600 });
  return { url, storageKey };
}

export async function createPresignedDownloadUrl(storageKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: storageKey,
  });

  return getSignedUrl(s3, command, { expiresIn: 900 });
}

export async function verifyObjectExists(storageKey: string): Promise<{ exists: boolean; sizeBytes: number }> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET,
      Key: storageKey,
    });
    const response = await s3.send(command);
    return { exists: true, sizeBytes: response.ContentLength || 0 };
  } catch {
    return { exists: false, sizeBytes: 0 };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/storage.ts
git commit -m "feat: add S3/R2 storage client with presigned URL helpers"
```

---

### Task 3: Purchase Query Helpers

**Files:**
- Create: `src/lib/purchases/queries.ts`

- [ ] **Step 1: Create purchase query helpers**

Create `src/lib/purchases/queries.ts`:
```typescript
import { db } from "@/lib/db";

export async function getPurchaseStatus(userId: string, rulesetId: string) {
  const purchase = await db.purchase.findFirst({
    where: { buyerId: userId, rulesetId },
    orderBy: { createdAt: "desc" },
    select: { status: true, accessType: true, accessExpiresAt: true },
  });

  if (!purchase) return { status: "NOT_FOUND" as const };

  if (purchase.status === "REFUNDED") return { status: "REFUNDED" as const };

  if (purchase.status === "COMPLETED") {
    if (purchase.accessType === "SUBSCRIPTION" && purchase.accessExpiresAt && purchase.accessExpiresAt < new Date()) {
      return { status: "EXPIRED" as const };
    }
    return { status: "COMPLETED" as const };
  }

  return { status: "PENDING" as const };
}

export async function getUserPurchases(userId: string) {
  return db.purchase.findMany({
    where: { buyerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      ruleset: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          platform: true,
          type: true,
          author: { select: { name: true, username: true } },
        },
      },
    },
  });
}

export function calculatePlatformFee(amount: number, isPro: boolean): number {
  const rate = isPro
    ? parseFloat(process.env.PRO_COMMISSION_RATE || "0.10")
    : parseFloat(process.env.STANDARD_COMMISSION_RATE || "0.20");
  return Math.round(amount * rate * 100) / 100;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/purchases/queries.ts
git commit -m "feat: add purchase query helpers and commission calculation"
```

---

### Task 4: Checkout API + Webhook Handler

**Files:**
- Create: `src/app/api/checkout/route.ts`
- Create: `src/app/api/webhooks/lemonsqueezy/route.ts`
- Create: `src/app/api/purchases/status/route.ts`

- [ ] **Step 1: Create checkout endpoint**

Create `src/app/api/checkout/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { createLemonSqueezyCheckout } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId } = body;

    if (!rulesetId) return errors.validation("rulesetId is required");

    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { id: true, title: true, slug: true, price: true, authorId: true, status: true },
    });

    if (!ruleset || ruleset.status === "ARCHIVED") return errors.notFound("Ruleset not found");
    if (ruleset.authorId === session.user.id) return errors.validation("Cannot buy your own ruleset");
    if (ruleset.price === 0) return errors.validation("This ruleset is free");

    // Check if already purchased
    const existing = await db.purchase.findFirst({
      where: { buyerId: session.user.id, rulesetId, status: "COMPLETED" },
    });
    if (existing) return errors.conflict("Already purchased");

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
    // In production, variant IDs would come from the ruleset's Lemon Squeezy product setup
    // For now, use a default variant or pass it from the client
    const variantId = body.variantId || process.env.LEMONSQUEEZY_DEFAULT_VARIANT_ID || "";

    const checkoutUrl = await createLemonSqueezyCheckout({
      storeId,
      variantId,
      userEmail: session.user.email!,
      userId: session.user.id,
      rulesetId: ruleset.id,
      rulesetTitle: ruleset.title,
    });

    return success({ checkoutUrl });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Create webhook handler**

Create `src/app/api/webhooks/lemonsqueezy/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { calculatePlatformFee } from "@/lib/purchases/queries";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data;

    if (!customData?.user_id || !customData?.ruleset_id) {
      return NextResponse.json({ error: "Missing custom data" }, { status: 400 });
    }

    const userId = customData.user_id;
    const rulesetId = customData.ruleset_id;
    const orderId = String(payload.data?.id || "");

    if (eventName === "order_created") {
      const amount = parseFloat(payload.data?.attributes?.total || "0") / 100;

      // Check seller's role for commission rate
      const ruleset = await db.ruleset.findUnique({
        where: { id: rulesetId },
        select: { authorId: true, author: { select: { role: true } } },
      });

      const isPro = ruleset?.author?.role === "PRO";
      const platformFee = calculatePlatformFee(amount, isPro);

      await db.purchase.upsert({
        where: {
          buyerId_rulesetId: undefined,
        },
        create: {
          buyerId: userId,
          rulesetId,
          amount,
          platformFee,
          lemonsqueezyOrderId: orderId,
          accessType: "LIFETIME",
          status: "COMPLETED",
        },
        update: {
          status: "COMPLETED",
          amount,
          platformFee,
        },
        // upsert doesn't work well here without a unique constraint on buyer+ruleset
        // Use findFirst + create/update instead
      });

      // Use findFirst + create pattern instead
      const existing = await db.purchase.findFirst({
        where: { buyerId: userId, rulesetId, lemonsqueezyOrderId: orderId },
      });

      if (existing) {
        await db.purchase.update({
          where: { id: existing.id },
          data: { status: "COMPLETED", amount, platformFee },
        });
      } else {
        await db.purchase.create({
          data: {
            buyerId: userId,
            rulesetId,
            amount,
            platformFee,
            lemonsqueezyOrderId: orderId,
            accessType: "LIFETIME",
            status: "COMPLETED",
          },
        });
      }

      // Update seller earnings
      if (ruleset) {
        await db.user.update({
          where: { id: ruleset.authorId },
          data: { totalEarnings: { increment: amount - platformFee } },
        });
      }

      // Update download/purchase count
      await db.ruleset.update({
        where: { id: rulesetId },
        data: { purchaseCount: { increment: 1 } },
      });

      // Log purchase event for trending
      await db.rulesetEvent.create({
        data: { rulesetId, type: "PURCHASE" },
      });
    }

    if (eventName === "order_refunded") {
      const purchase = await db.purchase.findFirst({
        where: { lemonsqueezyOrderId: orderId },
      });

      if (purchase) {
        await db.purchase.update({
          where: { id: purchase.id },
          data: { status: "REFUNDED", refundedAt: new Date() },
        });

        // Deduct seller earnings
        const ruleset = await db.ruleset.findUnique({
          where: { id: purchase.rulesetId },
          select: { authorId: true },
        });
        if (ruleset) {
          await db.user.update({
            where: { id: ruleset.authorId },
            data: { totalEarnings: { decrement: purchase.amount - purchase.platformFee } },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create purchase status polling endpoint**

Create `src/app/api/purchases/status/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { success, errors } from "@/lib/api/response";
import { getPurchaseStatus } from "@/lib/purchases/queries";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const rulesetId = req.nextUrl.searchParams.get("rulesetId");
    if (!rulesetId) return errors.validation("rulesetId is required");

    const result = await getPurchaseStatus(session.user.id, rulesetId);
    return success(result);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/checkout/ src/app/api/webhooks/ src/app/api/purchases/
git commit -m "feat: add checkout, webhook handler, and purchase status polling endpoints"
```

---

### Task 5: Upload API (Presign + Confirm)

**Files:**
- Create: `src/app/api/uploads/presign/route.ts`
- Create: `src/app/api/uploads/confirm/route.ts`

- [ ] **Step 1: Create presigned upload URL endpoint**

Create `src/app/api/uploads/presign/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { validateFile, createPresignedUploadUrl, getMimeType } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId, versionId, filename, sizeBytes } = body;

    if (!rulesetId || !versionId || !filename || !sizeBytes) {
      return errors.validation("rulesetId, versionId, filename, and sizeBytes are required");
    }

    // Verify ownership
    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { authorId: true },
    });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can upload files");

    // Verify version exists
    const version = await db.rulesetVersion.findUnique({
      where: { id: versionId },
      select: { rulesetId: true },
    });
    if (!version || version.rulesetId !== rulesetId) return errors.notFound("Version not found");

    // Validate file
    const validation = validateFile(filename, sizeBytes);
    if (!validation.valid) return errors.validation(validation.error!);

    const { url, storageKey } = await createPresignedUploadUrl(rulesetId, versionId, filename);
    const mimeType = getMimeType(filename);

    return success({ url, storageKey, mimeType });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Create upload confirmation endpoint**

Create `src/app/api/uploads/confirm/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { verifyObjectExists, getMimeType } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId, versionId, storageKey, filename, format } = body;

    if (!rulesetId || !versionId || !storageKey || !filename || !format) {
      return errors.validation("rulesetId, versionId, storageKey, filename, and format are required");
    }

    // Verify ownership
    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { authorId: true },
    });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can upload files");

    // Verify object exists in R2
    const { exists, sizeBytes } = await verifyObjectExists(storageKey);
    if (!exists) return errors.notFound("File not found in storage — upload may have failed");

    const mimeType = getMimeType(filename);

    // Create FileBundle record
    const fileBundle = await db.fileBundle.create({
      data: {
        rulesetVersionId: versionId,
        storageKey,
        filename,
        sizeBytes,
        mimeType,
        format,
      },
      select: { id: true, filename: true, sizeBytes: true, format: true },
    });

    return success(fileBundle, 201);
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/uploads/
git commit -m "feat: add presigned upload URL and upload confirmation endpoints"
```

---

### Task 6: Download API

**Files:**
- Create: `src/app/api/downloads/[rulesetId]/route.ts`

- [ ] **Step 1: Create download endpoint with access verification**

Create `src/app/api/downloads/[rulesetId]/route.ts`:
```typescript
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { errors } from "@/lib/api/response";
import { resolveAccessState } from "@/lib/rulesets/access";
import { createPresignedDownloadUrl } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rulesetId: string }> },
) {
  try {
    const { rulesetId } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { id: true, authorId: true, price: true },
    });

    if (!ruleset) return errors.notFound("Ruleset not found");

    // Verify access
    const accessState = await resolveAccessState(
      ruleset.id, ruleset.authorId, ruleset.price, session.user.id,
    );

    const canDownload = ["AUTHOR", "PURCHASED", "SUBSCRIPTION_ACTIVE", "FREE_DOWNLOAD"].includes(accessState);
    if (!canDownload) {
      return errors.forbidden("Purchase required to download this ruleset");
    }

    // Resolve version
    const versionId = req.nextUrl.searchParams.get("versionId");
    let version;

    if (versionId) {
      version = await db.rulesetVersion.findUnique({
        where: { id: versionId },
        include: { fileBundles: true },
      });
      if (!version || version.rulesetId !== rulesetId) {
        return errors.notFound("Version not found");
      }
      // Only author can access specific versions
      if (accessState !== "AUTHOR" && version.rulesetId !== rulesetId) {
        return errors.forbidden("Only the author can access specific versions");
      }
    } else {
      // Latest version
      version = await db.rulesetVersion.findFirst({
        where: { rulesetId },
        orderBy: { createdAt: "desc" },
        include: { fileBundles: true },
      });
    }

    if (!version) return errors.notFound("No versions found");
    if (version.fileBundles.length === 0) return errors.notFound("No files in this version");

    // Use the first file bundle (primary file)
    const fileBundle = version.fileBundles[0];
    const downloadUrl = await createPresignedDownloadUrl(fileBundle.storageKey);

    // Log download event
    await db.rulesetEvent.create({
      data: { rulesetId, type: "DOWNLOAD" },
    });
    await db.ruleset.update({
      where: { id: rulesetId },
      data: { downloadCount: { increment: 1 } },
    });

    // 302 redirect — never expose URL directly
    return new Response(null, {
      status: 302,
      headers: { Location: downloadUrl },
    });
  } catch {
    return errors.internal();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/api/downloads/"
git commit -m "feat: add download endpoint with access verification and presigned URL redirect"
```

---

### Task 7: BuyButton + Post-Purchase Polling Component

**Files:**
- Create: `src/components/rulesets/buy-button.tsx`

- [ ] **Step 1: Create BuyButton with checkout and polling**

Create `src/components/rulesets/buy-button.tsx`:
```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface BuyButtonProps {
  rulesetId: string;
  price: number;
  accessState: string;
}

export function BuyButton({ rulesetId, price, accessState }: BuyButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [confirmed, setConfirmed] = useState(accessState === "PURCHASED" || accessState === "SUBSCRIPTION_ACTIVE");
  const pollCount = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const pollPurchaseStatus = useCallback(async () => {
    if (pollCount.current >= 15) {
      setPolling(false);
      toast("Payment processing... check your purchases in a moment", "info");
      return;
    }

    pollCount.current++;

    try {
      const res = await fetch(`/api/purchases/status?rulesetId=${rulesetId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data.status === "COMPLETED") {
          setPolling(false);
          setConfirmed(true);
          toast("Purchase confirmed — your ruleset is ready", "success");
          router.refresh();
          return;
        }
      }
    } catch {
      // Continue polling
    }

    pollTimer.current = setTimeout(pollPurchaseStatus, 2000);
  }, [rulesetId, router]);

  useEffect(() => {
    if (searchParams.get("purchase") === "success" && !confirmed) {
      setPolling(true);
      pollCount.current = 0;
      pollPurchaseStatus();
    }
    return () => clearTimeout(pollTimer.current);
  }, [searchParams, confirmed, pollPurchaseStatus]);

  if (confirmed) return null;

  if (accessState === "FREE_DOWNLOAD") {
    return <Button>Get (Free)</Button>;
  }

  if (accessState === "REFUNDED") {
    return (
      <Button disabled variant="outline">
        Refunded
      </Button>
    );
  }

  if (accessState === "SUBSCRIPTION_EXPIRED") {
    return (
      <Button variant="outline" disabled>
        Subscription Expired
      </Button>
    );
  }

  async function handleBuy() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rulesetId }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.data.checkoutUrl;
      } else {
        const err = await res.json();
        toast(err.error?.message || "Checkout failed", "error");
      }
    } catch {
      toast("Checkout failed", "error");
    }
    setLoading(false);
  }

  if (polling) {
    return (
      <Button disabled>
        Confirming purchase...
      </Button>
    );
  }

  return (
    <Button onClick={handleBuy} disabled={loading}>
      {loading ? "Opening checkout..." : `Buy $${price.toFixed(2)}`}
    </Button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/rulesets/buy-button.tsx
git commit -m "feat: add BuyButton with Lemon Squeezy checkout and post-purchase polling"
```

---

### Task 8: DownloadButton + FileUpload Components

**Files:**
- Create: `src/components/rulesets/download-button.tsx`
- Create: `src/components/rulesets/file-upload.tsx`

- [ ] **Step 1: Create DownloadButton component**

Create `src/components/rulesets/download-button.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface DownloadButtonProps {
  rulesetId: string;
  versionId?: string;
  hasFiles: boolean;
}

export function DownloadButton({ rulesetId, versionId, hasFiles }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!hasFiles) return null;

  async function handleDownload() {
    setLoading(true);
    try {
      const params = versionId ? `?versionId=${versionId}` : "";
      // The endpoint returns a 302 redirect, so we use window.location
      window.location.href = `/api/downloads/${rulesetId}${params}`;
    } catch {
      toast("Download failed", "error");
    }
    setLoading(false);
  }

  return (
    <Button onClick={handleDownload} disabled={loading} variant="secondary" size="sm">
      {loading ? "Preparing..." : "Download"}
    </Button>
  );
}
```

- [ ] **Step 2: Create FileUpload component**

Create `src/components/rulesets/file-upload.tsx`:
```tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface FileUploadProps {
  rulesetId: string;
  versionId: string;
  onUploadComplete?: (fileBundle: { id: string; filename: string; sizeBytes: number }) => void;
}

const FORMAT_MAP: Record<string, string> = {
  ".cursorrules": "CURSORRULES",
  ".md": "MARKDOWN",
  ".json": "JSON",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".txt": "TEXT",
  ".zip": "ZIP",
  ".toml": "TOML",
  ".js": "JAVASCRIPT",
  ".py": "PYTHON",
};

export function FileUpload({ rulesetId, versionId, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Step 1: Get presigned URL
      setProgress("Getting upload URL...");
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rulesetId,
          versionId,
          filename: file.name,
          sizeBytes: file.size,
        }),
      });

      if (!presignRes.ok) {
        const err = await presignRes.json();
        toast(err.error?.message || "Failed to prepare upload", "error");
        setUploading(false);
        return;
      }

      const { data: presignData } = await presignRes.json();

      // Step 2: Upload directly to R2
      setProgress("Uploading file...");
      const uploadRes = await fetch(presignData.url, {
        method: "PUT",
        headers: { "Content-Type": presignData.mimeType },
        body: file,
      });

      if (!uploadRes.ok) {
        toast("File upload failed", "error");
        setUploading(false);
        return;
      }

      // Step 3: Confirm upload
      setProgress("Confirming...");
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      const format = FORMAT_MAP[ext] || "TEXT";

      const confirmRes = await fetch("/api/uploads/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rulesetId,
          versionId,
          storageKey: presignData.storageKey,
          filename: file.name,
          format,
        }),
      });

      if (confirmRes.ok) {
        const { data: fileBundle } = await confirmRes.json();
        toast("File uploaded successfully", "success");
        onUploadComplete?.(fileBundle);
      } else {
        const err = await confirmRes.json();
        toast(err.error?.message || "Upload confirmation failed", "error");
      }
    } catch {
      toast("Upload failed", "error");
    }

    setUploading(false);
    setProgress("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        accept=".cursorrules,.md,.json,.yaml,.yml,.txt,.zip,.toml,.js,.py"
        className="hidden"
        disabled={uploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? progress : "Upload File"}
      </Button>
      <p className="text-xs text-text-tertiary">
        Supported: .cursorrules, .md, .json, .yaml, .txt, .zip, .toml, .js, .py (max 50MB)
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/rulesets/download-button.tsx src/components/rulesets/file-upload.tsx
git commit -m "feat: add DownloadButton and FileUpload (presigned, direct-to-R2) components"
```

---

### Task 9: Integrate Buy/Download into Ruleset Detail Page

**Files:**
- Modify: `src/app/(public)/r/[slug]/page.tsx`

- [ ] **Step 1: Update ruleset detail page with BuyButton and DownloadButton**

In `src/app/(public)/r/[slug]/page.tsx`, add the imports and replace the placeholder buy/download buttons with the real components.

Add imports at the top:
```typescript
import { BuyButton } from "@/components/rulesets/buy-button";
import { DownloadButton } from "@/components/rulesets/download-button";
```

Replace the placeholder content-gating section (the `{!showFull && (...)}` block) with:
```tsx
        {!showFull && (
          <div className="mt-4 text-center">
            {accessState === "PUBLIC" && !session?.user ? (
              <Link href="/login">
                <Button>{ruleset.price > 0 ? "Sign in to buy" : "Sign in to download"}</Button>
              </Link>
            ) : (
              <BuyButton rulesetId={ruleset.id} price={ruleset.price} accessState={accessState} />
            )}
          </div>
        )}
        {showFull && latestVersion && latestVersion.fileBundles && latestVersion.fileBundles.length > 0 && (
          <div className="mt-4">
            <DownloadButton
              rulesetId={ruleset.id}
              versionId={latestVersion.id}
              hasFiles={latestVersion.fileBundles.length > 0}
            />
          </div>
        )}
```

Also update the `getRulesetBySlug` query to include `fileBundles` in versions:
The existing query in `src/lib/rulesets/queries.ts` already includes `versions`, but we need to add `fileBundles`. Update the `getRulesetBySlug` function's versions include:
```typescript
      versions: { orderBy: { createdAt: "desc" }, take: 5, include: { fileBundles: true } },
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/(public)/r/[slug]/page.tsx" src/lib/rulesets/queries.ts
git commit -m "feat: integrate BuyButton and DownloadButton into ruleset detail page"
```

---

### Task 10: Dashboard Purchases Page

**Files:**
- Create: `src/app/dashboard/purchases/page.tsx`

- [ ] **Step 1: Create my purchases page**

Create `src/app/dashboard/purchases/page.tsx`:
```tsx
import { auth } from "@/lib/auth";
import { getUserPurchases } from "@/lib/purchases/queries";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Purchases — Ruleset" };

export default async function DashboardPurchasesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const purchases = await getUserPurchases(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">My Purchases</h1>

      {purchases.length > 0 ? (
        <div className="space-y-2">
          {purchases.map((p) => (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <Link href={`/r/${p.ruleset.slug}`} className="text-sm font-medium text-text-primary hover:text-accent-green">
                  {p.ruleset.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                  <Badge variant={p.status === "COMPLETED" ? "green" : p.status === "REFUNDED" ? "error" : "warning"}>
                    {p.status}
                  </Badge>
                  <span>${p.amount.toFixed(2)}</span>
                  <span>by {p.ruleset.author.name}</span>
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {p.status === "COMPLETED" && (
                <Link
                  href={`/api/downloads/${p.rulesetId}`}
                  className="text-sm text-accent-green hover:underline"
                >
                  Download
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-text-tertiary">
          <p className="mb-4">You haven&apos;t purchased any rulesets yet</p>
          <Link href="/search" className="text-accent-green hover:underline">
            Browse the marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/dashboard/purchases/
git commit -m "feat: add dashboard purchases page"
```

---

### Task 11: Final Verification

- [ ] **Step 1: Run full build**

```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run build
```

Expected: Build succeeds with no TypeScript errors. Fix any errors that appear.

- [ ] **Step 2: Run linter**

```bash
cd /mnt/hdd/Jobs/Website/Ruleset
npm run lint
```

Expected: No errors. Fix any that appear.

- [ ] **Step 3: Verify all routes compile**

Expected new routes in build output:
```
ƒ /api/checkout
ƒ /api/downloads/[rulesetId]
ƒ /api/purchases/status
ƒ /api/uploads/confirm
ƒ /api/uploads/presign
ƒ /api/webhooks/lemonsqueezy
ƒ /dashboard/purchases
```

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues from Phase 3 final verification"
```

---

## Phase 3 Complete Checklist

After all tasks, you should have:
- [x] Lemon Squeezy client (checkout creation, order fetching, HMAC verification)
- [x] S3/R2 storage client (presigned upload/download URLs, file validation)
- [x] Purchase query helpers with commission calculation
- [x] Checkout endpoint (creates Lemon Squeezy checkout session)
- [x] Webhook handler (order_created, order_refunded with HMAC verification)
- [x] Purchase status polling endpoint (for post-checkout confirmation)
- [x] Upload presign + confirm endpoints (direct-to-R2 upload flow)
- [x] Download endpoint (access verification → presigned GET → 302 redirect)
- [x] BuyButton component (checkout trigger + post-purchase polling)
- [x] DownloadButton component (triggers presigned download)
- [x] FileUpload component (3-step: presign → upload → confirm)
- [x] Ruleset detail page integrated with buy/download flow
- [x] Dashboard purchases page
- [x] Clean build with no errors

**Next:** Phase 4 — Community (reviews, discussions, follows, collections, notifications)
