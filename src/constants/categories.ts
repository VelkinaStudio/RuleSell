import type { Category } from "@/types";

export interface CategoryMeta {
  label: string;
  slug: string;
  /** Hex accent from spec Appendix A. */
  color: string;
  /** Tailwind color family — used to derive utilities. */
  accent: string;
  /** lucide-react icon name. */
  icon: string;
  description: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  RULES: {
    label: "Rules",
    slug: "rules",
    color: "#3b82f6",
    accent: "blue",
    icon: "Ruler",
    description: "Context files, style guides, and coding rules for AI editors.",
  },
  MCP_SERVER: {
    label: "MCP Servers",
    slug: "mcp-servers",
    color: "#10b981",
    accent: "emerald",
    icon: "Server",
    description: "Model Context Protocol servers that extend AI capabilities.",
  },
  SKILL: {
    label: "Skills",
    slug: "skills",
    color: "#f59e0b",
    accent: "amber",
    icon: "Sparkles",
    description: "Packaged capabilities your assistant can invoke on demand.",
  },
  AGENT_TEAM: {
    label: "Agent Teams",
    slug: "agent-teams",
    color: "#8b5cf6",
    accent: "violet",
    icon: "Users",
    description: "Multi-agent crews, roles, and orchestration graphs.",
  },
  WORKFLOW: {
    label: "Workflows",
    slug: "workflows",
    color: "#f97316",
    accent: "orange",
    icon: "Workflow",
    description: "End-to-end automations for n8n, Make, and similar tools.",
  },
  PROMPT: {
    label: "Prompts",
    slug: "prompts",
    color: "#ec4899",
    accent: "pink",
    icon: "MessageSquare",
    description: "Hand-tuned system prompts and prompt libraries.",
  },
  CLI: {
    label: "CLIs",
    slug: "clis",
    color: "#06b6d4",
    accent: "cyan",
    icon: "Terminal",
    description: "Command-line utilities and AI-native shells.",
  },
  DATASET: {
    label: "Datasets",
    slug: "datasets",
    color: "#14b8a6",
    accent: "teal",
    icon: "Database",
    description: "Training, evaluation, and retrieval datasets.",
  },
  BUNDLE: {
    label: "Bundles",
    slug: "bundles",
    color: "#f43f5e",
    accent: "rose",
    icon: "Package",
    description: "Curated multi-item packs priced as a single drop.",
  },
};

export const CATEGORY_ORDER: Category[] = [
  "RULES",
  "MCP_SERVER",
  "SKILL",
  "AGENT_TEAM",
  "WORKFLOW",
  "PROMPT",
  "CLI",
  "DATASET",
  "BUNDLE",
];

export function categoryFromSlug(slug: string): Category | null {
  const entry = Object.entries(CATEGORY_META).find(
    ([, meta]) => meta.slug === slug,
  );
  return entry ? (entry[0] as Category) : null;
}
