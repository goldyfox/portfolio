import type { Metadata } from "next";
import { BackButton } from "@/components/portfolio/back-button";
import { JourneyExplorerEmbed } from "@/components/portfolio/journey-explorer-embed";
import { ScrollSpyTrigger } from "@/components/portfolio/scroll-spy-trigger";
import { briefs } from "@/lib/content/briefs";
import { BackToIndex } from "@/components/portfolio/back-to-index";

const brief = briefs.find((b) => b.id === "journey-explorer")!;

export const metadata: Metadata = {
  title: `Lisa Aufox | ${brief.title}`,
};

export default function JourneyExplorerPage() {
  return (
    <div className="flex flex-1 flex-col py-16 min-[975px]:py-24">
      <BackButton />

      {/* Hero */}
      <header className="pb-12">
        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ethos-blue mb-4">
          {brief.company}, {brief.year}
        </p>
        <ScrollSpyTrigger title={brief.title} />
        <h1 className="font-serif italic text-5xl min-[768px]:text-[5.5rem] leading-[1.05] tracking-tight text-gray-900">
          {brief.title}
        </h1>
      </header>

      {/* Impact + Problem — side by side */}
      <section className="mt-16 border-b border-ethos-blue/10 pb-16">
        <div className="grid grid-cols-1 gap-12 min-[768px]:grid-cols-12 min-[768px]:gap-x-6">
          <div className="min-[768px]:col-span-7">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">
              The Problem
            </h2>
            <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-gray-500 mb-3">
              Business Problem
            </p>
            <ul className="space-y-3 font-serif text-[18px] leading-[1.6] text-gray-800 list-none pl-0">
              <li className="flex gap-3 items-start">
                <span className="mt-[0.45em] block h-[8px] w-[8px] shrink-0 rounded-full border-[1.2px] border-ethos-blue" />
                <span>Qualitative customer data was scattered across seven
                platforms&nbsp;&mdash; Salesforce, Qualtrics, PowerBI, Lithium,
                and others&nbsp;&mdash; each requiring per&#8209;user licenses
                that made broad access prohibitively expensive.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-[0.45em] block h-[8px] w-[8px] shrink-0 rounded-full border-[1.2px] border-ethos-blue" />
                <span>None of these sources could be combined into a single view,
                leaving the organization with a fractured picture of customer
                issues that made it difficult to prioritize projects with
                confidence.</span>
              </li>
            </ul>
            <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-gray-500 mb-3 mt-8">
              User Problem
            </p>
            <ul className="space-y-3 font-serif text-[18px] leading-[1.6] text-gray-800 list-none pl-0">
              <li className="flex gap-3 items-start">
                <span className="mt-[0.45em] block h-[8px] w-[8px] shrink-0 rounded-full border-[1.2px] border-ethos-blue" />
                <span>Because access was so limited, teams that needed qualitative
                insight had to request specific queries from user researchers,
                a process that extended every project cycle.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-[0.45em] block h-[8px] w-[8px] shrink-0 rounded-full border-[1.2px] border-ethos-blue" />
                <span>Without a unified view of all customer comments, anyone could
                cherry&#8209;pick a handful of quotes to reinforce their own
                priorities&nbsp;&mdash; anecdotes carried the same weight as
                patterns.</span>
              </li>
            </ul>
          </div>
          <div className="min-[768px]:col-start-9 min-[768px]:col-span-4">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">
              Impact
            </h2>
            <div className="grid grid-cols-2 gap-8 min-[768px]:grid-cols-1 min-[768px]:gap-10">
              {brief.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col border-l-2 border-ethos-blue pl-4"
                >
                  <span className="font-serif text-[clamp(2rem,4vw,3rem)] leading-none font-light text-ethos-blue">
                    {metric.value}
                  </span>
                  <span className="mt-1 font-sans text-[11px] uppercase tracking-[0.1em] text-gray-500">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What I Did + What It Unlocked */}
      <section className="mt-16 border-b border-ethos-blue/10 pb-16">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">
          What I Did
        </h2>
        <div className="min-[975px]:max-w-[56%] space-y-6">
          <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
            Our existing customer journey taxonomy was only being used for
            support cases. I recognized it could segment any qualitative data
            source. I proved it at the 2019 Autodesk hackathon by running
            several data sets through the taxonomy and demonstrating that any
            qualitative data could be organized and filtered using the same
            framework.
          </p>
          <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
            The win earned executive sponsorship to build it into a full
            product. I led it as both designer and product owner across a
            12&#8209;person team across design, engineering, and data science.
            I designed the data framework with taxonomy classification and
            sentiment tagging across all seven sources,
            including site surveys, forum posts, community threads, and support
            cases. Anyone could then slice the data by journey phase, product,
            sentiment, and time without needing a data analyst.
          </p>
          <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
            The dashboard democratized access to qualitative data across
            Autodesk, eliminating the need for individual platform licenses and
            giving data analysts time back for complex work. It was used by
            hundreds of employees monthly across Autodesk&rsquo;s
            10,000&#8209;person organization and changed how teams made
            evidence&#8209;based decisions.
          </p>
        </div>
      </section>

      {/* Working Dashboard */}
      <section className="mt-16">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">
          Try It
        </h2>
        <p className="mb-6 font-serif text-[16px] leading-[1.6] text-gray-800 italic">
          This is a functional rebuild of the production tool. Real architecture,
          real interactions, dummy data. Mathematical accuracy not guaranteed.
        </p>
        <JourneyExplorerEmbed />
      </section>

      {/* Back to Index */}
      <BackToIndex />
    </div>
  );
}
