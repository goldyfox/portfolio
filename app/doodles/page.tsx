import type { Metadata } from "next";
import DoodleGallery, { type Doodle } from "@/components/portfolio/doodle-gallery";

export const metadata: Metadata = {
  title: "Lisa Aufox | Doodles",
};

const doodles: readonly Doodle[] = [
  { src: "/doodles/birds2.webp", alt: "Ink sketch of birds", width: 2500, height: 1964 },
  { src: "/doodles/sketch3.webp", alt: "Pencil sketch study", width: 2500, height: 1971 },
  { src: "/doodles/sketch41.webp", alt: "Sketch study", width: 1500, height: 1143 },
  { src: "/doodles/sketch51.webp", alt: "Sketch study", width: 2414, height: 1527 },
  { src: "/doodles/img008.webp", alt: "Illustration", width: 2388, height: 1449 },
];

export default function Doodles() {
  return (
    <div className="flex flex-1 flex-col py-macro">
      <h1 className="page-title">
        Doodles
      </h1>

      <p className="mt-8 min-[975px]:max-w-[56%] font-serif text-[18px] leading-[1.6] text-gray-600">
        A collection of sketches, illustrations, and random thoughts.
      </p>

      <DoodleGallery doodles={doodles} />
    </div>
  );
}
