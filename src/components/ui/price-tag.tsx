import type { HTMLAttributes } from "react";

export interface PriceTagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Price in minor units (cents). `0` renders as "Free". */
  amount: number;
  /** ISO-4217 currency code. Defaults to "USD". */
  currency?: string;
  /** Render a compact badge instead of inline text. */
  variant?: "text" | "badge";
}

function format(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount / 100);
}

export function PriceTag({
  amount,
  currency = "USD",
  variant = "text",
  className = "",
  ...props
}: PriceTagProps) {
  const isFree = amount <= 0;

  if (variant === "badge") {
    return (
      <span
        className={[
          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
          isFree
            ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
            : "bg-accent-purple/10 text-accent-purple border border-accent-purple/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isFree ? "Free" : format(amount, currency)}
      </span>
    );
  }

  return (
    <span
      className={[
        "font-semibold",
        isFree ? "text-accent-green" : "text-text-primary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {isFree ? "Free" : format(amount, currency)}
    </span>
  );
}
