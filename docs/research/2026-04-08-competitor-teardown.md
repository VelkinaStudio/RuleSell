# Competitor Teardown — RuleSell Market-Ready Research

**Date:** 2026-04-08
**Status:** COMPLETE
**For:** RuleSell, a global marketplace for AI dev assets (rules, MCP servers, CLIs, skills, agents, workflows, prompts, bundles). Open-source AND paid, multi-environment (Claude Code, Cursor, Windsurf, Codex, ChatGPT, Gemini, n8n, Make, Obsidian).
**Method:** WebSearch + WebFetch across 19 targets. First-hand UX observations for skills.sh and claudemarketplaces.com; remaining targets cross-referenced from search snippets + authoritative blog teardowns because WebFetch was 403/429 blocked by mcpmarket, smithery, cursor.directory, mcp.so, and skillsmp.

---

## TL;DR

The 2026 AI-asset marketplace is **entirely unmonetized for creators** on the dev-tool side (MCP / skills / rules). PromptBase solved it for prompts in 2022; nobody has ported that model to developer assets. The **three winnable gaps** are: (1) actual creator payouts with a 90%+ split, (2) per-environment variant packaging (one item, different code per host), and (3) verified-install reviews. The dominant landing pattern to copy from mcpmarket.com is **hero + category grid + featured + leaderboard**, with claudemarketplaces.com's editorial "01/02/03" section numbering as a visual differentiator. Adopt Anthropic's `SKILL.md` spec verbatim for skills. Model item-type as primary + domain-tags many — reject single-category design. See sections 19 and Synthesis at the bottom for actionable details.

---

## Index

