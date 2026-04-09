"use client";

import { CheckCircle2, Edit3, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CorrectionDialogProps {
  initial: { name: string; email: string; country: string };
  onSave?: (next: { name: string; email: string; country: string }) => void;
  trigger?: React.ReactNode;
}

export function CorrectionDialog({
  initial,
  onSave,
  trigger,
}: CorrectionDialogProps) {
  const t = useTranslations("dsrCorrection");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [country, setCountry] = useState(initial.country);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Mock backend call
      await new Promise((resolve) => setTimeout(resolve, 600));
      onSave?.({ name, email, country });
      setSaved(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setSaved(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Edit3 className="size-4" aria-hidden="true" />
            {t("trigger")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        {!saved ? (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dsr-name">{t("fields.name")}</Label>
              <Input
                id="dsr-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dsr-email">{t("fields.email")}</Label>
              <Input
                id="dsr-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dsr-country">{t("fields.country")}</Label>
              <Input
                id="dsr-country"
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase())}
                required
                maxLength={2}
                aria-describedby="dsr-country-help"
              />
              <p id="dsr-country-help" className="text-xs text-fg-subtle">
                ISO-3166 alpha-2 (e.g. US, DE, TR)
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-brand text-brand-fg hover:bg-brand/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    {t("submit")}
                  </>
                ) : (
                  t("submit")
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 size-5 text-emerald-300"
                aria-hidden="true"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-100">
                  {t("savedTitle")}
                </p>
                <p className="mt-1 text-xs text-emerald-100/80">{t("savedBody")}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
