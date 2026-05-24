/**
 * PNG capture for Chroma Capture.
 *
 * v3 note: the live render relies on a CSS `filter: url(#chroma-goo)`
 * applied to the canvas element via the wrapping React component.
 * `canvas.toBlob()` returns the RAW canvas pixels without the CSS
 * filter applied — so naive capture would produce un-merged ellipses,
 * not the lava-lamp silhouettes.
 *
 * To bake the goo effect into the captured PNG we replicate the SVG
 * filter pipeline in JS: render blobs → canvas-native blur to a second
 * offscreen → walk the resulting ImageData and threshold the alpha
 * channel exactly the way `feColorMatrix` would (`a' = a·M − O·255`,
 * clamped). This is slow (~tens of ms for a 2× DPR canvas) but only
 * runs once per capture. Watermark drawn on top after the goo bake.
 *
 * Grain is intentionally OFF in the capture — the cream + grain field
 * is the LIVE gallery framing, not the artifact. The PNG is the
 * artifact, droppable onto any background.
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

  // ---- Stage 4: final canvas — goo'd blobs + watermark ----
  const out = document.createElement("canvas");
  out.width = stage2.width;
  out.height = stage2.height;
  const co = out.getContext("2d");
  if (!co) return false;
  co.drawImage(stage2, 0, 0);
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

function buildFilename(chord: Chord): string {
  const slug = hueChordSlug(chord.hues as unknown as number[]);
  return `chroma-capture-${slug}.png`;
}
