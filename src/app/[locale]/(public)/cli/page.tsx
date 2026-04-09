"use client";

import { Terminal } from "lucide-react";

import { CodePreview } from "@/components/ruleset/code-preview";

export default function CliPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-fg-muted" />
          <h1 className="text-2xl font-semibold text-fg">RuleSell CLI</h1>
        </div>
        <p className="text-sm text-fg-muted">
          Install AI development assets directly from your terminal.
          The CLI detects your environment and writes config to the right file.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <Section title="Install the CLI">
          <CodePreview content="npm install -g @rulesell/cli" language="bash" />
          <p className="mt-2 text-xs text-fg-dim">
            Requires Node.js 18+. The CLI is open-source at github.com/rulesell/cli.
          </p>
        </Section>

        <Section title="Add a free asset">
          <CodePreview
            content={`# Install a free item — no auth required
npx rulesell add @PatrickJS/awesome-cursorrules

# The CLI detects your editor:
#   Cursor  → writes to .cursorrules
#   Claude  → writes to ~/.config/claude/mcp_servers.json
#   Windsurf → writes to .windsurfrules`}
            language="bash"
          />
        </Section>

        <Section title="Add a paid asset">
          <CodePreview
            content={`# Paid items open your browser for OAuth + payment
npx rulesell add @windsurf-collective/enterprise-cursor-rules

# Flow:
# 1. CLI opens browser → rulesell.com/auth/cli
# 2. Confirm purchase ($29)
# 3. CLI receives token, downloads, writes to target file
# 4. Done — no manual copy-paste`}
            language="bash"
          />
        </Section>

        <Section title="Environment detection">
          <p className="text-sm text-fg-muted">
            The CLI checks your working directory and installed tools to auto-detect the
            right environment. You can also specify it explicitly:
          </p>
          <CodePreview
            content={`# Auto-detect (default)
npx rulesell add @author/slug

# Explicit environment
npx rulesell add @author/slug --env cursor
npx rulesell add @author/slug --env claude-code
npx rulesell add @author/slug --env windsurf

# List available environments for an item
npx rulesell info @author/slug`}
            language="bash"
          />
        </Section>

        <Section title="Other commands">
          <CodePreview
            content={`# Search the marketplace
npx rulesell search "mcp server postgres"

# List installed items
npx rulesell list

# Update all items to latest versions
npx rulesell update

# Remove an installed item
npx rulesell remove @author/slug`}
            language="bash"
          />
        </Section>

        <div className="rounded-lg border border-border-soft bg-bg-surface p-4 text-xs text-fg-muted">
          <p className="font-medium text-fg">Note</p>
          <p className="mt-1">
            The CLI package lives at{" "}
            <code className="font-mono text-fg-subtle">packages/rulesell-cli/</code>{" "}
            in the monorepo. It is not wired to the live marketplace yet — all commands
            work against the mock data layer in development. Production CLI release is
            planned for v2 backend launch.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      {children}
    </section>
  );
}
