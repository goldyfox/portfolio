/**
 * Blob data shape and lifecycle for Chroma Capture.
 *
 * A blob is a soft-edged gradient mass with 2–3 internal hues. Visually
 * it's rendered as a stack of offset radial gradients, which gives both
 * the multi-color internal blending (like the kuro.store references)
 * and the soft alpha-falloff edges (no canvas blur filter required).
 *
 * Lifecycle states:
 *   - spawning → nucleating from radius 0 toward targetRadius
 *   - alive    → drifting + responsive to impulses
 *   - popping  → dispersing (radius grows, alpha decays)
 *
 * State transitions happen via `markPopping(blob, t)`. Drift physics
 * are advanced in `physics.ts` and consumed in `render.ts`.
 */

import {
  PHYSICS_DEFAULTS,
  type Vec2,
  capSpeed,
  dispersion,
  gaussianImpulse,
  gaussianRandom,
  stepBuoyantDrift,
  stepNucleation,
  stepOrnsteinUhlenbeck,
} from "./physics";

export type { Vec2 };

export type BlobState = "spawning" | "alive" | "popping";

export interface Blob {
  id: number;
  pos: Vec2;
  vel: Vec2;
  /** Target visible radius (px). */
  targetRadius: number;
  /** Currently-rendered radius (animated through spawning / popping). */
  currentRadius: number;
  /** 2 or 3 hues (degrees) sampled from the active chord. */
  hues: number[];
  state: BlobState;
  /** ms at which the current state began (perf.now() time base). */
  stateStartMs: number;
  /** Random phase used to vary per-blob jitter and shape orientation. */
  phase: number;
  /**
   * Shape aspect ratio. 1 = circle. >1 = elongated along stretchAngle.
   * Tracks velocity magnitude (fast blobs stretch) plus a slow sin
   * oscillation around a per-blob random phase (constant morphing).
   */
  stretch: number;
  /**
   * Direction of the major axis (radians). Smoothly tracks the blob's
   * velocity direction so motion stretches the blob along its motion
   * vector, like real lava-lamp wax under fluid flow.
   */
  stretchAngle: number;
  /** Random per-blob phase for slow shape oscillation. */
  shapePhase: number;
}

export interface BlobSpawnOptions {
  id: number;
  pos: Vec2;
  vel: Vec2;
  targetRadius: number;
  hues: number[];
  nowMs: number;
}

/** Construct a new blob in the `spawning` state (currentRadius = 0). */
export function createBlob(opts: BlobSpawnOptions): Blob {
  const initialAngle = Math.atan2(opts.vel.y, opts.vel.x);
  return {
    id: opts.id,
    pos: { ...opts.pos },
    vel: { ...opts.vel },
    targetRadius: opts.targetRadius,
    currentRadius: 0,
    hues: [...opts.hues],
    state: "spawning",
    stateStartMs: opts.nowMs,
    phase: Math.random() * Math.PI * 2,
    stretch: 1,
    stretchAngle: Number.isFinite(initialAngle) ? initialAngle : Math.PI / 2,
    shapePhase: Math.random() * Math.PI * 2,
  };
}

/**
 * Generate a random off-screen spawn position with a small inward
 * velocity. Used both for the initial blob population and for
 * respawns after pops.
 */
export function randomEdgeSpawn(
  bounds: { width: number; height: number },
  targetRadius: number,
): { pos: Vec2; vel: Vec2 } {
  const margin = targetRadius * 1.2;
  // Lava lamps load from the bottom (heated wax rises). The field never
  // enters or exits laterally — so all spawns originate just below the
  // bottom edge with a small upward velocity and a barely-there
  // horizontal jitter to avoid stacking new blobs in a column.
  return {
    pos: {
      x: targetRadius + Math.random() * (bounds.width - 2 * targetRadius),
      y: bounds.height + margin,
    },
    vel: { x: (Math.random() - 0.5) * 2, y: -6 },
  };
}

/**
 * Advance one blob by `dt` seconds. Mutates `blob` in place.
 * Caller is responsible for state transitions out of `spawning`/`popping`
 * via the helpers below.
 */
