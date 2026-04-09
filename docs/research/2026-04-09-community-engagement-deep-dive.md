# RuleSell Community Engagement Deep Dive

**Date:** 2026-04-09
**Author:** Research agent (Opus)
**Status:** Final
**Purpose:** Define the community layer that turns RuleSell from a vending machine into a place people return to daily.

---

## 1. Executive Summary

RuleSell has a strong transactional surface: browse, install, leave. The user explicitly said: "We don't want to actually oneshot user workflow, we want to maintain users existing there." This document lays out the community architecture that achieves that.

**The core thesis:** Developer marketplaces that succeed long-term are not better stores — they are better communities that happen to sell things. The store is the excuse to visit; the community is the reason to stay.

**What RuleSell needs (in priority order):**

1. **Per-item discussion threads** — the single highest-impact community feature. Every ruleset, MCP server, skill, and workflow gets a Discussions tab with threaded Q&A, tips, and bug reports. This is the HuggingFace model, not the npm model (npm has no per-package discussion and it shows).

2. **Structured reviews (separate from discussions)** — certified-dev-only reviews remain as the trust signal. Discussions are the open channel. Reviews are the quality signal. Two tabs, two purposes.

3. **Activity feed with social graph** — following creators and categories drives return visits. The feed shows: new items from followed creators, updates to installed items, replies to your comments, trending items in your categories.

4. **Showcases ("Built with...")** — users post what they built using marketplace items. This creates content, social proof, and engagement simultaneously. It is the single best content generation mechanic for a developer marketplace.

5. **Changelogs and update notifications** — when an item you installed gets updated, you get notified. This is a return trigger that costs nothing to implement and delivers high engagement.

6. **Weekly digest** — curated email/in-app digest of new items, trending discussions, and showcase highlights. Weekly cadence, not daily.

7. **Challenge/contest system** — monthly themed challenges ("Best React rules pack", "Most creative MCP server") that create engagement bursts and surface new creators.

8. **Embedded community, supplemented by Discord** — the community lives inside RuleSell (not on Discord). Discord is the supplementary real-time channel. The platform owns the content graph.

---

## 2. Platform-by-Platform Community Audit

### Tier 1: Deep Analysis

#### Stack Overflow — The Gold Standard for Developer Q&A

**What they built:**
- Reputation system with progressive privilege unlocking (15 rep to upvote, 125 to downvote, 2000 to edit, 10K to access mod tools, 20K to delete)
- 200-point daily rep cap from upvotes (prevents runaway gaming, keeps people coming back tomorrow)
- Three badge tiers: Bronze (basic usage), Silver (sustained contribution), Gold (exceptional impact)
- Bounty system for unanswered questions (spend your own rep to attract answers)
- Community moderation at scale via privilege escalation
- In 2026: custom badges for Challenges, free votes to lower the barrier for new users, public chat rooms

**Why people come back daily:**
- The notification loop: someone edits your answer, comments on your post, or upvotes you. Each is a micro-dopamine hit tied to professional identity.
- Progressive privilege unlocking gives intermediate users something to work toward.
- The reputation number itself becomes a professional signal (it shows up on resumes and LinkedIn).
- Badges reward specific behaviors: "Fanatic" badge for visiting 100 consecutive days, "Electorate" for voting on 600 posts, "Steward" for reviewing 1000 review tasks.
- Research confirms: "developers are mainly motivated by intrinsic motivation" — the reputation system amplifies intrinsic motivation rather than replacing it with extrinsic rewards.

**What RuleSell should take:**
- Progressive privilege unlocking (not just titles — actual capabilities that unlock)
- Daily rep cap (prevents the "already won" problem)
- Behavior-specific badges that reward platform-beneficial actions
- The bounty concept (adapted: "Bounty" on unanswered discussion threads to attract expert responses)

#### GitHub Discussions — Project-Level Community

**What they built:**
- Discussions tab on every repository (opt-in by repo owner)
- Categories: Announcements, General, Ideas, Polls, Q&A, Show and Tell
- Q&A category has "mark as answer" (mimics Stack Overflow within a project context)
- Threaded replies with reactions (thumbs up, heart, rocket, eyes, etc.)
- Pinned discussions for important announcements
- Notifications: subscribe/unsubscribe per thread, @mentions, email digests
- Polls category for gauging community interest
- Moderation: lock threads, transfer discussions, convert issues to discussions

**Why it works:**
- Context-specific: the discussion is about THIS project, not a general topic. Signal-to-noise ratio is high.
- Low barrier: anyone with a GitHub account can participate.
- Threaded but shallow: replies go one level deep (not infinitely nested like Reddit), keeping conversations readable.
- Reactions reduce comment noise ("I agree" becomes a thumbs-up instead of a reply).

