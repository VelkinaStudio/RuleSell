import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    // Admin can view analytics for another user via ?userId= param
    const requestedUserId = req.nextUrl.searchParams.get("userId");
    let userId = session.user.id;

    if (requestedUserId && requestedUserId !== session.user.id) {
      if (session.user.role !== "ADMIN") {
        return errors.forbidden("Only admins can view other users' analytics");
      }
      userId = requestedUserId;
    }

    const [totalEarnings, totalSales, totalDownloads, followerCount, rulesetCount] = await Promise.all([
      db.user.findUnique({ where: { id: userId }, select: { totalEarnings: true } }),
      db.purchase.count({ where: { ruleset: { authorId: userId }, status: "COMPLETED" } }),
      db.ruleset.aggregate({ where: { authorId: userId }, _sum: { downloadCount: true } }),
      db.follow.count({ where: { followingId: userId } }),
      db.ruleset.count({ where: { authorId: userId } }),
    ]);

    return success({
      totalEarnings: totalEarnings?.totalEarnings || 0,
      totalSales,
      totalDownloads: totalDownloads._sum.downloadCount || 0,
      followerCount,
      rulesetCount,
    });
  } catch {
    return errors.internal();
  }
}
