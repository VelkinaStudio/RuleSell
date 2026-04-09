# RuleSet AI — Community Platform Design Spec

**Date:** 2026-03-28
**Author:** Nalba + Claude
**Status:** Approved design, pending implementation plan

---

## Problem

RuleSet AI exists as a polished frontend prototype for buying/selling AI configurations. But a storefront is not a community. The platform needs to become the place developers return to daily — not just when they need to buy something. The model is closer to Roblox (community builds the product) than Gumroad (creator sells a file).

## Target Audience

Developers and professionals who use AI tools for development and creation:
- IDE power users (Cursor, Windsurf, VS Code, OpenCode, Aider, Continue.dev)
- Agent builders (Claude Code, AGENTS.md, CrewAI, LangGraph, AutoGen, Agency Swarm)
- Automation engineers (N8N, Make, Zapier, Langflow)
- Creative AI users (ComfyUI, Stable Diffusion pipelines, voice/video AI)
- DevOps engineers (Copilot workspace, AI CI/CD configs)

## Core Principle

**The community IS the product.** Products are the artifacts. Trust comes from people, not algorithms. Quality comes from certified developers who stake their reputation on what they endorse.

---

## 1. Asset Taxonomy (Open, Not Fixed)

### Layer 1: Asset Type (what it IS)
- Configuration
- Workflow
- Prompt
- Plugin/Extension
- Template
- Bundle

### Layer 2: Platform Tags (what it's FOR — community-driven)
Tags are created by community members when they first list a product for a new tool. No admin action needed. Moderation via approval gate + synonyms for duplicates.

Examples: Cursor, Windsurf, Claude Code, Codex, OpenCode, Aider, N8N, CrewAI, LangGraph, ComfyUI — and every new AI tool that launches tomorrow.

### Compatibility Matrix (per product)
- Works with: tool names + versions
- Tested on: OS
- Requires: runtime dependencies

---

## 2. Certified Developer System

Three paths to certification, layered over time:

### Path 1: Manual (launch)
Creator applies → admin reviews GitHub/portfolio → approved/denied.
Target: first 20-30 certified devs seeded by the founding team.

### Path 2: Reputation-Earned (after 3 months)
Earn points through platform activity. At 200 points → auto-eligible → light admin review → certified.

### Path 3: Peer Nomination (after 6 months)
3 existing certified devs nominate a community member. Nominee needs 100+ reputation minimum. 72-hour community objection window → auto-certified.