**What RuleSell should take:**
- The per-item Discussion tab model (every ruleset gets its own discussion space)
- Category system adapted: Q&A, Tips & Tricks, Bug Reports, Feature Requests, Showcase
- "Mark as answer" for Q&A threads
- Reactions to reduce low-value comments
- Shallow threading (one level of replies, not infinite nesting)

#### Discord Developer Tool Communities

**What drives engagement in Cursor/Claude/n8n Discords:**
- Real-time help: someone is stuck right now and gets an answer in minutes
- Channel structure by topic: #general, #help, #showcase, #feedback, #announcements, #off-topic
- The social presence of seeing other people online and active
- Direct access to tool creators (Cursor team members in the Discord answering questions)
- Voice channels for ad-hoc pairing and discussion
- Bot integrations (search, moderation, auto-tagging)

**Why people hang out in Discord instead of the tool's own site:**
- The tool's site has no social layer at all (npm, VS Code Marketplace, most registries)
- Discord is where the person already is (context switching cost is low)
- Real-time interaction creates stronger social bonds than async forums
- Channel organization makes it easy to find relevant conversations

**Key insight for RuleSell:**
Discord fills the gap that marketplaces leave empty. If RuleSell builds its own community layer, users will not need to go to Discord for the async use cases (Q&A, showcase, reviews). Discord should supplement with real-time chat, not replace the structured community.

#### dev.to / Hashnode — Content + Community Hybrid

**dev.to mechanics:**
- Tag-based feed where content surfaces by topic, not just by who you follow
- Three reaction types (heart, unicorn, bookmark) — each weighted differently for trending
- Comments with threading
- "Series" feature for multi-part posts
- Weekly trending lists create a discovery cadence
- Liquid tags for embedding rich content (GitHub repos, CodePen, etc.)
- Community moderators per tag

**Hashnode mechanics:**
- Custom domain per blog (ownership model)
- Network-wide feed for discovery (even your custom-domain post appears in the network)
- Newsletter integration built-in
- Hashnode data: "Technical posts with code snippets and diagrams achieved 2x higher engagement"

**What RuleSell should take:**
- The concept of tag-based trending (categories serve as tags)
- Multiple reaction types beyond just thumbs-up (useful, creative, well-documented, needs-update)
- Weekly trending as a discovery mechanism built into the feed and digest
- Code snippet embedding in discussions and showcases

#### HuggingFace — Community on Every Artifact

**What they built:**
- Every model, dataset, and Space has a "Community" tab with Discussions
- Discussions support: questions, feature requests, bug reports
- Pull Requests on model repos (like GitHub PRs but for model files)
- Organizations with team pages
- Trending feed showing what is gaining traction across the platform
- Spaces: interactive demos that people can try without installing anything

**Critical data point:** 84% of models, 91% of datasets, and 96% of Spaces have 0 discussions. Engagement is extremely concentrated. The top 1% of items drive nearly all community activity.

**What this means for RuleSell:**
- Per-item discussions will follow a power law. Most items will have 0 discussions. That is normal and expected.
- The strategy is not to get discussions on every item, but to ensure that HIGH-VALUE items (popular rulesets, frequently-installed MCPs) have active discussions.
- Seed the top 20 items with starter discussions: "How are you using this?", "Tips for getting the most out of this", "Common issues and solutions."
- Trending surfaces the active items, which is more important than universal participation.

#### Product Hunt — The Daily Launch Cycle

**What they built:**
- Daily launch cadence: submit a product, community upvotes, top products win the day
- Comments are threaded and time-bounded (most activity on launch day + 7 days)
- Maker Q&A: the product creator answers questions directly in comments
- The "Hunter" role: someone who submits products they find interesting (curator)
- Collections: curated lists of products around a theme
- Product pages persist after launch day with ongoing reviews

**Engagement loop:**
Post product -> community comments -> maker responds -> algorithm boosts engaged products -> more visibility -> more comments. The maker's responsiveness is both socially expected and algorithmically rewarded.

**What RuleSell should take:**
- The concept of "New This Week" as a discovery moment (not daily — our volume is too low)
- Maker Q&A expectation: when someone asks a question on your item, responding should be visible and rewarded
- Collections as a curated discovery layer (already in spec, needs community curation)
- The hunter/curator role: users who curate great collections get reputation

### Tier 2: Community Layer Analysis

#### npm — The Anti-Example

npm has NO per-package comments, no discussion, no community features on package pages. The only signal is download count. When users need to discuss an npm package, they go to: the package's GitHub Issues, Stack Overflow, Reddit, or Discord. npm recognized this as a gap — they created a GitHub Discussions board for npm feedback — but never built per-package community features.

