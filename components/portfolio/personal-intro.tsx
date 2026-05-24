export function PersonalIntro() {
  return (
    <section className="pt-[50px] pb-macro">
      <h1 className="sr-only">Lisa Aufox — Product Design Brief</h1>
      <p className="page-title min-[975px]:max-w-[75%]">
        I&rsquo;m a <span className="text-ethos-blue">product designer at Meta</span>{" "}who works on complex systems
        at&nbsp;scale.
      </p>
      <div className="mt-16 min-[768px]:mt-24 min-[768px]:grid min-[768px]:grid-cols-12 min-[768px]:gap-x-6">
        <div className="min-[768px]:col-start-8 min-[768px]:col-end-13 border-l border-ethos-blue pl-4">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">
            Status
          </p>
          <p className="font-serif text-[18px] leading-[1.6] text-gray-800">
            Currently generating $8.2B in messaging ads revenue. Focused on
            agentic AI, generative creation flows, and asynchronous communication.
            Previously Autodesk.
          </p>
        </div>
      </div>
    </section>
  );
}
