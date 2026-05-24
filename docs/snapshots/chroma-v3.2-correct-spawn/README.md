# Chroma Capture — v3.2 snapshot (correct spawn behavior)

**Captured:** 2026-05-24, 15:17 PT
**Reason:** Spawn behavior was approved by Lisa as the canonical lava-lamp loading + steady-state distribution pattern. This snapshot preserves the working state before any color / aesthetic changes are reintroduced, in case a future iteration breaks the motion read and we need to roll back.

## What this represents

- **Mono ethos-blue blobs** — solid stretched ellipses in `#1313ec`. Color work is paused at this point.
- **Strict bottom-only spawn** — every blob enters from below the bottom edge via `randomEdgeSpawn`. No mid-screen materialization, no lateral entry.
- **CPU-only pre-roll on mount** — 90 s of virtual time is simulated synchronously before the first paint (~10–30 ms real CPU). First paint shows a field that has been "running" for a full traversal-plus.
- **Cadence calibrated to physics** — `STEADY_CADENCE_BASE_MS = 3500`, `STEADY_CADENCE_JITTER_MS = 1000` (3.5–4.5 s per spawn). Derived from `canvas_height / |vTerminal| / target_count` (720 ÷ 10 ÷ 18 ≈ 4 s).
- **18 blobs desktop / 10 mobile**, target population maintained by the gated tick loop.
- **Goo filter** is the classic n3r4zzurr0 preset — `stdDeviation=10`, alpha row `0 0 0 18 -7`, no `feBlend`. Applied as CSS `filter: url(#chroma-goo)` on the canvas element.
- **Physics**: v3.1 tuning — `vTerminal=-10`, `tauDriftY=2.5`, `tauDriftX=14`, `sigmaDriftX=2`, hard `constrainLateral`, `maxSpeed=40`, bottom-only `randomEdgeSpawn`.

See `docs/DECISIONS.md` sections "Spawn (v3.2 — pre-roll + cadence calibrated to rise speed)" and "Rendering (v3 — CSS-filter goo, canonical pattern, mono first)" for the full rationale.

## What this is NOT

- Not multi-color. v4 color work hasn't started — `triadicChord` is still 120° spacing, blobs are mono.
- Not a fully styled v4 — grain, palette, internal opacity gradient are all still pending.
- Not a git tag — this is a file-system snapshot because the project isn't under git (yet).

## How to restore

If a future change breaks the spawn / motion read and we need to roll back to this exact state, copy these files back to their original paths:

```bash
# From the project root:
cp docs/snapshots/chroma-v3.2-correct-spawn/lib/chroma/*.ts lib/chroma/
cp docs/snapshots/chroma-v3.2-correct-spawn/components/lab/*.tsx components/lab/
```

Then run `npx tsc --noEmit` to confirm the restore type-checks. If you've touched any files outside the Chroma scope (e.g. `app/lab/page.tsx`, `app/globals.css`, lab layout), the snapshot won't address those — restore them separately if needed.

## Files preserved

```
lib/chroma/audio.ts
lib/chroma/blob.ts
lib/chroma/capture.ts
lib/chroma/color.ts
lib/chroma/color-names.ts
lib/chroma/physics.ts
lib/chroma/render.ts
components/lab/chroma-capture-canvas.tsx
components/lab/chroma-capture-section.tsx
```
