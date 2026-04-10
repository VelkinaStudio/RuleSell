"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useTranslations } from "next-intl";

import type { QAAnswer, QAQuestion } from "@/types";
import { VoteButtons } from "./vote-buttons";
import { ReplyComposer } from "./reply-composer";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

interface QADetailProps {
  question: QAQuestion;
  answers: QAAnswer[];
  questionVote: number;
  getAnswerVote: (answerId: string) => number;
  onVoteQuestion: (dir: "up" | "down") => void;
  onVoteAnswer: (answerId: string, dir: "up" | "down") => void;
  onBack: () => void;
}

export function QADetail({
  question,
  answers,
  questionVote,
  getAnswerVote,
  onVoteQuestion,
  onVoteAnswer,
  onBack,
}: QADetailProps) {
  const t = useTranslations("community.qa");
  const sorted = [...answers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return b.voteCount - a.voteCount;
  });

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-fg-subtle hover:text-fg-muted transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("backToQuestions")}
      </button>

      {/* Question */}
      <div className="flex gap-3 rounded-lg border border-border-soft bg-bg-surface p-5">
        <VoteButtons
          count={question.voteCount}
          userVote={questionVote}
          onVoteUp={() => onVoteQuestion("up")}
          onVoteDown={() => onVoteQuestion("down")}
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-fg">{question.title}</h2>
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
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            {question.body}
          </p>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-fg-dim">
            <span className="font-medium">@{question.author.username}</span>
            <span>{question.author.reputation} rep</span>
            <span>{formatRelative(question.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-fg-muted">
          {answers.length} {t("answers")}
        </h3>

        {sorted.map((answer) => (
          <div
            key={answer.id}
            className={cn(
              "flex gap-3 rounded-lg border p-4",
              answer.isAccepted
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-border-soft bg-bg-surface",
            )}
          >
            <VoteButtons
              count={answer.voteCount}
              userVote={getAnswerVote(answer.id)}
              onVoteUp={() => onVoteAnswer(answer.id, "up")}
              onVoteDown={() => onVoteAnswer(answer.id, "down")}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              {answer.isAccepted && (
                <span className="mb-2 inline-flex items-center gap-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  <Check className="h-2.5 w-2.5" />
                  {t("acceptedAnswer")}
                </span>
              )}
              <p className="text-sm leading-relaxed text-fg-muted">
                {answer.body}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-fg-dim">
                <span className="font-medium">
                  @{answer.author.username}
                </span>
                <span>{answer.author.reputation} rep</span>
                <span>{formatRelative(answer.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReplyComposer placeholder={t("answerPlaceholder")} />
    </div>
  );
}
