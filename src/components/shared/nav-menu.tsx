"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORY_META, CATEGORY_ORDER } from "@/constants/categories";

export function NavMenu() {
  const t = useTranslations("nav");

  return (
    <nav className="hidden items-center gap-1 md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          {t("browse")}
          <ChevronDown className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/browse">{t("browseAll")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/browse/trending">{t("trending")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/browse/new">{t("new")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/browse/top">{t("top")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/browse/free">{t("free")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/browse/paid">{t("paid")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          {CATEGORY_ORDER.map((c) => (
            <DropdownMenuItem key={c} asChild>
              <Link href={`/category/${CATEGORY_META[c].slug}`}>
                {CATEGORY_META[c].label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/collections"
        className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {t("collections")}
      </Link>
      <Link
        href="/leaderboard"
        className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {t("leaderboard")}
      </Link>
      <Link
        href="/dashboard/rulesets/new"
        className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {t("sell")}
      </Link>
    </nav>
  );
}
