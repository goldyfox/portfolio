"use client";

import { useEffect, useRef, useState } from "react";
import { useTileNarrow } from "@/components/portfolio/use-tile-compact";

/**
 * Homepage tile: the L1 Ads-Manager "Conversations" template card (GenAI demo).
 *
 * A faithful, hand-built React rebuild of the Figma states. The card floats on
 * a pale-blue ground (the Messenger icebreaker-pill blue) and loops three
 * states: default → glimmer (loading) → genai → reset.
 *
 * Layout is mapped 1:1 to the Figma export. The card is 428px wide / 382px tall
 * (the 438×392 SVG canvas minus its 5px shadow margin). Every element is
 * absolutely positioned at its exact SVG coordinate, converted to cqw via
 * p(px) = px / 428 * 100, so it scales with the tile but keeps source geometry.
 *
 * Exact font sizes (from Lisa): "Conversations" 16pt bold (Optimistic Display),
 * description 14pt, Greeting/Questions headings 14pt bold, body 12pt — all SF
 * Pro. Three things animate in the DOM: the active tab morphs width (pushing
 * "Saved templates"), a band sweeps the skeleton bars, and the greeting +
 * questions cross-fade between states.
 *
 * `active` drives the loop for the homepage orchestrator; omitted = self-loop.
 * prefers-reduced-motion holds the default state.
 */

const SF =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const DISPLAY = `"Optimistic Display", ${SF}`;

const GROUND = "#EBF5FF"; // pale blue, matches the Messenger icebreaker pills
const TAB_BG = "#E1EDF7"; // active tab pill
const BLUE = "#0A78BE"; // active tab text, links, AI
const PANEL = "#F1F4F7"; // greeting/questions panel
const INK = "#1C2B33"; // primary text
const SKEL = "#CBD2D9"; // skeleton bars
const HAIRLINE = "#CBD2D9"; // button borders

// Figma card box: 428 × 382 px → convert design px to cqw (% of card width).
const CARD_W = 428;
const CARD_H = 382;
const p = (px: number) => `${((px / CARD_W) * 100).toFixed(3)}cqw`;

const DEFAULT_GREETING = "Hi Lisa! Please let us know how we can help you.";
const GENAI_GREETING =
  "Hi Lisa! Check out the latest plant sets available on our website.";
const DEFAULT_Q = [
  "Can I make a purchase?",
  "What services do you offer?",
  "What are your hours?",
];
const GENAI_Q = [
  "What types of plants do you stock?",
  "How do you ship your plants?",
  "Do you have free delivery?",
];

type Phase = "default" | "glimmer" | "genai";

