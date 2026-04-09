"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CloudUpload } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Ruleset } from "@/types";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/hooks/use-session";
import {
  type WizardDraft,
  usePublishDraft,
} from "@/hooks/use-publish-draft";
import { isNonCommercial } from "./licenses";
import { WizardSteps } from "./wizard-steps";
import { WizardStepType } from "./wizard-step-type";
import { WizardStepContent } from "./wizard-step-content";
import { WizardStepVariants } from "./wizard-step-variants";
import { WizardStepLicense } from "./wizard-step-license";
import { WizardStepPricing } from "./wizard-step-pricing";

interface PublishWizardProps {
  id?: string;
  initialDraft?: Partial<Ruleset>;
}

const TOTAL_STEPS = 5;

function isStepValid(step: number, draft: WizardDraft): boolean {
  switch (step) {
    case 1:
      return !!(draft.type && draft.category && draft.platform);
    case 2:
      return !!(draft.title && draft.description);
    case 3: {
      const variants = draft.variants ?? [];
      if (variants.length === 0) return false;
      const hasPrimary = variants.some((v) => v.isPrimary);
      const allFilled = variants.every(
        (v) =>
          v.label.trim().length > 0 &&
          v.environments.length > 0 &&
          v.install.content.trim().length > 0,
      );
      return hasPrimary && allFilled;
    }
    case 4:
      return !!draft.license;
    case 5: {
      // Cannot submit if non-commercial license + paid price
      if (isNonCommercial(draft.license) && (draft.price ?? 0) > 0) {
        return false;
      }
      return true;
    }
    default:
      return false;
  }
}

export function PublishWizard({ id = "new", initialDraft }: PublishWizardProps) {
  const t = useTranslations("publishWizard");
  const router = useRouter();
  const { data: session } = useSession();
  const { draft, update, replace, clear, savedAt } = usePublishDraft(id);
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Seed from initialDraft (edit flow). Runs once on mount.
  useEffect(() => {
    if (initialDraft && Object.keys(draft).length === 0) {
      replace({ ...initialDraft, currentStep: 1 });
    }
    if (typeof draft.currentStep === "number") {
      setStep(draft.currentStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = () => {
    if (!isStepValid(step, draft)) {
      toast.error(`Complete step ${step} before continuing.`);
      return;
    }
    const ns = Math.min(TOTAL_STEPS, step + 1);
    setStep(ns);
    update({ currentStep: ns });
  };
  const prev = () => {
    const ns = Math.max(1, step - 1);
    setStep(ns);
    update({ currentStep: ns });
  };

  const submit = async () => {
    if (!isStepValid(5, draft)) {
      toast.error(t("submitForReview"));
      return;
    }
    setSubmitting(true);
    // Mock submit — pretend POST /api/rulesets and clear the draft.
    await new Promise((r) => setTimeout(r, 600));
    clear();
    setSubmitting(false);
    toast.success("Submitted for review.");
    router.push("/dashboard/rulesets?submitted=1");
  };

  const username = session?.user?.username ?? "user";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <p className="text-sm text-fg-muted">
          {t("subtitle")} ·{" "}
          <span className="text-fg-subtle">@{username}</span>
        </p>
      </header>

      <WizardSteps currentStep={step} onJump={(s) => setStep(s)} />

      <div className="rounded-2xl border border-border-soft bg-bg-surface p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 1 && <WizardStepType draft={draft} onChange={update} />}
            {step === 2 && <WizardStepContent draft={draft} onChange={update} />}
            {step === 3 && (
              <WizardStepVariants draft={draft} onChange={update} />
            )}
            {step === 4 && <WizardStepLicense draft={draft} onChange={update} />}
            {step === 5 && <WizardStepPricing draft={draft} onChange={update} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={step === 1}
        >
          {t("back")}
        </Button>

        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="hidden items-center gap-1 text-[11px] text-fg-subtle sm:flex">
              <Check className="h-3 w-3 text-emerald-300" />
              {t("draftSaved")}
            </span>
          )}
          {step < TOTAL_STEPS ? (
            <Button
              onClick={next}
              className="bg-brand text-brand-fg hover:bg-brand/90"
            >
              {t("next")}
            </Button>
          ) : (
            <Button
              onClick={submit}
              disabled={submitting || !isStepValid(5, draft)}
              className="bg-brand text-brand-fg hover:bg-brand/90"
            >
              <CloudUpload className="mr-1 h-4 w-4" />
              {t("submitForReview")}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
