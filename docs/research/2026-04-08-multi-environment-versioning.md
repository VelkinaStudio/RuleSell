# Multi-Environment Variants & Multi-Category Items: Marketplace Research

**Date:** 2026-04-08
**Context:** RuleSell needs to list AI dev assets (MCP servers, skills, workflows, agent teams) that ship the same logical item in multiple environment-specific forms (Claude Code / Cursor / Windsurf / CLI / n8n / Make / CrewAI / etc.). This research looks at how established marketplaces model this — both in their data layer and their UI — so we can pick a pattern that scales beyond MVP without repainting the schema in 6 months.

---

## Part 1 — How others handle "one item, N variants"

### 1. Docker Hub — manifest lists (OCI image index)
One tag, many platform manifests. The canonical pattern.

```json
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.docker.distribution.manifest.list.v2+json",
  "manifests": [
    { "digest": "sha256:a...", "platform": { "architecture": "amd64", "os": "linux" } },
    { "digest": "sha256:b...", "platform": { "architecture": "arm64", "os": "linux", "variant": "v8" } }
  ]
}
```

Key moves: the **parent** (tag) is the product, each **child** manifest is keyed by a structured `platform` selector, the client library picks the matching child automatically. UI on Docker Hub: a single page, a "Tags" tab, each tag row expands to show per-arch digests. Users never pick architecture — the client does.

### 2. Homebrew formulae — bottles
One formula, one version, N pre-built binaries ("bottles") keyed by macOS version + arch.

```json
{
  "name": "ripgrep",
  "versions": { "stable": "14.1.1" },
  "bottle": {
    "stable": {
      "files": {
        "arm64_sequoia": { "url": "...", "sha256": "..." },
        "arm64_sonoma":  { "url": "...", "sha256": "..." },
        "x86_64_linux":  { "url": "...", "sha256": "..." }
      }
    }
  }
}
```

Parent metadata (description, license, homepage) lives at formula level; variant files are a **flat map keyed by environment string**. `brew` resolves locally. No picker.

### 3. GitHub Releases — flat asset list, naming convention
No structured "platform" field — it's just files with names like `tool_v1.2.0_linux_amd64.tar.gz`. Installers (mise, `gh cli`) regex-match filenames to detect platform. **Lesson: don't rely on filenames for variant typing; put it in the schema.**

### 4. VS Code Marketplace & forks
Extensions declare `engines.vscode: "^1.80.0"` in `package.json`. Categories are a flat array ("Linters", "Programming Languages") with no primary/secondary distinction. Cursor and Windsurf use Open VSX or scraped VSIX because Microsoft's license blocks forks from the official marketplace — so "runs in Cursor" is **not a manifest field**, it's an ecosystem fact users learn elsewhere. **Lesson: if we want client compatibility filterable, we have to bake it in ourselves. Nobody else does.**

### 5. npm — peerDependencies + engines
Closest to our problem. A plugin declares what hosts it works in:

```json
{
  "name": "@ruleset/code-review",
  "engines": { "node": ">=18" },
  "peerDependencies": {
    "@anthropic/claude-code": ">=1.0.0",
    "cursor": ">=0.40.0"
  },
  "peerDependenciesMeta": {
    "cursor": { "optional": true }
  }
}
```

Optional peers let one package advertise "works with A, works with B, needs at least one". This is the mental model we want.

### 6. PyPI wheels
Filename-encoded platform tags: `pkg-1.0-cp311-cp311-manylinux_2_17_x86_64.whl`. Pip picks the best match. PEP 817 "wheel variants" is adding JSON metadata to move away from filename encoding — same migration we should skip and start with JSON.

### 7. HuggingFace model cards
Same logical model, many formats (safetensors, GGUF, ONNX, MLX). HF's actual answer: **they are separate repos**. `meta-llama/Llama-3.2-3B-Instruct` (safetensors) vs `bartowski/Llama-3.2-3B-Instruct-GGUF` (community GGUF) vs `mlx-community/Llama-3.2-3B-Instruct`. A "Quantizations" section on the parent model page links out to 438 child repos with a `base_model` relation. **Lesson: they split when variants have different authors/licenses, and link via metadata. Worth borrowing for forks.**

