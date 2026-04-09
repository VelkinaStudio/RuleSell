# Creative Tooling Workflow

## Intent
Use external creative tools to raise the design ceiling without making the repo dependent on any single desktop app or local setup.

## Source-of-Truth Boundary
- The repo remains the source of truth for shipped code, tokens, implementation details, and durable decisions.
- External canvases and vaults are working surfaces for exploration, research, moodboarding, and handoff.
- If a decision affects the product long term, capture it back into `docs/` and the codebase.

## Recommended Tool Roles

### Obsidian
- Best for creative briefs, moodboards, reference capture, competitive teardown notes, and durable design context.
- Official docs currently support Canvas for spatial boards, Bases for database-like views, Web Clipper for source capture, and CLI commands for querying bases.
- Best use here: store references, copy experiments, route-level visual hypotheses, and research snapshots outside the main repo.
- Caveat: treat the vault as a research workspace, not as the canonical implementation spec.

### Pencil
- Best for repo-adjacent design exploration with `.pen` files and design-to-code loops.
- Official docs currently describe local MCP support, Codex CLI compatibility, workspace-local `.pen` files, and two-way design-to-code synchronization.
- Best use here: component exploration, landing-page variants, responsive layout studies, and style-kit iteration near the codebase.
- Caveat: Pencil documentation notes that first-run integration may modify or duplicate Codex `config.toml`, so back up that file before first use.

### Paper
- Best for connected-canvas workflows, shader and atmosphere exploration, and agent-assisted design-to-code experiments.
- Official docs currently describe a local MCP server in Paper Desktop, explicit Codex app setup, read-write agent access to design files, and shader/effect tooling.
- Best use here: cinematic landing explorations, material studies, shader-backed hero sections, and design-system token experiments.
- Caveat: keep runtime adoption deliberate. A good Paper exploration does not automatically justify a heavy production dependency.

## Recommended Workflow
1. Gather references and write the brief in Obsidian.
2. Explore visual directions in Pencil or Paper when a plain coded mockup would be too limiting.
3. Choose a direction and document the durable rules in `docs/design/`.
4. Implement in Next.js, Tailwind, and Framer Motion with accessibility, reduced-motion, and performance constraints.
5. Record any lasting workflow or tool choice in `docs/research/`.

## Integration Guardrails
- External tooling is optional. Repo work must continue even if a contributor does not have Obsidian, Pencil, or Paper installed.
- Do not claim an MCP connection exists unless it has been configured and verified locally.
- Prefer exporting decisions, tokens, and assets back into the repo over keeping critical context trapped in a design tool.
- Keep tool-specific credentials, app state, and machine-local configs out of the repo.

## Verified Setup Notes
- Paper documents Codex app setup through `Settings > MCP Servers` using a custom Streamable HTTP server named `paper` at `http://127.0.0.1:29979/mcp`.
- Pencil documents Codex CLI support through its local MCP server and recommends verifying the connection via `/mcp` after Pencil is running.
- Obsidian is better treated here as the research and design-memory layer unless a separate local automation path is intentionally set up.
