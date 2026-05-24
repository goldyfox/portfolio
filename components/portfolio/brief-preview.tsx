import Link from "next/link";
import type { EditorialBriefData } from "@/lib/content/types";
import { MetricsRow } from "./metrics-row";

interface BriefPreviewProps {
  brief: EditorialBriefData;
  href: string;
  ctaLabel?: string;
}

export function BriefPreview({
  brief,
  href,
  ctaLabel = "Read case study",
}: BriefPreviewProps) {
  return (
    <article className="py-20">
      <div className="blue-hairline pt-6">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-gray-500">
          {brief.company} &middot; {brief.year} &middot;{" "}
          {brief.domains.join(" / ")}
        </p>
        <h2 className="mt-3 font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] font-light text-gray-900 italic">
          {brief.title}
        </h2>
        {brief.subtitle && (
          <p className="mt-3 min-[975px]:max-w-[56%] font-serif text-[18px] leading-[1.6] text-gray-600">
            {brief.subtitle}
          </p>
        )}
      </div>

      <div className="mt-6 flex aspect-[5/2] max-w-[75%] items-center justify-center rounded-[2px] border border-gray-900/10 bg-gray-50">
        <p className="px-6 text-center font-sans text-[13px] uppercase tracking-[0.1em] text-gray-300">
          {brief.title}
        </p>
      </div>

      <p className="mt-6 min-[975px]:max-w-[56%] font-serif text-[clamp(1.125rem,2vw,1.25rem)] leading-[1.5] text-gray-800 italic">
        {brief.bet}
      </p>

      <div className="mt-8">
        <MetricsRow metrics={brief.metrics} />
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href={href}
          className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue underline decoration-ethos-blue decoration-[1px] underline-offset-[0.35em]"
        >
          {ctaLabel} &rarr;
        </Link>
      </div>
    </article>
  );
}
