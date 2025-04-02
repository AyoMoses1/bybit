import React from "react";

interface RatingProps {
  value: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: "small" | "medium" | "large";
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  readOnly = true,
  onChange,
  size = "medium",
}) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeClass = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
  }[size];

  return (
    <div className="flex">
      {stars.map((star) => (
        <span
          key={star}
          className={`${sizeClass} ${star <= value ? "text-yellow-400" : "text-gray-300"} cursor-${readOnly ? "default" : "pointer"}`}
          onClick={() => !readOnly && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};
