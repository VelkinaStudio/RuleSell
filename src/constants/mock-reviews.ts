import type { Environment, Review } from "@/types";

import { MOCK_RULESETS } from "./mock-data";
import { MOCK_USERS_BY_USERNAME } from "./mock-users";

// 40 reviews total. Authored only by certified devs and verified team members
// (per spec — verified-install reviews only).

const REVIEWER_USERNAMES = [
  "yuki-tomoda",
  "claire-dubois",
  "samuel-adeyemi",
  "anthropic-skills",
  "windsurf-collective",
];

interface ReviewSeed {
  rulesetId: string;
  reviewerIndex: number;
  rating: number;
  title: string;
  body: string;
  environmentTested: Environment;
  helpfulCount: number;
  daysAgo: number;
}

const SEEDS: ReviewSeed[] = [
  // Top items get the densest review coverage.
  { rulesetId: "rs-1", reviewerIndex: 0, rating: 5, title: "Indispensable for any Cursor user", body: "I drop these into every new project. The TypeScript and React subsets alone are worth the install. Saves a full afternoon of writing rules from scratch.", environmentTested: "cursor", helpfulCount: 84, daysAgo: 12 },
  { rulesetId: "rs-1", reviewerIndex: 1, rating: 5, title: "Best starting point for the .cursorrules file", body: "Pick a stack, copy the file, edit two lines for your project. Done. The structure makes it easy to compose multiple rulesets.", environmentTested: "cursor", helpfulCount: 62, daysAgo: 18 },
  { rulesetId: "rs-1", reviewerIndex: 2, rating: 4, title: "Strong baseline, weaker on edge cases", body: "The core is excellent. Some of the niche framework rulesets are stale and reference old library APIs. Worth reading and editing rather than copy-pasting blindly.", environmentTested: "cursor", helpfulCount: 41, daysAgo: 22 },

  { rulesetId: "rs-6", reviewerIndex: 3, rating: 5, title: "The reference implementation", body: "If you are evaluating MCP servers, start here. The filesystem and GitHub servers are the cleanest schemas in the ecosystem.", environmentTested: "claude-code", helpfulCount: 142, daysAgo: 8 },
  { rulesetId: "rs-6", reviewerIndex: 0, rating: 5, title: "Battle-tested for daily work", body: "I run the Postgres + GitHub combo every day. Rock-solid for months.", environmentTested: "claude-code", helpfulCount: 96, daysAgo: 14 },
  { rulesetId: "rs-6", reviewerIndex: 2, rating: 5, title: "What every other server is benchmarked against", body: "The token efficiency is the highest in the catalog and the schema is the cleanest. Use these as your reference when building your own.", environmentTested: "claude-desktop", helpfulCount: 78, daysAgo: 20 },

  { rulesetId: "rs-7", reviewerIndex: 1, rating: 5, title: "Browser automation that actually works", body: "Click, type, screenshot, scrape — exactly as advertised. Microsoft has clearly tested this against real-world flows.", environmentTested: "claude-code", helpfulCount: 88, daysAgo: 11 },
  { rulesetId: "rs-7", reviewerIndex: 4, rating: 4, title: "Solid, watch the timeouts", body: "Defaults are aggressive on timeouts for slow pages. Bump them and it sings.", environmentTested: "cursor", helpfulCount: 24, daysAgo: 16 },

  { rulesetId: "rs-8", reviewerIndex: 0, rating: 5, title: "GitHub finally has a first-party MCP", body: "Same auth surface as the gh CLI. Drop-in for any GitHub workflow.", environmentTested: "claude-code", helpfulCount: 64, daysAgo: 9 },
  { rulesetId: "rs-8", reviewerIndex: 3, rating: 5, title: "PR review automation made trivial", body: "I have Claude reading and commenting on diffs across three repos. The MCP shape makes this straightforward.", environmentTested: "claude-code", helpfulCount: 52, daysAgo: 13 },

  { rulesetId: "rs-9", reviewerIndex: 1, rating: 4, title: "Saves a screenshot loop", body: "Stop pasting Figma screenshots into chat. The structured frame data is much higher quality context.", environmentTested: "cursor", helpfulCount: 32, daysAgo: 17 },

  { rulesetId: "rs-10", reviewerIndex: 4, rating: 5, title: "Best curation in the n8n catalog", body: "Every blueprint I have tried is production-ready. The curation is the value.", environmentTested: "n8n", helpfulCount: 48, daysAgo: 14 },

  { rulesetId: "rs-13", reviewerIndex: 2, rating: 4, title: "The OG prompt library", body: "Some entries feel dated but the general patterns are still useful.", environmentTested: "chatgpt", helpfulCount: 86, daysAgo: 19 },

  { rulesetId: "rs-15", reviewerIndex: 0, rating: 5, title: "The reference, period", body: "If you are new to prompt engineering, read this end to end. Everything else online builds on it.", environmentTested: "chatgpt", helpfulCount: 104, daysAgo: 10 },

  { rulesetId: "rs-20", reviewerIndex: 3, rating: 5, title: "Worth the price", body: "I bought it because of the curation. Saved me a week of trial and error picking individual items.", environmentTested: "cursor", helpfulCount: 22, daysAgo: 7 },

  { rulesetId: "rs-23", reviewerIndex: 0, rating: 5, title: "Terraform with audit logging", body: "Plan and apply gates are exactly what we needed for our compliance requirements.", environmentTested: "claude-code", helpfulCount: 28, daysAgo: 12 },

  { rulesetId: "rs-27", reviewerIndex: 2, rating: 5, title: "Hooks reference I send to every new teammate", body: "The gotchas section saved me twice this month. Bookmark it.", environmentTested: "claude-code", helpfulCount: 36, daysAgo: 9 },

  { rulesetId: "rs-29", reviewerIndex: 1, rating: 5, title: "Real security skills", body: "These are the skills I send to my security team when they ask 'how should we audit AI-generated code'. Excellent quality.", environmentTested: "claude-code", helpfulCount: 56, daysAgo: 11 },

  { rulesetId: "rs-36", reviewerIndex: 0, rating: 5, title: "The Postgres MCP I have been waiting for", body: "Multi-tenant pooling and audit logging matter when you have to share an MCP across a team. Worth every cent.", environmentTested: "claude-code", helpfulCount: 38, daysAgo: 6 },
  { rulesetId: "rs-36", reviewerIndex: 4, rating: 5, title: "Drop-in for our compliance setup", body: "Row-level filters mean junior engineers can use it without seeing PII. Great design.", environmentTested: "cursor", helpfulCount: 24, daysAgo: 9 },

  { rulesetId: "rs-37", reviewerIndex: 2, rating: 4, title: "Three-reviewer pattern is worth copying", body: "Even if you do not use the crew directly, the pattern of splitting review across three specialists is smart.", environmentTested: "claude-code", helpfulCount: 18, daysAgo: 14 },

  { rulesetId: "rs-40", reviewerIndex: 0, rating: 5, title: "Forces the discipline I was lacking", body: "I was skipping the spec phase. These rules block me from coding until I have one. Productivity went up.", environmentTested: "cursor", helpfulCount: 42, daysAgo: 11 },

  { rulesetId: "rs-41", reviewerIndex: 3, rating: 5, title: "The skills land monthly without re-buying", body: "Subscription pricing makes sense for a curated bundle. Saves the 'is there a new version' loop.", environmentTested: "claude-code", helpfulCount: 28, daysAgo: 8 },

  { rulesetId: "rs-43", reviewerIndex: 4, rating: 5, title: "Best onboarding bundle for Claude Code", body: "I send this to every new engineer who joins our team. Zero to productive in a sitting.", environmentTested: "claude-code", helpfulCount: 32, daysAgo: 9 },
  { rulesetId: "rs-43", reviewerIndex: 1, rating: 5, title: "Six items, one purchase, one config", body: "The grouping makes installation linear instead of a scavenger hunt.", environmentTested: "claude-code", helpfulCount: 24, daysAgo: 12 },

  { rulesetId: "rs-44", reviewerIndex: 0, rating: 5, title: "Cursor's missing onboarding", body: "Cursor ships with no defaults. This bundle fills the gap.", environmentTested: "cursor", helpfulCount: 26, daysAgo: 11 },

  { rulesetId: "rs-45", reviewerIndex: 2, rating: 5, title: "The maintained Windsurf rules", body: "If you are on Windsurf, these are the rules to start from.", environmentTested: "windsurf", helpfulCount: 38, daysAgo: 10 },

  { rulesetId: "rs-46", reviewerIndex: 1, rating: 5, title: "Practical, runnable, current", body: "The cookbooks are the right mix of theory and runnable example. Anthropic keeps them updated.", environmentTested: "claude-code", helpfulCount: 64, daysAgo: 12 },

  { rulesetId: "rs-47", reviewerIndex: 0, rating: 4, title: "Codex finally documents itself", body: "The reference is overdue but appreciated. A few config options still missing.", environmentTested: "codex", helpfulCount: 18, daysAgo: 14 },

  { rulesetId: "rs-50", reviewerIndex: 3, rating: 5, title: "Useful for benchmarking model upgrades", body: "Ran our team through the full set when we evaluated a model swap. Clear winner emerged.", environmentTested: "claude-code", helpfulCount: 12, daysAgo: 8 },

  { rulesetId: "rs-51", reviewerIndex: 1, rating: 4, title: "Catches the obvious things", body: "Pinned to our pre-merge CI. Catches the obvious patterns. Worth the price.", environmentTested: "chatgpt", helpfulCount: 16, daysAgo: 11 },

  { rulesetId: "rs-29", reviewerIndex: 4, rating: 5, title: "Trail of Bits has earned the trust", body: "If they put their name on it, I install it. The skills are exactly what you would expect from their team.", environmentTested: "claude-code", helpfulCount: 38, daysAgo: 14 },

  { rulesetId: "rs-2", reviewerIndex: 0, rating: 5, title: "The agentic loop changes the workflow", body: "Cursor stops one-shotting and starts planning. Slow at first, much better outputs.", environmentTested: "cursor", helpfulCount: 28, daysAgo: 16 },

  { rulesetId: "rs-3", reviewerIndex: 1, rating: 4, title: "Five modes feel restrictive at first", body: "After a week the constraints became helpful. Worth committing to it for at least a few sessions before judging.", environmentTested: "cursor", helpfulCount: 22, daysAgo: 18 },

  { rulesetId: "rs-21", reviewerIndex: 2, rating: 4, title: "Multi-driver MCP that works", body: "We use it across Postgres and DuckDB without changing config. Saves a config file per project.", environmentTested: "claude-code", helpfulCount: 16, daysAgo: 13 },

  { rulesetId: "rs-22", reviewerIndex: 0, rating: 4, title: "kubectl in MCP form", body: "Useful for inspecting cluster state without tab-switching. Approval gates would be nice.", environmentTested: "claude-code", helpfulCount: 14, daysAgo: 15 },

  { rulesetId: "rs-26", reviewerIndex: 3, rating: 5, title: "Background work without losing context", body: "Drops a checkpoint commit every change. Catastrophic-failure recovery has been smooth.", environmentTested: "claude-code", helpfulCount: 24, daysAgo: 11 },

  { rulesetId: "rs-38", reviewerIndex: 4, rating: 4, title: "One MCP, every framework", body: "Detects pytest, vitest, go test, cargo test. Saves framework-aware prompting.", environmentTested: "claude-code", helpfulCount: 12, daysAgo: 14 },

  { rulesetId: "rs-39", reviewerIndex: 1, rating: 4, title: "Three specialists, fewer hallucinations", body: "Splitting browser tasks across three agents reduced incorrect-element-clicked errors significantly.", environmentTested: "claude-code", helpfulCount: 8, daysAgo: 17 },

  { rulesetId: "rs-58", reviewerIndex: 2, rating: 5, title: "RAG benchmarks I trust", body: "The dataset is well-curated and the retriever benchmarks are reproducible. Highly recommended.", environmentTested: "custom", helpfulCount: 16, daysAgo: 9 },

  { rulesetId: "rs-60", reviewerIndex: 0, rating: 5, title: "The CLI saves the install dance", body: "One command to install a bundle. Was overdue.", environmentTested: "claude-code", helpfulCount: 14, daysAgo: 6 },
];

