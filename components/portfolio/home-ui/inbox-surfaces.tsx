"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Homepage tile: the ad-creation entry point shipped across three different
 * business inboxes — Instagram, Messenger, and Meta Business Suite.
 *
 * Each surface is its real inbox frame, cropped to the top so the header (where
 * the entry point lives) reads large and the bottom nav noise is gone. A black
 * brand mark sits above each. On a loop, all three entry glyphs light native
 * blue in unison — one baton-pass that says "same idea, three surfaces, three
 * design systems."
 *
 * The screens are flat raster frames (avatars/photos are inherently bitmap).
 * The glyphs that animate are inline SVG, pixel-matched to what's baked into
 * each frame, positioned against the full (un-cropped) image so they stay
 * aligned to the baked icon regardless of the crop.
 *
 * Tile is a fixed 16:9 box, so sizes are in cqw (1cqw = 1% of tile width;
 * height = 56.25cqw). `active` drives the loop for a homepage orchestrator;
 * omitted = self-loop. prefers-reduced-motion holds the rest (grey/black) state.
 */

const BLUE = "#0A7CFF"; // native ad-entry blue (the megaphone blue)
const GROUND = "#F4F2EC"; // warm off-white so the white frames separate cleanly
const REST_GREY = "#1C1E21"; // neutral icon grey for the Messenger megaphone at rest

const RAMP = 600; // grey ⇄ blue ramp, ms — must match CSS transition

// Tile geometry (cqw). Cards are sized to their full screen height and anchored
// near the top, so the bottoms (incl. the bottom nav) run off the tile edge.
const CARD_W = 29;
const GAP = 3.5;
const LOGO_GAP = 3.8; // (was 2.4) +1.4cqw ≈ 10px, lifts logos while cards stay anchored
const TOP_PAD = 3.1; // (was 4.5) −1.4cqw ≈ 10px
// Fixed band for the brand mark so every card top lines up, regardless of each
// logo's own optical height (otherwise the taller logo pushes its card down).
const LOGO_BAND = 6.2;

const c = (n: number) => `${n}cqw`;

// ── Entry-point glyphs, pixel-matched to each frame's baked icon ──────────────

// IG "promote" trending-up arrow (promote-pano.svg) — a 48px alpha-masked glyph.
// The baked arrow is erased from the screen PNG, so this glyph IS the icon: it
// renders near-black at rest (matching the baked dots/compose icons) and recolors
// to blue when lit — no fragile overlay-coverage to fight.
function PromoteArrow() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ display: "block" }} aria-hidden>
      <mask id="ig-pano-m" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}>
        <rect width="24" height="24" fill="url(#ig-pano-p)" />
      </mask>
      <g mask="url(#ig-pano-m)">
        <rect width="24" height="24" fill="currentColor" />
      </g>
      <defs>
        <pattern id="ig-pano-p" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use href="#ig-pano-i" transform="scale(0.0208333)" />
        </pattern>
        <image
          id="ig-pano-i"
          width="48"
          height="48"
          preserveAspectRatio="none"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAADbN2wMAAABfklEQVRoBe2W607DMAxGB9rDgZA29oPLXmVvi4CnYFx8EJYiq1ncJimtZEtW0m21z/fF67bZRIQD4UA4EA6EA+FAOBAOzO3AjTR8kfwcmV/y+Q/Jk+S/xqt0/65IRPzGtW5mXq8q+20r76++/U4qvEvWnEI1RIsCTEAun+Q9RiUnskX/bjUeC/CIWmwMwZ+F1p7EIgXk4I9rEHAJHre7nMBeCvODRO4kpwbwdky4xnmN5gJsU54YD9ptxFpyXks1FcAjzjpGA0QA5A0vPPWaCcjBawOviDHwzQQMwXMS9jRKIoC393CdzjzQaahBuqbvufY5+Ge5m8YWKCdiCjyACq4rr7njErwW8YiYCk+P9B8se3d44LXYkAhOBvAaeOrfSgJOsnfFGHgtmBNhR4xrxq9bTIFXGMAssM4u66LhSyJWAZ8TsSp4FXGQzdtfsu8W91LZzm13x1qqSZ+zs3zRWsJTKxWA8zyFVhXpDwXjFBEOhAPhQDgQDoQD4UDBgR88eTj62aU4lwAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
}

