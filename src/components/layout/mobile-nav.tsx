"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/search", label: "Browse Marketplace" },
  { href: "/trending", label: "Trending" },
  { href: "/creators", label: "Creators" },
];

const categoryLinks = [
  { href: "/search?category=system-prompts", label: "System Prompts" },
  { href: "/search?category=cursor-rules", label: "Cursor Rules" },
  { href: "/search?category=n8n-workflows", label: "n8n Workflows" },
  { href: "/search?category=agent-blueprints", label: "Agent Blueprints" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-secondary hover:text-text-primary"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-bg-secondary border-b border-border-primary p-6 z-50">
          <nav className="space-y-1 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-tertiary/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-border-primary pt-4">
            <p className="text-xs text-text-tertiary uppercase tracking-wider mb-3 px-3">Categories</p>
            <nav className="space-y-1">
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
