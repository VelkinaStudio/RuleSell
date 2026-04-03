import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import { FollowButton } from "@/components/social/follow-button";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await db.user.findUnique({ where: { username }, select: { name: true } });
  if (!user) return { title: "Not Found — Ruleset" };
  return { title: `${user.name} — Ruleset` };
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
      bio: true,
      createdAt: true,
      _count: { select: { followers: true, following: true, rulesets: true } },
    },
  });

  if (!user) notFound();

  const { data: rulesets } = await listRulesets(
    { authorId: user.id, sort: "newest", pageSize: 20 },
    session?.user?.id,
  );

  let isFollowing = false;
  const isOwnProfile = session?.user?.id === user.id;
  if (session?.user && !isOwnProfile) {
    const follow = await db.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: user.id } },
    });
    isFollowing = !!follow;
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Profile header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-accent-purple flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {user.avatar ? (
            <Image src={user.avatar} alt={user.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            user.name[0]?.toUpperCase() || "U"
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-text-primary">{user.name}</h1>
            {!isOwnProfile && (
              <FollowButton userId={user.id} initialFollowing={isFollowing} />
            )}
          </div>
          <p className="text-sm text-text-tertiary">@{user.username}</p>
          {user.bio && <p className="text-sm text-text-secondary mt-2">{user.bio}</p>}
          <div className="flex items-center gap-4 text-sm text-text-tertiary mt-2">
            <span>{user._count.rulesets} rulesets</span>
            <span>{user._count.followers} followers</span>
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Rulesets */}
      <h2 className="text-lg font-semibold text-text-primary mb-4">Published Rulesets</h2>
      {rulesets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rulesets.map((r) => (
            <RulesetCard key={r.id} ruleset={r} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-tertiary">
          <p>No published rulesets yet</p>
        </div>
      )}
    </div>
  );
}
