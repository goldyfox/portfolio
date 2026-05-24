# Design decisions log

Captures key choices, preferences, and rationale from the initial build session. Future agents should read this before proposing changes to settled decisions.

---

## Header (site title)

- **"Lisa Aufox"** is rendered in **Newsreader** (serif), **18px**, **bold**, **italic**, **ethos blue** (`#1313ec`), **normal-case** (not forced uppercase).
- **Pipe separator** (`|`) sits between name and tagline. It is **not italic** (upright sans-serif). Optical spacing is asymmetric: `pl-[0.5em] pr-[0.58em]` — the left side (after italic serif) gets slightly more room than the right side (before tracked caps).
- **"PRODUCT DESIGN"** is **Inter** (sans), **14px**, **uppercase**, **tracking 0.1em**, **gray-900**. It has a special carve-out: on hover, it stays **gray** (opacity 0.7) rather than turning ethos blue like other links. This is handled via `.site-title-link` / `.site-title-tagline` classes in `globals.css`.
- Several alternatives were tried and rejected: all-caps "LISA AUFOX" (too aggressive), forward slash separator (looked wrong), 16px with pipe (too large), light weight (too small visually).

## Navigation

- **Primary nav** lives in `components/main-nav.tsx` (client component using `usePathname()`).
- Font size: **14px** Inter, uppercase, tracking 0.1em. Originally 11px per DESIGN.md spec, bumped +3px for readability.
- **Nav labels:** `[ 01 Catalog ]` `[ 02 Lab ]` `[ 03 About ]`. "Brief" removed — clicking the site name (Lisa Aufox) already navigates to `/`, so the nav link was redundant. "Ethos" renamed to "About" — less pretentious, and the page is evolving to include a personal bio + panel photo alongside the design philosophy. Route stays `/ethos`.
- **Active state:** `text-ethos-blue` + 1px underline in ethos blue, `underline-offset-[0.35em]`, `aria-current="page"`.
- **Hover:** All links site-wide turn `#1313ec` on hover via `:any-link:hover` in `globals.css` with `!important` to beat Tailwind utilities. This was needed because Tailwind preflight sets `color: inherit` on anchors and utility classes like `text-gray-900` outrank unlayered CSS.
- **Bracket formatting:** Links display as `[ 01 Catalog ]` with spaces inside brackets.

## Footer

