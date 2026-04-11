# Official Rulesets — Seed Content

Ten first-party "Official" listings that seed the RuleSell marketplace. Each meets
the quality bar documented in
`~/.claude/plugins/local/claude-code-marketplace-engine/skills/claude-code-marketplace-engine/references/quality-scoring.md`
(Quality A, 85+).

These are not fillers. They're real, useful rulesets that we'd publish regardless
of whether the marketplace existed.

## Format

Each listing is a single JSON file named `NN-<slug>.json` matching the Prisma
`Ruleset` schema plus a few metadata fields used by the seed script.

Required shape:

```json
{
  "slug": "claude-plugin-starter",
  "title": "Claude Plugin Starter",
  "type": "BUNDLE",
  "platform": "CLAUDE",
  "category": "BUNDLE",
  "price": 0,
  "description": "One-paragraph description.",
  "previewContent": "The short preview shown above the fold on detail pages.",
  "body": "Full content in markdown, stored in versions[0].content.",
  "tags": ["tag1", "tag2"],
  "license": "MIT",
  "qualityScoreExpected": 90,
  "hook": "One-line 'why we built this' marketing hook."
}
```

## Loading

Run `npx tsx scripts/seed-official-rulesets.ts` to load them into the database.
The script upserts by slug, so it's safe to re-run.

## The 10 listings

1. `01-claude-plugin-starter.json` — BUNDLE, free, Claude Code plugin template
2. `02-mcp-server-typescript-starter.json` — MCP_SERVER, free, minimal MCP server
3. `03-hook-presets.json` — BUNDLE, free, 6 Claude Code hook presets
4. `04-next-forge-skill-pack.json` — SKILL, free, next-forge knowledge
5. `05-cursor-react-19-rules.json` — RULES, free, React 19 Cursor ruleset
6. `06-prisma-postgres-workflow.json` — SKILL, free, Prisma 7 + Postgres
7. `07-agents-md-template.json` — PROMPT, free, real AGENTS.md / CLAUDE.md templates
8. `08-stripe-checkout-rules.json` — RULES, free, Stripe Checkout gotchas
9. `09-shadcn-conventions.json` — RULES, free, shadcn/ui usage patterns
10. `10-debug-typescript-errors.json` — SKILL, free, 30 common TS errors
