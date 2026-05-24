import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lisa Aufox | Doodles",
};

export default function Doodles() {
  return (
    <div className="flex flex-1 flex-col py-macro">
      <h1 className="page-title">
        Doodles
      </h1>

      <p className="mt-8 min-[975px]:max-w-[56%] font-serif text-[18px] leading-[1.6] text-gray-600">
        A collection of sketches, illustrations, and visual
        experiments&nbsp;&mdash; the kind of work that keeps the creative
        muscles warm.
      </p>

      <div className="mt-macro grid grid-cols-2 gap-4 min-[575px]:grid-cols-3 min-[975px]:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-[2px] border border-gray-900/10 bg-gray-50"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-gray-300">
              {String(i + 1).padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
