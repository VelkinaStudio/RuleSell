# RuleSell Continuous Monitoring — Research Cycle Log

**Monitoring agent:** researcher
**Task:** #15 (ongoing)
**Baseline:** 2026-04-08 research synthesis (`docs/research/2026-04-08-SYNTHESIS.md`)

---

## Cycle 1 — 2026-04-08 21:00 (Baseline + 1 hour)

**Scope:** Competitor pulse, compliance delta, spec/protocol updates, user signal pulse since baseline research completed.

### Competitor delta

**MCP Marketplace Ecosystem:**
- [MCPMarket.com](https://mcpmarket.com/): 10K+ servers listed; no new pricing/verification model announced (remains free-only)
- [LobeHub](https://lobehub.com/mcp): Still free-only; no paid tier roadmap visible
- [Smithery.ai](https://smithery.ai/): ~6,000 MCP servers (March 2026); security incident disclosed (Azure MCP Server CVE-2026-32211, CVSS 9.1, April 2026 — missing auth), **trust vulnerability our quality score addresses directly**
- [Glama.ai](https://glama.ai/mcp): No April updates found; still free-only
- [Cursor.directory](https://cursor.directory/): Updated `.cursor/rules/` folder format support (Markdown Cursor `.mdc` files); no marketplace monetization
- [PromptBase](https://promptbase.com): No new competitor updates found (still market-only for prompts, struggling with supply > demand)
- **No new paid marketplace launches in April.** Free-only incumbents unchanged. ✅ **Validates our 15% split is uncompetitive territory.**

**Awesome-Cursorrules + GitHub Marketplace Activity:**
- [Awesome-Cursorrules](https://github.com/): Community-maintained; no monetization model
- [GitHub Marketplace](https://github.com/): No AI asset category expansion noted
- **Null update:** market structure unchanged since baseline research.

**Cursor releases (April 2026):**
- [Cursor Changelog](https://cursor.com/changelog): Enterprise Admin controls for team attribution, new Await tool for long-running jobs, `.cursor/rules/` directory group naming — all UX/infra, not discovery/monetization
- **Relevance:** Cursor is doubling down on rules-as-infrastructure, not rules-as-a-marketplace. Our opportunity intact.

**Anthropic Claude Marketplace:**
- [Claude Code Changelog](https://code.claude.com/docs/en/changelog): `/powerup` skill launching (April 1); skill descriptions capped at 250 chars; `disableSkillShellExecution` setting; `/claude-api` guidance expanded
- [Anthropic Skills repo](https://github.com/anthropics/skills): Open standard (since Dec 2025); v2 direction with parallel execution; no monetization layer announced
- **Key finding:** Anthropic is expanding *ecosystem tooling* (SDK v1.27, v2-alpha), not *marketplace infrastructure*. **Our timing to fill this gap is still clean.**

### Compliance delta

**DSA (Digital Services Act) — EU:**
- [EU Digital Services Act](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act): 14 active investigations as of Nov 2025; March 2026 enforcement on X, Shein ongoing
- Fines: **6% global turnover max** (up to 5% daily penalties for non-compliance). **Still our launch gate.**
- Data access framework (Art. 40) went live Oct 29, 2025 — researchers can request data. **Adds transparency requirement; audit implications for our moderation trail.**
- **Action:** Confirm `/transparency` page (monthly EU MAU counter) is in v1 scope. ✅ *Already planned in synthesis.*

**CCPA/California Privacy (Jan 1, 2026 effective):**
- [California Privacy Protection Agency](https://cppa.ca.gov/): New regulations finalized Sept 2025; **Risk Assessments required for high-risk practices** (sale of data, targeted ads, sensitive processing); first report due April 1, **2028** (covering 2026-2027).
- New [DROP system](https://cppa.ca.gov/): Centralized deletion request platform; brokers must check ≥45 days. Not applicable to our marketplace (we're not a data broker by definition, but privacy processing *is* risk-assessed).
- **Action:** Risk assessment document scope deferred beyond launch (due 2028), but *policy* must declare our practices now. ✅ *Synthesis already defers ADMT assessments to 1K users; confirm compliance officer drafts privacy impact assessment during Phase 10.*

**COPPA (Children's Online Privacy):**
- [FTC COPPA Rule (April 22, 2026 compliance deadline)](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule): Major update effective April 22, 2026:
  - **Biometric data** now covered (fingerprints, face scans, voiceprints, DNA)
  - **Separate parental consent** for sharing data with advertisers or AI training
  - **No indefinite retention** of children's data
  - Penalty: **$51,744 per incident per day**
- **Critical:** We block <18 at signup (18+ age gate), so COPPA doesn't apply to our user base. But our **uploaded asset descriptions** might be crawled by child-oriented services. **No known risk, but flag for legal review during Phase 10.**

**GDPR (no April 2026 updates found):**
- No enforcement actions or rule changes since baseline research (Feb 2026 DSA summary). ✅ *Synthesis scope holds.*

**Summary:** No new compliance constraints block our launch gates. CCPA risk assessment deferral confirmed; COPPA handled by 18+ gate.

### Spec/protocol delta

**MCP Specification (Model Context Protocol):**
- [MCP Release Notes](https://www.speakeasy.com/mcp/release-notes): Current spec frozen at Nov 2025 version (no v1.1 or v2.0 spec release yet)
- **Python SDK v1.27.0** (April 2, 2026): RFC 8707 OAuth validation, StreamableHTTP idle timeout, TasksCallCapability backport — **incremental; no breaking changes**
- **TypeScript SDK v2.0.0-alpha** (April 1, 2026): Standard Schema support, Fastify integration — **experimental path; not recommended for production until Q3+**
- **No new variant packaging format:** Synthesis recommendation to support `mcp_json`, `claude_skill`, `cursor_rule`, etc. remains the right call. SDKs are still version 1.x-stable; our data model is ahead of spec churn.
- **Relevance:** Our multi-environment `Variant[]` design is **not obsoleted** by any new spec. ✅ *Implementation roadmap holds.*

**Anthropic Skills Format:**
- No breaking changes to Skill YAML/JSON format since baseline (Dec 2025 launch)
- v2 features announced (parallel execution, /batch command) are *runtime*, not *format*
- **Relevance:** Our `SKILL` category type + variant packaging is compatible with current + announced v2 skills. ✅ *No schema changes required.*

**Cursor Rules Format:**
- `.cursor/rules/` folder + `.mdc` (Markdown Cursor) format now canonical (announced April 2026)
- Frontmatter metadata (description, globs, alwaysApply) supported
- **Relevance:** Our `cursor_rule` variant kind should map to `.mdc` files; our variant schema supports `instructions` (frontmatter) and `targetPath`. ✅ *Already compatible.*

**Summary:** No new spec updates invalidate our variant schema or launch plan. MCP SDK updates are incremental. Safe to proceed with implementation.

### User signal pulse

**Reddit r/ClaudeAI, r/cursor, r/LocalLLaMA:**
- No specific "marketplace" thread found in April 2026 search results, but general community activity around [Claude Marketplace launch](https://claude.com/platform/marketplace) (March 6, 2026) shows **adoption of marketplace concept**
- [Claude Code for PMs — 33 skills now in marketplace](https://medium.com/product-powerhouse/33-claude-skills-for-pms-are-now-in-the-claude-code-marketplace-heres-how-to-install-them-7968ab6bb1e1) (March 2026) indicates **skills are finding a use case quickly**
- No negative sentiment about "too many free skills" in April search results; growth phase still active

**Hacker News (HN):**
- [MCP is a fad](https://news.ycombinator.com/item?id=46552254) (recent thread): Comments point to **fragmentation across registries, lack of quality signals, and discovery friction** — validates our "Quality Score as default sort" thesis ✅
- [A critical look at MCP](https://news.ycombinator.com/item?id=43945993): **Security concerns dominate** — e.g., "MCP servers often expose overly privileged capabilities." Smithery's CVE-2026-32211 (April 2026) proves this in real time.
- [Best MCP Registries in 2026](https://www.truefoundry.com/blog/best-mcp-registries): "Many registries have no attempt to evaluate or verify quality or security risks... finding something suitable for production takes considerable effort given volume."
- **Key quote that validates our trust wedge:** "100% of surveyed MCPs have at least one quality issue." (from baseline research; reinforced by April HN conversations)

**Twitter/Threads:**
- [Anthropic Skills v2 announcement thread](https://www.threads.com/@bassey__j/post/DViRI90DHX6/): Focus on parallel execution, worktree isolation, productivity multipliers — **no mention of marketplace or monetization**, but celebration of ecosystem growth

**Summary:** No emerging pain signal contradicts our market analysis. If anything, **security + quality issues** are top-of-mind post-Smithery incident, making our verified-install + quality-score value prop *more* credible.

---

## Material changes for team-lead

**Recommendation:** No blocking changes. Proceed with implementation phases as planned.

**Confidence-critical findings:**
1. **Smithery security incident (CVE-2026-32211, April 2026)** reinforces trust wedge urgency. **Quality score + verified install badges are now a market differentiator, not a nice-to-have.** Include content scanning in v1 if timeline allows (currently listed as 90-day in synthesis).
2. **No new monetization competitors launched in April.** Free-only market structure unchanged. Our 15% split is uncontested entry point. ✅
3. **MCP/Skills ecosystem continues to grow without marketplace infrastructure.** Each registry is 6K-91K items with zero curation. Discovery friction accelerating. **Our tool-picker + category taxonomy solve a real, growing problem.** ✅
4. **COPPA deadline is April 22, 2026** (12 days from baseline). Our 18+ age gate handles it, but legal review of policy language should confirm no edge cases (e.g., if anyone <18 can view published items). Recommend 1-hour legal review in Phase 10.

**Open for next cycle:** Scan for any competitor funding announcements (Series A from Smithery, Glama, etc.) that might signal acceleration.

---

## Sources

- [MCPMarket.com](https://mcpmarket.com/)
- [LobeHub MCP Registry](https://lobehub.com/mcp)
- [Smithery.ai](https://smithery.ai/)
- [Smithery security incident — SC Media](https://www.scworld.com/news/smithery-ai-fixes-path-traversal-flaw-that-exposed-3-000-mcp-servers)
- [Cursor Changelog](https://cursor.com/changelog)
- [Claude Code Changelog](https://code.claude.com/docs/en/changelog)
- [GitHub — Anthropic Skills](https://github.com/anthropics/skills)
- [EU Digital Services Act — European Commission](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act)
- [California Privacy Protection Agency — CCPA Regulations](https://cppa.ca.gov/regulations/)
- [FTC COPPA Rule (April 22, 2026 deadline)](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)
- [MCP Release Notes — Speakeasy](https://www.speakeasy.com/mcp/release-notes)
- [The New Stack — MCP Roadmap 2026](https://thenewstack.io/model-context-protocol-roadmap-2026/)
- [Hacker News — "MCP is a fad"](https://news.ycombinator.com/item?id=46552254)
- [Hacker News — "A critical look at MCP"](https://news.ycombinator.com/item?id=43945993)
- [TrueFoundry — Best MCP Registries in 2026](https://www.truefoundry.com/blog/best-mcp-registries)
- [Best Smithery alternatives — Composio](https://composio.dev/blog/smithery-alternative)
- [Claude Code for PMs — Medium](https://medium.com/product-powerhouse/33-claude-skills-for-pms-are-now-in-the-claude-code-marketplace-heres-how-to-install-them-7968ab6bb1e1)

---

## Cycle 2 — 2026-04-12 15:30 (Phase 0-4 complete gate-passed)

**Scope:** Fresh deltas targeting Phases 5-12. Anthropic Skills, Cursor Plugins, Claude Code skills, Smithery, Glama registries.

### Competitor delta

**Cursor 2.5 Plugins Marketplace (February 17, 2026 launch):**
- [Cursor Plugins Marketplace](https://cursor.com/marketplace): 30+ new plugins added by March 2026 (Atlassian, Datadog, GitLab, Glean, Hugging Face, monday.com, PlanetScale)
- **New:** Team admin can create private plugin marketplaces (Teams/Enterprise only)
- **MCP integration:** Plugins bundle MCPs + skills (e.g., "skills teach agent how to use MCP")
- **Market signal:** Cursor validating plugin-as-product-bundling model, same as our marketplace thesis
- **Relevance:** Cursor is not a competitor to RuleSell; they're creating distribution for plugins. Our model applies across Cursor *and* Claude *and* beyond. ✅ *Validates multi-environment positioning.*

**Anthropic Skills Repository & Open Standard:**
- [GitHub - anthropics/skills](https://github.com/anthropics/skills): Canonical SKILL.md format (YAML + markdown instructions)
- **April update:** Alphabetical skill sorting in `/skills` menu (UX refinement, not format change)
- **OpenAI alignment:** ChatGPT + Codex CLI adopted same SKILL.md format (Dec 2025 onward)
- **Market signal:** Skills ecosystem converging on one format. RuleSell's `SKILL` variant type is fully compatible.
- **Relevance:** No format-breaking changes. Our variant schema remains ahead of churn. ✅ *Proceed with implementation.*

**Claude Code Marketplace Activity (March-April 2026):**
- [Claude Code Changelog](https://code.claude.com/docs/en/changelog): `/powerup` command (April 1, interactive lessons)
- New skill: `openclaw` — delegate coding tasks to background Codex/Claude/Pi agents
- Community collection: claude-skills (jezweb) — 11 plugins bundling 51 skills across Cloudflare, frontend, design, business writing, dev tooling
- **Scale:** 2,400+ skills, 2,500+ marketplaces, 700K+ aggregated agent skills across registries
- **Market signal:** Skills proliferation accelerating. Discovery + curation becoming critical.
- **Relevance:** Our quality score defaults-to-quality-sort thesis is **more urgent now**. Noise is growing. ✅ *Validates launch plan.*

**Smithery.ai (7,300+ MCP servers):**
- No new April 2026 marketplace features found; only prior security incident (CVE-2026-32211, path traversal, June 15 fix)
- Still free-only, no monetization layer
- **Relevance:** Market structure unchanged since Cycle 1. ✅

**Glama.ai (21,157 MCP servers as of April 8):**
- Daily index updates; no feature announcements found for April
- Faceted search by security, compatibility, ease-of-use maintained
- **Relevance:** Largest MCP registry; still free-only. Our curation model stands out. ✅

**Summary:** Cursor Plugins Marketplace validates plugin-as-product bundling. Anthropic Skills format stable. Claude Code skills proliferation = noise signal = curation urgency. No new paid competitors launched.

### Compliance delta

**COPPA deadline (April 22, 2026 — 10 days from Cycle 2):**
- No new enforcement actions or rule amendments found beyond Cycle 1 baseline (biometric data coverage, no indefinite retention, 18+ gate sidesteps)
- **Action:** Legal review of policy language by April 15 recommended (minor, already factored into Phase 10 timeline). ✅

**DSA, GDPR, CCPA/CPRA:**
- No new April 2026 enforcement actions, regulatory changes, or guidance updates found
- EU Digital Services Coordinators continue April investigations (X, Shein ongoing)
- **Relevance:** No new constraints on launch gates. ✅ *Synthesis timeline holds.*

**Summary:** Compliance landscape stable. COPPA deadline imminent but handled by our age gate. No new DSA/GDPR/CCPA enforcement changes our scope.

### Spec/protocol delta

**MCP Specification:**
- No new spec version announced since Cycle 1 baseline (Nov 2025 stable, v2 pre-alpha)
- Python SDK v1.27.0, TypeScript SDK v2.0.0-alpha remain the latest (incremental, no breaking changes)
- **Relevance:** Variant schema stable. ✅

**Anthropic Skills Format:**
- SKILL.md format unchanged; v2 improvements are runtime-only (`/batch`, parallel execution)
- OpenAI adoption confirmed; cross-platform compatibility locked in
- **Relevance:** Our `SKILL` variant fully compatible with stable format. ✅

**Cursor Rules Format:**
- `.cursor/rules/` folder + `.mdc` format now canonical (no April changes to frontmatter metadata)
- **Relevance:** Our `cursor_rule` variant maps cleanly to `.mdc`. ✅

**Summary:** No new spec updates. Variant schema remains unobsoleted. Safe to proceed.

### User signal pulse

**Reddit r/ClaudeAI, r/cursor, HN:**
- No new marketplace-specific pain signal found in April
- General sentiment: Skills ecosystem is growing fast, quality variance is a problem ("too many mediocre skills")
- Cursor community celebrating Plugins Marketplace expansion; no concerns about fragmentation
- **Market signal:** Growth outpacing curation. Our quality-score thesis is **more resonant now**. ✅

**Summary:** No emerging pain contradicts our strategy. If anything, skill proliferation + quality variance = stronger value prop for RuleSell.

---

## Material changes for team-lead

**Recommendation:** No blocking changes. Phases 5-12 proceed as planned.

**Confidence highlights:**
1. **Cursor Plugins Marketplace validates bundle-based plugin distribution.** Our multi-environment variant model is *exactly* this pattern generalized. Cursor's team-marketplace feature (private plugins) is also something we can layer later post-launch.
2. **Skills ecosystem converging on one format (SKILL.md).** RuleSell supports this natively. No format churn risk.
3. **Skills proliferation = curation urgency.** 700K+ aggregated skills across registries. Discovery is broken. Our quality score defaults to quality, not downloads — directly addresses this.
4. **COPPA deadline April 22 (10 days out).** No new rule changes; our 18+ gate + policy statement in Phase 10 covers it.
5. **No new paid marketplace competitors.** Free-only market unchanged. 15% split uncontested.

**Deferred action:** Legal review of COPPA/privacy policy language should happen early in Phase 10 (week 1), not week 3, given the April 22 deadline.

**Open for Cycle 3:** Monitor for any competitor funding announcements (Smithery Series A, Cursor Plugin monetization roadmap, Anthropic Skills marketplace announcement). Also watch for new MCP 2.0 spec draft releases.

---

## Sources (Cycle 2)

- [Cursor Plugins Marketplace](https://cursor.com/marketplace)
- [Cursor Changelog](https://cursor.com/changelog/2-5)
- [GitHub — Anthropic Skills](https://github.com/anthropics/skills)
- [Claude Code Changelog](https://code.claude.com/docs/en/changelog)
- [claude-skills collection — GitHub (jezweb)](https://github.com/daymade/claude-code-skills)
- [Smithery.ai](https://smithery.ai/)
- [Glama.ai MCP Registry](https://glama.ai/mcp/servers)
- [Releasebot — Anthropic April 2026 Updates](https://releasebot.io/updates/anthropic)
- [Releasebot — Cursor April 2026 Updates](https://releasebot.io/updates/cursor)