export function stepBlob(blob: Blob, dt: number, nowMs: number): void {
  // ---- Drift: buoyancy + horizontal Ornstein–Uhlenbeck noise ----
  // Velocity decays toward the buoyant terminal vertical and toward
  // zero horizontal drift; OU noise re-energizes horizontal sway.
  blob.vel.y = stepBuoyantDrift(
    blob.vel.y,
    PHYSICS_DEFAULTS.vTerminal,
    PHYSICS_DEFAULTS.tauDriftY,
    dt,
  );
  blob.vel.x = stepOrnsteinUhlenbeck(
    blob.vel.x,
    PHYSICS_DEFAULTS.tauDriftX,
    PHYSICS_DEFAULTS.sigmaDriftX,
    dt,
  );

  // ---- Velocity cap ----
  // Hard ceiling on speed so no single impulse can rocket a blob.
  // Applied BEFORE position integration so the cap reflects what
  // actually moves the blob this frame.
  capSpeed(blob.vel);

  // ---- Integrate position ----
  blob.pos.x += blob.vel.x * dt;
  blob.pos.y += blob.vel.y * dt;
  // Lateral hard-clamp handled separately via `constrainLateral` so the
  // step function stays size-agnostic — see canvas component's tick loop.

  // ---- Shape deformation (lava-lamp morphing) ----
  // Real lava blobs are mostly spherical with subtle elongation. Two
  // layers combine: a slow sinusoidal breath, and gentle velocity-based
  // stretching. v3 amplitudes are deliberately small so blobs read as
  // round-ish lava, not as squashed ellipses.
  blob.shapePhase += dt * 0.5; // ~12s/cycle, slow breath
  const speed = Math.hypot(blob.vel.x, blob.vel.y);
  const velocityStretch = Math.min(0.15, speed / 120);
  const oscillation = 0.08 * Math.sin(blob.shapePhase);
  const targetStretch = 1 + velocityStretch + oscillation;
  // Smooth approach to target so changes feel fluid, not snappy.
  const stretchTau = 0.6;
  blob.stretch += (targetStretch - blob.stretch) * (1 - Math.exp(-dt / stretchTau));

  // Stretch axis tracks velocity direction (slowly — so blobs don't
  // jump when velocity briefly zeroes out from random walk).
  if (speed > 2) {
    const targetAngle = Math.atan2(blob.vel.y, blob.vel.x);
    let delta = targetAngle - blob.stretchAngle;
    // Wrap delta to [-π, π] for shortest rotation path.
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    const angleTau = 1.0;
    blob.stretchAngle += delta * (1 - Math.exp(-dt / angleTau));
  }

  // ---- Radius animation by state ----
  if (blob.state === "spawning") {
    blob.currentRadius = stepNucleation(
      blob.currentRadius,
      blob.targetRadius,
      PHYSICS_DEFAULTS.tauGrow,
      dt,
    );
    // Transition to alive once we're within 2% of target — saves an
    // asymptote-chasing loop forever.
    if (Math.abs(blob.currentRadius - blob.targetRadius) < blob.targetRadius * 0.02) {
      blob.currentRadius = blob.targetRadius;
      blob.state = "alive";
      blob.stateStartMs = nowMs;
    }
  } else if (blob.state === "alive") {
    blob.currentRadius = blob.targetRadius;
  }
  // `popping` radius is computed live in `popDisplay()` — no mutation here.
}

/**
 * Apply a Gaussian-falloff cursor impulse to a blob. The blob's velocity
 * is updated; the magnitude attenuates with distance from cursor per
 * fluid-dynamics math (see `gaussianImpulse`).
 */
export function applyCursorImpulse(
  blob: Blob,
  cursorPos: Vec2,
  cursorVel: Vec2,
  scale = PHYSICS_DEFAULTS.cursorImpulseScale,
  sigma = PHYSICS_DEFAULTS.cursorSigma,
): void {
  if (blob.state !== "alive") return;
  const imp = gaussianImpulse(cursorPos, cursorVel, blob.pos, scale, sigma);
  blob.vel.x += imp.x;
  blob.vel.y += imp.y;
}

/**
 * Apply blob-blob entrainment: each alive blob carries a local velocity
 * field that perturbs other alive blobs nearby. This is what produces
 * the chain-reaction feel from cursor nudges without needing rigid-body
 * collision. O(N²) at N=12 blobs is trivial.
 */
