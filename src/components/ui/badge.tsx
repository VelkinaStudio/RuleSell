type BadgeVariant = "green" | "purple" | "default" | "warning" | "error";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "border-accent-green/30 bg-accent-green-subtle text-accent-green",
  purple: "border-accent-purple/30 bg-accent-purple-subtle text-accent-purple",
  default: "border-border-secondary bg-bg-tertiary text-text-secondary",
  warning: "border-status-warning/30 bg-status-warning/10 text-status-warning",
  error: "border-status-error/30 bg-status-error/10 text-status-error",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-xs font-medium
        rounded border uppercase tracking-wider
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
