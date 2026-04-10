"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAffiliateLinks } from "@/hooks/use-affiliate-links";
import { formatDate } from "@/components/dashboard/format";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function LinkTable() {
  const t = useTranslations("dashboard.affiliates");
  const { links, deleteLink } = useAffiliateLinks();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(id: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (links.length === 0) {
    return (
      <section className="rounded-xl border border-border-soft bg-bg-surface p-6 text-center">
        <p className="text-sm text-fg-muted">{t("noLinks")}</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border-soft bg-bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft bg-bg-raised/50">
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("linkTarget")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle text-right">
                {t("clicks")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle text-right">
                {t("conversions")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle text-right">
                {t("earnings")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("created")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {links.map((link) => (
              <tr
                key={link.id}
                className="transition hover:bg-bg-raised/30"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate font-medium text-fg">
                      {link.rulesetTitle ?? t("generalLink")}
                    </span>
                    {link.rulesetSlug && (
                      <ExternalLink className="h-3 w-3 shrink-0 text-fg-subtle" />
                    )}
                  </div>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-fg-dim max-w-[240px]">
                    {link.code}
                  </p>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-fg">
                  {link.clicks.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-fg">
                  {link.conversions}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-emerald-400">
                  {formatCents(link.earnings)}
                </td>
                <td className="px-4 py-3 text-xs text-fg-muted whitespace-nowrap">
                  {formatDate(link.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleCopy(link.id, link.url)}
                      title={t("copyUrl")}
                    >
                      {copiedId === link.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-fg-subtle hover:text-danger"
                      onClick={() => deleteLink(link.id)}
                      title={t("deleteLink")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
