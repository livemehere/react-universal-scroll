export type Dir = "horizontal" | "vertical";

export interface GrabOption {
  useGrabCursor?: boolean;
}

export interface BarOption {
  className?: string;
  marginFromEdge?: number;
  size?: number;
  style?: Omit<
    React.CSSProperties,
    "position" | "bottom" | "right" | "width" | "height"
  >;
  hideAfter?: number;
  track?:
    | boolean
    | {
        size?: number;
        style?: Omit<React.CSSProperties, "width" | "height">;
      };
}

export interface WheelOption {
  step?: number;
  reverse?: boolean;
}
