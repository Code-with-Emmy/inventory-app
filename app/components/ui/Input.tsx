import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  variant?: "default" | "glass";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = "default", className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground/80 ml-1">
          {label}
        </label>
        <div className="relative group">
          <input
            ref={ref}
            className={`w-full rounded-xl border-2 bg-background px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 ${
              error
                ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                : variant === "glass"
                  ? "glass border-transparent focus:bg-white/10"
                  : "border-input hover:border-muted-foreground/30"
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs font-medium text-destructive ml-1 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
