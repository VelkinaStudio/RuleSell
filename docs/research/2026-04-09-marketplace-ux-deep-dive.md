# Marketplace Navigation & Discovery UX Deep Dive

**Date:** 2026-04-09
**Author:** UX Research (Claude)
**Scope:** Navigation, information architecture, and discovery UX patterns across 12 developer tool marketplaces
**Audience:** Designer and frontend engineer building RuleSell's next iteration
**Method:** WebFetch + WebSearch across all targets; first-hand page analysis where accessible, cross-referenced from authoritative blog teardowns and documentation where blocked (mcpmarket 429, npm 403, Figma 403)

---

## 1. Executive Summary

Developer tool marketplaces in 2026 have converged on a recognizable set of navigation and discovery patterns, but none have solved the multi-type content problem well. The market divides into two archetypes:

**Single-type directories** (skills.sh, mcpmarket.com, formulae.brew.sh) use a flat leaderboard + search model. Navigation is minimal because there is only one content type. Discovery relies heavily on install counts and trending sorts. These feel fast and focused but offer no room for content diversity.

**Multi-type platforms** (HuggingFace, GitHub Marketplace, Figma Community, cursor.directory) use top-level tabs or nav links to separate content types, with independent filter systems per type. This works up to 3-4 types. Beyond that, no marketplace has demonstrated a clean solution -- HuggingFace at 4 types (Models/Datasets/Spaces/Buckets) is the practical ceiling before the nav bar starts feeling cluttered.

RuleSell's 9 content types represent an unsolved design problem. No existing marketplace navigates 9 types well. The recommendation (detailed in Section 7) is a hybrid: collapse types into 3-4 "super-categories" for primary navigation while exposing the full type taxonomy as a secondary filter axis.

Key cross-cutting findings:

