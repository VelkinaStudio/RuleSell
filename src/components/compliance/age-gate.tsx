"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSanctioned } from "@/lib/compliance/sanctions";

const SAMPLE_COUNTRIES: { code: string; label: string }[] = [
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
  { code: "NL", label: "Netherlands" },
  { code: "TR", label: "Türkiye" },
  { code: "JP", label: "Japan" },
  { code: "IN", label: "India" },
  { code: "BR", label: "Brazil" },
  { code: "AU", label: "Australia" },
  { code: "CU", label: "Cuba" },
  { code: "IR", label: "Iran" },
  { code: "KP", label: "North Korea" },
  { code: "SY", label: "Syria" },
];

interface AgeGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { dateOfBirth: string; country: string }) => void;
}

function ageInYears(dob: string): number {
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return -1;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function AgeGate({ open, onOpenChange, onConfirm }: AgeGateProps) {
  const t = useTranslations("ageGate");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ageInYears(dob) < 18) {
      setError(t("underageError"));
      return;
    }
    if (isSanctioned(country)) {
      setError(t("sanctionedError"));
      return;
    }
    setError(null);
    onConfirm({ dateOfBirth: dob, country });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("body")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dob">{t("dateOfBirth")}</Label>
            <Input
              id="dob"
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">{t("country")}</Label>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger id="country">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={!dob || !country}
            className="w-full bg-brand text-brand-fg hover:bg-brand/90"
          >
            {t("submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
