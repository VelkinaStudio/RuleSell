"use client";

import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  type ReportCategory,
  type ReportTargetType,
  useReport,
} from "@/hooks/use-report";
import { cn } from "@/lib/utils";

const CATEGORY_KEYS: ReportCategory[] = [
  "illegal",
  "ip",
  "malware",
  "hate",
  "sexual",
  "harassment",
  "privacy",
  "fraud",
  "other",
];

interface ReportFormProps {
  targetType: ReportTargetType;
  targetId: string;
  defaultEmail?: string;
  /** When true (in a dialog), the success state shows compactly. */
  compact?: boolean;
  onSuccess?: () => void;
  className?: string;
}

export function ReportForm({
  targetType,
  targetId,
  defaultEmail = "",
  compact = false,
  onSuccess,
  className,
}: ReportFormProps) {
  const t = useTranslations("compliance.report");
  const { submit, submitting, result, error, reset } = useReport();

  const [category, setCategory] = useState<ReportCategory>("illegal");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [declared, setDeclared] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 20) {
      setValidationError(t("descriptionHelp"));
      return;
    }
    if (!declared) {
      setValidationError(t("declarationLabel"));
      return;
    }
    setValidationError(null);
    const r = await submit({
      targetType,
      targetId,
      category,
      description: description.trim(),
      email: email.trim() || undefined,
    });
    if (r && onSuccess) onSuccess();
  };

  if (result) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5",
          compact ? "" : "p-6",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 text-emerald-300" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-100">
              {t("successTitle")}
            </p>
            <p className="mt-1 text-sm text-emerald-100/80">
              {t("successBody", { ref: result.ref })}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 text-xs font-medium text-emerald-300 underline-offset-2 hover:underline"
            >
              {t("submit")} ↺
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)} noValidate>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-fg">
          {t("categoryLabel")}
        </legend>
        <RadioGroup
          value={category}
          onValueChange={(v) => setCategory(v as ReportCategory)}
          className="grid gap-2 sm:grid-cols-2"
        >
          {CATEGORY_KEYS.map((key) => (
            <Label
              key={key}
              htmlFor={`report-cat-${key}`}
              className="flex cursor-pointer items-start gap-2 rounded-md border border-border-soft bg-bg-surface/60 p-2.5 text-sm transition hover:border-border-strong has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-brand/5"
            >
              <RadioGroupItem id={`report-cat-${key}`} value={key} className="mt-0.5" />
              <span className="text-fg">{t(`category.${key}`)}</span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="report-description">{t("descriptionLabel")}</Label>
        <Textarea
          id="report-description"
          required
          minLength={20}
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("descriptionPlaceholder")}
          aria-describedby="report-description-help"
        />
        <p id="report-description-help" className="text-xs text-fg-subtle">
          {t("descriptionHelp")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="report-email">{t("emailLabel")}</Label>
        <Input
          id="report-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          aria-describedby="report-email-help"
        />
        <p id="report-email-help" className="text-xs text-fg-subtle">
          {t("emailHelp")}
        </p>
      </div>

      <Label
        htmlFor="report-declared"
        className="flex cursor-pointer items-start gap-3 rounded-md border border-border-soft bg-bg-surface/60 p-3"
      >
        <input
          id="report-declared"
          type="checkbox"
          checked={declared}
          onChange={(e) => setDeclared(e.target.checked)}
          required
          className="mt-1 size-4 cursor-pointer accent-brand"
        />
        <span className="text-xs text-fg-muted">{t("declarationLabel")}</span>
      </Label>

      {(validationError || error) && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-danger/40 bg-danger/5 p-3 text-xs text-danger"
        >
          <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{validationError ?? t("errorBody")}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand text-brand-fg hover:bg-brand/90"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {t("submit")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