// Messenger megaphone (Megaphoneicon.svg) — a clean vector path, recolorable.
function Megaphone() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ display: "block" }} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.8518 3.08315L17.5943 1.87176H17.5774C19.4282 1.04735 21.75 1.56892 21.75 3.68885V15.1802C21.75 17.2833 19.4282 17.8217 17.5774 16.9973L14.835 15.7859C12.7151 14.8269 10.3091 14.339 7.85267 14.339H5.4972C3.71376 14.339 2.25 12.892 2.25 11.0918V7.77728C2.25 5.99385 3.71376 4.53009 5.51402 4.53009H6.79271H7.06191H7.8695C10.3259 4.53009 12.7319 4.02534 14.8518 3.08315ZM9.51833 15.6681C10.3259 15.6681 10.511 16.0214 10.6288 16.3579H10.6456L11.857 20.1099C12.1935 21.1362 11.6214 22.2466 10.5951 22.5831C9.5688 22.9196 8.45837 22.3476 8.12187 21.3213L6.50668 16.3411C6.38891 16.0046 6.64128 15.6681 6.9946 15.6681H9.51833Z"
        fill="currentColor"
      />
    </svg>
  );
}

// MBS megaphone (GeoHeaderButton.svg inner glyph) — a 32px alpha-masked outline.
function MbsMegaphone() {
  return (
    <svg viewBox="0 0 16 16" width="100%" height="100%" style={{ display: "block" }} aria-hidden>
      <mask id="mbs-mp-m" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16" style={{ maskType: "alpha" }}>
        <rect width="16" height="16" fill="url(#mbs-mp-p)" />
      </mask>
      <g mask="url(#mbs-mp-m)">
        <rect width="16" height="16" fill="currentColor" />
      </g>
      <defs>
        <pattern id="mbs-mp-p" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use href="#mbs-mp-i" transform="scale(0.03125)" />
        </pattern>
        <image
          id="mbs-mp-i"
          width="32"
          height="32"
          preserveAspectRatio="none"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAAEEfUpiAAAAAXNSR0IArs4c6QAAAk1JREFUWAntl70uBUEUx31EofCR6DUi8ZFotBoKr+AV1BKlWqkhVJ5CIaESiUTCCyh5AUQirrj+vzVnzO7szi53o8BJzp0z//M/Z2bn+/b1VUhXOFotT9UueR6kxL8lWeZ8NqOs3BKY7koxajUA6OZoUM/MA/2+FMHaen+CQQev8S9KqYS6gEOSfYU5PqD8b3cgX49rEOjHmXORbVn66uq+GHdW1qazD1XOe4YMnLMh8OP2hFrsSG+Dln2XMZg7DwSklOn5ZliZCgp9fh7omgVTFvVKWKMBXBeR4TexpFafkwG2J2XqSveNBQ1XEYT/ZRnUx9uM2Vg1Ho8dMQlacRG5BCfOCVilRy7QCp+A4H2HetBYidJzvSFyaCdiM1fGrT1S6rKQ4FE6UkdM+cuORbpnei97uySB/wR2GgefHcJFe1I+Ng4BbKKkZFkdI7Qt6EIGO3BGWubPQOtJKUGB09IbKckiORay5tCqBFFQCAypwqARfB46/u1eR4CJ46xm8niZMIG5a1P11oULgIaYT5Yea5jlZ2sarDUZU6ZlKacSDyQa5QVBo9Fjyflzq5TtzAMK8DvKymVHb0ub3J/WhugfYu/L8FCKSEZuoYxyR4AaKcNaaDtL4XP3fJ732iPrwKlLxCIqWzS9ttMonoXI/WrrwYbpqyXbiwvcnuoyI7GckSMEdlWBuBGCzk4lmBCHJ0hHCo8H8Yo0lFS85y3JgnjpkU+jUQLReUjxt8s6Y3GUbNtauRMD8lSBaYkKcPvVTaW0xoploy9ov0u/LeM7MqnI3oDWMDgAAAAASUVORK5CYII="
        />
      </defs>
    </svg>
  );
}

// ── Surfaces ──────────────────────────────────────────────────────────────────

type Mode = "fade" | "recolor";

