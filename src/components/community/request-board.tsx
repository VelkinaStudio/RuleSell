"use client";

import { useTranslations } from "next-intl";

import type { FeatureRequestStatus } from "@/types";
import { useFeatureRequests, type RequestSort } from "@/hooks/use-feature-requests";
import { SortFilterBar } from "./sort-filter-bar";
import { RequestCard } from "./request-card";
import { Lightbulb } from "lucide-react";

const STATUS_OPTIONS: { key: string; labelKey: string }[] = [
  { key: "open", labelKey: "status_open" },
  { key: "claimed", labelKey: "status_claimed" },
  { key: "completed", labelKey: "status_completed" },
  { key: "declined", labelKey: "status_declined" },
];

interface RequestBoardProps {
  searchQuery?: string;
}

export function RequestBoard({ searchQuery }: RequestBoardProps) {
  const t = useTranslations("community.requests");
  const {
    requests,
    sort,
    setSort,
    statusFilter,
    setStatusFilter,
    voteOnRequest,
    getUserVote,
  } = useFeatureRequests();

  const filtered = searchQuery
    ? requests.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : requests;

  return (
    <div className="space-y-4">
      <SortFilterBar
        sort={sort}
        onSortChange={(s) => setSort(s as RequestSort)}
        filterValue={statusFilter}
        onFilterChange={(v) =>
          setStatusFilter(v as FeatureRequestStatus | "all")
        }
        filterOptions={STATUS_OPTIONS}
        filterLabel={t("filterByStatus")}
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-soft bg-bg-surface/50 p-8 text-center">
          <Lightbulb className="mx-auto h-5 w-5 text-fg-dim" />
          <p className="mt-2 text-sm text-fg-muted">{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              hasVoted={getUserVote(request.id)}
              onVote={() => voteOnRequest(request.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
