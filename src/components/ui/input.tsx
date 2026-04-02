import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 rounded-md text-sm
            bg-bg-tertiary border border-border-primary
            text-text-primary placeholder-text-tertiary
            focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green/30
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            ${error ? "border-status-error focus:border-status-error focus:ring-status-error/30" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-status-error">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
