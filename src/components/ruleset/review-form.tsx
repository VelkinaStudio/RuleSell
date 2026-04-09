"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { Environment, Ruleset } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENVIRONMENT_META } from "@/constants/environments";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  ruleset: Ruleset;
  onSubmit: (data: {
    rating: number;
    title: string;
    body: string;
    environment: Environment;
  }) => void;
}

export function ReviewForm({ ruleset, onSubmit }: ReviewFormProps) {
  const t = useTranslations("ruleset.reviews.form");
  const envOptions = Array.from(
    new Set(ruleset.variants.flatMap((v) => v.environments)),
  );

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [env, setEnv] = useState<Environment>(envOptions[0] ?? "claude-code");

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onSubmit({ rating, title: title.trim(), body: body.trim(), environment: env });
    setTitle("");
    setBody("");
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className="space-y-4 rounded-2xl border border-border-soft bg-bg-surface p-5"
    >
      <h3 className="text-base font-semibold text-fg">{t("title")}</h3>

      {/* Rating */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium uppercase tracking-wider text-fg-subtle">
          {t("rating")}
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = (hover ?? rating) >= n;
            return (
              <button
                key={n}
                type="button"
                aria-label={`${n} of 5 stars`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(null)}
                className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Star
                  className={cn(
                    "h-5 w-5 transition",
                    filled ? "fill-amber-300 text-amber-300" : "text-zinc-700",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-1.5">
        <label
          htmlFor="review-title"
          className="block text-xs font-medium uppercase tracking-wider text-fg-subtle"
        >
          {t("headline")}
        </label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
        />
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <label
          htmlFor="review-body"
          className="block text-xs font-medium uppercase tracking-wider text-fg-subtle"
        >
          {t("body")}
        </label>
        <Textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={5}
          maxLength={1000}
        />
      </div>

      {/* Environment tested */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium uppercase tracking-wider text-fg-subtle">
          {t("environment")}
        </label>
        <Select value={env} onValueChange={(v) => setEnv(v as Environment)}>
          <SelectTrigger className="border-border-soft bg-bg-raised">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {envOptions.map((e) => (
              <SelectItem key={e} value={e}>
                {ENVIRONMENT_META[e]?.label ?? e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full bg-brand text-brand-fg hover:brightness-110">
        {t("submit")}
      </Button>
    </form>
  );
}
