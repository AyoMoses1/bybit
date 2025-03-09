import { SvgProps } from "@/types/svgs";

const LocationIconSVG: React.FC<SvgProps> = ({
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
      <g id="location">
        <path
          id="icon"
          d="M4.16406 7.93338C4.16406 11.057 5.28728 12.7002 9.30826 18.4764C9.6396 18.9524 10.3552 18.9524 10.6865 18.4764C14.7075 12.7002 15.8307 11.057 15.8307 7.93338C15.8307 4.74856 13.2191 2.16675 9.9974 2.16675C6.77573 2.16675 4.16406 4.74856 4.16406 7.93338Z"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
export default LocationIconSVG;
