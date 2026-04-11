"use client";

import { LogIn, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

import { useSession } from "@/hooks/use-session";

export function UserMenu() {
  const t = useTranslations("nav");
  const { data, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-20 animate-pulse rounded-md bg-bg-raised" />;
  }

  if (!data.user) {
    return (
      <div className="flex items-center gap-1.5">
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="hidden text-fg-muted hover:text-fg sm:inline-flex"
        >
          <Link href="/login">
            <LogIn className="mr-1.5 h-3.5 w-3.5" />
            {t("signIn")}
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          className="bg-brand text-brand-fg hover:bg-brand/90 focus-visible:ring-brand"
        >
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    );
  }

  const initials = data.user.username
    .split(/[-_ ]+/)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        aria-label="Account menu"
      >
        <Avatar className="h-9 w-9 border border-border-strong" aria-hidden="true">
          <AvatarFallback className="bg-bg-raised text-xs font-semibold text-fg">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-semibold">{data.user.name}</span>
          <span className="text-xs text-fg-muted">@{data.user.username}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">{t("dashboard")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/u/${data.user.username}`}>
            <UserIcon className="mr-2 h-3.5 w-3.5" />
            {t("profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/saved">{t("saved")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-3.5 w-3.5" />
            {t("settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>
          <LogOut className="mr-2 h-3.5 w-3.5" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
