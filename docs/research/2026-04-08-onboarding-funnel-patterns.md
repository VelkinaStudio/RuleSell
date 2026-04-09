# Onboarding Funnel Patterns for Developer Marketplaces

**Date:** 2026-04-08
**Scope:** Research for RuleSell onboarding funnel — "pick your tools → personalized marketplace"
**Inspiration:** mcpmarket.com (referenced by Nalba)
**Method:** direct observation via Chrome DevTools MCP for mcpmarket.com; web research + PageFlows teardowns for the rest.

---

## TL;DR

- **mcpmarket.com has no onboarding.** Pure directory, no signup, no picker, no personalization. The "inspiration" for RuleSell is its **breadth + instant browseability**, not any funnel trick.
- **The cleanest developer-marketplace funnel is a single question: "what do you use?"** — answered by multi-select logo pills on the landing page itself, persisted to localStorage, no signup.
- **Time-to-value benchmark for developer tools is 3 min (Resend) to 5 min (Vercel).** For a browseable marketplace, it should be under **15 seconds**: land → click your tool → see a personalized grid.
- **Signup gate is the wrong default.** Gate auth only at publishing, reviewing, private collections, and billing. Everything before that is local-storage.
- **"Import" beats "ask" whenever possible.** Cursor auto-detects VS Code; Arc imports Chrome. RuleSell's equivalent is "paste your `.cursorrules` / `CLAUDE.md`" power-user lane + URL params from referrer traffic (`?from=claude-code`).
- **Recommended structure:** hero with tool-picker strip above the marketplace, marketplace re-renders in place when pills toggle, category chips as secondary filter, curated collections as the main personalization lever.

---

## 1. mcpmarket.com — Direct Observation

Visited 2026-04-08 via Chrome DevTools MCP. Snapshot captured in `tmp/mcpmarket-homepage.png`.

**Exact visit flow:**
1. Land on `/` — no modal, no signup wall, no cookie banner modal, no interstitial.
2. Top banner: "NEW · Agent Skills Directory — Skills for Claude, ChatGPT, Codex & more" (dismissible).
3. Header: `MCP Market` wordmark, nav (`MCP Servers`, `Agent Skills` dropdowns), `Sell Skills` link, `Power Your Agents` CTA (→ `app.mcpmarket.com/signup`).
4. Hero: live counter `29,817 Servers · Updated just now`, H1 "Find The Best MCP Servers - Agent Skills - MCP Clients - Agent Tools", subtitle, big search box.
5. Horizontal row of 23 category chips: `All · Developer Tools · API Development · Data Science & ML · Productivity & Workflow · Analytics & Monitoring · Other · Deployment & DevOps · Security & Testing · Web Scraping · Learning & Documentation · Database · Cloud · CMS · Collaboration · Design · Browser Automation · Social Media · E-commerce · Marketing · Game Dev · Mobile Dev · Official · Featured`.
6. Content sections, each 3–6 card horizontal row with "View all":
   - **Official MCP Servers** — sponsored slots first (Bright Data `SPONSORED`, Scout Monitoring `SPONSORED`), then Firecrawl, ElevenLabs, Magic, Browserbase.
   - **Featured MCP Servers** — Godot, Excel, Unity, FastAPI, Ghidra, Task Master.
   - **Top MCP Servers** (leaderboard) — Superpowers (139k), Context7 (51k), TrendRadar (51k), MindsDB (38k), OpenSpec (38k), Chrome DevTools (33k).
   - **Latest MCP Servers** — sorted by submission time (many at 0 installs).
   - **MCP Clients** — Zed, Cline, Cherry Studio, Goose, LibreChat, 5ire.
   - **Top Agent Skills** — GH Issues Auto-Fixer (330k), Discord Integration (313k), React Code Fix & Linter (242k), GitHub Integration, ordercli, Google Workspace CLI.
7. FAQ accordion (8 items: "What is MCP", "How does MCP work", etc.).
8. Footer: Browse / Rankings / About sections, newsletter modal trigger, language switcher, theme toggle.

