# Claude Code Demand Ranking — Marketplace Content Prioritization

**Date:** 2026-04-09
**Status:** COMPLETE
**Purpose:** Determine the default ranking, "Top for Claude Code" shelf, and content prioritization for RuleSell marketplace.

---

## Executive Summary

Claude Code's install funnel follows a clear hierarchy: **CLAUDE.md first > MCP Servers > Skills > Hooks > Plugins**. The highest-demand assets are MCP servers for developer tooling (GitHub, Playwright, Context7), followed by framework-specific skills (React/Next.js, frontend design) and workflow automation templates (n8n AI agents). This document provides the ranked top 50 items that should appear first in a Claude Code-prioritized marketplace.

---

## 1. Most-Installed Claude Code Skills (skills.sh Data)

Source: skills.sh leaderboard, OpenAIToolsHub 349-skill ranking, Composio top-10 analysis.

| Rank | Skill | Author | Installs (cumulative) | Category |
|------|-------|--------|----------------------|----------|
| 1 | find-skills | vercel-labs | 418,600 | Meta / Discovery |
| 2 | frontend-design | Anthropic (official) | 277,000+ | Design / UI |
| 3 | react-best-practices | vercel-labs | 185,000 | Framework / React |
| 4 | web-design-guidelines | vercel-labs | 137,000 | Design / UI |
| 5 | remotion-best-practices | Remotion Dev | 126,000 | Video / Media |
| 6 | skill-creator | Anthropic | 117,800 | Meta / Tooling |
| 7 | agent-browser | vercel-labs | ~110,000 (14k GH stars) | Browser Automation |
| 8 | feature-dev | knowledge-work-plugins | 89,000 | Development Workflow |
| 9 | superpowers | obra | ~80,000 (40.9k GH stars, 3.1k forks) | Agentic Framework |
| 10 | supermemory | supermemory-ai | ~60,000 (16.7k GH stars) | Memory / Knowledge |
| 11 | brainstorming | obra/superpowers | — | Planning / Ideation |
| 12 | test-driven-development | obra/superpowers | — | Testing / TDD |
| 13 | systematic-debugging | obra/superpowers | — | Debugging |
| 14 | code-reviewer | various | — | Code Review |
| 15 | writing-plans | obra/superpowers | — | Planning |
| 16 | landing-page-guide | community | — | Design / Marketing |
| 17 | ui-ux-pro-max | community | — | Design / UI |
| 18 | docker-optimize | community | — | DevOps |
| 19 | security-scan | community | — | Security |
| 20 | postgres-best-practices | community | — | Database |

**Key finding:** The top 5 skills account for the majority of installs. Vercel Labs and Anthropic dominate the leaderboard. The single most-installed skill (find-skills) is a meta-skill for discovering other skills — confirming that **discovery is the primary pain point**.

---

## 2. Most-Used MCP Servers with Claude Code

Sources: mcp.directory (FastMCP) view/install data, mcpmanager.ai Ahrefs search volume data, GitHub star counts.

### By Search Volume (Ahrefs worldwide monthly searches, March 2026)

| Rank | MCP Server | Monthly Searches | GitHub Stars | Category |
|------|-----------|-----------------|-------------|----------|
| 1 | Playwright | 82,000 | 28,500 | Browser Automation |
| 2 | Figma | 74,000 | — | Design-to-Code |
| 3 | GitHub | 69,000 | 28,300 | Developer Tools |
| 4 | Jira/Atlassian/Confluence | 40,000 | — | Project Management |
| 5 | Context7 | 32,000 | 50,100 | Documentation / Context |
| 6 | Supabase | 26,000 | — | Database / Backend |
| 7 | Notion | 23,000 | — | Knowledge / Docs |
| 8 | Serena | 19,000 | — | AI Reasoning |
| 9 | Slack | 17,700 | — | Communication |
| 10 | Browser (generic) | 16,100 | — | Browser Automation |
| 11 | AWS | 16,000 | — | Cloud Infrastructure |
| 12 | Azure | 13,000 | — | Cloud Infrastructure |
| 13 | Sequential Thinking | 13,000 | — | AI Reasoning |
| 14 | Zapier | 10,800 | — | Automation |
| 15 | Linear | 10,600 | — | Project Management |
| 16 | Docker | 10,300 | — | DevOps |
| 17 | GitLab | 9,700 | — | Developer Tools |
| 18 | Obsidian | 8,100 | — | Knowledge / Notes |
| 19 | Postgres | 7,900 | — | Database |
| 20 | Puppeteer | 7,300 | — | Browser Automation |

