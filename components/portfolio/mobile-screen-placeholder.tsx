const frameClassName =
  "relative flex shrink-0 flex-col border border-ethos-blue/10 bg-gray-50 shadow-[0_20px_40px_rgba(19,19,236,0.05)]";

export function MobileScreenPlaceholder({
  placeholder = "[Screen placeholder]",
  label,
  labelInside = false,
  fillHeight = false,
}: {
  placeholder?: string;
  label?: string;
  labelInside?: boolean;
  fillHeight?: boolean;
}) {
  return (
    <div
      className={`${frameClassName} ${fillHeight ? "h-full" : "h-[min(812px,75vh)] min-h-[480px]"}`}
      style={{ aspectRatio: "9 / 16" }}
    >
      {labelInside && label ? (
        <p className="absolute top-0 left-0 right-0 z-10 border-b border-ethos-blue/10 bg-ethos-cream px-4 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500">
          {label}
        </p>
      ) : null}
      <div
        className={`flex flex-1 items-center justify-center p-4 ${labelInside ? "pt-14" : ""}`}
      >
        <p className="text-center font-sans text-[13px] italic text-gray-400">
          {placeholder}
        </p>
      </div>
    </div>
  );
}
