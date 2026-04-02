import Link from "next/link";
import { Header } from "@/components/layout/header";
import { AuthGuard } from "@/components/auth/auth-guard";

const dashboardNav = [
  { href: "/dashboard/overview", label: "Overview" },
  { href: "/dashboard/rulesets", label: "My Rulesets" },
  { href: "/dashboard/bundles", label: "Bundles" },
  { href: "/dashboard/earnings", label: "Earnings" },
  { href: "/dashboard/purchases", label: "Purchases" },
  { href: "/dashboard/saved", label: "Saved" },
  { href: "/dashboard/collections", label: "Collections" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          {/* Dashboard sidebar */}
          <aside className="hidden lg:flex flex-col w-56 border-r border-border-primary p-4">
            <nav className="space-y-1">
              {dashboardNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-border-primary">
              <Link
                href="/settings"
                className="block px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Settings
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