**Lesson:** When the marketplace has no social layer, community forms OUTSIDE the marketplace. The marketplace loses control of the narrative, and there is no return loop.

#### VS Code Marketplace

Has ratings (1-5 stars), written reviews, and a Q&A section. The Q&A section is notable: users post questions, the publisher can respond. Publisher responsiveness is visible ("usually responds within X days"). But engagement is minimal — most extensions have fewer than 10 reviews. The Q&A is rarely used compared to GitHub Issues on the extension's repo.

**Lesson:** Reviews + Q&A is the minimum viable community feature set. But it is not enough to create stickiness. The social layer is too thin.

#### Figma Community

Figma Community is the closest model to what RuleSell should build. Features:
- **Likes:** heart button on every published file, plugin, and widget
- **Comments:** threaded, @mentions, notifications on replies
- **Remixes:** anyone can duplicate a Community file and remix it (fork with attribution via CC4)
- **Creator profiles:** public page showing all published files, plugins, follower count, total likes
- **Follows:** follow creators to see their new publications
- **Organization pages:** teams share their design systems publicly

The remix mechanic is powerful: it creates derivative content that links back to the original, building a web of attribution and discovery. This is directly analogous to RuleSell's fork system.

**What RuleSell should take:**
- The remix/fork visibility: when someone forks your ruleset, it shows up on your item page ("12 forks") and on the forker's profile
- Creator profiles as social surfaces (already in spec — needs the social metrics: followers, total installs, items published, reviews written)
- Organization/team pages with shared publishing

#### WordPress.org Plugin Support Forums

Every plugin in the WordPress directory has its own support forum. Users create topics, community members and the plugin developer respond. Key features:
- Threaded by topic (not flat)
- "Resolved" marking on support threads
- Developer responsiveness is tracked and visible
- Volunteer-powered (no obligation to respond, but social pressure exists)

**Lesson:** Per-item support forums are a proven model that works at scale (60K+ plugins). The "Resolved" flag is important — it signals that help is available, which encourages new users to ask questions.

#### Unity Asset Store / Unreal Marketplace

Both have reviews and ratings on paid assets. Unity has a more developed review system with verified purchase indicators. Community discussion happens primarily on external forums (Unity Forums, Unreal Forums) rather than on the marketplace page itself.

**Lesson:** For paid assets, verified-purchase reviews are essential. Free-form discussion can live separately, but the review must be on the product page.

#### Hacker News — Proof That Community Trumps UI

HN has deliberately minimal UI. No avatars, no reactions beyond upvotes, no rich text, no images. Yet it has one of the most engaged technical communities online. Why:
- **Selective audience:** the minimal UI acts as a natural filter for technically-minded users
- **Content quality enforcement:** heavy moderation, dupe detection, flagging system
- **Karma system:** simple but effective (earn karma from upvotes on your posts/comments)
- **No algorithmic feed manipulation:** chronological + votes = transparent ranking

**Lesson:** Community stickiness comes from content quality and peer quality, not feature richness. RuleSell should optimize for high-quality contributors over feature count.

#### Reddit (r/ClaudeAI, r/cursor, r/ClaudeCode)

These subreddits serve functions the tools themselves do not provide:
- **Best practices library:** techniques, workflows, prompt patterns that tool docs do not cover
- **Comparison and decision-making:** "Should I use X or Y?" discussions
- **Troubleshooting:** real-world issues that official support does not address fast enough
- **Social validation:** "Look what I built" posts that get upvotes and comments
- r/ClaudeCode has 4,200+ weekly contributors — substantial organic community

**Lesson:** If RuleSell does not build showcases, best-practices discussions, and comparison content, users will build it on Reddit instead. RuleSell should be the canonical home for "how to use this ruleset effectively."

---

## 3. Engagement Loop Mechanics

### The Core Loop

Every successful community platform has a variant of this loop:

```
CREATE content -> GET feedback -> RECEIVE notification -> RETURN to respond -> CREATE more content
```

For RuleSell specifically:

```
PUBLISH ruleset -> USER asks question in Discussion -> CREATOR gets notified ->
CREATOR responds -> USER gets notified -> USER returns to see answer ->
USER writes a showcase -> SHOWCASE gets reactions -> USER gets notified...
```

Each notification is a return trigger. Each return creates an opportunity for further engagement. The loop is self-reinforcing.

### The Contribution Ladder

Based on research across Stack Overflow, dev.to, GitHub, and community management literature:

