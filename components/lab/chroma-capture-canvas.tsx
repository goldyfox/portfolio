"use client";

/**
 * Chroma Capture canvas — the interactive playfield.
 *
 * Owns:
 *   - The canvas element + device-pixel-ratio scaling
 *   - The rAF animation loop (paused on tab hidden)
 *   - Pointer handling for nudge + pop interactions
 *   - Touch-safe scroll behavior (gestures inside the box drive the
 *     experiment; gestures that leave the box release back to the page)
 *   - The blob population, including spawn/respawn lifecycle
 *
 * Communicates with parent via:
 *   - `onReady(api)` — exposes capture trigger so the camera button
 *     (in the section wrapper) can fire the snapshot without poking
 *     into canvas internals.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type Blob,
  applyBlobEntrainment,
  applyCursorImpulse,
  constrainLateral,
  createBlob,
  hitTest,
  isOffscreen,
  markPopping,
  randomEdgeSpawn,
  stepBlob,
} from "@/lib/chroma/blob";
import { captureToPng } from "@/lib/chroma/capture";
import {
  CHROMA_PALETTE_C,
  CHROMA_PALETTE_HUES,
  CHROMA_PALETTE_L,
  type Chord,
  makeBlobHues,
} from "@/lib/chroma/color";
import { type Vec2 } from "@/lib/chroma/physics";
import { makeGrainPattern, renderFrame } from "@/lib/chroma/render";
import { getChromaAudio } from "@/lib/chroma/audio";

const TARGET_BLOB_COUNT_DESKTOP = 18;
const TARGET_BLOB_COUNT_MOBILE = 10;
/** Mobile breakpoint (px). Mirrors the rest of the portfolio. */
const MOBILE_BREAKPOINT = 640;

/**
 * Static chord used as a stable identifier for the active palette.
 * Pre-v4 the chord rotated around the wheel; v4 uses a fixed palette
 * (see `CHROMA_PALETTE_HUES`) and samples per-blob, so the chord no
 * longer drifts over time. The Chord object is still passed to
 * `renderFrame` / `captureToPng` for the filename slug and any future
 * palette-aware rendering — it just doesn't change frame-to-frame.
 */
const STATIC_PALETTE_CHORD: Chord = {
  hues: [CHROMA_PALETTE_HUES[0], CHROMA_PALETTE_HUES[2], CHROMA_PALETTE_HUES[4]],
  C: CHROMA_PALETTE_C,
  L: CHROMA_PALETTE_L,
};

/**
 * Steady-state spawn cadence. With `PHYSICS_DEFAULTS.vTerminal = -10`
 * px/s and a ~720 px canvas, one blob takes ~72 s to traverse from
 * the bottom edge to the top. 18 blobs evenly distributed across that
 * traversal means a fresh blob every ~4 s. Cadence below that limit
 * would clump them into rising rafts; above it would leave the field
 * sparse.
 *
 * Random jitter ±500 ms scatters per-blob vertical spacing by ~5 px
 * per blob (cumulative ±21 px over 18 blobs) — enough to avoid a
 * metronomic look, not enough to feel chaotic.
 */
const STEADY_CADENCE_BASE_MS = 3500;
const STEADY_CADENCE_JITTER_MS = 1000;

/**
 * Pre-roll: on mount we simulate the physics in CPU-only virtual time
 * BEFORE the first paint, so the user arrives at a field that has
 * already been "running" for ~90 s. Every blob legitimately entered
 * from the bottom edge during the virtual pre-roll, so the
 * "nothing-from-the-sides, nothing-mid-screen" invariant holds even
 * for the very first painted frame.
 *
 * 90 s of virtual time covers one full bottom-to-top traversal (~72 s)
 * plus enough margin for steady-state spawning to begin and the
 * distribution to settle. 50 ms-per-step gives 1800 steps; with O(N²)
 * entrainment at N=18, that's ~580 k ops — completes in ~10–30 ms of
 * real CPU time.
 */
const PREROLL_VIRTUAL_DURATION_MS = 90_000;
const PREROLL_STEP_MS = 50;

/** Capture flash duration (ms). */
const FLASH_DURATION_MS = 220;

