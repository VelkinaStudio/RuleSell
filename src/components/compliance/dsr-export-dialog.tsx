"use client";

import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ALL_DSR_CATEGORIES,
  type DsrCategory,
  useDsrExport,
} from "@/hooks/use-dsr";

interface DsrExportDialogProps {
  username: string;
  trigger?: React.ReactNode;
}

export function DsrExportDialog({ username, trigger }: DsrExportDialogProps) {
  const t = useTranslations("dsrExport");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<DsrCategory>>(
    new Set(ALL_DSR_CATEGORIES),
  );
  const { buildExport, building, result, reset } = useDsrExport();

  const toggle = (cat: DsrCategory) => {
    const next = new Set(selected);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setSelected(next);
  };

  const allSelected = selected.size === ALL_DSR_CATEGORIES.length;
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(ALL_DSR_CATEGORIES));
  };

  const submit = async () => {
    await buildExport({ categories: Array.from(selected), username });
  };

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Download className="size-4" aria-hidden="true" />
            {t("trigger")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <fieldset>
              <legend className="text-sm font-medium text-fg">
                {t("categoriesLabel")}
              </legend>
              <div className="mt-3 space-y-2">
                <Label className="flex items-center gap-2 rounded-md border border-border-soft bg-bg-raised/50 p-2.5">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label={t("selectAll")}
                  />
                  <span className="text-sm font-medium text-fg">
                    {t("selectAll")}
                  </span>
                </Label>
                <ul className="space-y-1.5">
                  {ALL_DSR_CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <Label
                        htmlFor={`dsr-cat-${cat}`}
                        className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border-soft bg-bg-surface/60 p-2.5 transition hover:border-border-strong has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-brand/5"
                      >
                        <Checkbox
                          id={`dsr-cat-${cat}`}
                          checked={selected.has(cat)}
                          onCheckedChange={() => toggle(cat)}
                          className="mt-0.5"
                        />
                        <span className="text-sm text-fg">
                          {t(`categories.${cat}`)}
                        </span>
                      </Label>
                    </li>
                  ))}
                </ul>
              </div>
            </fieldset>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => handleClose(false)}>
                {t("cancel")}
              </Button>
              <Button
                onClick={submit}
                disabled={building || selected.size === 0}
                className="bg-brand text-brand-fg hover:bg-brand/90"
              >
                {building ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    {t("preparing")}
                  </>
                ) : (
                  t("request")
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
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
                    {t("ready")}
                  </p>
                  <p className="mt-1 text-xs text-emerald-100/80">{t("audit")}</p>
                </div>
              </div>
            </div>
            <a
              href={result.blobUrl}
              download={result.filename}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-fg transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <Download className="size-4" aria-hidden="true" />
              {t("download")}
            </a>
            <p className="text-center text-xs text-fg-subtle">Ref: {result.ref}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
