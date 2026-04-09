import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const reviews = await db.review.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        ruleset: {
          select: {
            id: true,
            slug: true,
            title: true,
            platform: true,
            type: true,
            author: { select: { username: true } },
          },
        },
      },
    });

    const mapped = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      isVerifiedPurchase: r.isVerifiedPurchase,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      ruleset: r.ruleset,
    }));

    return success({ reviews: mapped, total: mapped.length });
  } catch {
    return errors.internal();
  }
}
