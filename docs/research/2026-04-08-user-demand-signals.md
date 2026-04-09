# User Demand Signals — AI Development Assets Marketplace

**Date:** 2026-04-08
**Status:** IN PROGRESS
**Scope:** Real developer demand for a marketplace of cursor rules, MCP servers, Claude skills, agents, prompts, workflows, CLIs, agent teams.

This file is written incrementally as research progresses. Raw quotes first, synthesis at the end.

---

## Raw Findings

### 1. The existing marketplace landscape (competitors / incumbents)

As of April 2026, the space is already crowded but fragmented:

- **skillsmp.com** — "Agent Skills Marketplace - Claude, Codex & ChatGPT Skills"
- **claudeskills.info** — Claude Code skills discovery/download
- **skills.pawgrammer.com** — "280+ Free Community Skills for Claude AI"
- **claudeskillsmarket.com** — "Discover, Share & Build"
- **lobehub.com/skills** — LobeHub Agent Skills Marketplace
- **mcpmarket.com** — MCP Market + skills directory
- **mcp.so** — community MCP directory, **19,656 MCP servers** indexed
- **mcpservers.org** — another directory
- **cursor.directory** — 63.3k+ Cursor community members, rules + MCP + plugins
- **Cursor 2.5 Plugins Marketplace** — official, packages skills/subagents/MCP/hooks/rules in one install
- **Cline MCP Marketplace**
- **awesome-claude-code** (hesreallyhim), **awesome-claude-skills** (3 separate forks: travisvn, BehiSecc, ComposioHQ), **awesome-claude-prompts** (langgptai), **awesome-claude** (webfuse-com, tonysurfly/alvinunreal) — at least 6 competing "awesome" lists
- **awesomeclaude.ai/awesome-claude-code** — visual directory wrapper on top of an awesome list

**Implication:** The competitive moat is NOT "we built a directory." Directories are trivial. The moat has to be trust, curation, monetization rails, and/or a discovery experience that awesome-lists cannot provide.

---

### 2. Trust / security — the single most load-bearing signal

The **postmark-mcp incident** (Sept 2025) is the most cited trust failure in this space:

- First confirmed malicious MCP server on npm
- Downloaded **1,500 times per week**
- Since v1.0.16 it silently BCC'd every email sent by AI agents to the attacker's server — "including password resets, invoices, and confidential documents"
- Source: https://www.koi.ai/blog/postmark-mcp-npm-malicious-backdoor-email-theft
- Cross-ref: https://thehackernews.com/2025/09/first-malicious-mcp-server-found.html
- Cross-ref: https://securelist.com/model-context-protocol-for-ai-integration-abused-in-supply-chain-attacks/117473/

Direct developer-language quotes on the trust problem:

> "Supply Chain Risk is underestimated. Most people install MCP packages (npm, Docker) without realising how easily they can be tampered with. One poisoned update can lead to dangerous results. The majority of MCP servers today are typically deployed by running npx commands that download code at runtime from npm, trusting that package names match what you think you're installing."
> — https://hivetrail.com/blog/10-cricitcal-mcp-security-vulnerabilities/

> "A malicious local MCP server can execute arbitrary commands, access local files, install malware, and exfiltrate data—all while appearing to provide legitimate productivity features."
> — https://www.praetorian.com/blog/mcp-server-security-the-hidden-ai-attack-surface/

> "Treat all MCP servers as potentially adversarial code."
> — https://www.knostic.ai/blog/mcp-security