export interface ChromaCanvasHandle {
  /** Trigger a capture. Resolves true on a successful PNG download. */
  capture: () => Promise<boolean>;
}

interface ChromaCanvasProps {
  /** Called once on mount with the canvas API handle (capture trigger). */
  onReady?: (handle: ChromaCanvasHandle) => void;
  className?: string;
  /** Whether to honor prefers-reduced-motion. Default true. */
  respectReducedMotion?: boolean;
}

interface CursorState {
  inside: boolean;
  pos: Vec2;
  /** Smoothed velocity (low-pass over recent frames). */
  vel: Vec2;
  /** Most recent pos at last frame (for velocity calc). */
  lastPos: Vec2;
  lastMs: number;
}

export const ChromaCaptureCanvas = forwardRef<ChromaCanvasHandle, ChromaCanvasProps>(
  function ChromaCaptureCanvas({ onReady, className, respectReducedMotion = true }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const blobsRef = useRef<Blob[]>([]);
    const nextIdRef = useRef(1);
    const chordRef = useRef<Chord>(STATIC_PALETTE_CHORD);
    const cursorRef = useRef<CursorState>({
      inside: false,
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      lastPos: { x: 0, y: 0 },
      lastMs: 0,
    });
    const flashStartRef = useRef<number | null>(null);
    const grainPatternRef = useRef<CanvasPattern | null>(null);
    const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
    const lastFrameMsRef = useRef<number>(0);
    /**
     * Real-time clock value at which the next spawn is permitted. Re-rolled
     * with random jitter every time a spawn fires, so the cadence stays
     * within the band defined by `STEADY_CADENCE_BASE/JITTER_MS`.
     */
    const nextSpawnEligibleMsRef = useRef<number>(0);
    const reducedMotionRef = useRef<boolean>(false);
    const rafIdRef = useRef<number | null>(null);
    const targetBlobCountRef = useRef<number>(TARGET_BLOB_COUNT_DESKTOP);

    const [, force] = useState(0);

    // ----- DPR + resize ----------------------------------------------------
    const applySize = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
      sizeRef.current = { width: cssW, height: cssH };
      targetBlobCountRef.current =
        cssW < MOBILE_BREAKPOINT ? TARGET_BLOB_COUNT_MOBILE : TARGET_BLOB_COUNT_DESKTOP;
    }, []);

    // ----- Spawn helpers ---------------------------------------------------
    /**
     * Spawn one blob from the bottom edge with a small upward velocity
     * (delegated to `randomEdgeSpawn`). All blobs — initial fill and
     * pop-driven respawns alike — come through this single path so
     * the field's entry-point invariant ("only from below") holds at
     * all times. Throttled by `MIN_SPAWN_INTERVAL_MS` in the tick loop
     * so the initial 18 blobs don't all enter on frame 1.
     */
    const spawnBlob = useCallback((nowMs: number) => {
      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) return;
      const radius = Math.min(width, height) * (0.10 + Math.random() * 0.10);
      // v4: each blob is a single visual color sampled uniformly from
      // CHROMA_PALETTE_HUES. The blob's `hues` array still holds 3 values
      // for the audio chord on pop (`makeBlobHues` adds 2 secondary
      // palette samples); render only consumes `hues[0]`.
      const hues = makeBlobHues();
      const id = nextIdRef.current++;
      const spawn = randomEdgeSpawn({ width, height }, radius);
      blobsRef.current.push(
        createBlob({
          id,
          pos: spawn.pos,
          vel: spawn.vel,
          targetRadius: radius,
          hues,
          nowMs,
        }),
      );
    }, []);

    /**
     * Pre-roll: CPU-only simulation of the physics for
     * `PREROLL_VIRTUAL_DURATION_MS` of virtual time before the first
     * paint. Every blob in the field at first paint legitimately
     * entered from the bottom edge during this virtual pre-roll, so
     * the "blobs only enter from the bottom, nothing appears
     * mid-field" invariant holds at the very first frame too.
     *
     * Virtual time is anchored to `realStart - PREROLL_VIRTUAL_DURATION_MS`
     * so that every blob's `stateStartMs` lands in the past relative
     * to `performance.now()` after the pre-roll completes — keeps
     * pop animation timing and any other "wall-clock since birth"
     * arithmetic correct in the real-time loop.
     */
    const runPreroll = useCallback((realStart: number) => {
      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) return;

      const startVirtualMs = realStart - PREROLL_VIRTUAL_DURATION_MS;
      const dt = PREROLL_STEP_MS / 1000;
      const steps = Math.round(PREROLL_VIRTUAL_DURATION_MS / PREROLL_STEP_MS);

      let virtualNowMs = startVirtualMs;
      // First spawn is eligible immediately at virtual t=0.
      let nextSpawnAt = startVirtualMs;

      for (let i = 0; i < steps; i++) {
        virtualNowMs += PREROLL_STEP_MS;

        // v4: palette is static; no chord rotation during pre-roll.
        // Blobs are sampled uniformly from CHROMA_PALETTE_HUES on spawn.

        // No cursor activity during pre-roll. Entrainment + step +
        // lateral constraint follow the same order as the real-time
        // tick so trajectories stay statistically identical.
        applyBlobEntrainment(blobsRef.current);
        for (const b of blobsRef.current) {
          stepBlob(b, dt, virtualNowMs);
          constrainLateral(b, width);
        }

        // Recycle blobs that have drifted off the top (or bottom —
        // defensive, shouldn't happen during pre-roll since spawn vel
        // is upward).
        blobsRef.current = blobsRef.current.filter((b) => {
          if (b.state === "popping") {
            if (virtualNowMs - b.stateStartMs > 360) return false;
          }
          if (isOffscreen(b, { width, height })) return false;
          return true;
        });

        // Spawn cadence — identical math to the real-time tick.
        if (
          blobsRef.current.length < targetBlobCountRef.current &&
          virtualNowMs > nextSpawnAt
        ) {
          spawnBlob(virtualNowMs);
          nextSpawnAt =
            virtualNowMs + STEADY_CADENCE_BASE_MS + Math.random() * STEADY_CADENCE_JITTER_MS;
        }
      }

      // Hand off to the real-time loop: schedule the next allowable
      // spawn at the same virtual offset we landed on. Since the
      // virtual end point is anchored to `realStart`, this is already
      // in the real-time clock's scale.
      nextSpawnEligibleMsRef.current = nextSpawnAt;
    }, [spawnBlob]);

    // ----- rAF loop --------------------------------------------------------
    const tick = useCallback(
      (nowMs: number) => {
        rafIdRef.current = null;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const { width, height } = sizeRef.current;
        if (width === 0 || height === 0) {
          rafIdRef.current = requestAnimationFrame(tick);
          return;
        }

        // Compute dt — clamp for safety after tab refocus.
        const last = lastFrameMsRef.current || nowMs;
        let dt = (nowMs - last) / 1000;
        if (dt > 0.1) dt = 0.1;
        if (dt < 0) dt = 0;
        lastFrameMsRef.current = nowMs;

        // Reduced motion: slow everything down by 90%.
        const dtPhysics = reducedMotionRef.current ? dt * 0.1 : dt;

        // v4: palette is static; no chord rotation. The chordRef holds a
        // fixed identifier used for filename slugging at capture time.

        // Cursor velocity (low-pass smoothed; idle cursor velocity decays).
        const cursor = cursorRef.current;
        if (cursor.inside && cursor.lastMs > 0) {
          const cursorDt = Math.max((nowMs - cursor.lastMs) / 1000, 1 / 240);
          const rawVx = (cursor.pos.x - cursor.lastPos.x) / cursorDt;
          const rawVy = (cursor.pos.y - cursor.lastPos.y) / cursorDt;
          // 60ms low-pass — smooths jittery input without lagging the response.
          const alpha = 1 - Math.exp(-dt / 0.06);
          cursor.vel.x = cursor.vel.x + (rawVx - cursor.vel.x) * alpha;
          cursor.vel.y = cursor.vel.y + (rawVy - cursor.vel.y) * alpha;
          cursor.lastPos = { ...cursor.pos };
        } else {
          // Decay cursor velocity to zero when outside or before first move.
          const decay = Math.exp(-dt / 0.15);
          cursor.vel.x *= decay;
          cursor.vel.y *= decay;
        }
        cursor.lastMs = nowMs;

        // Apply cursor impulse to blobs (only while cursor is inside).
        if (cursor.inside) {
          const vMag = Math.hypot(cursor.vel.x, cursor.vel.y);
          if (vMag > 4) {
            for (const b of blobsRef.current) {
              applyCursorImpulse(b, cursor.pos, cursor.vel);
            }
          }
        }

        // Blob-blob entrainment.
        applyBlobEntrainment(blobsRef.current);

        // Step each blob, then hard-clamp lateral position so blobs
        // cannot escape sideways. They can only disappear off the top
        // or bottom (rising lava out the top, sinking lava out the
        // bottom — both recycled by the offscreen lifecycle below).
        for (const b of blobsRef.current) {
          stepBlob(b, dtPhysics, nowMs);
          constrainLateral(b, width);
        }

        // Lifecycle: remove popped blobs whose dispersion completed,
        // remove drifted-off blobs, and respawn to maintain target count.
        blobsRef.current = blobsRef.current.filter((b) => {
          if (b.state === "popping") {
            const elapsed = nowMs - b.stateStartMs;
            if (elapsed > 360) return false;
          }
          if (isOffscreen(b, sizeRef.current)) return false;
          return true;
        });
        // Gate respawns by the steady-state cadence (one blob every
        // ~3.5-4.5 s). The pre-roll has already populated the field
        // to the target count, so this gate mostly only fires when a
        // blob exits the top — keeping the distribution stable.
        if (
          blobsRef.current.length < targetBlobCountRef.current &&
          nowMs > nextSpawnEligibleMsRef.current
        ) {
          spawnBlob(nowMs);
          nextSpawnEligibleMsRef.current =
            nowMs + STEADY_CADENCE_BASE_MS + Math.random() * STEADY_CADENCE_JITTER_MS;
        }

        // Flash overlay alpha.
        let flashAlpha = 0;
        if (flashStartRef.current !== null) {
          const fElapsed = nowMs - flashStartRef.current;
          if (fElapsed < FLASH_DURATION_MS) {
            // Quick rise (first 40ms), slower fall.
            if (fElapsed < 40) flashAlpha = (fElapsed / 40) * 0.8;
            else flashAlpha = 0.8 * (1 - (fElapsed - 40) / (FLASH_DURATION_MS - 40));
          } else {
            flashStartRef.current = null;
          }
        }

        // Render. The CSS goo filter on the canvas element (applied by
        // the section wrapper via `style={{ filter: "url(#chroma-goo)" }}`)
        // turns these solid ellipses into merged amorphous silhouettes —
        // we just need to emit clean alpha shapes here.
        renderFrame(ctx, blobsRef.current, {
          width,
          height,
          nowMs,
          chord: chordRef.current,
          includeGrain: true,
          includeWatermark: false,
          flashAlpha,
          grainPattern: grainPatternRef.current,
        });

        rafIdRef.current = requestAnimationFrame(tick);
      },
      [spawnBlob],
    );

    // ----- Mount: size, grain, initial blobs, rAF, reduced-motion ----------
    useEffect(() => {
      if (typeof window === "undefined") return;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      applySize();
      grainPatternRef.current = makeGrainPattern(ctx);

      // Reduced motion.
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedMotionRef.current = respectReducedMotion && mq.matches;
      const handleMq = (e: MediaQueryListEvent) => {
        reducedMotionRef.current = respectReducedMotion && e.matches;
      };
      mq.addEventListener("change", handleMq);

      // Pre-roll the simulation in virtual time so the field arrives
      // already populated and distributed across its full height —
      // with every blob having legitimately entered from the bottom
      // edge during the virtual warm-up. See `runPreroll` and
      // `PREROLL_VIRTUAL_DURATION_MS` for the math.
      const nowMs = performance.now();
      runPreroll(nowMs);
      lastFrameMsRef.current = nowMs;
      force((n) => n + 1);

      // Resize observer.
      const ro = new ResizeObserver(() => applySize());
      ro.observe(container);

      // Visibility: pause when hidden.
      const handleVis = () => {
        if (document.hidden) {
          if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
          }
        } else if (rafIdRef.current === null) {
          lastFrameMsRef.current = performance.now();
          rafIdRef.current = requestAnimationFrame(tick);
        }
      };
      document.addEventListener("visibilitychange", handleVis);

      // Start loop.
      rafIdRef.current = requestAnimationFrame(tick);

      return () => {
        ro.disconnect();
        mq.removeEventListener("change", handleMq);
        document.removeEventListener("visibilitychange", handleVis);
        if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      };
    }, [applySize, respectReducedMotion, runPreroll, tick]);

    // ----- Pointer handling ------------------------------------------------
    const getCanvasPoint = useCallback((clientX: number, clientY: number): Vec2 | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    }, []);

    const handlePointerEnter = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        // Only treat mouse and pen hovers as "inside" for nudge purposes;
        // touch shouldn't activate nudge until the user actively drags.
        if (e.pointerType === "touch") return;
        const pt = getCanvasPoint(e.clientX, e.clientY);
        if (!pt) return;
        const c = cursorRef.current;
        c.inside = true;
        c.pos = pt;
        c.lastPos = pt;
        c.vel = { x: 0, y: 0 };
        c.lastMs = performance.now();
      },
      [getCanvasPoint],
    );

    const handlePointerLeave = useCallback(() => {
      cursorRef.current.inside = false;
    }, []);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        const pt = getCanvasPoint(e.clientX, e.clientY);
        if (!pt) return;
        const c = cursorRef.current;
        if (!c.inside) {
          // First move after enter (touch case) — initialize state.
          c.inside = true;
          c.lastPos = pt;
          c.lastMs = performance.now();
        }
        c.pos = pt;
      },
      [getCanvasPoint],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        const pt = getCanvasPoint(e.clientX, e.clientY);
        if (!pt) return;
        const nowMs = performance.now();
        // Touch: also activate nudge state on down so finger-drag works.
        if (e.pointerType === "touch") {
          const c = cursorRef.current;
          c.inside = true;
          c.pos = pt;
          c.lastPos = pt;
          c.vel = { x: 0, y: 0 };
          c.lastMs = nowMs;
        }
        // Pop test: only against alive blobs. Stop at first hit.
        for (let i = blobsRef.current.length - 1; i >= 0; i--) {
          const b = blobsRef.current[i];
          if (hitTest(b, pt)) {
            markPopping(b, nowMs);
            try {
              getChromaAudio().playChord(b.hues);
            } catch {
              // ignore audio failures
            }
            return;
          }
        }
      },
      [getCanvasPoint],
    );

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
      // For touch: release nudge state so the page can reclaim scroll.
      if (e.pointerType === "touch") {
        cursorRef.current.inside = false;
      }
    }, []);

    // ----- Capture API -----------------------------------------------------
    const api: ChromaCanvasHandle = useMemo(
      () => ({
        capture: async () => {
          flashStartRef.current = performance.now();
          const { width, height } = sizeRef.current;
          if (width === 0 || height === 0) return false;
          const ok = await captureToPng({
            width,
            height,
            blobs: blobsRef.current,
            chord: chordRef.current,
            nowMs: performance.now(),
          });
          return ok;
        },
      }),
      [],
    );

    useImperativeHandle(ref, () => api, [api]);

    useEffect(() => {
      if (onReady) onReady(api);
    }, [onReady, api]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          // Explicit 100% × 100% so the canvas inside has a definite
          // parent height to resolve its own `height: 100%` against.
          // Without these, percent-height collapses to the HTML canvas
          // default (~150 px) and the field only fills the top of the
          // cream frame.
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            // CSS goo filter — soft-edge merging via SVG feGaussianBlur +
            // feColorMatrix alpha threshold defined in the section wrapper.
            // This is the canonical n3r4zzurr0 / Bret Cameron pattern;
            // ctx.filter = "url()" is too unreliable across browsers.
            filter: "url(#chroma-goo)",
            // `touch-action: none` lets drag-in-canvas be the nudge gesture
            // without the browser hijacking it for page scroll. Tap-to-pop
            // still works because pointerdown fires before any pan attempt.
            touchAction: "none",
            cursor: "crosshair",
          }}
        />
      </div>
    );
  },
);
