"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import type { Role } from "@/types";

import { useAdminUsers } from "@/hooks/use-admin-users";
import { AdminUserTable } from "@/components/admin/admin-user-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROLE_FILTERS: Array<{ key: Role | "ALL"; label: string }> = [
  { key: "ALL", label: "all" },
  { key: "USER", label: "user" },
  { key: "PRO", label: "pro" },
  { key: "ADMIN", label: "admin" },
];

export default function AdminUsersPage() {
  const t = useTranslations("admin.users");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { users, total, totalPages, changeRole, suspendUser } = useAdminUsers({
    search,
    roleFilter,
    page,
    pageSize: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">{t("title")}</h1>
        <p className="mt-1 text-sm text-fg-muted">
          {t("subtitle", { count: total })}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("searchPlaceholder")}
            className="h-9 w-full rounded-md border border-border-soft bg-bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:w-72"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-bg-raised/50 p-1">
          {ROLE_FILTERS.map((rf) => (
            <button
              key={rf.key}
              onClick={() => {
                setRoleFilter(rf.key);
                setPage(1);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition",
                roleFilter === rf.key
                  ? "bg-brand/15 text-brand"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {t(`roleFilter.${rf.label}`)}
            </button>
          ))}
        </div>
      </div>

      <AdminUserTable
        users={users}
        onChangeRole={changeRole}
        onSuspend={suspendUser}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-fg-muted">
            {t("pageInfo", { page, totalPages, total })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
