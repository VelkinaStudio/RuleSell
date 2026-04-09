import type {
  AccessLevel,
  Category,
  CreatorMark,
  Environment,
  ItemBadge,
  Platform,
  ReputationLevel,
  Ruleset,
  RulesetAuthor,
  RulesetTeam,
  Type,
  Variant,
  VariantKind,
} from "@/types";

import { qualityLetter, qualityScore } from "@/lib/quality/score";
import { MOCK_USERS_BY_USERNAME } from "./mock-users";
import { MOCK_TEAMS_BY_SLUG } from "./mock-teams";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function authorFromUsername(username: string): RulesetAuthor {
  const u = MOCK_USERS_BY_USERNAME[username];
  if (u) {
    return {
      username: u.username,
      avatar: u.avatar,
      reputation: u.reputation,
      creatorMarks: u.creatorMarks,
      level: u.level,
    };
  }
  // Real GitHub repo authors that aren't in our 20-user fixture set still
  // appear as RulesetAuthor stubs so the data feels authentic.
  return {
    username,
    avatar: null,
    reputation: 24,
    creatorMarks: ["VERIFIED_CREATOR"],
    level: "MEMBER",
  };
}

function teamRef(slug: string): RulesetTeam {
  const t = MOCK_TEAMS_BY_SLUG[slug];
  return {
    slug: t.slug,
    name: t.name,
    avatar: t.avatar,
    verified: t.verified,
  };
}

// Per-variant install content fixtures keyed by VariantKind. Kept short — the
// detail page is the place to show full instructions, the seed only needs to
// look real.
const VARIANT_TEMPLATES: Record<VariantKind, { language: string; targetPath?: string; content: string }> = {
  mcp_json: {
    language: "json",
    targetPath: "~/.config/claude/mcp_servers.json",
    content:
      '{\n  "mcpServers": {\n    "rulesell-example": {\n      "command": "npx",\n      "args": ["-y", "@rulesell/example-mcp"]\n    }\n  }\n}',
  },
  claude_skill: {
    language: "markdown",
    targetPath: "~/.claude/skills/example.md",
    content:
      "# Example Skill\n\nA short, focused capability your assistant can invoke when the user requests it.\n\n## When to use\n\n- The user mentions a specific task this skill solves.\n\n## Steps\n\n1. Inspect the workspace.\n2. Apply the documented procedure.\n3. Report results back to the user.",
  },
  cursor_rule: {
    language: "markdown",
    targetPath: ".cursorrules",
    content:
      "# Project rules\n\nFavor functional components, server-first data fetching, and small focused files. Never invent APIs that do not exist in the codebase.",
  },
  system_prompt: {
    language: "markdown",
    content:
      "You are a senior engineering assistant. Be concise. Cite the exact file and line number when you reference code. Refuse silently when asked to bypass safety.",
  },
  n8n_workflow: {
    language: "json",
    targetPath: "n8n://workflows/import",
    content:
      '{\n  "name": "Example Workflow",\n  "nodes": [],\n  "connections": {},\n  "active": false\n}',
  },
  make_blueprint: {
    language: "json",
    targetPath: "make://blueprints/import",
    content: '{\n  "name": "Example Blueprint",\n  "modules": []\n}',
  },
  crewai_agent: {
    language: "yaml",
    targetPath: "agents/researcher.yaml",
    content:
      "name: researcher\nrole: Information gathering specialist\ngoal: Surface high-signal sources for any topic\nbackstory: A career analyst who never trusts a single source.",
  },
  langgraph_agent: {
    language: "python",
    targetPath: "graphs/example.py",
    content:
      "from langgraph.graph import StateGraph\n\ngraph = StateGraph(dict)\ngraph.add_node('start', lambda s: s)\napp = graph.compile()",
  },
  bash_install: {
    language: "bash",
    content: "curl -fsSL https://example.com/install.sh | bash",
  },
  npm_install: {
    language: "bash",
    content: "npm install -g @rulesell/example-cli",
  },
  docker_compose: {
    language: "yaml",
    targetPath: "docker-compose.yml",
    content:
      "version: '3.9'\nservices:\n  example:\n    image: ghcr.io/rulesell/example:latest\n    ports:\n      - '3000:3000'",
  },
  raw_file: {
    language: "text",
    content: "# Drop this file into your project root and edit to taste.",
  },
};

interface VariantInput {
  id: string;
  environments: Environment[];
  kind: VariantKind;
  label: string;
  version?: string;
  content?: string;
  language?: string;
  targetPath?: string;
  isPrimary?: boolean;
  qualityScore?: number;
  instructions?: string;
}

function buildVariant(input: VariantInput): Variant {
  const tpl = VARIANT_TEMPLATES[input.kind];
  return {
    id: input.id,
    environments: input.environments,
    kind: input.kind,
    label: input.label,
    version: input.version ?? "1.0.0",
    install: {
      method:
        input.kind === "bash_install" || input.kind === "npm_install"
          ? "command"
          : input.kind === "raw_file"
            ? "download"
            : input.kind === "mcp_json" ||
                input.kind === "n8n_workflow" ||
                input.kind === "make_blueprint"
              ? "json_snippet"
              : "copy",
      content: input.content ?? tpl.content,
      targetPath: input.targetPath ?? tpl.targetPath,
      language: input.language ?? tpl.language,
    },
    instructions: input.instructions,
    isPrimary: input.isPrimary,
    qualityScore: input.qualityScore,
    lastTestedAt: "2026-04-01T12:00:00Z",
  };
}

interface RulesetInput {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  previewContent?: string;
  platform: Platform;
  type: Type;
  category: Category;
  secondaryCategories?: Category[];
  tags: string[];
  price: number; // cents
  authorUsername: string;
  authorOverride?: { reputation?: number; level?: ReputationLevel; creatorMarks?: CreatorMark[] };
  teamSlug?: string;
  maintainerRepo?: string;
  downloadCount: number;
  purchaseCount?: number;
  viewCount: number;
  avgRating: number;
  ratingCount: number;
  badges: ItemBadge[];
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED" | "FLAGGED";
  createdAt: string;
  updatedAt: string;
  variants: VariantInput[];
  defaultVariantIndex?: number;
  version?: string;
  license: string;
  qualityBreakdown: {
    tokenEfficiency: number | null;
    installSuccess: number | null;
    schemaClean: number | null;
    freshness?: number;
    reviewScore: number;
    securityPass?: boolean;
  };
  currentUserAccess?: AccessLevel;
  currentUserVoted?: boolean;
  currentUserSaved?: boolean;
  scanned?: boolean;
}

function buildRuleset(input: RulesetInput): Ruleset {
  const author = authorFromUsername(input.authorUsername);
  if (input.authorOverride) {
    if (input.authorOverride.reputation !== undefined)
      author.reputation = input.authorOverride.reputation;
    if (input.authorOverride.level)
      author.level = input.authorOverride.level;
    if (input.authorOverride.creatorMarks)
      author.creatorMarks = input.authorOverride.creatorMarks;
  }
  const variants = input.variants.map(buildVariant);
  const defaultIndex = input.defaultVariantIndex ?? 0;
  const defaultVariant = variants[defaultIndex] ?? variants[0];
  if (defaultVariant) defaultVariant.isPrimary = true;

  const breakdown = {
    tokenEfficiency: input.qualityBreakdown.tokenEfficiency,
    installSuccess: input.qualityBreakdown.installSuccess,
    schemaClean: input.qualityBreakdown.schemaClean,
    freshness: input.qualityBreakdown.freshness ?? 95,
    reviewScore: input.qualityBreakdown.reviewScore,
    securityPass: input.qualityBreakdown.securityPass ?? true,
  };
  const score = qualityScore(breakdown);

  // Auto-attach quality letter badge if not already in the list.
  const letter = qualityLetter(score);
  const badges = [...input.badges];
  if (
    letter &&
    !badges.includes(`QUALITY_${letter}` as ItemBadge) &&
    !badges.includes("QUALITY_A") &&
    !badges.includes("QUALITY_B") &&
    !badges.includes("QUALITY_C")
  ) {
    badges.push(`QUALITY_${letter}` as ItemBadge);
  }

  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    description: input.description,
    previewContent: input.previewContent ?? defaultVariant?.install.content ?? "",
    platform: input.platform,
    type: input.type,
    category: input.category,
    tags: input.tags,
    price: input.price,
    currency: "USD",
    downloadCount: input.downloadCount,
    purchaseCount: 0,
    viewCount: input.viewCount,
    avgRating: input.avgRating,
    ratingCount: input.ratingCount,
    status: input.status ?? "PUBLISHED",
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    author,
    currentUserVoted: input.currentUserVoted ?? false,
    currentUserSaved: input.currentUserSaved ?? false,
    currentUserAccess: input.currentUserAccess ?? (input.price === 0 ? "FREE_DOWNLOAD" : "PUBLIC"),
    secondaryCategories: input.secondaryCategories ?? [],
    variants,
    defaultVariantId: defaultVariant?.id ?? "",
    version: input.version ?? "1.0.0",
    license: input.license,
    qualityScore: score,
    qualityBreakdown: breakdown,
    badges,
    team: input.teamSlug ? teamRef(input.teamSlug) : undefined,
    maintainerClaim: input.maintainerRepo
      ? { githubRepo: input.maintainerRepo, claimedAt: "2026-02-15T00:00:00Z", verified: true }
      : undefined,
    scanResults: input.scanned
      ? {
          virusTotalPass: true,
          semgrepPass: true,
          sandboxPass: true,
          scannedAt: "2026-04-01T12:00:00Z",
        }
      : undefined,
  };
}

