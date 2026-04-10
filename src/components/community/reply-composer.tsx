"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ReplyComposerProps {
  placeholder?: string;
  onSubmit?: (body: string) => void;
}

export function ReplyComposer({ placeholder, onSubmit }: ReplyComposerProps) {
  const t = useTranslations("community");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    if (!body.trim()) return;
    onSubmit?.(body);
    setBody("");
  };

  return (
    <div className="rounded-lg border border-border-soft bg-bg-surface p-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder ?? t("replyPlaceholder")}
        rows={3}
        className={cn(
          "w-full resize-none rounded-md bg-transparent text-sm text-fg",
          "placeholder:text-fg-dim",
          "focus:outline-none",
        )}
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-fg-dim">{t("markdownHint")}</span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!body.trim()}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
            body.trim()
              ? "bg-brand text-black hover:bg-brand/90"
              : "bg-fg/5 text-fg-dim cursor-not-allowed",
          )}
        >
          <Send className="h-3 w-3" />
          {t("submit")}
        </button>
      </div>
    </div>
  );
}
