import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalArticle } from "@/components/legal/legal-article";
import { LegalSectionList } from "@/components/legal/legal-section";
import { Link } from "@/i18n/navigation";

const SECTION_KEYS = [
  "agent",
  "notice",
  "process",
  "counterNotice",
  "repeat",
  "license",
  "abuse",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.dmca" });
  return { title: `${t("title")} — RuleSell` };
}

export default async function DmcaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.dmca" });

  const toc = SECTION_KEYS.map((key) => ({
    id: key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
    title: t(`sections.${key}.title`),
  }));

  return (
    <LegalArticle
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      intro={t("intro")}
      citations={t("citations")}
      toc={toc}
    >
      <LegalSectionList
        namespace="legal.dmca.sections"
        sectionKeys={SECTION_KEYS}
      />
      <p className="mt-8 rounded-lg border border-border-soft bg-bg-raised/50 p-4 text-sm">
        <Link
          href="/report/copyright/dmca"
          className="font-medium text-brand hover:text-brand/80"
        >
          File a copyright takedown notice →
        </Link>
      </p>
    </LegalArticle>
  );
}
