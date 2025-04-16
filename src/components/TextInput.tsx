import React, { forwardRef } from "react";

interface TextInputProps {
  id?: string | number;
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  className?: string;
  min?: string | undefined | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { id, label, disabled, type, className, placeholder, min, ...props },
    ref,
  ) => {
    return (
      <div className="w-full">
        <label
          className={`block font-[Roboto] text-base font-normal ${
            disabled ? "text-[#A2A9B0]" : "text-[#21272A]"
          }`}
        >
          {label}
        </label>
        <input
          id={id?.toString()}
          type={type}
          disabled={disabled}
          className={`mt-1 h-[48px] w-full border-b-[1.5px] px-4 py-2 outline-none ${disabled ? "border-gray-300 bg-[#F8F8F8] text-gray-500" : "border-[#C1C7CD] bg-[#F8F8F8]"} ${className}`}
          placeholder={placeholder}
          ref={ref}
          min={min}
          {...props}
        />
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
export default TextInput;
