/**
 * Canvas rendering pipeline for Chroma Capture (v3 — mono shape pass).
 *
 * The goo / metaball effect is applied as a CSS `filter: url(#chroma-goo)`
 * on the canvas element by the wrapping React component — NOT via the
 * canvas 2D API. This is the canonical pattern across every popular
 * lava-lamp / metaball implementation on GitHub (n3r4zzurr0/canvas-
 * liquid-effect, Saganaki22/LofiLamp, Bret Cameron's tutorial, every
 * CSS-Tricks gooey demo). `ctx.filter = "url(#id)"` is unreliable
 * across browsers and was broken in our Chrome test; CSS filters work
 * everywhere because they run in the browser compositor.
 *
 * This file therefore stays simple: clear → draw solid-color ellipses
 * for each blob → grain overlay → watermark (capture only) → flash
 * (live only). The blobs are intentionally mono in v3 so Lisa can
 * judge shape + motion before color is reintroduced.
 *
 * NO `ctx.filter` calls. NO half-res offscreen. NO `metaballCanvas`
 * plumbing. The CSS filter on the canvas element handles the goo.
 */

import { type Blob, popDisplay } from "./blob";
import { type Chord } from "./color";

/**
 * Mono blob fill — ethos-blue. Once shape + motion is approved we'll
 * replace this with per-blob multi-color gradients again.
 */
const BLOB_COLOR = "#1313ec";

export interface RenderOptions {
  /** Visible canvas width in CSS pixels (NOT device pixels). */
  width: number;
  /** Visible canvas height in CSS pixels. */
  height: number;
  /** Time (perf.now() ms) — used by pop animation. */
  nowMs: number;
  /** Active chord — currently unused while we're in mono. */
  chord: Chord;
  /** When true, draw the grain overlay layer. Off during capture. */
  includeGrain: boolean;
  /** When true, draw the watermark. On during capture, off in live view. */
  includeWatermark: boolean;
  /** Opacity of the capture flash overlay (0 = none, 1 = full white). */
  flashAlpha?: number;
  /** Pre-generated noise pattern for grain. Created once per session. */
  grainPattern?: CanvasPattern | null;
}

// ---------------------------------------------------------------------------
// Grain pattern generator (one-time on mount)
// ---------------------------------------------------------------------------

/**
 * Generate a single 256×256 monochrome noise tile as a canvas, returning
 * a `CanvasPattern` that can be filled across the canvas with `repeat`.
 * At 256 px the repeat is invisible behind 6 % opacity grain — it
 * just reads as uniform film noise.
 */
export function makeGrainPattern(ctx: CanvasRenderingContext2D): CanvasPattern | null {
  const tileSize = 256;
  const off = document.createElement("canvas");
  off.width = tileSize;
  off.height = tileSize;
  const offCtx = off.getContext("2d");
  if (!offCtx) return null;
  const img = offCtx.createImageData(tileSize, tileSize);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(Math.random() * 256);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  offCtx.putImageData(img, 0, 0);
  return ctx.createPattern(off, "repeat");
}

// ---------------------------------------------------------------------------
// Blob rendering — solid ellipse in mono color
// ---------------------------------------------------------------------------

/**
 * Draw a single blob as a solid stretched ellipse. The CSS goo filter
 * applied to the canvas element softens edges and merges overlapping
 * blobs — this function just needs to emit a clean alpha shape with
 * the right footprint.
 */
function drawBlob(ctx: CanvasRenderingContext2D, blob: Blob, nowMs: number): void {
  let radius = blob.currentRadius;
  let alphaMult = 1;
  if (blob.state === "popping") {
    const pd = popDisplay(blob, nowMs);
    if (!pd) return;
    radius = pd.radius;
    alphaMult = pd.alpha;
  }
  if (radius <= 0.5 || alphaMult <= 0.01) return;

  const a = radius * blob.stretch;
  const b = radius / Math.max(0.1, blob.stretch);

  ctx.save();
  ctx.translate(blob.pos.x, blob.pos.y);
  ctx.rotate(blob.stretchAngle);
  ctx.globalAlpha = alphaMult;
  ctx.fillStyle = BLOB_COLOR;
  ctx.beginPath();
  ctx.ellipse(0, 0, a, b, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Watermark (capture only)
// ---------------------------------------------------------------------------

const WATERMARK_TEXT = "chroma capture · lisaaufox.com";

export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  ctx.save();
  const fontPx = Math.max(10, Math.round(Math.min(width, height) / 90));
  ctx.font = `${fontPx}px "Inter", system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "right";

  const padX = fontPx * 0.8;
  const padY = fontPx * 0.55;
  const metrics = ctx.measureText(WATERMARK_TEXT);
  const textW = metrics.width;
  const textH = fontPx * 1.1;

  const right = width - fontPx * 1.2;
  const cy = height - fontPx * 1.5;

  const scrimX = right - textW - padX;
  const scrimY = cy - textH / 2 - padY;
  const scrimW = textW + padX * 2;
  const scrimH = textH + padY * 2;
  const radius = fontPx * 0.4;

  ctx.fillStyle = "rgba(253, 251, 247, 0.72)";
  ctx.beginPath();
  ctx.moveTo(scrimX + radius, scrimY);
  ctx.lineTo(scrimX + scrimW - radius, scrimY);
  ctx.quadraticCurveTo(scrimX + scrimW, scrimY, scrimX + scrimW, scrimY + radius);
  ctx.lineTo(scrimX + scrimW, scrimY + scrimH - radius);
  ctx.quadraticCurveTo(
    scrimX + scrimW,
    scrimY + scrimH,
    scrimX + scrimW - radius,
    scrimY + scrimH,
  );
  ctx.lineTo(scrimX + radius, scrimY + scrimH);
  ctx.quadraticCurveTo(scrimX, scrimY + scrimH, scrimX, scrimY + scrimH - radius);
  ctx.lineTo(scrimX, scrimY + radius);
  ctx.quadraticCurveTo(scrimX, scrimY, scrimX + radius, scrimY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#1313ec";
  ctx.fillText(WATERMARK_TEXT, right, cy);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Top-level render pipeline
// ---------------------------------------------------------------------------

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  blobs: Blob[],
  opts: RenderOptions,
): void {
  const { width, height, nowMs, includeGrain, includeWatermark, flashAlpha = 0, grainPattern } = opts;

  // 1. Clear.
  ctx.clearRect(0, 0, width, height);

  // 2. Draw all blobs as solid stretched ellipses. The CSS goo filter
  //    on the canvas element will blur + alpha-threshold this output to
  //    produce the merged amorphous silhouettes.
  for (const b of blobs) {
    drawBlob(ctx, b, nowMs);
  }

  // 3. Grain overlay (live view only). Drawn ON TOP of the goo output
  //    once the CSS filter has been applied — but since the filter is
  //    applied to the entire canvas in the compositor, the grain
  //    actually gets goo'd too. That's OK for now; if it reads weird
  //    we'll move grain to a separate non-filtered DOM layer.
  if (includeGrain && grainPattern) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = grainPattern;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 4. Watermark (capture only).
  if (includeWatermark) {
    drawWatermark(ctx, width, height);
  }

  // 5. Capture flash overlay (live only, during shutter animation).
  if (flashAlpha > 0.001) {
    ctx.save();
    ctx.fillStyle = `rgba(253, 251, 247, ${Math.min(1, flashAlpha)})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
