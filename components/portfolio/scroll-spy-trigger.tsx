"use client";

import { useRef, useEffect } from "react";

export function ScrollSpyTrigger({ title }: { title: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const headerH =
      document.querySelector("header")?.getBoundingClientRect().height ?? 88;

    const obs = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent("scrollspy:title", {
            detail: { title: entry.isIntersecting ? null : title },
          }),
        );
      },
      { threshold: 0, rootMargin: `${-headerH}px 0px 0px 0px` },
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      window.dispatchEvent(
        new CustomEvent("scrollspy:title", { detail: { title: null } }),
      );
    };
  }, [title]);

  return <div ref={sentinelRef} className="pointer-events-none h-px w-0" />;
}
