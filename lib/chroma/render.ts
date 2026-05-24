/**
 * Canvas rendering pipeline for Chroma Capture (v4 — palette + soft gradients).
 *
 * The goo / metaball effect is applied as a CSS `filter: url(#chroma-goo)`
 * on the canvas element by the wrapping React component — NOT via the
 * canvas 2D API. The filter chain is: blur(σ=10) → alpha threshold
 * (matrix 18 -7) → feComposite atop SourceGraphic. The first two steps
 * define the merged amorphous silhouette (motion read); the atop step
 * re-introduces source colors clipped strictly to that silhouette.
 *
 * v4 colors:
 *   • Each blob picks one hue from `CHROMA_PALETTE_HUES` (analogous-warm
 *     6-hue palette at OKLCH L=0.66 C=0.22).
 *   • Rendered as a radial alpha gradient (opaque core → transparent edge)
 *     at 1.25× v3.2 radius. The 1.25× compensates for the soft alpha
 *     shrinking the threshold-defined silhouette; net visible silhouette
 *     lands at the same place as v3.2's hard ellipse.
 *   • Where two blobs overlap, canvas alpha compositing blends their
 *     source colors. `feComposite atop` shows those blended colors inside
 *     the unchanged goo silhouette — that is the gradient-merge effect.
 *
 * Grain: 14% via `globalCompositeOperation = "source-atop"` — grain colors
 * blend toward blob pixels only; cream-frame transparent area stays clean.
 * source-atop leaves destination alpha untouched, so silhouette boundary
 * is unaffected.
 *
 * NO `ctx.filter` calls. NO half-res offscreen. The CSS filter on the
 * canvas element handles the goo + atop composition.
 */

import { type Blob, popDisplay } from "./blob";
import {
  CHROMA_PALETTE_C,
  CHROMA_PALETTE_L,
  type Chord,
  oklchToRgba,
} from "./color";

/**
 * Radius multiplier applied at draw time. The soft alpha gradient
 * shrinks the visible silhouette under the goo filter's threshold
 * (visible boundary lands where blurred-alpha = ~0.39). 1.25× pushes
 * the rendered edge out so the threshold cut lands at the same place
 * as v3.2's hard ellipse. Calibrated by inspection; preserves motion
 * read exactly.
 */
const RENDER_OVERSCAN = 1.25;

/**
 * Soft alpha gradient stops for each blob (radial, normalized 0–1).
 * Opaque core fading to transparent edge. The threshold in the SVG
 * filter cuts roughly at 0.39 blurred alpha → with these stops the
 * visible silhouette ends near r=0.8 of the rendered radius.
 *
 * Why these specific stops: dense opaque core (0–40%) is what reads as
 * "stronger opacity in the middle"; the 40–90% taper is what produces
 * the soft inner gradient when blobs overlap (canvas alpha compositing
 * mixes the two source colors smoothly across the partial-alpha edges).
 */
const ALPHA_STOPS: ReadonlyArray<[number, number]> = [
  [0.00, 1.00],
  [0.40, 0.85],
  [0.70, 0.55],
  [0.90, 0.25],
  [1.00, 0.00],
];

/**
 * Grain opacity inside blob pixels. Applied with `source-atop` so the
 * cream frame outside the goo silhouette stays clean. 14% is loud
 * enough to read as analog film texture without overwhelming the
 * palette colors.
 */
const GRAIN_ALPHA = 0.14;

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
 * Draw a single blob as a soft-alpha radial gradient at the blob's
 * primary palette hue. The CSS goo filter on the canvas element
 * provides the merged silhouette + atop composition; this function
 * emits the source colors and soft alpha that the filter operates on.
 *
 * Geometry: the ellipse stretch is encoded as a non-uniform `ctx.scale`,
 * which lets a circular radial gradient become an elliptical one when
 * drawn through the scaled transform. (Canvas 2D's radial gradient
 * doesn't support elliptical natively.)
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

  const renderR = radius * RENDER_OVERSCAN;
  const stretch = Math.max(0.1, blob.stretch);
  const hue = blob.hues[0] ?? 0;
  const color = { L: CHROMA_PALETTE_L, C: CHROMA_PALETTE_C, h: hue };

  ctx.save();
  ctx.translate(blob.pos.x, blob.pos.y);
  ctx.rotate(blob.stretchAngle);
  ctx.scale(stretch, 1 / stretch);
  ctx.globalAlpha = alphaMult;

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, renderR);
  for (const [stop, alpha] of ALPHA_STOPS) {
    grad.addColorStop(stop, oklchToRgba(color, alpha));
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, renderR, 0, Math.PI * 2);
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

  // 3. Grain overlay. `source-atop` constrains grain to opaque blob
  //    pixels only — the cream frame stays clean. Alpha unchanged,
  //    so silhouette boundary (set by goo threshold) is untouched.
  //    The CSS filter still processes everything, but at 14% the
  //    blur smearing is part of the desired analog texture.
  if (includeGrain && grainPattern) {
    ctx.save();
    ctx.globalAlpha = GRAIN_ALPHA;
    ctx.globalCompositeOperation = "source-atop";
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
