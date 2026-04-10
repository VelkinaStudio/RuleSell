"use client";

import { Check, Eye, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

import type { QAQuestion } from "@/types";
import { VoteButtons } from "./vote-buttons";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

interface QACardProps {
  question: QAQuestion;
  userVote: number;
  onVoteUp: () => void;
  onVoteDown: () => void;
  onClick: () => void;
}

export function QACard({
  question,
  userVote,
  onVoteUp,
  onVoteDown,
  onClick,
}: QACardProps) {
  const t = useTranslations("community.qa");
  const isAnswered = question.acceptedAnswerId !== null;

  return (
    <div
      className="group flex gap-3 rounded-lg border border-border-soft bg-bg-surface p-4 transition hover:border-border-strong cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className="shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <VoteButtons
          count={question.voteCount}
          userVote={userVote}
          onVoteUp={onVoteUp}
          onVoteDown={onVoteDown}
          size="sm"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-fg group-hover:text-fg">
            {question.title}
          </h3>
          {isAnswered && (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
              <Check className="h-2.5 w-2.5" />
              {t("answered")}
            </span>
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-fg-muted">
          {question.body}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border-soft bg-bg-raised px-1.5 py-0.5 text-[10px] text-fg-subtle"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-3 text-[11px] text-fg-dim">
          <span>@{question.author.username}</span>
          <span className="inline-flex items-center gap-0.5">
            <MessageSquare className="h-3 w-3" />
            {question.answerCount} {t("answers")}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Eye className="h-3 w-3" />
            {question.viewCount}
          </span>
          <span>{formatRelative(question.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
