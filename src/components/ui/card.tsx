import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Emit hover treatment (border + shadow lift). Defaults to true. */
  hover?: boolean;
  children?: ReactNode;
}

export function Card({
  hover = true,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-xl border border-border-primary bg-bg-secondary",
        "transition-all duration-200",
        hover
          ? "hover:border-border-secondary hover:bg-bg-secondary/80 hover:shadow-lg"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["p-5 border-b border-border-primary", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["p-5", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function CardFooter({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["p-5 border-t border-border-primary", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
