export function UpbBeforeAfterBand() {
  return (
    <div className="border border-ethos-blue/10 bg-ethos-cream px-5 py-8 min-[768px]:px-10 min-[768px]:py-10">
      <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-ethos-blue mb-8">
        Flow 75 — internal usability audit score (UPB)
      </p>
      <div className="grid grid-cols-1 min-[768px]:grid-cols-2 gap-10 min-[768px]:gap-16">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-4">
            Program score
          </p>
          <div className="flex flex-wrap items-end gap-3 min-[768px]:gap-4">
            <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] leading-none font-light text-gray-400 tabular-nums">
              62
            </span>
            <span
              className="font-sans text-lg text-gray-500 pb-2"
              aria-hidden
            >
              →
            </span>
            <span className="font-serif text-[clamp(2.75rem,7vw,4.5rem)] leading-none font-light text-gray-900 tabular-nums">
              85
            </span>
          </div>
        </div>
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-4">
            Task completion (mandated Ads Manager task)
          </p>
          <div className="flex flex-wrap items-end gap-3 min-[768px]:gap-4">
            <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] leading-none font-light text-gray-400 tabular-nums">
              64%
            </span>
            <span
              className="font-sans text-lg text-gray-500 pb-2"
              aria-hidden
            >
              →
            </span>
            <span className="font-serif text-[clamp(2.75rem,7vw,4.5rem)] leading-none font-light text-gray-900 tabular-nums">
              100%
            </span>
          </div>
        </div>
      </div>
      <p className="mt-8 font-sans text-[11px] leading-relaxed text-gray-600 max-w-[52ch]">
        Retest cleared four medium and sixteen small rocks from the UPB tracker
        I ran with research — the project graduated instead of lingering as
        another &ldquo;fix next half&rdquo; line item.
      </p>
    </div>
  );
}

export function VisualPlaceholder({
  label,
  caption,
  aspectClass,
}: {
  label: string;
  caption: string;
  aspectClass: string;
}) {
  return (
    <div
      className={`border border-ethos-blue/10 overflow-hidden relative bg-gray-50 flex items-center justify-center ${aspectClass}`}
    >
      <p className="px-6 text-center font-sans text-[12px] uppercase tracking-[0.12em] text-gray-300">
        {label}
      </p>
      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 border border-ethos-blue/10 max-w-[85%]">
        <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-gray-500">
          {caption}
        </span>
      </div>
    </div>
  );
}

