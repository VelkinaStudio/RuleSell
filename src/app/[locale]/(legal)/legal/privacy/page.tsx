import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalArticle } from "@/components/legal/legal-article";
import { LegalSectionList } from "@/components/legal/legal-section";

const SECTION_KEYS = [
  "scope",
  "controller",
  "categories",
  "purposes",
  "retention",
  "sharing",
  "transfers",
  "rights",
  "gpc",
  "children",
  "security",
  "automated",
  "changes",
  "contact",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return { title: `${t("title")} — RuleSell` };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.privacy" });

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
        namespace="legal.privacy.sections"
        sectionKeys={SECTION_KEYS}
      />
    </LegalArticle>
  );
}
