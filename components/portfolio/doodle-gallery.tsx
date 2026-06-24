"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type Doodle = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

// Block drag-to-desktop and long-press/right-click save on any image.
const protect = {
  draggable: false,
  onDragStart: (e: React.SyntheticEvent) => e.preventDefault(),
  onContextMenu: (e: React.SyntheticEvent) => e.preventDefault(),
} as const;

type Box = { top: number; left: number; width: number; height: number };

function rectStyle(b: Box): React.CSSProperties {
  return {
    position: "fixed",
    top: `${b.top}px`,
    left: `${b.left}px`,
    width: `${b.width}px`,
    height: `${b.height}px`,
    margin: 0,
  };
}

// Largest centered box that fits the image's natural aspect inside the viewport.
function fitToViewport(natW: number, natH: number): Box {
  const maxW = window.innerWidth * 0.9;
  const maxH = window.innerHeight * 0.9;
  const scale = Math.min(maxW / natW, maxH / natH);
  const width = natW * scale;
  const height = natH * scale;
  return {
    width,
    height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
  };
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 420;
const transition = `top ${DURATION}ms ${EASE}, left ${DURATION}ms ${EASE}, width ${DURATION}ms ${EASE}, height ${DURATION}ms ${EASE}`;

function Lightbox({
  doodle,
  origin,
  onClose,
}: {
  doodle: Doodle;
  origin: Box;
  onClose: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Animate in: start at the thumbnail's box, expand to the centered target.
  useEffect(() => {
    const img = imgRef.current;
    const backdrop = backdropRef.current;
    if (!img || !backdrop) return;

    const target = fitToViewport(doodle.width, doodle.height);

    if (reduceMotion) {
      Object.assign(img.style, rectStyle(target));
      backdrop.style.opacity = "1";
      return;
    }

    Object.assign(img.style, rectStyle(origin));
    img.style.transition = "none";
    backdrop.style.opacity = "0";
    void img.offsetWidth; // force reflow so the start box is committed

    const raf = requestAnimationFrame(() => {
      img.style.transition = transition;
      Object.assign(img.style, rectStyle(target));
      backdrop.style.opacity = "1";
    });
    return () => cancelAnimationFrame(raf);
  }, [doodle, origin, reduceMotion]);

  // Animate back to the thumbnail's box, then unmount.
  const close = useCallback(() => {
    const img = imgRef.current;
    const backdrop = backdropRef.current;
    if (!img || !backdrop || reduceMotion) {
      onClose();
      return;
    }
    img.style.transition = transition;
    Object.assign(img.style, rectStyle(origin));
    backdrop.style.opacity = "0";
    const done = () => onClose();
    img.addEventListener("transitionend", done, { once: true });
    window.setTimeout(done, DURATION + 80); // fallback if transitionend is missed
  }, [onClose, origin, reduceMotion]);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [close]);

  return (
    <div
      ref={backdropRef}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={doodle.alt}
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-[rgba(12,12,18,0.92)]"
      style={{ opacity: 0, transition: `opacity ${DURATION}ms ${EASE}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={doodle.src}
        alt={doodle.alt}
        {...protect}
        className="img-protected block rounded-[2px] object-contain"
        style={rectStyle(origin)}
      />
    </div>
  );
}

function Tile({
  doodle,
  sizes,
  onOpen,
  priority,
}: {
  doodle: Doodle;
  sizes: string;
  onOpen: (doodle: Doodle, origin: Box) => void;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onOpen(doodle, { top: r.top, left: r.left, width: r.width, height: r.height });
      }}
      aria-label={`Expand ${doodle.alt}`}
      className="group block w-full cursor-zoom-in overflow-hidden rounded-[2px]"
    >
      <Image
        src={doodle.src}
        alt={doodle.alt}
        width={doodle.width}
        height={doodle.height}
        sizes={sizes}
        priority={priority}
        {...protect}
        className="img-protected block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </button>
  );
}

export default function DoodleGallery({ doodles }: { doodles: readonly Doodle[] }) {
  const [active, setActive] = useState<{ doodle: Doodle; origin: Box } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const open = useCallback((doodle: Doodle, origin: Box) => {
    setActive({ doodle, origin });
  }, []);

  return (
    <>
      {/* Editorial bento — images render at full height (no cropping), so the
          shorter side of a row simply leaves a gap.
          Row 1: large tile at 2/3 width + two stacked tiles in the right 1/3.
          Row 2: two tiles at 50% each.
          Full color (doodles are an exception to the grayscale image rule). */}
      <div className="mt-macro flex flex-col gap-6 min-[768px]:gap-8">
        <div className="grid grid-cols-3 items-start gap-6 min-[768px]:gap-8">
          <div className="col-span-2">
            <Tile doodle={doodles[0]} sizes="(min-width: 768px) 67vw, 100vw" onOpen={open} priority />
          </div>
          <div className="flex flex-col gap-6 min-[768px]:gap-8">
            <Tile doodle={doodles[1]} sizes="(min-width: 768px) 33vw, 100vw" onOpen={open} />
            <Tile doodle={doodles[2]} sizes="(min-width: 768px) 33vw, 100vw" onOpen={open} />
          </div>
        </div>
        <div className="grid grid-cols-2 items-start gap-6 min-[768px]:gap-8">
          <Tile doodle={doodles[3]} sizes="(min-width: 768px) 50vw, 100vw" onOpen={open} />
          <Tile doodle={doodles[4]} sizes="(min-width: 768px) 50vw, 100vw" onOpen={open} />
        </div>
      </div>

      {mounted && active
        ? createPortal(
            <Lightbox
              doodle={active.doodle}
              origin={active.origin}
              onClose={() => setActive(null)}
            />,
            document.body,
          )
        : null}
    </>
  );
}
