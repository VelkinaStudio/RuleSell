"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Lock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { KycForm } from "@/components/dashboard/kyc-form";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";

type Stage = 1 | 2 | 3 | 4;

export default function SettingsSellerPage() {
  const t = useTranslations("dashboard.settings");
  const tSeller = useTranslations("dashboard.settings.seller");
  const { data: session } = useSession();
  const user = session?.user;

  const builderStats = user?.builderStats;
  const sellerStats = user?.sellerStats;

  // Local stage transition for the mock KYC submit. Once submitted we move
  // from stage 2 → stage 3 in-place without backend persistence.
  const [submitted, setSubmitted] = useState(false);

  const stage: Stage = (() => {
    if (sellerStats?.traderVerified) return 4;
    if (sellerStats?.paymentConnectStatus === "pending" || submitted) return 3;
    if (builderStats?.canSellPaid) return 2;
    return 1;
  })();

  const installCount = builderStats?.verifiedInstallCount ?? 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </header>

      <SettingsTabs />

      <div className="space-y-6">
        <StageIndicator stage={stage} />

        {stage === 1 && (
          <Card icon={Lock} accent="text-fg-subtle">
            <h2 className="text-base font-semibold text-fg">
              {tSeller("stage1Title")}
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              {tSeller("stage1Description")}
            </p>
            <div className="mt-4">
              <p className="text-xs font-medium text-fg-muted">
                {tSeller("stage1Progress", { count: installCount })}
              </p>
              <div
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-raised"
                role="progressbar"
                aria-valuenow={installCount}
                aria-valuemin={0}
                aria-valuemax={50}
              >
                <div
                  className="h-full bg-brand transition-all"
                  style={{
                    width: `${Math.min(100, (installCount / 50) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        )}

        {stage === 2 && (
          <Card icon={ShieldCheck} accent="text-amber-300">
            <h2 className="text-base font-semibold text-fg">
              {tSeller("stage2Title")}
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              {tSeller("stage2Description")}
            </p>
            <div className="mt-5">
              <KycForm onSubmitted={() => setSubmitted(true)} />
            </div>
          </Card>
        )}

        {stage === 3 && (
          <Card icon={Clock} accent="text-amber-300">
            <h2 className="text-base font-semibold text-fg">
              {tSeller("stage3Title")}
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              {tSeller("stage3Description")}
            </p>
          </Card>
        )}

        {stage === 4 && sellerStats && (
          <>
            <Card icon={CheckCircle2} accent="text-emerald-300">
              <h2 className="text-base font-semibold text-fg">
                {tSeller("stage4Title")}
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                {tSeller("stage4Description")}
              </p>
            </Card>
            <div className="rounded-xl border border-border-soft bg-bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                {tSeller("stripeStatus")}
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
                    sellerStats.paymentConnectStatus === "verified" &&
                      "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
                    sellerStats.paymentConnectStatus === "pending" &&
                      "border-amber-500/30 bg-amber-500/15 text-amber-300",
                    sellerStats.paymentConnectStatus === "none" &&
                      "border-zinc-500/30 bg-zinc-500/15 text-zinc-400",
                  )}
                >
                  {tSeller(
                    `stripeStatus${
                      sellerStats.paymentConnectStatus[0].toUpperCase() +
                      sellerStats.paymentConnectStatus.slice(1)
                    }`,
                  )}
                </span>
                <Button variant="outline" size="sm">
                  {tSeller("stripeDisconnect")}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border-soft bg-bg-surface p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-raised">
          <Icon className={cn("h-4 w-4", accent)} />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  );
}

function StageIndicator({ stage }: { stage: Stage }) {
  const tSeller = useTranslations("dashboard.settings.seller");
  const stageLabels = [
    tSeller("stage1StepLabel"),
    tSeller("stage2StepLabel"),
    tSeller("stage3StepLabel"),
    tSeller("stage4StepLabel"),
  ] as const;

  return (
    <ol
      className="flex w-full items-center"
      aria-label={`Stage ${stage} of 4`}
    >
      {([1, 2, 3, 4] as const).map((s) => {
        const completed = s < stage;
        const current = s === stage;

        return (
          <li key={s} className="flex flex-1 items-center">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  completed &&
                    "border-emerald-500 bg-emerald-500 text-white",
                  current &&
                    "border-brand bg-brand text-brand-fg shadow-[0_0_0_3px_hsl(var(--brand)/0.2)]",
                  !completed &&
                    !current &&
                    "border-border-strong bg-bg-surface text-fg-subtle",
                )}
                aria-current={current ? "step" : undefined}
              >
                {completed ? (
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  s
                )}
              </span>
              <span
                className={cn(
                  "hidden text-[10px] font-medium sm:block",
                  completed && "text-emerald-400",
                  current && "text-brand",
                  !completed && !current && "text-fg-subtle",
                )}
              >
                {stageLabels[s - 1]}
              </span>
            </div>

            {/* Connector line (between circles) */}
            {s < 4 && (
              <span
                className={cn(
                  "mb-5 h-0.5 flex-1",
                  s < stage ? "bg-emerald-500" : "bg-border-soft",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
