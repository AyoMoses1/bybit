import React, { forwardRef } from "react";

interface TextAreaProps {
  id?: string | number;
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ id, label, disabled, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        <label
          className={`block font-[Roboto] text-base font-normal ${
            disabled ? "text-[#A2A9B0]" : "text-[#21272A]"
          }`}
        >
          {label}
        </label>
        <textarea
          id={id?.toString()}
          disabled={disabled}
          className={`mt-1 h-[48px] w-full border-b-[1.5px] px-4 py-2 outline-none ${
            disabled
              ? "border-gray-300 bg-[#F8F8F8] text-gray-500"
              : "border-[#C1C7CD] bg-[#F8F8F8]"
          }`}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
export default TextArea;
