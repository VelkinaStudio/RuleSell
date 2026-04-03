"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";

const navLinks = [
  { href: "/", label: "Marketplace" },
  { href: "/trending", label: "Trending" },
  { href: "/docs", label: "Docs" },
  { href: "/discussions", label: "Community" },
];

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border-primary bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6 md:px-8">
        {/* Logo + Nav */}
        <div className="flex items-center gap-7">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="text-text-primary">Ruleset</span>
            <span className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          </Link>
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-[13px] rounded-lg transition-colors text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-bg-tertiary/60 transition-all">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {session ? (
            <>
              {/* Notifications */}
              <button className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-bg-tertiary/60 transition-all">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Publish */}
              <Link href="/dashboard/rulesets/new">
                <Button variant="outline" size="sm">
                  Publish
                </Button>
              </Link>

              {/* Avatar */}
              <Link href="/dashboard/overview" className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-green flex items-center justify-center text-xs font-bold text-white ml-1">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
