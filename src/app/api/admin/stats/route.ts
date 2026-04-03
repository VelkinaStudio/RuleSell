import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return errors.forbidden();

    const [userCount, rulesetCount, purchaseCount, totalRevenue, pendingReports] = await Promise.all([
      db.user.count(),
      db.ruleset.count({ where: { status: "PUBLISHED" } }),
      db.purchase.count({ where: { status: "COMPLETED" } }),
      db.purchase.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
      db.report.count({ where: { status: "PENDING" } }),
    ]);

    return success({
      users: userCount,
      publishedRulesets: rulesetCount,
      totalPurchases: purchaseCount,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingReports,
    });
  } catch {
    return errors.internal();
  }
}
