import type { Team } from "@/types";

export const MOCK_TEAMS: Team[] = [
  {
    slug: "anthropic-skills",
    name: "Anthropic Skills",
    description:
      "Official Claude skills, cookbooks, and reference MCP servers maintained by the Anthropic applied team.",
    avatar: null,
    verified: true,
    memberCount: 6,
    members: [
      { username: "anthropic-skills", role: "owner" },
      { username: "claire-dubois", role: "admin" },
      { username: "samuel-adeyemi", role: "member" },
      { username: "priya-menon", role: "member" },
      { username: "yuki-tomoda", role: "member" },
      { username: "alex-rivera", role: "member" },
    ],
    rulesetCount: 8,
    totalEarnings: 1_420_000,
  },
  {
    slug: "modelcontext-labs",
    name: "Modelcontext Labs",
    description:
      "Open-source lab shipping high-quality MCP servers for databases, infra, and automation.",
    avatar: null,
    verified: true,
    memberCount: 5,
    members: [
      { username: "helena-costa", role: "owner" },
      { username: "ravi-prasad", role: "admin" },
      { username: "marc-beaulieu", role: "member" },
      { username: "finn-oconnor", role: "member" },
      { username: "emeka-chukwu", role: "member" },
    ],
    rulesetCount: 6,
    totalEarnings: 248_500,
  },
  {
    slug: "windsurf-collective",
    name: "Windsurf Collective",
    description:
      "Community crew building enterprise-ready Cursor and Windsurf rule bundles.",
    avatar: null,
    verified: true,
    memberCount: 4,
    members: [
      { username: "windsurf-collective", role: "owner" },
      { username: "noa-bar-lev", role: "admin" },
      { username: "daniel-ohta", role: "member" },
      { username: "lukas-weber", role: "member" },
    ],
    rulesetCount: 5,
    totalEarnings: 742_000,
  },
  {
    slug: "n8n-community-hub",
    name: "n8n Community Hub",
    description:
      "Curators and automators behind the largest verified n8n workflow catalog.",
    avatar: null,
    verified: true,
    memberCount: 3,
    members: [
      { username: "ege-koc", role: "owner" },
      { username: "sara-kowalski", role: "member" },
      { username: "zehra-aydin", role: "member" },
    ],
    rulesetCount: 4,
    totalEarnings: 52_800,
  },
  {
    slug: "rulesell-official",
    name: "RuleSell Official",
    description:
      "First-party RuleSell packs — bundles, starter kits, and internal tooling.",
    avatar: null,
    verified: true,
    memberCount: 3,
    members: [
      { username: "claire-dubois", role: "owner" },
      { username: "samuel-adeyemi", role: "admin" },
      { username: "yuki-tomoda", role: "member" },
    ],
    rulesetCount: 4,
    totalEarnings: 131_650,
  },
];

export const MOCK_TEAMS_BY_SLUG: Record<string, Team> = Object.fromEntries(
  MOCK_TEAMS.map((t) => [t.slug, t]),
);
