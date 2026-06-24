import type { Metadata } from "next";
import { BackButton } from "@/components/portfolio/back-button";
import { ScrollSpyTrigger } from "@/components/portfolio/scroll-spy-trigger";
import { CaseRevealObserver } from "@/components/portfolio/case-reveal-observer";
import { BackToIndex } from "@/components/portfolio/back-to-index";
import { UnifiedFlowSection } from "@/components/portfolio/unified-flow-section";
import { MobileScreenPlaceholder } from "@/components/portfolio/mobile-screen-placeholder";
import { RevealOnScroll } from "@/components/portfolio/reveal-on-scroll";
import { AnimateMetrics } from "@/components/portfolio/animate-metrics";
import { SITE_CONTENT_SHELL } from "@/lib/site-layout";
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
              <span className="block text-5xl min-[768px]:text-[5.5rem] leading-[1.05]">
                Unified first
              </span>
              <span className="block text-5xl min-[768px]:text-[5.5rem] leading-[1.05]">
                messaging experience
              </span>
            </h1>
            <p className="font-serif text-xl max-w-2xl leading-relaxed text-gray-600">
              Icebreakers on Facebook&apos;s bottom sheet consistently
              outperformed Messenger&apos;s — despite an outdated UI. Neither
              platform looked like the other, behaved the same, or had the same
              performance. I led the redesign to create a consistent, engaging
              first-message experience across both surfaces.
            </p>
          </div>
          <div className="min-[768px]:col-span-4">
            <p className="font-serif italic text-3xl text-gray-900 mb-6">
              The $10M redesign.
            </p>
            <div className="border-t border-ethos-blue/20 pt-4 space-y-4 max-w-[26rem]">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Role</p>
                <p className="font-sans text-[13px] text-gray-800">Lead designer</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Team</p>
                <p className="font-sans text-[13px] text-gray-800">2 product designers, 3 engineers, 0 PMs</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Surfaces</p>
                <p className="font-sans text-[13px] text-gray-800">Messenger, Facebook (bottom sheet)</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Outcome</p>
                <p className="font-sans text-[13px] text-gray-800">Shipped a unified icebreaker UI based on Messenger&apos;s design system across both Messenger and Facebook, incorporating new motion patterns, for a $10M incremental revenue gain.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Curved text wrap — context + technical debt */}
      <section className="mb-macro relative z-10 case-reveal">
        <div className="border-t border-ethos-blue pt-4 mb-12 shimmer-line">
          <h2 className="font-serif italic text-3xl text-ethos-blue">
            Problem and Constraints
          </h2>
        </div>
        <div className="curved-text-wrap relative font-serif text-[18px] leading-[1.7] text-gray-800">
          <div className="curved-text-shape-right">
            <video
              src="/work/fmux/icebreaker-curved-intro.mov"
              autoPlay
              loop
              muted
              playsInline
              className="max-w-[70%]"
              style={{ clipPath: "inset(10px)", transform: "translate(50px, 5%)" }}
            />
          </div>
          <p className="mb-6">
            Icebreakers (the suggested conversation starters that appear when
            a user taps into a messaging ad) existed on two surfaces: the
            Facebook bottom sheet and the Messenger thread. They started out
            using the same design pattern, but
            Messenger&apos;s design system kept evolving while Facebook&apos;s
            bottom sheet, once built, was never updated. There was no shared codebase
            between surfaces, so every update meant building twice.
          </p>
          <p className="mb-6">
            The bottom sheet was visually dated: tight spacing, no
            animation, dated patterns. Messenger looked sleeker, with better type
            hierarchy, a cleaner layout, and the current design system. By every
            measure, Messenger should have been the stronger performer.
          </p>
          <p className="mb-6">
            Facebook&apos;s bottom sheet consistently outperformed Messenger
            surfaces in both CTR and downstream revenue. The outdated UI was
            generating more first messages than any test that updated it to
            match Messenger.
          </p>
          <p className="mb-6">
            I theorized the design lever that made the most impact was the
            &ldquo;send&rdquo; icon — visible on the bottom sheet, but missing
            from Messenger. A small affordance that made it clear that tapping
            would fire a message. In contrast, Messenger showed them as
            centered pills, with no icon to signal they could be tapped. The
            better-looking surface was less discoverable.
          </p>
          <p>
            Design leadership thought the send icon was visually noisy and
            should come out of any redesign. My instinct said the opposite —
            that the icon was the revenue lever, a visual cue doing most of the
            work. Removing it would clean up the surface but
            quietly lower performance. I proposed an experiment that tested
            both within an updated visual system. One variant kept the
            icon, the other dropped it.
          </p>
        </div>
      </section>

      {/* Before states */}
      <section className="mb-macro relative z-10 case-reveal">
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-8 items-start">
          <div className="min-[768px]:col-span-4 border-l border-ethos-blue pl-6 min-[768px]:sticky min-[768px]:top-32 z-10">
            <h2 className="font-serif italic text-[30px] text-gray-900 mb-4">Before states</h2>
            <p className="font-serif text-lg text-gray-600 leading-relaxed">
              The two messaging surfaces displayed icebreakers in different ways.
              Facebook&apos;s bottom sheet showed them in a static list with a send
              icon, letting users tap several messages to send. Messenger placed
              them as centered pills at the bottom of the thread, no icon, and
              dismissed all options after tapping one. The two versions have very
              different layouts, reflected in their very different performance.
            </p>
          </div>
          <div className="min-[768px]:col-span-8 relative flex flex-col min-[768px]:flex-row items-center justify-center gap-10">
            <RevealOnScroll>
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-4">
                Before — Facebook bottom sheet
              </p>
              <MobileScreenPlaceholder
                src="/work/fmux/fb-before.png"
                alt="Facebook bottom sheet icebreakers before the redesign"
                bakedShadow
                imageScale={1.037}
              />
            </RevealOnScroll>
            <RevealOnScroll delay={200} className="min-[768px]:mt-24">
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-4">
                Before — Messenger
              </p>
              <MobileScreenPlaceholder
                src="/work/fmux/msgr-before.png"
                alt="Messenger icebreakers before the redesign"
              />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <UnifiedFlowSection
        title="Messenger, redesigned"
        synthesisTitle="What changed"
        synthesis="The redesign extended Messenger's design system with a secondary pill variant: new type, spacing, color, and tap animations. The old white pills looked pasted on top of the thread; the new ones sit on the right, in the sender's side of the conversation, where a reply belongs. Both key elements carried over from the originals: the pill shape from Messenger, which reads as a distinct, tappable object, and the send icon from the Facebook bottom sheet, which signals that tapping will fire a message."
        videoSrc="/work/fmux/flow-msgr-web.mp4"
        videoLabel="Messenger"
        portrait
      />

      {/* Part 2: The Experiment */}
      <section className="mb-macro relative z-10 case-reveal">
        <div className="border-t border-ethos-blue pt-4 mb-12 shimmer-line">
          <h2 className="font-serif italic text-3xl text-ethos-blue">
            The Experiment
          </h2>
        </div>
        <div className="mb-16 max-w-3xl">
          <p className="font-serif text-lg text-gray-600 leading-relaxed">
            We ran an A/B/Control experiment to test two patterns:
            one with an icon affordance and one without. The control was the
            existing experience.
          </p>
        </div>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-10 relative">
          <div className="flex flex-col items-center">
            <MobileScreenPlaceholder
              src="/work/fmux/msgr-before.png"
              alt="Messenger control — existing icebreaker experience"
            />
            <div className="mt-8 text-center border-b border-ethos-blue/30 pb-4 w-full max-w-xs">
              <h3 className="font-sans uppercase text-sm tracking-[0.15em] text-ethos-blue mb-2">Control</h3>
              <p className="font-serif text-sm text-gray-600">Existing experience, no changes.</p>
            </div>
          </div>
          <div className="flex flex-col items-center min-[768px]:pt-24">
            <MobileScreenPlaceholder
              src="/work/fmux/variant-a-msgr.png"
              alt="Messenger variant A — icebreakers with send icon affordance"
            />
            <div className="mt-8 text-center border-b border-ethos-blue/30 pb-4 w-full max-w-xs">
              <h3 className="font-sans uppercase text-sm tracking-[0.15em] text-ethos-blue mb-2">Variant A</h3>
              <p className="font-serif text-sm text-gray-600">Icon affordance signals interactivity.</p>
            </div>
            <span className="mt-4 inline-block font-sans text-[10px] font-bold uppercase tracking-[0.2em] bg-ethos-blue text-ethos-cream px-3 py-1 rounded-full">
              Winner
            </span>
          </div>
          <div className="flex flex-col items-center min-[768px]:pt-48">
            <MobileScreenPlaceholder
              src="/work/fmux/variant-b-msgr.png"
              alt="Messenger variant B — icebreakers without send icon"
            />
            <div className="mt-8 text-center border-b border-ethos-blue/30 pb-4 w-full max-w-xs">
              <h3 className="font-sans uppercase text-sm tracking-[0.15em] text-ethos-blue mb-2">Variant B</h3>
              <p className="font-serif text-sm text-gray-600">Text only, cleaner but similar to a sent message.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 3: Design Principles */}
      <section
        className="mb-macro relative case-reveal bg-[#f9f7f3] py-24 border-y border-ethos-blue"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        <div className={SITE_CONTENT_SHELL}>
          <div className="border-t border-ethos-blue pt-4 mb-12 shimmer-line">
            <h2 className="font-serif italic text-3xl text-ethos-blue">
              Design Principles
            </h2>
          </div>
          <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-16">
            <div className="space-y-5">
              <span className="font-serif italic text-ethos-blue text-6xl block">I.</span>
              <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">Interaction drives revenue</h3>
              <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
                Design leadership wanted the send icon removed, viewing it as
                visual noise on an otherwise clean pill. My hypothesis was the
                opposite: that the icon made the pill read as a button, not as a
                message bubble. Simplicity is usually preferable and icons are
                often seen as &ldquo;decorative,&rdquo; but in this instance I
                believed it was doing a lot of heavy lifting to indicate an
                interactive element. Both arguments were valid, therefore I
                pulled resources to test both versions and let the data decide.
              </p>
            </div>
            <div className="space-y-5">
              <span className="font-serif italic text-ethos-blue text-6xl block">II.</span>
              <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">New component that scales</h3>
              <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
                The old icebreaker pill in Messenger, a white pill with blue text,
                only existed for messaging ads and was never integrated into the
                design system. To reach alignment with the Messenger team, we
                proposed replacing the one-off pill with a net-new component,
                giving the system a primary and a secondary pill variant that
                could be reused across other use cases and hold an optional icon.
                To gain Facebook agreement (a separate surface with a different
                design system), we framed the bottom sheet redesign as a 1:1
                render of Messenger rather than native FB UI.
              </p>
            </div>
            <div className="space-y-5">
              <span className="font-serif italic text-ethos-blue text-6xl block">III.</span>
              <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">Preserve existing features</h3>
              <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
                On the bottom sheet, users could tap several pills before
                dismissing the overlay, and the data was clear: multi-send
                icebreakers drive more first messages and more revenue. The
                redesign couldn&apos;t quietly drop it without impacting our hero
                metrics. So instead of flattening it to a single tap to mirror the
                Messenger version, we designed an animated tap interaction that
                preserves the multi-send behavior: tap any icebreaker and the
                remaining options slide into a re-ordered list, so another
                icebreaker can be selected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="relative z-10 mb-macro case-reveal">
        <h2 className="font-serif italic text-3xl text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">
          Impact
        </h2>
        <AnimateMetrics
          metrics={[
            { value: "+$10M", label: "Incremental revenue" },
            { value: "+0.40%", label: "CTR (SS+)" },
            { value: "+0.25%", label: "Conversions (SS+)" },
          ]}
          className="grid-cols-1 min-[768px]:grid-cols-3"
        />
      </section>

      {/* Conclusion */}
      <section className="relative z-10 mb-macro case-reveal">
        <div className="pt-8 mb-16 text-center">
          <h2 className="font-serif italic text-3xl text-ethos-blue border-b border-ethos-blue pb-4 inline-block px-12">
            Conclusion
          </h2>
        </div>
        <div className="flex flex-col items-center min-[975px]:flex-row min-[975px]:items-start min-[975px]:justify-center gap-12 min-[975px]:gap-20">
          <div className="flex flex-col gap-8 min-[975px]:max-w-md min-[975px]:self-start min-[975px]:sticky min-[975px]:top-32 order-2 min-[975px]:order-1">
            <div className="space-y-6">
              <p className="font-serif text-lg text-gray-600 leading-relaxed">
                It&apos;s often difficult for designers to prove the monetary
                value of redesigning an existing feature over building a net-new
                component with new opportunities to drive revenue or engagement.
                This project is the perfect example of a designer-driven
                initiative that we knew would improve the overall product and
                drive impact, but required an extra push to get the engineering
                resources to build and test it.
              </p>
              <p className="font-serif text-lg text-gray-600 leading-relaxed">
                The design sat handoff-ready for six months before the opportunity
                presented itself to attach the redesign to another proposed
                project that would extend the new component&apos;s value and
                feasibility, unlocking engineering investment.
              </p>
              <p className="font-serif text-lg text-gray-600 leading-relaxed">
                While my engineering team was surprised that a redesign alone
                could drive incremental ads revenue, I wasn&apos;t. I&apos;m a
                firm believer that the right design can improve the user
                experience and encourage consumers to move through the touchpoints
                that help small businesses go from lead to conversion.
              </p>
            </div>
          </div>
          <div className="shrink-0 order-1 min-[975px]:order-2">
            <div className="flex flex-col items-center">
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-4">
                FB bottom sheet with multi-tap
              </p>
              <div
                className="relative flex shrink-0 h-[min(760px,75vh)]"
                style={{ filter: "drop-shadow(0 0 7.5px rgba(0, 0, 0, 0.25))" }}
              >
                <video
                  src="/work/fmux/flow-bottomsheet-sdr.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-auto"
                  style={{ clipPath: "inset(2px round 30px)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <BackToIndex />
    </div>
  );
}