// -----------------------------------------------------------------------------
// Mock catalog — 60 rulesets
// 35 ported from real GitHub repos in the legacy catalog + 25 new fixtures
// exercising multi-variant, team, maintainer, subscription, and bundle cases.
// -----------------------------------------------------------------------------

const RULESET_INPUTS: RulesetInput[] = [
  // ── 1: Awesome CursorRules ─────────────────────────────────────
  {
    id: "rs-1",
    slug: "awesome-cursorrules",
    title: "Awesome CursorRules",
    shortDescription:
      "The largest curated collection of .cursorrules files for Cursor AI.",
    description:
      "The community's largest curated collection of .cursorrules configuration files, covering 50+ frameworks and languages. Whether you work with TypeScript, React, Python, Go, Rust, or Swift, there's a battle-tested ruleset ready to drop into your project.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    secondaryCategories: ["AGENT_TEAM"],
    tags: ["cursor", "rules", "typescript", "react", "python"],
    price: 0,
    authorUsername: "PatrickJS",
    maintainerRepo: "PatrickJS/awesome-cursorrules",
    downloadCount: 38_700,
    viewCount: 98_400,
    avgRating: 4.7,
    ratingCount: 412,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "POPULAR", "EDITORS_PICK"],
    createdAt: "2026-01-05T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-1-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
        qualityScore: 96,
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 96,
      schemaClean: 92,
      freshness: 90,
      reviewScore: 94,
      securityPass: true,
    },
    scanned: true,
  },
  // ── 2: Devin-Style Cursor Rules ─────────────────────────────────
  {
    id: "rs-2",
    slug: "devin-cursorrules",
    title: "Devin-Style Cursor Rules",
    shortDescription:
      "Turn Cursor and Windsurf into 90% of Devin with agentic rules.",
    description:
      "A ruleset that transforms Cursor and Windsurf into agentic coding assistants that behave like Devin. Instead of one-shot code generation, the AI follows a structured loop: understand, plan, execute, self-review.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["cursor", "windsurf", "devin", "agentic"],
    price: 0,
    authorUsername: "grapeot",
    downloadCount: 5_965,
    viewCount: 18_200,
    avgRating: 4.5,
    ratingCount: 86,
    badges: ["VERIFIED"],
    createdAt: "2026-01-12T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-2-v1",
        environments: ["cursor", "windsurf"],
        kind: "cursor_rule",
        label: "Cursor / Windsurf",
        qualityScore: 92,
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 92,
      schemaClean: 88,
      freshness: 80,
      reviewScore: 90,
      securityPass: true,
    },
  },
  // ── 3: RIPER-5 Cursor Framework ─────────────────────────────────
  {
    id: "rs-3",
    slug: "riper-5-cursor-framework",
    title: "RIPER-5 Cursor Framework",
    shortDescription:
      "Structured development modes: Research, Innovate, Plan, Execute, Review.",
    description:
      "A structured development framework for Cursor that constrains AI behavior into five explicit modes. Each mode has strict boundaries that prevent the AI from skipping ahead.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["cursor", "framework", "methodology", "agentic"],
    price: 0,
    authorUsername: "NeekChaw",
    downloadCount: 2_572,
    viewCount: 9_100,
    avgRating: 4.6,
    ratingCount: 42,
    badges: ["VERIFIED"],
    createdAt: "2026-01-18T00:00:00Z",
    updatedAt: "2026-03-01T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-3-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
        qualityScore: 90,
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 90,
      schemaClean: 90,
      freshness: 90,
      reviewScore: 88,
      securityPass: true,
    },
  },
];

