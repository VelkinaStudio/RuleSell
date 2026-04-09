import type { Showcase } from "@/types";
import { MOCK_USERS_BY_USERNAME } from "./mock-users";

function author(u: string) {
  const x = MOCK_USERS_BY_USERNAME[u];
  if (x) return { username: x.username, avatar: x.avatar, reputation: x.reputation, creatorMarks: x.creatorMarks, level: x.level };
  return { username: u, avatar: null, reputation: 10, creatorMarks: [] as never[], level: "MEMBER" as const };
}

export const MOCK_SHOWCASES: Showcase[] = [
  {
    id: "showcase-1",
    title: "Automated PR review pipeline with Claude Code",
    description: "Full CI pipeline: push to GitHub, Claude reads the diff via GitHub MCP, posts review comments, triggers fixes, re-reviews. Handles 50+ PRs/week across 3 repos.",
    author: author("samuel-adeyemi"),
    rulesetIds: ["rs-8", "rs-6", "rs-4"],
    reactionCount: 142,
    createdAt: "2026-04-05T10:00:00Z",
  },
  {
    id: "showcase-2",
    title: "Figma-to-production in 20 minutes",
    description: "Design in Figma, Figma MCP reads frames, Claude generates Tailwind components, Playwright MCP verifies the render. The fastest design-to-production loop I have found.",
    author: author("noa-bar-lev"),
    rulesetIds: ["rs-9", "rs-7", "rs-1"],
    reactionCount: 98,
    createdAt: "2026-04-03T14:00:00Z",
  },
  {
    id: "showcase-3",
    title: "n8n + Claude for customer support triage",
    description: "Incoming support tickets via webhook, classified by Claude, routed to the right team in Linear, response drafted. Cut response time from 4h to 12m.",
    author: author("helena-costa"),
    rulesetIds: ["rs-10", "rs-6"],
    reactionCount: 76,
    createdAt: "2026-04-01T08:00:00Z",
  },
  {
    id: "showcase-4",
    title: "TDD-first Rust development with Cursor",
    description: "Using TDD skill + Cursor rules for a Rust CLI. Claude writes failing tests, implements until green, then refactors. 94% of generated code passes on first run.",
    author: author("finn-oconnor"),
    rulesetIds: ["rs-4", "rs-1", "rs-3"],
    reactionCount: 64,
    createdAt: "2026-03-28T16:00:00Z",
  },
];
