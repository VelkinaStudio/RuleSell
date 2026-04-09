# Frontend Types Reference

Complete type reference for the RuleSell frontend. All types defined in `src/types/index.ts`.

> **Source:** `src/types/index.ts`
> **Date:** 2026-04-08

Types marked **(contract)** are from the original API contract. Types marked **(extension)** were added during the frontend rebuild. Types marked **(community)** are for the community layer (v2).

---

## Core Enums (contract)

**Platform:** CURSOR | VSCODE | OBSIDIAN | N8N | MAKE | CLAUDE | CHATGPT | GEMINI | CUSTOM

**Type:** RULESET | PROMPT | WORKFLOW | AGENT | BUNDLE | DATASET

**Role:** USER | PRO | ADMIN

**AccessLevel:** PUBLIC | FREE_DOWNLOAD | PURCHASED | SUBSCRIPTION_ACTIVE | SUBSCRIPTION_EXPIRED | REFUNDED | AUTHOR

**Status:** DRAFT | PENDING_REVIEW | PUBLISHED | UNPUBLISHED | REMOVED

## Extension Enums

**Category (extension):** RULES | MCP_SERVER | SKILL | AGENT_TEAM | WORKFLOW | PROMPT | CLI | DATASET | BUNDLE

**Environment (extension):** claude-code | claude-desktop | cursor | windsurf | cline | continue | zed | codex | chatgpt | gemini-cli | aider | copilot | n8n | make | obsidian | custom

**VariantKind (extension):** mcp_json | claude_skill | cursor_rule | system_prompt | n8n_workflow | make_blueprint | crewai_agent | langgraph_agent | bash_install | npm_install | docker_compose | raw_file

**InstallMethod (extension):** copy | download | command | json_snippet

## Trust System Enums (extension)

**ReputationLevel:** NEWCOMER | MEMBER | CONTRIBUTOR | TRUSTED | EXPERT | AUTHORITY

**CreatorMark:** VERIFIED_CREATOR | TRADER | CERTIFIED_DEV | PRO | TEAM | MAINTAINER | TOP_RATED

**ItemBadge:** VERIFIED | MAINTAINER_VERIFIED | EDITORS_PICK | QUALITY_A | QUALITY_B | QUALITY_C | POPULAR | UPDATED | NEW | OFFICIAL | FEATURED | LICENSE

---

## Ruleset (primary entity)

| Field | Type | Origin | Notes |
|---|---|---|---|
| id | string | contract | UUID |
| slug | string | contract | URL-safe |
| title | string | contract | |
| description | string | contract | markdown |
| previewContent | string | contract | visible before purchase |
| platform | Platform | contract | |
| type | Type | contract | |
| category | Category | extension | primary category |
| tags | string[] | contract | |
| price | number | contract | cents |
| currency | string | contract | ISO-4217 |
| downloadCount | number | contract | |
| purchaseCount | number | contract | |
| viewCount | number | contract | |
| avgRating | number | contract | 0-5 |
| ratingCount | number | contract | |
| status | Status | contract | |
| createdAt | string | contract | ISO-8601 |
| updatedAt | string | contract | ISO-8601 |
| author | RulesetAuthor | contract | nested |
| currentUserVoted | boolean | contract | requires auth |
| currentUserSaved | boolean | contract | requires auth |
| currentUserAccess | AccessLevel | contract | requires auth |
| secondaryCategories | Category[] | extension | max 2 |
| variants | Variant[] | extension | install configs |
| defaultVariantId | string | extension | |
| version | string | extension | semver |
| license | string | extension | SPDX |
| qualityScore | number | extension | 0-100 |
| qualityBreakdown | QualityBreakdown | extension | |
| badges | ItemBadge[] | extension | |
| team? | RulesetTeam | extension | optional |
| maintainerClaim? | MaintainerClaim | extension | optional |
| scanResults? | ScanResults | extension | optional |

### RulesetAuthor (contract)

| Field | Type |
|---|---|
| username | string |
| avatar | string or null |
| reputation | number |
| creatorMarks | CreatorMark[] |
| level | ReputationLevel |

### RulesetTeam (extension)

slug, name, avatar (string or null), verified (boolean)

### MaintainerClaim (extension)

githubRepo, claimedAt (ISO-8601), verified (boolean)

### QualityBreakdown (extension)

tokenEfficiency (number or null), installSuccess (number or null), schemaClean (number or null), freshness (number), reviewScore (number), securityPass (boolean)