### Certified Dev Privileges
- Badge products with tiered reviews
- Curate "Official Collections"
- Earn 2-3% of sales on products they badge (from platform's 15% cut)
- Featured on Certified Developers page
- Priority support + direct feedback channel
- Close discussions on products they've badged
- Feature showcases on products they've badged

### Target Ratio
2-5% of active users certified. Exclusive enough to mean something, achievable enough to motivate.

---

## 3. Product Badge System

Three badge types, each tied to a specific certified developer's name and reputation:

| Badge | Meaning | What reviewer checks |
|-------|---------|---------------------|
| **Verified Working** | "I ran this, it works" | Install, run, confirm on stated platforms |
| **Quality Reviewed** | "Well-structured code/config" | Documentation, structure, no malicious patterns |
| **Recommended** | "I vouch for this" | Personal endorsement — strongest signal |

- A product can have multiple badges from different certified devs
- Display: "Verified by @alexchen, Recommended by @emmawilson"
- Badges are revocable — if product updates break something, reviewer can withdraw
- If a certified dev's certification is revoked, all their active badges are also revoked

---

## 4. Reputation System

Stack Overflow-inspired graduated privileges with daily caps.

### Point Values

| Action | Points | Daily Cap |
|--------|--------|-----------|
| Give a product review | +5 | 3/day |
| Receive upvote on review | +2 | 20/day |
| Helpful answer in discussion | +3 | 10/day |
| Best answer marked | +10 | None |
| Product gets a badge | +15 | None |
| Badge you gave leads to sale | +5 | None |
| Collection gets 10 followers | +8 | None |
| Showcase gets 5 upvotes | +5 | None |
| Downvote received | -2 | None |
| Review flagged and removed | -15 | None |

### Privilege Thresholds

| Points | Level | Unlocks |
|--------|-------|---------|
| 0 | Newcomer | Browse, purchase, create 1 collection |
| 15 | Member | Post discussions, write reviews, create showcases |
| 50 | Contributor | Upvote/downvote, unlimited collections, follow feed |
| 150 | Trusted | Flag content, suggest tags |
| 300 | Expert | Nominate certified devs, curate official collections |
| 500 | Authority | Community moderator tools |

First contribution (Member level) achievable in first session with 3 reviews.

### Anti-Gaming
- Daily caps prevent point farming
- -15 penalty for removed reviews deters spam
- Review bombing detection: 3+ reviews on same product within 1 hour from accounts <7 days old → auto-flag

---

## 5. Discussion Architecture

Q&A format with one level of threading. No deep nesting.

### Thread Types
- Q&A (best-answer markable)
- Bug Report
- Showcase ("How I use this")
- Feature Request
- Changelog (creator-only)
- Announcement (creator + admins, pinnable)

### Ghost Town Prevention
1. Don't show Discussions tab until product has 10+ downloads
2. Seed discussions on popular products
3. Single discussion section with type tags (not separate forums)
4. Notify creator on new discussions (opt-out)
5. "Unanswered" badge on products with 48h+ unreplied threads

---

## 6. Collections & Curation

Any user can create public collections. Certified devs create "Official" collections. Admins create "Platform" collections.

- Products can be in unlimited collections (many-to-many)
- Each collection item has a curator's note
- "Collections containing this product" shown on product detail
- "Trending Collections" on homepage
- Certified dev collections get a badge and rank higher

---

## 7. Fork System

Permission-based forking with creator control.

### Flow
1. Forker clicks "Request to Fork" → fills out what they'll change
2. Creator reviews: approve (free), approve (with revenue share 5-50%), or deny
3. If approved: fork created with mandatory attribution + auto-enforced revenue share
4. Fork chain tracking: cascading revenue shares for deep forks

### Creator Controls
- "Allow fork requests" toggle (default: off)
- Default revenue share %
- "Allow free forks only" option
- Maximum fork depth (optional)

---

## 8. Activity Feed

Chronological + light weighting. No black-box algorithm.

### Feed Items
- New product from followed creator
- New badge on followed/owned product
- Reply to discussion you joined
- Collection update from followed user
- Trending product (1/day max, boosted 24h)

### Notification Rules
- Max 5 push notifications/day
- Sales and payouts: push + email
- Badges on your products: push + email
- Discussion replies: push only
- New followers: weekly digest only

---

## 9. Homepage Redesign

From marketing page → community-first discovery:

1. Simplified hero: "The community platform for AI configurations"
2. Trending This Week (products with most new badges)
3. Recently Badged (live feed showing people + actions)
4. Popular Collections (most followed this month)
5. Active Discussions (most replied threads this week)
6. Top Certified Developers (most badges given this month)
7. New Products (latest approved)
8. CTA: Join the Community

Every section shows people and activity, not just products.

---

## 10. Revenue Model

| Stream | Model | When |
|--------|-------|------|
| Platform commission | 15% on paid sales | Day 1 |
| Certified reviewer cut | 2-3% from platform's 15% | Day 1 |
| Sponsored placements | CPM-based auction | After 5K monthly visitors |
| Featured listing fee | $15 one-time | After 50+ products |
| Pro subscription | $12/mo power features | After 1K+ users |

**Free forever:** browsing, discussions, collections, following, free product downloads, free product listings (unlimited).

### Fork Revenue
Fork sales: platform takes 15%, original creator gets their set %, fork creator gets remainder of 85%.

---

## 11. Moderation

### Automated (Day 1)
- 3+ reports → auto-hide content
- Rate limiting on new accounts
- Duplicate detection on product upload
- Description quality gates

### Community (500+ reputation)
- Close discussions, merge tags, priority flags, edit titles
- Cannot delete content, ban users, or moderate products

### Certified Dev Powers
- Revoke own badges, close discussions on badged products, feature showcases

### Target Ratio
1 human moderator per 1,000-2,000 active users.

---

## 12. Community Health Targets

| Metric | Target |
|--------|--------|
| DAU/MAU | 15-20% |
| Creator ratio | 5-10% |
| Contributor ratio | 20-25% |
| First contribution in first session | >30% |
| Discussion reply rate | >60% |
| Badge coverage (100+ download products) | >40% |
| 90-day retention | 25-40% |

---

## 13. Database Extension

26 new tables organized in 5 migration batches:

1. **Social Foundation:** follows, collections, collection_items, creator_profiles
2. **Discussions:** discussions, discussion_replies, discussion_votes
3. **Certification & Badges:** certification_paths, developer_certifications, certification_history, peer_nominations, product_badges
4. **Reputation & Feed:** reputation_events, reputation_scores, reputation_thresholds, activity_events, user_feed_cache
5. **Showcases, Tags, Forks:** showcases, showcase_media, showcase_votes, tags, product_tags, tag_synonyms, fork_requests, product_forks, fork_revenue_shares

Full schema with columns, constraints, indexes, and triggers documented in the database design appendix.

---

## 14. Implementation Priority

### Phase 1: Community Foundation (Weeks 1-3)
Creator profiles, follow system, discussion threads, open taxonomy, homepage redesign.
**Why first:** Gives people a reason to come back.

### Phase 2: Trust Layer (Weeks 4-6)
Certified dev system (manual), product badges, reputation tracking, badge display.
**Why second:** Trust drives purchases.

### Phase 3: Curation & Content (Weeks 7-9)
Collections, showcases, activity feed, reputation privileges.
**Why third:** Creates daily-visit habit.

### Phase 4: Collaboration (Weeks 10-12)
Fork system, peer nomination, reputation-earned certification.
**Why last:** Requires healthy ecosystem first.

---

## 15. What This Changes About the Existing Codebase

### Pages to Redesign
- **Landing page:** Marketing → community-first discovery
- **Marketplace:** Add badge filters, discussion previews, collection context
- **Product detail:** Add discussions tab, badge display, fork request, showcases tab
- **Navigation:** Add Feed, Collections, Certified Devs sections

### Pages to Add
- `/profile/[username]` — Creator profile with follow, products, badges, activity
- `/feed` — Personalized activity feed
- `/collections` — Browse and create collections
- `/collections/[slug]` — Collection detail
- `/certified` — Certified developers directory
- `/product/[slug]/discussions` — Discussion threads (could be tab on existing page)

### Existing Pages Unchanged
- Auth, settings, legal, pricing, contact, help, support — all stay as-is
- Seller upload, seller dashboard, admin — extended but not redesigned
- Cart, checkout flow — unchanged
