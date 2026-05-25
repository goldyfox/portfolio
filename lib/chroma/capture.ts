/**
 * PNG capture for Chroma Capture (v4.5a — two-blur chain + alpha boost,
 * no grain).
 *
 * The live render relies on a CSS `filter: url(#chroma-goo)` applied
 * to the canvas element. `canvas.toBlob()` returns the RAW canvas
 * pixels without the CSS filter — so we replicate the full SVG filter
 * chain in JS. The chain:
 *
 *   Pipeline A — silhouette (crisp alpha mask):
 *     1. Render blobs to `stage1`.
 *     2. Blur stage1 with σ=10 → `stage2` (canvas-native blur).
 *     3. Threshold stage2's alpha pixel-by-pixel (× 30, − 11.7·255).
 *        Result is a crisp silhouette mask — A≈1 inside, 0 outside.
 *
 *   Pipeline B — soft color cloud:
 *     4. Blur stage1 with σ=25 → `stage3`.
 *
 *   Compose:
 *     5. Draw stage3 onto the output canvas (it becomes destination).
 *     6. destination-in with stage2 — clip stage3 to silhouette alpha.
 *     7. Alpha boost via ImageData pass (× 1.15, alpha only).
 *     8. Watermark on top (source-over).
 *
 * Grain history: v4.6 / v4.6a / v4.6b explored procedural grain via
 * feTurbulence and white-noise canvases, both as post-composite alpha
 * modulation and as pre-threshold noise injection. All read incorrectly
 * on moving blobs (either pixelated interiors or static noise fields
 * with blobs in front). Proper material-feel grain on a kinetic surface
 * needs per-frame noise regeneration or blob-local noise — a separate
 * animation engineering scope, deferred.
 *
 * Why two parallel blurs: σ=10 alone keeps colors too tightly clustered
 * around each blob's center (v4.3 "stamped cores"); σ=25 alone would
 * dilute the silhouette boundary. Decoupling gives a crisp silhouette
 * + smooth interior ombre.
 *
 * The cream FRAME stays out of the PNG: outside the silhouette has
 * alpha=0, so the PNG drops cleanly onto any background. Interior
 * pixels have alpha < 1 (softColor's pre-mult alpha × 1.15), which is
 * intentional — drop the PNG on cream and the cream subtly shows
 * through, matching the live render.
 */

import { type Blob } from "./blob";
import { hueChordSlug } from "./color-names";
import { type Chord } from "./color";
import { drawWatermark, renderFrame } from "./render";

const CAPTURE_DPR = 2;

/**
 * Match these to the SVG `<filter id="chroma-goo">` values in
 * `chroma-capture-section.tsx`. Drift between the two will make the
 * captured PNG look different from the live render.
 */
/** σ for the silhouette pipeline (Pipeline A). Tight blur for crisp
 *  gooey outline before threshold. */
const GOO_SILHOUETTE_BLUR_PX = 10;
/** σ for the color pipeline (Pipeline B). Wider blur for smooth ombre
 *  across merged shapes. 2.5× silhouette blur. */
const GOO_COLOR_BLUR_PX = 25;
/** v4.3: sharpened ramp from 18 / -7 → 30 / -11.7. Same cut point
 *  (blurred α ≈ 0.39), tighter semi-transparency band (0.39–0.42 vs
 *  0.39–0.44). Eliminates wash-out at thin gooey necks while keeping
 *  silhouette SIZE identical to v4.2. */
const GOO_ALPHA_MULT = 30;
const GOO_ALPHA_OFFSET_255 = 11.7 * 255;
/** Scalar applied to output alpha to compensate for softColor's
 *  Gaussian dilution. SVG side scales RGB+A together (pre-mult); JS
 *  side scales only A (straight alpha) — net displayed result matches.
 *  v4.5: 1.08 (initial). v4.7: 1.15 (lifted +7pp for saturation against
 *  cream after the grain experiments confirmed v4.5a was clean enough
 *  to handle a firmer interior). */
const ALPHA_BOOST = 1.15;

export interface CaptureOptions {
  /** Visible canvas width in CSS pixels. */
  width: number;
  /** Visible canvas height in CSS pixels. */
  height: number;
  /** Current blobs (will be rendered onto the capture canvas as a snapshot). */
  blobs: Blob[];
  /** Active chord — used both for rendering and for the filename slug. */
  chord: Chord;
  /** Time (perf.now()) — same as the live frame's nowMs. */
  nowMs: number;
}

/**
 * Render one offscreen frame at 2× DPR with grain OFF, bake in the goo
 * filter, draw the watermark, then trigger a download. Returns true on
 * success, false if the browser doesn't support canvas.toBlob or the
 * render context isn't available.
 */
