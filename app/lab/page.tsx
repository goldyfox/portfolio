import type { Metadata } from "next";

import { ChromaCaptureSection } from "@/components/lab/chroma-capture-section";
import { TypoglycemiaSection } from "@/components/lab/typoglycemia-section";

export const metadata: Metadata = {
  title: "Lisa Aufox | Lab",
};

export default function Lab() {
  return (
    <div className="flex flex-1 flex-col py-macro text-[#fdfbf7]">
      <h1 className="page-title">
        Lab
      </h1>

      <p className="mt-8 min-[975px]:max-w-[56%] font-serif text-[18px] leading-[1.6] text-[#fdfbf7]/70">
        Experiments in AI, psychology, interaction, and craft. Things
        I&rsquo;m building, testing, or just curious about.
      </p>

      <ChromaCaptureSection />

      <TypoglycemiaSection />
    </div>
  );
}
