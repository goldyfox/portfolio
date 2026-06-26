# Session Log

Running daily log of decisions, references, and context. Future agents: **read this before proposing changes.**

---

## 2026-06-25 — Session 33: Resume swap

### 19:30 — Replace site resume with AufoxResume2026.pdf
- Files: `public/resume.pdf` (replaced).
- What: Copied `~/Downloads/AufoxResume2026.pdf` → `public/resume.pdf` (372KB). Footer link unchanged at `/resume.pdf`.
- Decisions: None.

### 21:20 — Resume refresh (AufoxResume2026-new.pdf)
- Files: `public/resume.pdf` (replaced).
- What: Swapped in Lisa's revised `~/Downloads/AufoxResume2026-new.pdf` (372KB). Same footer path `/resume.pdf`.
- Decisions: None.

## 2026-06-24 — Session 32: Contact form IP logging

### 21:00 — Homepage revenue stat $8.2B → $18B
- Files: `components/portfolio/personal-intro.tsx` (edited).
- What: Updated Status block revenue figure on homepage intro from $8.2B to $18B. `$` in Inter Bold (`font-sans font-bold`) for full vertical bar; `18B` in Newsreader Bold.
- Decisions: Homepage only; case study pages still reference $8.2B.

### 21:15 — Apple Touch Icon for iOS home screen
- Files: `app/apple-icon.tsx` (created).
- What: Added 180×180 PNG apple-touch-icon generated at build from `app/icon.svg` (cream + blue triangle). Next.js emits `<link rel="apple-touch-icon">` automatically.
- Decisions: Same mark as favicon; no separate home-screen design.

### 21:25 — Inbox homepage tile: add missing `elevate` glow
- Files: `app/page.tsx` (edited).
- What: Inbox-ads tile was missing the `elevate` prop on `ProjectTile` — FMUX and GenAI already had it. Adds z-lift above grid overlay + `box-shadow: 0 20px 50px rgba(19,19,236,0.1)`.
- Decisions: None — matches original intent when `elevate` was made reusable for all live tiles.

### 20:15 — GenAI tile: desktop greeting body p(34)
- Files: `components/portfolio/home-ui/genai-template.tsx` (edited).
- What: Desktop greeting heading→body gap tuned from p(30) to p(34). Mobile panel layout unchanged.
- Decisions: None.

### 20:05 — GenAI tile: mobile panel at 767px viewport, not tile width
- Files: `components/portfolio/home-ui/genai-template.tsx`, `components/portfolio/use-tile-compact.ts` (edited).
- What: Mobile greeting panel layout was applying on desktop because the grid column is often <420px wide. Switched to `useMobileViewport(767)` so desktop grid always uses Figma coords; mobile stack keeps tuned panel offsets + taller greeting slot.
- Decisions: Viewport breakpoint matches homepage `min-[768px]` grid.

### 19:50 — GenAI tile: narrow panel spacing (greeting matches questions)
- Files: `components/portfolio/home-ui/genai-template.tsx` (edited).
- What: On narrow tiles (<420px), greeting body slot drops p(30→35) so heading→body gap matches questions (22 design units). Taller greeting slot for 2-line wrap; questions block + panel height shift down in lockstep. Desktop layout unchanged.
- Decisions: Panel offsets only — no padding or font-size changes.

### 19:40 — Revert unauthorized GenAI tile padding change
- Files: `components/portfolio/home-ui/genai-template.tsx` (edited).
- What: Restored fixed `padding: 8%` on GenAI tile. Mobile spacing pass had dropped it to 5% on narrow tiles without approval; that shifted card scale and cramped the greeting panel. No font-size values were changed in code — only outer inset.
- Decisions: Do not tune GenAI tile in mobile passes unless asked.

### 19:25 — FMUX tile: measured fly distance (fixes sent/welcome overlap)
- Files: `components/portfolio/home-ui/fmux-chat.tsx` (edited).
- What: Fixed cqw constants couldn't account for welcome text wrap at every tile width. Fly distance + "Sent" label now measured from the welcome bubble's rendered bottom via ResizeObserver; re-measured before each send cycle and on font load.
- Decisions: Drop narrow breakpoint tuning; layout-driven px transforms instead.

### 19:10 — FMUX tile: fix sent-bubble overlap on narrow/mobile (superseded)
- Files: `components/portfolio/home-ui/fmux-chat.tsx` (edited).
- What: Welcome text wraps on narrow tiles, making the grey bubble taller while fly distance stayed the same — sent pill landed on top of it. Narrow mode now flies ~7.5cqw less, slightly smaller welcome type, reverted bad stackBottom/sentLabelTop nudges from prior mobile pass.
- Decisions: Tune fly constants per breakpoint, not stack position alone.

### 18:35 — Contact focus state + mobile homepage tile spacing
- Files: `components/portfolio/contact-field.tsx`, `components/portfolio/use-tile-compact.ts` (created), `app/contact/page.tsx`, `app/globals.css`, `app/page.tsx`, `components/portfolio/project-tile.tsx`, `components/portfolio/home-ui/{inbox-surfaces,genai-template,fmux-chat}.tsx` (edited).
- What: Contact fields — removed browser focus box (outline-none + globals backup); floating labels now move to `top-0` on focus/fill instead of translate hack that overlapped the ring. Homepage mobile — increased tile stack gap (`gap-y-32`), compact scaling for inbox triptych in short 16:9 tiles, reduced GenAI card inset padding on narrow tiles, FMUX stack nudge on narrow tiles.
- Decisions: Extracted shared `ContactField` + `useTileCompact`/`useTileNarrow` hooks for responsive tile animations.

### 19:30 — Deploy: drop rsync --chmod (unsupported on macOS 2.x)
- Files: `scripts/deploy.sh` (edited).
- What: `--chmod=D755,F644` fails on macOS rsync. Removed; post-upload SSH `find … chmod` on server replaces it. Deploy verified.
- Decisions: None.

### 19:20 — Deploy: fix permissions (don't block), block secrets only
- Files: `scripts/normalize-deploy-permissions.sh`, `scripts/verify-deploy-bundle.sh`, `scripts/deploy.sh` (created/updated).
- What: Before build, normalize `public/` (fix 600 files / 700 dirs → 644/755). After build, normalize `out/` the same way. Verify step **only blocks secrets** (`.env*`, keys, pem, etc.) — never blocks on permissions. rsync excludes secrets as belt-and-suspenders.
- Decisions: Fix restrictive modes in place; do not fail deploy for permission issues in public/out.

### 19:05 — Disable Next.js Link prefetch (fixes HEAD/CORS on static export)
- Files: `components/site-link.tsx` (created), `app/layout.tsx`, `components/main-nav.tsx`, `components/footer-nav.tsx`, `components/portfolio/back-to-index.tsx`, `components/portfolio/project-tile.tsx`, `components/portfolio/catalog-filter.tsx`, `app/ethos/page.tsx`, `next.config.ts`.
- What: Next.js 16 `<Link>` prefetch was issuing `HEAD https://lisaaufox.com/` (then following DreamHost apex→www redirect → CORS failure). All internal links now use `SiteLink` with `prefetch={false}` — correct fix for static export on Apache.
- Decisions: Full prefetch disable site-wide on static export; use plain navigation (full page load) instead of broken RSC prefetch.

### 18:55 — Apex-only canonical: fix contact CORS / www redirect
- Files: `lib/site-url.ts` (created), `app/layout.tsx`, `app/contact/page.tsx`, `scripts/contact-submit.php.template`, `scripts/deploy.sh`, `public/.htaccess`.
- What: Production contact form now **always** POSTs to same-origin `/contact-submit.php` (never env-baked absolute URLs that could cross apex/www). `SITE_ORIGIN` constant + canonical metadata. PHP handles OPTIONS + CORS for apex only. Deploy message + htaccess comments updated.
- Decisions: **Canonical host is apex only** (`https://lisaaufox.com`). www redirects to apex. DreamHost panel should not force apex→www.

### 18:40 — Formspree domain spam: forward Referer/Origin in PHP proxy
- Files: `scripts/contact-submit.php.template` (edited).
- What: Formspree "Restrict to Domain" checks HTTP `Referer`/`Origin` on the API request, not custom JSON fields like `refererHeader`. PHP curl was posting to Formspree without those headers → unauthorized domain spam. Proxy now forwards client Referer, Origin, User-Agent, Accept-Language; falls back to `https://lisaaufox.com`. Deployed.
- Decisions: Formspree setting should stay `lisaaufox.com` (no `www` prefix) since www redirects to apex.

### 18:25 — Canonical redirects: www → lisaaufox.com + HTTPS
- Files: `public/.htaccess`, `app/layout.tsx` (edited).
- What: Added Apache rules — `www` → apex in one hop (includes HTTPS), then HTTP → HTTPS for apex. Moved redirect rules before internal `/index/` rewrites. Updated `metadataBase` to `https://lisaaufox.com`. Deployed.
- Decisions: **Canonical host is apex (no www).** ACME `.well-known` still exempt.

### 18:15 — PHP contact proxy adds IP behind DreamHost proxies
- Files: `scripts/contact-submit.php.template` (created), `scripts/deploy.sh`, `app/contact/page.tsx`, `env.deploy.example` (edited).
- What: Browser now POSTs to `/contact-submit.php` on DreamHost. PHP reads client IP from `X-Forwarded-For` (first hop), `X-Real-IP`, `Client-IP`, `REMOTE_ADDR`; forwards to Formspree with `ipAddress`, `ipSource`, `xForwardedFor`, `remoteAddr`, plus server headers. Formspree URL stays server-side (injected at deploy). Rate limit + honeypot preserved. Deployed.
- Decisions: PHP proxy on shared hosting (DreamHost supports it); Formspree ID not baked into client JS anymore. Local dev: set Formspree URL in `.env.local` to bypass PHP.

## 2026-06-23 — Session 31: Navigation + Doodles layout

### 17:50 — .htaccess: block directory listings, fix /index/* 403s
- Files: `public/.htaccess` (edited).
- What: `-Indexes` alone was 403ing `/index/inbox-ads/` etc. because Next.js static export puts `app/index/*` pages at `/index/index/…` on disk while site links use `/index/…`. Added `DirectoryIndex index.html`, internal rewrite rules for catalog + case-study slugs, and kept ACME + HTTPS rules. Deployed.
- Decisions: URL stays `/index/inbox-ads/` in the browser; Apache serves from `/index/index/inbox-ads/` internally. Long-term alternative is renaming `app/index/` route folder to avoid double-nesting.

### 20:30 — First production deploy to DreamHost shared
- Files: none (deploy only via `npm run deploy`).
- What: Built static export and rsync'd 232 files to `/home/dh_au54yu/lisaaufox.com`. DNS now points both apex and www to DreamHost (`173.236.198.112`). Contact form not configured — `NEXT_PUBLIC_CONTACT_FORM_URL` still unset in `.env.deploy`.
- Decisions: None.

### 19:55 — Deploy pivoted to static export (DreamHost shared/unlimited)
- Files: `next.config.ts`, `scripts/deploy.sh`, `env.deploy.example`, `public/.htaccess`, `app/contact/page.tsx`, `app/opengraph-image.tsx`, `archive/api/contact-route.ts` (moved from `app/api/contact/`), `scripts/dreamhost-server-setup.sh` (deleted).
- What: Lisa is on **Shared/unlimited** — no Node.js. Switched from standalone/PM2 to **`output: "export"`** + rsync `out/` to web root. Contact form now posts to **Formspree** via `NEXT_PUBLIC_CONTACT_FORM_URL` (baked at build from `.env.deploy`). Resend API route archived under `archive/api/`. Apache `.htaccess` for 404 + HTTPS redirect.
- Decisions: Shared hosting = static only. Formspree replaces Resend for contact until/unless she moves to VPS. `rsync --delete` wipes server files not in `out/` — back up old site first.

### 19:45 — DreamHost deploy script (Node standalone + rsync) — superseded by static export above

### 18:20 — Resume logo swapped to favicon triangle (vector)
- Files: `public/resume.pdf` (edited in place).
- What: Replaced the old Autodesk-style "A" mark (9 stacked vector paths, bbox ≈ x119–158 / y36–73) with the site favicon triangle from `app/icon.svg` (`points 16,5 5,25 27,25`, ethos-blue). Removed the old paths via `apply_redactions(graphics=LINE_ART_REMOVE_IF_TOUCHED)` on the logo rect (capped above the "Lisa Aufox" bbox at y74.6 so text was untouched), then drew the triangle as a true vector polygon (PyMuPDF `Shape.draw_polyline` + `finish(fill=blue, closePath=True)`). Vector = infinitely sharp / fully antialiased at any zoom, not a raster paste. Mapped the favicon's 32×32 viewBox into a 38pt square centered on the old mark's center, anchored at the same top edge. Verified: exactly 1 top-region drawing remains (the blue triangle).
- Decisions: Used vector polygon (not a high-DPI PNG) for crispness + small file size (resume now 32.9KB). Favicon's cream background square omitted — only the triangle is drawn so it sits on the resume's own ground.
- Follow-up (18:23): Lisa wanted it bigger — resized the triangle to fill the old mark's **full** footprint exactly (apex at top-center, base corners at the old bbox: rect 119.3/36.0/158.2/73.0; width 38.9pt × height 37pt). The favicon's internal padding had made the first pass smaller than the old "A".
- Follow-up (18:30): solid triangle felt heavy — changed to a **hollow outline**. Redacted the solid fill and redrew as a stroked triangle (`finish(color=blue, fill=None, width=4.5, closePath=True, lineJoin=0)` for sharp mitered corners). Centerline inset by ~W/2 so the outer stroke edge stays within the old footprint. Reads much lighter; still one vector shape. (Tunable: bump `width` for a heavier rule.)

### 18:35 — Resume name set in Newsreader (matches portfolio titles)
- Files: `public/resume.pdf` (edited in place).
- What: Replaced the "Lisa Aufox" name from FiraSans-ExtraBold 24pt → **Newsreader Medium Italic** 34pt (ethos-blue), matching the site's title font (`--font-newsreader`, the `.page-title`/`font-serif italic` headline style). The project ships the face locally at `assets/fonts/newsreader-500-italic.woff`; converted woff→ttf with fontTools (`TTFont.flavor=None`), redacted the old name glyphs (tight rect between the triangle at y≈70.8 and the subtitle at y≈120), and re-set the text at the original baseline (origin 87.0, 103.7) via `insert_text(fontfile=…)`. `subset_fonts()` keeps the embed small (file 37KB).
- Decisions: Used Newsreader **Medium Italic** (the available local italic; titles are 300–400 but 500 italic is the shipped weight) at 34pt to roughly match the old cap-height/footprint. Only the name changed — "Product Designer" subtitle + body stay Inter/sans. Size tunable.
- Follow-up (18:58): Lisa — "too big, not thin enough, not centered." Reduced 34pt → **24pt** and **centered** the name on the shared axis x≈139.8 (midpoint of triangle center 138.75 and contact-block center 140.78), positioning via measured glyph width (`fitz.Font.text_length`) minus half-width, not left-anchored.
  - **Bug fixed:** re-inserting onto the already-Newsreader'd PDF reused the existing font resource named `news` → glyphs rendered as .notdef tofu boxes. Fix: rebuild from the clean pre-font base (outlined triangle + original FiraSans name) and insert with a unique fontname (`NewsReaderItalic`). Lesson: when re-embedding a font into a PDF that already has one, use a fresh/unique fontname to avoid resource collision.
  - **"Thinner" still open:** only Medium (500) italic ships locally; a true light (300/200) italic needs the Newsreader variable font. Network fetch (raw.githubusercontent.com variable TTF) hung and was interrupted. Left at Medium 24pt; Lisa skipped the choice to fetch a lighter weight — revisit if she wants it thinner.

### 19:13 — Resume link opens in a new tab
- Files: `components/footer-nav.tsx` (edited).
- What: The footer "Resume" link (`/resume.pdf`) was a Next `<Link>` that navigated in-place. Added a `newTab` flag to the footer link model and render those as `<a target="_blank" rel="noopener noreferrer">`. Resume now opens in a new tab (correct for a static PDF). Typed the link array (`FooterLink`) and generalized the open-in-new-tab branch to cover both `external` and `newTab`. Only link to `/resume.pdf` is the footer (verified).
- Decisions: PDF/asset links open in a new tab via plain anchor, not client routing.

### 19:11 — Resume name REVERTED to original sans (Newsreader experiment dropped)
- Files: `public/resume.pdf` (reverted name to original).
- What: Lisa: the Newsreader italic "looks so good for case study titles, and so bad for my name." Diagnosis (grounded in the codebase): the site **header** wordmark is Newsreader italic **bold (700)** at 18px (`app/layout.tsx`), and **case-study titles** are Newsreader italic *light* at 56–120px — both work. The resume landed at **Medium (500) / 24pt**, the dead zone between a confident logotype and a delicate display headline, so it read as generic. A name is a **wordmark** (different type-system role than a title). Lisa chose to revert to the original heavy sans. Restored from `/tmp/resume-logo3.pdf` → FiraSans-ExtraBold "Lisa Aufox", ethos-blue, center_x 140.8 (matches contact block). Kept this session's wins: blue accents + outlined favicon triangle. File 32.9KB.
- Decisions: **Resume name stays FiraSans-ExtraBold (heavy geometric sans), in blue** — pairs with the triangle, reads as a wordmark at small size. Do NOT re-propose the Newsreader serif italic for the name (title font ≠ wordmark). Net resume changes that shipped: red→blue accent recolor, Autodesk "A" → outlined favicon triangle.

### 18:08 — Resume recolored to ethos-blue
- Files: `public/resume.pdf` (edited in place).
- What: The resume's coral-red accent was remapped to ethos-blue `#1313ec`. The PDF is a text/vector doc (NeuzeitGro + FiraSans), so this was a content-stream color swap (PyMuPDF), not a re-render — text stays selectable. Replaced the red fill `scn` operator triples `1 0.325 0.314` (name + section headers + logo mark), `0.943 0.337 0.329` (experience bullets), and `1 0.33 0.31` (shape) → `0.0745 0.0745 0.9255`. 13 operator hits; result = 20 text spans now `#1313EC`. Body grey `#343433`, dates `#666767`, the subtitle `#393742`, and the black speaking-section bullets (`#000000`) were intentionally left unchanged.
- Decisions: Only the existing red brand accent → blue (faithful swap). Original recoverable from git history; session backup at `/tmp/resume-original-backup.pdf`.
- Note: speaking-engagement bullets remain black (they were black in the original, separate from the red job bullets) — can flip to blue too if Lisa wants all bullets consistent.

### 17:56 — Closed: FMUX tile header + Inbox Ads timing (no changes)
- Files: none.
- What: Lisa closed two lingering open items, no code changes:
  - **FMUX tile Messenger header** (the "full header / Facebook bar + 'Lucky Shrub' business header" note from Session 30): **will NOT be added.** Rationale: the tile's focus is the icebreaker→sent animation (the component Lisa actually redesigned); adding header chrome at that small size would clutter and detract from it. Tile stays bubble-only as built.
  - **Inbox Ads loop/motion timing:** **accepted as-is.** No further timing changes wanted.
- Decisions: Both items resolved as "leave as-is." Do not re-propose adding the Messenger header to the FMUX tile.

### 17:49 — Virtual-agent: add bottom Back to Index; close stale open items
- Files: `app/index/virtual-agent/page.tsx` (edited), `app/doodles/page.tsx` (edited — copy).
- What: Added `<BackToIndex />` (→ `/index`) at the **bottom** of the virtual-agent case study, wrapped in `mt-16` to match the page's section rhythm. The top generic `BackButton` ("← Back", `router.back()`) is **kept** — Lisa's explicit call: don't replace the top back button, just add a bottom Back-to-Index like the other case studies. Also updated the Doodles intro copy to "A collection of sketches, illustrations, and random thoughts."
- Closed stale open items (corrected by Lisa):
  - **Title casing** is NOT an open issue — all brief titles in `lib/content/briefs.ts` are already sentence case (the old "Title Case intentional" note predated the sentence-case standardization). No FMUX title-casing work remains.
  - **FMUX assets** are no longer placeholders — that work is done.
- Decisions: virtual-agent now has both a top `BackButton` and a bottom `BackToIndex` (intentional, per Lisa). The two are not unified.

