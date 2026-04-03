import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, list, errors, paginationFromCursor } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 20;

    const items = await db.savedItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { userId_rulesetId: { userId: session.user.id, rulesetId: cursor } }, skip: 1 } : {}),
      include: {
        ruleset: {
          select: {
            id: true, title: true, slug: true, description: true,
            price: true, platform: true, type: true, avgRating: true,
            author: { select: { name: true, username: true } },
            _count: { select: { votes: true } },
          },
        },
      },
    });

    const hasNext = items.length > pageSize;
    if (hasNext) items.pop();
    const nextCursor = hasNext && items.length > 0 ? items[items.length - 1].rulesetId : undefined;
    const total = await db.savedItem.count({ where: { userId: session.user.id } });

    return list(items, paginationFromCursor(total, pageSize, nextCursor));
  } catch {
    return errors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId } = body;

    if (!rulesetId) return errors.validation("rulesetId is required");

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
