import { Dir } from "./types";

/**
 * get current translateX and translateY from style.
 */
export function getTranslateXY(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    translateX: matrix.m41,
    translateY: matrix.m42,
  };
}

/**
 * get movable range from element where in the overflow hidden parent element.
 */
export function getMovableRange(dir: Dir, element: HTMLElement) {
  const { scrollWidth, clientWidth, scrollHeight, clientHeight } = element;
  return dir === "horizontal"
    ? scrollWidth - clientWidth
    : scrollHeight - clientHeight;
}

/**
 * get bar length and max range from element where in the overflow hidden parent element.
 */
export function getVirtualBar(dir: Dir, element: HTMLElement) {
  const { scrollWidth, clientWidth, scrollHeight, clientHeight } = element;
  const length =
    dir === "horizontal"
      ? (clientWidth / scrollWidth) * clientWidth
      : (clientHeight / scrollHeight) * clientHeight;
  const movableRange =
    dir === "horizontal" ? clientWidth - length : clientHeight - length;
  return {
    length,
    movableRange,
  };
}

/**
 * get virtual scroll data.
 */
export function getVirtualScroll(dir: Dir, element: HTMLElement) {
  const movableRange = getMovableRange(dir, element);
  const { translateX, translateY } = getTranslateXY(element);
  const { length: barLength, movableRange: barMovableRange } = getVirtualBar(
    dir,
    element,
  );
  const currentRatio = Math.abs(
    (dir === "horizontal" ? translateX : translateY) / movableRange,
  );
  return {
    translateX,
    translateY,
    movableRange,
    currentRatio,
    barLength,
    barMovableRange,
  };
}

/**
 * check if the element is scrollable with translateX or translateY.
 */
export function isVirtualScrollAble(dir: Dir, element: HTMLElement) {
  const { scrollWidth, clientWidth, scrollHeight, clientHeight } = element;
  return dir === "horizontal"
    ? scrollWidth > clientWidth
    : scrollHeight > clientHeight;
}

/**
 * get next inner translate position and ratio based on pointer grabbing.
 */
export function getNextPositionByPointer(
  pointerBase: number,
  newPointerValue: number,
  translateBase: number,
  translateRange: number,
  reverse = false, // default pointer move opposite direction (like grab and move)
) {
  const diff = newPointerValue - pointerBase; // 0 > : move to right or down, 0 < : move to left or up
  const nextValue = reverse
    ? Math.min(translateRange, Math.max(translateBase + diff, 0))
    : Math.max(-translateRange, Math.min(translateBase + diff, 0));
  const ratio = Math.abs(nextValue / translateRange);
  return {
    value: nextValue,
    ratio,
  };
}

/**
 * get next position based on wheel event.
 */
export function getNextPositionByWheel(
  deltaY: number,
  wheelMount: number,
  translateBase: number,
  translateRange: number,
) {
  const dy = deltaY > 0 ? -1 : 1;
  const nextValue = Math.max(
    -translateRange,
    Math.min(translateBase + dy * wheelMount, 0),
  );
  const ratio = Math.abs(nextValue / translateRange);
  return {
    value: nextValue,
    ratio,
  };
}
