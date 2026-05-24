import type { EditorialBriefData } from "@/lib/content/types";
import { MetricsRow } from "./metrics-row";

interface EditorialBriefProps {
  brief: EditorialBriefData;
  deepWorkSlot?: React.ReactNode;
}

export function EditorialBrief({ brief, deepWorkSlot }: EditorialBriefProps) {
  return (
    <article className="py-macro">
      <div className="blue-hairline pt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-gray-500">
          {brief.company} &middot; {brief.year} &middot;{" "}
          {brief.domains.join(" / ")}
        </p>

        <h2 className="mt-4 font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] font-light text-gray-900 italic">
          {brief.title}
        </h2>
      </div>

      <blockquote className="mt-12 border-l-2 border-ethos-blue pl-6 font-serif text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.4] text-gray-800 italic">
        {brief.bet}
      </blockquote>

      <div className="mt-16">
        <MetricsRow metrics={brief.metrics} />
      </div>

      <div className="mt-16">
        <h3 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue">
          The Constraint
        </h3>
        <p className="mt-4 max-w-[52ch] font-serif text-[18px] leading-[1.6] text-gray-800">
          {brief.constraint}
        </p>
      </div>

      <div className="mt-12">
        <h3 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue">
          The Move
        </h3>
        <p className="mt-4 max-w-[52ch] font-serif text-[18px] leading-[1.6] text-gray-800">
          {brief.move}
        </p>
      </div>

      <div className="mt-12">
        <h3 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue">
          The Work
        </h3>
        {deepWorkSlot ? (
          <div className="mt-6">{deepWorkSlot}</div>
        ) : (
          <div className="mt-6 flex aspect-[16/9] items-center justify-center rounded-[2px] border border-gray-900/10 bg-gray-50">
            <p className="px-6 text-center font-sans text-[13px] uppercase tracking-[0.1em] text-gray-400">
              {brief.workDescription}
            </p>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h3 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue">
          What It Unlocked
        </h3>
        <p className="mt-4 max-w-[52ch] font-serif text-[18px] leading-[1.6] text-gray-800">
          {brief.unlock}
        </p>
      </div>
    </article>
  );
}
