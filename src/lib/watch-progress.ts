/**
 * Watch-progress tracking for members-area videos. Pure, browser-safe module.
 *
 * We count the seconds of a video that were actually PLAYED (not skipped by seeking forward).
 * A module can only be marked complete once REQUIRED_WATCH of the video has been played.
 */

export const REQUIRED_WATCH = 0.9;
/** A jump bigger than this between two 1-second ticks counts as seeking (allows up to 2x speed). */
export const MAX_TICK_JUMP = 2.6;

export type Range = [number, number]; // [start, end) in whole seconds

/** Merge overlapping/adjacent ranges. */
export function normalize(ranges: Range[]): Range[] {
  const sorted = ranges
    .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b > a)
    .map(([a, b]) => [Math.max(0, Math.floor(a)), Math.ceil(b)] as Range)
    .sort((x, y) => x[0] - y[0]);
  const out: Range[] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else out.push([r[0], r[1]]);
  }
  return out;
}

/** Record playback from `prev` to `now` (seconds) if it looks like normal playback, not a seek. */
export function addTick(ranges: Range[], prev: number, now: number): Range[] {
  const delta = now - prev;
  if (!(delta > 0) || delta > MAX_TICK_JUMP) return ranges;
  return normalize([...ranges, [prev, now]]);
}

export function watchedSeconds(ranges: Range[], duration?: number): number {
  return normalize(ranges).reduce(
    (sum, [a, b]) => sum + Math.max(0, Math.min(b, duration ?? b) - a),
    0,
  );
}

export function watchedFraction(ranges: Range[], duration: number): number {
  if (!(duration > 0)) return 0;
  return Math.min(1, watchedSeconds(ranges, duration) / duration);
}

const key = (moduleId: string) => `cgm_watch_${moduleId}`;

export type StoredWatch = { ranges: Range[]; pos: number; duration: number };

export function loadWatch(moduleId: string): StoredWatch {
  try {
    const raw = localStorage.getItem(key(moduleId));
    if (raw) {
      const v = JSON.parse(raw);
      return {
        ranges: Array.isArray(v.ranges) ? normalize(v.ranges) : [],
        pos: Number(v.pos) || 0,
        duration: Number(v.duration) || 0,
      };
    }
  } catch {}
  return { ranges: [], pos: 0, duration: 0 };
}

export function saveWatch(moduleId: string, w: StoredWatch): void {
  try {
    localStorage.setItem(key(moduleId), JSON.stringify(w));
  } catch {}
}

/** YouTube video id from an embed / watch / youtu.be URL, or null. */
export function youTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}
