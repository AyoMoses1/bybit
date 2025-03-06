import { SvgProps } from "@/types/svgs";

const CalendarSVG: React.FC<SvgProps> = ({
  className,
  strokeColor = "#808897",
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="calendar">
        <path
          id="Icon"
          d="M6.66667 2.49996H5C3.61929 2.49996 2.5 3.61925 2.5 4.99996V7.49996M6.66667 2.49996V1.66663M6.66667 2.49996H13.3333M6.66667 2.49996V3.33329M13.3333 2.49996H15C16.3807 2.49996 17.5 3.61925 17.5 4.99996V7.49996M13.3333 2.49996V1.66663M13.3333 2.49996V3.33329M2.5 7.49996V15.8333C2.5 17.214 3.61929 18.3333 5 18.3333H15C16.3807 18.3333 17.5 17.214 17.5 15.8333V7.49996M2.5 7.49996H17.5"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default CalendarSVG;
