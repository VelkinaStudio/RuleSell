import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    if (session.user.role !== "PRO" && session.user.role !== "ADMIN") {
      return errors.forbidden("Pro subscription required for audience analytics");
    }

    const userId = session.user.id;

    const [platformBreakdown, typeBreakdown, topRulesets] = await Promise.all([
      db.ruleset.groupBy({
        by: ["platform"],
        where: { authorId: userId, status: "PUBLISHED" },
        _count: true,
        _sum: { downloadCount: true },
      }),
      db.ruleset.groupBy({
        by: ["type"],
        where: { authorId: userId, status: "PUBLISHED" },
        _count: true,
        _sum: { downloadCount: true },
      }),
      db.ruleset.findMany({
        where: { authorId: userId, status: "PUBLISHED" },
        orderBy: { downloadCount: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, downloadCount: true, viewCount: true, purchaseCount: true },
      }),
    ]);

    return success({
      platforms: platformBreakdown.map((p) => ({
        platform: p.platform,
        count: p._count,
        downloads: p._sum.downloadCount || 0,
      })),
      types: typeBreakdown.map((t) => ({
        type: t.type,
        count: t._count,
        downloads: t._sum.downloadCount || 0,
      })),
      topRulesets,
    });
  } catch {
    return errors.internal();
  }
}
