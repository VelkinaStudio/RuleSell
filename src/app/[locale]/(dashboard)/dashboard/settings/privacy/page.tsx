"use client";

import { useTranslations } from "next-intl";

import { PrivacyPanel } from "@/components/compliance/privacy-panel";
import { useSession } from "@/hooks/use-session";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";

export default function SettingsPrivacyPage() {
  const t = useTranslations("dashboard.settings");
  const { data } = useSession();
  const user = data?.user;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </header>

      <SettingsTabs />

      {user && (
        <PrivacyPanel
          user={{
            username: user.username,
            name: user.name,
            email: user.email,
            countryOfResidence: user.countryOfResidence,
          }}
        />
      )}
    </div>
  );
}
