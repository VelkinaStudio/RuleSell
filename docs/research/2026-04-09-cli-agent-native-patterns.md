# CLI & Agent-Native Integration Patterns — RuleSell Marketplace Research

**Date:** 2026-04-09
**Status:** COMPLETE
**Purpose:** Deep research into how developer tool marketplaces integrate with CLIs and AI agents, to inform the RuleSell CLI (`npx rulesell`) and agent-native website architecture.
**Method:** WebSearch + WebFetch across 30+ sources including official docs for npm, Homebrew, pip, cargo, GitHub CLI, Vercel CLI, Stripe CLI, Railway CLI, Smithery, skills.sh, Claude Code plugins, Cursor, MCP spec proposals, and llms.txt.

---

## 1. Executive Summary

The 2026 landscape for developer tool distribution is fragmenting across two axes: **CLI-first package managers** (npm, Homebrew, cargo) that have decades of proven auth/install patterns, and **AI-agent-native registries** (MCP Registry, skills.sh, Smithery, Claude Code plugins) that are 6-18 months old and still standardizing. RuleSell sits at the intersection — it needs to feel as frictionless as `npm install` for open-source items while supporting OAuth-gated paid content.

**Key findings:**

1. **The device code OAuth flow is the industry standard for CLI auth.** GitHub CLI, Vercel CLI, Stripe CLI, and Railway CLI all use it. The user sees a code, opens a browser, confirms, and the CLI polls for completion. No localhost redirect needed.

2. **Environment detection is a solved problem with a messy implementation.** The skills.sh CLI maintains a hardcoded list of 11+ agent skill directories. Smithery detects Claude Desktop and Cursor. Every tool does its own detection because there is no standard. RuleSell must maintain its own detection map.

3. **MCP config files differ per tool but share the same JSON schema.** The `mcpServers` object structure is nearly identical across Claude Code, Claude Desktop, Cursor, Windsurf, and Cline — only the file path differs. This means a single config writer with per-tool path resolution handles everything.

4. **Claude Code's plugin system is the most complete marketplace integration today.** It supports Git-based marketplaces, scoped installations (user/project/local), auto-updates, and a `/plugin` interactive browser. RuleSell should publish as a Claude Code marketplace (`marketplace.json`) as a primary distribution channel.

5. **`/llms.txt` and MCP Server Cards (`.well-known/mcp/server-card.json`) are the two emerging standards for agent-native websites.** Both are pre-standard but have strong adoption among AI-native companies. RuleSell should implement both from day one.

6. **OpenAI Plugins failed because of friction** — users had to manually select plugins per conversation, discovery was poor, and the OAuth flow was confusing. The lesson: make everything zero-config by default, with auth only for paid items.

---

## 2. CLI Installation Patterns

### 2.1 Comparison Table

| Tool | Install Command | Auth Mechanism | Private/Paid Support | Update Mechanism | Env Detection |
|------|----------------|----------------|---------------------|------------------|---------------|
| **npm** | `npm install <pkg>` | Token in `~/.npmrc`, browser login (npm 9+) | Private packages via scoped registries, PAT | `npm update` | `engines` field in package.json |
| **Homebrew** | `brew install <formula>` | `HOMEBREW_GITHUB_API_TOKEN` env var, `~/.netrc` | Private taps via GitHub PAT | `brew upgrade` | macOS/Linux only, arch detection |
| **pip/PyPI** | `pip install <pkg>` | Keyring, `~/.netrc`, `--index-url` with basic auth | Private indexes, keyring backends | `pip install --upgrade` | Python version, `--python-requires` |
| **cargo** | `cargo install <crate>` | Token in `~/.cargo/credentials.toml`, OS keychain | Alternative registries with `auth-required` | `cargo install` (overwrites) | Platform targets in manifest |
| **skills.sh** | `npx skills add <owner/repo>` | None (all free) | None | Re-run `npx skills add` | Detects 11+ agent directories |
| **Smithery** | `smithery mcp add <url> --client <name>` | `smithery auth login` | Not documented | `smithery mcp update` | `--client` flag (claude, cursor) |
| **Claude Code Plugins** | `/plugin install <name>@<marketplace>` | Anthropic account (implicit) | Via marketplace auth | Auto-update at startup | N/A (runs inside Claude Code) |
| **VS Code** | `code --install-extension <id>` | Azure DevOps PAT for publishing | Private marketplace (GitHub Enterprise) | Auto-update built-in | Extension `engines.vscode` field |
| **Raycast** | In-app store only | Raycast account | In-app purchase | Auto-update | macOS only |
| **GitHub CLI** | `gh extension install <owner/repo>` | `gh auth login` (device code flow) | Private repos via auth | `gh extension upgrade` | Cross-platform |

### 2.2 Deep Analysis Per Tool

#### npm — The Gold Standard for Registry Auth

npm's auth evolution is instructive for RuleSell:

