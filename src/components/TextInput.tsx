import React from "react";

interface TextInputProps {
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  placeholder,
  disabled = false,
  onChange,
  type,
}) => {
  return (
    <div className="w-full">
      <label
        className={`block font-[Roboto] text-sm font-normal ${
          disabled ? "text-[#A2A9B0]" : "text-[#21272A]"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        disabled={disabled}
        className={`mt-1 h-[48px] w-full border-b-[1.5px] px-4 py-2 outline-none ${disabled ? "border-gray-300 bg-gray-200 text-gray-500" : "border-[#C1C7CD] bg-[#F8F8F8]"}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInput;