### 8. Replicate / fal.ai
One model = one API endpoint. Variants are collapsed into **input schema** (model_variant dropdown as a parameter). This works because they host; RuleSell doesn't, so this pattern doesn't transfer.

### 9. Smithery.ai / glama.ai / mcp.so — closest analog
Smithery generates per-client install instructions at render time. The server's manifest (`smithery.yaml`) declares `startCommand` once, and Smithery's UI renders it as a **tabbed selector** (Claude Desktop / Cursor / Windsurf / Cline / Claude Code), each tab showing the same JSON structure placed at the right config path for that client, plus a one-line CLI fallback:

```
npx -y @smithery/cli install @author/server --client claude
```

**This is the pattern for us.** Authors write ONE config, the platform renders N per-client views.

### 10. Cursor.directory / awesome-cursorrules
No compatibility tagging. Every rule is implicitly "Cursor-only." The `.mdc` format is Cursor-specific. Contributors don't mark multi-editor support because there's no taxonomy for it. **This is the gap RuleSell fills.** First-class cross-client metadata becomes a differentiator.

### 11. n8n templates
Flat JSON blob, version checked at import time against `n8n` version. No Make.com cross-posting. If a workflow exists in both, they are literally two separate listings by the same author.

---

## Part 2 — Multi-category items

Across every marketplace studied, the pattern is consistent:

| Marketplace | Model | UI |
|---|---|---|
| VS Code / Open VSX | `categories: ["Linters", "Programming Languages"]` — flat array, no hierarchy | Extension appears in both category listings |
| Docker Hub | Single "Category" + free-form `labels` | One category shown on card, labels searchable |
| npm | `keywords: []` — entirely flat, no primary | Search facet only |
| HuggingFace | `pipeline_tag` (one primary) + `tags` (many) | Primary drives filter chip; tags for search |
| PyPI | `classifiers: []` — Trove-style hierarchy strings | Browsable tree per classifier |

**Winning pattern: one primary category (drives navigation), free array of tags (drives search and secondary discovery).** HuggingFace's `pipeline_tag` is the cleanest expression — primary answers "which shelf does this live on," tags answer "what else might this match."

---

## Part 3 — Recommendations for RuleSell

### 3.1 Data model

Replace the current stub (`category: ProductCategory`, `compatibility: { platforms, versions }`) with:

```ts
// src/types/index.ts

export type EnvironmentId =
  | "claude-code"
  | "claude-desktop"
  | "cursor"
  | "windsurf"
  | "cline"
  | "continue"
  | "chatgpt"
  | "cli"
  | "n8n"
  | "make"
  | "zapier"
  | "crewai"
  | "autogen"
  | "langgraph";

export type VariantKind =
  | "claude_code_skill"    // .md skill file
  | "claude_code_config"   // JSON snippet for settings.json
  | "cursor_rule"          // .mdc or .cursorrules
  | "mcp_json"             // mcpServers config block
  | "cli_install"          // single shell command
  | "system_prompt"        // plaintext for ChatGPT / generic
  | "workflow_json"        // n8n export, Make blueprint
  | "agent_code"           // CrewAI/AutoGen/LangGraph source
  | "custom";

export interface Variant {
  id: string;
  environments: EnvironmentId[];     // 1+ environments this variant serves
  kind: VariantKind;
  label: string;                     // "Claude Code skill" shown on tab
  version: string;                   // independent semver per variant
  install: {
    method: "copy" | "download" | "command" | "json_snippet";
    content: string;                 // the actual payload (code/JSON/md/shell)
    targetPath?: string;             // "~/.claude/skills/code-review.md"
    language?: string;               // syntax highlighting
  };
  instructions?: string;             // markdown, per-variant notes
  requirements?: { key: string; constraint: string }[]; // "node: >=18"
  isPrimary?: boolean;               // default tab on load
  fileSize?: number;
  checksum?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;

  // Taxonomy: one primary, many tags
  primaryCategory: ProductCategory;  // drives /category/mcp routes
  secondaryCategories: ProductCategory[]; // for cross-shelf visibility, max 2
  tags: string[];                    // free-form, searchable
  domains: string[];                 // "devtools", "marketing", "data"

  // The variants array replaces the old compatibility stub
  variants: Variant[];
  defaultVariantId: string;          // which tab opens first

  // Parent-level version (the product's overall release)
  version: string;                   // semver, bumped on any variant change
  changelog?: string;

  price: number;
  currency: string;
  thumbnailUrl: string;
  screenshots: string[];
  qualityScore: number;
  status: ProductStatus;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
```

