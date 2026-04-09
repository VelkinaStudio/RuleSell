import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalArticle } from "@/components/legal/legal-article";
import { LegalSectionList } from "@/components/legal/legal-section";

const SECTION_KEYS = ["prohibited", "behaviour", "consequences", "report"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.acceptableUse" });
  return { title: `${t("title")} — RuleSell` };
}

export default async function AcceptableUsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.acceptableUse" });

  const toc = SECTION_KEYS.map((key) => ({
    id: key,
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
        namespace="legal.acceptableUse.sections"
        sectionKeys={SECTION_KEYS}
      />
    </LegalArticle>
  );
}
