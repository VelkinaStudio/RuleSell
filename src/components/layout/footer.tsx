import Link from "next/link";

const footerLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "API", href: "/docs/api" },
  { label: "Status", href: "/status" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-primary py-6 px-4">
      <div className="flex flex-col items-center gap-3">
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-text-tertiary hover:text-text-secondary uppercase tracking-wider transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-text-tertiary font-mono">
          &copy; {new Date().getFullYear()} Ruleset AI. Technical authority guaranteed.
        </p>
      </div>
    </footer>
  );
}
