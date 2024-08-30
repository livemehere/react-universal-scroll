import { Dir } from "./types";

export function getDefaultTrackStyle(
  dir: Dir,
  size: number,
  trackVisible: boolean,
): React.CSSProperties {
  const positionStyles =
    dir === "horizontal"
      ? {
          left: 0,
          right: 0,
          bottom: 0,
        }
      : {
          top: 0,
          right: 0,
          bottom: 0,
        };
  return {
    position: "absolute",
    visibility: trackVisible ? "visible" : "hidden",
    background: "#ccc",
    borderRadius: "4px",
    ...positionStyles,
    ...(dir === "horizontal" ? { height: size } : { width: size }),
  };
}

export function getDefaultBarStyle(barVisible: boolean): React.CSSProperties {
  return {
    position: "absolute",
    background: "gray",
    borderRadius: "4px",
    visibility: barVisible ? "visible" : "hidden",
  };
}

export function getDefaultOuterStyle(
  dir: Dir,
  trackSize: number,
  trackVisible: boolean,
): React.CSSProperties {
  return {
    overflow: "hidden",
    touchAction: "none",
    position: "relative",
    paddingRight: dir === "vertical" ? (trackVisible ? trackSize : 0) : 0,
    paddingBottom: dir === "horizontal" ? (trackVisible ? trackSize : 0) : 0,
  };
}

export function getDefaultInnerStyle(dir: Dir): React.CSSProperties {
  return {
    whiteSpace: "nowrap",
    height: dir === "horizontal" ? "100%" : "inherit",
  };
}
