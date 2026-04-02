import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Rulesets — Ruleset" };

export default async function DashboardRulesetsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rulesets = await db.ruleset.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      price: true,
      downloadCount: true,
      viewCount: true,
      createdAt: true,
      _count: { select: { votes: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">My Rulesets</h1>
        <Link href="/dashboard/rulesets/new">
          <Button size="sm">New Ruleset</Button>
        </Link>
      </div>

      {rulesets.length > 0 ? (
        <div className="space-y-2">
          {rulesets.map((r) => (
            <div key={r.id} className="card p-4 flex items-center justify-between">
              <div>
                <Link href={`/r/${r.slug}`} className="text-sm font-medium text-text-primary hover:text-accent-green">
                  {r.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                  <Badge variant={r.status === "PUBLISHED" ? "green" : r.status === "DRAFT" ? "default" : "error"}>
                    {r.status}
                  </Badge>
                  <span>{r.price === 0 ? "Free" : `$${r.price.toFixed(2)}`}</span>
                  <span>{r._count.votes} votes</span>
                  <span>{r.downloadCount} downloads</span>
                  <span>{r.viewCount} views</span>
                </div>
              </div>
              <Link href={`/dashboard/rulesets/${r.id}/edit`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-text-tertiary">
          <p className="mb-4">You haven&apos;t published any rulesets yet</p>
          <Link href="/dashboard/rulesets/new">
            <Button>Create your first ruleset</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
