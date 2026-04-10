"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Radio, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { DiscussionList } from "@/components/community/discussion-list";
import { MOCK_DISCUSSIONS } from "@/constants/mock-discussions";
import { MOCK_SHOWCASES } from "@/constants/mock-showcases";
import { MOCK_RULESETS } from "@/constants/mock-data";
import { heroEntrance, heroChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

type Tab = "feed" | "discussions" | "showcases";

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
  const [tab, setTab] = useState<Tab>("feed");
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
          Explore
        </motion.h1>
        <motion.p variants={heroChild} className="text-sm text-fg-muted">
          Community activity, discussions, and showcases.
        </motion.p>
      </motion.header>

      {/* Tab bar */}
      <div className="mt-6 flex gap-1 border-b border-border-soft">
        <TabButton
          active={tab === "feed"}
          onClick={() => setTab("feed")}
          icon={Radio}
        >
          Feed
        </TabButton>
        <TabButton
          active={tab === "discussions"}
          onClick={() => setTab("discussions")}
          icon={MessageSquare}
        >
          Discussions
        </TabButton>
        <TabButton
          active={tab === "showcases"}
          onClick={() => setTab("showcases")}
          icon={Sparkles}
        >
          Showcases
        </TabButton>
      </div>

      {/* Tab content with crossfade */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tab === "feed" && (
            <motion.div
              key="feed"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <FeedTab />
            </motion.div>
          )}
          {tab === "discussions" && (
            <motion.div
              key="discussions"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <DiscussionsTab />
            </motion.div>
          )}
          {tab === "showcases" && (
            <motion.div
              key="showcases"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ShowcasesTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Radio;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative -mb-px inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20",
        active ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand"
        />
      )}
    </button>
  );
}

function FeedTab() {
  const items = useMemo(() => {
    const feed = [
      ...MOCK_DISCUSSIONS.slice(0, 8).map((d) => {
        const realSlug = MOCK_TO_REAL_SLUG[d.rulesetId];
        const ruleset = MOCK_RULESETS.find((r) => r.id === d.rulesetId);
        return {
          id: `feed-disc-${d.id}`,
          kind: "discussion" as const,
          title: d.title,
          body: `New discussion on ${ruleset?.title ?? "an item"}`,
          href: realSlug ? `/r/${realSlug}` : null,
          createdAt: d.createdAt,
        };
      }),
      ...MOCK_SHOWCASES.map((s) => {
        const firstId = s.rulesetIds[0];
        const realSlug = firstId ? MOCK_TO_REAL_SLUG[firstId] : null;
        return {
          id: `feed-show-${s.id}`,
          kind: "showcase" as const,
          title: s.title,
          body: `New showcase by @${s.author.username}`,
          href: realSlug ? `/r/${realSlug}` : null,
          createdAt: s.createdAt,
        };
      }),
    ];
    return feed.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, []);

  // Trending sidebar items — use real production slugs
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
        {items.map((item) => {
          const inner = (
            <>
              <div className="flex items-center gap-2">
                {item.kind === "discussion" ? (
                  <MessageSquare className="h-4 w-4 shrink-0 text-fg-dim" />
                ) : (
                  <Sparkles className="h-4 w-4 shrink-0 text-fg-dim" />
                )}
                <span
                  className={cn(
                    "rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
                    item.kind === "discussion"
                      ? "border-info/30 text-info"
                      : "border-brand/30 text-brand",
                  )}
                >
                  {item.kind === "discussion" ? "discussion" : "showcase"}
                </span>
              </div>
              <div className="mt-1.5 min-w-0 flex-1">
                <p className="line-clamp-1 text-sm text-fg group-hover:text-fg">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-fg-dim">{item.body}</p>
              </div>
              <span className="mt-1.5 shrink-0 text-[10px] text-fg-dim">
                {formatRelative(item.createdAt)}
              </span>
            </>
          );
          return item.href ? (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col py-3 transition hover:bg-bg-surface/50 sm:flex-row sm:items-start sm:gap-3"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={item.id}
              className="flex flex-col py-3 sm:flex-row sm:items-start sm:gap-3"
            >
              {inner}
            </div>
          );
        })}
      </div>

      {/* Trending sidebar */}
      <aside className="hidden lg:block">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Trending this week
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

function DiscussionsTab() {
  return <DiscussionList discussions={MOCK_DISCUSSIONS} />;
}

function ShowcasesTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MOCK_SHOWCASES.map((s) => (
          <div
            key={s.id}
            className="rounded-lg border border-border-soft bg-bg-surface p-5 transition hover:border-border-strong"
          >
            <h3 className="text-sm font-semibold text-fg">{s.title}</h3>
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-fg-muted">
              {s.description}
            </p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-fg-dim">
              <span className="font-medium">@{s.author.username}</span>
              <span>{s.reactionCount} reactions</span>
              <span>{formatRelative(s.createdAt)}</span>
            </div>
            {s.rulesetIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {s.rulesetIds.map((id) => {
                  const ruleset = MOCK_RULESETS.find((r) => r.id === id);
                  return ruleset ? (
                    <span
                      key={id}
                      className="rounded border border-border-soft bg-bg-raised px-1.5 py-0.5 text-[10px] text-fg-subtle"
                    >
                      {ruleset.title}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-dashed border-border-soft bg-bg-surface/50 p-6 text-center">
        <Sparkles className="mx-auto h-5 w-5 text-brand" />
        <p className="mt-2 text-sm text-fg-muted">
          Built something with a RuleSell asset?
        </p>
        <button
          type="button"
          className="mt-3 rounded-lg border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-medium text-brand transition hover:bg-brand/20"
        >
          Submit a Showcase
        </button>
      </div>
    </div>
  );
}
