"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Homepage tile: a Messenger thread, authentic to the Messenger design system.
 *
 * Resting state: grey welcome bubble at the top, three light-blue icebreaker
 * pills anchored at the bottom (just above the composer). On play, the top
 * icebreaker travels straight up to sit under the welcome message and morphs
 * into a solid-blue "sent" bubble; the other two pills hold at the bottom.
 *
 * Colors are sampled from Lisa's Figma exports; motion uses the exact Smart
 * Animate spec: cubic-bezier(1, 0.01, 0.03, 0.04), 400ms.
 *
 * The tile sits in a fixed 4:5 box, so vertical positions are expressed in
 * container-query width units (cqw) and stay proportional at any tile size.
 *
 * `active` drives the loop (for the homepage orchestrator). When omitted, the
 * tile self-loops so it can be tested standalone. prefers-reduced-motion holds
 * the resting state.
 */

const MSGR_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
// Stage 1: the icebreaker flies up + recolors (original Smart Animate spec).
const MORPH = "400ms cubic-bezier(1, 0.01, 0.03, 0.04)";
// Stage 3: the bubble settles the last bit into place (Ease in and out, 300ms).
const SETTLE = "300ms cubic-bezier(0.42, 0, 0.58, 1)";
// Reset: the sent bubble fades out, then a fresh pill slides up into the stack
// with a small overshoot (easeOutBack) — never a reverse of the send.
const FADE = "320ms ease";
const ENTER = "440ms cubic-bezier(0.34, 1.56, 0.64, 1)";

// Exact values from Lisa's Figma SVG exports (icebreaker.svg / Sent.svg)
const GREY_BUBBLE = "#F2F4F7";
const INK = "#080809";
const PILL_BLUE = "#EBF5FF";
const SENT_BLUE = "#0866FF";
const SUBTLE = "#65676B";

// Layout anchors, in cqw (1cqw = 1% of tile width; tile is 4:5 so height = 125cqw).
// The top icebreaker lives in the bottom stack and flies UP via transform
// (negative = upward), so its rest gap matches the stack's gap automatically.
const FLY_1 = -51.4; // stage 1: up to just below final
const FLY_2 = -54; // stage 3: settle into the final spot under the welcome
const ENTER_FROM = 9; // reset: pill slides up from this far below its slot
const STACK_BOTTOM = 15.5; // bottom offset of the pill stack (clears the composer)
const SENT_LABEL_TOP = 34.1; // "Sent" metatext vertical anchor (nudged ~4px up toward the bubble)

function SendIcon({ size }: { size: string }) {
  // Exact Messenger send glyph (new-sender.svg), inlined verbatim.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M18.3306 6L5.6674 6.01066C4.45356 6.01168 3.82807 7.48314 4.66072 8.37884L6.82967 10.712C7.19196 11.1018 7.74127 11.2486 8.24593 11.0907L11.5015 10.0718C12.249 9.83788 12.7458 10.8434 12.1135 11.3105L9.37002 13.3375C8.93783 13.6569 8.72549 14.1999 8.82447 14.7328L9.46615 18.1877C9.69125 19.3996 11.237 19.7501 11.9496 18.7508L19.4541 8.2278C20.1168 7.29854 19.4615 5.99905 18.3306 6Z"
        fill="#0866FF"
      />
    </svg>
  );
}

interface FmuxChatProps {
  active?: boolean;
}

// rest → fly (up + recolor) → settle (+"Sent") → fade (bubble fades out) →
// enterPrep (snap pill below slot, invisible) → enter (slide up + bounce) → rest
type Phase = "rest" | "fly" | "settle" | "fade" | "enterPrep" | "enter";