### By Platform Engagement (mcp.directory views + installs)

| Rank | MCP Server | Views | Installs | Category |
|------|-----------|-------|----------|----------|
| 1 | Context7 | 11,000 | 690 | Documentation |
| 2 | Playwright Browser Automation | 5,600 | 414 | Browser Automation |
| 3 | Sequential Thinking | 5,500 | 569 | AI Reasoning |
| 4 | ReactBits | 4,800 | 207 | Design Components |
| 5 | Playwright (MS official) | 4,700 | 102 | Browser Automation |
| 6 | Puppeteer | 4,200 | 199 | Browser Automation |
| 7 | GitHub | 3,100 | 204 | Developer Tools |
| 8 | Desktop Commander | ~2,800 | — | File System |
| 9 | Docfork | 2,800 | 150 | Documentation |
| 10 | DeepWiki | 2,400 | — | Documentation |

### Anthropic Official Reference Servers

Anthropic ships 6 reference servers: **Filesystem**, **PostgreSQL**, **Brave Search**, **GitHub**, **Puppeteer**, **Google Maps**.

**Key finding:** Browser automation (Playwright/Puppeteer) appears in the top 5 across ALL ranking methods. Context7 is the breakout star of 2026 with 50k GH stars and the highest mcp.directory view count. Three browser automation servers in the top 10 confirms developers want reliable web interaction as a core AI capability.

---

## 3. Community Demand Signals (Reddit/HN/Discord/Forums)

### What Claude Code Users Actually Ask For

**From r/ClaudeAI, HN threads, and dev blogs (Jan-Apr 2026):**

1. **"What MCP servers do you use?"** — The single most-asked question in Claude Code communities. Every setup guide post gets 100+ comments.

2. **"My Claude Code setup after X months"** — Viral format. Typical setup: CLAUDE.md + 2-3 MCP servers (GitHub, Context7, Playwright) + a few custom skills.

3. **"Skills vs MCP — what's the difference?"** — Persistent confusion. Morphllm's guide is the most-shared explainer.

4. **"Are Claude Code plugins safe?"** — Trust anxiety is real. The postmark-mcp incident (Sept 2025) still cited as cautionary tale.

5. **"Rules that actually work"** — Cursor users frustrated by rules that don't consistently apply. Claude Code skills users frustrated by skill selection failures with too many skills loaded.

6. **"Enterprise skill sharing"** — GitHub issue #228 on anthropics/skills has active demand for org-wide skill distribution.

7. **"How to get Claude to follow CLAUDE.md"** — CLAUDE.md optimization is an emerging content category.

### HN-Specific Insights

- **"Star count is a negative quality signal"** for MCP servers (HN thread on MCP Registry). Top-starred servers are the worst on token efficiency.
- **"Token costs vary 440x"** between MCP servers for the same task (GitHub official: 20,444 tokens; sqlite: 46 tokens).
- **"100% of servers have at least one quality issue"** — quality scoring would differentiate from generic lists.
- Enterprise demand: **"We're coordinating in a way that everyone in the enterprise can find all the available MCPs. Like backstage or something."**

### Cursor Forum Pain Points

- Rules "do not work well anymore" after updates (forum thread 145342)
- Users want rules + verification: "Rules that provably change output"
- Content gap: Almost no cursor rules for client-side React without Next.js

---

## 4. The Claude Code Ecosystem Hierarchy (Install Funnel)

Source: Morphllm ecosystem guide, Anthropic docs, community setup posts.

### Setup Order (what people do FIRST)

```
1. CLAUDE.md            — 100% of users (foundation, free, built-in)
2. MCP Servers (2-3)    — ~80% of active users (GitHub, Filesystem, +1 domain)
3. Skills (3-5)         — ~60% of active users (framework rules, design, workflow)
4. Hooks                — ~30% of active users (lint, test, security gates)
5. Plugins              — ~20% of active users (bundles, team standardization)
6. Agent Teams          — ~10% of power users (multi-agent orchestration)
```

### Token Budget Reality

- A 5-MCP-server setup with 58 tools consumes **55,000+ tokens** before conversation starts
- Tool Search reduces this by **85%** through on-demand discovery
- Skills use only **30-50 tokens each** until activated (much cheaper than MCP)
- Accuracy improves from 49% to 74% when tool libraries are properly managed

### Adoption Metrics (April 2026)

