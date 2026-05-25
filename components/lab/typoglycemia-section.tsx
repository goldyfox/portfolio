"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ScrambledWord } from "@/components/lab/scrambled-word";
import { typoglycemiaEssay } from "@/lib/content/typoglycemia-essay";
import { parseParagraph, type ParagraphToken } from "@/lib/scramble";

/**
 * Typoglycemia — first Lab experiment, rendered inline on /lab.
 *
 * Mechanic: a bounded scroll box contains the entire essay (intro and
 * body paragraphs) as one continuous scrolling flow. The ONLY element
 * fixed in place inside the box is a 1px ethos-blue demarcation line.
 *
 * At rest, the intro paragraph sits at the top of the box and the line
 * sits in flow right after it; the intro's words are above the line and
 * therefore render clean. The body paragraphs sit below the line and
 * render scrambled.
 *
 * As the user scrolls inside the box:
 *   - the intro scrolls UP past the demarcation and out of view,
 *   - the line sticks at a fixed viewport position inside the box,
 *   - body paragraphs scroll up; as each word's vertical center crosses
 *     above the line, it animates from its scrambled positions to its
 *     clean positions (350ms cubic-bezier in `ScrambledWord`).
 *
 * Resolution ratchets: once a word is clean, it stays clean even if
 * scroll-up returns it below the line.
 *
 * Implementation notes:
 *   - DOM order is always the correct (clean) word; visual scramble is
 *     pure `translateX`. Screen readers read the real essay.
 *   - The line is a `position: sticky` element in flow between intro and
 *     body. We compute the demarcation by reading the line's actual
 *     getBoundingClientRect each frame — this is correct whether the
 *     line is in natural flow or pinned.
 *   - Scroll handler is rAF-throttled and bound to the box, not window.
 *   - Reveal is gated on `document.fonts.ready` so letter-width
 *     measurements use Newsreader, not the fallback font.
 */

interface RenderedToken {
  token: ParagraphToken;
  /** Stable seed for scramble + clean-set tracking. Unique per word. */
  seed: number | null;
}

type RenderedParagraph =
  | { kind: "essay"; paragraphKey: string; tokens: RenderedToken[] }
  | { kind: "quote"; paragraphKey: string; text: string };

/** Viewport Y (px from box top) at which the blue line pins. */
const LINE_STICKY_TOP_PX = 120;

