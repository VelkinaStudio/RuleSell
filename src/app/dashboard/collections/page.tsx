import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Collections — Ruleset" };

export default async function DashboardCollectionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const collections = await db.collection.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">My Collections</h1>
        <Button size="sm">New Collection</Button>
      </div>

      {collections.length > 0 ? (
        <div className="space-y-3">
          {collections.map((c) => (
            <div key={c.id} className="card p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-text-primary">{c.name}</span>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                  <Badge variant={c.isPublic ? "green" : "default"}>
                    {c.isPublic ? "Public" : "Private"}
                  </Badge>
                  <span>{c._count.items} items</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-16 text-center text-text-tertiary">
          <p>No collections yet</p>
        </div>
      )}
    </div>
  );
}
