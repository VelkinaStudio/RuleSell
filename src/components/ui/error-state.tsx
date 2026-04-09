"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We could not load this content. Try again in a moment.",
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex flex-col items-start gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-fg",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-danger">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-semibold">{title}</span>
      </div>
      <p className="text-fg-muted">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline" size="sm" className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
