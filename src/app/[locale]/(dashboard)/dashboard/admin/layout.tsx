"use client";

import { AdminRoleGate } from "@/components/admin/admin-role-gate";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoleGate>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Admin sub-nav */}
        <aside className="w-full shrink-0 lg:w-52">
          <div className="sticky top-20">
            <AdminSidebarNav />
          </div>
        </aside>
        {/* Page content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </AdminRoleGate>
  );
}
