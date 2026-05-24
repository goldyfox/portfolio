"use client";

import dynamic from "next/dynamic";

const JourneyExplorer = dynamic(
  () =>
    import("@/components/journey-explorer").then((mod) => ({
      default: mod.JourneyExplorer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[16/9] animate-pulse rounded-[2px] bg-gray-100" />
    ),
  },
);

export function JourneyExplorerEmbed() {
  return (
    <div>
      <div className="hidden min-[768px]:block">
        <JourneyExplorer />
      </div>
      <div className="block min-[768px]:hidden">
        <div className="flex aspect-[16/9] flex-col items-center justify-center gap-4 rounded-[2px] border border-gray-900/10 bg-gray-50 p-6">
          <p className="text-center font-sans text-[13px] uppercase tracking-[0.1em] text-gray-500">
            Interactive data visualization
          </p>
          <p className="text-center font-serif text-[16px] text-gray-600">
            View on a larger screen to interact with the full Journey Explorer
            demo.
          </p>
        </div>
      </div>
    </div>
  );
}
