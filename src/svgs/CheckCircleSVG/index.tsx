import { SvgProps } from "@/types/svgs";

const CheckCircleSVG: React.FC<SvgProps> = ({ fillColor = "#CB1A14" }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="icon / check-circle">
        <path
          id="icon"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 10.5C8.48528 10.5 10.5 8.48528 10.5 6C10.5 3.51472 8.48528 1.5 6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 8.48528 3.51472 10.5 6 10.5ZM7.8377 5.36873C8.04134 5.18222 8.05523 4.86594 7.86873 4.6623C7.68222 4.45866 7.36594 4.44477 7.1623 4.63127L5.31626 6.32199L4.8377 5.88369C4.63406 5.69719 4.31778 5.71107 4.13128 5.91472C3.94477 6.11836 3.95866 6.43463 4.1623 6.62114L4.97856 7.36872C5.16967 7.54376 5.46285 7.54376 5.65396 7.36872L7.8377 5.36873Z"
          fill={fillColor}
        />
      </g>
    </svg>
  );
};
export default CheckCircleSVG;
