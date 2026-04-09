"use client";

import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Link } from "@/i18n/navigation";
import { useSession } from "@/hooks/use-session";

/**
 * Client-side gate for the dashboard. We don't have real auth in v1 — the
 * persona is mocked through localStorage. So this guards the dashboard pages
 * by showing a sign-in CTA when persona is "visitor", and a loading skeleton
 * during the brief useSyncExternalStore reconcile pass.
 *
 * The /dev/users page is the documented escape hatch for switching persona
 * during development.
 */
export function DashboardAuthGate({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();
  const t = useTranslations("dashboard.gate");

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <EmptyState
          icon={<LogIn className="h-5 w-5" />}
          title={t("title")}
          description={t("description")}
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button asChild className="bg-brand text-brand-fg hover:bg-brand/90">
                <Link href="/signin">{t("signIn")}</Link>
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
