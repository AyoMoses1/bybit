"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ShowEyeIconSVG } from "@/svgs";

interface InputProps extends React.ComponentProps<"input"> {
  Icon?: React.ElementType;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, Icon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative flex items-center">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className={cn(
            "flex w-full rounded-xl border border-input bg-background px-3.5 py-4 text-base leading-6 shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pr-16",
            className,
          )}
          ref={ref}
          {...props}
        />
        {Icon && (
          <div className="absolute right-3.5 flex items-center justify-center">
            <Icon />
          </div>
        )}

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5"
          >
            <ShowEyeIconSVG
              fillColor={
                showPassword
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))"
              }
            />
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
