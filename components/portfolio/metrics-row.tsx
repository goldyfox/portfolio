import type { BriefMetric } from "@/lib/content/types";

export function MetricsRow({ metrics }: { metrics: BriefMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 min-[575px]:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <p className="font-serif text-[clamp(2rem,4vw,3rem)] leading-none font-light text-ethos-blue">
            {metric.value}
          </p>
          <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.1em] text-gray-500">
            {metric.label}
          </p>
        </div>
      ))}
    </div>
  );
}