**Specific findings:**
- **Signup gate?** No. The only auth surface is `Power Your Agents` in the header and `Sell Skills` as a secondary link. Every listing is viewable without an account.
- **Personalization?** None. Same page for everyone. No cookies needed to browse.
- **Time to first valuable interaction?** Instant. `<1 second` — the hero and first row of cards render on first paint.
- **Skip option?** Not needed — nothing to skip.
- **Marketplace before vs after personalization?** There is no "after" — it's flat.
- **Monetization visible in UI?** `SPONSORED` tags on the first 2 Official cards; `Advertise` linked in footer; newsletter capture; no paid tier for browsing.

**What this means for RuleSell:** mcpmarket proves you can get to scale without any funnel, but they leave personalization value on the table. A developer loading the homepage with `Claude Code + Cursor` in their workflow gets the exact same view as a designer loading it to check if MCP is relevant to them. **RuleSell's opportunity is to keep mcpmarket's instant browseability AND add a 1-click personalizer** that makes 10k rulesets feel curated for whoever is looking.

---

## 2. Linear — Team-Type Picker (spoiler: there isn't one)

**Exact flow (from Mobbin, PageFlows, and Supademo teardowns):**
1. Land on `linear.app` → marketing page, `Sign up` CTA.
2. **Google OAuth** (primary) — one click through the consent screen.
3. Create workspace: name, URL slug, optional `domain auto-join` (invites everyone on the same email domain).
4. **Theme picker** — light / dark / system. Single click.
5. **Command menu intro** — Linear teaches `⌘K` *before the workspace exists*. A cinematic overlay shows the menu and asks the user to try one command.
6. Optional GitHub integration (skippable).
7. Optional teammate invites (skippable).
8. Drop into empty workspace with a "Get familiar with Linear" task checklist: create an issue, use the command menu, set a priority.

**What is NOT asked:** "what kind of team", "team size", "industry", "role". Linear is explicitly for software teams and refuses to dilute positioning with a picker. The only personalization inputs are workspace name, theme, and integrations.

- **Signup gate?** Yes. Nothing useful visible pre-signup beyond marketing.
- **Time to first value:** < 5 minutes from landing to first-issue-created.
- **Skip option?** GitHub and invites are skippable. Theme and workspace are required.
- **Marketplace before vs after?** N/A — Linear isn't a marketplace.

**Takeaway for RuleSell:** narrow positioning can replace the picker. If RuleSell says "AI coding rulesets, for the tools you already use", the "who are you" question is answered by the positioning itself. But: RuleSell's value is cross-tool, so a lightweight picker still wins.

---

## 3. Vercel — Import-Centric First Deploy

**Exact flow (from Vercel docs):**
1. Land on `vercel.com` → `Sign Up` → **GitHub OAuth** (or GitLab / Bitbucket / email).
2. Authorize Vercel app against your git account.
3. Welcome screen with two lanes side by side:
   - **Import Git Repository** (search box listing your repos).
   - **Browse Templates** (Next.js, Astro, SvelteKit, Remix, etc. — each is a one-click "clone and deploy").
4. Pick a repo or template → Vercel auto-detects framework → Deploy button.
5. First deploy runs → preview URL → "your site is live" confirmation.
6. Post-deploy: add custom domain, invite team (skippable).

**What is NOT asked:** role, team size, use case, experience level, goal. The `template vs repo` choice IS the picker in disguise.

- **Signup gate?** Yes, but git OAuth is a single click.
- **Time to first value:** under 5 minutes from signup to live URL.
- **Skip option?** Every post-deploy step is skippable.
- **Marketplace before vs after?** The template gallery is the marketplace-adjacent surface; it is not personalized, just categorized by framework.

**Takeaway for RuleSell:** templates-as-picker is a real pattern. "I'm building an X" = pick template X. But it requires authored bundles. For RuleSell, the equivalent is curated **collections** ("Claude Code for Next.js devs", "Cursor for Python data science") that double as implicit picker answers.

---

## 4. Cursor — Import From VS Code

**Exact flow (from Cursor docs):**
1. Download Cursor → first launch.
2. Onboarding wizard appears with an **"Import VS Code Settings"** option.
3. One click → Cursor scans default `.vscode` directory.
4. Imports **extensions list** (re-downloads compatible versions from Open VSX), **keybindings.json**, **themes, icon packs, window layouts**.
5. Sign in (Pro) — optional for core use, required for model access.
6. Drop into editor pre-configured with the user's existing environment.

