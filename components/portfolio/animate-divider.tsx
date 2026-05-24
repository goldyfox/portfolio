"use client";

import { useEffect, useRef, useState } from "react";

export function AnimateDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleScroll() {
      const rect = el!.getBoundingClientRect();
      const start = window.innerHeight;
      const end = 0;
      const raw = 1 - rect.top / (start * 0.9);
      setProgress(Math.max(0, Math.min(1, raw)));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={ref} className="flex justify-center my-16 h-[160px]">
      <div
        className="w-px bg-ethos-blue"
        style={{
          height: 160,
          transform: `scaleY(${progress})`,
          transformOrigin: "top",
          willChange: "transform",
        }}
      />
    </div>
  );
}
