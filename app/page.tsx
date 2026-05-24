import type { Metadata } from "next";
import Link from "next/link";
import { PersonalIntro } from "@/components/portfolio";
import { GridHydration } from "@/components/grid-hydration";
import { briefs } from "@/lib/content/briefs";

export const metadata: Metadata = {
  title: "Lisa Aufox | Brief",
};

function ProjectCard({
  brief,
  href,
  imageAspect,
  className,
  imageClassName,
}: {
  brief: (typeof briefs)[number];
  href: string;
  imageAspect: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={`project-card group flex flex-col gap-4 ${className ?? ""}`}
    >
      <div
        className={`project-img-container relative w-full overflow-hidden rounded-[2px] bg-gray-100 ${imageAspect} ${imageClassName ?? ""}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="px-6 text-center font-sans text-[11px] uppercase tracking-[0.15em] text-gray-300">
            {brief.title}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 border-b border-ethos-blue/30 pb-4">
        <h2 className="font-serif text-3xl italic text-ethos-blue leading-[1.2]">
          {brief.title}
        </h2>
        <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.1em] font-medium text-gray-500">
          {brief.company} &middot; {brief.year} &middot;{" "}
          {brief.domains.join(" / ")}
        </p>
      </div>
    </Link>
  );
}

export default function Brief() {
  const [flow75, inbox, je] = briefs;

  return (
    <div className="flex flex-1 flex-col pt-4">
      <GridHydration />
      <PersonalIntro />

      {/* Asymmetric Project Grid */}
      <section className="relative grid grid-cols-1 gap-y-24 pb-20 min-[768px]:grid-cols-12 min-[768px]:gap-x-6">
        <ProjectCard
          brief={flow75}
          href="/index/genai-conversations"
          imageAspect="min-[768px]:aspect-auto aspect-[4/5]"
          imageClassName="min-[768px]:pb-[calc(125%-50px)]"
          className="min-[768px]:col-start-2 min-[768px]:col-end-7"
        />
        <ProjectCard
          brief={inbox}
          href="/index/inbox-ads"
          imageAspect="aspect-square"
          className="min-[768px]:col-start-8 min-[768px]:col-end-13 min-[768px]:mt-macro"
        />
        <ProjectCard
          brief={je}
          href="/index/journey-explorer"
          imageAspect="aspect-[16/9]"
          className="relative z-10 min-[768px]:col-start-3 min-[768px]:col-end-10 min-[768px]:-mt-[76px]"
        />
      </section>
    </div>
  );
}
