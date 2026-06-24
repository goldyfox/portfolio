import type { Metadata } from "next";
import Image from "next/image";
import { BackButton } from "@/components/portfolio/back-button";
import { BackToIndex } from "@/components/portfolio/back-to-index";
import { ScrollSpyTrigger } from "@/components/portfolio/scroll-spy-trigger";
import { VoiceSpectrum } from "@/components/portfolio/voice-spectrum";
import { AvaChatEmbed } from "@/components/portfolio/ava-chat-embed";
import { briefs } from "@/lib/content/briefs";

const brief = briefs.find((b) => b.id === "virtual-agent")!;

export const metadata: Metadata = {
  title: `Lisa Aufox | ${brief.title}`,
};

export default function VirtualAgent() {
  return (
    <div className="flex flex-1 flex-col py-16 min-[975px]:py-24">
      <BackButton />

      {/* Hero */}
      <header className="pb-24 min-[768px]:pb-[120px]">
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
            <p className="font-serif italic text-xl min-[768px]:text-2xl tracking-tight leading-[1.2] text-gray-900 mb-6">
              From zero automation to 86% of issues resolved in under four minutes.
            </p>
            <div className="border-t border-ethos-blue/20 pt-4 space-y-4">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Role</p>
                <p className="font-sans text-[13px] text-gray-800">Lead designer &amp; researcher</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Team</p>
                <p className="font-sans text-[13px] text-gray-800">
                  Cross-functional core pod spanning AI engineering, data science,
                  content, and research.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Prototype */}
      <section className="mb-16">
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-8 items-start">
          <div className="min-[768px]:col-span-4 flex flex-col gap-6 order-2 min-[768px]:order-1">

            <div>
              <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-4">
                Talk to Autodesk Virtual Agent
              </h2>
              <div className="space-y-4">
                <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
                  Gaining engineering alignment for a 0-1 automated chat
                  support required proving the technical viability of intent
                  routing. I built a functional prototype on IBM
                  Watson/BlueMix to demonstrate how an NLP model could handle
                  high-stress software failures and integrate with existing
                  support workflows to reduce case volumes.
                </p>
                <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
                  The demo both validated the architecture and secured
                  cross-functional buy-in to build the core branching logic that
                  ultimately scaled Autodesk Virtual Agent to production.
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-sans uppercase tracking-[0.15em] text-[10px] text-ethos-blue font-medium mb-3">
                Built with
              </h4>
              <div className="flex flex-wrap gap-2">
                {["IBM Watson", "50+ Intents", "Slack API", "BlueMix"].map((tag) => (
                  <span
                    key={tag}
                    className="font-sans text-[9px] uppercase tracking-tight px-2 py-1 border border-ethos-blue/20 text-ethos-blue"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="min-[768px]:col-span-8 order-1 min-[768px]:order-2">
            <AvaChatEmbed />
          </div>
        </div>
      </section>

      {/* Voice & Tone + Spectrum */}
      <section className="border-t border-ethos-blue/20 pt-16 mb-16">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-6">
          Establishing the Voice
        </h2>
        <p className="font-serif text-[18px] leading-[1.6] text-gray-800 mb-12 min-[975px]:max-w-[56%]">
          Moving from prototype to production required a deterministic
          behavioral matrix for the NLP. Instead of relying on subjective voice
          guidelines, user research defined clear boundaries that map
          conversational style directly to resolution efficiency.
        </p>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-12 items-start">
          <div className="min-[768px]:col-span-7 order-2 min-[768px]:order-1">
            <div className="grid grid-cols-1 gap-0">
              {([
                {
                  num: "01",
                  label: "FORMAL",
                  title: "Professional Authority",
                  desc: "Full sentences, no contractions. Reads clear and authoritative; can feel cold at volume.",
                  example: "I understand you are experiencing difficulty with your subscription. I will look into this matter. One moment please.",
                },
                {
                  num: "02",
                  label: "NEUTRAL",
                  title: "Balanced Helper",
                  desc: "Professional but human; contractions where they fit. This one won with most participants.",
                  example: "I can help with that. Let me pull up your subscription details. This should just take a moment.",
                },
                {
                  num: "03",
                  label: "CASUAL",
                  title: "Friendly Guide",
                  desc: "Short, warm lines. Fine for light questions; precision work needs a steadier register.",
                  example: "Sure thing! Let me check on that for you. Hang tight.",
                },
              ] as const).map((style) => (
                <div
                  key={style.num}
                  className="p-6"
                >
                  <span className="font-sans text-[10px] text-ethos-blue mb-3 block">
                    {style.num} / {style.label}
                  </span>
                  <h3 className="font-serif italic text-xl font-semibold mb-2">
                    {style.title}
                  </h3>
                  <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
                    {style.desc}
                  </p>
                  <p className="font-sans text-[13px] italic text-gray-500 mt-3">
                    &ldquo;{style.example}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="min-[768px]:col-span-5 order-1 min-[768px]:order-2">
            <VoiceSpectrum />
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-ethos-blue/20 pt-16 mb-16">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-10">
          Design Principles
        </h2>
        <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-16 items-start">
          <div className="space-y-5">
            <span className="font-serif italic text-ethos-blue text-6xl block">I.</span>
            <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">
              Transparency
            </h3>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
              To establish trust, the virtual agent immediately identifies
              itself as an automated system, states its capabilities upfront,
              and eliminates simulated typing pauses. Because user data shows
              that friction and abandonment occur when expectations are
              mismatched, the interface prioritizes immediate transparency over
              human emulation and ensures a clean and immediate handoff to a
              human agent when system boundaries are reached.
            </p>
          </div>
          <div className="space-y-5">
            <span className="font-serif italic text-ethos-blue text-6xl block">II.</span>
            <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">
              Interpretation and branching
            </h3>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
              The interface must accommodate non-linear real-world inputs,
              resolving shorthand, domain acronyms, and instances where multiple
              intents are packed into a single message. The system structure maps
              complex conversational branching to maintain user context across
              fluid subscription, licensing, and activation journeys, gracefully
              managing unexpected subject changes without resetting the session
              flow.
            </p>
          </div>
          <div className="space-y-5">
            <span className="font-serif italic text-ethos-blue text-6xl block">III.</span>
            <h3 className="font-sans uppercase text-[12px] tracking-[0.2em] font-bold text-gray-900">
              Bounded responses
            </h3>
            <p className="font-serif text-[18px] leading-[1.6] text-gray-800/80">
              User research led to strict boundaries for the NLP. In
              higher-stress situations such as troubleshooting and error
              handling, customers prioritized &ldquo;informative&rdquo; and
              &ldquo;direct&rdquo; interactions. To meet these thresholds, the
              architecture restricts open-ended dialogue. The system executes
              short, deterministic turns with concrete next steps, routing
              cleanly on the first pass to prevent trust-eroding conversational
              loops.
            </p>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="border-t border-ethos-blue/20 pt-16">
        <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-10 gap-y-12 items-start">
          <div className="min-[768px]:col-span-6">
            <div>
              <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-4">
                Establishing global guardrails
              </h2>
              <p className="font-serif text-[18px] leading-[1.6] text-gray-800 mb-8">
                To scale this framework across engineering and content teams,
                qualitative insights were translated into concrete execution
                rules:
              </p>
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif italic text-xl font-semibold mb-2">
                    Zero-Chatter Policy
                  </h3>
                  <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
                    &lsquo;Chatty&rsquo; attributes and forced humor scored in
                    the deep negative during high-stress troubleshooting.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif italic text-xl font-semibold mb-2">
                    Typographic Restraint
                  </h3>
                  <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
                    Emojis and exclamation points eroded perceived technical
                    competence and were banned from the resolution flows.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif italic text-xl font-semibold mb-2">
                    Clarity &gt; Brevity
                  </h3>
                  <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
                    Users preferred slightly longer, structured chunks of text
                    over brief, ambiguous answers.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="min-[768px]:col-span-6">
            <div className="border border-ethos-blue/10 overflow-hidden bg-gray-50 max-w-md min-[768px]:max-w-none mx-auto">
              <Image
                src="/work/virtual-agent/ava-tablet-phone.png"
                width={1024}
                height={614}
                alt="Autodesk Virtual Assistant on tablet and phone, showing production download and trial flows"
                className="w-full h-auto"
              />
            </div>
            <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-500 mt-3 text-center">
              Production AVA on tablet and phone
            </p>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue border-b border-ethos-blue/30 pb-2 mb-10">
            Conclusion
          </h2>
          <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
            The primary goal of introducing this new technology at Autodesk was
            to resolve support issues before they became tickets. By connecting
            intent classification and conversational routing directly to
            Autodesk&rsquo;s backend APIs, the system bypassed typical support
            wait times to offer users immediate, 24/7 service. It successfully
            resolved 86% of handled issues in under four minutes. Ultimately,
            the NLP routing and conversational framework established here became
            the foundation for Autodesk&rsquo;s enterprise virtual assistant.
          </p>
        </div>
      </section>

      {/* Back to Index */}
      <div className="mt-16">
        <BackToIndex />
      </div>
    </div>
  );
}