- **9,000+ Claude Code plugins** in the ecosystem (up from 0 in under a year)
- **101 official marketplace plugins** (Anthropic curated)
- **12,000+ MCP servers** across GitHub, npm, PyPI, and registries
- **Smithery** alone hosts 7,000+ servers
- **mcp.so** indexes 19,656 servers
- MCP SDK: **97 million cumulative downloads** (Python + TypeScript)

### The Winning Pattern

The most-installed plugin in Anthropic's marketplace **consists entirely of a SKILL.md file** — no MCP servers, agents, hooks, or commands. Simple, focused skills have the highest organic adoption.

---

## 5. Top Cursor Rules by Category

Sources: cursor.directory, DEV Community framework roundup, dotcursorrules.com.

| Rank | Rule Category | Framework/Language | Demand Signal |
|------|--------------|-------------------|--------------|
| 1 | Next.js App Router | React/Next.js | Highest volume on cursor.directory |
| 2 | React + TypeScript | React/TS | Second-most downloaded |
| 3 | Python (FastAPI + SQLAlchemy) | Python | Top backend rule |
| 4 | Go (Standard Library + sqlc) | Go | Rising fast |
| 5 | Tailwind CSS | CSS | Used with most frontend rules |
| 6 | Vue 3 + Composition API | Vue | Underserved but demanded |
| 7 | Svelte/SvelteKit | Svelte | Underserved but demanded |
| 8 | Rust | Rust | Niche but loyal audience |
| 9 | Django/Flask | Python | Web backend |
| 10 | Node.js/Express | JavaScript | Classic backend |

**Key finding:** cursor.directory has **63,300+ community members**. Content is heavily skewed toward Next.js/React. Vanilla React, Vue, Svelte, and backend-focused stacks are explicitly underserved (per HN comments). Optimal rule length is **1,000-2,500 words** per rules file.

**Critical insight from HN:** "Cursor rules that actually provably work — distributed with test cases/evals — would be a differentiator." The raw `.mdc` file is not enough; the product is **rules + verification harness**.

---

## 6. n8n/Make Workflow Demand

Sources: n8n.io/workflows (9,166 templates), awesome-n8n-templates, Make.com template library.

### n8n Top Categories by Template Count

| Rank | Category | Template Count | Growth |
|------|----------|---------------|--------|
| 1 | AI & LLM Integration | 6,274 | Fastest-growing (75% of new workflows include LLM) |
| 2 | Marketing Automation | 2,818 | Stable high demand |
| 3 | Sales & CRM | ~1,500 | Lead gen, scoring, routing |
| 4 | DevOps & IT | ~800 | Monitoring, CI/CD, backup |
| 5 | Personal Productivity | 564 | Email, task, calendar |
| 6 | Finance & Accounting | ~400 | Invoice, reconciliation |
| 7 | HR & Recruitment | ~300 | Resume screening, onboarding |
| 8 | E-commerce | ~250 | Order sync, inventory |

### Most Popular Individual Templates

1. **AI Chat Assistant** (OpenAI/Claude-powered)
2. **Lead Generation Agent** (scrape + enrich + email)
3. **Email Automation** (AI categorize + draft responses)
4. **Content Repurposing** (blog to social posts)
5. **Slack Notification Workflows**
6. **Google Sheets to CRM Sync**
7. **Social Media Cross-Posting**
8. **Invoice Data Extraction**
9. **Lead Enrichment Pipeline**
10. **Daily Standup Bot**

### n8n Monetization Data

- **$19** — typical per-workflow price on third-party marketplaces
- **$3,200/month** — one creator's reported income from 5 templates
- n8n community actively seeking non-official marketplace channels
- ManageN8N and HaveWorkflow are charging successfully

### Make.com Top Categories

- Social media automation, email-to-task, e-commerce order logging, calendar integration, lead management
- **7,000+ templates** on Make.com
- Less open-source community; harder to monetize third-party

---

## 7. Ranked Top 50 Items for the "Top for Claude Code" Shelf

This is the recommended default ranking for the marketplace, organized by tier.

### Tier 1: Foundation (Items 1-10) — What everyone needs first

