import type { Chapter } from "@/lib/content/types";

export function ChapterBand({ chapter }: { chapter: Chapter }) {
  return (
    <div className="py-20">
      <div className="blue-hairline pt-6">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue">
          {chapter.label}
        </p>
        {chapter.subtitle && (
          <p className="mt-2 font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.2] font-light text-gray-900 italic">
            {chapter.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