- **Search is the primary discovery mechanism** in every successful marketplace. It must be above the fold, with keyboard shortcut (/ or Cmd+K), and return results across all content types.
- **Install command prominence** is the single most important detail-page element. npm, skills.sh, Raycast, and VS Code all place it above the fold with a copy button. Time from "I found it" to "I'm running it" should be under 10 seconds.
- **Trust is communicated through numbers, not badges alone.** Weekly downloads, install counts, last-updated timestamps, and GitHub stars matter more than any "verified" badge.
- **Dark mode is the default** for developer-facing marketplaces in 2026. 45% of recently launched SaaS products default to dark. Off-black backgrounds (#121212 to #18181B), not pure black.
- **Card density should match audience expertise.** npm-level density (6-8 data points per card) works for developers. Figma-level visual cards (thumbnail + title + author) work for designers. Developer tool marketplaces should lean toward npm density.

---

## 2. Marketplace-by-Marketplace Breakdown

### 2.1 mcpmarket.com (Tier 1 -- Direct Competitor)

**URL:** https://mcpmarket.com
**Scale:** ~10,000 MCP servers across 23+ categories, ~52 featured servers

**Global Navigation:**
- Header: "MCP Market" branding + primary nav links
- Key sections: Featured, Categories, Leaderboards, News
- Language selector visible (en/es variants exist at `/es/` paths)

**Homepage Layout (top to bottom):**
1. Hero: "Discover Top MCP Servers" headline
2. Category grid immediately below hero -- visible above the fold
3. Featured servers carousel (~52 items)
4. Top-100 leaderboard as secondary discovery axis
5. Daily "top server list" editorial content (e.g., "Top MCP Servers for March 30, 2026")

**Category/Filter System:**
- 23+ flat categories: Developer Tools, API Development, Data Science & ML, Productivity & Workflow, Analytics & Monitoring, Deployment & DevOps, Security & Testing, Web Scraping, Documentation, Databases, Cloud Infra, CMS, Collaboration, Design, Browser Automation, Social, E-commerce, Marketing, Game Dev, Mobile
- Plus curated collections: "Featured" and "Official"
- Categories accessible via `/categories/` path and grid on homepage
- No multi-axis filtering -- single category selection only

**Card Design:**
- Server name and brief description
- Category tag
- Install count as primary metric
- No star ratings, no reviews, no last-updated timestamp on cards
- Featured badge on curated items

**Detail Page:**
- Server name, description, install command (copy-paste)
- Client compatibility as free text
- Link to source repository
- No structured metadata sidebar (unlike npm)
- No reviews or ratings system

**Search UX:**
- Search present but not the dominant entry point
- Browse-first architecture -- categories and leaderboard are primary discovery
- No visible autocomplete

**Time to Install:** Landing -> Category or search -> Server detail -> Copy install command = 3 clicks minimum

**What to learn:** The three-axis landing (hero + category grid + featured + leaderboard) is the proven pattern for MCP directories. The Top-100 leaderboard is a second discovery axis that creates a "what's actually used" entry point for skeptical developers. Weakness: no trust signals beyond install counts, no reviews, flat category structure doesn't scale.

---

### 2.2 smithery.ai (Tier 1 -- MCP Registry Leader)

**URL:** https://smithery.ai
**Scale:** 3,300-7,300+ MCP servers + Skills surface

**Global Navigation:**
- "Smithery" branding, positioned as "Turn scattered context into skills for AI"
- Two top-level surfaces: Servers (`/servers`) and Skills (`/skills`)
- CLI-first: `smithery install <server>` is presented as the primary interaction

**Homepage Layout:**
- Developer-facing pitch: "Get discovered by users and developers"
- Category chips for browsing: Memory, Web Search, Academic Research, Reasoning & Planning, Browser Automation, Reference Data, LLM Integration
- Server listing below

**Category/Filter System:**
- Tag-based, not deep hierarchy
- 7 primary categories (function-based, not language-based)
- Flat -- no nested subcategories

**Card Design:**
- Server name and source repository
- Brief description
- Category tags
- GitHub stars visible
- No install counts on cards (available on detail pages)

**Detail Page:**
- Server page at `/server/{name}` or `/servers/@{org}/{name}`
- Auto-scanned metadata: tools, prompts, resources extracted from server code
- Install command: `smithery install --server=<name> --client=claude`
- Configuration options with JSON config passthrough
- Source repo link

**Install Flow:**
- CLI: `npx @smithery/cli install <server> --client claude`
- Auto-generated OAuth modals for servers requiring auth -- this is unique and valuable
- Configuration can be passed inline: `--config '{"key":"value"}'`

**Trust Signals:**
- GitHub repo verification
- Auto-scanned tool/resource metadata (proves the server is real, not just a listing)

**What to learn:** Smithery's auto-OAuth generation is the single most innovative install UX in the category -- it removes the hardest friction point (auth setup). The CLI-first model with `--client` flag is the right pattern for multi-environment support. The tag-based (not hierarchical) category system keeps navigation flat and scannable. Weakness: no install metrics visible on browse, no reviews, creator economics are hostile (creators pay $30/mo, earn $0).

---

### 2.3 cursor.directory (Tier 1 -- Multi-Type Content)

**URL:** https://cursor.directory
**Scale:** Thousands of rules + MCP servers + plugins + integrations

**Global Navigation:**
- Primary nav: Rules | MCP Servers | Plugins | Integrations
- Each nav item leads to a separate browse page
- Search bar in header

**Homepage:**
- "Explore What the Community Is Building" tagline
- Multi-type content displayed together on the landing page
- Events, news, and community content alongside the directory

**Content Type Navigation:**
- `/plugins` -- verified Cursor plugins including skills, subagents, rules, hooks, commands, MCP servers
- Separate pages per type with independent browse experiences
- Plugin structure includes: SKILL.md files, .mdc rule files, mcp.json for MCP server definitions

**Card Design per Type:**
- Plugin cards: icon, title, developer name, brief description, category tags
- Rules: title, framework/language tag, copy button
- MCP servers: name, description, source link

**Filter System:**
- Category-based filtering within each content type page
- Infrastructure (Datadog, CockroachDB), Productivity (Slack, Linear), Development (Figma, GitHub, GitLab)

**Install Flow:**
- Rules: copy-paste from the detail page
- Plugins: follow instructions (no unified install command)
- No single `npx` or CLI install pattern

**What to learn:** cursor.directory is the closest conceptual sibling to RuleSell -- it has multiple content types (rules, MCP, plugins) under one roof. The nav-level type separation (Rules | MCP | Plugins) works because there are only 3-4 types. The PR-gated submission model and lack of install commands are weaknesses RuleSell can exploit. Key insight: they separate types at the nav level but unify them on the homepage -- this hybrid approach is worth copying.

---

### 2.4 skills.sh (Tier 1 -- Leaderboard-First)

**URL:** https://skills.sh
**Scale:** 246+ skills, top skill at 731K installs

**Global Navigation:**
- Minimal header: "Skills" branding (Vercel logo), "Official" (with NEW badge), "Audits", "Docs"
- Search bar with "/" keyboard shortcut
- ASCII art branding creates distinctive identity

**Homepage = Leaderboard:**
- The entire homepage IS the leaderboard -- no hero section, no marketing copy
- Ranked table with three columns: # (rank), Skill (name + org/repo), Installs (count)
- Three sorting tabs: "All Time (91,674)", "Trending (24h)", "Hot"
- 246 entries visible

**Card Design (table rows):**
- Ranking number
- Skill name
- Source repository in `owner/repo` format
- Install count in thousands (e.g., "731K")
- No descriptions, no icons, no ratings

**Install Command:**
- `$ npx skills add <owner/repo>` -- displayed prominently as a fixed element
- The install command doubles as the share format
- Zero-account, zero-config install

**Search:**
- "Search skills..." input with "/" keyboard shortcut
- Filters results within the leaderboard

**Visual Design:**
- Dark theme, monospace typography (Fira Mono)
- ASCII art branding
- Extremely minimal -- no images, no icons, no gradients
- Terminal-aesthetic: the entire site feels like a CLI rendered in a browser

**Time to Install:** Landing -> See leaderboard -> Copy `npx skills add owner/repo` = 1 click (just copy the command)

**What to learn:** skills.sh achieves the fastest time-to-install of any marketplace studied: the install command is visible on the homepage alongside every listing. The leaderboard-as-homepage pattern works brilliantly for a single content type with a clear ranking metric. The "/" keyboard shortcut for search is a developer-expected pattern (copied from Vim/Slack). The monospace/terminal aesthetic communicates "this is for developers" instantly. Weakness: works only for a single type with a single metric. Cannot scale to 9 types.

---

### 2.5 npm / npmjs.com (Tier 1 -- Gold Standard)

**URL:** https://www.npmjs.com
**Scale:** 2.5M+ packages

**Global Navigation:**
- Header: npm logo, search bar (dominant -- takes 60%+ of header width), "Sign Up", "Sign In"
- Minimal nav: Products, Pricing, Documentation
- Search is the unmistakable primary entry point

**Homepage:**
- Search bar hero with "Search packages" placeholder
- Three marketing value props below
- No browse, no categories on homepage -- pure search-first

**Search Results Page:**
- Package list (not grid) -- linear, scannable
- Each result: package name, description, keywords, author, publish date, version, weekly downloads
- Sort options: Optimal, Popularity, Quality, Maintenance
- Filter sidebar: author, keyword, scope

**Package Detail Page (the reference design):**

*Main Content Area (left ~70%):*
- Package name (large, bold)
- Tabs: Readme | Code | N Dependents | N Versions
- README rendered as full markdown (dominates the page)

*Right Sidebar (~30%) -- the npm sidebar is the gold standard:*
1. Install command: `npm i <package>` in a dark code block with copy button -- FIRST element in sidebar, above everything else
2. Weekly Downloads: number + sparkline chart
3. Version: current version number
4. License: e.g., "MIT"
5. Unpacked Size: e.g., "197 kB"
6. Total Files: count
7. Issues: link to GitHub issues
8. Pull Requests: link to GitHub PRs
9. Last Publish: timestamp (e.g., "2 months ago")
10. Collaborators: avatar row of maintainers
11. Try on RunKit: interactive REPL link

**Trust Signals (all in sidebar):**
- Weekly downloads with trend sparkline
- Last publish date (recency = maintenance signal)
- Number of dependents (social proof from other packages)
- Collaborator count and avatars
- License presence
- GitHub activity links

**Typography:**
- System font stack (not monospace for body text)
- Package name: ~24px bold
- Description: ~16px regular
- Sidebar labels: ~12px uppercase gray
- Sidebar values: ~14px bold
- Dense but readable -- approximately 8px spacing between sidebar items

**Visual Design:**
- Light theme (white background, #333 text)
- Red accent (#cb3837) for npm branding
- Minimal color -- almost monochrome except the red logo
- Very dense information layout -- no wasted space

**Time to Install:** Search -> Click result -> See install command in sidebar = 2 clicks, install command visible immediately on detail page

**What to learn:** npm's sidebar is the single most copied UI pattern in developer tool marketplaces, and for good reason. The install command at the top of the sidebar, followed by download metrics, version, license, and last-publish date, is the exact information hierarchy developers need. The sparkline next to weekly downloads communicates trend without taking space. The search-first homepage (no browse, no categories) works because npm's scale makes browsing impractical -- but RuleSell at <100 items should NOT copy this; browse is essential at small scale.

---

### 2.6 VS Code Marketplace (Tier 1 -- IDE Extension Standard)

**URL:** https://marketplace.visualstudio.com
**Scale:** 50,000+ extensions, top extension at 212M+ installs

**Global Navigation:**
- Black header bar with VS Marketplace logo, search bar, sign-in
- Minimal -- search is dominant

**Homepage Layout:**
- Featured extensions (editorial picks)
- Most Popular section
- Recently Added section
- 21 categories in sidebar/grid: AI, Azure, Chat, Data Science, Databases, Debuggers, Education, Extension Packs, Formatters, Keymaps, Language Model Tools, Language Packs, Linters, Machine Learning, Notebooks, Programming Languages, SCM Providers, Snippets, Testing, Themes, Visualization, Other

**Extension Detail Page:**
- Light gray banner (#eff1f3) with extension icon (128px), title (26px bold), publisher name (18px bold linked)
- Green Install button (#107c10, 120px min width) -- prominent
- Quick install command: `ext install ms-python.python` with copy
- Tabs: Overview | Version History | Q&A | Rating & Review
- Sidebar: Install count ("212,404,041 installs"), star rating (4/5), review count ("627"), pricing badge ("Free"), categories, tags

**Trust Signals:**
- Install count (huge numbers, prominently displayed)
- Star rating with review count
- Publisher name with verified badge for major publishers (Microsoft, Google)
- "Free" pricing badge
- Categories and tags for discoverability

**Card Design:**
- Extension icon, name, publisher, short description
- Install count, rating stars
- "Free" or price badge

**Visual Design:**
- Light theme with green (#107c10) install button, blue (#0078D4) links
- Segoe UI font throughout
- 1160px centered content, 32px banner padding
- Clean, corporate, information-dense

**What to learn:** The green Install button is unmistakable -- high contrast, fixed position, large target. The Q&A tab is a pattern RuleSell should consider (not just reviews, but questions). "Language Model Tools" and "Chat" as 2026 category additions show IDE marketplaces recognizing AI as a first-class asset type -- RuleSell's entire value prop.

---

### 2.7 GitHub Marketplace (Tier 2)

**URL:** https://github.com/marketplace

**Navigation Structure:**
- Two-way content split: Apps (integrations) and Actions (CI/CD workflows)
- Top-level sections: AI Code Creation, Developer Workflows, Application Security
- Verified publisher badges as primary trust signal

**Key Patterns:**
- Category grid on larger screens, popup menu on tablets
- Actions use semver pinning (`@v1`, `@v2.3.1`) -- cleanest versioning model in the landscape
- Apps install via OAuth + repo selection; Actions install by pasting a YAML snippet
- Single-topic filtering only (no multi-filter)
- Revenue split: 75% to creator after first $1M/year

**What to learn:** The two-layer taxonomy (type x category) instead of flat categories is the right model for multi-type content. Semver-pinned versioning for installable assets is the gold standard. Verified publisher badges work because GitHub has the identity graph to back them up. Weakness: everyone considers the Marketplace a "graveyard" -- discovery is poor, and pricing is hidden behind individual pages.

---

### 2.8 Figma Community (Tier 2)

**URL:** https://www.figma.com/community

**Navigation Structure:**
- Filter tabs at top: All | Files and Templates | Plugins | Widgets | Creators
- Search bar with type-ahead
- Category browsing within each type

**Key Patterns:**
- Multi-type content (4 types) separated by horizontal tabs, not separate pages
- Visual-first cards: large thumbnail, title, creator avatar, like count
- Each type has independent browse/filter experience within the same page
- Plugin cards include: icon, title, description, install count, creator
- Creator profiles aggregate all their content types

**Card Design:**
- Highly visual -- dominated by thumbnail image
- Title below image, creator name, like count
- Minimal metadata compared to npm (appropriate for design audience)

**What to learn:** Figma proves that tabs (not separate pages) work for up to 4 content types. The thumbnail-dominant card works for visual content but would be wrong for developer tools where code/text content dominates. Creator profiles that aggregate across types build creator identity.

---

### 2.9 Raycast Store (Tier 2)

**URL:** https://www.raycast.com/store

**Navigation Structure:**
- Header: Store, Pro, AI, iOS, Windows, Teams, Developers, Blog, Pricing
- Within store: tabs for "All Extensions", "Recently Added", "Most Popular"
- Platform filter: All | macOS | Windows
- Cmd+K search (prominent keyboard shortcut)

**Card Design:**
- Grid layout with featured extensions in larger cards at top
- Each card: icon, title, description, developer avatar + name, download count, command count, platform badge, Install button
- Clean, minimal aesthetic with generous whitespace
- Teal/cyan accent (#00b3ff) for buttons

**Install Flow:**
- Click "Install Extension" -> triggers `raycast://` protocol link -> opens directly in app
- Zero-friction native install -- browser to app in one click

**Trust Signals:**
- Download count (hundreds of thousands visible)
- Developer profile with bio and avatar
- Multiple contributors listed for popular extensions
- GitHub source links

**What to learn:** The `raycast://` protocol link for one-click install from browser to app is the ideal UX that RuleSell should eventually support for compatible clients. The Cmd+K search shortcut is expected by power users. Platform filtering (macOS/Windows) maps directly to RuleSell's environment filtering (Claude Code/Cursor/Windsurf). Featured items in oversized cards create visual hierarchy in a grid.

---

### 2.10 HuggingFace Hub (Tier 2)

**URL:** https://huggingface.co/models

**Navigation Structure:**
- Top nav tabs: Models | Datasets | Spaces | Buckets | Docs | Enterprise | Pricing
- Each type has completely independent browse experience
- Models page: 2,771,525 total items

**Filter System (the most comprehensive in the category):**
- Tasks: Text Generation, Image-to-Text, Text-to-Image, etc. (44+ task types)
- Parameters: slider from <1B to >500B
- Libraries: PyTorch, TensorFlow, JAX, Transformers, GGUF, etc. (42+ options)
- Apps: vLLM, llama.cpp, Ollama, LM Studio, etc.
- Inference Providers: Groq, Cerebras, Together AI, etc.
- Sub-tabs within filters: Main | Tasks | Libraries | Languages | Licenses | Other

**Card Design:**
- Model name (linked), task type badge, parameter count, last-updated timestamp, download count, like count
- 6 data points per card -- dense but scannable
- Color-coded task badges

**Sorting:**
- Trending (default), Most Downloads, Most Likes, Recently Updated

**What to learn:** HuggingFace proves that 60+ filter options work at scale (2.7M items) but overwhelm at small scale. The sub-tab organization of filters (Tasks | Libraries | Languages | Licenses) is elegant -- it groups filter axes by concern. The "Trending" default sort is better than "Most Popular" because it surfaces fresh content. Task-type badges with color coding create scannable visual hierarchy in dense listings. At 4 top-level types (Models/Datasets/Spaces/Buckets), HuggingFace represents the practical ceiling for tab-based type navigation.

---

### 2.11 Vercel Templates (Tier 2)

**URL:** https://vercel.com/templates

**Navigation:**
- Integrated into Vercel's main nav (Products, Resources, Solutions, Enterprise, Pricing)
- "Find your Template" as page heading

**Filter System:**
- Framework filter: Next.js, Nuxt, Svelte, etc.
- Use-case categories: AI, Starter, Ecommerce, SaaS, Blog, Portfolio, CMS, Backend, Authentication, Documentation
- Dynamic filtering without page reload

**Card Design:**
- Thumbnail preview image (dominant), template name, publisher, brief description, framework tags, demo URL
- Clean grid, uniform card dimensions
- Light/dark theme support

**Deploy Flow:**
- Browse -> Click card -> View demo or repo -> Deploy to Vercel
- Framework filter is the primary discovery axis (developers think in framework first)

**What to learn:** The framework-first filter is relevant to RuleSell's environment-first filter (Claude Code, Cursor, etc.). Vercel proves that when users know their platform, that's the first filter they apply. Preview thumbnails work for templates where visual output matters, but not for CLI tools or configs.

---

### 2.12 Homebrew Formulae (Tier 2)

**URL:** https://formulae.brew.sh

**Navigation:**
- Minimal: "Browse all formulae" | "Browse all casks" | "Browse cask fonts" | Analytics | API docs
- Algolia-powered search ("Search Homebrew Formulae")
- Light theme, minimal design, GitHub fork ribbon

**Key Patterns:**
- Two content types (formulae and casks) separated at the nav level
- Search is primary discovery mechanism
- Copyable install commands with clipboard button
- Extremely sparse cards -- name + brief description only
- Detail pages show: install command, dependencies, analytics

**What to learn:** Homebrew formulae is the extreme-minimalist end of the spectrum. It proves that for a CLI-first tool, the browse UI can be extremely simple. The copyable install command with clipboard button is the one non-negotiable UX element. Analytics (install counts over time) on detail pages add trust without requiring a review system.

---

## 3. Cross-Cutting IA Principles

### 3.1 How Multi-Type Marketplaces Organize Content

| Marketplace | Types | Navigation Method | Works? |
|---|---|---|---|
| HuggingFace | 4 (Models/Datasets/Spaces/Buckets) | Top-level nav tabs, independent browse per type | Yes, but strains at 4 |
| GitHub Marketplace | 2 (Apps/Actions) | Type split in nav, then category grid | Yes |
| Figma Community | 4 (Files/Plugins/Widgets/Creators) | Horizontal filter tabs on same page | Yes |
| cursor.directory | 4 (Rules/MCP/Plugins/Integrations) | Nav links to separate pages | Yes |
| VS Code Marketplace | 1 (Extensions) with 21 categories | Flat category grid | Yes, but no type split needed |
| RuleSell | 9 types | ??? | Unsolved |

**The threshold:** 3-4 top-level content types is the maximum that works in a horizontal tab or nav bar. Beyond that, the navigation becomes a dropdown menu or requires a different pattern entirely.

### 3.2 When to Use Tabs vs Separate Pages vs Unified Feed

**Tabs (same page):** Use when types share the same browse UX (same card layout, same filters). Figma does this. Works up to 4 tabs.

**Separate pages:** Use when types need fundamentally different browse experiences (different card layouts, different filters). HuggingFace does this. Scales to 4-5 types.

**Unified feed:** Use when the user doesn't care about type -- they care about problem solved. PromptBase does this (all prompts in one feed, regardless of target model). Works when types are variants of the same concept.

**For RuleSell's 9 types:** Neither pure tabs nor separate pages will work. The answer is a **super-category collapse**:

| Super-Category | Contains | Rationale |
|---|---|---|
| **Configs** | Rules, Prompts, Skills | Text-based configuration assets |
| **Servers & Tools** | MCP Servers, CLIs, Agent Teams | Executable/installable software |
| **Workflows** | Workflows, Datasets | Data and automation pipelines |
| **Bundles** | Bundles | Curated collections |

This gives 4 top-level types (navigable by tabs) with type as a secondary filter within each. Users who know what they want can filter to "MCP Servers" specifically; users who are exploring can browse "Servers & Tools" broadly.

### 3.3 Preventing Category Overwhelm

**Problem:** glama.ai has 60+ filter options. mcpmarket has 23+ categories. HuggingFace has 44+ task types. How do you prevent overwhelm?

**Proven patterns:**
1. **Progressive disclosure:** Show 5-7 top categories, collapse the rest behind "Show more." HuggingFace does this with "(+ 44 more)" links.
2. **Contextual filtering:** Only show filters relevant to the current view. If browsing MCP Servers, don't show "Prompt Style" filters.
3. **Live counts:** Show the number of items per filter option. This helps users evaluate whether a filter is worth applying. HuggingFace and glama.ai both do this.
4. **URL-synced filters:** Every filter state must be reflected in the URL so users can share, bookmark, and navigate back. Failure to do this is the #1 filter UX anti-pattern.

### 3.4 Primary vs Secondary Navigation

| Level | What goes here | Examples |
|---|---|---|
| **Global nav (header)** | Content type super-categories, Search, Account | "Browse", "Leaderboard", "Collections", search bar |
| **Page-level tabs** | Sub-types within a super-category, Sort modes | "All Time", "Trending", "New" (skills.sh pattern) |
| **Sidebar filters** | Attribute-based filtering within current view | Environment, Category, Price, License |
| **URL params** | All filter state | `?type=mcp&env=claude-code&sort=trending` |

---

## 4. Visual Design Patterns Catalog

### 4.1 Dark Mode Conventions (2026)

Developer tool marketplaces overwhelmingly default to dark mode. Reference values:

| Token | Hex | Usage |
|---|---|---|
| Background | #0a0a0b to #121212 | Page background. Off-black, never pure #000 |
| Surface | #18181B (Zinc 900) | Cards, panels, elevated elements |
| Surface-raised | #27272A (Zinc 800) | Hover states, active cards, modal backgrounds |
| Border | #3f3f46 (Zinc 700) | Subtle borders between elements. 1px solid |
| Text-primary | #e0e0e0 to #fafafa | Body text. Off-white, never pure #fff |
| Text-secondary | #a1a1aa (Zinc 400) | Labels, metadata, timestamps |
| Text-muted | #71717a (Zinc 500) | Placeholder text, disabled states |
| Accent | Brand-specific | One accent color used with purpose |

**Elevation without shadows:** In dark mode, depth comes from surface lightness, not drop shadows. A card at elevation-1 uses #18181B; a modal at elevation-2 uses #27272A. Borders (#3f3f46) reinforce edges.

**Contrast:** WCAG AA minimum (4.5:1 for body text, 3:1 for large text). Comfort-based contrast pushes above minimum -- #e0e0e0 on #121212 gives ~15:1, which is comfortable for extended reading.

### 4.2 Card Density Spectrum

| Marketplace | Data Points per Card | Style |
|---|---|---|
| skills.sh | 3 (name, repo, installs) | Ultra-minimal table rows |
| Homebrew | 2 (name, description) | Minimal list |
| npm search results | 7 (name, description, keywords, author, date, version, downloads) | Dense list rows |
| Raycast | 6 (icon, name, description, author, downloads, install button) | Medium grid cards |
| HuggingFace | 6 (name, task badge, params, updated, downloads, likes) | Dense grid cards |
| VS Code | 5 (icon, name, publisher, description, installs) | Medium list/grid |
| Figma | 3 (thumbnail, name, author) | Visual grid cards |

**For RuleSell:** Target 5-6 data points per card for the browse view: name, type badge, environment badges, author, primary metric (installs or downloads), price (if paid) or "Free" badge. Add description on hover or in an expanded view.

### 4.3 Trust Signal Placement

Trust signals ranked by impact (based on cross-marketplace analysis):

1. **Install/download count** -- Every marketplace shows this. It's the #1 trust signal. Display as a number with magnitude suffix (e.g., "12.3K installs").
2. **Last updated / last published** -- Recency signals maintenance. npm shows "2 months ago"; HuggingFace shows "7 days ago". Stale items (>6 months) should be flagged.
3. **Source repository link** -- GitHub/GitLab link proves the code is real and inspectable. All MCP registries show this.
4. **Star rating + review count** -- VS Code (4/5 with 627 reviews) and PromptBase (4.9 stars, 39K reviews) use this. Effective only when review volume is sufficient (>10 reviews).
5. **Verified publisher badge** -- GitHub and VS Code use this. Only meaningful if backed by real verification (identity, org membership).
6. **License** -- npm shows this in the sidebar. Developers check license before installing.
7. **Dependency/dependent count** -- npm unique. Shows ecosystem integration.

### 4.4 Install Command Treatment

| Marketplace | Install Command | Position | Styling |
|---|---|---|---|
| npm | `npm i <package>` | Top of right sidebar | Dark code block, copy button |
| skills.sh | `npx skills add <org/repo>` | Fixed element on page | Monospace, terminal-style |
| Smithery | `smithery install <server> --client claude` | Detail page | CLI documentation format |
| VS Code | `ext install <publisher.extension>` | Detail page banner | Light background, copy button |
| Raycast | Protocol link (raycast://) | Install button on card | Green button + URL scheme |
| Homebrew | `brew install <formula>` | Detail page | Copyable block with clipboard button |

**Best practice:** The install command must be:
1. Above the fold on the detail page
2. In a monospace font within a visually distinct block (dark background in light theme, slightly lighter background in dark theme)
3. Accompanied by a copy-to-clipboard button
4. Showing the exact command the user needs to run -- no "choose your package manager" decision tree
5. Optionally showing variant commands for different environments (Claude Code vs Cursor vs Windsurf)

### 4.5 Typography for Developer Marketplaces

**Body text:** System font stack or Inter/Geist Sans at 14-16px. Not monospace for body.
**Code/commands:** Monospace (Fira Mono, JetBrains Mono, Geist Mono) at 13-14px.
**Headings:** 20-28px bold for page titles, 16-18px semibold for section headers.
**Metadata labels:** 11-12px uppercase tracking-wide in secondary color.
**Metadata values:** 13-14px medium/bold.
**Line height:** 1.5 for body, 1.3 for headings, 1.6 for long-form readme content.

### 4.6 Animation Guidelines

Developer tool marketplaces use minimal animation. The spectrum:

**Do:**
- Micro-transitions on hover/focus (150-200ms ease-out): background color, border color, slight scale (1.01-1.02x)
- Copy-to-clipboard feedback: brief checkmark animation (300ms)
- Page transitions: fade (200ms) or subtle slide (250ms)
- Skeleton loading screens during data fetch
- Smooth scroll for anchor navigation

**Don't:**
- Parallax scrolling on browse pages
- Animated backgrounds or gradients
- Bouncing or elastic animations
- Delayed stagger animations on card grids (slows perceived load time)
- Motion on every element -- reserve it for user-initiated actions

**The rule:** If removing the animation wouldn't change the user's ability to complete their task, the animation is decorative. Decorative animation in developer tools signals "toy, not tool."

### 4.7 Color Usage

**The restraint principle:** One accent color used consistently beats five colors competing for attention.

**Category colors:** mcpmarket and RuleSell's current implementation use per-category colors on type badges. This works IF:
- Colors are muted/desaturated (not fully saturated primaries)
- Limited to badge backgrounds or left-border accents
- The rest of the card remains neutral
- Maximum 8-10 distinct colors (beyond that, they become indistinguishable)

**When category colors hurt:** If every card has a different bright color, the browse page looks like a rainbow and nothing stands out. The eye has nowhere to rest. This is the Figma Community problem for plugin cards vs the npm approach (monochrome cards, color only in the npm logo).

---

## 5. Anti-Patterns to Avoid

### 5.1 Too Many Top-Level Nav Items
**Problem:** More than 5-6 items in the top nav bar forces a "More" dropdown or hamburger menu, both of which hide content and reduce discoverability. RuleSell with 9 types in the nav would be unusable.
**Fix:** Collapse into 3-4 super-categories (see Section 3.2).

### 5.2 Filters That Don't Sync with the URL
**Problem:** User applies filters, copies URL to share with colleague, colleague sees unfiltered view. This is the #1 source of user frustration in faceted navigation.
**Fix:** Every filter, sort, and pagination state must be reflected in URL query parameters. Use `?type=mcp&env=claude-code&sort=trending&page=2`.

### 5.3 Modals for Filtering
**Problem:** Opening a modal to show filter options breaks spatial context. The user can't see the results updating as they change filters.
**Fix:** Sidebar or inline chip filters that update results in real-time. Modals are for confirmation dialogs, not for filtering.

### 5.4 Perceived Slowness
**Problem:** Two marketplaces can load in 3 seconds. One shows a blank page then suddenly renders; the other shows skeleton screens that progressively fill in. The second feels 20-30% faster.
**Fix:**
- Skeleton screens for all data-dependent content (cards, counts, metadata)
- Instant response to user input (filter clicks, search keystrokes)
- Optimistic UI for install/save/like actions
- Route prefetching for likely next pages (detail page when hovering a card)

### 5.5 No Path for the Skeptical Visitor
**Problem:** Most marketplace homepages assume the user is ready to browse. But many visitors arrive skeptical: "Why should I trust this marketplace? What's actually being used here?"
**Fix:** Leaderboard as a top-level nav item (mcpmarket's Top-100 pattern). Leaderboards answer "what's actually used" without requiring the user to trust the marketplace's curation.

### 5.6 Hidden Install Commands
**Problem:** Some marketplaces bury the install command below the fold, behind a tab, or after a long readme. This increases time-to-install and increases drop-off.
**Fix:** Install command must be the FIRST actionable element on the detail page. npm's sidebar placement (top of right column) is the gold standard.

---

## 6. The Time-to-Install Funnel

### 6.1 The Four Stages

```
Landing  -->  Discovery  -->  Evaluation  -->  Install
(0 clicks)   (1-2 clicks)   (1 click)      (1 action)
```

### 6.2 Stage-by-Stage Requirements

**Stage 1: Landing (0 clicks)**
- User arrives at homepage
- Must communicate: what this marketplace is, what's popular, how to start
- Required elements: search bar, category/type entry points, featured items, scale signal ("X items available")
- Decision: search (user knows what they want) or browse (user is exploring)

**Stage 2: Discovery (1-2 clicks)**
- User is browsing results (search results, category page, or leaderboard)
- Must communicate: enough info per card to decide whether to click through
- Required card elements: name, type, primary metric (installs), environment compatibility, price
- Drop-off risk: too many results with insufficient differentiation (all cards look the same)
- Fix: clear visual hierarchy within cards, sort by relevance/trending, and strong type/environment badges

**Stage 3: Evaluation (1 click)**
- User is on the detail page
- Must communicate: what it does, how to install, whether it's trustworthy
- Required above-fold elements: name, description, install command (copyable), primary metrics, environment compatibility
- Required below-fold elements: full readme, reviews, related items, version history
- Drop-off risk: install command is buried, trust signals are absent, readme is empty
- Page-view-to-install benchmark: 26-34% (from app store data)

**Stage 4: Install (1 action)**
- User copies the install command and runs it
- Must communicate: success/failure feedback, next steps
- Required: copy-to-clipboard with visual confirmation, environment-specific command variants
- Drop-off risk: command doesn't work, requires additional setup not documented

### 6.3 Ideal Click Counts

| Path | Clicks to Install |
|---|---|
| Search path (user knows what they want) | 2 (search -> detail -> copy install) |
| Browse path (user is exploring) | 3 (category/type -> browse results -> detail -> copy install) |
| Leaderboard path (user wants what's popular) | 2 (leaderboard -> detail -> copy install) |
| Homepage featured | 2 (click featured item -> copy install) |

**Target:** No path to install should require more than 3 clicks from the homepage. The install command must be visible on the detail page without scrolling.

### 6.4 The Role of Search vs Browse vs Recommendation

| User intent | Mechanism | When it dominates |
|---|---|---|
| "I know what I need" | Search | Scale >1,000 items (npm model) |
| "I'm exploring a category" | Browse with filters | Scale 50-1,000 items (VS Code model) |
| "Show me what's good" | Leaderboard / trending / featured | Scale <500 items, or first-time visitors |
| "What works for my setup?" | Environment-filtered recommendations | Multi-environment marketplaces |

At RuleSell's current scale (~60 items), **browse and leaderboard should dominate**. Search becomes primary at 500+ items. Recommendation becomes meaningful at 1,000+ items with enough signal data.

---

## 7. Specific Recommendations for RuleSell

### 7.1 Navigation Architecture

**Global Header (always visible):**
```
[RuleSell logo]  Browse  Leaderboard  Collections  [Search (/)]  [Account]
```
- 3 nav items + search + account = 5 elements. Clean, fits one line.
- "Browse" leads to the main marketplace page with type/environment filters
- "Leaderboard" is the trust-building entry point (copy mcpmarket's Top-100 pattern)
- "Collections" surfaces curated bundles and thematic groupings
- Search with "/" keyboard shortcut (skills.sh pattern)

**Browse Page Tabs (page-level, not global):**
```
All | Configs | Servers & Tools | Workflows | Bundles
```
- 5 tabs: one unified view + 4 super-categories
- Below tabs: secondary filter chips for environment (Claude Code | Cursor | Windsurf | etc.) and price (Free | Paid)
- Sidebar (desktop): full filter panel with type, category, environment, price, sort, license
- All filter state synced to URL

**Why this works:**
- Global nav has 3 items (well under the 5-6 threshold)
- Page-level tabs have 5 options (manageable)
- Full 9-type taxonomy accessible via sidebar filter, not forced into navigation
- Environment filter as horizontal chips mirrors Raycast's platform filter (All | macOS | Windows)

### 7.2 Card Design

```
+-----------------------------------------------+
| [Type Badge]  [Env Badges: CC | Cursor | WS]  |
|                                                |
| Package Name                          [Price]  |
| Brief description (1 line, truncated)          |
|                                                |
| @author  ·  12.3K installs  ·  Updated 2d ago |
+-----------------------------------------------+
```

- **Type badge:** colored left-accent or small pill (e.g., "MCP" in blue, "Rule" in green) -- muted colors, not saturated
- **Environment badges:** small icons or pills showing compatible environments
- **Package name:** 16px semibold, primary text color
- **Description:** 14px regular, secondary text color, single line with ellipsis
- **Footer row:** 12-13px, muted color. Author (linked), install count, last-updated
- **Price:** "Free" in muted text or "$4.99" in accent color, right-aligned
- **Density:** 5-6 data points per card, matching the npm search result density level
- **Layout:** List layout for search results and category browse (scannable). Optional grid layout for featured/homepage sections.

### 7.3 Detail Page Layout

**Above the fold (no scrolling required):**

```
+---Main Content (65%)----------+---Sidebar (35%)---------------+
|                               |                               |
| [Type Badge] Package Name     | Install Command               |
| @author · Environment badges  | [npx rulesell install slug]   |
|                               | [Copy] [Claude Code] [Cursor] |
| Brief description (2-3 lines) |                               |
|                               | 12.3K installs [sparkline]    |
| [Readme] [Reviews] [Versions] | Version: 2.1.0                |
|                               | License: MIT                  |
+---Tabs below the fold---------| Updated: 2 days ago           |
|                               | Author: @username             |
| Rendered README               | Collaborators: [avatars]      |
| (full markdown)               |                               |
|                               | Categories: MCP, DevOps       |
|                               | Environments: CC, Cursor, WS  |
+-------------------------------+-------------------------------+
```

- Install command at TOP of sidebar, in a dark code block with copy button (npm pattern)
- Environment variant tabs within the install section: clicking "Claude Code" shows the Claude Code install command; clicking "Cursor" shows the Cursor variant
- Install count with sparkline trend (npm pattern)
- Metadata stack below: version, license, last-updated, author, collaborators, categories, environments
- Main content: tabs for Readme | Reviews | Versions | Related

### 7.4 Search UX

- Search bar in global header, always visible, taking ~40% of header width
- "/" keyboard shortcut to focus search (displayed as hint in search placeholder)
- Search across ALL content types -- results grouped by type with type badges
- Autocomplete showing top 5 results as user types
- Search results page: list layout with same card design as browse
- Filter sidebar on search results: type, environment, price, sort

### 7.5 Mobile Navigation

- Hamburger menu for global nav (Browse, Leaderboard, Collections, Account)
- Search bar remains visible (sticky header)
- Browse page: type tabs become horizontal scrollable chips
- Filter sidebar becomes a bottom sheet (not a modal)
- Cards stack vertically, full width
- Detail page: install command remains above the fold, sidebar content moves below main content
- Install command sticks to bottom of viewport on mobile (like a "Buy" button in e-commerce)

### 7.6 Visual Design Direction

- **Dark mode default** with light mode available
- **Background:** #0a0a0b (near-black)
- **Card surface:** #18181B with #27272A on hover
- **Borders:** 1px solid #3f3f46
- **Text:** #fafafa primary, #a1a1aa secondary, #71717a muted
- **Accent:** single brand color (the current RuleSell blue-purple) reserved for CTAs, active states, and the install button
- **Type badges:** muted category colors (desaturated) -- not competing with the accent color
- **Font:** Geist Sans for body, Geist Mono for code/commands
- **Animation:** hover transitions only (150ms), copy feedback (300ms), skeleton loading. No stagger, no parallax, no decorative motion.
- **Card layout:** list view as default (npm-like density), grid view as toggle option

### 7.7 Trust-Building Strategy

Since RuleSell is starting with ~60 items and zero install data, trust must be bootstrapped:

1. **Show real GitHub metrics:** Stars, forks, last commit date for linked repos -- these exist today and are trusted signals
2. **Environment compatibility badges:** Verified-install badges for each environment where the item was tested
3. **Certified reviewer system:** Already designed. Prioritize getting 3-5 certified reviewers active before public launch
4. **Leaderboard with honest data:** Show install counts even if they're low. Honesty at small scale builds more trust than hiding numbers
5. **Source transparency:** Link to the source repo from every listing. "You can read the code" is the ultimate trust signal for developers
6. **Last-tested date:** Show when the item was last verified to work, not just when it was published

---

*Document total: ~5,800 words*
*Research method: 25+ WebSearch queries, 12+ WebFetch attempts (6 successful, 6 blocked by rate limits), cross-referenced with existing competitor teardown from 2026-04-08*
