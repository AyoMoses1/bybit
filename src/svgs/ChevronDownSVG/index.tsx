import { SvgProps } from "@/types/svgs";

const ChevronDownIconSVG: React.FC<SvgProps> = ({
  className,
  fillColor = "",
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 6L7.41074 9.41074C7.73618 9.73618 8.26382 9.73618 8.58926 9.41074L12 6"
        stroke="#0D0D12"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
      />
    </svg>
  );
};

export default ChevronDownIconSVG;
