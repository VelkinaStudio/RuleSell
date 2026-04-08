import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Earnings — Ruleset" };

export default async function DashboardEarningsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [purchases, payouts] = await Promise.all([
    db.purchase.findMany({
      where: { ruleset: { authorId: session.user.id }, status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        platformFee: true,
        createdAt: true,
        buyer: { select: { name: true } },
        ruleset: { select: { title: true, slug: true } },
      },
    }),
    db.payout.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalEarned = purchases.reduce((sum, p) => sum + (p.amount - p.platformFee), 0);
  const totalPaidOut = payouts
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayout = totalEarned - totalPaidOut;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Earnings</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="card p-5">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Total Earned</p>
          <p className="text-2xl font-bold font-mono text-text-primary">${totalEarned.toFixed(2)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Paid Out</p>
          <p className="text-2xl font-bold font-mono text-text-primary">${totalPaidOut.toFixed(2)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-bold font-mono text-accent-green">${pendingPayout.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent sales */}
      <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Sales</h2>
      {purchases.length > 0 ? (
        <div className="space-y-3">
          {purchases.map((p) => (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-text-primary">{p.ruleset.title}</span>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                  <span>by {p.buyer.name}</span>
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <span className="text-sm font-mono font-semibold text-accent-green">
                +${(p.amount - p.platformFee).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-16 text-center text-text-tertiary">
          <p>No sales yet</p>
        </div>
      )}

      {/* Payout history */}
      {payouts.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-text-primary mt-10 mb-4">Payout History</h2>
          <div className="space-y-3">
            {payouts.map((p) => (
              <div key={p.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      p.status === "COMPLETED" ? "green" : p.status === "FAILED" ? "error" : "warning"
                    }
                  >
                    {p.status}
                  </Badge>
                  <span className="text-sm text-text-tertiary">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-sm font-mono font-semibold text-text-primary">
                  ${p.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
