import type { Metadata } from "next";
import Image from "next/image";
import { BackButton } from "@/components/portfolio/back-button";
import { ScrollSpyTrigger } from "@/components/portfolio/scroll-spy-trigger";
import { briefs } from "@/lib/content/briefs";
import { BackToIndex } from "@/components/portfolio/back-to-index";
import { AnimateMetrics } from "@/components/portfolio/animate-metrics";
import { AnimateDivider } from "@/components/portfolio/animate-divider";

const brief = briefs.find((b) => b.id === "inbox-ads")!;

export const metadata: Metadata = {
  title: `Lisa Aufox | ${brief.title}`,
};

export default function InboxAds() {
  return (
    <div className="flex flex-1 flex-col py-16 min-[975px]:py-24">
      <BackButton />

      {/* Hero */}
      <header className="pb-12">
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-6">
          <div className="min-[768px]:col-span-8">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ethos-blue mb-4">
              {brief.company}, {brief.year}
            </p>
            <ScrollSpyTrigger title={brief.title} />
            <h1 className="font-serif italic text-5xl min-[768px]:text-[5.5rem] leading-[1.05] tracking-tight text-gray-900">
              {brief.title}
            </h1>
          </div>
          <div className="min-[768px]:col-span-4 flex flex-col justify-end">
            <div className="border-t border-ethos-blue/20 pt-4 space-y-4">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Role</p>
                <p className="font-sans text-[13px] text-gray-800">Design Lead</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Surfaces</p>
                <p className="font-sans text-[13px] text-gray-800">Messenger, Instagram, Meta Business Suite</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Narrative — sticky headline left, content right */}
      <section className="mt-16 pb-16">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">Problem &amp; Opportunity</h2>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-12 items-start">
          <div className="min-[768px]:col-span-4 min-[768px]:sticky min-[768px]:top-32">
            <h2 className="font-serif italic text-3xl min-[768px]:text-4xl tracking-tight leading-[1.1] text-gray-900">
              {brief.subtitle}
            </h2>
          </div>
          <div className="min-[768px]:col-span-7 min-[768px]:col-start-6">
            <div className="space-y-6 font-serif text-[18px] leading-[1.6] text-gray-800 mb-12">
              <p>
                Businesses want to start more conversations with
                customers. The best tool for doing that is messaging ads,
                but there was no way to access them from the inbox, where
                businesses spend most of their time. Ad creation existed
                in a completely separate location, resulting in low
                discoverability.
              </p>
              <p>
                In ad creation, advertisers struggle to find messaging
                ads among a broad set of products designed to serve every
                advertising objective.
              </p>
              <p>
                At the time, upsells within inboxes were the only way to
                encourage ad creation. They were disruptive and ephemeral,
                with narrow targeting. If a business didn&rsquo;t click at
                exactly the right moment, the upsell disappeared.
              </p>
            </div>

            <div className="border border-ethos-blue/10 overflow-hidden relative">
              <Image
                src="/work/inbox-ads/cover.png"
                alt="Redesigned Instagram, Messenger, and Meta Business Suite inboxes with permanent ad creation entry points"
                width={2048}
                height={1280}
                className="w-full"
              />
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 border border-ethos-blue/10">
                <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-gray-500">Fig 01. Unified entry points across inboxes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="mt-16 border-b border-ethos-blue/20 pb-16">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">Impact</h2>
        <AnimateMetrics metrics={brief.metrics} />
      </section>

      {/* What I Did — sticky headline left, narrative right */}
      <section className="mt-16 border-b border-ethos-blue/20 pb-16">
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-12 items-start">
          <div className="min-[768px]:col-span-4 min-[768px]:sticky min-[768px]:top-32">
            <h2 className="font-serif italic text-3xl min-[768px]:text-4xl tracking-tight leading-[1.1] text-gray-900">
              Ad creation for 100 million global businesses, unified across three apps and three design systems.
            </h2>
          </div>
          <div className="min-[768px]:col-span-7 min-[768px]:col-start-6">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">What I Did</h2>
            <div className="space-y-6">
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              Over 100 million businesses actively message customers every
              month across Messenger, Instagram, and Meta Business Suite. I
              devised a strategy to add permanent ad creation entry points
              into each inbox, linking the place businesses chat with
              customers to the best tool for reaching more of them.
            </p>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              I was design lead and main touchpoint for five projects across
              seven teams. Each app had its own design system, approvals
              process, and roadmap. I worked directly with each team&rsquo;s
              designers and PMs, going through their review cycles and making
              concessions where possible to fit each app&rsquo;s established
              visual design. We shipped Messenger first, then used that data
              to make the case on Instagram and MBS.
            </p>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              On desktop, the Automations team had invested heavily in their
              button placement within Unified Inbox, and the inbox team was
              unwilling to shrink it. I designed two variations of the top
              nav and created a rule that swapped between them based on daily
              message volume: low&#8209;volume businesses see ads promoted,
              high&#8209;volume businesses see automations.
            </p>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              I also worked with the Messenger Design System team to redesign
              the megaphone icon suite from scratch. The original icon had not
              been updated since the birth of Messenger and didn&rsquo;t
              appear anywhere in the app. I selected the final icon, QP, and
              illustrations that now ship in MDS.
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Work — before / after */}
      <section className="mt-16 border-b border-ethos-blue/20 pb-16">

        {/* Before */}
        <div className="flex flex-col min-[768px]:flex-row gap-8 min-[768px]:gap-12 items-center">
          <div className="w-full min-[768px]:w-2/3">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">Before</h2>
            <Image
              src="/work/inbox-ads/before.png"
              alt="Original inbox experiences with no path to ad creation"
              width={2395}
              height={1859}
              className="w-full"
              unoptimized
            />
          </div>
          <div className="w-full min-[768px]:w-1/3">
            <div className="border-l border-ethos-blue/30 pl-6 py-4">
              <h3 className="font-serif italic text-2xl mb-3">The Gap</h3>
              <p className="font-serif text-[16px] leading-[1.6] text-gray-600">
                No path from inbox to ad creation. Businesses had to leave the place they spend most of their time to create messaging ads.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <AnimateDivider />

        {/* After */}
        <div className="flex flex-col min-[768px]:flex-row-reverse gap-8 min-[768px]:gap-12 items-center">
          <div className="w-full min-[768px]:w-2/3">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">After</h2>
            <Image
              src="/work/inbox-ads/after.png"
              alt="New inbox experiences with permanent entry points and ad creation flows"
              width={2397}
              height={1859}
              className="w-full"
              unoptimized
            />
          </div>
          <div className="w-full min-[768px]:w-1/3">
            <div className="border-l border-ethos-blue/30 pl-6 py-4">
              <h3 className="font-serif italic text-2xl mb-3">The Solution</h3>
              <p className="font-serif text-[16px] leading-[1.6] text-gray-600">
                Permanent entry points in primary navigation across all three inboxes, linking businesses directly to messaging ad creation with introductory NUX experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="mt-16">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-10">Design Principles</h2>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-16">
          <div className="space-y-5">
            <span className="font-serif italic text-ethos-blue text-6xl block">I.</span>
            <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">Top&#8209;level placement</h3>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
              Place the entry point in primary navigation, not buried in a
              menu. Our experiments showed a top&#8209;level icon gets 18x
              the click&#8209;through rate of a menu placement.
            </p>
          </div>
          <div className="space-y-5">
            <span className="font-serif italic text-ethos-blue text-6xl block">II.</span>
            <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">Permanent over ephemeral</h3>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
              A permanent icon is always accessible when a business is ready
              to act. Unlike upsells which rely on catching someone at the
              right moment and in the right mindset, a permanent entry point
              never disappears.
            </p>
          </div>
          <div className="space-y-5">
            <span className="font-serif italic text-ethos-blue text-6xl block">III.</span>
            <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">Reduce ad product competition</h3>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
              In traditional ad creation, messaging ads compete against every
              other ad type. Starting from inbox lets us assume messaging
              intent and default to the right goal, so businesses no longer
              have to find the right product themselves.
            </p>
          </div>
        </div>
      </section>

      {/* Back to Index */}
      <BackToIndex />
    </div>
  );
}
