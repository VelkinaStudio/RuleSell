"use client";

import { useState } from "react";
import { Check, Copy, Link2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAffiliateLinks } from "@/hooks/use-affiliate-links";

export function LinkGenerator() {
  const t = useTranslations("dashboard.affiliates");
  const { createLink, availableRulesets } = useAffiliateLinks();
  const [selectedRuleset, setSelectedRuleset] = useState<string>("general");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    const rulesetId =
      selectedRuleset === "general" ? null : selectedRuleset;
    const link = createLink(rulesetId);
    setGeneratedUrl(link.url);
    setCopied(false);
  }

  function handleCopy() {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="rounded-xl border border-border-soft bg-bg-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="h-4 w-4 text-brand" />
        <h2 className="text-sm font-semibold text-fg">{t("generateLink")}</h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="ruleset-select"
            className="mb-1.5 block text-xs font-medium text-fg-muted"
          >
            {t("selectRuleset")}
          </label>
          <select
            id="ruleset-select"
            value={selectedRuleset}
            onChange={(e) => {
              setSelectedRuleset(e.target.value);
              setGeneratedUrl(null);
            }}
            className="w-full rounded-lg border border-border-soft bg-bg-raised px-3 py-2 text-sm text-fg focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="general">{t("generalLink")}</option>
            {availableRulesets.map((rs) => (
              <option key={rs.id} value={rs.id}>
                {rs.title}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="button"
          variant="default"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={handleGenerate}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("generate")}
        </Button>
      </div>

      {generatedUrl && (
        <div className="mt-4 flex items-stretch gap-2">
          <div className="flex-1 rounded-lg border border-brand/20 bg-brand/5 px-4 py-2.5 font-mono text-sm font-medium tracking-tight text-fg overflow-hidden overflow-ellipsis whitespace-nowrap">
            {generatedUrl}
          </div>
          <Button
            type="button"
            variant={copied ? "default" : "outline"}
            size="sm"
            className={cn(
              "shrink-0 gap-1.5 transition-all",
              copied &&
                "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700",
            )}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                {t("copied")}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                {t("copy")}
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
