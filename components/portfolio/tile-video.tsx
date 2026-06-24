"use client";

import { useEffect, useState } from "react";

interface TileVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

/**
 * Full-bleed ambient video for a project tile. Autoplays a silent loop, but
 * respects prefers-reduced-motion by showing the poster still instead.
 */
export function TileVideo({ src, poster, className }: TileVideoProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion && poster) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" className={className} />;
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      className={className}
    />
  );
}
