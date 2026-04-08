import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

/**
 * GET /api/users/[username]
 *
 * Public profile lookup. Returns basic profile fields and aggregate stats.
 * Does not expose email, passwordHash, or any other private/internal field.
 *
 * `isFollowing` reflects whether the currently authenticated user follows
 * this profile. It is always `false` for unauthenticated requests, and
 * always `false` when inspecting one's own profile.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;

    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        reputation: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errors.notFound("User not found");
    }

    const [
      rulesetCount,
      downloadsAgg,
      totalSales,
      followerCount,
      followingCount,
      avgRatingAgg,
    ] = await Promise.all([
      db.ruleset.count({
        where: { authorId: user.id, status: "PUBLISHED" },
      }),
      db.ruleset.aggregate({
        where: { authorId: user.id, status: "PUBLISHED" },
        _sum: { downloadCount: true },
      }),
      db.purchase.count({
        where: { ruleset: { authorId: user.id }, status: "COMPLETED" },
      }),
      db.follow.count({ where: { followingId: user.id } }),
      db.follow.count({ where: { followerId: user.id } }),
      db.review.aggregate({
        where: { ruleset: { authorId: user.id } },
        _avg: { rating: true },
      }),
    ]);

    const session = await auth();
    let isFollowing = false;
    if (session?.user?.id && session.user.id !== user.id) {
      const existing = await db.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!existing;
    }

    return success({
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      reputation: user.reputation,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      stats: {
        rulesetCount,
        totalDownloads: downloadsAgg._sum.downloadCount ?? 0,
        totalSales,
        followerCount,
        followingCount,
        avgRating: avgRatingAgg._avg.rating ?? 0,
      },
      isFollowing,
    });
  } catch {
    return errors.internal();
  }
}