export function GenaiTemplate({ active }: { active?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const narrow = useTileNarrow(rootRef);
  const [phase, setPhase] = useState<Phase>("default");
  const [reduced, setReduced] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Measured width of the active-tab content, so the pill morphs smoothly.
  const tabInnerRef = useRef<HTMLSpanElement>(null);
  const [tabW, setTabW] = useState<number>();
  const [tabAnimate, setTabAnimate] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const selfLoop = active === undefined;
  const playing = selfLoop || active;
  const isRecommended = phase === "genai";

  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    if (reduced || !playing) {
      clear();
      setPhase("default");
      return clear;
    }

    const HOLD_DEFAULT = 2400;
    const HOLD_GLIMMER = 2000;
    const HOLD_GENAI = 6000; // +3s dwell on the Recommended view before reset

    const push = (fn: () => void, ms: number) =>
      timers.current.push(setTimeout(fn, ms));

    const run = () => {
      push(() => {
        setPhase("glimmer");
        push(() => {
          setPhase("genai");
          push(() => {
            setPhase("default");
            if (selfLoop) run();
          }, HOLD_GENAI);
        }, HOLD_GLIMMER);
      }, HOLD_DEFAULT);
    };

    run();
    return clear;
  }, [reduced, playing, selfLoop]);

  // Track the active-tab content width so the pill morphs to fit. A
  // ResizeObserver (+ ceil of the fractional rect) keeps the pill exactly as
  // wide as its content through label changes, font swaps, and tile resizes —
  // measuring once with offsetWidth clipped the trailing padding when the SF
  // bold text reflowed wider after the web font loaded. First measure runs
  // without a transition so the pill doesn't animate in from 0.
  useEffect(() => {
    const el = tabInnerRef.current;
    if (!el) return;
    const measure = () => setTabW(Math.ceil(el.getBoundingClientRect().width));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const t = setTimeout(() => setTabAnimate(true), 50);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  const fadeLayer = (visible: boolean): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    opacity: visible ? 1 : 0,
    transition: "opacity 300ms ease",
  });

  const skeletonBar = (
    visible: boolean,
    topInset = "0",
  ): React.CSSProperties => ({
    position: "absolute",
    top: topInset,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: p(2),
    overflow: "hidden",
    opacity: visible ? 1 : 0,
    transition: "opacity 300ms ease",
  });

  // Loading state: the skeleton fill is a gradient — full skeleton colour on the
  // left fading to 10% on the right — and the whole bar pulses in and out.
  const Glimmer = () => (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(90deg, ${SKEL} 0%, ${SKEL}1A 100%)`,
        animation: "genai-pulse 1.4s ease-in-out infinite",
      }}
    />
  );

  const QuestionList = ({ items }: { items: string[] }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: p(3),
        fontSize: p(12),
        lineHeight: 1.2,
        color: INK,
      }}
    >
      {items.map((q, i) => (
        <div key={q} style={{ display: "flex", gap: p(4) }}>
          <span>{i + 1}.</span>
          <span>{q}</span>
        </div>
      ))}
    </div>
  );

  const bodyText: React.CSSProperties = {
    fontSize: p(12),
    lineHeight: 1.25,
    color: INK,
  };

  // Shared active-tab label, rendered both in the visible pill and in a hidden
  // ghost used purely for width measurement.
  const tabLabelStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: p(6),
    whiteSpace: "nowrap",
    padding: `${p(9)} ${p(12)}`,
    fontSize: p(14),
    fontWeight: 700,
    color: BLUE,
  };
  const ghostTabStyle: React.CSSProperties = {
    ...tabLabelStyle,
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden",
    pointerEvents: "none",
  };
  const TabLabel = () => (
    <>
      {isRecommended ? "Recommended template" : "Suggested template"}
      {isRecommended && (
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: p(3) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/genai/template/sparkle.svg"
            alt=""
            style={{ width: p(12), height: p(12) }}
          />
          AI
        </span>
      )}
    </>
  );

  return (
    <div
      ref={rootRef}
      style={{
        position: "absolute",
        inset: 0,
        background: GROUND,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: narrow ? "5%" : "8%",
        boxSizing: "border-box",
        fontFamily: SF,
      }}
    >
      <div style={{ width: "100%", containerType: "inline-size" }}>
        {/* Card box — 428 × 382, all children placed at exact SVG coords */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingBottom: `${((CARD_H / CARD_W) * 100).toFixed(3)}%`,
            background: "#FFFFFF",
            borderRadius: p(8),
            boxShadow: `0 ${p(6)} ${p(16)} rgba(28,43,51,0.08)`,
            color: INK,
          }}
        >
          {/* Header: green check + "Conversations" */}
          <div
            style={{
              position: "absolute",
              top: p(18),
              left: p(16),
              display: "flex",
              alignItems: "center",
              gap: p(6),
            }}
          >
            <CheckGlyph size={p(16)} />
            <span
              style={{ fontFamily: DISPLAY, fontSize: p(16), fontWeight: 700 }}
            >
              Conversations
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              position: "absolute",
              top: p(46),
              left: p(16),
              right: p(16),
              margin: 0,
              ...bodyText,
              fontSize: p(14),
              lineHeight: 1.32,
            }}
          >
            Customize the messaging experience people see after they tap on your
            ad.
          </p>

          {/* Tabs — active pill morphs width and pushes "Saved templates" */}
          <div
            style={{
              position: "absolute",
              top: p(100),
              left: p(16),
              right: p(16),
              display: "flex",
              alignItems: "center",
              gap: p(14),
            }}
          >
            {/* Ghost copy of the active label, out of flow and never width-
                constrained, so its measured width includes the full padding.
                (Measuring the visible inner — which lives inside the
                overflow-hidden pill — fed back to a clipped width.) */}
            <span ref={tabInnerRef} aria-hidden style={ghostTabStyle}>
              <TabLabel />
            </span>
            <span
              style={{
                display: "inline-block",
                flexShrink: 0,
                background: TAB_BG,
                borderRadius: p(4),
                overflow: "hidden",
                width: tabW !== undefined ? `${tabW}px` : "auto",
                transition: tabAnimate
                  ? "width 420ms cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
              }}
            >
              <span style={tabLabelStyle}>
                <TabLabel />
              </span>
            </span>
            <span
              style={{ flexShrink: 0, fontSize: p(14), fontWeight: 500 }}
            >
              Saved templates
            </span>
          </div>

          {/* Greeting + questions panel (21,157 → 396×168, card-local 16,152) */}
          <div
            style={{
              position: "absolute",
              top: p(152),
              left: p(16),
              width: p(396),
              height: p(172),
              background: PANEL,
              borderRadius: p(4),
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: p(13),
                left: p(8),
                fontSize: p(14),
                fontWeight: 700,
              }}
            >
              Greeting
            </div>
            {/* greeting slot — skeleton bar1 at panel-local (8,30) 375×18 */}
            <div
              style={{
                position: "absolute",
                top: p(30),
                left: p(8),
                width: p(375),
                height: p(18),
              }}
            >
              <div style={fadeLayer(phase === "default")}>
                <span style={bodyText}>{DEFAULT_GREETING}</span>
              </div>
              <div style={fadeLayer(phase === "genai")}>
                <span style={bodyText}>{GENAI_GREETING}</span>
              </div>
              {/* top inset so the bar clears the "g" descender of "Greeting" */}
              <div style={skeletonBar(phase === "glimmer", p(4))}>
                {phase === "glimmer" && <Glimmer />}
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: p(62),
                left: p(8),
                fontSize: p(14),
                fontWeight: 700,
              }}
            >
              Questions and responses
            </div>
            {/* questions slot — dropped to p(84) so the heading→body gap matches
                the greeting block (the greeting body inherits a taller line box,
                so identical numeric offsets render unequal) */}
            <div
              style={{
                position: "absolute",
                top: p(84),
                left: p(8),
                width: p(375),
                height: p(51),
              }}
            >
              <div style={fadeLayer(phase === "default")}>
                <QuestionList items={DEFAULT_Q} />
              </div>
              <div style={fadeLayer(phase === "genai")}>
                <QuestionList items={GENAI_Q} />
              </div>
              <div style={skeletonBar(phase === "glimmer")}>
                {phase === "glimmer" && <Glimmer />}
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: p(146),
                left: p(8),
                fontSize: p(13),
                fontWeight: 500,
                color: BLUE,
              }}
            >
              Add responses
            </div>
          </div>

          {/* Footer buttons (icons at card-local y≈340) */}
          <div
            style={{
              position: "absolute",
              top: p(331),
              left: p(16),
              display: "flex",
              gap: p(8),
            }}
          >
            <TemplateButton>
              <ButtonIcon src="/work/genai/template/pencil.svg" />
              Edit
            </TemplateButton>
            <TemplateButton>
              <ButtonIcon src="/work/genai/template/plus.svg" />
              Create template
            </TemplateButton>
          </div>
        </div>
      </div>
    </div>
  );

  function ButtonIcon({ src }: { src: string }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        style={{ width: p(16), height: p(16), display: "block", flexShrink: 0 }}
      />
    );
  }

  function TemplateButton({ children }: { children: React.ReactNode }) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: p(6),
          border: `1px solid ${HAIRLINE}`,
          borderRadius: p(6),
          padding: `${p(8)} ${p(14)}`,
          fontSize: p(13),
          fontWeight: 600,
          color: INK,
        }}
      >
        {children}
      </span>
    );
  }
}

function CheckGlyph({ size }: { size: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#007E59" strokeWidth="2" />
      <path
        d="M8 12.2l2.7 2.6L16 9"
        stroke="#007E59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
