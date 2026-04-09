"use client";

import { BadgeCheck, Flag, Star, ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { Review } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ENVIRONMENT_META } from "@/constants/environments";
import { ReportDialog } from "@/components/compliance/report-dialog";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const t = useTranslations("ruleset.reviews");
  const envLabel = ENVIRONMENT_META[review.environmentTested]?.label ?? review.environmentTested;
  const [helpful, setHelpful] = useState(review.currentUserMarkedHelpful);
  const [count, setCount] = useState(review.helpfulCount);

  const onHelpful = () => {
    if (helpful) {
      setHelpful(false);
      setCount((c) => c - 1);
    } else {
      setHelpful(true);
      setCount((c) => c + 1);
    }
  };

  return (
    <article className="space-y-3 rounded-xl border border-border-soft bg-bg-surface p-5">
      <header className="flex items-start gap-3">
        <Link href={`/u/${review.author.username}`}>
          <Avatar size="default">
            {review.author.avatar && (
              <AvatarImage src={review.author.avatar} alt={review.author.username} />
            )}
            <AvatarFallback>
              {review.author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <Link
              href={`/u/${review.author.username}`}
              className="font-medium text-fg hover:text-brand"
            >
              @{review.author.username}
            </Link>
            <ReputationBadge
              level={review.author.level}
              points={review.author.reputation}
            />
            {review.verifiedInstall && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <BadgeCheck className="h-3 w-3" />
                {t("verifiedInstall")}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-fg-subtle">
            {t("testedOn", { env: envLabel })}
          </p>
        </div>
        <div
          className="flex shrink-0 items-center gap-0.5"
          role="img"
          aria-label={t("ratingOf5", { rating: review.rating })}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < review.rating
                  ? "fill-amber-300 text-amber-300"
                  : "text-zinc-700",
              )}
              aria-hidden
            />
          ))}
        </div>
      </header>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-fg">{review.title}</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{review.body}</p>
      </div>

      <footer className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onHelpful}
          aria-pressed={helpful}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            helpful
              ? "border-brand/60 bg-brand/10 text-brand"
              : "border-border-soft bg-bg-raised text-fg-muted hover:border-brand/40 hover:text-fg",
          )}
        >
          <ThumbsUp className="h-3 w-3" />
          {t("helpful")}
          <span className="font-mono tabular-nums">{count}</span>
        </button>
        <ReportDialog
          targetType="review"
          targetId={review.id}
          trigger={
            <button
              type="button"
              aria-label={t("reportReview")}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-fg-subtle transition hover:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Flag className="h-3 w-3" aria-hidden="true" />
            </button>
          }
        />
      </footer>
    </article>
  );
}
