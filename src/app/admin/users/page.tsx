import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users — Admin — Ruleset" };

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true, name: true, username: true, email: true, role: true,
      sellerStatus: true, totalEarnings: true, createdAt: true,
      _count: { select: { rulesets: true, purchases: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">User Management</h1>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary">{u.name}</span>
                <span className="text-xs text-text-tertiary">@{u.username}</span>
                <Badge variant={u.role === "ADMIN" ? "purple" : u.role === "PRO" ? "green" : "default"}>
                  {u.role}
                </Badge>
                {u.sellerStatus !== "NONE" && (
                  <Badge variant={u.sellerStatus === "ACTIVE" ? "green" : u.sellerStatus === "SUSPENDED" ? "error" : "warning"}>
                    Seller: {u.sellerStatus}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-text-tertiary">
                <span>{u.email}</span>
                <span>{u._count.rulesets} rulesets</span>
                <span>{u._count.purchases} purchases</span>
                <span>${u.totalEarnings.toFixed(2)} earned</span>
                <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
