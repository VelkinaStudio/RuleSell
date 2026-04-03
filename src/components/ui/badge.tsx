type BadgeVariant = "green" | "purple" | "amber" | "default" | "warning" | "error";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "border-accent-green/20 bg-accent-green-subtle text-accent-green",
  purple: "border-accent-purple/20 bg-accent-purple-subtle text-accent-purple",
  amber: "border-accent-amber/20 bg-accent-amber-subtle text-accent-amber",
  default: "border-border-primary bg-bg-tertiary/80 text-text-tertiary",
  warning: "border-status-warning/20 bg-status-warning/8 text-status-warning",
  error: "border-status-error/20 bg-status-error/8 text-status-error",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-[10px] font-medium
        rounded-md border uppercase tracking-[0.08em]
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
