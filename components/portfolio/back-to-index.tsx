import { SiteLink } from "@/components/site-link";

export function BackToIndex({ label = "Back to Index" }: { label?: string }) {
  return (
    <div className="flex justify-center">
      <SiteLink
        href="/index"
        className="btn-back font-sans text-[11px] uppercase tracking-[0.2em] text-ethos-blue border border-ethos-blue/30 px-6 py-3 hover:bg-ethos-blue hover:text-white transition-colors"
      >
        {label}
      </SiteLink>
    </div>
  );
}