**Key fact:** Cursor claims ~80% of users take the One-Click Import, which means Cursor never has to ask "what language do you use" — they mirrored it.

- **Signup gate?** Required for model access, optional for the editor itself.
- **Time to first value:** under 2 minutes if VS Code is already installed.
- **Skip option?** Yes, import is skippable; user starts with a blank Cursor.
- **Marketplace before vs after?** The Cursor extension store shows Open VSX listings; after import, it highlights "already installed" vs "new".

**Takeaway for RuleSell:** **detection beats asking.** Equivalent surfaces:
- **URL-param detection**: `?from=claude-code`, `?from=cursor`, `?from=windsurf` — pre-select the pill if traffic comes from that tool's docs/blog.
- **Paste-to-detect**: power-user lane where you drop your `.cursorrules`, `CLAUDE.md`, `.windsurfrules`, or `mcp.json` and the marketplace surfaces "similar rulesets" plus "rulesets that would extend yours".
- **Browser extension** (future): detect which AI coding tools you have installed via file-system probe or a manual opt-in.

---

## 5. Raycast Store

**Exact flow:**
1. Launch Raycast → hit Store command.
2. See a search field, a list of extensions grouped by curated categories, and "New & Noteworthy" at the top.
3. Click an extension → install in place.

**Personalization?** None on the store homepage itself. There's a community extension called "Installed Extensions" that shows what you already have, but it's not used for recommendations. The store is search + browse.

- **Signup gate?** None for browsing; Raycast account is only for Pro/sync.
- **Time to first value:** seconds — Raycast is already installed, store is a command.
- **Skip option?** N/A.
- **Marketplace before vs after?** Flat; no personalization layer.

**Takeaway:** Even a top-tier dev-native marketplace defaults to search + curation, not personalization. If RuleSell adds personalization, it's a differentiator, not table stakes.

---

## 6. Arc Browser — Gold Standard for Onboarding

**Exact flow (from PageFlows teardown):**
1. Splash screen on launch.
2. Start screen (welcome copy).
3. **Sign up** (account required — Arc gates hard here, which is unusual).
4. Privacy policy acceptance.
5. Welcome screen with orientation copy.
6. **Import data** → Select folders from existing browser (Chrome bookmarks, passwords, tabs, history).
7. Select accent color (first personalization touch).
8. Pick Favorites (which content/features to pin).
9. Connect integrations.
10. Enable ad blocker + set as default browser.
11. Success confirmation.
12. In-product guided tours and tutorial videos unlock progressively.

Total duration: ~4 minutes.

- **Signup gate?** Yes, and very early. Unusual for a browser, but Arc gates because the cloud-sync story is core.
- **Time to first value:** 4 minutes to success screen.
- **Skip option?** Most steps are skippable, import is the only "sticky" one.
- **Marketplace before vs after?** Arc doesn't have a marketplace, but its boost / theme system functions as one; not personalized.

**Takeaway for RuleSell:** Arc's magic is making the first 30 seconds feel personal *without asking quiz questions*. Import > ask. The only direct Arc lesson applicable: **progressive disclosure of features**. RuleSell's marketplace should unlock "advanced filters", "create a collection", "save for later" progressively rather than dumping every control on load.

---

## 7. PostHog — "What products are you interested in"

**Exact flow (from PostHog handbook):**
1. Land on `posthog.com` → `Get started - free`.
2. Email + password OR Google OAuth.
3. Enter org name.
4. **Product intent question**: check which products you care about — **Product Analytics, Session Replay, Feature Flags, Experiments, Surveys, Data Warehouse, LLM Analytics, Error Tracking**. Multi-select. This is the *entire picker*.
5. Code snippet for installing the SDK — with **framework detection** (React, Next.js, Vue, Django, Rails, etc. pre-selected).
6. Dropped into the product surface matching the primary intent.

PostHog records this intent via `addProductIntent` in their own analytics and triggers **targeted email journeys** if you haven't activated the product you said you wanted within N days.

- **Signup gate?** Yes, required to see the app, but marketing + docs are fully open.
- **Time to first value:** 2–3 minutes to first event in the dashboard.
- **Skip option?** You can skip product intent but then the default view is Product Analytics.
- **Marketplace before vs after?** PostHog isn't a marketplace; the pattern is "multi-select product intent drives in-app default view".

