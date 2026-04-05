import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { rateLimit } from "@/lib/rate-limit";
import { createNotification } from "@/lib/notifications";
import { followSchema } from "@/lib/validations/engagement";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const rl = rateLimit(`follow:${session.user.id}`, 20, 60 * 1000); // 20 per minute
    if (!rl.ok) return errors.rateLimited();

    const body = await req.json();

    const parsed = followSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }
    const { userId } = parsed.data;

    if (userId === session.user.id) return errors.validation("Cannot follow yourself");

    const targetUser = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!targetUser) return errors.notFound("User not found");

    const existing = await db.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
    });

    if (existing) {
      await db.follow.delete({
        where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
      });
      return success({ following: false });
    }

    await db.follow.create({
      data: { followerId: session.user.id, followingId: userId },
    });

    await createNotification(userId, "NEW_FOLLOWER", {
      followerId: session.user.id,
      followerName: session.user.name,
      followerUsername: session.user.username,
    });

    return success({ following: true });
  } catch {
    return errors.internal();
  }
}
