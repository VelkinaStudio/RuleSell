import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, list, errors, paginationFromCursor } from "@/lib/api/response";
import { saveSchema } from "@/lib/validations/engagement";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 20;

    const items = await db.savedItem.findMany({
      where: {
        userId: session.user.id,
        ruleset: { status: "PUBLISHED" },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { userId_rulesetId: { userId: session.user.id, rulesetId: cursor } }, skip: 1 } : {}),
      include: {
        ruleset: {
          include: {
            author: { select: { id: true, name: true, username: true, avatar: true } },
            tags: { include: { tag: { select: { name: true } } } },
            _count: { select: { votes: true } },
          },
        },
      },
    });

    const hasNext = items.length > pageSize;
    if (hasNext) items.pop();
    const nextCursor = hasNext && items.length > 0 ? items[items.length - 1].rulesetId : undefined;
    const total = await db.savedItem.count({
      where: { userId: session.user.id, ruleset: { status: "PUBLISHED" } },
    });

    // Check which rulesets the user has voted on
    const rulesetIds = items.map((i) => i.rulesetId);
    const userVotes = rulesetIds.length > 0
      ? await db.vote.findMany({
          where: { userId: session.user.id, rulesetId: { in: rulesetIds } },
          select: { rulesetId: true },
        })
      : [];
    const votedSet = new Set(userVotes.map((v) => v.rulesetId));

    const rulesets = items.map((item) => ({
      ...item.ruleset,
      tags: item.ruleset.tags.map((t) => t.tag.name),
      currentUserSaved: true,
      currentUserVoted: votedSet.has(item.rulesetId),
    }));

    return success({ items: rulesets, total });
  } catch {
    return errors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();

    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }
    const { rulesetId } = parsed.data;

    const ruleset = await db.ruleset.findUnique({ where: { id: rulesetId }, select: { id: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");

    const existing = await db.savedItem.findUnique({
      where: { userId_rulesetId: { userId: session.user.id, rulesetId } },
    });

    if (existing) {
      await db.savedItem.delete({
        where: { userId_rulesetId: { userId: session.user.id, rulesetId } },
      });
      return success({ saved: false });
    }

    await db.savedItem.create({
      data: { userId: session.user.id, rulesetId },
    });

    return success({ saved: true });
  } catch {
    return errors.internal();
  }
}
