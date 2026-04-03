import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    // Pro only
    if (session.user.role !== "PRO" && session.user.role !== "ADMIN") {
      return errors.forbidden("Pro subscription required for detailed analytics");
    }

    const ruleset = await db.ruleset.findUnique({
      where: { id },
      select: { authorId: true, title: true, viewCount: true, downloadCount: true, purchaseCount: true, avgRating: true },
    });

    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return errors.forbidden("Not your ruleset");
    }

    const period = req.nextUrl.searchParams.get("period") || "30d";
    const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "1y" ? 365 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [events, revenue] = await Promise.all([
      db.rulesetEvent.groupBy({
        by: ["type"],
        where: { rulesetId: id, createdAt: { gte: since } },
        _count: true,
      }),
      db.purchase.aggregate({
        where: { rulesetId: id, status: "COMPLETED", createdAt: { gte: since } },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const eventCounts = Object.fromEntries(events.map((e) => [e.type, e._count]));

    return success({
      title: ruleset.title,
      allTime: {
        views: ruleset.viewCount,
        downloads: ruleset.downloadCount,
        purchases: ruleset.purchaseCount,
        avgRating: ruleset.avgRating,
      },
      period: {
        days,
        views: eventCounts["VIEW"] || 0,
        downloads: eventCounts["DOWNLOAD"] || 0,
        purchases: revenue._count,
        votes: eventCounts["VOTE"] || 0,
        revenue: revenue._sum.amount || 0,
      },
    });
  } catch {
    return errors.internal();
  }
}
