import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Creators — Ruleset" };

export default async function CreatorsPage() {
  const creators = await db.user.findMany({
    where: {
      rulesets: { some: { status: "PUBLISHED" } },
    },
    orderBy: { totalEarnings: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          rulesets: { where: { status: "PUBLISHED" } },
          followers: true,
        },
      },
    },
  });

  return (
    <div className="container-page section-gap">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Creators</h1>
        <p className="text-sm text-text-tertiary">
          Discover the builders behind the best AI assets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creators.map((creator) => (
          <Link
            key={creator.id}
            href={`/u/${creator.username}`}
            className="card-hover p-5 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-purple/20 border border-border-primary flex items-center justify-center text-lg font-bold text-text-secondary shrink-0">
              {creator.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-text-primary truncate">
                  {creator.name}
                </span>
                {creator.role === "PRO" && <Badge variant="green">Pro</Badge>}
              </div>
              <p className="text-xs text-text-tertiary mb-2">@{creator.username}</p>
              {creator.bio && (
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                  {creator.bio}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-text-tertiary">
                <span>{creator._count.rulesets} products</span>
                <span>{creator._count.followers} followers</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {creators.length === 0 && (
        <div className="card py-16 text-center text-text-tertiary">
          <p>No creators yet. Be the first to publish!</p>
        </div>
      )}
    </div>
  );
}
