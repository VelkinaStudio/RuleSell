import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { recalculateAvgRating } from "@/lib/reviews/queries";

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(1).max(5000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const review = await db.review.findUnique({ where: { id } });
    if (!review) return errors.notFound("Review not found");
    if (review.userId !== session.user.id) return errors.forbidden("Only the review author can edit");

    const body = await req.json();
    const parsed = updateReviewSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }
    const { rating, comment } = parsed.data;

    const updated = await db.review.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment: comment.trim() }),
      },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });

    if (rating !== undefined) {
      await recalculateAvgRating(review.rulesetId);
    }

    return success(updated);
  } catch {
    return errors.internal();
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const review = await db.review.findUnique({ where: { id } });
    if (!review) return errors.notFound("Review not found");

    const isAdmin = session.user.role === "ADMIN";
    if (review.userId !== session.user.id && !isAdmin) {
      return errors.forbidden("Only the review author or admin can delete");
    }

    await db.review.delete({ where: { id } });
    await recalculateAvgRating(review.rulesetId);

    return success({ message: "Review deleted" });
  } catch {
    return errors.internal();
  }
}
