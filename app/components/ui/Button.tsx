import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "glass";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-primary text-primary-foreground shadow-[0_4px_14px_0_rgba(var(--primary),0.39)] hover:bg-primary/90",
      secondary:
        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      outline:
        "border-2 border-input bg-transparent shadow-sm hover:border-primary/50 hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      danger:
        "bg-destructive text-destructive-foreground shadow-[0_4px_14px_0_rgba(var(--destructive),0.39)] hover:bg-destructive/90",
      success:
        "bg-emerald-600 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:bg-emerald-600/90",
      glass: "glass hover:bg-white/20 text-foreground",
    };

    const sizes = {
      default: "px-5 py-2.5 text-sm",
      sm: "px-3.5 py-1.5 text-xs",
      lg: "px-8 py-3.5 text-base font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
