# Frontend → API Contract

Audit of every client-side API reference under `src/app/(pages)/` and
`src/components/`. Produced for the frontend-replacement refactor.

Sources scanned: all `fetch(...)`, `useSWR`, `useQuery`, and
`/api/*` string occurrences. Excludes `src/app/api/**` (the API layer
itself is frozen).

No SWR or TanStack Query usage was found in the current code — every
call is a raw `fetch()` inside a client component.

## Client-side API calls

| Endpoint | Method | Component / Page |
|---|---|---|
| `/api/auth/register` | POST | `src/components/auth/signup-form.tsx` |
| `/api/auth/verify-email` | POST | `src/app/(auth)/verify-email/page.tsx` |
| `/api/auth/reset-password` (request link) | POST | `src/app/(auth)/reset-password/page.tsx` |
| `/api/auth/reset-password` (submit new pw) | POST | `src/app/(auth)/reset-password/page.tsx` |
| `/api/votes` | POST | `src/components/rulesets/vote-button.tsx` |
| `/api/saved` | POST | `src/components/social/save-button.tsx` |
| `/api/follow` | POST | `src/components/social/follow-button.tsx` |
| `/api/notifications` | GET | `src/components/notifications/notification-bell.tsx` |
| `/api/rulesets/:id/reviews` | POST | `src/components/reviews/review-form.tsx` |
| `/api/rulesets` | POST | `src/components/rulesets/ruleset-form.tsx` |
| `/api/rulesets/:id` | PATCH | `src/components/rulesets/ruleset-form.tsx` |
| `/api/settings/profile` | PATCH | `src/components/settings/profile-form.tsx` |
| `/api/tags/search?q=` | GET | `src/components/rulesets/tag-input.tsx` |
| `/api/uploads/presign` | POST | `src/components/rulesets/file-upload.tsx` |
| `/api/uploads/confirm` | POST | `src/components/rulesets/file-upload.tsx` |
| `/api/checkout` | POST | `src/components/rulesets/buy-button.tsx` |
| `/api/purchases/status?rulesetId=` | GET | `src/components/rulesets/buy-button.tsx` |
| `/api/bundles` | POST | `src/app/dashboard/bundles/new/bundle-form.tsx` |

Total: 18 distinct call sites across 14 files.

## Direct navigation / link references (not `fetch`)

| URL | Trigger | Component / Page |
|---|---|---|
| `/api/downloads/:rulesetId[?versionId=]` | `window.location.href` assignment | `src/components/rulesets/download-button.tsx` |
| `/api/downloads/:rulesetId` | `<Link href>` | `src/app/dashboard/purchases/page.tsx` |
| `/api/og/:slug` | Open Graph `<meta>` image (server-rendered) | `src/app/(public)/r/[slug]/page.tsx` |

## Non-`/api` external fetches worth noting

| URL | Method | Component | Purpose |
|---|---|---|---|
| presigned R2 URL (`presignData.url`) | PUT | `src/components/rulesets/file-upload.tsx` | Direct object upload to Cloudflare R2 after `/api/uploads/presign` issues the URL. Not an internal API. |

## Endpoints exposed but not called client-side

Every other `/api/*` route handler (enumerated via `find src/app/api -name route.ts`)
is exposed today but has **no client-side call site**. They're consumed either by
the server (React Server Components fetching via `src/lib/*` helpers, not via
HTTP) or by tests only. The new frontend will likely need them — the full list
is below so the new api-client can cover them.

### Read (GET)

- `/api/health`
- `/api/rulesets` — list
- `/api/rulesets/:id`
- `/api/rulesets/by-slug/:slug`
- `/api/rulesets/:id/reviews` — list
- `/api/rulesets/:id/versions`
- `/api/tags`
- `/api/tags/:tag/rulesets`
- `/api/collections`
- `/api/collections/:id`
- `/api/saved`
- `/api/discussions`
- `/api/discussions/:id/replies`
- `/api/analytics/overview`
- `/api/analytics/audience`
- `/api/analytics/rulesets/:id`
- `/api/users/:username` — public profile (see section below)
- `/api/admin/stats`
- `/api/admin/users` and `/api/admin/users/:id`
- `/api/admin/rulesets` and `/api/admin/rulesets/:id`
- `/api/admin/reports` and `/api/admin/reports/:id`

### Write (POST/PATCH/DELETE)

- `/api/collections` POST, `/api/collections/:id` PATCH/DELETE
- `/api/collections/:id/items` POST/DELETE
- `/api/discussions` POST
- `/api/discussions/:id/replies` POST
- `/api/reports` POST
- `/api/reviews/:id` PATCH/DELETE
- `/api/notifications/read` PATCH
- `/api/rulesets/:id` DELETE
- `/api/rulesets/:id/versions` POST

### Auth surface (handled by NextAuth — do not wrap in api-client)

- `/api/auth/[...nextauth]` — internal NextAuth routes (`/signin`, `/signout`,
  `/session`, `/csrf`, `/callback/credentials`, etc). These are invoked by
  `next-auth/react` helpers (`signIn`, `signOut`, `useSession`), not directly.

### Webhooks

- `/api/webhooks/lemonsqueezy` — server-to-server only, never called from the frontend.

## `GET /api/users/:username` — public profile

Returns the public profile for a user along with aggregate stats and a
`isFollowing` flag scoped to the current viewer. Never exposes `email`,
`passwordHash`, email-verification/reset tokens, `sellerStatus`,
`lemonsqueezyCustomerId`, or `totalEarnings`.

**Auth:** optional. Unauthenticated requests receive the same profile
shape with `isFollowing: false`. Requests from the profile owner also
receive `isFollowing: false` (self-follow is never true).

**Response:**

```ts
{
  data: {
    id:         string;
    username:   string;
    name:       string;
    avatar:     string | null;
    bio:        string | null;
    reputation: number;
    role:       "USER" | "PRO" | "ADMIN";
    createdAt:  string;           // ISO-8601
    stats: {
      rulesetCount:   number;     // count of PUBLISHED rulesets authored
      totalDownloads: number;     // sum of downloadCount across published rulesets
      totalSales:     number;     // count of COMPLETED purchases across the author's rulesets
      followerCount:  number;     // users following this profile
      followingCount: number;     // users this profile follows
      avgRating:      number;     // avg of all reviews on the author's rulesets (0 if none)
    };
    isFollowing: boolean;         // false for self / unauthenticated / no follow record
  }
}
```

**Errors:**

- `404 NOT_FOUND` when the username does not exist.

**Consumed by:** `users.getProfile(username)` in `src/lib/api-client.ts`,
wrapped by the `useProfile(username)` hook in `src/hooks/use-profile.ts`.

## Response envelope

Every `/api/*` route handler in the codebase returns the standard envelope:

```ts
// success
{ data: T }
// error
{ error: { code: string; message: string; details?: unknown } }
```

Confirmed by every consumer inspected (e.g. `notification-bell.tsx` reads
`data.data.unreadCount`; `tag-input.tsx` reads `data.data.filter(...)`).
The new `apiClient` wrapper must unwrap `data` on success and throw
`ApiError` from `error` on non-2xx.
