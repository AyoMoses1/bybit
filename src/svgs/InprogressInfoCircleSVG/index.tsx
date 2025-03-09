import { SvgProps } from "@/types/svgs";

const InprogressInfoCircleSVG: React.FC<SvgProps> = ({ className }) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="icon / info-circle">
        <path
          id="icon"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M31.125 18C31.125 25.2487 25.2487 31.125 18 31.125C10.7513 31.125 4.875 25.2487 4.875 18C4.875 10.7513 10.7513 4.875 18 4.875C25.2487 4.875 31.125 10.7513 31.125 18ZM18 9.25C18.8054 9.25 19.4583 9.90292 19.4583 10.7083V20.9167C19.4583 21.7221 18.8054 22.375 18 22.375C17.1946 22.375 16.5417 21.7221 16.5417 20.9167L16.5417 10.7083C16.5417 9.90292 17.1946 9.25 18 9.25ZM16.1771 24.9271C16.1771 25.9339 16.9932 26.75 18 26.75C19.0068 26.75 19.8229 25.9339 19.8229 24.9271C19.8229 23.9203 19.0068 23.1042 18 23.1042C16.9932 23.1042 16.1771 23.9203 16.1771 24.9271Z"
          fill="#F3A218"
        />
      </g>
    </svg>
  );
};
export default InprogressInfoCircleSVG;
