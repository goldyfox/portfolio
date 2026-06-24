import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/portfolio/back-button";
import { ScrollSpyTrigger } from "@/components/portfolio/scroll-spy-trigger";
import { VisualPlaceholder } from "@/components/portfolio/genai-case/shared";
import { briefs } from "@/lib/content/briefs";

const brief = briefs.find((b) => b.id === "genai-conversations")!;

export const metadata: Metadata = {
  title: `Lisa Aufox | ${brief.title} (Layout 1)`,
};

const LEDGER = [
  {
    id: "upb",
    label: "UPB program score",
    value: "62 → 85",
    note: "Flow 75 graduated internal usability audit",
  },
  {
    id: "completion",
    label: "Mandated task completion",
    value: "64% → 100%",
    note: "Ads Manager retest — all participants finished",
  },
  {
    id: "ctr",
    label: "GenAI icebreaker CTR",
    value: "23.7%",
    note: "vs 13.6% default · 17.6% edited template",
  },
  {
    id: "adoption",
    label: "GenAI default adoption",
    value: "95%",
    note: "Advantage+ experiment cohort · +0.03% iCTX · 200% revenue goal",
  },
] as const;

const LAYERS = [
  {
    tag: "Layer 01 / Context",
    title: "Ad & asset ingestion",
    body: "Pull creative, page, and campaign context into post-click so icebreakers aren’t written in a vacuum.",
  },
  {
    tag: "Layer 02 / Routing",
    title: "GenAI vs non-GenAI paths",
    body: "Same Chat Builder choreography; switch the engine behind the card by market readiness — no split product.",
  },
  {
    tag: "Layer 03 / Synthesis",
    title: "Recommended template + icebreakers",
    body: "Default to dynamic, in-context copy. Advertiser confirms or edits — creator becomes reviewer.",
  },
  {
    tag: "Layer 04 / Audit",
    title: "UPB validation task",
    body: "Score confirming AI icebreakers as relevant to the ad — not hand-customizing every field.",
  },
] as const;

const SIDE_NAV = [
  { href: "#context", label: "Context" },
  { href: "#solution", label: "Solution" },
  { href: "#impact", label: "Impact" },
  { href: "#metrics", label: "Metrics" },
] as const;

