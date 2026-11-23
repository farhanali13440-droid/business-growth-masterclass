import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2 } from "lucide-react";
import {
  VSL_POSTER,
  VSL_SRC,
  rememberUnlock,
  shouldUnlock,
  wasUnlockedBefore,
} from "@/lib/forced-vsl";

function track(event: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", event, params);
    }
  } catch {}
}

/**
 * Forced VSL player: no seek bar, forward-seeking blocked, autoplays muted with a
 * "click to listen" overlay that restarts the video with sound. Calls onUnlock
 * once the visitor has watched UNLOCK_AT_SECONDS (or straight away if they
 * already unlocked it on an earlier visit).
 */
export function ForcedVsl({ onUnlock, leadId }: { onUnlock: () => void; leadId?: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const maxWatched = useRef(0);
  const unlocked = useRef(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  function unlock() {
    if (unlocked.current) return;
    unlocked.current = true;
    rememberUnlock();
    track("VslUnlocked", { lead_id: leadId });
    onUnlock();
  }

  useEffect(() => {
    if (wasUnlockedBefore()) unlock();
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => setPaused(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onTimeUpdate() {
    const v = videoRef.current;
    if (!v) return;
    // Only count natural playback (no jumps forward).
    if (v.currentTime > maxWatched.current && v.currentTime - maxWatched.current < 1.5) {
      maxWatched.current = v.currentTime;
    }
    if (v.duration) setProgress(v.currentTime / v.duration);
    if (shouldUnlock(maxWatched.current)) unlock();
  }

  function onSeeking() {
    const v = videoRef.current;
    if (v && v.currentTime > maxWatched.current + 1) v.currentTime = maxWatched.current;
  }

  function startWithSound() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    maxWatched.current = 0;
    v.muted = false;
    setMuted(false);
    void v.play();
    setPaused(false);
    track("VslStartedWithSound", { lead_id: leadId });
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (muted) return startWithSound();
    if (v.paused) {
      void v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  }

  function fullscreen(e: React.MouseEvent) {
    e.stopPropagation();
    const v = videoRef.current as any;
    const w = wrapRef.current as any;
    if (document.fullscreenElement) return void document.exitFullscreen();
    if (w?.requestFullscreen) w.requestFullscreen();
    else if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen();
  }

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-slate-900/10 cursor-pointer select-none"
      style={{ aspectRatio: "16 / 9" }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={VSL_SRC}
        poster={VSL_POSTER}
        className="absolute inset-0 h-full w-full bg-white object-contain"
        playsInline
        autoPlay
        muted
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        onTimeUpdate={onTimeUpdate}
        onSeeking={onSeeking}
        onEnded={() => {
          unlock();
          setPaused(true);
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {muted && (
        <div className="absolute inset-0 grid place-items-center bg-slate-900/35">
          <div className="flex flex-col items-center gap-1.5 md:gap-3 rounded-2xl bg-white px-5 py-3.5 md:px-10 md:py-7 text-center shadow-2xl ring-4 ring-primary/30">
            <Volume2 className="size-8 md:size-14 text-primary animate-pulse" />
            <div className="text-base md:text-2xl font-black text-slate-900">
              Your video has started
            </div>
            <div className="rounded-full bg-primary px-4 py-1 text-xs md:text-lg font-bold text-white">Click here to listen</div>
          </div>
        </div>
      )}

      {!muted && paused && (
        <div className="absolute inset-0 grid place-items-center bg-slate-900/40">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/95 px-6 py-5 text-center shadow-xl">
            <Play className="size-10 md:size-12 text-primary" />
            <div className="text-sm md:text-lg font-black text-slate-900">
              Click to continue watching
            </div>
          </div>
        </div>
      )}

      {!muted && (
        <div className="absolute right-2 bottom-3 md:right-3 md:bottom-4 flex gap-2">
          <button
            type="button"
            aria-label={paused ? "Play" : "Pause"}
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="grid size-9 place-items-center rounded-full bg-slate-900/60 text-white hover:bg-slate-900/80"
          >
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
          <button
            type="button"
            aria-label="Full screen"
            onClick={fullscreen}
            className="grid size-9 place-items-center rounded-full bg-slate-900/60 text-white hover:bg-slate-900/80"
          >
            <Maximize className="size-4" />
          </button>
        </div>
      )}

      {/* Read-only progress bar (not clickable — no skipping) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-slate-900/15">
        <div className="h-full bg-primary" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
