import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "devUsers" });
  return { title: `${t("title")} — RuleSell Dev`, robots: { index: false, follow: false } };
}

export default async function DevUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "devUsers" });

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
          DEV ONLY
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">{t("subtitle")}</p>
      </header>
      <p className="text-fg-muted">
        Persona switcher removed — use real NextAuth sign-in at /signin.
      </p>
    </main>
  );
}