| Level | Behavior | % of Users | RuleSell Equivalent |
|-------|----------|------------|---------------------|
| Lurker | Browses, installs, never interacts | 65-90% | Visitor/User who installs and leaves |
| Reader | Reads discussions, reviews, showcases | 10-20% | User who reads item discussions |
| Reactor | Upvotes, likes, bookmarks | 5-10% | User who reacts to discussions/reviews |
| Commenter | Replies to discussions, asks questions | 3-5% | User who participates in item discussions |
| Contributor | Writes reviews, creates showcases | 1-3% | Certified Dev writing reviews, users posting showcases |
| Creator | Publishes items, maintains them | 0.5-1% | Builder/Seller publishing rulesets |
| Leader | Curates collections, moderates, mentors | 0.1-0.5% | Trusted/Expert/Authority reputation users |

The platform's job is to make each step up the ladder as frictionless as possible:
- Lurker -> Reader: surface discussions on item pages (they are already there)
- Reader -> Reactor: one-click reactions, no friction
- Reactor -> Commenter: reply button directly under content, pre-filled context
- Commenter -> Contributor: "Write a review" CTA after 7 days of using an item, "Share what you built" CTA
- Contributor -> Creator: "Have your own rules? Publish them" CTA in the dashboard
- Creator -> Leader: reputation unlocks (curate collections at 150 rep, moderate at 300 rep)

### Reputation Systems That Work

**What makes reputation meaningful (not noise):**

1. **Earnable through platform-valuable actions** — Stack Overflow awards rep for answering questions (platform value: content), not for logging in (no value). RuleSell should award rep for: writing reviews (+5), helpful answers in discussions (+3), best answer (+10), published item gets 100 installs (+15), curated collection gets 10 followers (+8).

2. **Daily cap prevents runaway dominance** — Stack Overflow's 200/day cap is brilliant. It means even the most active user needs months to reach high levels. RuleSell should cap at 50 rep/day from community actions (excluding passive gains from install milestones).

3. **Privileges unlock at thresholds** — not just titles. At 15 rep: upvote. At 50: comment on any item (not just your own). At 150: create collections. At 300: moderate discussions (flag/close). At 500: access to beta features and certified dev nomination path.

4. **Visible but not dominant** — show rep on profiles and next to names in discussions. Do not show it on item cards (the item's quality score matters there, not the creator's rep).

### Notification Design

**High-value notifications (bring people back):**
- "Someone replied to your comment on [Ruleset Name]" — direct engagement, personal
- "Your ruleset [Name] reached 100 installs" — milestone celebration
- "A new version of [Installed Ruleset] is available" — actionable return trigger
- "[Creator You Follow] published a new ruleset" — discovery through social graph
- "Your review was marked as 'helpful' by 5 people" — validation of contribution
- "New discussion on [Ruleset You Maintain]" — creator responsibility trigger

**Low-value notifications (create fatigue, use sparingly):**
- "Trending this week: ..." — weekly digest only, not per-item
- "[Random User] followed you" — batch these, send weekly
- "New item in [Category]" — only in weekly digest

**Cadence recommendation:** Real-time for direct interactions (replies, mentions). Daily batch for milestones and follows. Weekly digest for trends and discovery.

### The Social Graph

RuleSell should support three follow relationships:
1. **Follow Creator** — see their new publications and updates in your feed
2. **Follow Category** — see new items and trending discussions in that category
3. **Watch Item** — get notified of updates, new discussions, and new reviews on a specific item

The social graph changes engagement fundamentally: instead of visiting the marketplace when you need something (transactional), you visit to see what is new from people and topics you care about (habitual).

---

## 4. The Right Comment/Discussion Model for RuleSell

### Analysis of Existing Models

| Model | Example | Pros | Cons |
|-------|---------|------|------|
| **(a) Reviews only** | Amazon, VS Code Marketplace | Clean, structured, high signal | No place for questions, tips, bug reports |
| **(b) Reviews + free-form discussion** | HuggingFace | Separates quality signal from conversation | Two surfaces to monitor |
| **(c) Full threaded discussion** | GitHub Discussions, Reddit | Rich conversation | Can drown out quality signal |
| **(d) Comments on marketplace content only** | Blog comments | Separates item from discussion | Loses per-item context |
| **(e) Reviews + Discussion as separate tabs** | WordPress.org plugins | Clear separation of purpose | Requires two engagement surfaces |

### Recommendation: Model (e) — Reviews Tab + Discussion Tab

**Reviews Tab:**
- Structured: 1-5 star rating + written review
- Gated: only Certified Devs and verified-install users can write reviews (already in spec)
- Sorted by: helpfulness votes, then recency
- Filterable by: rating, environment, date
- Response capability: item creator can respond to reviews (like App Store developer responses)