function dateNDaysAgo(days: number): string {
  const now = new Date("2026-04-08T12:00:00Z").getTime();
  return new Date(now - days * 86_400_000).toISOString();
}

export const MOCK_REVIEWS: Review[] = SEEDS.map((seed, i): Review => {
  const reviewerUsername = REVIEWER_USERNAMES[seed.reviewerIndex] ?? REVIEWER_USERNAMES[0];
  const reviewer = MOCK_USERS_BY_USERNAME[reviewerUsername];
  const ruleset = MOCK_RULESETS.find((r) => r.id === seed.rulesetId);
  if (!reviewer) throw new Error(`mock-reviews: missing reviewer ${reviewerUsername}`);
  if (!ruleset) throw new Error(`mock-reviews: missing ruleset ${seed.rulesetId}`);
  return {
    id: `review-${i + 1}`,
    rulesetId: seed.rulesetId,
    author: {
      username: reviewer.username,
      avatar: reviewer.avatar,
      reputation: reviewer.reputation,
      creatorMarks: reviewer.creatorMarks,
      level: reviewer.level,
    },
    rating: seed.rating,
    title: seed.title,
    body: seed.body,
    verifiedInstall: true,
    environmentTested: seed.environmentTested,
    helpfulCount: seed.helpfulCount,
    currentUserMarkedHelpful: false,
    createdAt: dateNDaysAgo(seed.daysAgo),
    updatedAt: dateNDaysAgo(seed.daysAgo),
  };
});

export const MOCK_REVIEWS_BY_RULESET: Record<string, Review[]> = MOCK_REVIEWS.reduce(
  (acc, review) => {
    acc[review.rulesetId] = acc[review.rulesetId] ?? [];
    acc[review.rulesetId].push(review);
    return acc;
  },
  {} as Record<string, Review[]>,
);
