import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const limitParam = req.nextUrl.searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam ?? "10", 10) || 10, 1), 50);

    const users = await db.user.findMany({
      where: { role: { not: "ADMIN" } },
      orderBy: { reputation: "desc" },
      take: limit,
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        reputation: true,
        role: true,
        _count: { select: { rulesets: true } },
        rulesets: {
          where: { status: "PUBLISHED" },
          select: { downloadCount: true, avgRating: true },
        },
      },
    });

    const ranked = users.map((u, idx) => {
      const totalDownloads = u.rulesets.reduce((s, r) => s + r.downloadCount, 0);
      const ratings = u.rulesets.filter((r) => r.avgRating > 0);
      const avgRating = ratings.length > 0
        ? ratings.reduce((s, r) => s + r.avgRating, 0) / ratings.length
        : 0;

      return {
        id: u.id,
        username: u.username,
        name: u.name,
        avatar: u.avatar,
        reputation: u.reputation,
        role: u.role,
        stats: {
          rulesetCount: u._count.rulesets,
          totalDownloads,
          avgRating: Math.round(avgRating * 100) / 100,
        },
        rank: idx + 1,
      };
    });

    return success({ users: ranked });
  } catch {
    return errors.internal();
  }
}
