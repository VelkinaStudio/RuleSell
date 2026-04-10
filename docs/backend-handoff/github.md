# GitHub Integration — Backend Handoff

## Overview

The GitHub integration lets creators import repository content into the publish wizard, claim maintainer status for existing listings, and keep listings synced with their source repos.

The frontend is fully built with mock data. This document specifies the API routes, database models, and OAuth setup needed to make it real.

---

## 1. GitHub OAuth Setup

NextAuth already supports the GitHub provider. Add:

```env
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

Scopes needed: `read:user`, `repo` (for private repo access), `read:org` (for org verification).

In the NextAuth config, add the GitHub provider and store the `access_token` in the session/JWT so API routes can call the GitHub API on behalf of the user.

---

## 2. API Routes

### GET /api/github/repos

List the authenticated user's GitHub repositories.

**Query params:**
- `q` (string, optional) — search filter
- `page` (number, default 1)
- `per_page` (number, default 20)
- `language` (string, optional)

**Response:** `{ data: GitHubRepo[], pagination: Pagination }`

**Implementation:** Proxy to GitHub API `GET /user/repos` with the stored access token. Map GitHub's response to our `GitHubRepo` shape. Include org info from `repo.organization`.

---

### GET /api/github/repos/[owner]/[repo]/tree

Browse a repository's file tree.

**Query params:**
- `ref` (string, optional) — branch/tag/sha, defaults to repo's default branch
- `recursive` (boolean, default true)

**Response:** `{ data: GitHubTreeEntry[] }`

**Implementation:** Proxy to GitHub API `GET /repos/{owner}/{repo}/git/trees/{sha}?recursive=1`. Map to our `GitHubTreeEntry` shape.

---

### GET /api/github/repos/[owner]/[repo]/readme

Fetch the README content for a repository.

**Query params:**
- `ref` (string, optional) — branch

**Response:** `{ data: { content: string, encoding: string } }`

**Implementation:** Proxy to GitHub API `GET /repos/{owner}/{repo}/readme`. Return decoded content.

---

### POST /api/github/claims

Create a maintainer claim linking a RuleSell listing to a GitHub repo.

**Body:**
```json
{
  "rulesetId": "string",
  "repoFullName": "owner/repo"
}
```

**Verification flow:**
1. Check user has push access to the repo (GitHub API `GET /repos/{owner}/{repo}/collaborators/{username}/permission`)
2. Check repo is not already claimed by another user
3. Create `MaintainerClaim` record with status `pending`
4. If user has push access, auto-verify (set status to `verified`)
5. Otherwise, require a verification file (e.g., `.rulesell-verify` in the repo root)

**Response:** `{ data: MaintainerClaim }`

---

### GET /api/github/claims/[rulesetId]

Check the claim status for a given ruleset.

**Response:** `{ data: MaintainerClaim | null }`

---

### POST /api/github/sync/[rulesetId]

Trigger a manual sync between a claimed repo and the listing.

**What sync does:**
1. Fetch latest commit on default branch
2. Compare with last sync hash
3. If different: update listing's version, description (from README), license, file content
4. Update `GitHubSync` record with new timestamp and status

**Response:** `{ data: GitHubSyncStatus }`

---

## 3. Prisma Models

```prisma
model MaintainerClaim {
  id          String   @id @default(cuid())
  rulesetId   String   @unique
  userId      String
  repoFullName String
  status      ClaimStatus @default(PENDING)
  claimedAt   DateTime @default(now())
  verifiedAt  DateTime?

  ruleset     Ruleset  @relation(fields: [rulesetId], references: [id])
  user        User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([repoFullName])
}

enum ClaimStatus {
  PENDING
  VERIFIED
  REJECTED
}

model GitHubSync {
  id            String   @id @default(cuid())
  rulesetId     String   @unique
  repoFullName  String
  lastSyncAt    DateTime @default(now())
  lastCommitSha String?
  status        SyncStatus @default(SYNCED)
  pendingChanges Int     @default(0)
  errorMessage  String?

  ruleset       Ruleset  @relation(fields: [rulesetId], references: [id])

  @@index([repoFullName])
}

enum SyncStatus {
  SYNCED
  OUTDATED
  ERROR
}
```

---

## 4. Webhook (Optional, Phase 2)

Register a GitHub webhook on claimed repos to receive `push` events. On push:
1. Compare branch with the repo's default branch
2. If default branch, update `GitHubSync.status` to `OUTDATED` and increment `pendingChanges`
3. Show the amber "changes pending" indicator on the listing

Webhook endpoint: `POST /api/webhooks/github`
Verify signature with `GITHUB_WEBHOOK_SECRET`.

---

## 5. Security Considerations

- Always verify the user's GitHub access token is valid before proxying API calls
- Rate-limit GitHub API calls (5,000/hour per token)
- Store GitHub access tokens encrypted at rest
- Validate `repoFullName` format (`owner/repo`) server-side
- Prevent claiming repos you don't have push access to
- Webhook signature verification is mandatory
