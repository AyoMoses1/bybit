import { SvgProps } from "@/types/svgs";

const ErrorInfoTriangleSVG: React.FC<SvgProps> = ({ className }) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="icon / info-triangle">
        <path
          id="icon"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.85953 18.8739L11.2226 5.13865C12.3938 2.95379 15.6062 2.95378 16.7774 5.13865L24.1405 18.8739C25.2286 20.9039 23.7155 23.3333 21.363 23.3333H6.63698C4.2845 23.3333 2.77135 20.9039 3.85953 18.8739ZM14 7C14.6443 7 15.1667 7.52233 15.1667 8.16667V16.3333C15.1667 16.9777 14.6443 17.5 14 17.5C13.3557 17.5 12.8333 16.9777 12.8333 16.3333V8.16667C12.8333 7.52233 13.3557 7 14 7ZM12.5417 19.5417C12.5417 20.3471 13.1946 21 14 21C14.8054 21 15.4583 20.3471 15.4583 19.5417C15.4583 18.7363 14.8054 18.0833 14 18.0833C13.1946 18.0833 12.5417 18.7363 12.5417 19.5417Z"
          fill="#D42620"
        />
      </g>
    </svg>
  );
};
export default ErrorInfoTriangleSVG;
