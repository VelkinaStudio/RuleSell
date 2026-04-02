import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId } = body;

    if (!rulesetId) return errors.validation("rulesetId is required");

    const ruleset = await db.ruleset.findUnique({ where: { id: rulesetId }, select: { id: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");

    const existing = await db.vote.findUnique({
      where: { userId_rulesetId: { userId: session.user.id, rulesetId } },
    });

    if (existing) {
      await db.vote.delete({
        where: { userId_rulesetId: { userId: session.user.id, rulesetId } },
      });
      return success({ voted: false });
    }

    await db.vote.create({
      data: { userId: session.user.id, rulesetId },
    });

    // Log event for trending
    await db.rulesetEvent.create({
      data: { rulesetId, type: "VOTE" },
    });

    return success({ voted: true });
  } catch {
    return errors.internal();
  }
}
