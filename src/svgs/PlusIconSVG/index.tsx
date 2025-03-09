import { SvgProps } from "@/types/svgs";

const PlusIconSVG: React.FC<SvgProps> = ({
  className,
  strokeColor = "#1C1D22",
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="fi:plus">
        <path
          id="Vector"
          d="M12 5V19"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M5 12H19"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
export default PlusIconSVG;
