"use client";

import Link from "next/link";

const platforms = [
  { label: "Cursor Rules", href: "/?platform=CURSOR", icon: "cursor" },
  { label: "AI Agents", href: "/?platform=CLAUDE", icon: "agent" },
  { label: "n8n Workflows", href: "/?platform=N8N", icon: "workflow" },
];

const categories = [
  { label: "Architecture", href: "/?category=architecture" },
  { label: "Data Ops", href: "/?category=data-ops" },
  { label: "Security", href: "/?category=security" },
  { label: "UI/UX", href: "/?category=ui-ux" },
];

function PlatformIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    cursor: "M4 4l7 2-2 7-5-9z",
    agent: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z",
    workflow: "M4 6h16M4 12h16M4 18h16",
  };
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[type] || icons.cursor} />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-border-primary p-4 gap-6">
      {/* Platforms */}
      <div>
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
          Platforms
        </h3>
        <nav className="space-y-1">
          {platforms.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
            >
              <PlatformIcon type={p.icon} />
              {p.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
          Categories
        </h3>
        <nav className="space-y-1">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-center justify-between px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
            >
              <span>{c.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Spacer + Bottom */}
      <div className="mt-auto space-y-2">
        <Link href="/pricing">
          <button className="w-full py-2 text-sm font-medium text-accent-green border border-accent-green/30 rounded-md hover:bg-accent-green-subtle transition-colors">
            Upgrade to Pro
          </button>
        </Link>
        <nav className="space-y-1">
          <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
            Settings
          </Link>
          <Link href="/docs" className="flex items-center gap-2 px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
            Support
          </Link>
        </nav>
      </div>
    </aside>
  );
}
