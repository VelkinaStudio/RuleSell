# RuleSell — Launch Plan

Written 2026-04-11. The plan is live. Update as we execute.

## Target launch week

**Week of 2026-04-28** (2.5 weeks from today). Tuesday the 28th at 07:00 UTC for
the Show HN post.

Why this week:
- Enough runway to seed the 10 Official listings
- Enough runway to do 30 hand-written creator outreach messages
- Enough runway to ship one more polish pass on the landing page
- Not so far out that we lose momentum
- A Tuesday launch is the established best day for Show HN

## What "ready" means

Before launch day, these are the non-negotiable checks:

- [x] Railway Postgres healthy, no regressions
- [x] Vercel production deploy stable on rulesell.vercel.app
- [x] SEO infrastructure live (sitemap, robots, llms.txt, JSON-LD, OG images)
- [x] Signup flow works end-to-end (tested as `test001@rulesell-test.internal`)
- [x] Logo consistent across all pages
- [ ] 10 Official rulesets seeded into the DB (JSON files ready, seed script ready, needs running on prod)
- [ ] 30 creator outreach DMs sent (content ready, need to send)
- [ ] Blog post "What RuleSell is" published
- [ ] Blog post "How to publish your first Claude Code skill" published
- [ ] A domain? (vercel.app for launch is fine — NOT a blocker)
- [ ] Resend configured for email verification (or accept the auto-verify fallback)
- [ ] At least one real creator has published one real listing (Founding Creator)

## Launch day — hour by hour (all UTC)

See `~/.claude/plugins/local/rulesell-launch-engine/skills/rulesell-launch-engine/references/launch-day.md` for the full runbook. Summary:

- **06:30** — pre-flight checks, dashboards open
- **07:00** — Show HN post goes live
- **07:30** — r/ClaudeAI, r/ChatGPTCoding, r/cursor posts
- **08:00** — Twitter thread
- **08:30** — email to warm list
- **08:30–18:00** — personal comment response on every thread
- **18:00** — day-end summary tweet with honest numbers
- **22:00** — private retro

## Target list — 30 creators to hand-DM

I cannot scrape contact info autonomously, so this is a skeleton for Nalba/Baha
to fill in. Work with the claude-code-researcher agent or the superpowers:researcher
agent to find specific handles.

### Priority A — Claude Code skill/plugin authors (15)

Search methods:
- GitHub: `topic:claude-plugin`, `topic:claude-code`, `filename:plugin.json`
- `awesome-claude-code` repo contributor graph
- Anthropic's Discord server
- Twitter: `"claude plugin"` OR `"claude code skill"` filter on last 30 days

Track as you find them:

| Handle | Why (specific asset they shipped) | Message sent | Response | Onboarded |
|---|---|---|---|---|
|  |  |  |  |  |
| (rows for 15) |  |  |  |  |

### Priority B — Cursor rule authors (8)

Search methods:
- cursor.directory top contributors
- `awesome-cursorrules` GitHub repo contributors
- r/cursor top posts of all time
- Twitter: `#cursorrules`

| Handle | Why | Sent | Response | Onboarded |
|---|---|---|---|---|
| (rows for 8) |  |  |  |  |

### Priority C — MCP server authors (5)

Search methods:
- `modelcontextprotocol/servers` GitHub repo contributors
- npm: packages named `*-mcp-server` or `@mcp/*`
- Twitter: `"mcp server"` last 30 days

| Handle | Why | Sent | Response | Onboarded |
|---|---|---|---|---|
| (rows for 5) |  |  |  |  |

### Priority D — Tool/workflow authors (2)

- n8n workflow contributors (n8n community forum)
- Relevant prompt-template authors with a proven dev-tooling bent

## The DM template

```
Hey {first name},

Saw your {specific asset} — the {specific thing they did well, one concrete
detail}. We're building RuleSell, a marketplace for Claude Code / Cursor /
Windsurf rules, skills, and MCP servers. The angle: Quality Score is measured
from six real signals, not voted on. Creators keep 85% (90% for the first six
months). Every paid item passes a verification gate.

We're recruiting founding creators — skip the usual install gate, get a
"Founding Creator" badge, co-promo your existing work.

Want early access? https://rulesell.vercel.app

(If this isn't relevant, ignore — no follow-up.)

— {your first name}
```

