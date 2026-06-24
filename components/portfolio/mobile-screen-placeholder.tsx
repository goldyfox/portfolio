const frameClassName =
  "relative flex shrink-0 flex-col overflow-hidden bg-gray-50 shadow-[0_20px_40px_rgba(19,19,236,0.05)]";

export function MobileScreenPlaceholder({
  placeholder = "[Screen placeholder]",
  label,
  labelInside = false,
  fillHeight = false,
  src,
  alt = "",
  bakedShadow = false,
  imageScale = 1,
}: {
  placeholder?: string;
  label?: string;
  labelInside?: boolean;
  fillHeight?: boolean;
  src?: string;
  alt?: string;
  bakedShadow?: boolean;
  imageScale?: number;
}) {
  const heightClass = fillHeight
    ? "h-full"
    : "h-[min(812px,75vh)] min-h-[480px]";

  if (src) {
    const imgStyle: React.CSSProperties = {};
    if (!bakedShadow) {
      imgStyle.filter = "drop-shadow(0 0 7.5px rgba(0, 0, 0, 0.25))";
    }
    if (imageScale !== 1) {
      imgStyle.transform = `scale(${imageScale})`;
    }
    return (
      <div className={`relative flex shrink-0 flex-col ${heightClass}`}>
        {labelInside && label ? (
          <p className="absolute top-0 left-0 right-0 z-10 border-b border-ethos-blue/10 bg-ethos-cream px-4 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-gray-500">
            {label}
          </p>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-auto" style={imgStyle} />
      </div>
    );
  }

  return (
    <div
      className={`${frameClassName} border border-ethos-blue/10 ${heightClass}`}
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
