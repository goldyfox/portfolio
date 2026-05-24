"use client";

import { MobileScreenPlaceholder } from "@/components/portfolio/mobile-screen-placeholder";

export type ExplorationItem = {
  label: string;
  placeholder?: string;
};

const MAX_PANELS = 8;

export function ExplorationsScroller({
  title = "Explorations",
  items,
}: {
  title?: string;
  items: ExplorationItem[];
}) {
  const panels = items.slice(0, MAX_PANELS);

  return (
    <section className="mb-macro relative z-10 case-reveal">
      <h2 className="font-serif italic text-[40px] text-gray-900 mb-12">{title}</h2>

      <div
        className="relative -mx-6 min-[975px]:-mx-10"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          width: "100vw",
        }}
      >
        <div
          className="hide-scrollbar overflow-x-auto cursor-ew-resize"
          aria-label={`${title} — scroll horizontally`}
        >
          <div className="flex h-[min(812px,75vh)] min-h-[480px] w-max items-stretch gap-10 pl-6 min-[975px]:pl-10">
            {panels.map((panel, index) => (
              <MobileScreenPlaceholder
                key={`${panel.label}-${index}`}
                label={panel.label}
                labelInside
                fillHeight
                placeholder={panel.placeholder}
              />
            ))}
            <div className="w-6 shrink-0 min-[975px]:w-10" aria-hidden />
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-6 right-6 flex items-center gap-2 border border-ethos-blue bg-ethos-cream px-4 py-2 shadow-[0_20px_40px_rgba(19,19,236,0.05)]"
          aria-hidden
        >
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-ethos-blue">
            Scroll horizontal
          </span>
          <span className="material-symbols-outlined text-[16px] text-ethos-blue">
            arrow_forward
          </span>
        </div>
      </div>
    </section>
  );
}
