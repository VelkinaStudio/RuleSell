import type { Poll } from "@/types";

const REF = new Date("2026-04-08T12:00:00Z").getTime();
function ts(daysAgo: number) {
  return new Date(REF - daysAgo * 86_400_000).toISOString();
}
function future(daysFromRef: number) {
  return new Date(REF + daysFromRef * 86_400_000).toISOString();
}

export const MOCK_POLLS: Poll[] = [
  {
    id: "poll-1",
    title: "Which AI coding environment is your primary tool?",
    description:
      "We want to understand the community's tool preferences to better prioritize environment support.",
    options: [
      { id: "p1-o1", text: "Cursor", voteCount: 87 },
      { id: "p1-o2", text: "Claude Code (CLI)", voteCount: 62 },
      { id: "p1-o3", text: "VS Code + Copilot", voteCount: 41 },
      { id: "p1-o4", text: "Windsurf", voteCount: 24 },
      { id: "p1-o5", text: "Zed", voteCount: 12 },
      { id: "p1-o6", text: "Other", voteCount: 8 },
    ],
    totalVotes: 234,
    author: { username: "alex-rivera", avatarUrl: null },
    createdAt: ts(3),
    endsAt: future(4),
    isActive: true,
    category: "RULES",
  },
  {
    id: "poll-2",
    title: "What category needs more content?",
    description:
      "Help us decide where to focus community curation efforts.",
    options: [
      { id: "p2-o1", text: "Rules", voteCount: 38 },
      { id: "p2-o2", text: "MCP Servers", voteCount: 52 },
      { id: "p2-o3", text: "Skills", voteCount: 29 },
      { id: "p2-o4", text: "Agent Teams", voteCount: 44 },
      { id: "p2-o5", text: "Workflows", voteCount: 21 },
      { id: "p2-o6", text: "Prompts", voteCount: 18 },
      { id: "p2-o7", text: "CLI Tools", voteCount: 11 },
      { id: "p2-o8", text: "Datasets", voteCount: 8 },
      { id: "p2-o9", text: "Bundles", voteCount: 14 },
    ],
    totalVotes: 235,
    author: { username: "yuki-tomoda", avatarUrl: null },
    createdAt: ts(7),
    endsAt: future(7),
    isActive: true,
    category: "MCP_SERVER",
  },
  {
    id: "poll-3",
    title: "Would you pay for verified MCP servers?",
    description:
      "Verified MCP servers would include security audits, uptime guarantees, and official support.",
    options: [
      { id: "p3-o1", text: "Yes", voteCount: 68 },
      { id: "p3-o2", text: "No", voteCount: 42 },
      { id: "p3-o3", text: "Maybe, depends on price", voteCount: 46 },
    ],
    totalVotes: 156,
    author: { username: "helena-costa", avatarUrl: null },
    createdAt: ts(5),
    endsAt: future(2),
    isActive: true,
  },
  {
    id: "poll-4",
    title: "How do you discover new AI configs?",
    description:
      "Understanding discovery channels helps us improve distribution.",
    options: [
      { id: "p4-o1", text: "Twitter/X", voteCount: 56 },
      { id: "p4-o2", text: "GitHub trending", voteCount: 78 },
      { id: "p4-o3", text: "Reddit", voteCount: 34 },
      { id: "p4-o4", text: "RuleSell marketplace", voteCount: 45 },
      { id: "p4-o5", text: "Word of mouth / team", voteCount: 29 },
    ],
    totalVotes: 242,
    author: { username: "samuel-adeyemi", avatarUrl: null },
    createdAt: ts(10),
    endsAt: ts(1),
    isActive: false,
  },
  {
    id: "poll-5",
    title: "Preferred license for open-source rulesets?",
    description: "Which license model makes you most comfortable sharing?",
    options: [
      { id: "p5-o1", text: "MIT", voteCount: 92 },
      { id: "p5-o2", text: "Apache 2.0", voteCount: 43 },
      { id: "p5-o3", text: "GPL v3", voteCount: 18 },
      { id: "p5-o4", text: "CC BY 4.0", voteCount: 27 },
      { id: "p5-o5", text: "No license / proprietary", voteCount: 14 },
    ],
    totalVotes: 194,
    author: { username: "finn-oconnor", avatarUrl: null },
    createdAt: ts(14),
    endsAt: ts(4),
    isActive: false,
    category: "RULES",
  },
  {
    id: "poll-6",
    title: "How many AI tools do you use daily?",
    description: "Gauging the multi-tool reality of AI-assisted development.",
    options: [
      { id: "p6-o1", text: "1 tool", voteCount: 22 },
      { id: "p6-o2", text: "2-3 tools", voteCount: 68 },
      { id: "p6-o3", text: "4-5 tools", voteCount: 41 },
      { id: "p6-o4", text: "6+ tools", voteCount: 15 },
    ],
    totalVotes: 146,
    author: { username: "priya-menon", avatarUrl: null },
    createdAt: ts(2),
    endsAt: future(5),
    isActive: true,
    category: "AGENT_TEAM",
  },
  {
    id: "poll-7",
    title: "Should RuleSell support team-managed rulesets?",
    description:
      "Team features like shared editing, role-based access, and org billing.",
    options: [
      { id: "p7-o1", text: "Essential", voteCount: 84 },
      { id: "p7-o2", text: "Nice to have", voteCount: 52 },
      { id: "p7-o3", text: "Not needed", voteCount: 11 },
    ],
    totalVotes: 147,
    author: { username: "daniel-ohta", avatarUrl: null },
    createdAt: ts(8),
    endsAt: ts(2),
    isActive: false,
  },
  {
    id: "poll-8",
    title: "Best format for sharing AI prompts?",
    description: "Choosing a standard for prompt interchange.",
    options: [
      { id: "p8-o1", text: "Plain text / Markdown", voteCount: 71 },
      { id: "p8-o2", text: "JSON with metadata", voteCount: 48 },
      { id: "p8-o3", text: "YAML", voteCount: 23 },
      { id: "p8-o4", text: "Custom DSL", voteCount: 9 },
    ],
    totalVotes: 151,
    author: { username: "marc-beaulieu", avatarUrl: null },
    createdAt: ts(6),
    endsAt: future(1),
    isActive: true,
  },
  {
    id: "poll-9",
    title: "How often do you update your AI configs?",
    description: "Understanding update frequency for freshness scoring.",
    options: [
      { id: "p9-o1", text: "Weekly", voteCount: 34 },
      { id: "p9-o2", text: "Monthly", voteCount: 56 },
      { id: "p9-o3", text: "Quarterly", voteCount: 28 },
      { id: "p9-o4", text: "Rarely / never", voteCount: 19 },
    ],
    totalVotes: 137,
    author: { username: "claire-dubois", avatarUrl: null },
    createdAt: ts(12),
    endsAt: ts(5),
    isActive: false,
  },
  {
    id: "poll-10",
    title: "Would you attend a live RuleSell community event?",
    description: "Gauging interest in virtual meetups and workshops.",
    options: [
      { id: "p10-o1", text: "Yes, definitely", voteCount: 62 },
      { id: "p10-o2", text: "Maybe, if the topic is right", voteCount: 45 },
      { id: "p10-o3", text: "No, prefer async", voteCount: 21 },
    ],
    totalVotes: 128,
    author: { username: "ravi-prasad", avatarUrl: null },
    createdAt: ts(1),
    endsAt: future(6),
    isActive: true,
    category: "BUNDLE",
  },
];
