import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rulesets — Admin — Ruleset" };

export default async function AdminRulesetsPage() {
  const rulesets = await db.ruleset.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true, title: true, slug: true, status: true, platform: true, type: true, createdAt: true,
      author: { select: { name: true, username: true } },
      _count: { select: { reports: true, votes: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Content Moderation</h1>

      <div className="space-y-2">
        {rulesets.map((r) => (
          <div key={r.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/r/${r.slug}`} className="text-sm font-medium text-text-primary hover:text-accent-green">
                  {r.title}
                </Link>
                <Badge variant={
                  r.status === "PUBLISHED" ? "green" :
                  r.status === "FLAGGED" ? "error" :
                  r.status === "ARCHIVED" ? "warning" : "default"
                }>
                  {r.status}
                </Badge>
                {r._count.reports > 0 && (
                  <Badge variant="error">{r._count.reports} reports</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-text-tertiary">
                <span>by {r.author.name} (@{r.author.username})</span>
                <span>{r.platform}</span>
                <span>{r.type}</span>
                <span>{r._count.votes} votes</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
