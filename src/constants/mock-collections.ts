import type { Collection } from "@/types";

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    slug: "mcp-starter-pack",
    title: "MCP Starter Pack",
    description:
      "The five MCP servers that should ship in every fresh Claude Code install.",
    curatedBy: "claire-dubois",
    rulesetIds: ["rs-6", "rs-7", "rs-8", "rs-9", "rs-21", "rs-23"],
    itemCount: 6,
    followerCount: 1_840,
  },
  {
    id: "col-2",
    slug: "cursor-power-tools",
    title: "Cursor Power Tools",
    description:
      "A curated set of rules and MCP servers that turn Cursor into a serious daily driver.",
    curatedBy: "samuel-adeyemi",
    rulesetIds: ["rs-1", "rs-2", "rs-3", "rs-9", "rs-31", "rs-40", "rs-44", "rs-48", "rs-59"],
    itemCount: 9,
    followerCount: 2_412,
  },
  {
    id: "col-3",
    slug: "agent-team-builder",
    title: "Agent Team Builder",
    description:
      "Multi-agent crews and the skills you need to wire them together.",
    curatedBy: "yuki-tomoda",
    rulesetIds: ["rs-18", "rs-19", "rs-26", "rs-37", "rs-39", "rs-53"],
    itemCount: 6,
    followerCount: 980,
  },
  {
    id: "col-4",
    slug: "n8n-automation-bundle",
    title: "n8n Automation Bundle",
    description:
      "Workflows, skills, and starter blueprints for n8n.",
    curatedBy: "claire-dubois",
    rulesetIds: ["rs-10", "rs-11", "rs-17", "rs-35", "rs-42"],
    itemCount: 5,
    followerCount: 1_240,
  },
  {
    id: "col-5",
    slug: "claude-code-essentials",
    title: "Claude Code Essentials",
    description:
      "The essential set for everyone using Claude Code daily.",
    curatedBy: "anthropic-skills",
    rulesetIds: ["rs-6", "rs-16", "rs-26", "rs-27", "rs-28", "rs-29", "rs-41", "rs-43", "rs-46"],
    itemCount: 9,
    followerCount: 4_120,
  },
  {
    id: "col-6",
    slug: "security-first-workflows",
    title: "Security-First Workflows",
    description:
      "Audit, review, and verify AI-generated code with these security-tuned items.",
    curatedBy: "samuel-adeyemi",
    rulesetIds: ["rs-29", "rs-51", "rs-23"],
    itemCount: 3,
    followerCount: 612,
  },
  {
    id: "col-7",
    slug: "new-this-month",
    title: "New This Month",
    description:
      "Everything published in the last 30 days that we have already tested.",
    curatedBy: "claire-dubois",
    rulesetIds: ["rs-25", "rs-28", "rs-32", "rs-35", "rs-55", "rs-56", "rs-57", "rs-60"],
    itemCount: 8,
    followerCount: 1_840,
  },
  {
    id: "col-8",
    slug: "editors-picks",
    title: "Editor's Picks",
    description:
      "The items the RuleSell editorial team currently recommends as the best in their category.",
    curatedBy: "yuki-tomoda",
    rulesetIds: ["rs-1", "rs-6", "rs-13", "rs-15", "rs-27", "rs-29", "rs-40", "rs-43"],
    itemCount: 8,
    followerCount: 3_412,
  },
];

export const MOCK_COLLECTIONS_BY_SLUG: Record<string, Collection> = Object.fromEntries(
  MOCK_COLLECTIONS.map((c) => [c.slug, c]),
);
