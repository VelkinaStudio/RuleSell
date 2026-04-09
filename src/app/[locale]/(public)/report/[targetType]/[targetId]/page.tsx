import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ReportForm } from "@/components/compliance/report-form";
import { Link } from "@/i18n/navigation";
import type { ReportTargetType } from "@/hooks/use-report";

const VALID_TARGET_TYPES: ReportTargetType[] = [
  "ruleset",
  "review",
  "user",
  "team",
  "comment",
  "copyright",
];

function isValidTargetType(value: string): value is ReportTargetType {
  return (VALID_TARGET_TYPES as string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "report" });
  return {
    title: `${t("pageTitle")} — RuleSell`,
    description: t("metaDescription"),
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: string; targetType: string; targetId: string }>;
}) {
  const { locale, targetType, targetId } = await params;
  setRequestLocale(locale);

  if (!isValidTargetType(targetType)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "report" });
  const tCompliance = await getTranslations({
    locale,
    namespace: "compliance.report",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        {t("back")}
      </Link>

      <header className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand">
          {t(`context.${targetType}` as const)}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {tCompliance("deepLinkTitle", { targetType: t(`context.${targetType}` as const) })}
        </h1>
        <p className="mt-2 text-sm text-fg-subtle">
          {tCompliance("deepLinkSubtitle", { targetId })}
        </p>
        <p className="mt-6 text-base text-fg-muted">{t("intro")}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <section
          aria-labelledby="report-heading"
          className="rounded-lg border border-border-soft bg-bg-surface/70 p-6"
        >
          <h2
            id="report-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-muted"
          >
            {t("anchorReport")}
          </h2>
          <ReportForm
            targetType={targetType as ReportTargetType}
            targetId={targetId}
          />
        </section>

        <aside className="space-y-4 text-sm">
          <div className="rounded-lg border border-border-soft bg-bg-raised/50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              {t("anchorAfter")}
            </p>
            <p className="text-xs leading-relaxed text-fg-muted">
              {t("anchorAfterBody")}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
