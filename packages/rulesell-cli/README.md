# rulesell

CLI for installing AI configurations from the [RuleSet AI](https://rulesell.com) registry.

## Usage

```sh
npx rulesell <command> [args]
```

### Commands

```sh
rulesell list                 # List all available products
rulesell search <query>       # Search by name, tag, or category
rulesell info <slug>          # Show product details
rulesell install <slug>       # Get install instructions for a product
```

### Examples

```sh
# Browse everything
npx rulesell list

# Find MCP servers
npx rulesell search mcp

# Get install instructions (auto-detects your AI tool)
npx rulesell install awesome-cursorrules

# View details about a product
npx rulesell info playwright-mcp-server
```

### Tool detection

When running `install`, the CLI checks your current directory for:

| File / Directory | Detected tool |
|------------------|---------------|
| `.cursorrules` or `.cursor/` | Cursor |
| `CLAUDE.md` or `.claude/` | Claude Code |
| `.windsurfrules` | Windsurf |

Install instructions are tailored to the detected tool.

### Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `RULESELL_URL` | `https://rulesell.com` | Override registry base URL |

For local development:

```sh
RULESELL_URL=http://localhost:3000 npx rulesell list
```

## Zero dependencies

This CLI uses only Node.js built-in modules (`https`, `http`, `fs`, `path`). No install step, no build step.

## License

MIT
