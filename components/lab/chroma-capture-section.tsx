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
        CSS `filter: url(#chroma-goo)` style. v4.5a pipeline (two-blur
        chain + alpha boost, no grain):

          PIPELINE A — silhouette (crisp alpha mask):
          1. feGaussianBlur (σ=10) of SourceGraphic → "alphaBlur".
          2. feColorMatrix, RGB rows zeroed, alpha row `30 -11.7` →
             "silhouette" (binary alpha mask, sharp edges).

          PIPELINE B — soft color cloud:
          3. feGaussianBlur (σ=25) of SourceGraphic → "softColor".

          COMPOSE + BOOST:
          4. feComposite(softColor, silhouette, in) → "composed".
          5. feColorMatrix scaling RGB+A by 1.15 (v4.7 — was 1.08 in
             v4.5a, lifted +7pp for saturation against cream) → output.

        v4.6 / v4.6a / v4.6b explored procedural grain via feTurbulence
        — first as post-composite alpha modulation (read as pixelated
        moving surface), then as pre-threshold edge injection (still
        read as static noise field with moving blobs in front of it).
        All three reverted; proper material-feel grain on a kinetic
        surface needs per-frame noise regeneration or blob-local noise
        fields, which is a separate animation engineering scope.
        See DECISIONS.md v4.6b for the architecture archive.

        Capture pipeline (lib/chroma/capture.ts) mirrors all of this.
      */}
      <svg
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id="chroma-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="alphaBlur" />
            <feColorMatrix
              in="alphaBlur"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 30 -11.7"
              result="silhouette"
            />
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="softColor" />
            <feComposite in="softColor" in2="silhouette" operator="in" result="composed" />
            <feColorMatrix
              in="composed"
              type="matrix"
              values="1.15 0    0    0    0
                      0    1.15 0    0    0
                      0    0    1.15 0    0
                      0    0    0    1.15 0"
            />
          </filter>
        </defs>
      </svg>

      <div className="border-t border-[#fdfbf7]/10 pt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#fdfbf7]">
          01 &mdash; Experiment
        </p>
        <h2 className="mt-4 font-serif text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.2] text-[#fdfbf7]">
          Chroma Capture
        </h2>
        <p className="mt-3 max-w-[56ch] font-serif text-[16px] leading-[1.6] italic text-[#fdfbf7]/70">
          A color field, in motion. Move through it to nudge. Click to
          pop. Tap the camera to save the moment.
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
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5h2l1-1.5h4L11 5h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm5 6.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconSpeakerOn() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M3 6h2l3-2.5v9L5 10H3V6Z"
        fill="currentColor"
      />
      <path
        d="M10.5 6.2c.6.5 1 1.2 1 1.8s-.4 1.3-1 1.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 4.4c1.3 1 2 2.3 2 3.6s-.7 2.6-2 3.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function IconSpeakerOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M3 6h2l3-2.5v9L5 10H3V6Z"
        fill="currentColor"
      />
      <path
        d="M11 6 14 9M14 6l-3 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