Rules:
- Rewrite the "specific compliment" line for every single target
- Never mass-send
- Max 1 follow-up after 7 days if no response
- Never apologize for reaching out

## Show HN post — final copy

**Title**: `Show HN: RuleSell – a verified marketplace for Claude Code / Cursor / Windsurf rules`

**Body**:

```
Hi HN,

RuleSell is a marketplace for Claude Code skills, Cursor rules, MCP servers,
and similar dev assets.

Two things we think are different:

1. Quality Score is measured, not voted. We compute six signals per listing —
   trigger reliability, token efficiency, schema cleanliness, install success,
   freshness, security scan. Star ratings and download counts don't control the
   sort order.

2. Every paid item has to pass a 50-install verification gate and trader KYC
   before it can be listed. This is slow on purpose. It's how we keep drive-by
   spam (the kind that hit some other creator marketplaces) out.

Creators keep 85% (90% for the first six months). Refunds are 14-day
no-questions for uninstalled items. Payouts are monthly via Stripe Connect.

We built this because we spent too many nights trying to figure out why a
half-working rule on cursor.directory broke a project.

Live: https://rulesell.vercel.app
Blog: https://rulesell.vercel.app/blog/what-rulesell-is
Source / issues: https://github.com/VelkinaStudio/RuleSell

Happy to answer anything. Especially interested in what's missing for your
workflow.
```

## Reddit posts

### r/ClaudeAI

**Title**: `Built a marketplace for Claude Code skills / MCP servers — quality is measured, not voted`

**Body**:

```
Hey r/ClaudeAI,

I've been using Claude Code heavily for the last few months and kept running
into the same problem: it's hard to tell which community skills are actually
good vs. which are someone's abandoned side project.

So we built RuleSell — every listing has a Quality Score computed from six real
signals instead of star ratings. Creators keep 85%. Every paid item passes a
verification gate before it can be listed.

Launch day today. Happy to answer anything. Looking for early creators if you
publish skills / MCPs — DM me about Founding Creator status.

https://rulesell.vercel.app
```

### r/ChatGPTCoding

Adapt the above, drop the "Claude Code heavily" line, emphasize the multi-tool
angle (Cursor, Windsurf, ChatGPT, Gemini).

### r/cursor

Drop the Claude Code framing entirely, lead with Cursor rules:

```
Built a marketplace for Cursor rules + skills + MCP servers where quality is measured, not voted

Hey r/cursor,

You know how you spend 20 minutes on cursor.directory and still can't tell
which rulesets are actually good? We built RuleSell to fix that. Quality Score
is computed from six signals: trigger reliability, token efficiency, schema
cleanliness, install success, freshness, security scan.

Creators keep 85%. No drive-by spam — every paid item passes a 50-install gate.

Launch day today. Would love feedback from people who've been on cursor.directory.

https://rulesell.vercel.app
```

## Twitter thread

See `launch-day.md` reference. 9 tweets, pin, update creator handles before
firing.

## Email to warm list

**Subject**: RuleSell is live

**Body**:

```
Hey {name},

RuleSell is live. Three links:

- https://rulesell.vercel.app (the site)
- https://rulesell.vercel.app/blog/what-rulesell-is (the post)
- HN thread: {fill in after posting}

If you feel like helping launch day:
1. Check out a listing on /leaderboard
2. Leave an honest comment on the HN thread
3. Retweet the launch thread if it's useful to someone you know

That's it. No ask beyond that. Thanks for being early.

— {name}
```

Send to: personal network, Founding Creators, past colleagues who do dev
tooling, anyone who said "tell me when it ships."

## Metrics dashboard

For launch day and the first 30 days:

- **Signups/day** (target launch day: 200-500)
- **Daily active users** (signed-in)
- **Listings published/day** (from Founding Creators)
- **First-install rate** (visitor → clicks install on any listing)
- **First-purchase rate** (visitor → purchases anything)
- **Quality Score median** across published items (target: ≥70)
- **Refund rate** (target: <5%)
- **Chargeback rate** (target: 0)
- **Support tickets**

Build a simple admin page at /admin/metrics that pulls these live. The Vercel +
Railway observability gives us most of this; we need to add the product metrics.

## Post-launch cadence

- **T+1**: personally thank top 20 commenters
- **T+2**: launch day retro blog post
- **T+7**: week-one retro tweet
- **T+14**: ship first feature from launch feedback
- **T+30**: month-one retro post with honest numbers
