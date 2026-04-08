"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "./button";

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Short error title. Defaults to "Something went wrong". */
  heading?: string;
  /** Optional detail text or error message. */
  message?: ReactNode;
  /** Label for the retry button. Defaults to "Try again". */
  retryLabel?: string;
  /** Retry callback. If provided, a retry button is rendered. */
  onRetry?: () => void;
}

export function ErrorState({
  heading = "Something went wrong",
  message,
  retryLabel = "Try again",
  onRetry,
  className = "",
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={[
        "flex flex-col items-start gap-2 rounded-lg border border-status-error/20",
        "bg-status-error/5 p-4 text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <p className="font-semibold text-status-error">{heading}</p>
      {message ? (
        <p className="text-text-secondary">{message}</p>
      ) : null}
      {onRetry ? (
        <Button variant="ghost" size="sm" onClick={onRetry} className="mt-1 self-start">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
