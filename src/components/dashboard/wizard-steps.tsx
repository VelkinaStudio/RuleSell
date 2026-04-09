"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface WizardStepsProps {
  currentStep: number;
  onJump?: (step: number) => void;
  className?: string;
}

const STEPS = ["type", "content", "variants", "license", "pricing"] as const;

export function WizardSteps({
  currentStep,
  onJump,
  className,
}: WizardStepsProps) {
  const t = useTranslations("publishWizard.steps");

  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-2",
        className,
      )}
      aria-label={`Wizard step ${currentStep} of ${STEPS.length}`}
    >
      {STEPS.map((stepKey, idx) => {
        const stepNum = idx + 1;
        const isComplete = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        const canJump = stepNum < currentStep && onJump;
        return (
          <li key={stepKey} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={canJump ? () => onJump?.(stepNum) : undefined}
              disabled={!canJump}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "group flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                canJump && "cursor-pointer hover:bg-bg-raised/40",
                !canJump && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition",
                  isComplete && "border-brand bg-brand text-brand-fg",
                  isCurrent && "border-brand bg-brand/15 text-brand",
                  !isCurrent && !isComplete && "border-border-strong bg-bg-surface text-fg-subtle",
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : stepNum}
              </span>
              <span
                className={cn(
                  "hidden truncate text-xs font-medium sm:block",
                  isCurrent && "text-fg",
                  isComplete && "text-fg-muted",
                  !isCurrent && !isComplete && "text-fg-subtle",
                )}
              >
                {t(stepKey)}
              </span>
            </button>
            {stepNum < STEPS.length && (
              <span
                className={cn(
                  "h-px w-4 sm:w-8",
                  stepNum < currentStep ? "bg-brand" : "bg-border-soft",
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
