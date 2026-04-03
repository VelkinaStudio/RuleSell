import { auth } from "@/lib/auth";
import { getUserPurchases } from "@/lib/purchases/queries";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Purchases — Ruleset" };

export default async function DashboardPurchasesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const purchases = await getUserPurchases(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">My Purchases</h1>

      {purchases.length > 0 ? (
        <div className="space-y-2">
          {purchases.map((p) => (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <Link href={`/r/${p.ruleset.slug}`} className="text-sm font-medium text-text-primary hover:text-accent-green">
                  {p.ruleset.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                  <Badge variant={p.status === "COMPLETED" ? "green" : p.status === "REFUNDED" ? "error" : "warning"}>
                    {p.status}
                  </Badge>
                  <span>${p.amount.toFixed(2)}</span>
                  <span>by {p.ruleset.author.name}</span>
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {p.status === "COMPLETED" && (
                <Link
                  href={`/api/downloads/${p.rulesetId}`}
                  className="text-sm text-accent-green hover:underline"
                >
                  Download
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-text-tertiary">
          <p className="mb-4">You haven&apos;t purchased any rulesets yet</p>
          <Link href="/search" className="text-accent-green hover:underline">
            Browse the marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
