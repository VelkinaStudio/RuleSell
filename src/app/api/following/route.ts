import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const follows = await db.follow.findMany({
      where: { followerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            reputation: true,
            _count: { select: { rulesets: true } },
          },
        },
      },
    });

    // For each followed user, get their most recent published ruleset
    const followedUserIds = follows.map((f) => f.followingId);

    const latestRulesets = followedUserIds.length > 0
      ? await db.ruleset.findMany({
          where: {
            authorId: { in: followedUserIds },
            status: "PUBLISHED",
          },
          orderBy: { createdAt: "desc" },
          distinct: ["authorId"],
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            platform: true,
            type: true,
            createdAt: true,
            authorId: true,
          },
        })
      : [];

    const latestByAuthor = new Map(
      latestRulesets.map((r) => [r.authorId, r]),
    );

    const following = follows.map((f) => {
      const latest = latestByAuthor.get(f.followingId) ?? null;
      return {
        user: {
          id: f.following.id,
          username: f.following.username,
          name: f.following.name,
          avatar: f.following.avatar,
          reputation: f.following.reputation,
          rulesetCount: f.following._count.rulesets,
          followedAt: f.createdAt.toISOString(),
        },
        latest,
      };
    });

    // Sort: users with recent rulesets first
    following.sort((a, b) => {
      if (a.latest && !b.latest) return -1;
      if (!a.latest && b.latest) return 1;
      if (a.latest && b.latest) {
        return new Date(b.latest.createdAt).getTime() - new Date(a.latest.createdAt).getTime();
      }
      return 0;
    });

    return success({ following, total: following.length });
  } catch {
    return errors.internal();
  }
}