**Discussion Tab:**
- Free-form: anyone with an account can post (minimum 15 rep to start a thread, 0 rep to reply)
- Categories per item: Q&A, Tips & Tricks, Bug Reports, Feature Requests, Showcase
- Threading: one level deep (reply to a post, not reply to a reply — keeps it readable)
- "Mark as answer" in Q&A category (like GitHub Discussions)
- "Resolved" flag on Bug Reports
- Reactions: thumbs up, helpful, creative, needs-update (reduce "me too" comments)
- Creator pinning: item maintainer can pin important threads

**Why two tabs:**
- Reviews are the trust signal that affects purchase/install decisions. They must be high-quality, verified, and structured.
- Discussions are the engagement layer that brings people back. They must be low-friction, open, and conversational.
- Mixing them degrades both: reviews become diluted with off-topic comments, and discussions lose the structured rating data.

**UI placement:**
On the item detail page (`/r/[slug]`), add tabs: Overview | Variants | Reviews | Discussions | Changelog
- Reviews tab shows structured reviews with aggregate rating
- Discussions tab shows threaded posts organized by category
- Changelog tab shows version history with update notes

---

## 5. Community Feature Prioritization

### Phase 1: Foundation (build first, before launch or immediately at launch)

**1. Per-item Discussion Threads**
- Discussions tab on every item detail page
- Categories: Q&A, Tips & Tricks, Bug Reports
- Threading: one level deep
- Reactions: thumbs up, helpful, needs-update
- Mark as answer in Q&A
- Creator notifications on new threads
- **Why first:** This is the single feature that creates the engagement loop. Without it, users install and leave.

**2. Activity Feed**
- Route: `/feed` (already exists in scaffold)
- Content: new items from followed creators, replies to your comments, updates to watched items, trending items in followed categories
- Chronological with "trending" sort option
- **Why first:** The feed is the homepage for returning users. It turns RuleSell from a search engine into a social platform.

**3. Follow System**
- Follow creators (already in spec)
- Follow categories
- Watch items (get notified of updates)
- **Why first:** Without follows, there is no social graph, and the activity feed has nothing to show.

**4. Notification System**
- In-app notification bell with unread count
- Email notifications (opt-in, batched by default)
- Types: reply to your comment, new discussion on your item, milestone (100 installs), item update
- **Why first:** Notifications are the return trigger. Without them, users have no reason to come back.

### Phase 2: Engagement (build within first 1-2 months)

**5. Showcases ("Built with...")**
- Route: `/showcases` (gallery) and per-item showcase section
- User posts: title, description, screenshot/link, which marketplace items they used
- Items used are tagged and linked back to the item page
- Reactions: impressive, creative, helpful
- **Why second phase:** Requires existing community to populate. Seed with team-created showcases.

**6. Changelogs and Update Notifications**
- Changelog tab on item detail page
- Version history with date and change notes
- Notification to watchers when a new version is published
- **Why second phase:** Requires publishers to adopt the changelog habit. Provide easy tooling (auto-generate from git commits if source is linked).

**7. Enhanced Reputation System**
- Points for: reviews, helpful answers, best answers, showcase posts, install milestones
- Levels: Newcomer (0) -> Member (15) -> Contributor (50) -> Trusted (150) -> Expert (300) -> Authority (500)
- Privilege unlocking at each level
- Daily cap of 50 rep
- **Why second phase:** Reputation without activity to earn it feels empty. Build after Phase 1 creates engagement.

**8. Weekly Digest**
- Email: new items this week, trending discussions, top showcases, creator spotlight
- In-app: "What's New This Week" section on homepage
- Cadence: weekly, with user preference for frequency
- **Why second phase:** Need content to curate before sending digests.

### Phase 3: Growth (build at months 3-6)

**9. Challenge/Contest System**
- Monthly themed challenges: "Best React rules pack", "Most innovative MCP server"
- Submission period (2 weeks), voting period (1 week), winners announced
- Rewards: featured placement, badge, reputation bonus
- **Why third phase:** Requires established community to participate. Premature challenges feel empty.

**10. Creator AMAs / "Ask the Maintainer"**
- Scheduled Q&A sessions with prominent creators
- Time-limited discussion thread with creator committed to respond
- Archived for future reference
- **Why third phase:** Requires known creators with audiences to ask questions.

**11. Learning Content Hub**
- Route: `/learn`
- Tutorials: "How to write effective cursor rules", "MCP server best practices", "Building quality N8N workflows"
- Community-contributed (reputation reward for accepted tutorials)
- **Why third phase:** Content creation is expensive. Start with a few high-quality pieces, expand based on what discussions reveal people need.

**12. Collection Curation Community**
- Allow users at Trusted level (150 rep) to create and maintain public collections
- Collections that gain followers earn reputation for the curator
- Featured collections on homepage
- **Why third phase:** Requires trusted users with enough platform knowledge to curate well.

