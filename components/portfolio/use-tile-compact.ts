"use client";

import { useEffect, useState, type RefObject } from "react";

/** True when the tile is shorter than `ratio * width` (e.g. 16:9 inbox boxes). */
export function useTileCompact(
  ref: RefObject<HTMLElement | null>,
  ratio = 0.62,
) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setCompact(width > 0 && height / width < ratio);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ratio, ref]);

  return compact;
}

/** True when the viewport is at or below `maxWidth` (mobile single-column layout). */
export function useMobileViewport(maxWidth = 767) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    setMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [maxWidth]);

  return mobile;
}

/** True when the tile width is below `maxWidth` (mobile single-column layout). */
export function useTileNarrow(
  ref: RefObject<HTMLElement | null>,
  maxWidth = 420,
) {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const { width } = el.getBoundingClientRect();
      setNarrow(width > 0 && width < maxWidth);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxWidth, ref]);

  return narrow;
}