export function applyBlobEntrainment(
  blobs: Blob[],
  scale = PHYSICS_DEFAULTS.blobEntrainScale,
  sigma = PHYSICS_DEFAULTS.blobSigma,
): void {
  // Snapshot velocities BEFORE mutation so the field is symmetric — each
  // blob sees the others' pre-update velocities.
  const vSnap = blobs.map((b) => ({ x: b.vel.x, y: b.vel.y }));
  for (let i = 0; i < blobs.length; i++) {
    const A = blobs[i];
    if (A.state !== "alive") continue;
    for (let j = 0; j < blobs.length; j++) {
      if (i === j) continue;
      const B = blobs[j];
      if (B.state !== "alive") continue;
      const imp = gaussianImpulse(B.pos, vSnap[j], A.pos, scale, sigma);
      A.vel.x += imp.x;
      A.vel.y += imp.y;
    }
  }
}

/**
 * HARD lateral constraint. Blobs cannot pass the left or right edge of
 * the canvas — real lava lamps have rigid glass walls, not springs.
 *
 * Method: clamp `pos.x` to `[radius, width - radius]`. If clamped,
 * zero out the velocity component pushing into the wall (no leftward
 * motion when at the left wall; no rightward motion when at the right
 * wall). Inward motion is preserved so the blob can drift back into
 * the field once the OU process re-energizes velocity inward.
 *
 * Vertical motion is intentionally NOT constrained — blobs disappear
 * cleanly off the top (rising lava) and the bottom (returning lava)
 * and respawn from the offscreen edges. This is the only way a blob
 * leaves the field.
 *
 * Uses the BLOB's circumscribed circle as the wall thickness (radius,
 * not radius·stretch) since the goo filter expands the visible
 * silhouette beyond the raw ellipse anyway — a slight overlap into
 * the wall reads as the blob pressing against glass.
 */
export function constrainLateral(blob: Blob, width: number): void {
  if (blob.state === "popping") return;
  const r = blob.currentRadius;
  if (blob.pos.x < r) {
    blob.pos.x = r;
    if (blob.vel.x < 0) blob.vel.x = 0;
  } else if (blob.pos.x > width - r) {
    blob.pos.x = width - r;
    if (blob.vel.x > 0) blob.vel.x = 0;
  }
}

/** Mark a blob as popping. The render layer reads `popDisplay()` from then on. */
export function markPopping(blob: Blob, nowMs: number): void {
  if (blob.state !== "alive") return;
  blob.state = "popping";
  blob.stateStartMs = nowMs;
}

/** Hit test: returns true if `point` is inside the blob's elliptical body. */
export function hitTest(blob: Blob, point: Vec2): boolean {
  if (blob.state !== "alive") return false;
  // Transform point into the blob's local (rotated) coordinate frame.
  const dx = point.x - blob.pos.x;
  const dy = point.y - blob.pos.y;
  const cos = Math.cos(-blob.stretchAngle);
  const sin = Math.sin(-blob.stretchAngle);
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  // Hit area is slightly smaller than the visible silhouette so pops feel
  // intentional (no false positives at the gooey neck where blobs merge).
  const a = blob.currentRadius * blob.stretch * 0.8;
  const b = (blob.currentRadius / blob.stretch) * 0.8;
  return (localX * localX) / (a * a) + (localY * localY) / (b * b) <= 1;
}

/**
 * For popping blobs, return the radius + alpha multipliers to apply
 * during render. Returns null for non-popping blobs.
 * Also returns `done: true` when the pop animation has completed.
 */
export function popDisplay(blob: Blob, nowMs: number):
  | { radius: number; alpha: number; done: boolean }
  | null {
  if (blob.state !== "popping") return null;
  const d = dispersion(nowMs - blob.stateStartMs, PHYSICS_DEFAULTS.popDurationMs);
  return {
    radius: blob.targetRadius * d.radiusMult,
    alpha: d.alphaMult,
    done: d.done,
  };
}

/**
 * Check whether a blob has drifted off the TOP or BOTTOM of the visible
 * area and should be recycled. Lateral exits are impossible because
 * `constrainLateral` clamps `pos.x` every frame — so this only checks
 * the vertical axis.
 */
export function isOffscreen(
  blob: Blob,
  bounds: { width: number; height: number },
): boolean {
  const margin = blob.targetRadius * 2;
  return (
    blob.pos.y < -margin ||
    blob.pos.y > bounds.height + margin ||
    // Defensive: in case some other code mutates pos.x past the canvas
    // (it shouldn't), still treat it as gone so we don't keep stale
    // blobs forever. These checks should be unreachable in normal play.
    blob.pos.x < -margin ||
    blob.pos.x > bounds.width + margin
  );
}

/** Re-export a couple of physics helpers a render layer might want. */
export { gaussianRandom };
