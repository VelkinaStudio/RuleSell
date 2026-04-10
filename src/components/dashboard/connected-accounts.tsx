"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Github,
  Mail,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

interface ConnectedAccount {
  provider: "github" | "google" | "email";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  detail?: string;
  verified?: boolean;
}

export function ConnectedAccounts() {
  const t = useTranslations("dashboard.settings.connections");
  const { data: session } = useSession();
  const user = session?.user;

  // Mock connected state — in production, read from user.accounts
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    {
      provider: "email",
      label: t("email"),
      icon: Mail,
      connected: true,
      detail: user?.email ?? "user@example.com",
      verified: false, // TODO: read from user.emailVerified when available in User type
    },
    {
      provider: "github",
      label: "GitHub",
      icon: Github,
      connected: false,
      detail: undefined,
    },
    {
      provider: "google",
      label: "Google",
      icon: GoogleIcon,
      connected: false,
      detail: undefined,
    },
  ]);

  const [resending, setResending] = useState(false);

  const handleConnect = (provider: string) => {
    // Mock — in production, redirect to OAuth
    setAccounts((prev) =>
      prev.map((a) =>
        a.provider === provider
          ? { ...a, connected: true, detail: `${provider}-user` }
          : a,
      ),
    );
    toast.success(t("connected", { provider }));
  };

  const handleDisconnect = (provider: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.provider === provider
          ? { ...a, connected: false, detail: undefined }
          : a,
      ),
    );
    toast.success(t("disconnected", { provider }));
  };

  const handleResendVerification = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      toast.success(t("verificationSent"));
    }, 1000);
  };

  return (
    <section className="space-y-4 rounded-xl border border-border-soft bg-bg-surface p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
        {t("title")}
      </h2>
      <p className="text-xs text-fg-muted">{t("description")}</p>

      <div className="space-y-3">
        {accounts.map((account) => {
          const Icon = account.icon;
          return (
            <div
              key={account.provider}
              className="flex items-center gap-3 rounded-lg border border-border-soft bg-bg-raised/40 px-4 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-surface">
                <Icon className="h-4.5 w-4.5 text-fg-muted" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-fg">
                    {account.label}
                  </span>
                  {account.connected && account.verified !== false && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  )}
                  {account.connected && account.verified === false && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400">
                      <AlertCircle className="h-3 w-3" />
                      {t("unverified")}
                    </span>
                  )}
                </div>
                {account.detail && (
                  <p className="truncate text-xs text-fg-subtle">
                    {account.detail}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Resend verification for unverified email */}
                {account.provider === "email" &&
                  account.connected &&
                  account.verified === false && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResendVerification}
                      disabled={resending}
                      className="text-xs"
                    >
                      {resending ? t("sending") : t("resendVerification")}
                    </Button>
                  )}

                {/* Connect/Disconnect for OAuth providers */}
                {account.provider !== "email" && (
                  <Button
                    size="sm"
                    variant={account.connected ? "outline" : "default"}
                    onClick={() =>
                      account.connected
                        ? handleDisconnect(account.provider)
                        : handleConnect(account.provider)
                    }
                    className={cn(
                      "text-xs",
                      !account.connected &&
                        "bg-brand text-brand-fg hover:bg-brand/90",
                    )}
                  >
                    {account.connected ? t("disconnect") : t("connect")}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* GitHub connection note for maintainer flow */}
      <p className="text-[11px] text-fg-subtle">
        {t("githubNote")}
      </p>
    </section>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v4.5h4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
