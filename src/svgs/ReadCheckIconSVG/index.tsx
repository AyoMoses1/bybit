import { SvgProps } from "@/types/svgs";

const ReadCheckIconSVG: React.FC<SvgProps> = ({
  className,
  strokeColor = "#1C1D22",
}) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="fi:check">
        <path
          id="Vector"
          d="M10 3L4.5 8.5L2 6"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
export default ReadCheckIconSVG;
