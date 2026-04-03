import { db } from "@/lib/db";

export async function getReviewsForRuleset(rulesetId: string, cursor?: string, pageSize = 10) {
  const reviews = await db.review.findMany({
    where: { rulesetId },
    orderBy: { createdAt: "desc" },
    take: pageSize + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
    },
  });

  const hasNext = reviews.length > pageSize;
  if (hasNext) reviews.pop();

  return {
    reviews,
    nextCursor: hasNext && reviews.length > 0 ? reviews[reviews.length - 1].id : undefined,
  };
}

export async function recalculateAvgRating(rulesetId: string) {
  const result = await db.review.aggregate({
    where: { rulesetId, refunded: false },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await db.ruleset.update({
    where: { id: rulesetId },
    data: {
      avgRating: result._avg.rating || 0,
      ratingCount: result._count.rating,
    },
  });
}
