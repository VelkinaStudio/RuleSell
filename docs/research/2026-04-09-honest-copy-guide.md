# RuleSell — Honest Copy Guide

**Date:** 2026-04-09
**Status:** Ready for implementation
**For:** Every text surface in RuleSell — hero, how-it-works, empty states, error states, badges, affiliates, about
**Method:** Studied actual copy from Linear, Vercel, Stripe, PostHog, Basecamp/HEY, Cal.com, Resend. Cross-referenced with PostHog's public writing guide and SaaS copywriting research. All copy below is original, written for RuleSell.

---

## Part 1: What the best dev tools actually say (and why it works)

### The pattern

Every trusted dev tool follows the same copy structure, whether they know it or not:

1. **Name what you are in plain language.** Not what you aspire to be. Not a metaphor. What you literally do.
2. **One sentence of context.** Who it's for or why it exists.
3. **Proof, not promises.** Numbers, code snippets, screenshots — something concrete within 3 seconds of reading.

Here's how the best ones do it:

| Tool | Hero headline | Why it works |
|------|--------------|--------------|
| **Linear** | "Purpose-built for planning and building products" | Says what it is (planning tool), says who it's for (product teams), implies quality through "purpose-built" — a word that means "we didn't bolt this on" |
| **Stripe** | "Financial infrastructure for the internet" | Six words. Names the category (financial infrastructure), names the scope (the internet). No adjectives. No promises. |
| **Vercel** | "Build and deploy the best web experiences" | Verb-first. Two actions (build, deploy). "Best" is the only subjective word and it's earned by the product. |
| **PostHog** | "We make dev tools for product engineers" | Names the audience by job title. "We make" — humble, factual. No "revolutionizing" or "reimagining." |
| **Resend** | "Email for developers" | Three words. Category + audience. Everything else is implied. |
| **Cal.com** | "Scheduling infrastructure for everyone" | Stripe's formula, applied to scheduling. "For everyone" signals open-source. |
| **Basecamp** | "The project management tool that actually works" | Opinionated — "actually works" implies competitors don't. Takes a stance. |

### What they never say

- "Revolutionary" / "Reimagine" / "Unlock the power of"
- "Cutting-edge" / "Next-generation" / "AI-powered" (unless AI is literally the product)
- "Seamless" / "Effortless" / "Frictionless" (these words have been emptied of meaning)
- "Your one-stop shop for" / "Everything you need"
- "Trusted by thousands" without showing the thousands

### The rule

**If you can swap your company name for a competitor's and the headline still makes sense, the headline says nothing.** Stripe's line only works for Stripe. PostHog's line only works for PostHog. That's the test.

---

## Part 2: RuleSell copy — every surface

### Homepage hero

**Headline:**
> Find dev tools that actually work. Sell the ones you build.

**Subtitle:**
> RuleSell is a marketplace for AI development assets — rules, MCP servers, skills, agents, workflows. Verified quality. Real creator payouts. Works with Claude Code, Cursor, Windsurf, and 10+ environments.

**Why this works:**
- "Find" and "Sell" — two verbs, two audiences (users and creators), one sentence.
- "that actually work" — takes a stance. Implies the ecosystem has a quality problem (it does — 100% of surveyed MCPs have at least one quality issue). Basecamp energy.
- The subtitle names what we are (marketplace), what's in it (rules, MCP servers, skills...), and the two things nobody else offers (verified quality, real payouts).
- "10+ environments" is a concrete number, not "works everywhere."

**Alternative headline (shorter, punchier):**
> The marketplace for AI dev assets.

**Alternative subtitle:**
> Rules, skills, MCP servers, agents, and workflows — verified, measured, and paid. Browse 500+ items across Claude Code, Cursor, and more.

---

### How it works (3 steps)

**Section header:** How RuleSell works

**Step 1: Browse or search**
> Filter by environment, category, or quality score. Every item shows install count, token efficiency, and last-updated date. No guessing.

**Step 2: Install in one command**
> Copy the install command for your environment. Works with Claude Code, Cursor, Windsurf, VS Code, and more. No accounts required for free items.

