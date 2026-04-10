"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface PollCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

export function PollCreateDialog({ open, onClose }: PollCreateDialogProps) {
  const t = useTranslations("community.polls");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [endDate, setEndDate] = useState("");

  const addOption = () => {
    if (options.length < 10) setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    setOptions(options.map((o, i) => (i === index ? value : o)));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-xl border border-border-soft bg-bg p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">{t("createTitle")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-fg-dim hover:text-fg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-xs font-medium text-fg-muted">
              {t("titleLabel")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
              className={cn(
                "mt-1 w-full rounded-lg border border-border-soft bg-bg-surface px-3 py-2 text-sm text-fg",
                "placeholder:text-fg-dim",
                "focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/20",
              )}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted">
              {t("descriptionLabel")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={2}
              className={cn(
                "mt-1 w-full rounded-lg border border-border-soft bg-bg-surface px-3 py-2 text-sm text-fg",
                "placeholder:text-fg-dim resize-none",
                "focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/20",
              )}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted">
              {t("optionsLabel")}
            </label>
            <div className="mt-1 space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`${t("optionPlaceholder")} ${i + 1}`}
                    className={cn(
                      "flex-1 rounded-lg border border-border-soft bg-bg-surface px-3 py-2 text-sm text-fg",
                      "placeholder:text-fg-dim",
                      "focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/20",
                    )}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="rounded p-1.5 text-fg-dim hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-2 inline-flex items-center gap-1 text-xs text-brand hover:text-brand/80"
              >
                <Plus className="h-3 w-3" /> {t("addOption")}
              </button>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-fg-muted">
              {t("endDateLabel")}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={cn(
                "mt-1 w-full rounded-lg border border-border-soft bg-bg-surface px-3 py-2 text-sm text-fg",
                "focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/20",
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-soft px-4 py-2 text-sm font-medium text-fg-muted hover:text-fg"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-black transition hover:bg-brand/90"
            >
              {t("create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
