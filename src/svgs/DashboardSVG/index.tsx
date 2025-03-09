import { SvgProps } from "@/types/svgs";

const DashboardIconSVG: React.FC<SvgProps> = ({
  className,
  fillColor = "#666D80",
}) => {
  return (
    <svg
    className={className}
      stroke={fillColor}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.4987 16.5H3.83203C2.45132 16.5 1.33203 15.4491 1.33203 14.1528V8.08335C1.33203 7.46083 1.59542 6.8638 2.06426 6.42361L6.82019 1.95832C7.47106 1.34722 8.52633 1.34723 9.17721 1.95832L13.9331 6.42361C14.402 6.8638 14.6654 7.46083 14.6654 8.08335V14.1528C14.6654 15.4491 13.5461 16.5 12.1654 16.5H10.4987M5.4987 16.5V12.3333C5.4987 11.4129 6.24489 10.6667 7.16536 10.6667H8.83203C9.75251 10.6667 10.4987 11.4129 10.4987 12.3333V16.5M5.4987 16.5H10.4987"
        stroke={fillColor}
        strokeWidth="2"
      />
    </svg>
  );
};
export default DashboardIconSVG;
