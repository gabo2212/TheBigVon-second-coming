"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(true);

  async function playAudio() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = 0.28;

    try {
      await audio.play();
      setIsPlaying(true);
      setIsBlocked(false);
    } catch {
      setIsBlocked(true);
    }
  }

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      await playAudio();
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }

  useEffect(() => {
    void playAudio();

    const unlock = () => {
      void playAudio();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} loop preload="auto" src="/assets/demondash-bg.mp3" />
      <button
        type="button"
        onClick={toggleAudio}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-warning-400 bg-black/85 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-warning-100 shadow-[0_0_24px_rgba(120,0,0,0.34)] backdrop-blur transition hover:border-warning-300 hover:text-warning-200"
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
      >
        {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        {isPlaying ? "Ritual Audio" : isBlocked ? "Enable Audio" : "Audio Off"}
      </button>
    </>
  );
}
