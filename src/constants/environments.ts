import type { Environment } from "@/types";

export type EnvironmentFamily =
  | "claude"
  | "editor"
  | "agent"
  | "workflow"
  | "other";

export interface EnvironmentMeta {
  label: string;
  slug: string;
  icon: string;
  family: EnvironmentFamily;
  /** Is this one of the 8 primary environments shown by default in the tool picker? */
  primary: boolean;
}

export const ENVIRONMENT_META: Record<Environment, EnvironmentMeta> = {
  "claude-code": {
    label: "Claude Code",
    slug: "claude-code",
    icon: "Bot",
    family: "claude",
    primary: true,
  },
  "claude-desktop": {
    label: "Claude Desktop",
    slug: "claude-desktop",
    icon: "Monitor",
    family: "claude",
    primary: false,
  },
  cursor: {
    label: "Cursor",
    slug: "cursor",
    icon: "MousePointerClick",
    family: "editor",
    primary: true,
  },
  windsurf: {
    label: "Windsurf",
    slug: "windsurf",
    icon: "Wind",
    family: "editor",
    primary: true,
  },
  cline: {
    label: "Cline",
    slug: "cline",
    icon: "Terminal",
    family: "editor",
    primary: true,
  },
  continue: {
    label: "Continue",
    slug: "continue",
    icon: "ArrowRightCircle",
    family: "editor",
    primary: false,
  },
  zed: {
    label: "Zed",
    slug: "zed",
    icon: "Zap",
    family: "editor",
    primary: false,
  },
  codex: {
    label: "Codex",
    slug: "codex",
    icon: "Code2",
    family: "editor",
    primary: true,
  },
  chatgpt: {
    label: "ChatGPT",
    slug: "chatgpt",
    icon: "MessageCircle",
    family: "agent",
    primary: true,
  },
  "gemini-cli": {
    label: "Gemini CLI",
    slug: "gemini-cli",
    icon: "Sparkle",
    family: "agent",
    primary: true,
  },
  aider: {
    label: "Aider",
    slug: "aider",
    icon: "GitBranch",
    family: "agent",
    primary: false,
  },
  copilot: {
    label: "Copilot",
    slug: "copilot",
    icon: "Github",
    family: "editor",
    primary: false,
  },
  n8n: {
    label: "n8n",
    slug: "n8n",
    icon: "Workflow",
    family: "workflow",
    primary: true,
  },
  make: {
    label: "Make",
    slug: "make",
    icon: "Puzzle",
    family: "workflow",
    primary: false,
  },
  obsidian: {
    label: "Obsidian",
    slug: "obsidian",
    icon: "BookOpen",
    family: "other",
    primary: false,
  },
  custom: {
    label: "Custom",
    slug: "custom",
    icon: "Box",
    family: "other",
    primary: false,
  },
};

export const ENVIRONMENT_ORDER: Environment[] = [
  "claude-code",
  "claude-desktop",
  "cursor",
  "windsurf",
  "cline",
  "continue",
  "zed",
  "codex",
  "chatgpt",
  "gemini-cli",
  "aider",
  "copilot",
  "n8n",
  "make",
  "obsidian",
  "custom",
];

export const PRIMARY_ENVIRONMENTS: Environment[] = ENVIRONMENT_ORDER.filter(
  (e) => ENVIRONMENT_META[e].primary,
);

export const ENVIRONMENT_FAMILIES: Record<EnvironmentFamily, Environment[]> = {
  claude: ENVIRONMENT_ORDER.filter((e) => ENVIRONMENT_META[e].family === "claude"),
  editor: ENVIRONMENT_ORDER.filter((e) => ENVIRONMENT_META[e].family === "editor"),
  agent: ENVIRONMENT_ORDER.filter((e) => ENVIRONMENT_META[e].family === "agent"),
  workflow: ENVIRONMENT_ORDER.filter((e) => ENVIRONMENT_META[e].family === "workflow"),
  other: ENVIRONMENT_ORDER.filter((e) => ENVIRONMENT_META[e].family === "other"),
};

export function environmentFromSlug(slug: string): Environment | null {
  const entry = Object.entries(ENVIRONMENT_META).find(
    ([, meta]) => meta.slug === slug,
  );
  return entry ? (entry[0] as Environment) : null;
}
