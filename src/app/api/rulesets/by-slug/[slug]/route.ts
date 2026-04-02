import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { getRulesetBySlug } from "@/lib/rulesets/queries";
import { resolveAccessState, canViewFullContent } from "@/lib/rulesets/access";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const session = await auth();
    const ruleset = await getRulesetBySlug(slug);

    if (!ruleset || ruleset.status === "ARCHIVED") {
      return errors.notFound("Ruleset not found");
    }

    const accessState = await resolveAccessState(
      ruleset.id,
      ruleset.authorId,
      ruleset.price,
      session?.user?.id,
    );

    const showFull = canViewFullContent(accessState);

    // Check if user has voted
    let hasVoted = false;
    if (session?.user) {
      const vote = await db.vote.findUnique({
        where: { userId_rulesetId: { userId: session.user.id, rulesetId: ruleset.id } },
      });
      hasVoted = !!vote;
    }

    return success({
      ...ruleset,
      accessState,
      hasVoted,
      voteCount: ruleset._count.votes,
      reviewCount: ruleset._count.reviews,
      versions: showFull ? ruleset.versions : [],
      tags: ruleset.tags.map((t) => t.tag),
      createdAt: ruleset.createdAt.toISOString(),
      updatedAt: ruleset.updatedAt.toISOString(),
    });
  } catch {
    return errors.internal();
  }
}
