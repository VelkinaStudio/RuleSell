---
title: How to publish your first Claude Code skill
date: 2026-04-28
author: RuleSell Team
excerpt: A concrete walkthrough — from empty repo to published listing — for authors writing their first Claude Code skill.
---

# How to publish your first Claude Code skill

If you've used Claude Code and thought "I should publish a skill for this," but
then didn't because the workflow felt unclear — this post is for you. It's a
step-by-step walkthrough from empty directory to published RuleSell listing.

We'll build a real skill: one that helps an agent debug slow PostgreSQL queries.

## Step 1 — Decide if it should be a skill at all

Before writing any code, confirm:

- Does the user have to type a command explicitly? → slash command, not a skill
- Should this run automatically on a Claude Code event? → hook, not a skill
- Does the user want "how should I do X" knowledge loaded when relevant? → skill

Our example fits the last one: when the user is debugging slow queries, they
want knowledge, not a tool.

## Step 2 — Write the trigger description first

This is the most important step. The description is how Claude Code decides
whether to load your skill. Generic verbs don't trigger; specific phrases do.

Bad:
```yaml
description: Helps with database performance
```

Good:
```yaml
description: >
  Use when debugging slow PostgreSQL queries, reading EXPLAIN output,
  or auditing indexes. Triggers on "query is slow", "EXPLAIN ANALYZE", "why is
  this query taking 30 seconds", "missing index", "sequential scan", "N+1
  pattern", "pg_stat_statements", "pg_trgm". Skip for NoSQL or for schema design
  questions unrelated to performance.
```

Rule of thumb: at least three direct quotes of what users type, a negative case,
and no generic verbs.

## Step 3 — Build the directory

```
~/.claude/skills/pg-performance/
  SKILL.md
  references/
    explain-plans.md
    index-design.md
    common-patterns.md
```

SKILL.md stays under 100 lines. Long content goes to references/. This is called
progressive disclosure — most activations pay only the SKILL.md cost, and deep
material is loaded on demand.

## Step 4 — Write the SKILL.md

```markdown
---
name: pg-performance
description: >
  [your trigger description from Step 2]
---

# PostgreSQL performance debugging

When a query is slow, there are four likely causes: missing index, bad index,
sequential scan that should've been an index scan, or a cardinality estimate
error. This skill walks through each.

## The 3-phase workflow

### Phase 1 — Always run EXPLAIN (ANALYZE, BUFFERS) first

Without it, you're guessing. The plain `EXPLAIN` is just a guess — `EXPLAIN
ANALYZE` runs the query and tells you the truth.

Read `references/explain-plans.md` for how to read the output.

### Phase 2 — Compare actual vs estimated rows

If the estimate is off by 10x or more, that's a cardinality error — the
optimizer picked the wrong plan based on bad statistics.

Fix: `ANALYZE <table>` to refresh statistics. If that doesn't help, consider a
partial index or a function index.

### Phase 3 — If a sequential scan is the bottleneck, add an index

Read `references/index-design.md` to pick the right index type.

Common mistakes:
- Single-column index when a composite would work
- Index on the wrong leading column (low selectivity first)
- B-tree index when GIN would match the query shape

## Common patterns

Read `references/common-patterns.md` for worked examples of:
- N+1 query detection
- Slow JOIN with a LATERAL fix
- LIKE queries that need pg_trgm
- JSON field queries that need GIN
```

## Step 5 — Write the reference files

For each reference file, one topic. Keep them dense — the agent already knows
SQL, you're adding PostgreSQL-specific knowledge the training data might be
stale on.

Example excerpt from `references/explain-plans.md`:

```markdown
# Reading EXPLAIN ANALYZE output

Always run with (ANALYZE, BUFFERS): `EXPLAIN (ANALYZE, BUFFERS) <query>;`

## Key numbers

- **Planning Time**: how long the optimizer spent. Usually <1ms. If >10ms, the
  query is either very complex or you're hitting pg_statistic lock contention.
- **Execution Time**: the actual runtime. This is what you're optimizing.
- **Rows Removed by Filter**: if this is high, your WHERE clause isn't using an
  index — you're scanning and filtering in memory.
- **Buffers: shared hit=X read=Y**: "hit" is cache, "read" is disk. Many reads
  means you're going to disk — either add more RAM or fix the plan.

## Reading a plan top-down

PostgreSQL prints plans inside-out: the innermost node is the first executed
operation. Read from the deepest indentation outward.

## Common plan shapes

- **Seq Scan**: sequential scan. Usually bad for large tables, fine for small
  ones. If the table is >100K rows, you almost certainly want an index.
- **Index Scan**: using an index to look up rows. Good.
- **Index Only Scan**: using an index and not touching the heap. Best.
- **Bitmap Heap Scan + Bitmap Index Scan**: hybrid, often used when the query
  matches many rows via an index.
- **Nested Loop**: good for small outer sets, bad for large ones.
- **Hash Join**: builds a hash table. Good for large joins.
- **Merge Join**: requires both sides pre-sorted. Rare.
```

## Step 6 — Test the trigger

Before publishing, test that the description actually fires on the real phrases
users type. Start a fresh Claude Code session and try:

- "This query is slow"
- "Why does EXPLAIN show a seq scan"
- "I think I'm missing an index"
- "The n+1 pattern is killing me"

If the skill loads, great. If it doesn't, your description isn't specific
enough. Fix it.

## Step 7 — Test on a clean machine

Install it into a fresh directory, no other skills installed, and verify it
works from an empty state. This is the #1 thing published skills skip, and the
#1 reason users give up on a skill.

## Step 8 — Score it against the RuleSell quality bar

```bash
node ~/.claude/plugins/local/claude-code-marketplace-engine/skills/claude-code-marketplace-engine/scripts/score-asset.js ~/.claude/skills/pg-performance/
```

This gives you an automated score on token efficiency, schema cleanliness, and
freshness. If any of those is 0, fix it before publishing.

The three manual signals — trigger reliability, install success, security scan
— you do yourself:
- **Trigger reliability**: test corpus of 40 phrases (20 should-trigger, 20
  should-not), verify your description matches correctly
- **Install success**: clean-machine install test
- **Security scan**: `semgrep --config p/owasp-top-ten ~/.claude/skills/pg-performance/`

## Step 9 — Publish to RuleSell

From the dashboard, click "Publish new ruleset" → upload your directory. We'll
run our verifier against it. If it passes, it's live within the hour. If it
doesn't, we tell you exactly what to fix.

## Step 10 — After publication

Monitor the Quality Score on your dashboard. If it drops (because, say, Claude
Code rolls out a new version and your skill format is slightly stale), update it
within 7 days — freshness is one of the six signals.

## What earns a "Quality A" (score ≥85)

- SKILL.md < 1200 tokens
- At least 3 reference files
- Description contains real trigger phrases in direct quotes
- All schemas validate
- Install succeeds on first try
- Updated within the last 30 days
- Clean security scan

That's it. No gaming, no voting, no popularity contest. Just measurable quality.

---

Questions about publishing? DM us or open an issue at
[github.com/VelkinaStudio/RuleSell](https://github.com/VelkinaStudio/RuleSell).
