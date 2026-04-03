import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Ruleset" };

export default async function AdminOverviewPage() {
  const [userCount, rulesetCount, purchaseCount, totalRevenue, pendingReports] = await Promise.all([
    db.user.count(),
    db.ruleset.count({ where: { status: "PUBLISHED" } }),
    db.purchase.count({ where: { status: "COMPLETED" } }),
    db.purchase.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
    db.report.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Platform Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Users</p>
          <p className="text-2xl font-bold text-text-primary">{userCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Published</p>
          <p className="text-2xl font-bold text-text-primary">{rulesetCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Purchases</p>
          <p className="text-2xl font-bold text-text-primary">{purchaseCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Revenue</p>
          <p className="text-2xl font-bold text-accent-green">${(totalRevenue._sum.amount || 0).toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Pending Reports</p>
          <p className={`text-2xl font-bold ${pendingReports > 0 ? "text-status-error" : "text-text-primary"}`}>
            {pendingReports}
          </p>
        </div>
      </div>
    </div>
  );
}
