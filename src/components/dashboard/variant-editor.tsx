"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Environment, InstallMethod, Variant, VariantKind } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ENVIRONMENT_META,
  ENVIRONMENT_ORDER,
} from "@/constants/environments";
import { cn } from "@/lib/utils";

interface VariantEditorProps {
  variant: Variant;
  onChange: (next: Variant) => void;
  onRemove: () => void;
  onMakePrimary: () => void;
}

const KIND_OPTIONS: VariantKind[] = [
  "mcp_json",
  "claude_skill",
  "cursor_rule",
  "system_prompt",
  "n8n_workflow",
  "make_blueprint",
  "crewai_agent",
  "langgraph_agent",
  "bash_install",
  "npm_install",
  "docker_compose",
  "raw_file",
];

const METHOD_OPTIONS: InstallMethod[] = [
  "copy",
  "download",
  "command",
  "json_snippet",
];

export function VariantEditor({
  variant,
  onChange,
  onRemove,
  onMakePrimary,
}: VariantEditorProps) {
  const t = useTranslations("publishWizard.variants");

  const toggleEnv = (env: Environment) => {
    const has = variant.environments.includes(env);
    onChange({
      ...variant,
      environments: has
        ? variant.environments.filter((e) => e !== env)
        : [...variant.environments, env],
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-border-soft bg-bg-raised/40 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <Label>{t("labelLabel")}</Label>
          <Input
            value={variant.label}
            placeholder={t("labelPlaceholder")}
            onChange={(e) => onChange({ ...variant, label: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <label className="flex items-center gap-2 text-[11px] text-fg-muted">
            <Switch
              checked={!!variant.isPrimary}
              onCheckedChange={(v) => {
                if (v) onMakePrimary();
                else onChange({ ...variant, isPrimary: false });
              }}
              size="sm"
            />
            {t("primary")}
          </label>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={onRemove}
            aria-label={t("remove")}
            className="text-rose-300 hover:text-rose-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t("envLabel")}</Label>
        <div className="flex flex-wrap gap-1.5">
          {ENVIRONMENT_ORDER.map((env) => {
            const meta = ENVIRONMENT_META[env];
            const active = variant.environments.includes(env);
            return (
              <button
                key={env}
                type="button"
                onClick={() => toggleEnv(env)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] transition",
                  active
                    ? "border-brand bg-brand/15 text-brand"
                    : "border-border-soft bg-bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{t("kindLabel")}</Label>
          <select
            value={variant.kind}
            onChange={(e) =>
              onChange({ ...variant, kind: e.target.value as VariantKind })
            }
            className="h-9 w-full rounded-md border border-border-soft bg-bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {KIND_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>{t("methodLabel")}</Label>
          <select
            value={variant.install.method}
            onChange={(e) =>
              onChange({
                ...variant,
                install: { ...variant.install, method: e.target.value as InstallMethod },
              })
            }
            className="h-9 w-full rounded-md border border-border-soft bg-bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {METHOD_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t("targetPathLabel")}</Label>
        <Input
          value={variant.install.targetPath ?? ""}
          placeholder={t("targetPathPlaceholder")}
          className="font-mono text-xs"
          onChange={(e) =>
            onChange({
              ...variant,
              install: { ...variant.install, targetPath: e.target.value },
            })
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label>{t("contentLabel")}</Label>
        <Textarea
          value={variant.install.content}
          rows={6}
          placeholder={t("contentPlaceholder")}
          className="font-mono text-xs"
          onChange={(e) =>
            onChange({
              ...variant,
              install: { ...variant.install, content: e.target.value },
            })
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label>{t("instructionsLabel")}</Label>
        <Textarea
          value={variant.instructions ?? ""}
          rows={3}
          onChange={(e) =>
            onChange({ ...variant, instructions: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>{t("requirementsLabel")}</Label>
        {(variant.requirements ?? []).map((req, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              value={req.key}
              placeholder="Node"
              onChange={(e) => {
                const next = [...(variant.requirements ?? [])];
                next[idx] = { ...next[idx], key: e.target.value };
                onChange({ ...variant, requirements: next });
              }}
              className="w-1/3"
            />
            <Input
              value={req.constraint}
              placeholder=">=18"
              onChange={(e) => {
                const next = [...(variant.requirements ?? [])];
                next[idx] = { ...next[idx], constraint: e.target.value };
                onChange({ ...variant, requirements: next });
              }}
              className="flex-1"
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                const next = (variant.requirements ?? []).filter(
                  (_, i) => i !== idx,
                );
                onChange({ ...variant, requirements: next });
              }}
              aria-label="Remove requirement"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={() =>
            onChange({
              ...variant,
              requirements: [
                ...(variant.requirements ?? []),
                { key: "", constraint: "" },
              ],
            })
          }
        >
          <Plus className="h-3 w-3" />
          {t("addRequirement")}
        </Button>
      </div>
    </div>
  );
}
