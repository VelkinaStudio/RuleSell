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
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
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