interface Surface {
  key: string;
  label: string;
  logo: string;
  logoH: number; // optical height, cqw (per-logo to equalize visual weight)
  src: string;
  aspect: number; // native width / height
  // entry-glyph placement, as a fraction of the FULL frame, + its width fraction.
  // `rest` overrides the at-rest color for recolor glyphs (defaults to REST_GREY).
  icon: { x: number; y: number; w: number; glyph: React.ReactNode; mode: Mode; rest?: string };
}

const SURFACES: Surface[] = [
  {
    key: "instagram",
    label: "Instagram",
    logo: "/work/inbox-ads/logos/instagram.svg",
    logoH: 5.4,
    src: "/work/inbox-ads/screens/instagram.png",
    aspect: 393 / 812,
    icon: { x: 0.7602, y: 0.0816, w: 0.06, glyph: <PromoteArrow />, mode: "recolor", rest: "#0A0A0A" },
  },
  {
    key: "messenger",
    label: "Messenger",
    logo: "/work/inbox-ads/logos/messenger.svg",
    logoH: 6.2,
    src: "/work/inbox-ads/screens/messenger.png",
    aspect: 749 / 1623,
    icon: { x: 0.916, y: 0.0793, w: 0.066, glyph: <Megaphone />, mode: "recolor" },
  },
  {
    key: "mbs",
    label: "Meta Business Suite",
    logo: "/work/inbox-ads/logos/meta.svg",
    logoH: 4.6,
    src: "/work/inbox-ads/screens/mbs.png",
    aspect: 375 / 812,
    icon: { x: 0.77, y: 0.089, w: 0.044, glyph: <MbsMegaphone />, mode: "recolor" },
  },
];

export function InboxSurfaces({ active }: { active?: boolean }) {
  const [lit, setLit] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const selfLoop = active === undefined;
  const playing = selfLoop || active;

  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    if (reduced || !playing) {
      clear();
      setLit(false);
      return clear;
    }

    const HOLD_REST = 1600; // grey dwell
    const HOLD_LIT = HOLD_REST + 1500; // blue held ~1.5s longer than grey
    const push = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

    const run = () => {
      push(() => {
        setLit(true);
        push(() => {
          setLit(false);
          push(run, RAMP + HOLD_REST);
        }, RAMP + HOLD_LIT);
      }, HOLD_REST);
    };
    run();
    return clear;
  }, [reduced, playing]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: GROUND,
        containerType: "inline-size",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: c(TOP_PAD),
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: c(GAP) }}>
        {SURFACES.map((s) => {
          const fullImgH = CARD_W / s.aspect; // full screen height at card width
          return (
            <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Logos sit in a fixed-height band, bottom-aligned, so all card tops match. */}
              <div
                style={{
                  height: c(LOGO_BAND),
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  marginBottom: c(LOGO_GAP),
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.logo} alt={s.label} style={{ height: c(s.logoH), width: "auto", display: "block" }} />
              </div>

              {/* Full screen, top-rounded; the bottom runs off the tile edge. */}
              <div
                style={{
                  position: "relative",
                  width: c(CARD_W),
                  height: c(fullImgH),
                  borderRadius: `${c(1.6)} ${c(1.6)} 0 0`,
                  overflow: "hidden",
                  background: "#FFFFFF",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={`${s.label} inbox with the ad-creation entry point`}
                  style={{ display: "block", width: "100%", height: "100%" }}
                />

                {/* entry-point highlight: glow + recoloring glyph, in unison */}
                <span
                  style={{
                    position: "absolute",
                    left: `${s.icon.x * 100}%`,
                    top: `${s.icon.y * 100}%`,
                    width: `${s.icon.w * 100}%`,
                    aspectRatio: "1 / 1",
                    transform: "translate(-50%, -50%)",
                    display: "block",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: "-90%",
                      borderRadius: "999px",
                      background: `radial-gradient(circle, ${BLUE}55 0%, ${BLUE}00 70%)`,
                      opacity: lit ? 1 : 0,
                      transform: lit ? "scale(1)" : "scale(0.6)",
                      transition: `opacity ${RAMP}ms ease, transform ${RAMP}ms ease`,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      color: s.icon.mode === "fade" ? BLUE : lit ? BLUE : s.icon.rest ?? REST_GREY,
                      opacity: s.icon.mode === "fade" ? (lit ? 1 : 0) : 1,
                      transition: `color ${RAMP}ms ease, opacity ${RAMP}ms ease`,
                    }}
                  >
                    {s.icon.glyph}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
