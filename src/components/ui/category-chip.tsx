"use client";

import type { Category } from "@/types";
import { CATEGORY_META } from "@/constants/categories";
import { cn } from "@/lib/utils";
import { IconByName } from "./icon-map";

interface CategoryChipProps {
  category: Category;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function CategoryChip({
  category,
  active,
  onClick,
  className,
  size = "md",
}: CategoryChipProps) {
  const meta = CATEGORY_META[category] ?? { label: category ?? "Other", slug: category ?? "other", color: "#6b7280", accent: "gray", icon: "Package", description: "" };
  const baseStyle = active
    ? {
        borderColor: meta.color,
        color: meta.color,
        backgroundColor: `${meta.color}1a`,
      }
    : undefined;
  const iconClass = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const sharedClasses = cn(
    "inline-flex items-center gap-1.5 rounded-full border font-medium transition",
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
    active
      ? "border-transparent bg-bg-elevated text-fg"
      : "border-border-soft bg-bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
    onClick &&
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={sharedClasses}
        style={baseStyle}
      >
        <IconByName name={meta.icon} className={iconClass} />
        <span>{meta.label}</span>
      </button>
    );
  }

  return (
    <span className={sharedClasses} style={baseStyle}>
      <IconByName name={meta.icon} className={iconClass} />
      <span>{meta.label}</span>
    </span>
  );
}
