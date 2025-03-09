import React from "react";
import { SvgProps } from "@/types/svgs";

const BeneficiariesIconSVG: React.FC<SvgProps> = ({
  className = "",
  fillColor = "#666D80",
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.668 11.6667H8.33464C6.03345 11.6667 4.16797 13.5321 4.16797 15.8333V16.6667C4.16797 17.1269 4.54107 17.5 5.0013 17.5H15.0013C15.4615 17.5 15.8346 17.1269 15.8346 16.6667V15.8333C15.8346 13.5321 13.9692 11.6667 11.668 11.6667Z"
        stroke={fillColor}
        strokeWidth="2"
      />
      <path
        d="M10.0013 9.16667C11.8423 9.16667 13.3346 7.67428 13.3346 5.83333C13.3346 3.99238 11.8423 2.5 10.0013 2.5C8.16035 2.5 6.66797 3.99238 6.66797 5.83333C6.66797 7.67428 8.16035 9.16667 10.0013 9.16667Z"
        stroke={fillColor}
        strokeWidth="2"
      />
    </svg>
  );
};

export default BeneficiariesIconSVG;
