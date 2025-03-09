import { SvgProps } from "@/types/svgs";

const PhoneIconSVG: React.FC<SvgProps> = ({
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
      <g id="phone">
        <path
          id="Icon"
          d="M9.82706 12.285L7.70996 10.1714C7.02852 9.49109 7.02852 8.3881 7.70996 7.70779C8.31895 7.09981 8.39254 6.13918 7.88323 5.44582L6.14488 3.07928C5.63026 2.3787 4.61122 2.3009 3.99588 2.91522C3.05905 3.85049 2.43179 5.08823 2.50594 6.40883C2.8682 12.8605 7.9153 17.1733 13.623 17.4942C14.9319 17.5678 16.1509 16.9357 17.0779 16.0103C17.7024 15.3868 17.6233 14.3543 16.9111 13.8329L14.5605 12.112C13.866 11.6035 12.9038 11.677 12.2948 12.285C11.6133 12.9653 10.5085 12.9653 9.82706 12.285Z"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default PhoneIconSVG;
