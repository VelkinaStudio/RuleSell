import type { Metadata } from "next";
import {
  Activity,
  AlertOctagon,
  Bot,
  Eye,
  FileText,
  Gavel,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalArticle } from "@/components/legal/legal-article";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  note?: string;
  accent?: "default" | "warn" | "ok";
}

function MetricCard({ icon, title, value, note, accent = "default" }: MetricCardProps) {
  const accentClass =
    accent === "warn"
      ? "border-amber-500/30 bg-amber-500/5"
      : accent === "ok"
        ? "border-emerald-500/30 bg-emerald-500/5"
        : "border-border-soft bg-bg-surface/70";
  return (
    <div className={`rounded-lg border p-5 ${accentClass}`}>
      <div className="mb-3 flex items-center gap-2 text-fg-muted">
        <span aria-hidden="true">{icon}</span>
        <p className="text-xs font-semibold uppercase tracking-wider">{title}</p>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-fg">{value}</p>
      {note ? <p className="mt-2 text-xs text-fg-subtle">{note}</p> : null}
    </div>
  );
}

interface CountRowProps {
  label: string;
  value: number;
  total: number;
}

function CountRow({ label, value, total }: CountRowProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <li className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="flex items-center gap-3">
        <span
          className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-raised"
          aria-hidden="true"
        >
          <span
            className="block h-full rounded-full bg-brand"
            style={{ width: `${pct}%` }}
          />
        </span>
        <span className="w-10 text-right text-sm font-medium tabular-nums text-fg">
          {value}
        </span>
      </span>
    </li>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.transparency" });
  return { title: `${t("title")} — RuleSell` };
}

export default async function TransparencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.transparency" });

  // Mock counts — frozen for v1 per spec §11. Real numbers come from the
  // moderation pipeline in v2.
  const moderation = {
    removed: 14,
    demoted: 6,
    warned: 21,
    restored: 3,
  };
  const moderationTotal = Object.values(moderation).reduce((a, b) => a + b, 0);

  const notices = {
    ip: 9,
    malware: 4,
    illegal: 1,
    hate: 2,
    privacy: 3,
    other: 5,
  };
  const noticesTotal = Object.values(notices).reduce((a, b) => a + b, 0);

  const decisions = { automated: 38, human: 23 };
  const appeals = { upheld: 4, overturned: 2 };

  return (
    <LegalArticle
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      intro={t("intro")}
    >
      <div className="not-prose grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          icon={<Users className="size-4" />}
          title={t("mauTitle")}
          value={t("mauValue")}
          note={`${t("mauPeriod")} — ${t("mauNote")}`}
          accent="default"
        />
        <MetricCard
          icon={<Gavel className="size-4" />}
          title={t("ordersTitle")}
          value={t("ordersValue")}
          note={t("ordersNote")}
          accent="ok"
        />
      </div>

      <section className="not-prose mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
          <ShieldCheck className="size-4" aria-hidden="true" />
          {t("moderationTitle")}
        </h2>
        <ul className="divide-y divide-border-soft rounded-lg border border-border-soft bg-bg-surface/70 px-4">
          <CountRow
            label={t("moderationRemoved")}
            value={moderation.removed}
            total={moderationTotal}
          />
          <CountRow
            label={t("moderationDemoted")}
            value={moderation.demoted}
            total={moderationTotal}
          />
          <CountRow
            label={t("moderationWarned")}
            value={moderation.warned}
            total={moderationTotal}
          />
          <CountRow
            label={t("moderationRestored")}
            value={moderation.restored}
            total={moderationTotal}
          />
        </ul>
      </section>

      <section className="not-prose mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
          <AlertOctagon className="size-4" aria-hidden="true" />
          {t("noticesTitle")}
        </h2>
        <ul className="divide-y divide-border-soft rounded-lg border border-border-soft bg-bg-surface/70 px-4">
          <CountRow label={t("noticesIp")} value={notices.ip} total={noticesTotal} />
          <CountRow
            label={t("noticesMalware")}
            value={notices.malware}
            total={noticesTotal}
          />
          <CountRow
            label={t("noticesIllegal")}
            value={notices.illegal}
            total={noticesTotal}
          />
          <CountRow
            label={t("noticesHate")}
            value={notices.hate}
            total={noticesTotal}
          />
          <CountRow
            label={t("noticesPrivacy")}
            value={notices.privacy}
            total={noticesTotal}
          />
          <CountRow
            label={t("noticesOther")}
            value={notices.other}
            total={noticesTotal}
          />
        </ul>
      </section>

      <div className="not-prose mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          icon={<Bot className="size-4" />}
          title={t("decisionsTitle")}
          value={`${decisions.automated} / ${decisions.human}`}
          note={`${t("decisionsAutomated")} / ${t("decisionsHuman")}`}
        />
        <MetricCard
          icon={<Activity className="size-4" />}
          title={t("appealsTitle")}
          value={`${appeals.upheld} / ${appeals.overturned}`}
          note={`${t("appealsUpheld")} / ${t("appealsOverturned")}`}
        />
      </div>

      <section className="not-prose mt-10 rounded-lg border border-border-soft bg-bg-raised/50 p-5">
        <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          <Eye className="size-3.5" aria-hidden="true" />
          {t("methodology")}
        </p>
        <p className="text-sm text-fg-muted">{t("methodologyBody")}</p>
      </section>

      <section className="not-prose mt-6 rounded-lg border border-border-soft bg-bg-surface/70 p-5">
        <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          <FileText className="size-3.5" aria-hidden="true" />
          {t("annualLabel")}
        </p>
        <a
          href="#"
          className="text-sm font-medium text-brand underline-offset-2 hover:underline"
          aria-disabled="true"
        >
          {t("annualLink")}
        </a>
      </section>
    </LegalArticle>
  );
}
