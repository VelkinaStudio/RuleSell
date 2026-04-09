import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

const PERIOD_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const userId = session.user.id;
    const period = req.nextUrl.searchParams.get("period") ?? "30d";
    const days = PERIOD_DAYS[period] ?? 30;

    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - days);

    // Get all rulesets by this author
    const authorRulesetIds = await db.ruleset.findMany({
      where: { authorId: userId },
      select: { id: true },
    });
    const rulesetIds = authorRulesetIds.map((r) => r.id);

    // Lifetime revenue: sum of (amount - platformFee) for completed, non-refunded purchases
    const lifetimeAgg = rulesetIds.length > 0
      ? await db.purchase.aggregate({
          where: {
            rulesetId: { in: rulesetIds },
            status: "COMPLETED",
            refundedAt: null,
          },
          _sum: { amount: true, platformFee: true },
        })
      : { _sum: { amount: null, platformFee: null } };

    const lifetimeRevenue = (lifetimeAgg._sum.amount ?? 0) - (lifetimeAgg._sum.platformFee ?? 0);

    // Completed payouts
    const completedPayoutsAgg = await db.payout.aggregate({
      where: { userId, status: "COMPLETED" },
      _sum: { amount: true },
    });
    const pendingPayout = lifetimeRevenue - (completedPayoutsAgg._sum.amount ?? 0);

    // Last 12 payouts
    const payouts = await db.payout.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    const lastPayout = payouts.find((p) => p.status === "COMPLETED");

    // Timeseries: daily revenue + sales count within period
    const periodPurchases = rulesetIds.length > 0
      ? await db.purchase.findMany({
          where: {
            rulesetId: { in: rulesetIds },
            status: "COMPLETED",
            refundedAt: null,
            createdAt: { gte: periodStart },
          },
          select: { amount: true, platformFee: true, createdAt: true },
        })
      : [];

    // Group by day
    const dailyMap = new Map<string, { revenue: number; sales: number }>();
    for (const p of periodPurchases) {
      const day = p.createdAt.toISOString().slice(0, 10);
      const entry = dailyMap.get(day) ?? { revenue: 0, sales: 0 };
      entry.revenue += p.amount - p.platformFee;
      entry.sales += 1;
      dailyMap.set(day, entry);
    }

    // Fill gaps
    const timeseries: Array<{ date: string; revenue: number; sales: number; installs: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = d.toISOString().slice(0, 10);
      const entry = dailyMap.get(day);
      timeseries.push({
        date: day,
        revenue: entry?.revenue ?? 0,
        sales: entry?.sales ?? 0,
        installs: entry?.sales ?? 0,
      });
    }

    return success({
      lifetimeRevenue,
      pendingPayout: Math.max(0, pendingPayout),
      lastPayoutAmount: lastPayout?.amount ?? 0,
      lastPayoutDate: lastPayout?.completedAt?.toISOString() ?? null,
      payouts: payouts.map((p) => {
        // Derive period start/end from createdAt (monthly periods)
        const periodEnd = new Date(p.createdAt);
        const periodStart = new Date(periodEnd);
        periodStart.setMonth(periodStart.getMonth() - 1);
        return {
          id: p.id,
          amount: p.amount,
          status: p.status.toLowerCase(),
          createdAt: p.createdAt.toISOString(),
          completedAt: p.completedAt?.toISOString() ?? null,
          paidAt: p.completedAt?.toISOString() ?? null,
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString(),
        };
      }),
      timeseries,
    });
  } catch {
    return errors.internal();
  }
}
