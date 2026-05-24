/**
 * Color science for Chroma Capture.
 *
 * Uses OKLab / OKLCH (Björn Ottosson, 2020) as the perceptual color space
 * because HSL is perceptually non-uniform: equal hue distances and equal
 * lightness values don't look equally spaced in HSL. OKLab is the modern
 * standard used by CSS Color Module 4 and Tailwind v4.
 *
 * Math source: https://bottosson.github.io/posts/oklab/
 *
 * Pipeline for one color:
 *   OKLCH(L, C, h°) → OKLab(L, a, b) → linear sRGB → sRGB → hex/rgba
 *
 * Gamut handling: sRGB is a small slice of OKLab. Highly saturated chromas
 * at certain hues fall outside sRGB. We clip linear sRGB values to [0, 1]
 * before gamma-encoding. This is simpler than chroma-reduction gamut
 * mapping and visually acceptable for our vibrant palette.
 */

export interface OklabColor {
  L: number;
  a: number;
  b: number;
}

export interface OklchColor {
  L: number;
  C: number;
  /** Hue in degrees, 0–360. */
  h: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------
// OKLCH ↔ OKLab (cylindrical ↔ cartesian)
// ---------------------------------------------------------------------------

export function oklchToOklab({ L, C, h }: OklchColor): OklabColor {
  const hr = (h * Math.PI) / 180;
  return {
    L,
    a: C * Math.cos(hr),
    b: C * Math.sin(hr),
  };
}

// ---------------------------------------------------------------------------
// OKLab → linear sRGB
// Reference: https://bottosson.github.io/posts/oklab/#converting-from-oklab-to-linear-srgb
// ---------------------------------------------------------------------------

function oklabToLinearSrgb({ L, a, b }: OklabColor): RgbColor {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

// ---------------------------------------------------------------------------
// Linear sRGB → sRGB (gamma encoding) → hex / 8-bit RGB
// ---------------------------------------------------------------------------

function linearToGamma(x: number): number {
  if (x <= 0.0031308) return 12.92 * x;
  return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
}

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function toByte(x: number): number {
  return Math.round(clamp01(x) * 255);
}

/**
 * Convert an OKLCH color to an sRGB hex string `#rrggbb`.
 * Out-of-gamut colors are clipped per channel (acceptable for vibrant
 * palettes; chroma-reduction mapping would be more accurate but slower).
 */
export function oklchToHex(color: OklchColor): string {
  const lab = oklchToOklab(color);
  const linear = oklabToLinearSrgb(lab);
  const r = toByte(linearToGamma(linear.r));
  const g = toByte(linearToGamma(linear.g));
  const b = toByte(linearToGamma(linear.b));
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Convert an OKLCH color to an `rgba(r, g, b, a)` string for canvas
 * gradient stops. Alpha pass-through; channels in 0–255 integer space.
 */
export function oklchToRgba(color: OklchColor, alpha: number): string {
  const lab = oklchToOklab(color);
  const linear = oklabToLinearSrgb(lab);
  const r = toByte(linearToGamma(linear.r));
  const g = toByte(linearToGamma(linear.g));
  const b = toByte(linearToGamma(linear.b));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------------------------------------------------------------------------
// Triadic chord generation
//
// A triadic chord in OKLCH is three hues 120° apart at the same chroma /
// lightness. In OKLCH (perceptually uniform), the three colors look
// equally weighted — unlike HSL triads, where one color often dominates.
// ---------------------------------------------------------------------------

export interface Chord {
  /** Three hues in degrees, 120° apart. */
  hues: [number, number, number];
  /** Common chroma (saturation in OKLab terms). */
  C: number;
  /** Common lightness. */
  L: number;
}

/**
 * Generate a triadic chord from a seed hue. Chroma 0.20 and lightness
 * 0.68 land in a safely-in-gamut zone across most hues while reading
 * as vibrant (saturation ~80% perceptually).
 */
export function triadicChord(seedHue: number, C = 0.2, L = 0.68): Chord {
  const norm = ((seedHue % 360) + 360) % 360;
  return {
    hues: [norm, (norm + 120) % 360, (norm + 240) % 360],
    C,
    L,
  };
}

/**
 * Sample a color from the chord by index (0..hues.length) with optional
 * lightness/chroma jitter. Used to give each blob's gradient stops some
 * within-chord variation while keeping the overall chord coherent.
 */
export function sampleChord(
  chord: Chord,
  stopIndex: number,
  jitter: { L?: number; C?: number; h?: number } = {},
): OklchColor {
  const baseHue = chord.hues[stopIndex % chord.hues.length];
  return {
    L: chord.L + (jitter.L ?? 0),
    C: chord.C + (jitter.C ?? 0),
    h: (baseHue + (jitter.h ?? 0) + 360) % 360,
  };
}

// ---------------------------------------------------------------------------
// Chord rotation (slow hue drift around the wheel over time)
// ---------------------------------------------------------------------------

/**
 * Advance the seed hue by `degreesPerSecond * dt`. Wraps in [0, 360).
 * Default rate ≈ 6°/s = one full wheel rotation per minute.
 */
export function rotateHue(currentHue: number, degreesPerSecond: number, dt: number): number {
  return (((currentHue + degreesPerSecond * dt) % 360) + 360) % 360;
}

// ---------------------------------------------------------------------------
// Utility re-exports
// ---------------------------------------------------------------------------

export { TAU };
