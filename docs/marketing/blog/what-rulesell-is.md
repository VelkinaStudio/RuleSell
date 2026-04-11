---
title: What RuleSell is and why we built it
date: 2026-04-28
author: RuleSell Team
excerpt: A verified marketplace for AI dev assets where Quality Score is measured, not voted.
---

# What RuleSell is and why we built it

If you use Claude Code, Cursor, Windsurf, Cline, Codex, or any of the other
AI coding tools, you've run into this problem: there's a lot of community content
— rules, skills, MCP servers, agents, workflows — and most of it is 60% there.
The author tried it once on their project, it worked, they published it, and
now their 3-month-old `cursorrules` file is breaking your `cursorrules` file.

There's no good way to tell ahead of time which ones will work. Star ratings are
mostly "the author's friends liked it". Download counts don't mean usefulness.
Community-voted rankings get gamed. Quality slops.

We spent too many nights on this. So we built RuleSell.

## Two things we think are different

### Quality is measured, not voted

Every listing on RuleSell has a Quality Score — a number between 0 and 100. It's
composed of six signals, all measured automatically:

1. **Trigger reliability** — does the description actually fire on real user
   phrases? We test against a curated corpus.
2. **Token efficiency** — how many tokens does it cost to load + use? A great
   skill that costs 5000 tokens per activation is worse than a good one that
   costs 500.
3. **Schema cleanliness** — does the frontmatter, manifest, or MCP capability
   definition actually validate?
4. **Install success rate** — does it work first try on a fresh machine?
5. **Freshness** — when was it last updated? AI tools move fast and stale
   configs rot.
6. **Security scan** — does it touch credentials, make unexpected network calls,
   or fail a static analysis pass?

Star ratings don't control the sort order. Download counts don't. Only these
six things do. You can read the full scoring model at
[rulesell.vercel.app/trust](https://rulesell.vercel.app/trust).

### Every paid item passes a verification gate

To publish a paid item on RuleSell, a creator must:

1. Verify email + 18+
2. Publish at least one free item and pass a basic scan
3. Accumulate 50 verified installs on their free work
4. Complete Trader KYC (DSA Article 30 identity verification — required for EU
   sellers anyway)
5. Connect a Stripe Connect account for payouts

This is slow. On purpose. It's how we keep the drive-by spam that hit some other
creator marketplaces out of ours. Real creators clear the bar in 1-3 weeks.
Drive-by scammers don't bother.

## Who this is for

- **Developers looking for high-quality AI configs**. You want to know that when
  you install something, it'll actually work, not break your week.
- **Creators of AI dev tools**. You want to get paid for the thing you'd build
  anyway. 85% rev share, monthly payouts, real payouts (not "we'll pay you when
  we hit a milestone").
- **Maintainers of open-source dev tools**. You want to claim your content
  officially, show maintainer verified badges, and have a first-party place to
  point people to.

## The business model

- **Creators keep 85%**. 90% for the first six months (a launch promo).
- **Refunds are 14-day no-questions** for items not yet installed.
- **Chargebacks eat seller revenue** (plus a $5 admin fee) — we protect the
  buyer first.
- **Payouts are monthly, $50 minimum**, via Stripe Connect.
- **We use Merchant of Record** (LemonSqueezy at launch, migrating to Stripe +
  Paddle over time) to handle EU VAT, UK VAT, and US sales tax. You don't have
  to deal with that.

## What's on the platform at launch

- **10 Official listings** hand-built by our team, covering the main categories
  (plugin starter, MCP server template, hook presets, Cursor rules for React
  19, Prisma workflow, AGENTS.md templates, Stripe Checkout rules, shadcn
  conventions, TypeScript debug skill)
- **~50 community listings** from Founding Creators we've recruited personally.
  Every Founding Creator has a badge on their profile.
- Support for Claude Code, Cursor, Windsurf, Cline, Codex, Gemini CLI, ChatGPT,
  Copilot, n8n. One catalog, multi-environment.

## What's not on the platform yet

- No team/organization features beyond basic multi-seat
- Paid items haven't launched yet (we're running a free-only soft launch for the
  first 2 weeks to bootstrap the trust graph)
- The full quality scoring pipeline uses v1 fixture data — v2 will use live
  telemetry from real installs
- Full subscription item support is coming in month 2

## What we want from you

If you try RuleSell and have feedback — good, bad, anything — send it to us.
The first 30 days of feedback will shape what we build next. We read every
comment, every issue, every tweet.

If you publish dev tool configs and want early access as a Founding Creator,
DM us. You'll skip the install gate, get a "Founding Creator" badge, and we'll
co-promote your work.

If you install something that breaks, open an issue. We'll make it right.

## Links

- The site: [rulesell.vercel.app](https://rulesell.vercel.app)
- Browse the catalog: [rulesell.vercel.app/browse](https://rulesell.vercel.app/browse)
- The leaderboard: [rulesell.vercel.app/leaderboard](https://rulesell.vercel.app/leaderboard)
- Trust model: [rulesell.vercel.app/trust](https://rulesell.vercel.app/trust)
- Our GitHub (issues welcome): [github.com/VelkinaStudio/RuleSell](https://github.com/VelkinaStudio/RuleSell)

## Who built this

Two people (Nalba and Baha) and a lot of Claude Code. We're based in Turkey,
shipping from Istanbul. RuleSell is our first serious marketplace project — we've
built and sold software before, but the combination of trust infrastructure,
creator payouts, multi-tool catalog, and regulated compliance is the biggest
challenge we've taken on.

The goal is simple: make AI dev tools feel less like a wild west and more like
a place where quality work gets paid and slop gets filtered. One verified
listing at a time.

— RuleSell team
