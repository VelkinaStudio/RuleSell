"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  GitFork,
  Lock,
  Search,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { GitHubRepo } from "@/types";
import { useGitHubRepos } from "@/hooks/use-github-repos";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";
import { OrgBadge } from "./org-badge";

interface RepoPickerProps {
  selectedRepo: GitHubRepo | null;
  onSelect: (repo: GitHubRepo) => void;
  className?: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-400",
  Python: "bg-yellow-400",
  JSON: "bg-emerald-400",
  JavaScript: "bg-amber-300",
};

export function RepoPicker({ selectedRepo, onSelect, className }: RepoPickerProps) {
  const t = useTranslations("github.repoPicker");
  const [query, setQuery] = useState("");
  const { repos, total, page, hasNext, hasPrev, setPage, isClaimed } =
    useGitHubRepos({ query, pageSize: 8 });

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={t("searchPlaceholder")}
          className="pl-9 text-sm"
        />
      </div>

      <ScrollArea className="h-[320px] rounded-md border border-border-soft">
        <div className="divide-y divide-border-soft">
          {repos.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-fg-muted">
              {t("noResults")}
            </p>
          )}
          {repos.map((repo) => {
            const claimed = isClaimed(repo.fullName);
            const selected = selectedRepo?.id === repo.id;
            return (
              <button
                key={repo.id}
                type="button"
                onClick={() => {
                  if (!claimed) onSelect(repo);
                }}
                disabled={claimed}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                  selected
                    ? "bg-brand/10 ring-1 ring-inset ring-brand/30"
                    : "hover:bg-bg-raised/60",
                  claimed && "cursor-not-allowed opacity-50",
                )}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-fg">
                      {repo.owner}/
                      <span className="font-semibold">{repo.name}</span>
                    </span>
                    {repo.isPrivate && (
                      <Lock className="h-3 w-3 shrink-0 text-fg-subtle" />
                    )}
                    {claimed && (
                      <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-px text-[10px] text-amber-400">
                        {t("claimed")}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-1 text-xs text-fg-muted">
                    {repo.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-fg-subtle">
                    {repo.language && (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            LANG_COLORS[repo.language] ?? "bg-fg-dim",
                          )}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="h-3 w-3" />
                      {repo.starCount.toLocaleString()}
                    </span>
                    <span>{formatRelative(repo.lastCommitAt)}</span>
                  </div>
                  {repo.org && (
                    <OrgBadge
                      name={repo.org.name}
                      verified={repo.org.verified}
                      avatarUrl={repo.org.avatarUrl}
                      className="mt-1"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Pagination */}
      {total > 8 && (
        <div className="flex items-center justify-between text-xs text-fg-subtle">
          <span>
            {t("showing", { count: repos.length, total })}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={!hasPrev}
              className="rounded p-1 transition hover:text-fg disabled:opacity-30"
              aria-label={t("prevPage")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={!hasNext}
              className="rounded p-1 transition hover:text-fg disabled:opacity-30"
              aria-label={t("nextPage")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
