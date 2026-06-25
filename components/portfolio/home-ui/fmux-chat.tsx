"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Homepage tile: a Messenger thread, authentic to the Messenger design system.
 *
 * Resting state: grey welcome bubble at the top, three light-blue icebreaker
 * pills anchored at the bottom (just above the composer). On play, the top
 * icebreaker travels straight up to sit under the welcome message and morphs
 * into a solid-blue "sent" bubble; the other two pills hold in place.
 *
 * Fly distance is measured from the welcome bubble's rendered bottom edge so
 * text wrap at any tile width can't cause overlap with the sent state.
 *
 * `active` drives the loop for the homepage orchestrator. When omitted, the
 * tile self-loops. prefers-reduced-motion holds the resting state.
 */

const MSGR_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const MORPH = "400ms cubic-bezier(1, 0.01, 0.03, 0.04)";
const SETTLE = "300ms cubic-bezier(0.42, 0, 0.58, 1)";
const FADE = "320ms ease";
const ENTER = "440ms cubic-bezier(0.34, 1.56, 0.64, 1)";

const GREY_BUBBLE = "#F2F4F7";
const INK = "#080809";
const PILL_BLUE = "#EBF5FF";
const SENT_BLUE = "#0866FF";
const SUBTLE = "#65676B";

// cqw fallbacks until first layout measure (stage-1 is ~95% of final fly).
const FLY_1 = -51.4;
const FLY_2 = -54;
const FLY_1_RATIO = FLY_1 / FLY_2;
const ENTER_FROM = 9;
const STACK_BOTTOM = 15.5;
const GAP_BELOW_WELCOME = 0.02; // 2cqw gap under incoming bubble
const GAP_BELOW_SENT = 0.012; // 1.2cqw gap before "Sent" label

type FlyMetrics = {
  fly1Px: number;
  fly2Px: number;
  sentLabelTopPx: number;
};

function SendIcon({ size }: { size: string }) {
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

type Phase = "rest" | "fly" | "settle" | "fade" | "enterPrep" | "enter";

export function FmuxChat({ active }: FmuxChatProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const [flyMetrics, setFlyMetrics] = useState<FlyMetrics | null>(null);
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

  const measureFly = () => {
    const root = rootRef.current;
    const welcome = welcomeRef.current;
    const stack = stackRef.current;
    const flyer = flyerRef.current;
    if (!root || !welcome || !stack || !flyer) return;

    const rootRect = root.getBoundingClientRect();
    if (rootRect.width <= 0) return;

    const welcomeBottom = welcome.getBoundingClientRect().bottom - rootRect.top;
    const gap = rootRect.width * GAP_BELOW_WELCOME;
    const targetTop = welcomeBottom + gap;

    const stackTop = stack.getBoundingClientRect().top - rootRect.top;
    const restTop = stackTop + flyer.offsetTop;
    const fly2Px = targetTop - restTop;
    const fly1Px = fly2Px * FLY_1_RATIO;
    const sentLabelTopPx =
      targetTop + flyer.offsetHeight + rootRect.width * GAP_BELOW_SENT;

    setFlyMetrics({ fly1Px, fly2Px, sentLabelTopPx });
  };

  useLayoutEffect(() => {
    measureFly();
    const root = rootRef.current;
    const welcome = welcomeRef.current;
    if (!root) return;

    const ro = new ResizeObserver(measureFly);
    ro.observe(root);
    if (welcome) ro.observe(welcome);

    if (document.fonts?.ready) {
      document.fonts.ready.then(measureFly);
    }

    return () => ro.disconnect();
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

    const HOLD_REST = 1400;
    const FLY_PAUSE = 700;
    const HOLD_SENT = 5200;
    const FADE_MS = 320;
    const ENTER_MS = 440;

    const push = (fn: () => void, ms: number) =>
      timers.current.push(setTimeout(fn, ms));

    const run = () => {
      measureFly();
      push(() => {
        measureFly();
        setPhase("fly");
        push(() => {
          setPhase("settle");
          push(() => {
            setPhase("fade");
            push(() => {
              setPhase("enterPrep");
              raf.current = requestAnimationFrame(() => {
                raf.current = requestAnimationFrame(() => {
                  setPhase("enter");
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
  const isBlue = phase === "fly" || phase === "settle" || phase === "fade";

  const flyerTransform = flyMetrics
    ? phase === "fly"
      ? `translateY(${flyMetrics.fly1Px}px)`
      : phase === "settle" || phase === "fade"
        ? `translateY(${flyMetrics.fly2Px}px)`
        : phase === "enterPrep"
          ? `translateY(${c(ENTER_FROM)})`
          : "translateY(0)"
    : phase === "fly"
      ? `translateY(${c(FLY_1)})`
      : phase === "settle" || phase === "fade"
        ? `translateY(${c(FLY_2)})`
        : phase === "enterPrep"
          ? `translateY(${c(ENTER_FROM)})`
          : "translateY(0)";

  const flyerTransition =
    phase === "fly"
      ? `transform ${MORPH}, background ${MORPH}, color ${MORPH}`
      : phase === "settle"
        ? `transform ${SETTLE}, background ${MORPH}, color ${MORPH}`
        : phase === "fade"
          ? `opacity ${FADE}`
          : phase === "enter"
            ? `transform ${ENTER}, opacity ${FADE}`
            : "none";

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
      ref={rootRef}
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
          ref={welcomeRef}
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

      <span
        style={{
          position: "absolute",
          top: flyMetrics ? `${flyMetrics.sentLabelTopPx}px` : c(34.1),
          right: c(7.2),
          fontSize: c(2.3),
          color: SUBTLE,
          opacity: phase === "settle" ? 1 : 0,
          transition: "opacity 250ms ease",
        }}
      >
        Sent
      </span>

      <div
        ref={stackRef}
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
          ref={flyerRef}
          style={{
            ...pillBase,
            gap: 0,
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
