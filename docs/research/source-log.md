# Source Log

Use this file to record important research sources and keep decisions grounded.

## Log Format
- Topic
- Source
- Source type
- Date checked
- Trust level
- Key takeaway
- Contradictions or caveats

## Current Baseline
- Windsurf docs verified for global skills, workflows, rules, MCP, and hooks
- Playwright MCP verified as an open-source browser MCP option
- BrowserMCP identified as an alternative when logged-in real-browser control becomes more important

## 2026-03-06
- Topic: Creative research and design-memory workflow with Obsidian
- Source: https://help.obsidian.md/plugins/canvas and https://help.obsidian.md/bases and https://help.obsidian.md/web-clipper and https://help.obsidian.md/cli
- Source type: Official Obsidian documentation
- Date checked: 2026-03-06
- Trust level: High
- Key takeaway: Obsidian now has strong first-party primitives for visual boards, structured views, web capture, and CLI querying, making it a credible research and design-memory layer for agent workflows.
- Contradictions or caveats: This supports research and context capture well, but there is no repo-local guarantee of an MCP-style live design-editing workflow.

- Topic: Pencil as an agent-connected design workflow
- Source: https://docs.pencil.dev/getting-started/ai-integration and https://docs.pencil.dev/getting-started/installation and https://docs.pencil.dev/design-to-code
- Source type: Official Pencil documentation
- Date checked: 2026-03-06
- Trust level: High
- Key takeaway: Pencil officially supports Codex CLI via local MCP, keeps `.pen` files near the workspace, and positions itself as a two-way design-to-code tool.
- Contradictions or caveats: Pencil documentation warns that first-run integration may modify or duplicate Codex `config.toml`, so local setup should be treated carefully.

- Topic: Paper as a Codex-connected design canvas
- Source: https://paper.design/docs/mcp and https://paper.design/ and https://shaders.paper.design/
- Source type: Official Paper documentation
- Date checked: 2026-03-06
- Trust level: High
- Key takeaway: Paper Desktop exposes a local MCP server with explicit Codex app setup, supports read-write agent interaction with design files, and offers a shader/effect ecosystem suited to higher-end visual exploration.
- Contradictions or caveats: Paper is promising for exploration, but it still requires user-level desktop setup and should not become a hidden runtime dependency by default.

- Topic: GitHub CLI authentication and repo creation
- Source: https://cli.github.com/manual/gh_auth_login and https://cli.github.com/manual/gh_repo_create
- Source type: Official GitHub CLI manual
- Date checked: 2026-03-06
- Trust level: High
- Key takeaway: `gh auth login` plus `gh auth setup-git` is the clean baseline for pushing this repo through GitHub CLI, and `gh repo create` can attach a new remote directly from the local workspace.
- Contradictions or caveats: This still requires the user to authenticate locally; the repo cannot assume an existing remote.

- Topic: Vercel CLI workflow
- Source: https://vercel.com/docs/cli
- Source type: Official Vercel documentation
- Date checked: 2026-03-06
- Trust level: High
- Key takeaway: The repo can safely standardize on `vercel login`, `vercel link`, `vercel pull`, preview deploys, and production deploys through local CLI scripts.
- Contradictions or caveats: Vercel project linkage is environment-specific and should not be committed.

- Topic: Vercel MCP endpoint for coding agents
- Source: https://vercel.com/docs/mcp
- Source type: Official Vercel documentation
- Date checked: 2026-03-06
- Trust level: High
- Key takeaway: Vercel exposes an official MCP endpoint that can be added to Codex with `codex mcp add vercel --url https://mcp.vercel.com`.
- Contradictions or caveats: This is a client-level setup step, not a repo-local config file.

- Topic: GitHub Actions for Node.js validation
- Source: https://docs.github.com/actions/automating-builds-and-tests/building-and-testing-nodejs
- Source type: Official GitHub documentation
- Date checked: 2026-03-06
- Trust level: High
- Key takeaway: A small `npm ci` + lint + build workflow is the right first CI layer before adding browser automation.
- Contradictions or caveats: This does not replace Playwright or visual regression coverage.
