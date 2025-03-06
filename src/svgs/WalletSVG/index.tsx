import { SvgProps } from "@/types/svgs";

const WalletSVG: React.FC<SvgProps> = ({
  className,
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
        d="M16.75 12.9999V6.99993C16.7497 6.73688 16.6803 6.47853 16.5487 6.2508C16.417 6.02306 16.2278 5.83395 16 5.70243L10.75 2.70243C10.522 2.57077 10.2633 2.50146 10 2.50146C9.7367 2.50146 9.47803 2.57077 9.25 2.70243L4 5.70243C3.7722 5.83395 3.58299 6.02306 3.45135 6.2508C3.31971 6.47853 3.25027 6.73688 3.25 6.99993V12.9999C3.25027 13.263 3.31971 13.5213 3.45135 13.7491C3.58299 13.9768 3.7722 14.1659 4 14.2974L9.25 17.2974C9.47803 17.4291 9.7367 17.4984 10 17.4984C10.2633 17.4984 10.522 17.4291 10.75 17.2974L16 14.2974C16.2278 14.1659 16.417 13.9768 16.5487 13.7491C16.6803 13.5213 16.7497 13.263 16.75 12.9999Z"
        stroke={fillColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.45312 6.22021L10.0006 10.0077L16.5481 6.22021"
        stroke={fillColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 17.56V10"
        stroke={fillColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default WalletSVG;