### 17:38 — Doodles: click-to-expand lightbox + drag/copy protection
- Files: `components/portfolio/doodle-gallery.tsx` (created), `app/doodles/page.tsx` (edited), `app/globals.css` (edited).
- What: Clicking any doodle now expands it into a full-size centered overlay with a **FLIP zoom**: the lightbox `<img>` starts at the clicked thumbnail's exact `getBoundingClientRect()` box, then transitions (`top/left/width/height`, 420ms, `cubic-bezier(0.22,1,0.36,1)`) to a viewport-fit box (90vw/90vh, aspect preserved) while a dark scrim (`rgba(12,12,18,0.92)`) fades in. Close (scrim/image click or Esc) reverses the zoom back into the thumbnail. Body scroll locks while open; overlay is portaled to `document.body`; respects `prefers-reduced-motion` (instant show/hide). Refactored the bento markup into a `"use client"` `DoodleGallery`; `page.tsx` stays a server component (keeps `metadata`) and passes the typed `doodles` array down. Added `priority` to the first (LCP) tile.
- Anti-save: every image (thumbnail + overlay) gets `draggable={false}`, `onDragStart`/`onContextMenu` preventDefault, and a new `.img-protected` CSS class (`-webkit-user-drag/-touch-callout/user-select: none`). Blocks drag-to-desktop and long-press/right-click save in both states. (Not DRM — a determined user can still hit devtools/network; this stops casual drag/copy as asked.)
- Decisions: Lightbox uses a hand-rolled FLIP (no motion library — none installed). Dark scrim is acceptable for a transient modal viewer even on a cream-forward page (it's chrome over the art, not page surface). Tiles are real `<button>`s for keyboard/a11y; `cursor-zoom-in`/`cursor-zoom-out` affordances.

### 17:27 — Doodles: full-height images (no cropping)
- Files: `app/doodles/page.tsx` (edited).
- What: The `object-cover` 6-track grid was cropping every image top/bottom to fit fixed cells. Rebuilt the bento with explicit flex/grid containers and a local `Tile` helper that renders images at natural aspect (`h-auto w-full`, no `object-cover`). Row 1 = large tile at 2/3 width + a right 1/3 column with two stacked tiles; row 2 = two 50% tiles. `items-start` so a shorter column just leaves a gap at the bottom instead of stretching/cropping.
- Decisions: Per Lisa — images render full-height, gaps are acceptable where row halves have unequal natural heights. Fixed-cell `object-cover` approach abandoned.

### 17:10 — Doodles: editorial bento layout, full color
- Files: `app/doodles/page.tsx` (edited).
- What: Final layout is a **6-track CSS grid bento** (5 doodles): row 1 = large tile at 2/3 width (`col-span-4`, `row-span-2`) + two stacked tiles in the right 1/3 (`col-span-2` each); row 2 = two tiles at 50% (`col-span-3` each). Fixed `auto-rows-[clamp(6rem,20vw,15rem)]` so the large tile is exactly as tall as the two stacked ones; images `object-cover`. Also **removed the grayscale filter** — doodles stay full color; kept the `1.03` hover scale.
  - Iteration history: flex justified-rows (rejected — even rows) → CSS-columns masonry (rejected — wanted a specific structure) → 2-col bento → this 6-track bento. The 6-track count is the LCM that serves both the 2/3 split (4/6) and the 50% split (3/6) in one grid.
- Gotcha: mid-iteration the dev server's Turbopack stopped recompiling CSS (served a stale chunk; new `columns-*`/`break-inside` utilities never emitted — likely lingering from the earlier panic). Fixed by killing the dev server, `rm -rf .next`, and restarting. Lesson: if a newly-used utility class has no effect and the CSS chunk hash never changes, the dev cache is stale — restart with a clean `.next`.
- Decisions: **Doodles are an explicit exception to the site-wide grayscale-to-color image rule** (`.cursor/rules/azure-ethos.mdc` / `docs/DESIGN.md`) — the artwork is colorful by nature. Layout is a fixed editorial bento, not masonry.

### 16:56 — Back to Index buttons point to /index (was /)
- Files: `components/portfolio/back-to-index.tsx` (edited).
- What: The shared `BackToIndex` linked to `/` (homepage), but the work catalog lives at `/index`. Changed `href="/"` → `href="/index"`, fixing all four case studies that use it (inbox-ads, genai-conversations, journey-explorer, first-messaging-experience) in one place.
- Note: `virtual-agent` uses a separate generic `BackButton` ("← Back", `router.back()` with `/` fallback), not a labeled Back-to-Index — left unchanged pending Lisa's call on whether to unify it.
- Decisions: "Back to Index" = `/index`, not the homepage.

## 2026-06-22 — Session 30: Inbox-ads homepage tile — interactive surfaces triptych

### 18:40 — Inbox-ads tile: live triptych across IG / Messenger / MBS
- Files: `components/portfolio/home-ui/inbox-surfaces.tsx` (created), `app/page.tsx` (edited), `public/work/inbox-ads/screens/{instagram,messenger,mbs}.png` (added), `public/work/inbox-ads/logos/{instagram,messenger,meta}.svg` (added).
- What: Replaced the static `cover.png` on the inbox-ads homepage tile with a live React component. Three real inbox frames (Instagram, Messenger, Meta Business Suite) sit side-by-side, each topped by its black-on-cream brand mark. On a self-looping cycle (reduced-motion holds the rest state) all three ad-creation entry glyphs light native blue (`#0A7CFF`) in unison — the IG "promote" arrow, the Messenger megaphone, the MBS megaphone chip. Glyphs are inline SVG pixel-matched to each frame's baked icon (`fade` mode fades a blue copy in over IG/MBS; Messenger `recolor`s grey→blue since its baked icon ships blue). Screens run off the bottom of the tile (top corners rounded `1.6cqw`, bottom square), which removes the bottom-nav noise.
- Asset decisions:
  - **Screens shipped as PNG, not the source SVGs.** Figma exported each frame as an SVG wrapping base64 bitmaps (IG = 24MB, Messenger 1.9MB, MBS 1.3MB — the avatars/photos are raster). PNG renders are pixel-identical at a fraction of the weight (~800KB total vs ~27MB). Rendered via headless Chrome at 2×.
  - **Messenger frame cropped to full-bleed.** The source SVG baked a white device "card" with ~5.9% L/R, 2.4% top, 3.4% bottom padding + shadow. Cropped to box (50,42,799,1665) so the screen matches IG/MBS edge-to-edge. New aspect 749/1623.
  - **Brand marks: dark grey (`#3A3A3C`), not black** (Lisa's call). IG + Meta from her Meta logo pack (black glyph SVGs, recoloured); Messenger only shipped mono as PNG/EPS, so rebuilt as a crisp vector (grey bubble + white knockout bolt). Meta `viewBox` trimmed from the 2504×2000 artboard to the symbol bounds. No text captions (Lisa: "hate the labels").
  - **Virginia Rollison avatar = interim composite.** Her row in the MBS export has no profile photo (genuine gap in the Figma frame, not a render glitch — Aaron below renders fine). Composited a borrowed IG portrait, circular-masked, sized/placed to match the row's avatar column. **Authentic fix = re-export the MBS frame from Figma with her avatar, or drop in a real portrait.**
- Icon alignment: measured each baked entry-icon center by pixel analysis — IG arrow (0.7665, 0.0807), Messenger megaphone (0.916, 0.0793 post-crop), MBS chip (0.770, 0.089). Glyph overlays positioned against the full (un-cropped) image so they stay locked to the baked icon.
- Decisions: Tile is a real React component (matches FMUX/GenAI tiles), not an image. Self-loops; no orchestrator. `containerType: inline-size` + `cqw` units so it scales with the 16:9 tile.
- Open: Virginia avatar is a placeholder pending Lisa's authentic asset. Live review of the loop/motion still pending.

### 19:39 — Fix: Turbopack FATAL panic from in-project Chrome socket
- Files: none (removed stray `.scratch/chrome` + `.scratch/chrome-shot` dirs; no source changes).
- What: Dev server was 500-ing every route with "An unexpected Turbopack error occurred." Root cause was the headless-Chrome screenshot runs writing user-data-dirs **inside the project** (`.scratch/chrome*`), which contain a Unix socket file (`SingletonSocket`). Turbopack watches the whole tree and panicked reading the socket ("Operation not supported on socket, os error 102") during `globals.css` processing. Killed the chrome procs, removed the profile dirs; Turbopack re-watched and recovered (HTTP 200) with no restart. Component code was never at fault — the earlier `Sweep`/`ButtonIcon`/`ghostTabStyle` "not defined" lines were stale Fast-Refresh transients; all three are defined.
- Decisions: **Never point a Chrome `--user-data-dir` inside the repo.** Future screenshots must use a temp dir outside the project (e.g. `/tmp` or `$TMPDIR`) so socket files never poison Turbopack's file watcher.

### 19:55 — Inbox tile: alignment fixes + removed fabricated Virginia avatar
- Files: `components/portfolio/home-ui/inbox-surfaces.tsx` (edited), `public/work/inbox-ads/screens/mbs.png` (regenerated).
- What:
  1. **Messenger top alignment.** Card tops were misaligned because the three brand marks have different optical heights (IG 5.4, Messenger 6.2, MBS 4.6cqw) and each pushed its card down by its own height. Added a fixed `LOGO_BAND` (6.2cqw); logos are bottom-aligned within it, so every card top now starts at the same `TOP_PAD + LOGO_BAND + LOGO_GAP`.
  2. **IG entry glyph alignment.** Pixel-measured the baked promote arrow in `instagram.png`: true center is `frac_x=0.7602` (was `0.7665`, ~1.6px too far right). Updated.
  3. **Virginia Rollison avatar — fabrication removed.** Re-rendered the source `mbs.svg` at 4× and extracted all 15 embedded images. There are exactly three human portraits, and they belong to **Aaron Mitchell, Ana Thomas, and Meeta Vlachou** — Virginia's row has a genuinely empty avatar slot in the Figma export (likely a hidden/un-exported layer). The prior session composited a borrowed IG portrait as a stand-in; that was wrong. Regenerated `mbs.png` straight from source (no composite). Virginia's slot is now empty, matching the artifact.
- Decisions: Do not fabricate identity assets. Source artifact is authoritative; an empty slot is shipped over a fake face.

### 20:10 — Virginia avatar: real asset found + composited
- Files: `public/work/inbox-ads/screens/mbs.png` (regenerated with real avatar).
- What: Lisa pointed to the source — `~/Downloads/Mobile/Android/Threadlist Components/Android/Threadlist Components/Profile.svg` (her avatar wasn't in the MBS frame export, it was a separate component file). Extracted the embedded 500×500 photo + the Instagram badge glyph. Composited the circular photo (120px @2×) + IG badge into Virginia's row at `(46, 252.988)` in 375-space — same x and row pitch as the Aaron/Ana/Meeta avatars. The fabricated stand-in is fully gone; this is her genuine asset.
- Decisions: Virginia avatar gap is **closed** with the authentic asset.

### 20:20 — IG entry glyph: thickened blue to fully cover the baked arrow
- Files: `components/portfolio/home-ui/inbox-surfaces.tsx` (edited).
- What: In `fade` mode the blue promote-arrow sits on top of the baked grey one. The baked icon is a heavier weight, so its arrowhead poked out behind the thinner blue glyph. Diagnosed by compositing the overlay over the real screen and zooming 4×. Fixed by dilating the 48px glyph alpha ~2px (re-embedded as the `ig-pano-i` PNG) and nudging the placement onto the arrowhead: `x 0.7602→0.762`, `y 0.0807→0.0824`, `w 0.07→0.073`. Blue now fully covers the grey without going chunky (a 3px dilation read as too fat).
- Decisions: For `fade`-mode overlays, the blue glyph must be ≥ the baked icon's stroke weight, not just bbox — match weight, then position.

### 21:05 — IG glyph: abandon overlay, erase baked arrow + recolor in place (right fix)
- Files: `components/portfolio/home-ui/inbox-surfaces.tsx` (edited), `public/work/inbox-ads/screens/instagram.png` (edited).
- What: The fade-on-top approach was fundamentally fragile — two slightly different arrow shapes never align, and thickening just made it chunky while grey still peeked. Switched IG to the **same mechanism Messenger/MBS use**: erased the baked grey arrow from `instagram.png` (filled the slot by copying the real background gradient row-by-row from a clean column so there's no flat-white seam against the callout-bubble shadow), then made our glyph the single source of truth — `recolor` mode, near-black (`#0A0A0A`) at rest to match the baked dots/compose icons, blue when lit. Restored the original (accurate-weight) glyph art; sized `w=0.06` to reproduce the native icon, centered at `(0.7602, 0.0816)`. Added optional per-surface `rest` color to the icon type.
- Decisions: All three surfaces now use one consistent model — glyph IS the icon, recolored in place. No overlay-coverage hacks. When compositing onto a frame, sample the local background gradient, never flat-fill.

## 2026-06-21 — Session 29: Homepage FMUX tile as a live Messenger animation

### 15:57 — Inbox-ads: correct the three surfaces (WhatsApp → Meta Business Suite)
- Files: `lib/content/briefs.ts` (edited).
- What: The `inbox-ads` subtitle listed "Instagram, Messenger, and WhatsApp." The actual three surfaces are **Instagram, Messenger, and Meta Business Suite (MBS)** — corrected. Left the WhatsApp mentions in the GenAI case study (`app/index/genai-conversations/page.tsx`) untouched: those describe Meta's messaging-ads footprint, which genuinely includes WhatsApp, so they're accurate.
- Decisions: Canonical inbox-ads trio = IG / Messenger / MBS (drives the upcoming triptych cover). WhatsApp belongs to the GenAI/messaging-ads story, not inbox-ads.

### 15:42 — Title typography: decisions from the ligature follow-up (no code change)
- Files: none (net-zero: briefly tried `tracking-[-0.01em]` on the FMUX hero, then reverted — any non-zero `letter-spacing` re-suppresses the `fi` ligature, so the FMUX hero stays untracked per 15:34).
- Decisions:
  - **FMUX hero title: keep at zero tracking** (ligature wins over tighter fit). To narrow it if ever needed, reduce font-size — never add tracking.
  - **GenAI hero title keeps its `tracking-tight`** — Lisa's call (declined the consistency change). It has no `fi/fl/ff` combos ("Less work, better ads with generative AI."), so nothing's visibly suppressed there.
  - **Both case-study hero titles share the same weight**: neither sets `font-weight`, so both inherit normal/400 Newsreader italic. (The `font-black` on the GenAI page is the decorative "96%" stat, not the title.)

### 15:34 — FMUX case study: restore the fi ligature on the hero title
- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: Removed `tracking-tight` from both hero `h1` lines ("Unified first" / "messaging experience"). Non-zero `letter-spacing` was suppressing Newsreader's `fi` ligature, so "Unified"/"first" rendered as squeezed f+i (worse in italic). At natural spacing the ligature renders and the large display serif fits better.
- Decisions: Display serif titles shouldn't carry negative tracking — it kills ligatures. Keep future big serif headings untracked.

### 15:26 — GenAI card: longer dwell on the Recommended view
- Files: `components/portfolio/home-ui/genai-template.tsx` (edited).
- What: `HOLD_GENAI` 3000→6000ms (+3s) so the GenAI "Recommended template" state lingers before the loop resets to default.

### 15:20 — GenAI card: load the real Optimistic font for the "Conversations" title
- Files: `app/globals.css` (edited), `public/fonts/optimistic.ttf` (added).
- What: The title's `fontFamily: DISPLAY` ("Optimistic Display") was silently falling back to SF because the font was never loaded. Found Meta's `OptimisticVF` (variable, wght 300–800) in `~/Downloads/Optimistic/optimistic.ttf`, copied it **unaltered** (license forbids modification — so no subsetting/woff2 conversion) to `public/fonts/`, and added a global `@font-face { font-family: "Optimistic Display"; font-weight: 300 800; src: .../optimistic.ttf }`. The "Conversations" span (weight 700) now renders in real Optimistic via the variable wght axis.
- Decisions: Font shipped as `.ttf` (405KB) rather than woff2 to honor the "may not be altered" license. Loaded globally (not component-scoped) but only consumed by the GenAI tile's `DISPLAY` token. This is a deliberate authenticity exception to the Inter/Newsreader rule, same rationale as the Messenger/Ads-Manager UI fidelity.
- Verified: font serves HTTP 200; title span confirmed using `DISPLAY`. Lint clean (only the pre-existing `@theme` Tailwind warning).

### 15:13 — GenAI card: real Edit/Create-template button icons
- Files: `components/portfolio/home-ui/genai-template.tsx` (edited), `public/work/genai/template/{pencil,plus}.svg` (added).
- What: The Edit pencil was a hand-drawn approximation and both icons were undersized/off-center (the "+" was a faked text glyph with `lineHeight:0.8`). Copied the real `pencil.svg` + `plus.svg` (16×16 masked-PNG exports from the `→ 🟡 1` folder) and render them via a shared `ButtonIcon` `<img>` at `p(16)` with `display:block` so they center cleanly via the button's flex `alignItems:center`. Deleted the unused `PencilGlyph` SVG component.
- Verified: Lisa confirmed live ("looks good"). Lint clean.

### 15:09 — GenAI card: glimmer = faded gradient pulse, descender + panel padding fixes
- Files: `components/portfolio/home-ui/genai-template.tsx`, `app/globals.css` (edited).
- What (3 tweaks, batched):
  1. **Loading glimmer redesigned.** Replaced the moving left→right white sweep with a static gradient fill — full skeleton colour (`#CBD2D9`) on the left fading to 10% (`${SKEL}1A`) on the right — that pulses in/out via `@keyframes genai-pulse` (opacity 1↔0.35, 1.4s ease-in-out). Swapped `genai-sweep`→`genai-pulse` in globals; renamed the `Sweep` component to `Glimmer`.
  2. **"Greeting" descender clip.** The greeting skeleton bar started exactly where the "g" descender ends, so the solid bar clipped it. Gave `skeletonBar` an optional `topInset` and passed `p(4)` for the greeting bar only — clears the descender without moving the body text (so the greeting↔questions gap match holds).
  3. **Padding below "Add responses."** Bumped the greeting/questions panel height `p(168)→p(172)` for ~4px more breathing room below "Add responses" (panel bottom still ~7px above the footer buttons).
- Verified: lint clean. (Live screenshot captures were interrupted; changes are geometry-only.)

### 01:14 — GenAI card: actually fix the clipped tab right padding (ghost measurer)
- Files: `components/portfolio/home-ui/genai-template.tsx` (edited).
- What: First attempt (RO on the inner span) still clipped — CDP measurement confirmed left pad 29px / right pad 4px. Root cause was a **ResizeObserver feedback loop**: the measured inner span lives *inside* the `overflow:hidden`, width-constrained pill, so the RO settled at the clipped width and dropped the right padding. Fixed by measuring a **hidden, out-of-flow ghost copy** of the label (absolutely positioned, `visibility:hidden`, never width-constrained) and driving the pill width from it. Extracted a shared `<TabLabel>` + `tabLabelStyle`/`ghostTabStyle` so the ghost and visible pill stay identical.
- Verified (CDP, real time): pill grew 483→509px; left pad 29 / right pad 30 — symmetric. "AI" no longer touches the edge; "Saved templates" pushed out correctly. Lint clean.
- Lesson: NEVER point a ResizeObserver at an element whose size is derived from the value the observer sets (here, an element inside an overflow-hidden box sized by the measurement). Measure an unconstrained ghost instead.
- Note (tooling): `--virtual-time-budget` headless screenshots do NOT flush ResizeObserver callbacks (showed a stale/narrow pill). Drive Chrome over CDP (Node 24 built-in WebSocket) and wait real time for RO-dependent UI.

### 00:52 — GenAI card: match the questions heading→body gap to the greeting
- Files: `components/portfolio/home-ui/genai-template.tsx` (edited).
- What: The "Questions and responses" → "1. Can I make a purchase?" gap read tighter than "Greeting" → body. Root cause: the greeting body span lives in a fade-layer with no explicit `font-size`, so it inherits a 16px line box and drops ~4px, while `QuestionList` sets its own 12px context and sits tight. Measured both renders (greeting gap ≈ 46px, questions ≈ 34px at 2×). Dropped the questions slot `p(80)→p(84)` and nudged "Add responses" `p(142)→p(146)` to keep the gap below. Re-measured: greeting 46px / questions 43px — matched.
- Decisions: Left the greeting block untouched (Lisa likes its spacing); opened up questions to match rather than tightening greeting. The inherited-line-box inflation on greeting body is a known latent quirk, left as-is since it reads correctly.

### 00:30 — GenAI card: exact fonts + 1:1 SVG coordinate mapping + real sparkle
- Files: `components/portfolio/home-ui/genai-template.tsx` (rewritten), `public/work/genai/template/sparkle.svg` (added).
- What: Text was still oversized. Lisa gave the exact type sizes; mapped the whole card 1:1 to the SVG. The card is now a fixed `428×382` box (`padding-bottom` aspect trick) with **every element absolutely positioned at its exact SVG coordinate** (header `(16,18)`, description `y46`, tabs `y100`, panel `(16,152) 396×168`, skeleton bars at panel-local `(8,30) 375×18` and `(8,80) 375×51`, buttons `y331`). Converted via `p(px)=px/428*100` cqw.
  - Exact fonts: "Conversations" 16pt bold (Optimistic Display → SF fallback), description 14pt, Greeting/Questions headings 14pt bold, body 12pt — all SF Pro.
  - Replaced the hand-drawn sparkle with the real asset (`sparkle.svg`, a #0A78BE-masked 12px icon from the `→ 🟡 1` export) in the "Recommended template ✦ AI" tab.
- Decisions: Tab text 14pt (not given by Lisa; inferred — pill widths `167`/`232px` are consistent with 14pt). "Add responses" 13pt, buttons 13pt — also inferred, tunable. Check/pencil glyphs remain hand-drawn approximations (only the sparkle was called out).
- Verified: lint clean, homepage 200, sparkle 200.

### 00:15 — GenAI tile rebuilt as a real React component (replaces SVG cross-fade)
- Files: `components/portfolio/home-ui/genai-template.tsx` (rewritten).
- What: The SVG-cross-fade approach was a dead end — it can't morph the active tab, push the neighbor tab, or animate the skeleton smoothly, and the shimmer read as a static grey square. Discovered the card is the **Ads-Manager "Conversations" template** (not a Messenger chat). Rebuilt it as a faithful hand-coded React component (DOM, like FMUX). Renders the green-check header, subtitle, the two tabs, the greeting/questions panel, "Add responses", and Edit / + Create template buttons. Three animations: (1) active tab measures its content and animates `width` (`Suggested template` → `Recommended template ✦ AI`), pushing "Saved templates"; (2) a light band sweeps left→right across the two skeleton bars during glimmer; (3) greeting + questions cross-fade default → skeleton → GenAI.
- Sizing: first React pass was ~30% too large (eyeballed cqw). Fixed by pulling exact geometry from the Figma export and converting **design-px → cqw via `p(px) = px/428*100`** (card is 428px wide). Verified against the export: tab pill `167→232×36`, panel `396×168 r4`, skeleton bars `h18`/`h51`, `16px` icons. Copy + palette (`#0A78BE` blue, `#E1EDF7` tab, `#F1F4F7` panel, `#1C2B33` ink, `#007E59` check, `#CBD2D9` skeleton) read from the SVGs.
- Decisions:
  - **GenAI tile is now a hand-built React component, not the SVG exports.** The 3 SVGs in `public/work/genai/template/` are no longer referenced by code (kept as visual reference / geometry source; safe to delete later).
  - Font is SF Pro (system stack). Card sits on the `#EBF5FF` ground with `elevate` glow, same as FMUX.
- Lesson (tooling): NEVER create a headless-Chrome `--user-data-dir` inside the workspace — its `SingletonSocket` makes the Turbopack dev server panic (`FATAL ... reading file .scratch/chrome/SingletonSocket`, os error 102) and the page 500s. Put Chrome profiles outside the repo (needs unsandboxed write) or skip headless screenshots.

### 23:45 — GenAI homepage tile built (3-state message-template loop)
- Files: `components/portfolio/home-ui/genai-template.tsx` (created), `public/work/genai/template/{default,glimmer,genai}.svg` (created — Figma exports), `app/globals.css` (edited — `@keyframes genai-shimmer`), `app/page.tsx` (edited — GenAI tile uses `<GenaiTemplate/>` + `elevate`).
- What: Built the GenAI (L1 message-template) tile. A message-template card floats on a pale-blue ground (`#EBF5FF`, the icebreaker-pill blue) — it does NOT fill the tile (`padding: 8%` + `object-contain`). Cycles three pixel-perfect Figma SVG exports by cross-fading opacity: **default** (default welcome + icebreakers) → **glimmer** (loading) → **genai** (GenAI-written welcome + icebreakers) → reset → loop. Self-loops; `prefers-reduced-motion` holds the default state. Matches FMUX: `elevate` lifts it above the page grid with the subtle blue glow.
- Shimmer (two wrong turns, then fixed):
  1. First pass masked/pulsed the *whole* card — wrong, shimmered the avatar/header too.
  2. Second pass embedded a gradient + CSS `@keyframes` inside `glimmer.svg` scoped to the two grey rects — but **CSS animations do NOT run inside `<img>`-loaded SVGs in Chrome** (only SMIL does), so it froze as a static grey square. Reverted the SVG to plain solid `#CBD2D9` rects.
  3. **Final: shimmer driven in React.** A light band (`linear-gradient` white 0→0.85→0) sweeps left→right via `@keyframes genai-sweep` (`translateX(-100%→100%)`, 1.3s linear) inside two overlay boxes positioned over the exact skeleton-rect coords (as % of the 438×392 canvas: welcome `top 47.7% h 4.59%`, icebreakers `top 60.46% h 13.01%`, both `left 6.62% w 85.62%`). Card-wrap pinned to `aspect-ratio 438/392` with `objectFit:fill` so the overlays align to the SVG bars exactly. Overlays only render in the glimmer phase and respect reduced-motion. React side stays a 3-layer opacity cross-fade.
- Lesson: don't rely on CSS keyframes inside `<img>` SVGs — drive motion in React/DOM (or inline the SVG / use SMIL).
- Decisions:
  - **Used the SVG exports directly (cross-fade), not a hand-rebuild.** Text is outlined to paths, images embedded — faithful and far simpler than rebuilding (FMUX only needed a rebuild because its motion was *inside* the UI). SF Pro noted but moot here (no live text).
  - Tile keeps `aspect-square`. Glow + grid-lift via the existing `elevate` prop (pale-blue fill covers the prop's `bg-white`).
- Open/tune: hold timings (default 2400 / glimmer 1900 / genai 3000ms), shimmer speed (1400ms), and the 8% inset are first-pass — adjust on screen. Verified: homepage 200, all three SVGs serve 200.

### 23:01 — Noted: L1 redesign (GenAI tile) shimmer spec
- Files: none (reference note for the upcoming GenAI tile build).
- What: Captured the loading-glimmer spec for the GenAI / L1 redesign tile so it's ready when that tile is built. The default welcome message + icebreakers load behind a **shimmer/skeleton state** before swapping to the GenAI versions.
- Decisions (refined after studying the source video):
  - **Shimmer base color: `#CBD2D9`.**
  - **Form: a React component — a *fixed* gradient rectangle, `100%` opacity on the left fading to ~`10%` opacity on the right. No horizontal travel.**
  - **Animation: the whole block fades in and out (opacity pulse) to read as a shimmer.**
  - Note: spec is Lisa's read of the video (her best guess), not pixel-confirmed — adjust during the GenAI build if it doesn't match once it's on screen.

### 22:20 — FMUX tile: product-accurate reset + card lifted above the grid
- Files: `components/portfolio/home-ui/fmux-chat.tsx` (edited), `components/portfolio/project-tile.tsx` (edited — added `elevate` prop), `app/page.tsx` (edited — FMUX tile gets `elevate`).
- What:
  1. **Reset animation no longer reverses.** Replaced the `sent`/`settled` booleans with a `Phase` state machine (`rest → fly → settle → fade → enterPrep → enter`). The sent bubble now **fades out in place** at the top (`fade`, opacity → 0, 320ms), then a fresh pill **snaps invisibly below its stack slot** (`enterPrep`, via a double-`requestAnimationFrame` so the browser paints the prep frame) and **slides up with a small overshoot bounce** (`enter`, `cubic-bezier(0.34,1.56,0.64,1)` 440ms) — matching the real product reset, not a rewind of the send.
  2. **Card lifted above the page grid.** The `.grid-hydration` overlay is `position:fixed; z-index:1` and paints blue grid lines over everything, so it showed *through* the white chat. Added an `elevate` prop to `ProjectTile` that gives the media box `z-[2]` (above the grid), an opaque `bg-white` ground, and a subtle blue glow `box-shadow: 0 20px 50px rgba(19,19,236,0.1)`.
- Decisions:
  - Glow uses the brand atmospheric color (`rgba(19,19,236,…)`) but at `0.1` alpha instead of the DESIGN token's `0.05` — `0.05` was effectively invisible. Kept subtle so it doesn't bleed onto the title directly below. Dial back to `0.05` if it ever reads heavy.
  - `elevate` is a reusable `ProjectTile` prop (not FMUX-only) so the GenAI/Inbox live tiles can opt in the same way.

### 22:05 — FMUX tile rebuilt as hand-coded Messenger UI (replaces interim video)
- Files: `components/portfolio/home-ui/fmux-chat.tsx` (created), `components/portfolio/project-tile.tsx` (edited — added `media` slot), `app/page.tsx` (edited — FMUX uses `<FmuxChat/>`), `public/work/fmux/chat/avatar.svg` (created — vector with embedded hi-res raster, replaces a low-res PNG).
- What: Decided homepage tiles will be hand-built React/CSS components with bespoke per-project motion (not video loops or static screenshots). Built the FMUX tile as a Messenger thread, authentic to the Messenger design system: grey welcome bubble + avatar at top, three light-blue icebreaker pills anchored at the bottom above the composer. The top icebreaker ("Where are you located?") flies straight up and morphs into the solid-blue sent bubble, then settles with a "Sent" metatext — a 3-stage Smart Animate sequence read from Lisa's Figma prototype: (1) fly-up + recolor `cubic-bezier(1,0.01,0.03,0.04)` 400ms, (2) "After delay" 300ms pause just below final, (3) settle into place ease-in-out 300ms + "Sent" fades in. Self-loops; `prefers-reduced-motion` holds the resting state. Container-query (cqw) sizing keeps it proportional at any tile width (tile is fixed 4:5).
- Exact values from Lisa's SVG exports (`new-sender.svg`, `icebreaker.svg`, `Sent.svg`): pill `#EBF5FF`, sent bubble + send icon `#0866FF` (real FB blue), ink `#080809`, fully-rounded pills. Send icon path inlined verbatim.
- Decisions:
  - Homepage tiles = live hand-built UI, animated as a sequential relay (one tile plays at a time, cycling 1→2→3→1) — orchestrator to be added once ≥2 tiles exist.
  - Inside product-UI tiles, stay authentic to the source product (literal Messenger type/colors), NOT the portfolio brand tokens — explicit exception to the Azure Ethos brand-font/color rules for these depictions.
  - Build order: FMUX first (GenAI deferred — L1 redesign Figma missing). GenAI and Inbox tiles still to do.
- Open: full Messenger header (facebook bar + "Lucky Shrub" business header) seen in newer refs — not added; pending Lisa's call. Composer kept as icon-row (+/cam/img/mic/Aa) per her first Figma mock.

## 2026-06-19 — Session 28: FMUX video labels + conclusion layout parity

### Jun 21, 15:50 — Homepage tiles: video direction chosen; tile hardened for ambient loops
- Files: `components/portfolio/tile-video.tsx` (created), `components/portfolio/project-tile.tsx` (edited), `app/page.tsx` (edited).
- What: Explored a video-tile route (ref: itsmarga.me). Lisa's verdict: video is the direction, but it needs **purpose-built homepage loops with subtle/ambient motion** (so three autoplaying tiles don't overwhelm) — she'll author them. Added `TileVideo` client component: autoplay silent loop with `poster`, and a `prefers-reduced-motion` fallback that renders the poster still instead of playing. `ProjectTile` now takes `videoSrc` + `videoPoster` (video takes precedence over `coverSrc`, else cream placeholder). FMUX tile temporarily plays `flow-msgr-web.mp4` as an interim stand-in.
- Decisions:
  - **Homepage thumbnails = ambient video tiles** (Lisa authoring subtle homepage-specific cuts). Spec given: FMUX 4:5 1080×1350, GenAI 1:1 1080×1080, Inbox 16:9 1920×1080 (or keep cover); seamless-loop H.264/yuv420p MP4, no audio, <~2–3 MB each, + first-frame JPG poster. Drop at `public/work/<project>/home.mp4` + `home-poster.jpg`; wiring is one line per tile.
  - **Accessibility:** reduced-motion users get the poster, never an autoplaying video.
  - Inbox may stay a full-bleed cover image (mixed media is acceptable) if no subtle video is made for it.
- Files: `components/portfolio/project-tile.tsx` (created), `app/page.tsx` (edited), `components/portfolio/architectural-card.tsx` (deleted), `public/work/home/brutalist-bg.png` (deleted).
- What: Replaced the homepage's empty placeholder cards with a `ProjectTile` system. First attempt — a generated brutalist-concrete duotone background with a screenshot seated in the niche — was **rejected by Lisa as "AI slop."** Removed it entirely (component + generated image). New direction: each card is a **full-bleed designed cover photo** (`object-cover`, subtle hover zoom, no blue ground). Inbox Ads uses its existing `cover.png` (already a polished multi-device gradient cover). FMUX + GenAI show clean cream interim placeholders (serif title only) until Lisa authors matching covers.
- Decisions:
  - **NO AI-generated imagery for project thumbnails.** Generated photographic backgrounds read as slop. Lesson: cohesion comes from real assets + a consistent treatment, not invented art.
  - **Cover photos are Lisa's to make** (Figma — real UI in device mockups on the brand gradient). Targets: `public/work/fmux/cover.png` (~1600×2000, 4:5), `public/work/genai/cover.png` (~2000×2000, 1:1). Inbox already done. Wiring is a one-line `coverSrc` change per card once she drops them in.
  - `ProjectTile` renders full-bleed cover when `coverSrc` is set, else a cream serif-title placeholder. Keeps the asymmetric grid (4:5 / 1:1 / 16:9).

### Jun 20, 17:10 — Fixed the two publish caveats (contact sender + real OG card)
- Files: `app/api/contact/route.ts` (edited), `app/opengraph-image.tsx` (created), `app/layout.tsx` (edited), `assets/fonts/*.woff` (3 added).
- What:
  1. **Contact sender moved off Resend's test address.** `from` is now `Lisa Aufox Portfolio <noreply@lisaaufox.com>` (env-overridable via `CONTACT_FROM_EMAIL`); recipient is env-overridable via `CONTACT_TO_EMAIL` (default `lisaaufox@gmail.com`). Code is production-ready.
  2. **Real 1200×630 OG share card.** Added `app/opengraph-image.tsx` using `next/og` `ImageResponse` — renders JSX → crisp PNG at build (verified static `○ /opengraph-image`, 1200×630). On-brand: cream ground, ethos-blue Newsreader-italic "Lisa Aufox", Inter "PRODUCT DESIGN" label, "PORTFOLIO" eyebrow, azure-halo radial glow, `lisaaufox.com`. Brand fonts loaded from `assets/fonts/` (Newsreader 500 italic + Inter 500, `.woff` from Fontsource — satori supports woff, not woff2). Removed the `about-panel.png` placeholder `images` from `openGraph`/`twitter` in `layout.tsx`; the file convention is now the single source for `og:image` (X/Twitter falls back to it).
- Decisions:
  - **OG card is generated, not a static asset** — text stays crisp and editable in code (avoids garbled AI-image text). Fonts live in `assets/fonts/` (outside `public/`, read via `fs` at build only).
  - **MANUAL STEP STILL REQUIRED (not code):** the `lisaaufox.com` domain must be verified in the Resend dashboard (add the DNS records Resend provides) before `noreply@lisaaufox.com` will send. Until then, set `CONTACT_FROM_EMAIL` back to `onboarding@resend.dev` or complete verification. `RESEND_API_KEY` must also be set in the host env.

### Jun 20, 16:53 — Publish-readiness fixes (homepage links, doodles, contact, SEO, cleanup)
- Files: `app/page.tsx`, `lib/content/briefs.ts`, `lib/content/catalog.ts`, `app/contact/page.tsx`, `app/api/contact/route.ts`, `app/layout.tsx`, `app/doodles/page.tsx` (all edited); `components/portfolio/editorial-brief.tsx`, `components/portfolio/brief-preview.tsx`, `app/archive/` (deleted); `components/portfolio/index.ts` (edited); `public/work/fmux/{err.log,flow-bottomsheet.mov,flow-msgr.mov,flow-msgr-sdr.mp4}` (deleted); `public/doodles/*.webp` (5 added). Followed a full-site publish-readiness audit.
- What:
  1. **Homepage link bug fixed** — `app/page.tsx` destructured `[flow75, inbox, je]` but FMUX had been prepended to `briefs`, so every card linked to the wrong case study. Renamed to `[fmux, genai, inbox]` and pointed each card at its own page (FMUX→first-messaging-experience, GenAI→genai-conversations, inbox→inbox-ads). Homepage now features those three, each linking correctly.
  2. **Doodles page is now real** — scraped 5 full-res images from lisaaufox.com/doodles (Squarespace CDN; served as WebP at `?format=2500w`, renamed `.webp`), saved to `public/doodles/`, rendered as a 2-col `next/image` gallery with the site's grayscale→color + 1.03 hover.
  3. **Contact form** — recipient `lisa.aufox@gmail.com` → `lisaaufox@gmail.com`; greatly expanded captured metadata (viewport, DPR, language(s), platform, device memory, CPU cores, touch points, connection type, cookies, DNT, color-scheme, reduced-motion, client referrer, page URL) on top of the existing IP/UA/headers/timezone/screen/time-on-page.
  4. **SEO/social** — added `metadataBase` (https://www.lisaaufox.com), Open Graph, and Twitter/X card metadata in `app/layout.tsx` (share image = `about-panel.png` for now).
  5. **Asset cleanup** — removed `err.log` + 3 unreferenced FMUX videos (`flow-bottomsheet.mov`, `flow-msgr.mov`, `flow-msgr-sdr.mp4`). Verified the used ones first: `icebreaker-curved-intro.mov`, `flow-msgr-web.mp4`, `flow-bottomsheet-sdr.mp4` kept.
  6. GenAI brief year 2024 → **2025** (matches catalog).
  7. FMUX catalog summary rewritten to match the real project (icebreaker redesign, not the old "chat component" blurb).
  8. FMUX brief metric `TBD` → **+0.40%** CTR lift.
  9. Deleted empty `app/archive/` dir + orphaned `EditorialBrief`/`BriefPreview` components (verified zero imports; removed their barrel exports). `MetricsRow` + `EditorialBriefData` type kept (still referenced).
  10. FMUX headers: verified all section headers are already `font-serif italic` — no change needed.
- Decisions:
  - **Homepage features 3 projects (FMUX, GenAI, inbox-ads).** If a different set/order is wanted, change the destructure + card props together.
  - **Doodles use grayscale→color hover** per `DESIGN.md` image rule, for gallery cohesion. Easy to switch to full-color-at-rest if preferred.
  - **CAVEAT — contact sender still `onboarding@resend.dev`** (Resend test address). Delivery to `lisaaufox@gmail.com` only works if that's the verified Resend account owner; a verified sending domain is still needed for robust prod deliverability. `RESEND_API_KEY` must be set in the host env (not just `.env.local`).
  - **OG image is a placeholder** (`about-panel.png`, 1024×720). A purpose-built 1200×630 share card would be better. `metadataBase` assumes the deploy domain is www.lisaaufox.com.

### Jun 20, 16:31 — Archived orphaned genai1 / genai2 route pages
- Files: `app/index/genai1/page.tsx` → `archive/genai1/page.tsx` (moved), `app/index/genai2/page.tsx` → `archive/genai2/page.tsx` (moved).
- What: Moved the two orphaned GenAI draft-variant pages out of the routed `app/` tree into a top-level `archive/` folder. Both pages only rendered the `genai-conversations` brief and were not linked from anywhere (homepage `app/page.tsx` links only `/index/genai-conversations`; catalog has only the `genai-conversations` slug; no `href` anywhere targets genai1/genai2). Routes `/index/genai1` and `/index/genai2` no longer exist. `genai-conversations` remains the single live GenAI case study.
- Decisions:
  - **"Archive" = move out of `app/`, don't delete.** Code is preserved in `archive/` (dormant, not routed, `@/` imports still resolve from project root) so the layout variants can be referenced/restored later. If a future session wants them fully gone, delete `archive/genai1` + `archive/genai2`.
  - Confirmed via grep that genai1/genai2 had zero inbound links before moving — safe, no broken references.

### Jun 20, 16:27 — Sentence-case sweep across all project titles
- Files: `lib/content/briefs.ts`, `lib/content/catalog.ts`, `app/index/first-messaging-experience/page.tsx`, `app/index/genai-conversations/page.tsx`, `app/index/genai2/page.tsx`, `app/index/genai1/page.tsx` (all edited).
- What: Normalized every project title to sentence case (was mixed). Data titles: "AI Agents in Messaging Ads"→"AI agents in messaging ads", "Unified First Messaging Experience"→"Unified first messaging experience" (briefs + catalog), "Less Work, Better Ads with Generative AI"→"Less work, better ads with generative AI" (briefs + catalog). Hardcoded hero headlines: FMUX "Unified first / messaging experience"; genai-conversations + genai2 "Less work, better ads / with generative AI."; genai1 "The creator-to-reviewer shift." Acronyms/proper nouns kept caps (AI, Reels, Autodesk). inbox-ads/virtual-agent/journey-explorer render `{brief.title}` so they inherited the fix.
- Decisions:
  - **Site-wide title convention is SENTENCE CASE** (acronyms + proper nouns excepted). Supersedes the earlier Title-Case FMUX title decision from 12:24. Apply sentence case to any new project title.

### Jun 20, 12:24 — Case-study title → "Unified First Messaging Experience"
- Files: `app/index/first-messaging-experience/page.tsx` (edited), `lib/content/briefs.ts` (edited).
- What: Retitled the case study. Iterated hero headline "…in Messenger" → "…on Messenger and Facebook" (to reflect cross-platform scope) → then Lisa landed on **"Unified First Messaging Experience"** (the project's real name, FMUX, with "Unified" carrying the outcome). Hero h1 split as "Unified First / Messaging Experience"; subhead "The $10M redesign." unchanged. Updated `brief.title` to match so the browser tab, sticky scroll-spy title, and index cards are all consistent (resolves the earlier open question about `brief.title` still saying "in Messenger").
- Decisions:
  - **Don't put $10M/revenue in the headline** — it's already the adjacent subhead; "Unified" carries the design-win half, "$10M" the money half.
  - **Title updated on ALL surfaces** to the identical string: hero h1 (`page.tsx`), `brief.title` (`briefs.ts` → tab + scroll-spy + index/home cards), and the catalog row (`catalog.ts`). Confirmed no other hardcoded "First messaging experience in Messenger" references remain outside docs.
  - **Title Case is intentional** for this title (reads as the proper FMUX product name). Most other brief/catalog titles are sentence case (catalog was explicitly standardized to sentence case in an earlier session); flagged to Lisa, pending her call on whether to match sentence case. NOTE: if she chooses sentence case, change all three surfaces together.

### 21:05 — Problem section copy polish pass (batched)
- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: A series of small copy/punctuation edits to the Problem & Constraints (curved-text) section: P1 em-dashes → parentheses ("Icebreakers (…) existed on two surfaces"); clarified "while Facebook's bottom sheet" then de-duped by changing P2's opener to "The bottom sheet"; P2 dash → colon and reworded the second clause so there's only one colon ("visually dated: …; Messenger looked sleeker, with …"); P4 "right-aligned pills / sent message" → "centered pills, with no icon to signal they could be tapped" then "looking less like a tappable prompt" (rejected) — final is the "no icon to signal they could be tapped" version; removed duplicate "small affordance" from P5 → "a visual cue doing most of the work"; P5 experiment line → "tested both within an updated visual system."
- Decisions:
  - **"Facebook's bottom sheet" now appears once per relevant paragraph max** — watch for it recurring across P1–P3.
  - **Two em-dashes INTENTIONALLY KEPT** (P4 "send" icon —, P5 "the opposite —") — Lisa's call. Down from one per paragraph; two across the whole section is natural usage, not AI-marker overuse. Do NOT "fix" these in a future pass. All other dashes in the section were converted to colons/parens/commas.

### 20:48 — Before states copy corrected against screenshots + Winner pill final
- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: Rewrote the Before states intro to explain the actual UI differences (Lisa's copy). Winner pill finalized as solid `bg-ethos-blue text-ethos-cream` bold (tried white-outline + light-blue; blue won for legibility).
- **CANONICAL before-state facts (verified by opening `fb-before.png` / `msgr-before.png`):**
  - **Facebook bottom sheet:** icebreakers are a **static list** of full-width rows, left-aligned text, each with a blue **send icon**, hairline dividers between. Lets users tap several messages to send. (NOT an "overlay".)
  - **Messenger:** icebreakers are **centered white pills** (white bg, blue text) at the bottom of the thread, **no icon**, dismisses all options after tapping one. (NOT "right-aligned".)
- Decisions / lessons:
  - **REPEAT FAILURE of editing-discipline #1** (look at the artifact before describing it). I described the before-states from memory and got both wrong ("overlay", "right-aligned pills"); Lisa caught it — second time this exact class of error (cf. pill provenance). Always open the screenshot before writing UI descriptions.
  - **RESOLVED — Problem P4:** Lisa confirmed centered is correct. Changed P4 "right-aligned pills... closer to a message you'd already sent" → "centered pills with no icon, reading more like static suggestions than a prompt you could tap" (the "sent message" logic depended on right-alignment, so it was replaced, not just the alignment word).

### 20:19 — Case-study arc review fixes: Winner pill + trimmed Before states intro
- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: After a full-page arc review, applied two fixes. (1) Added a solid `bg-ethos-blue text-ethos-cream` "Winner" pill below the Variant A hairline in The Experiment, so the experiment's result is legible on-page (it previously never stated which variant won). (2) Trimmed the redundant Before states intro (it restated the FB-vs-Messenger performance puzzle a third time after the hero + Problem section) down to one orienting line: "Two surfaces, two executions, and as the data showed, very different results."
- Decisions:
  - **Result-early is intentional, NOT a spoiler.** Lisa overruled the suggestion to move "Messenger, redesigned" after "The Experiment." Recruiters skim and bail, so leading with the shipped result is deliberate BLUF. Don't reorder these.
  - **Winner pill uses `rounded-full`** — on a badge this short the radius lands ~at the 10px `DESIGN.md` cap; kept as a pill (thematically apt for an icebreaker-pill case). Switch to `rounded-[8px]` if strict compliance is wanted.
  - Before states intro: chose the version that keeps a thread of performance tension but dropped the em-dash (comma instead) per the standing no-em-dash rule.
- Open (from arc review, not yet done): em-dashes still in hero intro + Problem P4/P5; title "in Messenger" undersells cross-platform scope; 3 header treatments vary; stray double-space in Problem P1; long hero Outcome sentence.

### 19:54 — Replaced blue Outcome box with full-width Impact metrics section
- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: Removed the blue `bg-ethos-blue/5` Outcome box from inside the Conclusion lockup. Added a full-width **Impact** section above the Conclusion using the shared `AnimateMetrics` component (count-up grid used by inbox-ads etc.), `grid-cols-3`: +$10M Incremental revenue / +0.40% CTR (SS+) / +0.25% Conversions (SS+). Conclusion lockup is now just the two-part narrative (left) + video (right). Order: Design Principles → Impact → Conclusion.
- Decisions:
  - **Metrics now use the cross-study `AnimateMetrics` pattern** instead of a one-off card, for consistency with other case studies.
  - **Impact header = other-projects small-label treatment** (left-aligned, `text-[11px] uppercase tracking-[0.1em]`, `border-b border-ethos-blue/30`) but with `font-serif italic` instead of `font-sans` per Lisa — she wanted the layout to match other pages and only the font family changed. Don't re-center it or swap the hairline.

### 19:51 — Conclusion Outcome metrics filled + $10M validated
- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: Filled the conclusion Outcome box (was TBD): **Incremental revenue +$10M**, **Conversion rate (SS+) +0.25%**, **CTR (SS+) +0.40%**. Renamed "Conclusion" from "What shipped" earlier; this fills its metrics. Verified Meta FY2025 reported revenue (SEC/press release, reported Jan 28 2026): ad revenue **$196.175B**, total revenue **$200.966B**.
- Decisions:
  - **SENSITIVE DATA — do NOT put the raw revenue-lift percentage (the +0.0036% figure) in any page copy.** Lisa flagged it as sensitive. Show the dollar figure ($10M) only. The 0.0036% × $196.175B ≈ $7.06M math is for internal validation, not for the site.
  - **$10M stays everywhere** (hero "The $10M redesign" subhead + hero Outcome line). On the latest reported numbers the +0.0036% formula yields ~$7M, but Lisa chose to keep $10M (different/projected base she holds). Don't "correct" $10M to $7M in future passes.
  - Conversion rate and CTR percentages (SS+) are fine to display; only the revenue-lift % is sensitive.

### 19:37 — Conclusion copy rewrite + What shipped / Principles header & border changes
- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: Replaced the three "What shipped" conclusion paragraphs with Lisa's two-paragraph close (the designer's-dilemma arc: hard to fund a redesign vs. a net-new component → this project sat handoff-ready 6 months until a second project unlocked eng investment → "a redesign alone could drive incremental ads revenue, I wasn't"). Header changes: "What shipped" title is centered + underlined (matching "Messenger, redesigned") but its top hairline was removed per Lisa. Design Principles: restored its shimmer-line headline hairline (briefly removed by mistake) and bumped the full-bleed section's top/bottom frame from `border-ethos-blue/10` → full `border-ethos-blue` so the cream band's borders are actually visible.
- Decisions:
  - **Conclusion voice:** Lisa rejected an AI-polished rewrite ("not my voice"). Lesson reinforced — when she hands over a draft to "workshop," fix grammar/typos and lightly tighten only; do not restructure, swap idioms, or strip her phrasing ("designer-driven initiative", "firm believer"). Final copy is hers verbatim.

### 18:42 — Design Principles copy rewrite (all three) + I renamed
- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: Replaced all three Design Principle paragraphs with Lisa's rewritten copy and renamed Principle I "Design as a revenue lever" → **"Interaction drives revenue"** (better fits the icon-affordance argument). I: send-icon hypothesis vs. design leadership, tested both. II: replacing the one-off Messenger pill with a net-new primary/secondary component + Facebook 1:1-render framing (trimmed a redundant "gaining approvals from all surface owners" tail). III: preserving multi-send on the bottom sheet via an animated re-ordering interaction. Also removed "interaction" from the Experiment intro ("two patterns" — same interaction, different visual treatment).
- Decisions:
  - Fixed only clear typos in pasted copy (preferrable→preferable, arguements→arguments, "the the"→"with the", Messnger→Messenger); preserved Lisa's wording otherwise.
  - Avoided animate/animation repetition in III by using "animated tap interaction" once then "slide into a re-ordered list."

### 18:19 — Design Principles hairline width aligned to content shell
- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: The full-bleed Design Principles section was re-padding with a hardcoded `1.5rem` and capping inner content at `max-w-7xl` (80rem), so its hairline/headline was both narrower and ~1rem offset from neighboring sections (which sit in `SITE_CONTENT_SHELL` = `max-w-[100rem]`, `px-10` at desktop). Replaced the manual `paddingLeft/Right` calc + `max-w-7xl mx-auto` inner wrapper with `SITE_CONTENT_SHELL`, and dropped the now-redundant `px`/`-mx` classes (inline `margin` full-bleed math is unchanged). Hairline now lines up edge-to-edge with the rest of the page; cream background still bleeds full width.
- Decisions:
  - **Full-bleed sections must align inner content with `SITE_CONTENT_SHELL`**, not a hand-rolled max-width + padding. Keeps section edges consistent at every breakpoint.

### 18:13 — Video labels + conclusion mirrors "Messenger, redesigned"
- Files: `components/portfolio/unified-flow-section.tsx` (edited), `app/index/first-messaging-experience/page.tsx` (edited).
- What: Added an optional `videoLabel` prop to `UnifiedFlowSection`, rendered as a centered uppercase micro-caption (`text-[11px] tracking-[0.2em] text-gray-500`) above the portrait video — same style as the before/experiment screenshot captions. Messenger video labeled "Messenger"; bottom-sheet (conclusion) video labeled "FB bottom sheet with multi-tap". Then restructured the "What shipped" conclusion to use the same centered flex lockup as "Messenger, redesigned" (`min-[975px]:flex-row items-start justify-center gap-20`), but as a true mirror: the full text column (three conclusion paragraphs + Outcome box) in a `max-w-md` sticky column (`self-start sticky top-32`) on the LEFT, video in a `shrink-0` block with label on the RIGHT. Paragraphs were moved out of a separate full-width `max-w-3xl` block into the lockup so the text top-aligns with the video (matching how "Messenger, redesigned" keeps synthesis copy + metrics together beside the video). `order` utilities keep the video stacked first on mobile.
- Decisions:
  - **Conclusion mirrors "Messenger, redesigned"** — same lockup mechanics, reversed sides (text left / video right vs. video left / text right). Bottom-sheet video keeps its 30px corner radius (Messenger is 25px) per Lisa's earlier choices — not unified.

---

## 2026-06-18 — Session 27: FMUX team line + cross-study label consistency

### 13:56 — FMUX team line + Role normalization across case studies

- Files: `app/index/first-messaging-experience/page.tsx` (edited), `app/index/inbox-ads/page.tsx` (edited).
- What: FMUX hero Team line set to **"2 product designers, 3 engineers, 0 PMs"** — matches the `N role, N role, 0 PMs` count format used by GenAI / GenAI2 (`4 product designers, 3 engineers, 1 data scientist, 0 PMs`). The `0 PMs` phrasing (not "no PM") is the canonical form; it's a deliberate point, not an omission.
- **Cross-study Role normalization:** `inbox-ads` said "Design Lead" — every other study uses **"Lead designer"** (Lead first, lowercase designer). Normalized inbox-ads to match. Meaningful role extensions left intact: `genai-conversations` "Lead designer, project owner", `virtual-agent` "Lead designer & researcher".
- Decisions:
  - **Canonical hero labels/values:** Role = "Lead designer" (+ optional ", role" extension); Team = count format ending in "0 PMs"; labels are Role / Team / Surfaces / Outcome.
  - **`virtual-agent` Team stays prose** ("Cross-functional core pod spanning...") per Lisa — that project's team was genuinely fuzzy, so it's intentionally not forced into the count format. (Note for a future pass: "cross-functional" trips the voice rule's resume-speak flag if it ever gets reworded.)

### 22:53 — FMUX "Messenger, redesigned" video: clean SDR source + rounded corners

- Files: `app/index/first-messaging-experience/page.tsx` (edited), `components/portfolio/unified-flow-section.tsx` (edited), `public/work/fmux/flow-msgr-web.mp4` (created).
- What: The grey/washed-out video was a true HDR (BT.2020/PQ) source export; tone-mapping the HDR `.mov` never fully recovered color. Swapped to `NewIBs-MSGR.mov` from Drive, which is already H.264 / yuv420p / BT.709 SDR. Remuxed it losslessly (`-c:v copy -movflags +faststart`) to `flow-msgr-web.mp4` — no re-encode, browser-safe container. Set the portrait video clip-path to `inset(2px round 25px)` — the rounded clip also eats the black device-corner pixels from the recording. Then fixed the section layout: it was an 8/4 column split with the narrow portrait video shoved to one edge, pooling all whitespace into a dead gap in the middle (NN/Gestalt proximity violation). Re-aligned to the proven "What shipped" pattern on the same page — 7/5 split, video centered in its column, `items-center` for vertical centering — so whitespace balances on both sides of the video.
- Decisions:
  - **Root cause of grey video = HDR source, not codec or caching.** Always confirm a recording is SDR (BT.709) at export; an SDR source remuxed to mp4 needs no tone-mapping.
  - **25px corner radius exceeds the `docs/DESIGN.md` 10px cap** — applied at Lisa's explicit request to crop the black screen-corners and mimic a phone-screen radius. Flagged; left in place per Lisa.
  - **Portrait `UnifiedFlowSection` now mirrors the `What shipped` layout** (7/5, centered, items-center). Don't reintroduce wide column spans for narrow portrait media — it creates proximity gaps.
  - **Bottom-sheet "What shipped" video still has only an HDR source** (`FMUX-Bottomsheet.mov`) — needs an SDR re-export or tonemap retry. Open.

### 16:50 — FMUX portrait lockup, header, and edge-case relocation

- Files: `components/portfolio/unified-flow-section.tsx` (edited), `app/index/first-messaging-experience/page.tsx` (edited).
- What:
  - **"Messenger, redesigned" lockup:** the 12-col grid pinned the text to the far-right edge, so a narrow portrait video always left a dead gap in the middle (proximity violation). Rebuilt the portrait branch as a flex pair — video + `max-w-md` text with an 80px gutter, top-aligned, then `justify-center` to center the whole lockup as a unit. Non-portrait usage still uses the original grid.
  - **Section header:** centered "Messenger, redesigned" and switched it to `text-ethos-blue` to match the other section headers (`px-12` so the underline is symmetric). `UnifiedFlowSection` is FMUX-only, so this is safe.
  - **Variant B caption:** "Text-only, cleaner but less discoverable." → "Text only, cleaner but similar to a sent message."
  - **Edge case relocated:** moved the "Multi-tap on bottom sheet" block out of The Experiment and into the "What shipped" text column, beside the bottom-sheet video — the surface the behavior actually belongs to.
- Decisions: For narrow portrait media, use a centered flex lockup, not a wide-column grid. Captions/edge cases live next to the surface they describe.

### 17:12 — FMUX "What changed" + hero outcome copy

- Files: `app/index/first-messaging-experience/page.tsx` (edited), `components/portfolio/unified-flow-section.tsx` (edited).
- What:
  - Relabeled the redesign block's sub-heading from "Synthesis" → "What changed" (it's a redesign reveal, not a synthesis).
  - Removed the metrics grid and Surfaces tags from that block — `metrics` is now an optional prop on `UnifiedFlowSection` and both metrics/tags render conditionally.
  - Rewrote the "What changed" copy several times for voice/cohesion. Final: "The redesign extended Messenger's design system with a secondary pill variant. New type, spacing, color, and tap animations. The old white pills looked pasted on top of the thread; the new ones sit on the right, in the sender's side of the conversation, where a reply belongs. It's the best of both originals: Messenger's polish plus the send icon that drives revenue."
  - Hero Outcome line set to: "Shipped a unified icebreaker UI based on Messenger's design system across both Messenger and Facebook, incorporating new motion patterns, for a $10M incremental revenue gain."
- Decisions:
  - **`UnifiedFlowSection` is FMUX-only**, so trimming metrics/tags to optional is safe.
  - **Open voice/structure flag:** the "What changed" block sits *above* "The Experiment," yet its last line ("send icon that drives revenue") states the experiment's payoff. Left in at Lisa's direction as a teaser; revisit if it reads as a spoiler.

### 17:21 — Editing-discipline rule + corrected element attribution

- Files: `.cursor/rules/editing-discipline.mdc` (created), `app/index/first-messaging-experience/page.tsx` (edited).
- What:
  - After a long copy back-and-forth, captured 5 working-discipline lessons as an always-apply rule: (1) look at the artifact before inferring, (2) edit in full context not line-by-line, (3) don't ship regressions while polishing, (4) accurate facts beat good prose, (5) don't re-litigate settled decisions.
  - **Verified element attribution from the before screenshots** (should have done this first): `fb-before.png` = Facebook bottom sheet uses a **list** of rows, each with a **send icon**; `msgr-before.png` = Messenger uses **white pills**, no send icon. So the redesign kept the **pill from Messenger** and the **send icon from the Facebook bottom sheet**. Corrected the "What changed" close accordingly and removed a false "a plain list reads as static text" line (the list was the better-performing bottom sheet).
- Decisions:
  - **Canonical FMUX element provenance:** tappable pill = Messenger; send icon = Facebook bottom sheet. Don't reverse this in future copy.
  - **Possible follow-up:** the Problem section's "Messenger looked like static text" framing is slightly off vs. the screenshots (Messenger pills read like already-sent bubbles, not static text). Not changed yet — flagged for Lisa.

### 17:27 — Problem-section accuracy fix, type bump, sticky "What changed"

- Files: `app/index/first-messaging-experience/page.tsx` (edited), `components/portfolio/unified-flow-section.tsx` (edited).
- What:
  - **Problem section accuracy:** replaced "Messenger icebreakers looked more like static text, not an interactive element" with the screenshot-accurate "Messenger showed them as right-aligned pills with no icon, closer to a message you'd already sent than a prompt you could tap."
  - **Body type bump:** "What changed" synthesis copy and "Before states" intro both bumped `text-base` → `text-lg` (16px → 18px) to match the page's body standard.
  - **Sticky "What changed":** gave the portrait text column the same sticky behavior as Before states (`min-[975px]:sticky top-32 self-start`). Required removing `overflow-hidden` from the `UnifiedFlowSection` `<section>` — any clipping ancestor disables `position: sticky` on descendants. The video crops via `clip-path`, so nothing relied on the overflow clip.
- Decisions:
  - **`overflow-hidden` + `position: sticky` are incompatible** — don't put `overflow-hidden` on a section that needs a sticky child.
  - Pre-existing em-dashes remain on lines ~114 and ~122 of the Problem paragraph — flagged to Lisa, not changed unasked.

### 17:45 — Suggested-messages pulled into the conclusion; new project-momentum story

- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What:
  - Removed Design Decisions card III ("Suggested messages") and dropped that grid from 3 columns to 2 (now just Animation patterns + Messenger system fit, the two genuine decisions).
  - Rewrote the **What shipped** conclusion: replaced the short col-5 intro paragraph with a full-width `max-w-3xl` three-paragraph narrative that finally tells the project-momentum story: the redesign sat handoff-ready ~6 months before eng built the component and ran the experiment; extending the pill pattern beyond the first consumer↔business exchange (into consumer suggested messages) opened a large enough opportunity to justify the build; Lisa predicted the icebreaker redesign alone would drive revenue and it surprised the engineers ("Design win"). Grid below keeps Outcome box + Edge case beside the bottom-sheet video.
- Decisions:
  - **Suggested messages is a project-justification beat, not a design decision** — it belongs in the conclusion narrative, not the Design Decisions list.
  - Type/voice: full-width narrative matches the Problem/Experiment intro pattern (`max-w-3xl`, `text-lg text-gray-600`); no em-dashes; no "But/And" sentence openers.
  - **Flag:** with this added, the Problem section (5 paragraphs) + this conclusion makes the page text-heavy overall. Lisa noted the intro is heavy; a future pass may trim the Problem section for balance.

### 18:05 — Design Decisions section overhaul (real tradeoffs)

- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: Replaced the "robotic, infrastructure-listing" Design Decisions cards (Animation patterns / Messenger system fit / Suggested messages) with three real tradeoffs sourced from Lisa, each framed tension → call → cost:
  - **I. The send icon** — leadership wanted it removed (visual noise) vs. Lisa's read that it was the tappability signal/revenue lever. Resolved by testing both in the experiment instead of by seniority.
  - **II. A net-new component** (the staff-level beat) — the OLD icebreaker pill (white background, blue text) only existed for icebreakers and was never integrated into the design system. That was the opening to argue for replacing the one-off outright with a net-new design → primary + secondary variants, reusable (e.g. consumer suggested messages), optional icon. The **light-blue secondary pill** is the net-new result. Won over Messenger design-system owners. Facebook wrinkle solved by framing the bottom sheet as a 1:1 render of Messenger, not native FB UI.
  - **III. Multi-send** — data showed multi-send on the bottom sheet drove revenue, so the redesign preserved it via a designed interaction (tap one, remaining options animate into a re-ordered list). Corrects the earlier "open question" framing.
  - Restored the grid to 3 columns; removed the now-redundant "Edge case: Multi-tap" block from the conclusion (card III supersedes it).
- Decisions:
  - **Canonical pill provenance:** OLD Messenger icebreaker pill = white background, blue text (the un-systematized one-off). REDESIGN pill = light-blue background, dark text, blue send icon (the net-new secondary variant that replaced it). Verified the redesign pill color via `variant-a-msgr.png`. Don't reverse these.
  - **Design Decisions now operate at a higher altitude** (alignment/governance/politics), per Lisa: the hard part at Meta was getting alignment to ship, not drawing the pill. Keep this framing in future edits.
  - Section still titled "Design Decisions" — Lisa didn't pick a new title; open to rename (e.g. something about alignment).
  - Card II is intentionally longer than I/III (most important); height imbalance accepted.

### 18:03 — Design Decisions → "Design Principles" + finalized titles + copy polish

- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What:
  - Renamed the section heading (and code comment) from **"Design Decisions" → "Design Principles"** — the three items read better as principles than as a decision list.
  - Finalized the three card titles (Lisa's wording): **I. Design as a revenue lever**, **II. New component that scales**, **III. Preserve existing features**.
  - Card I copy polish (per Lisa): killed "tappability signal" → "what made the pill read as a button"; replaced the editorialized "A cleaner pill wasn't free…" with the plainer "Without it, the surface was cleaner but harder to read as tappable."
  - Card III: pulled in "so the next tap stays in context" (the one genuinely useful idea from a Gemini draft Lisa shared; rejected the rest as resume-speak that violated `voice.mdc`).
- Decisions:
  - **Section is "Design Principles"** now, not "Design Decisions."
  - Reaffirmed voice stance: rejected a polished-but-jargony external rewrite ("drove alignment," "orphaned asset," "design-system stewards," em-dashes) — it failed the "would Lisa say this out loud" test.

---

## 2026-06-16 — Session 26: FMUX real assets dropped in

### 19:55 — FMUX: wired before/experiment screenshots + redesign videos

- Files: `components/portfolio/mobile-screen-placeholder.tsx` (edited), `components/portfolio/unified-flow-section.tsx` (edited), `app/index/first-messaging-experience/page.tsx` (edited), `public/work/fmux/*` (6 assets added).
- What: Replaced all placeholder slots on FMUX with real exports from `Meta/FMUX/` (Google Drive).
- **Assets copied** (Drive → `public/work/fmux/`): `Bottom Sheet old.png` → `fb-before.png`; `MSGR old.png` → `msgr-before.png` (also reused as experiment Control); `MSGR A.png` → `variant-a-msgr.png`; `MSGR B.png` → `variant-b-msgr.png`; `FMUX-MSGR.mov` → `flow-msgr.mov`; `FMUX-Bottomsheet.mov` → `flow-bottomsheet.mov`. Keyboard variants intentionally ignored per Lisa.
- **Slot mapping** (confirmed by Lisa): Before states = FB bottom sheet old + MSGR old. Experiment is **all Messenger**: Control = MSGR old, Variant A = MSGR A (with icon), Variant B = MSGR B (no icon). Mid-page video = Messenger redesign (`flow-msgr.mov`). End "What shipped" video = bottom sheet redesign (`flow-bottomsheet.mov`).
- **`MobileScreenPlaceholder` now supports real images** — added `src`/`alt` props. When `src` is set, renders `<img className="h-full w-auto object-contain">` inside the device frame and **drops the forced `aspect-ratio: 9/16`** so the frame hugs the screenshot's natural aspect. Screenshots are ~9:19.5 (750×1624, 810×1684), taller than 9:16 — forcing the old aspect would have cropped content. Placeholder text branch unchanged for any slots still without assets.
- **Vertical video presentation** — both redesign videos are portrait phone recordings (`flow-msgr` 800×1726, `flow-bottomsheet` 758×1632). Landscape containers (ScrollVideo `w-full`, the old `aspect-[16/10]` end slot) would have stretched them. Both now render as **ambient autoplay phones**: `autoPlay loop muted playsInline`, `h-[min(760px,75vh)] w-auto`, device border + atmospheric shadow, centered. Matches the curved-intro video treatment at the top of the page (no ScrollVideo chrome).
- **`UnifiedFlowSection` gained a `portrait` prop** — when set with `videoSrc`, renders the centered ambient phone instead of `ScrollVideo`. Component is FMUX-only, so the change is safe. ScrollVideo path preserved for landscape use.
- Decisions:
  - **Frame hugs media, no forced aspect, for real screenshots/videos.** Same principle as the curved-text video (`max-w` only): constrain one dimension, let the other follow natural aspect. Avoids cropping product UI.
  - **Ambient autoplay (no controls) is the FMUX video treatment.** Consistent across intro + both redesign demos. ScrollVideo chrome reserved for landscape conclusion videos (GenAI pattern).
- **Copy decisions made on Lisa's behalf — FLAG FOR REVIEW:**
  - Renamed mid section `"The unified flow"` → **`"Messenger, redesigned"`** (Lisa said the video isn't a unified flow, it's the Messenger redesign).
  - Rewrote that section's synthesis to a Messenger-specific line and trimmed tags to `["Messenger", "Icebreakers"]` (was a both-surfaces "unified" framing). **Not yet voice-approved.**
  - Mid section + end "What shipped" both still carry metric blocks (`+$10M/yr`, CTR TBD) — potentially redundant. Left as-is; worth a pass.

---

## 2026-06-12 — Session 25: FMUX before-states scoped reveal

### 23:45 — FMUX hero: left-align second headline line

- Files: `app/index/first-messaging-experience/page.tsx` (edited).
- What: Removed `ml-[10vw]` from the "in Messenger." headline span so both lines of the hero title stack left-aligned. The indent made the second line sit awkwardly offset from the first.
- Decisions: None.

### 15:55 — FMUX: staggered scroll reveal for before-states screenshots

- Files: `components/portfolio/reveal-on-scroll.tsx` (created), `app/index/first-messaging-experience/page.tsx` (edited — import + wrapped both before-state screenshots).
- What: Brought a reveal animation back, but **scoped to the before-states section only** instead of reviving the global `.case-reveal` (which Lisa killed in Session 24 because it made the whole page read as "still loading"). New reusable `RevealOnScroll` client component: fires once via Intersection Observer at 20% visible (`rootMargin: 0px 0px -80px 0px`), fades `opacity 0→1` + `translateY(24px)→0` over **500ms**, accepts a `delay` prop for staggering, and respects `prefers-reduced-motion` (renders visible instantly, no motion).
- Before-states section: Facebook bottom-sheet screenshot reveals at **0ms**, Messenger at **200ms** — reads as a sequential comparison. `delay={200}` carries the `min-[768px]:mt-24` offset via the new `className` passthrough so the staggered card keeps its vertical offset.
- Decisions:
  - **Reusable component over global class.** Per the component-extraction rule, this fade-up will be reused on other sections/case studies, so it lives in `components/portfolio/` rather than as a one-off or a revived global. The inert global `.case-reveal` no-op from Session 24 is untouched and independent of this mechanism.
  - **Scoped, not global, reveal is the path forward.** If other sections want motion, wrap their children in `RevealOnScroll` deliberately — don't re-enable the blanket fade-up that caused the loading-perception problem.
  - **Motion is built against placeholders.** Real screenshots will inherit the same reveal unchanged when swapped in; no need to wait on final assets.

---

## 2026-05-27 — Session 24: FMUX section pattern + curved-text polish

### 18:00 — FMUX: GenAI section header pattern + case-reveal kill + curved-text video swap

- Files: `app/index/first-messaging-experience/page.tsx` (edited), `app/globals.css` (edited), `public/work/fmux/icebreaker-curved-intro.mov` (created).
- What: Aligned FMUX section pattern with GenAI; replaced curved-shape placeholder with real video; iterated curved-text copy and layout to land final state.
- **Section headers** — All four top-level section headers (`Problem and Constraints`, `The Experiment`, `Design Decisions`, `What shipped`) now use the GenAI pattern: `border-t border-ethos-blue` + `shimmer-line` + `font-serif italic text-3xl text-ethos-blue` h2 with `pt-4 mb-12`. The freestanding hairline that lived under the hero (`border-b border-ethos-blue mt-12`) was removed — its visual job is now done by the hairline at the top of "Problem and Constraints."
- **Section title rename** — `Two platforms, two problems` → `Problem and Constraints`. Old title was descriptive; new title matches the noun-phrase pattern across other case studies.
- **Curved-text section** — `.curved-text-shape-right` finalized: float right, **width 50%**, **height 560px**, `shape-outside: ellipse(55% 50% at 70% 50%)`, no border, no background, `justify-content: center`. Video `<video src="/work/fmux/icebreaker-curved-intro.mov" autoPlay loop muted playsInline>` uses **`max-w-[70%]`** only (no `max-h` — keeps video size stable when float height is tuned), `clipPath: inset(10px)` to crop hairline edges, `transform: translate(50px, 5%)` to nudge right + down without affecting text reflow. **Float height was the lever** for "completing the curve": 700px left the bottom paragraph flowing past the float (no curve closure visible); 480px shrunk the video; 560px landed the final line just inside the wrap.
- **Curved-text copy** — Para 5 rewritten three times. Final framing: design leadership wanted the send icon out of any redesign; Lisa's instinct said the icon was the revenue lever; she proposed an experiment that tested both directions inside the updated visual system. Earlier versions were trimmed for redundancy with paras 1–4 and to drop "Same layout, same type, same motion. Let the data settle it." once it stopped earning its keep.
- **case-reveal animation killed** — `.case-reveal` (1.2s opacity 0 + 40px translateY fade-up on every section) now no-op: `opacity: 1; transform: none;`. Lisa said it "looks like the page isn't loading." Class still on every section, observer still runs (no harm); easy to restore a snappier 200–250ms version later. The associated `prefers-reduced-motion` block was simplified to only suppress `.shimmer-line` (case-reveal no longer needs it).
- Decisions:
  - **`max-h` removed from the curved-text video** — relative max-height couples video size to float height, which made every height tweak shrink the video. Width-only constraint decouples them. Pattern worth reusing whenever a media element sits inside a vertically-tunable shape-outside container.
  - **Float height ≈ text body height** is the rule for `shape-outside` curve closure. Too tall → text ends inside the float and the wrap doesn't visually close back to full width; too short → text spills past the float and the last lines go full-width without curving back. Sweet spot: float height matches the wrapped body height to within one line.
  - **GenAI section pattern is the canonical case-study header now.** Hairline + shimmer + italic 3xl blue. FMUX brought into the system; future case studies should default to this.
  - **The hero hairline is owned by the first section, not the hero.** Removing the dedicated hero hairline and relying on the next section's `border-t` keeps the system consistent and removes a now-redundant separator.
  - **Section title pattern is "Noun + Noun" or "The X"**, not descriptive sentences. "Problem and Constraints" matches; "Two platforms, two problems" did not.
- **Known issue, not blocking:** Turbopack's CSS HMR did not pick up changes to `.curved-text-shape-right` or `.case-reveal` mid-session — required a `rm -rf .next && npm run dev` restart twice. Source files were always correct; the served bundle was stale. If a future change to `app/globals.css` doesn't appear in the browser after a hard refresh, restart the dev server before debugging the CSS.

---

## 2026-05-24 — Session 23: Chroma Capture (second Lab experiment)

### 20:14 — Chroma Capture v4.12 — density 24 → 30 (with cadence this time)

- Files: `components/lab/chroma-capture-canvas.tsx` (edited — target 24 → 30, cadence 3000 → 2400 ms, jitter 1000 → 800 ms), `docs/DECISIONS.md` (edited — added v4.12 entry above v4.11).
- What: Re-applying v4.10's intent (more blobs) now that v4.11 surfaced the actual lever. New equilibrium: 72 s / 2.4 s = **30 blobs sustained**. Pre-roll fills to cap at first paint (no ramp-up visible).
- Decisions:
  - **Three-knob change applied together** — target, base cadence, jitter — to keep variance ratio at the v4.11-calibrated 33 % of base. Treating them as a coupled set, not independent levers.
  - **Pre-roll is now over-provisioned** (90 s × 1/2.4 s = ~37 possible spawns vs target 30). Field will hit the cap during pre-roll instead of after, which is the cleaner first-paint behavior.
  - **Entrainment math holds**: at N=30 with blobEntrainScale=0.008, accumulated coefficient ≈ 0.032, still well under cursor scale 0.1. v4.9 tuning preserved.

### 20:11 — Chroma Capture v4.11 — cadence calibration (the density-target bug)

- Files: `components/lab/chroma-capture-canvas.tsx` (edited — target back to 24, cadence 3500 → 3000), `docs/DECISIONS.md` (edited — added v4.11 entry above v4.10, marked v4.10 SUPERSEDED).
- What: Investigating "can't tell a difference between 24 and 30" uncovered a real architectural bug. **Spawn cadence — not `TARGET_BLOB_COUNT_DESKTOP` — has been governing equilibrium population since v3.2.** The math: `N_eq = traversal_time / cadence = 72 s / 4 s = 18`. Targets 24 (v4.8) and 30 (v4.10) were ceilings that didn't bind, because the spawn rate (1 per cadence interval) was always slower than the exit rate at N > 18. Pre-roll briefly fills to ~22, then field drains back toward 18 over ~30 s.
- Resolution: roll target to 24 + drop `STEADY_CADENCE_BASE_MS` 3500 → 3000 ms. New equilibrium: 72 / 3 = 24. **Density is now actually 24, for real, in steady state.**
- Decisions:
  - **Future density changes require touching cadence.** Documented prominently in the new v4.11 DECISIONS entry with the full `N_eq = canvas_height / (|vTerminal| × cadence)` equation so a future agent doesn't repeat the mistake.
  - **`TARGET_BLOB_COUNT_DESKTOP` is now correctly understood as a ceiling, not a target.** It caps the field but doesn't drive equilibrium. The lever is cadence.
  - **v4.10 entry preserved with [SUPERSEDED] marker**, not deleted — keeps the chronological investigation legible.
  - **Jitter held at 1000 ms.** Variance ratio is now 33 % of base (was 29 %); still well under "metronomic spawn" threshold.
  - **v4.9 entrainment fix still holds**: it was tuned against equilibrium ~18–22, which is close enough to the new 24 that no re-tuning is needed yet. If clumping returns at the now-actually-24 population, drop `blobEntrainScale` 0.008 → 0.006.

### 20:00 — Chroma Capture v4.10 — density 24 → 30

- Files: `components/lab/chroma-capture-canvas.tsx` (edited), `docs/DECISIONS.md` (edited — added v4.10 entry above v4.9).
- What: `TARGET_BLOB_COUNT_DESKTOP` 24 → 30 (+25%). Lisa testing the upper end of v4.8's documented range now that v4.9 broke up the lateral clumping that was the prior ceiling. Math: at N=30 each blob has ~10 σ-neighbors → accumulated entrainment coefficient 10·0.008·0.4 ≈ 0.032 (was 0.026 at N=24). Still well under cursor scale 0.1 — "whisper" level preserved.
- Decisions:
  - **Density is the user-facing lever; entrainment is internal.** If clumping returns, drop `blobEntrainScale` 0.008 → 0.006 rather than rolling density back. Reflected in the v4.10 fallback path.
  - **O(n²) entrainment perf at N=30**: 900 pair checks/tick (was 576). Inside frame budget; existing distance gate covers the rest.

### 19:55 — DECISIONS.md sweep — lift session-level work to architecture-level

- Files: `docs/DECISIONS.md` (edited).
- What: Cross-check pass found four gaps where today's work needed to be lifted from session log to architectural record so the next agent doesn't have to spelunk:
  1. **Slot labels updated** across 8 references in 5 sections (Lab page intro, framed-work-model bullets, Typoglycemia header copy, Typoglycemia border note, Lab page integration list, Chroma Capture section heading). Chroma is now slot 01, Typoglycemia is slot 02 everywhere.
  2. **New section: "Lab experiment header — 3-tier pattern"** under Lab page. Codifies the eyebrow/title/subtitle structure (Inter 11px uppercase / Newsreader clamp h2 / Newsreader 16px italic 70%) so future Lab experiments inherit it by reference, not by re-deriving the rationale.
  3. **New section: "Reset CTA + scroll runway math"** under Typoglycemia. Documents the 540 px vertically-centered block that double-purposes as the unscramble runway, the immediate-rescramble-then-smooth-scroll reset behavior, and `isResettingRef` flag.
  4. **New section: "Rendering (Safari — JS-baked goo, CSS filter dropped)"** under Chroma Capture (inserted above v4.9 — newest-on-top). Permanent cross-browser rendering split: CSS filter on Chrome/Firefox, JS-baked three-stage canvas pipeline on Safari. Includes the matching-pipeline decisions, the two-layer detection pattern, DPR=1 cap, and the visual tradeoff acknowledgement.
- Decisions:
  - **Newest-on-top ordering for Chroma Capture's render section family.** Inserted the Safari entry above the v4.x entries to match the existing chronology pattern in that section.
  - **No git rewrite of the `slot 02` history.** The previous slot numbers were correct at the time they were written; updating them in place rather than appending a "renamed" note keeps DECISIONS scannable as a current-state doc instead of a changelog.
  - **Cross-reference, not duplicate.** Typoglycemia's "Section header" bullet now links to the 3-tier Lab pattern instead of restating it.

### 19:42 — Session close — unlogged copy + style tweaks

Catching trailing iterations that fell below per-entry logging threshold:

- **Chroma subtitle**, three iterations: removed "colors play as chords" (sound stays a discovery) → tried "Liquid color. Move through it. Save the moments you make." → final: "Liquid color. Move it, pop it. Save the moments you make." (the comma pair gives rhythm; "pop it" surfaces the click interaction without spoiling the sound).
- **Typoglycemia subtitle**: "An essay you decode by scrolling." → "Scrambled letters your brain reads anyway. Scroll to watch them resolve." Leads with the cognitive paradox (Rawlinson) instead of the mechanic; "resolve" matches the visual.
- **Reset CTA restyle**: centered vertically inside the 540 px runway (was: bottom-aligned after a 500 px spacer); `font-semibold`, `text-white` (full strength), icon stroke 1.4 → 1.7 to match the bolder text weight.

### 19:35 — Chroma Capture — Safari Pass 3 (JS-baked goo, CSS filter dropped)

- Files: `lib/chroma/render.ts` (edited — new `renderFrameBaked` function), `components/lab/chroma-capture-canvas.tsx` (edited — stages, branch in tick, conditional filter).
- What: Pass 1+2 (DPR cap + GPU hints) didn't move the needle on Safari, so escalated to Pass 3: bake the entire goo filter chain in JS on Safari and drop the CSS `filter: url(#chroma-goo)` from the canvas style. The visual output matches Chrome's CSS-filter pipeline frame-for-frame — same blurs (σ=10 + σ=25), same threshold (×30, −11.7×255), same alpha boost (×1.15) — but Safari now handles each filter primitive as a discrete canvas operation it CAN GPU-accelerate, instead of a compound SVG-filter graph it can't pipeline.
- New API: `renderFrameBaked(visibleCtx, stages, blobs, opts)` in render.ts. Stages are three offscreen canvases (stage1 = solid blobs DPR-scaled, stage2 = silhouette mask, stage3 = soft color cloud), all created and sized inside `applySize` on Safari only. The function mirrors `captureToPng`'s pipeline but writes through the visible canvas and adds the flash overlay.
- Chrome path is bit-for-bit unchanged: still uses the CSS filter URL, still calls regular `renderFrame`, no stages allocated, no extra memory.
- Decisions:
  - **Match Chrome's pipeline exactly**, including the alpha boost. Skipping it would have saved one pixel pass (~3 ms) but Safari output would be more pastel than Chrome — divergent visuals across browsers is a worse outcome than a slightly tighter Safari frame budget.
  - **One bake function in render.ts**, not factored shared with `captureToPng`. The capture path runs once per click; refactoring for ~30 lines of overlap isn't worth the abstraction cost. They can converge later if a third caller appears.
  - **Ref + state pattern** for Safari detection: `isSafariRef` for tick (no stale closure), `isSafari` state for JSX (clean SSR/hydration). Detection effect declared BEFORE mount effect so the ref is set before tick starts.
  - **Stages cached on refs**, not recreated per frame. ResizeObserver-driven `applySize` resizes them when the visible canvas resizes.
  - **GPU hints removed** (were Pass 1). With the CSS filter gone on Safari there's no live filter for `will-change: filter` to optimize.

### 19:28 — Chroma Capture — Safari perf pass (DPR cap + GPU hints)

- Files: `components/lab/chroma-capture-canvas.tsx` (edited).
- What: Two Safari-only mitigations for the live SVG filter chain (σ=10 + σ=25 + composite + threshold), which is GPU-accelerated on Chrome/Firefox but CPU-bound on WebKit. At DPR=2 on retina (3M backing-store pixels) Safari can't hold 60fps; visitors saw stutter.
  1. **DPR cap**: Safari users render at DPR=1 (was 2). Halves backing-store pixel count → halves per-frame filter cost. Goo filter blurs everything anyway, so the crispness loss is imperceptible in motion.
  2. **GPU compositing hints** on the canvas element: `will-change: filter` + `transform: translate3d(0,0,0)` to coerce WebKit into promoting the canvas to its own GPU layer instead of CPU-repainting it each frame.
- Both gated on `detectSafari()` (UA-sniff for Safari excluding Chrome/Android). Chrome's path is bit-for-bit identical to the pre-pass code — same DPR=2, same style object, same compositing.
- Decisions:
  - **UA sniff over feature detect**: the perf delta is browser-engine specific; there's no feature-detection signal for "slow filter compositor." UA-sniff is the standard for browser-perf workarounds.
  - **Detection in two layers**: `detectSafari()` called inline inside `applySize` (no stale-closure risk; resize observer batch re-detects each call) for the DPR cap. State variable `isSafari` set via post-mount `useEffect` for the JSX style spread (avoids SSR/hydration mismatch — both server and client first render see `isSafari=false`; Safari path kicks in via re-render after mount).
  - **Did not change SVG filter parameters**. Reducing σ would weaken the goo effect for everyone; the DPR halving achieves the same per-frame reduction without touching visual fidelity.
  - **Did not skip CSS filter entirely** (would be a JS bake-in pipeline on Safari only — Pass 3 in the plan). Holding that in reserve in case Passes 1+2 aren't enough.

### 19:17 — Typoglycemia — fix unscramble bug + add reset button

- Files: `components/lab/typoglycemia-section.tsx` (edited).
- What: Two things in one pass.
  1. **Bug fix**: at full 720px box height, the last 1–2 essay paragraphs could never unscramble because there wasn't enough scroll runway below them. Math: for a word to cross the demarcation line at `top: 120px`, the runway below the last essay word must be at least `clientHeight − 120` ≈ 600px. Currently only ~120px exists (hr + attribution + padding). Added a 500px runway div between attribution and the new reset button; reset block + bottom padding fills the rest. Worst-case math now clears.
  2. **Reset button**: refresh icon + "Reset experiment" text, centered, font-sans 13px, /60 opacity, hover ethos-blue. Click smooth-scrolls box to top + immediately re-scrambles body words (replaces clean set with intro-only). After scroll settles (~700ms), re-measures and re-syncs.
- Decisions:
  - **Option A (reset at bottom)**, not Option B (reset at +200px below essay). Reset at bottom doubles as a natural "end of experience" anchor and the 500px above it does real scroll-runway work instead of being dead air.
  - **Body scrambles immediately on click**, not at scroll-end. Instant visual confirmation that reset fired. The smooth scroll then animates through already-scrambled body.
  - **`isResettingRef` flag** suppresses `mergeCleanSet` during the reverse-scroll so words don't get re-cleaned as they briefly pass above the line going up. Cleared in the post-scroll timeout.
  - **`introSeeds` memoized once** from the intro paragraph tokens — the canonical "what should stay clean across resets" set. Doesn't depend on DOM measurement, so the immediate-clear works before the scroll starts.

### 18:33 — Lab — experiment header restructure + reorder

- Files: `components/lab/chroma-capture-section.tsx` (edited), `components/lab/typoglycemia-section.tsx` (edited), `app/lab/page.tsx` (edited).
- What: Three-tier experiment header applied to every Lab experiment.
  1. **Eyebrow** (was `<h2>` "01 — Typoglycemia"): now `<p>` "01 — Experiment" / "02 — Experiment". Generic label, no longer a heading since the label alone isn't semantically meaningful.
  2. **Title** (was the big italic subtitle slot): now an `<h2>` with the experiment name (Chroma Capture, Typoglycemia). Same `clamp(1.25rem,2.5vw,1.75rem)` size, dropped italic (proper nouns shouldn't lean) and 80% opacity (full-strength as the actual heading).
  3. **Subtitle** (new): smaller body description at 16px italic font-serif, 70% opacity, 56ch max-width. Italic distinguishes it from the 18px non-italic page intro at the top of `/lab`.
- Also: reordered experiments — Chroma Capture is now 01, Typoglycemia is 02. Chroma is visually stronger and pulls a visitor in faster.
- Decisions:
  - **Title is real `<h2>`, eyebrow is `<p>`**. Semantic ordering: page H1 = "Lab", section H2 = experiment name. The eyebrow "01 — Experiment" alone isn't a meaningful heading; it's a numbered label.
  - **Title non-italic**. Proper nouns. The previous italic in the subtitle slot was decorative; for an actual title it reads weird.
  - **Subtitle italic, 16px**. Reads as descriptive lede / hint at instructions, not body prose. Visually subordinate to both the 18px page intro and the title above it.
  - **Dropped the `<span className="not-italic">` space wraps** on Chroma's description. They were a micro-fix for the old huge-italic-subtitle treatment; at 16px italic the kerning isn't visibly off.

### 18:29 — Chroma Capture — resize stutter fix

- Files: `components/lab/chroma-capture-canvas.tsx` (edited).
- What: Two changes to eliminate the blank-frame flicker during active drag-resize.
  1. `applySize` now synchronously re-renders the current blob state at the end (guarded on `blobs.length > 0` to skip mount-time first call before pre-roll populates the field). Setting `canvas.width`/`canvas.height` wipes the backing store; without an immediate repaint the next rAF tick can be up to 16ms away, so the user sees a cream-blank frame during a drag-resize. The sync repaint closes that gap.
  2. `ResizeObserver` callback now rAF-batches its `applySize` invocation. Multiple observer fires within one frame collapse to one resize + one repaint, instead of N resets per frame.
- Decisions:
  - **Sync repaint with `flashAlpha: 0`, `includeGrain: false`.** Mid-capture-flash resize is a non-existent path; the next rAF tick will resume correct flashAlpha. Grain stays off (matches live frame loop).
  - **No CSS-transform transient scaling.** The simpler fix (immediate repaint at native resolution) is enough; no need for a transient blurry stretched canvas during drag.

### 18:24 — Chroma Capture — watermark text black, not ethos-blue

- Files: `lib/chroma/render.ts` (edited, line 228).
- What: PNG watermark text changed from `#1313ec` (ethos-blue) to `#000000`. Scrim (cream @ 72% opacity) unchanged. Watermark only appears in the captured PNG, not in the live render.
- Decisions: pure black, not a softer gray-900. Lisa was specific.

### 18:19 — Chroma Capture — control icons switched to filled style

- Files: `components/lab/chroma-capture-section.tsx` (edited).
- What: Camera, SpeakerOn, SpeakerOff icons converted from stroke (1.2px outline) to fill. Camera body uses `fillRule="evenodd"` to punch the lens circle out as negative space (no overlay needed for the cream button bg). Speaker cones are filled solid; sound-wave arcs and mute-X remain stroked (standard Heroicons-solid convention — open curves don't have a "filled" form, and detail-line strokes were bumped 1.2 → 1.4px to balance visual weight against the now-solid cone).
- Decisions:
  - **`fillRule="evenodd"` over a colored cut-out.** Cleaner: the lens is true negative space, works on any button bg without coordination.
  - **Detail strokes stay strokes.** Sound waves and mute-X are line-art; they don't read better as filled shapes.

### 18:12 — Chroma Capture v4.9 — entrainment 0.015 → 0.008 (anti-clumping pass)

- Files: `lib/chroma/physics.ts` (edited).
- What: After the v4.8 density bump to 24 blobs, lateral clustering became the dominant motion pattern — blobs would form 5–6-blob clumps with large empty regions elsewhere. Diagnosis: pairwise entrainment (blob-blob velocity coupling) at scale 0.015 was a "whisper" per-pair, but at N=24 each blob is within σ=130px of up to ~8 neighbors at once. Accumulated impulse dominated lateral motion. Halved the per-pair scale to 0.008. Option A from a four-option plan (A = single lever, conservative).
- Decisions:
  - **One lever, not three.** Lisa picked the conservative single-variable change. Cleaner to evaluate. If still clumping, B (faster upward) and C-extras (tighter σ, less horizontal noise) remain on the table.
  - **Did not touch `blobSigma`.** Reducing the entrainment radius would change the *shape* of the influence (sharper falloff with distance) on top of the strength change. Keeping σ constant means only the magnitude of the force changed, not its spatial profile.
  - **Did not touch `vTerminal`.** Faster upward motion was a separate option (B). The current "hypnotic slow rise" is part of the lava-lamp character; only weaken if the entrainment fix alone is insufficient.

### 18:03 — Chroma Capture v4.8 — density 18 → 24 blobs

- Files: `components/lab/chroma-capture-canvas.tsx` (edited).
- What: Pass 3 of the 3-pass plan. Bumped `TARGET_BLOB_COUNT_DESKTOP` from 18 to 24 (+33%). Mobile (`TARGET_BLOB_COUNT_MOBILE = 10`) untouched — Lisa specified desktop only.
- Decisions:
  - **24, not 26.** Lisa picked the conservative end of the recommend range. Easy to bump further if still sparse.
  - **Radius range held.** Original Option A bundled +20% on radius range; Lisa specified count only. Single-variable change = clean evaluation.
  - **Mobile untouched.** Mobile playfield is smaller; the existing 10-blob density looks proportionate. Will revisit if a mobile review surfaces issues.
- Perf note: at 24 blobs the physics tick is still O(n²) for pairwise entrainment, but n=24 is fine on modern hardware; should hold 60fps. Watch for jank on first reload.

### 17:55 — Chroma Capture v4.7a — neon yellow L=0.84 → 0.78

- Files: `lib/chroma/color.ts` (edited).
- What: After v4.7 ALPHA_BOOST lift, the neon yellow (already L=0.84, brightest tier) was reading as highlighter-pen against the cream background, overpowering the rest of the palette. Dropped L to 0.78 — still distinctly brighter than the light tier (L=0.66) but proportionate. Hue (92) and chroma (0.21) unchanged. Updated palette comments to reflect the new neon tier lightness.
- Decisions:
  - **L only, not C.** Reducing chroma would mute the neon character. The brightness was the issue, not the saturation.
  - **0.78 lands in the middle of the safety range.** L=0.72 would push toward "school bus yellow" (less neon). L=0.84 was the over-bright case. 0.78 is the defensible middle.

### 17:51 — Chroma Capture v4.7 — saturation lift (ALPHA_BOOST 1.08 → 1.15)

- Files: `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/capture.ts` (edited).
- What: Pass 2 of the 3-pass plan. Bumped final alpha boost from 1.08 to 1.15 (~+7pp). SVG side: four matrix scalars in the final feColorMatrix. JS side: `ALPHA_BOOST` constant. Comments updated.
- Decisions:
  - **+7pp instead of more aggressive.** Lisa's original "5–10% too low" remark put the right range at +5–10pp. 1.15 lands in the middle. If it now reads "too thick" against cream, drop to 1.12. If still pastel, bump to 1.18.
  - **No other parameters touched.** Pass 2 is the one-variable change; isolating it makes the visual evaluation clean.

### 17:48 — Chroma Capture v4.6/4.6a/4.6b grain abandoned, reverted to v4.5a

- Files: `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/capture.ts` (edited).
- What: Three v4.6 grain attempts (post-composite multiplicative noise, finer-frequency variant, pre-threshold additive perturbation) all read wrong on moving blobs — either pixelated interiors or static noise fields with blobs sliding through. Lisa called it: proper material-feel grain on a kinetic surface needs per-frame noise regeneration or blob-local noise, which is a separate animation engineering scope. Reverted SVG filter + JS capture to v4.5a baseline (two-blur chain + alpha boost, no grain).
- Decisions:
  - **Grain isn't going to work without proper animation work.** Architectural ceiling for SVG filter primitives on dynamic content. Acknowledged and parked.
  - **All three v4.6 variants archived in DECISIONS.md** for reference if we ever pick this up again in a proper animation scope.
- Open: Pass 2 (saturation 1.08 → 1.15) and Pass 3 (density 18 → 24) from the original 3-pass plan still on the table. Lisa's "nvm" could apply just to grain or to the whole 3-pass — need to confirm before continuing.

### 17:43 — Chroma Capture v4.6b — edge-localized grain (pre-threshold noise injection)

- Files: `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/capture.ts` (edited).
- What: v4.6 and v4.6a both applied noise as the LAST composite step, modulating output alpha across the whole silhouette interior. As blobs moved, interior pixels showed different noise each frame → Lisa's read: "consistent dot grain on a moving surface, looks pixelated." Her insight that texture should live at edges, not interiors, pointed to a structural fix.
- Architecture change: noise is now INJECTED INTO the blurred alpha BEFORE the threshold cut.
  - Interior alpha sits ~0.7 (well above 0.39 threshold). Noise ±0.08 perturbs to 0.62–0.78, all above cut → interior stays solidly opaque, NO grain.
  - Edge alpha sits in the threshold ramp (0.39–0.42). Noise ±0.08 perturbs to 0.31–0.50, flipping pixels above/below cut in a noise-correlated pattern → silhouette boundary becomes gritty/eroded.
- Filter graph changes:
  - feTurbulence moved to AFTER alphaBlur, BEFORE threshold (was last step).
  - feColorMatrix on noise rewritten as bias `0.16 0 0 0 -0.08` (was `0.33 0.33 0.33 0 0.65`) — output alpha now in [-0.08, +0.08] for additive perturbation (was [0.65, 1.0] for multiplicative).
  - feComposite arithmetic added (k2=k3=1) to ADD noise to alphaBlur before threshold (was final compose).
  - Final feComposite removed (no more post-output grain modulation).
- JS capture changes (mirror):
  - Pre-generate noise canvas: white noise + 1.5px blur (approximates feTurbulence fractalNoise at baseFreq=0.6).
  - Threshold pass: sample noise R channel, remap to [-amp, +amp] in 0-255 space, ADD to blurred alpha before threshold formula.
  - Removed the v4.6 post-composite grain block (the destination-in noise pass).
- Parameters: baseFreq=0.6, numOctaves=2, EDGE_NOISE_AMPLITUDE=0.08.
- Decisions:
  - **Pre-threshold > post-composite.** Architecture matches Lisa's intuition AND real paint/ink physics. Grain emerges at the boundary by construction; interior pixels are stably opaque.
  - **±0.08 amplitude.** Translates to ±3.5px edge displacement given the alpha ramp gradient at the threshold. Visible grit without massive shape distortion.
  - **baseFreq=0.6.** Slightly chunkier than v4.6a's 0.9 — at the boundary, ~1.5-2px features read as visible grit rather than sub-pixel jitter. Could go lower (0.4) for more visible erosion if subtle, or higher (0.9) for finer crispness.

### 17:40 — Chroma Capture v4.6a — fell back to Option A fine grain

- Files: `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/capture.ts` (edited).
- What: Option B splatter grain (baseFreq=0.45) read as "scaly/pixelated" on the deep purple (L=0.40 dark tier) — each chunk's alpha modulation was dramatic against cream show-through. Pre-approved fallback executed: baseFrequency 0.45 → 0.9 (finer features), JS capture smoothing blur 2px → 1px to match. All other v4.6 parameters held (bias 0.65, numOctaves=2, seed=3, fixed).
- Decisions:
  - **Finer grain is dark-color-safer.** Chunky noise has visible features that resolve to discrete shapes on dark colors. Fine noise distributes variation across more pixels per visible chunk → reads as material texture instead of artifact mottling.
  - **Surgical fall back, not full re-architect.** Only the noise frequency changed; the composite chain, bias, and silhouette pipeline stayed put. If finer grain now reads as "too subtle," next tunable is bias (0.65 → 0.55 for more aggressive).

### 17:33 — Chroma Capture v4.6 — procedural noise grain (Option B "splatter")

- Files: `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/capture.ts` (edited).
- What: Pass 1 of the 3-pass plan to close the gap to the kuro.store reference. Added procedural noise grain via SVG feTurbulence + final feComposite, mirrored in JS capture with blurred white-noise canvas + destination-in. Specifically NOT the v4.1 rejected static tile pattern — this noise is composited IN the silhouette so grain only appears where blobs are; as blobs translate the silhouette shows different parts of the noise field.
- Parameters (Option B "splatter" grain):
  - baseFrequency = 0.45 (chunky ~2–3px features; vs Option A's 0.9 fine grain)
  - numOctaves = 2 (adds detail to chunks)
  - bias = 0.65 (alpha modulation range 0.65–1.0; lower = more aggressive grain, higher = more subtle)
  - seed = 3 (fixed; could animate per-frame for film-grain shimmer if static feel persists)
- JS capture approximation: white noise per-pixel + 2px canvas blur (matches feTurbulence fractal smoothness within visual tolerance).
- Decisions:
  - **Composite as last step.** Grain modulates the FINAL output alpha so displayed RGB (via pre-mult math) stays unchanged from v4.5a. Only opacity gets the grain texture.
  - **`in` operator for grain composite.** Pre-mult math: result.RGB = output.RGB · noise.A, result.A = output.A · noise.A. Displayed RGB = (output.RGB · noise.A) / (output.A · noise.A) = output.RGB / output.A. Color preserved exactly.
  - **Fixed seed, no animation yet.** Per-frame seed updates would give film-grain shimmer but cost JS overhead to update the DOM attribute. Defer until we know if fixed-seed reads as static.
  - **Escalation plan documented**: if Lisa rejects v4.6 ("looks like sliding through static grain"), the next move is animating the feTurbulence seed every 2–3 frames. After that: fall back to Option A (finer grain, baseFrequency=0.9) which is less visible at any moment but still adds material feel.

### 17:18 — Chroma Capture v4.5a — reverted edge feather, kept alpha boost

- Files: `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/capture.ts` (edited).
- What: v4.5's σ=20 silhouette feather softened every blob boundary into a 60px Gaussian halo. Lisa's read: "looks like I need glasses, nothing to focus on" — meaning the lack of any crisp edge anywhere removed the visual anchor. Reverted the feather only: dropped the `feGaussianBlur σ=20` between threshold and composite (SVG side) and dropped the `stage2Soft` pass (JS side). Kept the 1.08× alpha boost since opacity wasn't the complaint.
- Decisions:
  - **Edge crispness is the focal anchor.** Soft colors inside + hard outline outside is the correct division of softness. Soften the WHOLE thing and the eye has nothing to grab.
  - **Surgical revert, not full v4.4 rollback.** Lisa's "needs glasses" complaint maps cleanly to the feather, not the opacity boost. Keeping the alpha boost preserves the legitimate v4.5 improvement.
  - **Lesson logged**: blur softness has diminishing returns past a single decoupled blur level. v4.4's σ=10 silhouette + σ=25 color was already two softness tiers; adding a third (σ=20 mask feather) erased the crisp tier without adding a new one.

### 17:14 — Chroma Capture v4.5 — feathered silhouette edge + alpha boost

- Files: `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/capture.ts` (edited).
- What: v4.4 shipped the parallel two-blur architecture but Lisa called interior opacity 5–10% too low and asked for a 20px blur on the blob edges. Both fixes layered onto v4.4 without disturbing silhouette geometry:
  - **Silhouette feather** (σ=20): after threshold, blur the silhouette alpha mask with σ=20. Edge fades over ~60px (3σ) Gaussian instead of binary. Cut point preserved → silhouette SIZE unchanged.
  - **Alpha boost** (1.08×): final `feColorMatrix` scaling RGB+A by 1.08 on SVG side (pre-mult rendering — both scale together to keep displayed color constant). JS capture pipeline scales only alpha bytes (canvas ImageData is straight alpha). Lifts interior ~8% to compensate for σ=25's Gaussian dilution.
- Decisions:
  - **Feather AFTER threshold, not relax the threshold.** Relaxing 30/-11.7 → wider ramp would shift the cut point and change silhouette SIZE. Re-blurring after threshold keeps geometry locked, only softens the alpha gradient outward.
  - **Scale RGB+A together on SVG side.** Pre-mult alpha rendering: scaling only A would yield darker displayed colors (RGB/(s·A) < RGB/A). Scaling both keeps displayed RGB constant.
  - **8% in the middle of the 5–10% range.** Tunable in one constant (ALPHA_BOOST in capture.ts; matrix values in section.tsx).
  - **Risk acknowledged**: σ=20 silhouette feather extends visible edge ~60px outward. Blobs near the frame may visibly soften into the bezel. If clipping reads as wrong, σ_feather drops to ~10–15.

### 17:08 — Chroma Capture v4.4 — parallel two-blur filter chain

- Files: `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/capture.ts` (edited), `docs/DECISIONS.md` (edited).
- What: After three rounds of palette/threshold tuning at v4.3, the "stamped cores" + thin blend band character of single-blur compositing remained the gap to the reference good examples. Executed the escalation documented in v4.3's note — split the single σ=10 blur into two parallel pipelines:
  - **Pipeline A**: σ=10 + threshold = crisp silhouette (alpha-only mask, RGB zeroed via colormatrix `0 0 0 0 0` rows for R/G/B).
  - **Pipeline B**: σ=25 blur of `SourceGraphic` = soft RGB cloud (2.5× wider Gaussian).
  - **Compose**: `feComposite(softColor, silhouette, in)` — soft cloud clipped to silhouette alpha. Output has the silhouette's crisp boundary and softColor's smoothed interior RGB.
- JS capture pipeline mirrored: added stage 3 (canvas-native `blur(25px)` of stage 1), replaced the v4.3 "source-atop with stage 1" final step with `destination-in` of stage 2 on top of stage 3. Same equivalence to `feComposite operator="in"`.
- Decisions:
  - **Two blurs, not one.** σ=10 was constraining both silhouette geometry AND color spread. Decoupling lets each pipeline tune independently for its job.
  - **σ=25 (2.5× silhouette).** Documented escalation range was "σ=20+"; 25 is the defensible middle. σ=20 if v4.4 still reads too pastel; σ=30+ if more ombre is wanted.
  - **`operator="in"` over `atop`.** `in` preserves softColor's straight-RGB saturation by letting cream show through < 1 interior alpha. `atop` would force opaque but dim the displayed colors (pre-mult RGB / α=1). Saturation > opacity for this aesthetic.
  - **Silhouette geometry untouched.** σ=10 blur + 30/-11.7 threshold both unchanged from v4.3. Motion read preserved exactly. The only thing that changed is what color paints inside the silhouette.
- Math sources: Porter-Duff `in` composition (out.RGB = src.RGB · dst.A; out.A = src.A · dst.A), Gaussian-kernel response on parallel chains, pre-multiplied-alpha rendering.

### 17:04 — Chroma Capture v4.3b — neon yellow hue shift (warmer)

- Files: `lib/chroma/color.ts` (edited).
- What: v4.3a's neon yellow at h=108 read as chartreuse/yellow-green ("too green"). Shifted hue to h=92 — essentially pure yellow with a hint of warmth, no green tint. L=0.84 and C=0.21 unchanged. `CHROMA_PALETTE_HUES` last hue updated 108 → 92. Header comment updated with v4.3b history note.
- Decisions:
  - **h=92, not h=85 or lower.** h=85 would start pulling toward orange and visually crowd goldenrod (h=55) on the wheel. h=92 keeps clear separation from goldenrod (37° gap) while still reading as pure yellow.
  - **L and C held constant.** Lisa only flagged hue character ("too green"), not brightness or saturation. Tweaking those would muddy the diagnostic if the fix isn't enough.

### 17:00 — Chroma Capture v4.3a — palette swap: warm navy → neon yellow

- Files: `lib/chroma/color.ts` (edited), `docs/DECISIONS.md` (edited).
- What: After reviewing v4.3, Lisa called the ombre still off and asked to drop warm navy in favor of neon yellow. Replaced palette entry `{ L: 0.40, C: 0.18, h: 255, name: "warm navy" }` with `{ L: 0.84, C: 0.21, h: 108, name: "neon yellow" }`. Updated `CHROMA_PALETTE_HUES` last element 255 → 108. Comment block rewritten to document the tri-modal (light/deep/neon) tier structure and why cool-side hues are now fully excluded.
- Decisions:
  - **Warm navy was the muddy blender, not v4.3 filter math.** The cool-edge hue (h=255) blended with analogous-warm neighbors through canvas alpha-compositing produces desaturated browns in the overlap zone — the "still not great ombre" Lisa flagged. Removing the offender is a cheaper diagnostic than the v4.4 two-blur escalation.
  - **Third lightness tier (L=0.84) introduced for neon character.** L=0.66 would have read as "school-bus yellow," not neon. L=0.84 sits comfortably below cream (L=0.99) so the blob still reads as a discrete shape against background.
  - **h=108 (yellow-green) instead of h=90 (pure yellow).** Slight cool shift toward chartreuse blends more gracefully with goldenrod (h=55) and the purples (h=285, 310, 315) — no jarring complementary clash on overlap.
  - **C=0.21 verified in-gamut.** Yellows hit the highest in-gamut chroma at high L; 0.21 at L=0.84 h=108 is safely inside sRGB per `oklchToHex` inspection.
  - **v4.4 (two-blur filter) still on the table** if the palette swap alone doesn't close the gap to the reference good examples.

### 23:46 — Chroma Capture v4.3 — smooth alpha falloff + sharpened threshold

- Files: `lib/chroma/render.ts` (edited), `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/capture.ts` (edited), `docs/DECISIONS.md` (edited).
- What: Lisa provided four reference images (two good, two bad). The bad pair was v4.2 output. Diagnosed two specific artifacts:
  - **Visible cores**: ALPHA_STOPS kept alpha ≥ 0.92 across the inner 18% of radius — a flat plateau that rendered as a uniform-color circle inside each blob's silhouette. Made merged silhouettes look like two stamped circles rather than one shape with a gradient.
  - **Washed-out necks**: threshold matrix `18 -7` ramps from 0 to 1 across blurred-alpha 0.39 → 0.44 (range 0.055). Thin gooey necks fall in that range, post-threshold α ≈ 0.2 → cream shows through.
  - **Fix 1**: ALPHA_STOPS = `[0.0, 0.95] [0.35, 0.75] [0.70, 0.45] [1.0, 0]`. No plateau; smooth radial falloff. Center is the most-saturated POINT, not a REGION.
  - **Fix 2**: Threshold matrix = `0 0 0 30 -11.7`. Same cut point (blurred α = 0.390). Tighter ramp; opaque at 0.423 instead of 0.444. Semi-transparency band shrinks 0.055 → 0.033 → necks become opaque.
  - **Compensation**: RENDER_OVERSCAN 1.32 → 1.36 because softer center shifts the threshold cut inward ~2% of radius.
  - JS capture mirrors the new threshold (`GOO_ALPHA_MULT = 30, GOO_ALPHA_OFFSET_255 = 11.7 * 255`).
- Decisions:
  - **Keep feComposite atop.** Without atop the saturated extremes Lisa likes in the good examples would soften. Atop preserves source colors at high-alpha points; dropping the plateau alpha is the right way to soften the "cores" without sacrificing extremes.
  - **Sharpen threshold, not the blur.** The silhouette SIZE (motion read) is determined by the cut point, not the ramp. Tighter ramp keeps silhouette identical and only narrows the soft-edge band.
  - **Edge softness reduces ~40%**. That's the explicit tradeoff. Acceptable because the wash-out it eliminates was a bigger visual issue than the small softness loss.
  - **Escalation path documented**: if v4.3 still doesn't reach reference quality, the next move is a parallel two-blur filter chain (σ=10 for alpha, σ=20+ for color spread). Not chosen now because it's a structural change to the filter graph.
- Math sources: feColorMatrix alpha-channel arithmetic `a' = M*a + B`, Gaussian-kernel response analysis on radial alpha gradients without plateau.

### 23:24 — Chroma Capture v4.2 — wider blends + deep palette tier

- Files: `lib/chroma/color.ts` (edited), `lib/chroma/render.ts` (edited), `docs/DECISIONS.md` (edited).
- What: Lisa's two outstanding asks against the first colored capture — blends not smooth enough; wants dark purple + warm navy added. Bundled both as one pass (orthogonal changes).
  - **Wider blends**: `ALPHA_STOPS` changed from `[0.0,1.0] [0.4,0.85] [0.7,0.55] [0.9,0.25] [1.0,0]` to `[0.0,1.0] [0.18,0.92] [0.45,0.70] [0.75,0.40] [1.0,0]`. Opaque core compressed from 40% → 18% of radius; partial-alpha shell grew from 60% → 82% of radius. The wider shell is where overlap color-blending happens via canvas alpha compositing — bigger overlap zone = more gradient, less hard seam.
  - **Overscan**: bumped 1.25 → 1.32 to compensate for the threshold cutting at a smaller relative radius with the softer profile. Math derived in DECISIONS; calibrate by eye if blobs read smaller than v4.
  - **Palette data model**: `CHROMA_PALETTE` is now `ReadonlyArray<PaletteEntry>` with per-entry L/C/h/name. Lookup via `paletteColorForHue(hue)` at render time. `render.ts` switched from a hardcoded `{L: CHROMA_PALETTE_L, C: CHROMA_PALETTE_C, h: hue}` build to the lookup so the deep tier renders at its darker L/C.
  - **Deep tier**: two new entries at L=0.40 C=0.18 — `h=310 deep purple` (between indigo and magenta), `h=255 warm navy` (warm edge of cool). Bimodal lightness on purpose; continuous L randomization would produce muddy mid-tones.
  - **Sampling**: still uniform across all 8 entries. ~25% dark blobs at any time matches "some darks." Weighting is a one-line change if it feels off.
- Decisions:
  - **Bundle 2+3 in one pass.** Orthogonal — gradient stops affect HOW blobs blend, palette affects WHAT colors blend. No diagnostic confusion.
  - **Bimodal lightness, not continuous.** Discrete L=0.66 and L=0.40 preserve both light vibrancy and deep gemstone character; mids only appear at overlap blends (~0.53) where they belong.
  - **C=0.18 for the deep tier.** High chroma at low lightness clips sRGB; inspected `oklchToHex` to confirm in-gamut.
  - **Goo filter still untouched.** Blur σ=10, threshold 18 -7. Motion read remains the protected invariant.
- Math sources: alpha-compositing math (Porter-Duff source-over), Gaussian-kernel response on softened alpha gradients, OKLab/OKLCH gamut bounds at low L.

### 23:18 — Chroma Capture v4.1 — grain off

- Files: `components/lab/chroma-capture-canvas.tsx` (edited), `lib/chroma/capture.ts` (edited).
- What: Lisa's first observation on the v4 capture: "the texture over the gradients is static, it doesn't move with the blobs which looks weird." She asked to try without grain entirely before tuning anything else. Flipped `includeGrain` to `false` in the live render call, removed the grain block from the capture pipeline, dropped the now-unused `makeGrainPattern` import and `GRAIN_ALPHA` constant in `capture.ts`. The grain machinery (`makeGrainPattern`, `ALPHA_STOPS`, `GRAIN_ALPHA` in `render.ts`) is intact so reactivation is a one-flag flip.
- Decisions:
  - **Grain off by default in v4.1.** A static tile pattern doesn't translate with moving content and reads as a screen filter rather than a material property. The lava-lamp illusion relies on the texture being PART of the blob, not floating in front of it. Better to ship without texture than to ship a texture that fights the motion.
  - **Grain code retained, not deleted.** If we want to revisit later (per-blob displaced noise, blob-local UV sampling, etc.), the existing scaffolding is still there.
- Math sources: none required — this is a pure pipeline toggle.

### 22:55 — Chroma Capture v4 — color palette + soft-alpha + atop composition

- Files: `lib/chroma/color.ts` (edited), `lib/chroma/render.ts` (edited), `lib/chroma/capture.ts` (edited), `components/lab/chroma-capture-canvas.tsx` (edited), `components/lab/chroma-capture-section.tsx` (edited), `docs/DECISIONS.md` (edited).
- What: Lisa restated her color brief plainly — pick a palette, make sure it looks good on the color wheel, and when blobs merge produce a soft gradient that preserves blur + texture. Implemented v4 in one pass:
  - **Palette**: curated 6-hue analogous-warm at OKLCH L=0.66 C=0.22 — `CHROMA_PALETTE_HUES = [285 indigo, 315 magenta, 350 crimson, 15 coral, 35 tangerine, 55 goldenrod]`. 130° span on the warm side; every pair within ~70° so blends stay vibrant (analogous theory) rather than collapsing to gray.
  - **Sampling**: `randomPaletteHue()` uniform per blob; `makeBlobHues()` returns `[primary, secondary, tertiary]` where primary is the visual color and the other two are independent palette samples that drive the audio chord on pop.
  - **Static, not rotating**. Chord rotation (`rotateHue` / `seedHueRef` / `HUE_ROTATION_RATE`) removed from `chroma-capture-canvas.tsx`. The `chordRef` now holds a fixed `STATIC_PALETTE_CHORD` (3 representative hues) for filename slugging. Pre-roll lost its chord-rotation step (palette is constant) — physics order in pre-roll unchanged otherwise so distribution stays correct.
  - **Render**: `drawBlob` now draws a radial alpha gradient at `RENDER_OVERSCAN = 1.25` × `currentRadius` with stops `[0.0,1.0] [0.4,0.85] [0.7,0.55] [0.9,0.25] [1.0,0]`. Elliptical stretch encoded as non-uniform `ctx.scale` so the radial gradient becomes elliptical when drawn. The 1.25 overscan compensates for the soft alpha shrinking the visible silhouette under the goo threshold so net silhouette ≈ v3.2.
  - **SVG filter**: appended `<feComposite in="SourceGraphic" in2="goo" operator="atop" />` to `<filter id="chroma-goo">` in `chroma-capture-section.tsx`. Blur σ=10 and threshold matrix `18 -7` are UNCHANGED — motion read is preserved. atop (not feBlend) is the correct operator because it clips strictly to the goo silhouette without extending it.
  - **Grain**: bumped to 14% via `globalCompositeOperation = "source-atop"`. Replaces the v3 6% multiply. source-atop blends grain colors only where canvas is already opaque (inside blob area) and leaves alpha untouched, so silhouette boundary is preserved exactly.
  - **Capture**: `lib/chroma/capture.ts` updated to replicate the full atop chain in JS — `globalCompositeOperation = "source-atop"` draws stage1 (source colors) on top of stage2 (goo silhouette), then grain at 14% with the same source-atop rule, then watermark with composite reset to source-over. PNG output is now droppable on any background and matches the live render. Filename gained a `YYYYMMDD-HHMMSS` timestamp so static-palette captures don't collide.
- Decisions:
  - **Cool side of wheel excluded**. Pairing teal/cyan with the warm anchors produces muddy mid-tones in any overlap and violates "gracefully blends." Also C=0.22 clips on cyans.
  - **Static palette over rotating**. Lisa asked for "a palette" (singular); identifiability across loads is a portfolio asset; rotation is one line away in `rotateHue` if we change our minds.
  - **atop, not feBlend**. atop preserves the goo silhouette boundary exactly; feBlend would extend it to wherever source has any alpha (i.e. the 1.25× overscan halo), reintroducing the motion regression that caused the earlier v4 revert.
  - **1.25 overscan estimated, not measured**. Profile-based estimate of where the threshold cuts a soft-alpha gradient. Will calibrate by eye in the live render; constant lives at the top of `render.ts` for easy tuning.
  - **Capture includes grain in v4** (v3 omitted). Lisa called "texture" out explicitly as part of the desired artifact.
  - **Did NOT change**: `physics.ts`, `blob.ts`, goo filter blur/threshold values, cursor model (still v3.3), spawn behavior (still v3.2). v4 is strictly the color + composition layer.
- Math sources: OKLCH analogous-palette theory; `feComposite` Porter-Duff atop spec (https://www.w3.org/TR/SVG11/filters.html#feCompositeElement); canvas 2D `source-atop` composite mode (HTML Canvas spec); alpha-blending math derived from the goo threshold equation `a' = 18a - 7`.

### 15:45 — Cursor impulse v3.3 — contact-based, not Gaussian field

- Files: `lib/chroma/blob.ts` (edited), `lib/chroma/physics.ts` (edited), `docs/DECISIONS.md` (edited).
- What: Lisa flagged "cursor is impacting blobs it is nowhere near. Cursor should only impact blob movement if it touches the edge of a blob (like reality)." The v1–v3 Gaussian field model (σ=200 px, 3σ cutoff = 600 px) was perturbing every blob within a 1200 px sphere — conceptually wrong because the cursor isn't a fluid source, it's a solid object. Rewrote to a contact model:
  - **`applyCursorImpulse`**: replaced `gaussianImpulse(...)` with a direct `hitTest(blob, cursorPos, CURSOR_CONTACT_SCALE)` gate. On contact → full `cursorVel * scale`; no contact → no impulse. Other blobs still respond via the existing `applyBlobEntrainment` (fluid coupling through the medium — physically appropriate at distance).
  - **`hitTest`** parameterized with optional `scale` (default `0.8` — preserves pop targeting). Single source of truth for ellipse hit math.
  - **`CURSOR_CONTACT_SCALE = 1.2`** — inflate blob ellipse by 20 % for contact test. Covers the goo filter's ~10 px silhouette expansion plus tactile forgiveness so contact registers at the apparent edge.
  - **`PHYSICS_DEFAULTS.cursorSigma` removed** (no longer used); `sigma` parameter dropped from `applyCursorImpulse` in the same pass to avoid dead config. `gaussianImpulse` stays — still used by `applyBlobEntrainment` for blob-blob coupling, which IS a physically real long-range effect through the fluid medium.
- Decisions:
  - **Contact, not field, for cursor.** The Gaussian-field cursor was the wrong physical analogy from day one. v3.3 fixes the model.
  - **Tuning levers if it reads too sparse**: `CURSOR_CONTACT_SCALE` (1.4–1.5 for wider effective touch), `cursorImpulseScale` (stronger per-touch impulse), or `blobEntrainScale` (stronger downstream fluid coupling). None require revisiting the model itself.
- Math sources: own first-principles physics — solid-body contact vs fluid-medium coupling are different mechanisms and should be modeled differently.

### 15:28 — Git initialized; v3.2 committed and tagged

- Files: `.git/` (created — repository).
- What: Lisa decided the project was complex enough to need version control. Lisa set global git identity (`Lisa Aufox <lisaaufox@gmail.com>`) on her machine; I ran `git init` + `git add -A` + `git commit` + `git tag` in the project root. Existing `.gitignore` (Next.js scaffold default) correctly excluded `node_modules` (516 MB), `.next` (222 MB), `.env.local`, and the TypeScript build cache — no secrets leaked into history. 131 files committed, 25 948 lines.
- Decisions:
  - **Local-only**, no GitHub remote. Lisa's hard-drive failure would mean lost work; she accepted that tradeoff for now.
  - Tag scheme: `chroma-v3.2-correct-spawn` follows the same labeling as the file-system snapshot folder. Future tags should use the same `<feature>-v<n>-<state>` shape.
  - **File-system snapshot folder kept** (`docs/snapshots/`). Belt-and-suspenders until Lisa is fluent enough with git to trust tags exclusively.
  - **I never run `git config`**. Identity changes are always Lisa's hands. I caught a placeholder email leak on the first attempt — `your-actual-email@example.com` would have been in commits forever.
- Going forward: every meaningful change should end with a commit. I'll batch related work and commit at `### Current System State` boundaries unless Lisa says otherwise.

### 15:17 — Snapshot v3.2 — correct spawn behavior preserved

- Files: `docs/snapshots/chroma-v3.2-correct-spawn/` (created — 9 source files + README).
- What: Lisa approved the 15:10 pre-roll + 3.5–4.5 s cadence as the canonical spawn behavior and asked for a point-in-time save we can roll back to if future iterations break the motion read. Project isn't under git (verified earlier — `fatal: not a git repository`), so created a file-system snapshot: copies of `lib/chroma/*.ts` (7 files) and `components/lab/chroma-capture-*.tsx` (2 files) preserving the original directory structure, plus a README documenting what the snapshot represents, what it is NOT (still mono blue — color work hasn't started), and the exact `cp` commands to restore.
- Decisions:
  - Snapshot path pattern: `docs/snapshots/<label>/` with source files mirroring their original paths under that root. README at the snapshot root explains state, scope, and restore procedure. If we need to take more snapshots, repeat the pattern with a different label.
  - No git init done — that's a workflow decision Lisa hasn't asked for. Filesystem snapshot is the lighter-weight option.

### 15:10 — Pre-roll + cadence calibrated to rise speed (fixes the raft cluster)

- Files: `components/lab/chroma-capture-canvas.tsx` (edited), `docs/DECISIONS.md` (edited).
- What: The 15:00 strict-bottom-with-350ms-cadence fix produced an unintended raft cluster — Lisa's screenshot showed 18 blobs merged into one horizontal mass rising together. Traced to a math mismatch: at vTerminal=-10 px/s, 18 blobs spawned 350 ms apart land 3.5 px apart vertically; the goo filter merges anything that close into one shape. Fast cadence → raft; slow cadence (~4 s) → first-load takes 72 s. Resolved with a **CPU-only pre-roll on mount**:
  - `PREROLL_VIRTUAL_DURATION_MS = 90_000`, `PREROLL_STEP_MS = 50` → 1800 fixed-dt physics steps, ~10–30 ms real CPU.
  - Virtual clock starts at `realStart − 90_000`, advances forward in 50 ms steps, ending at `realStart`. Every blob's `stateStartMs` lands in the past relative to `performance.now()` — so pop-animation arithmetic stays correct.
  - Pre-roll runs the same physics order as the real-time tick (chord rotation, entrainment, step, lateral clamp, recycle, cadence-gated spawn). No cursor input.
  - Steady-state cadence retuned: `STEADY_CADENCE_BASE_MS = 3500`, `STEADY_CADENCE_JITTER_MS = 1000` → 3.5–4.5 s per spawn. Math matches bottom-to-top traversal rate: 18 blobs × 4 s ≈ 72 s = canvas height ÷ vTerminal. Field stays evenly distributed instead of clumping into waves.
  - `lastSpawnMsRef` renamed to `nextSpawnEligibleMsRef` — better semantic: stores the wall-clock value at which the next spawn is permitted. Re-rolled with jitter every time a spawn fires.
- Decisions:
  - Pre-roll is now the canonical pattern for "looks like it's been running" without violating spawn-side invariants. Lava-lamp UX without compromising the "only enters from the bottom" rule.
  - Cadence calibrated to physics, not to UX feel. `STEADY_CADENCE_BASE_MS` is now derived from canvas height ÷ vTerminal ÷ target count — if any of those change, this constant moves with them.
- Math sources: simple kinematics — `traversal_time = canvas_height / |vTerminal|`; `spawn_interval = traversal_time / target_count`. No external citation needed.

### 15:00 — Strict bottom-only spawn, including initial fill (with cadence)

- Files: `components/lab/chroma-capture-canvas.tsx` (edited).
- What: Lisa noticed "blobs appearing mid-screen not floating up from the bottom edge." Traced to a pre-existing initial-population loop in the mount useEffect: `for (let i = 0; i < target; i++) spawnBlob(nowMs, true)` with `atRandomVisiblePosition = true`, which placed all 18 blobs at random `(x, y)` and nucleated them from radius 0 there. This dated back to the original Chroma scaffold (long before v3.1's bottom-only `randomEdgeSpawn`) and silently violated the "nothing enters from the sides — extending to nothing appears mid-field" invariant. Lisa chose **strict bottom-only with cadence**: drop the initial loop entirely and let the tick loop drip blobs in from below.
- Implementation:
  - **`MIN_SPAWN_INTERVAL_MS = 350`** constant + `lastSpawnMsRef` — gates respawns. The 18-blob fill takes ~6.3 s; mass-pop refill also drips back in instead of teleporting.
  - **`spawnBlob`** simplified — dropped the dead `atRandomVisiblePosition` parameter and its random-position branch. Only one path now: `randomEdgeSpawn` (bottom only). Dead code removed in the same pass since this is its own kind of bug.
  - **Tick loop** — replaced the `while (length < target) spawnBlob(nowMs, false)` (which would have stacked all 18 on frame 1 if the initial loop were removed without throttling) with a gated `if (length < target && nowMs - lastSpawnMs > interval) { spawn; record }`.
  - **Mount effect** — initial population loop removed. `lastSpawnMsRef` zeroed so the first spawn fires immediately on first tick.
- Decisions:
  - "Only enters from the bottom" is now an invariant that holds at first paint too, not just during play. Tradeoff: empty cream box for ~1 s after mount before the first blob rises into view; full field after ~6 s. Lisa explicitly accepted this tradeoff.
  - Spawn cadence applied uniformly to all spawns (initial + pop-driven). Lava-lamp dynamic — pops don't refill in one frame. If this reads too slow during heavy popping we can lower `MIN_SPAWN_INTERVAL_MS` or temporarily bypass it on pop.
- Math sources: none — pure UX-driven choice.

### 14:55 — Revert v4 — animation pattern read differently after filter changes

- Files: `lib/chroma/render.ts`, `lib/chroma/color.ts`, `lib/chroma/capture.ts`, `components/lab/chroma-capture-section.tsx` (all reverted to v3.1), `docs/DECISIONS.md` (v4 section removed).
- What: Lisa reviewed v4 and said: "you changed the animation pattern of the blobs — please revert to the last all blue version and we will try again, Ask all questions BEFORE you make changes."
- Why the motion read differently even though physics wasn't touched: in v4 I bumped `stdDeviation` from 10 → 12 and softened the threshold from 18/-7 → 12/-5. Bigger blur halo and softer threshold make blobs visually "reach" toward each other from farther away and merge over a wider transition zone. Same underlying positions/velocities — perceived motion differs because the rendered silhouette behavior is different. Lesson: the goo filter's blur radius and threshold are part of the MOTION read, not just the visual style. Don't change them without consent.
- Decisions: roll back to v3.1 exactly (mono ethos-blue, solid stretched ellipses, `stdDeviation=10`, matrix `0 0 0 18 -7`, no `feBlend`, grain 6 % multiply). v4 work is logged below for archival but is no longer active.
- Next: ASK questions about the color/aesthetic direction before any code changes. v4 attempted to answer them by default and got the motion read wrong as a side effect.

### 14:35 — Chroma Capture v4: single-color soft balls + amorphous outline (kuro.store look)

- Files: `components/lab/chroma-capture-section.tsx` (edited), `lib/chroma/render.ts` (edited), `lib/chroma/color.ts` (edited), `lib/chroma/capture.ts` (edited), `docs/DECISIONS.md` (edited).
- What: Lisa's brief — "Each ball should be a single color with stronger opacity in the middle and a textured blur similar to this image. When balls merge, gradient effects appear." Researched the canonical SVG-filter pattern (storbeck.dev, browser-unplugged.net, Nemesiscodex, CSS-Tricks gooey effect, SVG Metaballs DEV post) — every source confirms the same recipe for "merge shapes but preserve internal color": `feBlend in="SourceGraphic" in2="goo"` at the end of the filter. The cutoff layer (blur + alpha threshold) provides the amorphous outline + neck-filling blended colors; the original SourceGraphic overlaid on top provides the crisp soft-alpha colored centers. Implemented:
  - **SVG filter**: added `<feBlend in="SourceGraphic" in2="goo">` after the threshold. Tuned threshold softer than the classic 18/-7 preset → `stdDeviation=12`, alpha row `0 0 0 12 -5` — defined merging at necks, soft outer fade over a few pixels (matches the kuro.store reference outline). Inline comment in the JSX explains the pipeline so future devs don't tune blindly.
  - **`drawBlob`**: replaced solid-fill ellipses with soft radial gradients in one color per blob. Stops at 0/0.25/0.6/0.85/1 → alpha 0.95/0.85/0.5/0.18/0 (kuro.store-style falloff). Geometry via local transform (translate + rotate + scale) wrapping `arc()` so gradient and shape share the same local space and stretch together. Color from `oklchToRgba` at L=0.66 C=0.22 — vivid across the wheel.
  - **`triadicChord`**: gained a `spread` parameter, default 70° (was effectively 240° — perfect triadic at 120° spacing). New default produces analogous-style chords like the reference (purple → red → orange). OKLab midpoints between near-neighbor hues stay vibrant; triadic midpoints fell toward gray. Seed hue still rotates ~4°/s, so every region of the wheel cycles through over ~90 s.
  - **Grain**: bumped from 6 % → 14 % opacity, composite `multiply` → `source-atop` so grain only paints over existing blob pixels (cream frame stays clean, matching portfolio aesthetic).
  - **Capture**: rewrote the goo-bake to match the new `feBlend` step — render blobs → blur to stage 2 → threshold alpha via ImageData → composite original stage 1 ON TOP of the cutoff with `source-over`. Constants updated (`GOO_BLUR_PX=12`, `GOO_ALPHA_MULT=12`, `GOO_ALPHA_OFFSET_255=5*255`) so PNG matches live render 1:1.
- Decisions:
  - **`feBlend` overlay is the canonical fix** for soft-inside / merged-outside blob rendering. Documented in `DECISIONS.md` under "Rendering (v4)" with all five referenced sources.
  - **Analogous-style chord by default** (spread=70°). Triadic spread reachable via parameter if needed later.
  - **Cream stays grain-free**. Reference has grain everywhere; we kept cream clean for site-wide consistency. Reversible if Lisa wants the textured background.
  - **Single hue per blob visually, full chord audibly.** Blob renders `hues[0]` only; pop audio still plays all chord notes. Visual simplicity + audio richness.

### 14:06 — Chroma Capture: match Typoglycemia frame height (and fix percent-height resolution)

- Files: `components/lab/chroma-capture-section.tsx` (edited), `components/lab/chroma-capture-canvas.tsx` (edited).
- What: Two-part fix.
  - **Frame sizing** — replaced `aspect-[4/3] w-full max-[640px]:aspect-square` on the chroma-frame with `h-[min(75vh,720px)] min-h-[420px] w-full` so it matches Typoglycemia's frame. The Lab page now reads as two specimens hung at the same height in the gallery.
  - **Canvas percent-height** — the canvas component's wrapper div had `style={{ position: "relative" }}` with no explicit width/height, so its block height was auto (=0 without content). The canvas inside used `height: 100%`, which resolves to "auto" against an indefinite parent and collapsed to the HTML canvas default 150 px. Added explicit `width: 100%, height: 100%` to the wrapper div's inline style so the percent chain resolves against the frame's pixel height.
- Decisions: Lab gallery alignment — every specimen frame shares the same height envelope.

### 14:01 — Chroma Capture: bump blob population

- Files: `components/lab/chroma-capture-canvas.tsx` (edited).
- What: `TARGET_BLOB_COUNT_DESKTOP 10 → 18`, `TARGET_BLOB_COUNT_MOBILE 6 → 10`. Field feels fuller without overwhelming the goo merging.
- Decisions: None — direct single-property tweak.

### 14:00 — Chroma Capture v3.1: hard lateral clamp, slower motion, no side escape

- Files: `lib/chroma/physics.ts` (edited), `lib/chroma/blob.ts` (edited), `components/lab/chroma-capture-canvas.tsx` (edited).
- What: First v3 preview — Lisa: "Better shapes. Movement is still way way way too fast and blobs are zooming off the screen. I want blobs to only disappear off screen either at the top of bottom. Nothing escapes from the sides." Two distinct fixes:
  - **Hard lateral clamp** replaces the soft wall force. The v3 `applyWallForce` was an acceleration that could be overrun by fast lateral velocities (cursor nudges, OU peaks). v3.1 replaces it with `constrainLateral(blob, width)`: a position clamp to `[radius, width − radius]` that also zeroes any outward velocity component. Real lava-lamp glass is rigid, not springy. Removed `wallRepulsionAccel`, `wallMarginRadii`, `wallAccel`, `ceilingMarginRadii`, `ceilingAccel` from PHYSICS_DEFAULTS along with the helper they backed.
  - **Lateral spawning eliminated.** `randomEdgeSpawn` previously spawned 60% from the bottom and 20% from each side. The side-spawn paths conflicted with "nothing enters from the sides" — and the constrainLateral clamp would have instantly killed any inward velocity on a side spawn anyway. v3.1 spawns 100% from the bottom (real lava lamps load from the heated base) with a small upward velocity (-6 px/s) and a barely-there horizontal jitter (±1 px/s).
  - **`isOffscreen` updated** to only consider vertical exits as the recycling trigger. Kept defensive lateral checks in case some future code mutates `pos.x` past the canvas — should be unreachable.
  - **Physics retuned much slower.** `vTerminal -14 → -10` (~80s to traverse the canvas), `sigmaDriftX 5 → 2` (RMS sway ~5 px/s, half of vertical), `tauDriftX 10 → 14s` (slower decorrelation, drifting motion not jitter), `tauDriftY 2.0 → 2.5s`.
  - **Cursor impulse cut 4×.** v3 had `cursorImpulseScale = 0.45` — a 500 px/s cursor swipe imparted 225 px/s to nearby blobs, vastly exceeding terminal. v3.1: `0.10` — same swipe maxes at 50 px/s, which is capped to 40 by the new velocity cap.
  - **Blob entrainment cut from 0.04 → 0.015.** The chain reaction reads as a whisper, not a shove.
  - **Velocity cap.** New `maxSpeed: 40` constant in PHYSICS_DEFAULTS and a `capSpeed(vel)` helper in `physics.ts`. Called inside `stepBlob` before position integration. Any blob whose velocity magnitude exceeds 40 px/s gets rescaled to 40 px/s, direction preserved. Real lava blobs don't ballistic-fire across the lamp no matter what shakes the room.
- Decisions:
  - **Hard clamp over soft force** for lateral edges — load-bearing for Lisa's "nothing escapes from the sides" requirement. Soft forces can always be overrun; clamps cannot.
  - **Bottom-only spawn** matches lava-lamp physics (heated base) and is consistent with the "no lateral entry/exit" rule.
  - **Velocity cap at 40 px/s** chosen so that even direct cursor flicks max at ~3× terminal velocity. Above that and blobs feel un-physical.
  - All physics tuning lives in `PHYSICS_DEFAULTS` for easy iteration — no magic numbers buried in helpers.
- Verification: `tsc --noEmit` clean, lints clean, dev server `/lab` 200. No stale references to the removed `applyWallForce` / `wallRepulsionAccel` in source (only `.next` cache + DECISIONS.md historical record).
- Next: visual check. If motion now reads correctly slow and lateral escape is impossible, color returns in v4.

### 13:50 — Chroma Capture render v3: pivot to CSS-filter goo (canonical pattern, mono first)

- Files: `lib/chroma/physics.ts` (edited), `lib/chroma/blob.ts` (edited), `lib/chroma/render.ts` (rewritten), `lib/chroma/capture.ts` (rewritten), `components/lab/chroma-capture-canvas.tsx` (edited), `components/lab/chroma-capture-section.tsx` (edited), `docs/DECISIONS.md` (edited).
- What: v2 rendered hard-edged ellipses with no merging — Lisa screenshot: "shapes aren't merging and they are zooming off the screen. Remove all color, work on getting the shape and motion correct. Look for the most popular lava lamp code on github and start with that." Root cause: `ctx.filter = "url(#chroma-goo)"` silently fails in Chrome (known canvas 2D limitation). Researched the canonical pattern across the most-starred lava-lamp / metaball / gooey implementations on GitHub (n3r4zzurr0/canvas-liquid-effect 120★, Saganaki22/LofiLamp, Bret Cameron's tutorial, Effect.Labs metaball demos, CSS-Tricks gooey pens). Universal pattern: render shapes at full resolution to canvas or DOM, then apply `filter: url(#goo)` as a CSS property on the container — NOT via canvas API. CSS filters run in the browser compositor and are reliable everywhere.
  - **`lib/chroma/physics.ts`**: retuned for proper lava motion. `vTerminal -10 → -14`, `sigmaDriftX 18 → 5`, `tauDriftX 3 → 10s` (horizontal RMS ≈ 11 px/s vs vertical 14 px/s — vertical dominates). Added `wallRepulsionAccel()` helper for lateral wall force. New tuning constants `wallMarginRadii`, `wallAccel`, `ceilingMarginRadii`, `ceilingAccel` in `PHYSICS_DEFAULTS`.
  - **`lib/chroma/blob.ts`**: shrank stretch amplitudes — velocity stretch capped at +0.15 (was +0.55), oscillation amplitude 0.08 (was 0.2). Blobs now range stretch 0.92–1.23 (mostly round with subtle deformation). Added `applyWallForce(blob, width, height, dt)` exported helper that wraps `wallRepulsionAccel` plus a soft ceiling push.
  - **`lib/chroma/render.ts`**: completely rewritten as a thin shape-only renderer. Solid mono `#1313ec` fills (no per-blob gradients yet — color comes back in v4). No `ctx.filter` calls. No half-res offscreen. No `metaballCanvas` plumbing. Just: clear → for each blob, fill a stretched ellipse → grain overlay → watermark (capture only) → flash (live only). The CSS goo filter on the canvas element does the merging. Exported `drawWatermark` so `capture.ts` can call it without re-clearing the canvas.
  - **`lib/chroma/capture.ts`**: rewritten to bake the goo into the PNG via JS replication of the SVG filter — render solid blobs → `ctx.filter = "blur(N)"` (canvas-native blur works fine; only `url()` references are broken) to a second offscreen → walk ImageData and threshold alpha exactly like `feColorMatrix` would (`a' = clamp(a·18 − 7·255, 0, 255)`) → composite → drawWatermark → toBlob. Slow (~tens of ms) but only runs once per capture.
  - **`components/lab/chroma-capture-canvas.tsx`**: removed all `metaballCanvasRef` code. Added `applyWallForce()` call in the per-blob step loop. Applied `style={{ filter: "url(#chroma-goo)" }}` directly on the canvas element so the CSS compositor handles the goo.
  - **`components/lab/chroma-capture-section.tsx`**: updated the SVG filter values to the canonical preset: `stdDeviation=10`, matrix multiplier `18`, offset `-7` (n3r4zzurr0 / Bret Cameron values, proven across thousands of implementations). Removed `feComposite atop` from my v2 attempt — it would clip the goo silhouette by the SourceGraphic alpha and leave the gooey necks empty.
- Decisions:
  - **Pivot rendering from `ctx.filter` to CSS `filter`** — load-bearing fix. The canonical pattern is documented in DECISIONS.md ("Rendering (v3 — CSS-filter goo, canonical pattern, mono first)") so this mistake doesn't get re-proposed. v2's rendering section is preserved below v3's as the rejected alternative.
  - **Mono ethos-blue blobs** in v3. Color returns once shape + motion are approved. Isolates the variable we're tuning.
  - **Drop the half-res offscreen** entirely. With CSS handling the blur, full-res canvas paints are fine.
  - **No `feComposite` in the SVG filter** — wrong primitive for canvas-rendered uniform-color blobs (would clip gooey necks).
  - **JS-replicated goo for capture** — exactly mirrors the SVG filter math. Slow but acceptable as one-shot.
  - **Wall force, not edge wrap or kill-and-respawn for lateral drift** — preserves the "glass tube" lava-lamp metaphor.
- Verification: `npx tsc --noEmit` clean, lints clean, dev server `/lab` 200.
- Next: visual check by Lisa. If shape + motion read as lava lamp, color and gradient return in v4. If still wrong, tune SVG filter `stdDeviation` (currently 10) and physics `vTerminal` / `sigmaDriftX`.

### 13:30 — Chroma Capture render v2: lava-lamp metaball goo with internal gradients

- Files: `lib/chroma/blob.ts` (edited), `lib/chroma/render.ts` (rewritten), `lib/chroma/capture.ts` (edited), `components/lab/chroma-capture-canvas.tsx` (edited), `components/lab/chroma-capture-section.tsx` (edited), `docs/DECISIONS.md` (edited).
- What: First v1 render (stacked radial gradients per blob) read as "soft clouds" — not lava lamps. Lisa: "they are not lava lamp blob shaped which should be fluid and changing." Then: "I want the gradiation and texture seen here within lavalamp bubble shapes" (kuro.store ref) — i.e. lava-lamp **shape** + kuro.store **surface**. Refactored the rendering layer:
  - **`blob.ts`**: added `stretch` (aspect ratio), `stretchAngle` (radians), and `shapePhase` (per-blob random oscillation phase). `stepBlob` now updates `stretch` from `velocity_magnitude / 50` (saturating at +0.55) plus a slow `0.2·sin(shapePhase)` oscillation, and `stretchAngle` smoothly tracks `atan2(vy, vx)` with τ=0.8s. Moving blobs elongate along their motion vector, resting blobs gently breathe. `hitTest` now transforms the test point into the blob's local rotated frame and tests against the ellipse `(x/a)² + (y/b)² ≤ 1`.
  - **`render.ts`**: completely rewritten. Each blob draws as a **stretched ellipse with a linear gradient running along its major axis**, with gradient stops at the blob's 2–3 hues (OKLCH → sRGB). Blobs render to a **half-resolution offscreen canvas**, which is then re-drawn into the visible canvas through `ctx.filter = "url(#chroma-goo)"`. The SVG filter is `feGaussianBlur(10)` + `feColorMatrix` with values `0 0 0 22 -10` on the alpha row only — it boosts and thresholds the alpha channel while leaving RGB untouched, so multi-color internal gradients survive the threshold. Where two blobs' alpha fields overlap during blur, the threshold produces a smooth gooey neck — true metaball merging. Grain overlay drawn on top, watermark on top of that (capture only).
  - **`capture.ts`**: rewired to pass a dedicated metaball offscreen canvas to `renderFrame` at 2× DPR, so the goo filter applies identically at capture time and produces a crisp transparent PNG.
  - **`chroma-capture-section.tsx`**: injected a hidden SVG `<defs><filter id="chroma-goo">` element so `ctx.filter = "url(#chroma-goo)"` resolves in both live and capture paths.
  - **`chroma-capture-canvas.tsx`**: allocates one `HTMLCanvasElement` as `metaballCanvasRef` on mount, kept in sync with visible size via `ensureMetaballSize()`. Threaded through `renderFrame`'s new `metaballCanvas` option.
- Decisions:
  - **Rejected `ctx.filter = "blur(10) contrast(20)"`**: CSS `contrast()` applies to RGB *and* alpha, which would clip multi-color gradients into pure saturation. `feColorMatrix` lets us threshold alpha alone.
  - **Rejected WebGL/SDF raymarching**: would introduce 3D shading we explicitly don't want (Lisa: "I don't need the 3D effect"). Canvas + SVG filter is browser-native, no shader pipeline, no GPU context loss.
  - **Rejected per-blob path morphing** (parametric blob silhouettes via cubic Bezier paths): unnecessary — the goo filter's blur+threshold produces amorphous merged silhouettes from simple ellipse inputs, and the per-blob stretch+oscillation gives the constant deformation Lisa wanted. Path morphing would add code complexity for no visual gain.
  - **Half-resolution metaball canvas**: 4× cheaper per pixel, upscale adds free softening. Single canvas allocated once, reused across frames.
  - **Hit-test uses the rotated ellipse** with a 0.8× shrink — pops feel intentional, don't fire on gooey necks where two blobs merge.
  - **SVG filter at the section level**, not the canvas component, so the same `<filter>` serves both live rendering and capture (the filter is referenced by DOM id, which works as long as the element is in the page).
- Verification: `npx tsc --noEmit` clean, `npm run lint` clean, Next.js dev server compiles + serves `/lab` 200.

### 13:15 — Chroma Capture build — kinetic color-harmony field with PNG export

- Files:
  - `lib/chroma/color.ts` (created)
  - `lib/chroma/color-names.ts` (created)
  - `lib/chroma/physics.ts` (created)
  - `lib/chroma/blob.ts` (created)
  - `lib/chroma/render.ts` (created)
  - `lib/chroma/audio.ts` (created)
  - `lib/chroma/capture.ts` (created)
  - `components/lab/chroma-capture-canvas.tsx` (created)
  - `components/lab/chroma-capture-section.tsx` (created)
  - `app/lab/page.tsx` (edited)
  - `docs/DECISIONS.md` (edited)
- What: Second Lab experiment. Soft gradient blobs drifting on a cream-grained field inside a hairline-blue-bordered playfield. Cursor motion nudges blobs via a Gaussian velocity field; nearby blobs propagate the impulse through fluid entrainment (chain reaction). Click pops a blob, which disperses (ink-in-water diffusion math) and plays a major-pentatonic chord whose pitches map from the blob's gradient hues (color → sound synesthesia). Camera icon saves a transparent PNG of the current moment, watermarked, named after the active chord (e.g., `chroma-capture-coral-aqua-violet.png`). Mute toggle persists in `localStorage`. Aspect 4:3 desktop, 1:1 mobile. Touch-safe via `touch-action: none` + pointer-up release.
- Decisions:
  - **Cream interior with hairline ethos-blue border** on a dark Vault Lab page — first deliberate use of the "framed-work-in-gallery" pattern (logged in DECISIONS.md "Lab experiment interior palette"). Vibrant gradients require cream substrate; same hues on dark read fluorescent.
  - **Canvas, not SVG.** `canvas.toBlob()` is the right export path; SVG-to-PNG of blur filters is browser-buggy.
  - **No `ctx.filter` blur.** Each blob is a stack of 2–3 radial gradients with soft alpha falloff — the gradient stops ARE the blur. Cheap, robust, cross-browser.
  - **No custom blob shapes.** Shape variety from overlapping offset radial gradients, no polygon paths (avoids self-intersection bugs).
  - **No rigid-body collision.** Chain reaction emerges from blob-blob fluid entrainment (Gaussian velocity-field perturbation, same kernel as cursor), not physical contact.
  - **OKLab / OKLCH** for color math, not HSL. Triadic chords look perceptually balanced; HSL triads have one dominant color.
  - **Major pentatonic snap** for pitch — eliminates dissonance by construction. Any chord sounds musical.
  - **Sound default ON** at subtle 0.14 master gain; mute toggle visible in the playfield's top-right next to the camera.
  - **Captures at 2× DPR** off-screen with grain OFF, watermark ON. Live render at devicePixelRatio capped at 2.
  - **Reduced motion**: physics slowed 90%, audio unaffected (sound is user-triggered).
- Math sources: Ottosson 2020 (OKLab); Green's function of 2D diffusion (Gaussian falloff); standard OU process discretization; standard Stokes-drag buoyancy.

---

## 2026-05-23 — Session 22: Typoglycemia (first Lab experiment)

### 16:30 — Typoglycemia Lab experiment built

- Files: `lib/scramble.ts` (created), `lib/scramble.test.ts` (created), `lib/content/typoglycemia-essay.ts` (created), `components/lab/scrambled-word.tsx` (created), `app/lab/typoglycemia/page.tsx` (created), `app/lab/typoglycemia/typoglycemia-experiment.tsx` (created), `app/lab/page.tsx` (edited), `package.json` (edited — added `vitest` devDep + `test` script)
- What: First concrete Lab experiment. Interactive scroll-driven reading piece that demonstrates Graham Rawlinson's 1976 typoglycemia finding. Body essay starts fully scrambled below a fixed ethos-blue demarcation hairline at 33vh (30vh on mobile). As the visitor scrolls, words crossing the demarcation animate their letters from scrambled to clean positions over 350ms via per-letter `translateX`. Scroll-back is a ratchet — resolved words stay clean. Essay text is a ~600-word adapted excerpt from Matt Davis, "Reibadailty," MRC Cognition and Brain Sciences Unit (fair use + attribution + outbound link; no email permission requested). Scrambler enforces 7 invariants (length, multiset, first/last letter pinning, non-letter position preservation, short-word passthrough, determinism, identity-on-single-permutation) verified by 20 vitest unit tests. Tokenizer handles apostrophes (in-word), hyphens (split), numbers (untouched), and `*italic*` markdown markers. DOM order is always the clean word — visual scramble is pure CSS transform — so screen readers read the real essay. `prefers-reduced-motion` snaps without animation. Body is `visibility: hidden` until `document.fonts.ready` so letter-width measurements use Newsreader, not the fallback font.
- Decisions: See `docs/DECISIONS.md` "Typoglycemia (Lab experiment)" for the full mechanic spec, scramble invariants, source-text choice, and attribution policy. Lab index slot 02 is now Typoglycemia; slot 03 remains reserved.

### 16:55 — Typoglycemia refactored to inline bounded box on `/lab`

- Files: `app/lab/typoglycemia/page.tsx` (deleted), `app/lab/typoglycemia/typoglycemia-experiment.tsx` (deleted), `components/lab/typoglycemia-section.tsx` (created), `app/lab/page.tsx` (edited — removed `Link` import + preview card, now renders `<TypoglycemiaSection />` for slot 02), `app/globals.css` (edited — added `.typo-box` scrollbar styles), `docs/DECISIONS.md` (edited — rewrote Typoglycemia section for inline architecture).
- What: Moved the Typoglycemia experiment from its own subroute (`/lab/typoglycemia`) to an inline bounded scroll box directly on `/lab`. The dedicated subroute and its two files were deleted. New `TypoglycemiaSection` client component owns the bounded box, the sticky intro+demarcation, the box-scoped scroll handler, and the resize/font-ready measurement lifecycle. Reused (unchanged) the existing `lib/scramble.ts`, `lib/scramble.test.ts`, `lib/content/typoglycemia-essay.ts`, and `components/lab/scrambled-word.tsx`. Box is `h-[min(75vh,720px)] min-h-[420px]`, full-width of the Lab column, with a `max-w-[640px]` reading column inside. Sticky region uses an opaque `rgb(18,18,25)` background (visually equivalent to the box's 3% cream-over-Vault tint) so scrolling content disappears cleanly behind it. Visible thin scrollbar (`.typo-box` rules) + 64px bottom fade overlay (fades to 0 opacity when at bottom) serve as scrollability affordances. `overscroll-behavior: contain` keeps the inner scroll from chaining to the page. 20 vitest tests still pass; `next build` clean — `/lab/typoglycemia` no longer in the route list, only `/lab`.
- Decisions: Adopted Option 2 (bounded box) over reformatting `/lab` like the Index page or using iframes. Rationale: least engineering churn, better UX for the "Lab" concept (multiple specimens visible on one page), clearer hiring-manager read (experiment is interactive immediately, not gated behind a preview click). Documented the choice and rejected alternatives in `docs/DECISIONS.md`. Visual cues for the bounded scroll are *both* a styled scrollbar and a bottom fade (per Lisa); the fade auto-dismisses at the bottom so attribution stays legible.

### 17:05 — Typoglycemia box: keyboard a11y

- Files: `components/lab/typoglycemia-section.tsx` (edited)
- What: Added `role="region"`, `aria-label`, and `tabIndex={0}` to the bounded box so keyboard-only users can focus it and scroll with arrow keys / Page Up / Page Down. Added a focus-visible ring (1px ethos-blue with a Vault-dark offset) so the focus state is visible against the dark theme.
- Decisions: None — straight accessibility fix.

### 17:10 — Typoglycemia: fix unscrambling (sticky line, not sticky intro)

- Files: `components/lab/typoglycemia-section.tsx` (rewritten), `docs/DECISIONS.md` (edited)
- What: First test surfaced a fundamental bug — words below the demarcation never unscrambled when scrolled up because the intro paragraph was wrapped in a `position: sticky` region, which kept the intro pinned at the top of the box and blocked body text from ever passing above the line. Rewrote the component so that all paragraphs (intro + body) live in one continuous scrolling flow, and only the **1px ethos-blue line** is sticky (`top: 120px`). The intro is clean by position (its content-Y is above the line at scroll=0), not by special case. Removed the `introSeeds` pre-seeding logic — initial measurement runs the normal crossing logic. Replaced the offset-based demarcation calculation with a live `getBoundingClientRect` read on the line element, so the same code path handles natural-flow and pinned states.
- Decisions: Documented "Why sticky line (not sticky intro)" in `docs/DECISIONS.md` under the Typoglycemia section so this mistake doesn't get re-proposed. Line viewport offset is 120px (gives ~4 lines of clean accumulation above the line once user scrolls past the intro).

### 21:18 — Typoglycemia: rewrite intro to lead with the real study

- Files: `lib/content/typoglycemia-essay.ts` (edited)
- What: Replaced P0 (intro) so it introduces Rawlinson's 1976 thesis directly instead of opening with the Cambridge meme negation. P0 now reads: "In 1976, Graham Rawlinson submitted a PhD thesis at the University of Nottingham. He called it *The Significance of Letter Position in Word Recognition*. His finding: you can scramble the middle letters of a word and most readers still recognize it. The first letter and the last letter do the work. Everything else can move." Rewrote P1 to bring in the Cambridge meme as a follow-on rather than the lead ("In 2003, a paragraph started showing up online demonstrating the effect, attributing it — incorrectly — to Cambridge researchers. There was no Cambridge study. The meme … captured something real anyway."). Changed "viral paragraph" → "the meme" in P2 for term consistency now that the meme is named in P1.
- Decisions: Real study leads, meme follows — establishes Rawlinson as the actual source of the finding before introducing the popular (mis)attribution. Voice: "He called it" + "His finding:" colon pattern matches Lisa's voice rules.

### 21:21 — Lab page title rendering in cream

- Files: `app/globals.css` (edited), `app/lab/page.tsx` (edited)
- What: The `Lab` h1 was rendering in dark gray on the Vault dark background (effectively invisible). Root cause: `.page-title` in `globals.css` hardcodes `color: var(--color-gray-900)` outside Tailwind's layered cascade, so the inline `text-[#fdfbf7]` utility lost specificity to it. Added `body:has(.vault-theme) .page-title { color: var(--color-ethos-cream); }` next to the other Vault overrides (header/footer/nav/blue-hairline). Removed the dead `text-[#fdfbf7]` utility from the h1.
- Decisions: Use the Vault `:has()` override pattern — same approach used for every other Vault theme color override in the file. Keeps the cream/gray decision in CSS where the theme switching lives, not on each page.

### 2026-05-24 11:20 — Typoglycemia: scroll chains at box boundaries

- Files: `components/lab/typoglycemia-section.tsx` (edited), `docs/DECISIONS.md` (edited).
- What: Changed `overscrollBehavior` on the bounded box from `contain` to `auto`. Now when the inner scroll hits the top or bottom of the box, continued scroll input chains to the outer page — reader can scroll past the box in both directions without targeting outside it. First-test feedback: with `contain`, the box felt like a trap; with `auto`, it feels like a window the reader can pass through.
- Decisions: Browser-default scroll chaining is the right behavior for embedded content boxes. `contain` is for cases where you genuinely want to isolate scroll (e.g., a modal). Updated the rationale in `docs/DECISIONS.md` under the Typoglycemia "Architectural decisions" subsection.

### 2026-05-24 10:58 — Typoglycemia: add the viral meme as a verbatim quote

- Files: `lib/content/typoglycemia-essay.ts` (refactored shape + content), `components/lab/typoglycemia-section.tsx` (edited), `docs/DECISIONS.md` (edited).
- What: Added Matt Davis's famous 2003 meme paragraph ("Aoccdrnig to a rscheearch at Cmabrigde Uinervtisy…") between P2 ("…The meme was. Why?") and the seven-rules breakdown. To avoid double-scrambling the famous viral form, introduced a typed paragraph union: `{ kind: "essay" } | { kind: "quote" }`. Essay paragraphs run through the existing tokenize/scramble/unscramble pipeline; quote paragraphs render as a styled `<blockquote>` with `cite=` linking to Matt Davis's page, left border + indent + ~70% opacity cream. Quote paragraphs are NOT tokenized, NOT scrambled by our scrambler, and NOT tracked by the crossing logic — they sit in the body flow as static citations. Updated `RenderedParagraph` to a discriminated union to match.
- Decisions: **Option A** (verbatim quote) over Option B (let the scrambler regenerate a permutation) or Option C (hybrid swap on cross). Reason: the meme is famous for the *specific* "Aoccdrnig"/"Cmabrigde" form; a different permutation defeats the citational purpose. Documented in `docs/DECISIONS.md` under "Paragraph kinds." Quote paragraphs are visually differentiated (blockquote chrome) so the static state reads as intentional, not buggy.

### 21:24 — Lab: remove AVA section

- Files: `app/lab/page.tsx` (edited), `components/lab/typoglycemia-section.tsx` (edited), `docs/DECISIONS.md` (edited).
- What: Removed the entire AVA `<section id="ava">` block from the Lab page. AVA has been promoted to a full case study (`/index/virtual-agent`) and no longer fits the Lab "interactive craft demo" format. Renumbered the remaining Lab slots: Typoglycemia `02 → 01`, reserved placeholder `03 → 02`. Updated the four AVA-referencing lines in `docs/DECISIONS.md` to reflect the new Lab structure: removed "AVA and 1–3 mini experiments" framing, updated chrome-match references to point at the slot 02 placeholder instead of the (gone) AVA card, and dropped the "Lab 01 — AVA entry is unchanged" stale note from the Typoglycemia decisions section.
- Decisions: AVA is permanently out of Lab — Lab is reserved for craft demos that don't have a case-study home. Lab is now a 2-slot page (Typoglycemia shipped + one placeholder).

---

## 2026-05-22 — Session 21: First Messaging Experience case study

### 16:45 — FMUX: curved text wrap section (NYT-style shape-outside)

- Files: `app/index/first-messaging-experience/page.tsx` (edited), `app/globals.css` (edited), `docs/SESSION_LOG.md` (edited)
- What: Replaced "Two platforms, two problems" grid layout with a **curved text wrap** section using CSS `shape-outside: ellipse()`. Body text has a straight left edge and flows around a right-floated elliptical shape (placeholder for image). Copy expanded to cover legacy technical debt, mismatched UI between FB and Messenger, the send-icon performance theory, and divergent frontend infrastructure. Hero intro shortened to a punchy setup line.
- Decisions: `shape-outside` approach (float-based, not grid). Falls back to stacked layout on mobile. Shape is 45% width, 650px tall on desktop.

### 19:55 — FMUX: Explorations → Unified Flow section

- Files: `components/portfolio/unified-flow-section.tsx` (created), `app/index/first-messaging-experience/page.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Replaced horizontal Explorations scroller with **The unified flow** — 8/4 grid (aspect-video + play placeholder left, Synthesis + metrics + surface tags right). Matches Kinetic Archive reference layout, Azure Ethos tokens.
- Decisions: `ExplorationsScroller` kept in codebase but unused on FMUX for now.

### 19:48 — FMUX: Explorations before The Experiment

- Files: `app/index/first-messaging-experience/page.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Moved Explorations section to sit after "Two platforms, two problems" and before "The Experiment".
- Decisions: None

### 19:45 — Shared mobile screen placeholder (before + experiment + explorations)

- Files: `components/portfolio/mobile-screen-placeholder.tsx` (created), `app/index/first-messaging-experience/page.tsx` (edited), `components/portfolio/explorations-scroller.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Extracted `MobileScreenPlaceholder` — 9:16 mobile frame at `min(812px, 75vh)` / `min-h-[480px]`. Before states and experiment variants now use the same frame as Explorations.
- Decisions: Shared component for all FMUX mobile placeholders.

### 19:43 — Explorations: gap 100px → 40px

- Files: `components/portfolio/explorations-scroller.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Reduced inter-panel spacing from 100px to 40px (`gap-10`).
- Decisions: None

### 19:42 — Explorations: 100px gap between screens

- Files: `components/portfolio/explorations-scroller.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Added `gap-[100px]` between exploration panels; each panel now has its own hairline border instead of shared dividers.
- Decisions: None

### 19:40 — Explorations: light panel background

- Files: `components/portfolio/explorations-scroller.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Swapped dark `bg-gray-900` panels for `bg-gray-50` to match other placeholder frames on the page.
- Decisions: None

### 19:35 — FMUX: Explorations horizontal scroll section

- Files: `components/portfolio/explorations-scroller.tsx` (created), `app/index/first-messaging-experience/page.tsx` (edited), `app/globals.css` (edited), `docs/SESSION_LOG.md` (edited)
- What: Added **Explorations** section with full-bleed horizontal scroll — up to 8 full-height mobile frames (9:16 aspect, `min(812px, 75vh)` tall). Hidden scrollbar, scroll hint, panel labels. Eight placeholder slots for flow videos/screens.
- Decisions: Shared `ExplorationsScroller` component for reuse. `.hide-scrollbar` utility in globals.

### 19:20 — FMUX: revert redundant full-flow section

- Files: `app/index/first-messaging-experience/page.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Removed **The full flow** section added without request; restored single **What shipped** conclusion (text + metrics left, video right).
- Decisions: One closing section only — no separate animations block.

### 19:15 — FMUX: headline fix, animations section, conclusion alignment

- Files: `app/index/first-messaging-experience/page.tsx` (edited), `lib/content/briefs.ts` (edited), `docs/SESSION_LOG.md` (edited)
- What: Restored catalog title as hero headline (two-line: "First messaging experience / in Messenger."). Added **Part 4: The full flow** with side-by-side Messenger + Facebook animation placeholders. Rebuilt conclusion to match GenAI pattern (8/4 video + border-left text, metatext label). Extracted `MediaPlaceholder` for screenshot slots. Updated brief year to **2026** and primary metric to **+$10M/yr**.
- Decisions: Stat line still **"+$10M/yr. Redesign, not rebuild."** — Lisa was leaning this way but had not finalized; confirm before ship. All image/video slots remain placeholders pending asset export from Figma.

### 18:08 — First Messaging Experience case study scaffolded (retroactive)

- Files: `app/index/first-messaging-experience/page.tsx` (created), `docs/stitch-prompt-first-messaging.md` (created), `lib/content/catalog.ts` (edited), `lib/content/briefs.ts` (edited)
- What: Built full case study page for icebreaker redesign across Messenger + Facebook. Layout follows Stitch reference: sticky left text with staggered before screenshots, cascading 3-column experiment variants, full-bleed design decisions band. Added slug to catalog and brief entry.
- Decisions: Full-bleed background on design decisions section. I/II/III format matches other pages. Hero uses 8/4 grid (intro left, stat + metadata right), blue hairline below hero.

---

## 2026-05-20 — Session 20: Homepage grid hydration + subtitle

### 15:30 — Homepage: Grid Hydration interaction

- Files: `components/grid-hydration.tsx` (created), `app/globals.css` (edited), `app/page.tsx` (edited)
- What: Added cursor-following grid interaction to homepage. 40px blue grid with radial mask — 20% opacity on hover, 3% ambient. Client component tracks mousemove/touchmove and updates CSS custom properties. Fixed position, pointer-events-none, degrades gracefully on mobile.
- Decisions: Grid size 40px (sketchbook density). Ambient 3%, hover 20%. Site-wide z-index 1 (above halo at 0, below content at 10).

### 15:30 — Homepage: Status subtitle restyle + copy

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Replaced plain paragraph subtitle with "Status" label + left blue border accent, positioned to align with inbox-ads card (col-start-8). Copy updated to: "I tie design decisions directly to business performance. Currently at Meta generating $8.2B with messaging ads. Previously Autodesk." Dropped old "41 countries" and "strategy and execution" lines.
- Decisions: Subtitle signals business-design integration (staff skill #6). "Previously Autodesk" stays as a 3-word credential. Removed resume-speak.

## 2026-05-19 — Session 19: GenAI2 copy & structure overhaul

### 16:27 — GenAI2: hero intro rewrite + role/team/surfaces metadata

- Files: `app/index/genai2/page.tsx` (edited)
- What: Replaced buzzword-heavy hero intro with plain-language version ("Meta's messaging ads span Messenger, Instagram, and WhatsApp — driving $8.2B in revenue..."). Added Role/Team/Surfaces metadata block matching virtual-agent pattern. Restructured hero into single grid so intro top-aligns with title. Role: "Lead designer", Team: "4 product designers, 3 engineers, 1 data scientist, 0 PMs", Surfaces: "Ads Manager, Messenger, WhatsApp, Instagram".
- Decisions: Use "Lead designer" not "Design owner" (portable outside Meta). "0 PMs" signals scope without spelling it out.

### 16:00 — GenAI2: Part 1 full rewrite (The Thesis)

- Files: `app/index/genai2/page.tsx` (edited)
- What: Rewrote Phase 1 entirely. Replaced fake "Innovator's Dilemma" quote with real Brazil usability participant quote. Removed decorative shimmer-line chart ("Strategic Tethering"). New structure: quote + stacked before metrics (64 usability, 61% completion) on left; narrative with thesis statement + bullet list of four competing priorities + resolution paragraph on right. Added metric cards (85, 100%, 96%, +74%) below. Thesis: "the creation model was the problem, not the interface." Renamed to "Part 1: The Thesis."
- Decisions: Section named "The Thesis" to frame the whole arc. Before metrics in grey with half-width hairlines; after metrics in card format. Card colors: grey-blue-grey-blue (100% and +74% get blue emphasis). Card labels reference data source ("Usability Peer Benchmarking" / "Experiment results").

### 15:50 — GenAI2: removed Phase 3, added conclusion

- Files: `app/index/genai2/page.tsx` (edited)
- What: Deleted Phase 3 (entirely redundant with Part 1 narrative + hero metadata). Added "What shipped" conclusion section preserving unique Phase 3 content: neutral ad performance guardrail, task redefinition rationale, 84% global reach. Removed unused `MetricCard` function and `AnimateMetrics` import. Renamed Phase 2 to "Part 2." Removed hairline above Part 2.
- Decisions: Page is now Hero → Part 1 (thesis/strategy/metrics) → Part 2 (solution) → What shipped (conclusion). No Phase 3.

## 2026-05-18 — Session 18: GenAI layout variants (GenAI1 / GenAI2)

### 14:10 — GenAI2: layout update (cleaner Phase 2, side nav, shimmer/reveal)

- Files: `app/index/genai2/page.tsx` (edited), `app/globals.css` (edited), `components/portfolio/case-reveal-observer.tsx` (created)
- What: Updated **layout only** — content unchanged. **Phase 2** restructured from tall vertical-rl split to a cleaner **2-column grid** (Active Labour / From Creator on left, Passive Oversight / To Reviewer on right with `border-l` separator, `aspect-video` image placeholders, description below). Added **side nav rail** with section anchors (Context / Solution / Impact / Metrics). Added **shimmer-line** CSS animation on phase hairline dividers and filled metric cards. Added **case-reveal** scroll-triggered entrance animations via `CaseRevealObserver` client component (intersection observer with `prefers-reduced-motion` fallback). Metric cards now have a third `muted` variant for alternating surfaces.
- Decisions: Shimmer and reveal animations live in `globals.css` as utility classes for reuse across case layouts.

### 13:48 — GenAI2: three-phase editorial layout (Flow 75 data)

- Files: `app/index/genai2/page.tsx` (rewritten)
- What: Replaced GenAI2 with **three-phase editorial** layout matching the provided HTML mock. **Phase 1** (Operational Failure) — real user quote from India usability test, dilemma framing, 12%/88% stat visualization. **Phase 2** (Interaction Flip) — side-by-side creator vs reviewer with before/after data (UPB 62→85, completion 64%→100%, adoption 95%). **Phase 3** (Strategic Validation) — $8.2B + 50M stats, four metric cards (85 UPB / 23.7% CTR / 95% adoption / 100% completion), strategy narrative explaining the three-initiative linkage, role/teams/guardrail metadata. All content from **75Preso.pdf**. Header/footer untouched.
- Decisions: None.

### — GenAI1: Creator-to-reviewer layout (Flow 75 data)

- Files: `app/index/genai1/page.tsx` (edited)
- What: Rebuilt **GenAI1** to match the **Creator-to-Reviewer** mock (hero + sticky meta + 88% callout, phase 01 legacy, displacement overlap, architecture grid + impact ledger). Copy/metrics from **Flow 75 deck** and existing case (`12%`/`88%`, UPB `62→85`, completion `64%→100%`, CTR ladder, `95%`/`+0.03%`/`200%`, `$3B+`, `84%`/6 teams). **No** duplicate site header/footer — global chrome in `app/layout.tsx` unchanged; in-page right rail for section anchors only.
- Decisions: None.

### — GenAI1 + GenAI2 alternate case layouts

- Files: `app/index/genai1/page.tsx` (created), `app/index/genai2/page.tsx` (created), `components/portfolio/genai-case/shared.tsx` (created)
- What: Added two layout experiments for **Starting conversations with GenAI** at `/index/genai1` and `/index/genai2`. **GenAI2** is an **editorial stack** (full-width hero, static metrics ribbon, alternating text/visual acts). Shared **`UpbBeforeAfterBand`** and **`VisualPlaceholder`** extracted for reuse. **`/index/genai-conversations`** unchanged.
- Decisions: Variants are not in catalog; direct URLs only until one layout is chosen to replace the canonical page.

## 2026-05-10 — Session 17: GenAI conversations case page scaffold

### 17:00 — GenAI case: fewer unexplained blue metrics

- Files: `app/index/genai-conversations/page.tsx` (edited), `components/portfolio/icebreaker-ctr-ladder.tsx` (edited)
- What: **Hero** “At a glance” is **prose** (outcomes in plain language, no UPB/CTR wall). Removed **`AnimateMetrics`** everywhere; **Program scorecard** section removed. **12% / 88%** and **Advantage+** experiment stats live in **paragraphs** with **gray** emphasis, not giant blue type. **$3B+** stat strip removed (stakes stay in narrative). **UPB band** “after” values and arrows use **gray**, not ethos-blue. **84%** callout uses **gray-900** number. **CTR ladder** percentages set to **gray-900** (bars stay blue accent). UPB sublabel clarified as internal audit score.
- Decisions: Model choice is yours; this pass addresses “blue numbers that don’t land” without waiting on a tool switch.

### 16:30 — GenAI hero: new subtitle + metrics in rail

- Files: `lib/content/briefs.ts` (edited), `app/index/genai-conversations/page.tsx` (edited)
- What: **`genai-conversations` subtitle** rewritten (Message Template → Chat Builder, CTM post-click framing). **At a glance** moved directly under italic subtitle in one cream band; shows **all four** `brief.metrics` in a 2-column grid from `min-[480px]`. **Role / Surfaces** follow. Footer scorecard copy updated to match.
- Decisions: None.

### 16:00 — GenAI case: integrate metrics & visuals into three-act flow

- Files: `app/index/genai-conversations/page.tsx` (edited), `components/portfolio/icebreaker-ctr-ladder.tsx` (created)
- What: **Hero** right rail adds **At-a-glance** `AnimateMetrics` (first two brief metrics). **Act 01** interleaves **12% / 88%** animation + **$3B+** callout beside narrative + **Before** fig + gap rail (no orphaned wall of text). **Act 02** uses **`IcebreakerCtrLadder`** beside copy + **experiment** `AnimateMetrics` + mid-section fig. **Act 03** adds **84%** alignment card, **`UpbBeforeAfterBand`**, **After** fig + rail. **AnimateDivider** between acts. Closing **Program scorecard** repeats full `brief.metrics` as ribbon tied to hero. Shared **`VisualPlaceholder`** for screenshot slots.
- Decisions: **`IcebreakerCtrLadder`** is a static bar comparison (deck CTRs), `rounded-[2px]` bars per elevation rules.

### 15:00 — GenAI / Flow 75: three-act narrative + deck grounding

- Files: `app/index/genai-conversations/page.tsx` (edited), `lib/content/briefs.ts` (edited), `lib/content/catalog.ts` (edited)
- What: Page restructured into **three friction pillars** (legacy bottleneck / creator-to-reviewer / cross-functional execution) with inbox-style sticky rails + fig placeholder; **Impact** + **Before/After** retained. Copy in **first person**, pulled from **`75Preso.pdf`** (CTM scale, 12% vs 88% customization, UPB 62→85 & completions, six-team map, 84% Start conversations, GenAI CTR ladder, 95% adoption / +0.03% iCTX / 200% goal beat, neutral launch, GenAI vs non-GenAI decoupling). Hero **Role** / **Surfaces** aligned to deck. **`briefs` / `catalog`** updated for Flow 75 story + real **AnimateMetrics** values.
- Decisions: PDF lives on Google Drive locally — not linked from the site. Screenshots still placeholders until assets land in **`public/work/`**.

### 14:30 — GenAI case: inbox-style body (keep custom hero)

- Files: `app/index/genai-conversations/page.tsx` (edited)
- What: Below hero, aligned with **`inbox-ads`**: **Problem & opportunity** sticky rail + multi-paragraph constraint + fig band; **Impact** uses **`AnimateMetrics`**; **What I did** sticky rail with move split at colon, body paragraphs from move tail + **workDescription** + **unlock**; **Before / After** row layout + **`AnimateDivider`** + side rails (**The gap** = constraint lead, **The system** = unlock lead); **Design principles** three-column grid. Placeholders for imagery until **`public/work/genai-conversations/`** assets exist.
- Decisions: Hero unchanged (subtitle + Role/Team). Principle blurbs are scaffolding — replace with Lisa-final copy as needed.

### 14:00 — `/index/genai-conversations` case shell + brief metadata

- Files: `app/index/genai-conversations/page.tsx` (edited), `lib/content/briefs.ts` (edited)
- What: Replaced brief-only stub with **virtual-agent-aligned** shell: `BackButton`, hero grid (`ScrollSpyTrigger`, serif italic `h1`, subtitle pull line, Role/Team), sectioned narrative (**The tension** / **The constraint** / **The move** / **Impact** / **The work** with placeholder visual / **What it unlocked**). Renamed default export to **`GenAiConversations`**. Set **`hasDeepWork: true`** on **`genai-conversations`** brief. **Role** and **Team** are initial framing (not from brief strings).
- Decisions: Title stays **Starting conversations with GenAI** until a rename pass. Metrics remain **`—`** placeholders from brief until real numbers. **Visuals in progress** placeholder for Flow 75 / builder imagery.

## 2026-05-10 — Session 16: Virtual Agent global guardrails intro

### 12:00 — Establishing global guardrails paragraph

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: Intro under **Establishing global guardrails** replaced with framework / engineering+content teams / qualitative insights → concrete execution rules framing.
- Decisions: **`ava2`** matched for parity on this block.

### 12:05 — Global guardrails intro: active voice

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: Passive *were translated* → past active *I translated* per portfolio voice guidelines.
- Decisions: None.

### 12:10 — Global guardrails intro: shortened line

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: Lead-in dropped; body is only *Qualitative insights were translated into concrete execution rules:* (colon retained before policy blocks).
- Decisions: None.

### 12:15 — Global guardrails intro: restore scaling lead-in

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: Restored *To scale this framework across engineering and content teams,* before *qualitative insights were translated into concrete execution rules:* — rewrite, not deletion of the first clause.
- Decisions: None.

### 12:25 — Remove AVA2 variant route

- Files: `app/index/ava2/page.tsx` (deleted)
- What: Alternate **`/index/ava2`** case study page removed; canonical case remains **`/index/virtual-agent`**.
- Decisions: None.

### 12:20 — Virtual Agent + AVA2: Conclusion body

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: **Conclusion** paragraph updated: ticket deflection goal, API routing, immediate 24/7 service, 86% / four minutes as its own sentence, enterprise AVA foundation.
- Decisions: **`ava2`** conclusion grid copy aligned with main case study.

## 2026-05-13 — Session 15: Virtual Agent strategic narrative pass

### 16:35 — Virtual Agent: Establishing the Voice intro

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Section intro rewritten: **behavioral matrix**, subjective **voice** guidelines, **user research** defines boundaries mapping style to **resolution efficiency**.
- Decisions: **`ava2`** *Defining the NLP logic* intro unchanged.

### 16:30 — Virtual Agent + AVA2: Transparency principle copy

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: **Transparency** body replaced: automated-system identity, capabilities, no simulated typing; **user data** framing for mismatch / abandonment; transparency over emulation; handoff at system boundaries. (Prior degradation-protocol / phrasing-preservation wording removed on this surface.)
- Decisions: None.

### 16:25 — Virtual Agent: Bounded responses copy polish

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: **Bounded responses** — *User Research* → *User research*; split long colon run-on into two sentences; *like* → *such as*; *led to* (avoid *established* overclaim).
- Decisions: None.

### 16:20 — Virtual Agent: Bounded responses opening (research frame)

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: **Bounded responses** first sentence reframed around user research, stress contexts (troubleshooting / error handling), and **informative / direct**; dropped duplicate list (chatty / emoji / empathy) from this principle (still in guardrails).
- Decisions: **`ava2`** column III remains **Integrated resolution** unchanged.

### 16:10 — Virtual Agent + AVA2: hero Team line

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: **Team** → cross-functional core pod (AI engineering, data science, content, research).
- Decisions: None.

### 16:00 — Virtual Agent + AVA2: hero Role line

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: **Role** value → **Lead designer &amp; researcher**.
- Decisions: None.

### 15:55 — Virtual Agent + AVA2: Transparency (degradation protocol wording)

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: *I defined a strict degradation protocol* → *there is a strictly defined degradation protocol*.
- Decisions: None.

### 15:50 — Virtual Agent + AVA2: Principle II body shortened (Lisa draft)

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: **Interpretation and branching** paragraph replaced with two-sentence Lisa copy (non-linear inputs, branching, journeys, topic changes / session flow).
- Decisions: None.

### 15:45 — Virtual Agent + AVA2: Principle II → Interpretation and branching

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: Replaced **Context-aware responses** with **Interpretation and branching**; body grounded in original Squarespace case study only (&ldquo;Users want to be understood,&rdquo; transcript-based intent training, 30+ examples per intent, 50+ intents, AutoCAD LT / happy-path scope, built conversation logic, divergent paths / topic relations, future-build notes on multi-intent inputs, hierarchy, confidence, abandoned/topic change; journeys for product, install, licensing, activation).
- Decisions: No metrics or actions beyond that public write-up.

### 15:40 — Virtual Agent: Principle III title → Bounded responses

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: **Design Principles** column III header **Efficiency over conversation** → **Bounded responses**.
- Decisions: Matches body copy on restricted / deterministic dialogue.

### 15:30 — Virtual Agent: Efficiency over conversation body

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: **Design Principles → III. Efficiency over conversation** body replaced with NLP boundaries, user thresholds, deterministic turns / first-pass routing copy.
- Decisions: None.

### 15:20 — Virtual Agent: Conclusion body (inline)

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: **Conclusion** paragraph no longer uses **`brief.unlock`**; replaced with goals, API integration, 86% / 24/7, enterprise AVA foundation copy.
- Decisions: **`lib/content/briefs.ts`** `virtual-agent.unlock` unchanged for other surfaces (e.g. Catalog/Brief) unless synced later.

### 15:10 — Virtual Agent + AVA2: Context-aware lead sentence (comma and)

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: Opening sentence: *fail at scale; showing that* → *fail at scale, and users rejected…*
- Decisions: None.

### 15:00 — Virtual Agent + AVA2: Context-aware principle copy

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: **Context-aware responses** body updated (semicolon clause + *showing that users rejected…*).
- Decisions: None.

### 14:45 — Virtual Agent + AVA2: Transparency principle copy

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: **Design Principles → Transparency** body merged into one paragraph (trust, capabilities, degradation protocol, handoff with preserved phrasing).
- Decisions: None.

### 14:32 — Newsreader: add 500 + 600 for medium/semibold

- Files: `app/layout.tsx` (edited)
- What: **`Newsreader`** `weight` array now includes **`500`** and **`600`** so **`font-medium` / `font-semibold`** render with real masters (not synthesized from 700).
- Decisions: Slight extra font bytes; aligns with DESIGN.md serif usage.

### 14:30 — Virtual Agent + AVA2: voice + guardrails H3 weight (`semibold`)

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: Persona and guardrails policy **`h3`s** (`font-serif italic text-xl`): **`font-bold` → `font-semibold`** (between **medium** and **bold**).
- Decisions: If you prefer **500** weight instead, swap to **`font-medium`**.

### 14:15 — Virtual Agent + AVA2: bold serif H3 (voice + guardrails)

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: **`font-bold`** added to **`font-serif italic text-xl`** **`h3`s** in **Establishing the Voice** (persona titles) and, on **`virtual-agent` only**, **Establishing global guardrails** policy titles. **`ava2`** guardrails block has no policy **`h3`s** (list layout unchanged).
- Decisions: None.

### 13:45 — Virtual Agent + AVA2: persona example lines back to small sans italic

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: Quoted sample dialogue under each voice persona **`h3`** restored to **`font-sans text-[13px] italic text-gray-500 mt-3`**. Persona description body stays serif 18px.
- Decisions: None.

### 13:30 — Virtual Agent + AVA2: serif body under voice + guardrails H3s

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: **Establishing the Voice** persona descriptions and sample lines on **`virtual-agent` and `ava2`**: **`font-serif text-[18px] leading-[1.6] text-gray-800`** (sample lines keep **`italic`**). **Establishing global guardrails** policy paragraphs on **`virtual-agent`** use the same serif body (was 13px gray sans). (`ava2` guardrails block unchanged — still prior list layout.)
- Decisions: None.

### 13:15 — Virtual Agent: guardrails body matches Establishing the Voice

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Replaced serif bullet list + bold labels with the same stack pattern as voice personas: **`h3` `font-serif italic text-xl mb-2`** per policy, body **`font-sans text-[13px] leading-relaxed text-gray-500`**. Intro paragraph unchanged (matches voice section lead **`font-serif` 18px**).
- Decisions: None.

### 13:00 — Virtual Agent: Conclusion full-width under guardrails + image

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: **Conclusion** block (`h2` + `brief.unlock`) moved out of the 6-column left stack into a full-width stack below the 12-column grid; top row remains **Establishing global guardrails** (left) + device mock (right). Spacer `mt-16` between grid and Conclusion.
- Decisions: None.

### 12:45 — Virtual Agent: Conclusion heading below guardrails

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: **Conclusion** `h2` moved into the left column after the guardrails block (grid unchanged: 6/6, image right). Section no longer leads with Conclusion title. **Establishing global guardrails** promoted to `h2` so heading levels stay in order before **Conclusion** `h2`.
- Decisions: Two `h2`s in one section; same label styling as other editorial headers.

### 12:30 — Virtual Agent: guardrails moved to Conclusion (left of image)

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Removed **Establishing global guardrails** from under the three voice personas. Inserted same block above `brief.unlock` in the **Conclusion** grid: left column stacks guardrails then outcome copy (6/12); tablet/phone image unchanged (6/12). Dropped persona-adjacent `border-t` / extra `p-6` on that block.
- Decisions: None.

### 12:20 — Virtual Agent: Establishing the Voice intro grammar

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Final sentence now uses *mapping them directly…* (participial phrase) instead of a dangling *mapped*.
- Decisions: None.

### 12:15 — Virtual Agent: Establishing the Voice intro

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Replaced intro under **Establishing the Voice** with deterministic behavior matrix / user testing / resolution efficiency copy.
- Decisions: None.

### 12:00 — Virtual Agent + AVA2: Built with / remove chip box chrome

- Files: `app/index/virtual-agent/page.tsx` (edited), `app/index/ava2/page.tsx` (edited)
- What: Removed `border`, `bg-gray-50`, and `p-6` from **Built with** wrapper so label and pills left-align with intro copy; pill styles unchanged.
- Decisions: None.

### 11:45 — Virtual Agent: Talk to AVA intro (prototype + buy-in)

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Replaced single intro paragraph under **Talk to Autodesk Virtual Agent** with two paragraphs: intent routing / Watson/BlueMix MVP and validation + buy-in for branching logic scaled to production.
- Decisions: None.

### 11:15 — AVA2 (`/index/ava2`): IC7 systems narrative copy pass

- Files: `app/index/ava2/page.tsx` (edited)
- What: Hero **Role** / **Team** strings; intro MVP/buy-in paragraph; section titles **Defining the NLP logic**, **Building for production**; NLP intro paragraph; column III **Integrated resolution** + API/deflection body; **Conclusion** enterprise legacy paragraph (replaced `brief.unlock` on this route only); device caption **Enterprise deployment: Omnichannel integration** (`uppercase` class). Grids, imagery paths, and component structure unchanged.
- Decisions: Canonical Virtual Agent page unchanged; narrative variant isolated to AVA2.

### 10:30 — AVA2: duplicate case study route

- Files: `app/index/ava2/page.tsx` (created)
- What: Full copy of Virtual Agent case page at **`/index/ava2`** for alternate iteration; same content/components as `virtual-agent`. Document title prefixed with **AVA2** for tab discrimination (`Lisa Aufox | AVA2 — …`).
- Decisions: Not linked from Catalog/nav until intentionally wired; canonical page remains `/index/virtual-agent`.

### 10:00 — Establishing the Voice: global guardrails + principles copy

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Under the three voice personas, added **Establishing global guardrails** (section-header styling): intro paragraph + three bulleted constraints (Zero-Chatter, Typographic Restraint, Clarity > Brevity). **Transparency** (I): second paragraph on NLP failure, degradation protocol, handoff with user phrasing. **Context-aware** (II): replaced body with dynamic tone model / journey-state copy. Principles grid: **`items-start`** so three columns stay top-aligned when I & II are taller than III.
- Decisions: Hairline `border-t` before guardrails block to separate from persona stack; guardrails mini-title uses `h3` + same classes as major section labels (`font-sans` 11px, uppercase tracking, ethos blue, bottom border). Hero, global shell, and layout wrappers unchanged.

---

## 2026-05-12 — Session 14: Virtual Agent page copy tweak

### 20:15 — Chat column header: Talk to Autodesk Virtual Agent

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Replaced section label **About This Prototype** with **Talk to Autodesk Virtual Agent** above the demo intro copy.
- Decisions: None.

### 20:05 — About This Prototype: opening sentence

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: First sentence now reads “…to show how a conversational agent could clear…” (added *how*; merged line breaks for flow).
- Decisions: None.

---

## 2026-05-10 — Session 13: Virtual Agent chat — list pricing alignment

### 22:25 — Virtual Agent Conclusion: 1/2–1/2 grid

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Conclusion text and image columns both **6/12** on `min-[768px]` (50/50 split).
- Decisions: None.

### 22:18 — Virtual Agent Conclusion: 2/3–1/3 grid + tablet/phone hero asset

- Files: `app/index/virtual-agent/page.tsx` (edited), `public/work/virtual-agent/ava-tablet.png` (deleted); image `ava-tablet-phone.png` already in `public/work/virtual-agent/`
- What: Conclusion text **8/12**, image **4/12**. Replaced single-tablet PNG with tablet+phone mock (`ava-tablet-phone.png`, 1024×614); updated alt and caption.
- Decisions: None.

### 22:12 — Virtual Agent Conclusion: image column 1/4 width

- Files: `app/index/virtual-agent/page.tsx` (edited)
- What: Conclusion grid is **9 + 3** columns on `min-[768px]` (image = 1/4). Centered figure in narrow column; caption centered.
- Decisions: None.

### 22:05 — Virtual Agent page: Conclusion + tablet asset

- Files: `public/work/virtual-agent/ava-tablet.png` (created), `app/index/virtual-agent/page.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Restored a **Conclusion** section after Design Principles: left column uses `brief.unlock`; right column shows production AVA tablet screenshot (`ava-tablet.png`). Matches section header pattern elsewhere; image in `border border-ethos-blue/10` per Azure Ethos.
- Decisions: Asset lives under `/work/virtual-agent/` for `next/image`.

### 21:52 — AVA: handoff copy tweak

- Files: `lib/content/ava-conversations.ts` (edited)
- What: `end-connect` message now reads “Connecting you to an agent in this thread who will help you further.”
- Decisions: None.

### 21:48 — AVA: “Yes, something else” → short re-prompt

- Files: `lib/content/ava-conversations.ts` (edited)
- What: New `more-help` node (“What can I help you with?”) with same three entry chips as intro. `QUICK_REPLY_MAP` routes **Yes, something else** to `more-help` instead of repeating the full AVA intro.
- Decisions: First load and Reset still use `AVA_INTRO`; mid-session “something more” stays lightweight.

### 21:42 — AVA: priced options on “which product” billing prompt + fix savings line

- Files: `lib/content/ava-conversations.ts` (edited)
- What: `sub-change-cycle-result-prompt` now lists Revit → $299/yr and AutoCAD LT → $22/mo under the question. Replaced `$35 × 12` phrasing with “full year at the monthly rate ($420)” where it appeared so italics don’t read like `$3.5`.
- Decisions: None.

### 21:35 — AVA chat: avoid relisting products/pricing when just shown

- Files: `lib/content/ava-conversations.ts` (edited), `components/ava-chat/AvaChat.tsx` (edited)
- What: Added `autoFollowUpAlternate` + `shouldSuppressDetailRepeat()` (last two AVA bubbles: bullets, Revit/AutoCAD lines, or prices). Change-billing flow now follows with “Which product should I switch?” instead of repeating the plan list after “One moment.” Billing “unexpected charge” scan uses a compact result when the charge list was the prior AVA turn.
- Decisions: Same rule can extend to other chained nodes by setting `autoFollowUpAlternate` when a fuller default follow-up would repeat context within two AVA lines.

### 21:20 — AVA demo: replace list-style prices with portfolio demo tier

- Files: `lib/content/ava-conversations.ts` (edited)
- What: Replaced prior demo amounts with illustrative tier pricing closer to a “twenties/thirties per month” scale: Revit **$35/mo**, **$299/yr** (~29% vs $35×12); AutoCAD LT **$229/yr**, **$22/mo** on monthly switch; billing history and refund lines match.
- Decisions: Demo is fictional account math for the portfolio, not live Autodesk quotes.

### 21:05 — AVA: tighten all chat + virtual-agent page copy

- Files: `lib/content/ava-conversations.ts` (edited), `app/index/virtual-agent/page.tsx` (edited)
- What: Shortened AVA messages (subscriptions, downloads, account, pricing, fallbacks, handoffs). Tightened About, Establishing the Voice, voice card blurbs, and Design Principles on the project page.
- Decisions: Demo and page copy stay factual; less setup and hedge language throughout.

### 20:25 — AVA demo pricing copy: drop source caveat

- Files: `lib/content/ava-conversations.ts` (edited)
- What: Removed "US list price" / Autodesk.com attribution from AVA pricing strings; kept the same dollar amounts and savings math.
- Decisions: Demo reads as in-product truth, not a footnoted estimate.

### 20:10 — AVA demo: Autodesk US list pricing in conversation copy

- Files: `lib/content/ava-conversations.ts` (edited)
- What: Replaced invented subscription amounts with Revit ~$380/mo and ~$3,005/yr; AutoCAD LT ~$70/mo and ~$540/yr. Fixed annual-vs-monthly savings math (~34% for Revit vs twelve months at monthly rate).
- Decisions: Demo dollar amounts should match plausible Revit / AutoCAD LT tiers and correct annual-vs-monthly math.

### 23:59 — End-of-day rollup: Virtual Agent / AVA (2026-05-10)

- **Theme:** Virtual Agent case page + embedded AVA chat demo — copy, flows, layout, and production hero asset.
- **Page (`/index/virtual-agent`):** Conclusion section after Design Principles; body = **`brief.unlock`** from `lib/content/briefs.ts` (`id: virtual-agent`) — **not** inline or session-specific copy; recent edits were layout + image only. Grid evolution: **9/3 → 8/4 → 6/6** on `min-[768px]`. Hero image: **`/work/virtual-agent/ava-tablet-phone.png`** (1024×614); **`ava-tablet.png`** removed.
- **Chat:** Pricing tier pass (portfolio demo scale), list alignment on billing prompts, **`autoFollowUpAlternate` / `shouldSuppressDetailRepeat`** to avoid back-to-back product/pricing dumps, **“Yes, something else” → `more-help`** short re-prompt, handoff line tweak (`end-connect`).
- **Touch summary:** `app/index/virtual-agent/page.tsx`, `lib/content/ava-conversations.ts`, `components/ava-chat/AvaChat.tsx`, `public/work/virtual-agent/*`, `docs/SESSION_LOG.md`.
- **Decisions:** Demo dollars are illustrative for the portfolio (21:20); repeat-suppression pattern reusable for other chained nodes (21:35).

---

## 2026-05-09 — Session 12: Inbox Ads page refinement & consistency pass

### 14:39 — Section header consistency (Journey Explorer style)

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: Unified all section headers (Problem & Opportunity, Impact, What I Did, The Work, Principles) to match Journey Explorer's pattern: `h2`, `font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-10`. Previously had two inconsistent styles (some gray labels, some blue with varying borders).
- Decisions: All section headers site-wide should use this single blue header pattern for consistency.

### 14:42 — Problem & Opportunity header promoted to full-width

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: Moved "Problem & Opportunity" header out of the right column to be full-width at top of section, replacing the `border-b` from the hero header above. Reduces visual line count.
- Decisions: Section headers that act as dividers should be full-width, not nested inside grid columns.

### 14:45 — Design Principles header promoted + sticky headline rewrite

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: Same full-width treatment for "Design Principles" header. Sticky headline changed from "Design strategy" to "Three rules that governed every design decision." What I Did sticky headline iterated through several options, landed on "Ad creation for 100 million global businesses, unified across three apps and three design systems."
- Decisions: Sticky headlines should summarize the section's content with specificity — no vague taglines.

### 14:59 — Principle cards: remove box borders, blue numbers

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: Removed bordered card container from design principles. Each principle is now plain stacked content with `space-y-8`. Numbered labels changed from `text-gray-400` to `text-ethos-blue`.
- Decisions: None.

### 15:05 — Principle #2 rewrite

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: Changed wording to "Unlike upsells which rely on catching someone at the right moment and in the right mindset, a permanent entry point never disappears."
- Decisions: None.

### 17:48 — Before/After section: editorial layout

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: Replaced side-by-side grid with an editorial before/after layout inspired by a reference: 2/3 image + 1/3 text column with border-left, italic headline ("The Gap" / "The Solution"), and descriptive text. Vertical blue divider line (120px) between sections. After section uses `flex-row-reverse`.
- Decisions: Before/After visual storytelling pattern: image dominant, text as annotation, vertical divider separating the two states.

### 18:38 — Image asset swap + transparency fix

- Files: `public/work/inbox-ads/before.png` (replaced), `public/work/inbox-ads/after.png` (replaced), `app/index/inbox-ads/page.tsx` (edited)
- What: Replaced before/after images multiple times from `Downloads/Designs 2/Inboxes/`. Fixed transparency rendering issue — Next.js image optimization was compositing transparent PNGs against black. Fix: added `unoptimized` prop to bypass Next.js image pipeline. Also removed `image-rendering: -webkit-optimize-contrast` hack (didn't help).
- Decisions: **Any PNG with transparency MUST use `unoptimized` prop on `next/image`** to prevent black background compositing. This is a site-wide concern for future pages.

### 18:55 — Image resolution: 2400px exports for retina

- Files: `public/work/inbox-ads/before.png` (replaced), `public/work/inbox-ads/after.png` (replaced), `app/index/inbox-ads/page.tsx` (edited)
- What: Initial 7185px exports were too large — browser downsampling 10x+ caused softness. Re-exported at ~2400px wide (~3x display size). Updated `width`/`height` props to match. Slight remaining softness accepted as inherent to rasterized UI screenshots.
- Decisions: **Export images at 2-3x rendered display size** for best retina sharpness. Avoid massive source files (7000px+) as extreme downsampling introduces blur.

### 19:04 — Spacing consistency pass

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: Standardized `mb-10` on all section headers. Before/After labels were using `mb-6` with a different border style (full-opacity blue, wrapped in a `div`). Changed to match the exact same `h2` pattern as other section headers: `font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-10`.
- Decisions: **Every section-level header must be identical** — same element (`h2`), same classes, same spacing. No exceptions for "smaller" sections.

### Mistakes to avoid in future sessions

1. **Transparent PNGs + next/image**: Always add `unoptimized` prop. Next.js optimization composites against black.
2. **Image resolution**: Export at 2-3x display size, not maximum resolution. 7000px+ images cause blur from extreme downsampling.
3. **Don't change layout when asked to swap images**: When user says "replace images," only change `src` — don't touch the layout.
4. **Spacing consistency**: When adding new section elements, copy the exact class string from existing sections rather than approximating.
5. **Don't execute before confirming**: When user phrases something as a question or ends with "???", they want feedback, not implementation.

### Current state of Inbox Ads page

- Hero: 8/4 grid, italic serif title with `leading-[1.05]`, metadata (Role, Surfaces) bottom-right
- Problem & Opportunity: full-width header → 4/7 grid (sticky subtitle left, content right)
- Impact: full-width header → 4-col metrics grid
- What I Did: nested header in right column → 4/7 grid (sticky headline left, narrative right)
- Before/After: 2/3 image + 1/3 text, vertical divider, reversed layout for After
- Design Principles: full-width header → 4/7 grid (sticky headline left, 3 principles right)

### 23:56 — Impact metric swap + 4th metric

- Files: `lib/content/briefs.ts` (edited), `app/index/inbox-ads/page.tsx` (edited)
- What: Removed "18x CTR vs. menu placement" from Impact (it's a design validation, not impact). Added "1st / Native ad creation in Messenger" as the fourth metric. Restored 4-column grid.
- Decisions: Impact section should only show outcomes, not design experiment results. The 18x stat stays in Design Principles where it's evidence for a decision.

### 00:02 — Gap/Solution copy tweaks

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: "The Gap" text changed to "spend most of their time to create messaging ads." "The Solution" text updated to end with "linking businesses directly to messaging ad creation with introductory NUX experiences."
- Decisions: None.

### 00:10 — Scroll animations: metrics count-up + divider draw

- Files: `components/portfolio/animate-metrics.tsx` (created), `components/portfolio/animate-divider.tsx` (created), `app/index/inbox-ads/page.tsx` (edited)
- What: Added two scroll-triggered animations. (1) Metrics count from 0 to final value with eased-out curve, staggered 120ms per metric. Small numbers (≤10) animate faster (400ms vs 1200ms). Non-numeric values ("1st") just appear after delay. (2) Vertical blue divider between Before/After grows from top via scaleY transform — container stays fixed height so After section doesn't shift.
- Decisions: Animations trigger once on IntersectionObserver, never replay. Container must be fixed-size to prevent layout shift during animation. Site-wide motion system (fade-up on all sections) deferred — only these two targeted animations for now.

### 00:21 — Design Principles: 3-column Roman numeral layout

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: Replaced the sticky-headline + stacked-list layout with a 3-column grid inspired by a reference. Each principle now has: large italic blue Roman numeral (I. II. III.), bold uppercase label, and body text. Removed the sticky "Three rules..." intro text (deemed redundant — the principles speak for themselves). Kept the consistent blue uppercase section header.
- Decisions: Principles work better as a visual grid than a stacked list. No intro text needed when the section header + content is self-explanatory.

### 00:29 — Metadata stacked + spacing consistency pass

- Files: `app/index/inbox-ads/page.tsx` (edited)
- What: Stacked Role and Surfaces vertically (was side-by-side `grid-cols-2`, now `space-y-4`). Changed all section header `mb-10` to `mb-6` to match Journey Explorer page spacing. Design Principles header kept at `mb-10` for breathing room before the 3-column grid.
- Decisions: Section header spacing should be `mb-6` site-wide for consistency with Journey Explorer. Design Principles is an exception at `mb-10` due to the grid layout.

### Mistakes to avoid in future sessions

1. **Transparent PNGs + next/image**: Always add `unoptimized` prop. Next.js optimization composites against black.
2. **Image resolution**: Export at 2-3x display size, not maximum resolution. 7000px+ images cause blur from extreme downsampling.
3. **Don't change layout when asked to swap images**: When user says "replace images," only change `src` — don't touch the layout.
4. **Spacing consistency**: When adding new section elements, copy the exact class string from existing sections rather than approximating.
5. **Don't execute before confirming**: When user phrases something as a question or ends with "???", they want feedback, not implementation.

### Final state of Inbox Ads page

- Hero: 8/4 grid, italic serif title with `leading-[1.05]`, metadata (Role, Surfaces) stacked vertically bottom-right
- Problem & Opportunity: full-width header → 4/7 grid (sticky subtitle left, content right)
- Impact: full-width header → 4-col metrics grid with scroll-triggered count-up animation
- What I Did: nested header in right column → 4/7 grid (sticky headline left, narrative right)
- Before/After: 2/3 image + 1/3 text, animated vertical divider (scaleY draw), reversed layout for After
- Design Principles: full-width header → 3-column grid with Roman numerals (I. II. III.), bold labels, body text

### Where to pick up

- Before/After images slightly soft at current resolution (accepted)
- Could add click-to-zoom on Before/After images
- Other project pages (GenAI Conversations, Journey Explorer) may need the same header `mb-6` consistency
- Cover image in Problem section still uses optimized next/image — may need `unoptimized` if it has transparency
- Site-wide fade-up animation system deferred (could apply to all pages later)
- Metrics count-up + divider draw could be reused on other project pages

---

## 2026-04-25/26 — Session 10: Homepage layout overhaul

### 13:35 — Personal intro headline: match subpage font

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Updated headline "I'm a product designer…" to match subpage title style: `clamp(2.5rem,6vw,5rem)`, italic, font-medium. Added 50px top padding. Tried bold (rejected), settled on medium weight.
- Decisions: Headline uses same typeface treatment as subpage h1s but with medium weight.

### 14:03 — Responsive width constraints for intro

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Replaced `ch`-based max-widths with percentage-based: headline at `min-[975px]:max-w-[75%]`, body text at `min-[975px]:max-w-[56%]`. Scales proportionally with content area.
- Decisions: Percentage-based widths at 975px+ breakpoint; both fill naturally on mobile.

### 17:06 — Homepage: flat project list, condensed previews

- Files: `app/page.tsx` (edited), `components/portfolio/brief-preview.tsx` (edited)
- What: Removed Volume I/II chapter bands. Flat list of all briefs. Reduced vertical padding, smaller image placeholders, tighter spacing.
- Decisions: Chapter bands dropped — company name stays in metadata line. Three projects don't need anthology-level organization.

### 18:09 — Homepage: staggered masonry gallery layout

- Files: `app/page.tsx` (rewritten)
- What: Multiple iterations on staggered card layout. Tried CSS grid, absolute positioning, flexbox columns — all failed to match the reference image. Final working version uses a **12-column CSS grid** with explicit column/row placement from Google Stitch reference code: card 1 (cols 2–6, portrait 4:5), card 2 (cols 8–12, square, mt-macro offset), card 3 (cols 3–9, landscape 16:9, -mt pull-up). ProjectCard component simplified to image + blue italic title + small-caps metadata with blue hairline border-bottom.
- Decisions: Homepage is now a visual gallery index — no bet, metrics, or subtitle on homepage. All editorial depth lives on subpages at `/catalog/[slug]`. Grid layout from Stitch reference is the canonical approach. Card 1 image shortened 50px via padding-bottom calc trick. Card 3 expanded to col-end-10 for extra width.

### 11:36 — Background decoration: triangles tried and rejected

- Files: `app/page.tsx` (edited then reverted), `app/globals.css` (edited then reverted)
- What: Explored replacing the Azure Halo circle with geometric triangle shapes on homepage. Built two right triangles in SVG, iterated on positioning. Ultimately removed — decorative shapes added noise without serving IC6+ portfolio goals. Original Azure Halo circle restored globally.
- Decisions: **No homepage-specific background shapes.** Azure Halo circle is sufficient. Restraint > decoration.

### 12:05 — Headline: "product designer" in blue

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Wrapped "product designer" in `text-ethos-blue` span in the headline.
- Decisions: Blue highlights the role identity in the intro.

### 12:11 — "Meta" styling: blue link to LinkedIn

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Tried multiple treatments for "Meta" in body text: blue unlinked (looked like broken link), bold dark (too heavy), medium weight (invisible), semibold same color (ugly), plain text (no emphasis). Final: blue `text-ethos-blue` linked to LinkedIn profile, opens in new tab.
- Decisions: "Meta" links to LinkedIn — hiring managers expect to verify role/title. Blue link is honest since it goes somewhere useful.

### 12:07 — Feedback completeness rule

- Files: `AGENTS.md` (edited)
- What: Added "Feedback completeness" rule: when user gives multi-point feedback, every point must be addressed before revision is done.
- Decisions: Mandatory rule, persists across sessions.

### Where to pick up

- Build out Journey Explorer subpage (`/catalog/journey-explorer`)
- Add real hero images to homepage cards (replace gray placeholders)
- Fill in placeholder metrics on briefs
- Contact page form design
- Doodles: re-host assets under `public/doodles/`

---

## 2026-04-11 — Session 8: Portfolio IA brainstorm (staff / AI-forward)

### 18:34 — `/ce:brainstorm`: pages to build under frozen routes

- **Files:** `docs/brainstorms/2026-04-11-portfolio-pages-ia-staff-ai-forward-requirements.md` (created), `docs/SESSION_LOG.md` (edited)
- **What:** Captured requirements for **new surfaces** (mostly sections on `/`, `/archive`, `/lab`, `/ethos`, `/doodles`, `/contact`) mapped from Session 7 reference sites + `docs/DECISIONS.md` architecture—**no new `/work/[slug]`** unless explicitly decided. Index: cred ladder, editorial briefs, optional chapters, client strip. Lab: interactive AI proof + hub/zones. Ethos: AI × design thesis. Cross-cutting: metrics-first, optional HMW, micro-craft.
- **Decisions:** “New pages” framed as **modules on existing six routes**; AI-forward = Ethos + Lab + Tier 1 briefs. *(Contact v1 decided in follow-up entry below.)*

### 18:40 — Contact v1: Light Ethos (brainstorm follow-up)

- **Files:** `docs/brainstorms/2026-04-11-portfolio-pages-ia-staff-ai-forward-requirements.md` (edited), `docs/DECISIONS.md` (edited), `docs/SESSION_LOG.md` (edited)
- **What:** User chose **option 1 — Light Ethos** for `/contact` v1. Updated requirements doc (R11, key decisions, cleared “resolve before planning”), added **Contact page (v1)** to `docs/DECISIONS.md`. Vault/screen10 treatment deferred.
- **Decisions:** `/contact` v1 = cream editorial / minimal form energy; vault exception not in v1 scope.

### 19:05 — `/ce:plan`: staff portfolio surfaces (retry)

- **Files:** `docs/plans/2026-04-11-001-feat-staff-portfolio-surfaces-plan.md` (created), `docs/brainstorms/2026-04-11-portfolio-pages-ia-staff-ai-forward-requirements.md` (edited), `docs/SESSION_LOG.md` (edited)
- **What:** Wrote **implementation plan** from IA requirements + `docs/DECISIONS.md`: eight units (content model, shared sections, Index, Archive, Lab anchors, Ethos, Doodles, Contact), phased delivery, planning-time calls on **R3** (data visibility flags) and **R8** (single `/lab` + anchors). No new routes. Contact submit mechanism deferred to implementation choice.
- **Decisions:** Lab default = **anchored sections** on one page; AVA bot = **follow-up plan** after spec.

### 19:43 — IA/plan revision: Lab Vault, JE on Index, no client strip, resume footer, doodles source (docs only)

- **Files:** `docs/brainstorms/2026-04-11-portfolio-pages-ia-staff-ai-forward-requirements.md` (edited), `docs/plans/2026-04-11-001-feat-staff-portfolio-surfaces-plan.md` (edited), `docs/DECISIONS.md` (edited), `docs/SESSION_LOG.md` (edited)
- **What:** **R2** expanded with plain-language “seniority frame” + credibility checklist (level/scope, domains, outcome hooks; resume carries detail). **R4** chapters confirmed. **R5** client strip **rejected**. **R7/R8:** Lab = **screen10 Vault** aesthetic + **AVA** + **1–3 mini experiments**; **Journey Explorer** moves **into JE case on Index**, not Lab. **R10** doodles tied to **lisaaufox.com/doodles**. **R15** footer **Resume** (URL TBD). Plan: new units (0, 9), rewrote Lab/Index/Doodles, mini-experiment **candidates** listed; **no code executed**.
- **Decisions:** Vault = **Lab only**; Contact stays **Light Ethos**; credibility row **out**; footer gains Resume when href provided.

### 19:47 — Resume placeholder + read.cv direction, doodles re-host, Lab minis TBD (docs only)

- **Files:** `docs/brainstorms/2026-04-11-portfolio-pages-ia-staff-ai-forward-requirements.md` (edited), `docs/plans/2026-04-11-001-feat-staff-portfolio-surfaces-plan.md` (edited), `docs/DECISIONS.md` (edited), `docs/SESSION_LOG.md` (edited)
- **What:** **Resume:** placeholder file in **`public/`** (e.g. `/resume.pdf`) when Lisa adds asset; **future** web resume **read.cv–inspired** (cleanness, not a clone). **Doodles:** **re-host** only under **`public/doodles/`** from lisaaufox.com/doodles. **Lab minis:** removed preset candidate list; **brainstorm later** — plan keeps **stub experiment zones**. Footer Resume = **same-site** link to static file. **No code executed** (attachment not in repo yet).
- **Decisions:** Hotlinking doodles **out** for long-term; Lab experiment **ideas open**.

### 19:49 — Resume PDF in `public/` + footer link

- **Files:** `public/resume.pdf` (created from Drive), `components/footer-nav.tsx` (edited), `docs/DECISIONS.md` (edited), `docs/SESSION_LOG.md` (edited)
- **What:** Copied **`Resumes & Offers/AufoxResume2025.pdf`** (allowed Drive folder) → **`public/resume.pdf`**. Footer **Resume** → **`/resume.pdf`** between LinkedIn and Doodles. DECISIONS documents source path for future refreshes.
- **Decisions:** None beyond executing agreed R15 wiring.

### 20:10 — Plan review revision: 9 issues addressed (docs only)

- **Files:** `docs/brainstorms/2026-04-11-portfolio-pages-ia-staff-ai-forward-requirements.md` (rewritten), `docs/plans/2026-04-11-001-feat-staff-portfolio-surfaces-plan.md` (rewritten), `docs/DECISIONS.md` (edited), `.cursor/rules/azure-ethos.mdc` (edited), `docs/SESSION_LOG.md` (edited)
- **What:** Applied all 9 review findings:
  1. **BizAI** stays on Selected Work (in-experiment, not publicly launched); Index lineup = Flow 75 + Inbox + JE only (publicly available Tier 1).
  2. **R16** added: ≥2 IC6+ gap themes (mentorship, org influence, systems governance, vision, ambiguity judgment) must surface in brief copy.
  3. **R2** reframed: personal intro ("Hi, I'm Lisa…") replaces cold cred ladder.
  4. **R17** added: JE on mobile = static screenshot + "Tap to interact" CTA; broader mobile session deferred.
  5. **R9** now includes Ethos → Contact closing CTA.
  6. **R6** chip taxonomy locked: AI, Monetization, Research, Incubator, Messaging.
  7. **Unit 3** adds lazy loading for below-fold briefs/media.
  8. **Lab Vault = full dark** including header/footer chrome via `app/lab/layout.tsx`; Azure Halo hidden; `.cursor/rules/azure-ethos.mdc` updated with Lab exception rule.
  9. **Unit 9** marked **[x] Done**.
  Also: **"Archive" renamed to "Selected Work"** throughout all docs and plan units; nav label change noted for `components/main-nav.tsx`.
- **Decisions:** BizAI = Selected Work until launched; Index opens with personal intro; Lab = full-dark chrome; "Archive" → "Selected Work"; chip taxonomy frozen; Ethos has CTA; JE has mobile fallback; IC6+ gap coverage required in copy.

---

## 2026-04-10 — Session 7: Portfolio reference sites & storytelling cohesion

### 20:43 — Example sites saved for later (no code changes)

- **Files:** `docs/SESSION_LOG.md` (edited)
- **What:** Captured **reference portfolios** Lisa is considering for direction, plus how they combine with **Azure Ethos** and the **saved Ethos reference PNGs** (see Session 2 table in this log: screen1–10 — case study, ethos, lab, archive, contact, etc.). User will pick up implementation later.

### Reference portfolios — URLs & what to draw from each

| Site | URL | Draw from it |
|------|-----|----------------|
| **Jennifer Mahanay** | https://www.jennifermahanay.com/ | Chapters per major brand/program; repeated URL/name rhythm as production signal; long-form outcomes + partnership language (director-level credibility). |
| **Claudio Guglieri** | https://guglieri.com/ | Minimal IA (small nav set); micro-craft as identity (e.g. local time); optional participatory layer if desired. |
| **Anton Repponen** | https://repponen.com/ | Portfolio as **designed document** (numbered sections, fig-style captions); layers: client work + obsessions/side threads; client wall for scale (favorite reference). |
| **Jyoti Mann** | https://jyotimann.com/ | Hero **cred ladder** (current role + past ships); **metric-forward** case spine (experiments, % lift); **HMW** blocks; talks/posts as parallel track. |

### Aggregated direction (one line)

**Repponen-style authored depth + Jyoti’s metric-forward case spine + Mahanay-style program chapters where relevant + Guglieri calm nav/micro-craft + Lab as proof of shipped interaction** — all expressed **inside Azure Ethos** (Newsreader + Inter, ethos blue/cream, hairlines, macro spacing, no sidebars).

### Top-level architecture — frozen (do not change without explicit decision)

- **Routes:** `/` (Index), `/archive`, `/lab`, `/ethos`, `/doodles`, `/contact` — as already planned in `docs/DECISIONS.md`.
- **Clarification (2026-04-10):** Do **not** introduce new top-level sections (e.g. `/work/[slug]`) unless Lisa explicitly plans it. Prior assistant suggestion of `/work/...` was **wrong** for this project; deep case content belongs **inside existing routes** (per Lisa’s plan).
- **Cohesion model:** One design system; **different page flavors** per route map to **reference screens** (case density on Index sections, lab technical on `/lab`, table Archive on `/archive`, etc.) — content/story patterns, not a second visual brand.

### Example artifacts (condensed — for build later)

1. **Index row module:** Inter caps “Volume” or status; `01` / `02` / `03`; italic title; one-line bet; CTA “Read brief →” or “Open in Lab →”; optional small diagram.
2. **Case section header:** Inter uppercase label (`THE CONSTRAINT`) + ethos blue hairline + Newsreader body (18px / 1.6).
3. **Lab framing:** Display italic lab metaphor title + chips (`UI / LAB / 2026`) + card linking to Journey Explorer (or future demos); demo stays scoped (e.g. `.je-root`).

### Open questions (deferred — when resuming)

- Where full case depth lives within **Index** vs other existing routes (user’s canonical plan).
- Contact: light Ethos vs dark “vault” (screen10) exception for v1.
- Lab: hub vs single scroll with demo.
- Voice: first vs third person; `Fig. 01` vs numeric-only section labels.

### Where to pick up

- Resume storytelling / page templates **without** changing nav or route list.
- Cross-ref: `docs/DESIGN.md`, `docs/DECISIONS.md` (Portfolio content strategy, editorial brief format, reference screen inventory in Session 2).

---

## 2026-04-10 — Session 6: Journey Explorer packaging & handoff

### 17:13 — Portable module + documentation (finalized demo)

- **Files:** `components/journey-explorer/index.ts` (edited), `components/journey-explorer/README.md` (created), `docs/SESSION_LOG.md` (edited)
- **What:** Treated Journey Explorer as a **movable portfolio package**: barrel file now exposes default + named `JourneyExplorer`, plus public filter utilities (`DEFAULT_FILTERS`, `getSelectedMonths`, FY/quarter constants, `FilterState` / `DateView` types). Added folder README with embed snippet, font paths under `/public/fonts/`, file map, and note that `app/lab/page.tsx` is only the current host.
- **Decisions:** Demo stays in `components/journey-explorer/`; no route change yet — new pages can `import JourneyExplorer from "@/components/journey-explorer"`. Font files are documented as required assets (WOFF2 Artifakt set).

### 17:19 — Legend layout parity + comments total aligned with rail

- **Files:** `components/journey-explorer/DetailsPanels.tsx` (edited), `components/journey-explorer/JourneyExplorer.tsx` (edited), `components/journey-explorer/index.ts` (edited), `components/journey-explorer/README.md` (edited), `docs/SESSION_LOG.md` (edited)
- **What:** **(1)** Trends right rail now matches Volume/Sentiment: `h4` “Trends Details”, series rows, then **border-top total at bottom** (was total-first). Row layout uses 8px swatches and two-line label/value like the other panels. **(2)** Introduced `computeVolumeBackedCommentTotal(filters)` as the single volume total for Volume footer, Sentiment footer, and comments toolbar on Volume/Sentiment tabs. **SentimentDetails** row volumes now allocate each phase’s scaled total by selected-sentiment shares (same `sf` as volume chart), so footer total matches comments. **(3)** On **Trends** tab, comments toolbar shows the same aggregate string as the rail (`Total: …` or `Avg: …%`) via `trendsLegendTotal` from `JourneyExplorer`.
- **Decisions:** Trends “total” is still the sum of per-series chart aggregates (not volume-backed); comments match that display on Trends only. Volume/Sentiment comments total is volume-backed and identical to the rail footer.

### Finalized demo snapshot (context for future work)

- Interactive Volume / Sentiment / Trends (Recharts), filter sidebar (FY/quarter, phases, sentiments), search keywords → full-screen comments with highlights, sentiment scaling on volume, fixed sentiment stack order, trends hover/lock + tooltip behavior, 48 sample comments through FY20–FY21 range.
- **QA:** `tsc --noEmit` clean after barrel changes.

### Where to pick up

- Add a dedicated route (e.g. `/work/journey-explorer`) or keep `/lab`; optionally slim Lab to an index of experiments.
- Ensure Artifakt WOFF2 files exist under `public/fonts/` for production.

---

## 2026-04-10 — Session 5: Journey Explorer filters & data architecture

### What was built

Made all sidebar filters fully functional. Replaced the old static/monthly date system with a fiscal-year/quarter model matching the original XD designs. Overhauled the trend data generator for realistic analytics data.

### Files modified

| File | Changes |
|------|---------|
| `FilterSidebar.tsx` | Fixed checkbox bug (onClick never fired). Replaced `periods: string[]` with `dateView: "fiscal_year" \| "quarter"` + `dateRanges: string[]`. Added "Date view" section (radio: fiscal year / quarter) and dynamic "Date range" section. Exported `getSelectedMonths()` utility + quarter/FY mapping constants. Default: quarter view, all 6 quarters selected. |
| `data.ts` | Expanded date range from 5 months to 18 months (Feb 2019–Jul 2020). Replaced weekly trend generation with monthly, then replaced monthly with label-based generation (one point per quarter or FY). Rewrote `generateTrendSeries` with log-normal distribution for volume (always positive, natural spikes) and additive noise for sentiment (clamped ±100). Added per-series time-drift. Removed `volatility` from baselines. Added 4 FY21-range comments. Removed dead helpers (`getMonday`, `formatWeekLabel`, `dateToSeed`, `getMonthLabelsForPeriods`, `formatMonthLabel`). |
| `TrendsChart.tsx` | Derives period labels from `filters.dateView` + `filters.dateRanges` (chronological order). Passes labels to `generateTrendSeries`. Hides grouped tooltip when a single series is highlighted. |
| `VolumeChart.tsx` | Uses `getSelectedMonths(filters)` → `dateMultiplier()` for scaling bars by date selection. |
| `SentimentChart.tsx` | Wired sentiment checkboxes — unchecked sentiments hidden, remaining categories re-normalize to 100%. |
| `DetailsPanels.tsx` | `VolumeDetails` and `SentimentDetails` reflect active filters. `CommentsPanel` filters by `isoDate` period membership via `getSelectedMonths`. Empty state when no comments match. |
| `JourneyExplorer.tsx` | Passes `filters` to `TrendsChart`. |

### Architecture decisions

- **FilterState shape**: `{ dateView, dateRanges, phases, sentiments }`. Charts never see FY/quarter labels — `getSelectedMonths()` converts to month strings for volume/sentiment/comments. Trends chart uses labels directly for x-axis.
- **X-axis granularity matches date view**: Quarter view → one data point per quarter (e.g. "FY20 Q2"). Fiscal year view → one data point per FY (e.g. "FY20").
- **Trend data generator**: Log-normal (`Math.exp(normal * 0.45)`) for volume counts — always positive, naturally right-skewed, ~12% event spike chance. Additive ±12pt swings for sentiment with ±15pt event spikes, clamped to [-100, 100]. Per-series deterministic drift via seeded RNG.
- **Date multiplier**: `selectedMonths.length / TOTAL_MONTHS` with seeded jitter. Scales volume bars proportionally to date selection.
- **Sentiment normalization**: When sentiment categories are unchecked, remaining bars re-normalize to 100% (percentages, not absolute counts).
- **View switching**: FY→Quarter expands selected FYs to all their quarters. Quarter→FY selects any FY with at least one quarter checked. Minor state loss on round-trip (acceptable for demo).

### QA issues caught & fixed

1. Checkbox `onChange` prop was never invoked (no click handler on `<label>`)
2. Weekly trend granularity (72 points for 18 months) would make x-axis unreadable → switched to label-based
3. Initial jitter formula `1 + normal * 0.4` could produce negative volume → switched to log-normal
4. Sentiment values could exceed ±100% with large swing + spike → added clamping
5. Sentiment drift was invisible when multiplicative on small base → switched to additive
6. All FY21-range comments were missing → added 4 comments with late-2019/early-2020 dates
7. Grouped tooltip card stayed visible when highlighting a single trend line → conditionally hidden

### Known state

- All filters functional: date view/range, journey phase, sentiment
- Volume chart scales with date selection, filters by phase
- Sentiment chart filters by phase and sentiment category
- Trends chart: x-axis labels match date view, data generated per label, phase filter applies to "By Phase" grouping
- Comments filter by phase, sentiment, and date period
- Detail panels reflect filtered data
- Highlight interaction (3s hover-to-lock) working, tooltip hidden during highlight

### Where to pick up

- Polish pass: verify all filter combinations produce sensible data
- Consider whether single-FY selection should show monthly breakdown (user mentioned "Feb '20" as possible FY-view label)
- Session log updated, ready for next QA round

---

## 2026-03-22 — Session 4: Journey Explorer interactive dashboard build

### What was built

Transformed the static Adobe XD designs for the Journey Explorer dashboard into a fully interactive React component using Recharts. The dashboard lives at `/lab` and is a self-contained component suite under `components/journey-explorer/`.

### Files created/modified

| File | Purpose |
|------|---------|
| `components/journey-explorer/JourneyExplorer.tsx` | Main container — header, search bar, tab navigation, breadcrumbs, layout orchestration |
| `components/journey-explorer/VolumeChart.tsx` | Stacked bar chart with Phase/Subphase radio toggle, drill-down on click, back navigation |
| `components/journey-explorer/SentimentChart.tsx` | Stacked bar chart with Phase/Subphase views |
| `components/journey-explorer/TrendsChart.tsx` | Multi-line time series with Volume/Sentiment metrics, By Product/Domain/Phase groupings, negative zone shading |
| `components/journey-explorer/FilterSidebar.tsx` | Left-rail filter panel with collapsible sections, checkboxes, radio buttons |
| `components/journey-explorer/DetailsPanels.tsx` | Right-rail: Volume/Sentiment details, Taxonomy, Trends legend (dynamic) |
| `components/journey-explorer/colors.ts` | All color palettes (phases, sentiment, products, domains, data sources, UI tokens) |
| `components/journey-explorer/data.ts` | Dummy data using real Autodesk product names, journey phases, source domains, comments |
| `app/lab/page.tsx` | Renders `<JourneyExplorer />` |
| `public/fonts/Artifakt Element *.woff2` (4 files) | Autodesk brand font — Light, Regular, Medium, Bold |

### Design extraction method

Adobe XD files were treated as ZIP archives. Python scripts extracted JSON-based vector descriptions (`.agc` files) from `je-comps.zip` to get exact colors, positions, typography, and layout properties. This eliminated the need for Figma import (which doesn't support `.xd` natively).

### What's working

- **Volume tab:** Stacked bar chart, Phase/Subphase radio toggle, click-to-drill-down with breadcrumbs and back navigation
- **Sentiment tab:** Stacked bar chart with Phase/Subphase views, sentiment color coding
- **Trends tab:** Multi-line time series with dropdown selectors for metric (Volume/Sentiment) and grouping (By Product/Domain/Phase). Sentiment view has gray shaded negative zone below 0%, darker grid lines in negative area, manually computed Y-axis ticks at clean 10% intervals
- **Filter sidebar:** Collapsible sections with checkboxes and radios (visual only — filters don't affect chart data)
- **Comments panel:** Below all charts, shows comment cards with title, body text, source dot, "Show more"/"Show less" for metadata (Sentiment, Customer Journey as Phase/Subphase, Product, Version). Comment dots use sentiment colors on Sentiment tab
- **Right-hand rail:** Volume/Sentiment details + Taxonomy on Volume/Sentiment tabs; dynamic legend on Trends tab
- **Header:** Light gray background, "Journey Explorer" title, "Visualizing customer comments" subtitle, "Query case details" action link
- **Search bar:** Aligned with chart area, generic "Search" placeholder
- **Custom font:** Artifakt Element loaded via @font-face, scoped to `.je-root`
- **No focus outlines:** All browser default focus rings suppressed within the dashboard
- **Cursor states:** Pointer cursor on all interactive elements

### Known issues / incomplete

1. **Trends chart line layering:** Data lines (colored squiggles) may render behind axis tick marks in some cases. Attempted two fixes — JSX reordering and DOM manipulation via `useEffect`. JSX reordering didn't visually change anything; DOM manipulation broke the chart on grouping changes (React reconciliation conflict). **Both approaches reverted.** The layering is a Recharts SVG rendering order limitation. Possible future approaches: increase line `strokeWidth`, use a custom SVG layer component, or accept the subtle overlap.
2. **Filters are cosmetic only:** Checkboxes and radios in the filter sidebar toggle visually but don't filter the chart data. This is acceptable for a portfolio demo.
3. **YoY Comparison removed:** Was too complex for the demo build and unnecessary to convey the design concept. Removed from both Volume and Sentiment tabs.
4. **Taxonomy "See more" link removed:** Was non-functional and pointless for demo.

### Interaction patterns implemented

- **Volume:** Click bar → drill down to subphases for that phase. Breadcrumb + back button appear above tabs. Phase/Subphase radio toggle switches X-axis view. Hover shows tooltip with Cases/Surveys/Forums breakdown.
- **Sentiment:** Phase/Subphase radio toggle. Hover shows tooltip with Positive/Neutral/Negative/Mixed/Error breakdown.
- **Trends:** Dropdown selectors for metric and grouping. Hover shows tooltip with all series values. Negative sentiment zone has gray background, darker dashed grid lines, and 0% reference line.
- **Comments:** "Show more" expands metadata grid; "Show less" collapses it. Comment text always visible.
- **Filter sidebar:** Sections collapse/expand. Checkboxes and radios toggle.

### Decisions made during build

- **Recharts over D3.js:** Lighter weight, composable React components, sufficient for the demo's needs
- **No YoY Comparison:** Removed — too complex, unnecessary for portfolio demo
- **Comments below chart (not in sidebar):** Matches original XD layout, applies to all tabs
- **Legends in right rail only:** No inline legends below charts
- **Stacked bars (not grouped):** Cases/Surveys/Forums stack, matching original XD
- **Artifakt Element font scoped to `.je-root`:** Prevents conflicts with portfolio's Newsreader/Inter
- **Comment metadata as table:** HTML `<table>` with `borderSpacing` for uniform column gaps, `whiteSpace: "nowrap"` to prevent label wrapping
- **Negative zone rendering:** `ReferenceArea` with `y2={-9999}` and `ifOverflow="hidden"`, separate `ReferenceLine` components for negative tick grid lines at `#d0d0d0`

### Where to pick up next

1. **Trends line layering** — decide whether to accept as-is or try a different approach (e.g., thicker lines, custom SVG component)
2. **General QA pass** — user was working through tabs systematically; Volume and Sentiment are mostly QA'd, Trends was in progress
3. **Polish pass** — compare all views side-by-side with XD artboards for any remaining discrepancies
4. **Integration** — the dashboard currently lives on `/lab` as a standalone demo; eventually needs proper framing as a portfolio piece with context (the "designer as product leader" narrative)
5. **Other Lab/Index/Archive pages** — no work started on these yet

---

## 2026-03-22 — Session 3: Portfolio content assessment

### Positioning

Target level: **IC6+ (Lead/Principal) at FAANG-tier companies.** Portfolio must demonstrate strategic impact, systems thinking, influence without authority, and measurable outcomes — not just "I designed screens."

### Existing portfolio reviewed

Read all case studies from lisaaufox.com. Full assessment:

#### Tier 1 — Strong IC6+ material (reframe narrative)

| Project | Company | IC6+ strengths | Reframe needed |
|---------|---------|----------------|----------------|
| **Meta Inbox Ad Entry Points** | Meta | $300M projected revenue, cross-platform strategy (7 teams, 4 products, 6+ designers), sophisticated systems solution (variable desktop nav switching Ads/Automations by message volume) | Shift from "what I designed" → "I identified a strategic disconnect and built the org-spanning vision." Automations diplomacy story is underplayed. |
| **Journey Explorer** | Autodesk | 0-to-1 story: conceived, won hackathon, pitched leadership, led 12-person team. Democratized qualitative data for 10K+ employees, eliminated license costs. | Frame as "designer as product leader" and "data democratization" — not a dashboard project. |

#### Tier 2 — Usable with significant reframing

| Project | Company | IC6+ strengths | Reframe needed |
|---------|---------|----------------|----------------|
| **Mobile Navigation** | Autodesk | Cross-property navigation framework, 60 stakeholders via RACI, testing overturned initial rejection (double-column menu), platform-level insight (menus with different purposes need different UI) | Elevate from "I designed menus" → "I created Autodesk's cross-property navigation architecture." |
| **Virtual Agent** | Autodesk | Conversational AI research in 2016 (prescient), innovative prototyping methodology (Watson + Slack), led to AVA. | Position as "founding research for Autodesk's conversational AI program." Weakness: research-only, no shipped product. |

#### Tier 3 — Probably drop

| Project | Company | Notes |
|---------|---------|-------|
| **Services Marketplace** | Autodesk | Page returns 404. Description sounds like IC4-5 visual redesign. |

### Gaps for IC6+ portfolio

Even with reframing, missing narratives include:
- Mentorship / team amplification
- Organizational influence (changed how teams work)
- Design system governance
- Vision artifacts (roadmaps, multi-quarter strategy)
- Judgment under ambiguity (hard calls with incomplete info)

The Meta piece partially covers some. Calling them out explicitly would strengthen everything.

### Google Drive access (established)

Mounted at `~/Library/CloudStorage/GoogleDrive-lisaaufox@gmail.com/My Drive/`. **Hard boundary:** only `Meta/`, `Autodesk/`, `Art & Design Work/`, and `Resumes & Offers/` are accessible. All other folders are strictly off-limits, permanently. Documented in DECISIONS.md.

### PDF case studies read

Three additional PDFs from Google Drive were read and assessed:

| PDF | Location | Pages | Assessment |
|-----|----------|-------|------------|
| **Flow 75 Chat Builder Redesign** (75Preso.pdf) | `Meta/Flow 75   L1 Redesign/` | 32 | **Tier 1 — strongest IC6+ piece.** Organizational strategy: linked 3 initiatives (UPB, GenAI, redesign) to secure resources for a foundational quality fix on a $3B+ surface. Shifted user role from creator to reviewer. UPB 62→85, 100% task completion, 95% GenAI adoption, surpassed revenue goal by 200%. STO/Project Owner/Design Lead across 6 teams, CFO-level stakeholders. |
| **BizAI Integration in CTX** | `Meta/BizAI Integration in CTX.pdf` | 91 | **Tier 1.** Internal build-approval deck (not case study format). $1.4B revenue target. Cross-platform AI agent integration into Ads Manager for CTM + CTWA. Default on/off strategy, L1/L2 card architecture, automation order of operations. Active work (March 2026 experiments) — confidentiality consideration. |
| **Reels Conversation Starters** (ReelsConvoStarters.pdf) | `Meta/Icebreakers on Reels/` | 28 | **Tier 1-2.** $15.6M yearly revenue (3x goal). Progressive disclosure using watch-time as intent signal. A/B testing, constraint navigation (safety zones). |
| **New CTM Reels Ad Format** | `Meta/Icebreakers on Reels/` | 29 | **Unreadable** — image-only PDF, no extractable text. |

### Final portfolio lineup (ranked)

| Rank | Project | Company | Tier | Revenue Impact | IC6+ Signal |
|------|---------|---------|------|---------------|-------------|
| 1 | Flow 75 Chat Builder Redesign | Meta | 1 | $3B+ surface, 200% over goal | Org strategy, paradigm shift, GenAI |
| 2 | BizAI Integration in CTX | Meta | 1 | $1.4B target | AI systems architecture, cross-platform |
| 3 | Meta Inbox Ad Entry Points | Meta | 1 | $300M projected | Cross-org strategy, multi-app rollout |
| 4 | Reels Conversation Starters | Meta | 1-2 | $15.6M actual | A/B testing, progressive disclosure |
| 5 | Journey Explorer | Autodesk | 1 | 10K+ users | 0-to-1, data democratization |
| 6 | Mobile Navigation | Autodesk | 2 | — | Cross-property framework |
| 7 | Virtual Agent | Autodesk | 2 | — | Founding AI research (2016) |

### Content architecture decision

- **Index/Home page:** Full case studies — deep, detailed portfolio pieces (likely top 3-4 projects)
- **Archive page:** Lightweight versions of remaining relevant projects — shorter format, less depth, broader coverage
- This avoids the "too heavy" feeling of full case studies for every project while still showing breadth

### IC6+ gaps still to address

- Mentorship / team amplification narratives
- Organizational influence (changed how teams work)
- Design system governance
- Vision artifacts (roadmaps, multi-quarter strategy)
- Judgment under ambiguity stories

### Content architecture — confirmed split

**Index (full case studies):**
1. Flow 75 Chat Builder Redesign
2. Meta Inbox Ad Entry Points
3. Journey Explorer (Autodesk)

**Archive (lightweight):**
- Reels Conversation Starters
- BizAI Integration in CTX (confidential — in experiment)
- Mobile Navigation
- Virtual Agent

**Pending addition:** First Message Experience (FMUX) — chat component redesign for Messenger ads. Currently in experiment, assets in Figma. User will export a PDF of the design review deck. Destination TBD (Index or Archive) after assessment.

**Confidentiality approach (TBD):** BizAI and FMUX are both in-experiment. Options discussed: process-not-pixels, password-protected, coming soon, or hybrid. Decision deferred until FMUX PDF is assessed.

### Interactive AVA chatbot idea

Turn the Autodesk Virtual Agent case study into a **live interactive chat experience** on the portfolio site. Instead of a static case study about 2016 chatbot research, visitors interact with a working chatbot that embodies the original research findings — personality recommendations, conversation structure, transparency principles, tone of voice testing results.

**Why this works:**
- Transforms weakest IC6+ piece (research-only) into the most differentiated portfolio element
- Experiential, not narrative — recruiters *talk to it* instead of reading about it
- Bridges 2016 prescience to current AI moment
- Could live on the **Lab** page (currently empty shell)

**Architecture decisions (confirmed):**
- **Location:** Lab page
- **Model:** Hybrid — LLM brain with the voice/personality and decision tree structure from the original 2016 research
- **Scope:** Simulates the Autodesk support context as the product was originally intended. Correct voice, correct tone, ability to carry out specific tasks (e.g., activation codes, product questions, installation help)
- **No meta-references:** Does NOT reference the research or portfolio. It functions as the real product would have — visitors experience it as an Autodesk support bot, not a portfolio piece. The case study context (that this is research brought to life) comes from the surrounding page framing, not the bot itself.
- Source: original research findings, recommendations, personality/tone testing, and conversation scripts are in the Virtual Agent case study on lisaaufox.com (fully read and captured)

**Idea credit:** Suggested by Google Gemini, endorsed by Lisa.

### Journey Explorer interactive rebuild — assets confirmed

All visual assets located in `Art & Design Work/Portfolio 2020/Journey Explorer/`. SVGs are machine-readable blueprints — exact colors, proportions, data paths.

**Key assets:**
| File | What it contains |
|------|-----------------|
| `JE-ThreeTabs.png` | The three core chart views at readable size: Volume (grouped/stacked bar), Sentiment (100% stacked bar), Trends (multi-line time series) |
| `JE-ALL SCREENS – 1.png` | Master screen map: every dashboard state organized by section (Filter States, Volume Tab, Sentiment Tab, Trends Volume/Sentiment/Net Sentiment, Comments, Search) |
| `JE-CES-Sentiment.svg` | Full vector of CES Score vs Sentiment chart. Colors: `#b7d78c` (positive), `#fddaa4` (neutral), `#eb7a7a` (negative), `#a3bcdc` (mixed) |
| `JE-Data Set Diagram-White.svg` | Data architecture: 3 sources (All Data/orange, Survey/green, Case/blue, Forums/teal) → shared fields → Taxonomy Tags + Sentiment Tags |
| `JE-Interactions.svg` | Full interaction pattern documentation (143K chars, very detailed) |
| `JE-Timeline.svg` | Project timeline (327K chars, very detailed) |
| `JE-JourneyMap-Shadow.png` | Customer journey map: 5 phases (Discover, Subscribe, Access, Manage, Extend), 13 subphases (Explore, Evaluate, Try, Select, Pay, Pre-Install, Install, Update, Control, Monitor, Renew, Expand, Advocate), pain points, Get Help/Learn/Use bars |
| `JE-Volume-Computer@2x.png` | Dashboard in device frame |
| Various screenshots in `Screenshots/` | ~75 screenshots showing different states, iterations, and versions over time |

**Interactive rebuild plan:**
- 3 tab views (Volume, Sentiment, Trends) with real chart interactions (click to drill, hover tooltips, filter updates)
- Journey phases/subphases from the journey map as x-axis categories
- Exact color palette from SVGs
- Data source diagram as interactive explainer
- CES vs Sentiment as additional visualization
- Dummy data structured to match real categories
- Tech: React + D3.js or Recharts

### Competitive research — complete

Two full rounds, 15+ sites reviewed. Direction crystallized:

**Warm:**
- Anti-portfolio for Archive (Lovin/Paco/Rasmus style — clean index, no process)
- Anti-case-study movement (story over process, metrics first, editorial voice, brevity)
- Rauno.me for Lab page (craft demos, interactive experiments)

**Cold:**
- Gallery/exhibition approach (van Schneider — beautiful but hard to adapt for UX work)
- AI-native timeline (Meng Xie — too tool-forward)
- Metrics dashboard (Lea Wenban — too corporate/pitch-deck)

**Interesting but TBD:**
- Writing-first leadership (Julie Zhuo — potential influence on Ethos page)

**Key finding:** The editorial brief format Lisa wants doesn't exist in the wild. We're inventing it. The structure: bet → numbers → constraint → move → work → what it unlocked.

### Open items for next session

1. User provides FMUX design review PDF — read and assess
2. Decide confidentiality approach for in-experiment projects
3. Begin building Index page with editorial brief template using Meta Inbox Ad Entry Points
4. Build Archive page as anti-portfolio index
5. Journey Explorer interactive dashboard rebuild (D3/Recharts + dummy data)
6. Explore AVA interactive chatbot — architecture decisions for Lab page

---

## 2026-03-22 — Session 2: Page shells planning

### Positioning

Lisa is an **AI expert and forward-thinking product designer** with depth in interface design and systems thinking. The portfolio must showcase this positioning across every page.

### Visual references saved

9 reference screens from a prior Azure Ethos exploration. These define the target look and feel — editorial scale, systems language, data-dense layouts. Saved to `.cursor/projects/Users-lisaaufox-Builds-lisa-portfolio/assets/`:

| File | Shows |
|------|-------|
| `screen1-76374a1a-...png` | **Case study** — "Cognitive Latency Framework." Large Newsreader italic title, metadata block (context, system architecture, key metric, role), body text, embedded UI screenshots, code-style system diagram. |
| `screen2-8abd5350-...png` | **Ethos / manifesto** — "The architecture of machine cognition." Full-width justified editorial text, philosophical tone, large italic headline. Minimal — text-only page. |
| `screen3-4441ee06-...png` | **Lab / technical** — "Streaming & Hydration." Breadcrumb path, large italic title, sequence flow diagram (Initialize → Token Generation → Active Buffer → DOM Hydration), raw stream data code block, throughput metrics, concept cards. |
| `screen5-07450251-...png` | **Case study / methodology** — "The Mapping of Cognitive Thresholds." Large italic title with keyword in blue, confidence metrics, data visualizations, pull quote in italic, "Routing Protocols" 4-up card grid, large image cards. |
| `screen6-643f14cb-...png` | **Process flow** — "State III — Intervention." Phase label, large italic title, vertical timeline with labeled nodes (Pattern Recognition → Contextual Ambiguity → Algorithmic Bias Check → Creative Integrity), system state footer. |
| `screen7-09874247-...png` | **Index / overview** — "Logic Architecture." Breadcrumb, large italic headline, hairline rule, numbered sections (I. II. III.) with status tags, descriptions, CTAs, topology diagram. |
| `screen8-31da0595-...png` | **Index variant** — "System Index." Volume label, large italic title, hairline blue, numbered entries (01, 02, 03) with state labels, italic titles, descriptions, CTAs, geometric diagrams, "The Curator's Manifesto" section. |
| `screen9-4cd4a3bd-...png` | **Archive** — "Technical Archive." Data-table layout with columns: Year, Project (large italic), Domain, System Architecture, Impact. Filter chips (ALL WORK / GENERATIVE UI / SYSTEMS ARCH / PATENTS). |
| `screen10-39f6fca0-...png` | **Contact** — "The Vault Entrance." Dark-mode theatrical treatment. Fingerprint scanner UI, access protocol input, dual action buttons, system status footer. |

### Hard design rules established

- **NO SIDEBARS.** Several reference screens include left-margin sidebars with icon nav and vertical text. These are permanently rejected. All pages use the full-width `SITE_CONTENT_SHELL` layout. No exceptions.

### Plan: minimal route shells

Create blank `page.tsx` for each route with only a Newsreader italic page title. No content, no sections, no scaffolding. Each page will get its own dedicated design session later.

Routes:
- `/` (Index) — update existing placeholder
- `/archive` — new
- `/lab` — new
- `/ethos` — new
- `/doodles` — new
- `/contact` — new

Footer Contact link changes from `mailto:hello@lisaaufox.com` to `Link href="/contact"`.

### 23:15 — Footer links stack vertically below 575px

- Files: `app/layout.tsx` (edited)
- What: Footer links (LinkedIn, Doodles, Contact) now stack vertically left-aligned below `min-[575px]:`, then go horizontal row at 575px+. Prevents a single link from wrapping awkwardly on tiny screens.
- Decisions: Footer links use the same 575px breakpoint as the nav condensing.

### 23:10 — Footer single-row layout at all widths

- Files: `app/layout.tsx` (edited)
- What: Footer now uses `flex items-start justify-between` at all widths — copyright left, links right, always on one row. Removed the column-to-row breakpoint since the two-line copyright frees enough space for the links.
- Decisions: Footer is a single-row layout at all viewport widths. No responsive stacking needed.

### 23:00 — Aligned padding + footer breakpoints, split copyright text

- Files: `lib/site-layout.ts` (edited), `app/layout.tsx` (edited)
- What: Changed `SITE_CONTENT_SHELL` padding breakpoint from `md:` (768px) to `min-[900px]:` to align with header. Footer layout transition also moved to `min-[900px]:`. "All rights reserved." now renders on its own line below "© 2026 Lisa Aufox." via `<br />`.
- Decisions: All layout breakpoints now use custom values (900px, 575px) instead of Tailwind defaults. `SITE_CONTENT_SHELL` padding transitions at 900px.

### 22:50 — Adjusted responsive breakpoints per browser test

- Files: `app/layout.tsx` (edited), `components/main-nav.tsx` (edited)
- What: Shifted breakpoints based on browser testing — single-row at `min-[900px]:` (was `lg:` 1024px), nav condensing at `min-[700px]:` (was 720px). Both transitions now happen later to keep the fuller format visible longer.
- Decisions: Final breakpoints are 900px (single-row) and 700px (condensed nav). All custom, content-driven.

### 22:40 — Three-state responsive header

- Files: `components/main-nav.tsx` (edited), `app/layout.tsx` (unchanged — already had two-row stacking from prior edit)
- What: Implemented three responsive states for the header. Above `lg:` (1024px): single row, title + full nav together, `gap-x-10`. 720px to `lg:`: two rows, full format nav with numbers and spaces `[ 01 Index ]`, `gap-x-8`. Below 720px: two rows, condensed nav `[Index]`, `gap-x-4`. Uses custom `min-[720px]:` breakpoint for the mid transition.
- Decisions: Custom 720px breakpoint for nav condensing (content-driven, not device-driven). Three responsive states are the final header model.

### 22:25 — Responsive header (two-row stack + compact nav)

- Files: `app/layout.tsx` (edited), `components/main-nav.tsx` (edited)
- What: Header stacks to two rows at all widths — title row above, nav row below. Below `lg:` (1024px), nav items drop numbers and bracket spaces: `[Index]` instead of `[ 01 Index ]`, with `gap-x-4`. At `lg:+`, full format restored with `gap-x-10`. Removed `flex-wrap` from nav — items never wrap to a second line.
- Decisions: Two-row header is the permanent layout (title + nav). Numbers and bracket spaces are `lg:` only. Nav data model split into separate `num` and `label` fields.

### 22:10 — Created all route shells + updated footer

- Files: `app/archive/page.tsx` (created), `app/lab/page.tsx` (created), `app/ethos/page.tsx` (created), `app/doodles/page.tsx` (created), `app/contact/page.tsx` (created), `app/page.tsx` (edited), `app/layout.tsx` (edited), `docs/DECISIONS.md` (edited)
- What: Created blank page shells for all 6 routes with Newsreader italic titles at display scale (`clamp(3rem,6vw,5rem)`, light weight, italic). Updated Index page from placeholder text to title-only. Changed footer Contact from `mailto:` to internal `Link` to `/contact`. All routes smoke-tested — 200 across the board. Updated DECISIONS.md to reflect completed state.
- Decisions: Page title pattern is `h1`, `font-serif`, `text-[clamp(3rem,6vw,5rem)]`, `leading-[1.1]`, `font-light`, `italic`, `text-gray-900`. Consistent across all pages.

### 21:55 — Added mandatory change-logging rule

- Files: `.cursor/rules/session-log.mdc` (edited), `AGENTS.md` (edited)
- What: Added a rule requiring every code change to be immediately logged in `docs/SESSION_LOG.md` with timestamp, files touched, summary, and decisions. Enforced from both the always-on Cursor rule and AGENTS.md.
- Decisions: Change logging is mandatory and non-negotiable. Format: `### HH:MM — <description>` with Files/What/Decisions fields.

### 01:30 — H1 scale + weight finalized, font loading trimmed

- Files: `app/page.tsx` (edited), `app/archive/page.tsx` (edited), `app/lab/page.tsx` (edited), `app/ethos/page.tsx` (edited), `app/doodles/page.tsx` (edited), `app/contact/page.tsx` (edited), `app/layout.tsx` (edited)
- What: H1 scale updated to match DESIGN.md spec: `clamp(56px, 8vw, 120px)`. Weight is responsive — font-normal (400) below 975px, font-light (300) at 975px+. Tested 500 (fell back to 400 since not loaded), 700 (too heavy). Removed unused Newsreader weights 500/600 — now loads 300/400/700 only.
- Decisions: Display titles follow DESIGN.md spec exactly. Weight switches at 975px breakpoint. Only load font weights that are actually used.

### 01:15 — Envelope hover: filled flap + V fold

- Files: `app/layout.tsx` (edited)
- What: Open envelope hover state now fills the flap triangle and inner V fold with ethos-blue (#1313ec). Body remains outline-only. Creates a more noticeable hover change — blue diamond shape at the top of the envelope instead of a subtle stroke-only difference.
- Decisions: Open envelope uses filled triangles (flap + V fold) for visibility. Closed envelope stays stroke-only. The contrast between filled-open and outlined-closed makes the interaction readable at small sizes.

### 01:00 — Favicon finalized + polish batch

- Files: `app/icon.svg` (created), `app/favicon.ico` (deleted), `app/layout.tsx` (edited), `app/page.tsx` (edited), `app/archive/page.tsx` (edited), `app/lab/page.tsx` (edited), `app/ethos/page.tsx` (edited), `app/doodles/page.tsx` (edited), `app/contact/page.tsx` (edited), `components/footer-nav.tsx` (created), `next.config.ts` (edited)
- What: Favicon: blue triangle on cream background, optically centered (points 16,5 / 5,25 / 27,25). Deleted old Vercel favicon. Disabled Next.js dev indicator. Page title weight settled at font-normal (400) after testing 300/500/700. Newsreader now loads weights 300-700. Per-page metadata titles ("Lisa Aufox | Page"). Footer links get blue active state via new FooterNav component. Fixed header overlap bug (responsive pt).
- Decisions: Favicon is blue triangle (#1313ec) on cream (#fdfbf7) — one mark, no dark/light variants. Inverted colors rejected. Triangle is optically centered, not mathematically centered. Page title weight is 400 (regular). Newsreader loads 300/400/500/600/700 for flexibility.

### 00:30 — Bug fix + polish batch (header overlap, metadata, active states, title weight)

- Files: `app/layout.tsx` (edited), `app/page.tsx` (edited), `app/archive/page.tsx` (edited), `app/lab/page.tsx` (edited), `app/ethos/page.tsx` (edited), `app/doodles/page.tsx` (edited), `app/contact/page.tsx` (edited), `components/footer-nav.tsx` (created)
- What: (1) Fixed header overlap bug — `main` padding is now `pt-[7rem] min-[975px]:pt-[5.5rem]` to clear taller two-row header on mobile. (2) Each page exports its own metadata: "Lisa Aufox | Archive", "Lisa Aufox | Lab", etc. (3) Created `FooterNav` client component with `usePathname()` — Doodles and Contact links turn `text-ethos-blue` when active. (4) Page title `h1` weight changed from `font-light` (300) to `font-medium` (500) across all pages.
- Decisions: Per-page `<title>` format is "Lisa Aufox | Page". Footer active state uses `text-ethos-blue` (no underline, matching color only). Page title weight is 500. Contact page existence is an open question — may revert to mailto.

### 00:15 — Final header/footer responsive state

- Files: `app/layout.tsx` (edited), `components/main-nav.tsx` (edited), `lib/site-layout.ts` (edited)
- What: Finalized all responsive header/footer work. Envelope icon contact CTA in header (closed→open on hover, crossfade transition). Three responsive states at 975px/575px. Envelope vertically aligned with title (-2.5px below 975px, -1px at 975px+). SVGs share same body/fold geometry, differ only by flap. Footer has "© 2026 Lisa Aufox." left, links right. Contact appears in both header (icon) and footer (text) — intentional, serves different purposes.
- Decisions: Final breakpoints: 975px (single-row header, padding transition) and 575px (condensed nav, footer link stacking). Envelope alignment: -2.5px mobile/medium, -1px desktop. Contact in both header and footer is intentional. "All rights reserved" permanently dropped.

### 23:55 — Bumped single-row breakpoint to 1024px for envelope icon

- Files: `app/layout.tsx` (edited), `components/main-nav.tsx` (edited), `lib/site-layout.ts` (edited)
- What: Envelope icon added ~50px to the single-row header, breaking the layout at 900px. Bumped all `min-[900px]:` references to `min-[1024px]:` across header, nav, and SITE_CONTENT_SHELL padding. Three states now: 1024px+ (single row), 575px–1024px (two rows, full nav), below 575px (two rows, condensed nav).
- Decisions: Single-row breakpoint is now 1024px (was 900px). Driven by content width after envelope icon addition.

### 23:45 — Added envelope icon contact CTA to header

- Files: `app/layout.tsx` (edited)
- What: Added a thin-line envelope SVG as a persistent contact link, pinned to the far right of the header. Uses `flex-wrap` with `order` and `basis-full` to position: on mobile, icon sits top-right next to title with nav on its own row below; on desktop, icon sits after the nav at the far right. Hover state crossfades from closed envelope to open envelope (opacity transition, 200ms). SVGs use `currentColor` so the global ethos-blue hover rule applies automatically. Also dropped "All rights reserved" from footer in a prior step.
- Decisions: Contact is now a persistent header CTA (option D). Envelope closed→open hover is the interaction pattern. Icon is 18x18px, 1px stroke, no fill.

### 23:35 — Dropped "All rights reserved" from footer

- Files: `app/layout.tsx` (edited)
- What: Removed "All rights reserved." line from footer copyright. Now just "© 2026 Lisa Aufox." — single line, cleaner.
- Decisions: "All rights reserved" is legally redundant and adds visual noise. Permanently dropped.

### 23:30 — Responsive header/footer verified in browser

- Files: none (verification only)
- What: Browser-tested all responsive states across viewport widths. Confirmed clean down to 350px. Breakpoints finalized: 900px (single-row header), 575px (condensed nav + footer link stacking). All iPhone 15+ viewports (393px+) render correctly.
- Decisions: 350px is the practical minimum supported width. No further responsive work needed on header/footer.

## 2026-04-12 — Session 9: Confidentiality policy + naming brainstorm

### 00:15 — Remove in_experiment flag; update confidentiality posture

- Files: `docs/brainstorms/2026-04-11-portfolio-pages-ia-staff-ai-forward-requirements.md` (edited), `docs/plans/2026-04-11-001-feat-staff-portfolio-surfaces-plan.md` (edited), `docs/DECISIONS.md` (edited)
- What: Removed all `in_experiment` / `redacted` visibility flags and status indicators from content model and plan. Confidential/unannounced projects are now simply **omitted** from the public site — no flags, badges, or "coming soon" language, as even acknowledging their existence is a confidentiality concern. Content model simplified to `visibility: "public" | "omit"`. Also changed all "Selected Work" references to "TBD label" pending naming decision.
- Decisions: **Confidential projects = omit entirely.** No public-facing experiment flags. This is a hard rule.

### 00:30 — Nav labels finalized: Brief, Catalog, Lab, Ethos

- Files: `components/main-nav.tsx` (edited), `app/page.tsx` (edited), `app/archive/page.tsx` (edited), `docs/DECISIONS.md` (edited), `docs/brainstorms/2026-04-11-portfolio-pages-ia-staff-ai-forward-requirements.md` (edited), `docs/plans/2026-04-11-001-feat-staff-portfolio-surfaces-plan.md` (edited)
- What: Finalized all four nav labels: `[ 01 Brief ]` `[ 02 Catalog ]` `[ 03 Lab ]` `[ 04 Ethos ]`. "Brief" replaces "Index" (matches editorial brief format on homepage). "Catalog" replaces "Archive" (curated, forward-facing). Updated nav component, page titles/metadata, and all planning docs.
- Decisions: Nav label set is a deliberate design choice — every word carries meaning. "Brief" = editorial brief format. "Catalog" = curated collection. Route path `/archive` stays (URL doesn't need to match display label).

### 01:00 — Full plan implementation (Units 0–8)

- Files created:
  - `lib/content/types.ts` — TypeScript types for briefs, catalog, chapters, doodles
  - `lib/content/briefs.ts` — 3 editorial briefs (Flow 75, Inbox Ads, Journey Explorer) with placeholder metrics
  - `lib/content/catalog.ts` — 5 catalog rows + filter helpers
  - `lib/content/chapters.ts` — 2 chapters (Meta, Autodesk)
  - `components/portfolio/personal-intro.tsx` — "Hi, I'm Lisa" personal intro section
  - `components/portfolio/editorial-brief.tsx` — Six-part editorial brief component (bet → metrics → constraint → move → work → unlock)
  - `components/portfolio/chapter-band.tsx` — Volume I / Volume II interstitial labels
  - `components/portfolio/metrics-row.tsx` — Big-number metrics display
  - `components/portfolio/catalog-filter.tsx` — Client component with domain filter chips
  - `components/portfolio/journey-explorer-embed.tsx` — Client component with dynamic import + mobile fallback
  - `components/portfolio/index.ts` — Barrel export
  - `app/lab/layout.tsx` — Vault theme wrapper (triggers CSS :has() for full-dark experience)
- Files edited:
  - `app/page.tsx` — Brief page: personal intro → chapters → editorial briefs with JE embed
  - `app/archive/page.tsx` — Catalog page with filter chips
  - `app/lab/page.tsx` — Lab page: removed JE, added AVA + 2 experiment stubs in dark theme
  - `app/ethos/page.tsx` — Manifesto + AI thesis + CTA to Contact
  - `app/doodles/page.tsx` — Placeholder grid (images not yet re-hosted)
  - `app/contact/page.tsx` — Email, LinkedIn, location in Light Ethos
  - `app/globals.css` — Added Vault theme CSS (:has()-based dark override for header/footer/body)
- What: Implemented the full plan across all six routes. Content model with typed briefs and catalog rows. Editorial brief components with six-part structure. Brief (Index) page has personal intro, chapter bands, and three editorial briefs with JE dynamically embedded. Catalog has filter chips (AI, Monetization, Research, Incubator, Messaging). Lab uses CSS :has(.vault-theme) to flip the entire page including header/footer to a dark Vault aesthetic. Ethos has manifesto + AI thesis + CTA bridging to Contact. Doodles has placeholder grid. Contact has clean editorial links.
- Decisions:
  - Vault theming via CSS `:has(.vault-theme)` — Lab layout wraps children in a div with this class, and CSS overrides body/header/footer colors globally. No route restructuring needed.
  - JE dynamic import with `ssr: false` for code splitting; mobile fallback shows descriptive text instead of broken interactive.
  - Content model uses `visibility: "public" | "omit"` — omitted rows simply never render.
  - Brief content is placeholder copy — metrics marked with "—" where real numbers are needed.

### 01:30 — Project pages + route restructure

- Files created:
  - `components/portfolio/brief-preview.tsx` — condensed preview component (hero, bet, metrics, right-aligned CTA)
  - `app/catalog/page.tsx` — Catalog index (moved from /archive to /catalog)
  - `app/catalog/flow-75/page.tsx` — Full editorial brief for Flow 75
  - `app/catalog/inbox-ads/page.tsx` — Full editorial brief for Inbox Ads
  - `app/catalog/journey-explorer/page.tsx` — Full editorial brief + interactive JE embed
- Files edited:
  - `app/page.tsx` — Switched from full EditorialBrief to condensed BriefPreview components with links
  - `components/main-nav.tsx` — Changed href from /archive to /catalog
  - `components/portfolio/catalog-filter.tsx` — Added cross-links (title + arrow) for projects with pages
  - `components/portfolio/index.ts` — Added BriefPreview export
  - `lib/content/types.ts` — Added optional slug field to CatalogRow
  - `lib/content/catalog.ts` — Added slugs for Tier 1 projects
  - `docs/DECISIONS.md` — Updated route structure, JE placement, added project pages decision
- Files deleted:
  - `app/archive/page.tsx` — Replaced by app/catalog/page.tsx
- What: Added dedicated project pages under /catalog/[slug] for each Tier 1 project. Brief page now shows condensed previews (hero, bet as description, metrics, CTA) linking to full case studies. JE embed moved from Brief to its project page. Catalog route changed from /archive to /catalog with cross-links to project pages. JE CTA reads "Explore the interactive prototype →" to signal the interactive demo.
- Decisions:
  - R1 superseded: project pages now exist under /catalog/[slug]. This is intentional — condensed Brief for scanability, dedicated pages for depth.
  - Route /archive → /catalog (URL matches display label).
  - "The bet" elevated to Brief preview alongside hero, metrics, and CTA — creates a bet→proof pattern for 60-second scanning.

### 02:00 — Fix Meta/where spacing in personal intro

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Added explicit `{" "}` after the Meta span so React does not collapse the newline into zero space (was rendering "Metawhere").
- Decisions: None

### 02:15 — Autodesk copy aligned to resume (AufoxResume2025)

- Files: `components/portfolio/personal-intro.tsx` (edited), `lib/content/briefs.ts` (edited), `lib/content/catalog.ts` (edited), `docs/DECISIONS.md` (edited)
- What: Replaced inaccurate “analytics platform / customer journeys” framing. Personal intro now reflects Autodesk 2015–2021 across design strategy, UX research, and service design (41-country multilingual nav, AVA, CX Analytics journey map). Journey Explorer brief reframed around partnership with CX Analytics, first data-driven journey map, correlatable personas, and interactive explorer; metrics no longer imply the whole portfolio was “analytics platform” design. Unlock summarizes other resume bullets (data hub 10K+, nav, AVA, Marketplace 95%). Catalog rows for Journey Explorer, multilingual mobile nav, and AVA updated to match resume wording and date range.
- Decisions: Journey Explorer page stays the Tier 1 deep dive; other Autodesk outcomes live in unlock + Catalog rows until separate case pages exist.

### 02:30 — Personal intro: simpler Autodesk line (no dates)

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Replaced detailed Autodesk bullets with a single line about supporting sales and customer service for customers in 41 countries; removed date range; closing line uses &ldquo;judgement&rdquo; per Lisa&rsquo;s copy.
- Decisions: None

### 02:45 — Personal intro: Autodesk line (no double &ldquo;supporting&rdquo;)

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Rewrote Autodesk sentence for approachable, smart tone: designed alongside sales and CS, 41 countries, human handoffs / messy workflows / questions you only get in the room with the team.
- Decisions: None

### 02:50 — Revert personal intro (Autodesk) to prior copy

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: User requested revert; restored the simpler Autodesk paragraph (supporting sales and CS teams supporting customers in 41 countries + judgement closing line).
- Decisions: None

### 02:55 — Personal intro: final Autodesk wording

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: "designed tools for sales and customer service teams serving customers across 41 countries" — no double "supporting."
- Decisions: None

### 03:00 — Personal intro: comma after &ldquo;teams&rdquo;

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Removed comma after &ldquo;service teams&rdquo; so it reads &ldquo;teams at global scale.&rdquo;
- Decisions: None

### 09:52 — Catalog domains: Architecture chip; mobile nav + AVA tags

- Files: `lib/content/types.ts` (edited), `lib/content/catalog.ts` (edited), `components/portfolio/catalog-filter.tsx` (edited), `docs/DECISIONS.md` (edited), `docs/SESSION_LOG.md` (edited)
- What: Added **Architecture** to the `Domain` union and Catalog filter chips. **Multilingual mobile navigation** row is tagged **Architecture** only. **Virtual Agent (AVA)** is tagged **AI** only (dropped Incubator from that row).
- Decisions: **Architecture** is a first-class catalog filter; Lisa’s mobile nav work maps to it; AVA = **AI**.

### 09:56 — Catalog: table layout (Year | Project | Focus)

- Files: `components/portfolio/catalog-filter.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Replaced card-style catalog rows with a **three-column table layout**: Year | Project title | Focus (domain). Column headers visible at `min-[700px]`; stacks vertically on mobile. Linked projects (those with `slug`) show title in **ethos-blue** with an arrow that nudges on hover. Unlinked projects stay gray. Removed per-row summaries — the table is scannable without them.
- Decisions: Catalog is now a data table, not editorial cards. Summary text removed from rows (still available in the data model if needed later).

### 10:28 — Lab vault: WCAG AA contrast fixes (pass 1)

- Files: `app/globals.css` (edited), `app/lab/page.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Audited all text/background pairs on the Lab vault theme (`#0b0b12` bg) against WCAG AA. Three failures fixed: (1) ethos-blue #1313ec to #7878ff on vault (2.18 to 5.54:1) for Lab section headers and active nav. (2) Placeholder cream/30 to cream/50 (2.56 to 5.19:1). (3) Footer copyright cream/35 to cream/50 (3.08 to 5.19:1). Also bumped all chrome text from cream/50-60 to cream/70 (9.37:1). All pairs now pass WCAG AA normal text.
- Decisions: Vault uses #7878ff as accessible blue accent; ethos-blue stays #1313ec on cream pages. Vault-only override.

### 15:00 — About: panel photo caption

- Files: `app/ethos/page.tsx` (edited)
- What: Wrapped panel image in `<figure>` with `<figcaption>`: "Machine Learning panel, MLUX" in small italic Newsreader (`text-[13px]`, `text-gray-600`) per Azure Ethos.
- Decisions: None

### 14:45 — About bio: Bay Area clause + book title spacing

- Files: `app/ethos/page.tsx` (edited)
- What: After "Human Factors," added ", brought me to the Bay Area," in the first bio paragraph. Fixed JSX whitespace so a space always appears between the italic book title and "had."
- Decisions: None

### 14:30 — About page: final bio copy + layout

- Files: `app/ethos/page.tsx` (edited)
- What: Rewrote bio from scratch. Three paragraphs: SF origin + the book that shaped her career → "connection" as the through line in her work (the gaps between two sides of a product) → how she operates (clarity, reframing, systems thinking, data, shipping). No sketchnotes, no "41 countries," no education-first structure. Voice matched to Lisa's actual writing style (declarative, no em dashes, no filler). Also removed grayscale-to-color hover on panel photo (static grayscale only), changed grid to `2fr/3fr` responsive layout.
- Decisions: Bio voice calibrated to Lisa's writing sample. Lesson learned: ask for voice sample and biographical details first, don't iterate on generic copy.

### 13:10 — About page: panel photo + bio + restructure

- Files: `app/ethos/page.tsx` (edited), `public/about-panel.png` (created)
- What: Rewrote the Ethos page as "About." Added panel photo (grayscale by default, color+scale on hover per Azure Ethos rules, max-w-[640px], left-aligned). Added three-paragraph bio pulling from lisaaufox.com facts (WashU psych+design, Bentley MS HFID, sketchnoting) updated for IC6+ framing. Renamed section heading "Design Philosophy" → "Point of View". CTA copy adjusted. Page h1 changed from "Ethos" to "About".
- Decisions: Photo treatment: grayscale default, hover-to-color per design system. Bio anchored in personal facts from old site, reframed for senior positioning.

### 12:45 — Nav: remove Brief, renumber, rename Ethos → About

- Files: `components/main-nav.tsx` (edited), `app/ethos/page.tsx` (edited), `docs/DECISIONS.md` (edited)
- What: Removed "01 Brief" link (redundant with clicking the site name). Renumbered to `[ 01 Catalog ] [ 02 Lab ] [ 03 About ]`. Renamed "Ethos" → "About" (less pretentious; page is evolving into hybrid about + POV). Route `/ethos` unchanged.
- Decisions: "About" is the nav label. Route stays `/ethos`. Panel photo + bio will be added to the About page in a follow-up session.

### 12:30 — Lab vault: white accent (pass 2)

- Files: `app/globals.css` (edited), `app/lab/page.tsx` (edited)
- What: Replaced all `#7878ff` vault accent with cream/white (`#fdfbf7`) for a cleaner dark-mode aesthetic. Fixes: (1) "Lisa Aufox" name override — new rule swaps `text-ethos-blue` to white. (2) Active nav link and underline now white instead of purple-blue. (3) `:any-link:hover` vault override prevents `#1313ec` from appearing on dark bg. (4) `.site-title-link` vault override. (5) Lab section headers `#7878ff` → `#fdfbf7`. All text on vault now uses only cream/white tones — no colored accents. WCAG AA still passes (white on `#0b0b12` = 18.8:1).
- Decisions: Vault aesthetic simplified to monochrome cream-on-dark. No colored accent on Lab page — ethos-blue reserved for cream pages only.

### 10:15 — FMUX catalog title: “in Messenger”

- Files: `lib/content/catalog.ts` (edited), `docs/DECISIONS.md` (edited), `docs/SESSION_LOG.md` (edited)
- What: Second catalog row (newest-first) title **First messaging experience** → **First messaging experience in Messenger**.
- Decisions: None

### 10:14 — BizAI catalog title: lowercase “ads”

- Files: `lib/content/catalog.ts` (edited), `docs/DECISIONS.md` (edited), `docs/SESSION_LOG.md` (edited)
- What: Renamed first catalog row title **Business AI in Ads** → **Business AI in ads** (sentence case for generic “ads”).
- Decisions: None

### 10:13 — Catalog + briefs: sentence case for all project titles

- Files: `lib/content/catalog.ts` (edited), `lib/content/briefs.ts` (edited), `docs/SESSION_LOG.md` (edited)
- What: Standardized all project titles to **sentence case**. Changed: "Starting Conversations with GenAI" → "Starting conversations with GenAI"; "Increasing Ad Creation from Business Inboxes" → "Increasing ad creation from business inboxes"; "Quantifying Qualitative Data in Dashboards" → "Quantifying qualitative data in dashboards"; "Reels Conversation Starters" → "Reels conversation starters". Left unchanged: "Virtual Agent (AVA)" (product name), "First messaging experience", "Multilingual mobile navigation".
- Decisions: **Sentence case** site-wide for project titles — more editorial, less slide-deck.

### 10:10 — Catalog: reverse chronological order (newest first)

- Files: `lib/content/catalog.ts` (edited), `docs/SESSION_LOG.md` (edited)
- What: Reordered catalog rows newest → oldest: 2026 (×2), 2025, 2024, 2022, 2019, 2018, 2016.
- Decisions: Catalog sorts **newest first** — most current, most senior work leads.

### 10:08 — Catalog: remove Research domain chip

- Files: `lib/content/types.ts` (edited), `components/portfolio/catalog-filter.tsx` (edited), `docs/DECISIONS.md` (edited), `docs/brainstorms/2026-04-11-portfolio-pages-ia-staff-ai-forward-requirements.md` (edited), `docs/plans/2026-04-11-001-feat-staff-portfolio-surfaces-plan.md` (edited), `docs/SESSION_LOG.md` (edited)
- What: Dropped **Research** from the `Domain` union and catalog filter chips. No catalog row used **Research** (mobile nav is **Architecture**). Plan + brainstorm R6 chip lists aligned with **AI**, **Architecture**, **Monetization**, **Incubator**, **Messaging**.
- Decisions: **Research** is not a catalog focus tag; can still describe work in prose elsewhere.

### 10:01 — Catalog page: remove intro subheader

- Files: `app/catalog/page.tsx` (edited), `docs/SESSION_LOG.md` (edited)
- What: Removed the serif paragraph under the Catalog **h1** (“curated index…”); filter/table now follows the title with `mt-12` spacing.
- Decisions: None

### 10:04 — Catalog: Reels, Business AI in ads, First messaging experience in Messenger

- Files: `lib/content/catalog.ts` (edited), `docs/DECISIONS.md` (edited), `docs/SESSION_LOG.md` (edited)
- What: Added three **Meta** catalog rows from Session 3 inventory: **Reels Conversation Starters** (Monetization, year **2025**); **Business AI in ads** (BizAI, AI, **2026**); **First messaging experience in Messenger** (FMUX, Messaging, **2026**). No `slug` — titles stay plain (no blue link) until case pages exist. Summaries are outcome/architecture-forward one-liners. **DECISIONS** catalog bullet updated: rows are Lisa-approved + `visibility`; omitted-from-site means not in data — still **no** experiment/status UI.
- Decisions: BizAI public catalog title = **Business AI in ads**; FMUX title **First messaging experience in Messenger** (Lisa phrasing + product anchor).

### 09:57 — Project years: single anchor year per row

- Files: `lib/content/catalog.ts` (edited), `lib/content/briefs.ts` (edited), `docs/SESSION_LOG.md` (edited)
- What: Set one **display year** per project (Lisa’s anchor year for each ship): Flow 75 **2024**; Inbox ads **2022**; Journey Explorer **2019**; Multilingual mobile nav **2018**; AVA **2016**. Replaced prior ranges on catalog rows and matching Tier 1 brief metadata.
- Decisions: Catalog/Brief show a single year per project; ranges removed from UI copy sources in these files.

### 09:54 — Catalog copy: dictionary spelling for multilingual

- Files: `lib/content/catalog.ts` (edited), `docs/SESSION_LOG.md` (edited)
- What: Replaced hyphenated **Multi-lingual** in the mobile navigation catalog summary with **Multilingual** (one word), matching the row title and `briefs.ts` unlock copy.
- Decisions: Use **multilingual** everywhere; no hyphen.

---

## 2026-05-20 — Session 14: GenAI case study — staff-level narrative

### 22:00 — Homepage intro: title + subtitle updates

- Files: `components/portfolio/personal-intro.tsx` (edited)
- What: Updated headline to "I'm a product designer at Meta who works on complex systems at scale" with "product designer at Meta" in blue. Revised subtitle to: "Currently generating $8.2B in messaging ads revenue. Focused on agentic AI, generative creation flows, and asynchronous communication. Previously Autodesk." Removed old duplicative copy.
- Decisions: Blue highlight spans "product designer at Meta" (not just "product designer"). Subtitle includes three specific AI focus areas.

### 22:30 — GenAI case study: Part 3 (Design Decisions)

- Files: `app/index/genai-conversations/page.tsx` (edited)
- What: Added **Part 3: Design Decisions** between Part 2 (The Interaction Flip) and Conclusion. Three-column grid layout with three beats: (1) "Redefine the problem" — inherited a failing UPB study, reframed the task to incorporate GenAI, "org chart rendered as UI" line; (2) "The visibility tradeoff" — North Star hid other teams' templates, designed system-level defaulting for 3P tooling advertisers; (3) "Designing for partial AI coverage" — unified architecture for markets with and without Llama4 language support, graceful fallback with no visible seam. Also added "project owner" to role metadata and widened hero paragraph/hairline to `max-w-[26rem]` to fix dangling "I".
- Decisions: Part 3 comes AFTER the before/after screens so reader has visual context. Three-column layout (not two) — each beat shows a different type of IC6 decision (political, organizational, architectural). Case study structure: Part 1 (thesis) → Part 2 (interaction flip) → Part 3 (design decisions) → Conclusion (what shipped).

## 2026-05-21 — Session 15: GenAI case study — video + polish

### 14:50 — Conclusion video: autoplay-on-scroll

- Files: `components/portfolio/scroll-video.tsx` (created), `app/index/genai-conversations/page.tsx` (edited), `app/layout.tsx` (edited), `public/work/genai/genai-icebreakers.mov` (created)
- What: Replaced conclusion GIF with autoplay-on-scroll video. Created `ScrollVideo` component with Intersection Observer (plays at 30% visible, pauses when offscreen). Video controls match Stitch reference: cream glass bar (`bg-[#fdfbf7]/80 backdrop-blur-xl`), blue Material Symbols icons (play, pause, replay), thin timeline with progress + scrub dot, timestamp, fullscreen. Controls fade in + slide up on hover. Added Material Symbols font to root layout. Video has hairline blue border, blue atmospheric shadow, and 2px right-edge clip.
- Decisions: Video does not loop (replay button handles restart). Controls follow Stitch/Azure Ethos visual language. Video takes 2/3 (col-span-8) of conclusion grid; text takes 1/3 (col-span-4) with blue left border, vertically centered.

### 15:11 — Part 3 reformatted to I/II/III pattern

- Files: `app/index/genai-conversations/page.tsx` (edited)
- What: Reformatted Part 3: Design Decisions to match inbox-ads "Design Principles" pattern — large italic roman numerals (I. II. III.) in blue, bold uppercase headers, body text at 80% opacity.
- Decisions: Consistent formatting between case studies for numbered principles/decisions.

### 15:14 — Conclusion metatext + animate divider parallax

- Files: `app/index/genai-conversations/page.tsx` (edited), `components/portfolio/animate-divider.tsx` (edited)
- What: Added blue metatext label under conclusion video: `[ 01:13_ADS MANAGER | ENGAGEMENT | MESSENGER DESIGNATION_GENAI ]`. AnimateDivider updated from one-shot reveal to scroll-driven parallax (scaleY from top, 160px height, 10% faster completion).
- Decisions: AnimateDivider change affects both genai-conversations and inbox-ads pages.

### 15:30 — Index page polish

- Files: `components/portfolio/catalog-filter.tsx` (edited), `lib/content/catalog.ts` (edited), `app/globals.css` (edited)
- What: Projects with case studies now display in blue text. "Impact" column renamed to "Company". GenAI project moved above Reels, year changed to 2025, domains updated to AI + Architecture. AI Agents updated to AI + Messaging. Domain separator changed from "/" to comma. Grid hydration squares changed from 40px to 36px.
- Decisions: Blue text signals clickable case studies. Company column replaces impact (clearer at a glance).

### 15:41 — Back to Index button (shared component)

- Files: `components/portfolio/back-to-index.tsx` (created), `app/index/genai-conversations/page.tsx` (edited), `app/index/inbox-ads/page.tsx` (edited), `app/index/journey-explorer/page.tsx` (edited), `app/globals.css` (edited)
- What: Created shared `BackToIndex` component — centered button at bottom of each case study. Blue border, fills blue with white text on hover. Added `.btn-back` CSS override to beat global `:any-link:hover` rule.
- Decisions: Shared component from the start for any multi-page UI element. Added `.cursor/rules/component-extraction.mdc` to persist this pattern.

### 16:00 — Contact form with metadata + anti-spam

- Files: `app/contact/page.tsx` (edited), `app/contact/layout.tsx` (created), `app/api/contact/route.ts` (created), `app/globals.css` (edited), `.env.local` (edited)
- What: Replaced static email link with full contact form (name, email, message). Captures IP, User-Agent, Referer, Accept-Language, timezone, screen resolution, time-on-page. Anti-spam: honeypot, time-on-page check, IP rate limiting — no captcha. Sends via Resend. Styled to Stitch reference (floating labels, cream card, decorative corner, centered halo). Layout file holds metadata since page became client component.
- Decisions: No email address displayed on page. All metadata sent inline with email (no separate storage). Halo hidden on contact via `body:has(.contact-page)` CSS.

### 17:30 — First Messaging Experience case study scaffold

- Files: `app/index/first-messaging-experience/page.tsx` (created), `lib/content/catalog.ts` (edited), `lib/content/briefs.ts` (edited), `docs/stitch-prompt-first-messaging.md` (created)
- What: Scaffolded full case study structure (Hero, Problem, Experiment, Design Decisions, Full Flow, Conclusion) with placeholder content. Updated catalog to include slug linking to the new page. Created Stitch prompt for visual layout generation (CSS guidance stripped per user request). Design Decisions section uses full-width background bleed and roman numeral formatting.
- Decisions: Title = "First messaging experience." Stat line and headline still pending user approval. Stitch prompt contains only structural/compositional guidance, no CSS.

### 17:45 — GenAI case study: removed "Part #" from section titles

- Files: `app/index/genai-conversations/page.tsx` (edited)
- What: Removed "Part 1:", "Part 2:", "Part 3:" prefixes from all section headings, leaving only the descriptive titles.
- Decisions: Part numbering was clutter; titles alone are sufficient.

### Open items for future sessions

- First Messaging Experience: headline and stat line need user approval
- First Messaging Experience: all visual assets are placeholders
- Each page needs its own design session using the saved references
- Real content (project data, copy, images) not yet provided

(Retroactive entry from prior transcript.)

- Initialized Next.js 16 project with Azure Ethos design system
- Built app shell: header (Lisa Aufox | PRODUCT DESIGN), primary nav, footer
- Established `SITE_CONTENT_SHELL` for layout alignment
- Set up `globals.css` with theme tokens, Azure Halo, link hover rules
- Created agent workflow: Coordinator (always-on), @designer, @builder, @reviewer
- All decisions captured in `docs/DECISIONS.md`
- Nav routes: /, /archive, /lab, /ethos (only / implemented)
- Footer links: LinkedIn, Doodles (/doodles), Contact (mailto)
