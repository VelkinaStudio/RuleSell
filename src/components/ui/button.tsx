import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-green text-text-inverse hover:bg-accent-green-hover font-semibold hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]",
  secondary:
    "bg-accent-purple text-white hover:bg-accent-purple-hover font-semibold hover:shadow-[0_0_20px_rgba(167,139,250,0.15)]",
  outline:
    "border border-border-secondary text-text-primary hover:border-accent-green/30 hover:bg-accent-green-subtle bg-transparent",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary bg-transparent",
  danger: "bg-status-error text-white hover:bg-red-500 font-semibold",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center rounded-lg
          transition-all duration-200 cursor-pointer tracking-wide
          disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
