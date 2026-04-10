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
    setTimeout(() => {
      setSubmitting(false);
      toast.success(t("kycSubmitted"));
      onSubmitted?.();
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
