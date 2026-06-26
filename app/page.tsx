import type { Metadata } from "next";
import { PersonalIntro } from "@/components/portfolio";
import { ProjectTile } from "@/components/portfolio/project-tile";
import { FmuxChat } from "@/components/portfolio/home-ui/fmux-chat";
import { GenaiTemplate } from "@/components/portfolio/home-ui/genai-template";
import { InboxSurfaces } from "@/components/portfolio/home-ui/inbox-surfaces";
import { GridHydration } from "@/components/grid-hydration";
import { briefs } from "@/lib/content/briefs";

export const metadata: Metadata = {
  title: "Lisa Aufox | Brief",
};

export default function Brief() {
  const [fmux, genai, inbox] = briefs;

  return (
    <div className="flex flex-1 flex-col pt-4">
      <GridHydration />
      <PersonalIntro />

      {/* Asymmetric Project Grid */}
      <section className="relative grid grid-cols-1 gap-y-32 pb-20 min-[768px]:grid-cols-12 min-[768px]:gap-x-6 min-[768px]:gap-y-24">
        <ProjectTile
          brief={fmux}
          href="/index/first-messaging-experience"
          imageAspect="aspect-[4/5]"
          media={<FmuxChat />}
          elevate
          className="min-[768px]:col-start-2 min-[768px]:col-end-7"
        />
        <ProjectTile
          brief={genai}
          href="/index/genai-conversations"
          imageAspect="aspect-square"
          media={<GenaiTemplate />}
          elevate
          className="min-[768px]:col-start-8 min-[768px]:col-end-13 min-[768px]:mt-macro"
        />
        <ProjectTile
          brief={inbox}
          href="/index/inbox-ads"
          imageAspect="aspect-[16/9]"
          media={<InboxSurfaces />}
          elevate
          className="relative z-10 min-[768px]:col-start-3 min-[768px]:col-end-10 min-[768px]:-mt-[76px]"
        />
      </section>
    </div>
  );
}
