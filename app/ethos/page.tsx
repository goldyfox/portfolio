import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lisa Aufox | About",
};

export default function About() {
  return (
    <div className="flex flex-1 flex-col py-macro">
      <h1 className="page-title">
        About
      </h1>

      {/* Bio row — asymmetric two-column on desktop, stacked on mobile */}
      <div className="mt-12 min-[800px]:grid min-[800px]:grid-cols-[2fr_3fr] min-[800px]:gap-x-[clamp(3rem,5vw,6rem)] min-[800px]:items-start">
        {/* Narrow column: photo + education */}
        <div className="min-[800px]:sticky min-[800px]:top-28">
          <figure className="m-0">
            <Image
              src="/about-panel.png"
              alt="Lisa Aufox speaking on a design panel"
              width={1024}
              height={720}
              className="w-full grayscale"
              priority
            />
            <figcaption className="mt-3 font-serif text-[13px] leading-[1.45] italic text-gray-600">
              Machine Learning panel, MLUX
            </figcaption>
          </figure>
          <div className="mt-6 space-y-3">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue">
                Education
              </p>
              <p className="mt-2 font-sans text-[13px] text-gray-800">
                MS Human Factors in Information Design, Bentley&nbsp;University
              </p>
              <p className="mt-1 font-sans text-[13px] text-gray-800">
                BA Psychology &amp; Visual Design, Washington University in St.&nbsp;Louis
              </p>
            </div>
            <div className="pt-3">
              <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue">
                Currently
              </p>
              <p className="mt-2 font-sans text-[13px] text-gray-800">
                Lead Product Designer, Meta
              </p>
            </div>
            <div className="pt-3">
              <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue">
                Previously
              </p>
              <p className="mt-2 font-sans text-[13px] text-gray-800">
                Autodesk, Extractable
              </p>
            </div>
          </div>
        </div>

        {/* Wide column: bio + CTA */}
        <div className="mt-12 min-[800px]:mt-0">
          <div className="space-y-6">
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              After college, I picked up Hartmut Esslinger&rsquo;s{" "}
              <em>A&nbsp;Fine Line</em>{" "}and something clicked. It showed me a
              type of design thinking that wasn&rsquo;t about craft or looks,
              but about shaping how products work, how people experience them,
              and how businesses grow because of it. That idea sent me to grad
              school, cross&#8209;country to San Francisco, and has guided every
              role I&rsquo;ve taken as a&nbsp;designer.
            </p>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              The through line in my work is connection. Every product
              I&rsquo;ve designed sits in the gap between two groups that need
              to be connected: advertisers and consumers, support teams and
              customers, organizations and the tools trying to serve them.
              Those problems are cross&#8209;functional, messy, and rarely
              owned by anyone. That&rsquo;s what draws me to&nbsp;them.
            </p>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              What I bring is clarity. I find the core issue, reframe it so
              the team can see what we&rsquo;re actually solving, and connect
              the dots between projects that look unrelated on a roadmap but
              tell a bigger story together. I think in systems, I back
              decisions with data, and I&nbsp;ship.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 border-t border-gray-900/10 pt-6">
            <p className="max-w-[36ch] font-serif text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.4] text-gray-800 italic">
              Want to talk?
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue underline decoration-ethos-blue decoration-[1px] underline-offset-[0.35em]"
            >
              Get in touch &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