Why this shape:
- **`environments: []` (array) per variant** — one variant can cover multiple clients when the payload is identical (e.g. the same MCP JSON works in Claude Desktop, Cursor, Windsurf). Avoids triplicating identical content.
- **`kind` is separate from `environments`** — lets us render the same kind consistently (all `mcp_json` gets the same code-block treatment + "copy to clipboard → paste into config") regardless of client.
- **`version` per variant AND per product** — see §3.5.
- **`install.targetPath`** — lets the UI render "paste this into `~/.cursor/mcp.json`" automatically, which is the #1 friction point Smithery solves for users.
- **`primaryCategory` + `secondaryCategories[]` (max 2)** — primary is required and drives URLs / breadcrumbs / nav; secondary is opt-in and drives cross-listing. Tags stay free-form.

### 3.2 UI — variant selector on item detail

Use a **segmented client tab bar at the top of the install section**, not the top of the page. The page hero (title, description, screenshots, rating, price) is variant-agnostic. Install/preview is the only variant-sensitive region.

```
┌────────────────────────────────────────────────┐
│  Code Review Skill          ★ 4.8 · 1.2k uses │
│  "Opinionated code review for any language."   │
│  by @nalba                                      │
├────────────────────────────────────────────────┤
│  [ screenshots / description / reviews ]        │
├────────────────────────────────────────────────┤
│  Install                                        │
│  ┌────────────────────────────────────────┐    │
│  │[Claude Code] [Cursor] [Windsurf] [CLI] │    │
│  └────────────────────────────────────────┘    │
│  Save to: ~/.claude/skills/code-review.md      │
│  ┌────────────────────────────────────────┐    │
│  │ --- (code block, copy button)          │    │
│  │ name: code-review                      │    │
│  │ description: ...                       │    │
│  └────────────────────────────────────────┘    │
│  [Copy] [Download] [One-click install ▾]       │
└────────────────────────────────────────────────┘
```

Rules for the tab bar:
- Ordered by `isPrimary` first, then by download popularity.
- If only one variant exists, hide the tab bar entirely — don't show "Cursor" alone as a single tab, it looks broken.
- Selected tab persists in URL hash (`#variant=cursor`) so users can deep-link to the right install instructions.
- If the current user has a stored "my editor" preference (cookie), auto-select that tab on load.
- Missing variant for the user's preferred client → show a soft "Not available for Cursor — request variant" CTA. This is discovery-of-demand.

### 3.3 UI — marketplace filter by "I use X"

Top-level global filter, not buried in a facet panel. Place it in the **header next to search**, same weight as the category nav:

```
[ Search ]   Editor: [ Claude Code ▾ ]   [Account]
```

- Persists per-user (cookie + server side if logged in).
- When set, the marketplace grid shows only products with a matching variant, and the product card shows a small chip: "Claude Code · Cursor · Windsurf" (3 max, "+N more" overflow).
- Setting the filter to "All" removes it.
- Every category page inherits the filter. Homepage "Featured for Claude Code users" sections become possible.

This is a **discovery lever** as well as a filter. Treat it as top-level information architecture.

### 3.4 UI — items in 2+ categories

Rules:
1. **Every product picks one `primaryCategory`.** This drives `/category/[slug]` URLs, breadcrumbs, "back to [category]" nav. No multi-primary. Forces authors to answer "what is this mainly."
2. **Up to 2 `secondaryCategories`.** A product tagged `primary: MCP, secondary: [CLI]` appears in both shelves but breadcrumbs say "MCP > Item." Browse pages query `WHERE primaryCategory = X OR secondaryCategories @> '{X}'`.
3. **Tags handle the long tail.** Secondary categories are for shelves users browse by hand; tags are for search and related-item carousels.
4. **Reject a "multi-category" checkbox array with no hierarchy.** Without a primary, breadcrumb / SEO / canonical URL logic all become undefined.

