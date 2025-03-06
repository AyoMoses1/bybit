import { SvgProps } from "@/types/svgs";

const ExportIconSVG: React.FC<SvgProps> = ({ className, fillColor = "" }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.9974 6.99984L12.3307 1.6665M12.3307 1.6665H8.9974M12.3307 1.6665V4.99984M12.2895 7.6665C11.9614 10.2974 9.71714 12.3332 6.9974 12.3332C4.05188 12.3332 1.66406 9.94536 1.66406 6.99984C1.66406 4.28009 3.69985 2.03583 6.33073 1.70777"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
      />
    </svg>
  );
};

export default ExportIconSVG;
