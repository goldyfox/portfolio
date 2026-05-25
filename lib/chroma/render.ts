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
import { type Chord, oklchToRgba, paletteColorForHue } from "./color";

/**
 * Radius multiplier applied at draw time. The soft alpha gradient
 * shrinks the visible silhouette under the goo filter's threshold
 * (visible boundary lands where blurred alpha ≈ 0.39).
 *
 * v4.3 bumped this 1.32 → 1.36 because ALPHA_STOPS dropped the flat
 * opaque core (peak alpha is now 0.95 at center instead of 1.0).
 * Softer center → blurred alpha crosses threshold at a slightly
 * smaller relative radius (~0.74R vs ~0.76R). Math: visible silhouette
 * at physics boundary requires `0.74 × overscan = 1.0` → overscan ≈ 1.36.
 */
const RENDER_OVERSCAN = 1.36;

/**
 * Soft alpha gradient stops for each blob (radial, normalized 0–1).
 *
 * v4.3 — no flat opaque core. Previous stops kept alpha ≥ 0.92 across
 * the inner 18% of the radius, which read as a visible "core circle"
 * of uniform color inside each blob's silhouette. The current stops
 * are a smooth radial falloff with no plateau, so the center is the
 * most-saturated point but isn't a region of uniform alpha. At blob
 * overlap, every pair of pixels contributes via canvas alpha-
 * compositing — producing the single-gradient-across-shape look seen
 * in the reference imagery rather than two distinct cores meeting at
 * a thin blend band.
 *
 * Saturated extremes are preserved by `feComposite atop`: where
 * source-alpha is highest (0.95 at center), the source color paints
 * crisply through the atop step.
 */
const ALPHA_STOPS: ReadonlyArray<[number, number]> = [
  [0.00, 0.95],
  [0.35, 0.75],
  [0.70, 0.45],
  [1.00, 0.00],
];

/**
 * Grain opacity when reactivated (currently dormant — see v4.1 in the
 * session log). Kept as a constant so toggling `includeGrain: true` in
 * the canvas component restores the previous behavior in one place.
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
  // v4.2: per-hue L/C lookup so deep-tier hues (purple 310, navy 255)
  // render at their darker L/C without an external lightness switch.
  const color = paletteColorForHue(hue);

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

  ctx.fillStyle = "#000000";
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