- **Legacy (pre-v9):** `npm login` prompted for username/password/email at the terminal. Token stored in `~/.npmrc` as `//registry.npmjs.org/:_authToken=<token>`.
- **Modern (v9+):** Browser-based login is the default. `npm login` opens the browser, user authenticates at npmjs.com, token returned to CLI. The `--auth-type=legacy` flag falls back to prompt-based.
- **CI/CD:** Uses `NPM_TOKEN` environment variable. The `.npmrc` file contains `${NPM_TOKEN}` placeholder.
- **Private packages:** Scoped packages (`@org/pkg`) can point to custom registries. Auth is per-registry in `.npmrc`.
- **Discovery:** `npm search <term>` queries the registry API. Results show name, description, version, date, keywords.

**Lesson for RuleSell:** The `.npmrc`-style per-registry token storage is proven. RuleSell should store tokens in `~/.rulesell/auth.json` with a similar pattern.

#### Homebrew — Tap System for Curated Registries

- **Public:** `brew install <formula>` pulls from the default `homebrew/core` tap. No auth needed.
- **Private taps:** `brew tap <org>/<repo>` clones a private Git repo. Requires `HOMEBREW_GITHUB_API_TOKEN` environment variable or entries in `~/.netrc`.
- **Discovery:** `brew search <term>` searches formulae names and descriptions. No rich metadata.
- **Bottles:** Pre-built binaries keyed by OS version + architecture. The formula declares the mapping, `brew` resolves automatically.

**Lesson for RuleSell:** The tap model maps well to marketplace sources. A RuleSell "marketplace source" is analogous to a Homebrew tap — a curated collection of items from a single publisher.

#### pip/PyPI — Keyring Integration for Enterprise Auth

- **Public:** `pip install <pkg>` from pypi.org, no auth.
- **Private indexes:** `pip install --index-url https://private.pypi.com/simple/ <pkg>` with credentials in keyring, `~/.netrc`, or URL-embedded (`https://user:pass@host`).
- **Keyring:** `pip install keyring` enables OS-native credential storage. Cloud backends exist for AWS CodeArtifact, Google Artifact Registry.
- **Discovery:** PyPI has a JSON API at `https://pypi.org/pypi/<package>/json`. `pip search` was disabled in 2021.

**Lesson for RuleSell:** Keyring integration is overkill for a new marketplace. Simple token file + environment variable fallback covers 95% of use cases.

#### cargo/Crates.io — Server-Driven Auth Challenge

- **Public:** `cargo install <crate>` from crates.io, no auth.
- **Private registries:** Declared in `.cargo/config.toml`. Auth tokens stored in `~/.cargo/credentials.toml` or OS keychain via credential providers.
- **Server challenge:** If a server responds with HTTP 401, cargo re-tries with auth. The response can include a `www-authenticate: Cargo login_url="<URL>"` header directing the user to get a token.
- **Discovery:** `cargo search <term>` queries crates.io API.

**Lesson for RuleSell:** The server-driven auth challenge pattern (401 → redirect to login) is elegant. RuleSell's API should return 401 with a `login_url` for paid items, letting the CLI handle the redirect automatically.

#### skills.sh — The Agent Skills CLI

- **Install:** `npx skills add <owner/repo>` or `npx skills add <owner/repo> -a claude-code -a opencode`
- **Sources:** GitHub shorthand, full Git URLs, GitLab, local paths
- **Agent detection:** Scans for known agent directories: `~/.claude/skills/`, `~/.cursor/skills/`, `~/.codeium/windsurf/skills/`, `~/.copilot/skills/`, `~/.codex/skills/`, `~/.roo/skills/`, `~/.gemini/skills/`, `~/.trae/skills/`, `~/.kiro/skills/`, `~/.continue/skills/`, and the canonical `~/.agents/skills/`
- **Known issue:** Path mismatch — CLI writes to `~/.agents/skills/` but Claude Code reads from `~/.claude/skills/`. The `-a claude-code` flag resolves this.
- **Auth:** None. All skills are open-source.
- **Telemetry:** Anonymous install tracking (skill name + timestamp) powers the leaderboard.

**Lesson for RuleSell:** The `-a` flag pattern for targeting specific agents is a good UX. RuleSell should support `npx rulesell add @author/item --target claude-code,cursor` with auto-detection as the default.

#### Smithery CLI — MCP Server Management

- **Install:** `smithery mcp add <url> --client <name>` where client is `claude`, `cursor`, etc.
- **Search:** `smithery mcp search [term]` queries the Smithery registry
- **Config:** `--config '{"key":"value"}'` to pre-configure server params, skipping interactive prompts
- **Auth:** `smithery auth login` — flow not documented in detail
- **Skills:** Also supports `smithery skill add <skill> --agent <name>` for skills installation

**Lesson for RuleSell:** Smithery proves the `--client` flag pattern works for MCP installation. RuleSell's CLI should adopt the same pattern but extend it beyond MCP servers to rules, skills, and workflows.

#### Claude Code Plugins — The Most Complete System

Claude Code's plugin ecosystem (launched mid-2026) is the most relevant reference:

