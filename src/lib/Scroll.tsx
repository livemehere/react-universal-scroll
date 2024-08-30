import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from "react";
import {
  getNextPositionByPointer,
  getNextPositionByWheel,
  getTranslateXY,
  getVirtualScroll,
  isVirtualScrollAble,
} from "./util";
import { BarOption, Dir, GrabOption, WheelOption } from "./types";
import {
  getDefaultBarStyle,
  getDefaultInnerStyle,
  getDefaultOuterStyle,
  getDefaultTrackStyle,
} from "./creator";
import { DEFAULT_BAR_SIZE, DEFAULT_WHEEL_STEP } from "./constant";

type Props = {
  children: React.ReactNode;
  dir: Dir;
  grab?: boolean | GrabOption;
  bar?: boolean | BarOption;
  wheel?: boolean | WheelOption;
};

const Scroll = forwardRef<
  HTMLDivElement,
  Props & HTMLAttributes<HTMLDivElement>
>(function (
  {
    children,
    dir,
    grab = true,
    wheel = true,
    style: customOuterStyle,
    bar = true,
    ...props
  },
  ref,
) {
  /** inner state */
  const innerRef = useRef<HTMLDivElement>(null);
  const isInnerGrabbing = useRef(false);
  const outerGrabStartPos = useRef({
    x: 0,
    y: 0,
    translateX: 0,
    translateY: 0,
  });

  /** bar state */
  const barRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(!!bar);
  const isBarGrabbing = useRef(false);
  const barGrabStartPos = useRef({ x: 0, y: 0, translateX: 0, translateY: 0 });
  const barClassName = typeof bar === "object" ? (bar.className ?? "") : "";
  const barEdgePadding = typeof bar === "object" ? (bar.marginFromEdge ?? 0) : 0; // prettier-ignore
  const barCustomStyle = typeof bar === "object" ? (bar.style ?? {}) : {};
  const barSize = typeof bar === "object" ? (bar.size ?? DEFAULT_BAR_SIZE) : DEFAULT_BAR_SIZE; // prettier-ignore
  const hideAfter = typeof bar === "object" ? bar.hideAfter : undefined;
  const hideBarTimer = useRef<number | null>(null);

  /** track state */
  const trackVisible = !!(typeof bar === "object" && bar.track);
  const trackSize =typeof bar === "object" ? (typeof bar.track === 'object' ? bar.track.size ?? DEFAULT_BAR_SIZE : DEFAULT_BAR_SIZE) : DEFAULT_BAR_SIZE; // prettier-ignore
  const trackCustomStyle = typeof bar === "object" ? (typeof bar.track === 'object' ?  bar.track?.style ?? {} : {}) : {}; // prettier-ignore

  /** wheel state */
  const wheelStep = (typeof wheel === "object" ? wheel.step : DEFAULT_WHEEL_STEP) ?? DEFAULT_WHEEL_STEP; // prettier-ignore
  const wheelDirAdjustment = typeof wheel === "object" && wheel.reverse ? -1 : 1; // prettier-ignore

  const setCursor = (cursor: "" | "grab" | "grabbing") => {
    if ((typeof grab === "object" && grab.useGrabCursor) || grab === true) {
      document.body.style.cursor = cursor;
    }
  };

  /** inner grabbing handler */
  useEffect(() => {
    const handlePointerUp = () => {
      isInnerGrabbing.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const innerEl = innerRef.current;
      if (
        !grab ||
        !isInnerGrabbing.current ||
        !innerEl ||
        !isVirtualScrollAble(dir, innerEl)
      )
        return;

      const { x, y, translateX, translateY } = outerGrabStartPos.current;
      const { movableRange } = getVirtualScroll(dir, innerEl);

      if (dir === "horizontal") {
        const { value, ratio } = getNextPositionByPointer(
          x,
          e.clientX,
          translateX,
          movableRange,
        );
        innerEl.style.transform = `translateX(${value}px)`;
        updateBar(ratio);
      } else if (dir === "vertical") {
        const { value, ratio } = getNextPositionByPointer(
          y,
          e.clientY,
          translateY,
          movableRange,
        );
        innerRef.current.style.transform = `translateY(${value}px)`;
        updateBar(ratio);
      }
    };

    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [
    barSize,
    barEdgePadding,
    JSON.stringify(barCustomStyle),
    JSON.stringify(bar),
    JSON.stringify(grab),
    dir,
  ]);

  /** bar grabbing handler */
  useEffect(() => {
    const handlePointerUp = () => {
      isBarGrabbing.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isBarGrabbing.current) return;
      const innerEl = innerRef.current;
      if (!innerEl) return;
      const { barMovableRange, movableRange } = getVirtualScroll(dir, innerEl);
      const innerMoveWeight = movableRange / barMovableRange; // multiplier to inner move from bar move
      const { x, y, translateX, translateY } = barGrabStartPos.current;

      if (dir === "horizontal") {
        const { value, ratio } = getNextPositionByPointer(
          x,
          e.clientX,
          translateX,
          barMovableRange,
          true,
        );
        innerEl.style.transform = `translateX(${-value * innerMoveWeight}px)`;
        updateBar(ratio);
      } else if (dir === "vertical") {
        const { value, ratio } = getNextPositionByPointer(
          y,
          e.clientY,
          translateY,
          barMovableRange,
          true,
        );
        innerEl.style.transform = `translateY(${-value * innerMoveWeight}px)`;
        updateBar(ratio);
      }
    };

    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [
    barSize,
    barEdgePadding,
    JSON.stringify(barCustomStyle),
    JSON.stringify(bar),
    JSON.stringify(grab),
    dir,
  ]);

  /** initial bar position */
  useEffect(() => {
    updateBar(0);
  }, []);

  /** update bar on resize */
  useEffect(() => {
    updateBar();
    const resize = () => {
      updateBar();
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [children, JSON.stringify(bar)]);

  /** update bar */
  const updateBar = (ratio?: number) => {
    const innerEl = innerRef.current;
    const barEl = barRef.current;
    if (!innerEl || !barEl) return;

    const { currentRatio, barMovableRange, barLength } = getVirtualScroll(
      dir,
      innerEl,
    );
    const barRatio = ratio ?? currentRatio;

    if (dir === "horizontal") {
      const newTx = barRatio * barMovableRange;
      barEl.style.height = `${barSize}px`;
      barEl.style.transform = `translateX(${newTx}px)`;
      barEl.style.width = `${barLength}px`; // auto calculated
      barEl.style.bottom = `${barEdgePadding}px`;
      barEl.style.left = "0";
    } else if (dir === "vertical") {
      const newTy = barRatio * barMovableRange;
      barEl.style.width = `${barSize}px`;
      barEl.style.transform = `translateY(${newTy}px)`;
      barEl.style.height = `${barLength}px`; // auto calculated
      barEl.style.top = "0";
      barEl.style.right = `${barEdgePadding}px`;
    }

    const isScrollAble = isVirtualScrollAble(dir, innerEl);
    if (hideAfter && isScrollAble) {
      if (hideBarTimer.current !== null) {
        clearTimeout(hideBarTimer.current!);
      }
      setBarVisible(true);
      hideBarTimer.current = window.setTimeout(() => {
        setBarVisible(false);
      }, hideAfter);
    }

    /** hide bar if disable to scroll */
    if (!isScrollAble) {
      setBarVisible(false);
      innerEl.style.transform = dir === "horizontal" ? "translateX(0)" : "translateY(0)"; // prettier-ignore
    } else {
      setBarVisible(true);
    }
  };

  const onPointerDownOuter = (e: React.PointerEvent) => {
    const innerEl = innerRef.current;
    if (!innerEl) return;
    isInnerGrabbing.current = true;
    outerGrabStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      ...getTranslateXY(innerEl),
    };
  };

  const onWheelOuter = (e: React.WheelEvent) => {
    const innerEl = innerRef.current;
    if (!wheel || !innerEl) return;
    const { movableRange, translateX, translateY } = getVirtualScroll(
      dir,
      innerEl,
    );

    if (dir === "vertical") {
      const { value, ratio } = getNextPositionByWheel(
        e.deltaY * wheelDirAdjustment,
        wheelStep,
        translateY,
        movableRange,
      );
      innerEl.style.transform = `translateY(${value}px)`;
      updateBar(ratio);
    } else if (dir === "horizontal") {
      const { value, ratio } = getNextPositionByWheel(
        e.deltaY * wheelDirAdjustment,
        wheelStep,
        translateX,
        movableRange,
      );
      innerEl.style.transform = `translateX(${value}px)`;
      updateBar(ratio);
    }
  };

  const onPointerDownBar = (e: React.PointerEvent) => {
    isBarGrabbing.current = true;
    const prev = getTranslateXY(e.currentTarget as HTMLElement);
    barGrabStartPos.current = { x: e.clientX, y: e.clientY, ...prev };
  };

  return (
    <div
      style={{
        ...getDefaultOuterStyle(dir, trackSize, trackVisible),
        ...customOuterStyle,
      }}
      {...props}
      ref={ref}
      onPointerDown={onPointerDownOuter}
      onWheel={onWheelOuter}
    >
      <div ref={innerRef} style={getDefaultInnerStyle(dir)}>
        <div
          onPointerOver={() => setCursor("grab")}
          onPointerOut={() => setCursor("")}
          onPointerDown={() => setCursor("grabbing")}
          onPointerUp={() => setCursor("grab")}
        >
          {children}
        </div>
      </div>
      <div
        style={{
          ...getDefaultTrackStyle(dir, trackSize, trackVisible),
          ...trackCustomStyle,
        }}
      >
        <div
          className={barClassName}
          ref={barRef}
          style={{
            ...getDefaultBarStyle(barVisible),
            ...barCustomStyle,
          }}
          onPointerDown={onPointerDownBar}
        ></div>
      </div>
    </div>
  );
});
export default Scroll;
