"use client";

import { ArrowRight, ExternalLink, MessageSquare, Pencil, Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Review } from "@/types";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Link } from "@/i18n/navigation";
import { ENVIRONMENT_META } from "@/constants/environments";
import { useMyReviews } from "@/hooks/use-my-reviews";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/components/dashboard/format";

export default function MyReviewsPage() {
  const t = useTranslations("dashboard.reviews");
  const { reviews, isLoading, error } = useMyReviews();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }
  if (error) return <ErrorState />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </header>

      {!reviews || reviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-5 w-5" />}
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <Button asChild className="bg-brand text-brand-fg hover:bg-brand/90">
              <Link href="/browse">
                {t("empty.cta")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} t={t} />
          ))}
        </ul>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  t: ReturnType<typeof useTranslations>;
}

function ReviewCard({ review, t }: ReviewCardProps) {
  const envLabel =
    ENVIRONMENT_META[review.environmentTested]?.label ??
    review.environmentTested;
  return (
    <li className="rounded-xl border border-border-soft bg-bg-surface p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={cn(
                  "h-3.5 w-3.5",
                  n <= review.rating
                    ? "fill-amber-300 text-amber-300"
                    : "fill-bg-raised text-fg-subtle",
                )}
                aria-hidden="true"
              />
            ))}
            <span className="ml-2 text-sm font-semibold text-fg">
              {review.title}
            </span>
          </div>
          <p className="text-[11px] text-fg-subtle">
            {t("verifiedOn", { env: envLabel })} ·{" "}
            {formatRelative(review.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {review.ruleset && (
            <Button
              asChild
              size="icon-xs"
              variant="ghost"
              aria-label={t("viewItem")}
              title={review.ruleset.title}
            >
              <Link href={`/r/${review.ruleset.slug}`}>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          )}
          <Button size="icon-xs" variant="ghost" aria-label={t("edit")}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label={t("delete")}
            className="text-rose-300 hover:text-rose-200"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </header>
      <p className="mt-3 text-sm text-fg-muted">{review.body}</p>
      {review.ruleset && (
        <div className="mt-3 border-t border-border-soft pt-3">
          <Link
            href={`/r/${review.ruleset.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-brand"
          >
            <ExternalLink className="h-3 w-3" aria-hidden />
            {review.ruleset.title}
          </Link>
        </div>
      )}
    </li>
  );
}
