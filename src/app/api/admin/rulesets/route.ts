import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return errors.forbidden();

    const status = req.nextUrl.searchParams.get("status") || "FLAGGED";
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const rulesets = await db.ruleset.findMany({
      where: { status: status as "FLAGGED" | "DRAFT" | "PUBLISHED" | "ARCHIVED" },
      orderBy: { createdAt: "desc" },
      take: 21,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true, title: true, slug: true, status: true, platform: true, type: true, createdAt: true,
        author: { select: { id: true, name: true, username: true } },
        _count: { select: { reports: true } },
      },
    });

    const hasNext = rulesets.length > 20;
    if (hasNext) rulesets.pop();

    return success({
      rulesets,
      nextCursor: hasNext && rulesets.length > 0 ? rulesets[rulesets.length - 1].id : undefined,
    });
  } catch {
    return errors.internal();
  }
}
