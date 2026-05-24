"use client";

import { useEffect, useRef } from "react";

export function GridHydration() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(x: number, y: number) {
      el!.style.setProperty("--mouse-x", `${x}px`);
      el!.style.setProperty("--mouse-y", `${y}px`);
    }

    function handleMouse(e: MouseEvent) {
      onMove(e.clientX, e.clientY);
    }

    function handleTouch(e: TouchEvent) {
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleTouch);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  return <div ref={ref} className="grid-hydration" aria-hidden />;
}
