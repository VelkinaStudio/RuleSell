"use client";

import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { useSession } from "@/hooks/use-session";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function AdminRoleGate({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();
  const t = useTranslations("admin.gate");

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  if (data?.user?.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <EmptyState
          icon={<ShieldAlert className="h-5 w-5" />}
          title={t("forbiddenTitle")}
          description={t("forbiddenDescription")}
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button asChild variant="outline">
                <Link href="/dashboard/overview">{t("backToDashboard")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dev/users">{t("switchPersona")}</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