**Step 3: Publish and earn**
> Upload your rules, skills, or MCP servers. Set a price or keep it free. Paid items go through quality review. You keep 85% of every sale.

**Why 3 steps, not 4:**
Three is the limit before "how it works" becomes "read the docs." Each step is one sentence of action + one sentence of proof.

---

### Badge explanation page intro

**Page title:** Trust & Verification

**Intro copy:**
> Every item and creator on RuleSell carries visible trust signals. These aren't participation trophies — they're earned through measurable quality, verified identity, and real usage data.
>
> We show you what we measured, not what we think. Install success rates, token efficiency scores, and verified-purchase reviews are calculated from actual data, not self-reported claims.

---

### Affiliate page intro

**Page title:** Share & Earn

**Intro copy:**
> Share any item on RuleSell. When someone buys through your link, you earn a commission. No application. No approval process. No minimum audience.
>
> Creator-enabled affiliate rates range from 5–30%. For items without creator-set rates, you still earn 5% on referred first purchases. Cookie lasts 30 days. Payouts are monthly through Stripe, $50 minimum.

**Why this works:**
- Leads with the action ("Share any item"), not the program description.
- Four "no" statements in a row remove friction before the reader can object.
- Numbers are specific: 5–30%, 5%, 30 days, $50. No "competitive rates" or "generous commissions."

---

### About page intro

**Page title:** About RuleSell

**Intro copy:**
> The AI development ecosystem has a discovery problem. There are 91,000+ skills on skills.sh, 19,000+ MCP servers on mcp.so, and 63,000 community rules on cursor.directory. None of them measure quality. None of them pay creators.
>
> RuleSell exists to fix both problems. We verify every paid item, measure what matters (install success, token efficiency, schema quality), and give creators 85% of every sale.
>
> We are a small team. We ship fast and we're opinionated about quality. If an item doesn't pass our review, it doesn't get listed. If a metric can be measured, we show it. If we don't know something, we say so.

**Why this works:**
- Opens with the problem, stated in specific numbers that prove the claim.
- "None of them" is repeated for rhythm and to sharpen the contrast.
- The third paragraph establishes tone: small, fast, opinionated, honest. This is the Basecamp/PostHog move — personality through directness, not through jokes.

---

### Empty states (5)

**1. Search — no results**
> No items match "{query}."
>
> Try a broader search, check the spelling, or [browse all categories →]

**2. Category — empty**
> No items in {category} yet.
>
> This category is new. Be the first to [publish something →]

**3. Profile — no published items**
> You haven't published anything yet.
>
> [Create your first item →] — free items don't require verification.

**4. Discussions — empty**
> No discussions on this item yet.
>
> Questions, feedback, and bug reports go here. [Start a discussion →]

**5. Reviews — empty**
> No reviews yet.
>
> Reviews require a verified install. Install this item and you can leave the first review.

**Why these work:**
- Each one is exactly 2-3 lines. No padding.
- Each one tells you why it's empty (not just that it's empty).
- Each one gives you exactly one action to take next.
- No hedgehog illustrations. No "Oops!" No "Looks like there's nothing here!" The user knows the page is empty — tell them what to do about it.

---

### Error states (3)

**1. API error (500)**
> Something broke on our end.
>
> We've been notified. Try refreshing the page, or come back in a few minutes. If this keeps happening, [let us know →]

**2. Page not found (404)**
> This page doesn't exist.
>
> The item may have been removed or the URL is wrong. [Go to the marketplace →]

**3. Rate limited (429)**
> You're sending too many requests.
>
> Wait a moment and try again. If you're building an integration, check the [API docs →] for rate limits.

**Why these work:**
- API error: admits fault ("on our end"), tells you it's already tracked ("we've been notified"), gives two actions.
- 404: doesn't pretend it might exist ("doesn't exist" not "couldn't be found"). Names two possible causes.
- Rate limit: explains what happened and why, then redirects power users to the right resource.
- None of them say "Oops!" or "Uh oh!" or use a sad robot illustration. Developers don't need emotional support from a 500 page. They need information.

---

## Part 3: Tone guide

### Voice