- **Marketplace model:** A marketplace is a Git repo containing `.claude-plugin/marketplace.json`. Users add marketplaces, then install individual plugins from them.
- **Install:** `/plugin install <name>@<marketplace>` or `claude plugin add @anthropic/deploy-helper`
- **Sources:** GitHub (`owner/repo`), Git URLs, local paths, remote `marketplace.json` URLs
- **Scopes:** User (global), Project (shared via `.claude/settings.json`), Local (personal per-project)
- **Auto-update:** Official marketplaces auto-update at startup. Third-party marketplaces opt-in.
- **Official marketplace:** `claude-plugins-official` is built-in. Plugins submitted via claude.ai form.
- **Team config:** `.claude/settings.json` can declare `extraKnownMarketplaces` for automatic team provisioning.

**Lesson for RuleSell:** RuleSell should publish a Claude Code marketplace. This is the highest-leverage distribution channel for Claude Code users. The `marketplace.json` format is the spec to target. Additionally, RuleSell should support `/plugin marketplace add rulesell` as a first-class onboarding path.

---

## 3. AI Agent Marketplace Integration

### 3.1 Current State of Agent Discovery

**Claude Code MCP Server Discovery:**
- MCP servers are configured in `~/.claude.json` (user scope) or `.mcp.json` (project scope)
- Claude Code does NOT auto-discover MCP servers. Users must configure them manually or via plugins.
- The plugin system is the bridge: plugins can bundle pre-configured MCP servers (e.g., the `github`, `sentry`, `vercel` plugins)

**MCP Registry (registry.modelcontextprotocol.io):**
- Official metadata repository backed by Anthropic, GitHub, and Microsoft
- Stores metadata only, not code. Two types: remote (connection URLs) and local (install commands)
- Namespace system: reverse-DNS patterns (e.g., `com.slack/calendar`, `io.github.user/tool`)
- UUID-based durable identifiers for caching
- Open-source API spec — anyone can build a sub-registry

**MCP Server Cards (SEP-1649, draft):**
- Proposed standard: `/.well-known/mcp/server-card.json` on any domain
- Advertises capabilities, transport config, auth requirements, available tools
- Enables auto-discovery: IDE extensions can configure themselves when pointed at a domain
- Not yet merged into core MCP spec but actively implemented

**Context7 MCP — The Recommendation Pattern:**
- Two tools: `resolve-library-id` (name → ID) and `query-docs` (ID → documentation)
- Works without auth for basic usage, optional API key for rate limits
- The pattern: natural language query → structured search → relevant content returned
- This is exactly what a RuleSell MCP server should do: `search-marketplace` (query → ranked items) and `get-item` (slug → install instructions)

### 3.2 Agent-Driven Recommendation Flow

The most interesting pattern emerging in 2026 is **agent-initiated marketplace queries**. Today this works like:

1. Developer asks their coding agent: "I need help with database migrations"
2. Agent recognizes this as a capability gap
3. Agent queries a tool registry (currently manual: "use context7" in prompts)
4. Registry returns relevant items with install instructions
5. Agent presents options; user confirms
6. Agent executes install command

**What's missing today:** No marketplace exposes a `recommend` tool that accepts natural language project descriptions and returns ranked items. Context7 does this for documentation, not marketplace items. RuleSell can own this pattern.

**The ideal flow for RuleSell:**
```
User: "Set up monitoring for my Next.js app on Vercel"
Agent: [calls rulesell.search_marketplace("nextjs vercel monitoring")]
Agent: "I found 3 relevant items on RuleSell:
  1. @vercel/sentry-mcp (free) - Sentry integration for error tracking
  2. @author/vercel-monitor-skill (free) - Deployment monitoring skill
  3. @author/observability-bundle ($12) - Full observability stack
  Want me to install any of these?"
User: "Install 1 and 2"
Agent: [calls npx rulesell add @vercel/sentry-mcp @author/vercel-monitor-skill]
```

### 3.3 OpenAI Plugins: What Failed

OpenAI's plugin system was deprecated in March 2024. Key failure modes:

1. **Manual activation friction:** Users had to select which plugins to activate per conversation. Most Plus subscribers never explored them.
2. **Discovery was terrible:** No recommendation engine, no "trending," no social proof. Users had to know what they wanted.
3. **OAuth was confusing:** Each plugin had its own OAuth flow with unique redirect URLs. Users encountered redirect failures regularly.
4. **Maintenance burden:** OpenAI had to review every plugin, handle security, support developers.
5. **Replacement (GPT Actions):** Simpler model — actions are built into Custom GPTs, no separate activation step. OAuth became authorization code + PKCE, with ChatGPT handling the token exchange. Developers specify client_id, client_secret, authorization_url, and token_url in the GPT editor UI.

