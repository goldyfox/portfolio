# Azure Ethos Design System

### 1. Overview & Creative North Star
**Creative North Star: The Digital Curator**

Azure Ethos is a design system that marries the intellectual rigor of high-end editorial publishing with the precision of machine cognition. It rejects the "standard app" aesthetic in favor of a spatial, asymmetric layout that treats the screen as a canvas for curation rather than a container for data. By utilizing extreme typographic scales and intentional whitespace (macro-spacing), Azure Ethos creates a sense of "quiet authority." The design breaks the rigid 12-column grid through staggered element placement and overlapping circular motifs, suggesting a fluid, non-linear approach to information.

### 2. Colors
The color palette is anchored by a high-contrast pairing of an electric Primary Blue (`#1313ec`) and a luxurious, warmth-infused Cream (`#fdfbf7`).

- **Interactive (hover):** For primary navigation and other text links, the hover state shifts label color to Primary Blue (`#1313ec`).
- **The "No-Line" Rule:** Visual sectioning must avoid 1px solid borders for general layout. Separation is achieved through shifts in background tone (using the `surface-container` tiers) or the "Hairline Blue" rule—where a single, purposeful 1px line in Primary Blue is used only to anchor content titles, never to box elements in.
- **Surface Hierarchy & Nesting:** Use `surface_container_low` for the main background and `surface` for active content areas. Depth is created by nesting slightly warmer or cooler tones rather than using shadows.
- **Signature Textures:** Utilize the "Azure Halo"—a large, low-opacity (#1313ec at 10%) circular stroke—behind content to break the rectangularity of the browser.
- **Glass & Gradient:** For mobile navigation or floating overlays, use a backdrop-blur of 12px with a `surface/80` fill to maintain the "Curator" aesthetic.

### 3. Typography
Typography is the primary architecture of Azure Ethos. It utilizes a high-contrast serif for narrative elements and a neutral sans-serif for utility.

- **Display & Headline:** Newsreader (Italic, Light). Used at scale to create "Macro Text" moments. 
  - *Extracted Scale:* `clamp(56px, 8vw, 120px)` for hero statements.
- **Titles:** Newsreader (Italic, 1.875rem / 30px). Used for project titles and section headers, always paired with a Primary Blue hairline.
- **Label & Utility:** Inter / Helvetica Neue (11px, Uppercase, Tracking 0.1em). This provides a technical, data-driven contrast to the expressive serif headlines.
- **Navigation:** Horizontal top-nav orientation to ensure high-end usability while maintaining typographic rigor.
- **Body:** Newsreader (Regular, 18px). Focused on long-form readability with generous line-height (1.6).

### 4. Elevation & Depth
Azure Ethos replaces traditional Material elevation with **Tonal Layering** and **Atmospheric Perspective**.

- **The Layering Principle:** Depth is expressed through Z-index stacking. Background elements (Halos) sit at Z-minus, while images use subtle `0.125rem` (2px) corner radii to appear like physical prints laid on a desk.
- **Ambient Shadows:** While the system prioritizes flat tonal shifts, if a shadow is required for a floating menu, it must be an "Atmospheric Shadow": `0 20px 40px rgba(19, 19, 236, 0.05)`, using the primary color seed to tint the shadow.
- **The "Ghost Border" Fallback:** If high-contrast accessibility is required, use `outline_variant` at 30% opacity.
- **Interaction Depth:** Image containers utilize a grayscale-to-color transition and a `1.03x` scale on hover to signify interactability without using "lifted" shadows.

### 5. Components
- **Buttons:** Text-only with uppercase 11px labels and a 1px primary underline. High-priority CTAs use a solid Primary Blue fill with sharp corners (Roundedness: 0).
- **Navigation:** Fixed horizontal top navigation. Site title **LISA AUFOX / PRODUCT DESIGN** left-aligned; nav links **[ 01 Index ] [ 02 Archive ] [ 03 Lab ] [ 04 Ethos ]** right-aligned with generous macro-whitespace. **Hover:** link text uses Primary Blue (`#1313ec`). **Selected (current page):** link text uses Primary Blue (`#1313ec`) with a 1px underline in Primary Blue.
- **Cards:** Asymmetric aspect ratios (4:5, 1:1, 16:9). No containers; cards consist of the image, the headline, and a metadata row separated by a hairline blue border.
- **Input Fields:** Single bottom-border only (Primary Blue). Labels are always 11px uppercase, positioned above the input.
- **Chips/Badges:** Minimalist text strings separated by forward slashes (e.g., UI / Q4 2023 / SCALE).

### 6. Do's and Don'ts
- **Do:** Use `mb-macro` (160px) spacing between major sections.
- **Do:** Mix Serif Italics with Sans-Serif Caps in the same component to create "Editorial Contrast."
- **Don't:** Use rounded corners exceeding 10px (except for specific brand-defined circles).
- **Don't:** Use cards with box-shadows; rely on the "fdfbf7" background to provide a gallery-like setting.
- **Do:** Ensure all Primary Blue text on the Cream background meets AA contrast standards for readability.
