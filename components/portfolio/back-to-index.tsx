import Link from "next/link";

export function BackToIndex() {
  return (
    <div className="flex justify-center">
      <Link
        href="/index"
        className="btn-back font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue border border-ethos-blue/30 px-6 py-3 hover:bg-ethos-blue hover:text-white transition-colors"
      >
        Back to Index
      </Link>
    </div>
  );
}
