import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<BrandSize, { mark: number; text: string; gap: string }> = {
  sm: { mark: 18, text: "text-sm", gap: "gap-1.5" },
  md: { mark: 22, text: "text-base", gap: "gap-2" },
  lg: { mark: 32, text: "text-xl", gap: "gap-2.5" },
};

export interface BrandProps {
  size?: BrandSize;
  className?: string;
  /** If true, hide the SVG mark and show wordmark only */
  wordmarkOnly?: boolean;
  /** If true, hide the wordmark and show mark only */
  markOnly?: boolean;
}

export function Brand({
  size = "md",
  className,
  wordmarkOnly = false,
  markOnly = false,
}: BrandProps) {
  const { mark, text, gap } = SIZE_MAP[size];

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold tracking-tight text-fg",
        gap,
        text,
        className,
      )}
    >
      {!wordmarkOnly && (
        <Image
          src="/logos/rulesell-mark.svg"
          alt=""
          width={mark}
          height={mark}
          className="shrink-0"
          aria-hidden
          priority
        />
      )}
      {!markOnly && (
        <span>
          <span className="text-fg">Rule</span>
          <span className="text-brand">Sell</span>
        </span>
      )}
    </span>
  );
}
