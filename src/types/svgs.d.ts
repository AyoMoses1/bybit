import { SVGProps } from "react";

export interface SvgProps extends SVGProps<SVGSVGElement> {
  fillColor?: string;
  strokeColor?: string;
  width?: string | number;
  height?: string | number;
}