**Takeaway for RuleSell:** This is the closest match to what Nalba is asking for. PostHog's "what products are you interested in" is structurally identical to RuleSell's "what tools do you use". Pattern to lift wholesale:
1. Multi-select checkboxes/pills.
2. Record the answer as a **hard signal** (not just a cosmetic filter).
3. Route downstream behavior off it: default landing state, email nurture, featured sections, recommendations.
4. Allow changing the answer easily (settings / picker in header).

---

## 8. Resend — Ruthless Minimalism

**Exact flow:**
1. Land on `resend.com` → `Sign up`.
2. Email + password OR GitHub OAuth.
3. Verify email.
4. API key generated automatically.
5. Docs page on the right, dashboard on the left.
6. Send test email via `curl` in under 90 seconds.

No picker. No onboarding survey. No tour. The *docs* are the onboarding.

- **Signup gate?** Yes, but minimal.
- **Time to first value:** **under 3 minutes to first email sent.** Best-in-class for developer tools.
- **Skip option?** N/A.
- **Marketplace before vs after?** No marketplace.

**Takeaway:** the benchmark. **Under 3 minutes from landing to first successful action** is the bar. For RuleSell, "first successful action" = "found and installed a ruleset they want", which should take under 1 minute if the picker works.

---

## 9. VS Code Marketplace

**Exact flow:**
1. Open a new folder in VS Code.
2. VS Code inspects file types (`.py`, `.ts`, `.rs`, etc.) and **existing extensions**.
3. Notification appears: "We recommend installing Pylance / ESLint / rust-analyzer for this workspace."
4. Click install → extension added.

Separately, the marketplace homepage has trending/featured sections that *aren't* personalized to your installed set — the personalization lives in the editor itself.

- **Signup gate?** No. Marketplace browsing is anonymous.
- **Time to first value:** seconds — detection is instant.
- **Skip option?** Yes, dismiss the notification.
- **Marketplace before vs after?** Before: flat marketplace. After: the editor contextually recommends based on your workspace, invisibly to the marketplace itself.

**Takeaway:** **workspace detection** is a killer personalization signal. RuleSell's analog: if we ever build a CLI or an editor plugin, we can inspect the user's workspace for `package.json`, `CLAUDE.md`, `.cursorrules`, `mcp.json`, `pyproject.toml`, `requirements.txt`, and recommend rulesets based on that — zero questions asked.

---

## 10. Hugging Face

**Exact flow:**
1. Land on `huggingface.co` → global homepage.
2. See **Trending Models / Datasets / Spaces** — same for everyone.
3. Sign up (Google / GitHub / email) — purely to save things and upload.
4. Post-signup homepage is very slightly different (shows "Your recent activity" once you have any), but **trending sections dominate**. No strong "For You" feed.

- **Signup gate?** None for browsing. Required to upload or star.
- **Time to first value:** instant for browsing, under 2 min to first model inference via Inference API.
- **Skip option?** Signup is pure skip for consumers.
- **Marketplace before vs after?** Nearly identical. HF relies on trending + search + tags; personalization is a 2% lift at most.

**Takeaway:** at HF's scale (13M users), they still don't personalize the homepage. **Trending + tags is sufficient until you've proved a personalization ROI.** For RuleSell, start with trending/featured/latest and add personalization as a second-order layer that can be proved to move metrics.

---

## 11. GitHub Explore

**Exact flow:**
1. `github.com/explore` → logged-out view shows trending repos, topics, curated collections.
2. Logged-in view adds a **"For you"** section on the homepage dashboard using:
   - Topics you've starred.
   - Repos similar to your starred ones.
   - Trending in languages you use.
   - Repos starred by people you follow.
3. Explore newsletter (weekly email) with personalized repo picks.

Known issue: GitHub's trending page has been broken intermittently since late 2025 (per community discussions) — not a good look.

- **Signup gate?** None; better experience if logged in.
- **Time to first value:** instant.
- **Skip option?** N/A.
- **Marketplace before vs after?** Trending is the "before". Personalization is "stars drive suggestions" and "people you follow drive suggestions" — social-graph plus content-based.