| # | Item | Type | Why First |
|---|------|------|-----------|
| 1 | **CLAUDE.md Templates** (by stack) | Config Template | 100% of users need this; gateway product |
| 2 | **Context7 MCP** | MCP Server | 50k GH stars, #1 on mcp.directory; injects live docs |
| 3 | **GitHub MCP** | MCP Server | 28k+ stars, 69k monthly searches; most-used MCP |
| 4 | **Playwright MCP** | MCP Server | 82k monthly searches, 28.5k stars; browser automation |
| 5 | **React/Next.js Best Practices** | Skill | 185k installs; highest framework demand |
| 6 | **Frontend Design** (Anthropic) | Skill | 277k installs; official, trusted |
| 7 | **Superpowers** (obra) | Plugin | 40.9k stars; most comprehensive agentic framework |
| 8 | **Filesystem MCP** | MCP Server | Anthropic reference; essential for local operations |
| 9 | **Sequential Thinking MCP** | MCP Server | 5.5k views, 569 installs; AI reasoning boost |
| 10 | **Web Design Guidelines** | Skill | 137k installs; Vercel quality bar |

### Tier 2: Developer Workflow (Items 11-20) — What power users add next

| # | Item | Type | Why |
|---|------|------|-----|
| 11 | **PostgreSQL MCP** | MCP Server | 7.9k monthly searches; essential for backend devs |
| 12 | **Supabase MCP** | MCP Server | 26k monthly searches; BaaS integration |
| 13 | **Figma MCP** | MCP Server | 74k monthly searches; design-to-code pipeline |
| 14 | **Next.js App Router Rules** | Cursor Rule | #1 cursor.directory category |
| 15 | **Python FastAPI Rules** | Cursor Rule | Top backend rule by downloads |
| 16 | **Remotion Best Practices** | Skill | 126k installs; video/media niche |
| 17 | **Docker MCP** | MCP Server | 10.3k monthly searches; containerization |
| 18 | **Security Scan Skill** | Skill | OWASP-based; trust differentiator |
| 19 | **TDD Skill** (test-driven-development) | Skill | obra/superpowers; quality methodology |
| 20 | **Linear MCP** | MCP Server | 10.6k monthly searches; issue tracking |

### Tier 3: Automation & Business (Items 21-30) — Where money flows

| # | Item | Type | Why |
|---|------|------|-----|
| 21 | **AI Lead Generation Agent** | n8n Workflow | Proven $19 price point; highest conversion |
| 22 | **Email AI Categorizer + Auto-Reply** | n8n Workflow | Top individual n8n template |
| 23 | **Content Repurposing Pipeline** | n8n Workflow | Blog-to-social; marketing demand |
| 24 | **Slack MCP** | MCP Server | 17.7k monthly searches; team communication |
| 25 | **Notion MCP** | MCP Server | 23k monthly searches; knowledge management |
| 26 | **Jira/Confluence MCP** | MCP Server | 40k monthly searches; enterprise PM |
| 27 | **Social Media Cross-Poster** | n8n Workflow | High template count; recurring need |
| 28 | **Brand Voice Plugin** | Plugin | Tested & recommended; content consistency |
| 29 | **Marketing Plugin** | Plugin | 6-skill bundle; SEO/content/competitive |
| 30 | **Lead Scoring Workflow** | n8n Workflow | AI-powered; enterprise use case |

### Tier 4: Specialized & Niche (Items 31-40) — Category depth

| # | Item | Type | Why |
|---|------|------|-----|
| 31 | **Go Rules** (Standard Library) | Cursor Rule | Rising fast on cursor.directory |
| 32 | **Vue 3 Rules** | Cursor Rule | Explicitly underserved; demand from HN |
| 33 | **Svelte/SvelteKit Rules** | Cursor Rule | Explicitly underserved; demand from HN |
| 34 | **Tailwind CSS Rules** | Cursor Rule | Pairs with all frontend rules |
| 35 | **AWS MCP** | MCP Server | 16k monthly searches; cloud infrastructure |
| 36 | **Stripe MCP** | MCP Server | 5.7k monthly searches; payments |
| 37 | **Brave Search MCP** | MCP Server | Anthropic reference; web search capability |
| 38 | **Obsidian MCP** | MCP Server | 8.1k searches; personal knowledge base |
| 39 | **Trail of Bits Security Skills** | Skill Bundle | 12+ security skills; professional audit |
| 40 | **Systematic Debugging Skill** | Skill | obra/superpowers; hypothesis-driven debug |

### Tier 5: Enterprise & Power User (Items 41-50) — Team/org value