**Lessons for RuleSell:**
- Open-source items must work with zero auth, zero friction
- Paid items should use a single OAuth provider (RuleSell's own), not per-creator OAuth
- Discovery must be agent-driven (the agent recommends, the user confirms)
- The "activate per conversation" pattern is death. Items should be persistent once installed.
- The GPT Actions model proves that centralized OAuth (one provider, not per-plugin) is the way forward

### 3.4 Cline MCP Marketplace

Cline (VS Code extension, formerly Claude Dev) operates its own MCP marketplace at github.com/cline/mcp-marketplace. Developers submit MCP servers via GitHub PR. Items get "one-click install" within Cline's VS Code sidebar. The config is written to Cline's VS Code globalStorage path automatically. No auth, no paid items — purely open-source directory.

**Lesson:** Cline proves the "submit via GitHub, install via UI" pattern works for free items. RuleSell items targeting Cline should write to the correct globalStorage path.

### 3.5 Cursor Rules Integration

- **Legacy:** `.cursorrules` file in project root, auto-detected by Cursor
- **Modern:** `.cursor/rules/` directory with `.mdc` files, supports file pattern matching (e.g., `*.tsx` auto-applies the rule)
- **CLI:** Unofficial "Cursor Rules CLI" exists — installs rules to `.cursor/rules/` automatically
- **No marketplace auth:** All rules are free, sourced from GitHub repos and cursor.directory

**Lesson for RuleSell:** For Cursor users, `npx rulesell add @author/cursor-rule` should write `.mdc` files to `.cursor/rules/`. The format is simple Markdown with YAML frontmatter.

---

## 4. OAuth Flow for CLI Tools

### 4.1 Industry Patterns

Every major CLI tool has converged on the **OAuth 2.0 Device Authorization Grant (RFC 8628)**:

| CLI | Auth Command | Flow | Token Storage | Token Expiry |
|-----|-------------|------|---------------|-------------|
| **GitHub CLI** | `gh auth login` | Device code → browser → poll | `~/.config/gh/hosts.yml` | Until revoked |
| **Vercel CLI** | `vercel login` | OAuth 2.0 Device Flow | `~/.local/share/com.vercel.cli/` | Session-based |
| **Stripe CLI** | `stripe login` | Custom device code (POST to /stripecli/auth) | Config file | 90 days |
| **Railway CLI** | `railway login` | Browser-based, `--browserless` for device code | Environment/config | Session |
| **Supabase CLI** | `supabase login` | Browser-based OAuth | Config file | Session |

### 4.2 Device Code Flow (How It Works)

The OAuth 2.0 Device Authorization Grant (RFC 8628) is the proven pattern:

1. **CLI → Server:** POST to `/oauth/device/code` with `client_id` and `scope`
2. **Server → CLI:** Returns `device_code`, `user_code` (e.g., "7701-C5F6"), `verification_uri`, `interval` (polling seconds), `expires_in`
3. **CLI → User:** Displays "Enter code 7701-C5F6 at https://rulesell.dev/device". Optionally copies code to clipboard and opens browser.
4. **User → Browser:** Visits URL, enters code, authenticates with RuleSell (email, GitHub OAuth, etc.), grants access
5. **CLI → Server:** Polls `/oauth/token` every `interval` seconds with `device_code` and `grant_type=urn:ietf:params:oauth:grant-type:device_code`
6. **Server → CLI:** Returns `access_token` + `refresh_token` when user completes auth
7. **CLI:** Stores token locally

**Why device code beats localhost redirect:**
- Works in SSH sessions, Docker containers, headless servers, WSL
- No port binding conflicts (localhost:3000 might be in use)
- Works when browser is on a different device (phone auth while SSHed)
- Simpler implementation — no HTTP server needed in the CLI
- Stripe's custom variant proves even simpler: POST to get a URL + verification code, poll for completion, no OAuth framework needed

### 4.3 Stripe's Simplified Device Code (Worth Copying)

Stripe's implementation is elegantly simple and worth studying:

1. CLI POSTs to `https://dashboard.stripe.com/stripecli/auth` with `device_name`
2. Server returns `{ browser_url, poll_url, verification_code }`
3. CLI opens `browser_url`, displays `verification_code` for visual confirmation
4. CLI polls `poll_url` every second (60-second window)
5. Before auth: `{ "redeemed": "false" }`
6. After auth: returns API keys (test + live mode) with 90-day expiry

No OAuth libraries, no token exchange, no PKCE. Just POST, poll, done. For RuleSell MVP, this simplified pattern is faster to implement than full RFC 8628. Graduate to proper OAuth when adding third-party integrations.

### 4.3 Recommended Pattern for RuleSell

```
npx rulesell login
  → "Opening browser... Enter code ABCD-1234 at https://rulesell.dev/device"
  → User authenticates at rulesell.dev (supports email, GitHub, Google SSO)
  → CLI receives token, stores in ~/.rulesell/auth.json
  → "Logged in as @nalba. Token expires in 90 days."

npx rulesell add @author/paid-mcp-server
  → CLI checks ~/.rulesell/auth.json
  → If valid token: API returns download URL with signed temporary access
  → If no token: "This is a paid item. Run `npx rulesell login` first."
  → If expired: Auto-refresh via refresh_token, or prompt re-login

npx rulesell add @author/free-skill
  → No auth check. Direct download from CDN/GitHub.
  → Zero friction for open-source content.
```

**Token storage format (`~/.rulesell/auth.json`):**
```json
{
  "version": 1,
  "access_token": "rs_live_...",
  "refresh_token": "rs_refresh_...",
  "expires_at": "2026-07-08T00:00:00Z",
  "user": {
    "id": "usr_...",
    "username": "nalba",
    "email": "nalba@example.com"
  }
}
```

---

## 5. Agent-Native Website Features

### 5.1 /llms.txt — The AI Discovery Layer

**What it is:** A Markdown file at `/llms.txt` that provides LLM-friendly content about a website. Created by Jeremy Howard (fast.ai). Community-driven standard, 5-15% adoption among tech sites as of early 2026.

**Required structure:**
```markdown
# RuleSell

> Marketplace for AI development assets: MCP servers, skills, rules, workflows, and agent teams. Open-source items are free to install. Paid items use OAuth authentication.

## Documentation
- [Getting Started](https://rulesell.dev/docs/getting-started): Install the CLI and browse the marketplace
- [CLI Reference](https://rulesell.dev/docs/cli): All commands for searching, installing, and managing items
- [API Reference](https://rulesell.dev/docs/api): REST API for programmatic access

## Categories
- [MCP Servers](https://rulesell.dev/category/mcp-servers): Model Context Protocol servers for AI agent tool integration
- [Skills](https://rulesell.dev/category/skills): Reusable capabilities for AI coding agents
- [Rules](https://rulesell.dev/category/rules): Configuration rules for Cursor, Claude Code, and other editors
- [Workflows](https://rulesell.dev/category/workflows): n8n, Make, and automation templates
- [Agent Teams](https://rulesell.dev/category/agent-teams): Pre-configured multi-agent setups

## Optional
- [Pricing](https://rulesell.dev/pricing): Free for open-source, creator-set pricing for premium items
- [Creator Guide](https://rulesell.dev/docs/creators): How to publish and monetize your AI dev assets
```

**Additional files:**
- `/llms-full.txt` — Complete marketplace catalog in Markdown (updated daily)
- Individual item pages should serve `.md` variants (e.g., `/item/context7-mcp.md`)

### 5.2 MCP Server Endpoint

RuleSell should expose its own MCP server that AI agents can connect to for marketplace interaction:

**Tools to expose:**

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `search_marketplace` | Natural language search across all items. Returns ranked results with name, description, category, price, install count. | No |
| `get_item` | Get full details for a specific item by slug. Returns description, variants, install command, pricing. | No |
| `get_install_command` | Returns the exact install command for a specific item + target environment. | No |
| `list_categories` | List all marketplace categories with item counts. | No |
| `get_recommendations` | Given a project description or tech stack, return recommended items. | No |
| `check_auth_status` | Check if the current user is authenticated and what items they have access to. | Yes |
| `purchase_item` | Initiate purchase flow for a paid item. Returns a checkout URL. | Yes |

**Configuration for Claude Code (`.mcp.json`):**
```json
{
  "mcpServers": {
    "rulesell": {
      "url": "https://rulesell.dev/mcp",
      "headers": {
        "Authorization": "Bearer ${RULESELL_TOKEN}"
      }
    }
  }
}
```

The auth header is optional — unauthenticated requests work for search/browse/free items. This MCP server becomes the "agent-native API" — any AI coding agent that supports MCP can discover, search, and install RuleSell items without a browser.

**How Context7 informs this design:** Context7 exposes just two tools (`resolve-library-id` and `query-docs`) and handles 50,000+ stars worth of demand. Simplicity wins. RuleSell's MCP server should start with 3 core tools:

1. `search_marketplace(query: string, category?: string, max_results?: number)` — Returns items matching the query. Results include: name, author, description (50 words max), category, price (0 for free), install_count, rating, and the install command for the user's detected environment.

2. `get_item(slug: string)` — Full item detail including all variants, complete description, screenshots (as URLs), reviews summary, and per-environment install commands.

3. `install_item(slug: string, target?: string)` — Returns a shell command that the agent can execute (e.g., `npx rulesell add @author/item --target claude-code`). For paid items without auth, returns a login-first message. This tool does NOT execute the install itself — it returns the command for the agent to run via its shell tool, maintaining the user-confirmation step.

The `get_recommendations` and `purchase_item` tools can be added post-MVP when the item catalog is large enough for recommendations to be meaningful and the payment system is live.

### 5.3 JSON-LD / Schema.org

Every item page should include `SoftwareApplication` structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Context7 MCP Server",
  "description": "Up-to-date documentation for 9000+ libraries, injected into LLM context",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Cross-platform",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "342"
  },
  "author": {
    "@type": "Organization",
    "name": "Upstash"
  }
}
```

### 5.4 .well-known/mcp/server-card.json

Publish a server card for RuleSell's MCP server:

```json
{
  "name": "RuleSell Marketplace",
  "description": "Search, discover, and install AI dev assets",
  "transport": {
    "type": "http",
    "url": "https://rulesell.dev/mcp"
  },
  "authentication": {
    "type": "bearer",
    "optional": true,
    "login_url": "https://rulesell.dev/device"
  },
  "tools": [
    { "name": "search_marketplace", "description": "Search for AI dev assets by keyword or natural language" },
    { "name": "get_item", "description": "Get details for a specific marketplace item" },
    { "name": "get_recommendations", "description": "Get item recommendations based on project context" }
  ]
}
```

### 5.5 API Design for Agents

Rather than a separate `/api/agent/` namespace, use the same REST API with content negotiation:

- `Accept: application/json` → standard JSON API response
- `Accept: text/markdown` → LLM-friendly Markdown response (item descriptions, install instructions)
- The MCP server is a thin wrapper around the REST API

Key endpoints:
- `GET /api/items?q=<query>&category=<cat>&env=<claude-code>` — search
- `GET /api/items/:slug` — item detail
- `GET /api/items/:slug/install?env=<claude-code>` — install instructions for specific environment
- `POST /api/items/:slug/purchase` — initiate purchase (requires auth)
- `GET /api/recommendations?stack=<nextjs,tailwind>&description=<text>` — AI-powered recommendations

---

## 6. Environment Detection & Auto-Configuration

### 6.1 Config File Locations Per Tool

| Tool | Config File Path | Config Key | Format | Notes |
|------|-----------------|------------|--------|-------|
| **Claude Code** | `~/.claude.json` (user) or `.mcp.json` (project) | `mcpServers` | JSON object | Reads on startup, `/reload-plugins` for hot reload |
| **Claude Desktop** | macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`<br>Windows: `%APPDATA%\Claude\claude_desktop_config.json`<br>Linux: `~/.config/Claude/claude_desktop_config.json` | `mcpServers` | JSON object | Requires full restart after config change |
| **Cursor** | `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project) | `mcpServers` | JSON object | Auto-detects config changes, no restart needed |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` | `mcpServers` | JSON object | Same schema as Claude |
| **Cline** | macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`<br>Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json` | `mcpServers` | JSON object | VS Code extension storage path |
| **Continue** | `~/.continue/config.json` | `mcpServers` | JSON **array** (not object) | Uses `name` field per entry. YAML alternative available. |
| **Zed** | `~/.config/zed/settings.json` | `context_servers` | JSON object | Different key name. STDIO only natively; needs `mcp-remote` bridge for HTTP. |
| **Aider** | No native MCP config | N/A | N/A | Community tools bridge MCP via third-party wrappers |

