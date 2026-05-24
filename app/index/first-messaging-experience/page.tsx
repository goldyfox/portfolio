import type { Metadata } from "next";
import { BackButton } from "@/components/portfolio/back-button";
import { ScrollSpyTrigger } from "@/components/portfolio/scroll-spy-trigger";
import { CaseRevealObserver } from "@/components/portfolio/case-reveal-observer";
import { BackToIndex } from "@/components/portfolio/back-to-index";
import { UnifiedFlowSection } from "@/components/portfolio/unified-flow-section";
import { MobileScreenPlaceholder } from "@/components/portfolio/mobile-screen-placeholder";
import { briefs } from "@/lib/content/briefs";

const brief = briefs.find((b) => b.id === "first-messaging-experience")!;

export const metadata: Metadata = {
  title: `Lisa Aufox | ${brief.title}`,
};

export default function FirstMessagingExperience() {
  return (
    <div className="relative flex flex-1 flex-col pb-16 min-[975px]:pb-24">
      <CaseRevealObserver />
      <BackButton />

      {/* Hero */}
      <header className="mb-macro relative z-10">
        <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-ethos-blue mb-8 block">
          Meta, {brief.year}
        </span>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-12 items-start">
          <div className="min-[768px]:col-span-8">
            <ScrollSpyTrigger title={brief.title} />
            <h1 className="font-serif italic leading-none text-gray-900 mb-8">
              <span className="block text-5xl min-[768px]:text-[5.5rem] leading-[1.05] tracking-tight">
                First messaging experience
              </span>
              <span className="block text-5xl min-[768px]:text-[5.5rem] leading-[1.05] tracking-tight ml-[10vw]">
                in Messenger.
              </span>
            </h1>
            <p className="font-serif text-xl max-w-2xl leading-relaxed text-gray-600">
              Icebreakers on Facebook&apos;s bottom sheet consistently
              outperformed Messenger&apos;s — despite an outdated UI. Neither
              platform looked like the other, behaved the same, or had the same
              performance. I led the redesign to create a consistent, engaging
              first-message experience across both.
            </p>
          </div>
          <div className="min-[768px]:col-span-4">
            <p className="font-serif italic text-3xl text-gray-900 mb-6">
              +$10M/yr. Redesign, not rebuild.
            </p>
            <div className="border-t border-ethos-blue/20 pt-4 space-y-4 max-w-[26rem]">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Role</p>
                <p className="font-sans text-[13px] text-gray-800">Lead designer</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Team</p>
                <p className="font-sans text-[13px] text-gray-800">2 product designers, 1 content designer, engineering</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Surfaces</p>
                <p className="font-sans text-[13px] text-gray-800">Messenger, Facebook (bottom sheet)</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Outcome</p>
                <p className="font-sans text-[13px] text-gray-800">Unified UI shipped; evolved into consumer suggested messages</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-ethos-blue mt-12" />
      </header>

      {/* Part 1: Two platforms, two problems */}
      <section className="mb-macro relative z-10 case-reveal">
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-8 items-start">
          <div className="min-[768px]:col-span-4 border-l border-ethos-blue pl-6 min-[768px]:sticky min-[768px]:top-32 z-10">
            <h2 className="font-serif italic text-[30px] text-gray-900 mb-4">Two platforms, two problems</h2>
            <p className="font-serif text-base text-gray-600 leading-relaxed">
              Facebook&apos;s bottom sheet icebreakers had higher CTR than
              Messenger&apos;s despite looking visually dated. Messenger&apos;s
              version was more modern but generated less engagement. Two
              platforms, two interaction models, two performance profiles — and
              no shared understanding of why one outperformed the other.
            </p>
          </div>
          <div className="min-[768px]:col-span-8 relative flex flex-col min-[768px]:flex-row items-center justify-center gap-10">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-4">
                Before — Facebook bottom sheet
              </p>
              <MobileScreenPlaceholder placeholder="[FB bottom sheet screenshot]" />
            </div>
            <div className="min-[768px]:mt-24">
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-4">
                Before — Messenger
              </p>
              <MobileScreenPlaceholder placeholder="[Messenger screenshot]" />
            </div>
          </div>
        </div>
      </section>

      <UnifiedFlowSection
        synthesis="The final design merged platform-native motion with a shared visual language — one icebreaker pattern that reads consistently in Messenger threads and Facebook bottom sheets, without forcing either surface to behave like the other."
        metrics={[
          { label: "Incremental revenue", value: "+$10M/yr" },
          { label: "CTR lift", value: "TBD" },
        ]}
        tags={["Messenger", "Facebook bottom sheet", "Icebreakers"]}
        videoPlaceholder="[Unified flow — video]"
      />

      {/* Part 2: The Experiment */}
      <section className="mb-macro relative z-10 case-reveal">
        <div className="mb-16 max-w-3xl">
          <h2 className="font-serif italic text-[40px] text-gray-900 mb-6">The Experiment</h2>
          <p className="font-serif text-lg text-gray-600 leading-relaxed">
            We ran an A/B/Control experiment to test two interaction patterns:
            one with an icon affordance and one without. The control was the
            existing experience.
          </p>
        </div>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-10 relative">
          <div className="flex flex-col items-center">
            <MobileScreenPlaceholder placeholder="[Control screenshot]" />
            <div className="mt-8 text-center border-b border-ethos-blue/30 pb-4 w-full max-w-xs">
              <h3 className="font-sans uppercase text-sm tracking-[0.15em] text-ethos-blue mb-2">Control</h3>
              <p className="font-serif text-sm text-gray-600">Existing experience, no changes.</p>
            </div>
          </div>
          <div className="flex flex-col items-center min-[768px]:pt-24">
            <MobileScreenPlaceholder placeholder="[Variant A — with icon]" />
            <div className="mt-8 text-center border-b border-ethos-blue/30 pb-4 w-full max-w-xs">
              <h3 className="font-sans uppercase text-sm tracking-[0.15em] text-ethos-blue mb-2">Variant A</h3>
              <p className="font-serif text-sm text-gray-600">Icon affordance signals interactivity.</p>
            </div>
          </div>
          <div className="flex flex-col items-center min-[768px]:pt-48">
            <MobileScreenPlaceholder placeholder="[Variant B — no icon]" />
            <div className="mt-8 text-center border-b border-ethos-blue/30 pb-4 w-full max-w-xs">
              <h3 className="font-sans uppercase text-sm tracking-[0.15em] text-ethos-blue mb-2">Variant B</h3>
              <p className="font-serif text-sm text-gray-600">Text-only, cleaner but less discoverable.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-l-4 border-ethos-blue pl-8 py-6 max-w-3xl">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue mb-3">
            Edge case: Multi-tap on bottom sheet
          </h3>
          <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
            On the Facebook bottom sheet, users could tap more than one
            icebreaker before dismissing. This created a compound-selection
            behavior that didn&apos;t exist on Messenger. We had to decide
            whether to preserve, constrain, or redesign it.
          </p>
        </div>
      </section>

      {/* Part 3: Design Decisions */}
      <section
        className="mb-macro relative case-reveal bg-[#f9f7f3] py-24 px-6 min-[975px]:px-10 -mx-6 min-[975px]:-mx-10 border-y border-ethos-blue/10"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          paddingLeft: "calc(50vw - 50% + 1.5rem)",
          paddingRight: "calc(50vw - 50% + 1.5rem)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif italic text-[40px] text-gray-900 mb-16">Design Decisions</h2>
          <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-16">
            <div className="space-y-5">
              <span className="font-serif italic text-ethos-blue text-6xl block">I.</span>
              <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">Animation patterns</h3>
              <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
                Messenger and the Facebook bottom sheet have different motion
                languages. The icebreaker reveal, tap feedback, and dismiss
                animations had to feel native to each platform while maintaining
                visual consistency in the resting state.
              </p>
            </div>
            <div className="space-y-5">
              <span className="font-serif italic text-ethos-blue text-6xl block">II.</span>
              <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">Messenger system fit</h3>
              <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
                Messenger has strict component patterns and spacing rules. The
                icebreaker UI needed to feel like a first-class citizen of the
                chat thread, not a bolted-on ad surface.
              </p>
            </div>
            <div className="space-y-5">
              <span className="font-serif italic text-ethos-blue text-6xl block">III.</span>
              <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">Suggested messages</h3>
              <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
                The unified design became the foundation for consumer suggested
                messages — ongoing conversational pills that persist beyond the
                first interaction. What started as a one-shot prompt evolved into
                a sustained engagement pattern.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What shipped */}
      <section className="relative z-10 mb-macro case-reveal">
        <div className="grid grid-cols-1 min-[975px]:grid-cols-12 gap-16 items-center">
          <div className="min-[975px]:col-span-5 order-2 min-[975px]:order-1">
            <h2 className="font-serif italic text-[40px] text-gray-900 mb-6">What shipped</h2>
            <p className="font-serif text-lg text-gray-600 leading-relaxed mb-8">
              A unified first-message experience across Messenger and Facebook.
              The winning variant shipped to both platforms, and the pattern
              evolved into ongoing consumer suggested messages — extending
              engagement beyond the initial prompt.
            </p>
            <div className="bg-ethos-blue/5 border border-ethos-blue/20 p-8 mb-8 relative overflow-hidden group">
              <h4 className="font-sans uppercase text-[11px] tracking-[0.2em] text-ethos-blue mb-4">Outcome</h4>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end border-b border-ethos-blue/10 pb-2">
                  <span className="font-serif text-sm text-gray-600">CTR lift</span>
                  <span className="font-serif italic text-2xl text-ethos-blue">TBD</span>
                </div>
                <div className="flex justify-between items-end border-b border-ethos-blue/10 pb-2">
                  <span className="font-serif text-sm text-gray-600">Interaction rate</span>
                  <span className="font-serif italic text-2xl text-ethos-blue">TBD</span>
                </div>
              </div>
            </div>
          </div>
          <div className="min-[975px]:col-span-7 relative order-1 min-[975px]:order-2 flex justify-center">
            <div className="relative w-full max-w-2xl aspect-[16/10] bg-gray-900 overflow-hidden shadow-[0_30px_60px_rgba(19,19,236,0.15)] flex items-center justify-center">
              <p className="font-sans text-[13px] text-gray-400 italic">
                [Final shipped flow — video]
              </p>
            </div>
          </div>
        </div>
      </section>

      <BackToIndex />
    </div>
  );
}
