import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Lisa Aufox | Doodles",
};

const doodles = [
  { src: "/doodles/birds2.webp", alt: "Ink sketch of birds", width: 2500, height: 1964 },
  { src: "/doodles/sketch3.webp", alt: "Pencil sketch study", width: 2500, height: 1971 },
  { src: "/doodles/img008.webp", alt: "Illustration", width: 2388, height: 1449 },
  { src: "/doodles/sketch51.webp", alt: "Sketch study", width: 2414, height: 1527 },
  { src: "/doodles/sketch41.webp", alt: "Sketch study", width: 1500, height: 1143 },
] as const;

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

      <div className="mt-macro grid grid-cols-1 gap-6 min-[768px]:grid-cols-2 min-[768px]:gap-8">
        {doodles.map((doodle) => (
          <div
            key={doodle.src}
            className="group overflow-hidden rounded-[2px] bg-gray-50"
          >
            <Image
              src={doodle.src}
              alt={doodle.alt}
              width={doodle.width}
              height={doodle.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
