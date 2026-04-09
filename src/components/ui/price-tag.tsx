import { cn, formatPrice } from "@/lib/utils";

interface PriceTagProps {
  cents: number;
  currency?: string;
  locale?: string;
  className?: string;
}

/**
 * Formatted price display. Shows "Free" for 0, otherwise renders the
 * price using the shared formatPrice utility. Styled with monospace
 * tabular numerals for alignment in lists.
 */
export function PriceTag({
  cents,
  currency = "USD",
  locale = "en-US",
  className,
}: PriceTagProps) {
  const label = formatPrice(cents, currency, locale);
  const isFree = cents === 0;

  return (
    <span
      className={cn(
        "font-mono text-xs tabular-nums",
        isFree ? "text-fg-muted" : "text-fg",
        className,
      )}
    >
      {label}
    </span>
  );
}
