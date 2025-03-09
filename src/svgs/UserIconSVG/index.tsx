import { SvgProps } from "@/types/svgs";

const UserIconSVG: React.FC<SvgProps> = ({
  className,
  strokeColor = "#808897",
}) => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="user-01">
        <g id="Icon">
          <path
            d="M11.6641 12.1667H8.33073C6.02954 12.1667 4.16406 14.0321 4.16406 16.3333V17.1667C4.16406 17.6269 4.53716 18 4.9974 18H14.9974C15.4576 18 15.8307 17.6269 15.8307 17.1667V16.3333C15.8307 14.0321 13.9652 12.1667 11.6641 12.1667Z"
            stroke="#808897"
            strokeWidth="1.5"
          />
          <path
            d="M9.9974 9.66667C11.8383 9.66667 13.3307 8.17428 13.3307 6.33333C13.3307 4.49238 11.8383 3 9.9974 3C8.15645 3 6.66406 4.49238 6.66406 6.33333C6.66406 8.17428 8.15645 9.66667 9.9974 9.66667Z"
            stroke={strokeColor}
            strokeWidth="1.5"
          />
        </g>
      </g>
    </svg>
  );
};
export default UserIconSVG;