### 6.2 Skill Installation Directories

| Tool | Skills Path |
|------|------------|
| skills.sh canonical | `~/.agents/skills/` |
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/` |
| Windsurf | `~/.codeium/windsurf/skills/` |
| GitHub Copilot | `~/.copilot/skills/` |
| Codex | `~/.codex/skills/` |
| Roo Code | `~/.roo/skills/` |
| Gemini CLI | `~/.gemini/skills/` |
| Trae | `~/.trae/skills/` |
| Kiro | `~/.kiro/skills/` |
| Continue | `~/.continue/skills/` |

### 6.3 Cursor Rules Paths

| Type | Path |
|------|------|
| Legacy | `.cursorrules` (project root) |
| Modern | `.cursor/rules/*.mdc` (per-project) |

### 6.4 Detection Strategy

The RuleSell CLI should detect environments by checking for the existence of config files and directories:

```javascript
const ENVIRONMENTS = {
  'claude-code': {
    detect: () => fs.existsSync(path.join(HOME, '.claude')),
    mcp_config: path.join(HOME, '.claude.json'),
    skills_dir: path.join(HOME, '.claude', 'skills'),
    config_key: 'mcpServers',
    config_format: 'object',
  },
  'claude-desktop': {
    detect: () => {
      if (process.platform === 'darwin') return fs.existsSync(path.join(HOME, 'Library/Application Support/Claude'));
      if (process.platform === 'win32') return fs.existsSync(path.join(APPDATA, 'Claude'));
      return fs.existsSync(path.join(HOME, '.config/Claude'));
    },
    mcp_config: /* OS-specific path */,
    config_key: 'mcpServers',
    config_format: 'object',
  },
  'cursor': {
    detect: () => fs.existsSync(path.join(HOME, '.cursor')),
    mcp_config: path.join(HOME, '.cursor', 'mcp.json'),
    skills_dir: path.join(HOME, '.cursor', 'skills'),
    rules_dir: '.cursor/rules/', // project-scoped
    config_key: 'mcpServers',
    config_format: 'object',
  },
  'windsurf': {
    detect: () => fs.existsSync(path.join(HOME, '.codeium', 'windsurf')),
    mcp_config: path.join(HOME, '.codeium', 'windsurf', 'mcp_config.json'),
    skills_dir: path.join(HOME, '.codeium', 'windsurf', 'skills'),
    config_key: 'mcpServers',
    config_format: 'object',
  },
  'cline': {
    detect: () => /* check VS Code globalStorage for saoudrizwan.claude-dev */,
    mcp_config: /* OS-specific VS Code storage path */,
    config_key: 'mcpServers',
    config_format: 'object',
  },
  'continue': {
    detect: () => fs.existsSync(path.join(HOME, '.continue')),
    mcp_config: path.join(HOME, '.continue', 'config.json'),
    skills_dir: path.join(HOME, '.continue', 'skills'),
    config_key: 'mcpServers',
    config_format: 'array', // DIFFERENT — uses array not object
  },
  'zed': {
    detect: () => fs.existsSync(path.join(HOME, '.config', 'zed')),
    mcp_config: path.join(HOME, '.config', 'zed', 'settings.json'),
    config_key: 'context_servers', // DIFFERENT key name
    config_format: 'object',
  },
};
```

**When multiple environments are detected:** Show a checklist with all detected environments pre-selected. Let the user deselect any they don't want. Default behavior: install for ALL detected environments.

**Edge cases to handle:**

1. **Config file doesn't exist yet:** Create it with the correct structure. For Claude Code, create `~/.claude.json` with `{ "mcpServers": {} }`. For Cursor, create `~/.cursor/mcp.json`.

2. **Config file has custom formatting:** Read with JSON.parse, write back with `JSON.stringify(data, null, 2)`. Never regex-replace in JSON configs.

3. **Server name collision:** If `mcpServers` already has an entry with the same name, prompt: "Replace existing config for 'server-name'? [Y/n]". Default yes.

4. **Continue's array format:** Continue uses `"mcpServers": [{ "name": "...", ... }]` instead of the standard object format. The CLI must handle both when reading and writing.

5. **Zed's different key:** Zed uses `context_servers` instead of `mcpServers`. The CLI must map to the correct key per tool.

6. **Project-scoped vs global:** For MCP servers, default to global (user-level) config. For rules and skills, default to project-scoped (write to current directory). Allow override with `--scope global|project`.

7. **Permissions:** On Unix, config files may be read-only or owned by root. Check write access before attempting, fail gracefully with instructions.

8. **Windows paths:** Use `process.env.APPDATA` for Windows-specific paths. All path handling must use `path.join()` not string concatenation.

---

## 7. Concrete Recommendations for RuleSell

### 7.1 CLI Architecture (`npx rulesell`)

**Core commands:**

```
npx rulesell login                          # OAuth device code flow
npx rulesell logout                         # Clear stored token
npx rulesell whoami                         # Show current user

