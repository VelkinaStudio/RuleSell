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
    <header className="sticky top-0 z-40 border-b border-border-primary bg-bg-primary/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <MobileNav />
          <Link href="/" className="flex items-center gap-1.5 font-semibold text-lg">
            Ruleset
            <span className="w-2 h-2 rounded-full bg-accent-green" />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm rounded-md transition-colors text-text-secondary hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {session ? (
            <>
              {/* Notifications */}
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Publish */}
              <Link href="/dashboard/rulesets/new">
                <Button variant="outline" size="sm">
                  Publish
                </Button>
              </Link>

              {/* Avatar */}
              <Link href="/dashboard/overview" className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center text-sm font-medium text-white">
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