| # | Item | Type | Why |
|---|------|------|-----|
| 41 | **Salesforce MCP** | MCP Server | 6.5k monthly searches; enterprise CRM |
| 42 | **Datadog MCP** | MCP Server | 6.9k monthly searches; observability |
| 43 | **Sentry MCP** | MCP Server | 4.7k monthly searches; error tracking |
| 44 | **Terraform MCP** | MCP Server | 3.2k monthly searches; IaC |
| 45 | **Kubernetes MCP** | MCP Server | 2.1k monthly searches; orchestration |
| 46 | **Agent Team Templates** | Config Bundle | Multi-agent orchestration patterns |
| 47 | **CI/CD Hook Templates** | Hook Bundle | Pre-commit, lint, test automation |
| 48 | **Enterprise CLAUDE.md Templates** | Config Template | Team standards, org conventions |
| 49 | **Invoice Data Extraction Workflow** | n8n Workflow | Finance automation; proven demand |
| 50 | **Multi-Agent RAG Pipeline** | n8n Workflow | AI-native; advanced use case |

---

## 8. Strategic Implications for RuleSell

### Default Sort Algorithm Should Weight

1. **Install count / download volume** (40%) — skills.sh data, npm downloads, mcp.directory installs
2. **Search demand** (25%) — Ahrefs monthly search volume for the server/skill name
3. **Quality score** (20%) — Token efficiency, schema cleanliness, test coverage, security audit
4. **Recency** (15%) — Last update date, compatibility with latest Claude Code version

### Why NOT Pure Popularity Sort

HN data proves star count is a **negative quality signal** for MCP servers. The top-starred servers are the worst on token efficiency. RuleSell's edge is a quality-weighted sort that surfaces efficient, tested, secure assets over merely popular ones.

### Content Gaps to Fill First (Underserved + High Demand)

1. **CLAUDE.md templates by stack** — Nobody sells these. Everyone needs them. Gateway product.
2. **Cursor rules with eval harnesses** — Rules + "proof they work" is unmet demand.
3. **Vue/Svelte/vanilla React rules** — Cursor ecosystem skews Next.js; other frameworks are explicitly underserved.
4. **Enterprise skill distribution** — GitHub issue #228 demand. B2B product, not consumer.
5. **MCP server quality reports** — Token cost benchmarks, security audit results. No competitor does this.

### Category Distribution for Homepage

Based on demand data, the marketplace homepage should allocate shelf space as:

| Category | Shelf % | Rationale |
|----------|---------|-----------|
| MCP Servers | 30% | Highest search volume, most universal need |
| Skills | 25% | Highest install counts, framework-specific |
| Workflow Templates (n8n/Make) | 20% | Only category with proven $19 price point |
| Cursor Rules / CLAUDE.md | 15% | Large existing audience (63k+ cursor.directory) |
| Plugins / Agent Teams | 10% | Power user segment, growing but niche |

---

## Sources

- [skills.sh leaderboard](https://skills.sh/)
- [mcp.directory top servers](https://mcp.directory/blog/top-10-most-popular-mcp-servers)
- [mcpmanager.ai 50 most popular](https://mcpmanager.ai/blog/most-popular-mcp-servers/)
- [OpenAIToolsHub 349 skills ranked](https://www.openaitoolshub.org/en/blog/best-claude-code-skills-2026)
- [Composio top 10 skills](https://composio.dev/content/top-claude-skills)
- [Morphllm skills vs MCP vs plugins](https://www.morphllm.com/claude-code-skills-mcp-plugins)
- [awesome-claude-code (37.6k stars)](https://github.com/hesreallyhim/awesome-claude-code)
- [obra/superpowers (40.9k stars)](https://github.com/obra/superpowers)
- [DEV Community cursor rules roundup](https://dev.to/deadbyapril/the-best-cursor-rules-for-every-framework-in-2026-20-examples-29ag)
- [TurboDocx plugins/skills/MCP guide](https://www.turbodocx.com/blog/best-claude-code-skills-plugins-mcp-servers)
- [buildtolaunch plugin review](https://buildtolaunch.substack.com/p/best-claude-code-plugins-tested-review)
- [n8n.io workflows (9,166 templates)](https://n8n.io/workflows/)
- [n8n templates overview](https://connectsafely.ai/articles/n8n-templates-workflow-automation-examples)
- [Claude Code setup after 4 months](https://okhlopkov.com/claude-code-setup-mcp-hooks-skills-2026/)
- [HN: MCP Registry thread](https://news.ycombinator.com/item?id=47486982)
- [HN: MCP is dead; long live MCP](https://news.ycombinator.com/item?id=47380270)
- [Context7 MCP (50.1k GH stars)](https://github.com/upstash/context7)
- [Playwright MCP (28.5k GH stars)](https://github.com/microsoft/playwright-mcp)
- [GitHub MCP (28.3k GH stars)](https://github.com/github/github-mcp-server)
