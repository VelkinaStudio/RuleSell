"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

type KycErrors = Partial<Record<keyof KycFields, string>>;
type KycTouched = Partial<Record<keyof KycFields, boolean>>;

const INITIAL: KycFields = {
  legalName: "",
  country: "",
  line1: "",
  city: "",
  postal: "",
  bank: "",
  reg: "",
};

const ISO2 = /^[A-Za-z]{2}$/;

export function KycForm({ onSubmitted }: KycFormProps) {
  const t = useTranslations("dashboard.settings.seller");
  const [fields, setFields] = useState<KycFields>(INITIAL);
  const [errors, setErrors] = useState<KycErrors>({});
  const [touched, setTouched] = useState<KycTouched>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (data: KycFields): KycErrors => {
    const errs: KycErrors = {};
    if (!data.legalName.trim()) errs.legalName = t("kycErrorRequired");
    if (!data.country.trim()) {
      errs.country = t("kycErrorRequired");
    } else if (!ISO2.test(data.country)) {
      errs.country = t("kycErrorCountryFormat");
    }
    if (!data.bank.trim()) errs.bank = t("kycErrorRequired");
    return errs;
  };

  const update =
    (key: keyof KycFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = { ...fields, [key]: e.target.value };
      setFields(next);
      if (touched[key]) {
        setErrors(validate(next));
      }
    };

  const handleBlur = (key: keyof KycFields) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validate(fields));
  };

  // Region-specific compliance detection
  const countryUpper = fields.country.toUpperCase();
  const EU_CODES = ["DE","FR","IT","ES","NL","BE","AT","PT","GR","FI","IE","LU","MT","CY","EE","LV","LT","SK","SI","HR","BG","RO","CZ","PL","SE","DK","HU"];
  const isEU = EU_CODES.includes(countryUpper);
  const isUK = countryUpper === "GB";
  const isUS = countryUpper === "US";
  const regionNotice = isEU
    ? "EU seller: DSA Art 30 trader identification required. VAT number needed if registered."
    : isUK
      ? "UK seller: Companies House registration or sole trader details required."
      : isUS
        ? "US seller: SSN or EIN required for 1099-K tax reporting."
        : fields.country.length === 2
          ? "Stripe Connect handles compliance for your region. Additional documents may be requested."
          : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: KycTouched = Object.fromEntries(
      Object.keys(INITIAL).map((k) => [k, true]),
    );
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rulesell:kyc-status", "pending");
    }
    // In production: redirect to Stripe Connect Express onboarding
    // window.location.href = `/api/stripe/connect/onboard?country=${fields.country}`
    setTimeout(() => {
      setSubmitting(false);
      toast.success(t("kycSubmitted"));
      onSubmitted?.();
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Region-specific compliance notice */}
      {regionNotice && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs text-amber-300">{regionNotice}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label={t("kycLegalName")}
          error={touched.legalName ? errors.legalName : undefined}
        >
          <Input
            value={fields.legalName}
            onChange={update("legalName")}
            onBlur={handleBlur("legalName")}
            aria-invalid={!!errors.legalName && !!touched.legalName}
            className={cn(
              touched.legalName && errors.legalName && "border-danger focus-visible:ring-danger/40",
            )}
          />
        </Field>
        <Field
          label={t("kycCountry")}
          error={touched.country ? errors.country : undefined}
        >
          <Input
            value={fields.country}
            onChange={update("country")}
            onBlur={handleBlur("country")}
            placeholder="DE, US, TR…"
            maxLength={2}
            aria-invalid={!!errors.country && !!touched.country}
            className={cn(
              touched.country && errors.country && "border-danger focus-visible:ring-danger/40",
            )}
          />
        </Field>
      </div>

      <Field label={t("kycLine1")}>
        <Input value={fields.line1} onChange={update("line1")} onBlur={handleBlur("line1")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("kycCity")}>
          <Input value={fields.city} onChange={update("city")} onBlur={handleBlur("city")} />
        </Field>
        <Field label={t("kycPostal")}>
          <Input value={fields.postal} onChange={update("postal")} onBlur={handleBlur("postal")} />
        </Field>
      </div>

      <Field
        label={t("kycBank")}
        error={touched.bank ? errors.bank : undefined}
      >
        <Input
          value={fields.bank}
          onChange={update("bank")}
          onBlur={handleBlur("bank")}
          placeholder="•••• 4242"
          aria-invalid={!!errors.bank && !!touched.bank}
          className={cn(
            touched.bank && errors.bank && "border-danger focus-visible:ring-danger/40",
          )}
        />
      </Field>

      <Field label={t("kycReg")}>
        <Input value={fields.reg} onChange={update("reg")} onBlur={handleBlur("reg")} />
      </Field>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-brand text-brand-fg hover:bg-brand/90"
        >
          {submitting ? t("kycSubmitting") : t("kycSubmit")}
        </Button>
        <p className="text-[11px] text-fg-subtle">
          {t("kycStripeNote")}
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-fg-muted">{label}</Label>
      {children}
      {error && (
        <p role="alert" className="flex items-center gap-1 text-[11px] text-danger">
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
