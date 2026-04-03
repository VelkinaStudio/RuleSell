import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { getReviewsForRuleset, recalculateAvgRating } from "@/lib/reviews/queries";
import { createNotification } from "@/lib/notifications";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const result = await getReviewsForRuleset(id, cursor);
    return success(result);
  } catch {
    return errors.internal();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rulesetId } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) return errors.validation("Rating must be 1-5");
    if (!comment || comment.trim().length < 1) return errors.validation("Comment is required");

    const existing = await db.review.findFirst({
      where: { userId: session.user.id, rulesetId },
    });
    if (existing) return errors.conflict("You already reviewed this ruleset");

    const purchase = await db.purchase.findFirst({
      where: { buyerId: session.user.id, rulesetId, status: "COMPLETED" },
    });

    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { authorId: true, title: true },
    });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId === session.user.id) return errors.validation("Cannot review your own ruleset");

    const review = await db.review.create({
      data: {
        userId: session.user.id,
        rulesetId,
        rating,
        comment: comment.trim(),
        isVerifiedPurchase: !!purchase,
      },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });

    await recalculateAvgRating(rulesetId);

    await createNotification(ruleset.authorId, "NEW_REVIEW", {
      reviewId: review.id,
      rulesetId,
      rulesetTitle: ruleset.title,
      reviewerName: session.user.name,
      rating,
    });

    return success(review, 201);
  } catch {
    return errors.internal();
  }
}