npx rulesell search <query>                 # Search marketplace
npx rulesell info @author/item              # Show item details + variants
npx rulesell add @author/item               # Install (auto-detect environments)
npx rulesell add @author/item --target cursor,claude-code  # Specific targets
npx rulesell remove @author/item            # Uninstall
npx rulesell update                         # Update all installed items
npx rulesell list                           # List installed items

npx rulesell env                            # Show detected environments
npx rulesell env --json                     # Machine-readable environment info
```

**Installation flow for `npx rulesell add @author/mcp-server`:**

1. Detect all installed environments (Claude Code, Cursor, Windsurf, etc.)
2. If multiple found: display checklist, default all selected
3. Fetch item metadata from RuleSell API, including per-environment variants
4. If paid: check auth, prompt login if needed
5. For each target environment:
   a. Read existing MCP config file (or create if missing)
   b. Merge new server entry into `mcpServers` object
   c. Write config file back
   d. If item includes skills: copy SKILL.md to appropriate skills directory
   e. If item is a Cursor rule: write `.mdc` file to `.cursor/rules/`
6. Display summary: "Installed @author/mcp-server for Claude Code, Cursor"

### 7.2 Claude Code Marketplace Integration

Publish RuleSell as a Claude Code marketplace:

1. Create a Git repository (e.g., `rulesell/claude-marketplace`)
2. Add `.claude-plugin/marketplace.json` with RuleSell items
3. Users add: `/plugin marketplace add rulesell/claude-marketplace`
4. Items appear in `/plugin` Discover tab
5. Auto-update enabled by default

This makes RuleSell items installable both via `npx rulesell add` AND via Claude Code's native plugin system.

### 7.3 RuleSell MCP Server

Deploy an MCP server at `https://rulesell.dev/mcp` that AI agents can connect to. This enables:

