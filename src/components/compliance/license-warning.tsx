"use client";

import { Info, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type LicenseIntent = "view" | "purchase" | "publish_paid";

interface LicenseWarningProps {
  license: string;
  intent?: LicenseIntent;
  className?: string;
  /** When true, render compactly as a chip with no surrounding card. */
  compact?: boolean;
}

interface WarningSpec {
  variant: "danger" | "warn" | "ok" | "neutral";
  icon: React.ReactNode;
  messageKey: keyof Messages;
}

interface Messages {
  nonCommercialPaid: string;
  gplPurchase: string;
  agplPurchase: string;
  cc0Public: string;
  commercialOk: string;
  attributionRequired: string;
  neutral: string;
}

const NON_COMMERCIAL_PREFIXES = ["CC-BY-NC", "CC BY-NC"];
const ATTRIBUTION_LICENSES = ["CC-BY-4.0", "CC BY 4.0", "CC-BY-SA-4.0"];

function classifyLicense(license: string, intent: LicenseIntent): WarningSpec | null {
  const norm = license.trim().toUpperCase();
  const isNonCommercial = NON_COMMERCIAL_PREFIXES.some((p) =>
    norm.startsWith(p.toUpperCase()),
  );

  if (intent === "publish_paid" && isNonCommercial) {
    return {
      variant: "danger",
      icon: <ShieldAlert className="size-4" aria-hidden="true" />,
      messageKey: "nonCommercialPaid",
    };
  }

  if (intent === "purchase" && norm.startsWith("AGPL")) {
    return {
      variant: "warn",
      icon: <ShieldAlert className="size-4" aria-hidden="true" />,
      messageKey: "agplPurchase",
    };
  }
  if (intent === "purchase" && norm.startsWith("GPL")) {
    return {
      variant: "warn",
      icon: <ShieldAlert className="size-4" aria-hidden="true" />,
      messageKey: "gplPurchase",
    };
  }

  if (norm === "CC0-1.0" || norm === "CC0" || norm === "PUBLIC-DOMAIN") {
    return {
      variant: "ok",
      icon: <ShieldCheck className="size-4" aria-hidden="true" />,
      messageKey: "cc0Public",
    };
  }

  if (ATTRIBUTION_LICENSES.some((l) => norm === l.toUpperCase())) {
    return {
      variant: "neutral",
      icon: <Info className="size-4" aria-hidden="true" />,
      messageKey: "attributionRequired",
    };
  }

  if (norm === "MIT" || norm === "APACHE-2.0" || norm === "BSD-3-CLAUSE") {
    return {
      variant: "ok",
      icon: <ShieldCheck className="size-4" aria-hidden="true" />,
      messageKey: "commercialOk",
    };
  }

  return null;
}

const VARIANT_STYLES: Record<WarningSpec["variant"], string> = {
  danger: "border-danger/40 bg-danger/5 text-danger",
  warn: "border-amber-500/40 bg-amber-500/5 text-amber-200",
  ok: "border-emerald-500/40 bg-emerald-500/5 text-emerald-200",
  neutral: "border-border-soft bg-bg-raised/50 text-fg-muted",
};

export function LicenseWarning({
  license,
  intent = "view",
  className,
  compact = false,
}: LicenseWarningProps) {
  const t = useTranslations("compliance.licenseWarning");
  const reduce = useReducedMotion();
  const spec = classifyLicense(license, intent);

  if (!spec) {
    // Fall through: neutral chip with the SPDX label.
    return (
      <SpdxChip license={license} className={className} message={t("neutral", { license })} />
    );
  }

  const message =
    spec.messageKey === "commercialOk" || spec.messageKey === "attributionRequired"
      ? t(spec.messageKey, { license })
      : t(spec.messageKey);

  if (compact) {
    return (
      <SpdxChip license={license} className={className} message={message} variant={spec.variant} />
    );
  }

  const inner = (
    <div
      role={spec.variant === "danger" || spec.variant === "warn" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 text-xs",
        VARIANT_STYLES[spec.variant],
        className,
      )}
    >
      <span className="mt-0.5 shrink-0">{spec.icon}</span>
      <div className="space-y-0.5">
        <p className="font-medium">{message}</p>
        <p className="text-[10px] uppercase tracking-wider opacity-70">
          {t("spdxLabel")} · {license}
        </p>
      </div>
    </div>
  );

  if (reduce) return inner;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {inner}
    </motion.div>
  );
}

function SpdxChip({
  license,
  message,
  className,
  variant = "neutral",
}: {
  license: string;
  message: string;
  className?: string;
  variant?: WarningSpec["variant"];
}) {
  return (
    <span
      title={message}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      <Info className="size-3" aria-hidden="true" />
      <span>{license}</span>
    </span>
  );
}
