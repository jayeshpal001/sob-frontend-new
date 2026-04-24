// src/components/ui/Button.tsx
import {type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden group transition-all duration-300 px-10 py-4 font-sans text-xs font-bold uppercase tracking-[0.15em]",
          variant === "primary" 
            ? "bg-black text-white hover:bg-gray-900" 
            : "bg-transparent border border-black text-black",
          className
        )}
        {...props}
      >
        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
          {children}
        </span>
        {variant === "outline" && (
          <span className="absolute inset-0 bg-black scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 z-0" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";