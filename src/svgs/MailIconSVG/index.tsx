import { SvgProps } from "@/types/svgs";

const MailIconSVG: React.FC<SvgProps> = ({
  className,
  strokeColor = "#808897",
}) => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="mail-01">
        <path
          id="Icon"
          d="M5 7.16675L8.50929 8.92139C9.44771 9.3906 10.5523 9.3906 11.4907 8.92139L15 7.16675M5 16.3334H15C16.3807 16.3334 17.5 15.2141 17.5 13.8334V7.16675C17.5 5.78604 16.3807 4.66675 15 4.66675H5C3.61929 4.66675 2.5 5.78604 2.5 7.16675V13.8334C2.5 15.2141 3.61929 16.3334 5 16.3334Z"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
export default MailIconSVG;
