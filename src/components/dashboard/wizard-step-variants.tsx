"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Variant } from "@/types";

import { Button } from "@/components/ui/button";
import type { WizardDraft } from "@/hooks/use-publish-draft";
import { VariantEditor } from "./variant-editor";

interface Props {
  draft: WizardDraft;
  onChange: (patch: WizardDraft) => void;
}

function blankVariant(): Variant {
  return {
    id: `var-${Math.random().toString(36).slice(2, 10)}`,
    label: "",
    environments: [],
    kind: "raw_file",
    version: "1.0.0",
    install: { method: "copy", content: "" },
    isPrimary: false,
  };
}

export function WizardStepVariants({ draft, onChange }: Props) {
  const t = useTranslations("publishWizard.variants");
  const variants = draft.variants ?? [];

  const addVariant = () => {
    const next = [...variants, blankVariant()];
    // First variant added is automatically primary
    if (variants.length === 0) next[0].isPrimary = true;
    onChange({
      variants: next,
      defaultVariantId: next.find((v) => v.isPrimary)?.id ?? next[0].id,
    });
  };

  const updateVariant = (idx: number, next: Variant) => {
    const arr = variants.map((v, i) => (i === idx ? next : v));
    onChange({ variants: arr });
  };

  const removeVariant = (idx: number) => {
    const arr = variants.filter((_, i) => i !== idx);
    // If we removed the primary, promote the first remaining one
    if (variants[idx].isPrimary && arr.length > 0) {
      arr[0] = { ...arr[0], isPrimary: true };
    }
    onChange({
      variants: arr,
      defaultVariantId: arr.find((v) => v.isPrimary)?.id ?? arr[0]?.id,
    });
  };

  const makePrimary = (idx: number) => {
    const arr = variants.map((v, i) => ({ ...v, isPrimary: i === idx }));
    onChange({ variants: arr, defaultVariantId: arr[idx].id });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{t("description")}</p>
      </header>

      <div className="space-y-4">
        {variants.map((variant, idx) => (
          <VariantEditor
            key={variant.id}
            variant={variant}
            onChange={(next) => updateVariant(idx, next)}
            onRemove={() => removeVariant(idx)}
            onMakePrimary={() => makePrimary(idx)}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addVariant}
        className="w-full border-dashed"
      >
        <Plus className="mr-1 h-4 w-4" />
        {t("addVariant")}
      </Button>
    </div>
  );
}
