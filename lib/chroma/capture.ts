/**
 * PNG capture for Chroma Capture (v4 — palette + atop composition).
 *
 * The live render relies on a CSS `filter: url(#chroma-goo)` applied
 * to the canvas element. `canvas.toBlob()` returns the RAW canvas
 * pixels without the CSS filter — so we replicate the full SVG filter
 * chain in JS:
 *
 *   1. Render blobs (soft alpha, palette colors) to `stage1`.
 *   2. Blur `stage1` → `stage2` (canvas-native CSS filter is fine here;
 *      only `url()` references were the problem).
 *   3. Threshold `stage2`'s alpha channel pixel-by-pixel — equivalent
 *      to `feColorMatrix` row `0 0 0 18 -7`. This is the goo silhouette.
 *   4. Composite `stage1` atop `stage2` on the output canvas via
 *      `globalCompositeOperation = "source-atop"` — equivalent to
 *      `feComposite operator="atop"`. Clips source colors strictly to
 *      the goo silhouette while preserving the soft inner gradient
 *      shape (the gradient-merge effect at overlap boundaries).
 *   5. Watermark on top.
 *
 * v4.1: grain is disabled in both live render and capture to match.
 * A static tile pattern doesn't translate with the blobs and reads as
 * a screen filter rather than a material property; better to ship
 * grain-less than to ship a texture that fights the motion. The cream
 * FRAME stays out of the PNG; everything outside the goo silhouette
 * has alpha=0, so the PNG drops cleanly onto any background.
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
const GOO_BLUR_PX = 10;
const GOO_ALPHA_MULT = 18;
const GOO_ALPHA_OFFSET_255 = 7 * 255;

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

  // ---- Stage 2: blur stage1 onto stage2 ----
  const stage2 = document.createElement("canvas");
  stage2.width = stage1.width;
  stage2.height = stage1.height;
  const c2 = stage2.getContext("2d");
  if (!c2) return false;
  // canvas-native blur works (the issue was only with url() refs).
  c2.filter = `blur(${GOO_BLUR_PX * CAPTURE_DPR}px)`;
  c2.drawImage(stage1, 0, 0);
  c2.filter = "none";

  // ---- Stage 3: alpha threshold via ImageData ----
  const img = c2.getImageData(0, 0, stage2.width, stage2.height);
  const data = img.data;
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    const thresholded = a * GOO_ALPHA_MULT - GOO_ALPHA_OFFSET_255;
    data[i] = thresholded < 0 ? 0 : thresholded > 255 ? 255 : thresholded;
  }
  c2.putImageData(img, 0, 0);

  // ---- Stage 4: atop composition — source colors clipped to goo ----
  const out = document.createElement("canvas");
  out.width = stage2.width;
  out.height = stage2.height;
  const co = out.getContext("2d");
  if (!co) return false;

  // 4a. Goo silhouette as the destination layer (blurred + thresholded).
  //     Inside the silhouette we have blurred source colors; outside is
  //     fully transparent.
  co.drawImage(stage2, 0, 0);

  // 4b. feComposite atop equivalent. Draws stage1 (crisp source colors
  //     with soft alpha) on top of the goo silhouette but ONLY where
  //     the silhouette is opaque. Outside the silhouette: untouched
  //     (still transparent). Inside the silhouette where stage1 has
  //     partial alpha: blended with the goo's blurred colors (mostly
  //     visible in gooey-neck regions where stage1 alpha is zero).
  co.globalCompositeOperation = "source-atop";
  co.drawImage(stage1, 0, 0);

  // 4c. Grain disabled in v4.1 — matches the live render. A static
  //     grain tile reads as a screen filter rather than a property of
  //     the moving material. Toggle back on if we decide we want it.

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
