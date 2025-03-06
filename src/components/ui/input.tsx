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
            "border-greyScale-100 placeholder:text-greyScale-300 flex w-full rounded-xl border bg-white px-3.5 py-4 text-base leading-6 shadow-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
            Icon && "pr-16",
            className,
          )}
          ref={ref}
          {...props}
        />
        {Icon && (
          <div className="border-greyScale-100 absolute right-3.5 flex items-center justify-center">
            <Icon />
          </div>
        )}

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5"
          >
            <ShowEyeIconSVG fillColor={showPassword ? "#197266" : "#808897"} />
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
