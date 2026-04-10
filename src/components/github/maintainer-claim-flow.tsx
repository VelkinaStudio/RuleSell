"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  Github,
  LinkIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { GitHubRepo } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { RepoPicker } from "./repo-picker";
import { OrgBadge } from "./org-badge";

interface MaintainerClaimFlowProps {
  rulesetTitle: string;
  rulesetSlug: string;
  className?: string;
}

type ClaimStep = 1 | 2 | 3 | 4;

export function MaintainerClaimFlow({
  rulesetTitle,
  rulesetSlug,
  className,
}: MaintainerClaimFlowProps) {
  const t = useTranslations("github.claimFlow");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ClaimStep>(1);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [claiming, setClaiming] = useState(false);

  const handleConnect = () => {
    // Mock GitHub OAuth — just advance
    setStep(2);
  };

  const handleSelectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
  };

  const handleConfirm = async () => {
    setClaiming(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setClaiming(false);
    setStep(4);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset after animation
    setTimeout(() => {
      setStep(1);
      setSelectedRepo(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 border-border-soft text-xs text-fg-muted hover:border-brand hover:text-brand",
            className,
          )}
        >
          <Github className="h-3.5 w-3.5" />
          {t("triggerButton")}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-bg-surface sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-fg">{t("dialogTitle")}</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepWrapper key="s1">
              <div className="space-y-4 py-2 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-bg-raised">
                  <Github className="h-7 w-7 text-fg-muted" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-fg">
                    {t("step1Title")}
                  </p>
                  <p className="text-xs text-fg-muted">
                    {t("step1Desc")}
                  </p>
                </div>
                <Button
                  onClick={handleConnect}
                  className="bg-brand text-brand-fg hover:bg-brand/90"
                >
                  <Github className="mr-1.5 h-4 w-4" />
                  {t("connectGitHub")}
                </Button>
              </div>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper key="s2">
              <div className="space-y-3">
                <p className="text-sm text-fg-muted">{t("step2Desc")}</p>
                <RepoPicker
                  selectedRepo={selectedRepo}
                  onSelect={handleSelectRepo}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!selectedRepo}
                    className="bg-brand text-brand-fg hover:bg-brand/90"
                  >
                    {t("continue")}
                  </Button>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 3 && selectedRepo && (
            <StepWrapper key="s3">
              <div className="space-y-4">
                <p className="text-sm text-fg-muted">{t("step3Desc")}</p>

                <div className="rounded-lg border border-border-soft bg-bg-raised/60 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-fg-subtle" />
                    <span className="text-xs uppercase tracking-wider text-fg-dim">
                      {t("linkPreview")}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-fg">
                        {rulesetTitle}
                      </p>
                      <p className="text-[11px] text-fg-subtle">
                        rulesell.dev/r/{rulesetSlug}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-fg">
                        {selectedRepo.fullName}
                      </p>
                      <a
                        href={`https://github.com/${selectedRepo.fullName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[11px] text-fg-subtle hover:text-fg"
                      >
                        github.com <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                  {selectedRepo.org && (
                    <OrgBadge
                      name={selectedRepo.org.name}
                      verified={selectedRepo.org.verified}
                      avatarUrl={selectedRepo.org.avatarUrl}
                    />
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    {t("back")}
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={claiming}
                    className="bg-brand text-brand-fg hover:bg-brand/90"
                  >
                    {claiming ? t("claiming") : t("confirmClaim")}
                  </Button>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper key="s4">
              <div className="space-y-4 py-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-fg">
                    {t("step4Title")}
                  </p>
                  <p className="text-xs text-fg-muted">
                    {t("step4Desc")}
                  </p>
                </div>

                {/* Badge preview */}
                <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
                  <BadgeCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-300">
                    {t("maintainerVerified")}
                  </span>
                </div>

                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="mt-2"
                >
                  {t("done")}
                </Button>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
