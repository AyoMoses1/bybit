import { SvgProps } from "@/types/svgs";

const FrameIconSVG: React.FC<SvgProps> = ({ className }) => {
  return (
    <svg
      width="64"
      height="65"
      viewBox="0 0 64 65"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_i_1054_60301)">
        <rect y="0.5" width="64" height="64" rx="32" fill="#197266" />
        <path
          d="M46.3258 28.372C44.5227 22.1238 38.7328 17.556 31.8722 17.556C25.0119 17.5559 19.2219 22.1238 17.4189 28.372L12.1682 28.372C14.0821 19.3103 22.1745 12.4999 31.8722 12.5C41.5701 12.5 49.6625 19.3103 51.5764 28.372L46.3258 28.372ZM31.8722 52.4999C22.1745 52.4999 14.0821 45.6896 12.1682 36.628L17.4189 36.628C19.2219 42.8761 25.0119 47.4439 31.8722 47.4439C38.7328 47.444 44.5227 42.8761 46.3258 36.628L51.5764 36.628C49.6625 45.6896 41.5701 52.4999 31.8722 52.4999Z"
          fill="url(#paint0_linear_1054_60301)"
          fillOpacity="0.8"
          stroke="url(#paint1_linear_1054_60301)"
          strokeWidth="1.6"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_1054_60301"
          x="0"
          y="-5.9"
          width="64"
          height="70.4"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-6.4" />
          <feGaussianBlur stdDeviation="6.4" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.64 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_1054_60301"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1054_60301"
          x1="52.5391"
          y1="32.5"
          x2="-10.1372"
          y2="32.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.313079" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1054_60301"
          x1="152.86"
          y1="105.928"
          x2="53.4364"
          y2="-15.8445"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default FrameIconSVG;
