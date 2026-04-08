import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "./button";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  heading: string;
  subtext?: ReactNode;
  /** Optional primary CTA. Both label and onClick required if provided. */
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  heading,
  subtext,
  actionLabel,
  onAction,
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon ? (
        <div className="h-12 w-12 text-text-secondary/60">{icon}</div>
      ) : null}
      <h2 className="text-lg font-semibold text-text-primary">{heading}</h2>
      {subtext ? (
        <p className="max-w-md text-sm text-text-secondary">{subtext}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button size="md" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
