"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Collection } from "@/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  collection: Collection;
  className?: string;
}

const GRADIENTS = [
  "from-emerald-500/20 via-emerald-500/5 to-transparent",
  "from-violet-500/20 via-violet-500/5 to-transparent",
  "from-pink-500/20 via-pink-500/5 to-transparent",
  "from-cyan-500/20 via-cyan-500/5 to-transparent",
  "from-amber-500/20 via-amber-500/5 to-transparent",
  "from-rose-500/20 via-rose-500/5 to-transparent",
] as const;

function gradientFor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]!;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const t = useTranslations("collections");
  const reduce = useReducedMotion();
  const gradient = gradientFor(collection.slug);

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group h-full", className)}
    >
      <Link
        href={`/collections/${collection.slug}`}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-xl border border-border-soft bg-bg-surface p-5 transition-all",
          "hover:border-border-strong hover:bg-bg-elevated",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br opacity-90",
            gradient,
          )}
        />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <Layers className="h-5 w-5 text-fg-muted" />
            <ArrowUpRight className="h-4 w-4 text-fg-subtle transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-fg">{collection.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
            {collection.description}
          </p>
          <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-fg-subtle">
            <span>{t("by")} @{collection.curatedBy}</span>
            <span aria-hidden>·</span>
            <span>{t("items", { count: collection.itemCount })}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
