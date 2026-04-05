import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const settingsNav = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/billing", label: "Billing" },
];

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-text-primary mb-8">Settings</h1>
        <div className="flex gap-6">
          <nav className="w-48 space-y-1">
            {settingsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