export function TypoglycemiaSection() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [bodyReady, setBodyReady] = useState(false);
  const [cleanWords, setCleanWords] = useState<Set<number>>(() => new Set());
  const [isAtBottom, setIsAtBottom] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  // contentY of each word (vertical center, in the box's scroll-content
  // coordinate space — i.e. independent of scrollTop).
  const wordYRef = useRef<Map<number, number>>(new Map());

  // Tokenize once. Assign a stable seed to every word token across all
  // essay paragraphs so the clean-set can refer to words by seed.
  // Quote paragraphs are pass-through — no tokenization, no seeds, no
  // tracking by the crossing logic.
  const paragraphs = useMemo<RenderedParagraph[]>(() => {
    let seedCounter = 0;
    return typoglycemiaEssay.paragraphs.map((para, idx) => {
      if (para.kind === "quote") {
        return {
          kind: "quote",
          paragraphKey: `p${idx}`,
          text: para.text,
        };
      }
      const tokens = parseParagraph(para.text, idx);
      return {
        kind: "essay",
        paragraphKey: `p${idx}`,
        tokens: tokens.map((token) => ({
          token,
          seed: token.kind === "word" ? ++seedCounter : null,
        })),
      };
    });
  }, []);

  const [introParagraph, ...bodyParagraphs] = paragraphs;

  // ---- Reduced motion ------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ---- Measurement helpers -------------------------------------------------
  /**
   * Returns the demarcation Y in the box's scroll-content coordinate space.
   * Works whether the line is in natural flow (early scroll) or pinned at
   * `top: LINE_STICKY_TOP_PX` (after enough scroll). We always read the
   * line's actual rect so the logic is robust.
   */
  const demarcationContentY = useCallback((): number => {
    const box = boxRef.current;
    const line = lineRef.current;
    if (!box || !line) return 0;
    const lineRect = line.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    return lineRect.top - boxRect.top + box.scrollTop;
  }, []);

  const measureWordPositions = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const boxRect = box.getBoundingClientRect();
    const els = box.querySelectorAll<HTMLElement>("[data-typo-word]");
    const positions = new Map<number, number>();
    els.forEach((el) => {
      const seedAttr = el.dataset.seed;
      if (!seedAttr) return;
      const seed = Number(seedAttr);
      if (!Number.isFinite(seed)) return;
      const r = el.getBoundingClientRect();
      // contentY = the element's vertical center expressed in the box's
      // scroll-content coordinate space (independent of scrollTop).
      const contentY = r.top - boxRect.top + box.scrollTop + r.height / 2;
      positions.set(seed, contentY);
    });
    wordYRef.current = positions;
  }, []);

  const computeCrossings = useCallback((): Set<number> => {
    const line = demarcationContentY();
    const crossed = new Set<number>();
    wordYRef.current.forEach((y, seed) => {
      if (y <= line) crossed.add(seed);
    });
    return crossed;
  }, [demarcationContentY]);

  const mergeCleanSet = useCallback((incoming: Set<number>) => {
    setCleanWords((prev) => {
      let changed = false;
      const next = new Set(prev);
      incoming.forEach((seed) => {
        if (!next.has(seed)) {
          next.add(seed);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, []);

  const updateBottomFade = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const dist = box.scrollHeight - box.scrollTop - box.clientHeight;
    setIsAtBottom(dist < 24);
  }, []);

  // ---- Initial measurement (waits for fonts) -------------------------------
  useLayoutEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled) return;
      measureWordPositions();
      // Initial clean set = whatever sits above the line at scroll=0. The
      // intro is above the line by construction, so its words are picked
      // up here. No pre-seeding required.
      setCleanWords(computeCrossings());
      updateBottomFade();
      setBodyReady(true);
    };

    if (typeof document === "undefined") {
      init();
      return;
    }

    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
          if (!cancelled) init();
        });
      });
    } else {
      requestAnimationFrame(() => {
        if (!cancelled) init();
      });
    }

    return () => {
      cancelled = true;
    };
  }, [measureWordPositions, computeCrossings, updateBottomFade]);

  // ---- Scroll listener (box-scoped, rAF-throttled) -------------------------
  useEffect(() => {
    if (!bodyReady) return;
    const box = boxRef.current;
    if (!box) return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        mergeCleanSet(computeCrossings());
        updateBottomFade();
      });
    };

    box.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      box.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [bodyReady, computeCrossings, mergeCleanSet, updateBottomFade]);

  // ---- Resize listener (re-measure, never un-clean) ------------------------
  useEffect(() => {
    if (!bodyReady) return;
    const onResize = () => {
      measureWordPositions();
      mergeCleanSet(computeCrossings());
      updateBottomFade();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bodyReady, measureWordPositions, computeCrossings, mergeCleanSet, updateBottomFade]);

  // ---- Render helpers ------------------------------------------------------
  const renderTokens = (tokens: RenderedToken[]) =>
    tokens.map(({ token, seed }) => {
      if (token.kind === "word" && seed !== null) {
        return (
          <ScrambledWord
            key={token.key}
            word={token.text}
            seed={seed}
            isClean={cleanWords.has(seed)}
            italic={token.italic}
            prefersReducedMotion={prefersReducedMotion}
          />
        );
      }
      if (token.italic) {
        return <em key={token.key}>{token.text}</em>;
      }
      return <span key={token.key}>{token.text}</span>;
    });

  const paragraphClass =
    "font-serif text-[clamp(15px,1.5vw,17px)] leading-[1.6] text-[#fdfbf7]";

  return (
    <section id="typoglycemia" className="mt-macro">
      <div className="border-t border-[#fdfbf7]/10 pt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#fdfbf7]">
          02 &mdash; Experiment
        </p>
        <h2 className="mt-4 font-serif text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.2] text-[#fdfbf7]">
          Typoglycemia
        </h2>
        <p className="mt-3 max-w-[56ch] font-serif text-[16px] leading-[1.6] italic text-[#fdfbf7]/70">
          An essay you decode by scrolling.
        </p>

        {/* Bounded experiment box */}
        <div className="relative mt-8">
          <div
            ref={boxRef}
            role="region"
            aria-label="Typoglycemia interactive essay"
            tabIndex={0}
            className="typo-box relative h-[min(75vh,720px)] min-h-[420px] overflow-y-scroll rounded-[2px] border border-[#fdfbf7]/10 bg-[#fdfbf7]/[0.03] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1313ec] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b12]"
            style={{
              // `auto` (browser default) means: at the inner box's top/bottom
              // boundary, continued scroll chains to the outer page. Reader
              // never gets trapped in the box.
              overscrollBehavior: "auto",
              visibility: bodyReady ? "visible" : "hidden",
            }}
          >
            <div className="mx-auto max-w-[640px] px-6 py-8 max-[640px]:px-4">
              {/* Intro paragraph — first paragraph in the continuous flow.
                  Sits above the blue line at rest, so its words register as
                  clean from the initial measurement. Always an essay
                  paragraph by design (a quote in slot 0 would render before
                  any of Lisa's framing, which doesn't make sense). */}
              {introParagraph && introParagraph.kind === "essay" && (
                <p key={introParagraph.paragraphKey} className={paragraphClass}>
                  {renderTokens(introParagraph.tokens)}
                </p>
              )}

              {/* The ONLY fixed-in-place element. Lives in flow between the
                  intro and the body paragraphs. Until the user scrolls past
                  it, it sits at its natural position right after the intro.
                  Once scroll would push it above `top: LINE_STICKY_TOP_PX`
                  it pins there, and remaining body text scrolls underneath. */}
              <div
                ref={lineRef}
                aria-hidden
                className="sticky z-10 -mx-6 my-6 h-px max-[640px]:-mx-4"
                style={{
                  top: `${LINE_STICKY_TOP_PX}px`,
                  backgroundColor: "#1313ec",
                }}
              />

              {/* Body paragraphs — same flow, just placed below the line.
                  Essay paragraphs scramble/unscramble via the crossing
                  mechanic; quote paragraphs render verbatim (Matt Davis's
                  meme stays exactly as he wrote it). */}
              {bodyParagraphs.map((p, i) => {
                const spacingClass = i === 0 ? "" : "mt-6";
                if (p.kind === "quote") {
                  return (
                    <blockquote
                      key={p.paragraphKey}
                      cite="https://www.mrc-cbu.cam.ac.uk/personal/matt.davis/Cmabrigde/"
                      className={`${spacingClass} border-l-2 border-[#fdfbf7]/20 pl-4 font-serif text-[clamp(15px,1.5vw,17px)] leading-[1.6] text-[#fdfbf7]/70`}
                    >
                      {p.text}
                    </blockquote>
                  );
                }
                return (
                  <p
                    key={p.paragraphKey}
                    className={`${paragraphClass} ${spacingClass}`}
                  >
                    {renderTokens(p.tokens)}
                  </p>
                );
              })}

              <hr className="my-8 border-0 border-t border-[#fdfbf7]/10" />

              <p className="font-sans text-[12px] leading-[1.6] text-[#fdfbf7]/60">
                {typoglycemiaEssay.attribution.text}{" "}
                <a
                  href={typoglycemiaEssay.attribution.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {typoglycemiaEssay.attribution.linkLabel}
                </a>
              </p>
            </div>
          </div>

          {/* Bottom fade — visual cue for "more below". Fades out when
              the user reaches the bottom so attribution is fully legible. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-[2px] transition-opacity duration-300"
            style={{
              background: "linear-gradient(to top, rgb(18,18,25) 20%, transparent)",
              opacity: bodyReady && !isAtBottom ? 1 : 0,
            }}
          />
        </div>
      </div>
    </section>
  );
}