There is now a **"mpak Trust Framework (MTF)"** (https://mpaktrust.org/) positioning itself as an MCP security standard — signals that trust is the unsolved problem the ecosystem itself is trying to organize around.

A DEV Community post titled literally **"From Unknown to Verified: Solving the MCP Server Trust Problem"** (https://dev.to/stacklok/from-unknown-to-verified-solving-the-mcp-server-trust-problem-5967) confirms this framing is now mainstream.

**Takeaway:** Trust is the #1 pain, and it is still unsolved as of April 2026. The existing marketplaces (mcp.so with 19k servers, cursor.directory) are registries, not trust layers. A marketplace whose *core promise* is verified/audited/sandboxed assets has a wedge the incumbents do not.

---

### 3. HackerNews — the "star count is a negative signal" thread

Source: https://news.ycombinator.com/item?id=47486982 ("MCP Registry – Open-source discovery layer for MCP servers")

Verbatim commenter quotes (the single most important finding in this doc):

> **"Registries solve discovery; quality is the next layer."**

> **"Token costs vary 440x (GitHub official: 20,444 tokens; sqlite: 46)."**

> **"100% have at least one quality issue."**

> **"The top-starred servers are consistently the worst performers on token efficiency — star count is actually a negative quality signal."**

> **"Adding quality scoring would differentiate this from generic lists."**

This is the clearest "unmet need" finding in the entire research sweep. Existing directories (mcp.so, cursor.directory, awesome-lists) are popularity-sorted. Popularity is actively misleading in this space because stars accrue to "first to publish in a category," not to quality or efficiency. A marketplace whose default sort is a measured quality score — token cost, schema cleanliness, install success rate, sandboxed security audit — would be categorically different.

---

### 4. HackerNews — "MCP is dead; long live MCP"

Source: https://news.ycombinator.com/item?id=47380270

> "All the code I work on now has an MCP interface so that the LLM can debug more easily... The amount of time it has saved me is unreal."

> "MCP is a vibe-coded protocol that rode one of the many AI hype waves where all design documents are post-hoc justifications."

> "Every single AI integration feels under-engineered... LLMs are purely textual in context, while network protocols are more intricate by pure nature."

> **"What kind of data is being sent to these random endpoints? What if they go rogue or change their behavior? A static set of tools is safer."**

> **"We're coordinating in a way that everyone in the enterprise can find all the available mcps. Like backstage or something."**
> — Developer asking for an **internal enterprise MCP catalog**. This is the clearest B2B monetization hook: companies want a private/team registry.

> "The biggest disappointment I have with MCP today is that many clients are still half-assed on supporting functions outside of MCP tools."

---

### 5. HackerNews — Cursor Directory (3-hour build → 250k users/month)

Source: https://news.ycombinator.com/item?id=43412295

> **"I cannot identify a single cursor rule for client side React that is not Nextjs."**
> — Content-gap complaint: directories are heavily skewed toward popular stacks, leaving entire communities (vanilla React, Svelte, Vue, backend-heavy stacks) underserved.

> **".cursor/rules was still very flaky (for me, and apparently for a ton of people on the forum)"**

> "What I do is have a main prompt that just tells the model to adhere to the rules and lists them out. It doesn't really work."
> — Even when you find a rule, getting Cursor to *follow* it is fragile. Opportunity: ship rules with evals / "does this rule actually change output."

> "Would love to see a blog and maybe some documentation as to how to create MCPs."

**Telling non-finding:** zero monetization discussion in the Cursor Directory comment thread. Developers treated it as a free community good; nobody proposed paying. Free-list anchoring is real.

---

### 6. Fragmentation has reached crisis levels (April 2026 scale)

The scale of fragmentation is now the story itself:

- **claudemarketplaces.com** catalogs **2,500+ marketplaces**, 2,400+ skills, 770+ MCP servers (and it only covers Claude)
- **mcp.so**: 19,656 MCP servers
- **ClaudePluginHub**: 14,083+ indexed plugins
- **"350,000+ skills, 18,000+ MCP servers"** claimed by one aggregator
- At least **6 competing "awesome-claude" lists** (webfuse, alvinunreal, hesreallyhim, travisvn, BehiSecc, ComposioHQ)
- **aitmpl.com**: 340 plugins + 1,367 agent skills
- VoltAgent/awesome-agent-skills: **"1000+ agent skills from official dev teams and the community"**

Quote from a tested review of Claude Code plugins (Substack: buildtolaunch, "Best Claude Code Plugins (2026): 10 Tested, 4 Worth Keeping"):

> **"Plugins and marketplaces are highly trusted components that can execute arbitrary code on your machine. Only install from sources you trust."**

> **Three-tier ecosystem creates confusion—101 official plugins, community repos with unverified quality, and third-party index sites (ClaudePluginHub: 14,083+ indexed) offering no verification.**

> **"Plugin overlaps cause silent competition. Marketing and Sales both handle competitive analysis, yet deliver wildly different quality. Sales generated false subscriber counts and tier mismatch analysis."**

> Reviewer had to **fork and hand-fix** `knowledge-work-plugins` because the marketplace file had schema validation problems: "required a local fixed copy."

> **"Installation creates behavioral confusion: one plugin bundles skills (triggered), hooks (always-on), and MCP servers at different cost levels simultaneously."**

Source: https://buildtolaunch.substack.com/p/best-claude-code-plugins-tested-review

From cra.mr ("MCP, Skills, and Agents"):

> **"Many MCP servers include a lot of tools that you don't want or don't need, often very unoptimized."**

> "Everyone has immediately proclaimed they solve all problems, and all previous iterations of technology are no longer relevant."

> Author's dream: "take our MCP subagent and have it be a native subagent" with full encapsulation, different models, isolated tool environments.

Source: https://cra.mr/mcp-skills-and-agents/

Key confirmation that scale itself is a problem (from Analytics Vidhya/Medium Claude skills articles):

> **"Claude can struggle to pick the right skill even when one exists for a specific task, and this issue only worsens when there are too many skills to choose from."**

> **"Skills introduce an additional layer of abstraction, and latency in skill discovery and calling can increase latency by roughly 3× even when running entirely within Anthropic's infrastructure."**

> "A skill that does too many things becomes hard to trigger accurately and harder to debug when something goes wrong."

**Takeaway:** Scale is now an anti-feature. A 350,000-skill marketplace is *worse* than a 500-skill marketplace if it makes discovery harder and degrades agent performance. The winning marketplace posture is "a curated 500" not "everything under the sun."

---

### 7. The Claude Skills share-button thread (Every.to + GitHub issue #228)

Source: https://every.to/vibe-check/vibe-check-claude-skills-need-a-share-button
Source: https://github.com/anthropics/skills/issues/228

Verbatim:

> **"The gap between 'I built a skill' and 'the skill works reliably' turned out to be wider than expected, especially when thinking about deploying skills across an organization."**

> **"Every change requires downloading the skill file, editing it locally, re-zipping it, and re-uploading."**

> Commenter proposal: "The every team should share a marketplace repo for these skills."

GitHub issue #228 "Enable org-wide skill sharing in Claude.ai" — quoted comments:

> **@jh-broad-reach (Jan 2026):** "Skills should be shareable within an organization directly. Currently users must download the .skill file, send it via Slack/Teams, and have colleagues manually navigate to Settings > Capabilities to upload. A shared skill library or direct sharing link would streamline this."

> **@eharris128 (Mar 2026):** "+1 on this. I would love to see this come to life. For now, implanting ad hoc solutions becomes worthwhile. Although painful."

> **@ehs5 (Mar 2026):** "Subscribed. We really need this."

> **@dub578 (Mar 2026):** "+1 we need this functionality bad for enterprise accounts where users don't have access to publish. At the very least add a feature to projects where we can add a skill to a project with edit access. That way, when we share the project with colleagues, it works like artifacts & instructions - All project users automatically get access to the most up to date skill and can update it themselves when needed"

**Takeaway:** There is explicit enterprise demand for **team/org skill distribution** with versioning, permissions, and auto-updates. This is a B2B product, not a consumer marketplace. The consumer marketplace is saturated; the team-distribution layer is not.

---

### 8. Cursor Rules are structurally broken — opening for "rules that actually work"

Source: https://forum.cursor.com/t/cursor-rules-do-not-work-well-anymore/145342

> **@mathisbarre:** "I feel like the agents won't use them at all. No wonder if I've set up the rule to always be applied or conditionally."

> **@mathisbarre:** "The only time it works is when I reference them manually like a classic file. But in this case, it's not a 'cursor rules', it's just a .md with instructions I can reference."

> **@Kovalsky:** "Each new agent doesn't 'read' my rules. I have to tell them."

> **@mathisbarre:** "The option doesn't even appear in '@' anymore, I need to go to parameters to manage my rules."

Cross-referenced on Cursor forum ("Cursor Rules not working anymore" - 151255, "For the past 2 weeks, Cursor has turned into a complete disaster" - 156446): widespread breakage across rules, skills, agents, commands after recent Cursor updates.

**Takeaway:** Cursor rules that "actually provably work" — distributed with test cases / evals — would be a differentiator. The raw `.mdc` file is not enough; the product is "rules + verification harness."

---

### 9. n8n workflow monetization is the one place real dollars flow

Sources:
- https://community.n8n.io/t/where-can-i-sell-my-n8n-workflow-i-am-looking-for-marketplaces-not-the-creator-hub/212963
- https://community.n8n.io/t/exploring-an-idea-marketplace-for-n8n-workflows-ai-automation-templates/273992
- https://www.managen8n.com/features/marketplace
- https://haveworkflow.com/
- https://medium.com/write-a-catalyst/i-built-5-n8n-automations-that-generate-3-200-month-passively-72e2a3050e17

Concrete monetization datapoints:

- **$19** — typical per-workflow price point across third-party n8n marketplaces
- **$3,200/month** — one creator's claim from 5 templates (Medium, Ravindu Himansha, March 2026). "I just packaged them properly, documented them clearly, and listed them where people who have those same problems would look for solutions."
- **First sale "caught me completely off guard"** — organic discovery, not marketing-driven. Suggests latent buyer demand is real even without distribution effort.

n8n community is actively asking for non-official marketplaces:

> n8n community post title itself: **"Where can I sell my N8N workflow? I am looking for marketplaces, not the Creator Hub"** (post 212963) — implies the official Creator Hub is not serving them.

> Another post title: **"Exploring an Idea: Marketplace for n8n Workflows & AI Automation Templates"** (post 273992) — users actively exploring new marketplace ideas.

Third-party marketplaces that exist and are charging:
- **ManageN8N** — positions itself as "previously there was no centralized, secure, or professional way to share and monetize workflows"
- **Have Workflow** — "sell pre-built workflows, reach a global audience of businesses seeking automation solutions"

**Takeaway:** n8n is the proven monetization surface. Developers WILL pay $19 for a workflow if it solves a concrete business problem (lead generation, content scheduling, data sync). Cursor rules and Claude skills do not have this price point — yet. The adjacency bet is: n8n workflows teach people to pay for automation templates, and that behavior can extend to Claude skills and Cursor rules *if* they are packaged around a concrete business outcome, not a generic coding convention.

---

### 10. PromptBase as a cautionary tale

Source: https://www.trustpilot.com/review/promptbase.com + blog coverage

> **"For the vast majority of sellers, the income is negligible, and when you factor in the time spent creating prompts, dealing with some dishonest buyers, handling fake reviews, and nonexistent support, the return is not worth it."**

> **"There are significantly more sellers than actual buyers."**

> "Contact support is non existent when you have a real issue, and there is manipulation with the payout system."

> Structural risks: "provenance (Who owns the output of the prompts?), piracy (Can prompts be distributed outside the platform?), quality (What if prompts don't produce what they say they will?)"

> Competitor behavior: "some marketplaces, like ChatX, will purchase prompts directly from prompt engineers and then sell them for free on their site to attract users."

**Takeaway:** PromptBase failed the two-sided marketplace liquidity test. The seller side scaled, the buyer side did not. The lesson: do not launch generic "AI prompts for sale." Launch with tightly scoped buyer personas who have a concrete pain and a budget (e.g., "Claude Code setups for Stripe integration testing" — not "AI prompts for productivity").

---

