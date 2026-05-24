/**
 * Essay content for the Typoglycemia Lab experiment.
 *
 * Adapted from Matt Davis, "Reibadailty," MRC Cognition and Brain Sciences Unit,
 * University of Cambridge. https://www.mrc-cbu.cam.ac.uk/personal/matt.davis/Cmabrigde/
 *
 * Paragraph kinds:
 *   - "essay"  → Lisa's prose, runs through the scrambler/unscramble mechanic.
 *                Supports `*text*` markdown for italic words.
 *   - "quote"  → verbatim citation. Rendered as a styled <blockquote>, NOT
 *                tokenized, NOT scrambled, NOT tracked by the crossing logic.
 *                Used for the viral 2003 meme so the famous "Aoccdrnig…"
 *                / "Cmabrigde…" form is preserved exactly as Matt Davis
 *                wrote it.
 */

export type TypoglycemiaParagraph =
  | { kind: "essay"; text: string }
  | { kind: "quote"; text: string };

export interface TypoglycemiaEssay {
  title: string;
  subtitle: string;
  paragraphs: TypoglycemiaParagraph[];
  attribution: {
    text: string;
    href: string;
    linkLabel: string;
  };
}

export const typoglycemiaEssay: TypoglycemiaEssay = {
  title: "Typoglycemia",
  subtitle: "After Graham Rawlinson, 1976.",
  paragraphs: [
    { kind: "essay", text: "In 1976, Graham Rawlinson submitted a PhD thesis at the University of Nottingham. He called it *The Significance of Letter Position in Word Recognition*. His finding: you can scramble the middle letters of a word and most readers still recognize it. The first letter and the last letter do the work. Everything else can move." },
    { kind: "essay", text: "In 2003, a paragraph started showing up online demonstrating the effect, attributing it — incorrectly — to Cambridge researchers. There was no Cambridge study. The meme, written by someone who understood the underlying mechanic, captured something real anyway." },
    { kind: "essay", text: "Not all jumbled sentences are easy to read. The meme was. Why?" },
    { kind: "quote", text: "Aoccdrnig to a rscheearch at Cmabrigde Uinervtisy, it deosn't mttaer in waht oredr the ltteers in a wrod are, the olny iprmoetnt tihng is taht the frist and lsat ltteer be at the rghit pclae. The rset can be a toatl mses and you can sitll raed it wouthit porbelm. Tihs is bcuseae the huamn mnid deos not raed ervey lteter by istlef, but the wrod as a wlohe." },
    { kind: "essay", text: "Short words are easy. Two and three letter words don't change at all. The only possible change in a four letter word is swapping the middle pair, which barely registers." },
    { kind: "essay", text: "Function words — the, be, and, you — stay the same, mostly because they are short. This preserves the grammatical structure of the sentence and helps you predict what's coming. Predictability is everything when the text is messy." },
    { kind: "essay", text: "In the original meme, eight of the fifteen words were already in correct order. Most of those were function words, which readers do not tend to notice anyway. When asked to detect individual letters, people are more likely to miss them in function words than in content words." },
    { kind: "essay", text: "Transpositions of adjacent letters — porbelm for problem — are much easier to read than more distant transpositions like pborlem. The outside letters of words are easier to detect than middle letters. There is only one direction an outside letter can move, and fewer neighbours to confuse it with." },
    { kind: "essay", text: "No word in the meme, when scrambled, became another real word. This matters. Salt and slat are middle letter transpositions of each other. Readers stumble when scrambled text could mean something else." },
    { kind: "essay", text: "Many of the transpositions preserve the sound of the original word. Toatl reads like total. Ttaol does not. Sound matters even when reading silently." },
    { kind: "essay", text: "The text is predictable. Given the opening of a sentence, you can guess the rest with surprising accuracy. Context lets people understand speech presented in noise. The same is true of written text presented in chaos." },
    { kind: "essay", text: "So the meme works not because the brain reads words as whole shapes, but because the writer of the meme — knowingly or not — followed seven rules that make scrambled text recoverable. Break any of those rules and the trick collapses." },
    { kind: "essay", text: "What Rawlinson actually showed in 1976 was subtler than the meme suggests. Middle letters can be identified independently of their position. The reading brain samples letters probabilistically; it does not require an exact sequence. First and last letters carry more weight than middles. Word length and phonetic structure carry information of their own. Reading is not a single process but a parallel one — letter features, shapes, sounds, syntactic guesses all running at once, any one of them sufficient if the others get noisy." },
    { kind: "essay", text: "You can scramble the middles because the reading system was never relying on the middles alone in the first place." },
  ],
  attribution: {
    text: "Adapted from Matt Davis, \u201CReibadailty,\u201D MRC Cognition and Brain Sciences Unit, University of Cambridge.",
    href: "https://www.mrc-cbu.cam.ac.uk/personal/matt.davis/Cmabrigde/",
    linkLabel: "Full essay \u2192",
  },
};
