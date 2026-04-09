"use client";

import { MessageSquare, Radio, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { DiscussionList } from "@/components/community/discussion-list";
import { MOCK_DISCUSSIONS } from "@/constants/mock-discussions";
import { MOCK_SHOWCASES } from "@/constants/mock-showcases";
import { MOCK_RULESETS } from "@/constants/mock-data";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

type Tab = "feed" | "discussions" | "showcases";

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-fg">Explore</h1>
        <p className="text-sm text-fg-muted">Community activity, discussions, and showcases.</p>
      </header>

      {/* Tab bar */}
      <div className="mt-6 flex gap-1 border-b border-border-soft">
        <TabButton active={tab === "feed"} onClick={() => setTab("feed")} icon={Radio}>
          Feed
        </TabButton>
        <TabButton active={tab === "discussions"} onClick={() => setTab("discussions")} icon={MessageSquare}>
          Discussions
        </TabButton>
        <TabButton active={tab === "showcases"} onClick={() => setTab("showcases")} icon={Sparkles}>
          Showcases
        </TabButton>
      </div>

      <div className="mt-6">
        {tab === "feed" && <FeedTab />}
        {tab === "discussions" && <DiscussionsTab />}
        {tab === "showcases" && <ShowcasesTab />}
      </div>
    </div>
  );
}

function TabButton({
  active, onClick, icon: Icon, children,
}: {
  active: boolean; onClick: () => void; icon: typeof Radio; children: React.ReactNode;
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
      {active && <span aria-hidden className="absolute inset-x-3 -bottom-px h-px bg-fg" />}
    </button>
  );
}

function FeedTab() {
  // Mock feed from discussions + showcases
  const items = useMemo(() => {
    const feed = [
      ...MOCK_DISCUSSIONS.slice(0, 8).map((d) => ({
        id: `feed-disc-${d.id}`,
        kind: "discussion" as const,
        title: d.title,
        body: `New discussion on ${MOCK_RULESETS.find((r) => r.id === d.rulesetId)?.title ?? "an item"}`,
        href: `/r/${MOCK_RULESETS.find((r) => r.id === d.rulesetId)?.slug ?? d.rulesetId}`,
        createdAt: d.createdAt,
      })),
      ...MOCK_SHOWCASES.map((s) => ({
        id: `feed-show-${s.id}`,
        kind: "showcase" as const,
        title: s.title,
        body: `New showcase by @${s.author.username}`,
        href: "/explore",
        createdAt: s.createdAt,
      })),
    ];
    return feed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, []);

  // Trending sidebar items
  const trending = useMemo(
    () => [...MOCK_RULESETS].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 5),
    [],
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-1 divide-y divide-border-soft">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-start gap-3 py-3 transition hover:bg-bg-surface/50"
          >
            {item.kind === "discussion" ? (
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-fg-dim" />
            ) : (
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-fg-dim" />
            )}
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm text-fg group-hover:text-fg">{item.title}</p>
              <p className="mt-0.5 text-xs text-fg-dim">{item.body}</p>
            </div>
            <span className="shrink-0 text-[10px] text-fg-dim">{formatRelative(item.createdAt)}</span>
          </Link>
        ))}
      </div>
      <aside className="hidden lg:block">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Trending this week</h3>
        <ul className="mt-3 space-y-2">
          {trending.map((r, i) => (
            <li key={r.id}>
              <Link href={`/r/${r.slug}`} className="group flex items-baseline gap-2 text-sm">
                <span className="font-mono text-xs text-fg-dim">{i + 1}</span>
                <span className="line-clamp-1 text-fg-muted group-hover:text-fg">{r.title}</span>
              </Link>
            </li>
          ))}
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
            className="rounded-lg border border-border-soft bg-bg-surface p-4 transition hover:border-border-strong"
          >
            <h3 className="text-sm font-medium text-fg">{s.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-fg-muted">{s.description}</p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-fg-dim">
              <span>@{s.author.username}</span>
              <span>{s.reactionCount} reactions</span>
              <span>{formatRelative(s.createdAt)}</span>
            </div>
            {s.rulesetIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
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
        <Sparkles className="mx-auto h-5 w-5 text-fg-dim" />
        <p className="mt-2 text-sm text-fg-muted">Built something with a RuleSell asset?</p>
        <button
          type="button"
          disabled
          className="mt-2 rounded border border-border-soft px-3 py-1.5 text-xs font-medium text-fg-muted"
        >
          Submit a Showcase (coming soon)
        </button>
      </div>
    </div>
  );
}