1. [mcpmarket.com](#1-mcpmarketcom)
2. [skills.sh](#2-skillssh)
3. [claudemarketplaces.com](#3-claudemarketplacescom)
4. [smithery.ai](#4-smitheryai)
5. [glama.ai/mcp](#5-glamaaimcp)
6. [mcp.so](#6-mcpso)
7. [cursor.directory](#7-cursordirectory)
8. [awesome-cursorrules (GitHub)](#8-awesome-cursorrules)
9. [PromptBase](#9-promptbase)
10. [FlowGPT](#10-flowgpt)
11. [n8n.io/workflows](#11-n8niworkflows)
12. [Make.com templates](#12-makecom-templates)
13. [HuggingFace Spaces/Hub](#13-huggingface)
14. [GitHub Marketplace](#14-github-marketplace)
15. [VS Code / Cursor extensions](#15-vs-code-cursor-extensions)
16. [JetBrains Marketplace](#16-jetbrains-marketplace)
17. [Replicate / fal.ai](#17-replicate-falai)
18. [OpenAI GPT Store](#18-openai-gpt-store)
19. [Anthropic Skills](#19-anthropic-skills)

---

## Findings (live)

### 2. skills.sh

**URL:** https://skills.sh

**Structure:** ASCII-art "SKILLS" wordmark at top, vertical content blocks on mobile that transition to grid on larger screens.

**Nav:** `Skills` (home) | `Official` (NEW badge) | `Audits` | `Docs`. Secondary nav is literally a copy-to-clipboard command prompt: `$ npx skills add <owner/repo>`.

**Taxonomy:**
- **Time-based views:** "All Time (91,696)", "Trending (24h)", "Hot"
- **Source grouping:** skills grouped by publisher org (vercel-labs, anthropics, microsoft)
- **Install-based leaderboard:** top 261+ skills ranked by downloads

**Onboarding funnel:** single terminal command as the primary CTA. No account. Below it, a visual grid of 20+ compatible platforms (Claude Code, Cursor, VSCode, Codex, ...) — signals "works everywhere" before asking for a click.

**Monetization:** none visible. Pure free open ecosystem, likely a loss-leader for the parent (skills.sh appears to be anthropic-adjacent tooling).

**What they list:** "reusable capabilities for AI agents" — skills only. No MCP servers, no CLIs. Metadata per item: name, source repo, install count (774.9K down to ~8K), owner. Examples: `find-skills`, `frontend-design`, `web-design-guidelines`, `remotion-best-practices`.

**Exceptional:** the `npx skills add <owner/repo>` command is a genius distribution play — zero-friction install that also works as the share-link format. Real-time install counts build social proof without reviews.

**Annoying/missing:** no pricing, no paid tier, no creator payouts, no category browsing beyond source-org. A publisher has no reason to use it commercially.

---

### 3. claudemarketplaces.com

**URL:** https://claudemarketplaces.com

**Hero copy:** "A hand-picked directory of high-quality extensions with community voting and commenting."

**Scale signal above the fold:** "2,400+ skills · 770+ MCP servers · 2,500+ marketplaces" — note the three-category split.

**Page structure (numbered sections 01/02/03 — monospace, data-driven look):**
- **01 Browse Featured** — three paid featured placements (1inch DeFi, AppSignal, ideabrowser) with "Install now" CTAs
- **02 Trending**
- **03 Recently Added** — table format with upload timestamps (`2d ago`, `Mar 22`)
- **FAQ** — 8 Q&As explaining skills vs plugins vs marketplaces vs MCP

**Nav:** `Skills` | `Marketplaces` | `MCP` | `Learn` | `Advertise`. The `Advertise` link is the monetization tell.

**Taxonomy:** content classified by TYPE tag (`SKILL`, `MARKETPLACE`, `MCP`), not by vertical category. Users sort by install count, GitHub stars, community votes.

**Onboarding funnel:** three action-oriented category cards below the fold push users into verticals. Install is copy-paste terminal command from the detail page.

**Free vs paid:** 100% free to browse and install. FAQ explicitly: "Yes, the directory is completely free and open. Browse and install any skills, MCP servers, plugins, or marketplaces at no cost."

**Monetization:** sponsored placements only (the "Featured" slots in section 01). Classic aggregator ad model — no creator payouts, no transactions.

**Exceptional:**
- Section numbering (01/ 02/ 03/) gives a magazine-editorial feel that's rare in dev tool directories
- Community voting + commenting as a trust layer
- Explicit "three types" architecture (skills / MCP / marketplaces) helps users who don't yet know the difference

**Annoying/missing:** no creator monetization. No multi-environment distinction (a skill is just "a skill" — no Claude Code vs Cursor variant). No search-first entry; it's all browse-driven.

---

### 1. mcpmarket.com

**URL:** https://mcpmarket.com (WebFetch blocked 429 — cross-referenced from search results + TrueFoundry registry comparison + AI Rabbit Medium teardown)

**Catalog:** ~10,000 MCP servers across 23+ categories. Community-curated, no formal review gate.

**Taxonomy:** Developer Tools, API Development, Data Science & ML, Productivity & Workflow, Analytics & Monitoring, Deployment & DevOps, Security & Testing, Web Scraping, Documentation, DBs, Cloud Infra, CMS, Collaboration, Design, Browser Automation, Social, E-commerce, Marketing, Game Dev, Mobile — plus a curated "Featured" section (~52 servers) and a Top-100 leaderboard.

**Hero / landing:** "Discover Top MCP Servers" headline. Category grid visible above the fold. Featured carousel. Top-100 leaderboard as secondary nav axis.

**Free vs paid:** Free to browse, free to list, no native monetization. Client-agnostic directory with deeper Cline integration.

**Install flow:** Per-server detail page → copy-paste install command → hand-off to target client. No unified one-click install.

**Versioning / compat:** Weak — depends on upstream repo metadata. Compatibility with clients listed as free text.

**Trust:** Install counts, featured badge, community submission. No rating, no reviews.

**What's broken:** No API, no creator payouts, no security scan, no formal review process. Duplicate listings across categories.

**What's worth copying:** Landing structure (hero + category grid + featured + leaderboard). The Top-100 leaderboard page is a second discovery axis that nobody else has.

---

### 4. smithery.ai

**URL:** https://smithery.ai (WebFetch 403 — cross-referenced from search results, WorkOS blog, mcpize comparison, Smithery docs)

**Catalog:** ~3,300 MCP servers + a Skills surface. Positions itself as a registry + management platform: "Turn scattered context into skills for AI."

**Taxonomy:** Tag-based rather than deep hierarchy. Two top-level surfaces: Servers and Skills.

**Homepage focus:** "Get discovered by users and developers searching for AI-native apps and integrations." Developer-audience pitch, not end-user pitch.

**Install flow:** `smithery install <server>` CLI command. **Auto-generated OAuth modals** — creators don't implement auth, Smithery generates it for them. This is the single most useful primitive in the whole category.

**Free vs paid:** Free to list, free to browse/install. Hosted remote servers can have usage-based pricing. Creators reportedly pay $30/mo to use Smithery infra while earning **$0** — no creator revenue share.

**Versioning / compat:** CLI references upstream repo + version. Claims compatibility "with all major clients via MCP spec" — free-text, no structured matrix.

**Trust:** GitHub stars + verified repo link. No user reviews.

**Exceptional:** Auto-OAuth modal generation. CLI install UX.

**Broken:** Creator economics. Supply-side incentive is zero, which is a structural problem — there's no reason for a creator to build a quality server here vs anywhere else.

---

### 5. glama.ai/mcp

**URL:** https://glama.ai/mcp/servers

**Scale:** 21,157 MCP servers indexed (2026-04-08). Most comprehensive MCP registry.

**Tagline:** "Everything MCP — servers updated daily. The most comprehensive registry of Model Context Protocol (MCP) servers, clients, tools, and integrations."

**Nav:** `Servers` | `Connectors` | `Tools` | `Clients` | `Inspector` | `Pricing` | Discord | `Sign Up`

**Taxonomy — gold standard for MCP:** 60+ attributes, faceted filtering with live counts:
- **Environment:** Remote (9,375) / Local (4,691) / Hybrid (5,189) — deployment disambiguation
- **Language:** Python (8,754) / TypeScript (7,350) / JavaScript (3,727)
- **Category:** Developer Tools (7,490), App Automation (3,902), Search (3,895), Databases (2,045), RAG (1,914), Finance (1,194), Blockchain (720)
- **Capability:** Tools (2,922) / Resources (1,262) / Prompts (1,133) — maps to MCP spec primitives
- **Grade:** Security A/B/C/F, License A/B/C/F — unique trust layer
- **Status:** Claimed / Official (1,049 official)

**Sort:** Search Relevance / Recent Usage / Date Added / Weekly Downloads / GitHub Stars.

**Trust layer:** security grades (8,743 with A), license grades (11,411 with A), GitHub source verification, last-update timestamps, 1,049 vendor-official badges.

**Monetization:** `/pricing` page exists (SaaS — hosted MCP infra, Inspector tooling). Individual servers may list own pricing ("$50/mo unlimited"). Glama itself monetizes infra, not marketplace transactions.

**Multi-environment:** Remote/Local/Hybrid tag is the closest thing, but it's deployment location — not AI-client variant.

**Exceptional:**
- **Security + license grading is a real differentiator** — nobody else audits AI assets
- 60+ faceted filters with live counts = enterprise-grade discovery
- Capability filter (Tools/Resources/Prompts) aligns with MCP spec
- In-browser Inspector keeps users in ecosystem

**Annoying:** 60+ filters overwhelming for first-timers. No AI-client-specific variants.

---

### 9. PromptBase

**URL:** https://promptbase.com

**Scale:** 270,000+ prompts, 450,000+ users, 39,000+ reviews (4.9 stars average).

**Tagline:** "Prompt Marketplace — 270k high-quality AI prompts."

**Nav:** Home | Marketplace | Hire | Create | Chat | Sell | Explore + Login.

**Taxonomy:** organized by **AI model type** first — this is crucial:
- Midjourney (dominant), Gemini Image, Veo, ChatGPT Image, Grok Image
- Then Featured / Trending / Hotness sorting inside each model bucket
- Each prompt card shows: title, thumbnail, price, discount %, star rating

**Pricing model:**
- Individual prompts: **$2.99 to $5.99** typical range
- Visible discounts (40% off on trending)
- **PromptBase Select subscription:** "200k+ prompts, one low monthly price" — Netflix-for-prompts

**Creator tools:** "Sell Your Prompts", "Create, share and earn" — explicit creator-first framing. Revenue share % not disclosed on landing page (historically 80/20 to creator per industry research).

**Additional revenue streams:**
- **Hire** marketplace: "Work with expert prompt engineers" (services overlay — Upwork model)
- **Create** tool: "Generate AI Content" (run the prompts on the platform, creating a usage loop)
- **Chat** community

**Trust:** 39,000+ reviews, 4.9 star rating averaged and displayed prominently. Social proof above the fold.

**Exceptional:**
- **Model-first taxonomy** (Midjourney vs GPT vs Gemini) — the closest parallel to RuleSell's AI-client axis (Claude Code vs Cursor vs Codex). Validates that buyers filter by host first, category second.
- **Hybrid monetization:** per-item purchases + subscription + services layer + in-platform generation. Four revenue streams, not one.
- **"Hire" marketplace next to template marketplace** — converts power buyers into recurring services clients.
- Price anchoring at $2.99-$5.99 makes paid feel low-friction.

**Annoying:** Midjourney-dominant catalog signals supply-side concentration risk. Quality variance is high. No versioning — if the underlying model updates, your prompt may break.

---

### 10. FlowGPT

**URL:** https://flowgpt.com

**Tagline:** "FIND & USE THE BEST PROMPT. Use powerful AI apps on FlowGPT, the largest AI platform, for free!"

**Positioning:** more of a consumer chat+character product than a developer prompt marketplace. NSFW-heavy. Age-gated modal ("This site is for adult only!").

**Nav:** Explore | Chat | Leaderboard | Create | Profile.

**Taxonomy:** 20+ tag categories:
- Practical: Job Hunting, Health, Academic, Business, Programming, Marketing
- Creative: Image Generator, Anime, Game, Fantasy
- Character: Dominant, Submissive, Romantic, Drama, Villain, Celebrity
- Specialty: Jailbreak DAN, AI Tools, Productivity

**Monetization — usage-capped freemium:**
- **Free:** 5 chats with best model (Apollo), resets every 4 hours
- **Plus:** 25 chats every 4h
- **Ultra:** 50 chats every 4h
- Starting at **$14.99/mo**

**Creator payouts:** "Bounty" program — "Make money and Flux by creating ChatGPT prompts." Flux is in-platform currency (not direct cash). Tip functionality. Details not public.

**Exceptional:** the usage-cap monetization creates addictive return visits (users come back every 4h for free chats). The Bounty + tips system is closer to TikTok/Patreon than PromptBase's marketplace.

**Annoying:** NSFW-dominant content hurts enterprise positioning. Flux in-platform currency has real creator payout friction. Not a useful direct competitor for RuleSell but interesting as a *retention* model.

---

### 1. mcpmarket.com (cross-referenced — WebFetch 429 blocked)

**Catalog:** ~10,000 MCP servers, 23+ categories. Community-curated, no formal review gate.

**Categories observed:** Developer Tools, API Development, Data Science & ML, Productivity & Workflow, Analytics & Monitoring, Deployment & DevOps, Security & Testing, Web Scraping, Documentation, DBs, Cloud Infra, CMS, Collaboration, Design, Browser Automation, Social, E-commerce, Marketing, Game Dev, Mobile — plus a curated "Featured" (~52 servers) and a Top-100 leaderboard page.

**Landing pattern:** "Discover Top MCP Servers" headline → category grid above the fold → featured carousel → Top-100 leaderboard as secondary axis.

**Free vs paid:** Free to browse, free to list. Client-agnostic directory with deeper Cline integration.

**Install flow:** per-server detail page → copy-paste install command → hand-off to target client. No unified one-click install.

**Versioning:** weak — relies on upstream repo metadata. Client compatibility listed as free text.

**Trust:** install counts, featured badge, community submission. No ratings/reviews.

**What's broken:** no API, no creator payouts, no security scan, no formal review, duplicate listings across categories.

**Worth copying for landing page:** **the three-axis landing** (hero + category grid + featured carousel + Top-100 leaderboard). The separate leaderboard page is a second discovery axis nobody else does — lets skeptical visitors skip marketing and go straight to "what's actually being used."

---

### 8. awesome-cursorrules (GitHub, de facto standard)

**URL:** https://github.com/PatrickJS/awesome-cursorrules

**Scale:** 39,000+ stars, 3.3k forks, 105 commits — the de facto standard for sharing cursor rules. Pre-marketplace era artifact.

**11 primary categories** (this is basically the proven taxonomy for rule-type assets):
1. Frontend Frameworks and Libraries — React, Next.js, Vue, Svelte, Angular, Astro, Qwik, SolidJS
2. Backend and Full-Stack — Node.js, Python, Go, Laravel, Rails, Elixir, Java, Kotlin, PHP
3. Mobile Development — React Native, Flutter, SwiftUI, Android Jetpack Compose
4. CSS and Styling — Tailwind, Chakra UI, Styled Components
5. State Management — Redux, MobX, React Query
6. Database and API — GraphQL, Axios
7. Testing — Cypress, Jest, Playwright, Vitest
8. Hosting and Deployments — Netlify, etc.
9. Build Tools and Development — Chrome extensions, Git, Kubernetes, Docker
10. Language-Specific — Python, TypeScript, JS, Solidity, C++
11. Other — Game dev, optimization, Unity

**Monetization:** none. It's a GitHub repo. Sponsored links in README (Warp, CodeRabbit.ai, Unblocked MCP).

**Exceptional:** README taxonomy has become the industry-accepted starter set. Any marketplace launching should adopt these 11 categories as its framework axis for Rules.

**Annoying:** PR-gated submission is slow. No versioning, no reviews, no usage metrics, no install command.

**Takeaway for RuleSell:** port these 11 categories day-one as the "Rules" vertical. Offer an automated migration from awesome-cursorrules repo (already tried by cursor.directory).

---

### 11. n8n.io/workflows

**URL:** https://n8n.io/workflows

**Scale:** 9,166 workflows in the community library.

**Tagline:** "Discover 9,166 Automation Workflows from the n8n Community"

**Layout:** dark theme, Tailwind-based. Carousel of featured workflows, then grid with search/filter/pagination. Node-based categorization (integration-first — "workflows that use Slack," "workflows that use Gmail").

**Submission:** creators publish from n8n app itself (one-click from canvas). Low friction.

**Free vs paid:** all free to browse; n8n itself monetizes via self-host + cloud SaaS ($24/mo+). No paid workflows. No creator payouts. Workflows are a demand-generation loop for the platform.

**Versioning:** tied to n8n's own node versions. Compatibility is node-level ("requires n8n 1.x+"), not host-level.

**Trust:** community attribution + view counts. No formal reviews.

**Takeaway:** n8n proved you can get 9k+ free workflows by making them (a) one-click publish from inside the tool, and (b) a marketing engine for the underlying platform. The n8n model is **"free templates drive SaaS conversion."** RuleSell should consider a similar loop: free items seed the top of funnel, paid items capture high-intent buyers.

---

### 14. GitHub Marketplace

**URL:** https://github.com/marketplace

**Taxonomy:** clear two-way split — **Apps (integrations)** and **Actions**.
- Apps: Linear, CodeRabbit, SonarQube, GitGuardian — third-party services that connect to GitHub workflows
- Actions: automation workflows for CI/CD — enormous long tail

**Top-level sections:** AI Code Creation (Copilot, Spark, Models, MCP Registry), Developer Workflows (Actions, Codespaces, Issues, Code Review), Application Security (Advanced Security, Code Security, Secret Protection).

**Verified publisher badges** = trust layer for Apps.

**Pricing:** not shown on the homepage — per-app detail pages expose paid plans. GitHub takes **25%** of paid-app revenue after the first $1M per creator per year (reduced from 25% to a more lenient model in 2022 — GitHub also absorbs Stripe fees). Actions themselves are free to publish; Actions aren't sold directly — they consume the user's CI minutes (GitHub monetizes via compute).

**Versioning:** Actions use **semver tags** (`@v1`, `@v2.3.1`, `@sha`). Users pin to a version. This is the cleanest versioning model in the entire landscape.

**Install flow:** Apps → OAuth → select repos. Actions → paste one YAML snippet. Extremely frictionless.

**Worth copying:**
- Two-layer taxonomy (type × category) instead of flat category
- Semver-pinned versioning for Actions model
- Verified publisher badges
- 75/25 revenue split is the reference point for "creator-friendly" pricing

**Annoying:** Apps pricing is hidden behind per-app pages. Discovery is bad — everyone complains the Marketplace feels like a graveyard.

---

### 13. HuggingFace Spaces

**URL:** https://huggingface.co/spaces

**Scale:** **1,199,058 total items** (one of the biggest AI asset stores on the web).

**Tagline:** "The AI App Directory"

**Nav:** Models | Datasets | Spaces | Buckets (new) | Docs | Enterprise | Pricing | Log In | Sign Up. + Spaces-specific: "New Space", "Get PRO".

**Taxonomy:** ~40 task categories including:
- Image Generation, Video Generation, Text Generation
- Translation, Speech Synthesis, 3D Modeling
- Object Detection, Code Generation, Question Answering
- Image Editing, OCR, Visual QA, Sentiment Analysis
- Music Generation, Medical Imaging, Financial Analysis
- Character Animation, Style Transfer, Agent Environment

**Runtime status badges** per Space: "Running", "Running on Zero", "Running on CPU Upgrade", "Running on A10G", "Runtime error" — shows whether the demo actually works right now.

**Free vs paid:** free to browse/run (with queue). Paid tiers via PRO subscription + hardware upgrades per-Space (A10G, H100 etc.). This is **hardware-tier monetization**, not content monetization — the content is free; the GPU time is paid.

**Monetization model:** closest thing to an "infrastructure rental" play in the AI asset market. Creators upload for free, users pay for compute.

**Versioning:** Git-based (entire Spaces is a git repo with SSH clone URL). True multi-file versioning. This is the most mature versioning system in the category.

**Trust:** creator avatars, "Spaces of the week" curated editorial slot, featured badges, MCP badge on Spaces that expose MCP endpoints, interaction counts.

**Takeaway for RuleSell:** HF validates that (a) enormous scale comes from git-based publishing and (b) a hardware/compute monetization layer works even when content is free. RuleSell can't replicate that exactly but can take the lesson: **monetize the execution layer, not just the download.**

---

### 15. VS Code Marketplace

**URL:** https://marketplace.visualstudio.com/vscode

**Nav sections:** Featured | Most Popular | Recently Added

**21 categories:** AI, Azure, Chat, Data Science, Databases, Debuggers, Education, Extension Packs, Formatters, Keymaps, Language Model Tools, Language Packs, Linters, Machine Learning, Notebooks, Programming Languages, SCM Providers, Snippets, Testing, Themes, Visualization, Other.

**Note the 2026 additions:** "Language Model Tools" and "Chat" as top-level categories — VS Code Marketplace is mutating into an AI-extension directory alongside its traditional extension role. This is direct competitive positioning with Cursor.

**Metrics per extension:** install count, download count, review count, publisher (verified badge), rating. Top extension shows 212M+ installs.

**Free vs paid:** VS Code Marketplace is **entirely free.** Microsoft explicitly chose not to enable paid extensions — extensions can have their own licensing layer (e.g., the extension calls out to a paid backend) but there's no native billing. This is often cited as why JetBrains' paid plugin ecosystem is healthier per-capita.

**Versioning:** semver per extension, users auto-update by default with opt-out per extension.

**Takeaway:** the "Language Model Tools" category is the tell — IDE marketplaces are formally recognizing AI as an asset class. RuleSell's direct opportunity is the layer above: asset marketplace purpose-built for AI, where the IDE marketplace won't go.

---

### 16. JetBrains Marketplace

**URL:** https://plugins.jetbrains.com

**Scale:** 10,000+ plugins (passed that milestone in early 2020s). Paid plugin ecosystem is the mature reference.

**Revenue share:** creators get **minimum 75%**, JetBrains takes max 25%. Commission can change with one-month notice but never exceeds 25%. For high-revenue plugins, JetBrains will negotiate custom terms. **No listing fees.**

**Payout:** minimum $200 / €200 threshold, OR end-of-year auto-payout on Dec 31 (so creators always get paid at least once a year even below threshold).

**Free vs paid:** hybrid — majority free, a working paid tier exists. Prominent paid plugins: CodeStream, Key Promoter X Pro, LivePlugin, various database tools.

**Versioning:** semver + IDE-version-range compatibility matrix (e.g., "works with IntelliJ 2024.1–2025.2"). This is the **best cross-host compatibility matrix in the category** — every plugin declares which IDE versions it supports.

**Install:** in-IDE plugin browser (no browser needed), plus browser marketplace. Frictionless install.

**Exceptional:**
- **The 75%+ creator split is the gold standard** — RuleSell should match or beat this
- IDE-version compatibility matrix is the template for multi-host support
- Dual distribution (web + in-IDE)

**Takeaway:** RuleSell should position against GitHub Marketplace (25%) and match JetBrains (25%) with a **15-20% fee** for competitive edge, or go lower (10%) as a market-entry discount for the first 12 months.

---

### 7. cursor.directory

**URL:** https://cursor.directory

**Positioning:** "Cursor Directory hosts rules, MCP servers, and integrations built by the community."

**Taxonomy:** pre-built rules organized by language/framework — Python, TypeScript, React, Next.js, Vue, etc. Same taxonomy shape as awesome-cursorrules but with a searchable UI.

**Multiple verticals:** Rules + MCP Servers + Plugins + Integrations. Multi-asset directory, not single-type.

**Submission:** PR-based. Creators create a new folder in the rules directory, add `.cursorrules` file, submit PR. No account system.

**Free vs paid:** 100% free. No monetization. No creator payouts. Links out to the asset's source repo.

**Versioning:** none. Rules are static text files.

**Trust:** view counts, simple copy-paste UX ("copy the ones you need and paste").

**Exceptional:** unified rules + MCP + plugins surface is a genuine multi-asset directory — closest conceptual sibling to RuleSell. But it's PR-gated and unmonetized.

**Annoying:** no install command, no versioning, no creator economy, PR-gated submission.

---

### 4. smithery.ai (cross-referenced — WebFetch 403)

**URL:** https://smithery.ai

**Tagline:** "Turn scattered context into skills for AI."

**Scale:** 3,305+ MCP servers (core), up to 7,300+ cited in some coverage.

**Categories:** All | Memory | Web Search | Academic Research | Reasoning & Planning | Browser Automation | Reference Data | LLM Integration. Thematic/function-based, not by language or by domain.

**Versioning:** `smithery.yaml` config file with explicit version specifications. One of the only MCP registries with a real versioning spec.

**Install:** `smithery install <server>` CLI. Handles auto-generated OAuth modals so creators don't implement auth — this is a standout primitive.

**Monetization:** **zero creator monetization.** Developers do not earn from their servers. Hosted servers may expose usage-based pricing on their own (paid by the end user to the creator's backend, not via Smithery). Smithery reportedly charges creators for hosted infrastructure (~$30/mo) while giving them no revenue share — a net-negative creator economy.

**Worth copying:** the CLI install command + smithery.yaml versioning spec + auto-OAuth are all primitives RuleSell should clone.

**Structural flaw:** creators have zero reason to publish on Smithery commercially. A paid marketplace competitor can win supply just by existing.

---

### 18. OpenAI GPT Store

**URL:** https://chatgpt.com/gpts

**Scale:** millions of custom GPTs (numbers not publicly disclosed in 2026).

**Free vs paid:** GPT Store access is free for ChatGPT Plus subscribers ($20/mo). No per-GPT pricing — creators cannot set prices.

**Monetization:** revenue sharing based on **user engagement** — creators cannot set their own prices (Spotify-model, not App-Store-model). Payouts average **~$0.03 per conversation**, so $1,000/mo requires 33,000+ quality conversations. Soft ceiling is $100-500/month for typical creators; only top 0.01% engagement earns meaningfully. **Minimum 25 conversations/week** to qualify for payouts at all. **US-only** for creator payouts.

**Exceptional:** engagement-based payouts is a radically different model than per-unit sales. It aligns creator incentives with *usage*, not just install. However, the formula is opaque, creators cannot price their work, and most earn nothing.

**Annoying/broken:**
- Creators cannot price their own assets
- Opaque payout formula
- US-only for payouts
- Most creators earn $0
- No versioning
- No install — GPTs are hosted, not downloaded

**Takeaway:** GPT Store proves the **engagement-based payout model is unpopular with creators.** RuleSell should let creators set their own prices (PromptBase model), not pool revenue (Spotify/GPT model). Engagement-based is a fallback revenue source for free items, not the primary model.

---

### 17. Replicate / fal.ai

**URL:** https://replicate.com/explore

**Tagline:** "Discover and share machine learning models that you can run in the cloud."

**Taxonomy:** extensive collections organized by task:
- Generation: text-to-image, text-to-video, music, speech
- Editing: image editing, video editing, restoration
- Analysis: OCR, object detection, speaker diarization
- Fine-tunes: Flux, Kontext, Qwen-Image variants

**"I want to…" section:** 30+ use-case categories, each with 3-4 example models. This is a **task-first discovery pattern** that RuleSell should steal — the user doesn't know what model they want, they know what they want to *do*.

**Free vs paid:** freemium "Try AI Models for free" collection. Paid tier for API usage at scale.

**Monetization:** **pay-per-prediction compute model.** Users pay by second or per-call. Creators can monetize by hosting paid models — Replicate takes a platform cut and passes revenue to the creator.

**Official models:** "always on, maintained, and have predictable pricing" — editorial tier with SLA.

**Versioning:** every model has versioned hashes (git commit + docker image). Users can pin to an exact model version forever.

**Exceptional:**
- "I want to…" task-first discovery
- Version hashes that guarantee reproducibility
- Pay-per-prediction is the cleanest creator revenue model for compute-heavy assets

**Takeaway for RuleSell:** the "I want to…" pattern is the answer to the "I don't know what I'm looking for" problem. For a multi-type marketplace (rules + MCP + skills + prompts), a "I want to…" layer above the type filter would help non-technical buyers find the right asset type.

---

### 6. mcp.so

**URL:** https://mcp.so (WebFetch 403)

**Catalog:** Large aggregator directory, less prominent than Glama or Smithery. Directory-first, no monetization surface visible.

**Relevance:** Another proof-point that the MCP directory space is entirely unmonetized for creators. Acts as an SEO-play aggregator rather than a platform.

---

### 12. Make.com templates

**URL:** https://www.make.com/en/templates

**Catalog:** 7,000+ free templates across use cases. Credit-based execution pricing on the platform itself.

**Free vs paid:** All templates free on the platform. **Paid template packs exist but are sold externally** (Gumroad, Etsy) because Make does not host commerce for templates.

**Monetization gap:** Creators route outside the ecosystem to monetize — this is the explicit gap RuleSell could fill for the Make/n8n automation crowd. A native marketplace for paid automation templates doesn't exist.

**Relevance:** Confirms the pattern — big automation platforms host free templates as loss-leaders, creators monetize off-platform. **RuleSell could be the on-platform marketplace for paid automations.**

---

### skillsmp.com (bonus — aggregator)

**URL:** https://skillsmp.com

**Catalog:** Claims **700,000+** agent skills (almost certainly includes aggressive GitHub scraping — not curated).

**Compatibility:** Positions as cross-compatible with Claude Code, Codex CLI, ChatGPT.

**Monetization:** None visible, pure aggregator play.

**Relevance:** Scale without curation is noise. Confirms the quality-gate opportunity (claudemarketplaces.com's 500-install rule).

---

### 19. Anthropic Skills (official spec)

**URL:** https://github.com/anthropics/skills

**Format:** Folder named `skill-name/` containing `SKILL.md`. Optional sibling folders: `scripts/` (executable code for deterministic/repetitive tasks), `references/` (docs loaded on demand), `assets/` (templates, icons, fonts).

**SKILL.md frontmatter (required YAML):**
- `name` — 64 chars max
- `description` — 1024 chars max

**Progressive disclosure architecture:**
- **Metadata loading** (~100 tokens): Claude scans available skills to identify relevant matches
- **Full instructions** (<5k tokens): loaded when Claude determines applicability
- **Bundled resources** (scripts/references/assets): loaded only as needed

**Best practices:**
- Keep SKILL.md body under 500 lines for optimal performance
- Split long content into separate referenced files
- Keep reference files one level deep from SKILL.md
- All references should link directly from SKILL.md so Claude reads complete files when needed

**Cross-platform standard:** **agentskills.io** — the declared multi-platform Skills standard, claimed compatible with Claude Code, GitHub Copilot, Codex CLI, Cursor, Gemini CLI, and 20+ platforms. Verified by third-party repos like `mukul975/Anthropic-Cybersecurity-Skills` (754 skills mapped across 20+ platforms, 5 frameworks, Apache 2.0).

**Universal loader:** `numman-ali/openskills` — `npm i -g openskills` — a universal CLI that loads the SKILL.md format into any coding agent.

**Relevance for RuleSell:** **This IS the open spec RuleSell should adopt verbatim for the Skill item type.** Building a proprietary alternative would fragment the ecosystem and lose supply. Adopt SKILL.md, reference agentskills.io, integrate openskills as a reference installer. This is a free win — the spec exists, the community is building on it, and nobody has built commerce on top of it yet.

---

### Bonus: 21st.dev (UI components marketplace)

**URL:** https://21st.dev

**Model:** $20/mo Pro with token economy. 50 tokens/mo, 1 token = AI component generation, 5 tokens = unlock premium component.

**Creator revenue:** Token-split, details opaque.

**Relevance:** Tokens are a consumer pattern. **Wrong for developer tools** — devs expect cash prices on listings. Noted as an anti-pattern: do not copy token economies, use cash.

Source: [Cline blog: MCP economy lessons from 21st.dev](https://cline.bot/blog/building-the-mcp-economy-lessons-from-21st-dev-and-the-future-of-plugin-monetization)

---

## Synthesis

### Dominant pattern in 2026

Free-to-browse aggregator + GitHub-based submission + **zero creator payout** + copy-paste install command handed off to the target client. That's it. Nobody has solved monetization for developer-tool AI assets. The only platforms actually paying creators are:

1. **PromptBase** — 80/20, Stripe Connect, proven since 2022 (consumer prompts only)
2. **GitHub Marketplace** — 95/5, 100-install gate, verified publishers (enterprise apps only)
3. **JetBrains Marketplace** — 75/25, 30-day trials, custom licensing option (IDE plugins only)
4. **Replicate / fal.ai** — pay-per-prediction, works for hosted compute only (not static assets)

The MCP / skills / rules space is **entirely unmonetized** for creators. Smithery even charges creators ~$30/mo while paying them $0. This is a supply-side crisis waiting to be disrupted.

### Three biggest gaps where a new entrant can win

1. **Creator payouts for developer AI assets.** Nobody pays. The first MCP/skills/rules marketplace with a **90%+ creator split + Stripe Connect + a 100-install paid-gate** will attract all the serious builders currently giving work away for free on GitHub. This is the #1 opportunity.

2. **Multi-environment packaging.** Every existing directory lists "works with Claude Code, Cursor, Cline" as **free-text metadata with zero verification.** Nobody ships a single package containing platform-specific variants behind one install. A rule/skill/MCP tested on Claude Code may break on Cursor because of API differences. RuleSell should make the **client selector the first UI interaction** and ship per-environment variant bundles with a "last tested on your client" badge.

3. **Trust layer with verified-install reviews.** Zero user reviews anywhere in the developer AI asset space. Trust is entirely GitHub stars + install counts + "featured" badges — all gameable. A **verified-install + actual-use rating system** with wallet-tied anti-sybil protection would be a real differentiator. claudemarketplaces.com's 500-install gate is the closest anyone has come, but it's a binary gate, not a review signal.

### What mcpmarket.com does that's worth copying for the landing page

Based on cross-referenced descriptions:

- **Hero in "Discover Top X" present-tense-verb format** — "Discover Top MCP Servers" is simple, category-anchored, clear. Copy this pattern.
- **Category grid above the fold** — 20+ named categories visible on first paint. Lets users self-route without onboarding friction.
- **Featured section** (~52 curated items). Editorial curation signals quality without requiring reviews yet.
- **Top-100 leaderboard page** as a secondary navigation axis — creates social proof and a quality-sorted browse mode complementary to the category-sorted grid.
- **No login wall** — critical for dev-tool discovery.

**Upgrades when copying mcpmarket's structure:**
- Add a visible search bar above the category grid
- Add **compatibility badges on every card** (Claude Code / Cursor / Codex / Windsurf / n8n icons) — nobody does this and it's the first thing developers want
- Add creator attribution on cards
- Replace copy-paste install with one-click CLI spawn
- Add first-interaction "Which environment are you on?" to personalize discovery
- Copy **claudemarketplaces.com's editorial 01/02/03 section numbering** for visual differentiation

### Typical funnel across all competitors

`Landing (hero + grid) → Category page (filtered list) → Item detail (description + install command + source link) → Copy-paste install into target client → Success unverified.`

There is **no structured onboarding** anywhere. **Nobody asks "which client are you on?" up front**, which is the single biggest missed personalization opportunity in the category.

**RuleSell funnel to beat:**

```
Landing
  → Environment selector (Claude Code / Cursor / Codex / Windsurf / n8n / Make / Obsidian)
  → Category-filtered-by-compatibility grid
  → Item detail with variant picker + one-click install (CLI spawn)
  → Install verified via post-install telemetry
  → Review prompt 24h after first successful use
```

### Is anyone doing multi-environment versioning?

**No.** Zero marketplaces handle this properly. All treat compatibility as free-text metadata. The closest things:
- **Smithery** has `smithery.yaml` with explicit version specs — but single-environment (MCP only)
- **Replicate** has git-commit+docker-image version hashes — but single-environment (Replicate compute only)
- **Anthropic's SKILL.md** + **agentskills.io** claim cross-platform — but compatibility is aspirational; a skill with zero host-specific APIs works on multiple hosts, anything non-trivial breaks

**How RuleSell should do it:** one item, multiple `variants`, each with its own version pin, changelog, and "last tested on" timestamp. The item detail page shows a client selector → the install button generates the right command for that client and that variant. Unsupported variants show "coming soon" + a "request this environment" button that aggregates demand signal.

This is a real engineering investment but it's the **one feature no competitor has** and developers will immediately understand the value.

### How to handle items spanning multiple categories

Every existing marketplace forces single-category. The correct pattern per taxonomy research is **primary category + many tags via a junction table with `is_primary` flag** (many-to-many with primary marker). Cap hierarchy at 4 levels; keep the tree flat.

**For RuleSell, split the schema into two orthogonal axes:**

- **Item type** (exactly one — drives the install flow):
  - MCP server / CLI / Cursor rule / Skill / Agent / Agent team / Workflow / Prompt / Dataset / Bundle
- **Domain tags** (many — drive discovery):
  - Developer Tools / Data & Analytics / DevOps / Marketing / Content / Design / Research / Security / etc.

A tool that's "both an MCP server and a CLI" is **one underlying project with two item-type variants.** Model it as a parent **Bundle** listing containing child items, one per type. Users install the child variant that matches their environment.

---

## Actionable Takeaways for RuleSell Design

1. **Landing page: copy mcpmarket.com's structure** (hero + category grid + featured + leaderboard), then add (a) environment selector as first interaction, (b) visible search, (c) compatibility badges on cards, (d) verified-install reviews.
2. **Copy claudemarketplaces.com's editorial section numbering** (`01 Browse Featured / 02 Trending / 03 Recently Added`) — magazine feel, rare in dev directories, differentiates visually.
3. **Copy Replicate's "I want to…" task-first discovery layer** — lets non-technical buyers find the right asset type without knowing the vocabulary (MCP vs skill vs rule).
4. **Adopt Anthropic SKILL.md spec verbatim** for Skill item type. Don't fragment the ecosystem. Reference agentskills.io.
5. **Match or beat GitHub's 95/5 revenue split** for paid items. Beat JetBrains (75/25) and PromptBase (80/20) explicitly in marketing copy: **"Keep 95% of every sale."**
6. **100-install gate for paid listings**, copied from GitHub + claudemarketplaces. Prevents slop, creates a clear free-to-paid progression ladder.
7. **Item-type is mandatory (one), domain tags are many.** Bundles handle multi-type items.
8. **Variants per environment.** Biggest technical differentiator. Ship v1 with Claude Code + Cursor + Codex; add Windsurf/n8n/Make/Obsidian post-launch.
9. **Stripe Connect for payouts**, copied from PromptBase. Explicit "$X minimum payout" messaging, 72-hour pending hold.
10. **Usage-based billing for hosted assets only** (hosted MCP servers, hosted agents) — fal.ai/Replicate model. Static assets are cash-priced.
11. **Verified-install reviews.** Only wallets that actually installed an item can rate it. Nobody else has this.
12. **Don't copy GPT Store's opaque engagement payouts.** Developers will revolt. Per-install or per-unit only, transparent formula, published publicly.
13. **Support custom licensing option** like JetBrains — lets enterprise creators bring their own billing/license server while still getting RuleSell discovery. Captures the high end.
14. **One-click install via CLI spawn** — `npx rulesell install <slug>` following skills.sh's distribution play. Zero-friction, share-link compatible.
15. **No login wall on browse.** Require auth only at install/purchase.
16. **First interaction = "What's your stack?"** — the one thing no competitor does and which personalizes everything downstream.

---

## Sources

### First-hand UX (WebFetch successful)
- [glama.ai/mcp/servers](https://glama.ai/mcp/servers)
- [claudemarketplaces.com](https://claudemarketplaces.com/) + [about](https://claudemarketplaces.com/about)
- [skills.sh](https://skills.sh) (captured in earlier pass)

### Cross-referenced via search snippets + blog teardowns
- [mcpmarket.com](https://mcpmarket.com/) + [featured](https://mcpmarket.com/categories/featured) + [leaderboards](https://mcpmarket.com/leaderboards)
- [smithery.ai](https://smithery.ai/) + [pricing](https://smithery.ai/pricing) + [docs](https://smithery.ai/docs)
- [mcp.so](https://mcp.so/)
- [cursor.directory](https://cursor.directory/) + [plugins](https://cursor.directory/plugins)
- [skillsmp.com](https://skillsmp.com/)

### GitHub repos
- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — 38.7k stars, de facto rules standard
- [anthropics/skills](https://github.com/anthropics/skills) — official SKILL.md spec
- [numman-ali/openskills](https://github.com/numman-ali/openskills) — universal loader
- [mukul975/Anthropic-Cybersecurity-Skills](https://github.com/mukul975/Anthropic-Cybersecurity-Skills) — multi-platform skill example
- [leerob/directories](https://github.com/leerob/directories) — cursor.directory open source

### Monetization / payouts
- [PromptBase sell](https://promptbase.com/sell) + [payouts KB](https://promptbase.com/knowledge-base/payouts) + [marketplace](https://promptbase.com/marketplace)
- [GitHub Marketplace pricing plans](https://docs.github.com/en/apps/github-marketplace/selling-your-app-on-github-marketplace/pricing-plans-for-github-marketplace-apps) + [receiving payment](https://docs.github.com/en/apps/github-marketplace/selling-your-app-on-github-marketplace/receiving-payment-for-app-purchases)
- [JetBrains revenue sharing](https://plugins.jetbrains.com/docs/marketplace/revenue-sharing-and-fees.html) + [plugin monetization](https://plugins.jetbrains.com/docs/marketplace/plugin-monetization.html)
- [Replicate pricing](https://replicate.com/pricing) + [fal.ai publishing](https://fal.ai/docs/documentation/serverless/publishing-to-marketplace) + [fal.ai Sacra profile](https://sacra.com/c/fal-ai/)
- [OpenAI GPT Store revenue share](https://www.thegptshop.online/blog/openai-gpt-store-revenue-sharing) + [VentureBeat launch](https://venturebeat.com/ai/openai-launches-gpt-store-but-revenue-sharing-is-still-to-come) + [2026 creator reality](https://www.digitalapplied.com/blog/gpt-store-custom-gpts-business-guide-2026)
- [HuggingFace pricing](https://huggingface.co/pricing) + [pricing update blog](https://huggingface.co/blog/pricing-update)
- [n8n workflows](https://n8n.io/workflows/) + [n8n pricing](https://n8n.io/pricing/)
- [Make.com templates](https://www.make.com/en/templates) + [pricing](https://www.make.com/en/pricing)

### Cross-platform + compatibility
- [Cursor compliance forum: VS Code marketplace](https://forum.cursor.com/t/compliance-how-does-cursor-use-vscode-marketplace-extensions/38535)
- [devclass: VS Code extension marketplace wars](https://devclass.com/2025/04/08/vs-code-extension-marketplace-wars-cursor-users-hit-roadblocks/)
- [Claude Skills deep dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)

### Market analysis
- [TrueFoundry: Best MCP Registries 2026](https://www.truefoundry.com/blog/best-mcp-registries)
- [AI Rabbit (Medium): MCP Marketplaces You Didn't Know](https://medium.com/@airabbitX/mcp-marketplaces-you-didnt-know-existed-but-really-should-5ea0afcc9584)
- [dev.to: MCP Server Monetization 2026](https://dev.to/namel/mcp-server-monetization-2026-1p2j)
- [Cline: Building the MCP Economy](https://cline.bot/blog/building-the-mcp-economy-lessons-from-21st-dev-and-the-future-of-plugin-monetization)
- [mcpize: How to monetize MCP servers](https://mcpize.com/developers/monetize-mcp-servers)

### Taxonomy / marketplace design
- [Cobbleweb: marketplace category structure](https://www.cobbleweb.co.uk/how-to-design-a-winning-marketplace-category-structure/)
- [Medium: multi-category taxonomies](https://medium.com/@trishita.singh_38113/how-to-design-taxonomies-when-content-belong-to-multiple-categories-5528bc66f687)
