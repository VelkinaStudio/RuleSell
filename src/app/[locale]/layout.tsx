import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers/providers";
import { CookieBanner } from "@/components/compliance/cookie-banner";

import "../globals.css";

export const metadata: Metadata = {
  title: "RuleSell — Verified AI development assets",
  description:
    "The verified marketplace for rules, MCP servers, skills, agents, and workflows. Curated quality, measured performance, and real creator payouts.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // CRITICAL: must be called before any next-intl server function for the
  // current request, otherwise getMessages() falls back to the default locale.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-bg text-fg antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
            <CookieBanner />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