- Claude Code can search RuleSell and recommend items during conversations
- "I need a database migration tool" → agent queries RuleSell → returns ranked results → user confirms → agent runs install
- Free items install without auth; paid items return checkout URL

### 7.4 Website Agent-Native Features

Implement from day one:

1. **`/llms.txt`** — Markdown overview of marketplace, categories, and key documentation links
2. **`/llms-full.txt`** — Complete item catalog in Markdown, updated daily via cron
3. **`/.well-known/mcp/server-card.json`** — MCP discovery endpoint
4. **JSON-LD on every item page** — `SoftwareApplication` schema
5. **Markdown variants** — Every item page available at `<url>.md` for LLM consumption
6. **Content negotiation** — API returns Markdown when `Accept: text/markdown` is requested

### 7.5 Auth Architecture

```
Open-source items:
  CLI → RuleSell API (no auth) → download URL → install

Paid items:
  CLI → RuleSell API (with token) → signed download URL (time-limited) → install
  
  If no token:
    CLI → RuleSell API → 401 + { login_url: "https://rulesell.dev/device" }
    CLI displays: "Run `npx rulesell login` to purchase paid items"

  Login flow:
    CLI → POST /oauth/device/code → { user_code, verification_uri }
    User → browser → rulesell.dev/device → enters code → authenticates
    CLI → polls /oauth/token → receives access_token + refresh_token
    CLI → stores in ~/.rulesell/auth.json

  Token refresh:
    On 401 with valid refresh_token: auto-refresh, retry request
    On expired refresh_token: prompt re-login
```

