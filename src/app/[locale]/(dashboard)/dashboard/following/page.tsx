"use client";

import { ArrowRight, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { Link } from "@/i18n/navigation";
import { useFollowing } from "@/hooks/use-following";

export default function FollowingPage() {
  const t = useTranslations("dashboard.following");
  const { following, unfollow, isLoading, error } = useFollowing();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton variant="list-row" count={5} />
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

      {!following || following.length === 0 ? (
        <EmptyState
          icon={<UserPlus className="h-5 w-5" />}
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <Button asChild className="bg-brand text-brand-fg hover:bg-brand/90">
              <Link href="/leaderboard">
                {t("empty.cta")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {following.map(({ user, latest }) => {
            const initials = user.username
              .split(/[-_ ]+/)
              .map((s) => s[0]?.toUpperCase() ?? "")
              .slice(0, 2)
              .join("");
            return (
              <li
                key={user.username}
                className="flex items-start gap-3 rounded-xl border border-border-soft bg-bg-surface p-4 transition hover:border-border-strong"
              >
                <Avatar className="h-10 w-10 border border-border-soft">
                  <AvatarFallback className="bg-bg-raised text-xs font-semibold text-fg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/u/${user.username}`}
                      className="truncate text-sm font-semibold text-fg hover:text-brand"
                    >
                      {user.name}
                    </Link>
                    <ReputationBadge
                      level={user.level}
                      points={user.reputation}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-fg-muted">@{user.username}</p>
                  <p className="mt-2 text-xs text-fg-subtle">
                    <span className="font-medium text-fg-muted">
                      {t("latest")}{" "}
                    </span>
                    {latest ? (
                      <Link
                        href={`/r/${latest.slug}`}
                        className="text-fg hover:text-brand"
                      >
                        {latest.title}
                      </Link>
                    ) : (
                      <span>{t("noLatest")}</span>
                    )}
                  </p>
                </div>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => unfollow(user.username)}
                >
                  {t("unfollow")}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