**Takeaway:** **tagging is the substrate.** GitHub's recs work because every repo has topics. RuleSell needs excellent canonical tags per ruleset: `tool` (claude-code, cursor, windsurf, n8n, aider, cline, zed, copilot), `language` (ts, py, rust, go), `framework` (next, astro, fastapi, django), `use_case` (tdd, security, refactor, docs, agent), `style` (strict, loose, opinionated). No tags → no recs.

---

## 12. Product Hunt

**Exact flow:**
1. `producthunt.com` → daily ranked feed is the hero.
2. `The Loop` rotates homepage layout **every 30 minutes, all day long** (randomized cycling to level the playing field for late-day launches).
3. Category browsing is secondary (nav link).
4. Q1 2026 algorithm update: weighted **comment quality over raw upvotes**. 50 upvotes + 30 genuine comments now outranks 200 upvotes + 5 comments. First-hour velocity predicts trajectory.

- **Signup gate?** None for browsing. Required to upvote or comment.
- **Time to first value:** instant.
- **Skip option?** N/A.
- **Marketplace before vs after?** Feed-first. No per-user personalization of the main feed beyond follows.

**Takeaway:** **a "Today's top rulesets" rotating feed** creates return-visit habit. The Loop pattern (rotate every 30 min) is clever for freshness but overkill for a 2k-item catalog. But the **ranking signal (comments > upvotes)** is a strong prior: RuleSell should weight *installs + reviews* over *stars* as the leaderboard signal.

---

## 13. Notion Templates Gallery

**Exact flow:**
1. `notion.so/templates` → landing page with huge category tree.
2. Filters: category (250+), team (marketing, engineering, design, HR, etc.), creator, free vs paid.
3. "Most popular this week" + "Featured collections" up top.
4. Click a template → preview → "Duplicate to my workspace" (gates signup here, but preview is free).

- **Signup gate?** None for browsing; required to duplicate.
- **Time to first value:** 30 sec to see a template preview, 2 min to have it in your workspace.
- **Skip option?** N/A.
- **Marketplace before vs after?** Flat. Personalization is "filter by your team type", which is single-select role-ish.

**Takeaway:** **curated collections** ("Top 10 for Claude Code", "Security-first", "Agentic workflows", "Frontend essentials", "Data science toolbelt") are the easiest-to-ship personalization that feel high-value. Notion's gallery is basically "categories + collections + filters" — no ML, no embeddings, but it feels curated because humans pick the collections.

---

## 14. Figma Community

**Exact flow:**
1. `figma.com/community` → landing with trending files, plugins, widgets, apps, creators.
2. Filters: resource type (Files, Plugins, Widgets, Apps, Creators), search by name/tag/creator.
3. Personalization: **role selection in account settings** drives recommendations inside the Figma file browser (not on the public community page). Roles: designer, developer, PM, researcher, etc.
4. Search by `@handle` works like Twitter/X handles.

- **Signup gate?** None for browsing; required to duplicate or follow.
- **Time to first value:** instant.
- **Skip option?** Role is settable any time, not required.
- **Marketplace before vs after?** Community page is mostly flat. In-product, recommendations shift based on your role setting.

**Takeaway:** Figma's **role-based default state** is the cleanest direct analog for RuleSell's "which tool". Single setting, changeable, drives downstream defaults without becoming a quiz.

---

## 15. Webflow Templates

**Exact flow:**
1. `webflow.com/templates` → marketplace landing.
2. Filters: category, tag, `free vs premium` (biggest visible filter), `Made in Webflow` (community) vs official.
3. Search + sort.
4. Click template → preview → "Use template" → opens in editor.

- **Signup gate?** None for browsing; required to use.
- **Time to first value:** instant for browsing.
- **Skip option?** N/A.
- **Marketplace before vs after?** Flat.

**Takeaway:** **free vs paid filter is high-value** and should be first-class in RuleSell. **Official vs community separation** is a trust signal that RuleSell should adopt early — stamp an `Official` badge on rulesets authored by RuleSell team or vetted creators.

---

## Funnel Design Literature

### Aha moment / time-to-value benchmarks

