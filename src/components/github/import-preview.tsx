"use client";

import { FileText, GitBranch, Scale, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

import type { GitHubRepo, GitHubTreeEntry } from "@/types";
import { cn } from "@/lib/utils";
import { OrgBadge } from "./org-badge";

interface ImportPreviewProps {
  repo: GitHubRepo;
  tree: GitHubTreeEntry[];
  selectedPaths: string[];
  className?: string;
}

export function ImportPreview({
  repo,
  tree,
  selectedPaths,
  className,
}: ImportPreviewProps) {
  const t = useTranslations("github.importPreview");
  const fileCount = tree.filter((e) => e.type === "file").length;
  const totalSize = tree
    .filter((e) => selectedPaths.includes(e.path))
    .reduce((acc, e) => acc + e.size, 0);

  const hasReadme = tree.some(
    (e) => e.path.toLowerCase() === "readme.md" && e.type === "file",
  );

  return (
    <div
      className={cn(
        "rounded-lg border border-border-soft bg-bg-surface p-4 space-y-4",
        className,
      )}
    >
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-fg">{t("title")}</h4>
        <p className="text-xs text-fg-muted">{t("subtitle")}</p>
      </div>

      {/* Repo header */}
      <div className="rounded-md border border-border-soft bg-bg-raised/40 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-fg">
            {repo.owner}/{repo.name}
          </span>
          {repo.org && (
            <OrgBadge
              name={repo.org.name}
              verified={repo.org.verified}
              avatarUrl={repo.org.avatarUrl}
            />
          )}
        </div>
        <p className="text-xs text-fg-muted">{repo.description}</p>
      </div>

      {/* Detected info */}
      <div className="grid grid-cols-2 gap-3">
        <InfoRow
          icon={<FileText className="h-3.5 w-3.5" />}
          label={t("readmeLabel")}
          value={hasReadme ? t("readmeDetected") : t("readmeNone")}
        />
        <InfoRow
          icon={<Scale className="h-3.5 w-3.5" />}
          label={t("licenseLabel")}
          value={repo.license ?? t("licenseNone")}
        />
        <InfoRow
          icon={<GitBranch className="h-3.5 w-3.5" />}
          label={t("branchLabel")}
          value={repo.defaultBranch}
        />
        <InfoRow
          icon={<Tag className="h-3.5 w-3.5" />}
          label={t("languageLabel")}
          value={repo.language ?? t("languageNone")}
        />
      </div>

      {/* Selection summary */}
      <div className="rounded-md border border-brand/20 bg-brand/5 px-3 py-2">
        <p className="text-xs text-fg-muted">
          {t("selectionSummary", {
            selected: selectedPaths.length,
            total: fileCount,
            size: (totalSize / 1024).toFixed(1),
          })}
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-fg-subtle">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-fg-dim">{label}</p>
        <p className="text-xs font-medium text-fg">{value}</p>
      </div>
    </div>
  );
}