---

## 6. The Empty Room Bootstrapping Plan

The biggest threat to RuleSell's community features is launching them into silence. An empty discussion tab is worse than no discussion tab — it signals "nobody uses this."

### Pre-Launch Seeding (before community features go live)

**Step 1: Seed the top 20 items with starter discussions (team-created)**
- For each of the top 20 rulesets/MCPs/workflows:
  - 1 "How to get the most out of [Item Name]" post with real tips
  - 1 "Common issues and solutions" post documenting known gotchas
  - 1 "What are you using this for?" post inviting use cases
- These should be written by team members under real accounts (not bot accounts). Authenticity matters.

**Step 2: Create 5 seed showcases**
- Team members build real things using marketplace items and document them
- Each showcase should tag 2-3 items from the marketplace
- Screenshots, descriptions, and links to working projects

**Step 3: Write 3 high-quality tutorials for the learning hub**
- "How to write cursor rules that actually work"
- "Setting up your first MCP server: a practical guide"
- "Building N8N workflows: from template to production"

**Step 4: Pre-populate collections**
- 8 curated collections already exist in the mock data. Ensure they have descriptions, are tagged, and appear on the homepage.

### Launch Week (first 7 days)

**Step 5: Invite 10-20 developer friends to participate**
- Not just to sign up — to actively post in discussions, write a showcase, leave a review
- Give them specific asks: "Post a question on the Awesome CursorRules discussion", "Write a showcase about how you use the Playwright MCP"
- These first 10-20 active users set the community culture

**Step 6: The founder should be visibly active**
- Respond to every discussion post within 24 hours
- Welcome every new contributor personally
- Share interesting discussions on social media (Twitter/X, Reddit)

**Step 7: Cross-post to existing communities**
- Share the best showcases on r/ClaudeAI, r/cursor, r/n8n
- Link back to the RuleSell discussion, not to the Reddit post
- Goal: drive traffic from existing communities to RuleSell's community

### First Month Targets

| Metric | Target | Why |
|--------|--------|-----|
| Discussion threads created | 50+ | At least 2-3 per top item |
| Unique discussion participants | 30+ | The minimum for a community to feel alive |
| Showcases posted | 10+ | Social proof that people are building with these items |
| Reviews written | 20+ | Trust signal on the most popular items |
| Newsletter subscribers | 100+ | Audience for the weekly digest |

### The "Minimum Viable Community" Threshold

Research consensus: a community needs 40-50 weekly active contributors to feel alive (not total members — active contributors). Below this, new visitors see silence and leave. Above this, the community becomes self-sustaining as new visitors see activity and are motivated to participate.

RuleSell should not launch major community features (challenges, AMAs, learning hub) until it reaches 50 weekly active contributors. Focus Phase 1 features on getting to that number.

Expected timeline to reach 50 WAC: 2-4 months with active seeding and cross-promotion. 6-12 months without.

---

## 7. Retention Benchmarks and Targets

### Industry Benchmarks

**DAU/MAU ratio (stickiness):**
- Social media: 50%+ (Facebook-tier)
- SaaS tools: 20-30% (good), 40%+ (excellent)
- B2B SaaS: 10-20% (typical)
- Developer communities: 15-25% (Stack Overflow-tier)
- Developer marketplaces without community: 5-10% (transactional)
- Developer marketplaces with community: 15-20% (target for RuleSell)

