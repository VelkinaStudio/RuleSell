import Image from "next/image";

import { Link } from "@/i18n/navigation";

import { NotificationBell } from "./notification-bell";
import { SearchBar } from "./search-bar";
import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20"
        >
          <Image
            src="/logos/rulesell-mark.svg"
            alt=""
            width={22}
            height={22}
            className="shrink-0"
            aria-hidden
          />
          <span>
            <span className="text-fg">Rule</span>
            <span className="text-brand">Sell</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/browse">Browse</NavLink>
          <NavLink href="/explore">Explore</NavLink>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <SearchBar />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-sm text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20"
    >
      {children}
    </Link>
  );
}
