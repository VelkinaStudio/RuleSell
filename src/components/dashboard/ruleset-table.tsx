"use client";

import { useMemo, useState } from "react";
import { PackagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Status } from "@/types";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { useRulesets } from "@/hooks/use-rulesets";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { RulesetRow } from "./ruleset-row";

type TabKey = "all" | "published" | "draft" | "pending" | "unpublished";

const TAB_TO_STATUS: Record<TabKey, Status | undefined> = {
  all: undefined,
  published: "PUBLISHED",
  draft: "DRAFT",
  pending: "DRAFT",
  unpublished: "ARCHIVED",
};

interface RulesetTableProps {
  initialTab?: TabKey;
}

export function RulesetTable({ initialTab = "all" }: RulesetTableProps) {
  const t = useTranslations("dashboard.rulesets");
  const tCols = useTranslations("dashboard.rulesets.columns");
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const [tab, setTab] = useState<TabKey>(initialTab);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Pull all of the user's items, then filter client-side by status. Doing
  // this here means switching tabs is instant — no extra fetch.
  const query = useMemo(
    () =>
      userId
        ? { authorId: userId, pageSize: 50 }
        : { pageSize: 1 },
    [userId],
  );
  const { data, error, isLoading } = useRulesets(query);

  const allItems = useMemo(() => data?.data ?? [], [data]);
  const filteredItems = useMemo(() => {
    const status = TAB_TO_STATUS[tab];
    if (!status) return allItems;
    return allItems.filter((r) => r.status === status);
  }, [allItems, tab]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === filteredItems.length
        ? new Set()
        : new Set(filteredItems.map((r) => r.id)),
    );
  };

  const tabKeys: TabKey[] = ["all", "published", "draft", "pending", "unpublished"];

  if (error) return <ErrorState />;

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <TabsList variant="line" className="border-b border-border-soft">
          {tabKeys.map((k) => (
            <TabsTrigger key={k} value={k}>
              {t(`tabs.${k}`)}
              {k === "all" && allItems.length > 0 && (
                <span className="ml-1 rounded-full bg-bg-raised px-1.5 text-[10px] font-semibold tabular-nums text-fg-muted">
                  {allItems.length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {selected.size > 0 && (
        <BulkActionBar
          count={selected.size}
          onClear={() => setSelected(new Set())}
        />
      )}

      {isLoading ? (
        <LoadingSkeleton variant="list-row" count={5} />
      ) : filteredItems.length === 0 ? (
        allItems.length === 0 ? (
          <EmptyState
            icon={<PackagePlus className="h-5 w-5" />}
            title={t("empty.title")}
            description={t("empty.description")}
            action={
              <Button
                asChild
                className="bg-brand text-brand-fg hover:bg-brand/90"
              >
                <Link href="/dashboard/rulesets/new">{t("empty.cta")}</Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            title={t("emptyFiltered.title")}
            description={t("emptyFiltered.description")}
          />
        )
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-soft bg-bg-surface">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-soft text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={
                      filteredItems.length > 0 &&
                      selected.size === filteredItems.length
                    }
                    onCheckedChange={toggleAll}
                    aria-label={t("bulk.selectAllRows")}
                  />
                </th>
                <th className="px-4 py-3">{tCols("title")}</th>
                <th className="px-4 py-3">{tCols("status")}</th>
                <th className="px-4 py-3">{tCols("quality")}</th>
                <th className="px-4 py-3 text-right">{tCols("installs")}</th>
                <th className="px-4 py-3 text-right">{tCols("revenue")}</th>
                <th className="px-4 py-3">{tCols("updated")}</th>
                <th className="w-10 px-4 py-3 text-right">
                  <span className="sr-only">{tCols("actions")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((r) => (
                <RulesetRow
                  key={r.id}
                  ruleset={r}
                  selected={selected.has(r.id)}
                  onToggle={toggle}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BulkActionBar({
  count,
  onClear,
}: {
  count: number;
  onClear: () => void;
}) {
  const t = useTranslations("dashboard.rulesets.bulk");
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-3 py-2",
      )}
    >
      <span className="text-xs font-medium text-brand">
        {t("selectedCount", { count })}
      </span>
      <div className="ml-auto flex items-center gap-1">
        <Button size="xs" variant="outline">
          {t("publish")}
        </Button>
        <Button size="xs" variant="outline">
          {t("unpublish")}
        </Button>
        <Button size="xs" variant="outline">
          {t("delete")}
        </Button>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={onClear}
          aria-label={t("clear")}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