RuleSell sounds like a senior engineer writing documentation — clear, specific, occasionally dry, never salesy. We have opinions and we state them plainly. We don't hedge with "might" or "could potentially" when we mean "does" or "doesn't."

We're closer to Linear's precision than PostHog's irreverence. We don't do jokes in product copy. Humor lives in blog posts and changelogs, not on the marketplace.

### Vocabulary

**Words we use:**

| Word | Why |
|------|-----|
| Verified | Means we checked. Specific. |
| Measured | Means we ran a test. Not self-reported. |
| Earn | For creator/affiliate money. Direct. |
| Install | The actual action. Not "get" or "access." |
| Publish | The creator action. Not "submit" or "upload." |
| Browse | The discovery action. Not "explore" or "discover." |
| Items | Generic for any asset type. Not "products" (too commercial) or "resources" (too vague). |
| Quality score | Our differentiator. Always use the full term. |
| Works with | For environment compatibility. Not "supports" or "integrates with." |

**Words we never use:**

| Word | Why not |
|------|---------|
| Revolutionary / Reimagine | Empty. Every startup says this. |
| Seamless / Frictionless | Overused to meaninglessness. If it's actually easy, show the one-line install command instead of saying "seamless." |
| Unlock / Unleash | Marketing theater. We don't lock anything. |
| Cutting-edge / Next-gen | Temporal claims age badly. |
| Empower | Corporate cringe. Say what actually happens. |
| Ecosystem | Only in technical contexts. Never as "join our ecosystem." |
| One-stop shop | We're not a shop. We're a marketplace with specific things in it. |
| Best-in-class | Prove it with a metric or don't say it. |
| Leverage | Use "use." |
| Utilize | Use "use." |
| Solution | Name the actual thing. "MCP server" not "MCP solution." |
| Passionate | Show the work instead. |
| Robust | Meaningless modifier. Say what makes it robust. |

### Sentence structure

1. **Lead with the verb or the noun, not a subordinate clause.** "Install in one command" not "With our streamlined installation process, you can..."
2. **One idea per sentence.** If there's an "and" connecting two different ideas, split it.
3. **Specific beats general.** "85% creator share" beats "competitive revenue split." "30-day cookie" beats "generous tracking window."
4. **Numbers are always digits, never words.** "15%" not "fifteen percent." "500+ items" not "hundreds of items."
5. **Active voice by default.** "We verify every paid item" not "Every paid item is verified."
6. **Contractions are fine.** "Don't" over "do not" in product copy. Exception: legal pages use formal.

### The numbers rule

Every claim that can be quantified must be quantified. If we can't put a number on it, we either find the number or remove the claim.

| Bad | Good |
|-----|------|
| "Thousands of items" | "2,400+ items" |
| "Fast install" | "Install in one command" |
| "Generous creator share" | "Creators keep 85%" |
| "Wide environment support" | "Works with 12 environments" |
| "Growing community" | "4,200 registered creators" |

If a number changes over time, use a live counter or a "last updated" qualifier. Never freeze a number in copy that won't be updated.

### Tone spectrum

Where we sit on common axes:

| Axis | RuleSell position |
|------|------------------|
| Formal ←→ Casual | **65% toward casual.** Contractions, short sentences, but no slang or memes. |
| Neutral ←→ Opinionated | **75% toward opinionated.** We take stances: quality matters, paid creators matter, measurement matters. |
| Verbose ←→ Terse | **80% toward terse.** One sentence where others use three. |
| Safe ←→ Bold | **60% toward bold.** We'll say "nobody else does this" when it's true. We won't say "we're the best." |
| Technical ←→ Accessible | **70% toward technical.** Our audience is developers. We use their vocabulary. We don't explain what an API is. |

### Per-surface guidelines