// -- Rulesets 4-12 appended below to keep this file maintainable --
RULESET_INPUTS.push(
  {
    id: "rs-4",
    slug: "ai-prompts-multi-tool",
    title: "AI Prompts Multi-Tool Collection",
    shortDescription:
      "A cross-platform prompt and rules collection for Cursor, Windsurf, and Cline.",
    description:
      "An opinionated collection of prompts and rules that work across the three most popular AI coding tools. Maintained by instructa with weekly updates and community PRs.",
    platform: "CURSOR",
    type: "PROMPT",
    category: "PROMPT",
    secondaryCategories: ["RULES"],
    tags: ["cursor", "windsurf", "cline", "prompts"],
    price: 0,
    authorUsername: "instructa",
    downloadCount: 1_024,
    viewCount: 6_400,
    avgRating: 4.4,
    ratingCount: 28,
    badges: ["VERIFIED"],
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-03-10T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-4-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
      },
      {
        id: "rs-4-v2",
        environments: ["windsurf"],
        kind: "cursor_rule",
        label: "Windsurf",
      },
      {
        id: "rs-4-v3",
        environments: ["cline"],
        kind: "system_prompt",
        label: "Cline",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 88,
      schemaClean: 86,
      freshness: 90,
      reviewScore: 86,
      securityPass: true,
    },
  },
  {
    id: "rs-5",
    slug: "agentic-cursorrules",
    title: "Agentic CursorRules",
    shortDescription:
      "A minimal agentic ruleset for Cursor focused on planning discipline.",
    description:
      "Six clear rules that nudge Cursor toward planning before coding. Tiny footprint, big behavior change.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["cursor", "agentic", "planning"],
    price: 0,
    authorUsername: "s-smits",
    downloadCount: 647,
    viewCount: 3_100,
    avgRating: 4.3,
    ratingCount: 19,
    badges: ["VERIFIED"],
    createdAt: "2026-01-25T00:00:00Z",
    updatedAt: "2026-03-05T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-5-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 85,
      schemaClean: 88,
      freshness: 90,
      reviewScore: 84,
      securityPass: true,
    },
  },
  {
    id: "rs-6",
    slug: "official-mcp-servers",
    title: "Official MCP Servers Collection",
    shortDescription:
      "The reference set of MCP servers from Anthropic — filesystem, GitHub, Postgres, Slack, more.",
    description:
      "The canonical first-party MCP servers maintained by Anthropic. Reference implementations for filesystem, GitHub, Postgres, Slack, and more — the ones every other server is benchmarked against.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "official", "anthropic", "claude"],
    price: 0,
    authorUsername: "Anthropic",
    teamSlug: "anthropic-skills",
    maintainerRepo: "modelcontextprotocol/servers",
    downloadCount: 82_334,
    viewCount: 234_500,
    avgRating: 4.8,
    ratingCount: 1_240,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "OFFICIAL", "POPULAR", "EDITORS_PICK"],
    createdAt: "2025-11-12T00:00:00Z",
    updatedAt: "2026-04-02T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-6-v1",
        environments: ["claude-code", "claude-desktop"],
        kind: "mcp_json",
        label: "Claude Code · Claude Desktop",
        qualityScore: 99,
      },
      {
        id: "rs-6-v2",
        environments: ["cursor"],
        kind: "mcp_json",
        label: "Cursor",
        targetPath: "~/.cursor/mcp.json",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 96,
      installSuccess: 99,
      schemaClean: 100,
      freshness: 100,
      reviewScore: 96,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-7",
    slug: "playwright-mcp-server",
    title: "Playwright MCP Server",
    shortDescription:
      "Browser automation via Playwright as an MCP server for Claude and Cursor.",
    description:
      "A first-party MCP server from Microsoft that exposes Playwright's full browser automation surface. Drive a real browser from your AI assistant — open tabs, click, type, screenshot, scrape.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "playwright", "browser", "automation"],
    price: 0,
    authorUsername: "Microsoft",
    maintainerRepo: "microsoft/playwright-mcp",
    downloadCount: 29_873,
    viewCount: 88_200,
    avgRating: 4.6,
    ratingCount: 412,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "POPULAR"],
    createdAt: "2025-12-04T00:00:00Z",
    updatedAt: "2026-03-28T00:00:00Z",
    license: "Apache-2.0",
    variants: [
      {
        id: "rs-7-v1",
        environments: ["claude-code", "claude-desktop", "cursor"],
        kind: "mcp_json",
        label: "Claude · Cursor",
        qualityScore: 97,
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 92,
      installSuccess: 98,
      schemaClean: 100,
      freshness: 95,
      reviewScore: 92,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-8",
    slug: "github-mcp-server",
    title: "GitHub MCP Server",
    shortDescription:
      "Official GitHub MCP server — issues, PRs, code search, repository ops.",
    description:
      "GitHub's first-party MCP server. Lets your assistant read and write issues, manage PRs, search code, and inspect repository state with the same auth surface as the GitHub CLI.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "github", "official"],
    price: 0,
    authorUsername: "GitHub",
    maintainerRepo: "github/github-mcp-server",
    downloadCount: 28_340,
    viewCount: 84_000,
    avgRating: 4.7,
    ratingCount: 386,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "OFFICIAL", "POPULAR"],
    createdAt: "2025-12-10T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-8-v1",
        environments: ["claude-code", "claude-desktop"],
        kind: "mcp_json",
        label: "Claude",
        qualityScore: 98,
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 95,
      installSuccess: 97,
      schemaClean: 100,
      freshness: 98,
      reviewScore: 94,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-9",
    slug: "figma-context-mcp",
    title: "Figma Context MCP",
    shortDescription:
      "Pull live Figma frames and design tokens into your AI editor as MCP context.",
    description:
      "Stop screenshotting designs and pasting them into chat. This MCP server reads your selected Figma frames and exposes them as structured context — components, tokens, layout — that the AI can act on directly.",
    platform: "CURSOR",
    type: "RULESET",
    category: "MCP_SERVER",
    secondaryCategories: ["RULES"],
    tags: ["mcp", "figma", "design", "context"],
    price: 0,
    authorUsername: "GLips",
    downloadCount: 14_012,
    viewCount: 41_000,
    avgRating: 4.5,
    ratingCount: 188,
    badges: ["VERIFIED", "POPULAR"],
    createdAt: "2026-01-04T00:00:00Z",
    updatedAt: "2026-03-22T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-9-v1",
        environments: ["cursor", "claude-code"],
        kind: "mcp_json",
        label: "Cursor · Claude Code",
        qualityScore: 93,
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 88,
      installSuccess: 92,
      schemaClean: 95,
      freshness: 95,
      reviewScore: 90,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-10",
    slug: "awesome-n8n-templates",
    title: "Awesome n8n Templates",
    shortDescription:
      "Curated n8n workflow templates spanning marketing, dev ops, and AI automation.",
    description:
      "A community-curated collection of production-ready n8n workflow blueprints. Drop them into your instance, swap your credentials, and you're live.",
    platform: "N8N",
    type: "WORKFLOW",
    category: "WORKFLOW",
    tags: ["n8n", "workflow", "automation", "templates"],
    price: 0,
    authorUsername: "enescingoz",
    teamSlug: "n8n-community-hub",
    downloadCount: 20_657,
    viewCount: 62_400,
    avgRating: 4.5,
    ratingCount: 312,
    badges: ["VERIFIED", "POPULAR", "EDITORS_PICK"],
    createdAt: "2025-11-30T00:00:00Z",
    updatedAt: "2026-03-25T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-10-v1",
        environments: ["n8n"],
        kind: "n8n_workflow",
        label: "n8n",
        qualityScore: 95,
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 95,
      schemaClean: 92,
      freshness: 95,
      reviewScore: 92,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-11",
    slug: "n8n-free-templates",
    title: "n8n Free Templates Collection",
    shortDescription:
      "A free pack of 200+ n8n workflows you can import in one click.",
    description:
      "Two hundred ready-to-import n8n workflows organized by use case. Free to use, MIT licensed, no premium tier.",
    platform: "N8N",
    type: "WORKFLOW",
    category: "WORKFLOW",
    tags: ["n8n", "workflow", "free"],
    price: 0,
    authorUsername: "wassupjay",
    downloadCount: 5_611,
    viewCount: 18_900,
    avgRating: 4.3,
    ratingCount: 88,
    badges: ["VERIFIED"],
    createdAt: "2026-01-08T00:00:00Z",
    updatedAt: "2026-03-12T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-11-v1",
        environments: ["n8n"],
        kind: "n8n_workflow",
        label: "n8n",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 91,
      schemaClean: 88,
      freshness: 90,
      reviewScore: 86,
      securityPass: true,
    },
  },
  {
    id: "rs-12",
    slug: "comfyui-workflows",
    title: "ComfyUI Workflow Collection",
    shortDescription:
      "Community ComfyUI workflows for image generation, upscaling, and inpainting.",
    description:
      "A curated set of ComfyUI graphs spanning image gen, upscaling, ControlNet, inpainting, and AnimateDiff. Each workflow ships with the exact custom nodes it depends on.",
    platform: "OTHER",
    type: "WORKFLOW",
    category: "WORKFLOW",
    tags: ["comfyui", "stable-diffusion", "image"],
    price: 0,
    authorUsername: "ZHO-ZHO-ZHO",
    downloadCount: 7_321,
    viewCount: 22_100,
    avgRating: 4.4,
    ratingCount: 134,
    badges: ["VERIFIED"],
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-03-08T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-12-v1",
        environments: ["custom"],
        kind: "raw_file",
        label: "ComfyUI",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 89,
      schemaClean: 86,
      freshness: 90,
      reviewScore: 88,
      securityPass: true,
    },
  },
  {
    id: "rs-13",
    slug: "awesome-chatgpt-prompts",
    title: "Awesome ChatGPT Prompts",
    shortDescription:
      "The original community-curated prompt library for ChatGPT and clones.",
    description:
      "The most-starred prompt collection on GitHub. Hand-picked prompts that turn ChatGPT into specialized assistants — interviewer, JS console, English translator, more.",
    platform: "CHATGPT",
    type: "PROMPT",
    category: "PROMPT",
    tags: ["chatgpt", "prompts", "library"],
    price: 0,
    authorUsername: "f",
    downloadCount: 154_457,
    viewCount: 412_000,
    avgRating: 4.5,
    ratingCount: 2_140,
    badges: ["VERIFIED", "POPULAR", "EDITORS_PICK"],
    createdAt: "2025-09-15T00:00:00Z",
    updatedAt: "2026-03-18T00:00:00Z",
    license: "CC0-1.0",
    variants: [
      {
        id: "rs-13-v1",
        environments: ["chatgpt", "claude-code", "cursor"],
        kind: "system_prompt",
        label: "Any LLM",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: null,
      schemaClean: null,
      freshness: 92,
      reviewScore: 92,
      securityPass: true,
    },
  },
  {
    id: "rs-14",
    slug: "system-prompts-ai-tools",
    title: "System Prompts of AI Tools",
    shortDescription:
      "Reverse-engineered system prompts from production AI tools — for study and reference.",
    description:
      "An archive of leaked or published system prompts from popular AI products. Educational only — useful for understanding what shapes model behavior in the wild.",
    platform: "OTHER",
    type: "PROMPT",
    category: "PROMPT",
    tags: ["system-prompts", "research", "reference"],
    price: 0,
    authorUsername: "x1xhlol",
    downloadCount: 133_515,
    viewCount: 388_000,
    avgRating: 4.6,
    ratingCount: 1_820,
    badges: ["VERIFIED", "POPULAR"],
    createdAt: "2025-10-12T00:00:00Z",
    updatedAt: "2026-03-04T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-14-v1",
        environments: ["custom"],
        kind: "raw_file",
        label: "Reference",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: null,
      schemaClean: null,
      freshness: 88,
      reviewScore: 90,
      securityPass: true,
    },
  },
  {
    id: "rs-15",
    slug: "prompt-engineering-guide",
    title: "Prompt Engineering Guide",
    shortDescription:
      "The canonical reference guide for prompt engineering by DAIR.AI.",
    description:
      "A long-form, frequently updated guide that covers prompt patterns, chain-of-thought, retrieval augmentation, agentic prompting, and evaluation.",
    platform: "OTHER",
    type: "PROMPT",
    category: "PROMPT",
    tags: ["prompt-engineering", "guide", "education"],
    price: 0,
    authorUsername: "dair-ai",
    downloadCount: 72_355,
    viewCount: 188_000,
    avgRating: 4.7,
    ratingCount: 980,
    badges: ["VERIFIED", "POPULAR", "EDITORS_PICK"],
    createdAt: "2025-08-20T00:00:00Z",
    updatedAt: "2026-03-22T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-15-v1",
        environments: ["custom"],
        kind: "raw_file",
        label: "Reference",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: null,
      schemaClean: null,
      freshness: 95,
      reviewScore: 94,
      securityPass: true,
    },
  },
  {
    id: "rs-16",
    slug: "claude-code-system-prompts",
    title: "Claude Code System Prompts & Skills",
    shortDescription:
      "A maintained collection of Claude Code system prompts and reusable skills.",
    description:
      "Battle-tested system prompts and skill files for Claude Code. Drop-in replacements for the default behavior with stronger planning, better self-review, and explicit refusal patterns.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "SKILL",
    secondaryCategories: ["RULES"],
    tags: ["claude-code", "skills", "prompts"],
    price: 0,
    authorUsername: "Piebald-AI",
    downloadCount: 6_916,
    viewCount: 22_400,
    avgRating: 4.5,
    ratingCount: 124,
    badges: ["VERIFIED"],
    createdAt: "2026-01-22T00:00:00Z",
    updatedAt: "2026-03-26T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-16-v1",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 88,
      installSuccess: 92,
      schemaClean: 90,
      freshness: 95,
      reviewScore: 90,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-17",
    slug: "n8n-skills-claude-code",
    title: "n8n Skills for Claude Code",
    shortDescription:
      "Skills that let Claude Code design, deploy, and debug n8n workflows.",
    description:
      "A skill bundle that teaches Claude Code how to read your n8n instance, propose new workflows, and apply changes through the n8n REST API.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "SKILL",
    secondaryCategories: ["WORKFLOW"],
    tags: ["claude-code", "n8n", "skills", "automation"],
    price: 0,
    authorUsername: "czlonkowski",
    downloadCount: 3_869,
    viewCount: 14_100,
    avgRating: 4.4,
    ratingCount: 76,
    badges: ["VERIFIED"],
    createdAt: "2026-01-30T00:00:00Z",
    updatedAt: "2026-03-21T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-17-v1",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 86,
      installSuccess: 90,
      schemaClean: 88,
      freshness: 95,
      reviewScore: 88,
      securityPass: true,
    },
  },
  {
    id: "rs-18",
    slug: "crewai-examples",
    title: "CrewAI Examples",
    shortDescription:
      "Reference agent crews from the CrewAI core team.",
    description:
      "First-party CrewAI crew configurations for research, writing, and code review. Each crew is documented and ready to fork.",
    platform: "OTHER",
    type: "AGENT",
    category: "AGENT_TEAM",
    tags: ["crewai", "agents", "examples"],
    price: 0,
    authorUsername: "crewAIInc",
    downloadCount: 5_772,
    viewCount: 18_400,
    avgRating: 4.5,
    ratingCount: 102,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED"],
    createdAt: "2026-01-18T00:00:00Z",
    updatedAt: "2026-03-29T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-18-v1",
        environments: ["custom"],
        kind: "crewai_agent",
        label: "CrewAI",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 91,
      schemaClean: 92,
      freshness: 95,
      reviewScore: 90,
      securityPass: true,
    },
    maintainerRepo: "crewAIInc/crewAI-examples",
  },
  {
    id: "rs-19",
    slug: "agency-swarm",
    title: "Agency Swarm Framework",
    shortDescription:
      "Multi-agent orchestration framework with role-based crews and tool routing.",
    description:
      "A production framework for building agencies of specialized agents that collaborate via tool routing and shared memory.",
    platform: "OTHER",
    type: "AGENT",
    category: "AGENT_TEAM",
    tags: ["multi-agent", "framework", "orchestration"],
    price: 0,
    authorUsername: "VRSEN",
    downloadCount: 4_122,
    viewCount: 16_200,
    avgRating: 4.4,
    ratingCount: 86,
    badges: ["VERIFIED"],
    createdAt: "2026-01-25T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-19-v1",
        environments: ["custom"],
        kind: "langgraph_agent",
        label: "Python",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 88,
      schemaClean: 90,
      freshness: 90,
      reviewScore: 86,
      securityPass: true,
    },
  },
  {
    id: "rs-20",
    slug: "full-stack-ai-dev-toolkit",
    title: "Full-Stack AI Dev Toolkit",
    shortDescription:
      "A bundle of rules, MCP servers, and skills for shipping full-stack AI features.",
    description:
      "Eight carefully chosen items that cover everything you need to ship AI features end-to-end: Cursor rules, MCP servers for the most common APIs, a planning skill, and a review skill.",
    platform: "CURSOR",
    type: "BUNDLE",
    category: "BUNDLE",
    secondaryCategories: ["RULES", "MCP_SERVER"],
    tags: ["bundle", "full-stack", "starter", "rs-1", "rs-6", "rs-16"],
    price: 4_900,
    authorUsername: "claire-dubois",
    teamSlug: "rulesell-official",
    downloadCount: 0,
    viewCount: 8_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED", "OFFICIAL", "FEATURED"],
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-20-v1",
        environments: ["cursor", "claude-code"],
        kind: "raw_file",
        label: "Cursor · Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 90,
      installSuccess: 95,
      schemaClean: 92,
      freshness: 95,
      reviewScore: 95,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-21",
    slug: "dbhub-database-mcp",
    title: "DBHub — Universal Database MCP",
    shortDescription:
      "A single MCP server that speaks Postgres, MySQL, SQLite, and DuckDB.",
    description:
      "DBHub gives Claude and Cursor read/write access to whichever SQL database your project uses. One server, multiple drivers, identical tool surface.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "database", "postgres", "mysql", "sqlite"],
    price: 0,
    authorUsername: "Bytebase",
    downloadCount: 2_437,
    viewCount: 9_200,
    avgRating: 4.4,
    ratingCount: 64,
    badges: ["VERIFIED"],
    createdAt: "2026-02-04T00:00:00Z",
    updatedAt: "2026-03-19T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-21-v1",
        environments: ["claude-code", "cursor"],
        kind: "mcp_json",
        label: "Claude · Cursor",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 90,
      installSuccess: 92,
      schemaClean: 95,
      freshness: 95,
      reviewScore: 90,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-22",
    slug: "kubernetes-mcp-server",
    title: "Kubernetes MCP Server",
    shortDescription:
      "Inspect and operate Kubernetes clusters from your AI editor as MCP tools.",
    description:
      "Wraps kubectl in an MCP server. Get pods, describe deployments, tail logs, apply manifests — all as tool calls Claude can chain.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "kubernetes", "ops"],
    price: 0,
    authorUsername: "Flux159",
    downloadCount: 1_365,
    viewCount: 6_400,
    avgRating: 4.3,
    ratingCount: 38,
    badges: ["VERIFIED"],
    createdAt: "2026-02-08T00:00:00Z",
    updatedAt: "2026-03-12T00:00:00Z",
    license: "Apache-2.0",
    variants: [
      {
        id: "rs-22-v1",
        environments: ["claude-code", "claude-desktop"],
        kind: "mcp_json",
        label: "Claude",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 86,
      installSuccess: 90,
      schemaClean: 92,
      freshness: 92,
      reviewScore: 86,
      securityPass: true,
    },
  },
  {
    id: "rs-23",
    slug: "terraform-mcp-server",
    title: "Terraform MCP Server",
    shortDescription:
      "Plan, apply, and inspect Terraform state from your AI assistant.",
    description:
      "Official HashiCorp MCP server. Lets Claude run terraform plan/apply with full audit logging and human approval gates.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "terraform", "iac", "official"],
    price: 0,
    authorUsername: "HashiCorp",
    maintainerRepo: "hashicorp/terraform-mcp-server",
    downloadCount: 1_295,
    viewCount: 5_800,
    avgRating: 4.6,
    ratingCount: 44,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "OFFICIAL"],
    createdAt: "2026-02-12T00:00:00Z",
    updatedAt: "2026-03-26T00:00:00Z",
    license: "MPL-2.0",
    variants: [
      {
        id: "rs-23-v1",
        environments: ["claude-code", "claude-desktop"],
        kind: "mcp_json",
        label: "Claude",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 92,
      installSuccess: 96,
      schemaClean: 95,
      freshness: 95,
      reviewScore: 92,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-24",
    slug: "supabase-mcp-server",
    title: "Supabase MCP Server",
    shortDescription:
      "Query Supabase, manage migrations, and inspect schemas through MCP.",
    description:
      "An MCP server that connects to your Supabase project so Claude can write SQL, generate migrations, and inspect rows in real time.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "supabase", "database"],
    price: 0,
    authorUsername: "alexander-zuev",
    downloadCount: 814,
    viewCount: 3_800,
    avgRating: 4.4,
    ratingCount: 22,
    badges: ["VERIFIED"],
    createdAt: "2026-02-15T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-24-v1",
        environments: ["claude-code"],
        kind: "mcp_json",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 88,
      installSuccess: 90,
      schemaClean: 92,
      freshness: 95,
      reviewScore: 88,
      securityPass: true,
    },
  },
  {
    id: "rs-25",
    slug: "switchboard-mcp",
    title: "Switchboard — All-in-One MCP",
    shortDescription:
      "A meta-MCP server that proxies to all your other MCP servers from a single config.",
    description:
      "Tired of editing five MCP configs every time you switch tools? Switchboard is one MCP server that delegates to others — manage them through Switchboard's UI instead of JSON.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "meta", "router"],
    price: 0,
    authorUsername: "daltoniam",
    downloadCount: 487,
    viewCount: 1_900,
    avgRating: 4.2,
    ratingCount: 12,
    badges: ["NEW"],
    createdAt: "2026-03-25T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-25-v1",
        environments: ["claude-code", "claude-desktop"],
        kind: "mcp_json",
        label: "Claude",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 84,
      installSuccess: 86,
      schemaClean: 88,
      freshness: 100,
      reviewScore: 82,
      securityPass: true,
    },
  },
  {
    id: "rs-26",
    slug: "continuous-claude-v3",
    title: "Continuous Claude v3",
    shortDescription:
      "A long-running Claude Code workflow that continuously plans, executes, and reviews.",
    description:
      "Continuous Claude turns Claude Code into a persistent agent that runs in the background, working through a backlog of tasks one at a time with checkpoint commits.",
    platform: "CLAUDE",
    type: "AGENT",
    category: "AGENT_TEAM",
    secondaryCategories: ["SKILL"],
    tags: ["claude-code", "continuous", "agent", "automation"],
    price: 0,
    authorUsername: "parcadei",
    downloadCount: 3_633,
    viewCount: 12_400,
    avgRating: 4.5,
    ratingCount: 78,
    badges: ["VERIFIED"],
    createdAt: "2026-02-20T00:00:00Z",
    updatedAt: "2026-03-28T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-26-v1",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 88,
      installSuccess: 92,
      schemaClean: 90,
      freshness: 95,
      reviewScore: 90,
      securityPass: true,
    },
  },
  {
    id: "rs-27",
    slug: "claude-code-hooks-mastery",
    title: "Claude Code Hooks Mastery",
    shortDescription:
      "A complete reference for every Claude Code hook event, with examples.",
    description:
      "Everything you need to know about Claude Code hooks. Includes patterns for guardrails, automation, telemetry, and observability — and the gotchas that bite first-timers.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "SKILL",
    tags: ["claude-code", "hooks", "reference"],
    price: 0,
    authorUsername: "disler",
    downloadCount: 3_425,
    viewCount: 11_200,
    avgRating: 4.6,
    ratingCount: 84,
    badges: ["VERIFIED", "EDITORS_PICK"],
    createdAt: "2026-02-18T00:00:00Z",
    updatedAt: "2026-03-24T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-27-v1",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 86,
      installSuccess: 92,
      schemaClean: 88,
      freshness: 95,
      reviewScore: 92,
      securityPass: true,
    },
  },
  {
    id: "rs-28",
    slug: "meridian-claude-code",
    title: "Meridian — Zero-Config Claude Code",
    shortDescription:
      "Drop-in defaults that turn a fresh Claude Code install into a production-ready setup.",
    description:
      "A curated bundle of skills, hooks, and config that gets a new Claude Code install to a useful baseline in 30 seconds.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "SKILL",
    secondaryCategories: ["RULES"],
    tags: ["claude-code", "starter", "config"],
    price: 0,
    authorUsername: "markmdev",
    downloadCount: 144,
    viewCount: 980,
    avgRating: 4.2,
    ratingCount: 8,
    badges: ["NEW"],
    createdAt: "2026-03-28T00:00:00Z",
    updatedAt: "2026-04-04T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-28-v1",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 82,
      installSuccess: 88,
      schemaClean: 86,
      freshness: 100,
      reviewScore: 80,
      securityPass: true,
    },
  },
  {
    id: "rs-29",
    slug: "trail-of-bits-security-skills",
    title: "Trail of Bits Security Skills",
    shortDescription:
      "A skill bundle for security review of AI-generated code by Trail of Bits.",
    description:
      "Skills that teach Claude how to audit code for the OWASP Top 10, common cryptography mistakes, and supply-chain risks. Built by Trail of Bits' security research team.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "SKILL",
    tags: ["security", "audit", "claude-code"],
    price: 0,
    authorUsername: "Trail of Bits",
    maintainerRepo: "trailofbits/claude-skills",
    downloadCount: 4_043,
    viewCount: 13_800,
    avgRating: 4.8,
    ratingCount: 96,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "EDITORS_PICK"],
    createdAt: "2026-02-22T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "Apache-2.0",
    variants: [
      {
        id: "rs-29-v1",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 92,
      installSuccess: 95,
      schemaClean: 95,
      freshness: 95,
      reviewScore: 96,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-30",
    slug: "postgresql-ai-guide",
    title: "PostgreSQL AI Guide",
    shortDescription:
      "A guide and MCP server for using Postgres effectively with AI assistants.",
    description:
      "Best-practice patterns for letting Claude or Cursor work with Postgres safely — schema introspection, parameterized queries, transaction boundaries — plus a small MCP server.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    secondaryCategories: ["RULES"],
    tags: ["postgres", "mcp", "guide"],
    price: 0,
    authorUsername: "Timescale",
    downloadCount: 1_657,
    viewCount: 6_900,
    avgRating: 4.5,
    ratingCount: 42,
    badges: ["VERIFIED"],
    createdAt: "2026-02-26T00:00:00Z",
    updatedAt: "2026-03-22T00:00:00Z",
    license: "Apache-2.0",
    variants: [
      {
        id: "rs-30-v1",
        environments: ["claude-code"],
        kind: "mcp_json",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 88,
      installSuccess: 92,
      schemaClean: 90,
      freshness: 95,
      reviewScore: 90,
      securityPass: true,
    },
  },
  {
    id: "rs-31",
    slug: "java-enterprise-cursor-rules",
    title: "Java Enterprise Cursor Rules",
    shortDescription:
      "Cursor rules tuned for Spring Boot, Hibernate, and enterprise Java codebases.",
    description:
      "If you write Java in big systems, default Cursor will fight you. These rules teach it your conventions: package layout, dependency injection, test patterns.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["cursor", "java", "spring", "enterprise"],
    price: 0,
    authorUsername: "jabrena",
    downloadCount: 338,
    viewCount: 1_800,
    avgRating: 4.3,
    ratingCount: 14,
    badges: ["VERIFIED"],
    createdAt: "2026-02-28T00:00:00Z",
    updatedAt: "2026-03-20T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-31-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 88,
      schemaClean: 90,
      freshness: 92,
      reviewScore: 86,
      securityPass: true,
    },
  },
  {
    id: "rs-32",
    slug: "godot-cursor-rules",
    title: "Godot Game Dev Cursor Rules",
    shortDescription:
      "Cursor rules tuned for Godot 4 GDScript and C# game development.",
    description:
      "Rules that teach Cursor about Godot's node tree, scene composition, and signal patterns. Generates idiomatic Godot code instead of generic OOP.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["cursor", "godot", "gamedev", "gdscript"],
    price: 0,
    authorUsername: "BlueBirdBack",
    downloadCount: 108,
    viewCount: 720,
    avgRating: 4.1,
    ratingCount: 6,
    badges: ["NEW"],
    createdAt: "2026-03-22T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-32-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 84,
      schemaClean: 86,
      freshness: 100,
      reviewScore: 82,
      securityPass: true,
    },
  },
  {
    id: "rs-33",
    slug: "comfyui-to-python",
    title: "ComfyUI to Python Converter",
    shortDescription:
      "Converts ComfyUI workflow JSON into runnable, version-controllable Python.",
    description:
      "A workflow tool that takes a ComfyUI graph and produces equivalent Python so you can put it in CI and version control without losing the visual editor.",
    platform: "OTHER",
    type: "WORKFLOW",
    category: "CLI",
    secondaryCategories: ["WORKFLOW"],
    tags: ["comfyui", "cli", "python"],
    price: 0,
    authorUsername: "pydn",
    downloadCount: 2_294,
    viewCount: 8_800,
    avgRating: 4.4,
    ratingCount: 38,
    badges: ["VERIFIED"],
    createdAt: "2026-02-25T00:00:00Z",
    updatedAt: "2026-03-18T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-33-v1",
        environments: ["custom"],
        kind: "npm_install",
        label: "CLI",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 90,
      schemaClean: 92,
      freshness: 92,
      reviewScore: 88,
      securityPass: true,
    },
  },
  {
    id: "rs-34",
    slug: "mcp-monetization-boilerplate",
    title: "MCP Monetization Boilerplate",
    shortDescription:
      "A template for building paid MCP servers with Stripe metering baked in.",
    description:
      "If you want to ship a paid MCP server, this boilerplate handles the auth surface, usage metering, and Stripe billing so you can focus on your tool surface.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "monetization", "boilerplate"],
    price: 0,
    authorUsername: "iannuttall",
    downloadCount: 1_017,
    viewCount: 4_400,
    avgRating: 4.4,
    ratingCount: 26,
    badges: ["VERIFIED"],
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-03-25T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-34-v1",
        environments: ["claude-code"],
        kind: "mcp_json",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 86,
      installSuccess: 88,
      schemaClean: 90,
      freshness: 95,
      reviewScore: 86,
      securityPass: true,
    },
  },
  {
    id: "rs-35",
    slug: "n8n-mega-templates",
    title: "n8n Mega Templates (5000+)",
    shortDescription:
      "An enormous catalog of n8n workflow templates harvested from across the web.",
    description:
      "Five thousand n8n templates indexed and searchable. Lower curation than Awesome n8n Templates but vastly larger surface area.",
    platform: "N8N",
    type: "WORKFLOW",
    category: "WORKFLOW",
    tags: ["n8n", "workflow", "templates"],
    price: 0,
    authorUsername: "ritik-prog",
    downloadCount: 0,
    viewCount: 1_900,
    avgRating: 0,
    ratingCount: 0,
    badges: ["NEW"],
    createdAt: "2026-03-30T00:00:00Z",
    updatedAt: "2026-04-04T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-35-v1",
        environments: ["n8n"],
        kind: "n8n_workflow",
        label: "n8n",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 84,
      schemaClean: 80,
      freshness: 100,
      reviewScore: 78,
      securityPass: true,
    },
  },
);

