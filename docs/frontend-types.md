# Shared Frontend ↔ API Types

Every TypeScript type that currently crosses the `/api/*` boundary.
Documented from existing definitions — nothing new was introduced.

## Response envelope — `src/types/index.ts`

```ts
interface PaginationMeta {
  total: number;
  page?: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

interface ApiSuccessResponse<T> {
  data: T;
}

interface ApiListResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

interface ApiErrorDetail {
  code: string;          // VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN |
                         // NOT_FOUND | CONFLICT | RATE_LIMITED | INTERNAL_ERROR
  message: string;
  details?: Record<string, unknown>;
}

interface ApiErrorResponse {
  error: ApiErrorDetail;
}
```

Producers: `src/lib/api/response.ts` (`success`, `list`, `error`, `errors.*`,
`paginationFromOffset`, `paginationFromCursor`) — used by every API route.

Error `code` vocabulary is fixed (see `src/lib/api/response.ts:32`).
`HTTP` status mapping:

| code | status |
|---|---|
| `VALIDATION_ERROR` | 400 |
| `UNAUTHORIZED` | 401 |
| `FORBIDDEN` | 403 |
| `NOT_FOUND` | 404 |
| `CONFLICT` | 409 |
| `RATE_LIMITED` | 429 |
| `INTERNAL_ERROR` | 500 |

## Domain response shapes

### `RulesetCardData` — `src/types/index.ts`

The only canonical JSON-ready response shape exported from `src/types`.
Used by ruleset list endpoints, homepage, search, and every ruleset card.

```ts
interface RulesetCardData {
  id: string;
  title: string;
  slug: string;
  description: string;
  previewContent: string;
  type: string;            // RULESET | PROMPT | WORKFLOW | AGENT | BUNDLE | DATASET
  platform: string;        // CURSOR | VSCODE | OBSIDIAN | N8N | MAKE |
                           // GEMINI | CLAUDE | CHATGPT | OTHER
  category: string;
  price: number;           // in minor units (cents)
  currency: string;        // ISO-4217 code
  downloadCount: number;
  viewCount: number;
  avgRating: number;       // 0–5
  ratingCount: number;
  trendingScore: number;
  status: string;          // DRAFT | PUBLISHED | ARCHIVED
  createdAt: string;       // ISO date string
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
  };
  tags: string[];
  voteCount: number;
  hasVoted: boolean;
}
```

## Request body schemas (Zod-inferred)

These are the only request types already inferred and exported today.
Schemas live under `src/lib/validations/`. For schemas without an explicit
`z.infer` export, the new api-client should derive the type from the
schema at the call site via `z.infer<typeof ...>`.

### `src/lib/validations/auth.ts`

```ts
const registerSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
  name:     z.string().min(1).max(100),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
});
type RegisterInput = z.infer<typeof registerSchema>;
```

Used by: `POST /api/auth/register` and `src/components/auth/signup-form.tsx`.

### `src/lib/validations/rulesets.ts`

```ts
const createRulesetSchema = z.object({
  title:          z.string().min(1).max(200),
  description:    z.string().min(1).max(2000),
  previewContent: z.string().min(1),
  type:           z.enum(["RULESET","PROMPT","WORKFLOW","AGENT","BUNDLE","DATASET"]),
  platform:       z.enum(["CURSOR","VSCODE","OBSIDIAN","N8N","MAKE","GEMINI","CLAUDE","CHATGPT","OTHER"]),
  category:       z.string().min(1),
  price:          z.number().min(0).default(0),
  content:        z.string().optional(),
  tags:           z.array(z.string().max(50)).max(10).optional(),
});
const updateRulesetSchema = createRulesetSchema
  .partial()
  .extend({ status: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).optional() });

type CreateRulesetInput = z.infer<typeof createRulesetSchema>;
type UpdateRulesetInput = z.infer<typeof updateRulesetSchema>;
```

Used by: `POST/PATCH /api/rulesets[:id]` and `src/components/rulesets/ruleset-form.tsx`.

### `src/lib/validations/settings.ts`

```ts
const updateProfileSchema = z.object({
  name:     z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  bio:      z.string().max(500).optional(),
});
type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
```

Used by: `PATCH /api/settings/profile` and `src/components/settings/profile-form.tsx`.

### `src/lib/validations/bundles.ts`

```ts
const createBundleSchema = z.object({
  title:       z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  price:       z.number().min(0),
  rulesetIds:  z.array(z.string()).min(2),
});
type CreateBundleInput = z.infer<typeof createBundleSchema>;
```

Used by: `POST /api/bundles` and `src/app/dashboard/bundles/new/bundle-form.tsx`.

### `src/lib/validations/engagement.ts` (no type exports; infer at call site)

```ts
const voteSchema   = z.object({ rulesetId: z.string().min(1) });
const followSchema = z.object({ userId:    z.string().min(1) });
const saveSchema   = z.object({ rulesetId: z.string().min(1) });
const reportSchema = z.object({
  rulesetId: z.string().min(1),
  reason:    z.enum(["SPAM","MALWARE","COPYRIGHT","INAPPROPRIATE","OTHER"]),
  details:   z.string().max(1000).optional(),
});
const reviewSchema = z.object({
  rating:  z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
});
```

Used by: `POST /api/votes`, `/api/follow`, `/api/saved`, `/api/reports`,
`/api/rulesets/[id]/reviews`, `/api/reviews/[id]`.

### `src/lib/validations/collections.ts` (no type exports)

```ts
const createCollectionSchema = z.object({
  name:        z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic:    z.boolean().default(true),
});
const updateCollectionSchema = createCollectionSchema.partial();
```

Used by: `POST /api/collections`, `PATCH /api/collections/[id]`.

### `src/lib/validations/discussions.ts` (no type exports)

```ts
const createDiscussionSchema = z.object({
  title:     z.string().min(1).max(200),
  bodyText:  z.string().min(1).max(5000),
  category:  z.string().min(1),
  rulesetId: z.string().optional(),
});
const createReplySchema = z.object({
  bodyText:      z.string().min(1).max(5000),
  parentReplyId: z.string().optional(),
});
```

Used by: `POST /api/discussions`, `POST /api/discussions/[id]/replies`.

## Types that exist but are NOT currently shared across the boundary

These are server-only or test-only — the new frontend should not import them
directly. Listed so they're not mistaken for part of the contract.

- `Session` augmentations in `src/types/next-auth.d.ts` — auth-layer only,
  consumed via `next-auth/react` `useSession()` which already returns the
  augmented shape.
- Prisma model types under `src/generated/prisma/**` — internal ORM types,
  never JSON-serialized directly. Route handlers always project through
  `select`/`include` and/or a `CARD_SELECT`-style shape before responding.
- `canViewFullContent` access result type in `src/lib/rulesets/access.ts` —
  server-side only; clients read the computed preview/full content through
  the route response, not the access type.

## Recommended imports for the new api-client

```ts
import type {
  ApiSuccessResponse,
  ApiListResponse,
  ApiErrorResponse,
  ApiErrorDetail,
  PaginationMeta,
  RulesetCardData,
} from "@/types";

import type { RegisterInput } from "@/lib/validations/auth";
import type { CreateRulesetInput, UpdateRulesetInput } from "@/lib/validations/rulesets";
import type { UpdateProfileInput } from "@/lib/validations/settings";
import type { CreateBundleInput } from "@/lib/validations/bundles";
```

Everything else can be inferred in-line via `z.infer<typeof ...>` from the
schemas above without adding new type declarations.
