import { ScrollVideo } from "@/components/portfolio/scroll-video";

type UnifiedFlowMetric = {
  label: string;
  value: string;
};

type UnifiedFlowSectionProps = {
  title?: string;
  synthesisTitle?: string;
  synthesis: string;
  metrics: UnifiedFlowMetric[];
  tagsLabel?: string;
  tags?: string[];
  videoSrc?: string;
  videoPlaceholder?: string;
};

export function UnifiedFlowSection({
  title = "The unified flow",
  synthesisTitle = "Synthesis",
  synthesis,
  metrics,
  tagsLabel = "Surfaces",
  tags = [],
  videoSrc,
  videoPlaceholder = "[Unified flow — video]",
}: UnifiedFlowSectionProps) {
  return (
    <section className="mb-macro relative z-10 case-reveal overflow-hidden">
      <div className="border-t border-ethos-blue/20 pt-8 mb-16">
        <h2 className="font-serif italic text-3xl text-gray-900 border-b border-ethos-blue pb-4 inline-block pr-12">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 min-[975px]:grid-cols-12 gap-16">
        <div className="min-[975px]:col-span-8">
          {videoSrc ? (
            <ScrollVideo src={videoSrc} className="w-full" />
          ) : (
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden border border-ethos-blue/20 bg-gray-900 shadow-[0_20px_40px_rgba(19,19,236,0.05)]">
              <p className="font-sans text-[13px] italic text-gray-400">
                {videoPlaceholder}
              </p>
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-ethos-blue bg-ethos-cream/10 text-ethos-blue backdrop-blur-sm">
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="min-[975px]:col-span-4 flex flex-col justify-between gap-12">
          <div>
            <h3 className="font-serif italic text-2xl text-gray-900 mb-6">
              {synthesisTitle}
            </h3>
            <p className="font-serif text-base leading-relaxed text-gray-600 mb-8">
              {synthesis}
            </p>
            <div className="grid grid-cols-2 gap-6">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border-l border-ethos-blue pl-4"
                >
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">
                    {metric.label}
                  </p>
                  <p className="font-serif text-3xl text-ethos-blue">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {tags.length > 0 ? (
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-gray-900 mb-4">
                {tagsLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-sans text-[10px] uppercase tracking-[0.1em] border border-ethos-blue/10 bg-[#f9f7f3] px-2 py-1 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
