import { useEffect, useRef } from "react";
import { fbqTrackCustom } from "@/lib/fbpixel";

// VSL with view tracking.
// Sends Meta Pixel custom events (VSLPlay, VSL25, VSL50, VSL75, VSL100) and
// logs the same events to the `vsl_events` table so play rate, drop-off and
// watcher-vs-non-watcher opt-in rates can be reported.

type VslEvent = "page_view" | "play" | "25" | "50" | "75" | "100" | "optin";

const PIXEL_NAMES: Partial<Record<VslEvent, string>> = {
  play: "VSLPlay",
  "25": "VSL25",
  "50": "VSL50",
  "75": "VSL75",
  "100": "VSL100",
};

let maxPctWatched = 0;
const fired = new Set<VslEvent>();

function sessionId(): string {
  try {
    let id = sessionStorage.getItem("vsl_sid");
    if (!id) {
      id = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("vsl_sid", id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

export function logVsl(event: VslEvent, pct = maxPctWatched) {
  if (typeof window === "undefined") return;
  const pixelName = PIXEL_NAMES[event];
  if (pixelName) fbqTrackCustom(pixelName, { percent_watched: Math.round(pct) });
  void import("@/lib/vsl-events.functions")
    .then(({ logVslEvent }) =>
      logVslEvent({ data: { event, session_id: sessionId(), pct: Math.round(pct) } }),
    )
    .catch((err) => console.warn("[VSL] log failed", err));
}

/** Highest % of the VSL this visitor has watched (0 if never played). */
export function getVslMaxPct() {
  return Math.round(maxPctWatched);
}

export function VslPlayer({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!fired.has("page_view")) {
      fired.add("page_view");
      logVsl("page_view", 0);
    }
    const v = ref.current;
    if (!v) return;

    const once = (e: VslEvent) => {
      if (fired.has(e)) return;
      fired.add(e);
      logVsl(e);
    };
    const onPlay = () => once("play");
    const onTime = () => {
      if (!v.duration || !isFinite(v.duration)) return;
      const pct = (v.currentTime / v.duration) * 100;
      if (pct > maxPctWatched) maxPctWatched = pct;
      if (pct >= 25) once("25");
      if (pct >= 50) once("50");
      if (pct >= 75) once("75");
      if (pct >= 97) once("100");
    };
    const onEnded = () => {
      maxPctWatched = 100;
      once("100");
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
