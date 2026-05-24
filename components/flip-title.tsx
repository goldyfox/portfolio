"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_TEXT = "Product Design";

export function FlipTitle() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const textRef = useRef(DEFAULT_TEXT);
  const nextRef = useRef(DEFAULT_TEXT);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");

  useEffect(() => {
    const handle = (e: Event) => {
      const t = (e as CustomEvent).detail?.title || DEFAULT_TEXT;
      nextRef.current = t;
      if (t !== textRef.current) {
        setPhase((p) => (p === "idle" ? "out" : p));
      }
    };
    window.addEventListener("scrollspy:title", handle);
    return () => window.removeEventListener("scrollspy:title", handle);
  }, []);

  const onEnd = useCallback(() => {
    if (phase === "out") {
      textRef.current = nextRef.current;
      setText(nextRef.current);
      setPhase("in");
    } else if (phase === "in") {
      setPhase("idle");
      if (nextRef.current !== textRef.current) {
        setPhase("out");
      }
    }
  }, [phase]);

  const isProject = text !== DEFAULT_TEXT;

  return (
    <span
      className="site-title-tagline text-gray-900"
      style={{ perspective: "300px" }}
    >
      <span
        className={`inline-block ${phase === "out" ? "flip-out" : phase === "in" ? "flip-in" : ""} ${isProject ? "tracking-normal" : ""}`}
        onAnimationEnd={onEnd}
        style={{
          transformOrigin: "center bottom",
          backfaceVisibility: "hidden",
        }}
      >
        {text}
      </span>
    </span>
  );
}
