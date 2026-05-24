"use client";

import dynamic from "next/dynamic";

const AvaChat = dynamic(
  () =>
    import("@/components/ava-chat/AvaChat").then((mod) => ({
      default: mod.AvaChat,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[540px] animate-pulse rounded-[2px] bg-gray-100" />
    ),
  },
);

export function AvaChatEmbed() {
  return (
    <div>
      <div className="hidden min-[768px]:block">
        <AvaChat />
      </div>
      <div className="block min-[768px]:hidden">
        <div className="flex h-[300px] flex-col items-center justify-center gap-4 border border-gray-900/10 bg-gray-50 p-6">
          <p className="text-center font-sans text-[13px] uppercase tracking-[0.1em] text-gray-500">
            Interactive chat prototype
          </p>
          <p className="text-center font-serif text-[16px] text-gray-600">
            View on a larger screen to interact with the AVA demo.
          </p>
        </div>
      </div>
    </div>
  );
}
