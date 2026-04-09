"use client";

import { AlertTriangle, CheckCircle2, Loader2, Trash2 } from "lucide-react";
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
import { useDsrDeletion } from "@/hooks/use-dsr";

interface DeletionDialogProps {
  username: string;
  trigger?: React.ReactNode;
}

export function DeletionDialog({ username, trigger }: DeletionDialogProps) {
  const t = useTranslations("dsrDelete");
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { requestDeletion, submitting, result, reset } = useDsrDeletion();

  const submit = async () => {
    if (confirm !== username) {
      setValidationError(t("mismatchError"));
      return;
    }
    setValidationError(null);
    await requestDeletion(username);
  };

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) {
      reset();
      setConfirm("");
      setValidationError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="border-danger/50 text-danger hover:bg-danger/10">
            <Trash2 className="size-4" aria-hidden="true" />
            {t("trigger")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("warning")}</DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4"
            >
              <AlertTriangle
                className="mt-0.5 size-5 text-danger"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-danger/90">
                {t("consequences")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dsr-confirm">{t("confirmLabel")}</Label>
              <Input
                id="dsr-confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t("confirmPlaceholder", { username })}
                autoComplete="off"
                spellCheck={false}
              />
              {validationError && (
                <p role="alert" className="text-xs text-danger">
                  {validationError}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => handleClose(false)}>
                {t("cancel")}
              </Button>
              <Button
                onClick={submit}
                disabled={submitting || confirm !== username}
                className="bg-danger text-white hover:bg-danger/90"
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
          </div>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 size-5 text-amber-300"
                aria-hidden="true"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-100">
                  {t("scheduledTitle")}
                </p>
                <p className="mt-1 text-xs text-amber-100/80">
                  {t("scheduledBody", { date: result.scheduledFor })}
                </p>
                <p className="mt-2 text-[10px] text-amber-100/60">
                  Ref: {result.ref}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