### 3.5 Versioning across variants

Two-level semver. This mirrors how Homebrew separates `version` (upstream) from `revision` (bottle rebuilds) and how npm separates package version from peer-host version.

- **Product version** — semver. Bumps on any variant content change or metadata change. This is what shows in the marketplace listing, what ratings attach to, what the buyer sees.
- **Variant version** — independent semver. Author can ship a v2.1.0 of the Cursor variant while the Claude Code variant sits at v1.4.0 because only Cursor's rule syntax changed.
- **Display rule:** show the product version prominently; show variant version only inside the selected tab ("Cursor rule v2.1.0 — updated 2 days ago").
- **Changelog entries are scoped.** Each changelog line tags which variant(s) it affects. "v1.5.0 — updated Cursor variant to 2.1.0 for new rule format; Claude Code variant unchanged."
- **Buyers purchasing the product get all variants at current versions.** Updates push to everyone regardless of which variant they downloaded.
- **Do NOT sync variant versions artificially.** Forcing `cursor@1.5.0` when only the Claude Code variant changed creates fake updates and confuses users.

### 3.6 Migration notes from current schema

- `ProductCategory` enum stays but is now `primaryCategory` + optional `secondaryCategories[]`. Existing products default to `secondaryCategories = []`.
- `compatibility: { platforms, versions }` is **deleted**. It was a placeholder. Replaced by `variants[]`.
- Existing listings get an auto-generated single variant (`kind` inferred from `category`, `environments` inferred from category → `MCP` maps to `[claude-code, claude-desktop, cursor, windsurf, cline]`, `SKILL` maps to `[claude-code]`, etc.), `isPrimary: true`.
- The existing `previewContent` field becomes `variants[0].install.content` during migration, then is removed.

---

## Bottom line

The schema needs four changes: (1) `variants[]` with per-variant `environments`, `kind`, `install.content`, independent `version`; (2) `primaryCategory` single + `secondaryCategories[]` max 2; (3) global "editor" filter in the header; (4) tab-style variant picker scoped to the install section, not the whole page. Smithery proves this works for MCP servers specifically; HuggingFace's `pipeline_tag`-plus-`tags` split proves the category model works at scale; npm's `peerDependenciesMeta` proves optional-host-compatibility is a familiar mental model for developers. The big differentiator against cursor.directory and awesome-cursorrules is that **compatibility is first-class metadata**, not README prose.

---

## Sources

- [Docker manifest docs](https://docs.docker.com/reference/cli/docker/manifest/)
- [Docker multi-arch blog](https://www.docker.com/blog/multi-arch-build-and-images-the-simple-way/)
- [Homebrew JSON API](https://formulae.brew.sh/docs/api/)
- [Homebrew bottles docs](https://docs.brew.sh/Bottles)
- [VS Code extension manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [Eclipse: Why Cursor/Windsurf fork VS Code](https://blogs.eclipse.org/post/thomas-froment/why-cursor-windsurf-and-co-fork-vs-code-shouldnt)
- [Open VSX Registry](https://open-vsx.org/)
- [npm peerDependencies](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/)
- [pnpm package.json](https://pnpm.io/package_json)
- [Python Packaging: platform compatibility tags](https://packaging.python.org/en/latest/specifications/platform-compatibility-tags/)
- [PEP 817 Wheel Variants](https://peps.python.org/pep-0817/)
- [HuggingFace GGUF docs](https://huggingface.co/docs/hub/gguf)
- [HuggingFace common model formats](https://huggingface.co/blog/ngxson/common-ai-model-formats)
- [Smithery.ai](https://smithery.ai/)
- [Smithery CLI guide](https://apigene.ai/blog/smithery-cli)
- [Glama MCP registry](https://glama.ai/mcp)
- [Glama: MCP Registry Standardization](https://glama.ai/blog/2025-07-05-mcp-registry-standardizing-server-discovery)
- [cursor.directory GitHub](https://github.com/pontusab/cursor.directory)
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)
- [n8n templates docs](https://docs.n8n.io/workflows/templates/)
- [fal.ai docs](https://fal.ai/docs/documentation)
