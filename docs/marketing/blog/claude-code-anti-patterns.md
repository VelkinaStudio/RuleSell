---
title: Claude Code anti-patterns we reject
date: 2026-04-28
author: RuleSell Team
excerpt: The sixteen patterns that get a skill, agent, plugin, or MCP server immediately rejected from RuleSell — and why each is broken.
---

# Claude Code anti-patterns we reject

Every marketplace has a reject list. These are ours. Sixteen patterns that get a
skill, agent, plugin, or MCP server immediately rejected from RuleSell, and why
each one is broken.

If you're planning to publish on RuleSell, read this first. If your asset
contains any of these patterns, fix them before submitting.

## 1. Inlined references in SKILL.md

A SKILL.md that's 800+ lines long, with everything crammed inline instead of
split into reference files.

**Why it's broken**: SKILL.md is loaded into context the moment its description
matches. The full cost is paid on every triggering, even when the agent only
needs the high-level process. You're burning tokens.

**Fix**: Move detail to `references/*.md`. SKILL.md should be ≤100 lines.

## 2. Tools wildcard on subagents

```yaml
tools: "*"
```

Or omitting the `tools:` field entirely (which defaults to all).

**Why it's broken**: No scoping. The agent can run any command, read any file,
call any MCP. One prompt-injection-vulnerable input and you have a remote code
execution vector.

**Fix**: Declare tools explicitly. Most agents need only `["Read", "Grep",
"Glob"]` plus one or two domain-specific tools.

## 3. Hooks with no exit timeout

A `PreToolUse` or `PostToolUse` hook that runs a command without `timeout`:

```json
{ "command": "npm test" }
```

**Why it's broken**: A hung hook hangs the entire Claude Code session. The user
has to kill the process, losing all context.

**Fix**: `timeout 10s npm test || exit 0`. Always.

## 4. MCP servers that read the home directory by default

MCP servers that, on startup, scan `~` or `~/.config` without the user opting
in.

**Why it's broken**: Privacy violation. The user installed the server for one
purpose; it's reading everything. This is how secrets get exfiltrated.

**Fix**: Declare the scope in the README. Default to project root only.
Never recurse into `.git`, `node_modules`, or anything starting with `.env`.

## 5. Destructive slash commands without confirmation

A `/clean` command that does `git clean -fdx` with no confirmation gate.

**Why it's broken**: Slash commands fire on user input. Users type them
quickly, sometimes by muscle memory. A destructive operation without a
confirmation will destroy someone's week the first time they run it on a dirty
branch.

**Fix**: Add a confirmation prompt inside the command, or remove the destructive
op.

## 6. Descriptions shorter than 80 characters

```yaml
description: Helps with database stuff
```

**Why it's broken**: The description is the only matching surface. Below ~80
characters, there isn't enough text for the loader to match real user phrases.
Your skill won't trigger.

**Fix**: Write 150+ characters with real trigger phrases in direct quotes, a
negative case, and concrete jobs.

## 7. Stale freshness lying

A plugin that says `version: 0.0.1` with a 6-month-old most recent commit, and
claims to "support the latest Claude Code."

**Why it's broken**: Claude Code's plugin APIs evolve. Old plugins break. Authors
who don't update their work but claim freshness are misleading users.

**Fix**: Either update the plugin (and bump the version + changelog) or mark it
explicitly as "unmaintained."

## 8. CLAUDE.md generic best-practices

```md
# Project Instructions

- Follow TDD
- Write clean code
- Use best practices
```

**Why it's broken**: Generic instructions help nothing. They burn tokens without
improving output. The agent already knows about TDD.

**Fix**: CLAUDE.md should contain project-specific facts: the test runner
command, the preferred structure, the deploy process, the don't-touch list.

## 9. AGENTS.md with infinite loops

A multi-agent orchestration file where one agent dispatches another, which
dispatches the first under some condition, with no stop condition.

**Why it's broken**: Exhausted token budget, the user has no idea what's
happening.

**Fix**: Every loop must have a documented stop condition AND a maximum
iteration count. The orchestrator enforces it.

## 10. Skills that override user preferences

A skill that says "always do X" when the user has explicitly set up CLAUDE.md
or chat instructions saying not to do X.

**Why it's broken**: Skills override default system behavior, but user
instructions always take precedence. A skill that fights the user is broken.

**Fix**: Skills should add capability, not override user preferences. Document
the off-switch if your skill needs one.

## 11. Single-file "plugins" with no manifest

A `plugin/` directory with one `.md` file and no `plugin.json`.

**Why it's broken**: Can't be installed. Can't be versioned. Can't be discovered.
Not a plugin — just a markdown file.

**Fix**: Add `.claude-plugin/plugin.json` with `name`, `version`, `description`,
and `author`.

## 12. MCP servers with no graceful shutdown

An MCP server process that doesn't handle `SIGTERM` / `SIGINT`, leaving a zombie
when Claude Code closes the connection.

**Why it's broken**: Resource leak. Across a day of work, the user accumulates
dozens of zombies.

**Fix**: Handle shutdown signals, close resources, exit cleanly.

## 13. Hardcoded paths in plugins

```bash
# Inside a plugin script
/Users/me/code/myplugin/scripts/run.sh
```

**Why it's broken**: Works only on the author's machine.

**Fix**: Use `${CLAUDE_PLUGIN_ROOT}` for any path inside the plugin.

## 14. Skills that wrap built-in tools

A skill called `read-file-skill` that just tells the agent to use Read.

**Why it's broken**: Pure waste. The agent already knows how to use Read.

**Fix**: Skills should add domain knowledge, not wrap existing tools.

## 15. Descriptions in the wrong language

A skill targeting English-speaking users with a description in another language
(or vice versa).

**Why it's broken**: The matcher works on the language the user is typing in.

**Fix**: Match the description language to the target user language. For
multilingual audiences, write bilingually.

## 16. Plugins with conflicting slash commands

Two installed plugins that both define `/deploy`.

**Why it's broken**: Claude Code's conflict resolution is undefined, so the
user's `/deploy` becomes non-deterministic.

**Fix**: Namespace your slash commands: `/myplugin:deploy`.

---

## Why we reject these

Every one of these anti-patterns was identified either in an incident we saw on
another marketplace, a skill we tried and rejected, or the documented Claude Code
spec. They're not hypothetical — they cause real harm.

RuleSell's quality bar exists because we want to be the marketplace where a
user can install anything and trust it to work. That only holds if the
marketplace filter has sharp teeth.

If your skill, agent, plugin, or MCP server has any of these patterns, don't
be offended by the rejection — appreciate the signal. Fix it, resubmit, ship
Quality A work.

---

For the full quality model, see
[rulesell.vercel.app/trust](https://rulesell.vercel.app/trust).