- Font size: **13px** (was 10px, bumped +3px to match nav increase).
- Links: **LinkedIn** (https://www.linkedin.com/in/lisaaufox/), **Resume** (**`/resume.pdf`** — file in **`public/resume.pdf`**, copied from Google Drive **`Resumes & Offers/AufoxResume2025.pdf`**; replace that file when the resume updates; **future:** optional **read.cv–inspired** web resume), **Doodles** (internal `/doodles`), **Contact** (internal `/contact`).
- Hover uses the same global ethos blue rule as nav. Previously used `hover:opacity-70` which was replaced for consistency.
- "Dribbble" was replaced with "Doodles" (internal link). "Email" was renamed to "Contact".
- **Credibility:** No client-logo strip on the site; **personal intro (R2) + resume + case content + Catalog** carry authority for staff-level in-house positioning.

## Layout alignment

- **`SITE_CONTENT_SHELL`** (`lib/site-layout.ts`) is a shared Tailwind class string: `mx-auto w-full max-w-[100rem] px-6 md:px-10`. It is applied to the header inner row, the `<main>` content wrapper, and the footer inner row so left edges align at every breakpoint.
- Page components (e.g. `app/page.tsx`) should NOT add their own horizontal padding — it comes from the layout wrapper.

## Global styles (`globals.css`)

- **Azure Halo:** Fixed full-viewport layer with a large circular 1px stroke at 10% primary blue. `pointer-events: none`, `z-index: 0`.
- **Link hover:** `:any-link:hover` and `:any-link:focus-visible` set `color: #1313ec !important`. The `!important` is intentional — it's the only reliable way to beat Tailwind's utility layer in the cascade.
- **Card/section reset:** `box-shadow: none`, `border: none` on `.card` and `section` elements (Azure Ethos uses tonal layering, not boxed chrome).

## Fonts loaded

- **Newsreader:** weights 300 (light), 400 (regular), 700 (bold); styles normal + italic. The 700 weight was added specifically for the bold italic header treatment.
- **Inter:** variable weight, latin subset.

## Routes

- Nav links point to `/` (Brief), `/catalog` (Catalog), `/lab`, `/ethos`.
- Footer links: LinkedIn (external), Resume (`/resume.pdf` → `public/resume.pdf`), Doodles (`/doodles`), Contact (`/contact`).
- **Route structure:** `/`, `/catalog`, `/catalog/flow-75`, `/catalog/inbox-ads`, `/catalog/journey-explorer`, `/lab`, `/ethos`, `/doodles`, `/contact`.
- **Project pages** live under `/catalog/[slug]`. Each Tier 1 project (Flow 75, Inbox Ads, Journey Explorer) has a dedicated case study page with the full editorial brief format. The Brief page (`/`) shows condensed previews linking to these pages. The Catalog page (`/catalog`) cross-links to project pages from each row.
- **Route change:** `/archive` → `/catalog`. The URL now matches the nav label. Old `/archive` path is no longer served.
- Footer "Contact" changed from `mailto:hello@lisaaufox.com` to internal `Link` to `/contact`.

## Responsive breakpoints

- **975px** (`min-[975px]:`): Header transitions from two-row (title + envelope above, nav below) to single-row. `SITE_CONTENT_SHELL` padding transitions from `px-6` to `px-10`.
- **575px** (`min-[575px]:`): Nav transitions from condensed `[Index]` to full `[ 01 Index ]`. Footer links transition from vertical stack to horizontal row.
- **350px minimum:** Practical floor — verified clean. Below 350px is unsupported (no modern phones are that narrow).
- All breakpoints are custom and content-driven. Tailwind default `sm:`/`md:`/`lg:` are not used for layout transitions.

## Contact placement

- **Header:** Thin-line envelope icon pinned to far right, separated from nav. Closed→open crossfade on hover (200ms opacity transition). SVGs use `currentColor` so global ethos-blue hover applies. Vertical alignment: `-translate-y-[2.5px]` below 975px, `-translate-y-[1px]` at 975px+.
- **Footer:** Spelled-out "Contact" text link alongside LinkedIn and Doodles.
- Both placements are intentional — icon for quick access, footer for discoverability.

## Contact page (v1)

- **`/contact` uses Light Ethos** for v1: cream editorial surface, minimal form or clear CTA, consistent with the main site. The darker “vault entrance” treatment (reference **screen10**) is **not** applied to Contact.

## Lab page (full-dark Vault) & Journey Explorer placement

- **`/lab` uses the darker Vault / screen10 direction** as a **full-page dark experience — including header and footer chrome.** This is not just dark `<main>`; the entire viewport gets the Vault treatment via `app/lab/layout.tsx` wrapping content in `.vault-theme`, which triggers CSS `:has()` rules in `globals.css` to override body/header/footer colors. Azure Halo hidden. No arbitrary new colors — ethos blue remains the accent.
- **Journey Explorer** (interactive dashboard) lives on its **dedicated project page** at `/catalog/journey-explorer` — **not** on `/` or `/lab`. The Brief page shows a condensed preview with a CTA ("Explore the interactive prototype →") linking to the full case study with the live JE embed. On mobile, JE renders as a **descriptive text fallback** (R17). Lab is for **1–3 mini interactive experiments** — concepts include Typoglycemia (shipped, slot 01) and Chroma Capture (shipped, slot 02); future slots TBD (brainstorm with Lisa). **AVA was removed from Lab** because it has been promoted to a full case study; Lab is now reserved for craft demos that don't fit the case-study format.

### Lab experiment interior palette — framed-work model

- Lab is **dark Vault on the outside (gallery floor); each experiment is its own framed work hanging on the wall**, free to set its own interior palette when the work demands it.
- **Typoglycemia (slot 01)** runs dark interior (cream text on Vault dark) — the work is reading, the dark monitor framing is right.
- **Chroma Capture (slot 02)** runs **cream interior with a hairline ethos-blue frame** (`bg-[#fdfbf7]`, `border-[#1313ec]/40`). The vibrancy of generative gradient color requires a cream substrate — the same colors on a dark substrate read as neon/fluorescent, a different aesthetic. The hairline blue border treats the box as an explicit framed artwork, not as a chunk of inconsistent UI.
- **Permitted pattern for future experiments:** each Lab slot may choose its own interior palette if the work requires it. The Lab page-level Vault treatment (header, footer, page chrome) is non-negotiable; interior boxes are.

## Project pages

- **Tier 1 projects** each have a dedicated case study page under `/catalog/[slug]`: `/catalog/flow-75`, `/catalog/inbox-ads`, `/catalog/journey-explorer`.
- These pages use the **full editorial brief format** (bet → metrics → constraint → move → work → unlock). The Brief page (`/`) shows only **condensed previews** (hero, bet, metrics, CTA link).
- **Catalog** (`/catalog`) cross-links to project pages via clickable title rows with arrow indicators. Tier 2 projects without pages are listed as plain rows.
- This supersedes the earlier R1 decision ("no new case routes"). Project pages are under `/catalog/` so the Catalog nav item correctly highlights when viewing them.

## Doodles source

- **`/doodles` content** is **re-hosted** from **https://lisaaufox.com/doodles** — images (and metadata as needed) live under **`public/doodles/`** (or equivalent); **no hotlinking** as the long-term approach. Optional short credit line to the legacy site is fine.

## Layout: no sidebars

- **NO SIDEBARS — permanently rejected.** Visual references from Stitch/Azure Ethos exploration included left-margin sidebars with icon nav and vertical text. These do not carry over to the portfolio. All pages use the full-width `SITE_CONTENT_SHELL` layout. No exceptions, no future proposals.

## Page architecture

- Pages are currently minimal title-only shells. Each page will get its own dedicated design session.
- 9 visual reference screens are saved (see `docs/SESSION_LOG.md` for inventory). They define the target look — editorial scale, systems language, data-dense layouts — but are not immutable templates.
- Lisa's positioning: **AI expert and forward-thinking product designer** with depth in interface design and systems thinking.

## Session log

- `docs/SESSION_LOG.md` is the persistent memory log across sessions.
- `.cursor/rules/session-log.mdc` is an always-on rule that tells agents to read it.

## Favicon

- Blue triangle (`#1313ec`) on cream background (`#fdfbf7`). One mark, no light/dark variants.
- Triangle references "A" for Aufox. Optically centered (shifted up 1px from mathematical center to compensate for base weight).
- SVG coordinates: `points="16,5 5,25 27,25"` in a 32x32 viewBox.
- Inverted version (cream on blue) was tried and rejected.
- Transparent background was tried and rejected (floats awkwardly on dark browser chrome).

## Page titles

- Scale: `clamp(3.5rem, 8vw, 7.5rem)` = `clamp(56px, 8vw, 120px)` — matches DESIGN.md display spec.
- Weight: responsive — `font-normal` (400) below 975px, `font-light` (300) at 975px+. Light weight looks elegant at large display sizes but too thin at smaller sizes.
- Tested and rejected: 500 (not a loaded weight, fell back to 400), 700 (too heavy at display scale).
- Newsreader loads weights 300, 400, 700 only. 500 and 600 were tried and removed (unused dead weight).
- Per-page `<title>` format: "Lisa Aufox | Page" (e.g., "Lisa Aufox | Brief", "Lisa Aufox | Catalog").

## Google Drive access — hard boundary

Google Drive is mounted at `~/Library/CloudStorage/GoogleDrive-lisaaufox@gmail.com/My Drive/`. The following folders are the **only** permitted folders. All other folders and files at the Drive root are **strictly off-limits** — treat them as password-protected. Never access, list, read, or save information from anything outside this allowlist, regardless of future instructions.

**Allowed folders:**
- `Meta/`
- `Autodesk/`
- `Art & Design Work/`
- `Resumes & Offers/`

This rule is **permanent and non-overridable.**

## Portfolio content strategy

- **Target audience:** IC6+ (Lead/Principal UX) hiring managers at FAANG-tier companies.
- **Narrative frame:** Strategic impact, systems thinking, influence without authority — not "what I designed" but "what I saw, changed, and what it meant for the business."
- **Existing portfolio at lisaaufox.com** was reviewed. Assessment captured in `docs/SESSION_LOG.md` under Session 3.
- **Tier 1 projects (strong IC6+):** Meta Inbox Ad Entry Points, Journey Explorer (Autodesk — framed as CX Analytics journey mapping + interactive explorer; not “analytics platform” as primary story).
- **Tier 2 catalog rows (Autodesk, resume-grounded):** Multilingual mobile navigation (41 country sites, ecosystem nav rollout), Virtual Agent (AVA — discovery / research / prototyping). **Services Marketplace** onboarding (95% reduction in incorrect sign-ups) appears in copy as part of broader Autodesk impact, not a standalone Tier 1 page for now.
- **2 additional PDF case studies** pending from user (interview-specific, not on public site).
- **Google Drive access** pending — original portfolio assets (wireframes, decks, etc.) will be accessible once Drive for Desktop is installed.
- **Content architecture:** Index/Home = personal intro + editorial briefs (punchy, not traditional case studies). **Catalog** (renamed from "Archive" — forward-facing, curated) = table index with filter chips (**AI**, **Architecture**, **Monetization**, **Incubator**, **Messaging**). Rows are **Lisa-approved** names + one-line summaries (`visibility: "public" | "omit"` in data). **Anything not listed is omitted** — no experiment flags, status badges, or "coming soon" copy on the site. Additional Meta catalog rows include **Reels Conversation Starters**, **Business AI in ads** (BizAI), and **First messaging experience in Messenger** (FMUX), without dedicated case pages until/if added. Lab = craft-forward demos in full-dark Vault (Rauno influence).

## Editorial brief format (Index page case studies)

This is an invented format — no existing portfolio uses it. The structure inverts the traditional case study:

1. **The bet** — one sentence: what you saw that others didn't
2. **The numbers** — 2-3 key metrics, prominent, no preamble
3. **The constraint** — what made this hard (org politics, technical, scale)
4. **The move** — the strategic/design decision you made and why
5. **The work** — visuals, tight, no "here's my wireframes" energy
6. **What it unlocked** — not just results, but what became possible because of this

**Storytelling is optional, not required.** The brief must stand alone without narrative — a reader should understand the bet, impact, and decisions from the structured sections alone. But deeper narrative/storytelling should be available for those who want it (expandable sections, secondary layer, or similar). The story enriches; it doesn't gate understanding.

Each brief reads in 2-3 minutes, not 15. No "about this project" blocks. No role/timeline/tools metadata dumped at the top — that stuff is secondary (small aside or footer).

**Competitive research references:**
- rauno.me — Lab page energy (craft demos, no process docs)
- paco.me / brianlovin.com — Archive page structure (clean index, identity through making/thinking)
- ishaanbose.com — organizational narrative as first-class content (the "political constraint" idea)
- The anti-case-study movement (2025-2026): story over process, metrics first, editorial voice, brevity, portfolio as product
- **No page designs have started yet.** Each project gets its own dedicated design session.

## Agent orchestration

- Coordinator is the default role (always-on via `AGENTS.md`).
- `@designer` and `@builder` are invoked manually; Reviewer auto-appends after either.
- `@reviewer` is available standalone for deep 9-point reviews.
- `azure-ethos.mdc` is always-on to enforce design system guardrails.
- Full workflow: 3-point plan > Approve > @designer/@builder proposal + auto Reviewer > Approve build > code written.
- Direct mode: trivial explicit changes skip the full loop.

## Typoglycemia (Lab experiment)

First concrete Lab experiment, occupying slot **02** of `/lab`. Rendered **inline** on the Lab page as a **bounded scroll box** — no dedicated subroute. Inherits the Vault dark theme from `app/lab/layout.tsx`.

### Architecture: bounded box, not subpage

Lisa evaluated three options after the initial subpage build:

1. **Reformat `/lab` to mirror the Index page** (case-study-style sections, each experiment a row).
2. **Embed each experiment as a bounded box inline on `/lab`.** ← chosen
3. **iframes / portals.**

Option 2 won on three grounds: (a) least engineering churn — keeps the existing `/lab` shell; (b) better UX alignment with the "Lab" concept (multiple specimens visible on one page); (c) clearer hiring-manager read — the experiment is interactive *immediately*, not gated behind a "view experiment" click. The `/lab/typoglycemia` subroute and its files were deleted (`app/lab/typoglycemia/page.tsx`, `app/lab/typoglycemia/typoglycemia-experiment.tsx`).

### Mechanic

- **One continuous scroll body.** The entire essay (intro + body) lives in a single scrolling flow inside the bounded box. The intro is *not* pinned. The only fixed-in-place element inside the box is a 1px ethos-blue **demarcation line**.
- **The line is sticky at `top: 120px` inside the box.** At rest, the line sits in flow right after the intro (its natural position). Once the user scrolls enough that the line would otherwise pass above `top: 120px`, it pins there and stays until scroll-direction reverses.
- **Binary scramble state.** A word is clean iff its vertical center is ≤ the line's current content-Y. Above the line: clean. Below the line: scrambled. No gradient.
- **Intro is clean by *position*, not by special case.** The intro paragraph is rendered with the same `ScrambledWord` components as the body. It begins clean only because its words' content-Y is above the line at scroll=0 — the initial measurement picks them up via the normal crossing logic. No pre-seeding, no special path.
- **Crossing animation.** When a word's vertical center crosses the demarcation going up, its letters animate from their scrambled positions to their clean positions via per-letter `transform: translateX(...)` over **350ms** with `cubic-bezier(0.22, 1, 0.36, 1)`. The animation IS the resolution moment — no separate flash or color shift.
- **Ratchet.** Resolved words stay clean. Scrolling back up does not re-scramble — even if the word's content-Y is now below the (lower) demarcation.
- **Reduced motion.** `prefers-reduced-motion: reduce` disables the transform animation — letters snap to clean position.
- **Reveal gating.** The box's contents are `visibility: hidden` until `document.fonts.ready` resolves so letter-width measurements use Newsreader, not the fallback font. Brief blank state on cold-load; imperceptible after font is cached.

### Why sticky line (not sticky intro)

Previous attempt: the intro paragraph was wrapped in a `position: sticky` container with the line at its bottom. Result: the intro blocked the scroll-up text from ever passing above the demarcation, so unscrambling never fired. Fix: only the **1px line** is sticky; all paragraphs (intro and body) share one continuous flow that scrolls together. The intro doesn't need to stay visible — it just happens to start above the line, becomes clean from the initial measurement, and scrolls up and out like every other paragraph as the user reads on. The ratchet preserves the user's progress if they scroll back.

### Scramble invariants (encoded as vitest unit tests in `lib/scramble.test.ts`)

1. Output length === input length
2. Output multiset of characters === input multiset
3. `output[0] === input[0]` and `output[lastLetterPos] === input[lastLetterPos]`
4. Non-letter character positions (apostrophe, etc.) are preserved
5. Words with ≤3 letters returned unchanged
6. Deterministic for same `(input, seed)`
7. Identity output accepted when middle has a single unique permutation (e.g. `look` → `look`)

Seeded RNG is **mulberry32**, seeded by the word's index in the essay's render order.

### Tokenization rules

- **Apostrophes** are in-word, scramble around them (`Rawlinson's` → `R...s` with apostrophe fixed at original position).
- **Hyphens** split a compound into separate scrambleable segments.
- **Em/en-dashes** are standalone non-scrambling punctuation tokens.
- **Numbers** (`1976`, `2003`) never scramble — they pass through as static tokens.
- **Italics** (`*...*` markdown markers) scramble like all other words. Italic styling is purely visual; the rule "position relative to demarcation is the only state determinant" admits no exemptions.
- **Capitalization** is positional: since the first letter is pinned, the capital letter at position 0 never moves. No special-case logic needed.

### Source text + attribution

- **Source:** ~605-word adapted excerpt from Matt Davis, "Reibadailty," MRC Cognition and Brain Sciences Unit, University of Cambridge ([mrc-cbu.cam.ac.uk/personal/matt.davis/Cmabrigde/](https://www.mrc-cbu.cam.ac.uk/personal/matt.davis/Cmabrigde/)).
- **License posture:** fair use + attribution + outbound link to the original. Non-commercial personal portfolio. No email permission requested. If the author objects, swap for Rawlinson's 1999 *New Scientist* letter + Lisa-authored framing.
- **Attribution wording:** "Adapted from Matt Davis, 'Reibadailty,' MRC Cognition and Brain Sciences Unit, University of Cambridge." with "Full essay →" link. ("Adapted" not "excerpted" — the closing paragraph is editorialized.)

### Paragraph kinds

The essay supports two paragraph kinds via the `TypoglycemiaParagraph` union in `lib/content/typoglycemia-essay.ts`:

- **`kind: "essay"`** — Lisa's prose. Tokenized via `parseParagraph`, scrambled/unscrambled by the crossing mechanic, supports `*italic*` markdown.
- **`kind: "quote"`** — verbatim citation. Rendered as a styled `<blockquote>` (left border + indent + ~70% opacity), NOT tokenized, NOT scrambled, NOT tracked by the crossing logic. The famous 2003 viral paragraph ("Aoccdrnig to a rscheearch at Cmabrigde Uinervtisy…") lives as a `quote` so its specific scrambled form — the artifact people actually recognize — is preserved exactly as Matt Davis wrote it. The scrambler would otherwise generate a *different* permutation of the same words, which defeats the citational purpose.

Quote paragraphs do not participate in the unscramble experience. The visual blockquote chrome signals "this is a citation, not part of the experiment" so the static state reads as intentional.

### Display copy decisions

- **Section header:** Inter 11px uppercase tracked — "01 — Typoglycemia" — matching the Lab section header pattern (`01 — name`, see also the reserved slot 02 placeholder).
- **Tagline:** "An essay you decode by scrolling." (Newsreader, italic, `clamp(1.25rem, 2.5vw, 1.75rem)`) — sits between the header and the bounded box.
- **Demarcation:** 1px ethos-blue line, the only fixed-in-place element inside the box. Implemented as a `position: sticky; top: 120px` element in flow between the intro and body. 120px viewport offset gives ~4 lines of clean accumulation area above the line once the user has scrolled past the intro. Not the `.blue-hairline` class — the Vault theme overrides that class to cream-tint, and we need ethos-blue.
- **Body type:** Newsreader `clamp(15px, 1.5vw, 17px)`, line-height 1.6, cream on Vault dark. Smaller than a standalone reading page because the box is bounded.
- **Reading column inside box:** centered `mx-auto max-w-[640px]` with `px-6` (`px-4` ≤640px). Ensures comfortable line-length even when the box is wider on desktop.

### Box dimensions & visual cues

- **Height:** `h-[min(75vh,720px)] min-h-[420px]` — caps at 720px on tall screens, scales down to 75vh on shorter viewports, never collapses below 420px.
- **Width:** full-width of the Lab section column. Inner reading column is `max-w-[640px]` centered, so the line length stays readable regardless of viewport.
- **Border + bg:** 1px cream-at-10% border, cream-at-3% background — same chrome as the reserved slot 02 placeholder so the experiment reads as a sibling artifact in a consistent Lab grid.
- **Sticky region background:** N/A in current architecture (the line is a 1px element, not a panel). The bottom fade overlay uses `rgb(18, 18, 25)` — the visual equivalent of the box's 3% cream-over-Vault-dark.
- **Scrollbar:** styled thin scrollbar via `.typo-box` rules in `globals.css` (`scrollbar-width: thin`, custom `-webkit-scrollbar` thumb at 18% cream). Visible always — an explicit "this is scrollable" affordance.
- **Bottom fade:** 64px gradient from `rgb(18,18,25)` to transparent overlaying the box's bottom edge. Fades to `opacity: 0` (300ms) once the user reaches the bottom so the attribution paragraph is fully legible.

### Architectural decisions

- **DOM order is always the correct (clean) word.** Visual scramble is achieved via per-letter `translateX` only. Screen readers therefore read the real essay.
- **`font-kerning: none` and `font-feature-settings: "liga" 0`** on the scrambled word containers — letter widths are pure font metrics, so the same widths apply in scrambled and clean visual states (no jump when ligatures re-form).
- **Per-word state, not per-line state.** Section measures each word's content-Y center inside the box against the demarcation. Words at the same Y transition together, which reads as line-by-line behavior.
- **Box-scoped scroll handler, not page scroll.** A single `requestAnimationFrame`-throttled `scroll` listener on the bounded box (not `window`). Each word reads its position from a shared `Map<seed, contentY>` measured on mount/resize.
- **Scroll chains at the boundaries.** `overscroll-behavior: auto` (browser default) on the box. When the inner scroll hits the top or bottom limit, continued scroll input takes over the outer page. Reader is never trapped in the box — they can scroll past it both directions without targeting outside. Earlier prototype used `contain` (Lab's experience felt like running into a wall at the top/bottom); flipped to `auto` per first-test feedback.
- **No special-case for the intro.** The initial measurement runs the normal crossing logic against the line's actual rect; intro words register as clean because they sit above the line at scroll=0. The `visibility: hidden` until `bodyReady` flag prevents any pre-measurement flash.
- **Demarcation Y is read live each frame.** Instead of reasoning about whether the line is in natural flow or stuck, the scroll handler calls `lineRef.current.getBoundingClientRect()` and converts to content-Y. Same code path regardless of stuck state — fewer branches, no off-by-one at the moment of engagement.
- **Tests via `vitest`.** Added as a `devDependency` with a `test` script; the scrambler's correctness is the entire premise of the experiment, so its invariants must be enforceable, not just documented.

### Lab page integration

- `/lab` slot 01 renders `<TypoglycemiaSection />` (from `components/lab/typoglycemia-section.tsx`) directly — no preview card, no link, the experiment IS the slot content.
- `/lab` slot 02 renders `<ChromaCaptureSection />` (see below).
- AVA was removed from Lab (it has been promoted to a full case study and no longer fits the Lab format).
- The `/lab/typoglycemia` subroute is deleted. Any future inbound links to that URL should redirect to `/lab#typoglycemia`.

---

## Chroma Capture (Lab experiment, slot 02)

Second Lab experiment. A kinetic color-harmony field: soft gradient blobs drift upward, respond to cursor motion, can be popped (which plays a chord), and can be saved as a no-background PNG. Lives **inline** on `/lab` as a bounded playfield — same architectural pattern as Typoglycemia.

### Concept

The experiment fuses two ideas: **lava-lamp motion** (gentle upward drift, soft bodies) and **kuro.store-style gradient design** (multi-color internal gradients, heavy alpha falloff, grain overlay). Three interactive modes:

- **Move (nudge):** cursor velocity perturbs the local velocity field; blobs near the cursor drift in the cursor's direction, with influence decaying as a 2D Gaussian. Blob-blob entrainment (each blob carries its own local velocity field) produces a chain reaction without any rigid-body collision code — pure fluid mechanics.
- **Click (pop):** blob disperses (radius grows, alpha decays) over 350 ms and is recycled. A chord of pitches derived from the blob's gradient hues plays simultaneously.
- **Camera (capture):** a snapshot of the current frame is rendered offscreen at 2× DPR, watermarked, and downloaded as a transparent PNG named after the active chord (`chroma-capture-coral-aqua-violet.png`).

### Physics (correct math, not vibes)

All motion derives from first principles:

- **Buoyant drift** — Newton II with constant buoyancy and Stokes drag:
  - `dv/dt = a₀ − v/τ`, exact discretization `v ← v_terminal + (v − v_terminal)·exp(−dt/τ)`.
  - Frame-rate independent.
- **Horizontal Brownian sway** — Ornstein–Uhlenbeck process (Brownian motion with mean reversion):
  - `dv = −(v/τ_x)·dt + σ·dW`; discretized with exact decay and variance `σ²·τ/2·(1 − exp(−2·dt/τ))`.
- **Cursor velocity field** — 2D Gaussian falloff:
  - `Δv_blob = v_cursor · k · exp(−r²/(2σ²))`.
  - This is the Green's function of the 2D diffusion equation. Linear falloff has a discontinuity at the edge; inverse-square has a singularity at r=0; Gaussian is smooth everywhere and is the correct fluid-mechanics answer.
- **Blob-blob entrainment** — same Gaussian kernel applied pairwise (O(N²) at N≤12 = trivial). This is what produces the chain reaction without collision code.
- **Pop dispersion** — ink-in-water diffusion: `r(t) = r₀·(1 + 0.6·√t)`, alpha `(1 − t)²`.
- **Spawn nucleation** — `dr/dt ∝ (r_target − r)`, discretized to `r ← r_target + (r − r_target)·exp(−dt/τ_grow)`.

### Color science

- **OKLab / OKLCH**, not HSL. HSL is perceptually non-uniform; OKLab is the modern standard (CSS Color Module 4, Tailwind v4). Triadic chords generated in OKLCH look perceptually balanced — unlike HSL triads where one color dominates.
- Triadic chord: three hues 120° apart at C=0.20, L=0.68 (safely in-gamut for most hues, reads as vibrant). Seed hue rotates at 4°/s — one full wheel rotation per ~90 s, smooth perceptual transitions.
- Per-stop jitter ±9° on hue gives each blob's internal gradient a unique-but-cohesive feel.
- Out-of-gamut handling: per-channel clip after gamma encoding. Acceptable for our vibrant palette; chroma-reduction mapping would be more accurate but is overkill here.

### Audio

- **Web Audio synthesis**, no audio file assets (zero bundle bytes, hue→pitch requires synthesis anyway).
- Hue→pitch is logarithmic: `freq = 220·2^(s/12)` where `s` is the snapped semitone count derived from `(hue/360)·24`. Maps 0–360° to A3–A5 (two octaves, mid-range, comfortable to hear).
- **Major pentatonic snap** (intervals 0, 2, 4, 7, 9 mod 12) eliminates the possibility of dissonant intervals — any combination of hues produces a harmonious chord by construction.
- Envelope: 5 ms linear attack, exponential release to 0.0001 over 420 ms (real instruments decay exponentially — linear decay sounds synthetic).
- **Polyphony cap: 8 voices.** Rapid pop-spamming steals oldest voices.
- **Mute toggle** with `localStorage` persistence (key: `chroma:muted`). Default unmuted at subtle master gain (0.14); silent default means most visitors miss the synesthesia layer.
- AudioContext is **lazy-initialized on first pop**. Pop is a click → autoplay policy satisfied.

### Color (v4 — static warm-vibrant palette + soft alpha + feComposite atop)

v1–v3.3 ran mono ethos-blue while shape and motion were tuned. v4 reintroduces color. Lisa's brief: "Pick a color palette that each blob generates as a specific color. Use the color wheel to make sure all colors look good together. ... When two or more blobs start merging, produce a gradient patterned effect ... that preserves blur, texture, and gracefully blends from one color into the next." Reference image: kuro.store-style warm analogous (purple/red/orange/yellow) with grain texture.

**Hard constraint** (carried from a v4 attempt that was reverted): the goo filter values that define silhouette behavior — `stdDeviation=10`, `feColorMatrix` alpha row `18 -7` — **must not change**. Any change to those values is felt as a motion regression because the visible silhouette shape (which is what the eye reads as "the blob") is determined by them.

**Palette decision: curated 6-hue analogous-warm palette** at fixed OKLCH L=0.66 C=0.22.

```ts
CHROMA_PALETTE_HUES = [285, 315, 350, 15, 35, 55]
//                    indigo  magenta  crimson  coral  tangerine  goldenrod
```

- 130° span on the warm side of the OKLCH wheel. Every pair sits within ~70° — any blend produces a vibrant intermediate hue (analogous theory). Cool side (180–270°) excluded entirely: paired with the warm anchors those would produce muddy mid-tones in any overlap, contradicting "gracefully blends." Cyans / teals would also exceed sRGB at C=0.22 and clip.
- L=0.66 is vivid-not-pastel; C=0.22 is high saturation while staying in-gamut across this hue range. Verified by inspection of `oklchToHex` for all six hues.
- **Static, not rotating.** Pre-v4 the chord rotated 4°/s around the wheel; v4 holds the palette fixed. Rationale: Lisa's prompt asked for "a color palette" (singular), and a static palette makes the page identifiable across loads — the same 6 hues are the artwork's signature. If page rhythm starts feeling repetitive in practice, rotation is one line away (`rotateHue` still exists in `color.ts`).
- **Sampling: uniform** per blob via `randomPaletteHue`. No weighting, no avoiding repetition. With 6 hues and ~18 blobs on screen, the law of large numbers gives every chord visible at any moment.
- **Per-blob hue array carries 3 values** (`makeBlobHues`): primary (the visual color) + 2 secondary palette samples. Visual rendering only consumes `hues[0]`; the secondary hues drive the audio chord on pop so the pop sound stays multi-note even though the visual is single-color.

**Merging — the gradient effect at overlap.** This is the trick. Three layers cooperate:

1. **Soft alpha gradient per blob.** Each blob renders as a radial gradient — opaque core fading to transparent edge — instead of a hard-alpha ellipse. Stops: `[0.0,1.0] [0.4,0.85] [0.7,0.55] [0.9,0.25] [1.0,0]`. This is what produces "stronger opacity in the middle." On its own, the soft alpha would shrink the visible silhouette dramatically because the goo filter's `18a-7` threshold cuts at blurred alpha ≈ 0.39.
2. **`RENDER_OVERSCAN = 1.25`** compensates. Each blob is drawn at 1.25× its `currentRadius` so the threshold lands roughly where v3.2's hard ellipse edge was. Net visible silhouette ≈ identical to v3.2 → motion read preserved. The 1.25 was estimated from the alpha-stop profile and the threshold position; if it looks off it can be tuned in the constant without touching anything else.
3. **`feComposite operator="atop" in="SourceGraphic" in2="goo"`** appended to the SVG filter chain. The goo layer (blur + threshold) provides the merged silhouette mask; the atop step paints SourceGraphic colors inside that mask, leaving everything outside it transparent.

How this produces the gradient at overlaps:

- Two blobs of different palette hues approach. Their soft-alpha gradients overlap at the edges first. Canvas alpha compositing blends the source colors smoothly across the partial-alpha region (e.g. 0.4 alpha A over 0.4 alpha B = ~30% A + ~30% B by area-weighted color).
- The goo silhouette merges into a single amorphous shape via the blur+threshold (unchanged from v3.2).
- `feComposite atop` shows the soft-blended source colors INSIDE that merged silhouette. In gooey-neck regions where neither blob's source has alpha, the blurred goo layer (a darker mix from the blur) fills in — which looks like a soft mid-tone gradient between the two blob hues.

Critically, `atop` (not `feBlend`) is the right operator. `feBlend in="SourceGraphic" in2="goo"` with `mode="normal"` would extend the visible silhouette out to wherever SourceGraphic has any alpha at all (including the rendered overscan halo) — a motion read regression. `atop` clips strictly to the goo silhouette so the boundary is identical to v3.2.

**Grain at 14% via `globalCompositeOperation = "source-atop"`** (up from 6% multiply). source-atop blends grain colors only where the canvas is already opaque (i.e. inside the blob soft-alpha region) and leaves alpha untouched, so the silhouette boundary set by the goo threshold is preserved. The previous 6% multiply slightly extended alpha into the gap regions (relying on the threshold to cut it) — source-atop is the cleaner model and the higher 14% reads as the analog film texture Lisa asked for.

**Capture parity.** The capture pipeline in `lib/chroma/capture.ts` replicates the full v4 filter chain in JS: render → blur → threshold → composite SourceGraphic atop via `globalCompositeOperation = "source-atop"` → grain inside silhouette → watermark. The 14% grain is now included in the PNG (v3 omitted grain from captures; v4 includes it because Lisa explicitly called out "texture" as part of the artifact).

**Filename: `chroma-capture-{slug}-{YYYYMMDD-HHMMSS}.png`.** With the static palette the slug alone would collide across captures; the timestamp guarantees uniqueness and makes the downloads folder sort chronologically.

**What this does NOT change**: `physics.ts` (untouched), `blob.ts` (untouched), the goo filter's blur σ and threshold (untouched), cursor impulse model (still v3.3 contact-based), spawn cadence and pre-roll (still v3.2). The change set is strictly: palette constants, render function (drawBlob + grain mode), SVG filter (one new primitive), and capture pipeline (mirrors the new filter step). If color reads wrong Lisa can revert to mono by reverting the v4 commit without disturbing motion.

### Cursor impulse (v3.3 — contact-based, not Gaussian field)

v1/v2/v3 modeled the cursor as a Gaussian field with σ=200 px and a 3σ cutoff at 600 px — i.e. one cursor anywhere on the canvas was directly perturbing every blob within a ~1200 px sphere. Lisa flagged the symptom: "cursor is impacting blobs it is nowhere near. Cursor should only impact blob movement if it touches the edge of a blob (like reality)."

**Diagnosis**: the Gaussian field was conceptually wrong. It implicitly modeled the cursor as a *fluid source with its own pressure field*. Physically the cursor is a *solid object* that displaces fluid only where it touches. The Gaussian made sense for **blob-to-blob** entrainment (a moving blob really does drag the fluid around it, which couples to other blobs through the medium), but not for the cursor itself.

**Resolution**: contact model.

- **`applyCursorImpulse`** now does a direct contact gate: if `hitTest(blob, cursorPos, CURSOR_CONTACT_SCALE)` returns true, apply the full `cursorVel * cursorImpulseScale` to that blob. Otherwise no impulse.
- **`CURSOR_CONTACT_SCALE = 1.2`** — the blob's elliptical body inflated 20 %. Covers the ~10 px goo silhouette expansion plus a small tactile forgiveness, so contact registers at the *apparent* edge the user sees, not the raw ellipse.
- **`hitTest` is now parameterized** with an optional `scale` (default 0.8 — preserves pop targeting). Single source of truth for blob ellipse hit math; pop and nudge use the same function with different scales.
- **`PHYSICS_DEFAULTS.cursorSigma` removed** — no longer used. The `sigma` parameter dropped from `applyCursorImpulse`'s signature in the same pass.
- **`gaussianImpulse` stays** — still the right model for `applyBlobEntrainment`, which propagates a touched blob's motion through the fluid coupling to nearby blobs. That's the only path by which non-contact blobs respond to the cursor now: cursor touches A, A's velocity changes, fluid coupling pulls B and C toward A's new trajectory. Two-step propagation, not field-wide.

**Tradeoff**: fewer blobs respond to a single cursor sweep. Compensating factor: each touched blob feels the full impulse (no Gaussian-tapered weakening), and blob-blob entrainment carries the disturbance outward in a physically realistic way. If the result reads as too sparse during heavy mouse activity, options are: bump `CURSOR_CONTACT_SCALE` to 1.4–1.5 (wider effective touch), increase `cursorImpulseScale` (stronger per-touch impulse), or boost `blobEntrainScale` (stronger fluid coupling). None require revisiting the Gaussian-field model.

### Spawn (v3.2 — pre-roll + cadence calibrated to rise speed)

The strict "blobs only enter from the bottom edge" rule (set in v3.1) creates a tension with first-paint UX. At `vTerminal = -10 px/s` and a ~720 px canvas, a single blob takes ~72 s to traverse from bottom to top. To distribute 18 blobs evenly across that traversal, the cadence has to be ~4 s per spawn. But waiting 72 s for the field to fill on first load is unusable.

A faster initial cadence (e.g. 350 ms per spawn) makes 18 blobs enter within 6 s but they clump into a horizontal raft 3.5 px apart vertically and rise together as one merged mass. Lisa saw this and rejected it.

**Resolution**: pre-roll the physics on mount in CPU-only virtual time before the first paint.

- `PREROLL_VIRTUAL_DURATION_MS = 90_000` — one full traversal plus margin for steady-state spawning to begin.
- `PREROLL_STEP_MS = 50` — 1800 fixed-dt steps. O(N²) entrainment at N=18 totals ~580 k ops, completes in ~10–30 ms of real CPU time.
- Virtual clock anchored to `realStart − PREROLL_VIRTUAL_DURATION_MS` so every blob's `stateStartMs` lands in the *past* relative to `performance.now()` after the pre-roll finishes. Pop-animation arithmetic and any other wall-clock-since-birth math stays correct in the real-time loop.
- The pre-roll runs the same physics order as the real-time tick (chord rotation → entrainment → step → lateral clamp → recycle → cadence-gated spawn). No cursor activity during pre-roll. Result: the field at first paint contains ~18 blobs spaced ~40 px apart vertically with cumulative spawn jitter — exactly a "lava lamp that has been running."

**Steady-state cadence**: `STEADY_CADENCE_BASE_MS = 3500`, `STEADY_CADENCE_JITTER_MS = 1000` → 3.5–4.5 s between spawns. Mean 4 s matches the bottom-to-top exit rate (18 blobs × 4 s ≈ 72 s traversal). ±500 ms jitter scatters per-blob vertical spacing by ~5 px per blob — enough to break the metronome feel, not enough to feel chaotic.

**Why not "snapshot of already-rising"** (initial blobs at random Y in the lower 60 %, full radius, upward velocity)? Lisa explicitly chose strict bottom-only entry over that approach. Pre-roll preserves the constraint cleanly without compromising the visual.

### Rendering (v3 — CSS-filter goo, canonical pattern, mono first)

v2 (apply SVG goo filter via `ctx.filter = "url(#chroma-goo)"`) **didn't work in Chrome**. The blobs rendered as hard-edged ellipses with no merging — Lisa's screenshot: "shapes aren't merging and they are zooming off the screen." Canvas 2D's `ctx.filter` with `url()` references is unreliable across browsers; this is a known gotcha.

Lisa's directive: "Remove all color, work on getting the shape and motion correct. Look for the most popular lava lamp code on github and start with that."

The canonical pattern across every popular implementation (n3r4zzurr0/canvas-liquid-effect [120★], Saganaki22/LofiLamp, Bret Cameron's "How To Make Lava Lamp-Style Blob Animations" tutorial, the CSS-Tricks gooey demos) is the same: **render shapes at full resolution, then apply `filter: url(#goo)` as a CSS property on the container element**. The CSS filter is applied by the browser compositor — reliable everywhere — not by the canvas 2D API.

v3 implements exactly that pattern:

- **Canvas, not SVG, not WebGL.** Canvas is still right for the export path and physics performance.
- **`filter: url(#chroma-goo)` applied as a CSS style on the canvas element**, defined in the canvas component's `style` prop. The SVG `<filter>` lives in the section wrapper.
- **No `ctx.filter` calls anywhere** in the render pipeline. The render code emits solid alpha shapes; the compositor handles the goo.
- **No half-resolution offscreen** — removed in v3. With CSS doing the blur in the compositor, the canvas itself just paints solid ellipses at full resolution.
- **Mono ethos-blue blobs for now.** Color will return in v4 after Lisa approves the shape + motion. Stripping color isolates the variable being tuned.
- **SVG goo filter values: the canonical `stdDeviation=10` + matrix multiplier `18` + offset `-7`.** Same numbers as n3r4zzurr0 and Bret Cameron — proven across thousands of implementations.
- **No `feComposite` primitive.** Bebber's original Gooey pen uses `feComposite atop` to preserve the SourceGraphic INSIDE the goo silhouette — useful when the source has sharp detail you want to keep (text, icons). For us the source is a uniform solid color, and `atop` would clip the goo silhouette by the source alpha, leaving the gooey *necks* empty. Without `feComposite` the filter output is just the alpha-thresholded blurred source, which is exactly what we want.
- **Per-blob shape: stretched ellipse with velocity-aligned major axis** (v2 carryover). Each blob has `stretch` (aspect ratio, capped at +0.15 from velocity + ±0.08 from slow oscillation, so range is roughly 0.92–1.23 — subtle, not squashed) and `stretchAngle` (radians, tracks velocity direction with τ=1s).
- **Physics retuned for lava-lamp motion.** v3 first cut (`vTerminal -14`, `sigmaDriftX 5`, `cursorImpulseScale 0.45`) was still too fast — Lisa: "way way way too fast and blobs are zooming off the screen." v3.1 retune: `vTerminal -10 px/s` (~80s to traverse), `sigmaDriftX 2` (horizontal RMS ~5 px/s, half of vertical), `tauDriftX 14s` (slow drifting motion, not jitter), `cursorImpulseScale 0.10` (4× gentler — a 500 px/s swipe maxes a blob at 50 px/s), `blobEntrainScale 0.015` (chain reaction is a whisper). Vertical buoyancy dominates by 2×.
- **Velocity cap (`maxSpeed: 40`).** `capSpeed(vel)` in `physics.ts`, called inside `stepBlob` before position integration. Any blob whose velocity magnitude exceeds 40 px/s gets rescaled to 40 px/s, direction preserved. Real lava blobs don't ballistic-fire across the lamp no matter what shakes the room — this enforces that.
- **HARD lateral clamp (`constrainLateral`)**, not a soft wall force. v3 first cut used a linear acceleration ramp toward the inside near the edges, but fast lateral velocities (cursor nudges, OU peaks) could overrun it. v3.1: `pos.x` is clamped to `[radius, width − radius]` every frame, and any outward velocity component is zeroed when the blob is at the wall. Real lava-lamp glass is rigid, not springy — this matches it exactly. Inward motion is preserved so the blob can drift away from the wall once the OU process re-energizes velocity inward.
- **No lateral entry or exit, ever.** `randomEdgeSpawn` spawns 100% from the bottom edge (real lava lamps load from the heated base). `isOffscreen` only considers vertical exits as the recycling trigger. Lateral exits are physically impossible thanks to `constrainLateral` — the defensive lateral check in `isOffscreen` is just belt-and-suspenders.
- **Live render at devicePixelRatio (capped at 2)**; **capture at 2× DPR off-screen with a manual JS replication of the goo filter pipeline** — render blobs → canvas-native blur → walk ImageData and threshold alpha exactly like `feColorMatrix` would (`a' = clamp(a·18 − 7·255, 0, 255)`) → composite onto output canvas → drawWatermark → `toBlob`. Slow (~tens of ms) but only runs once per capture. Bake constants matched to the SVG filter so the PNG looks identical to the live render.
- **Grain overlay:** unchanged (256×256 random-noise tile, 6% multiply alpha). Note: because grain is drawn on the canvas, the CSS goo filter applies to it too. v3 acceptable. If grain reads weird post-filter, it can move to a separate non-filtered DOM layer in a future pass.
- **Watermark, capture flash, no-background PNG**: unchanged from v2.

### Rendering (v2 — superseded)

The v2 approach (apply SVG filter via `ctx.filter = "url()"`, render multi-color gradient ellipses to a half-res offscreen, draw through the filter to main canvas) was based on the same SVG-filter math as v3 but routed the filter through the wrong API. `ctx.filter` with `url()` is unreliable in Chrome — the filter silently doesn't apply. Kept here only as historical record of why v3 looks different. Earlier draft below:

- **Canvas, not SVG, not WebGL.** `canvas.toBlob()` is the right export path for transparent PNG; SVG-to-PNG of blur filters is browser-buggy; WebGL/raymarched SDF would introduce 3D shading we explicitly do not want (Lisa: "I don't need the 3D effect").
- **Per-blob shape: stretched ellipse with linear gradient along the major axis.**
  - Each blob has `stretch` (aspect ratio, 1 = circle) and `stretchAngle` (radians).
  - `stretch` tracks `velocity_magnitude / 50` (saturating at +0.55) plus a slow `0.2·sin(shapePhase)` oscillation per blob — moving blobs elongate along their motion vector, resting blobs gently breathe.
  - `stretchAngle` smoothly tracks `atan2(vy, vx)` with τ=0.8 s — direction changes are fluid, not snappy.
  - Linear gradient stops are the blob's 2–3 hues spaced along the major axis, drawn in OKLCH at L=0.68 C=0.20 → multi-color smear inside every blob.
- **Metaball merging via SVG goo filter** (the canonical n3r4zzurr0 / canvas-liquid-effect approach):
  - All blobs are drawn to a **half-resolution offscreen canvas** with their stretched-ellipse + gradient.
  - The offscreen is re-drawn into the main canvas with `ctx.filter = "url(#chroma-goo)"`, where the SVG filter is a `feGaussianBlur(stdDeviation=10)` followed by a `feColorMatrix` that operates **on the alpha channel only**: `0 0 0 22 -10`. This boosts and thresholds alpha — soft alpha edges from blur snap into hard amorphous silhouettes — while leaving RGB untouched so the internal gradients survive.
  - Where two blobs' alpha fields overlap during blur, the threshold produces a smooth merged shape with both gradients riding through it. True metaball, not approximation.
- **Why not `ctx.filter = "blur(10) contrast(20)"`?** CSS `contrast()` applies to RGB and alpha together — it would clip the multi-color gradients into pure saturation. `feColorMatrix` lets us boost alpha alone.
- **Half-resolution offscreen** cuts per-pixel cost by 4× and the upscale step adds free softening. A single `HTMLCanvasElement` is allocated once and reused across frames; `ensureMetaballSize()` resizes it when the visible canvas resizes.
- **Hit-test honors the ellipse.** Pop detection transforms the point into the blob's local rotated frame and tests against `(x/a)² + (y/b)² ≤ 1`, where `a = radius·stretch·0.8`, `b = radius/stretch·0.8`. Hit area is slightly inside the visual silhouette so pops feel intentional and don't fire on the gooey neck where two blobs are merging.
- **Live render at devicePixelRatio (capped at 2)**; **capture at 2× DPR** off-screen regardless of device, for crisp downloads. Both paths use the same render pipeline and the same SVG filter — the filter is referenced by id, so the same DOM `<filter>` element serves both.
- **Grain overlay:** 256×256 random-noise tile (generated once at mount via `createImageData`), drawn via `createPattern(off, 'repeat')` with `multiply` blend at 6% alpha. Drawn **on top** of the goo'd blobs so grain reads as texture across the whole field. Static — animating it would look like TV static, not film grain.
- **Watermark** drawn into the capture canvas before `toBlob` — text `chroma capture · lisaaufox.com` in ethos-blue on a cream-tinted rounded-rect scrim so it's readable on any background a blob might land on.
- **Capture flash:** white overlay drawn on the live canvas, rises to ~80% opacity in 40 ms, decays to 0 over the remaining ~180 ms. ~220 ms total. Camera-shutter feel.
- **No-background PNG:** grain is OFF in the captured frame, watermark is ON. The cream-grained substrate is the LIVE gallery framing; the PNG is the artifact, droppable on any background.

### Why we rejected the v1 render approach

Stacked radial gradients per blob produced "soft clouds": each blob had a fuzzy edge that bled into background but never **merged** with its neighbors. Two adjacent blobs read as two distinct clouds overlapping, not one fluid mass. Real lava-lamp wax merges into a single silhouette where it touches — that requires alpha-thresholding at the *composite* level, not per-blob. Hence the goo filter pipeline.

### Interaction details

- Cursor velocity is computed from the cursor's per-frame Δposition, low-passed at a 60 ms time constant to smooth jitter without lagging response. Below ~4 px/s magnitude no impulse is applied (avoids constant gentle nudging from idle micro-jitters).
- **Pointer events** (not mouse / touch separately) for mouse, pen, and touch parity.
- `touch-action: none` on the canvas so finger-drag inside the box is the nudge gesture, not page scroll. Pointer-up / pointer-cancel releases `cursor.inside`, so the outer page reclaims scroll once the gesture ends.
- Click-to-pop is a single `pointerdown` → `hitTest()` against alive blobs → `markPopping()` + `audio.playChord(blob.hues)`.
- Reduced motion (`prefers-reduced-motion: reduce`) slows the physics integration by 90%, leaving the field nearly still but still responsive to clicks. Audio is unaffected.

### Lifecycle

- Initial population: 10 blobs at random in-view positions (6 on mobile width ≤ 640).
- Continuous spawn-on-deficit: whenever blob count drops below target, new blobs spawn at random off-screen edges (60% bottom, 20% left, 20% right) with small inward velocity.
- Popped blobs are removed once their dispersion animation completes (~360 ms).
- Drifted-off blobs are removed (margin = 2× target radius).
- rAF loop is paused on `document.visibilitychange` (tab hidden) — no wasted GPU.

### File layout

- `lib/chroma/color.ts` — OKLab/OKLCH math, triadic chord generation, hue rotation.
- `lib/chroma/color-names.ts` — 21-entry vibrant-name dictionary, hue→name lookup with cyclic distance.
- `lib/chroma/physics.ts` — Vec2 type, OU/buoyancy steppers, Gaussian impulse, nucleation, dispersion, tuning constants (`PHYSICS_DEFAULTS`).
- `lib/chroma/blob.ts` — Blob shape, lifecycle helpers (create / step / pop / hit-test / entrainment), random off-edge spawn.
- `lib/chroma/render.ts` — Canvas rendering pipeline (blobs → grain → watermark → flash), grain pattern generator.
- `lib/chroma/audio.ts` — `ChromaAudio` singleton with lazy WebAudio init, pentatonic-snap pitch, AR envelope, voice limiter, mute persistence.
- `lib/chroma/capture.ts` — 2× DPR offscreen render + `toBlob` + filename builder + download trigger.
- `components/lab/chroma-capture-canvas.tsx` — Canvas mount, rAF loop, pointer handling, capture API forwarded via `useImperativeHandle`.
- `components/lab/chroma-capture-section.tsx` — Section wrapper (mirrors Typoglycemia structure), header, subtitle, camera + mute buttons, capture toast.

### Why no rigid-body collision

With the goo filter, two overlapping ellipses merge into a single fluid silhouette automatically — there's nothing to "collide" in the rigid-body sense. They're not bubbles with a surface-tension membrane, they're a continuous fluid field. The chain reaction the user observes from cursor nudges comes from blob-blob entrainment (each blob's velocity perturbs neighbors via the same Gaussian field that cursor uses), not from physical contact. Rigid-body collision would add code complexity for no visual gain and would actively *fight* the metaball metaphor — touching blobs should *merge*, not bounce.

### Why pentatonic, not chromatic

Hue→pitch mapped continuously would produce minor seconds and tritones depending on hue distance — dissonant intervals that sound unpleasant. Snapping every pitch to the major pentatonic scale (a five-note scale with no minor seconds and no tritones) guarantees any combination sounds musical by construction. A blob with three internal hues plays a three-note chord; even if those hues are close together, the snap collapses them to one note (an interval, not a dissonance) and the chord still sounds intentional.

### Filename naming

Captures are saved as `chroma-capture-<slug>.png` where `<slug>` is built from the three triadic chord hues at capture time, mapped to vibrant names via `color-names.ts`. Duplicates collapse so a tight chord can produce a two- or one-name filename. Names are curated to be vibrant only (`coral`, `aqua`, `violet`, `marigold`, `emerald`, `cobalt`, …) — no `grey`, `tan`, `beige`. Because chroma is held high (C=0.20 in OKLCH), muddy names should never appear.
