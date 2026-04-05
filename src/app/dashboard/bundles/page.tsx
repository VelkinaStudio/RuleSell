import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Bundles — Ruleset" };

export default async function DashboardBundlesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bundles = await db.rulesetBundle.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">My Bundles</h1>
        <Link href="/dashboard/bundles/new">
          <Button size="sm">New Bundle</Button>
        </Link>
      </div>

      {bundles.length > 0 ? (
        <div className="space-y-3">
          {bundles.map((b) => (
            <div key={b.id} className="card p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-text-primary">{b.title}</span>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                  <span>{b._count.items} items</span>
                  <span>${b.price.toFixed(2)}</span>
                  <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Link
                href={`/b/${b.slug}`}
                className="text-sm text-accent-green hover:underline"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-16 text-center text-text-tertiary">
          <p className="mb-4">You haven&apos;t created any bundles yet</p>
          <p className="text-sm">Bundle your rulesets together to offer more value.</p>
        </div>
      )}
    </div>
  );
}
