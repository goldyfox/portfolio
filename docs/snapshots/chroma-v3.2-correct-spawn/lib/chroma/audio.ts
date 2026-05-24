/**
 * Web Audio for Chroma Capture.
 *
 * On pop, plays a chord whose pitches are derived from the popped blob's
 * gradient hues. Pitch follows the logarithmic equal-temperament scale
 * (semitone = 2^(1/12) ratio), snapped to the **major pentatonic** so
 * any combination of pitches sounds musically pleasant by construction.
 *
 * Envelope: percussive AR (attack + exponential release). Exponential
 * release matches the acoustic decay of real percussive instruments
 * (chimes, plucked strings, struck mallets).
 *
 * Polyphony: capped at 8 simultaneous voices. New voices steal the
 * oldest active one if at the limit, preventing buildup during rapid
 * pop-spamming.
 *
 * Lifecycle: AudioContext is lazy-initialized on the first call to
 * `playChord` (which is always inside a user-gesture handler — pop is
 * a click). This satisfies browser autoplay policies.
 *
 * Mute state is persisted in localStorage. Default is unmuted (sound on)
 * because the alternative — silent by default — means most visitors
 * never discover the synesthesia layer.
 */

const STORAGE_KEY = "chroma:muted";

// ---- Tuning constants -----------------------------------------------------

/** Base frequency for hue=0°. A3 = 220 Hz. */
const BASE_FREQ_HZ = 220;

/** Two-octave hue→pitch range. Hue 360° → 24 semitones above base. */
const HUE_SEMITONE_RANGE = 24;

/** Major pentatonic intervals from root, mod 12. */
const PENTATONIC = [0, 2, 4, 7, 9];

/** Max simultaneous voices. */
const MAX_VOICES = 8;

/** Master volume (0–1). Subtle by default. */
const MASTER_GAIN = 0.14;

/** Per-voice peak gain (multiplied by MASTER_GAIN). */
const VOICE_PEAK = 0.55;

/** Attack ramp duration (s). */
const ATTACK_S = 0.005;

/** Release duration (s). Exponential decay; sets the perceived tail length. */
const RELEASE_S = 0.42;

/** Voice cleanup time after release ends (s). */
const TAIL_S = 0.05;

// ---- Pitch math -----------------------------------------------------------

/**
 * Snap a semitone count to the nearest major pentatonic note.
 * Handles octave wrap correctly.
 */
function snapToPentatonic(semitones: number): number {
  const octave = Math.floor(semitones / 12);
  const within = semitones - octave * 12;
  let best = PENTATONIC[0];
  let bestDist = Math.abs(within - best);
  for (const interval of PENTATONIC) {
    const d = Math.abs(within - interval);
    if (d < bestDist) {
      best = interval;
      bestDist = d;
    }
  }
  return octave * 12 + best;
}

/**
 * Map a hue (degrees) to a frequency (Hz), snapped to major pentatonic.
 * 0° → A3 (~220 Hz), 360° → A5 (~880 Hz).
 */
export function hueToFrequency(hue: number): number {
  const normalized = ((hue % 360) + 360) % 360;
  const semitones = (normalized / 360) * HUE_SEMITONE_RANGE;
  const snapped = snapToPentatonic(semitones);
  return BASE_FREQ_HZ * Math.pow(2, snapped / 12);
}

// ---- Audio engine ---------------------------------------------------------

interface Voice {
  startMs: number;
  osc: OscillatorNode;
  gain: GainNode;
}

class ChromaAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private voices: Voice[] = [];
  private mutedState = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.mutedState = window.localStorage.getItem(STORAGE_KEY) === "1";
      } catch {
        this.mutedState = false;
      }
    }
  }

  get muted(): boolean {
    return this.mutedState;
  }

  setMuted(muted: boolean): void {
    this.mutedState = muted;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
      } catch {
        // ignore
      }
    }
    if (muted && this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!muted && this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(MASTER_GAIN, this.ctx.currentTime);
    }
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (this.ctx) return this.ctx;
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.mutedState ? 0 : MASTER_GAIN;
    this.masterGain.connect(this.ctx.destination);
    return this.ctx;
  }

  /** Some browsers require a resume() if the context was created suspended. */
  private async resumeIfSuspended(): Promise<void> {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        // ignore
      }
    }
  }

  /**
   * Play a chord of pitches derived from a list of hues. Safe to call
   * during muted state (becomes a no-op).
   */
  playChord(hues: number[]): void {
    if (this.mutedState) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    void this.resumeIfSuspended();

    const now = ctx.currentTime;
    const startMs = performance.now();

    // Polyphony cap: steal oldest voices if we'd exceed MAX_VOICES.
    while (this.voices.length + hues.length > MAX_VOICES) {
      const oldest = this.voices.shift();
      if (oldest) {
        try {
          oldest.gain.gain.cancelScheduledValues(now);
          oldest.gain.gain.setValueAtTime(oldest.gain.gain.value, now);
          oldest.gain.gain.linearRampToValueAtTime(0.0001, now + 0.04);
          oldest.osc.stop(now + 0.05);
        } catch {
          // ignore
        }
      }
    }

    for (const hue of hues) {
      const freq = hueToFrequency(hue);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      // AR envelope: 5ms linear attack → exponential release to ~0.
      // exponentialRampToValueAtTime can't ramp to 0 exactly (the math
      // collapses), so we ramp to 0.0001 then hard-set to 0.
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(VOICE_PEAK, now + ATTACK_S);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + ATTACK_S + RELEASE_S);
      gain.gain.setValueAtTime(0, now + ATTACK_S + RELEASE_S + 0.001);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + ATTACK_S + RELEASE_S + TAIL_S);

      const voice: Voice = { startMs, osc, gain };
      this.voices.push(voice);
      osc.addEventListener("ended", () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // ignore
        }
        this.voices = this.voices.filter((v) => v !== voice);
      });
    }
  }
}

let singleton: ChromaAudio | null = null;

export function getChromaAudio(): ChromaAudio {
  if (!singleton) singleton = new ChromaAudio();
  return singleton;
}
