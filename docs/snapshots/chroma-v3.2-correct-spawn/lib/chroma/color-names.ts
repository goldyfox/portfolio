/**
 * Vibrant color-name dictionary for Chroma Capture filenames.
 *
 * Maps an OKLCH hue (degrees, 0–360) to a short evocative name. Used
 * exclusively for generating capture filenames like
 *   chroma-capture-coral-aqua-violet.png
 *
 * Names are chosen to be:
 *   - Evocative (not "red-1", "blue-2"); each name suggests a feeling
 *   - Lowercase one-word (filename-safe, hyphens are the only separator)
 *   - Vibrant only — no "grey", "tan", "beige", "khaki"; the generator
 *     clamps chroma high enough that no muddy name should ever appear
 *
 * Names are ordered by hue angle. The lookup returns the nearest name
 * to the queried hue (cyclic distance on the wheel).
 */

interface NamedHue {
  hue: number;
  name: string;
}

const PALETTE: NamedHue[] = [
  { hue: 0, name: "cherry" },
  { hue: 15, name: "coral" },
  { hue: 30, name: "marigold" },
  { hue: 45, name: "amber" },
  { hue: 60, name: "lemon" },
  { hue: 75, name: "chartreuse" },
  { hue: 95, name: "lime" },
  { hue: 120, name: "emerald" },
  { hue: 145, name: "jade" },
  { hue: 170, name: "teal" },
  { hue: 190, name: "aqua" },
  { hue: 210, name: "cerulean" },
  { hue: 225, name: "azure" },
  { hue: 240, name: "cobalt" },
  { hue: 260, name: "indigo" },
  { hue: 275, name: "violet" },
  { hue: 290, name: "orchid" },
  { hue: 305, name: "magenta" },
  { hue: 320, name: "fuchsia" },
  { hue: 335, name: "rose" },
  { hue: 350, name: "cerise" },
];

/**
 * Cyclic hue distance on the 0–360 wheel.
 * dist(355°, 5°) = 10, not 350.
 */
function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function hueToName(hue: number): string {
  const normalized = ((hue % 360) + 360) % 360;
  let best = PALETTE[0];
  let bestDist = hueDistance(normalized, best.hue);
  for (const entry of PALETTE) {
    const d = hueDistance(normalized, entry.hue);
    if (d < bestDist) {
      best = entry;
      bestDist = d;
    }
  }
  return best.name;
}

/**
 * Build a filename slug from a list of hues. Duplicates collapse
 * (a chord may have two hues that round to the same name), so
 * naming is concise.
 *
 *   hues=[15, 190, 275] → "coral-aqua-violet"
 *   hues=[15, 20]       → "coral"
 */
export function hueChordSlug(hues: number[]): string {
  const names = hues.map(hueToName);
  const unique: string[] = [];
  for (const n of names) if (!unique.includes(n)) unique.push(n);
  return unique.join("-");
}
