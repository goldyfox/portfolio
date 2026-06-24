import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { briefs } from "@/lib/content/briefs";
import { TileVideo } from "@/components/portfolio/tile-video";

interface ProjectTileProps {
  brief: (typeof briefs)[number];
  href: string;
  imageAspect: string;
  className?: string;
  /** Custom composition (e.g. a live UI animation). Takes precedence over all media. */
  media?: ReactNode;
  /** Lift the card above the page grid overlay with an opaque white ground + subtle blue glow. */
  elevate?: boolean;
  /** Full-bleed ambient video preview. Takes precedence over coverSrc. */
  videoSrc?: string;
  /** Poster still for the video (instant paint + reduced-motion fallback). */
  videoPoster?: string;
  /** Full-bleed cover image. When omitted (and no video), a clean placeholder renders. */
  coverSrc?: string;
  coverAlt?: string;
  priority?: boolean;
}

export function ProjectTile({
  brief,
  href,
  imageAspect,
  className,
  media,
  elevate = false,
  videoSrc,
  videoPoster,
  coverSrc,
  coverAlt,
  priority = false,
}: ProjectTileProps) {
  return (
    <Link
      href={href}
      className={`project-card group flex flex-col gap-4 ${className ?? ""}`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-[2px] ${imageAspect} ${
          elevate ? "z-[2] bg-white" : media || coverSrc ? "" : "bg-[#f2efe9]"
        }`}
        style={
          elevate
            ? { boxShadow: "0 20px 50px rgba(19, 19, 236, 0.1)" }
            : undefined
        }
      >
        {media ? (
          media
        ) : videoSrc ? (
          <TileVideo
            src={videoSrc}
            poster={videoPoster}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : coverSrc ? (
          <Image
            src={coverSrc}
            alt={coverAlt ?? brief.title}
            fill
            priority={priority}
            sizes="(min-width: 768px) 42vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <p className="text-center font-serif text-2xl italic text-ethos-blue/40 leading-snug">
              {brief.title}
            </p>
          </div>
        )}
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
