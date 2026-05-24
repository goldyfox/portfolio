"use client";

/**
 * Chroma Capture — second Lab experiment, rendered inline on /lab.
 *
 * A kinetic color-harmony field. Soft gradient blobs drift upward
 * (buoyancy + Stokes drag), respond to cursor motion (Gaussian velocity
 * field), and chain-react through fluid entrainment. Click pops a blob,
 * which plays a major-pentatonic chord whose pitches map from the blob's
 * gradient hues (hue → pitch in OKLab). The camera icon saves a no-
 * background PNG of the current moment, watermarked and named after the
 * active chord (e.g., chroma-capture-coral-aqua-violet.png).
 *
 * Aesthetic: cream interior with hairline ethos-blue frame, sitting inside
 * the dark Vault Lab page. Each experiment is a framed work hanging in
 * the gallery; the dark Lab is the gallery floor. See DECISIONS.md
 * "Lab experiment interior palette".
 */

import { useCallback, useRef, useState } from "react";

import {
  ChromaCaptureCanvas,
  type ChromaCanvasHandle,
} from "@/components/lab/chroma-capture-canvas";
import { getChromaAudio } from "@/lib/chroma/audio";

export function ChromaCaptureSection() {
  const canvasApiRef = useRef<ChromaCanvasHandle | null>(null);
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return getChromaAudio().muted;
  });
  const [captureBusy, setCaptureBusy] = useState(false);
  const [captureToast, setCaptureToast] = useState<string | null>(null);

  const handleReady = useCallback((handle: ChromaCanvasHandle) => {
    canvasApiRef.current = handle;
  }, []);

  const handleCapture = useCallback(async () => {
    if (captureBusy) return;
    const api = canvasApiRef.current;
    if (!api) return;
    setCaptureBusy(true);
    try {
      const ok = await api.capture();
      setCaptureToast(ok ? "Saved to your downloads" : "Save failed — try again");
      window.setTimeout(() => setCaptureToast(null), 2400);
    } finally {
      setCaptureBusy(false);
    }
  }, [captureBusy]);

  const toggleMute = useCallback(() => {
    const audio = getChromaAudio();
    const next = !audio.muted;
    audio.setMuted(next);
    setMuted(next);
  }, []);

  return (
    <section id="chroma-capture" className="mt-macro">
      {/*
        Hidden SVG goo filter — referenced by the canvas element via its
        CSS `filter: url(#chroma-goo)` style. v4 pipeline:

          1. feGaussianBlur (σ=10) — smear alpha edges so neighboring
             blobs' alpha fields overlap.
          2. feColorMatrix (alpha row: 18 -7) — snap blurred alpha back
             to a hard amorphous silhouette. Cuts at ~0.39 blurred alpha.
             This is the merged metaball outline. RGB rows are identity
             so source colors survive untouched on this layer.
          3. feComposite atop SourceGraphic — overlay the ORIGINAL
             source pixels on top of the goo silhouette, clipped strictly
             to the silhouette. Where the source has soft alpha (the
             blob's gradient core/edge), the source color shows; where
             the source has zero alpha (the gooey neck between blobs),
             the blurred goo color fills in. Net effect: amorphous
             silhouette (unchanged from v3.2) + soft internal source
             colors visible inside it.

        Steps 1+2 alone (v3.2) define the silhouette — so motion read
        is preserved exactly. Step 3 only changes what color paints
        inside the silhouette; it does not extend the silhouette.

        Values 10 / 30 / -11.7 — v4.3 sharpened the threshold ramp from
        the canonical 18 / -7 to eliminate semi-transparency in thin
        gooey necks. Same CUT POINT (blurred α ≈ 0.39), tighter ramp to
        fully opaque (0.42 instead of 0.444). Silhouette SIZE unchanged
        — only the alpha softness across the edge band reduces. Capture
        pipeline (lib/chroma/capture.ts) mirrors these values.
      */}
      <svg
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id="chroma-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 30 -11.7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="border-t border-[#fdfbf7]/10 pt-8">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#fdfbf7]">
          02 &mdash; Chroma Capture
        </h2>
        <p className="mt-4 max-w-[44ch] font-serif text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.4] italic text-[#fdfbf7]/80">
          A color field, in motion. Move through it to nudge.
          <span className="not-italic"> </span>
          Click to pop &mdash; colors play as chords.
          <span className="not-italic"> </span>
          Tap the camera to save the moment.
        </p>

        {/* Framed playfield */}
        <div className="relative mt-8">
          <div
            role="region"
            aria-label="Chroma Capture interactive color field"
            className="chroma-frame relative h-[min(75vh,720px)] min-h-[420px] w-full overflow-hidden rounded-[2px] border border-[#1313ec]/40 bg-[#fdfbf7]"
          >
            <ChromaCaptureCanvas
              onReady={handleReady}
              className="absolute inset-0"
            />

            {/* Top-right controls: mute + camera */}
            <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute pop sounds" : "Mute pop sounds"}
                aria-pressed={muted}
                title={muted ? "Unmute" : "Mute"}
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-[#1313ec]/30 bg-[#fdfbf7]/90 text-[#1313ec] backdrop-blur-sm transition-colors hover:border-[#1313ec] hover:bg-[#fdfbf7] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1313ec] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfbf7]"
              >
                {muted ? <IconSpeakerOff /> : <IconSpeakerOn />}
              </button>

              <button
                type="button"
                onClick={handleCapture}
                disabled={captureBusy}
                aria-label="Save current moment as PNG"
                title="Save this moment"
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-[#1313ec]/30 bg-[#fdfbf7]/90 text-[#1313ec] backdrop-blur-sm transition-colors hover:border-[#1313ec] hover:bg-[#fdfbf7] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1313ec] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfbf7] disabled:opacity-60"
              >
                <IconCamera />
              </button>
            </div>

            {/* Capture confirmation toast */}
            {captureToast && (
              <div
                role="status"
                aria-live="polite"
                className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-[2px] border border-[#1313ec]/30 bg-[#fdfbf7]/95 px-3 py-1.5 font-sans text-[12px] text-[#1313ec] shadow-[0_2px_12px_rgba(19,19,236,0.08)]"
              >
                {captureToast}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Icons — inline SVG, sized to fit the 36px button.
// ---------------------------------------------------------------------------

function IconCamera() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 5h2l1-1.5h4L11 5h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconSpeakerOn() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 6h2l3-2.5v9L5 10H3V6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 6.2c.6.5 1 1.2 1 1.8s-.4 1.3-1 1.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 4.4c1.3 1 2 2.3 2 3.6s-.7 2.6-2 3.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSpeakerOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 6h2l3-2.5v9L5 10H3V6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M11 6 14 9M14 6l-3 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
