/**
 * Fluid-mechanics physics for Chroma Capture.
 *
 * All math derives from first principles, not vibes. References:
 *
 *   Buoyant drift in viscous fluid:
 *     Newton II:  m·dv/dt = F_b − F_drag
 *     F_b   = (ρ_fluid − ρ_blob)·V·g       (constant upward)
 *     F_d   = −k·v                          (Stokes drag, low Reynolds)
 *     →  dv/dt = a₀ − v/τ,   τ = m/k,   v_terminal = a₀·τ
 *     Discrete-time exact solution (frame-rate independent):
 *       v ← v_terminal + (v − v_terminal)·exp(−dt/τ)
 *       v ← v + (v_terminal − v)·(1 − exp(−dt/τ))   (algebraically identical)
 *
 *   Horizontal Brownian motion with mean reversion:
 *     Ornstein–Uhlenbeck process:
 *       dv_x = (−v_x/τ_x)·dt + σ·dW         W = Wiener process
 *     Discretized:
 *       v_x ← v_x·exp(−dt/τ_x) + σ·√((1−exp(−2·dt/τ_x))/2)·N(0,1)
 *
 *   Cursor / blob velocity field (low Reynolds, Stokes-flow inspired):
 *     Green's function of 2D diffusion equation is a 2D Gaussian:
 *       G(r) = (1/(2πσ²))·exp(−r²/(2σ²))
 *     We use the un-normalized kernel exp(−r²/(2σ²)) as a falloff weight.
 *     Linear falloff has a discontinuity at the influence-radius edge;
 *     inverse-square has a singularity at r=0; Gaussian is smooth
 *     everywhere and is the correct fluid-mechanics answer.
 *
 *   Pop animation (ink-in-water dispersion):
 *     Diffusion equation in 2D radial coords gives Gaussian widening:
 *       σ(t) = √(σ₀² + 2·D·t)
 *     Simplified for our 350ms animation:
 *       r(t) = r₀·(1 + α·√t)
 *       α(t) = (1 − t)²      (quadratic falloff so it doesn't linger)
 *
 *   Spawn (critical-nucleus growth):
 *     dr/dt ∝ (r_target − r)
 *     Discretized:
 *       r ← r + (r_target − r)·(1 − exp(−dt/τ_grow))
 */

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface Vec2 {
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------

export function dist(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Squared distance — avoids the sqrt when only comparing. */
export function distSq(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/**
 * 2D Gaussian falloff. Returns 1 at r=0, smoothly approaches 0 as r→∞.
 * σ controls how quickly the influence decays — larger σ = broader reach.
 */
export function gaussianFalloff(r: number, sigma: number): number {
  const x = r / sigma;
  return Math.exp(-(x * x) / 2);
}

/**
 * Squared-distance variant for hot loops — saves the sqrt.
 *   gaussianFalloff(r, σ) === gaussianFalloffSq(r², σ)
 */
export function gaussianFalloffSq(rSq: number, sigma: number): number {
  return Math.exp(-rSq / (2 * sigma * sigma));
}

/** Standard normal sample via Box–Muller (one sample per call). */
export function gaussianRandom(): number {
  // u1 in (0, 1] avoids log(0).
  let u1 = 0;
  while (u1 === 0) u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// ---------------------------------------------------------------------------
// Buoyant drift (exponential approach to terminal velocity)
// ---------------------------------------------------------------------------

/**
 * Apply buoyant-drift physics to a velocity component. Frame-rate
 * independent thanks to exact discretization.
 *
 * @param v            Current velocity component (e.g. v.y)
 * @param vTerminal    Target steady-state velocity
 * @param tau          Time constant (seconds)
 * @param dt           Frame time (seconds)
 */
export function stepBuoyantDrift(
  v: number,
  vTerminal: number,
  tau: number,
  dt: number,
): number {
  const decay = Math.exp(-dt / tau);
  return vTerminal + (v - vTerminal) * decay;
}

// ---------------------------------------------------------------------------
// Ornstein–Uhlenbeck process (horizontal Brownian sway)
// ---------------------------------------------------------------------------

/**
 * One Euler step of the OU process.
 *   dv = −(v/τ)·dt + σ·dW
 * Discretized with exact decay and approximate variance scaling.
 *
 * @param v      Current velocity
 * @param tau    Time constant (mean-reversion timescale)
 * @param sigma  Noise amplitude (units of velocity / √second)
 * @param dt     Frame time
 */
export function stepOrnsteinUhlenbeck(
  v: number,
  tau: number,
  sigma: number,
  dt: number,
): number {
  const decay = Math.exp(-dt / tau);
  // Variance of the noise term over interval dt for an OU process:
  //   var = (σ²·τ/2)·(1 − exp(−2·dt/τ))
  const noiseStd = sigma * Math.sqrt((tau / 2) * (1 - Math.exp(-(2 * dt) / tau)));
  return v * decay + noiseStd * gaussianRandom();
}

// ---------------------------------------------------------------------------
// Gaussian impulse field (cursor or blob velocity perturbing neighbors)
// ---------------------------------------------------------------------------

/**
 * Apply a Gaussian-attenuated velocity impulse from a source position to
 * a target position.
 *
 *   Δv_target = v_source · k · exp(−r²/(2σ²))
 *
 * Returns the impulse vector to add to the target's velocity. If r > 3σ,
 * the influence is negligible and zero is returned (early-out for hot
 * loops at the cost of an extra branch — net win at N=12 blobs).
 */
export function gaussianImpulse(
  sourcePos: Vec2,
  sourceVel: Vec2,
  targetPos: Vec2,
  scale: number,
  sigma: number,
): Vec2 {
  const rSq = distSq(sourcePos, targetPos);
  const cutoffSq = 9 * sigma * sigma;
  if (rSq > cutoffSq) return { x: 0, y: 0 };
  const w = gaussianFalloffSq(rSq, sigma) * scale;
  return { x: sourceVel.x * w, y: sourceVel.y * w };
}

// ---------------------------------------------------------------------------
// Nucleation growth (spawn animation)
// ---------------------------------------------------------------------------

/**
 * Approach a target radius exponentially. Same math shape as buoyant
 * drift, applied to a scalar. τ_grow ≈ 0.5s makes new blobs visible
 * after ~1s and fully grown after ~2s.
 */
export function stepNucleation(
  currentRadius: number,
  targetRadius: number,
  tauGrow: number,
  dt: number,
): number {
  return targetRadius + (currentRadius - targetRadius) * Math.exp(-dt / tauGrow);
}

// ---------------------------------------------------------------------------
// Dispersion (pop animation)
// ---------------------------------------------------------------------------

export interface DispersionState {
  /** Multiplier on the blob's pre-pop radius. Grows >1 as it disperses. */
  radiusMult: number;
  /** Multiplier on alpha. 1 at pop start, 0 at completion. */
  alphaMult: number;
  /** True once the animation has completed and the blob can be removed. */
  done: boolean;
}

/**
 * Compute dispersion state at a given elapsed time since pop.
 * Models ink-in-water spreading with conservation of total alpha-area.
 *
 * @param elapsedMs   ms since the pop was triggered
 * @param durationMs  total dispersion duration (default 350ms)
 */
export function dispersion(elapsedMs: number, durationMs = 350): DispersionState {
  const t = Math.min(1, Math.max(0, elapsedMs / durationMs));
  return {
    radiusMult: 1 + 0.6 * Math.sqrt(t),
    alphaMult: (1 - t) * (1 - t),
    done: t >= 1,
  };
}

// ---------------------------------------------------------------------------
// Misc constants used across physics + render
// ---------------------------------------------------------------------------

/**
 * Default tuning constants. These are calibrated for an ~1100×825 canvas;
 * they should be passed through the render loop so they can be tweaked
 * during the tuning pass without rebuilding helpers.
 *
 * Re-tuned in v3: real lava lamps are vertical glass tubes — vertical
 * buoyancy dominates, horizontal sway is subtle. The v1/v2 sigmaDriftX
 * was too large and let blobs drift sideways off-screen faster than they
 * rose. The ratio (vertical terminal) / (horizontal RMS) should be
 * roughly 1.5–2 in favor of vertical.
 */
export const PHYSICS_DEFAULTS = {
  /** Upward terminal velocity (px/s, negative = up in screen coords).
   *  Real lava lamps are hypnotically slow — high-viscosity wax in
   *  high-viscosity fluid. 10 px/s in an ~825px canvas crosses in
   *  ~80 s, which feels right. */
  vTerminal: -10,
  /** Vertical drag time constant (s). Larger = velocity changes slowly,
   *  cursor nudges decay more slowly back to terminal. */
  tauDriftY: 2.5,
  /** Horizontal OU mean-reversion timescale (s). Large value = slow,
   *  drifting horizontal sway, not jitter. */
  tauDriftX: 14.0,
  /** Horizontal OU noise amplitude (px/s/√s). With τ=14s the steady-
   *  state RMS velocity is σ·√(τ/2) = 2·√7 ≈ 5 px/s — quiet sway
   *  beneath the dominant vertical motion. */
  sigmaDriftX: 2,
  /** Cursor impulse strength (unitless multiplier on cursor velocity).
   *  v3 had this at 0.45 — a 500 px/s cursor swipe imparted 225 px/s to
   *  any blob within reach, blowing past terminal by 20×. 0.10 means
   *  the same swipe maxes a blob at 50 px/s, which is contained by the
   *  velocity cap below. */
  cursorImpulseScale: 0.1,
  /** Cursor influence radius (px) — Gaussian σ. */
  cursorSigma: 200,
  /** Blob-blob entrainment strength. Much smaller than cursor: the
   *  chain reaction is meant to be a whisper, not a wave. */
  blobEntrainScale: 0.015,
  /** Blob-blob entrainment σ (px). */
  blobSigma: 130,
  /** Velocity-damping time constant for cursor-induced impulse (s). */
  tauImpulseDecay: 1.5,
  /** Nucleation time constant (s). */
  tauGrow: 0.5,
  /** Pop dispersion duration (ms). */
  popDurationMs: 350,
  /** Hard cap on blob velocity magnitude (px/s). Applied AFTER all
   *  impulses are summed. Anything above this is rescaled to this
   *  magnitude, preserving direction. Real lava blobs don't ballistic
   *  fire across the lamp no matter what shakes the room. */
  maxSpeed: 40,
} as const;

// ---------------------------------------------------------------------------
// Velocity cap
// ---------------------------------------------------------------------------

/**
 * Clamp velocity magnitude to `maxSpeed`. Preserves direction. Returns
 * the (possibly rescaled) velocity. Vector is rewritten in place if
 * mutated, otherwise the same reference is returned.
 */
export function capSpeed(
  vel: Vec2,
  maxSpeed: number = PHYSICS_DEFAULTS.maxSpeed,
): Vec2 {
  const speed = Math.hypot(vel.x, vel.y);
  if (speed <= maxSpeed || speed === 0) return vel;
  const k = maxSpeed / speed;
  vel.x *= k;
  vel.y *= k;
  return vel;
}
