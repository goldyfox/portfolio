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

// ---------------------------------------------------------------------------
// Safari live-render pipeline (goo baked in JS, no CSS filter)
// ---------------------------------------------------------------------------

/**
 * Constants for the live JS bake pipeline. Mirror the SVG filter +
 * `captureToPng` constants exactly so Safari output matches Chrome's
 * CSS-filter output frame-for-frame (modulo DPR differences).
 */
const BAKED_GOO_SILHOUETTE_BLUR_PX = 10;
const BAKED_GOO_COLOR_BLUR_PX = 25;
const BAKED_GOO_ALPHA_MULT = 30;
const BAKED_GOO_ALPHA_OFFSET_255 = 11.7 * 255;
const BAKED_ALPHA_BOOST = 1.15;

export interface RenderBakedStages {
  /** Solid-blob render target. Its context must be pre-scaled by DPR. */
  stage1: HTMLCanvasElement;
  /** Silhouette canvas (blur σ=10 + alpha threshold). Identity transform. */
  stage2: HTMLCanvasElement;
  /** Soft color canvas (blur σ=25 of stage1). Identity transform. */
  stage3: HTMLCanvasElement;
}

export interface RenderBakedOptions {
  width: number;
  height: number;
  nowMs: number;
  /** Device pixel ratio used for stage backing stores. Blur radii scale with this. */
  dpr: number;
  flashAlpha?: number;
}

/**
 * Live render path used on Safari where the live CSS `filter: url(#chroma-goo)`
 * compositor is CPU-bound and can't hold 60 fps. This function bakes the
 * exact same filter chain in JS using canvas-native blur + pixel passes,
 * which Safari's canvas pipeline DOES GPU-accelerate (the slow part on
 * Safari is the compound SVG-filter graph, not the individual primitives).
 *
 * Pipeline mirrors `captureToPng` in `capture.ts`:
 *
 *   1. Render solid blobs to `stage1` (DPR-scaled context).
 *   2. Blur `stage1` σ=10 → `stage2`; pixel-pass threshold its alpha
 *      so it becomes a crisp silhouette mask.
 *   3. Blur `stage1` σ=25 → `stage3` (soft color cloud).
 *   4. On the VISIBLE canvas (identity transform): clear, draw `stage3`,
 *      `destination-in` `stage2` to mask the soft color to the silhouette,
 *      pixel-pass alpha boost ×1.15, then re-apply the DPR transform and
 *      paint the capture flash if active.
 *
 * Why this works on Safari when the CSS path doesn't: Safari's canvas
 * blur is fast (single GPU op). The SVG filter chain stutters because it
 * stages multiple filter primitives through render-target swaps that
 * Safari's filter compositor doesn't pipeline efficiently. Splitting the
 * chain into discrete canvas operations gives Safari one fast op at a
 * time instead of one slow graph.
 *
 * Chrome users never hit this path — they keep the CSS filter, which
 * Chrome's compositor GPU-accelerates natively.
 */
export function renderFrameBaked(
  visibleCtx: CanvasRenderingContext2D,
  stages: RenderBakedStages,
  blobs: Blob[],
  opts: RenderBakedOptions,
): void {
  const { width, height, nowMs, dpr, flashAlpha = 0 } = opts;
  const { stage1, stage2, stage3 } = stages;

  // -- Stage 1: solid blobs to stage1 (CSS-pixel coords, pre-scaled ctx)
  const c1 = stage1.getContext("2d");
  if (!c1) return;
  c1.clearRect(0, 0, width, height);
  for (const b of blobs) {
    drawBlob(c1, b, nowMs);
  }

  // -- Stage 2: silhouette pipeline — blur σ=10 + alpha threshold
  // stage2's context is identity; blur radius is in backing-store px,
  // so we scale by DPR (matches `captureToPng`).
  const c2 = stage2.getContext("2d");
  if (!c2) return;
  c2.clearRect(0, 0, stage2.width, stage2.height);
  c2.filter = `blur(${BAKED_GOO_SILHOUETTE_BLUR_PX * dpr}px)`;
  c2.drawImage(stage1, 0, 0);
  c2.filter = "none";
  const img2 = c2.getImageData(0, 0, stage2.width, stage2.height);
  const data2 = img2.data;
  for (let i = 3; i < data2.length; i += 4) {
    const a = data2[i];
    const t = a * BAKED_GOO_ALPHA_MULT - BAKED_GOO_ALPHA_OFFSET_255;
    data2[i] = t < 0 ? 0 : t > 255 ? 255 : t;
  }
  c2.putImageData(img2, 0, 0);

  // -- Stage 3: soft color pipeline — blur σ=25 of stage1
  const c3 = stage3.getContext("2d");
  if (!c3) return;
  c3.clearRect(0, 0, stage3.width, stage3.height);
  c3.filter = `blur(${BAKED_GOO_COLOR_BLUR_PX * dpr}px)`;
  c3.drawImage(stage1, 0, 0);
  c3.filter = "none";

  // -- Compose onto visible canvas. Save current DPR transform first.
  visibleCtx.save();
  visibleCtx.setTransform(1, 0, 0, 1, 0, 0);
  visibleCtx.clearRect(0, 0, stage3.width, stage3.height);
  visibleCtx.drawImage(stage3, 0, 0);
  visibleCtx.globalCompositeOperation = "destination-in";
  visibleCtx.drawImage(stage2, 0, 0);
  visibleCtx.globalCompositeOperation = "source-over";

  // -- Alpha boost (pixel pass over visible canvas backing store)
  const outImg = visibleCtx.getImageData(0, 0, stage3.width, stage3.height);
  const outData = outImg.data;
  for (let i = 3; i < outData.length; i += 4) {
    const boosted = outData[i] * BAKED_ALPHA_BOOST;
    outData[i] = boosted > 255 ? 255 : boosted;
  }
  visibleCtx.putImageData(outImg, 0, 0);
  visibleCtx.restore();

  // -- Capture flash overlay (live only). visibleCtx is back to its
  //    DPR-scaled transform here thanks to restore(), so we work in
  //    CSS pixels for parity with the non-baked path.
  if (flashAlpha > 0.001) {
    visibleCtx.save();
    visibleCtx.fillStyle = `rgba(253, 251, 247, ${Math.min(1, flashAlpha)})`;
    visibleCtx.fillRect(0, 0, width, height);
    visibleCtx.restore();
  }
}