**Participation rates (Nielsen's 90-9-1 rule, updated):**
- Original rule: 90% lurkers, 9% contributors, 1% heavy contributors
- Updated research (2025): healthiest communities achieve 65-30-5 monthly (65% lurk, 30% contribute occasionally, 5% heavy contributors)
- Wikipedia: 99.8% lurkers (extreme end)
- Blogs: 95% lurkers (skewed end)
- Active forums: 70-80% lurkers (healthier end)

**RuleSell targets:**
- Year 1: 80-15-5 distribution (80% lurk, 15% react/comment occasionally, 5% create content)
- Year 2: 70-25-5 distribution (shift lurkers to reactors)

**Lurker-to-contributor conversion:**
- The single most effective tactic: reduce friction on the first contribution. Make it one click to react, two clicks to comment, three clicks to post.
- Target: 5% of registered users make at least one community contribution (comment, reaction, review, showcase) within 30 days of registration.

**30-day retention predictors (from community research):**
- Users who receive a reply to their first comment within 24 hours: 3x more likely to return in 30 days
- Users who follow at least 2 creators: 2.5x more likely to return in 30 days
- Users who install 3+ items: 2x more likely to return in 30 days
- Users who post a showcase: 4x more likely to become monthly active

**Weekly Active Contributors (WAC) — the north star metric:**
- Not total members, not total installs — weekly active contributors
- Healthy community: 25-40% of contributors return within 90 days
- RuleSell target: 40 WAC by month 2, 100 WAC by month 6, 300 WAC by month 12

---

## 8. Concrete Feature List with UI Placement

### Item Detail Page (`/r/[slug]`)

**Tabs (updated):**
```
Overview | Variants | Reviews | Discussions | Changelog
```

**Reviews Tab:**
- Aggregate rating (stars + count) at top
- Filter: by rating, by environment, by date
- Each review: user avatar + name + rep level + rating + text + date + helpfulness votes
- Creator response below review (if any)
- "Write a Review" button (gated to Certified Dev / verified install)

**Discussions Tab:**
- Category filter: All | Q&A | Tips & Tricks | Bug Reports | Feature Requests | Showcase
- Sort: Recent | Most Reactions | Unanswered
- Each thread: title + category tag + author + date + reply count + reaction count
- Thread detail: original post + replies (one level deep) + reactions + "Mark as Answer" (Q&A only)
- "Start a Discussion" button (gated to 15+ rep)
- Creator can pin threads

**Changelog Tab:**
- Version history in reverse chronological order
- Each entry: version number + date + change description (markdown)
- "Watch for updates" button

### Activity Feed (`/feed`)

**Content types in feed:**
- New item published by followed creator
- New discussion on watched item
- Reply to your comment
- Item you installed was updated
- Trending item in followed category
- Showcase featuring an item you use

**UI:**
- Left column: feed items (cards with type icon + content summary + timestamp)
- Right sidebar: "Trending This Week" mini-list, "Your Stats" (rep, items installed, reviews written)
- Filter tabs: All | Following | Updates | Discussions

### Showcases (`/showcases`)

**Gallery view:**
- Card grid: screenshot thumbnail + title + author + items used (tags) + reaction count
- Sort: Recent | Most Reactions | Most Items Used
- Filter: by category of items used

**Showcase detail page:**
- Title, description (markdown, supports code blocks and images)
- "Built with" section: linked marketplace items
- Reactions: impressive, creative, helpful, inspiring
- Comments (flat, not threaded — showcases are about appreciation, not debate)

**Submit showcase:**
- Title, description, screenshot upload, select items from marketplace (autocomplete)
- Auto-tags the selected items, which then show "X showcases" count on their detail pages

### Creator Profile (`/u/[username]`)

**Updated sections:**
- Published Items (existing)
- Reviews Written (existing)
- **NEW: Showcases** — showcases this user created
- **NEW: Discussions** — recent discussion posts by this user
- **NEW: Collections** — collections curated by this user
- **Social stats:** Followers | Following | Total Installs (across all items) | Reputation Level

### Homepage (`/`)

**Community integration on existing homepage:**
- "Trending Discussions" section: 3-5 active discussion threads from popular items
- "Recent Showcases" section: 3 latest showcases with thumbnails
- "New This Week" section: items published in the last 7 days
- "Community Spotlight": featured creator or collection (rotated weekly)

### Dashboard (`/dashboard`)

**New community sections:**
- Notifications panel (bell icon in header, dropdown with recent notifications)
- "Your Discussions" — threads you started and threads you are watching
- "Your Showcases" — showcases you created
- Reputation progress bar (current level + points to next level)

### Navigation Updates

**Header additions:**
- Notification bell icon with unread badge (right side, next to user avatar)
- Add "Community" or "Explore" nav item linking to `/feed`

**Footer additions:**
- "Showcases" link
- "Discussions" link (to a global discussions view: `/discussions`)

### Global Discussions View (`/discussions`)

**Purpose:** Browse all discussions across all items (for users who want to help answer questions or discover active conversations)

**UI:**
- Filter: by category (Q&A, Tips, Bugs, etc.), by item category, by status (unanswered, resolved)
- Sort: Recent | Most Active | Unanswered
- Each row: item name + thread title + category tag + author + reply count + last activity

---

## Sources

### Platform Documentation and Analysis
- [Stack Overflow Reputation and Voting](https://internal.stackoverflow.help/en/articles/8775594-reputation-and-voting)
- [Stack Overflow Badges Explained](https://stackoverflow.blog/2021/04/12/stack-overflow-badges-explained/)
- [Stack Overflow Community Roadmap, July 2025](https://stackoverflow.blog/2025/07/21/community-products-roadmap-update-july-2025/)
- [GitHub Discussions Complete Guide](https://resources.github.com/devops/process/planning/discussions/)
- [HuggingFace Pull Requests and Discussions](https://huggingface.co/blog/community-update)
- [HuggingFace State of Open Source Spring 2026](https://huggingface.co/blog/huggingface/state-of-os-hf-spring-2026)
- [HuggingFace Hub Ecosystem Overview](https://huggingface.co/blog/evijit/hf-hub-ecosystem-overview)
- [Figma Community Guide](https://help.figma.com/hc/en-us/articles/360038510693-Guide-to-the-Figma-Community)
- [Figma Community Comments](https://help.figma.com/hc/en-us/articles/1500002628062-Comments-on-Community)
- [Figma Community Follows and Likes](https://help.figma.com/hc/en-us/articles/360052033434-Community-follows-and-likes)
- [Introducing Figma Community](https://www.figma.com/blog/introducing-figma-community/)
- [npm Public Feedback Discussions](https://github.com/npm/feedback)
- [VS Code Extension Marketplace Quality](https://www.gocodeo.com/post/navigating-vscodes-marketplace-how-to-vet-and-trust-extension-quality)
- [WordPress.org Support Forums](https://wordpress.org/support/forums/)
- [Product Hunt Launch Guide](https://www.socialplug.io/blog/what-is-product-hunt)

### Community Building and Engagement Research
- [The Gamification — Jeff Atwood / Coding Horror](https://blog.codinghorror.com/the-gamification/)
- [A Dusting of Gamification — Joel Spolsky](https://www.joelonsoftware.com/2018/04/13/gamification/)
- [Participation Inequality: The 90-9-1 Rule — Nielsen Norman Group](https://www.nngroup.com/articles/participation-inequality/)
- [90-9-1 Rule Officially Outdated — Higher Logic](https://www.higherlogic.com/blog/90-9-1-rule-online-community-engagement-data/)
- [Developer Community Building Strategy — Stackmatix](https://www.stackmatix.com/blog/developer-community-building-strategy)
- [Maximizing Developer Champions Engagement — Advocu](https://www.advocu.com/post/maximizing-engagement-and-retention-in-your-developer-champions-program)
- [How to Measure Developer Community Success — Stateshift](https://blog.stateshift.com/how-to-measure-developer-community-success-the-signals-most-teams-miss/)
- [How to Build a Developer-First Marketplace — Heavybit](https://www.heavybit.com/library/article/how-to-build-a-developer-marketplace)
- [How to Build a Developer Community — Octolens](https://octolens.com/blog/how-to-build-a-developer-community-a-step-by-step-guide)
- [Bootstrapping a Marketplace — Elco Ian / Medium](https://medium.com/@elcoian/https-medium-com-painting-the-internet-bootstrapping-marketplaces-with-facebook-dcd8b39c1604)
- [6 Insights from Bootstrapping a Creator Marketplace — Steve Campbell / Medium](https://medium.com/swlh/6-powerful-insights-from-bootstrapping-a-marketplace-platform-for-creators-aef9ef41aec7)

### Metrics and Benchmarks
- [DAU/MAU Ratio Benchmarks — Abacum](https://www.abacum.ai/glossary/dau-ratio)
- [DAU/MAU Ratio for B2B SaaS — Aditya Raj / Medium](https://medium.com/design-bootcamp/benchmark-dau-mau-ratios-for-b2b-saas-products-46a89247c866)
- [How to Calculate DAU/MAU — PostHog](https://posthog.com/tutorials/dau-mau-ratio)
- [Understanding DAU/MAU — Statsig](https://www.statsig.com/perspectives/understanding-daumau-key-metrics-for-product-success)
- [Customer Community ROI — CX Today](https://www.cxtoday.com/community-social-engagement/customer-community-roi/)

### Notification and Retention Tactics
- [Push Notification Best Practices — Appwrite](https://appwrite.io/blog/post/best-push-notification-strategies)
- [Push Notification Best Practices 2026 — Reteno](https://reteno.com/blog/push-notification-best-practices-ultimate-guide-for-2026)
- [Email Cadence Best Practices — MailerLite](https://www.mailerlite.com/blog/email-cadence-and-frequency-best-practices)
- [AnnounceKit — Changelog and In-App Updates](https://announcekit.app/)

### Academic and Research Papers
- [Modeling Badge Gamification on Stack Overflow Users — ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1569190X20300964)
- [Reputation Gaming in Stack Overflow — arXiv](https://arxiv.org/abs/2111.07101)
- [GitHub Discussions: Early Adoption Study — Springer](https://link.springer.com/article/10.1007/s10664-021-10058-6)
- [AI Community on HuggingFace Hub — Springer](https://link.springer.com/article/10.1007/s42001-024-00300-8)
- [Reviews, Trust, and Customer Experience in Online Marketplaces — Frontiers](https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2024.1460321/full)
