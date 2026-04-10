"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface SocialProofBarProps {
  className?: string;
}

export function SocialProofBar({ className }: SocialProofBarProps) {
  const t = useTranslations("landing.socialProof");

  const metrics = [
    { value: t("assets"), label: t("assetsLabel") },
    { value: t("installs"), label: t("installsLabel") },
    { value: t("creators"), label: t("creatorsLabel") },
    { value: t("quality"), label: t("qualityLabel") },
  ];

  return (
    <section
      className={cn(
        "border-y border-border-soft bg-bg-surface/50",
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-4 py-6 sm:gap-12 sm:px-6 sm:py-8 lg:gap-16 lg:px-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <p className="font-mono text-lg font-semibold tabular-nums text-fg sm:text-xl">
              {metric.value}
            </p>
            <p className="mt-0.5 text-xs text-fg-muted">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
