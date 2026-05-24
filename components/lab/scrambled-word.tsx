"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { scramble } from "@/lib/scramble";

interface ScrambledWordProps {
  word: string;
  /** Unique seed for this word — same (word, seed) always scrambles identically. */
  seed: number;
  /** When true, the word renders in its correct (clean) order. */
  isClean: boolean;
  /** Render with italic font style. Does not affect scramble logic. */
  italic?: boolean;
  /** If true, the resolution snap is instantaneous (no transform animation). */
  prefersReducedMotion: boolean;
}

const TRANSITION = "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Renders a single word as a sequence of inline-block letter spans.
 *
 * DOM order is always the CORRECT order (so screen readers read the real word).
 * The visual scramble is achieved purely by `transform: translateX(...)` on each
 * letter. When `isClean` flips to true, every letter animates back to translateX(0)
 * over 350ms.
 *
 * Letter widths are measured after `document.fonts.ready` resolves; until then,
 * the word renders in clean visual order. The page is responsible for hiding the
 * essay until measurements complete (see `app/lab/typoglycemia/page.tsx`).
 */
export function ScrambledWord({
  word,
  seed,
  isClean,
  italic,
  prefersReducedMotion,
}: ScrambledWordProps) {
  const chars = useMemo(() => Array.from(word), [word]);
  const { sourceMap } = useMemo(() => scramble(word, seed), [word, seed]);

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [translations, setTranslations] = useState<number[] | null>(null);

  useLayoutEffect(() => {
    let cancelled = false;

    const compute = () => {
      if (cancelled) return;
      const refs = letterRefs.current;
      const widths = refs.map((el) => (el ? el.getBoundingClientRect().width : 0));
      if (widths.length === 0) return;

      const cleanCumX: number[] = [0];
      for (let i = 0; i < widths.length; i++) {
        cleanCumX.push(cleanCumX[i] + widths[i]);
      }

      const scrambledCumX: number[] = [0];
      for (let i = 0; i < chars.length; i++) {
        scrambledCumX.push(scrambledCumX[i] + widths[sourceMap[i]]);
      }

      const next = new Array(chars.length).fill(0);
      for (let j = 0; j < chars.length; j++) {
        const i = sourceMap.indexOf(j);
        if (i !== -1) {
          next[j] = scrambledCumX[i] - cleanCumX[j];
        }
      }

      setTranslations(next);
    };

    if (typeof document === "undefined") return;
    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(() => {
        if (!cancelled) compute();
      });
    } else {
      compute();
    }

    return () => {
      cancelled = true;
    };
  }, [word, seed, chars, sourceMap]);

  const fontStyle = italic ? "italic" : undefined;

  return (
    <span
      data-typo-word
      data-seed={seed}
      style={{
        display: "inline-block",
        fontKerning: "none",
        fontFeatureSettings: '"liga" 0',
        fontStyle,
      }}
    >
      {chars.map((ch, i) => {
        const offset = translations ? translations[i] : 0;
        const translateX = isClean || offset === 0 ? 0 : offset;
        return (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            style={{
              display: "inline-block",
              transform: `translateX(${translateX}px)`,
              transition: prefersReducedMotion ? "none" : TRANSITION,
              willChange: prefersReducedMotion ? undefined : "transform",
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}
