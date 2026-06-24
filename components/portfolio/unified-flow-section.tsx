import { ScrollVideo } from "@/components/portfolio/scroll-video";

type UnifiedFlowMetric = {
  label: string;
  value: string;
};

type UnifiedFlowSectionProps = {
  title?: string;
  synthesisTitle?: string;
  synthesis: string;
  metrics?: UnifiedFlowMetric[];
  tagsLabel?: string;
  tags?: string[];
  videoSrc?: string;
  videoLabel?: string;
  videoPlaceholder?: string;
  portrait?: boolean;
};

export function UnifiedFlowSection({
  title = "The unified flow",
  synthesisTitle = "Synthesis",
  synthesis,
  metrics = [],
  tagsLabel = "Surfaces",
  tags = [],
  videoSrc,
  videoLabel,
  videoPlaceholder = "[Unified flow — video]",
  portrait = false,
}: UnifiedFlowSectionProps) {
  return (
    <section className="mb-macro relative z-10 case-reveal">
      <div className="border-t border-ethos-blue/20 pt-8 mb-16 text-center">
        <h2 className="font-serif italic text-3xl text-ethos-blue border-b border-ethos-blue pb-4 inline-block px-12">
          {title}
        </h2>
      </div>

      <div
        className={
          portrait
            ? "flex flex-col items-center min-[975px]:flex-row min-[975px]:items-start min-[975px]:justify-center gap-12 min-[975px]:gap-20"
            : "grid grid-cols-1 min-[975px]:grid-cols-12 gap-16 items-center"
        }
      >
        <div className={portrait ? "shrink-0" : "min-[975px]:col-span-7"}>
          {videoSrc ? (
            portrait ? (
              <div className="flex flex-col items-center">
                {videoLabel ? (
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-4">
                    {videoLabel}
                  </p>
                ) : null}
                <div
                  className="relative flex shrink-0 h-[min(760px,75vh)]"
                  style={{ filter: "drop-shadow(0 0 7.5px rgba(0, 0, 0, 0.25))" }}
                >
                  <video
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-auto"
                    style={{ clipPath: "inset(2px round 25px)" }}
                  />
                </div>
              </div>
            ) : (
              <ScrollVideo src={videoSrc} className="w-full" />
            )
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

        <div
          className={
            portrait
              ? "flex flex-col gap-12 min-[975px]:max-w-md min-[975px]:self-start min-[975px]:sticky min-[975px]:top-32"
              : "min-[975px]:col-span-5 flex flex-col gap-12"
          }
        >
          <div>
            <h3 className="font-serif italic text-[30px] text-gray-900 mb-4">
              {synthesisTitle}
            </h3>
            <p className="font-serif text-lg leading-relaxed text-gray-600 mb-8">
              {synthesis}
            </p>
            {metrics.length > 0 ? (
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
            ) : null}
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
