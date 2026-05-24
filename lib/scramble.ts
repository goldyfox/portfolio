/**
 * Deterministic letter-position scrambling, faithful to Rawlinson 1976.
 *
 * Invariants enforced by `scramble()`:
 *   1. Output length === input length
 *   2. Output multiset of characters === input multiset
 *   3. output[0] === input[0] AND output[lastLetterPos] === input[lastLetterPos]
 *   4. Non-letter character positions are preserved (apostrophe, etc.)
 *   5. Words with letterCount <= 3 are returned unchanged
 *   6. Output is deterministic given (input, seed)
 *   7. If middle letters have only one unique permutation (e.g. "look"),
 *      output may equal input — acceptable, not a bug.
 */

const LETTER_REGEX = /\p{L}/u;

export interface ScrambleResult {
  /** Scrambled string, same length as input. */
  scrambledText: string;
  /**
   * For each character position i in the output, sourceMap[i] is the
   * position in the input from which that character came.
   * For unchanged characters (first letter, last letter, non-letters,
   * short words), sourceMap[i] === i.
   */
  sourceMap: number[];
}

/**
 * mulberry32 — a fast, well-distributed 32-bit seeded PRNG.
 * Public domain. https://gist.github.com/tommyettinger/46a3a48ef84e96b48a4e1f8f0e4f7e3e
 */
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function isLetter(ch: string): boolean {
  return LETTER_REGEX.test(ch);
}

export function scramble(word: string, seed: number): ScrambleResult {
  const chars = Array.from(word);
  const sourceMap = chars.map((_, i) => i);

  const letterPositions: number[] = [];
  chars.forEach((ch, i) => {
    if (isLetter(ch)) letterPositions.push(i);
  });

  if (letterPositions.length <= 3) {
    return { scrambledText: word, sourceMap };
  }

  const middlePositions = letterPositions.slice(1, -1);

  const rng = mulberry32(seed);
  const permuted = [...middlePositions];
  for (let i = permuted.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [permuted[i], permuted[j]] = [permuted[j], permuted[i]];
  }

  const scrambledChars = [...chars];
  middlePositions.forEach((destPos, k) => {
    const sourcePos = permuted[k];
    scrambledChars[destPos] = chars[sourcePos];
    sourceMap[destPos] = sourcePos;
  });

  return { scrambledText: scrambledChars.join(""), sourceMap };
}

/**
 * Convenience helper — returns only the scrambled text.
 */
export function scrambleWord(word: string, seed: number): string {
  return scramble(word, seed).scrambledText;
}

/* -------------------------------------------------------------------------- */
/*  Tokenization                                                              */
/* -------------------------------------------------------------------------- */

export type ParagraphToken =
  | { kind: "word"; text: string; italic: boolean; key: string }
  | { kind: "static"; text: string; italic: boolean; key: string };

/**
 * Matches: a run of letters, optionally with apostrophes between letters
 * (Rawlinson's, doesn't). Hyphens break words. Numbers don't match.
 */
const WORD_PATTERN = /\p{L}+(?:'\p{L}+)*/gu;
const ITALIC_PATTERN = /\*([^*]+)\*/g;

/**
 * Parses a paragraph string into typed tokens.
 *
 * - `*italics*` markers split the paragraph into italic and non-italic runs.
 * - Within each run, letter sequences become `word` tokens (scrambleable).
 *   Everything else (whitespace, punctuation, numbers, dashes) becomes
 *   `static` tokens (rendered as-is).
 * - Apostrophes between letters do not split a word.
 */
export function parseParagraph(text: string, paragraphIndex = 0): ParagraphToken[] {
  const runs: Array<{ text: string; italic: boolean }> = [];
  let cursor = 0;
  ITALIC_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ITALIC_PATTERN.exec(text)) !== null) {
    if (match.index > cursor) {
      runs.push({ text: text.slice(cursor, match.index), italic: false });
    }
    runs.push({ text: match[1], italic: true });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) {
    runs.push({ text: text.slice(cursor), italic: false });
  }

  const tokens: ParagraphToken[] = [];
  let tokenCounter = 0;

  for (const run of runs) {
    const wordRe = new RegExp(WORD_PATTERN.source, "gu");
    let lastEnd = 0;
    let m: RegExpExecArray | null;
    while ((m = wordRe.exec(run.text)) !== null) {
      if (m.index > lastEnd) {
        tokens.push({
          kind: "static",
          text: run.text.slice(lastEnd, m.index),
          italic: run.italic,
          key: `p${paragraphIndex}-s${tokenCounter++}`,
        });
      }
      tokens.push({
        kind: "word",
        text: m[0],
        italic: run.italic,
        key: `p${paragraphIndex}-w${tokenCounter++}`,
      });
      lastEnd = m.index + m[0].length;
    }
    if (lastEnd < run.text.length) {
      tokens.push({
        kind: "static",
        text: run.text.slice(lastEnd),
        italic: run.italic,
        key: `p${paragraphIndex}-s${tokenCounter++}`,
      });
    }
  }

  return tokens;
}
