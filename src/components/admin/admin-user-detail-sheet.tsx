"use client";

import { useTranslations } from "next-intl";
import type { User, Role } from "@/types";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AdminUserDetailSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AdminUserDetailSheet({
  user,
  open,
  onOpenChange,
  onChangeRole,
  onSuspend,
}: AdminUserDetailSheetProps) {
  const t = useTranslations("admin.users");

  if (!user) return null;

  const initials = (user.name || user.username)
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const isSuspended = user.sellerStats?.traderVerified === false && user.sellerStats?.paymentConnectStatus === "none";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 sm:w-96 overflow-y-auto">
        <div className="flex flex-col gap-6 pt-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="bg-brand/20 text-brand font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-fg">{user.name}</p>
              <p className="text-sm text-fg-muted">@{user.username}</p>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-muted">{t("email")}</span>
              <span className="text-fg">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">{t("role")}</span>
              <Badge className={cn("text-xs", roleBadgeColor(user.role))}>{user.role}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">{t("country")}</span>
              <span className="text-fg">{user.countryOfResidence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">{t("reputation")}</span>
              <span className="text-fg">{user.reputation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">{t("level")}</span>
              <span className="text-fg">{user.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">{t("joined")}</span>
              <span className="text-fg">
                {new Date(user.joinedAt).toLocaleDateString()}
              </span>
            </div>
            {user.sellerStats && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-fg-muted">{t("sellerStatus")}</span>
                  <Badge className={cn("text-xs", isSuspended ? "bg-danger/15 text-danger" : "bg-success/15 text-success")}>
                    {isSuspended ? t("suspended") : t("active")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">{t("totalEarnings")}</span>
                  <span className="text-fg">${(user.sellerStats.totalEarnings / 100).toLocaleString()}</span>
                </div>
              </>
            )}
            {user.builderStats && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-fg-muted">{t("published")}</span>
                  <span className="text-fg">{user.builderStats.publishedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">{t("installs")}</span>
                  <span className="text-fg">{user.builderStats.verifiedInstallCount}</span>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              {t("actions")}
            </p>
            {user.role !== "ADMIN" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChangeRole(user.id, user.role === "PRO" ? "USER" : "PRO")}
              >
                {user.role === "PRO" ? t("demoteToUser") : t("promoteToProAction")}
              </Button>
            )}
            {user.sellerStats && !isSuspended && (
              <Button
                variant="outline"
                size="sm"
                className="border-danger/30 text-danger hover:bg-danger/10"
                onClick={() => onSuspend(user.id)}
              >
                {t("suspendSeller")}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
