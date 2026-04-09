"use client";

import { ArrowUp, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface LegalArticleProps {
  title: string;
  lastUpdated: string;
  citations?: string;
  intro?: string;
  children: React.ReactNode;
  toc?: { id: string; title: string }[];
}

export function LegalArticle({
  title,
  lastUpdated,
  citations,
  intro,
  children,
  toc,
}: LegalArticleProps) {
  const t = useTranslations("legal");

  return (
    <article className="relative">
      <header className="mb-8 border-b border-border-soft pb-6">
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-bg-raised px-2.5 py-1 text-xs font-medium text-fg-muted">
          <ScrollText className="size-3.5" aria-hidden="true" />
          {t("navTitle")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-fg-subtle">
          {t("lastUpdated", { date: lastUpdated })}
        </p>
        <DisclaimerCard />
        {intro ? <p className="mt-6 text-base text-fg-muted">{intro}</p> : null}
      </header>

      {toc && toc.length > 0 ? (
        <nav
          aria-label={t("tableOfContents")}
          className="mb-10 rounded-lg border border-border-soft bg-bg-surface/70 p-4"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {t("tableOfContents")}
          </p>
          <ol className="space-y-1 text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-fg-muted underline-offset-2 hover:text-fg hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div
        className={cn(
          "prose prose-invert prose-zinc max-w-none",
          "prose-headings:scroll-mt-24 prose-headings:text-fg",
          "prose-p:text-fg-muted prose-p:leading-relaxed",
          "prose-strong:text-fg",
          "prose-a:text-brand prose-a:underline-offset-2 hover:prose-a:text-brand/80",
          "prose-li:text-fg-muted",
          "prose-code:text-fg prose-code:bg-bg-raised prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
        )}
      >
        {children}
      </div>

      {citations ? (
        <aside
          aria-label={t("citationsLabel")}
          className="mt-12 rounded-lg border border-border-soft bg-bg-raised/50 p-5"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {t("citationsLabel")}
          </p>
          <p className="text-xs leading-relaxed text-fg-muted">{citations}</p>
        </aside>
      ) : null}

      <BackToTopLink />
    </article>
  );
}

function DisclaimerCard() {
  const t = useTranslations("legal");
  return (
    <div
      role="note"
      className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
        {t("noticeLabel")}
      </p>
      <p className="mt-1 text-sm text-amber-100/90">{t("disclaimer")}</p>
    </div>
  );
}

function BackToTopLink() {
  const t = useTranslations("legal");
  return (
    <div className="mt-12 flex justify-end">
      <a
        href="#main"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-fg-muted transition hover:bg-bg-raised hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ArrowUp className="size-3.5" aria-hidden="true" />
        {t("backToTop")}
      </a>
    </div>
  );
}
