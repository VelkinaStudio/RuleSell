import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://rulesell.vercel.app";

export const revalidate = 3600;

export async function GET() {
  const sections: string[] = [];

  sections.push("# RuleSell");
  sections.push("");
  sections.push(
    "> The verified marketplace for AI development assets — rules, MCP servers, skills, agents, workflows, prompts, CLIs, datasets, and bundles. Every listing is quality-scored, security-scanned, and verified across environments (Claude Code, Cursor, Windsurf, Cline, Codex, ChatGPT, Gemini CLI, n8n, Copilot).",
  );
  sections.push("");
  sections.push(
    "Creators keep 85% of revenue (90% for the first six months). All paid items require passing a 50-install verification gate and Trader KYC compliance (DSA Art 30).",
  );
  sections.push("");

  sections.push("## Core pages");
  sections.push("");
  sections.push(`- [Homepage](${SITE_URL}/): What RuleSell is and why quality is measured, not voted`);
  sections.push(`- [Browse](${SITE_URL}/browse): Filter and sort all verified assets`);
  sections.push(`- [Leaderboard](${SITE_URL}/leaderboard): Top 100 assets by Quality Score`);
  sections.push(`- [Explore](${SITE_URL}/explore): Community feed, discussions, polls, Q&A, showcases`);
  sections.push(`- [Collections](${SITE_URL}/collections): Curated bundles of related assets`);
  sections.push(`- [Trust](${SITE_URL}/trust): How we score quality and scan for security`);
  sections.push(`- [Affiliates](${SITE_URL}/affiliates): Earn commissions referring creators and buyers`);
  sections.push(`- [CLI](${SITE_URL}/cli): Install rulesell CLI to browse and install from the terminal`);
  sections.push("");

  sections.push("## Categories");
  sections.push("");
  const categories = [
    ["RULES", "Cursor, Windsurf, Claude Code rules and style guides"],
    ["MCP_SERVER", "Model Context Protocol servers for tool integration"],
    ["SKILL", "Claude Code skills and prompt-based workflows"],
    ["AGENT_TEAM", "Multi-agent orchestration templates"],
    ["WORKFLOW", "n8n, Zapier, Make automation flows"],
    ["PROMPT", "Reusable system prompts and templates"],
    ["CLI", "Command-line tools and wrappers"],
    ["DATASET", "Fine-tuning and evaluation datasets"],
    ["BUNDLE", "Packs of related assets at a discount"],
  ];
  for (const [key, desc] of categories) {
    sections.push(`- [${key}](${SITE_URL}/category/${key.toLowerCase()}): ${desc}`);
  }
  sections.push("");

  sections.push("## API");
  sections.push("");
  sections.push(`- [Health](${SITE_URL}/api/health): Service status check`);
  sections.push(`- [Ruleset list](${SITE_URL}/api/rulesets): Paginated search over published assets`);
  sections.push(`- [Ruleset detail](${SITE_URL}/api/rulesets/by-slug/{slug}): Full metadata for a single listing`);
  sections.push(`- [Leaderboard](${SITE_URL}/api/leaderboard): Top 100 by Quality Score`);
  sections.push(`- [Tags](${SITE_URL}/api/tags): All active tags`);
  sections.push(`- [Collections](${SITE_URL}/api/collections): All public collections`);
  sections.push("");

  try {
    const top = await db.ruleset.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, title: true, description: true },
      orderBy: [{ trendingScore: "desc" }, { avgRating: "desc" }],
      take: 20,
    });
    if (top.length > 0) {
      sections.push("## Featured listings");
      sections.push("");
      for (const r of top) {
        const short = r.description.slice(0, 140).replace(/\s+/g, " ");
        sections.push(`- [${r.title}](${SITE_URL}/r/${r.slug}): ${short}`);
      }
      sections.push("");
    }
  } catch {
    // swallow — return the static block
  }

  sections.push("## Policies");
  sections.push("");
  sections.push(`- [Privacy](${SITE_URL}/legal/privacy)`);
  sections.push(`- [Terms](${SITE_URL}/legal/terms)`);
  sections.push(`- [Acceptable Use](${SITE_URL}/legal/acceptable-use)`);
  sections.push(`- [Creator Agreement](${SITE_URL}/legal/creator-agreement)`);
  sections.push(`- [DMCA](${SITE_URL}/legal/dmca)`);
  sections.push(`- [Transparency](${SITE_URL}/legal/transparency)`);
  sections.push("");

  const body = sections.join("\n");
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
