"use client";

const VOICES = [
  { label: "Formal", x: 82, y: 75 },
  { label: "Neutral", x: 58, y: 48 },
  { label: "Casual", x: 20, y: 20 },
] as const;

export function VoiceSpectrum() {
  return (
    <div className="flex max-w-[480px] mx-auto select-none gap-3">
      {/* Y-axis label */}
      <div className="flex items-center shrink-0">
        <span
          className="font-sans text-[10px] uppercase tracking-[0.2em] text-ethos-blue"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Succinct → Verbose
        </span>
      </div>

      {/* Chart + X-axis */}
      <div className="flex-1 min-w-0">
        <div className="relative aspect-square border border-ethos-blue/10 bg-gray-50">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <div className="border-r border-b border-ethos-blue/20 p-4 flex items-start">
              <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-gray-400">
                Casual &amp; Verbose
              </span>
            </div>
            <div className="border-b border-ethos-blue/20 p-4 flex items-start justify-end">
              <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-gray-400">
                Professional &amp; Verbose
              </span>
            </div>
            <div className="border-r border-ethos-blue/20 p-4 flex items-end">
              <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-gray-400">
                Casual &amp; Succinct
              </span>
            </div>
            <div className="p-4 flex items-end justify-end">
              <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-gray-400">
                Professional &amp; Succinct
              </span>
            </div>
          </div>

          {VOICES.map((v) => (
            <div
              key={v.label}
              className="absolute flex flex-col items-center gap-1.5 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${v.x}%`, bottom: `${v.y}%` }}
            >
              <div className="w-3 h-3 rounded-full bg-ethos-blue" />
              <span className="font-sans text-[10px] font-medium text-gray-900 whitespace-nowrap">
                {v.label}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center pt-3">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-ethos-blue">
            Casual → Professional
          </span>
        </div>
      </div>
    </div>
  );
}
