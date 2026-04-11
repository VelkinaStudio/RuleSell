import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers/providers";
import { CookieBanner } from "@/components/compliance/cookie-banner";
import { jsonLdScript, makeOrganizationSchema, makeWebsiteSchema } from "@/lib/seo/json-ld";

import "../globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://rulesell.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RuleSell — Verified AI development assets",
    template: "%s · RuleSell",
  },
  description:
    "The verified marketplace for rules, MCP servers, skills, agents, and workflows. Curated quality, measured performance, and real creator payouts.",
  applicationName: "RuleSell",
  generator: "Next.js",
  keywords: [
    "Claude Code",
    "Cursor",
    "Windsurf",
    "MCP server",
    "AI development",
    "AI assets",
    "Claude Code skills",
    "AI marketplace",
    "Codex",
    "Gemini CLI",
  ],
  authors: [{ name: "RuleSell" }],
  creator: "RuleSell",
  publisher: "RuleSell",
  alternates: {
    canonical: "/",
    languages: Object.fromEntries(
      routing.locales.map((l) => [
        l,
        l === routing.defaultLocale ? "/" : `/${l}`,
      ]),
    ),
  },
  openGraph: {
    type: "website",
    siteName: "RuleSell",
    title: "RuleSell — Verified AI development assets",
    description:
      "The verified marketplace for rules, MCP servers, skills, agents, and workflows. Curated quality, measured performance, and real creator payouts.",
    url: "/",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "RuleSell — Verified AI development assets",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RuleSell — Verified AI development assets",
    description:
      "Quality-scored, security-scanned AI configs. Install in one command.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/logos/favicon.svg", type: "image/svg+xml" }],
  },
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
      <head>
        <link rel="icon" href="/logos/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
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
