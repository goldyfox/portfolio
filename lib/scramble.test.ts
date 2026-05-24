import { describe, expect, it } from "vitest";
import { mulberry32, parseParagraph, scramble, scrambleWord } from "./scramble";

const sortChars = (s: string) => Array.from(s).sort().join("");

describe("scramble invariants", () => {
  it("preserves length", () => {
    expect(scramble("internet", 1).scrambledText.length).toBe(8);
    expect(scramble("paragraph", 1).scrambledText.length).toBe(9);
    expect(scramble("Cambridge", 7).scrambledText.length).toBe(9);
  });

  it("preserves multiset of characters", () => {
    const words = ["internet", "paragraph", "September", "Significance", "Rawlinson"];
    for (const word of words) {
      const { scrambledText } = scramble(word, 42);
      expect(sortChars(scrambledText)).toBe(sortChars(word));
    }
  });

  it("preserves first letter", () => {
    expect(scramble("Cambridge", 7).scrambledText[0]).toBe("C");
    expect(scramble("internet", 7).scrambledText[0]).toBe("i");
    expect(scramble("Significance", 7).scrambledText[0]).toBe("S");
  });

  it("preserves last letter", () => {
    expect(scramble("Cambridge", 7).scrambledText.at(-1)).toBe("e");
    expect(scramble("internet", 7).scrambledText.at(-1)).toBe("t");
    expect(scramble("Significance", 7).scrambledText.at(-1)).toBe("e");
  });

  it("does not scramble short words (<=3 letters)", () => {
    expect(scramble("a", 1).scrambledText).toBe("a");
    expect(scramble("of", 99).scrambledText).toBe("of");
    expect(scramble("the", 12).scrambledText).toBe("the");
    expect(scramble("you", 33).scrambledText).toBe("you");
  });

  it("keeps apostrophes at their original positions", () => {
    const { scrambledText } = scramble("Rawlinson's", 5);
    expect(scrambledText.length).toBe("Rawlinson's".length);
    expect(scrambledText[9]).toBe("'");
    expect(scrambledText[0]).toBe("R");
    expect(scrambledText.at(-1)).toBe("s");
    expect(sortChars(scrambledText)).toBe(sortChars("Rawlinson's"));
  });

  it("is deterministic for the same (input, seed)", () => {
    expect(scramble("paragraph", 100).scrambledText).toBe(
      scramble("paragraph", 100).scrambledText,
    );
    expect(scramble("Significance", 7).scrambledText).toBe(
      scramble("Significance", 7).scrambledText,
    );
  });

  it("typically differs across seeds for longer words", () => {
    const a = scramble("Significance", 1).scrambledText;
    const b = scramble("Significance", 2).scrambledText;
    expect(a).not.toBe(b);
  });

  it("returns identity for words whose middle has only one permutation", () => {
    expect(scramble("look", 1).scrambledText).toBe("look");
    expect(scramble("look", 999).scrambledText).toBe("look");
  });

  it("sourceMap[i] points back to the original index for every position", () => {
    const word = "Significance";
    const { scrambledText, sourceMap } = scramble(word, 13);
    expect(sourceMap.length).toBe(word.length);
    for (let i = 0; i < word.length; i++) {
      expect(scrambledText[i]).toBe(word[sourceMap[i]]);
    }
    expect(sourceMap[0]).toBe(0);
    expect(sourceMap.at(-1)).toBe(word.length - 1);
  });
});

describe("scrambleWord convenience", () => {
  it("returns same output as scramble().scrambledText", () => {
    const seed = 31;
    expect(scrambleWord("Cambridge", seed)).toBe(scramble("Cambridge", seed).scrambledText);
  });
});

describe("mulberry32 RNG", () => {
  it("is deterministic", () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    for (let i = 0; i < 10; i++) {
      expect(a()).toBe(b());
    }
  });

  it("yields values in [0, 1)", () => {
    const r = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("parseParagraph", () => {
  it("splits into words and static tokens", () => {
    const tokens = parseParagraph("Hello, world.");
    const kinds = tokens.map((t) => t.kind);
    expect(kinds).toEqual(["word", "static", "word", "static"]);
    expect(tokens[0].text).toBe("Hello");
    expect(tokens[1].text).toBe(", ");
    expect(tokens[2].text).toBe("world");
    expect(tokens[3].text).toBe(".");
  });

  it("treats apostrophe-bearing words as a single word token", () => {
    const tokens = parseParagraph("Rawlinson's thesis.");
    const words = tokens.filter((t) => t.kind === "word").map((t) => t.text);
    expect(words).toEqual(["Rawlinson's", "thesis"]);
  });

  it("splits hyphenated compounds into separate word tokens", () => {
    const tokens = parseParagraph("letter-by-letter reading");
    const words = tokens.filter((t) => t.kind === "word").map((t) => t.text);
    expect(words).toEqual(["letter", "by", "letter", "reading"]);
  });

  it("keeps numbers as static (non-scrambling) tokens", () => {
    const tokens = parseParagraph("In 1976, Rawlinson wrote a thesis.");
    const wordTexts = tokens.filter((t) => t.kind === "word").map((t) => t.text);
    expect(wordTexts).not.toContain("1976");
    const staticTexts = tokens.filter((t) => t.kind === "static").map((t) => t.text);
    expect(staticTexts.some((s) => s.includes("1976"))).toBe(true);
  });

  it("marks tokens inside *italic* markers as italic", () => {
    const tokens = parseParagraph(
      "His thesis, *The Significance of Letter Position*, was unpublished.",
    );
    const italicWords = tokens
      .filter((t) => t.kind === "word" && t.italic)
      .map((t) => t.text);
    expect(italicWords).toEqual([
      "The",
      "Significance",
      "of",
      "Letter",
      "Position",
    ]);
    const nonItalicWords = tokens
      .filter((t) => t.kind === "word" && !t.italic)
      .map((t) => t.text);
    expect(nonItalicWords).toEqual(["His", "thesis", "was", "unpublished"]);
  });

  it("emits unique keys for every token", () => {
    const tokens = parseParagraph("This is a test of unique keys for tokens.");
    const keys = tokens.map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("round-trips: concatenating token text reconstructs the original (italic markers stripped)", () => {
    const original =
      "Graham Rawlinson's 1976 thesis, *The Significance of Letter Position in Word Recognition*, was unpublished.";
    const expected = original.replace(/\*/g, "");
    const tokens = parseParagraph(original);
    const recombined = tokens.map((t) => t.text).join("");
    expect(recombined).toBe(expected);
  });
});
