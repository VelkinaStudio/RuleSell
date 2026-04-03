import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports — Admin — Ruleset" };

export default async function AdminReportsPage() {
  const reports = await db.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      reporter: { select: { name: true, username: true } },
      ruleset: { select: { title: true, slug: true, author: { select: { name: true } } } },
      resolvedByUser: { select: { name: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Reports</h1>

      {reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={r.status === "PENDING" ? "warning" : r.status === "RESOLVED" ? "green" : "default"}>
                    {r.status}
                  </Badge>
                  <Badge variant="error">{r.reason}</Badge>
                </div>
                <span className="text-xs text-text-tertiary">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-text-secondary">
                <Link href={`/r/${r.ruleset.slug}`} className="text-text-primary hover:text-accent-green font-medium">
                  {r.ruleset.title}
                </Link>
                <span className="text-text-tertiary"> by {r.ruleset.author.name}</span>
              </div>
              {r.details && (
                <p className="text-xs text-text-tertiary mt-1">{r.details}</p>
              )}
              <div className="text-xs text-text-tertiary mt-2">
                Reported by {r.reporter.name} (@{r.reporter.username})
                {r.resolvedByUser && ` — Resolved by ${r.resolvedByUser.name}`}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-16 text-center text-text-tertiary">
          <p>No reports</p>
        </div>
      )}
    </div>
  );
}