### ScanResults (extension)

virusTotalPass, semgrepPass, sandboxPass (all boolean), scannedAt (ISO-8601)

---

## Variant (extension)

| Field | Type | Notes |
|---|---|---|
| id | string | |
| environments | Environment[] | |
| kind | VariantKind | |
| label | string | |
| version | string | |
| install | VariantInstall | |
| instructions? | string | |
| requirements? | VariantRequirement[] | |
| isPrimary? | boolean | |
| qualityScore? | number | |
| lastTestedAt? | string | |

**VariantInstall:** method (InstallMethod), content (string), targetPath? (string), language? (string)

**VariantRequirement:** key (string), constraint (string)

---

## User (contract + extension)

| Field | Type | Origin |
|---|---|---|
| id | string | contract |
| name | string | contract |
| username | string | contract |
| email | string | contract |
| avatar | string or null | contract |
| role | Role | contract |
| reputation | number | extension |
| level | ReputationLevel | extension |
| creatorMarks | CreatorMark[] | extension |
| joinedAt | string | contract |
| isAdultConfirmed | boolean | extension |
| countryOfResidence | string | extension |
| preferredEnvironments | Environment[] | extension |
| builderStats? | BuilderStats | extension |
| sellerStats? | SellerStats | extension |
| maintainerRepos? | string[] | extension |

**BuilderStats:** publishedCount, verifiedInstallCount, canSellPaid (boolean)

**SellerStats:** traderVerified (boolean), stripeConnectStatus (none/pending/verified), totalEarnings (cents)

---

## Review (contract)

| Field | Type | Notes |
|---|---|---|
| id | string | |
| rulesetId | string | |
| author | RulesetAuthor | |
| rating | number | 1-5 |
| title | string | |
| body | string | markdown |
| verifiedInstall | boolean | |
| environmentTested | Environment | |
| helpfulCount | number | |
| currentUserMarkedHelpful | boolean | requires auth |
| createdAt | string | |
| updatedAt | string | |

---

## Team (extension)

slug, name, description, avatar (string or null), verified (boolean), memberCount, members (TeamMember[]), rulesetCount, totalEarnings (cents)

**TeamMember:** username (string), role (owner/admin/member)

## Collection (extension)

id, slug, title, description, curatedBy (username), rulesetIds (string[]), coverAsset? (string), itemCount, followerCount

---

## Community Types (community)

### Discussion

id, rulesetId, title, category (DiscussionCategory), author (RulesetAuthor), body, replyCount, reactionCount, isPinned, createdAt, replies (DiscussionReply[])

**DiscussionCategory:** qa | tips | bugs | feature_request | showcase

**DiscussionReply:** id, author (RulesetAuthor), body, reactions (number), isAnswer (boolean), createdAt

### Notification

id, kind (NotificationKind), title, body, href, read (boolean), createdAt

**NotificationKind:** reply | publish | milestone | update | follow

### ActivityFeedItem

id, kind (ActivityKind), title, body, href, createdAt

**ActivityKind:** new_item | discussion_reply | item_update | trending | showcase

### ChangelogEntry

version, date, description

---

## Pagination and Error Shapes (contract)

### Pagination

total, page, pageSize, hasNext (boolean), hasPrev (boolean), nextCursor? (string)

### Page\<T\>

data (T[]), pagination (Pagination)

### ApiError (response body)

error.code (string), error.message (string), error.details? (Record)

---

## UI Component Mapping

| Component | Location | Status |
|---|---|---|
| Button | src/components/ui/button.tsx | existing (shadcn) |
| Badge | src/components/ui/badge.tsx | existing (shadcn) |
| Card | src/components/ui/card.tsx | existing (shadcn) |
| Skeleton | src/components/ui/skeleton.tsx | existing (shadcn) |
| Avatar | src/components/ui/avatar.tsx | existing (shadcn) |
| CodeBlock | src/components/ui/code-block.tsx | NEW |
| StarRating | src/components/ui/star-rating.tsx | NEW |
| PriceTag | src/components/ui/price-tag.tsx | NEW |
| EmptyState | src/components/ui/empty-state.tsx | existing |
| ErrorState | src/components/ui/error-state.tsx | existing |
| CopyButton | src/components/ui/copy-button.tsx | existing |
| QualityBar | src/components/ui/quality-bar.tsx | existing |
