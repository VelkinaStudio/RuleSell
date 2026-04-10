"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { Environment, Ruleset } from "@/types";
import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { RatingDistribution } from "@/components/product/rating-distribution";
import { useReviews } from "@/hooks/use-reviews";
import { useSession } from "@/hooks/use-session";

interface ReviewListProps {
  ruleset: Ruleset;
}

export function ReviewList({ ruleset }: ReviewListProps) {
  const t = useTranslations("ruleset.reviews");
  const { data, error, isLoading, mutate } = useReviews({
    rulesetId: ruleset.id,
    page: 1,
    pageSize: 50,
  });
  const { data: session } = useSession();

  const sortedReviews = useMemo(() => {
    if (!data) return [];
    return [...data.data].sort((a, b) => {
      if ((b.helpfulCount ?? 0) !== (a.helpfulCount ?? 0)) return (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data]);

  const ratingBuckets = useMemo(() => {
    if (!data) return [];
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const review of data.data) {
      const star = Math.round(review.rating);
      if (star >= 1 && star <= 5) counts[star]++;
    }
    return [5, 4, 3, 2, 1].map((star) => ({ star, count: counts[star] }));
  }, [data]);

  const isCertified =
    session?.user?.creatorMarks?.includes("CERTIFIED_DEV") ?? false;
  const hasAccess =
    ruleset.currentUserAccess === "PURCHASED" ||
    ruleset.currentUserAccess === "FREE_DOWNLOAD" ||
    ruleset.currentUserAccess === "SUBSCRIPTION_ACTIVE";
  const canWrite = isCertified && hasAccess;

  const onWriteReview = (review: {
    rating: number;
    title: string;
    body: string;
    environment: Environment;
  }) => {
    // Optimistic local mutation — append to current page and revalidate.
    if (!session?.user) return;
    if (!data) return;
    void review;
    mutate();
  };

  return (
    <section
      id="reviews"
      className="space-y-5 rounded-2xl border border-border-soft bg-bg-surface p-6"
    >
      <header className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold uppercase tracking-wider text-fg">
            {t("title")}
          </h2>
          <p className="text-sm text-fg-muted">{t("subtitle")}</p>
        </div>
        {ratingBuckets.length > 0 && ratingBuckets.some((b) => b.count > 0) && (
          <RatingDistribution ratings={ratingBuckets} className="max-w-xs" />
        )}
      </header>

      {canWrite ? (
        <ReviewForm ruleset={ruleset} onSubmit={onWriteReview} />
      ) : (
        <p className="rounded-lg border border-border-soft bg-bg-raised/40 px-4 py-3 text-xs text-fg-muted">
          {t("form.ineligible")}
        </p>
      )}

      {error && (
        <ErrorState
          message={(error as Error)?.message}
          retry={() => mutate()}
        />
      )}

      {isLoading && !error && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-border-soft bg-bg-raised/40"
            />
          ))}
        </div>
      )}

      {!isLoading && !error && sortedReviews.length > 0 && (
        <div className="space-y-3">
          {sortedReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      {!isLoading && !error && sortedReviews.length === 0 && (
        <EmptyState title={t("empty")} />
      )}
    </section>
  );
}