export async function captureToPng(opts: CaptureOptions): Promise<boolean> {
  if (typeof document === "undefined") return false;

  // ---- Stage 1: render solid blobs to an offscreen canvas ----
  const stage1 = document.createElement("canvas");
  stage1.width = Math.round(opts.width * CAPTURE_DPR);
  stage1.height = Math.round(opts.height * CAPTURE_DPR);
  const c1 = stage1.getContext("2d");
  if (!c1) return false;
  c1.scale(CAPTURE_DPR, CAPTURE_DPR);
  renderFrame(c1, opts.blobs, {
    width: opts.width,
    height: opts.height,
    nowMs: opts.nowMs,
    chord: opts.chord,
    includeGrain: false,
    includeWatermark: false,
    flashAlpha: 0,
    grainPattern: null,
  });

  // ---- Stage 2: silhouette pipeline — blur σ=10 + alpha threshold ----
  // Equivalent to SVG `feGaussianBlur σ=10` + `feColorMatrix` with the
  // alpha row `30 -11.7`. RGB doesn't matter here because we'll only
  // use stage2's alpha as a mask in step 5.
  const stage2 = document.createElement("canvas");
  stage2.width = stage1.width;
  stage2.height = stage1.height;
  const c2 = stage2.getContext("2d");
  if (!c2) return false;
  c2.filter = `blur(${GOO_SILHOUETTE_BLUR_PX * CAPTURE_DPR}px)`;
  c2.drawImage(stage1, 0, 0);
  c2.filter = "none";
  const img2 = c2.getImageData(0, 0, stage2.width, stage2.height);
  const data2 = img2.data;
  for (let i = 3; i < data2.length; i += 4) {
    const a = data2[i];
    const thresholded = a * GOO_ALPHA_MULT - GOO_ALPHA_OFFSET_255;
    data2[i] = thresholded < 0 ? 0 : thresholded > 255 ? 255 : thresholded;
  }
  c2.putImageData(img2, 0, 0);

  // ---- Stage 3: soft color pipeline — blur σ=25 of stage1 ----
  // Equivalent to SVG `feGaussianBlur σ=25` of SourceGraphic. Source
  // RGBs interpenetrate via Gaussian convolution; overlap zones blend
  // smoothly. Stage3 keeps stage1's full RGB+alpha character, just
  // wider-blurred.
  const stage3 = document.createElement("canvas");
  stage3.width = stage1.width;
  stage3.height = stage1.height;
  const c3 = stage3.getContext("2d");
  if (!c3) return false;
  c3.filter = `blur(${GOO_COLOR_BLUR_PX * CAPTURE_DPR}px)`;
  c3.drawImage(stage1, 0, 0);
  c3.filter = "none";

  // ---- Stage 4: compose — softColor "in" silhouette ----
  const out = document.createElement("canvas");
  out.width = stage2.width;
  out.height = stage2.height;
  const co = out.getContext("2d");
  if (!co) return false;

  // 4a. Draw stage3 (soft color cloud) as the destination layer. This
  //     has wide-blurred RGB + soft alpha across the whole canvas;
  //     we'll clip it to the silhouette in 4b.
  co.drawImage(stage3, 0, 0);

  // 4b. `destination-in` with stage2 multiplies the existing destination
  //     (stage3) by stage2's alpha. Equivalent to SVG
  //     `feComposite(softColor, silhouette, in)`:
  //       out.RGB = stage3.RGB * stage2.A
  //       out.A   = stage3.A   * stage2.A
  //     Inside the silhouette (stage2.A ≈ 1): stage3 passes through.
  //     Outside (stage2.A = 0): output is transparent.
  co.globalCompositeOperation = "destination-in";
  co.drawImage(stage2, 0, 0);

  // 4c. Alpha boost — pixel pass multiplying ONLY alpha by ALPHA_BOOST
  // (1.15, v4.7) to lift interior opacity ~15%. Canvas ImageData is
  // STRAIGHT alpha, so RGB stays put and the displayed color is
  // unchanged; only the alpha channel goes up (clamped to 255). SVG
  // mirror scales RGB+A together because feColorMatrix operates on
  // pre-multiplied color.
  const outImg = co.getImageData(0, 0, out.width, out.height);
  const outData = outImg.data;
  for (let i = 3; i < outData.length; i += 4) {
    const boosted = outData[i] * ALPHA_BOOST;
    outData[i] = boosted > 255 ? 255 : boosted;
  }
  co.putImageData(outImg, 0, 0);

  // Reset composite op for the watermark (drawn over everything).
  co.globalCompositeOperation = "source-over";

  // Watermark in CSS-pixel space so font sizing matches the live UI.
  co.save();
  co.scale(CAPTURE_DPR, CAPTURE_DPR);
  drawWatermark(co, opts.width, opts.height);
  co.restore();

  return new Promise<boolean>((resolve) => {
    out.toBlob((blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = buildFilename(opts.chord);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      resolve(true);
    }, "image/png");
  });
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatTimestamp(d: Date): string {
  return (
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` +
    `-${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`
  );
}

/**
 * `chroma-capture-{slug}-{YYYYMMDD-HHMMSS}.png`. v4 uses a static
 * palette so the slug alone would collide across captures — the
 * timestamp guarantees uniqueness and sorts chronologically in the
 * downloads folder.
 */
function buildFilename(chord: Chord): string {
  const slug = hueChordSlug(chord.hues as unknown as number[]);
  return `chroma-capture-${slug}-${formatTimestamp(new Date())}.png`;
}
