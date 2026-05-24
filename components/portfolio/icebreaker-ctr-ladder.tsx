/** Static CTR comparison — widths normalized to the strongest performer (deck). */
export function IcebreakerCtrLadder() {
  const rows = [
    { label: "GenAI icebreakers", value: "23.7%", pct: 100 },
    { label: "Edited template", value: "17.6%", pct: (17.6 / 23.7) * 100 },
    { label: "Default icebreakers", value: "13.6%", pct: (13.6 / 23.7) * 100 },
  ] as const;

  return (
    <div className="border border-ethos-blue/10 bg-ethos-cream px-5 py-6 min-[768px]:px-8 min-[768px]:py-8">
      <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-ethos-blue mb-6">
        Live traffic — icebreaker CTR
      </p>
      <ul className="list-none space-y-5">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-gray-600">
                {row.label}
              </span>
              <span className="font-serif text-2xl min-[768px]:text-3xl font-light text-gray-900 tabular-nums">
                {row.value}
              </span>
            </div>
            <div className="h-2 bg-ethos-blue/10 max-w-full overflow-hidden rounded-[2px]">
              <div
                className="h-full bg-ethos-blue max-w-full rounded-[2px]"
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
