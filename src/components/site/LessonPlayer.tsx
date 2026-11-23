import { useEffect, useRef } from "react";
import {
  addTick,
  loadWatch,
  saveWatch,
  watchedFraction,
  youTubeId,
  type Range,
} from "@/lib/watch-progress";

/**
 * Members-area video player. For YouTube videos it uses the YouTube player API to count the
 * seconds actually watched (skipping ahead doesn't count) and reports the watched fraction.
 * Progress + last position are remembered on this device, so members resume where they left off.
 * Other video hosts fall back to a plain embed and report 1 (no watch lock).
 */

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<any> | null = null;
function loadYouTubeApi(): Promise<any> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return ytApiPromise;
}

export function LessonPlayer({
  moduleId,
  embedUrl,
  title,
  onProgress,
}: {
  moduleId: string;
  embedUrl: string;
  title: string;
  onProgress: (fraction: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;
  const videoId = youTubeId(embedUrl);

  useEffect(() => {
    if (!videoId) {
      progressRef.current(1);
      return;
    }
    let destroyed = false;
    let player: any = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    const stored = loadWatch(moduleId);
    let ranges: Range[] = stored.ranges;
    let duration = stored.duration;
    let last = -1;
    progressRef.current(watchedFraction(ranges, duration));

    const persist = (pos: number) => saveWatch(moduleId, { ranges, pos, duration });

    loadYouTubeApi().then((YT) => {
      if (destroyed || !hostRef.current) return;
      const mount = document.createElement("div");
      hostRef.current.innerHTML = "";
      hostRef.current.appendChild(mount);
      player = new YT.Player(mount, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start: Math.max(0, Math.floor(stored.pos - 3)),
        },
        events: {
          onReady: () => {
            const d = Number(player?.getDuration?.()) || 0;
            if (d > 0) duration = d;
            progressRef.current(watchedFraction(ranges, duration));
          },
        },
      });
      timer = setInterval(() => {
        if (!player?.getPlayerState) return;
        const playing = player.getPlayerState() === YT.PlayerState.PLAYING;
        const now = Number(player.getCurrentTime?.()) || 0;
        if (!duration) duration = Number(player.getDuration?.()) || 0;
        if (playing) {
          if (last >= 0) ranges = addTick(ranges, last, now);
          last = now;
          persist(now);
          progressRef.current(watchedFraction(ranges, duration));
        } else {
          last = -1;
        }
      }, 1000);
    });

    return () => {
      destroyed = true;
      if (timer) clearInterval(timer);
      try {
        player?.destroy?.();
      } catch {}
    };
  }, [moduleId, videoId]);

  if (!videoId) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
      />
    );
  }
  return <div ref={hostRef} className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full" />;
}
