import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics — Ruleset" };

export default async function DashboardAnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const [user, totalSales, downloads, followerCount, rulesets] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, select: { totalEarnings: true, role: true } }),
    db.purchase.count({ where: { ruleset: { authorId: userId }, status: "COMPLETED" } }),
    db.ruleset.aggregate({ where: { authorId: userId }, _sum: { downloadCount: true } }),
    db.follow.count({ where: { followingId: userId } }),
    db.ruleset.findMany({
      where: { authorId: userId },
      orderBy: { downloadCount: "desc" },
      take: 10,
      select: {
        id: true, title: true, slug: true, downloadCount: true,
        viewCount: true, purchaseCount: true, avgRating: true, price: true,
      },
    }),
  ]);

  const isPro = user?.role === "PRO" || user?.role === "ADMIN";

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Analytics</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="card p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Earnings</p>
          <p className="text-2xl font-bold text-accent-green">${(user?.totalEarnings || 0).toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Sales</p>
          <p className="text-2xl font-bold text-text-primary">{totalSales}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Downloads</p>
          <p className="text-2xl font-bold text-text-primary">{downloads._sum.downloadCount || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Followers</p>
          <p className="text-2xl font-bold text-text-primary">{followerCount}</p>
        </div>
      </div>

      {/* Top rulesets */}
      <h2 className="text-lg font-semibold text-text-primary mb-4">Top Rulesets</h2>
      {rulesets.length > 0 ? (
        <div className="space-y-3">
          {rulesets.map((r) => (
            <div key={r.id} className="card p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-text-primary">{r.title}</span>
                <div className="flex items-center gap-4 mt-1 text-xs text-text-tertiary">
                  <span>{r.viewCount} views</span>
                  <span>{r.downloadCount} downloads</span>
                  <span>{r.purchaseCount} sales</span>
                  {r.avgRating > 0 && <span>&#9733; {r.avgRating.toFixed(1)}</span>}
                </div>
              </div>
              <span className="text-sm font-semibold text-accent-green">
                {r.price === 0 ? "Free" : `$${r.price.toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-16 text-center text-text-tertiary">
          <p>No rulesets yet. Publish one to see analytics!</p>
        </div>
      )}

      {!isPro && (
        <div className="mt-8 card p-6 border-accent-green/20 bg-accent-green-subtle/30 text-center">
          <p className="text-sm text-text-primary mb-2">Upgrade to Pro for detailed per-ruleset analytics</p>
          <p className="text-xs text-text-tertiary">Views, conversions, revenue trends, audience breakdown</p>
        </div>
      )}
    </div>
  );
}
