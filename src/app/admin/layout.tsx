import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/rulesets", label: "Rulesets" },
  { href: "/admin/reports", label: "Reports" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard/overview");

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-border-primary bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-bold text-text-primary">
              Admin Panel
            </Link>
            <nav className="flex items-center gap-4">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Link href="/dashboard/overview" className="text-sm text-text-tertiary hover:text-text-secondary">
            Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