export function FmuxChat({ active }: FmuxChatProps) {
  const [phase, setPhase] = useState<Phase>("rest");
  const [reduced, setReduced] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const raf = useRef<number | null>(null);

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
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };

    if (reduced || !playing) {
      clear();
      setPhase("rest");
      return clear;
    }

    const HOLD_REST = 1400; // pills sit before the send fires
    const FLY_PAUSE = 700; // stage-1 fly (400) + "After delay" (300)
    const HOLD_SENT = 5200; // final sent state holds before the reset (+3s dwell)
    const FADE_MS = 320; // bubble fades out
    const ENTER_MS = 440; // fresh pill slides up + bounces in

    const push = (fn: () => void, ms: number) =>
      timers.current.push(setTimeout(fn, ms));

    const run = () => {
      push(() => {
        setPhase("fly"); // stage 1: fly up + recolor
        push(() => {
          setPhase("settle"); // stage 3: settle + "Sent"
          push(() => {
            setPhase("fade"); // bubble fades out in place
            push(() => {
              setPhase("enterPrep"); // snap a pill just below its slot, hidden
              // two frames so the browser paints the prep state before we
              // transition into the bounce-in.
              raf.current = requestAnimationFrame(() => {
                raf.current = requestAnimationFrame(() => {
                  setPhase("enter"); // slide up + small bounce
                  push(() => {
                    setPhase("rest");
                    if (selfLoop) run();
                  }, ENTER_MS);
                });
              });
            }, FADE_MS);
          }, HOLD_SENT);
        }, FLY_PAUSE);
      }, HOLD_REST);
    };

    run();
    return clear;
  }, [reduced, playing, selfLoop]);

  const c = (n: number) => `${n}cqw`;

  // The morphing pill is "blue" (a sent bubble) only while it's up top.
  const isBlue = phase === "fly" || phase === "settle" || phase === "fade";

  const flyerTransform =
    phase === "fly"
      ? `translateY(${c(FLY_1)})`
      : phase === "settle" || phase === "fade"
        ? `translateY(${c(FLY_2)})`
        : phase === "enterPrep"
          ? `translateY(${c(ENTER_FROM)})`
          : "translateY(0)"; // rest + enter (bounce lands here)

  const flyerTransition =
    phase === "fly"
      ? `transform ${MORPH}, background ${MORPH}, color ${MORPH}`
      : phase === "settle"
        ? `transform ${SETTLE}, background ${MORPH}, color ${MORPH}`
        : phase === "fade"
          ? `opacity ${FADE}`
          : phase === "enter"
            ? `transform ${ENTER}, opacity ${FADE}`
            : "none"; // rest + enterPrep snap instantly

  const pillBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: c(1.8),
    maxWidth: "92%",
    padding: `${c(1.8)} ${c(3.2)}`,
    borderRadius: "999px",
    fontSize: c(3.4),
    lineHeight: 1.2,
    fontWeight: 400,
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#FFFFFF",
        fontFamily: MSGR_FONT,
        color: INK,
        containerType: "inline-size",
        overflow: "hidden",
      }}
    >
      {/* Ad-context line */}
      <p
        style={{
          position: "absolute",
          top: c(5),
          left: c(4.5),
          right: c(4.5),
          margin: 0,
          fontSize: c(2.5),
          color: SUBTLE,
          textAlign: "center",
        }}
      >
        You opened this chat through an ad.{" "}
        <span style={{ color: SENT_BLUE, fontWeight: 600 }}>View ad</span>
      </p>

      {/* Incoming: avatar + grey welcome bubble */}
      <div
        style={{
          position: "absolute",
          top: c(10.5),
          left: c(4.5),
          right: c(4.5),
          display: "flex",
          alignItems: "flex-end",
          gap: c(1.8),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/fmux/chat/avatar.svg"
          alt=""
          style={{
            width: c(6.6),
            height: c(6.6),
            borderRadius: "999px",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            background: GREY_BUBBLE,
            color: INK,
            borderRadius: c(4.5),
            padding: `${c(2.2)} ${c(3.2)}`,
            fontSize: c(3.4),
            lineHeight: 1.3,
            maxWidth: "74%",
          }}
        >
          Hi Lisa, happy to answer any of your questions; what would you like to
          know?
        </div>
      </div>

      {/* "Sent" metatext, fades in under the bubble once settled */}
      <span
        style={{
          position: "absolute",
          top: c(SENT_LABEL_TOP),
          // align the "t" with where the bubble's straight edge ends (one
          // corner-radius in from the bubble's right edge), not its outer curve
          right: c(7.2),
          fontSize: c(2.3),
          color: SUBTLE,
          opacity: phase === "settle" ? 1 : 0,
          transition: "opacity 250ms ease",
        }}
      >
        Sent
      </span>

      {/* Icebreakers, anchored bottom above the composer. The top pill flies
          up + morphs into the sent bubble; the other two hold in place. */}
      <div
        style={{
          position: "absolute",
          bottom: c(STACK_BOTTOM),
          left: c(4.5),
          right: c(4.5),
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: c(2),
        }}
      >
        <div
          style={{
            ...pillBase,
            gap: 0, // icon spacing is on the icon's margin so it collapses evenly
            position: "relative",
            zIndex: 2,
            background: isBlue ? SENT_BLUE : PILL_BLUE,
            color: isBlue ? "#FFFFFF" : INK,
            opacity: phase === "fade" || phase === "enterPrep" ? 0 : 1,
            transform: flyerTransform,
            transition: flyerTransition,
          }}
        >
          <span>Where are you located?</span>
          <span
            style={{
              display: "inline-flex",
              overflow: "hidden",
              marginLeft: isBlue ? 0 : c(1.8),
              maxWidth: isBlue ? 0 : c(5.6),
              opacity: isBlue ? 0 : 1,
              // only animate the collapse on the way up; snap back instantly
              transition:
                phase === "fly"
                  ? `max-width ${MORPH}, opacity ${MORPH}, margin-left ${MORPH}`
                  : "none",
            }}
          >
            <SendIcon size={c(4.9)} />
          </span>
        </div>
        <div style={{ ...pillBase, background: PILL_BLUE, color: INK }}>
          <span>What are your hours?</span>
          <SendIcon size={c(4.9)} />
        </div>
        <div style={{ ...pillBase, background: PILL_BLUE, color: INK }}>
          <span>What are my delivery options?</span>
          <SendIcon size={c(4.9)} />
        </div>
      </div>

      {/* Composer bar */}
      <div
        style={{
          position: "absolute",
          bottom: c(5),
          left: c(4.5),
          right: c(4.5),
          display: "flex",
          alignItems: "center",
          gap: c(2.6),
          color: SENT_BLUE,
        }}
      >
        <span style={{ fontSize: c(5), lineHeight: 1, fontWeight: 300 }}>+</span>
        <CameraGlyph size={c(4.6)} />
        <ImageGlyph size={c(4.6)} />
        <MicGlyph size={c(4.6)} />
        <div
          style={{
            flex: 1,
            background: GREY_BUBBLE,
            borderRadius: "999px",
            padding: `${c(1.8)} ${c(3.2)}`,
            fontSize: c(3.2),
            color: SUBTLE,
          }}
        >
          Aa
        </div>
      </div>
    </div>
  );
}

function CameraGlyph({ size }: { size: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={SENT_BLUE} aria-hidden="true">
      <path d="M9.4 4 8 6H4.5A1.5 1.5 0 0 0 3 7.5v11A1.5 1.5 0 0 0 4.5 20h15a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 19.5 6H16l-1.4-2h-5.2ZM12 9a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
    </svg>
  );
}

function ImageGlyph({ size }: { size: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={SENT_BLUE} aria-hidden="true">
      <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM5 17.5 9.5 13l2.5 2.6L15 11l4 6.5H5Z" />
    </svg>
  );
}

function MicGlyph({ size }: { size: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={SENT_BLUE} aria-hidden="true">
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-7 9a7 7 0 0 0 6 6.93V21H8.5a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2H13v-2.07A7 7 0 0 0 19 12a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0Z" />
    </svg>
  );
}