/** Creator-to-reviewer layout (Flow 75). Site chrome unchanged — content only. */
export default function GenAi1() {
  return (
    <div className="relative flex flex-1 flex-col pb-16 min-[975px]:pb-24 min-[768px]:pr-14">
      <BackButton />

      <CaseSideNav />

      <div className="relative">
        <div
          className="pointer-events-none absolute -top-20 -left-40 h-[600px] w-[600px] rounded-full border border-ethos-blue opacity-10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full border border-ethos-blue opacity-10"
          aria-hidden
        />

        {/* Hero */}
        <section
          id="context"
          className="mb-24 min-[768px]:mb-40 grid grid-cols-1 min-[768px]:grid-cols-12 gap-y-12 items-start scroll-mt-28"
        >
          <div className="min-[768px]:col-span-9">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ethos-blue mb-6">
              {brief.company}, {brief.year} · Flow 75 L1
            </p>
            <ScrollSpyTrigger title={brief.title} />
            <h1 className="font-serif italic leading-none tracking-tighter text-gray-900 text-[clamp(2.75rem,10vw,8.75rem)] mb-10">
              The{" "}
              <span className="text-ethos-blue">creator-to-reviewer</span>{" "}
              shift.
            </h1>
            <div className="border-t border-ethos-blue w-24 mb-8" />
            <p className="font-serif italic text-xl min-[768px]:text-3xl max-w-2xl leading-relaxed text-gray-600">
              {brief.subtitle}
            </p>
          </div>

          <aside className="hidden min-[768px]:block min-[768px]:col-span-3 min-[768px]:sticky min-[768px]:top-32 h-fit pl-8">
            <HeroMeta
              label="Program"
              value="Flow 75 — Message Template → Chat Builder"
            />
            <HeroMeta
              label="Surface"
              value="CTM post-click · Ads Manager L1"
            />
            <HeroMeta label="Scale" value="$3B+ CTM H1 (leadership deck)" />
            <HeroMeta label="Alignment" value="84% on Start conversations template · 6 teams" />
          </aside>

          <div className="min-[768px]:col-span-5 min-[768px]:col-start-1 min-[768px]:mt-16 bg-ethos-blue p-8 min-[768px]:p-12 text-ethos-cream flex flex-col justify-between aspect-square max-w-lg relative z-10">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em]">
              Product data — legacy card
            </span>
            <div>
              <p className="font-serif italic text-[clamp(4rem,12vw,6rem)] leading-none">
                88%
              </p>
              <p className="font-serif text-lg min-[768px]:text-xl leading-snug mt-4 max-w-[28ch]">
                of advertisers ran default message templates — only{" "}
                <strong className="font-semibold">12%</strong> customized.
                Weak icebreakers, worse chats, worse outcomes.
              </p>
            </div>
            <span
              className="absolute -right-2 -bottom-2 flex h-12 w-12 items-center justify-center bg-ethos-cream text-ethos-blue font-sans text-lg"
              aria-hidden
            >
              ↗
            </span>
          </div>
        </section>

        {/* Phase 01 */}
        <section className="mb-24 min-[768px]:mb-40">
          <div className="grid grid-cols-1 min-[768px]:grid-cols-12 gap-y-12">
            <div className="min-[768px]:col-span-4 min-[768px]:col-start-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue block mb-6">
                Phase 01 / The legacy bottleneck
              </span>
              <h2 className="font-serif italic text-3xl min-[768px]:text-4xl mb-8 leading-tight text-gray-900">
                The Message Template card was an operational failure dressed up
                as a shipped feature.
              </h2>
              <p className="font-serif text-lg text-gray-600 leading-relaxed">
                {brief.bet} Flat IA, almost entirely manual setup, and almost
                no guidance — decision paralysis, abandoned tasks, misconfigured
                ads. Fixing quality wasn&apos;t, by itself, a revenue headline on
                a funnel the deck sized at{" "}
                <strong className="text-gray-900">$3B+</strong> first-half CTM
                scale.
              </p>
            </div>
            <div className="min-[768px]:col-span-6 min-[768px]:col-start-7 overflow-hidden">
              <VisualPlaceholder
                label="Message Template card — screenshot"
                caption="Fig 01. Before — flat IA, manual everything"
                aspectClass="aspect-[2395/1859] min-h-[220px] w-full grayscale hover:grayscale-0 transition-all duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>
        </section>

        {/* Phase 02 — Displacement */}
        <section
          id="solution"
          className="mb-24 min-[768px]:mb-40 -mx-6 min-[975px]:-mx-10 bg-gray-100 py-16 min-[768px]:py-32 px-6 min-[975px]:px-10 overflow-hidden scroll-mt-28"
        >
          <div className="max-w-7xl mx-auto relative">
            <h2
              className="font-serif italic text-5xl min-[768px]:text-8xl text-center mb-16 min-[768px]:mb-32 opacity-20 text-gray-900"
              aria-hidden
            >
              DISPLACEMENT
            </h2>
            <div className="relative min-h-[420px] min-[768px]:min-h-[600px] flex items-center justify-center">
              <div className="absolute left-0 top-0 w-full min-[768px]:w-1/2 p-6 min-[768px]:p-8 border border-ethos-blue/20 bg-ethos-cream opacity-40 -rotate-3 z-10">
                <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-4 block">
                  Legacy — Message Template
                </span>
                <div className="h-3 w-full bg-gray-900/10 mb-2" />
                <div className="h-3 w-5/6 bg-gray-900/10 mb-2" />
                <div className="h-48 min-[768px]:h-64 w-full bg-gray-900/5 flex items-center justify-center border border-ethos-blue/10">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    Manual · flat IA
                  </span>
                </div>
              </div>

              <div className="relative z-20 w-full min-[768px]:w-3/5 min-[768px]:ml-auto bg-ethos-cream border-2 border-ethos-blue p-8 min-[768px]:p-12 rotate-1 min-[768px]:rotate-2">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue font-bold">
                    Chat Builder — reviewer mode
                  </span>
                  <div className="flex gap-2" aria-hidden>
                    <div className="w-2 h-2 rounded-full bg-ethos-blue" />
                    <div className="w-2 h-2 rounded-full bg-ethos-blue/20" />
                  </div>
                </div>
                <h3 className="font-serif italic text-2xl min-[768px]:text-3xl mb-6 text-gray-900">
                  Confirm AI-generated icebreakers match your ad — edit what&apos;s
                  wrong, ship.
                </h3>
                <div className="space-y-4 mb-10">
                  <div className="p-4 bg-ethos-blue/5 border-l-2 border-ethos-blue">
                    <p className="font-serif italic text-gray-800">
                      Recommended template + GenAI icebreakers from your assets…
                    </p>
                  </div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-gray-500">
                    CTR in live traffic: GenAI{" "}
                    <strong className="text-gray-900">23.7%</strong> · edited{" "}
                    <strong className="text-gray-900">17.6%</strong> · default{" "}
                    <strong className="text-gray-900">13.6%</strong>
                  </p>
                </div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue border-b border-ethos-blue pb-2 inline-block">
                  {brief.move}
                </p>
              </div>
            </div>
            <p className="mt-16 max-w-xl mx-auto text-center font-serif text-xl italic text-gray-600">
              The reviewer doesn&apos;t build from blank. The reviewer validates,
              directs, and selects — the system generates the first draft.
            </p>
          </div>
        </section>

        {/* Phase 03 — Topology + Ledger */}
        <section
          id="impact"
          className="mb-20 scroll-mt-28 grid grid-cols-1 min-[768px]:grid-cols-12 gap-12 min-[768px]:gap-16"
        >
          <div className="min-[768px]:col-span-7" id="metrics">
            <div className="border-b border-ethos-blue pb-4 mb-12">
              <h2 className="font-sans text-[11px] uppercase tracking-[0.4em] text-ethos-blue">
                Shipped architecture
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-ethos-blue/20">
              {LAYERS.map((layer) => (
                <div
                  key={layer.tag}
                  className="bg-ethos-cream p-6 min-[768px]:p-8 aspect-square flex flex-col justify-between"
                >
                  <span className="font-sans text-[10px] text-ethos-blue uppercase tracking-[0.15em]">
                    {layer.tag}
                  </span>
                  <p className="font-serif italic text-xl text-gray-900">
                    {layer.title}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-tight text-gray-500 leading-snug">
                    {layer.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <VisualPlaceholder
                label="Chat Builder L1 — screenshot"
                caption="Fig 02. After — recommended template + GenAI path"
                aspectClass="aspect-[2397/1250] min-h-[180px] w-full"
              />
            </div>
          </div>

          <div className="min-[768px]:col-span-4 min-[768px]:col-start-9 min-[768px]:mt-0 mt-8">
            <h2 className="font-serif italic text-3xl min-[768px]:text-4xl mb-10 text-gray-900">
              Impact ledger
            </h2>
            <ul className="divide-y divide-ethos-blue/10 border-y border-ethos-blue/10">
              {LEDGER.map((row) => (
                <li
                  key={row.id}
                  className="py-6 flex justify-between items-start gap-4 px-2 hover:bg-ethos-blue/5 transition-colors"
                >
                  <div>
                    <span className="font-sans text-[10px] text-ethos-blue block uppercase tracking-[0.15em]">
                      {row.id.replace(/-/g, "_").toUpperCase()}
                    </span>
                    <span className="font-serif text-lg text-gray-800 block mt-1">
                      {row.label}
                    </span>
                    <span className="font-sans text-[10px] text-gray-500 mt-2 block leading-relaxed max-w-[22ch]">
                      {row.note}
                    </span>
                  </div>
                  <span className="font-serif italic text-2xl min-[768px]:text-3xl text-gray-900 tabular-nums shrink-0">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-10 font-serif text-[18px] leading-[1.6] text-gray-800">
              {brief.unlock}
            </p>
            <p className="mt-4 font-serif text-[16px] leading-[1.6] text-gray-600">
              {brief.constraint}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function CaseSideNav() {
  return (
    <aside
      className="fixed right-0 top-[7rem] z-30 hidden min-[768px]:flex h-[calc(100vh-7rem)] min-[975px]:top-[5.5rem] min-[975px]:h-[calc(100vh-5.5rem)] w-14 flex-col items-center justify-center gap-10 border-l border-ethos-blue/10 bg-ethos-cream/95 py-20"
      aria-label="Case study sections"
    >
      <nav className="flex flex-col gap-10 items-center">
        {SIDE_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="[writing-mode:vertical-rl] rotate-180 font-sans text-[11px] uppercase tracking-[0.1em] text-gray-500 hover:text-ethos-blue transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function HeroMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-8 last:mb-0">
      <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue block mb-2">
        {label}
      </span>
      <p className="font-serif italic text-lg text-gray-900 leading-snug">{value}</p>
    </div>
  );
}
