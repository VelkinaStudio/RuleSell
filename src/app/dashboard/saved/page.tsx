import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import { formatCardData } from "@/lib/rulesets/queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Saved — Ruleset" };

export default async function DashboardSavedPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const savedItems = await db.savedItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      ruleset: {
        include: {
          author: { select: { id: true, username: true, name: true, avatar: true } },
          tags: { select: { tag: { select: { name: true } } } },
          _count: { select: { votes: true } },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Saved Rulesets</h1>

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedItems.map((item) => (
            <RulesetCard key={item.rulesetId} ruleset={formatCardData(item.ruleset, session.user!.id)} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-text-tertiary">
          <p className="mb-4">No saved rulesets yet</p>
          <Link href="/search" className="text-accent-green hover:underline">
            Browse the marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
