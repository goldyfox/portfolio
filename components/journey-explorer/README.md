# Journey Explorer (portfolio demo)

Self-contained interactive dashboard based on Adobe XD “Journey Explorer” comps: Volume / Sentiment / Trends charts, filter sidebar, search-with-keywords, and comments panel. Uses **Recharts** and **Artifakt Element** (scoped inside the root via `@font-face`).

## Drop onto any page

```tsx
import JourneyExplorer from "@/components/journey-explorer";
// or: import { JourneyExplorer } from "@/components/journey-explorer";

export default function Page() {
  return <JourneyExplorer />;
}
```

The root component is a **client** component (`"use client"` in `JourneyExplorer.tsx`). You can render it from a Server Component page as above.

## Fonts

`JourneyExplorer` loads WOFF2 files from **`/public/fonts/`**:

- `Artifakt Element Light.woff2`
- `Artifakt Element Regular.woff2`
- `Artifakt Element Medium.woff2`
- `Artifakt Element Bold.woff2`

Ensure these paths exist in production; without them, the UI falls back to system sans-serif.

## Module layout

| File | Role |
|------|------|
| `JourneyExplorer.tsx` | Shell: header, search, layout, tab state |
| `FilterSidebar.tsx` | Date / phase / sentiment filters + `getSelectedMonths` |
| `VolumeChart.tsx` | Stacked bars, phase drill-down |
| `SentimentChart.tsx` | Stacked sentiment bars |
| `TrendsChart.tsx` | Line chart, metric & grouping dropdowns |
| `DetailsPanels.tsx` | Right rail, taxonomy, `CommentsPanel` |
| `data.ts` | Dummy volume, sentiment, trends generator, sample comments |
| `colors.ts` | Palettes and UI tokens |

## Public exports (barrel)

`index.ts` re-exports the default demo plus filter helpers for custom wiring:

- `DEFAULT_FILTERS`, `getSelectedMonths`, `QUARTER_OPTIONS`, `FY_OPTIONS`, `FY_TO_QUARTERS`, `QUARTER_TO_MONTHS`
- `computeVolumeBackedCommentTotal` — same scaled volume total used for Volume/Sentiment rails and comments toolbar
- Types: `FilterState`, `DateView`

## Current host route

Mounted from `app/lab/page.tsx`. Safe to move to e.g. `app/work/journey-explorer/page.tsx` by changing only the page import and layout wrapper.

## Dependencies

Project-level: `react`, `recharts`, Tailwind (utility classes only; no design-system coupling to the rest of the site).
