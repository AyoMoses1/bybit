import { SvgProps } from "@/types/svgs";

const TransactionIconSVG: React.FC<SvgProps> = ({
  className,
  fillColor = "#666D80",
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.5 5H17.5M2.5 5V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V5M2.5 5L4.51184 2.98816C4.82441 2.6756 5.24833 2.5 5.69036 2.5H14.3096C14.7517 2.5 15.1756 2.67559 15.4882 2.98816L17.5 5M6.66667 8.33333C7.08333 11.6667 12.9167 11.6667 13.3333 8.33333"
        stroke={fillColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default TransactionIconSVG;
