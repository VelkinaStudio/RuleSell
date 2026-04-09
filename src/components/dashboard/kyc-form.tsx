"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface KycFormProps {
  onSubmitted?: () => void;
}

interface KycFields {
  legalName: string;
  country: string;
  line1: string;
  city: string;
  postal: string;
  bank: string;
  reg: string;
}

const INITIAL: KycFields = {
  legalName: "",
  country: "",
  line1: "",
  city: "",
  postal: "",
  bank: "",
  reg: "",
};

export function KycForm({ onSubmitted }: KycFormProps) {
  const t = useTranslations("dashboard.settings.seller");
  const [fields, setFields] = useState<KycFields>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const update =
    (key: keyof KycFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.legalName || !fields.country || !fields.bank) return;
    setSubmitting(true);
    // Mock submit — write status to localStorage and notify parent.
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rulesell:kyc-status", "pending");
    }
    setTimeout(() => {
      setSubmitting(false);
      toast.success(t("kycSubmitted"));
      onSubmitted?.();
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("kycLegalName")}>
          <Input value={fields.legalName} onChange={update("legalName")} required />
        </Field>
        <Field label={t("kycCountry")}>
          <Input
            value={fields.country}
            onChange={update("country")}
            placeholder="ISO-3166 (e.g. DE, US, TR)"
            maxLength={2}
            required
          />
        </Field>
      </div>

      <Field label={t("kycLine1")}>
        <Input value={fields.line1} onChange={update("line1")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("kycCity")}>
          <Input value={fields.city} onChange={update("city")} />
        </Field>
        <Field label={t("kycPostal")}>
          <Input value={fields.postal} onChange={update("postal")} />
        </Field>
      </div>

      <Field label={t("kycBank")}>
        <Input
          value={fields.bank}
          onChange={update("bank")}
          placeholder="•••• 4242"
          required
        />
      </Field>

      <Field label={t("kycReg")}>
        <Input value={fields.reg} onChange={update("reg")} />
      </Field>

      <Button
        type="submit"
        disabled={submitting}
        className="bg-brand text-brand-fg hover:bg-brand/90"
      >
        {t("kycSubmit")}
      </Button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-fg-muted">{label}</Label>
      {children}
    </div>
  );
}
