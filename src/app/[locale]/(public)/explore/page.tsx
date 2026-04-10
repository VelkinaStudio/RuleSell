"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BarChart3, Plus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { CommunitySearch } from "@/components/community/community-search";
import {
  CommunityTabs,
  type CommunityTab,
} from "@/components/community/community-tabs";
import { DiscussionCardEnhanced } from "@/components/community/discussion-card-enhanced";
import { FeedItem } from "@/components/community/feed-item";
import { PollCard } from "@/components/community/poll-card";
import { PollCreateDialog } from "@/components/community/poll-create-dialog";
import { QACard } from "@/components/community/qa-card";
import { QADetail } from "@/components/community/qa-detail";
import { RequestBoard } from "@/components/community/request-board";
import { ShowcaseCardExpanded } from "@/components/community/showcase-card-expanded";
import { SortFilterBar } from "@/components/community/sort-filter-bar";
import { MOCK_RULESETS } from "@/constants/mock-data";
import { MOCK_SHOWCASES } from "@/constants/mock-showcases";
import { useCommunityFeed } from "@/hooks/use-community-feed";
import {
  useDiscussionsEnhanced,
  type DiscussionSort,
} from "@/hooks/use-discussions-enhanced";
import { usePolls } from "@/hooks/use-polls";
import { useQA, type QAFilter } from "@/hooks/use-qa";
import type { DiscussionCategory, QAQuestion } from "@/types";
import { heroEntrance, heroChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Map mock rulesetIds to real production slugs so explore links resolve. */
const MOCK_TO_REAL_SLUG: Record<string, string> = {
  "rs-1": "senior-engineer-cursor-rules",
  "rs-2": "refactoring-patterns-cursor",
  "rs-3": "react-component-architecture",
  "rs-4": "typescript-strict-mode-prompt",
  "rs-5": "api-design-best-practices",
  "rs-6": "security-audit-agent",
  "rs-7": "database-optimization-checklist",
  "rs-8": "api-design-best-practices",
  "rs-9": "react-component-architecture",
  "rs-10": "n8n-lead-scoring-workflow",
  "rs-11": "typescript-strict-mode-prompt",
  "rs-13": "python-code-review-prompt",
  "rs-15": "python-code-review-prompt",
  "rs-20": "security-audit-agent",
  "rs-25": "senior-engineer-cursor-rules",
};

function gradeFor(score: number): { letter: string; colorClass: string } {
  if (score >= 85) return { letter: "A", colorClass: "text-qs-a" };
  if (score >= 70) return { letter: "B", colorClass: "text-qs-b" };
  if (score >= 50) return { letter: "C", colorClass: "text-qs-c" };
  return { letter: "—", colorClass: "text-fg-muted" };
}

export default function ExplorePage() {
  const t = useTranslations("community");
  const [tab, setTab] = useState<CommunityTab>("feed");
  const [search, setSearch] = useState("");
  const reduce = useReducedMotion();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.header
        className="space-y-2"
        variants={heroEntrance}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
      >
        <motion.h1
          variants={heroChild}
          className="font-display text-2xl font-bold text-fg sm:text-3xl"
        >
          {t("title")}
        </motion.h1>
        <motion.p variants={heroChild} className="text-sm text-fg-muted">
          {t("subtitle")}
        </motion.p>
      </motion.header>

      <CommunityTabs active={tab} onChange={setTab} />

      {/* Search bar */}
      <div className="mt-4">
        <CommunitySearch value={search} onChange={setSearch} />
      </div>

      {/* Tab content with crossfade */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === "feed" && <FeedTab searchQuery={search} />}
            {tab === "discussions" && (
              <DiscussionsTab searchQuery={search} />
            )}
            {tab === "polls" && <PollsTab searchQuery={search} />}
            {tab === "qa" && <QATab searchQuery={search} />}
            {tab === "showcases" && (
              <ShowcasesTab searchQuery={search} />
            )}
            {tab === "requests" && (
              <RequestBoard searchQuery={search} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Feed Tab ─── */

function FeedTab({ searchQuery }: { searchQuery: string }) {
  const t = useTranslations("community.feed");
  const { items } = useCommunityFeed();

  const filtered = searchQuery
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.body.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : items;

  const trending = useMemo(
    () =>
      [...MOCK_RULESETS]
        .filter((r) => MOCK_TO_REAL_SLUG[r.id])
        .sort((a, b) => b.downloadCount - a.downloadCount)
        .slice(0, 10)
        .map((r) => ({ ...r, slug: MOCK_TO_REAL_SLUG[r.id] ?? r.slug })),
    [],
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-1 divide-y divide-border-soft">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-fg-muted">
            {t("empty")}
          </p>
        ) : (
          filtered.map((item) => <FeedItem key={item.id} item={item} />)
        )}
      </div>

      {/* Trending sidebar */}
      <aside className="hidden lg:block">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          {t("trending")}
        </h3>
        <ul className="mt-3 space-y-2.5">
          {trending.map((r, i) => {
            const qs = r.qualityScore ?? 0;
            const grade = gradeFor(qs);
            return (
              <li key={r.id}>
                <Link
                  href={`/r/${r.slug}`}
                  className="group flex items-baseline gap-2 text-sm"
                >
                  <span className="font-mono text-xs text-fg-dim">
                    {i + 1}
                  </span>
                  <span className="line-clamp-1 flex-1 text-fg-muted group-hover:text-fg">
                    {r.title}
                  </span>
                  {qs > 0 && (
                    <span
                      className={cn(
                        "font-mono text-[10px] tabular-nums",
                        grade.colorClass,
                      )}
                    >
                      {qs}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}

/* ─── Discussions Tab ─── */

const DISCUSSION_CATEGORY_FILTERS: { key: string; labelKey: string }[] = [
  { key: "qa", labelKey: "qa" },
  { key: "tips", labelKey: "tips" },
  { key: "bugs", labelKey: "bugs" },
  { key: "feature_request", labelKey: "feature_request" },
  { key: "showcase", labelKey: "showcase" },
];

function DiscussionsTab({ searchQuery }: { searchQuery: string }) {
  const t = useTranslations("community.discussions");
  const {
    discussions,
    sort,
    setSort,
    categoryFilter,
    setCategoryFilter,
  } = useDiscussionsEnhanced();

  const filtered = searchQuery
    ? discussions.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.body.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : discussions;

  return (
    <div className="space-y-4">
      <SortFilterBar
        sort={sort}
        onSortChange={(s) => setSort(s as DiscussionSort)}
        filterValue={categoryFilter}
        onFilterChange={(v) =>
          setCategoryFilter(v as DiscussionCategory | "all")
        }
        filterOptions={DISCUSSION_CATEGORY_FILTERS}
        filterLabel={t("filterByCategory")}
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-fg-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((d) => (
            <DiscussionCardEnhanced key={d.id} discussion={d} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Polls Tab ─── */

function PollsTab({ searchQuery }: { searchQuery: string }) {
  const t = useTranslations("community.polls");
  const { activePolls, expiredPolls, vote, votedOptions } = usePolls();
  const [showCreate, setShowCreate] = useState(false);

  const filterPolls = (polls: typeof activePolls) =>
    searchQuery
      ? polls.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : polls;

  const filteredActive = filterPolls(activePolls);
  const filteredExpired = filterPolls(expiredPolls);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-fg-dim" />
          <span className="text-sm font-medium text-fg-muted">
            {filteredActive.length} {t("active")} / {filteredExpired.length}{" "}
            {t("expired")}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1 rounded-lg border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand transition hover:bg-brand/20"
        >
          <Plus className="h-3 w-3" />
          {t("createNew")}
        </button>
      </div>

      {/* Active polls */}
      {filteredActive.length > 0 && (
        <div className="space-y-3">
          {filteredActive.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              votedOptionId={votedOptions[poll.id]}
              onVote={(optionId) => vote(poll.id, optionId)}
            />
          ))}
        </div>
      )}

      {/* Expired polls */}
      {filteredExpired.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {t("expired")}
          </h3>
          {filteredExpired.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              votedOptionId={votedOptions[poll.id]}
              onVote={(optionId) => vote(poll.id, optionId)}
            />
          ))}
        </div>
      )}

      {filteredActive.length === 0 && filteredExpired.length === 0 && (
        <p className="py-8 text-center text-sm text-fg-muted">
          {t("empty")}
        </p>
      )}

      <PollCreateDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}

/* ─── Q&A Tab ─── */

const QA_FILTER_OPTIONS = [
  { key: "answered", labelKey: "answered" },
  { key: "unanswered", labelKey: "unanswered" },
];

function QATab({ searchQuery }: { searchQuery: string }) {
  const t = useTranslations("community.qa");
  const {
    questions,
    filter,
    setFilter,
    answersForQuestion,
    voteOnItem,
    getUserVote,
  } = useQA();
  const [selectedQuestion, setSelectedQuestion] =
    useState<QAQuestion | null>(null);

  const filtered = searchQuery
    ? questions.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.body.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : questions;

  if (selectedQuestion) {
    const answers = answersForQuestion(selectedQuestion.id);
    return (
      <QADetail
        question={selectedQuestion}
        answers={answers}
        questionVote={getUserVote(selectedQuestion.id)}
        getAnswerVote={(id) => getUserVote(id)}
        onVoteQuestion={(dir) => voteOnItem(selectedQuestion.id, dir)}
        onVoteAnswer={(id, dir) => voteOnItem(id, dir)}
        onBack={() => setSelectedQuestion(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <SortFilterBar
        sort={filter}
        onSortChange={(s) => setFilter(s as QAFilter)}
        sortOptions={[
          { key: "all", labelKey: "hot" },
          { key: "answered", labelKey: "top" },
          { key: "unanswered", labelKey: "new" },
        ]}
      />

      {/* Filter pills */}
      <div className="flex gap-2">
        {(["all", "answered", "unanswered"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs transition",
              filter === f
                ? "border-fg/20 bg-fg/5 text-fg"
                : "border-border-soft text-fg-subtle hover:text-fg-muted",
            )}
          >
            {f === "all"
              ? t("all")
              : f === "answered"
                ? t("answeredOnly")
                : t("unansweredOnly")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-fg-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => (
            <QACard
              key={q.id}
              question={q}
              userVote={getUserVote(q.id)}
              onVoteUp={() => voteOnItem(q.id, "up")}
              onVoteDown={() => voteOnItem(q.id, "down")}
              onClick={() => setSelectedQuestion(q)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Showcases Tab ─── */

function ShowcasesTab({ searchQuery }: { searchQuery: string }) {
  const t = useTranslations("community.showcases");

  const filtered = searchQuery
    ? MOCK_SHOWCASES.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : MOCK_SHOWCASES;

  return (
    <div className="space-y-4">
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-fg-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((s) => (
            <ShowcaseCardExpanded key={s.id} showcase={s} />
          ))}
        </div>
      )}
      <div className="rounded-lg border border-dashed border-border-soft bg-bg-surface/50 p-6 text-center">
        <Sparkles className="mx-auto h-5 w-5 text-brand" />
        <p className="mt-2 text-sm text-fg-muted">{t("submitTitle")}</p>
        <button
          type="button"
          className="mt-3 rounded-lg border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-medium text-brand transition hover:bg-brand/20"
        >
          {t("submitButton")}
        </button>
      </div>
    </div>
  );
}
