"use client";

import { useTranslations } from "next-intl";

import type { Category, Platform, Type } from "@/types";

import { Label } from "@/components/ui/label";
import { CATEGORY_META, CATEGORY_ORDER } from "@/constants/categories";
import { cn } from "@/lib/utils";
import type { WizardDraft } from "@/hooks/use-publish-draft";

interface Props {
  draft: WizardDraft;
  onChange: (patch: WizardDraft) => void;
}

const TYPES: Type[] = ["RULESET", "PROMPT", "WORKFLOW", "AGENT", "BUNDLE", "DATASET"];
const PLATFORMS: Platform[] = [
  "CURSOR",
  "VSCODE",
  "CLAUDE",
  "CHATGPT",
  "GEMINI",
  "OBSIDIAN",
  "N8N",
  "MAKE",
  "OTHER",
];

const TYPE_DESCRIPTIONS: Record<Type, string> = {
  RULESET: "Context files and style rules for AI editors.",
  PROMPT: "System prompts and prompt libraries.",
  WORKFLOW: "n8n / Make automations and workflow blueprints.",
  AGENT: "Multi-agent crews, roles, orchestration graphs.",
  BUNDLE: "Curated multi-item drops priced as one.",
  DATASET: "Training, evaluation, or retrieval data.",
};

export function WizardStepType({ draft, onChange }: Props) {
  const t = useTranslations("publishWizard.type");

  const setType = (type: Type) => onChange({ type });
  const setCategory = (category: Category) => onChange({ category });
  const setPlatform = (platform: Platform) => onChange({ platform });
  const toggleSecondary = (cat: Category) => {
    const current = draft.secondaryCategories ?? [];
    const has = current.includes(cat);
    let next: Category[];
    if (has) next = current.filter((c) => c !== cat);
    else if (current.length >= 2) return;
    else next = [...current, cat];
    onChange({ secondaryCategories: next });
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{t("description")}</p>
      </header>

      {/* Type */}
      <section className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          {t("typeLabel")}
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TYPES.map((type) => {
            const active = draft.type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setType(type)}
                aria-pressed={active}
                className={cn(
                  "rounded-lg border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                  active
                    ? "border-brand bg-brand/10"
                    : "border-border-soft bg-bg-raised/40 hover:border-border-strong",
                )}
              >
                <p className={cn("text-sm font-medium", active ? "text-brand" : "text-fg")}>
                  {type}
                </p>
                <p className="mt-0.5 text-[11px] text-fg-subtle">
                  {TYPE_DESCRIPTIONS[type]}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Primary category */}
      <section className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          {t("categoryLabel")}
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = draft.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                aria-pressed={active}
                className={cn(
                  "rounded-lg border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2",
                  active
                    ? "border-2"
                    : "border border-border-soft bg-bg-raised/40 hover:border-border-strong",
                )}
                style={
                  active
                    ? {
                        borderColor: meta.color,
                        backgroundColor: `${meta.color}1a`,
                      }
                    : undefined
                }
              >
                <p className="text-sm font-medium" style={{ color: active ? meta.color : undefined }}>
                  {meta.label}
                </p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-fg-subtle">
                  {meta.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Secondary categories */}
      <section className="space-y-3">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {t("secondaryLabel")}
          </Label>
          <p className="mt-1 text-[11px] text-fg-subtle">{t("secondaryHint")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_ORDER.filter((c) => c !== draft.category).map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = draft.secondaryCategories?.includes(cat) ?? false;
            const disabled =
              !active && (draft.secondaryCategories?.length ?? 0) >= 2;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleSecondary(cat)}
                disabled={disabled}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition disabled:cursor-not-allowed disabled:opacity-40",
                  active
                    ? "border-brand bg-brand/15 text-brand"
                    : "border-border-soft bg-bg-raised/40 text-fg-muted hover:border-border-strong",
                )}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Platform */}
      <section className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          {t("platformLabel")}
        </Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PLATFORMS.map((p) => {
            const active = draft.platform === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                aria-pressed={active}
                className={cn(
                  "rounded-md border px-3 py-2 text-xs font-medium transition",
                  active
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border-soft bg-bg-raised/40 text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
