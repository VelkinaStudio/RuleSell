"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Eye } from "lucide-react";
import type { Role, User } from "@/types";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminUserDetailSheet } from "./admin-user-detail-sheet";

interface AdminUserTableProps {
  users: User[];
  onChangeRole: (userId: string, role: Role) => void;
  onSuspend: (userId: string) => void;
}

function roleBadgeColor(role: Role) {
  switch (role) {
    case "ADMIN": return "bg-danger/15 text-danger";
    case "PRO": return "bg-brand/15 text-brand";
    default: return "bg-bg-raised text-fg-muted";
  }
}

export function AdminUserTable({ users, onChangeRole, onSuspend }: AdminUserTableProps) {
  const t = useTranslations("admin.users");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-soft bg-bg-raised/50">
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("user")}</th>
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("email")}</th>
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("role")}</th>
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("sellerStatus")}</th>
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("joined")}</th>
              <th className="px-4 py-3 text-right font-medium text-fg-muted">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const initials = (user.name || user.username)
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("");
              const isSuspended =
                user.sellerStats?.traderVerified === false &&
                user.sellerStats?.paymentConnectStatus === "none";

              return (
                <tr
                  key={user.id}
                  className="border-b border-border-soft transition hover:bg-bg-raised/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                        <AvatarFallback className="bg-brand/20 text-brand text-[10px] font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-fg">{user.name}</p>
                        <p className="text-xs text-fg-muted">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge className={cn("text-xs", roleBadgeColor(user.role))}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {user.sellerStats ? (
                      <Badge
                        className={cn(
                          "text-xs",
                          isSuspended
                            ? "bg-danger/15 text-danger"
                            : "bg-success/15 text-success",
                        )}
                      >
                        {isSuspended ? t("suspended") : t("active")}
                      </Badge>
                    ) : (
                      <span className="text-xs text-fg-subtle">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-fg-muted">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t("actions")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setSheetOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("viewDetails")}
                        </DropdownMenuItem>
                        {user.role !== "ADMIN" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                onChangeRole(user.id, user.role === "PRO" ? "USER" : "PRO")
                              }
                            >
                              {user.role === "PRO" ? t("demoteToUser") : t("promoteToPro")}
                            </DropdownMenuItem>
                          </>
                        )}
                        {user.sellerStats && !isSuspended && (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onSuspend(user.id)}
                          >
                            {t("suspendSeller")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AdminUserDetailSheet
        user={selectedUser}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onChangeRole={onChangeRole}
        onSuspend={onSuspend}
      />
    </>
  );
}
