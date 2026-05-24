"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className="mb-8 self-start font-sans text-[11px] uppercase tracking-[0.1em] text-ethos-blue transition-colors cursor-pointer text-left"
    >
      &larr; Back
    </button>
  );
}
