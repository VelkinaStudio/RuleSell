/**
 * Seed script — creates mockup data for local testing.
 * Run: npx tsx prisma/seed.ts
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ── Users ──────────────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 10);

  const alice = await db.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      passwordHash,
      name: "Alice Chen",
      username: "alicechen",
      bio: "Full-stack developer. Building AI tools that actually work.",
      role: "PRO",
      sellerStatus: "ACTIVE",
      emailVerified: new Date(),
    },
  });

  const bob = await db.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      passwordHash,
      name: "Bob Martinez",
      username: "bobdev",
      bio: "DevOps engineer. Automation enthusiast.",
      role: "USER",
      sellerStatus: "ACTIVE",
      emailVerified: new Date(),
    },
  });

  const carol = await db.user.upsert({
    where: { email: "carol@example.com" },
    update: {},
    create: {
      email: "carol@example.com",
      passwordHash,
      name: "Carol Wang",
      username: "carolwang",
      bio: "AI researcher & prompt engineer. Making LLMs behave.",
      role: "USER",
      sellerStatus: "ACTIVE",
      emailVerified: new Date(),
    },
  });

  const admin = await db.user.upsert({
    where: { email: "admin@ruleset.ai" },
    update: {},
    create: {
      email: "admin@ruleset.ai",
      passwordHash,
      name: "Admin",
      username: "admin",
      bio: "Platform administrator",
      role: "ADMIN",
      sellerStatus: "NONE",
      emailVerified: new Date(),
    },
  });

  const dave = await db.user.upsert({
    where: { email: "dave@example.com" },
    update: {},
    create: {
      email: "dave@example.com",
      passwordHash,
      name: "Dave Kim",
      username: "davekim",
      bio: "n8n power user. Workflow automation consultant.",
      role: "USER",
      sellerStatus: "ACTIVE",
      emailVerified: new Date(),
    },
  });

  console.log(`Created users: ${alice.username}, ${bob.username}, ${carol.username}, ${admin.username}, ${dave.username}`);

  // ── Tags ───────────────────────────────────────────
  const tagNames = [
    "architecture", "security", "refactoring", "testing", "api-design",
    "typescript", "python", "automation", "code-review", "devops",
    "react", "nextjs", "database", "performance", "ai-agents",
  ];

  const tags: Record<string, { id: string }> = {};
  for (const name of tagNames) {
    const tag = await db.tag.upsert({
      where: { name },
      update: {},
      create: { name, usageCount: 0 },
    });
    tags[name] = tag;
  }

  console.log(`Created ${tagNames.length} tags`);

  // ── Rulesets ───────────────────────────────────────
  const rulesets = [
    {
      title: "Senior Engineer Cursor Rules",
      slug: "senior-engineer-cursor-rules",
      description: "Production-grade Cursor rules used by senior engineers at top tech companies. Covers architecture decisions, code review standards, testing strategies, and security best practices. Battle-tested across 50+ production codebases.",
      previewContent: "# Senior Engineer Rules\n\n## Architecture\n- Always prefer composition over inheritance\n- Use dependency injection for testability\n- Keep modules under 300 lines\n- Every public API needs error handling\n\n## Code Review\n- Focus on correctness first, style second\n- Check for race conditions in async code\n...",
      type: "RULESET" as const,
      platform: "CURSOR" as const,
      category: "architecture",
      price: 12.99,
      authorId: alice.id,
      status: "PUBLISHED" as const,
      downloadCount: 342,
      viewCount: 2891,
      purchaseCount: 87,
      avgRating: 4.7,
      ratingCount: 23,
      trendingScore: 45.2,
      tagNames: ["architecture", "code-review", "security"],
    },
    {
      title: "TypeScript Strict Mode System Prompt",
      slug: "typescript-strict-mode-prompt",
      description: "A comprehensive system prompt that enforces TypeScript strict mode patterns. Prevents common type errors, ensures proper null handling, and generates clean, type-safe code. Works with Claude, ChatGPT, and Gemini.",
      previewContent: "You are a TypeScript expert working in strict mode.\n\nRules:\n1. Never use `any` — use `unknown` + type guards\n2. Always handle null/undefined explicitly\n3. Use discriminated unions over optional fields\n4. Prefer `readonly` arrays and objects\n...",
      type: "PROMPT" as const,
      platform: "CLAUDE" as const,
      category: "typescript",
      price: 0,
      authorId: carol.id,
      status: "PUBLISHED" as const,
      downloadCount: 1203,
      viewCount: 5432,
      purchaseCount: 0,
      avgRating: 4.9,
      ratingCount: 45,
      trendingScore: 78.5,
      tagNames: ["typescript", "code-review"],
    },
    {
      title: "n8n Lead Scoring Workflow",
      slug: "n8n-lead-scoring-workflow",
      description: "Automated lead scoring workflow for n8n. Connects to your CRM, enriches leads with clearbit data, scores based on custom criteria, and routes hot leads to Slack. Includes setup guide and customization instructions.",
      previewContent: "# Lead Scoring Workflow\n\n## Nodes:\n1. Webhook Trigger (new lead)\n2. HTTP Request (Clearbit enrichment)\n3. Function (scoring logic)\n4. IF (score threshold)\n5. Slack (hot lead notification)\n6. CRM Update (score + metadata)\n...",
      type: "WORKFLOW" as const,
      platform: "N8N" as const,
      category: "automation",
      price: 24.99,
      authorId: dave.id,
      status: "PUBLISHED" as const,
      downloadCount: 156,
      viewCount: 1230,
      purchaseCount: 42,
      avgRating: 4.5,
      ratingCount: 12,
      trendingScore: 32.1,
      tagNames: ["automation", "devops"],
    },
    {
      title: "React Component Architecture Rules",
      slug: "react-component-architecture",
      description: "Opinionated Cursor rules for building scalable React applications. Covers component composition, state management patterns, performance optimization, and testing strategies. Based on patterns from large-scale React apps.",
      previewContent: "# React Architecture Rules\n\n## Component Design\n- Max 200 lines per component\n- Extract hooks when logic > 20 lines\n- Prefer server components by default\n- Use 'use client' only when needed\n\n## State Management\n- URL state > local state > global state\n...",
      type: "RULESET" as const,
      platform: "CURSOR" as const,
      category: "architecture",
      price: 9.99,
      authorId: alice.id,
      status: "PUBLISHED" as const,
      downloadCount: 567,
      viewCount: 3210,
      purchaseCount: 134,
      avgRating: 4.8,
      ratingCount: 38,
      trendingScore: 62.3,
      tagNames: ["react", "nextjs", "architecture"],
    },
    {
      title: "Security Audit Agent Blueprint",
      slug: "security-audit-agent",
      description: "An AI agent blueprint for automated security auditing. Scans codebases for OWASP Top 10 vulnerabilities, generates reports with severity ratings, and suggests fixes. Designed for CI/CD integration.",
      previewContent: "# Security Audit Agent\n\n## Capabilities\n- SQL injection detection\n- XSS vulnerability scanning\n- Authentication bypass checks\n- Dependency vulnerability audit\n- Secrets in code detection\n\n## Configuration\n```yaml\nscan:\n  depth: full\n  exclude: [node_modules, .git]\n...",
      type: "AGENT" as const,
      platform: "CLAUDE" as const,
      category: "security",
      price: 49.99,
      authorId: bob.id,
      status: "PUBLISHED" as const,
      downloadCount: 89,
      viewCount: 876,
      purchaseCount: 28,
      avgRating: 4.6,
      ratingCount: 9,
      trendingScore: 28.7,
      tagNames: ["security", "ai-agents", "devops"],
    },
    {
      title: "Python Code Review Prompt",
      slug: "python-code-review-prompt",
      description: "Detailed system prompt for AI-powered Python code reviews. Catches bugs, performance issues, security vulnerabilities, and style violations. Outputs structured feedback with severity levels.",
      previewContent: "You are a senior Python code reviewer.\n\nFor each code submission, analyze:\n1. Correctness: Logic errors, edge cases, race conditions\n2. Performance: O(n) complexity, unnecessary copies, blocking calls\n3. Security: Input validation, SQL injection, path traversal\n...",
      type: "PROMPT" as const,
      platform: "CHATGPT" as const,
      category: "code-review",
      price: 0,
      authorId: carol.id,
      status: "PUBLISHED" as const,
      downloadCount: 892,
      viewCount: 4321,
      purchaseCount: 0,
      avgRating: 4.4,
      ratingCount: 31,
      trendingScore: 55.0,
      tagNames: ["python", "code-review", "testing"],
    },
    {
      title: "API Design Best Practices Rules",
      slug: "api-design-best-practices",
      description: "Comprehensive rules for designing RESTful APIs. Covers naming conventions, error handling, pagination, versioning, rate limiting, and documentation. Used by teams building production APIs.",
      previewContent: "# API Design Rules\n\n## URL Structure\n- Use nouns, not verbs: /users not /getUsers\n- Plural resources: /users not /user\n- Nested max 2 levels: /users/:id/posts\n- Query params for filtering: ?status=active\n\n## Response Format\n- Always wrap in { data, error, pagination }\n...",
      type: "RULESET" as const,
      platform: "VSCODE" as const,
      category: "api-design",
      price: 7.99,
      authorId: bob.id,
      status: "PUBLISHED" as const,
      downloadCount: 423,
      viewCount: 2100,
      purchaseCount: 95,
      avgRating: 4.3,
      ratingCount: 19,
      trendingScore: 38.9,
      tagNames: ["api-design", "architecture", "typescript"],
    },
    {
      title: "Database Optimization Checklist",
      slug: "database-optimization-checklist",
      description: "Step-by-step checklist for optimizing PostgreSQL performance. Covers indexing strategies, query optimization, connection pooling, vacuum tuning, and monitoring setup. Includes before/after benchmarks.",
      previewContent: "# Database Optimization Checklist\n\n## Indexing\n- [ ] Identify slow queries (pg_stat_statements)\n- [ ] Add indexes on FK columns\n- [ ] Use partial indexes for filtered queries\n- [ ] Consider covering indexes\n- [ ] Remove unused indexes\n...",
      type: "RULESET" as const,
      platform: "OTHER" as const,
      category: "database",
      price: 14.99,
      authorId: alice.id,
      status: "PUBLISHED" as const,
      downloadCount: 234,
      viewCount: 1567,
      purchaseCount: 56,
      avgRating: 4.9,
      ratingCount: 15,
      trendingScore: 25.4,
      tagNames: ["database", "performance", "devops"],
    },
    {
      title: "Obsidian AI Research Vault Template",
      slug: "obsidian-ai-research-vault",
      description: "A complete Obsidian vault template for AI researchers. Includes templates for paper notes, experiment tracking, literature reviews, and weekly summaries. Integrates with Zotero and supports backlinks.",
      previewContent: "# AI Research Vault\n\n## Structure\n- /papers — Paper notes (template included)\n- /experiments — Experiment logs\n- /reviews — Literature reviews\n- /weekly — Weekly summaries\n- /references — Zotero integration\n...",
      type: "BUNDLE" as const,
      platform: "OBSIDIAN" as const,
      category: "research",
      price: 19.99,
      authorId: carol.id,
      status: "PUBLISHED" as const,
      downloadCount: 178,
      viewCount: 1890,
      purchaseCount: 67,
      avgRating: 4.7,
      ratingCount: 21,
      trendingScore: 41.2,
      tagNames: ["ai-agents", "automation"],
    },
    {
      title: "Refactoring Patterns Cursor Rules",
      slug: "refactoring-patterns-cursor",
      description: "25 battle-tested refactoring patterns encoded as Cursor rules. Automatically suggests extract method, replace conditional with polymorphism, introduce parameter object, and more.",
      previewContent: "# Refactoring Patterns\n\n## Pattern 1: Extract Method\nWhen: Function body > 15 lines\nAction: Extract logical sections into named methods\nSignal: Comments explaining what a block does\n\n## Pattern 2: Replace Temp with Query\nWhen: Variable assigned once and used multiple times\n...",
      type: "RULESET" as const,
      platform: "CURSOR" as const,
      category: "refactoring",
      price: 8.99,
      authorId: bob.id,
      status: "PUBLISHED" as const,
      downloadCount: 312,
      viewCount: 1743,
      purchaseCount: 78,
      avgRating: 4.5,
      ratingCount: 17,
      trendingScore: 35.6,
      tagNames: ["refactoring", "code-review", "architecture"],
    },
  ];

  for (const r of rulesets) {
    const { tagNames: rulesetTagNames, ...rulesetData } = r;

    const created = await db.ruleset.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        ...rulesetData,
        versions: {
          create: {
            version: "1.0.0",
            fullContent: r.previewContent + "\n\n[Full content would continue here with detailed rules, examples, and edge cases...]",
          },
        },
      },
    });

    // Attach tags
    for (const tagName of rulesetTagNames) {
      const tag = tags[tagName];
      if (!tag) continue;

      await db.rulesetTag.upsert({
        where: { rulesetId_tagId: { rulesetId: created.id, tagId: tag.id } },
        update: {},
        create: { rulesetId: created.id, tagId: tag.id },
      });

      await db.tag.update({
        where: { id: tag.id },
        data: { usageCount: { increment: 1 } },
      });
    }
  }

  console.log(`Created ${rulesets.length} rulesets with tags and versions`);

  // ── Votes ──────────────────────────────────────────
  const allRulesets = await db.ruleset.findMany({ select: { id: true } });
  const voters = [alice, bob, carol, dave, admin];

  let voteCount = 0;
  for (const ruleset of allRulesets) {
    // Random subset of voters vote for each ruleset
    const numVoters = Math.floor(Math.random() * voters.length) + 1;
    const shuffled = [...voters].sort(() => Math.random() - 0.5).slice(0, numVoters);

    for (const voter of shuffled) {
      await db.vote.upsert({
        where: { userId_rulesetId: { userId: voter.id, rulesetId: ruleset.id } },
        update: {},
        create: { userId: voter.id, rulesetId: ruleset.id },
      });
      voteCount++;
    }
  }

  console.log(`Created ${voteCount} votes`);

  // ── Reviews ────────────────────────────────────────
  const reviewData = [
    { rulesetSlug: "senior-engineer-cursor-rules", userId: bob.id, rating: 5, comment: "These rules completely changed how I structure my Cursor projects. The architecture patterns are solid and the security guidelines caught several issues I missed." },
    { rulesetSlug: "senior-engineer-cursor-rules", userId: carol.id, rating: 4, comment: "Great foundation, though I had to customize a few rules for my Python-heavy workflow. Overall very well thought out." },
    { rulesetSlug: "typescript-strict-mode-prompt", userId: alice.id, rating: 5, comment: "Finally a prompt that actually enforces strict TypeScript. My code quality improved noticeably after using this." },
    { rulesetSlug: "typescript-strict-mode-prompt", userId: dave.id, rating: 5, comment: "Essential for any TypeScript project. The null handling rules alone are worth it." },
    { rulesetSlug: "react-component-architecture", userId: carol.id, rating: 5, comment: "These rules align perfectly with how we build React apps at scale. The server component guidelines are especially useful for Next.js projects." },
    { rulesetSlug: "react-component-architecture", userId: dave.id, rating: 4, comment: "Solid rules, though some are quite opinionated. The state management hierarchy (URL > local > global) is a great principle." },
    { rulesetSlug: "n8n-lead-scoring-workflow", userId: alice.id, rating: 5, comment: "Saved me hours of setup. The Clearbit integration works perfectly and the scoring logic is easy to customize." },
    { rulesetSlug: "python-code-review-prompt", userId: bob.id, rating: 4, comment: "Catches issues that linters miss. The security review section is particularly thorough." },
    { rulesetSlug: "database-optimization-checklist", userId: bob.id, rating: 5, comment: "Applied this to our production DB and saw 3x improvement in query performance. The indexing strategy section is gold." },
    { rulesetSlug: "database-optimization-checklist", userId: dave.id, rating: 5, comment: "Comprehensive and practical. Every PostgreSQL developer should have this." },
  ];

  for (const r of reviewData) {
    const ruleset = await db.ruleset.findUnique({ where: { slug: r.rulesetSlug }, select: { id: true } });
    if (!ruleset) continue;

    await db.review.upsert({
      where: { id: `review-${r.rulesetSlug}-${r.userId}` },
      update: {},
      create: {
        userId: r.userId,
        rulesetId: ruleset.id,
        rating: r.rating,
        comment: r.comment,
        isVerifiedPurchase: true,
      },
    });
  }

  console.log(`Created ${reviewData.length} reviews`);

  // ── Follows ────────────────────────────────────────
  const follows = [
    [bob.id, alice.id],
    [carol.id, alice.id],
    [dave.id, alice.id],
    [alice.id, carol.id],
    [bob.id, carol.id],
    [dave.id, bob.id],
    [alice.id, dave.id],
  ];

  for (const [followerId, followingId] of follows) {
    await db.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      update: {},
      create: { followerId, followingId },
    });
  }

  console.log(`Created ${follows.length} follows`);

  // ── Collections ────────────────────────────────────
  const collection = await db.collection.upsert({
    where: { userId_slug: { userId: alice.id, slug: "my-cursor-essentials" } },
    update: {},
    create: {
      userId: alice.id,
      name: "My Cursor Essentials",
      slug: "my-cursor-essentials",
      description: "The rules I use in every Cursor project",
      isPublic: true,
    },
  });

  const cursorRulesets = await db.ruleset.findMany({
    where: { platform: "CURSOR" },
    select: { id: true },
  });

  for (let i = 0; i < cursorRulesets.length; i++) {
    await db.collectionItem.upsert({
      where: { collectionId_rulesetId: { collectionId: collection.id, rulesetId: cursorRulesets[i].id } },
      update: {},
      create: { collectionId: collection.id, rulesetId: cursorRulesets[i].id, position: i },
    });
  }

  console.log(`Created 1 collection with ${cursorRulesets.length} items`);

  // ── Discussions ────────────────────────────────────
  const discussion = await db.discussion.upsert({
    where: { category_slug: { category: "general", slug: "best-practices-for-system-prompts" } },
    update: {},
    create: {
      title: "Best practices for writing system prompts?",
      slug: "best-practices-for-system-prompts",
      body: "I've been experimenting with different system prompt structures and I'm curious what patterns have worked best for others. Some things I've found:\n\n1. Start with role definition\n2. List constraints explicitly\n3. Include examples of desired output\n4. Keep it under 2000 tokens\n\nWhat are your tips?",
      authorId: dave.id,
      category: "general",
    },
  });

  await db.discussionReply.create({
    data: {
      discussionId: discussion.id,
      authorId: carol.id,
      body: "Great list! I'd add: always test your prompt with adversarial inputs. You'd be surprised how easily LLMs can be pushed off-track without explicit guardrails.",
    },
  });

  await db.discussionReply.create({
    data: {
      discussionId: discussion.id,
      authorId: alice.id,
      body: "The token count tip is underrated. I've seen prompts that are 5000+ tokens and they actually perform worse than a focused 500-token version. Conciseness matters.",
    },
  });

  console.log("Created 1 discussion with 2 replies");

  // ── Saved Items ────────────────────────────────────
  const topRulesets = await db.ruleset.findMany({ take: 3, select: { id: true } });
  for (const r of topRulesets) {
    await db.savedItem.upsert({
      where: { userId_rulesetId: { userId: bob.id, rulesetId: r.id } },
      update: {},
      create: { userId: bob.id, rulesetId: r.id },
    });
  }

  console.log("Created 3 saved items");

  // ── Notifications ──────────────────────────────────
  await db.notification.createMany({
    data: [
      { userId: alice.id, type: "NEW_FOLLOWER", data: { followerName: "Bob Martinez", followerUsername: "bobdev" } },
      { userId: alice.id, type: "NEW_REVIEW", data: { reviewerName: "Carol Wang", rulesetTitle: "Senior Engineer Cursor Rules", rating: 4 } },
      { userId: alice.id, type: "NEW_FOLLOWER", data: { followerName: "Dave Kim", followerUsername: "davekim" } },
      { userId: carol.id, type: "NEW_FOLLOWER", data: { followerName: "Alice Chen", followerUsername: "alicechen" } },
      { userId: carol.id, type: "NEW_REVIEW", data: { reviewerName: "Alice Chen", rulesetTitle: "TypeScript Strict Mode System Prompt", rating: 5 } },
    ],
  });

  console.log("Created 5 notifications");

  // ── Trending Events ────────────────────────────────
  const eventRulesets = await db.ruleset.findMany({ where: { status: "PUBLISHED" }, select: { id: true } });
  const eventTypes = ["VIEW", "VOTE", "DOWNLOAD", "PURCHASE"] as const;

  let eventCount = 0;
  for (const r of eventRulesets) {
    const numEvents = Math.floor(Math.random() * 20) + 5;
    for (let i = 0; i < numEvents; i++) {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const hoursAgo = Math.floor(Math.random() * 168); // 0-7 days
      await db.rulesetEvent.create({
        data: {
          rulesetId: r.id,
          type,
          createdAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
        },
      });
      eventCount++;
    }
  }

  console.log(`Created ${eventCount} trending events`);

  console.log("\nSeed complete! You can log in with:");
  console.log("  alice@example.com / password123 (Pro seller)");
  console.log("  bob@example.com / password123 (seller)");
  console.log("  carol@example.com / password123 (seller)");
  console.log("  dave@example.com / password123 (seller)");
  console.log("  admin@ruleset.ai / password123 (admin)");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    await pool.end();
  });
