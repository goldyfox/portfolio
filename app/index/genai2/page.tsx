import type { Metadata } from "next";
import Image from "next/image";
import { BackButton } from "@/components/portfolio/back-button";
import { ScrollSpyTrigger } from "@/components/portfolio/scroll-spy-trigger";
import { CaseRevealObserver } from "@/components/portfolio/case-reveal-observer";
import { briefs } from "@/lib/content/briefs";

const brief = briefs.find((b) => b.id === "genai-conversations")!;

export const metadata: Metadata = {
  title: `Lisa Aufox | ${brief.title} (Layout 2)`,
};

export default function GenAi2() {
  return (
    <div className="relative flex flex-1 flex-col pb-16 min-[975px]:pb-24">
      <CaseRevealObserver />
      <BackButton />

      {/* Hero */}
      <section id="context" className="mb-[160px] relative case-reveal scroll-mt-28">
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[800px] w-[800px] rounded-full border border-ethos-blue opacity-[0.08]"
          aria-hidden
        />
        <div className="flex flex-col">
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-ethos-blue mb-8">
            Generative Templates / Meta Business AI
          </span>
          <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-12 items-start">
            <div className="min-[768px]:col-span-8">
              <ScrollSpyTrigger title={brief.title} />
              <h1 className="font-serif italic leading-none text-gray-900 mb-12">
                <span className="block text-5xl min-[768px]:text-[5.5rem] leading-[1.05] tracking-tight">
                  Less Work, Better Ads
                </span>
                <span className="block text-5xl min-[768px]:text-[5.5rem] leading-[1.05] tracking-tight ml-[10vw]">
                  with Generative AI.
                </span>
              </h1>
              <div className="border-l-4 border-ethos-blue pl-8 py-4">
                <div className="font-serif italic text-[clamp(3.5rem,10vw,8rem)] leading-[0.8] tracking-tighter text-ethos-blue font-black">
                  96%
                </div>
                <p className="font-sans text-[14px] uppercase tracking-[0.2em] mt-4 text-gray-900">
                  GenAI adoption across launched surfaces
                </p>
              </div>
            </div>
            <div className="min-[768px]:col-span-4">
              <p className="font-serif text-xl max-w-sm leading-relaxed text-gray-600">
                Meta&apos;s messaging ads span Messenger, Instagram, and
                WhatsApp — driving $8.2B in revenue. The ad creation model
                hadn&apos;t kept pace; advertisers were still struggling to build messaging
                experiences manually. I redesigned the creation flow so
                advertisers are responsible for content approval, not content
                generation.
              </p>
              <div className="border-t border-ethos-blue/20 pt-4 mt-6 space-y-4">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Role</p>
                  <p className="font-sans text-[13px] text-gray-800">Lead designer</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Team</p>
                  <p className="font-sans text-[13px] text-gray-800">4 product designers, 3 engineers, 1 data scientist, 0 PMs</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Surfaces</p>
                  <p className="font-sans text-[13px] text-gray-800">
                    Ads Manager, Messenger, WhatsApp, Instagram
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 1: The Thesis */}
      <section className="mb-[160px] case-reveal">
        <div className="border-t border-ethos-blue pt-4 mb-20 shimmer-line">
          <h2 className="font-serif italic text-3xl text-ethos-blue">
            Part 1: The Thesis
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[975px]:grid-cols-2 gap-20 mb-20">
          <div>
            <blockquote className="relative mb-20">
              <span
                className="font-serif text-8xl absolute -top-10 -left-6 opacity-10 text-ethos-blue"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="font-serif italic text-3xl min-[768px]:text-4xl leading-snug text-gray-900">
                The most unclear part was the goal of getting people to chat
                with me on Messenger and how this set up enables
                that. <cite className="font-sans text-[11px] uppercase tracking-[0.2em] not-italic text-gray-500 align-middle">— USABILITY TEST PARTICIPANT, BRAZIL</cite>
              </p>
            </blockquote>
            <div className="space-y-0">
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue mb-4">Before redesign</p>
              <div className="border-t border-ethos-blue/30 w-1/2 pt-4 pb-6">
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">
                  Usability score
                </p>
                <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] leading-none font-light text-gray-400 tabular-nums">
                  64
                </span>
              </div>
              <div className="border-t border-ethos-blue/30 w-1/2 pt-4 pb-6">
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">
                  Task completion
                </p>
                <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] leading-none font-light text-gray-400 tabular-nums">
                  61%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              The interface where advertisers configure their messaging ads
              was measurably failing — but getting it fixed meant aligning
              four groups with fundamentally different priorities:
            </p>
            <ul className="space-y-3 font-serif text-[18px] leading-[1.6] text-gray-800 list-disc pl-5">
              <li>A design program that prioritizes usability</li>
              <li>An Ads Manager platform that values opinionated defaults over flat architecture</li>
              <li>Messaging Ads teams that only resource what drives revenue impact</li>
              <li>A company-wide AI initiative that needed a foundation to ship on</li>
            </ul>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              Each had a reason to care about this surface, but none were
              aligned on what &ldquo;fixing it&rdquo; meant. My thesis was
              simple: the creation model was the problem, not the interface.
              If advertisers stopped writing content and started reviewing
              what AI generated for them, usability, ad performance, and AI
              adoption would all improve at once.
            </p>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
              I linked the competing priorities into one program: the
              usability failure justified a North Star redesign, the North
              Star set the stage for generative AI, and participation in
              executive-led initiatives gave the whole thing visibility and
              resourcing from six teams.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue mb-4">After</p>
          <div className="grid grid-cols-2 min-[975px]:grid-cols-4 gap-4">
          <div className="bg-gray-100 text-gray-900 p-8 min-[768px]:p-10 aspect-square flex flex-col justify-between">
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue">
              01 &nbsp;/&nbsp; Usability Peer Benchmarking
            </span>
            <p className="font-serif italic text-5xl min-[768px]:text-7xl text-ethos-blue">
              85
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.1em] leading-relaxed text-gray-600">
              Passing usability score
            </p>
          </div>
          <div className="bg-ethos-blue text-ethos-cream p-8 min-[768px]:p-10 aspect-square flex flex-col justify-between">
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] opacity-70">
              02 &nbsp;/&nbsp; Usability Peer Benchmarking
            </span>
            <p className="font-serif italic text-5xl min-[768px]:text-7xl">
              100%
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.1em] leading-relaxed opacity-80">
              Task completion on retest
            </p>
          </div>
          <div className="bg-gray-50 text-gray-900 p-8 min-[768px]:p-10 aspect-square flex flex-col justify-between">
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue">
              03 &nbsp;/&nbsp; Experiment results
            </span>
            <p className="font-serif italic text-5xl min-[768px]:text-7xl text-ethos-blue">
              96%
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.1em] leading-relaxed text-gray-600">
              GenAI adoption rate
            </p>
          </div>
          <div className="bg-ethos-blue text-ethos-cream p-8 min-[768px]:p-10 aspect-square flex flex-col justify-between">
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] opacity-70">
              04 &nbsp;/&nbsp; Experiment results
            </span>
            <p className="font-serif italic text-5xl min-[768px]:text-7xl">
              +74%
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.1em] leading-relaxed opacity-80">
              Conversations started with GenAI
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* Part 2: The Interaction Flip */}
      <section id="solution" className="mb-[160px] case-reveal scroll-mt-28">
        <div className="border-t border-ethos-blue pt-4 mb-12 shimmer-line">
          <h2 className="font-serif italic text-3xl text-ethos-blue">
            Part 2: The Interaction Flip
          </h2>
        </div>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-2 gap-12 border-t border-ethos-blue/20 pt-8">
          {/* Before */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500">
                Before
              </span>
              <h3 className="font-serif italic text-4xl min-[768px]:text-5xl text-gray-900 opacity-30">
                Manual Creation
              </h3>
            </div>
            <div className="flex items-start justify-center min-[768px]:min-h-[560px]">
              <Image
                src="/work/genai/message-template-before.png"
                alt="Message Template card — the old interface with flat IA, generic defaults, and buried customization"
                width={1957}
                height={2752}
                className="w-full max-w-[400px]"
                unoptimized
              />
            </div>
            <div className="space-y-4">
              <p className="font-serif text-lg text-gray-800 leading-relaxed">
                Ad set up treated every business the same in a flat
                information architecture. Default prompts
                like &ldquo;Is anyone available to chat?&rdquo; ran regardless
                of what the advertiser sold. Customization was possible, but
                discoverability was low and almost 90% of advertisers never
                changed any content.
              </p>
            </div>
          </div>

          {/* After */}
          <div className="flex flex-col gap-8 min-[768px]:border-l border-ethos-blue/10 min-[768px]:pl-12">
            <div className="flex flex-col gap-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue font-bold">
                After
              </span>
              <h3 className="font-serif italic text-4xl min-[768px]:text-5xl text-ethos-blue">
                AI-Assisted Review
              </h3>
            </div>
            <div className="flex items-center justify-center min-[768px]:min-h-[560px]">
              <Image
                src="/work/genai/chat-builder-after.png"
                alt="Chat Builder — redesigned interface with AI-generated recommended template and contextual icebreakers"
                width={976}
                height={936}
                className="max-w-[400px]"
                unoptimized
              />
            </div>
            <div className="space-y-4">
              <p className="font-serif text-lg text-gray-800 leading-relaxed">
                The redesigned system uses the ad caption and
                business&apos; page content as inputs to Llama 4, which
                generates conversation starters relevant to that specific
                business. If you change the creative, the icebreakers
                regenerate. The advertiser&apos;s new job is to confirm the
                content is relevant, not to write it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="mb-[160px] case-reveal">
        <div className="border-t border-ethos-blue pt-4 mb-12 shimmer-line">
          <h2 className="font-serif italic text-3xl text-ethos-blue">
            What shipped
          </h2>
        </div>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-12">
          <div className="min-[768px]:col-span-5">
            <Image
              src="/work/genai/flow75-changes.gif"
              alt="Chat Builder in Ads Manager — showing the redesigned ad creation flow in context"
              width={1024}
              height={788}
              className="w-full"
              unoptimized
            />
          </div>
          <div className="min-[768px]:col-span-7 space-y-6 font-serif text-[18px] leading-[1.6] text-gray-800">
            <p>
              The redesign launched with neutral ad performance — the primary
              guardrail on a surface that drives $8.2B in revenue. Proving we
              didn&apos;t break anything was the prerequisite for everything
              that came next.
            </p>
            <p>
              Previous testing had revealed that custom welcome messages had
              negligible impact on ad outcomes, while AI-generated icebreakers
              actually outperformed manual inputs. That data justified
              shifting the task definition entirely: advertisers now confirm
              that generated content is relevant to their ad, rather than
              writing it from scratch.
            </p>
            <p>
              84% of active advertisers globally are on the redesigned
              surface. The new architecture cleared the path for future GenAI
              features without requiring another foundational overhaul.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
