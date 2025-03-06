import { SvgProps } from "@/types/svgs";

const TransactionsIconSVG: React.FC<SvgProps> = ({
  className,
  fillColor = "#666D80",
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.5 4H16.5M1.5 4V14.8333C1.5 15.7538 2.24619 16.5 3.16667 16.5H14.8333C15.7538 16.5 16.5 15.7538 16.5 14.8333V4M1.5 4L3.51184 1.98816C3.82441 1.6756 4.24833 1.5 4.69036 1.5H13.3096C13.7517 1.5 14.1756 1.67559 14.4882 1.98816L16.5 4M5.66667 7.33333C6.08333 10.6667 11.9167 10.6667 12.3333 7.33333"
        stroke={fillColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default TransactionsIconSVG;
