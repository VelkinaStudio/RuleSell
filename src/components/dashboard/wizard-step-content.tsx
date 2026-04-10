"use client";

import { useState } from "react";
import { Github, ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type { GitHubRepo } from "@/types";
import { useGitHubRepos } from "@/hooks/use-github-repos";
import { RepoPicker } from "@/components/github/repo-picker";
import { RepoTreeBrowser } from "@/components/github/repo-tree-browser";
import { ImportPreview } from "@/components/github/import-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { WizardDraft } from "@/hooks/use-publish-draft";

interface Props {
  draft: WizardDraft;
  onChange: (patch: WizardDraft) => void;
}

const TITLE_MAX = 80;
const DESC_MAX = 400;
const PREVIEW_MAX = 500;
const TAG_MAX = 8;

export function WizardStepContent({ draft, onChange }: Props) {
  const t = useTranslations("publishWizard.content");
  const tGh = useTranslations("github.wizardImport");
  const [tagDraft, setTagDraft] = useState("");
  const [githubMode, setGithubMode] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [importStep, setImportStep] = useState<"pick" | "tree" | "preview">(
    "pick",
  );
  const { getTree } = useGitHubRepos();

  const tags = draft.tags ?? [];

  const handleRepoSelect = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    const tree = getTree(repo.fullName);
    // Auto-select all files
    setSelectedPaths(tree.filter((e) => e.type === "file").map((e) => e.path));
    setImportStep("tree");
  };

  const handleImportConfirm = () => {
    if (!selectedRepo) return;
    // Populate draft fields from the repo data
    onChange({
      title: selectedRepo.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: selectedRepo.description,
      previewContent: `Imported from ${selectedRepo.fullName}. ${selectedPaths.length} files selected.`,
      license: selectedRepo.license ?? undefined,
    });
    setImportStep("preview");
  };

  const addTag = () => {
    const trimmed = tagDraft.trim();
    if (!trimmed) return;
    if (trimmed.length < 2 || trimmed.length > 24) return;
    if (tags.length >= TAG_MAX) return;
    if (tags.includes(trimmed)) return;
    onChange({ tags: [...tags, trimmed] });
    setTagDraft("");
  };

  const removeTag = (tag: string) => {
    onChange({ tags: tags.filter((t) => t !== tag) });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{t("description")}</p>
      </header>

      {/* GitHub import toggle */}
      <div className="flex items-center justify-between rounded-lg border border-border-soft bg-bg-raised/40 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Github className="h-4 w-4 text-fg-muted" />
          <div>
            <p className="text-sm font-medium text-fg">
              {tGh("toggleLabel")}
            </p>
            <p className="text-[11px] text-fg-subtle">
              {tGh("toggleHint")}
            </p>
          </div>
        </div>
        <Switch
          checked={githubMode}
          onCheckedChange={(checked) => {
            setGithubMode(checked === true);
            if (!checked) {
              setSelectedRepo(null);
              setSelectedPaths([]);
              setImportStep("pick");
            }
          }}
        />
      </div>

      {/* GitHub import flow — replaces manual editor when active */}
      {githubMode && (
        <div className="space-y-4 rounded-lg border border-brand/20 bg-brand/5 p-4">
          {importStep === "pick" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-fg">{tGh("pickTitle")}</p>
              <RepoPicker
                selectedRepo={selectedRepo}
                onSelect={handleRepoSelect}
              />
            </div>
          )}

          {importStep === "tree" && selectedRepo && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-fg">
                  {tGh("treeTitle", { repo: selectedRepo.fullName })}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRepo(null);
                    setSelectedPaths([]);
                    setImportStep("pick");
                  }}
                  className="text-[11px] text-fg-subtle hover:text-fg"
                >
                  {tGh("changeRepo")}
                </button>
              </div>
              <RepoTreeBrowser
                entries={getTree(selectedRepo.fullName)}
                selectedPaths={selectedPaths}
                onSelectionChange={setSelectedPaths}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleImportConfirm}
                  disabled={selectedPaths.length === 0}
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-fg transition hover:bg-brand/90 disabled:opacity-50"
                >
                  {tGh("importSelected")}
                </button>
              </div>
            </div>
          )}

          {importStep === "preview" && selectedRepo && (
            <div className="space-y-3">
              <ImportPreview
                repo={selectedRepo}
                tree={getTree(selectedRepo.fullName)}
                selectedPaths={selectedPaths}
              />
              <button
                type="button"
                onClick={() => setImportStep("tree")}
                className="text-[11px] text-fg-subtle hover:text-fg"
              >
                {tGh("editSelection")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Manual content editor — hidden when GitHub import is active and past pick step */}
      {(!githubMode || importStep === "pick") && (<>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="wiz-title">{t("titleLabel")}</Label>
          <span className="text-[11px] tabular-nums text-fg-subtle">
            {(draft.title ?? "").length} / {TITLE_MAX}
          </span>
        </div>
        <Input
          id="wiz-title"
          value={draft.title ?? ""}
          maxLength={TITLE_MAX}
          placeholder={t("titlePlaceholder")}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="wiz-desc">{t("shortDescription")}</Label>
          <span className="text-[11px] tabular-nums text-fg-subtle">
            {(draft.description ?? "").length} / {DESC_MAX}
          </span>
        </div>
        <Textarea
          id="wiz-desc"
          value={draft.description ?? ""}
          maxLength={DESC_MAX}
          rows={3}
          onChange={(e) => onChange({ description: e.target.value })}
        />
        <p className="text-[11px] text-fg-subtle">
          {t("shortDescriptionHint")}
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="wiz-preview">{t("previewLabel")}</Label>
          <span className="text-[11px] tabular-nums text-fg-subtle">
            {(draft.previewContent ?? "").length} / {PREVIEW_MAX}
          </span>
        </div>
        <Textarea
          id="wiz-preview"
          value={draft.previewContent ?? ""}
          maxLength={PREVIEW_MAX}
          rows={5}
          className="font-mono text-xs"
          onChange={(e) => onChange({ previewContent: e.target.value })}
        />
        <p className="text-[11px] text-fg-subtle">{t("previewHint")}</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="wiz-tags">{t("tagsLabel")}</Label>
          <span className="text-[11px] tabular-nums text-fg-subtle">
            {tags.length} / {TAG_MAX}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border-soft bg-bg-raised/40 p-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] text-brand"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="rounded-full transition hover:text-fg"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            id="wiz-tags"
            type="text"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
              if (e.key === "Backspace" && !tagDraft && tags.length > 0) {
                removeTag(tags[tags.length - 1]);
              }
            }}
            placeholder={t("tagsPlaceholder")}
            className="min-w-[120px] flex-1 bg-transparent px-1 text-xs text-fg outline-none placeholder:text-fg-subtle"
          />
        </div>
        <p className="text-[11px] text-fg-subtle">{t("tagsHint")}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="wiz-long">{t("longDescription")}</Label>
        <Textarea
          id="wiz-long"
          value={draft.longDescription ?? ""}
          rows={8}
          className="font-mono text-xs"
          onChange={(e) => onChange({ longDescription: e.target.value })}
        />
        <p className="text-[11px] text-fg-subtle">
          {t("longDescriptionHint")}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>{t("screenshotsLabel")}</Label>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <ScreenshotSlot
              key={i}
              src={draft.screenshots?.[i] ?? null}
              onChange={(dataUrl) => {
                const next = [...(draft.screenshots ?? [])];
                if (dataUrl) next[i] = dataUrl;
                else next.splice(i, 1);
                onChange({ screenshots: next });
              }}
            />
          ))}
        </div>
        <p className="text-[11px] text-fg-subtle">
          {t("screenshotsHint")}
        </p>
      </div>
      </>)}
    </div>
  );
}

function ScreenshotSlot({
  src,
  onChange,
}: {
  src: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const handleFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <label
      className={cn(
        "relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-border-soft bg-bg-raised/40 text-fg-subtle transition hover:border-border-strong hover:text-fg",
        src && "border-solid",
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Screenshot preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <ImagePlus className="h-5 w-5" />
          <span className="text-[11px]">Drop or click</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {src && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onChange(null);
          }}
          className="absolute right-1 top-1 rounded-full bg-bg/80 p-1 text-fg backdrop-blur transition hover:bg-bg"
          aria-label="Remove screenshot"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </label>
  );
}