- 60–70% of annual churn happens in the first 90 days.
- General SaaS benchmark: **time-to-value under 7 days** is the "effective" threshold.
- Developer tools specifically: **under 3 minutes** (Resend) to **under 5 minutes** (Vercel) is best-in-class.
- AI products raise the bar — users expect a "wow moment" in the same time frame as traditional "aha".
- For a **browseable catalog** (not a product you install), the bar is even lower: **under 15 seconds from landing to finding something you want**.

### Friction vs personalization tradeoffs

- Each additional signup field reduces completion by ~3–5%.
- Progressive profiling increases conversion up to ~20%.
- "Thin identity first, enrich on demand": collect billing only when upgrading, phone only when inviting, etc.
- **"The best way to avoid onboarding friction is to not require onboarding at all."**
- Developers are the most friction-sensitive cohort. Any signup field before value = measurable drop-off.

### Cold-start personalization techniques (for anonymous users)

1. **Preference elicitation** — 1–3 questions upfront (Spotify's 3-artist pick).
2. **Session signals** — track what the anonymous user clicks/hovers this session.
3. **Content-based filtering** — metadata-driven (tool, category, popularity, tags).
4. **Contextual data** — URL referrer, device, location, UTM.
5. **Zero-party data** — declared preferences over inferred.
6. **Hybrid** — combine weak signals; more weak signals beat one strong signal.

### Anti-patterns to avoid

- Forcing signup before any value. Developers bounce at 60%+.
- Long multi-step forms (>3 screens) before the product renders.
- Hiding the product behind a "book a demo" wall.
- Asking for data you won't use immediately: company size, job title, team size, annual revenue.
- Onboarding that pulls users out of the tool they were already using (don't make a Claude Code user leave Claude Code).
- Mystery-box UX: "click to see your personalized feed" with no preview — developers want the preview first.
- 90%+ of apps are opened once and abandoned because of onboarding friction.

---

## Synthesis: Recommendations for RuleSell

### Landing Page Structure (sections in order)

1. **Hero** — H1 names the pain directly: *"Ship better AI-assisted code. Stop writing rulesets from scratch."* Subtitle: *"Curated rules, skills, and MCP configs for Claude Code, Cursor, Windsurf, n8n, and more."* Big search box under the subtitle. Tiny live counter: *"2,847 rulesets · curated daily"*.
2. **Tool picker strip (THE FUNNEL ENTRY)** — horizontal row of logo pills: `Claude Code / Cursor / Windsurf / Cline / Zed / n8n / Aider / Continue / Copilot / Codex`. Multi-select. No pre-selection. Text link: *"Skip — show everything"*.
3. **Marketplace grid** — renders immediately below the picker and **re-renders in place** when pills toggle. Sections: *Top for [your tools] / Featured / New this week / By category*.
4. **Category chips row** — secondary filter, always visible (Coding, DevOps, Security, Testing, Docs, Data, Design, etc.). Composable with tool picker.
5. **Curated collections** — human-picked bundles: *"Top 10 for Claude Code", "Security-first rulesets", "Frontend essentials", "Agentic workflows", "For data scientists"*. These feel personalized at zero cost.
6. **Social proof** — install counts, GitHub star parity, creator avatars, 3–5 short quotes (real devs, real handles).
7. **How it works** — 3-step: *browse → copy/install → go*. No marketing fluff. One screenshot each.
8. **FAQ** — what is a ruleset, is it safe, how do I install, who made this, can I sell mine.
9. **Footer** — browse / sell / about / submit / language / theme.

### Recommended Onboarding Funnel

**One question, inline on the landing page itself. Not a modal. Not a separate screen.**

> **Question: "What do you use?"**
> Mechanic: row of 10 logo pills above the marketplace grid. Multi-select. Pre-selected: none (empty state shows "everything"). Persistence: `localStorage` key `rulesell_tools`. No account needed.

That is the entire funnel. No second question by default.

**Optional second question** (only if user picked 2+ tools *and* has scrolled past the fold): a single chip row appears asking *"What are you building?"* — `Web app / API / Mobile / Data / DevOps / Research / Content / Games`. This gates a "top picks for your stack" section, not the entire marketplace.

**Optional power-user lane** (accessible via a small link next to the picker): *"Paste your existing rules"* — a textarea accepting `.cursorrules`, `CLAUDE.md`, `.windsurfrules`, or `mcp.json`. Parsed client-side, used to seed similarity search.

### First-run marketplace state for "Claude Code + Cursor"

When a user clicks both `Claude Code` and `Cursor` pills:

- **Hero label changes dynamically** (live, no page reload): *"Rulesets for Claude Code + Cursor users"*.
- **Section 1 — "Must-have for Claude Code"** (5 cards): Superpowers, Context7, TDD skill, Frontend-design skill, Systematic-debugging skill. Pulled from the `claude-code` tag leaderboard.
- **Section 2 — "Popular with Cursor users"** (5 cards): `.cursorrules` packs for TypeScript/React/Next.js, framework-specific rules, Copilot-migration packs.
- **Section 3 — "Works with both"** (5 cards): universal rulesets — git conventions, code-review prompts, commit-message rules, security linters.
- **Section 4 — "New this week"** (filtered to rulesets tagged with either tool).
- **Section 5 — "Browse all 2,847 rulesets"** (full grid, filterable).

All sections are server-rendered from the tag filter; no ML required. A cron/ISR rebuild every 15 min keeps "New this week" fresh.

### Recommended fallback if skipped / ignored

If user clicks "Skip — show everything" OR just starts scrolling without touching the picker:

- Render the **mcpmarket-style flat homepage**: Official / Featured / Top / Latest / Clients / Skills, categories as chips.
- Keep a **persistent sticky banner** at the top of the grid: *"Get a view tailored to your tools →"* that re-opens the picker with a single click. Non-intrusive, dismissible.
- Same data, zero personalization, one click away from personalization.

### Signup gate? **NO. Local storage first.**

This is the single most important UX decision in the project.

**Rationale:**
- Browsing a ruleset directory has zero reason to require auth.
- Developers are allergic to signup walls for content they haven't yet valued.
- Each required field = 3–5% drop-off. Asking for email before showing content will kill ~30% of intent traffic.
- `localStorage` can handle: tool preferences, collections/bookmarks, "recently viewed", "install history".
- **Gate auth only at** publishing a ruleset, leaving a review, creating private collections, purchasing/subscribing, creator payouts. All post-value.

Reference points:
- **mcpmarket.com** gates nothing for browsing. RuleSell should match this.
- **Linear** gates at the signup CTA only. For creators, RuleSell should match this.
- **Cursor** gates models but not the editor itself. RuleSell could later gate "AI-powered ruleset recommendations" as the Pro upsell.

### A/B-test-worthy variants

| Variant | Description | Hypothesis |
|---|---|---|
| **A: No picker (baseline)** | mcpmarket-style flat homepage, search-first. | Baseline conversion. |
| **B: Persistent picker strip (recommended)** | Tool multi-select pills above the marketplace, re-renders grid in place. | +30% activation (tool click → first ruleset view). |
| **C: Full-bleed first-screen picker** | Arc-style takeover "pick your tools" before marketplace renders. Skippable. | +higher per-session personalized rate but −total sessions. |
| **D: URL-param auto-pre-select** | `?from=claude-code` referral traffic lands with Claude Code pre-selected. Combined with B. | +15% conversion on referral traffic from docs/blog partners. |
| **E: Paste-your-rules power-user** | Textarea accepting `.cursorrules` / `CLAUDE.md`. Similarity search seeds a personalized grid. | High-intent conversion +++, low reach. Show as secondary lane. |
| **F: Single-select role picker** | Figma-style: *"I'm a … frontend / backend / full-stack / data / devops"*. | Worse than B — too coarse, hides multi-tool reality. |

**Prediction:** B wins on activation rate. C wins on "personalized-view rate" but loses total sessions. D is a cheap win on referral funnels. E is a loyalty-building power-user feature. A is the safe baseline if B shows any regression. F should lose to B.

### Time-to-value target

**Under 15 seconds from landing → seeing a ruleset they want to install.**

Ideal flow:
1. `t+0s` — hero renders, tool picker visible.
2. `t+3s` — user scans picker, clicks Claude Code.
3. `t+4s` — grid re-renders with `Must-have for Claude Code` section.
4. `t+8s` — user scans 5 cards, clicks one.
5. `t+12s` — ruleset detail page opens with install snippet, `Copy` button.
6. `t+15s` — user has copied the snippet, in their own terminal.

If the funnel pushes past 15 seconds before first value, it's too heavy — cut a step.

### Measurement plan (what to instrument)

- **Landing → first pill click** (activation rate, primary metric).
- **Pill click → grid re-render latency** (should be <200ms).
- **Grid re-render → first card click** (relevance signal).
- **Card click → copy-install-snippet click** (conversion proxy).
- **Pill combo frequency** — which tool pairs are most common; feeds future curated collections.
- **Skip-rate on picker** — how many users ignore it entirely.
- **Returning visitor personalization hit** — does localStorage re-hydrate correctly.

---

## Sources

- [MCP Market homepage](https://mcpmarket.com/) — direct observation via Chrome DevTools MCP, 2026-04-08
- [Linear Web Onboarding Flow — Mobbin](https://mobbin.com/explore/flows/64ae582c-747c-4c77-8629-812abcbef186)
- [Linear Onboarding Flow on Web — PageFlows](https://pageflows.com/post/desktop-web/onboarding/linear/)
- [Linear Onboarding Teardown — Supademo](https://supademo.com/user-flow-examples/linear)
- [Linear Start Guide](https://linear.app/docs/start-guide)
- [Vercel Getting Started — Import existing project](https://vercel.com/docs/getting-started-with-vercel)
- [Vercel Deploying Git Repositories](https://vercel.com/docs/git)
- [Cursor VS Code Migration docs](https://cursor.com/docs/configuration/migrations/vscode)
- [Migrating VS Code Extensions to Cursor (2026) — Thinkpeak](https://thinkpeak.ai/migrating-vs-code-extensions-to-cursor-2026/)
- [Arc Browser Onboarding — PageFlows](https://pageflows.com/post/mac-os/onboarding/arc/)
- [Arc Browser Onboarding UX — SaaSUI](https://www.saasui.design/pattern/onboarding/arc-browser)
- [PostHog Product Intents](https://posthog.com/handbook/growth/growth-engineering/product-intents)
- [PostHog New Customer Onboarding](https://posthog.com/handbook/growth/sales/customer-onboarding)
- [PostHog Email Onboarding Flow](https://posthog.com/blog/how-we-built-email-onboarding)
- [Resend](https://resend.com)
- [VS Code Extension Marketplace docs](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)
- [Raycast Store](https://www.raycast.com/store)
- [Raycast Manual — Store](https://manual.raycast.com/store)
- [Hugging Face homepage](https://huggingface.co/)
- [State of Open Source on Hugging Face — Spring 2026](https://huggingface.co/blog/huggingface/state-of-os-hf-spring-2026)
- [GitHub Trending](https://github.com/trending)
- [GitHub Finding Inspiration docs](https://docs.github.com/en/get-started/start-your-journey/finding-inspiration-on-github)
- [Product Hunt Launch Playbook 2026](https://dev.to/iris1031/product-hunt-launch-playbook-the-definitive-guide-30x-1-winner-1pbh)
- [Product Hunt 2026 Launch Guide — Blazon](https://blazonagency.com/post/how-to-launch-on-product-hunt)
- [Notion Template Gallery](https://www.notion.com/templates/category)
- [Figma Community Guide](https://help.figma.com/hc/en-us/articles/360038510693-Guide-to-the-Figma-Community)
- [Webflow Marketplace](https://webflow.com/marketplace)
- [Aha Moment SaaS Metrics — Statsig](https://www.statsig.com/perspectives/aha-moment-saas-metrics)
- [Cold-start problem — freeCodeCamp](https://www.freecodecamp.org/news/cold-start-problem-in-recommender-systems/)
- [Cold-start personalization 2025 guide — ShadeCoder](https://www.shadecoder.com/topics/cold-start-problem-a-comprehensive-guide-for-2025)
- [Progressive profiling — Descope](https://www.descope.com/learn/post/progressive-profiling)
- [Why developers never finish onboarding — daily.dev](https://business.daily.dev/resources/why-developers-never-finish-your-onboarding-and-how-to-fix-it/)
- [SaaS onboarding friction mapping — lifecyclex.co](https://www.lifecyclex.co/blog/mapping-user-friction-saas-onboarding)