| Surface | Max length | Tone | CTA style |
|---------|-----------|------|-----------|
| Homepage hero | Headline ≤12 words, subtitle ≤40 words | Bold, specific | Verb-first: "Browse the marketplace" |
| How it works | 3 steps, ≤25 words each | Instructional, no fluff | Each step ends with a fact |
| Item cards | Title + one-line description | Neutral, factual | "Install" or price button |
| Empty states | 2-3 lines max | Helpful, not apologetic | One link, one action |
| Error states | 2-3 lines max | Direct, admits fault when ours | One recovery action |
| Badge descriptions | One sentence each | Factual, no sales pitch | None |
| Legal pages | As long as needed | Formal, plain language | None |
| Blog / Changelog | Unlimited | Personality allowed, PostHog energy | Optional |
| Affiliate page | ≤200 words intro | Direct, numbers-forward | "Get your link" |
| Email (transactional) | ≤5 sentences | Informational, no marketing | One action per email |

---

## Part 4: Copy for specific badge descriptions

These appear in tooltips and on the Trust & Verification page:

| Badge | Description |
|-------|------------|
| **Verified** | This item was reviewed by RuleSell staff for quality, safety, and accuracy. Required for paid listings. |
| **Quality A/B/C** | Quality score based on measured token efficiency, install success rate, and schema cleanliness. A = top 10%. |
| **Maintainer Verified** | Published by the original author of the linked open-source project. Verified through GitHub. |
| **Editor's Pick** | Selected by RuleSell staff. Rotates monthly. |
| **Popular** | 500+ verified installs in the last 30 days. |
| **Updated** | Last updated less than 90 days ago. |
| **New** | Published less than 14 days ago. |
| **Official** | Built and maintained by the RuleSell team. |
| **Featured** | Paid placement. Clearly labeled. |
| **Verified Creator** | Email and domain verified, two-factor authentication enabled. |
| **Trader** | Completed DSA Article 30 trader verification. Required to sell paid items. |
| **Certified Dev** | Earned through reputation (200+ rep) or peer vouching. Can write verified-install reviews. |
| **Top Rated** | Maintained 4.5+ star average across 20+ items. |

---

## Part 5: Page-level copy reference

### Marketplace page header
> Browse {count} items across {category_count} categories

No "Welcome to the marketplace." No "Discover amazing tools." Just what's here and how much of it.

### Creator profile — bio placeholder
> This creator hasn't written a bio yet.

Not "Tell us about yourself!" — that's a prompt, and it goes in the edit form, not on the public profile.

### Pricing section on item detail
> **Free** — Install without an account
> **${price}** — One-time purchase. Includes all future updates.
> **${price}/mo** — Subscription. Cancel anytime. Includes continuous updates.

### Install command block header
> Install for {environment}

Not "Get started" or "Quick start." The user clicked "Install" — they know what they're doing.

### Footer tagline
> RuleSell — Verified AI dev assets.

Five words. What we are, what makes us different.

---

## Sources

- [Linear](https://linear.app) — homepage and about page copy
- [Stripe](https://stripe.com) — homepage tagline, Quora discussion on corporate slogan
- [Vercel](https://vercel.com) — homepage hero copy
- [PostHog](https://posthog.com) — homepage, [writing for developers guide](https://posthog.com/founders/writing-for-developers), [style guide](https://posthog.com/handbook/content/posthog-style-guide), [how they rebrand](https://posthog.com/founders/postmortem-rebrand)
- [Resend](https://resend.com) — homepage tagline
- [Cal.com](https://github.com/calcom/cal.com) — repo description and homepage
- [Basecamp](https://molodtsov.me/2023/09/basecamp-is-a-contrarian-marketing-operation/) — contrarian marketing analysis
- [PostHog growth analysis](https://www.howtheygrow.co/p/how-posthog-grows-the-power-of-being) — How PostHog Grows
- [PostHog branding playbook](https://www.productgrowth.blog/p/posthog-branding-playbook) — How a B2B Analytics Company Became the Coolest Brand in Dev Tools
- [SaaS copywriting best practices](https://www.phoebelown.com/blog/the-ultimate-guide-to-saas-copywriting-20-tips-tricks-and-best-practices)
- [SaaS hero text examples](https://landingrabbit.com/blog/saas-website-hero-text)
- [Damn Good Writers — 20 SaaS homepage examples](https://damngoodwriters.com/post/best-saas-homepage-copywriting-examples)
