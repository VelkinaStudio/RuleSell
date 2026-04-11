import { useTranslations } from "next-intl";
import Link from "next/link";

import { Brand } from "./brand";

export function Footer({ className }: { className?: string }) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className={`border-t border-border-soft ${className ?? ""}`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-fg-subtle sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Brand size="sm" wordmarkOnly />
          <span className="text-fg-subtle">{t("copyright", { year: String(year) })}</span>
        </div>
        <nav className="flex flex-wrap items-center gap-4" aria-label="Footer">
          <Link href="/browse" className="transition hover:text-fg">{t("browse")}</Link>
          <Link href="/about" className="transition hover:text-fg">{t("about")}</Link>
          <Link href="/trust" className="transition hover:text-fg">Trust</Link>
          <Link href="/affiliates" className="transition hover:text-fg">Affiliates</Link>
          <Link href="/legal/terms" className="transition hover:text-fg">{t("terms")}</Link>
          <Link href="/legal/privacy" className="transition hover:text-fg">{t("privacy")}</Link>
          <a
            href="https://github.com/rulesell"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-fg"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
