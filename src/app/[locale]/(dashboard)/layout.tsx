import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardAuthGate } from "@/components/dashboard/dashboard-auth-gate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-brand-fg"
      >
        Skip to dashboard content
      </a>
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardBreadcrumb />
          <main
            id="dashboard-main"
            className="flex-1 px-4 py-6 sm:px-6 lg:px-8"
          >
            <DashboardAuthGate>{children}</DashboardAuthGate>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
