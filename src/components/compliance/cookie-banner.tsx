"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useCookieConsent, useGpcHonored } from "@/hooks/use-cookie-consent";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const t = useTranslations("cookie");
  const { consent, setConsent, acceptAll, rejectAll } = useCookieConsent();
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);
  const [personalization, setPersonalization] = useState(false);
  const gpcHonored = useGpcHonored();

  if (consent) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-banner-title"
        className={cn(
          "fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-xl border border-border-strong bg-bg-surface/95 p-4 shadow-[var(--shadow-lg)] backdrop-blur",
          "sm:p-5",
        )}
      >
        <h2 id="cookie-banner-title" className="text-sm font-semibold text-fg">
          {t("title")}
        </h2>
        <p className="mt-1 text-xs text-fg-muted">{t("body")}</p>
        {gpcHonored && (
          <p
            className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300"
            role="status"
          >
            <ShieldCheck className="size-3" aria-hidden="true" />
            GPC honored
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={acceptAll}
            className="bg-brand text-brand-fg hover:bg-brand/90"
          >
            {t("acceptAll")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={rejectAll}
            className="border-border-strong"
          >
            {t("rejectAll")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCustomizeOpen(true)}
            className="border-border-strong"
          >
            {t("customize")}
          </Button>
        </div>
      </div>

      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("body")}</DialogDescription>
          </DialogHeader>
          <ul className="space-y-3">
            <ConsentRow
              label={t("essentialLabel")}
              description={t("essentialDescription")}
              checked
              disabled
              onChange={() => undefined}
            />
            <ConsentRow
              label={t("analyticsLabel")}
              description={t("analyticsDescription")}
              checked={analytics}
              onChange={setAnalytics}
            />
            <ConsentRow
              label={t("adsLabel")}
              description={t("adsDescription")}
              checked={ads}
              onChange={setAds}
            />
            <ConsentRow
              label={t("personalizationLabel")}
              description={t("personalizationDescription")}
              checked={personalization}
              onChange={setPersonalization}
            />
          </ul>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                setConsent({ analytics, ads, personalization });
                setCustomizeOpen(false);
              }}
              className="bg-brand text-brand-fg hover:bg-brand/90"
            >
              {t("save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ConsentRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-border-soft bg-bg-raised p-3">
      <div>
        <p className="text-sm font-medium text-fg">{label}</p>
        <p className="text-xs text-fg-muted">{description}</p>
      </div>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </li>
  );
}
