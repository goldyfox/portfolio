"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function ScrollVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(formatTime(video.currentTime));
    };
    const handleLoaded = () => {
      setDuration(formatTime(video.duration));
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoaded);

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);

  const handlePlay = useCallback(() => {
    videoRef.current?.play();
  }, []);

  const handlePause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const handleReplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
  }, []);

  const handleFullscreen = useCallback(() => {
    videoRef.current?.requestFullscreen();
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  }, []);

  return (
    <div className="relative group border border-[#1313ec]/20 overflow-hidden shadow-[0_20px_40px_rgba(19,19,236,0.05)]">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        className={className}
        style={{ clipPath: "inset(0 2px 0 0)" }}
      />
      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 bg-[#fdfbf7]/80 backdrop-blur-xl border border-[#1313ec]/20 p-4 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center gap-6">
          <button
            onClick={handlePlay}
            className="text-[#1313ec] hover:text-[#01006e] transition-colors flex items-center justify-center p-2 rounded-none border border-transparent hover:border-[#1313ec]/30"
            aria-label="Play"
            title="Play"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "28px" }}
            >
              play_arrow
            </span>
          </button>
          <button
            onClick={handlePause}
            className="text-[#1313ec] hover:text-[#01006e] transition-colors flex items-center justify-center p-2 rounded-none border border-transparent hover:border-[#1313ec]/30"
            aria-label="Pause"
            title="Pause"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "24px" }}
            >
              pause
            </span>
          </button>
          <button
            onClick={handleReplay}
            className="text-[#1313ec] hover:text-[#01006e] transition-colors flex items-center justify-center p-2 rounded-none border border-transparent hover:border-[#1313ec]/30"
            aria-label="Replay"
            title="Replay"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "24px" }}
            >
              replay
            </span>
          </button>
        </div>

        {/* Timeline */}
        <div
          className="flex-1 mx-8 relative flex items-center cursor-pointer h-8 group/timeline"
          onClick={handleSeek}
        >
          <div className="w-full h-px bg-[#c6c4da]/30 absolute top-1/2 -translate-y-1/2" />
          <div
            className="h-px bg-[#1313ec] absolute top-1/2 -translate-y-1/2"
            style={{ width: `${progress}%` }}
          />
          <div
            className="w-2 h-2 rounded-full bg-[#1313ec] absolute top-1/2 -translate-y-1/2 -translate-x-1/2 scale-0 group-hover/timeline:scale-100 transition-transform"
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-6">
          <span className="font-sans uppercase text-[10px] tracking-[0.1em] text-gray-500 whitespace-nowrap w-24 text-right">
            {currentTime} / {duration}
          </span>
          <button
            onClick={handleFullscreen}
            className="text-[#1313ec] hover:text-[#01006e] transition-colors"
            aria-label="Fullscreen"
            title="Fullscreen"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              fullscreen
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