### 7.6 Competitive Differentiation

What RuleSell does that nobody else does:

| Capability | skills.sh | Smithery | Claude Plugins | MCP Market | **RuleSell** |
|-----------|----------|---------|---------------|-----------|-------------|
| MCP servers | No | Yes | Yes (bundled) | Yes (directory) | **Yes** |
| Skills | Yes | Yes | Yes | No | **Yes** |
| Rules (Cursor/Claude) | No | No | No | No | **Yes** |
| Workflows (n8n/Make) | No | No | No | No | **Yes** |
| Agent teams | No | No | No | No | **Yes** |
| Paid items | No | No | No | No | **Yes** |
| Creator payouts | No | No | No | No | **Yes** |
| Multi-env auto-config | Partial (skills only) | Partial (MCP only) | Claude only | No | **Yes (all types, all envs)** |
| Agent-native MCP API | No | No | No | No | **Yes** |
| CLI install | Yes | Yes | Built-in | No | **Yes** |

The unique value proposition: **RuleSell is the only marketplace that handles all AI dev asset types, supports paid items with creator payouts, auto-configures across all major AI coding environments, and exposes itself as an MCP server for agent-native discovery.**

### 7.7 Priority Ordering

For MVP, implement in this order:

1. **`npx rulesell add` for open-source MCP servers** — highest demand, zero auth complexity
2. **Environment detection + auto-config** — the killer feature vs. manual JSON editing
3. **`npx rulesell search`** — CLI-based discovery
4. **RuleSell MCP server** — agent-native discovery and recommendation
5. **`/llms.txt` + `/.well-known/mcp/server-card.json`** — agent discoverability
6. **Claude Code marketplace publication** — native integration
7. **`npx rulesell login` + paid item support** — monetization layer
8. **JSON-LD + Markdown variants** — SEO and LLM optimization

---

## Sources

- [npm login docs](https://docs.npmjs.com/cli/v9/commands/npm-login/)
- [npm access tokens](https://docs.npmjs.com/about-access-tokens/)
- [GitHub Packages npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Cargo registries](https://doc.rust-lang.org/cargo/reference/registries.html)
- [Cargo registry authentication](https://doc.rust-lang.org/cargo/reference/registry-authentication.html)
- [pip authentication](https://pip.pypa.io/en/stable/topics/authentication/)
- [Homebrew private taps](https://gist.github.com/mlafeldt/8e7d50ee0b1de44e256d)
- [gh auth login](https://cli.github.com/manual/gh_auth_login)
- [GitHub CLI OAuth library](https://github.com/cli/oauth)
- [Vercel CLI login flow](https://vercel.com/changelog/new-vercel-cli-login-flow)
- [Stripe CLI login internals](https://bentranter.ca/posts/stripes-cli-login/)
- [Railway CLI login](https://docs.railway.com/cli/login)
- [Smithery CLI docs](https://smithery.ai/docs/concepts/cli)
- [Smithery CLI GitHub](https://github.com/smithery-ai/cli)
- [skills.sh CLI docs](https://skills.sh/docs/cli)
- [vercel-labs/skills GitHub](https://github.com/vercel-labs/skills)
- [Claude Code plugin discovery](https://code.claude.com/docs/en/discover-plugins)
- [Claude Code MCP docs](https://code.claude.com/docs/en/mcp)
- [Claude Code skills docs](https://code.claude.com/docs/en/skills)
- [Cursor rules docs](https://cursor.com/docs/context/rules)
- [VS Code extension CLI](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)
- [VS Code private marketplace](https://code.visualstudio.com/blogs/2025/11/18/privatemarketplace)
- [Raycast extension docs](https://developers.raycast.com/basics/install-an-extension)
- [llms.txt specification](https://llmstxt.org/)
- [MCP Registry overview](https://www.gentoro.com/blog/what-is-anthropics-new-mcp-registry)
- [MCP Server Cards SEP-1649](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649)
- [MCP server discovery .well-known](https://www.ekamoira.com/blog/mcp-server-discovery-implement-well-known-mcp-json-2026-guide)
- [MCP config guide (all clients)](https://mcpplaygroundonline.com/blog/complete-guide-mcp-config-files-claude-desktop-cursor-lovable)
- [Windsurf MCP setup](https://docs.windsurf.com/windsurf/cascade/mcp)
- [Zed MCP setup](https://markaicode.com/mcp-zed-editor-setup/)
- [Context7 MCP](https://upstash.com/blog/context7-mcp)
- [OpenAI plugins deprecation](https://www.youreverydayai.com/chatgpt-is-killing-off-plugins-what-it-means/)
- [GPT Actions authentication](https://platform.openai.com/docs/actions/authentication)
- [WorkOS CLI OAuth guide](https://workos.com/blog/how-to-build-browser-based-oauth-into-your-cli-with-workos)
- [Schema.org SoftwareApplication](https://unhead.unjs.io/docs/schema-org/api/schema/software-app)