// -----------------------------------------------------------------------------
// New fixtures (rs-36..rs-60) — exercise edge cases per spec §11
// 5 multi-variant · 3 team-authored · 3 maintainer-claimed · 2 subscription
// 2 bundles · varied free/paid mix · all 9 categories represented
// -----------------------------------------------------------------------------

RULESET_INPUTS.push(
  // ── Multi-variant #1 (5+ environments) ─────────────────────────
  {
    id: "rs-36",
    slug: "universal-postgres-mcp-pro",
    title: "Universal Postgres MCP Pro",
    shortDescription:
      "Paid Postgres MCP server with multi-tenant support, audit logging, and row-level filters.",
    description:
      "A production-grade Postgres MCP server. Multi-tenant connection pooling, full audit trail, configurable row-level filters, and Stripe-billed seat licensing.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    secondaryCategories: ["DATASET"],
    tags: ["mcp", "postgres", "enterprise", "paid"],
    price: 1_900,
    authorUsername: "helena-costa",
    teamSlug: "modelcontext-labs",
    downloadCount: 0,
    viewCount: 18_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED", "FEATURED"],
    createdAt: "2026-02-08T00:00:00Z",
    updatedAt: "2026-04-02T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-36-v1",
        environments: ["claude-code", "claude-desktop"],
        kind: "mcp_json",
        label: "Claude · Claude Desktop",
      },
      {
        id: "rs-36-v2",
        environments: ["cursor"],
        kind: "mcp_json",
        label: "Cursor",
        targetPath: "~/.cursor/mcp.json",
      },
      {
        id: "rs-36-v3",
        environments: ["windsurf"],
        kind: "mcp_json",
        label: "Windsurf",
      },
      {
        id: "rs-36-v4",
        environments: ["zed"],
        kind: "mcp_json",
        label: "Zed",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 94,
      installSuccess: 96,
      schemaClean: 100,
      freshness: 100,
      reviewScore: 94,
      securityPass: true,
    },
    scanned: true,
  },
  // ── Multi-variant #2 ───────────────────────────────────────────
  {
    id: "rs-37",
    slug: "review-crew-multi-agent",
    title: "Review Crew — Multi-Agent Code Review",
    shortDescription:
      "A multi-agent crew that splits code review across security, perf, and style reviewers.",
    description:
      "Drop the crew into your project and Claude will run three reviewers in parallel — security, performance, and code style — then merge their findings into a single ordered list.",
    platform: "CLAUDE",
    type: "AGENT",
    category: "AGENT_TEAM",
    secondaryCategories: ["SKILL"],
    tags: ["crewai", "review", "multi-agent"],
    price: 0,
    authorUsername: "noa-bar-lev",
    teamSlug: "windsurf-collective",
    downloadCount: 0,
    viewCount: 6_200,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-02-18T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-37-v1",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
      {
        id: "rs-37-v2",
        environments: ["custom"],
        kind: "crewai_agent",
        label: "CrewAI",
      },
      {
        id: "rs-37-v3",
        environments: ["custom"],
        kind: "langgraph_agent",
        label: "LangGraph",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 88,
      installSuccess: 92,
      schemaClean: 90,
      freshness: 95,
      reviewScore: 90,
      securityPass: true,
    },
  },
  // ── Multi-variant #3 ───────────────────────────────────────────
  {
    id: "rs-38",
    slug: "test-runner-mcp",
    title: "Test Runner MCP",
    shortDescription:
      "Run tests for any framework — pytest, vitest, go test, cargo test — through one MCP server.",
    description:
      "Stop telling Claude how to run your tests. This MCP server detects the framework and exposes a single 'run-tests' tool that works in any repo.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "MCP_SERVER",
    secondaryCategories: ["CLI"],
    tags: ["mcp", "testing", "ci"],
    price: 0,
    authorUsername: "ravi-prasad",
    teamSlug: "modelcontext-labs",
    downloadCount: 0,
    viewCount: 4_100,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-02-22T00:00:00Z",
    updatedAt: "2026-03-26T00:00:00Z",
    license: "Apache-2.0",
    variants: [
      {
        id: "rs-38-v1",
        environments: ["claude-code", "claude-desktop"],
        kind: "mcp_json",
        label: "Claude",
      },
      {
        id: "rs-38-v2",
        environments: ["cursor"],
        kind: "mcp_json",
        label: "Cursor",
      },
      {
        id: "rs-38-v3",
        environments: ["windsurf"],
        kind: "mcp_json",
        label: "Windsurf",
      },
      {
        id: "rs-38-v4",
        environments: ["cline"],
        kind: "mcp_json",
        label: "Cline",
      },
      {
        id: "rs-38-v5",
        environments: ["zed"],
        kind: "mcp_json",
        label: "Zed",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 90,
      installSuccess: 92,
      schemaClean: 95,
      freshness: 95,
      reviewScore: 88,
      securityPass: true,
    },
  },
  // ── Multi-variant #4 ───────────────────────────────────────────
  {
    id: "rs-39",
    slug: "browser-agent-pack",
    title: "Browser Agent Pack",
    shortDescription:
      "Three browser-driving agents — research, scraping, and form-filling.",
    description:
      "A pack of three agents tuned for browser automation. They share the same Playwright MCP backend but specialize in different tasks.",
    platform: "OTHER",
    type: "AGENT",
    category: "AGENT_TEAM",
    secondaryCategories: ["MCP_SERVER"],
    tags: ["agents", "browser", "playwright"],
    price: 0,
    authorUsername: "finn-oconnor",
    downloadCount: 0,
    viewCount: 3_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-02-26T00:00:00Z",
    updatedAt: "2026-03-29T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-39-v1",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
      {
        id: "rs-39-v2",
        environments: ["custom"],
        kind: "crewai_agent",
        label: "CrewAI",
      },
      {
        id: "rs-39-v3",
        environments: ["custom"],
        kind: "langgraph_agent",
        label: "LangGraph",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 86,
      installSuccess: 90,
      schemaClean: 88,
      freshness: 95,
      reviewScore: 86,
      securityPass: true,
    },
  },
  // ── Multi-variant #5 ───────────────────────────────────────────
  {
    id: "rs-40",
    slug: "spec-driven-rules",
    title: "Spec-Driven Development Rules",
    shortDescription:
      "Rules that force the AI to write a spec before touching code, in any editor.",
    description:
      "Six clear rules that block the AI from writing code until it has produced a spec the user has explicitly approved. Works across editors with the same constraint set.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["rules", "spec-driven", "discipline"],
    price: 0,
    authorUsername: "yuki-tomoda",
    downloadCount: 0,
    viewCount: 7_800,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED", "EDITORS_PICK"],
    createdAt: "2026-02-04T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-40-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
      },
      {
        id: "rs-40-v2",
        environments: ["windsurf"],
        kind: "cursor_rule",
        label: "Windsurf",
      },
      {
        id: "rs-40-v3",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
      {
        id: "rs-40-v4",
        environments: ["cline"],
        kind: "system_prompt",
        label: "Cline",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 92,
      schemaClean: 90,
      freshness: 95,
      reviewScore: 92,
      securityPass: true,
    },
  },
  // ── Subscription-priced #1 ─────────────────────────────────────
  {
    id: "rs-41",
    slug: "claude-skills-pro",
    title: "Claude Skills Pro",
    shortDescription:
      "A monthly-updated bundle of premium Claude skills curated by the Anthropic Skills team.",
    description:
      "Every month, the Anthropic Skills team adds 4-6 new vetted skills to this bundle. Subscribe once, always get the latest set without re-buying.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "SKILL",
    secondaryCategories: ["BUNDLE"],
    tags: ["claude-code", "skills", "subscription", "premium"],
    price: 800,
    authorUsername: "anthropic-skills",
    teamSlug: "anthropic-skills",
    maintainerRepo: "anthropics/skills-pro",
    downloadCount: 0,
    viewCount: 14_200,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "OFFICIAL", "EDITORS_PICK", "FEATURED"],
    status: "PUBLISHED",
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-41-v1",
        environments: ["claude-code"],
        kind: "claude_skill",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 96,
      installSuccess: 98,
      schemaClean: 100,
      freshness: 100,
      reviewScore: 98,
      securityPass: true,
    },
    scanned: true,
    currentUserAccess: "SUBSCRIPTION_ACTIVE",
  },
  // ── Subscription-priced #2 ─────────────────────────────────────
  {
    id: "rs-42",
    slug: "n8n-workflow-vault",
    title: "n8n Workflow Vault",
    shortDescription:
      "A monthly-updated vault of premium n8n workflows for marketing, sales, and ops.",
    description:
      "Subscribe to get every new workflow we ship, plus access to the full back-catalog. Battle-tested in production at three Series-B SaaS companies.",
    platform: "N8N",
    type: "WORKFLOW",
    category: "WORKFLOW",
    secondaryCategories: ["BUNDLE"],
    tags: ["n8n", "subscription", "workflows", "premium"],
    price: 500,
    authorUsername: "ege-koc",
    teamSlug: "n8n-community-hub",
    downloadCount: 0,
    viewCount: 6_800,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED", "FEATURED"],
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-04-03T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-42-v1",
        environments: ["n8n"],
        kind: "n8n_workflow",
        label: "n8n",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 94,
      schemaClean: 92,
      freshness: 100,
      reviewScore: 92,
      securityPass: true,
    },
    scanned: true,
    currentUserAccess: "SUBSCRIPTION_ACTIVE",
  },
  // ── Bundle #1 ──────────────────────────────────────────────────
  {
    id: "rs-43",
    slug: "starter-pack-claude-code",
    title: "Starter Pack: Claude Code",
    shortDescription:
      "A bundle that gets a fresh Claude Code install to a productive baseline in five minutes.",
    description:
      "Six items bundled together: Anthropic's official MCP servers, Trail of Bits security skills, Continuous Claude, Claude Code Hooks Mastery, the Spec-Driven rules, and the GitHub MCP server. Buy once, install all.",
    platform: "CLAUDE",
    type: "BUNDLE",
    category: "BUNDLE",
    secondaryCategories: ["SKILL", "MCP_SERVER"],
    tags: ["bundle", "starter", "claude-code", "rs-6", "rs-8", "rs-26", "rs-27", "rs-29", "rs-40"],
    price: 2_900,
    authorUsername: "claire-dubois",
    teamSlug: "rulesell-official",
    downloadCount: 0,
    viewCount: 9_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED", "OFFICIAL", "EDITORS_PICK"],
    createdAt: "2026-02-12T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-43-v1",
        environments: ["claude-code"],
        kind: "raw_file",
        label: "Claude Code",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 92,
      installSuccess: 96,
      schemaClean: 95,
      freshness: 95,
      reviewScore: 94,
      securityPass: true,
    },
    scanned: true,
  },
  // ── Bundle #2 ──────────────────────────────────────────────────
  {
    id: "rs-44",
    slug: "starter-pack-cursor",
    title: "Starter Pack: Cursor",
    shortDescription:
      "Everything a Cursor user needs in one bundle — rules, MCPs, and skills.",
    description:
      "Awesome CursorRules + RIPER-5 + Spec-Driven Rules + Figma MCP + Test Runner MCP + Universal Postgres MCP. Six items, one purchase.",
    platform: "CURSOR",
    type: "BUNDLE",
    category: "BUNDLE",
    secondaryCategories: ["RULES", "MCP_SERVER"],
    tags: ["bundle", "cursor", "rs-1", "rs-3", "rs-9", "rs-36", "rs-38", "rs-40"],
    price: 3_900,
    authorUsername: "samuel-adeyemi",
    teamSlug: "rulesell-official",
    downloadCount: 0,
    viewCount: 7_200,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED", "OFFICIAL", "FEATURED"],
    createdAt: "2026-02-15T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-44-v1",
        environments: ["cursor"],
        kind: "raw_file",
        label: "Cursor",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 92,
      installSuccess: 95,
      schemaClean: 92,
      freshness: 95,
      reviewScore: 95,
      securityPass: true,
    },
    scanned: true,
  },
  // ── Maintainer-claimed #1 (Windsurf rules) ─────────────────────
  {
    id: "rs-45",
    slug: "windsurf-rules-collection",
    title: "Windsurf Rules Collection",
    shortDescription:
      "The official Windsurf rules collection from the Windsurf Collective team.",
    description:
      "A maintained collection of project-level Windsurf rules covering most popular language and framework combinations.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["windsurf", "rules", "official"],
    price: 0,
    authorUsername: "windsurf-collective",
    teamSlug: "windsurf-collective",
    maintainerRepo: "Codeium/windsurf-rules",
    downloadCount: 9_412,
    viewCount: 28_400,
    avgRating: 4.6,
    ratingCount: 184,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "POPULAR"],
    createdAt: "2025-11-22T00:00:00Z",
    updatedAt: "2026-03-29T00:00:00Z",
    license: "Apache-2.0",
    variants: [
      {
        id: "rs-45-v1",
        environments: ["windsurf"],
        kind: "cursor_rule",
        label: "Windsurf",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 94,
      schemaClean: 92,
      freshness: 95,
      reviewScore: 92,
      securityPass: true,
    },
    scanned: true,
  },
  // ── Maintainer-claimed #2 ──────────────────────────────────────
  {
    id: "rs-46",
    slug: "claude-cookbooks",
    title: "Claude Cookbooks",
    shortDescription:
      "The official Anthropic cookbook collection — patterns for building with Claude.",
    description:
      "Maintained by the Anthropic applied team. Practical, runnable examples for everything from RAG to multi-agent workflows.",
    platform: "CLAUDE",
    type: "RULESET",
    category: "SKILL",
    secondaryCategories: ["DATASET"],
    tags: ["claude", "cookbook", "official", "anthropic"],
    price: 0,
    authorUsername: "anthropic-skills",
    teamSlug: "anthropic-skills",
    maintainerRepo: "anthropics/claude-cookbooks",
    downloadCount: 18_400,
    viewCount: 64_200,
    avgRating: 4.8,
    ratingCount: 412,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "OFFICIAL", "POPULAR"],
    createdAt: "2025-10-15T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-46-v1",
        environments: ["claude-code", "claude-desktop"],
        kind: "claude_skill",
        label: "Claude",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 94,
      installSuccess: 96,
      schemaClean: 100,
      freshness: 100,
      reviewScore: 96,
      securityPass: true,
    },
    scanned: true,
  },
  // ── Maintainer-claimed #3 ──────────────────────────────────────
  {
    id: "rs-47",
    slug: "openai-codex-rules",
    title: "OpenAI Codex Rules Reference",
    shortDescription:
      "The maintained reference for Codex CLI rule files and configuration.",
    description:
      "Codex's first-party rules reference. Documents every config option, with examples for each.",
    platform: "CHATGPT",
    type: "RULESET",
    category: "RULES",
    tags: ["codex", "rules", "openai", "official"],
    price: 0,
    authorUsername: "openai",
    maintainerRepo: "openai/codex-rules",
    downloadCount: 6_240,
    viewCount: 22_400,
    avgRating: 4.5,
    ratingCount: 142,
    badges: ["VERIFIED", "MAINTAINER_VERIFIED", "OFFICIAL"],
    createdAt: "2025-12-08T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "Apache-2.0",
    variants: [
      {
        id: "rs-47-v1",
        environments: ["codex"],
        kind: "cursor_rule",
        label: "Codex",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 94,
      schemaClean: 92,
      freshness: 95,
      reviewScore: 92,
      securityPass: true,
    },
    scanned: true,
  },
  // ── Filling out the rest with a healthy mix ────────────────────
  {
    id: "rs-48",
    slug: "rust-cursor-rules",
    title: "Idiomatic Rust Cursor Rules",
    shortDescription:
      "Cursor rules tuned for idiomatic, ownership-first Rust.",
    description:
      "Default Cursor writes Rust like Java. These rules teach it ownership, lifetimes, and the borrow checker so you stop fighting your own AI.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["cursor", "rust", "ownership"],
    price: 0,
    authorUsername: "priya-menon",
    downloadCount: 0,
    viewCount: 5_200,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-02-20T00:00:00Z",
    updatedAt: "2026-03-25T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-48-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 90,
      schemaClean: 92,
      freshness: 95,
      reviewScore: 90,
      securityPass: true,
    },
  },
  {
    id: "rs-49",
    slug: "go-microservices-rules",
    title: "Go Microservices Cursor Rules",
    shortDescription:
      "Production-grade Cursor rules for Go microservices with stdlib-first conventions.",
    description:
      "Stdlib-first Go: minimal frameworks, table-driven tests, structured logging. These rules push Cursor toward Go that survives a code review.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["cursor", "go", "microservices"],
    price: 0,
    authorUsername: "marc-beaulieu",
    downloadCount: 0,
    viewCount: 4_200,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-02-22T00:00:00Z",
    updatedAt: "2026-03-22T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-49-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 90,
      schemaClean: 90,
      freshness: 92,
      reviewScore: 88,
      securityPass: true,
    },
  },
  {
    id: "rs-50",
    slug: "ai-eval-dataset",
    title: "AI Eval Dataset — Coding Tasks",
    shortDescription:
      "A 1,200-task evaluation dataset for measuring coding-assistant quality.",
    description:
      "1,200 coding tasks across 12 languages with verified expected outputs. Use it to benchmark your own AI tooling decisions.",
    platform: "OTHER",
    type: "DATASET",
    category: "DATASET",
    tags: ["dataset", "evaluation", "coding"],
    price: 1_900,
    authorUsername: "samuel-adeyemi",
    downloadCount: 0,
    viewCount: 4_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-02-26T00:00:00Z",
    updatedAt: "2026-03-28T00:00:00Z",
    license: "CC-BY-4.0",
    variants: [
      {
        id: "rs-50-v1",
        environments: ["custom"],
        kind: "raw_file",
        label: "Dataset",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: null,
      schemaClean: 95,
      freshness: 95,
      reviewScore: 92,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-51",
    slug: "security-prompts-pack",
    title: "Security Prompts Pack",
    shortDescription:
      "Hand-tuned prompts that turn any LLM into a code security reviewer.",
    description:
      "Twenty prompts targeting OWASP Top 10 categories. Drop into your CI to flag suspicious patterns before merge.",
    platform: "OTHER",
    type: "PROMPT",
    category: "PROMPT",
    tags: ["security", "prompts", "review"],
    price: 1_500,
    authorUsername: "ravi-prasad",
    downloadCount: 0,
    viewCount: 5_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-03-04T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-51-v1",
        environments: ["chatgpt", "claude-code", "cursor"],
        kind: "system_prompt",
        label: "Any LLM",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: null,
      schemaClean: null,
      freshness: 100,
      reviewScore: 94,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-52",
    slug: "aider-config-toolkit",
    title: "Aider Config Toolkit",
    shortDescription:
      "An opinionated set of Aider configs for repo onboarding and PR review.",
    description:
      "Make Aider productive on day one. Includes a repo onboarding script, a PR review preset, and a refactor preset.",
    platform: "OTHER",
    type: "RULESET",
    category: "CLI",
    secondaryCategories: ["RULES"],
    tags: ["aider", "cli", "config"],
    price: 0,
    authorUsername: "daniel-ohta",
    downloadCount: 0,
    viewCount: 2_100,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-03-08T00:00:00Z",
    updatedAt: "2026-03-26T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-52-v1",
        environments: ["aider"],
        kind: "raw_file",
        label: "Aider",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 88,
      schemaClean: 90,
      freshness: 95,
      reviewScore: 86,
      securityPass: true,
    },
  },
  {
    id: "rs-53",
    slug: "data-analyst-agent-team",
    title: "Data Analyst Agent Team",
    shortDescription:
      "A four-agent crew that ingests, profiles, analyzes, and reports on tabular data.",
    description:
      "Plug in a CSV or Parquet file and the crew will profile it, run a basic analysis, and produce a one-page report. Built for analysts who want a faster first pass.",
    platform: "OTHER",
    type: "AGENT",
    category: "AGENT_TEAM",
    secondaryCategories: ["DATASET"],
    tags: ["agents", "data", "analysis"],
    price: 2_500,
    authorUsername: "noa-bar-lev",
    teamSlug: "windsurf-collective",
    downloadCount: 0,
    viewCount: 2_800,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-03-10T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-53-v1",
        environments: ["custom"],
        kind: "crewai_agent",
        label: "CrewAI",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 90,
      schemaClean: 92,
      freshness: 100,
      reviewScore: 90,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-54",
    slug: "obsidian-claude-bridge",
    title: "Obsidian Claude Bridge",
    shortDescription:
      "An MCP server that lets Claude read, write, and link notes in your Obsidian vault.",
    description:
      "Bridge Claude into your Obsidian vault. Read notes, create links, search by tag, and produce daily review summaries.",
    platform: "OBSIDIAN",
    type: "RULESET",
    category: "MCP_SERVER",
    tags: ["mcp", "obsidian", "notes", "knowledge"],
    price: 0,
    authorUsername: "sara-kowalski",
    downloadCount: 0,
    viewCount: 2_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-03-12T00:00:00Z",
    updatedAt: "2026-03-29T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-54-v1",
        environments: ["claude-code", "claude-desktop", "obsidian"],
        kind: "mcp_json",
        label: "Claude · Obsidian",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: 86,
      installSuccess: 90,
      schemaClean: 92,
      freshness: 95,
      reviewScore: 88,
      securityPass: true,
    },
  },
  {
    id: "rs-55",
    slug: "make-automation-pack",
    title: "Make Automation Pack",
    shortDescription:
      "Twelve Make.com blueprints for marketing, sales, and customer support.",
    description:
      "Twelve battle-tested Make.com blueprints. Import, swap your credentials, and ship.",
    platform: "MAKE",
    type: "WORKFLOW",
    category: "WORKFLOW",
    tags: ["make", "automation", "blueprints"],
    price: 1_900,
    authorUsername: "emeka-chukwu",
    downloadCount: 0,
    viewCount: 1_900,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-03-14T00:00:00Z",
    updatedAt: "2026-03-28T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-55-v1",
        environments: ["make"],
        kind: "make_blueprint",
        label: "Make",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 88,
      schemaClean: 88,
      freshness: 100,
      reviewScore: 86,
      securityPass: true,
    },
    scanned: true,
  },
  {
    id: "rs-56",
    slug: "chatgpt-power-prompts",
    title: "ChatGPT Power Prompts",
    shortDescription:
      "Forty advanced ChatGPT prompts covering research, writing, and code review.",
    description:
      "Premium prompts that consistently outperform the defaults on common tasks. Reviewed by three certified devs before shipping.",
    platform: "CHATGPT",
    type: "PROMPT",
    category: "PROMPT",
    tags: ["chatgpt", "prompts", "premium"],
    price: 1_200,
    authorUsername: "claire-dubois",
    downloadCount: 0,
    viewCount: 6_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-03-16T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "Commercial",
    variants: [
      {
        id: "rs-56-v1",
        environments: ["chatgpt"],
        kind: "system_prompt",
        label: "ChatGPT",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: null,
      schemaClean: null,
      freshness: 100,
      reviewScore: 92,
      securityPass: true,
    },
  },
  {
    id: "rs-57",
    slug: "gemini-cli-recipes",
    title: "Gemini CLI Recipes",
    shortDescription:
      "Practical recipes for the Gemini CLI — search, code, and content workflows.",
    description:
      "A growing collection of one-shot recipes for the Gemini CLI. Each recipe is a self-contained shell snippet you can drop into a script.",
    platform: "GEMINI",
    type: "RULESET",
    category: "CLI",
    tags: ["gemini", "cli", "recipes"],
    price: 0,
    authorUsername: "yuki-tomoda",
    downloadCount: 0,
    viewCount: 3_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-03-18T00:00:00Z",
    updatedAt: "2026-03-30T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-57-v1",
        environments: ["gemini-cli"],
        kind: "bash_install",
        label: "Gemini CLI",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 92,
      schemaClean: 90,
      freshness: 100,
      reviewScore: 88,
      securityPass: true,
    },
  },
  {
    id: "rs-58",
    slug: "rag-evaluation-dataset",
    title: "RAG Evaluation Dataset",
    shortDescription:
      "A reference dataset for evaluating retrieval-augmented generation systems.",
    description:
      "5,000 questions, 1,200 documents, 9 retrievers benchmarked. Useful for measuring whether your RAG changes are actually wins.",
    platform: "OTHER",
    type: "DATASET",
    category: "DATASET",
    tags: ["rag", "dataset", "evaluation"],
    price: 0,
    authorUsername: "samuel-adeyemi",
    downloadCount: 0,
    viewCount: 4_800,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-03-20T00:00:00Z",
    updatedAt: "2026-03-29T00:00:00Z",
    license: "CC-BY-4.0",
    variants: [
      {
        id: "rs-58-v1",
        environments: ["custom"],
        kind: "raw_file",
        label: "Dataset",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: null,
      schemaClean: 95,
      freshness: 100,
      reviewScore: 92,
      securityPass: true,
    },
  },
  {
    id: "rs-59",
    slug: "ts-monorepo-rules",
    title: "TypeScript Monorepo Cursor Rules",
    shortDescription:
      "Rules tuned for pnpm + Turbo + tsconfig project references.",
    description:
      "If your repo is a monorepo, default Cursor will frequently ignore your project boundaries. These rules teach it the structure.",
    platform: "CURSOR",
    type: "RULESET",
    category: "RULES",
    tags: ["cursor", "typescript", "monorepo", "pnpm"],
    price: 0,
    authorUsername: "lukas-weber",
    downloadCount: 0,
    viewCount: 6_100,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED"],
    createdAt: "2026-03-22T00:00:00Z",
    updatedAt: "2026-04-02T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-59-v1",
        environments: ["cursor"],
        kind: "cursor_rule",
        label: "Cursor",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 92,
      schemaClean: 92,
      freshness: 100,
      reviewScore: 90,
      securityPass: true,
    },
  },
  {
    id: "rs-60",
    slug: "rulesell-cli",
    title: "RuleSell CLI",
    shortDescription:
      "Install, search, and update RuleSell items from your terminal.",
    description:
      "The official RuleSell CLI. Install items, search the catalog, and keep your bundles up to date — all from the terminal.",
    platform: "OTHER",
    type: "RULESET",
    category: "CLI",
    tags: ["cli", "rulesell", "official"],
    price: 0,
    authorUsername: "claire-dubois",
    teamSlug: "rulesell-official",
    downloadCount: 0,
    viewCount: 2_400,
    avgRating: 0,
    ratingCount: 0,
    badges: ["VERIFIED", "OFFICIAL", "NEW"],
    createdAt: "2026-03-28T00:00:00Z",
    updatedAt: "2026-04-05T00:00:00Z",
    license: "MIT",
    variants: [
      {
        id: "rs-60-v1",
        environments: ["custom"],
        kind: "npm_install",
        label: "npm",
      },
      {
        id: "rs-60-v2",
        environments: ["custom"],
        kind: "bash_install",
        label: "curl",
      },
    ],
    qualityBreakdown: {
      tokenEfficiency: null,
      installSuccess: 94,
      schemaClean: 96,
      freshness: 100,
      reviewScore: 90,
      securityPass: true,
    },
    scanned: true,
  },
);

// -----------------------------------------------------------------------------
// Materialize the catalog
// -----------------------------------------------------------------------------

export const MOCK_RULESETS: Ruleset[] = RULESET_INPUTS.map(buildRuleset);

export const MOCK_RULESETS_BY_ID: Record<string, Ruleset> = Object.fromEntries(
  MOCK_RULESETS.map((r) => [r.id, r]),
);

export const MOCK_RULESETS_BY_SLUG: Record<string, Ruleset> = Object.fromEntries(
  MOCK_RULESETS.map((r) => [r.slug, r]),
);
